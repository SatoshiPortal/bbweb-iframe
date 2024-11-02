import { useEffect } from "react"
import { useFormContext } from "../context/form.js"

import Amount from "../components/amount.js"
import Recipients from "../components/recipients.js"
import Message from "../components/message.js"
import ConfirmSell from "../components/confirmsell.js"
import CreateOrderProgress from "../components/createorderprogress.js"
import ProcessOrder from "../components/processorder.js"


export default function SellForm({}) {
  const { formData, updateFormData } = useFormContext()

  const { action, amount, recipient, message, rules, deposit, order, paymentOption } = formData

  useEffect(() => {
    if(!paymentOption) {
      updateFormData({action: "sell",paymentOption: "IN_LN"})
    } else {
      updateFormData({action: "sell"})
    }
  }, [])

  return (
    <>
      <CreateOrderProgress />

      {!amount &&
        <Amount />
      }
      
      {amount && !recipient &&
        <Recipients isInForm={true} filterCurrency={amount ? amount.currency : false} />
      }

      {amount && recipient && !message &&
        <Message />
      }

      {amount && recipient && message && !order &&
        <ConfirmSell />
      }

      {amount && recipient && message && order &&
        <ProcessOrder />
      }
      
    </>
  )
}