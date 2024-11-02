import { useContext, Fragment, useState, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserIcon } from '@heroicons/react/24/outline'
import { fetchBbApi } from "../utils/bullbitcoin.js"

import { ErrorContext } from "../context/error.js"

import Spinner from "./spinner.js"

export default function VerifyIdentity({language, open, setOpen, user}) {
  const { error, addError, removeError } = useContext(ErrorContext)
  const [ identity, setIdentity ] = useState(false)
  const timer = useRef(null)

  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    const response = await fetchBbApi({
      service: "api-kyc",
      method: "createMyKycIncode",
      params: {},
    })
    setLoading(false)

    if(response.error) {
      if(response.data.message === "403") {
        addError(language.verifyidentity.notAllowedToTry)
        return
      }

      addError(response.message)
      return
    }

    setIdentity(response)
    user.refresh()
  }

  const getMyKycIncode = async () => {
    const response = await fetchBbApi({
      service: "api-kyc",
      method: "getMyKycIncode",
      params: {},
    })

    if(response.error) {
      addError(response.message)
      return
    }

    if(response.incodeIframeUrl) {
      setIdentity(response)
    }

    if( (response.element.status !== "NEW" || response.element.onboardingStatus === "ONBOARDING_FINISHED") && timer.current) {
      clearInterval(timer.current)
      setOpen(false)
      user.refresh()
    }
  }

  useEffect(() => {
    if(identity) {
      timer.current = setInterval(() => getMyKycIncode(), 5000)
    }

    if(!open) {
      clearInterval(timer.current)
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [identity, open])

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
                {!identity &&
                  <>
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
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 text-black">
                          {language.verifyidentity.title}
                        </Dialog.Title>
                        <Dialog.Description className="text-black">
                         {language.verifyidentity.subtitle}
                        </Dialog.Description>
                        <div className="flex-grow mt-5">
                          <p className="text-black">{language.verifyidentity.text}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                      >
                        {language.verifyidentity.confirmBtn}
                      </button>
                    </div>
                  </>
                }
                {identity &&
                  <iframe 
                    allowUserMedia 
                    allow="geolocation; microphone; camera;" 
                    className="w-full h-96" 
                    src={`${identity.incodeIframeUrl}&lang=${language.lang}`}
                  />
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
