import { useContext, useState, useEffect } from "react"

import { LanguageContext } from "../context/language.js"
import { useFormContext } from "../context/form.js"
import NewBadge from "../components/newbadge.js"
import { isInApp, isInIframe } from "../utils/index.js"

export default function Deposit() {
  const language = useContext(LanguageContext)
  const { formData, updateFormData } = useFormContext()

  const [type, setType] = useState(false)
  const [paymentOption, setPaymentOption] = useState(false)

  const { amount } = formData

  useEffect(() => {
    setType(formData.type)
    setPaymentOption(formData.paymentOption)
  }, [formData])

  return (
    <div className="mt-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.buytype.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.buytype.subtitle}</p>
        </div>
      </div>
      <div className="flow-root max-w-2xl mx-auto">
        <div className="mt-5">

          <fieldset className="mb-2">
            <div className="sm:flex-auto">
              <h3 className="text-base font-semibold leading-7 text-gray-900">{language.buytype.fiatTitle}</h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.buytype.fiatSubtitle}</p>
            </div>
            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="sinpe-movil-option"
                  name="destinationType"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-red-700 focus:ring-red-600 disabled:text-gray-600 disabled:bg-gray-600 disabled:opacity-50"
                  onChange={() => setType("IN_CRC_RDV_SINPE")}
                  checked={type === 'IN_CRC_RDV_SINPE'}
                  disabled={amount.currency === 'USD'}
                />
                <label for="sinpe-movil-option" className="ml-3 block text-sm font-medium leading-6 text-gray-900 disabled:text-gray-600" disabled={amount.currency === 'USD'}>
                  {language.sinpe}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="iban-option"
                  name="destinationType"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-red-700 focus:ring-red-600"
                  onChange={() => setType((amount.currency === "CRC" ? "IN_CRC_RDV_IBAN" : "IN_USD_RDV_IBAN"))}
                  checked={type === 'IN_CRC_RDV_IBAN' || type === 'IN_USD_RDV_IBAN'}
                />
                <label for="iban-option" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  {language.iban}
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <div className="sm:flex-auto">
              <h3 className="text-base font-semibold leading-7 text-gray-900">{language.buytype.bitcoinTitle}</h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.buytype.bitcoinSubtitle}</p>
            </div>
            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="lightning-address-option"
                  name="paymentOption"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-red-700 focus:ring-red-600 disabled:text-gray-600 disabled:bg-gray-600 disabled:opacity-50"
                  onChange={() => setPaymentOption("OUT_LNURL_PAY")}
                  checked={paymentOption === "OUT_LNURL_PAY"}
                />
                <label for="lightning-address-option" className="ml-3 block text-sm font-medium leading-6 text-gray-900 disabled:text-gray-600">
                  {language.lightning} {isInApp() || isInIframe()  ? `(Bitcoin Jungle)` : `(Lightning Address)`}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="lightning-network-option"
                  name="paymentOption"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-red-700 focus:ring-red-600 disabled:text-gray-600 disabled:bg-gray-600 disabled:opacity-50"
                  onChange={() => setPaymentOption("OUT_LN")}
                  checked={paymentOption === "OUT_LN"}
                />
                <label for="lightning-network-option" className="ml-3 block text-sm font-medium leading-6 text-gray-900 disabled:text-gray-600">
                  {language.lightning}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="bitcoin-option"
                  name="paymentOption"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-red-700 focus:ring-red-600"
                  onChange={() => setPaymentOption("OUT_BITCOIN")}
                  checked={paymentOption === 'OUT_BITCOIN'}
                />
                <label for="bitcoin-option" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  {language.onchain}
                  <NewBadge language={language} />
                </label>
              </div>
            </div>
          </fieldset>

        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            onClick={() => updateFormData({type, paymentOption})}
            disabled={!type || !paymentOption}
          >
            {language.continue}
          </button>
        </div>
      </div>
    </div>
  )
}