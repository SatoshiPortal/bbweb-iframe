import { useContext, useState } from "react"
import { CheckBadgeIcon } from '@heroicons/react/24/solid'

import { LanguageContext } from "../context/language.js"
import { UserContext } from "../context/user.js"
import { getRedirectUrl } from "../utils/index.js"
import VerifyPhone from "../components/verifyphone.js"
import VerifyEmail from "../components/verifyemail.js"
import VerifyName from "../components/verifyname.js"
import VerifyIdentity from "../components/verifyidentity.js"
import UserBalance from "../components/userbalance.js"

export default function Settings() {
  const user = useContext(UserContext)
  const language = useContext(LanguageContext)
  const email = user.getKyc('EMAIL')
  const name = user.getKyc('PROFILE')
  const phone = user.getKyc('PHONE')
  const identity = user.getKyc('INCODE_ID_VERIFICATION')
  const identityVerified = user.hasGroup('KYC_IDENTITY_VERIFIED')
  const [ showVerifyPhone, setShowVerifyPhone ] = useState(false)
  const [ showVerifyEmail, setShowVerifyEmail ] = useState(false)
  const [ showVerifyName, setShowVerifyName ] = useState(false)
  const [ showVerifyIdentity, setShowVerifyIdentity ] = useState(false)

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <h3 className="text-base font-semibold leading-7 text-gray-900">{language.settings.title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.settings.subtitle}</p>
      </div>
      <div className="mt-6 border-t border-gray-300">
        <dl className="divide-y divide-gray-300">

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{language.settings.userNumber}</dt>
            <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{user.data.userNbr}</span>
              <span className="ml-4 flex-shrink-0">
                
              </span>
            </dd>
          </div>
          
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{language.settings.email}</dt>
            <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                {email.email}
                {email.status === "APPROVED" &&
                  <CheckBadgeIcon className="h-4 w-4 text-green-600 inline" aria-hidden="true" />
                }
              </span>
              <span className="ml-4 flex-shrink-0">
                {email.status === "NEW" && 
                  <a onClick={() => setShowVerifyEmail(true)} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500 mr-3">
                    {language.settings.verifyBtn}
                  </a>
                }
              </span>
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{language.settings.password}</dt>
            <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">*****</span>
              <span className="ml-4 flex-shrink-0">
                <a href={getRedirectUrl(language.lang, 'settings')} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                  {language.settings.updateBtn}
                </a>
              </span>
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{language.settings.name}</dt>
            <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                {name.firstName} {name.lastName}
                {name.status === "APPROVED" &&
                  <CheckBadgeIcon className="h-4 w-4 text-green-600 inline" aria-hidden="true" />
                }
              </span>
              <span className="ml-4 flex-shrink-0">
                <a onClick={() => setShowVerifyName(true)} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                  {language.settings.updateBtn}
                </a>
              </span>
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{language.settings.phone}</dt>
            <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                {(phone.phoneCountryCode ? `+${phone.phoneCountryCode}` : '')} {phone.phone ? phone.phone : ''}
                {phone.status === "APPROVED" &&
                  <CheckBadgeIcon className="h-4 w-4 text-green-600 inline" aria-hidden="true" />
                }
              </span>
              <span className="ml-4 flex-shrink-0">
                {phone.status === "NEW" && 
                  <a onClick={() => setShowVerifyPhone("verify")} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500 mr-3">
                    {language.settings.verifyBtn}
                  </a>
                }
                <a onClick={() => setShowVerifyPhone(true)} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                  {language.settings.updateBtn}
                </a>
              </span>
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              {language.settings.identity}
            </dt>
            <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                {(identity.status === "APPROVED" || identityVerified) &&
                  <span className="inline-flex flex-shrink-0 items-center rounded-md bg-green-50 px-1 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {language.approved}
                  </span>
                }
                {identity.status === "REJECTED" &&
                  <span className="inline-flex flex-shrink-0 items-center rounded-md bg-red-50 px-1 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                    {language.rejected}
                  </span>
                }
                {identity.status === "NEW" && identity.onboardingStatus === "ONBOARDING_FINISHED" &&
                  <span className="inline-flex flex-shrink-0 items-center rounded-md bg-blue-50 px-1 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    {language.processing}
                  </span>
                }
              </span>
              <span className="ml-4 flex-shrink-0">
                {(!identity || identity.status === "NEW") && !identityVerified &&
                  <a onClick={() => setShowVerifyIdentity(true)} type="button" className="rounded-md bg-white font-medium text-red-700 hover:text-red-500">
                    {language.settings.verifyBtn}
                  </a>
                }
              </span>
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{language.settings.pendingBalance}</dt>
            <dd className="flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                <UserBalance />
              </span>
              <span className="ml-4 flex-shrink-0">
               
              </span>
            </dd>
          </div>
          
        </dl>
      </div>
      <VerifyName language={language} open={showVerifyName} setOpen={setShowVerifyName} user={user} />
      <VerifyPhone language={language} open={showVerifyPhone !== false ? true : false} setOpen={setShowVerifyPhone} user={user} isVerify={showVerifyPhone === "verify" ? true : false} />
      <VerifyEmail language={language} open={showVerifyEmail} setOpen={setShowVerifyEmail} user={user} />
      <VerifyIdentity language={language} open={showVerifyIdentity} setOpen={setShowVerifyIdentity} user={user} />
    </div>
  )
}