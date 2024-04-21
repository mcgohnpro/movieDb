import { Component } from 'react'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

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
      this.debounceSearchInputChange(e.target.value)
    }

    this.debounceSearchInputChange = debounce((value) => {
      searchInputChange(value)
    }, 600)
  }

  render() {
    const { value } = this.state
    const { currentMenuPage } = this.props
    if (currentMenuPage === 'rated') return null
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

Search.defaultProps = {
  searchInputChange: () => {},
  currentMenuPage: 'search',
}

Search.propTypes = {
  searchInputChange: PropTypes.func,
  currentMenuPage: PropTypes.oneOf(['search', 'rated']),
}
