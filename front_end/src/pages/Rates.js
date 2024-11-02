import { useEffect, useState, useContext, useRef } from "react"
import { LanguageContext } from "../context/language.js"
import { ErrorContext } from "../context/error.js"
import { parseFiatNumber } from "../utils/index.js"
import { fetchPrices, fetchBbApi } from "../utils/bullbitcoin.js"

import Spinner from "../components/spinner.js"
import RateDisclaimer from "../components/ratedisclaimer.js"

export default function Rates() {
  const { error, addError, removeError } = useContext(ErrorContext)
  const language = useContext(LanguageContext)
  const [usdRates, setUsdRates] = useState(null)
  const [crcRates, setCrcRates] = useState(null)
  const [usdBuyRate, setUsdBuyRate] = useState(null)
  const [usdSellRate, setUsdSellRate] = useState(null)
  const [crcBuyRate, setCrcBuyRate] = useState(null)
  const [crcSellRate, setCrcSellRate] = useState(null)
  const [showCurrency, setShowCurrency] = useState("CRC")
  const timer = useRef(null)

  const getRates = async () => {
    const prices = await fetchPrices()
    
    if(prices.error) {
      addError(prices.message)
    } else {
      const sellUsd = prices.find((el) => el.result.element.fromCurrency === "BTC" && el.result.element.toCurrency === "USD")
      const sellCrc = prices.find((el) => el.result.element.fromCurrency === "BTC" && el.result.element.toCurrency === "CRC")
      const buyUsd = prices.find((el) => el.result.element.fromCurrency === "USD" && el.result.element.toCurrency === "BTC")
      const buyCrc = prices.find((el) => el.result.element.fromCurrency === "CRC" && el.result.element.toCurrency === "BTC")

      setCrcRates(sellCrc?.result?.element)
      setUsdRates(sellUsd?.result?.element)
      
      setCrcBuyRate(buyCrc?.result?.element)
      setUsdBuyRate(buyUsd?.result?.element)
      
      setCrcSellRate(sellCrc?.result?.element)
      setUsdSellRate(sellUsd?.result?.element)
    }
  }

  useEffect(() => {
    getRates()
    timer.current = setInterval(() => getRates(), 1000 * 30)
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  const calculatePercentage = (obj, type) => {
    if(!obj) {
      return 0
    }
    const rate = obj.userPrice / 100
    const indexPrice = obj.indexPrice / 100
    if(type === "buy") {  
      return ((rate - indexPrice) / indexPrice) * 100;
    } else {
      return ((indexPrice - rate) / indexPrice) * 100;
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <h3 className="text-base font-semibold leading-7 text-gray-900">{language.rates.title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.rates.subtitle}</p>
      </div>
      <div className="mt-2 sm:mt-8 flow-root">
        <nav className="isolate flex mb-2" aria-label="Tabs">
          <a onClick={() => setShowCurrency("CRC")} className={`${showCurrency === "CRC" ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'} border rounded-l group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10`}>
            <span>{language.crc}</span>
            <span
              aria-hidden="true"
              className={`${showCurrency === "CRC" ? 'bg-red-700' : 'bg-transparent'} absolute inset-x-0 bottom-0 h-1`}
            />
          </a>

          <a onClick={() => setShowCurrency("USD")} className={`${showCurrency === "USD" ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'} border rounded-r group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10`}>
            <span>{language.usd}</span>
            <span
              aria-hidden="true"
              className={`${showCurrency === "USD" ? 'bg-red-700' : 'bg-transparent'} absolute inset-x-0 bottom-0 h-1`}
            />
          </a>
        </nav>

        {showCurrency === "CRC" &&
          <div>
            <RateDisclaimer />
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-white dark:border dark:border-black rounded-lg px-4 py-5 shadow sm:p-6">
                <dt className="flex justify-between truncate text-sm font-medium text-gray-500">
                  <span>{language.rates.buy}</span>
                  <span>{parseFiatNumber(Number(calculatePercentage(crcBuyRate, 'buy')).toFixed(2), "CRC", language.lang)}%</span>
                </dt>
                <dd className="text-3xl font-semibold tracking-tight text-gray-900">
                  {!crcBuyRate &&
                    <Spinner />
                  }
                  {crcBuyRate && 
                    <span>₡{parseFiatNumber(crcBuyRate.userPrice / 100, "CRC", language.lang)}</span>
                  }
                </dd>
              </div>

              <div className="overflow-hidden rounded-lg bg-white dark:border dark:border-black px-4 py-5 shadow sm:p-6">
                <dt className="flex justify-between truncate text-sm font-medium text-gray-500">
                  <span>{language.rates.sell}</span>
                  <span>{parseFiatNumber(Number(calculatePercentage(crcSellRate, 'sell')).toFixed(2), "CRC", language.lang)}%</span>
                </dt>
                <dd className="text-3xl font-semibold tracking-tight text-gray-900">
                  {!crcSellRate &&
                    <Spinner />
                  }
                  {crcSellRate && 
                    <span>₡{parseFiatNumber(crcSellRate.userPrice / 100, "CRC", language.lang)}</span>
                  }
                </dd>
              </div>
            </dl>
          </div>
        }

        {showCurrency === "USD" &&
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-white dark:border dark:border-black px-4 py-5 shadow sm:p-6">
              <dt className="flex justify-between truncate text-sm font-medium text-gray-500">
                <span>{language.rates.buy}</span>
                <span>{parseFiatNumber(Number(calculatePercentage(usdBuyRate, 'buy')).toFixed(2), "USD", language.lang)}%</span>
              </dt>
              <dd className="text-3xl font-semibold tracking-tight text-gray-900">
                {!usdBuyRate &&
                  <Spinner />
                }
                {usdBuyRate && 
                  <span>${parseFiatNumber(usdBuyRate.userPrice / 100, "USD", language.lang)}</span>
                }
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg dark:border dark:border-black bg-white px-4 py-5 shadow sm:p-6">
              <dt className="flex justify-between truncate text-sm font-medium text-gray-500">
                <span>{language.rates.sell}</span>
                <span>{parseFiatNumber(Number(calculatePercentage(usdSellRate, 'sell')).toFixed(2), "USD", language.lang)}%</span>
              </dt>
              <dd className="text-3xl font-semibold tracking-tight text-gray-900">
                {!usdSellRate &&
                  <Spinner />
                }
                {usdSellRate && 
                  <span>${parseFiatNumber(usdSellRate.userPrice / 100, "USD", language.lang)}</span>
                }
              </dd>
            </div>
          </dl>
        }

      </div>
    </div>
  )
}