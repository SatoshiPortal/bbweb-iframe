import { useState, useEffect, useContext } from "react"
import { decode } from "light-bolt11-decoder"
import { validate } from "bitcoin-address-validation"

import { InformationCircleIcon } from '@heroicons/react/24/outline'

import { ErrorContext } from "../context/error.js"
import { localize } from "../lang/index.js"
import { LanguageContext } from "../context/language.js"
import { useFormContext } from "../context/form.js"

import { fetchBbApi } from "../utils/bullbitcoin.js"
import { parseFiatNumber, isInIframe, isInApp, calculateTotalFees, getUsername } from "../utils/index.js"

import Spinner from "../components/spinner.js"
import RateDisclaimer from "../components/ratedisclaimer.js"

export default function ConfirmBuy({}) {
  const { formData, updateFormData } = useFormContext()
  const { error, addError, removeError } = useContext(ErrorContext)
  const language = useContext(LanguageContext)

  const [ loading, setLoading ] = useState(true)
  const [ quote, setQuote ] = useState(false)
  const [ order, setOrder ] = useState(false)
  const [ invoice, setInvoice ] = useState(false)
  const [ showRateDisclaimer, setShowRateDisclaimer ] = useState(false)
  const [ showExchangeRate, setShowExchangeRate ] = useState(false)
  const [ bitcoinAddress, setBitcoinAddress ] = useState("")
  const [ lightningAddress, setLightningAddress ] = useState("")
  const [ bitcoinAddressValid, setBitcoinAddressValid ] = useState(false)

  const getParams = () => {
    const params = {
      amount: formData.amount.amount,
      isInAmountFixed: (formData.amount.currency === "BTC" ? false : true),
      inPaymentProcessor: formData.type,
      outPaymentProcessor: formData.paymentOption,
    }

    if(formData.paymentOption === "OUT_BITCOIN") {
      params.outTransactionData = {
        bitcoinAddress,
      }
    }

    return params
  }

  const handleClick = async () => {
    if(order && order.orderId) {
      setOrder({
        ...order,
        retry: Math.floor(Math.random() * 1001).toString(),
      })
      return
    }

    setLoading(true)

    const params = getParams()

    if(formData.paymentOption === "OUT_LNURL_PAY") {
      const recipientAddress = lightningAddress || `${getUsername()}@pay.bitcoinjungle.app`
      const existingRecipientList = await fetchBbApi({
        service: "api-recipients",
        method: "listMyRecipients",
        params: {
          sortBy: {
            id: "createdAt",
            sort: "desc",
          },
          filters: {
            recipientType: [
              "OUT_LIGHTNING_ADDRESS", 
            ],
            isArchived: false,
            isOwner: true,
          },
        }
      })

      const existingRecipient = existingRecipientList.elements.find((recipient) => {
        if(recipient.address === recipientAddress) {
          return true
        }
  
        return false
      })

      if(existingRecipient && existingRecipient.recipientId) {
        params.outRecipientId = existingRecipient.recipientId
      } else {
        const createRecipientExec = await fetchBbApi({
          service: "api-recipients",
          method: "createMyRecipient",
          params: {
            element: {
              label: language.confirmbuy.myLightningAddress,
              isOwner: true,
              recipientType: "OUT_LIGHTNING_ADDRESS",
              address: recipientAddress,
            },
          }
        })

        if(createRecipientExec.error) {
          addError(language.confirmbuy.invalidLightningAddress)
          setLoading(false)
          return
        }

        params.outRecipientId = createRecipientExec.element.recipientId
      }
    }

    const response = await fetchBbApi({
      service: "api-orders",
      method: "createMyOrder",
      params: params,
    })

    if(response.error) {
      addError(response.message, true)
      setLoading(false)
      return false
    }

    setOrder(response.element)
    setLoading(false)
  }

  const fetchQuote = async () => {
    setLoading(true)

    const params = getParams()
    const response = await fetchBbApi({
      service: "api-orders",
      method: "getMyBestOption",
      params: params,
    })

    setLoading(false)

    if(response.error) {
      addError(response.message)
      return
    }

    setQuote(response.element)
  }

  const attachInvoiceToOrder = async () => {
    setLoading(true)

    const response = await fetchBbApi({
      service: "api-orders",
      method: "setBolt11",
      params: {
        orderId: order.orderId,
        bolt11: invoice,
      }
    })

    if(response.error) {
      addError(response.message, true)
      setLoading(false)
      return false
    }

    updateFormData({order: response.element})
  }

  const fetchInvoice = () => {
    const satAmount =  Math.round(order.outAmount * 100000000)
    if(window.ReactNativeWebView) {
      setLoading(true)
      if(formData.paymentOption === "OUT_LN") {
        window.ReactNativeWebView.postMessage(JSON.stringify({action: "createInvoice", satAmount: satAmount}))
      }
    } else if(isInIframe()) {
      setLoading(true)
      if(formData.paymentOption === "OUT_LN") {
        window.top.postMessage(JSON.stringify({action: "createInvoice", satAmount: satAmount}))
      }
    } else if(formData.paymentOption === "OUT_LN") {
      const bolt11 = prompt(localize(language, 'confirmbuy.bolt11Prompt', {satAmount: satAmount}))

      try {
        const invoice = decode(bolt11)
        const amount = invoice?.sections?.find((el) => el.name === 'amount')
        const satValue = Math.round(amount?.value / 1000)

        if(satValue !== satAmount) {
          addError(language.confirmbuy.bolt11AmountError)
          return
        }

        setInvoice(bolt11)
      } catch (e) {
        console.log(e)

        addError(language.confirmbuy.invalidInvoice)
      }
    }
  }

  const handleBitcoinAddressChange = () => {
    const val = bitcoinAddress

    if(!val || !val.length) {
      setBitcoinAddressValid(false)
      return
    }

    const isValid = validate(val, process.env.REACT_APP_BITCOIN_NETWORK)

    if(!isValid) {
      addError(language.confirmbuy.invalidAddress)
      setBitcoinAddressValid(false)
      return
    }

    setBitcoinAddressValid(true)
  }

  const handleLightningAddressChange = () => {
    if (lightningAddress.includes('@')) {
      setBitcoinAddressValid(true)
      removeError()
    } else {
      setBitcoinAddressValid(false)
      addError(language.confirmbuy.invalidLightningAddress)
    }
  }

  useEffect(() => {
    fetchQuote()

    const updateInvoice = (e) => {
      setInvoice(e.detail.bolt11)
      setLoading(false)
    }

    window.addEventListener("invoiceCreated", updateInvoice)

    return () => window.removeEventListener("invoiceCreated", updateInvoice)

  }, [])

  useEffect(() => {
    if(invoice) {
      attachInvoiceToOrder()
    }
  }, [invoice])

  useEffect(() => {
    if(order && order.orderId) {
      if(formData.paymentOption === "OUT_LN") {
        fetchInvoice()
      } else {
        updateFormData({order})
      }
    }
  }, [order])

  useEffect(() => {
    if (formData.paymentOption === "OUT_LN") {
      setBitcoinAddressValid(true)
    } else if (formData.paymentOption === "OUT_LNURL_PAY") {
      const username = getUsername()
      if (username) {
        setLightningAddress(`${username}@pay.bitcoinjungle.app`)
        setBitcoinAddressValid(true)
      } else {
        setBitcoinAddressValid(false)
      }
    } else {
      setBitcoinAddressValid(false)
    }
  }, [formData])

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
              <dt className="text-sm font-medium leading-6 text-gray-900">{language.createorderprogress.amount} {quote.inPaymentProcessorCurrencyCode}</dt>
              <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                <div className="flex-grow">
                  {(loading || !quote) && 
                    <div className="animate-pulse max-w-lg">
                      <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
                    </div>
                  }
                  {!loading && quote &&
                    <span>
                      {quote.inPaymentProcessorCurrencyCode === "CRC" ? "₡" : "$"}{parseFiatNumber(quote.inAmount, quote.inPaymentProcessorCurrencyCode, language.lang)}
                    </span>
                  }
                </div>
                <span className="ml-4 flex-shrink-0">
                  <button onClick={() => updateFormData({amount: undefined, type: undefined})} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
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
                      ~{quote.outAmount.toFixed(8)} BTC
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
                      <span>~{quote.inPaymentProcessorCurrencyCode === "CRC" ? "₡" : "$"}{parseFiatNumber(quote.inAmount / quote.outAmount, quote.inPaymentProcessorCurrencyCode, language.lang)}</span>
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
              <dt className="text-sm font-medium leading-6 text-gray-900">{language.orders.source}</dt>
              <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                <span className="flex-grow">{language.createorderprogress[formData.type]}</span>
                <span className="ml-4 flex-shrink-0">
                  <button onClick={() => updateFormData({type: undefined})} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                    {language.edit}
                  </button>
                </span>
              </dd>
            </div>

            <div className="px-0 py-6 grid grid-cols-3 gap-2">
              <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.network}</dt>
              <dd className="flex text-sm leading-6 text-gray-700 col-span-2 mt-0">
                <span className="flex-grow">
                  {language.createorderprogress[formData.paymentOption]}
                </span>
                <span className="ml-4 flex-shrink-0">
                  <button onClick={() => updateFormData({paymentOption: undefined})} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                    {language.edit}
                  </button>
                </span>
              </dd>
            </div>

            {formData.paymentOption === "OUT_BITCOIN" &&
              <div className="px-0 py-6 grid grid-cols-3 gap-2">
                <label htmlFor="bitcoinAddress" className="block text-sm font-medium leading-6 text-gray-900">
                  {language.confirmbuy.addressInput}
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    name="bitcoinAddress"
                    id="bitcoinAddress"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-white dark:text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
                    placeholder="bc1..."
                    onChange={(e) => {
                      setBitcoinAddress(e.target.value)

                      if(validate(e.target.value, process.env.REACT_APP_BITCOIN_NETWORK)) {
                        setBitcoinAddressValid(true)
                      }
                    }}
                    value={bitcoinAddress}
                    onBlur={handleBitcoinAddressChange}
                  />
                </div>
              </div>
            }

            {formData.paymentOption === "OUT_LNURL_PAY" &&
              <div className="px-0 py-6 grid grid-cols-3 gap-2">
                <label htmlFor="lightningAddress" className="block text-sm font-medium leading-6 text-gray-900">
                  {language.confirmbuy.addressInput}
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    name="lightningAddress"
                    id="lightningAddress"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
                    placeholder="username@pay.bitcoinjungle.app"
                    onChange={(e) => {
                      setLightningAddress(e.target.value)
                      setBitcoinAddressValid(false)
                    }}
                    value={lightningAddress}
                    onBlur={handleLightningAddressChange}
                  />
                </div>
              </div>
            }
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
            disabled={loading || !quote || !bitcoinAddressValid}
          >
            {language.confirmbuy.confirmBtn}
          </button>
        </div>

      </div>
      <RateDisclaimer modal={true} open={showRateDisclaimer} setOpen={setShowRateDisclaimer} />
    </div>
  )
}