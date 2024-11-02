import { useContext } from "react"
import { Link } from "react-router-dom"

import { LanguageContext } from "../context/language.js"
import { UserContext } from "../context/user.js"
import { parseFiatNumber } from "../utils/index.js"

export default function UserBalance({}) {
  const user = useContext(UserContext)
  const language = useContext(LanguageContext)

  const usdBalance = user?.data?.balances?.find((el) => el.currencyCode === "USD")
  const crcBalance = user?.data?.balances?.find((el) => el.currencyCode === "CRC")

  if(!usdBalance && !crcBalance) {
    return null
  }

  return (

    <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
      <ul role="list" className="divide-y divide-gray-300">
        <li className="px-6 py-4">
            <h3 className="text-xl font-semibold mb-2 dark:text-black">{language.crc}</h3>
            <p className="text-gray-900">
                ₡{parseFiatNumber(crcBalance?.amount || 0, crcBalance?.currencyCode, language.lang)}
            </p>
            <Link
                to="/sell"
                state={{paymentOption: "IN_CRC_USER_BALANCE"}}
                className="font-semibold text-red-700 hover:text-red-500"
            >
                {language.confirmsell.confirmBtn}
                <span aria-hidden="true"> &rarr;</span>
            </Link>
        </li>
        <li className="px-6 py-4">
            <h3 className="text-xl font-semibold mb-2 dark:text-black">{language.usd}</h3>
            <p className="text-gray-900">
                ${parseFiatNumber(usdBalance?.amount || 0, usdBalance?.currencyCode, language.lang)}
            </p>
            <Link
                to="/sell"
                state={{paymentOption: "IN_USD_USER_BALANCE"}}
                className="font-semibold text-red-700 hover:text-red-500"
            >
                {language.confirmsell.confirmBtn}
                <span aria-hidden="true"> &rarr;</span>
            </Link>
        </li>
      </ul>
    </div>
  )
}