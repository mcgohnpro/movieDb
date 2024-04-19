/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { Rate, Tag, ConfigProvider, Typography } from 'antd'
import { format } from 'date-fns'

import { GenresConsumer } from '../../services/context'
import Poster from '../Poster'
import { roundToNearestHalf, trimStr } from '../../services/utils'
import ErrorRateMovie from '../../services/errors/ErrorRateMovie'

import styles from './FilmCard.module.scss'

const { Paragraph } = Typography

export default function FilmCard(props) {
  const { film, rateMovieHandler } = props
  // TODO убрать неиспользуемые стейты
  const {
    title,
    release_date: releaseDate,
    overview,
    id,
    poster_path: posterPath,
    vote_average: voteAverage,
    genre_ids: genreIds,
  } = film

  return (
    <div className={styles['film-card']}>
      <Poster posterPath={posterPath} title={title} />
      <div className={styles.description}>
        <div className={styles['title-wrapper']}>
          <Paragraph style={{ marginBottom: 7 }} className={styles.title}>
            {title}
          </Paragraph>
          <div className={styles['average-vote']}>{voteAverage ? voteAverage.toFixed(1) : 0}</div>
        </div>
        {/* TODO попробовать убрать inline стили в класс */}
        <Paragraph style={{ marginBottom: 7 }} className={styles.date}>
          {releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : null}
        </Paragraph>
        {/* TODO надо вынести ConfigProvider его на самый верх */}
        <ConfigProvider
          theme={{
            components: {
              Tag: {
                defaultColor: 'rgba(0,0,0,0.65)',
              },
            },
          }}
        >
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
        </ConfigProvider>
        <Paragraph className={styles.overview} style={{ marginBottom: 7 }}>
          {trimStr(overview, 150)}
        </Paragraph>
        <ConfigProvider
          theme={{
            token: {
              Rate: {
                marginXS: 3,
              },
            },
          }}
        >
          <Rate
            className={styles.stars}
            onChange={(rate) => {
              console.log('сработал обработчик')
              rateMovieHandler(id, rate)
            }}
            allowHalf
            count={10}
          />
        </ConfigProvider>
      </div>
    </div>
  )
}
