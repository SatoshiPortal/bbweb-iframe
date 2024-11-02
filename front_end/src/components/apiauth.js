import { useState, useContext, useEffect } from "react"
import { usePosContext } from "../context/pos.js"
import { UserContext } from "../context/user.js"
import { ErrorContext } from "../context/error.js"
import { LanguageContext } from "../context/language.js"
import { AlertContext } from "../context/alert.js"
import Spinner from "./spinner.js" // Updated import to match your project structure

export default function ApiAuth() {
  const language = useContext(LanguageContext)
  const alertData = useContext(AlertContext)
  const { formData, updateFormData } = usePosContext()
  const { error, addError, removeError } = useContext(ErrorContext)
  const user = useContext(UserContext)
  const [identity, setIdentity] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identity, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if(!data.session.identity) {
          addError(language.login.mfaError);
        } else {
          updateFormData({ token: data.session_token });
        }
      } else {
        const errorData = await response.json();
        console.log('errorData', errorData)
        addError(errorData.error || language.login.error);
      }
    } catch (error) {
      console.log('error', error)
      addError(language.login.networkError);
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      handleLogin()
    }
  }

  useEffect(() => {
    if (user.data) {
      const email = user.getKyc('EMAIL', 'email')
      setIdentity(email)
    }
  }, [user])
  
  return (
    <div className="mt-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.apiauth.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.apiauth.subtitle}</p>
        </div>
      </div>
      <div className="mt-2 sm:mt-8 flow-root max-w-2xl mx-auto">

        <div>
          <label htmlFor="identity" className="block text-sm font-medium leading-6 text-gray-900">
            {language.apiauth.email}
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              type="email"
              name="identity"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            {language.apiauth.password}
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {isLoading && <Spinner />}
          <button
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {language.continue}
          </button>
        </div>

      </div>
    </div>
  )
}