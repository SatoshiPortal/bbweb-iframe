import { useContext, useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

import { FormProvider } from "../context/form.js"
import { LanguageContext } from "../context/language.js"

import { fetchBbApi } from "../utils/bullbitcoin.js"

import SellForm from "../components/sellform.js"
import Spinner from "../components/spinner.js"

export default function Sell() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const language = useContext(LanguageContext)
  const [loading, setLoading] = useState(true)
  const [permissionError, setPermissionError] = useState(false)

  const canSell = async () => {
    setLoading(true)

    const response = await fetchBbApi({
      service: "api-orders",
      method: "getMyBestOption",
      params: {
        amount: 2000,
        isInAmountFixed: false,
        inPaymentProcessor: "IN_LN",
        outPaymentProcessor: "OUT_CRC_RDV_SINPE",
      }
    })

    setLoading(false)

    if(response.error) {
      if(response.data?.status === 401) {
        setPermissionError(language.rules.noPermission)
      } else if(response.data?.data && ['MISSING_GROUP', 'poAccessGroupFilter'].indexOf(response.data.data[0].data) !== -1) {
        setPermissionError(language.rules.noSellPermission)
      } else {
        setPermissionError(language.rules.dailyLimitHit)
      }
    }
  }

  useEffect(() => {
    canSell()
  }, [])

  return (
    <FormProvider defaultRecipient={state ? state.recipient : null} defaultPaymentOption={state ? state.paymentOption : null}>
      <div className="flow-root">
        {loading && 
          <Spinner container text={language.rules.checkingPermission} />
        }

        {!loading && permissionError &&
          <div className="text-center grid place-items-center">
            <div>
              <ExclamationTriangleIcon className="h-16 w-16 text-red-700" aria-hidden="true" />
            </div>
            <div className="m-4 border-red-700 bg-red-50 p-4">
              <p className="text-red-700 dark:text-black">
                {permissionError}
              </p>
            </div>
            <div>
              <Link to={`/settings`} className="rounded-md dark:text-black bg-red-700 px-3 py-2 mx-2 text-center font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                {language.navigation.manage}
              </Link>
              <Link to={`/support`} className="font-semibold mx-2 px-3 py-2 text-red-700 hover:text-red-500">
                {language.home.contactBtnTitle}
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        }

        {!loading && !permissionError &&
          <SellForm />
        }
      </div>
    </FormProvider>
  )
}