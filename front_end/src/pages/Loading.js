import { Disclosure, Menu } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Spinner from "../components/spinner.js"
import { getLanguage } from "../utils/index.js"
import LanguageNavigation from "../components/languagenavigation.js"
import ColorToggle from "../components/colortoggle.js"

export default function Loading() {
  const lang = getLanguage()

  return (
    <div className="bg-white h-screen">
      <div className="bg-black pb-32 nightwind-prevent nightwind-prevent-block">
        <Disclosure as="nav" className="border-b border-white border-opacity-25 bg-black-400 lg:border-none">
          {({ open }) => (
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
                        {/* Placeholder for MainNavigation */}
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:hidden">
                    <ColorToggle />
                    <LanguageNavigation setLanguage={() => {}} language={lang} isMobile={true} />
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
                      <ColorToggle />
                      <LanguageNavigation setLanguage={() => {}} language={lang} />
                      <Menu as="div" className="relative ml-3 flex-shrink-0">
                        <div>
                          <Menu.Button className="relative flex rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
                          </Menu.Button>
                        </div>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                {/* Placeholder for mobile menu content */}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <header className="py-5 sm:py-10"></header>
      </div>

      <main className="dark:bg-white -mt-32">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white px-2 py-2 shadow sm:px-6" style={{minHeight: 400}}>
            <Spinner container text={lang == 'es' ? 'Cargando...' : 'Loading...'} />
          </div>
        </div>
      </main>
    </div>
  )
}