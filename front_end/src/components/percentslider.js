import React, { useState, useContext } from 'react';
import Spinner from './spinner.js'; // Import the Spinner component
import { usePosContext } from "../context/pos.js"; // Import the context
import { LanguageContext } from "../context/language.js";

export default function PercentSlider() {
  const { updateFormData } = usePosContext(); // Get updateFormData from context
  const [percent, setPercent] = useState(80); // Default value set to 80
  const language = useContext(LanguageContext);

  const handleChange = (e) => {
    setPercent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateFormData({ percent });
  };

  return (
    <div className="mt-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{language.percentslider.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">{language.percentslider.subtitle}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-2 sm:mt-8 flow-root max-w-2xl mx-auto space-y-4">
        <div>
          <label htmlFor="percent" className="block text-sm font-medium leading-6 text-gray-900">{language.percentslider.percentage}</label>
          <div className="flex items-center">
            <span className="text-sm font-medium leading-6 text-gray-900 mr-2">Bitcoin</span>
            <input
              id="percent"
              type="range"
              min="1"
              max="100"
              value={percent}
              onChange={handleChange}
              className="w-full accent-red-700"
            />
            <span className="text-sm font-medium leading-6 text-gray-900 ml-2">Fiat</span>
          </div>
          <div className="text-center dark:text-black">
            {100 - percent}% Bitcoin Jungle / {percent}% fiat
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button 
            type="submit"
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}