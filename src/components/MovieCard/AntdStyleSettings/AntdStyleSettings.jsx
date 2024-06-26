import { ConfigProvider } from 'antd'

export default function AntdStyleSettings({ children }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: {
            defaultColor: 'rgba(0,0,0,0.65)',
          },
          Typography: {
            titleMarginBottom: 0,
          },
        },
        token: {
          Rate: {
            marginXS: 3,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
