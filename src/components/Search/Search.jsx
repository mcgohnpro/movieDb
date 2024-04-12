import { Component } from 'react'
import { debounce } from 'lodash'

import styles from './Search.module.scss'

export default class Search extends Component {
  constructor(props) {
    super(props)
    const { searchInputChange } = this.props
    this.state = { value: '' }

    this.searchFilm = (e) => {
      this.setState(() => {
        return {
          value: e.target.value,
        }
      })
      debounce(() => {
        searchInputChange(e.target.value)
      }, 500)()
    }
  }

  render() {
    const { value } = this.state
    return (
      <input
        value={value}
        onChange={this.searchFilm}
        type="text"
        className={styles.searchFilm}
        placeholder="Type to search"
      />
    )
  }
}
