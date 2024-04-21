import React from 'react'
import { List, Spin, Pagination, Row, Col } from 'antd'

import { GenresProvider } from '../../services/context'
import Search from '../Search'
import ApiMovieDb from '../../services/api'
import MovieCard from '../MovieCard/MovieCard'
import Menu from '../Menu'
import { getRatings } from '../../services/utils'
import Alert from '../Alert'

import styles from './App.module.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      ratedMovies: [],
      errors: {},
      isLoaded: false,
      isOnline: navigator.onLine,
      searchword: 'spiderman',
      page: 1,
      ratedMoviesPage: 1,
      genres: [],
      currentMenuPage: 'search',
      ratings: {},
    }

    this.isOnlineHendler = () => {
      this.setState({
        isOnline: navigator.onLine,
      })
    }

    this.api = new ApiMovieDb()
    window.addEventListener('online', this.isOnlineHendler)
    window.addEventListener('offline', this.isOnlineHendler)
    this.menuChangePageHandler = this.menuChangePageHandler.bind(this)

    this.searchInputChange = (word) => {
      this.setState(() => {
        return {
          searchword: word,
          page: 1,
        }
      })
      this.searchMovies(word)
    }

    this.paginationChangeHandler = (currentPage) => {
      const { searchword } = this.state
      this.setState(() => {
        return {
          page: currentPage,
        }
      })
      this.searchMovies(searchword, currentPage)
    }

    this.paginationChangeRatedMoviesHandler = (currentPage) => {
      this.setState({
        ratedMoviesPage: currentPage,
      })
      this.getRatedMovies(currentPage)
    }

    this.rateMovieHandler = async (id, rate) => {
      const { ratedMoviesPage } = this.state
      if (rate !== 0) {
        try {
          const result = await this.api.rateMovie(id, rate)
          if (result) {
            this.setState((prevState) => {
              const { ratings } = prevState
              return {
                ratings: { ...ratings, [id]: rate },
              }
            })
          }
        } catch (error) {
          const { name, message } = error
          this.setState(({ errors }) => {
            return {
              isLoaded: true,
              errors: { ...errors, [name]: message },
            }
          })
        }
        setTimeout(() => {
          this.getRatedMovies(ratedMoviesPage)
        }, 700)
      } else {
        try {
          const result = await this.api.removeRateMovie(id)
          if (result) {
            this.setState((prevState) => {
              const { ratings } = prevState
              const newRatings = { ...ratings }
              delete newRatings[id]
              return {
                ratings: newRatings,
              }
            })
          }
        } catch (error) {
          const { name, message } = error
          this.setState(({ errors }) => {
            return {
              isLoaded: true,
              errors: { ...errors, [name]: message },
            }
          })
        }

        setTimeout(() => {
          this.getRatedMovies(ratedMoviesPage)
        }, 700)
      }
    }
  }

  async componentDidMount() {
    try {
      await this.api.getSessionId()
      await Promise.all([
        this.searchMovies('spiderman'),
        this.getGenres(),
        this.api.getRatedMovies().then(({ results }) => {
          this.setState({
            ratings: getRatings(results),
          })
        }),
      ])
      this.setState({ isLoaded: true })
    } catch (error) {
      const { name, message } = error
      this.setState(({ errors }) => {
        return {
          isLoaded: true,
          errors: { ...errors, [name]: message },
        }
      })
    }
  }

  async getRatedMovies(page) {
    try {
      const { results, total_results: totalCountRatedMovies } = await this.api.getRatedMovies(page)
      this.setState({
        ratedMovies: results,
        totalCountRatedMovies,
      })
    } catch (error) {
      const { name, message } = error
      this.setState(({ errors }) => {
        return {
          isLoaded: true,
          errors: { ...errors, [name]: message },
        }
      })
    }
  }

  getGenres() {
    this.api
      .getGenresList()
      .then((genres) => {
        this.setState({
          genres,
        })
      })
      .catch(({ name, message }) => {
        this.setState(({ errors }) => {
          return {
            isLoaded: true,
            errors: { ...errors, [name]: message },
          }
        })
      })
  }

  menuChangePageHandler(page) {
    if (page.key === 'rated') {
      this.setState({ isLoaded: false })
      this.getRatedMovies()
        .then(() => {
          this.setState({ isLoaded: true })
        })
        .catch(({ name, message }) => {
          this.setState(({ errors }) => {
            return {
              isLoaded: true,
              errors: { ...errors, [name]: message },
            }
          })
        })
    }

    this.setState({
      currentMenuPage: page.key,
    })
  }

  searchMovies(word, currentPage) {
    this.setState({
      isLoaded: false,
    })
    this.api
      .getMovieByKeyWord(word, currentPage)
      .then(({ results, page = 1, total_results: totalCountMovies }) => {
        this.setState({
          movies: results,
          page,
          totalCountMovies,
          isLoaded: true,
        })
      })
      .catch(({ name, message }) => {
        this.setState(({ errors }) => {
          return {
            isLoaded: true,
            errors: { ...errors, [name]: message },
          }
        })
      })
  }

  render() {
    const {
      movies,
      ratedMovies,
      isLoaded,
      errors,
      isOnline,
      page,
      ratedMoviesPage,
      totalCountMovies,
      totalCountRatedMovies,
      genres,
      currentMenuPage,
      ratings,
    } = this.state

    return (
      <GenresProvider value={genres}>
        <div className={styles.wrapper}>
          <Alert errors={errors} isOnline={isOnline} />
          <Menu menuChangePageHandler={this.menuChangePageHandler} currentMenuPage={currentMenuPage} />
          <Search searchInputChange={this.searchInputChange} currentMenuPage={currentMenuPage} />
          <Spin spinning={!isLoaded}>
            <List
              grid={{ gutter: [32, 16], xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
              dataSource={currentMenuPage === 'search' ? movies : ratedMovies}
              renderItem={(movie) => (
                <List.Item key={movie.id}>
                  <MovieCard movie={movie} rateMovieHandler={this.rateMovieHandler} ratings={ratings} />
                </List.Item>
              )}
            />
          </Spin>

          <Row justify="center">
            <Col>
              <Pagination
                disabled={!movies.length}
                onChange={
                  currentMenuPage === 'search' ? this.paginationChangeHandler : this.paginationChangeRatedMoviesHandler
                }
                defaultCurrent={currentMenuPage === 'search' ? page : ratedMoviesPage}
                total={currentMenuPage === 'search' ? totalCountMovies : totalCountRatedMovies}
                showSizeChanger={false}
                pageSize={20}
              />
            </Col>
          </Row>
        </div>
      </GenresProvider>
    )
  }
}
