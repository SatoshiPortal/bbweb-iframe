import { useContext } from "react"
import { CheckIcon } from '@heroicons/react/24/solid'

import { usePosContext } from "../context/pos.js" // New import for POS context
import { LanguageContext } from "../context/language.js"

export default function CreatePointOfSaleProgress() {
  const { formData } = usePosContext()
  const { token, recipientId, percent, storeId } = formData
  const language = useContext(LanguageContext)

  const steps = [
    { id: '1', name: language.createpointofsaleprogress.authenticate, status: token ? 'complete' : 'current' },
    { id: '2', name: language.createpointofsaleprogress.recipient, status: recipientId ? 'complete' : token ? 'current' : 'upcoming' },
    { id: '3', name: language.createpointofsaleprogress.percent, status: percent ? 'complete' : recipientId ? 'current' : 'upcoming' },
    { id: '4', name: language.createpointofsaleprogress.create, status: storeId ? 'complete' : percent ? 'current' : 'upcoming' },
  ]

  return (
    <nav aria-label="Progress" className="-mt-2 -mx-2 md:mt-0 md:mx-0">
      <ol role="list" className="h-16 divide-y divide-gray-300 rounded-t-md md:rounded-md border border-gray-300 flex divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative flex flex-1">
            {step.status === 'complete' ? (
              <a className="group flex w-full items-center">
                <span className="flex items-center md:px-1 py-1 text-sm font-medium">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-700 group-hover:bg-red-800">
                    <CheckIcon className="h-2 w-2 text-white" aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-col ml-0 md:ml-2">
                    <span className="text-xs md:text-lg font-medium text-black">{step.name}</span>
                    <span className="text-xs font-medium text-gray-500 block">{step.subtitle || " "}</span>
                  </span>
                </span>
              </a>
            ) : step.status === 'current' ? (
              <a className="flex items-center md:px-1 py-1 text-sm font-medium" aria-current="step">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-red-600">
                  <span className="text-red-700">{step.id}</span>
                </span>
                <span className="flex min-w-0 flex-col ml-0 md:ml-2">
                  <span className="text-xs md:text-lg font-medium text-black">{step.name}</span>
                  <span className="text-sm font-medium text-gray-500 block">{step.subtitle || " "}</span>
                </span>
              </a>
            ) : (
              <a className="group flex items-center">
                <span className="flex items-center md:px-1 py-1 text-sm font-medium">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                  </span>
                  <span className="flex min-w-0 flex-col ml-0 md:ml-2">
                    <span className="text-xs md:text-lg font-medium text-black">{step.name}</span>
                    <span className="text-sm font-medium text-gray-500 block">{step.subtitle || " "}</span>
                  </span>
                </span>
              </a>
            )}

            {stepIdx !== steps.length - 1 ? (
              <div className="absolute right-0 top-0 h-full w-5 block" aria-hidden="true">
                <svg
                  className="h-full w-full text-gray-300"
                  viewBox="0 0 22 80"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 -2L20 40L0 82"
                    vectorEffect="non-scaling-stroke"
                    stroke="currentcolor"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}