import { Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

const banks = [
  {name: 'Grupo BAC Credomatic', imageUrl: 'bac.jpeg', phone: '+50670701222' },
  {name: 'Banco de Costa Rica', imageUrl: 'bcr.jpeg', phone: '4066'},
  {name: 'Banco Nacional', imageUrl: 'bn.jpeg', phone: '2627'},
  {name: 'Banco Lafise', imageUrl: 'lafise.jpeg', phone: '9091'},
  {name: 'Davivienda', imageUrl: 'davivienda.jpeg', phone: '+50670707474'},
  {name: 'Promerica', imageUrl: 'promerica.jpeg', phone: '+50662232450'},
  {name: 'Coopealianza', imageUrl: 'coopealianza.png', phone: '+50662229523'},
]

export default function SendSms({language, open, setOpen, amount, locator, setSent}) {
  const message = `PASE ${amount} 87833773 ${locator}`

  const sendSms = (e, phone) => {
    if(window.ReactNativeWebView) {
      e.preventDefault()

      window.ReactNativeWebView.postMessage(JSON.stringify({action: "sendSms", to: phone, message }))
    }

    setOpen(false)
    setSent(true)
  }

  useEffect(() => {
    const update = () => setSent(true)

    window.addEventListener("smsSent", update)

    return () => window.removeEventListener("smsSent", update)
  }, [])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-9" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-9 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <BuildingLibraryIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {language.sendsms.title}
                    </Dialog.Title>
                    <Dialog.Description>
                      {language.sendsms.subtitle}
                    </Dialog.Description>
                  </div>
                </div>
                <div className="mt-5">
                  <ul
                    role="list"
                    className="max-h-64 overflow-y-scroll divide-y divide-gray-300 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
                  >
                    {banks.map((bank) => (
                      <li key={bank.name} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                        <div className="flex items-center min-w-0 gap-x-4">
                          <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={`/bank-icons/${bank.imageUrl}`} alt="" />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              <a onClick={(e) => sendSms(e, bank.phone)} href={`sms:${bank.phone}?body=${window.encodeURIComponent(message)}`}>
                                <span className="absolute inset-x-0 -top-px bottom-0" />
                                {bank.name}
                              </a>
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-x-4">
                          <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
