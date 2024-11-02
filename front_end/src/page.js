import { Fragment, useState, useEffect, lazy, useContext } from 'react'
import { Outlet } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'

import Login from "./pages/Login.js"
import Maintenance from "./pages/Maintenance.js"

import Spinner from "./components/spinner.js"
import Error from "./components/error.js"
import MainNavigation from "./components/mainnavigation.js"
import UserNavigation from "./components/usernavigation.js"
import LanguageNavigation from "./components/languagenavigation.js"
import SystemAlert from "./components/systemalert.js"
import ColorToggle from './components/colortoggle.js'

import { UserContext, UserProvider } from "./context/user.js"
import { AlertProvider } from "./context/alert.js"
import { LanguageContext, LanguageProvider } from "./context/language.js"
import { ErrorProvider } from "./context/error.js"

const Onboarding = lazy(() => import("./components/onboarding.js"));

export default function Page() {
  return (
    <UserProvider>
      <LanguageProvider>
        <ErrorProvider>
          <AlertProvider>
            <PageContent />
            <Error />
          </AlertProvider>
        </ErrorProvider>
      </LanguageProvider>
    </UserProvider>
  )
}

const PageContent = () => {
  const user = useContext(UserContext)
  const language = useContext(LanguageContext)

  const email = user.getKyc('EMAIL', 'email')
  const firstName = user.getKyc('PROFILE', 'firstName')
  const lastName = user.getKyc('PROFILE', 'lastName')

  return (
    <div className="bg-white h-screen">
      <div className="bg-black dark:bg-white pb-32">
        <Disclosure as="nav" className="border-b border-white border-opacity-25 bg-black-400 lg:border-none nightwind-prevent nightwind-prevent-block">
          {({ open, close }) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="flex items-center px-2 lg:px-0">
                    <div className="flex-shrink-0">
                      <a href="#">
                        <picture>
                          <source srcset="/bb-logo.webp" type="image/webp" />
                          <img
                            className="block"
                            src="/bull-bitcoin-banner-logo.png"
                            alt="Bull Bitcoin"
                            width={200}
                            height={50}
                          />
                        </picture>
                      </a>
                    </div>
                    <div className="hidden lg:ml-10 lg:block">
                      <div className="flex space-x-4">
                        <MainNavigation language={language} />
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <ColorToggle />
                    <LanguageNavigation isMobile={true} />
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-red-700 p-2 text-red-200 hover:bg-red-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="hidden lg:ml-4 lg:block">
                    <div className="flex items-center">
                      {/* Profile dropdown */}
                      <ColorToggle />
                      <LanguageNavigation />
                      <Menu as="div" className="relative ml-3 flex-shrink-0">
                        <div>
                          <Menu.Button className="relative flex rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
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
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <UserNavigation language={language} />
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  <MainNavigation language={language} isMobile={true} close={close} />
                </div>
                <div className="border-t border-red-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{firstName} {lastName}</div>
                      <div className="text-sm font-medium text-white">{email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <UserNavigation language={language} isMobile={true} close={close} />
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <header className="py-5 sm:py-10">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <SystemAlert />
          </div>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            {user.data &&
              <Onboarding language={language} />
            }
          </div>
        </header>
      </div>

      <main className="dark:bg-white -mt-32">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white px-2 py-2 shadow sm:px-6" style={{minHeight: 400}}>
            {user.loading && 
              <Spinner container text={language.loading} />
            }
            {!user.loading && user.data && <Outlet />}
            {!user.loading && !user.data && !user.isMaintenance && <Login language={language} />}
            {!user.loading && !user.data && user.isMaintenance && <Maintenance language={language} />}
          </div>
        </div>
      </main>
    </div>
  )
}