/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React from 'react'
import { List } from 'antd'

import FilmCard from '../FilmCard'

import './App.scss'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWUxMjNiNDkwOWVlYmRhN2FlYmJlMGVhNjhjNWM5MyIsInN1YiI6IjY2MTI5MDE0NjdkY2M5MDE0OTliNjQzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nQEtdCo0nxMYS490fHN4iwblr_9M6G43gltNDaGkLdA',
  },
}

function getMoviesByKeyWord(word = 'return') {
  const url = new URL('https://api.themoviedb.org/3/search/movie')
  url.searchParams.set('query', word)
  url.searchParams.set('include_adult', false)
  url.searchParams.set('language', 'en-US')
  return fetch(url, options)
    .then((response) => response.json())
    .catch((err) => err)
}
// заготовка для получения жанров, скорее всего получение жанров надо буудет переместить в другое место
// функция преобразовывает полученыый массив объектов в объект {id: жанр, id: жанр}
// возвращает ппромис
function getGenresList() {
  const url = new URL('https://api.themoviedb.org/3/genre/movie/list')
  url.searchParams.set('language', 'en')
  return fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      return new Promise((resolve, reject) => {
        const res = data.genres.reduce((acc, item) => {
          acc[item.id] = item.name
          return acc
        }, {})

        resolve(res)
      })
    })
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      films: [],
      error: null,
      isLoaded: false,
    }
  }

  componentDidMount() {
    getMoviesByKeyWord('funny').then(
      (response) => {
        this.setState({
          films: response.results,
          page: response.page,
          total_pages: response.total_pages,
          total_results: response.total_results,
          isLoaded: true,
        })
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        })
      }
    )
  }

  render() {
    const { films } = this.state
    return (
      <div className="wrapper">
        <List
          grid={{ gutter: [32, 16], xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          dataSource={films}
          renderItem={(film) => (
            <List.Item>
              <FilmCard film={film} />
            </List.Item>
          )}
        />
      </div>
    )
  }
}
