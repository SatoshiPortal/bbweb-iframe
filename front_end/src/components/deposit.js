import { useContext, useEffect, useState, useRef } from "react"
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Switch } from '@headlessui/react'

import { LanguageContext } from "../context/language.js"
import { localize } from "../lang/index.js"
import { useFormContext } from "../context/form.js"
import { copyToClipboard, classNames, parseFiatNumber } from "../utils/index.js"
import { fetchBbApi } from "../utils/bullbitcoin.js"

import SendSms from "../components/sendsms.js"

export default function Deposit() {
  const language = useContext(LanguageContext)
  const { formData, updateFormData } = useFormContext()
  const { type, order } = formData  
  const [ confirmed, setConfirmed ] = useState(false)
  const [ smsFlow, setSmsFlow ] = useState(false)
  const [ showSms, setShowSms ] = useState(false)
  const [ rpcLoading, setRpcLoading ] = useState(false)
  const timer = useRef(null)

  const transferCode = order.inTransaction.transactionPaymentProcessorData[0].value

  const handleOptionClick = (text) => {
    copyToClipboard(text)
    setConfirmed(false)
  }

  const handleLocatorClick = () => {
    copyToClipboard(transferCode)
    setConfirmed(false)
  }

  const handleAutomaticSuccess = () => {
    setShowSms(false)
    setConfirmed(false)
  }

  const handleManual = () => {
    setSmsFlow(false)
    setShowSms(false)
    setConfirmed(false)
  }

  const checkOrder = async () => {
    if(rpcLoading) {
      return
    }

    console.log('deposit check order')

    setRpcLoading(true)
    const response = await fetchBbApi({
      service: "api-orders",
      method: "getMyOrder",
      params: {
        orderId: order.orderId,
      }
    })

    if(response.element && ["IN_COMPLETED", "OUT_IN_PROGRESS", "DONE"].indexOf(response.element.status) !== -1) {
      updateFormData({deposit: true})
    }

    setRpcLoading(false)
  }

  useEffect(() => {
    if(formData && formData.type && formData.type === 'IN_CRC_RDV_SINPE') {
      setSmsFlow(true)
    }
  }, [formData])

  useEffect(() => {
    if(order && order.orderId) {
      timer.current = setInterval(() => checkOrder(), 1000)
      return () => {
        clearInterval(timer.current)
      }
    }
  }, [order])

  return (
    <div className="mt-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.deposit.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{localize(language, 'deposit.subtitle', {amount: `${parseFiatNumber(order.inAmount, order.inPaymentProcessorCurrencyCode, language.lang)} ${order.inTransaction.paymentProcessor.currencyCode}`})}</p>
        </div>
      </div>
      <div className="flow-root max-w-2xl mx-auto">
        <div className="mt-5">
          {smsFlow &&
            <div className="mt-2 grid gap-3 content-stretch">
              <a
                onClick={() => setShowSms(true)}
                className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
              >
                {language.deposit.automatic}
              </a>
              <a
                onClick={handleManual}
                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50"
              >
                {language.deposit.manual}
              </a>
            </div>
          }

          {!smsFlow &&
            <div className="mt-2">
              <p className="text-base font-semibold leading-7 text-gray-900">{language.deposit.details}</p>
              <p className="text-sm text-gray-500 mb-5">{language.deposit.cedula}</p>

              {order.outTransaction.paymentProcessorCode === "OUT_BITCOIN" &&
                <div className="m-4 border-l-4 border-blue-400 bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        {language.deposit.slowAllowed}
                      </p>
                    </div>
                  </div>
                </div>
              }

              {type === "IN_CRC_RDV_SINPE" &&
                <a className="text-black" onClick={() => handleOptionClick('87833773')}>
                  <span>
                    📋
                  </span>
                  {" "}
                  8783-3773
                </a>
              }

              {type === "IN_USD_RDV_IBAN" && 
                <a className="text-black" onClick={() => handleOptionClick('CR76090100002792137503')}>
                  <span>
                    📋
                  </span>
                  {" "}
                  CR76090100002792137503
                </a>
              }

              {type === "IN_CRC_RDV_IBAN" && 
                <a className="text-black" onClick={() => handleOptionClick('CR06090100002792137502')}>
                  <span onClick={() => handleOptionClick('CR06090100002792137502')}>
                    📋
                  </span>
                  {" "}
                  CR06090100002792137502
                </a>
              }
            </div>
          }

        </div>
        {!smsFlow &&
          <div className="mt-5">
            <p className="text-base font-semibold leading-7 text-gray-900">{language.deposit.descriptionTitle}</p>
            <p className="text-sm text-gray-500">{language.deposit.descriptionSubtitle}</p>
            <div className="mt-2">
              <a className="text-black" onClick={() => handleLocatorClick()}>
                <span>
                  📋
                </span>
                {" "}
                {transferCode}
              </a>
            </div>
          </div>
        }
        {(!smsFlow || (smsFlow && confirmed)) &&
          <>
            <div className="mt-5">
              <p className="text-base font-semibold leading-7 text-gray-900">{language.deposit.confirmTitle}</p>
              <p className="text-sm text-gray-500">{language.deposit.confirmSubtitle}</p>
              <div className="mt-5">
                <Switch.Group as="div" className="flex items-center">
                  <Switch
                    checked={confirmed}
                    onChange={setConfirmed}
                    className={classNames(
                      confirmed ? 'bg-red-700' : 'bg-gray-300',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        confirmed ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-black shadow ring-0 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3 text-sm">
                    <span className="font-medium text-gray-900">{language.deposit.confirmLabel}</span>
                  </Switch.Label>
                </Switch.Group>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                onClick={() => updateFormData({deposit: true})}
                disabled={!confirmed}
              >
                {language.continue}
              </button>
            </div>
          </>
        }
      </div>
      <SendSms language={language} open={showSms} setOpen={() => handleAutomaticSuccess()} setSent={setConfirmed} amount={order.inAmount} locator={transferCode} />
    </div>
  )
}