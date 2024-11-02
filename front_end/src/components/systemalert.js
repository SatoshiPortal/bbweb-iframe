import { useContext } from "react"
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import { AlertContext } from "../context/alert.js"
import { LanguageContext } from "../context/language.js"

export default function SystemAlert() {
  const alertData = useContext(AlertContext)
  const language = useContext(LanguageContext)

  if(!alertData.data || !alertData.data.alert || !alertData.data.alert.active) {
    return null
  }

  return (
    <div className="mt-2 mb-2 border-4 border-red-400 bg-red-50 p-2 text-center">
      <h6 className="text-red-700 dark:text-red-800">🚨 {language.systemAlertTitle} 🚨</h6>
      <p className="text-sm text-red-700 dark:text-red-800">
        {new Date(alertData.data.alert.timestamp).toLocaleString()}
        <br />{alertData.data.alert.message}
      </p>
    </div>
  )
}