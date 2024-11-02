import React, { useState, useContext, useEffect } from 'react';
import { usePosContext } from "../context/pos.js";
import { UserContext } from "../context/user.js";
import { ErrorContext } from "../context/error.js";
import { LanguageContext } from "../context/language.js";
import Spinner from './spinner.js'; // Import the Spinner component
import { getUsername } from "../utils/index.js"

export default function POSStore() {
  const username = getUsername()
  const user = useContext(UserContext)
  const { formData: { percent, recipientId, token }, updateFormData } = usePosContext();
  const { addError } = useContext(ErrorContext)
  const language = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    storeName: '',
    storeOwnerEmail: '',
    defaultCurrency: 'CRC',
    defaultLanguage: 'en',
    bitcoinJungleUsername: username,

    bullBitcoin: {
      token,
      percent,
      recipientId,
      userId: user.data.userId,
    },
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      const response = await fetch("/api/createStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create store');

      const data = await response.json();
      if (data.error) throw new Error(data.message);

      updateFormData({ storeId: data.btcPayServerAppId });
      // Add success message or redirect logic here
    } catch (error) {
      console.error('Error creating store:', error);
      addError(error.message);
      // Add error handling logic here
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    const email = user.getKyc('EMAIL', 'email')
    setFormData({ ...formData, storeOwnerEmail: email })
  }, [user])

  return (
    <div className="mt-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.posstore.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.posstore.subtitle}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-2 sm:mt-8 flow-root max-w-2xl mx-auto space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium leading-6 text-gray-900">{language.posstore.storeName}</label>
          <input
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label htmlFor="defaultCurrency" className="block text-sm font-medium leading-6 text-gray-700">{language.posstore.currency}</label>
          <select
            id="defaultCurrency"
            name="defaultCurrency"
            value={formData.defaultCurrency}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
          >
            <option value="CRC">{language.crc}</option>
            <option value="USD">{language.usd}</option>
          </select>
        </div>
        <div>
          <label htmlFor="defaultLanguage" className="block text-sm font-medium leading-6 text-gray-700">{language.posstore.language}</label>
          <select
            id="defaultLanguage"
            name="defaultLanguage"
            value={formData.defaultLanguage}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        {!username &&
          <div>
            <label htmlFor="bitcoinJungleUsername" className="block text-sm font-medium leading-6 text-gray-900">{language.posstore.bitcoinJungleUsername}</label>
            <input
              id="bitcoinJungleUsername"
              name="bitcoinJungleUsername"
              value={formData.bitcoinJungleUsername}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:bg-white dark:text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-700 sm:text-sm sm:leading-6"
            />
          </div>
        }
        <div className="mt-6 flex items-center justify-end gap-x-6">
          {loading && <Spinner />}
          <button 
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            disabled={loading}
          >
            {language.posstore.create}
          </button>
        </div>
      </form>
    </div>
  );
}