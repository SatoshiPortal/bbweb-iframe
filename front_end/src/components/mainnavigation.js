import { Link, useLocation } from 'react-router-dom';
import { classNames } from '../utils/index.js'

export default function MainNavigation({language, isMobile = false, close}) {
  const navigation = [
    { name: language.navigation.home, path: "/" },
    { name: language.navigation.recipients, path: '/recipients'},
    { name: language.navigation.orders, path: '/orders'},
    {name: language.navigation.pos, path: '/pos'},
  ]

  const location = useLocation()
  let classes = ""

  if(isMobile) {
    classes = 'block rounded-md py-2 px-3 text-base font-medium'
  } else {
    classes = 'rounded-md py-2 px-3 font-medium'
  }

  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          onClick={() => {
            if(close) {
              close()
            }
          }}
          className={classNames(classes,
            location.pathname === item.path
              ? 'bg-red-700 text-white'
              : 'text-white hover:bg-red-500 hover:bg-opacity-75'
          )}
          aria-current={location.pathname === item.path ? 'page' : undefined}
        >
          {item.name}
        </Link>
      ))}
    </>
  )
}