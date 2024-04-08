import { Space, Alert } from 'antd'

export default function AlertMessage(props) {
  const { error, type } = props
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
      <Alert message={error} type={type} showIcon closable />
    </Space>
  )
}
