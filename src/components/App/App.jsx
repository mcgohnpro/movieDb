/* eslint-disable react/no-unused-state */
import React from 'react'
import { List, Spin } from 'antd'

import AlertMessage from '../Alert'
import ApiMovieDb from '../../services/api'
import FilmCard from '../FilmCard'

import './App.scss'

// заготовка для получения жанров, скорее всего получение жанров надо буудет переместить в другое место
// функция преобразовывает полученыый массив объектов в объект {id: жанр, id: жанр}
// возвращает ппромис
// function getGenresList() {
//   const url = new URL('https://api.themoviedb.org/3/genre/movie/list')
//   url.searchParams.set('language', 'en')
//   return fetch(url, options)
//     .then((response) => response.json())
//     .then((data) => {
//       return new Promise((resolve, reject) => {
//         const res = data.genres.reduce((acc, item) => {
//           acc[item.id] = item.name
//           return acc
//         }, {})
//         resolve(res)
//       })
//     })
// }

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      films: [],
      error: null,
      isLoaded: false,
      isOnline: navigator.onLine,
    }
    this.isOnlineHendler = () => {
      this.setState({
        isOnline: navigator.onLine,
      })
    }
    this.api = new ApiMovieDb()
    window.addEventListener('online', this.isOnlineHendler)
    window.addEventListener('offline', this.isOnlineHendler)
  }

  componentDidMount() {
    this.api
      .getMovieByKeyWord('spiderman')
      .then(({ results, page, total_pages: totalPages, total_results: totalResults }) => {
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
    const { films, isLoaded, error, isOnline } = this.state
    const alert = error ? <AlertMessage type="warning" error={error} /> : null
    const badConnection = !isOnline ? <AlertMessage type="error" error="There is no network connectivity" /> : null
    return (
      <div className="wrapper">
        {badConnection}
        {alert}
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
      </div>
    )
  }
}
