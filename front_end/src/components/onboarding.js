import { useState, useContext } from "react"
import {
  CheckBadgeIcon,
} from '@heroicons/react/24/solid'

import { UserContext } from "../context/user.js"
import VerifyEmail from "../components/verifyemail.js"
import VerifyName from "../components/verifyname.js"
import VerifyPhone from "../components/verifyphone.js"

import { getPhoneNumber } from "../utils/index.js"

export default function Onboarding({ language }) {
  const user = useContext(UserContext)
  const [ showVerifyEmail, setShowVerifyEmail ] = useState(false)
  const [ showVerifyPhone, setShowVerifyPhone ] = useState(false)
  const [ showVerifyName, setShowVerifyName ] = useState(false)

  const emailStatus = user.getKyc('EMAIL', 'status')
  const emailVerified = emailStatus !== "" && emailStatus !== "NEW" 

  const phoneStatus = user.getKyc('PHONE', 'status')
  const phoneVerified = phoneStatus !== "" && phoneStatus !== "NEW" && phoneStatus !== "REJECTED"

  const firstName = user.getKyc('PROFILE', 'firstName')
  const lastName = user.getKyc('PROFILE', 'lastName')
  const nameVerified = firstName !== "" && lastName !== ""

  const steps = [
    { 
      name: language.onboarding.step1Title,
      onClick: () => {
        setShowVerifyEmail(true)
      },
      status: emailVerified ? 'complete' : 'current'
    },
    { 
      name: language.onboarding.step2Title,
      onClick: () => {
        if(emailVerified) {
          setShowVerifyPhone(true)
        }
      },
      status: emailVerified && phoneVerified ? 'complete' : emailVerified && !phoneVerified ? 'current' : 'upcoming'
    },
    { 
      name: language.onboarding.step3Title,
      onClick: () => {
        if(emailVerified && phoneVerified) {
          setShowVerifyName(true)
        }
      },
      status: emailVerified && phoneVerified && nameVerified ? 'complete': emailVerified && phoneVerified && !nameVerified ? 'current' : 'upcoming'
    },
  ]

  const allComplete = steps.find(step => step.status !== 'complete') ? false : true

  if(allComplete) {
    return (
      <></>
    )
  }

  return (
    <nav aria-label="Progress" className="p-4 dark:p-0 dark:mt-5 bg-white rounded">
      <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, i) => (
          <li key={step.name} className="md:flex-1 dark:text-black dark:bg-white dark:border dark:border-black rounded-lg dark:p-2">
            {step.status === 'complete' ? (
              <a
                className="group flex flex-col border-l-4 border-green-600 py-2 pl-4 hover:border-green-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-green-600 group-hover:text-green-800 align-middle">
                  <CheckBadgeIcon className="h-4 w-4 inline" />
                  {language.onboarding.step} {i+1}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : step.status === 'current' ? (
              <a
                onClick={step.onClick}
                className="flex flex-col border-l-4 border-red-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-red-700">{language.onboarding.step} {i+1}</span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                onClick={step.onClick}
                className="group flex flex-col border-l-4 border-gray-300 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{language.onboarding.step} {i+1}</span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
      <VerifyName language={language} open={showVerifyName} setOpen={setShowVerifyName} user={user} />
      <VerifyPhone language={language} open={showVerifyPhone} setOpen={setShowVerifyPhone} setOpenName={setShowVerifyName} user={user} defaultPhoneNumber={getPhoneNumber()} isVerify={user.getKyc("PHONE") !== "" && !phoneVerified} />
      <VerifyEmail language={language} open={showVerifyEmail} setOpen={setShowVerifyEmail} user={user} />
    </nav>
  )
}
