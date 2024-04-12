import { Empty } from 'antd'

import styles from './Poster.module.scss'

const URL_POSTER = 'https://image.tmdb.org/t/p/original'

export default function Poster(props) {
  const { posterPath, title } = props
  const poster = posterPath ? (
    <img
      className={styles.poster}
      src={URL_POSTER + posterPath}
      alt={`Poster for the movie "${title}"`}
      loading="lazy"
    />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )

  return <div className={styles.posterWrapper}>{poster}</div>
}
