import { Empty } from 'antd'

import { URL_POSTERS } from '../../services/api'

import styles from './Poster.module.scss'

export default function Poster(props) {
  const { posterPath, title } = props
  return posterPath ? (
    <img
      className={styles.poster}
      src={URL_POSTERS + posterPath}
      alt={`Poster for the movie "${title}"`}
      loading="lazy"
    />
  ) : (
    <Empty className={styles.poster} image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )
}
