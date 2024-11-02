import { useEffect } from "react"
import { useFormContext } from "../context/form.js"
import { getUsername } from "../utils/index.js"

import Amount from "../components/amount.js"
import Deposit from "../components/deposit.js"
import BuyType from "../components/buytype.js"
import ConfirmBuy from "../components/confirmbuy.js"
import CreateOrderProgress from "../components/createorderprogress.js"
import ProcessOrder from "../components/processorder.js"


export default function BuyForm({}) {
  const { formData, updateFormData } = useFormContext()

  const { action, paymentOption, amount, recipient, message, type, deposit, order } = formData
  
  const username = getUsername()

  useEffect(() => {
    updateFormData({
      action: "buy", 
      paymentOption: username.length > 0 ? "OUT_LNURL_PAY" : "OUT_LN",
    })
  }, [])

  return (
    <>
      <CreateOrderProgress />

      {!amount &&
        <Amount />
      }
      
      {amount && (!type || !paymentOption) && 
        <BuyType />
      }

      {amount && type && paymentOption && !order &&
        <ConfirmBuy />
      }

      {amount && type && paymentOption && order && !deposit &&
        <Deposit />
      }

      {amount && type && paymentOption && order && deposit &&
        <ProcessOrder />
      }
      
    </>
  )
}