import { Component } from 'react'
import { Rate, Tag, Typography } from 'antd'
import { format } from 'date-fns'

import { GenresConsumer } from '../../services/context'
import Poster from '../Poster'
import { trimStr, colorizeVote } from '../../services/utils'

import AntdStyleSettings from './AntdStyleSettings'
import styles from './MovieCard.module.scss'

const { Paragraph } = Typography

export default class MovieCard extends Component {
  constructor(props) {
    super(props)
    const { ratings } = props
    const { id } = props.movie

    this.state = {
      rating: ratings[id],
    }
  }

  componentDidUpdate(prevProps) {
    const { ratings, movie } = this.props
    const { id } = movie
    if (ratings !== prevProps.ratings) {
      this.setState({
        rating: ratings[id],
      })
    }
  }

  render() {
    const { movie, rateMovieHandler } = this.props
    const { rating } = this.state
    const {
      title,
      release_date: releaseDate,
      overview,
      id,
      poster_path: posterPath,
      vote_average: voteAverage,
      genre_ids: genreIds,
    } = movie
    return (
      <div className={styles['movie-card']}>
        <AntdStyleSettings>
          <Poster className={styles.poster} posterPath={posterPath} title={title} />
          {/* <div className={styles.description}> */}
          <div className={styles['title-wrapper']}>
            <Paragraph style={{ marginBottom: 7 }} className={styles.title}>
              {trimStr(title, 45)}
            </Paragraph>
            <div style={{ borderColor: colorizeVote(voteAverage) }} className={styles['average-vote']}>
              {voteAverage ? voteAverage.toFixed(1) : 0}
            </div>
          </div>
          <Paragraph style={{ marginBottom: 7 }} className={styles.date}>
            {releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : null}
          </Paragraph>
          <GenresConsumer>
            {(genres) => {
              return (
                <ul className={styles['genres-wrapper']}>
                  {genreIds.map((idGenres) => {
                    return (
                      <li key={idGenres}>
                        <Tag>{genres[idGenres]}</Tag>
                      </li>
                    )
                  })}
                </ul>
              )
            }}
          </GenresConsumer>

          <Paragraph className={styles.overview} style={{ marginBottom: 7 }}>
            {trimStr(overview, 150)}
          </Paragraph>
          <Rate
            className={styles.stars}
            onChange={(rate) => {
              rateMovieHandler(id, rate)
            }}
            value={rating}
            allowHalf
            count={10}
          />
          {/* </div> */}
        </AntdStyleSettings>
      </div>
    )
  }
}
