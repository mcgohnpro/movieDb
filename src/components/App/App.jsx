/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React from 'react'
import { List, Spin, Pagination, Row, Col } from 'antd'

import { GenresProvider } from '../../services/context'
import AlertMessage from '../Alert'
import Search from '../Search'
import ApiMovieDb from '../../services/api'
import FilmCard from '../FilmCard'

import './App.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      films: [],
      error: null,
      isLoaded: false,
      isOnline: navigator.onLine,
      searchword: 'spiderman',
      page: 1,
      genres: [],
    }
    this.isOnlineHendler = () => {
      this.setState({
        isOnline: navigator.onLine,
      })
    }
    this.api = new ApiMovieDb()
    window.addEventListener('online', this.isOnlineHendler)
    window.addEventListener('offline', this.isOnlineHendler)
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
  }

  componentDidMount() {
    this.searchFilms('spiderman')
    this.getGenres()
  }

  getGenres() {
    this.api
      .getGenresList()
      .then((genres) => {
        this.setState({
          genres,
        })
      })
      .catch(({ message }) => {
        this.setState({
          isLoaded: true,
          error: message,
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
      .catch(({ message }) => {
        this.setState({
          isLoaded: true,
          error: message,
        })
      })
  }

  render() {
    const { films, isLoaded, error, isOnline, totalPages, page, totalResults, genres } = this.state
    const alert = error ? <AlertMessage type="warning" error={error} /> : null
    const badConnection = !isOnline ? <AlertMessage type="error" error="There is no network connectivity" /> : null
    return (
      <GenresProvider value={genres}>
        <div className="wrapper">
          {badConnection}
          {alert}
          <Search searchInputChange={this.searchInputChange} />
          <Spin spinning={!isLoaded}>
            <List
              grid={{ gutter: [32, 16], xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
              dataSource={films}
              renderItem={(film) => (
                <List.Item>
                  <FilmCard film={film} />
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
