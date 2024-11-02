import { useContext } from "react"
import { CheckIcon } from '@heroicons/react/24/solid'

import { useFormContext } from "../context/form.js"
import { LanguageContext } from "../context/language.js"
import { parseFiatNumber } from "../utils/index.js"

export default function CreateOrderProgress() {
  let steps = []

  const language = useContext(LanguageContext)
  const { formData, updateFormData } = useFormContext()
  const { action, paymentOption, amount, recipient, message, type, deposit, order } = formData

  console.log({action, paymentOption, recipient, amount, type, deposit, order})

  const amountSubtitle = () => {    
    let displayAmount = amount.amount

    if(amount.currency === "BTC") {
      displayAmount = Number(displayAmount).toString().padEnd(10, 0)
    } else {
      displayAmount = parseFiatNumber(displayAmount, amount.currency, language.lang)
    }

    return `${displayAmount} ${amount.currency}`
  }

  if(action === "buy") {
    steps = [
      { id: '1', name: language.createorderprogress.amount, onClick: () => updateFormData({amount: undefined, type: undefined, order: undefined}), subtitle: amount ? amountSubtitle() : "", status: amount ? 'complete' : 'current' },
      { id: '2', name: language.createorderprogress.method, onClick: () => updateFormData({type: undefined, order: undefined}),   subtitle: type ? `${language.createorderprogress[type]}/${language.createorderprogress[paymentOption]}` : "",  status: amount && type ? 'complete' : amount ? 'current' : 'upcoming' },
      { id: '3', name: language.createorderprogress.confirm, onClick: () => updateFormData({order: undefined}),  subtitle: order ? order.orderNbr : "", status: amount && type && order ? 'complete' : amount && type && !order ? 'current' : 'upcoming' },
      { id: '4', name: language.createorderprogress.deposit, onClick: () => updateFormData({deposit: undefined}), subtitle: deposit ? "Done" : "", status: amount && type && order && deposit ? 'complete' : amount && type && order && !deposit ? 'current' : 'upcoming' },

    ]

  } else if(action === "sell") {
      steps = [
        { id: '1', name: language.createorderprogress.amount, onClick: () => updateFormData({amount: undefined, order: false}), subtitle: amount ? amountSubtitle() : "", status: amount ? 'complete' : 'current' },
        { id: '2', name: language.createorderprogress.recipient, onClick: () => updateFormData({recipient: undefined, order: false,}), subtitle: recipient ? recipient.label.substr(0, 9) : "", status: amount && recipient ? 'complete' : amount ? 'current' : 'upcoming' },
        { id: '3', name: language.createorderprogress.message,  onClick: () => updateFormData({message: undefined, order: false}), subtitle: message ? message.substr(0, 9) : "", status: amount && recipient && message ? 'complete' : amount && recipient ? 'current' : 'upcoming' },
        { id: '4', name: language.createorderprogress.confirm, subtitle: order?.orderNbr, status: amount && recipient && message && order ? 'complete' : amount && recipient && message ? 'current' : 'upcoming' },
      ]
  }

  return (
    <nav aria-label="Progress" className="-mt-2 -mx-2 md:mt-0 md:mx-0">
      <ol role="list" className="h-16 divide-y divide-gray-300 rounded-t-md md:rounded-md border border-gray-300 flex divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative flex flex-1">
            {step.status === 'complete' ? (
              <a onClick={step.onClick} className="group flex w-full items-center">
                <span className="flex items-center md:px-1 py-1 text-sm font-medium">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-700 group-hover:bg-red-800">
                    <CheckIcon className="h-2 w-2 text-white" aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-col ml-0 md:ml-2">
                    <span className="text-xs md:text-lg font-medium text-black">{step.name}</span>
                    <span className="text-xs font-medium text-gray-500 block">{step.subtitle && step.subtitle.length > 0 ? step.subtitle : " "}</span>
                  </span>
                </span>
              </a>
            ) : step.status === 'current' ? (
              <a className="flex items-center md:px-1 py-1 text-sm font-medium" aria-current="step">
                <span className="flex  h-5 w-5  flex-shrink-0 items-center justify-center rounded-full border-2 border-red-600">
                  <span className="text-red-700">{step.id}</span>
                </span>
                <span className="flex min-w-0 flex-col ml-0 md:ml-2">
                  <span className="text-xs md:text-lg font-medium text-black">{step.name}</span>
                  <span className="text-sm font-medium text-gray-500 block">{step.subtitle && step.subtitle.length > 0 ? step.subtitle : " "}</span>
                </span>
              </a>
            ) : (
              <a className="group flex items-center">
                <span className="flex items-center md:px-1 py-1 text-sm font-medium">
                  <span className="flex  h-5 w-5  flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                  </span>
                  <span className="flex min-w-0 flex-col ml-0 md:ml-2">
                    <span className="text-xs md:text-lg font-medium text-black">{step.name}</span>
                    <span className="text-sm font-medium text-gray-500 block">{step.subtitle && step.subtitle.length > 0 ? step.subtitle : " "}</span>
                  </span>
                </span>
              </a>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
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
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
