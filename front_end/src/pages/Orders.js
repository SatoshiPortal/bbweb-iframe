import { useState, useEffect, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"

import { LanguageContext } from "../context/language.js"
import { ErrorContext } from "../context/error.js"
import Spinner from "../components/spinner.js"
import NewOrder from "../components/neworder.js"
import OrderStatus from "../components/orderstatus.js"
import { fetchBbApi } from "../utils/bullbitcoin.js"
import { parseFiatNumber } from "../utils/index.js"

export default function Orders() {
  const { page = 1 } = useParams()
  const navigate = useNavigate()
  const { error, addError, removeError } = useContext(ErrorContext)

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [showNewOrder, setShowNewOrder] = useState(false)

  const pageSize = 5

  const language = useContext(LanguageContext)

  const fetchOrders = async () => {
    setLoading(true)

    const response = await fetchBbApi({
      service: "api-orders",
      method: "listMyOrders",
      params: {
        paginator: {
          page: parseInt(page),
          pageSize,
        },
        sortBy: {
          id: "createdAt",
          sort: "desc",
        },
        filters: {
          isArchived: false,
        },
      }
    })

    if(response.error) {
      addError(response.message)
    }

    if(response.elements) {
      setTotal(response.totalElements)
      setOrders(response.elements.sort((a,b) => a.createdAt > b.createdAt ? 1 : a.createdAt < b.createdAt ? -1 : 0).reverse())
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [page])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.orders.title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.orders.subtitle}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            className="block rounded-md bg-red-700 px-3 py-2 text-center text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={() => setShowNewOrder(true)}
          >
            {language.orders.createBtn}
          </a>
        </div>
      </div>

      <div className="mt-2 sm:mt-8 flow-root">
        {orders.length > 0 && 
          <div>
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    {language.orders.date}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    {language.orders.amount}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    {language.orderdetails.destination}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    {language.orders.type}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    {language.orders.status}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
                {orders.map((order) => {
                  const recipientParentObj = order?.outTransaction?.transactionPaymentProcessorData.find((el) => el.paymentProcessorData.paymentProcessorDataCode === 'recipientDetails')
                  let recipientObj = {}

                  if(recipientParentObj && recipientParentObj.value) {
                    try {
                      recipientObj = JSON.parse(recipientParentObj.value)
                    } catch(e) {
                      
                    }
                  }

                  return (
                    <tr key={order.orderId}>
                      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                        {new Date(order.createdAt).toLocaleString()}
                        <dl className="font-normal lg:hidden">
                          <dt className="sr-only">{language.orders.amount}</dt>
                          <dd className="truncate text-gray-700">
                            {order.orderType === "SELL" &&
                              <span>{parseFiatNumber(order.outAmount, order.outPaymentProcessorCurrencyCode, language.lang)} {order.outTransaction.paymentProcessor.currencyCode}</span>
                            }
                            {order.orderType === "BUY" &&
                              <span>{parseFiatNumber(order.inAmount, order.inPaymentProcessorCurrencyCode, language.lang)} {order.inTransaction.paymentProcessor.currencyCode}</span>
                            }
                          </dd>
                          <dd className="truncate text-gray-700">
                            {recipientObj?.ownerName}
                          </dd>
                          <dd className="truncate text-gray-700">{language.orderdetails[order.orderType]}</dd>
                          <dt className="sr-only sm:hidden">{language.orders.status}</dt>
                          <dd className="truncate text-gray-500 sm:hidden">
                            <OrderStatus order={order} />
                          </dd>
                        </dl>
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        {order.orderType === "SELL" &&
                          <span>{parseFiatNumber(order.outAmount, order.outPaymentProcessorCurrencyCode, language.lang)} {order.outTransaction.paymentProcessor.currencyCode}</span>
                        }
                        {order.orderType === "BUY" &&
                          <span>{parseFiatNumber(order.inAmount, order.inPaymentProcessorCurrencyCode, language.lang)} {order.inTransaction.paymentProcessor.currencyCode}</span>
                        }
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{recipientObj?.ownerName}</td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{language.orderdetails[order.orderType]}</td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        <OrderStatus order={order} />
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link to={`/order/${order.orderId}`} className="text-red-700 hover:text-red-900">
                          {language.orders.viewBtn}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-end mt-5">
              {loading &&
                <Spinner />
              }

              {page > 1 &&
                <button className="ml-5 text-black" onClick={() => navigate(`/orders/${parseInt(page) - 1}`)}>{language.previous}</button>
              }
              
              {total > (page * pageSize) &&
                <button className="ml-5 text-black" onClick={() => navigate(`/orders/${parseInt(page) + 1}`)}>{language.next}</button>
              }
            </div>
          </div>
        }
        {!loading && !orders.length &&
          <p>{language.orders.none}</p>
        }
        {loading && !orders.length &&
          <Spinner container />
        }
      </div>
      <NewOrder language={language} open={showNewOrder} setOpen={setShowNewOrder} />
    </div>
  )
}