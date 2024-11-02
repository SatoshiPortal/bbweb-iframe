import { useState, useContext } from "react"
import { useFormContext } from "../context/form.js"
import { ErrorContext } from "../context/error.js"
import { LanguageContext } from "../context/language.js"
import { AlertContext } from "../context/alert.js"
import { getLanguage, getSatBalance } from "../utils/index.js"
import { localize } from "../lang/index.js"

export default function Amount() {
  const language = useContext(LanguageContext)
  const alertData = useContext(AlertContext)
  const { formData, updateFormData } = useFormContext()
  const { error, addError, removeError } = useContext(ErrorContext)
  const satBalance = getSatBalance()
  const { action } = formData

  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("CRC")

  const handleClick = (myAmount, myCurrency) => {
    const updateAmount = myAmount || amount
    const updateCurrency = myCurrency || currency

    if(!updateAmount) {
      addError(language.amount.errors.amount)
      return
    }

    let parsedAmount = parseFloat(Number(parseFloat(updateAmount)).toFixed((updateCurrency === "BTC" ? 8 : 2)))

    if(!parsedAmount) {
      addError(language.amount.errors.invalidAmount)
      return
    }

    if(parsedAmount != parseFloat(updateAmount)) {
      addError(language.amount.errors.invalidAmount)
      return
    }

    if(parsedAmount <= 0) {
      addError(language.amount.errors.invalidAmount)
      return
    }

    if(!updateCurrency) {
      addError(language.amount.errors.currency)
      return
    }

    if(formData.recipient && updateCurrency !== "BTC") {
      if(formData.recipient.recipientType === "SINPE_MOVIL" && updateCurrency !== "CRC") {
        addError(language.amount.errors.invalidCurrency)
        return
      }

      if(formData.recipient.recipientType === "IBAN_CR" && formData.recipient.currency !== updateCurrency) {
        addError(language.amount.errors.invalidCurrency)
        return
      }
    }

    if(updateCurrency === "BTC") {
      parsedAmount = parseFloat(parsedAmount / 100000000)
    }

    if(alertData && alertData.data && alertData.data.currencies[updateCurrency.toLowerCase()] && alertData.data.currencies[updateCurrency.toLowerCase()][action.toLowerCase()] === false) {
      addError(language.amount.errors.disabledCurrency)
      return
    }

    updateFormData({amount: {amount: parsedAmount, currency: updateCurrency}})
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      handleClick()
    }
  }
  
  return (
    <div className="mt-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.amount.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{(action === 'sell' ? language.amount.subtitle : language.amount.buySubtitle)}</p>
        </div>
      </div>
      <div className="mt-2 sm:mt-8 flow-root max-w-2xl mx-auto">

        <div>
          <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
            {language.amount.title}
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">{currency === "CRC" ? "₡" : currency === "USD" ? "$" : "₿"}</span>
            </div>
            <input
              type="text"
              name="amount"
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value.replaceAll(/[^0-9.]/g, ""))}
              onKeyDown={handleKeyDown}
              value={amount}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="currency" className="sr-only">
                Currency
              </label>
              <select
                onChange={(e) => setCurrency(e.target.value)}
                value={currency}
                id="currency"
                name="currency"
                className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm"
              >
                <option className="text-gray-500" value="CRC">{language.crc}</option>
                <option className="text-gray-500" value="USD">{language.usd}</option>
                <option className="text-gray-500" value="BTC">{language.sats}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {satBalance > 0 && action === 'sell' &&
            <button
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                if(window.confirm(language.amount.satsBtnConfirm)) {
                  handleClick(parseInt(satBalance), "BTC")
                }
              }}
            >
              {language.amount.satsBtn}
            </button>
          }
          <button
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            onClick={() => handleClick()}
          >
            {language.continue}
          </button>
        </div>

      </div>
    </div>
  )
}