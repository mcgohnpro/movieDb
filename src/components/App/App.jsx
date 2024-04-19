/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React from 'react'
import { List, Spin, Pagination, Row, Col, Menu } from 'antd'

import { GenresProvider } from '../../services/context'
import getId from '../../services/getId'
import AlertMessage from '../Alert'
import Search from '../Search'
import ApiMovieDb from '../../services/api'
import FilmCard from '../FilmCard'

import styles from './App.module.scss'
// TODO Привести к одному виду названия Films и Movies везде!
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      films: [],
      ratedFilms: [],
      errors: {},
      isLoaded: false,
      isOnline: navigator.onLine,
      searchword: 'spiderman',
      page: 1,
      ratedFilmsPage: 1,
      genres: [],
      currentMenuPage: 'search',
    }

    // TODO переработать данный код, видимо isOnline и так держит актуальное состояние сети
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
      this.searchFilms(word)
    }

    this.paginationChangeHandler = (currentPage) => {
      const { searchword } = this.state
      this.setState(() => {
        return {
          page: currentPage,
        }
      })
      this.searchFilms(searchword, currentPage)
    }

    this.rateMovieHandler = (id, rate) => {
      this.api.rateMovie(id, rate)
    }

    // this.rateMovieHandler = (id, rate) => {
    //   this.api.rateMovie(id, rate).then(() => {
    //     this.api.getRatedMovies().then((ratedFilms) => {
    //       console.log('rated films ', ratedFilms)
    //       this.setState(() => {
    //         return {
    //           ratedFilms: ratedFilms.results,
    //         }
    //       })
    //     })
    //   })
    // }
  }

  componentDidMount() {
    console.log('mount')
    this.createSessionId()
    this.searchFilms('spiderman')
    this.getGenres()
    this.getRatedMovies()
  }

  componentDidUpdate() {
    console.log('update')
  }

  // TODO проверить catch
  getRatedMovies() {
    this.api
      .getRatedMovies()
      .then(({ results }) => {
        this.setState({
          ratedFilms: results,
        })
      })
      .catch()
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
    this.getRatedMovies()
    this.setState({
      currentMenuPage: page.key,
    })
  }

  createSessionId() {
    this.api
      .getSessionId()
      .then((id) => {
        this.setState({
          sessionId: id,
        })
      })
      .catch(({ name, message }) => {
        this.setState(({ errors }) => {
          return {
            errors: { ...errors, [name]: message },
          }
        })
      })
  }

  searchFilms(word, currentPage) {
    this.setState({
      isLoaded: false,
    })
    this.api
      .getMovieByKeyWord(word, currentPage)
      .then(({ results, page = 1, total_pages: totalPages, total_results: totalResults }) => {
        this.setState({
          films: results,
          page,
          totalPages,
          totalResults,
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
    const { films, ratedFilms, isLoaded, errors, isOnline, totalPages, page, totalResults, genres, currentMenuPage } =
      this.state
    // TODO перенести всё, что связано с ошибками в компонент, передать ошибки пропсами, в том числе и плозое соеднинение
    const alert = Object.keys(errors).length
      ? Object.keys(errors).map((name) => <AlertMessage key={getId()} type="warning" error={errors[name]} />)
      : null
    const badConnection = !isOnline ? <AlertMessage type="error" error="There is no network connectivity" /> : null

    const search = currentMenuPage === 'search' ? <Search searchInputChange={this.searchInputChange} /> : null

    const items = [
      {
        label: 'Search',
        key: 'search',
      },
      {
        label: 'Rated',
        key: 'rated',
      },
    ]
    return (
      <GenresProvider value={genres}>
        <div className={styles.wrapper}>
          {badConnection}
          {alert}
          <Menu
            className={styles['menu-page']}
            onClick={this.menuChangePageHandler}
            selectedKeys={[currentMenuPage]}
            mode="horizontal"
            items={items}
          />
          {search}
          <Spin spinning={!isLoaded}>
            <List
              grid={{ gutter: [32, 16], xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
              dataSource={currentMenuPage === 'search' ? films : ratedFilms}
              renderItem={(film) => (
                <List.Item>
                  <FilmCard film={film} rateMovieHandler={this.rateMovieHandler} />
                </List.Item>
              )}
            />
          </Spin>

          <Row justify="center">
            <Col>
              <Pagination
                disabled={!films.length}
                onChange={this.paginationChangeHandler}
                defaultCurrent={page}
                total={totalResults}
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
