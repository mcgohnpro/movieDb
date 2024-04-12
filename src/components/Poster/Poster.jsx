/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Empty, Skeleton, Space } from 'antd'

import styles from './Poster.module.scss'

const URL_POSTER = 'https://image.tmdb.org/t/p/original'

export default function Poster(props) {
  const { posterPath, title } = props
  const poster = posterPath ? (
    <img className={styles.poster} src={URL_POSTER + posterPath} alt={`Poster for the movie "${title}"`} />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )

  return <div className={styles.posterWrapper}>{poster}</div>
}
