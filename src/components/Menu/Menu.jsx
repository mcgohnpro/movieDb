import { Menu as AntdMenu } from 'antd'

import styles from './Menu.module.scss'

const items = [
  {
    label: 'Search',
    key: 'search',
  },
  {
    label: 'Rated',
    key: 'rated',
  },
]

export default function Menu(props) {
  const { menuChangePageHandler, currentMenuPage } = props
  return (
    <AntdMenu
      className={styles['menu-page']}
      onClick={menuChangePageHandler}
      selectedKeys={[currentMenuPage]}
      mode="horizontal"
      items={items}
    />
  )
}
