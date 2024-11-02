import { useState, Fragment } from 'react'
import { QRCode } from "react-qrcode-logo"

import { Dialog, Transition } from '@headlessui/react'
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { ClipboardIcon } from '@heroicons/react/24/outline'

import { copyToClipboard } from "../utils/index.js"

export default function QR({data, open, setOpen, title, copiedText }) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
   copyToClipboard(data)
   setCopied(true)
  }

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
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {title}
                    </Dialog.Title>
                  </div>
                </div>
                <div className="mt-5 text-center grid place-items-center">
                  <a onClick={handleClick}>
                    <QRCode
                      value={data}
                      size={300}
                      logoImage={"/qr-icon.png"}
                      logoWidth={75}
                    />
                  </a>
                </div>
                {copied &&
                  <div className="m-4 border-l-4 border-green-400 bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ClipboardIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          {copiedText}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
