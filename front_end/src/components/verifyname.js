import { useContext, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserIcon } from '@heroicons/react/24/outline'
import { fetchBbApi } from "../utils/bullbitcoin.js"

import { ErrorContext } from "../context/error.js"

import Spinner from "./spinner.js"

export default function VerifyName({language, open, setOpen, user}) {
  const userFirstName = user.getKyc('PROFILE', 'firstName')
  const userLastName = user.getKyc('PROFILE', 'lastName')
  let sinpeDataName = user.getKyc('SINPE', 'ownerName')
  sinpeDataName.replaceAll("_", " ")
  sinpeDataName = sinpeDataName.split(' ')

  const { error, addError, removeError } = useContext(ErrorContext)

  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState(userFirstName)
  const [lastName, setLastName] = useState(userLastName)

  const handleVerify = async () => {
    setLoading(true)
    const response = await fetchBbApi({
      service: "api-kyc",
      method: "saveMyKYCProfile",
      params: {
        element: {
          firstName: firstName,
          lastName: lastName,
          status: "NEW",
        }
      }
    })
    setLoading(false)

    if(response.error) {
      addError(response.message)
      return
    }
    
    user.refresh()
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      handleVerify()
    }
  }

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
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    {loading &&
                      <Spinner />
                    }
                    {!loading &&
                      <UserIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    }
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {language.verifyname.title}
                    </Dialog.Title>
                    <Dialog.Description className="text-black">
                     {language.verifyname.subtitle}
                    </Dialog.Description>
                    <div className="flex-grow mt-5">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                            {language.settings.firstName}
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="first_name"
                              id="first_name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-white dark:text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                              placeholder="Pedro"
                              defaultValue={userFirstName || sinpeDataName[0] || ""}
                              value={firstName}
                              onChange={e => setFirstName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                            {language.settings.lastName}
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="last_name"
                              id="last_name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-white dark:text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                              placeholder="Sanchez"
                              value={lastName}
                              defaultValue={userLastName || sinpeDataName.slice(1).join(" ") || ""}
                              onChange={e => setLastName(e.target.value)}
                              onKeyDown={handleKeyDown}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                  >
                    {language.verifyname.confirmBtn}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
