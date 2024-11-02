import { createContext, useState, useCallback } from 'react'

export const ErrorContext = createContext({
  error: null,
  addError: () => {},
  removeError: () => {},
})

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null)
  const removeError = () => setError(null)
  const addError = (message, permanent = false) => setError({ message, permanent })
  const contextValue = {
    error,
    addError: useCallback(
      (message, permanent = false) => {
        addError(message, permanent)
        if(!permanent) {
          setTimeout(removeError, 7000)
        }
      }, 
      []
    ),
    removeError: useCallback(() => removeError(), [])
  }

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}