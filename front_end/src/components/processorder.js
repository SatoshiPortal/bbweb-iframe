import { useState, useEffect, useContext, useRef, lazy } from "react"
import { Link } from 'react-router-dom'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

import { useFormContext } from "../context/form.js"
import { ErrorContext } from "../context/error.js"
import { LanguageContext } from "../context/language.js"

import { isInIframe } from "../utils/index.js"
import { fetchBbApi } from "../utils/bullbitcoin.js"

import Spinner from "../components/spinner.js"
import OrderReceipt from "../pages/OrderReceipt.js"

const QRCode = lazy(() => import("../components/qrcode.js"));

export default function ProcessOrder({}) {
  const language = useContext(LanguageContext)
  const { error, addError, removeError } = useContext(ErrorContext)
  const { formData, updateFormData } = useFormContext()
  const [ loading, setLoading ] = useState(true)
  const [ rpcLoading, setRpcLoading ] = useState(false)
  const [ success, setSuccess ] = useState(false)
  const [ order, setOrder ] = useState(formData.order || false)
  const [ loadingText, setLoadingText ] = useState(language.loading)
  const [ bolt11, setBolt11 ] = useState(false)
  const [ checkCount, setCheckCount ] = useState(0)
  const timer = useRef(null)

  const checkOrder = async () => {
    if(rpcLoading) {
      return
    }

    if(checkCount > 50) {
      return
    }

    console.log('process check order', checkCount)

    setRpcLoading(true)
    const response = await fetchBbApi({
      service: "api-orders",
      method: "getMyOrder",
      params: {
        orderId: order.orderId,
      }
    })

    if(response.error) {
      addError(response.message)
      setRpcLoading(false)
      return
    }

    if(response.element) {

      setOrder(response.element)
      removeError()

      if(response.element.orderType === "SELL") {
        if(response.element.inTransaction.status === "INITIALIZED") {
          const bolt11 = response.element.inTransaction.transactionPaymentProcessorData[0].value
          setBolt11(bolt11)
        } else if(response.element.inTransaction.status === "DONE") {
          setBolt11(null)
          setLoadingText(language.loadingMessages[Math.floor(Math.random() * language.loadingMessages.length)])
          setCheckCount(prevCount => prevCount + 1)
        }
      } else {
        if(response.element.inTransaction.status === "INITIALIZED") {
          setLoadingText(language.loadingMessages[Math.floor(Math.random() * language.loadingMessages.length)])
        } else {
          setLoadingText(language.loading)
        }

        setCheckCount(prevCount => prevCount + 1)
      }

      if(response.element.status === "DONE") {
        setSuccess(true)
        setLoading(false)
        setBolt11(false)
        setLoadingText(language.loading)
      }
    }

    setRpcLoading(false)
  }

  const sendRecipientSms = async () => {
    await fetch(`/api/send-recipient-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order),
    })
  }

  useEffect(() => {
    if(order && order.orderId) {

      if(order.status === "DONE" && order.orderType === "SELL") {
        sendRecipientSms()
      }

      if(order.status === "DONE" || checkCount > 50) {
        clearInterval(timer.current)
        setLoading(false)
        return
      }

      if(order.orderType === "BUY" && order.outTransaction.paymentProcessorCode === "OUT_BITCOIN") {
        clearInterval(timer.current)
        setLoading(false)
        setSuccess(true)
        return
      }
      
      timer.current = setInterval(checkOrder, 1000)
      return () => {
        clearInterval(timer.current)
      }
    }
  }, [order, rpcLoading, checkCount])

  useEffect(() => {
    if(bolt11) {
      if(window.ReactNativeWebView) {
        setLoadingText(language.processorder.paying)
        window.ReactNativeWebView.postMessage(JSON.stringify({action: "invoice", bolt11}))
      } else if(isInIframe()) {
        setLoadingText(language.processorder.paying)
        window.top.postMessage(JSON.stringify({action: "invoice", bolt11}), "*")
      } else {
        
      }
    }
  }, [bolt11])
  
  return (
    <div className="mt-5">
      {!success &&
        <div className="flex items-center">
          <div className="flex-auto">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{language.processorder.title}</h3>
            <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.processorder.subtitle}</p>
          </div>
        </div>
      }
      <div className="text-center grid place-items-center">
        {loading && 
          <Spinner container text={loadingText} />
        }

        {success &&
          <OrderReceipt order={order} confetti={true} />
        }

        {error &&
          <>
            <div><ExclamationTriangleIcon className="h-16 w-16 text-red-700" aria-hidden="true" /></div>
            <p>{language.processorder.error}</p>
          </>
        }

        {checkCount >= 50 &&
          <>
            <div className="mt-4"><ExclamationTriangleIcon className="h-16 w-16 text-orange-500" aria-hidden="true" /></div>
            <div className="my-4"><p>{language.processorder.timeoutError}</p></div>
            <div className="mb-4">
              <Link to={`/orders`} className="rounded-md bg-red-700 px-3 py-2 mx-2 text-center font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                {language.navigation.orders}
              </Link>
              <Link to={`/support`} className="font-semibold mx-2 px-3 py-2 text-red-700 hover:text-red-500">
                {language.home.contactBtnTitle}
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </>
        }

        {bolt11 && !window.ReactNativeWebView && !isInIframe() &&
          <>
            <QRCode 
              open={bolt11 ? true : false} 
              setOpen={setBolt11} 
              data={bolt11}
              title={language.invoice.pay} 
              copiedText={language.invoice.copied}
            />
          </>
        }
      </div>
    </div>
  )
}