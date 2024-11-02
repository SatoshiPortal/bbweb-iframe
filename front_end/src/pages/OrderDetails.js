import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"

import { InformationCircleIcon } from '@heroicons/react/24/outline'

import { ErrorContext } from "../context/error.js"
import { LanguageContext } from "../context/language.js"
import Spinner from "../components/spinner.js"
import OrderStatus from "../components/orderstatus.js"
import RateDisclaimer from "../components/ratedisclaimer.js"
import { fetchBbApi } from "../utils/bullbitcoin.js"
import { parseFiatNumber, isInApp, handleLinkClick } from "../utils/index.js"

const MEMPOOL_DOMAIN = "https://mempool.bullbitcoin.com"

export default function Orders() {
  const { id } = useParams()
  const { error, addError, removeError } = useContext(ErrorContext)
  const language = useContext(LanguageContext)
  const [loading, setLoading] = useState(true)
  const [ showRateDisclaimer, setShowRateDisclaimer ] = useState(false)
  const [order, setOrder] = useState({})

  const fetchOrder = async () => {
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

  useEffect(() => {
    fetchOrder()
  }, [])

  const referenceNumberObj = order?.outTransaction?.transactionPaymentProcessorData?.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'referenceNumber')
  const transferCode = order?.inTransaction?.transactionPaymentProcessorData?.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'transferCode')
  const destinationAddress = order?.outTransaction?.transactionPaymentProcessorData?.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'bitcoinAddress')
  const destinationLightningAddress = order?.outTransaction?.transactionPaymentProcessorData?.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'address')
  const destinationTxHash = order?.outTransaction?.transactionPaymentProcessorData?.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'TxId')
  const recipientParentObj = order?.outTransaction?.transactionPaymentProcessorData.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'recipientDetails')
  let recipientObj = {}

  if(recipientParentObj && recipientParentObj.value) {
    try {
      recipientObj = JSON.parse(recipientParentObj.value)
    } catch(e) {
      
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.orderdetails.title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.orderdetails.subtitle}</p>
        </div>
        {order.orderType === "SELL" && order.status === "DONE" &&
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              className="block rounded-md bg-red-700 px-3 py-2 text-center text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              to={`/order/${order.orderId}/receipt`}
            >
              {language.orderdetails.receiptBtn}
            </Link>
          </div>
        }
      </div>
      <div className="mt-2 sm:mt-8 flow-root">
        {!loading &&
          <div className="border-t border-gray-300">
            <dl className="divide-y divide-gray-300">

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">{language.orders.date}</dt>
                <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                  <span className="ml-4 flex-shrink-0">
                    
                  </span>
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">{language.orders.orderNumber}</dt>
                <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{order.orderNbr}</span>
                  <span className="ml-4 flex-shrink-0">
                    
                  </span>
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">{language.orders.status}</dt>
                <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    <OrderStatus order={order} />
                  </span>
                  <span className="ml-4 flex-shrink-0">
                    
                  </span>
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.type}</dt>
                <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {language.orderdetails[order.orderType]}
                  </span>
                  <span className="ml-4 flex-shrink-0">
                   
                  </span>
                </dd>
              </div>

              {order.orderType === "SELL" &&
                <>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.bitcoinAmount}</dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">{order.inAmount.toFixed(8)} BTC</span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.fiatAmount}</dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        {parseFiatNumber(order.outAmount, order.outPaymentProcessorCurrencyCode, language.lang)} {order.outTransaction.paymentProcessor.currencyCode}
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      <span>
                        {language.orderdetails.rate}
                        {isInApp() &&
                          <InformationCircleIcon className="h-5 w-5 text-blue-400 inline" aria-hidden="true" onClick={() => setShowRateDisclaimer(true)} />
                        }
                      </span>
                    </dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        {parseFiatNumber(order.outAmount / order.inAmount, order.outPaymentProcessorCurrencyCode, language.lang)} {order.outTransaction.paymentProcessor.currencyCode}
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.destination}</dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        {recipientObj?.ownerName}
                        <br />
                        {recipientObj?.phoneNumber || recipientObj?.iban}
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{language.processorder.referenceNumber}</dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        {referenceNumberObj?.value}
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>
                </>
              }

              {order.orderType === "BUY" &&
                <>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.fiatAmount}</dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        {parseFiatNumber(order.inAmount, order.inPaymentProcessorCurrencyCode, language.lang)} {order.inTransaction.paymentProcessor.currencyCode}
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.bitcoinAmount}</dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        {order.outAmount.toFixed(8)} BTC
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.rate}</dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        {parseFiatNumber(order.inAmount / order.outAmount, order.inPaymentProcessorCurrencyCode, language.lang)} {order.inTransaction.paymentProcessor.currencyCode}
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.transferCode}</dt>
                    <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        {transferCode?.value}
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        
                      </span>
                    </dd>
                  </div>

                  {(destinationAddress?.value || destinationLightningAddress?.value) &&
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.destinationAddress}</dt>
                      <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <span className="flex-grow">
                          {destinationLightningAddress?.value &&
                            <span>{destinationLightningAddress.value}</span>
                          }
                          {destinationAddress?.value &&
                            <span>{destinationAddress.value.slice(0, 5)}...{destinationAddress.value.slice(-5)}</span>
                          }
                        </span>
                        <span className="ml-4 flex-shrink-0">
                          {destinationAddress?.value &&
                            <a onClick={handleLinkClick} href={`${MEMPOOL_DOMAIN}/address/${destinationAddress.value}`} target="_blank" type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500 mr-3">
                              {language.view}
                            </a>
                          }
                        </span>
                      </dd>
                    </div>
                  }

                  {destinationTxHash?.value &&
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">{language.orderdetails.destinationHash}</dt>
                      <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <span className="flex-grow">
                          {destinationTxHash.value.slice(0, 5)}...{destinationTxHash.value.slice(-5)}
                        </span>
                        <span className="ml-4 flex-shrink-0">
                          <a onClick={handleLinkClick} href={`${MEMPOOL_DOMAIN}/tx/${destinationTxHash.value}`} target="_blank" type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500 mr-3">
                            {language.view}
                          </a>
                        </span>
                      </dd>
                    </div>
                  }
                </>
              }
              
            </dl>
          </div>
        }
        {loading &&
          <Spinner container />
        }
      </div>
      <RateDisclaimer modal={true} open={showRateDisclaimer} setOpen={setShowRateDisclaimer} />
    </div>
  )
}