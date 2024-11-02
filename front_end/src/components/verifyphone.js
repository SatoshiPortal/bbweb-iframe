import { useContext, useEffect, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PhoneIcon, CheckIcon } from '@heroicons/react/24/outline'
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
  CountrySelector,
  guessCountryByPartialPhoneNumber,
} from 'react-international-phone'

import { ErrorContext } from "../context/error.js"
import { fetchBbApi } from "../utils/bullbitcoin.js"
import Spinner from "./spinner.js"

import '../PhoneInput.css'

const prohibitedCountries = ['us', 'cn', 'ru', 'nk']

const countries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country)
  return prohibitedCountries.indexOf(iso2) === -1
})

export default function VerifyPhone({language, open, setOpen, setOpenName, user, isVerify, defaultPhoneNumber: defaultNumber = ""}) {
  const { error, addError, removeError } = useContext(ErrorContext)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  let defaultCountryCode = "506"
  let defaultPhoneNumber = ""
  let defaultCountry = "cr"

  const guessNumber = guessCountryByPartialPhoneNumber({phone: defaultNumber})

  if(guessNumber && guessNumber.country && prohibitedCountries.indexOf(guessNumber.country.iso2) === -1) {
    defaultCountryCode = guessNumber.country.dialCode
    defaultCountry = guessNumber.country.iso2
    defaultPhoneNumber = defaultNumber.replace(`+${defaultCountryCode}`, '')
  }

  const phoneKyc = user.getKyc('PHONE')

  const [phone, setPhone] = useState({countryCode: defaultCountryCode, phone: defaultPhoneNumber})
  const [kycObj, setKycObj] = useState(phoneKyc !== "" && ["APPROVED", "REJECTED"].indexOf(phoneKyc.status) === -1 ? phoneKyc : null)

  const handleSavePhone = async () => {
    setLoading(true)

    const guessNumber = guessCountryByPartialPhoneNumber({phone: `+${phone.countryCode}${phone.phone}`})

    if(guessNumber && guessNumber.country && prohibitedCountries.indexOf(guessNumber.country.iso2) !== -1) {
      addError(language.verifyphone.rejected)
      setLoading(false)
      return
    }

    const response = await fetchBbApi({
      service: "api-kyc",
      method: "saveMyKYCPhone",
      params: {
        element: {
          phoneCountryCode: phone.countryCode,
          phone: phone.phone,
          status: "NEW",
        }
      }
    })

    if(response.error) {
      addError(response.message)
    }

    if(response && response.element) {
      user.refresh()
      setKycObj(response.element)
    }

    setLoading(false)
  }

  const handleVerify = async () => {
    setLoading(true)
    const response = await fetchBbApi({
      service: "api-kyc",
      method: "validateCodeMyKYCPhone",
      params: {
        code: code,
        kycId: kycObj.kycId,
      }
    })
    setLoading(false)

    if(response.error) {
      addError(response.message)
      return
    }

    user.refresh()
    removeError()
    setOpen(false)

    const userFirstName = user.getKyc( 'PROFILE', 'firstName')
    const userLastName = user.getKyc('PROFILE', 'lastName')

    if(!userFirstName && !userLastName && setOpenName) {
      setOpenName(true)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    const response = await fetchBbApi({
      service: "api-kyc",
      method: "sendValidationCodeMyKYCPhone",
      params: {
        userId: user.data.userId,
        kycId: kycObj.kycId,
      }
    })

    if(response.error) {
      addError(response.message)
    }

    setLoading(false)
  }

  const handleKeyDown = (e, callback) => {
    if(e.key === "Enter") {
      callback()
    }
  }

  useEffect(() => {
    const phoneKyc = user.getKyc('PHONE')
    if(!isVerify) {
      setKycObj(null)
    } else if(phoneKyc !== "" && ["APPROVED", "REJECTED"].indexOf(phoneKyc.status) === -1) {
      setKycObj(phoneKyc)
    }
  }, [isVerify])

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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  {loading &&
                    <Spinner />
                  }
                  {!loading &&
                    <PhoneIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  }
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    {language.verifyphone.title}
                  </Dialog.Title>
                  <Dialog.Description className="text-black">
                    {!kycObj && language.verifyphone.subtitle1}
                    {kycObj && language.verifyphone.subtitle2}
                  </Dialog.Description>
                  {!kycObj &&
                    <div className="flex-grow mt-5">
                      <div>
                        <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                          {language.settings.phone}
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                          <PhoneInput
                            defaultCountry={defaultCountry}
                            preferredCountries={['cr', 'ca', 'de', 'es', 'it', 'sv', 'uk', 'fr']}
                            value={`+${phone.countryCode}${phone.phone}`}
                            onChange={(val, meta) => {
                              setPhone({
                                countryCode: meta.country.dialCode,
                                phone: val.replace(`+${meta.country.dialCode}`, ''),
                              })
                            }}
                            countries={countries}
                            countrySelectorStyleProps={{
                              className: "absolute inset-y-0 left-0 flex items-center"
                            }}
                            inputClassName="block w-full rounded-md border-0 pl-12 py-1.5 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                          />                          
                        </div>
                      </div>
                    </div>
                  }
                  {kycObj && kycObj.status !== "REJECTED" &&
                    <div>
                      <div className="mt-5">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            {language.verifyphone.code}
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <input
                              type="number"
                              name="code"
                              id="code"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-white dark:text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 disabled:opacity-50"
                              value={code}
                              onChange={e => setCode(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, handleVerify)}
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {kycObj && kycObj.status === "REJECTED" &&
                    <div>
                      <div className="mt-5">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            {language.verifyphone.rejected}
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                              onClick={() => {
                                setOpen(false)
                                setKycObj(null)
                              }}
                            >
                              {language.close}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
                {!kycObj &&
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                      onClick={handleSavePhone}
                      disabled={loading}
                    >
                      {language.verifyphone.verifyBtn}
                    </button>
                  </div>
                }
                {kycObj && kycObj.status !== "REJECTED" &&
                  <div className="mt-5 grid grid-cols-2 gap-3 content-stretch">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-300 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                      onClick={handleResendCode}
                      disabled={loading}
                    >
                      {language.verifyphone.resendBtn}
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                      onClick={handleVerify}
                      disabled={loading}
                    >
                      {language.verifyphone.verifyBtn}
                    </button>
                  </div>
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
