import { useContext, useEffect } from "react"
import { usePosContext } from "../context/pos.js"
import { handleLinkClick } from "../utils/index.js"
import { LanguageContext } from "../context/language.js"
import CreatePointOfSaleProgress from "./createpointofsaleprogress.js"
import ApiAuth from "./apiauth.js"
import Recipients from "./recipients.js"
import POSStore from "./posstore.js"
import PercentSlider from "./percentslider.js"

export default function POSForm({}) {
  const { formData, updateFormData } = usePosContext()
  const language = useContext(LanguageContext)
  const { token, recipientId, percent, storeId } = formData

  return (
    <>
      <CreatePointOfSaleProgress />

      {!token &&
        <ApiAuth />
      }

      {token && !recipientId &&
        <Recipients
            onSelect={(recipient) => updateFormData({recipientId: recipient.recipientId})} 
        />
      }

      {token && recipientId && !percent &&
        <PercentSlider />
      }

      {token && recipientId && percent && !storeId &&
        <POSStore />
      }

      {token && recipientId && percent && storeId &&
        <div className="mt-5">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">{language.posform.title}</h3>
                    <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.posform.subtitle}</p>
                </div>
            </div>
            <div className="mt-2 sm:mt-8 flow-root max-w-2xl mx-auto">
                <a 
                    onClick={handleLinkClick} 
                    href={`${process.env.REACT_APP_BTCPAY_BASE_URL}/apps/${storeId}/pos`} 
                    className="block rounded-md bg-red-700 px-3 py-2 text-center text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                    {language.posform.open}
                </a>
            </div>
        </div>
      }
    </>
  )
}
