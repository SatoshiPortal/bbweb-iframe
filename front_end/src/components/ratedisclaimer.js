import { Fragment, useState, useContext } from "react"
import { Dialog, Transition } from '@headlessui/react'

import { InformationCircleIcon } from '@heroicons/react/24/outline'

import { LanguageContext } from "../context/language.js"

import { isInApp } from "../utils/index.js"

export default function RateDisclaimer({modal = false, open, setOpen}) {
  if(modal) {
    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-9" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-9 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <InnerText showReadMore={true} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }

  return (
    <>
      {isInApp() &&
        <InnerText />
      }
    </>
  )
}

function InnerText({showReadMore = false}) {
  const language = useContext(LanguageContext)
  const [readMore, setReadMore] = useState(showReadMore)
  return (
    <div className="mt-2 mb-2 border-l-4 border-blue-400 bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            {language.rates.explainer1}
            {!readMore &&
              <span className="text-bold" onClick={() => setReadMore(true)}> {language.rates.readMore}...</span>
            }
          </p>
          {readMore &&
            <>
             <p className="text-sm mt-2 text-blue-700">
              {language.rates.explainer2}
            </p>
             <p className="text-sm mt-2 text-blue-700">
              {language.rates.explainer3}
            </p>
            </>
          }
        </div>
      </div>
    </div>
  )
}