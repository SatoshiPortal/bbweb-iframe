import React from 'react';
import { Switch } from '@headlessui/react';
import nightwind from "nightwind/helper.js";
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

function getInitialColorMode() {
    const persistedColorPreference = window.localStorage.getItem('nightwind-mode');
    const hasPersistedPreference = typeof persistedColorPreference === 'string';
    if (hasPersistedPreference) {
      return persistedColorPreference;
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const hasMediaQueryPreference = typeof mql.matches === 'boolean';
    if (hasMediaQueryPreference) {
      return mql.matches ? 'dark' : 'light';
    }
    return 'light';
}

function ColorToggle() {
  const [enabled, setEnabled] = React.useState(getInitialColorMode() === 'dark' ? true : false)

  const toggleDarkMode = () => {
    setEnabled(!enabled);
    nightwind.toggle();
  }

  return (
    <Switch
      checked={enabled}
      onChange={toggleDarkMode}
      className={`${
        enabled ? 'bg-red-700' : 'bg-white'
      } relative inline-flex h-8 w-12 items-center rounded-full inset-1.5 lg:inset-0 mr-2`}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-1'
        } inline-flex items-center justify-center h-6 w-6 transform rounded-full dark:bg-white bg-black transition-transform duration-200 ease-in-out`}
      >
        {enabled ? (
          <MoonIcon className="h-4 w-4 text-black" />
        ) : (
          <SunIcon className="h-4 w-4 text-yellow-400" />
        )}
      </span>
    </Switch>
  )
}

export default ColorToggle