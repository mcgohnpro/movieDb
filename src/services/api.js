import ErrorNotFound from './errors'

export default class ApiMovieDb {
  constructor() {
    this.url = new URL('https://api.themoviedb.org')
    this.options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWUxMjNiNDkwOWVlYmRhN2FlYmJlMGVhNjhjNWM5MyIsInN1YiI6IjY2MTI5MDE0NjdkY2M5MDE0OTliNjQzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nQEtdCo0nxMYS490fHN4iwblr_9M6G43gltNDaGkLdA',
      },
    }
  }

  getMovieByKeyWord(word = 'spiderman', page = 1) {
    this.url.search = ''
    this.url.pathname = '/3/search/movie'
    this.url.searchParams.set('query', word)
    this.url.searchParams.set('include_adult', false)
    this.url.searchParams.set('language', 'en-US')
    this.url.searchParams.set('page', page)
    return fetch(this.url, this.options).then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new ErrorNotFound(`failed to receive data from server, status code ${response.status}`, response)
    })
  }
}
