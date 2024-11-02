import { useContext } from "react"
import { LanguageContext } from "../context/language.js"
import { handleLinkClick } from "../utils/index.js"

export default function Support() {
  const language = useContext(LanguageContext)
 
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <h3 className="text-base font-semibold leading-7 text-gray-900">{language.support.title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.support.subtitle}</p>
      </div>
      <div className="mt-2 sm:mt-8 flow-root">

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
          
          <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{language.support.whatsapp}</h3>
            <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
              <div>
                <dt className="sr-only">{language.support.whatsapp}</dt>
                <dd>
                  <a className="font-semibold text-red-700" onClick={handleLinkClick} href={`whatsapp://send?phone=+16055555555`}>
                    +1 (605) 555-5555
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{language.support.faq}</h3>
            <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
              <div>
                <dt className="sr-only">{language.support.faq}</dt>
                <dd>
                  <a className="font-semibold text-red-700" onClick={handleLinkClick} href="https://www.bullbitcoin.com" target="_blank">
                    bullbitcoin.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{language.support.email}</h3>
            <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
              <div>
                <dt className="sr-only">{language.support.email}</dt>
                <dd>
                  <a className="font-semibold text-red-700" onClick={handleLinkClick} href="mailto:support@bullbitcoin.com">
                    support@bullbitcoin.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{language.support.twitter}</h3>
            <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
              <div>
                <dt className="sr-only">{language.support.twitter}</dt>
                <dd>
                  <a className="font-semibold text-red-700" onClick={handleLinkClick} href="https://twitter.com/bullbitcoin_" target="_blank">
                    @BullBitcoin_
                  </a>
                </dd>
              </div>
            </dl>
          </div>

        </div>
 

      </div>
    </div>
  )
}