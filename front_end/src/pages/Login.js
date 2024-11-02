import { getRedirectUrl } from "../utils/index.js"
import { BoltIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"

export default function Login({ language }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
          <span className="text-red-700">Bull Bitcoin</span>
        </h1>
        <p className="text-xl text-gray-900 mb-8 max-w-3xl mx-auto">
          {language.login.welcome}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg">
          <h3 className="text-xl font-semibold mb-4 dark:text-black">{language.login.newUserHeader}</h3>
          <p className="text-gray-900 mb-6">
            {language.login.newUserText}
          </p>
          <a
            href={getRedirectUrl(language.lang, 'registration')}
            className="inline-flex items-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-black"
          >
            {language.login.newUserBtn}
          </a>
        </div>

        <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg">
          <h3 className="text-xl font-semibold mb-4 dark:text-black">{language.login.returningUserHeader}</h3>
          <p className="text-gray-900 mb-6">
            {language.login.returningUserText}
          </p>
          <a
            href={getRedirectUrl(language.lang, 'login')}
            className="font-semibold text-red-700 hover:text-red-500"
          >
            {language.login.returningUserBtn}
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg text-center">
          <div className="text-red-600 text-4xl w-12 h-12 mx-auto mb-4">₿</div>
          <h2 className="text-xl font-bold mb-2 dark:text-black">{language.login.bitcoinOnlyTitle}</h2>
          <p className="text-gray-900">{language.login.bitcoinOnly}</p>
        </div>
        <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg text-center">
          <BoltIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 dark:text-black">{language.login.lightningFastTitle}</h2>
          <p className="text-gray-900">{language.login.lightningFast}</p>
        </div>
        <div className="bg-gray-50 p-10 dark:bg-white dark:border dark:border-black rounded-lg text-center">
          <ShieldCheckIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 dark:text-black">{language.login.selfCustodialTitle}</h2>
          <p className="text-gray-900">{language.login.selfCustodial}</p>
        </div>
      </div>
    </div>
  )
}