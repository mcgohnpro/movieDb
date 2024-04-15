import ErrorNotFound from './errors/ErrorNotFound'
import ErrorCreateGuestSession from './errors/ErrorCreateGuestSession'

const AUTH =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWUxMjNiNDkwOWVlYmRhN2FlYmJlMGVhNjhjNWM5MyIsInN1YiI6IjY2MTI5MDE0NjdkY2M5MDE0OTliNjQzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nQEtdCo0nxMYS490fHN4iwblr_9M6G43gltNDaGkLdA'

// TODO Вынести авторизацию в отдельную переменную
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
    return {}
  }

  // TODO ошибка ErrorNotFound так и не вылетала
  getGenresList() {
    const url = `${this.APIurl}/3/genre/movie/list`
    return fetch(url, this.options)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw ErrorNotFound(`Failed to receive data from server, status code ${response.status}`, response)
      })
      .then((json) => {
        return json.genres.reduce((acc, item) => {
          acc[item.id] = item.name
          return acc
        }, {})
      })
  }

  // TODO Сделать параметры запроса через строку шаблонизации
  async getMovieByKeyWord(word = 'spiderman', page = 1) {
    const url = `${this.APIurl}/3/search/movie?query=${word}&include_adult=false&language=en-US&page=${page}`
    return fetch(url, this.options).then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new ErrorNotFound(`Failed to receive data from server, status code ${response.status}`, response)
    })
  }
}
