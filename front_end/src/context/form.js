import { createContext, useContext, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const FormContext = createContext()

export const useFormContext = () => {
  return useContext(FormContext)
}

export const FormProvider = ({ children, defaultRecipient, defaultPaymentOption }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    recipient: defaultRecipient || undefined,
    paymentOption: defaultPaymentOption || undefined,
  })

  const updateFormData = (updatedData) => {
    console.log('updating form data', updatedData)
    setFormData((prevData) => ({ ...prevData, ...updatedData }))
  }

  const updateNavigation = () => {
    navigate(location.pathname, {})
  }

  useEffect(() => {
    if(defaultRecipient) {
      console.log('got new default recipient', defaultRecipient)
      updateFormData({recipient: defaultRecipient})
      updateNavigation()
    }
  }, [defaultRecipient])

  useEffect(() => {
    if(defaultPaymentOption) {
      console.log('got new default payment option', defaultPaymentOption)
      updateFormData({paymentOption: defaultPaymentOption})
      updateNavigation()
    }
  }, [defaultPaymentOption])

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  )
}