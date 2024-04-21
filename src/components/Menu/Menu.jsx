import { Menu as AntdMenu } from 'antd'
import PropTypes from 'prop-types'

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

Menu.defaultProps = {
  menuChangePageHandler: () => {},
  currentMenuPage: 'search',
}

Menu.propTypes = {
  menuChangePageHandler: PropTypes.func,
  currentMenuPage: PropTypes.oneOf(['search', 'rated']),
}
