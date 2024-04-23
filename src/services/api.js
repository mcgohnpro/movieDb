import ErrorNotFound from './errors/ErrorNotFound'
import ErrorCreateGuestSession from './errors/ErrorCreateGuestSession'
import ErrorRateMovie from './errors/ErrorRateMovie'

const AUTH =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWUxMjNiNDkwOWVlYmRhN2FlYmJlMGVhNjhjNWM5MyIsInN1YiI6IjY2MTI5MDE0NjdkY2M5MDE0OTliNjQzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nQEtdCo0nxMYS490fHN4iwblr_9M6G43gltNDaGkLdA'

export const URL_POSTERS = 'https://image.tmdb.org/t/p/original'

export default class MovieDbApi {
  constructor() {
    this.APIurl = 'https://api.themoviedb.org'
    this.sessionId = localStorage.getItem('sessionId')
    this.options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: AUTH,
      },
    }
  }

  async validateSessionId() {
    if (!this.sessionId) {
      return false
    }
    const url = `${this.APIurl}/3/guest_session/${this.sessionId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`
    const response = await fetch(url, this.options)
    if (response.ok) {
      const json = await response.json()
      if (json.status_code === 3) {
        return false
      }
      return true
    }
    return false
  }

  async getSessionId() {
    if (await this.validateSessionId()) {
      return true
    }
    const response = await fetch(`${this.APIurl}/3/authentication/guest_session/new`, this.options)
    if (response.ok) {
      const json = await response.json()
      if (json.success) {
        this.sessionId = json.guest_session_id
        localStorage.setItem('sessionId', this.sessionId)
        return true
      }
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
    return { results: [], total_results: 1 }
  }

  async getGenresList() {
    const url = `${this.APIurl}/3/genre/movie/list`
    const response = await fetch(url, this.options)
    if (response.ok) {
      const json = await response.json()
      return json.genres.reduce((acc, item) => {
        acc[item.id] = item.name
        return acc
      }, {})
    }
    throw new ErrorNotFound(`Failed to receive Genres from server, status code ${response.status}`, response)
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
      return json.success
    }
    throw new ErrorRateMovie(`Error rate movie. Status code ${response.status}}`)
  }

  async removeRateMovie(movieId) {
    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: AUTH,
      },
    }
    const url = `${this.APIurl}/3/movie/${movieId}/rating?guest_session_id=${this.sessionId}`
    const response = await fetch(url, options)
    if (response.ok) {
      const json = await response.json()
      return json.success
    }
    throw new ErrorRateMovie(`Error rate movie. Status code ${response.status}}`)
  }
}
