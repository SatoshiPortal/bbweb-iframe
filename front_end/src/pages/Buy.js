import { useContext, useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

import { FormProvider } from "../context/form.js"
import { LanguageContext } from "../context/language.js"

import { fetchBbApi } from "../utils/bullbitcoin.js"

import BuyForm from "../components/buyform.js"
import Rules from "../components/rules.js"
import Spinner from "../components/spinner.js"

export default function Buy() {
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const language = useContext(LanguageContext)
  const [loading, setLoading] = useState(true)
  const [permissionError, setPermissionError] = useState(false)

  const setSeen = () => {
    navigate('/buy/amount')
  }

  const canBuy = async () => {
    setLoading(true)
    
    const [response, response2] = await Promise.all([
      fetchBbApi({
        service: "api-orders",
        method: "getMyBestOption",
        params: {
          amount: 2000,
          isInAmountFixed: true,
          inPaymentProcessor: "IN_CRC_RDV_SINPE",
          outPaymentProcessor: "OUT_LN",
        }
      }),
      fetchBbApi({
        service: "api-orders",
        method: "getMyBestOption",
        params: {
          amount: 2000,
          isInAmountFixed: true,
          inPaymentProcessor: "IN_CRC_RDV_IBAN",
          outPaymentProcessor: "OUT_LN",
        }
      }),
    ])

    setLoading(false)

    if(response.error && response2.error) {
      if(response.data?.status === 401 && response2.data?.status === 401) {
        setPermissionError(language.rules.noPermission)
      } else if (
        (response.data?.data && ['MISSING_GROUP', 'poAccessGroupFilter'].indexOf(response.data.data[0].data) !== -1)
         && 
        (response2.data?.data && ['MISSING_GROUP', 'poAccessGroupFilter'].indexOf(response2.data.data[0].data) !== -1)
      ) {
        setPermissionError(language.rules.noBuyPermission)
      } else {
        setPermissionError(language.rules.dailyLimitHit)
      }
    }
  }

  useEffect(() => {
    canBuy()
  }, [])

  return (
    <FormProvider defaultRecipient={state ? state.recipient : null}> 
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
              <Link to={`/settings`} className="rounded-md bg-red-700 px-3 py-2 mx-2 text-center font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:text-black">
                {language.navigation.manage}
              </Link>
              <Link to={`/support`} className="font-semibold mx-2 px-3 py-2 text-red-700 hover:text-red-500">
                {language.home.contactBtnTitle}
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        }

        {!loading && !permissionError && pathname === "/buy" &&
          <Rules action={setSeen} />
        }

        {!loading && !permissionError && pathname !== "/buy" &&
          <BuyForm />
        }
        
      </div>
    </FormProvider>
  )
}