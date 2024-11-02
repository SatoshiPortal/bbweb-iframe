import { useState, useContext } from "react"
import { useFormContext } from "../context/form.js"
import { LanguageContext } from "../context/language.js"

export default function Message({}) {
  const { formData, updateFormData } = useFormContext()
  const language = useContext(LanguageContext)

  const [message, setMessage] = useState("")

  const handleClick = () => {
    let minLength = 1
    let newMessage = message

    if(formData.recipient.recipientType === "IBAN_CR") {
      minLength = 15
    }

    if(message.length < minLength) {
      newMessage = newMessage.padEnd(16, "_")
    }

    if(!message.length) {
      newMessage = " "
    }

    updateFormData({message: newMessage})
  }

  const handleChange = async (e) => {
    let val = e.target.value.replaceAll(/bitcoin|btc|sats|cripto|crypto|bit |\p{S}/gi, '')
    let maxLength = 50

    if(formData.recipient.recipientType === "SINPE_MOVIL") {
      maxLength = 15
    }

    if(val.length >= maxLength) {
      val = val.substr(0, maxLength)
    }

    setMessage(val)
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
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.message.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.message.subtitle}</p>
        </div>
      </div>
      <div className="mt-2 sm:mt-8 flow-root max-w-2xl mx-auto">

        <div>
          <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
            {language.message.title}
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="message"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-white dark:text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
              placeholder={language.message.placeholder}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              value={message}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            onClick={handleClick}
          >
            {language.continue}
          </button>
        </div>

      </div>
    </div>
  )
}