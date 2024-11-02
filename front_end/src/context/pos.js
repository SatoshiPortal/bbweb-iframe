import { createContext, useContext, useState } from "react"

const POSContext = createContext()

export const usePosContext = () => {
  return useContext(POSContext)
}

export const POSProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    token: null,
    recipientId: null,
    storeId: null,
    percent: null,
  })

  const updateFormData = (updatedData) => {
    console.log('updating form data', updatedData)
    setFormData((prevData) => ({ ...prevData, ...updatedData }))
  }

  return (
    <POSContext.Provider value={{ formData, updateFormData }}>
      {children}
    </POSContext.Provider>
  )
}