import { useState, useEffect, useContext } from "react"
import { LanguageContext } from "../context/language.js"
import { ErrorContext } from "../context/error.js"
import { useFormContext } from "../context/form.js"
import { fetchBbApi } from "../utils/bullbitcoin.js"
import Spinner from "../components/spinner.js"
import {isValidIBAN, electronicFormatIBAN} from 'ibantools'

export default function CreateRecipient({recipient = {}, refetch, isInForm = false, allowedCurrency = false, onSelect}) {
  const language = useContext(LanguageContext)
  const { error, addError, removeError } = useContext(ErrorContext)
  const formContext = useFormContext()
  let updateFormData, formData

  if(formContext && formContext.updateFormData) {
    updateFormData = formContext.updateFormData
    formData = formContext.formData
  }

  const [loading, setLoading] = useState(false)
  const [destinationType, setDestinationType] = useState(recipient.recipientType ? recipient.recipientType : "")

  useEffect(() => {
    if(recipient && recipient.recipientType && recipient.recipientType !== destinationType) {
      setDestinationType(recipient.recipientType)
    }
  }, [recipient])

  const handleAddRecipient = async (e) => {
    e.preventDefault()

    setLoading(true)
    removeError()

    const label = e.target.elements.label.value
    let destination = e.target.elements.destination ? e.target.elements.destination.value : false

    if(!destination) {
      addError(language.createrecipient.errors.destination)
      setLoading(false)
      return false
    }

    if(allowedCurrency && destinationType === 'SINPE_MOVIL' && allowedCurrency !== "CRC" && allowedCurrency !== "BTC") {
      addError(language.createrecipient.errors.invalidCurrencyCreate)
      setLoading(false)
      return false
    }

    const isValidIban = isValidIBAN(electronicFormatIBAN((destination.toUpperCase().indexOf("CR") !== 0 ? `CR${destination}` : destination)))
    const isValidSinpe = destination.replace(/[^0-9]/gi, '').trim().length === 8

    if(destinationType === 'SINPE_MOVIL' && !isValidSinpe) {
      addError(language.createrecipient.errors.invalidSinpe)
      setLoading(false)
      return false
    }

    if(destinationType === 'IBAN_CR' && !isValidIban) {
      addError(language.createrecipient.errors.invalidIban)
      setLoading(false)
      return false
    }

    const element = {
      label,
    }

    if(recipient) {
      element.recipientId = recipient.recipientId
      element.ownerName = recipient.ownerName
    }

    if(destinationType === "SINPE_MOVIL") {
      destination = destination.replace(/[^0-9]/gi, '').trim()

      if(destination == process.env.REACT_APP_OUR_SINPE_NUMBER) {
        addError(language.createrecipient.errors.invalidSinpe)
        setLoading(false)
        return false
      }

      element.recipientType = "SINPE_MOVIL"
      element.phoneNumber = destination

      const sinpeCheckRes = await fetchBbApi({
        service: "api-recipients",
        method: "checkSinpe",
        params: {
          phoneNumber: destination,
        },
      })

      if(sinpeCheckRes.error) {
        if(sinpeCheckRes.data?.data?.errors?.phoneNumber) {
          addError(language.createrecipient[sinpeCheckRes.data.data.errors.phoneNumber[0].code])
        } else {
          addError(sinpeCheckRes.message)
        }

        setLoading(false)
        return false
      }
      
      element.ownerName = sinpeCheckRes.ownerName

    } else if(destinationType === "IBAN_CR") {
      destination = (destination.toUpperCase().indexOf("CR") !== 0 ? `CR${destination}` : destination)
      element.recipientType = "IBAN_CR"
      element.iban = destination

      const ibanCheckRes = await fetchBbApi({
        service: "api-recipients",
        method: "checkIbanCR",
        params: {
          iban: destination,
        },
      })

      if(ibanCheckRes.error) {
        if(ibanCheckRes.data?.data?.errors?.iban) {
          addError(language.createrecipient[ibanCheckRes.data.data.errors.iban[0].code])
        } else {
          addError(ibanCheckRes.message)
        }
        setLoading(false)
        return false
      }

      element.ownerName = ibanCheckRes.ownerName
      element.currency = ibanCheckRes.currency

      if(!element.ownerName || !element.currency) {
        addError(language.createrecipient.errors.invalidDestination)
        setLoading(false)
        return false
      }

      if(allowedCurrency && allowedCurrency !== "BTC" && element.currency !== allowedCurrency) {
        addError(language.createrecipient.errors.invalidCurrency)
        setLoading(false)
        return false
      }
    }

    if(!element.label) {
      element.label = element.ownerName
    }

    const response = await fetchBbApi({
      service: "api-recipients",
      method: (recipient.recipientId ? "updateMyRecipient" : "createMyRecipient"),
      params: {
        element,
      }
    })

    if(!response.error) {
      refetch()
      e.target.reset()
      setDestinationType("")

      if(isInForm) {
        updateFormData({recipient: response.element})
      }

      if(onSelect) {
        onSelect(response.element)
      }
    }

    setLoading(false)
  }

  const deleteRecipient = async () => {
    const conf = window.confirm(language.createrecipient.delete)

    if(!conf) {
      return false
    }

    setLoading(true)

    const postObj = {
      ...recipient,
      isArchived: true,
    }

    delete postObj.paymentProcessors

    const response = await fetchBbApi({
      service: "api-recipients",
      method: "updateMyRecipient",
      params: {
        element: postObj,
      },
    })

    setLoading(false)

    if(!response.error) {
      refetch()
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{recipient && recipient.recipientId ? language.createrecipient.editTitle : language.createrecipient.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{recipient && recipient.recipientId ? language.createrecipient.editSubtitle : language.createrecipient.subtitle}</p>
        </div>
      </div>
      <form className="mt-4" onSubmit={e => handleAddRecipient(e)}>        
        <div className="mb-4">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            {language.createrecipient.destinationTypeTitle}
          </label>
          <fieldset className="mt-2">
            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="sinpe-movil-option"
                  name="destinationType"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-red-700 focus:ring-red-600"
                  onChange={() => setDestinationType("SINPE_MOVIL")}
                  checked={destinationType === "SINPE_MOVIL"}
                />
                <label for="sinpe-movil-option" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  {language.sinpe}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="iban-option"
                  name="destinationType"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-red-700 focus:ring-red-600"
                  onChange={() => setDestinationType("IBAN_CR")}
                  checked={destinationType === "IBAN_CR"}
                />
                <label for="iban-option" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  {language.iban}
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        {destinationType !== "" &&
          <div className="mb-4">
            <label htmlFor="destination" className="block text-sm font-medium leading-6 text-gray-900">
              {destinationType === "SINPE_MOVIL" &&
                <span>{language.createrecipient.phoneNumberTitle}</span>
              }
              {destinationType === "IBAN_CR" &&
                <span>{language.iban}</span>
              }
            </label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                {destinationType === "SINPE_MOVIL" &&
                  <span>+(506)</span>
                }
                {destinationType === "IBAN_CR" &&
                  <span>CR</span>
                }
              </span>
              <input
                id="destination"
                type="text"
                name="destination"
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
                placeholder={destinationType === 'SINPE_MOVIL' ? "8783-3773" : "1234567890123"}
                defaultValue={(recipient.recipientType === 'SINPE_MOVIL' ? recipient.phoneNumber : recipient.iban)}
              />
            </div>
          </div>
        }

        <div className="flex-grow mb-4">
          <label htmlFor="label" className="block text-sm font-medium leading-6 text-gray-900">
            {language.createrecipient.nameTitle}
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="label"
              id="label"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-white dark:text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              placeholder={language.createrecipient.namePlaceholder}
              defaultValue={recipient.label}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {loading && <Spinner />}
          {recipient.recipientId &&
            <button
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled={loading}
              onClick={deleteRecipient}
            >
              {language.delete}
            </button>
          }
          <button
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            disabled={loading}
          >
            {language.save}
          </button>
        </div>
      </form>
    </div>
  )
}