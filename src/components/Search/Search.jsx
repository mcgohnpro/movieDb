/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/require-render-return */
/* eslint-disable no-unused-vars */
import React from 'react'
import { debounce } from 'lodash'

import './Search.scss'

export default class Search extends React.Component {
  constructor(props) {
    super(props)
    const { searchInputChange } = this.props
    this.state = { value: '' }
    this.searchFilm = debounce((e) => {
      this.setState({
        value: e.target.value,
      })
      searchInputChange(e.target.value)
    }, 500)
  }

  render() {
    const { value } = this.props
    return (
      <input
        value={value}
        onChange={this.searchFilm}
        type="text"
        className="search-film search-film--margin"
        placeholder="Type to search"
      />
    )
  }
}
