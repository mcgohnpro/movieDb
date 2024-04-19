/* eslint-disable no-console */
import ErrorNotFound from './errors/ErrorNotFound'
import ErrorCreateGuestSession from './errors/ErrorCreateGuestSession'
import ErrorRateMovie from './errors/ErrorRateMovie'

const AUTH =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWUxMjNiNDkwOWVlYmRhN2FlYmJlMGVhNjhjNWM5MyIsInN1YiI6IjY2MTI5MDE0NjdkY2M5MDE0OTliNjQzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nQEtdCo0nxMYS490fHN4iwblr_9M6G43gltNDaGkLdA'

export default class async {
  constructor() {
    this.APIurl = 'https://api.themoviedb.org'
    this.sessionId = sessionStorage.getItem('sessionId')
    this.options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: AUTH,
      },
    }
  }

  async getSessionId() {
    if (this.sessionId) {
      return this.sessionId
    }
    const response = await fetch(`${this.APIurl}/3/authentication/guest_session/new`, this.options)
    const json = await response.json()
    if (json.success) {
      this.sessionId = json.guest_session_id
      sessionStorage.setItem('sessionId', this.sessionId)
      return this.sessionId
    }
    throw new ErrorCreateGuestSession('Ooops, error to create guest session')
  }

  async getRatedMovies(page = 1) {
    const url = `${this.APIurl}/3/guest_session/${this.sessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`
    const response = await fetch(url, this.options)
    if (response.ok) {
      const ratedFilms = await response.json()
      return ratedFilms
    }
    return []
  }

  async getGenresList() {
    const url = `${this.APIurl}/3/genre/movie/list`
    const response = await fetch(url, this.options)
    if (!response.ok) {
      throw new ErrorNotFound(`Failed to receive data from server, status code ${response.status}`, response)
    }
    const json = await response.json()
    return json.genres.reduce((acc, item) => {
      acc[item.id] = item.name
      return acc
    }, {})
  }

  async getMovieByKeyWord(word = 'spiderman', page = 1) {
    const url = `${this.APIurl}/3/search/movie?query=${word}&include_adult=false&language=en-US&page=${page}`
    const response = await fetch(url, this.options)
    if (response.ok) {
      const json = await response.json()
      return json
    }
    throw new ErrorNotFound(`Failed to receive data from server, status code ${response.status}`, response)
  }

  async rateMovie(movieId, rate) {
    console.log(`сработал rateMovie, movieId${movieId}, rate ${rate}`)
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: AUTH,
      },
      body: `{"value":${rate}}`,
    }

    const url = `${this.APIurl}/3/movie/${movieId}/rating?guest_session_id=${this.sessionId}`
    const response = await fetch(url, options)
    if (response.ok) {
      const json = await response.json()
      console.log('json response', json)
      return json
    }
    throw new ErrorRateMovie(`Error rate movie. Status code ${response.status}}`)
  }
}
