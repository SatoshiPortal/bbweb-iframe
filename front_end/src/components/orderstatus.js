import { useContext } from "react"
import { LanguageContext } from "../context/language.js"

export default function OrderStatus({order}) {
  const language = useContext(LanguageContext)

  if(order.isCanceled) {
    return (
      <span className="inline-flex flex-shrink-0 items-center rounded-md bg-red-50 px-1 py-1 text-xs font-medium text-red-700 dark:text-red-800 ring-1 ring-inset ring-red-600/20">
        {language.canceled}
      </span>
    )
  }

  return (
    <span className="inline-flex flex-shrink-0 items-center rounded-md bg-green-50 px-1 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
      {language[order.status] || order.status}
    </span>
  )
}