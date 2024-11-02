import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRightIcon, PencilIcon } from '@heroicons/react/20/solid'

import { LanguageContext } from "../context/language.js"
import { ErrorContext } from "../context/error.js"
import { fetchBbApi } from "../utils/bullbitcoin.js"
import Spinner from "../components/spinner.js"
import CreateRecipient from "../components/createrecipient.js"

export default function Recipients({isInForm = false, filterCurrency = false, onSelect}) {
  const language = useContext(LanguageContext)
  const { error, addError, removeError } = useContext(ErrorContext)
  const [recipients, setRecipients] = useState([])
  const [showCreate, setShowCreate] = useState(isInForm ? true : false)
  const [edit, setEdit] = useState({})
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const pageSize = 15

  const fetchRecipients = async () => {
    setLoading(true)
    const response = await fetchBbApi({
      service: "api-recipients",
      method: "listMyRecipients",
      params: {
        paginator: {
          page: parseInt(page),
          pageSize,
        },
        sortBy: {
          id: "label",
          sort: "asc",
        },
        filters: {
          recipientType: [
            "SINPE_MOVIL", 
            "IBAN_CR",
          ],
          isArchived: false,
        },
      }
    })
    setLoading(false)

    if(response.error) {
      addError(response.error)
      return
    }

    let output = response.elements.filter((recipient) => {

      if(!filterCurrency || filterCurrency === "BTC") {
        return true
      }

      if(recipient.recipientType === "SINPE_MOVIL") {
        if(filterCurrency !== "CRC") {
          return false
        }

        return true
      }

      if(recipient.currency !== filterCurrency) {
        return false
      }

      return true
    })

    setTotal(response.totalElements)
    setRecipients(output)
    setEdit({})
  }

  useEffect(() => {
    fetchRecipients()
  }, [page])

  return (
    <div className={isInForm ? "mt-5" : "px-4 sm:px-6 lg:px-8"}>
      {!isInForm &&
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{language.recipients.title}</h3>
            <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.recipients.subtitle}</p>
          </div>
        </div>
      }
      <div className="mt-2 sm:mt-8 flow-root">
        <nav className="isolate flex mb-2" aria-label="Tabs">
          <a onClick={() => setShowCreate(true)} className={`${showCreate ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'} border rounded-l group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10`}>
            <span>{language.createrecipient.title}</span>
            <span
              aria-hidden="true"
              className={`${showCreate ? 'bg-red-700' : 'bg-transparent'} absolute inset-x-0 bottom-0 h-1`}
            />
          </a>

          <a onClick={() => setShowCreate(false)} className={`${!showCreate ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'} border rounded-r group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10`}>
            <span>{language.my} {language.recipients.title}</span>
            <span
              aria-hidden="true"
              className={`${!showCreate ? 'bg-red-700' : 'bg-transparent'} absolute inset-x-0 bottom-0 h-1`}
            />
          </a>
        </nav>

        {showCreate &&
          <CreateRecipient 
            recipient={edit} 
            refetch={() => {
              fetchRecipients()
              setShowCreate(false)
            }}
            isInForm={isInForm} 
            allowedCurrency={filterCurrency}
            onSelect={onSelect}
          />
        }
        {recipients.length > 0 && !showCreate &&
          <div>
            {isInForm &&
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">{language.recipients.selectTitle}</h3>
                  <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.recipients.selectSubtitle}</p>
                </div>
              </div>
            }
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {recipients.map((recipient) => (
                <li key={recipient.recipientId} className="col-span-1 divide-y divide-gray-300 rounded-lg bg-white shadow dark:border dark:border-black">
                  <div className="flex w-full items-center justify-between space-x-6 p-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm font-medium text-gray-900">{recipient.label}</h3>
                        <span className="inline-flex flex-shrink-0 items-center rounded-md bg-green-50 px-1 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {recipient.recipientType === "SINPE_MOVIL" &&
                            <span>{language.sinpe}</span>
                          } 
                          {recipient.recipientType === "IBAN_CR" &&
                            <span>{language.iban}</span>
                          }
                        </span>
                      </div>
                      <p className="truncate text-sm text-gray-500">{recipient.ownerName}</p>
                      <p className="truncate text-sm text-gray-500">{recipient.phoneNumber || recipient.iban}</p>
                    </div>
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-300">
                      <div className="flex w-0 flex-1">
                        {!onSelect &&
                          <Link
                            to="/sell"
                            state={{recipient: recipient}}
                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                          >
                            <ArrowUpRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            {language.recipients.sendBtn}
                          </Link>
                        }
                        {onSelect &&
                          <button
                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                            onClick={() => onSelect(recipient)}
                          >
                            <ArrowUpRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            {language.recipients.select}
                          </button>
                        }
                      </div>
                      <div className="-ml-px flex w-0 flex-1">
                        <a
                          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                          onClick={() => {
                            setEdit(recipient)
                            setShowCreate(true)
                          }}
                        >
                          <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          {language.edit}
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-end mt-5">
              {loading &&
                <Spinner />
              }

              {page > 1 &&
                <button className="ml-5 text-black" onClick={() => setPage(page - 1)}>{language.previous}</button>
              }
              
              {total > (page * pageSize) &&
                <button className="ml-5 text-black" onClick={() => setPage(page + 1)}>{language.next}</button>
              }
            </div>
          </div>
        }
        {!loading && !recipients.length && !showCreate &&
          <p>{language.recipients.none}</p>
        }
        {loading && !recipients.length && !showCreate &&
          <Spinner container />
        }
      </div>
    </div>
  )
}
