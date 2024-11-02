import { useContext } from "react"
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import { LanguageContext } from "../context/language.js"

export default function Rules({action}) {
  const language = useContext(LanguageContext)

  const rules = [
    {text: language.rules.one},
    {text: language.rules.two},
    {text: language.rules.three},
    {text: language.rules.four},
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <h3 className="text-base font-semibold leading-7 text-gray-900">{language.rules.title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.rules.subtitle}</p>
      </div>
      <div className="mt-2 sm:mt-8 flow-root">
        <dl className="space-y-5">
          {rules.map((rule, i) => (
            <div key={i}>
              <dt className="text-base font-semibold leading-7 text-gray-900">{language.rules.rule} {i + 1}</dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">{rule.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {language.rules.after}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            onClick={action}
          >
            {language.continue}
          </button>
        </div>
      </div>
    </div>
  )
}