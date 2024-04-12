/* eslint-disable no-unused-vars */
import { Rate, Row, Col, Tag, ConfigProvider, Typography, Empty } from 'antd'
import { format } from 'date-fns'

import Poster from '../Poster'
import { roundToNearestHalf, trimStr } from '../../services/utils'

import './FilmCard.scss'

const { Paragraph } = Typography

export default function FilmCard(props) {
  const { film } = props
  const { title, release_date: releaseDate, overview, poster_path: posterPath, vote_average: voteAverage } = film

  return (
    <div className="film-card">
      <Poster posterPath={posterPath} title={title} />
      <div className="film-card__description">
        <div className="film-card__title-wrapper">
          <Paragraph style={{ marginBottom: 7 }} className="film-card__title">
            {title}
          </Paragraph>
          <div className="film-card__average-vote">{voteAverage ? voteAverage.toFixed(1) : 0}</div>
        </div>
        <Paragraph style={{ marginBottom: 7 }} className="film-card__date">
          {releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : null}
        </Paragraph>
        <ConfigProvider
          theme={{
            components: {
              Tag: {
                defaultColor: 'rgba(0,0,0,0.65)',
              },
            },
          }}
        >
          <div className="film-card__genresWrappper">
            <Tag>Action</Tag>
            <Tag>Drama</Tag>
          </div>
        </ConfigProvider>
        <Paragraph className="film-card__overview" style={{ marginBottom: 7 }}>
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
          <Rate className="film-card__stars" allowHalf defaultValue={roundToNearestHalf(voteAverage)} count={10} />
        </ConfigProvider>
      </div>
    </div>
  )
}
