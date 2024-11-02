import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
// import domtoimage from 'dom-to-image'

import { isInIframe } from "../utils/index.js"

import { ErrorContext } from "../context/error.js"
import { LanguageContext } from "../context/language.js"
import Spinner from "../components/spinner.js"
import Confetti from "../components/confetti.js"
import RateDisclaimer from "../components/ratedisclaimer.js"
import { fetchBbApi } from "../utils/bullbitcoin.js"
import { parseFiatNumber, isInApp } from "../utils/index.js"


export default function Orders({order: defaultOrder, confetti}) {
  const { id } = useParams()
  const { error, addError, removeError } = useContext(ErrorContext)
  const language = useContext(LanguageContext)
  const [loading, setLoading] = useState(defaultOrder ? false : true)
  const [order, setOrder] = useState(defaultOrder || {})
  const [ showRateDisclaimer, setShowRateDisclaimer ] = useState(false)

  const fetchOrder = async () => {
    setLoading(true)
    const response = await fetchBbApi({
      service: "api-orders",
      method: "getMyOrder",
      params: {
        orderId: id,
      }
    })

    if(response.error) {
      addError(response.message)
    }

    if(response.element) {
      setOrder(response.element)
    }

    setLoading(false)
  }

  const returnToWallet = () => {
    if(window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({action: "complete", message: language.processorder.successTitle, title: language.processorder.successTitle, subtext: ""}))
    } else if(isInIframe()) {
      window.top.postMessage(JSON.stringify({action: "complete", message: language.processorder.successTitle, title: language.processorder.successTitle, subtext: ""}))
    }
  }

  // const share = async () => {
  //   const node = document.getElementById('orderReceipt')
  //   await domtoimage.toPng(
  //     node, 
  //     {
  //       bgcolor: "#FFFFFF",
  //       filter: (node) => {
  //         if(!node.className) {
  //           return true
  //         }

  //         if(typeof node.className === 'string' && node.className.indexOf('no-print') !== -1) {
  //           return false
  //         }

  //         return true
  //       }
  //     }
  //   )
  //   .then(async (dataUrl) => {
  //     var arr = dataUrl.split(","),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[arr.length - 1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n)

  //     while (n--) {
  //       u8arr[n] = bstr.charCodeAt(n)
  //     }

  //     const myFile = new File([u8arr], `order-${order.orderNbr}.png`, { type: mime })

  //     await navigator.share({
  //       files: [
  //         myFile,
  //       ]
  //     })
  //   })
  //   .catch((error) => {
  //       console.error('oops, something went wrong!', error);
  //   })
  // }

  useEffect(() => {
    if(!defaultOrder) {
      fetchOrder()
    }
  }, [])

  const referenceNumberObj = order?.outTransaction?.transactionPaymentProcessorData?.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'referenceNumber')
  const messageObj = order?.outTransaction?.transactionPaymentProcessorData?.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'text')
  const recipientParentObj = order?.outTransaction?.transactionPaymentProcessorData.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'recipientDetails')
  const destinationAddress = order?.outTransaction?.transactionPaymentProcessorData?.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'bitcoinAddress')
  let recipientObj = {}

  if(recipientParentObj && recipientParentObj.value) {
    try {
      recipientObj = JSON.parse(recipientParentObj.value)
    } catch(e) {
      
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8" id="orderReceipt">
      <div className="flow-root">
        {!loading &&
          <div className="text-center grid place-items-center">
            <CheckBadgeIcon className="h-16 w-16 text-green-600" aria-hidden="true" />
            <h3 className="text-base font-semibold leading-7 text-gray-900">{language.orderdetails.success}</h3>

            <div>
              <dl className="divide-y divide-gray-300">

                <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">{language.orders.date}</dt>
                  <dd className="flex text-sm text-gray-500 sm:mt-0">
                    <span className="flex-grow">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </dd>
                </div>

                <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">{language.processorder.orderNumber}</dt>
                  <dd className="flex text-sm text-gray-500 sm:mt-0">
                    <span className="flex-grow">
                     {order.orderNbr}
                    </span>
                  </dd>
                </div>

                {order.orderType === "SELL" &&
                  <>
                    <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium text-gray-900">
                        <span>
                          {language.orderdetails.fiatAmountNoFiat}
                          {isInApp() &&
                            <InformationCircleIcon className="h-5 w-5 text-blue-400 inline" aria-hidden="true" onClick={() => setShowRateDisclaimer(true)} />
                          }
                        </span>
                      </dt>
                      <dd className="flex text-sm text-gray-500 sm:mt-0">
                        <span className="flex-grow">
                          {order.outTransaction.paymentProcessor.currencyCode === "CRC" ? "₡" : "$"} {parseFiatNumber(order.outAmount, order.outPaymentProcessorCurrencyCode, language.lang)}
                        </span>
                      </dd>
                    </div>

                    <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium text-gray-900">{language.processorder.referenceNumber}</dt>
                      <dd className="flex text-sm text-gray-500 sm:mt-0">
                        <span className="flex-grow">
                          {referenceNumberObj?.value}
                        </span>
                      </dd>
                    </div>

                    <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium text-gray-900">{language.orderdetails.origin}</dt>
                      <dd className="flex text-sm text-gray-500 sm:mt-0">
                        <span className="flex-grow">
                          Toro Pagos Limitada
                          <br />
                          3-102-875766
                        </span>
                      </dd>
                    </div>

                    <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium text-gray-900">{language.orderdetails.destination}</dt>
                      <dd className="flex text-sm text-gray-500 sm:mt-0">
                        <span className="flex-grow">
                          {recipientObj?.ownerName}
                          <br />
                          {recipientObj?.phoneNumber || recipientObj?.iban}
                        </span>
                      </dd>
                    </div>

                    <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium text-gray-900">{language.orderdetails.message}</dt>
                      <dd className="flex text-sm text-gray-500 sm:mt-0">
                        <span className="flex-grow">
                          {messageObj?.value}
                        </span>
                      </dd>
                    </div>
                  </>
                }

                {order.orderType === "BUY" &&
                  <>
                    <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium text-gray-900">{language.orderdetails.bitcoinAmount}</dt>
                      <dd className="flex text-sm text-gray-500 sm:mt-0">
                        <span className="flex-grow">
                          {order.outAmount.toFixed(8)} BTC
                        </span>
                      </dd>
                    </div>

                    {destinationAddress?.value &&
                      <div className="px-2 py-2 sm:px-4 sm:py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">{language.orderdetails.destinationAddress}</dt>
                        <dd className="flex text-sm text-gray-500 sm:mt-0">
                          <span className="flex-grow">
                            {destinationAddress.value}
                          </span>
                        </dd>
                      </div>
                    }
                  </>
                }

              </dl>
            </div>

            {(window.ReactNativeWebView || isInIframe()) &&
              <a onClick={returnToWallet} className="block rounded-md bg-red-700 px-3 py-2 text-center text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                {language.processorder.returnToWallet}
              </a>
            }
            {/*typeof navigator.share !== 'undefined' && 
              <a onClick={share} className="no-print block rounded-md bg-red-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                Share
              </a>
            */}
          </div>
        }
        {loading &&
          <Spinner container />
        }
        {confetti &&
          <Confetti />
        }
      </div>
      <RateDisclaimer modal={true} open={showRateDisclaimer} setOpen={setShowRateDisclaimer} />
    </div>
  )
}