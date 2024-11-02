import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@headlessui/react'

import { classNames } from '../utils/index.js'

const NavLink = ({item, isMobile, close}) => {
  const location = useLocation()

  let classes = ""

  if(isMobile) {
    classes = 'block rounded-md py-2 px-3 text-base font-medium'
  } else {
    classes = 'block px-4 py-2 text-sm'
  }

  return (
    <Link
      to={item.path}
      onClick={() => {
        if(close) {
          close()
        }
      }}
      className={classNames(
        location.pathname === item.path  ? 'bg-red-700 text-white' : isMobile ? 'text-white' : 'text-gray-700',
        classes
      )}
    >
      {item.name}
    </Link>
  )
}


export default function UserNavigation({language, isMobile = false, close}) {
  const navigation = [
    { name: language.navigation.manage, path: '/settings' },
    { name: language.navigation.logout, path: '/logout' },
  ]

  if(isMobile) {
    return (
      <>
        {navigation.map((item) => (
          <NavLink item={item} isMobile={isMobile} close={close} />
        ))}
      </>
    )
  }

  return (
    <>
      {navigation.map((item) => (
        <Menu.Item key={item.name}>
          <NavLink item={item} isMobile={isMobile} close={close} />
        </Menu.Item>
      ))}
    </>
  )
}