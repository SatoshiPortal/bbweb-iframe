const getLanguage = () => {
  const params = (new URL(document.location)).searchParams;
  const key = params.get("lang");

  if(key && key.length > 0 && key !== "DEFAULT") {
    return key.split('-')[0]
  }

  if(navigator.language) {
    return navigator.language.split('-')[0]
  }

  if(navigator.userLanguage) {
    return navigator.userLanguage.split('-')[0]
  }
  
  return 'en'
}

const getPhoneNumber = () => {
  const params = (new URL(document.location)).searchParams;
  const key = params.get("phone");

  if(key && key.length > 0) {
    return key
  }

  return ""
}

const getSatBalance = () => {
  const params = (new URL(document.location)).searchParams;
  const key = params.get("satBalance");

  if(key && key.length > 0) {
    return parseInt(key)
  }

  return false
}

const getUsername = () => {
  const params = (new URL(document.location)).searchParams;
  const key = params.get("username");

  if(key && key.length > 0) {
    return key
  }

  return ""
}

const getReferralCode = () => {
  const params = (new URL(document.location)).searchParams;
  const key = params.get("referralCode");

  if(key && key.length > 0) {
    return key
  }

  return ""
}

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const parseFiatNumber = (amount, currency, language) => {
  return Number(amount).toLocaleString(
    (language === 'es' ? 'es-CR' : 'en-US'), 
    {
      currency: currency,
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }
  )
}

const isInIframe = () => {
  try {
      return window.self !== window.top;
  } catch (e) {
      return true;
  }
}

const isInApp = () => {
  return window.ReactNativeWebView ? true : false
}

const copyToClipboard = (text) => {
  try {
    navigator.clipboard.writeText(text)
  } catch(e) {
    console.log(e)
  }
}

const getRedirectUrl = (language, action) => {
 return `${process.env.REACT_APP_AUTH_URL}/${language}/${action}?${new URLSearchParams({return_to_app: `${process.env.REACT_APP_BASE_URL}/?${new URLSearchParams(window.location.search).toString()}`, jurisdiction: "CA", referral_code: getReferralCode() }).toString()}`
}

const handleLinkClick = (e) => {
  if(window.ReactNativeWebView) {
    e.preventDefault()
    window.ReactNativeWebView.postMessage(JSON.stringify({action: "clickLink", url: e.target.href}))
  } else if(isInIframe()) {
    e.preventDefault()
    window.top.postMessage(JSON.stringify({action: "clickLink", url: e.target.href}))
  } else {
    window.open(e.target.href)
  }
}

const calculateTotalFees = (quote) => {
  if (!quote) return 0;
  
  const allFees = [
    ...quote.orderFees,
    ...quote.orderClusterFees,
    ...quote.inTransactionFees,
    ...quote.inTransactionClusterFees,
    ...quote.outTransactionFees,
    ...quote.outTransactionClusterFees
  ];

  return allFees.reduce((total, fee) => {
    if (fee.percent) {
      return total + (quote.inAmount * (fee.percent / 100));
    }
    if (fee.flatAmount) {
      // Assuming the flat fee is in the same currency as outAmount
      return total + parseFloat(fee.flatAmount);
    }
    return total;
  }, 0);
}

export { getLanguage, getPhoneNumber, getSatBalance, getUsername, getReferralCode, classNames, parseFiatNumber, isInIframe, isInApp, copyToClipboard, getRedirectUrl, handleLinkClick, calculateTotalFees }