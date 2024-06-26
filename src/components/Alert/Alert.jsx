import { Space, Alert as AntdAlert } from 'antd'
import PropTypes from 'prop-types'

export default function Alert(props) {
  const { errors, isOnline } = props
  const alerts = Object.keys(errors).map((name) => (
    <AntdAlert key={name} message={errors[name]} type="warning" closable />
  ))

  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
        maxWidth: '300px',
        position: 'absolute',
        zIndex: 1,
        right: 0,
      }}
    >
      {alerts}
      {!isOnline ? <AntdAlert type="error" message="There is no network connectivity" closable /> : null}
    </Space>
  )
}

Alert.defaultProps = {
  errors: {},
  isOnline: true,
}

Alert.propTypes = {
  errors: PropTypes.objectOf(PropTypes.string),
  isOnline: PropTypes.bool,
}
