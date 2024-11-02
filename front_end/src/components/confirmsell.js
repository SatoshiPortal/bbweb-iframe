import { useState, useEffect, useContext } from "react"

import { InformationCircleIcon } from '@heroicons/react/24/outline'

import { ErrorContext } from "../context/error.js"
import { LanguageContext } from "../context/language.js"
import { useFormContext } from "../context/form.js"

import { fetchBbApi } from "../utils/bullbitcoin.js"
import { parseFiatNumber, isInIframe, isInApp, getSatBalance, calculateTotalFees } from "../utils/index.js"

import Spinner from "../components/spinner.js"
import RateDisclaimer from "../components/ratedisclaimer.js"


export default function ConfirmSell({}) {
  const { formData, updateFormData } = useFormContext()
  const { error, addError, removeError } = useContext(ErrorContext)
  const language = useContext(LanguageContext)

  const [ loading, setLoading ] = useState(true)
  const [ verifiedRecipient, setVerifiedRecipient ] = useState(false)
  const [ quote, setQuote ] = useState(false)
  const [ showRateDisclaimer, setShowRateDisclaimer ] = useState(false)
  const [ showExchangeRate, setShowExchangeRate ] = useState(false)

  const handleClick = () => {
    if(window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({action: "confirm", amount: quote.inAmount}))
    } else if(isInIframe()) {
      window.top.postMessage(JSON.stringify({action: "confirm", amount: quote.inAmount}), "*")
    } else {
      processForm() 
    }
  }

  const processForm = async () => {
    setLoading(true)
    let outPaymentProcessor

    switch (formData.recipient.recipientType) {
      case "SINPE_MOVIL":
        outPaymentProcessor = "OUT_CRC_RDV_SINPE"
      case "IBAN_CR":
        if(formData.recipient.currency === "CRC") {
          outPaymentProcessor = "OUT_CRC_RDV_IBAN"
        } else if(formData.recipient.currency === "USD") {
          outPaymentProcessor = "OUT_USD_RDV_IBAN"
        }
    }

    const postObj = {
      service: "api-orders",
      method: "createMyOrder",
      params: {
        amount: formData.amount.amount,
        isInAmountFixed: (formData.amount.currency === "BTC" ? true : false),
        inPaymentProcessor: formData.paymentOption,
        outPaymentProcessor: outPaymentProcessor,
        outRecipientId: formData.recipient.recipientId,
      }
    }

    if(formData.message !== " ") {
      postObj.params.outTransactionData = {
        text: formData.message
      }
    }

    const response = await fetchBbApi(postObj)

    if(response.error) {
      addError(response.message, true)
      setLoading(false)
      return
    }

    updateFormData({order: response.element})
    setLoading(false)
  }

  const fetchQuote = async () => {
    setLoading(true)
    let outPaymentProcessor

    switch (formData.recipient.recipientType) {
      case "SINPE_MOVIL":
        outPaymentProcessor = "OUT_CRC_RDV_SINPE"
      case "IBAN_CR":
        if(formData.recipient.currency === "CRC") {
          outPaymentProcessor = "OUT_CRC_RDV_IBAN"
        } else if(formData.recipient.currency === "USD") {
          outPaymentProcessor = "OUT_USD_RDV_IBAN"
        }
    }

    const response = await fetchBbApi({
      service: "api-orders",
      method: "getMyBestOption",
      params: {
        amount: formData.amount.amount,
        isInAmountFixed: (formData.amount.currency === "BTC" ? true : false),
        inPaymentProcessor: formData.paymentOption,
        outPaymentProcessor: outPaymentProcessor,
        outRecipientId: formData.recipient.recipientId,
      }
    })

    setLoading(false)

    if(response.error) {
      addError(response.message)
      return
    }

    if(getSatBalance() && (response.element.inAmount.toFixed(8) * 100000000) > getSatBalance()) {
      addError(language.confirmsell.errors.overBalance)
      return
    }

    setQuote(response.element)
  }

  const verifyRecipient = async () => {
    setLoading(true)
    const output = {}
    if(formData.recipient.recipientType === "SINPE_MOVIL") {
      const sinpeCheckRes = await fetchBbApi({
        service: "api-recipients",
        method: "checkSinpe",
        params: {
          phoneNumber: formData.recipient.phoneNumber,
        },
      })

      if(sinpeCheckRes.error) {
        addError(sinpeCheckRes.message)
        setLoading(false)
        return false
      }
      
      output.name = sinpeCheckRes.ownerName

    } else if(formData.recipient.recipientType === "IBAN_CR") {

      const ibanCheckRes = await fetchBbApi({
        service: "api-recipients",
        method: "checkIbanCR",
        params: {
          iban: formData.recipient.iban,
        },
      })

      if(ibanCheckRes.error) {
        addError(ibanCheckRes.message)
        setLoading(false)
        return false
      }

      output.name = ibanCheckRes.ownerName
    }

    setLoading(false)
    setVerifiedRecipient(output)
  }

  useEffect(() => {
    fetchQuote()
    verifyRecipient()
  }, [])

  useEffect(() => {
    window.addEventListener("userConfirmed", processForm)

    return () => window.removeEventListener("userConfirmed", processForm)
  }, [processForm])

  const totalFeesAmount = calculateTotalFees(quote)
  
  return (
    <div className="mt-5">
      <div className="flex items-center">
        <div className="flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.confirmsell.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.confirmsell.subtitle}</p>
        </div>
      </div>
      <div className="mt-5 flow-root">

        <div className="border-t border-gray-300">
          <dl className="divide-y divide-gray-300">
            <div className="px-0 py-6 grid grid-cols-3 gap-2">
              <dt className="text-sm font-medium leading-6 text-gray-900">{language.createorderprogress.amount} {quote.outPaymentProcessorCurrencyCode}</dt>
              <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                <div className="flex-grow">
                  {(loading || !quote) && 
                    <div className="animate-pulse max-w-lg">
                      <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
                    </div>
                  }
                  {!loading && quote &&
                    <span>
                      {quote.outPaymentProcessorCurrencyCode === "CRC" ? "₡" : "$"}{parseFiatNumber(quote.outAmount, quote.outPaymentProcessorCurrencyCode, language.lang)}
                    </span>
                  }
                </div>
                <span className="ml-4 flex-shrink-0">
                  <button onClick={() => updateFormData({amount: undefined})} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                    {language.edit}
                  </button>
                </span>
              </dd>
            </div>

            <div className="px-0 py-6 grid grid-cols-3 gap-2">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Total BTC
                <InformationCircleIcon className="h-5 w-5 ml-1 text-blue-400 inline" aria-hidden="true" onClick={() => setShowExchangeRate(!showExchangeRate)} />
              </dt>
              <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                <div className="flex-grow">
                  {(loading || !quote) && 
                    <div className="animate-pulse max-w-lg">
                      <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
                    </div>
                  }
                  {!loading && quote &&
                    <span>
                      ~{quote.inAmount.toFixed(8)} BTC
                    </span>
                  }
                </div>
                <span className="ml-4 flex-shrink-0">
                 
                </span>
              </dd>
            </div>

            {showExchangeRate &&
              <div className="px-0 py-6 grid grid-cols-3 gap-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  <span>
                    {language.createorderprogress.rate}
                    {isInApp() &&
                      <InformationCircleIcon className="h-5 w-5 text-blue-400 inline" aria-hidden="true" onClick={() => setShowRateDisclaimer(true)} />
                    }
                  </span>
                </dt>
                <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                  <div className="flex-grow">
                    {(loading || !quote) && 
                      <div className="animate-pulse max-w-lg">
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
                      </div>
                    }
                    {!loading && quote &&
                      <span>~{quote.outPaymentProcessorCurrencyCode === "CRC" ? "₡" : "$"}{parseFiatNumber(quote.outAmount / quote.inAmount, quote.outPaymentProcessorCurrencyCode, language.lang)}</span>
                    }
                  </div>
                  <span className="ml-4 flex-shrink-0">
                    <button disabled={loading} onClick={fetchQuote} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500 disabled:opacity-50">
                      {language.refresh}
                    </button>
                  </span>
                </dd>
              </div>
            }
            
            {totalFeesAmount > 0 &&
              <div className="px-0 py-6 grid grid-cols-3 gap-2">
                <dt className="text-sm font-medium leading-6 text-gray-900">{language.confirmsell.includesFees}</dt>
                <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                  <div className="flex-grow">
                    {(loading || !quote) && 
                      <div className="animate-pulse max-w-lg">
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
                      </div>
                    }
                    {!loading && quote &&
                      <span>~{totalFeesAmount.toFixed(8)} BTC</span>
                    }
                  </div>
                  <span className="ml-4 flex-shrink-0">
                    <button onClick={fetchQuote} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                      {language.edit}
                    </button>
                  </span>
                </dd>
              </div>
            }

            <div className="px-0 py-6 grid grid-cols-3 gap-2">
              <dt className="text-sm font-medium leading-6 text-gray-900">{language.createorderprogress.recipient}</dt>
              <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                <div className="flex-grow break-all">
                  {formData.recipient.label}
                  <br />
                  {(loading || !verifiedRecipient) && 
                    <div className="animate-pulse max-w-lg">
                      <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
                    </div>
                  }
                  {!loading && verifiedRecipient &&
                    <span>{verifiedRecipient.name}</span>
                  }
                </div>
                <span className="ml-4 flex-shrink-0">
                  <button onClick={() => updateFormData({recipient: undefined})} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                    {language.edit}
                  </button>
                </span>
              </dd>
            </div>
            <div className="px-0 py-6 grid grid-cols-3 gap-2">
              <dt className="text-sm font-medium leading-6 text-gray-900">{language.createorderprogress.message}</dt>
              <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                <span className="flex-grow">{formData.message}</span>
                <span className="ml-4 flex-shrink-0">
                  <button onClick={() => updateFormData({message: undefined})} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                    {language.edit}
                  </button>
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-5 flex items-center justify-end gap-x-6">
          {loading &&
            <Spinner />
          }
          <button
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            onClick={handleClick}
            disabled={loading || !quote || !verifiedRecipient}
          >
            {language.confirmsell.confirmBtn}
          </button>
        </div>

      </div>
      <RateDisclaimer modal={true} open={showRateDisclaimer} setOpen={setShowRateDisclaimer} />
    </div>
  )
}