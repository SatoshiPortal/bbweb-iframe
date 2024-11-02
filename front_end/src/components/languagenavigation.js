import { Fragment, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { LanguageIcon } from '@heroicons/react/24/outline'

import { LanguageContext } from '../context/language.js'
import { classNames } from '../utils/index.js'

export default function LanguageNavigation({isMobile = false}) {
  const language = useContext(LanguageContext)
  let classes = ''

  if(isMobile) {
    classes = 'relative mr-2 inline-flex items-center justify-center rounded-md p-2 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white-600'
  } else {
    classes = 'relative ml-2 flex-shrink-0'
  }
  return (
    <Menu as="div" className={classes}>
      <div>
        <Menu.Button className="relative flex rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white-600">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open language menu</span>
          <LanguageIcon className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-6 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            <a 
              onClick={() => language.setLanguage("en")}
              className={classNames(
                language.lang.indexOf('en') === 0 ? 'bg-red-700 text-white' : 'text-gray-700',
                'block px-4 py-2 text-sm'
              )}
            >
              English
            </a>
          </Menu.Item>
          <Menu.Item>
            <a 
              onClick={() => language.setLanguage("es")}
              className={classNames(
                language.lang.indexOf('es') === 0 ? 'bg-red-700 text-white' : 'text-gray-700',
                'block px-4 py-2 text-sm'
              )}
            >
              Español
            </a>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}