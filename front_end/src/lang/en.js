const en = {
  loading: "Loading",
  sinpe: "SINPE Móvil",
  iban: "IBAN Account",
  crc: "Colones",
  usd: "Dollars",
  btc: "Bitcoin",
  sats: "Sats",
  continue: "Continue",
  cancel: "Cancel",
  canceled: "Canceled",
  save: "Save",
  edit: "Edit",
  refresh: "Update",
  previous: "Previous",
  next: "Next",
  delete: "Delete",
  close: "Close",
  IN_PENDING: "Inbound Pending",
  IN_COMPLETED: "Inbound Complete",
  OUT_PENDING: "Outbound Pending",
  OUT_IN_PROGRESS: "Outbound In Progress",
  OUT_COMPLETED: "Outbound Complete",
  DONE: "Complete",
  lightning: "Lightning",
  onchain: "Bitcoin (cold storage)",
  systemAlertTitle: "Important Notice",
  my: "My",
  new: "New",
  view: "View",
  rejected: "Rejected",
  approved: "Approved",
  processing: "Processing",
  send: "Send",
  balanceUsd: "Dollars Balance",
  balanceCrc: "Colones Balance",

  navigation: {
    home: "Home",
    recipients: "Recipients",
    orders: "Orders",
    pos: "Point of Sale",
    manage: "Manage Account",
    logout: "Sign Out",
  },

  login: {
    welcome: "Welcome to Bull Bitcoin",

    newUserHeader: "New Users",
    newUserText: "If you don't have an account with Bull Bitcoin yet, please start here.",
    newUserBtn: "Create Account",

    returningUserHeader: "Returning Users",
    returningUserText: "If you're a returning user, click here to sign in.",
    returningUserBtn: "Sign In",

    systemMaintenance: "The system is currently under maintenance. Come back soon!",

    bitcoinOnlyTitle: "Bitcoin Only",
    bitcoinOnly: "Because there is no second best. Be Uncompromisable.",
    lightningFastTitle: "Lightning Fast",
    lightningFast: "Buy and sell Bitcoin in seconds. Onchain and Lightning.",
    selfCustodialTitle: "Self Custodial",
    selfCustodial: "Bull Bitcoin is non-custodial. You control your own funds.",

    error: "An error occurred during login",
    mfaError: "Accounts with MFA cannot create Point of Sales at this time. Contact support.",
  },

  home: {
    buyBtnTitle: "Buy Bitcoin",
    buyBtnSubtitle: "Receive bitcoin in your wallet",

    sellBtnTitle: "Sell Bitcoin",
    sellBtnSubtitle: "Send a SINPE payment",

    contactBtnTitle: "Contact Support",
    contactBtnSubtitle: "Get in touch if you have any questions",

    priceBtnTitle: "View Prices",
    priceBtnSubtitle: "Check out our rates",
  },

  recipients: {
    title: "Recipients",
    subtitle: "A list of all the recipients in your account.",

    selectTitle: "Select Existing Recipient",
    selectSubtitle: "Select a recipient you wish to send to.",

    createBtn: "Create Recipient",
    sendBtn: "Send Payment",

    none: "No recipients found.",

    select: "Select",
  },

  createrecipient: {
    title: "Create Recipient",
    subtitle: "Add a new recipient to your account.",

    editTitle: "Edit Recipient",
    editSubtitle: "Make changes to an existing recipient on your account.",

    nameTitle: "Name (optional)",
    namePlaceholder: "Butcher Shop",

    destinationTypeTitle: "Destination Type",

    phoneNumberTitle: "Phone Number",

    delete: "Are you sure you want to delete this recipient?",

    "invalid-sinpe": "This phone number is not subscribed to SINPE Móvil.",
    "uknown-iban": "This IBAN Account cannot be located.",

    errors: {
      destination: "Destination is required.",
      invalidCurrencyCreate: "You can not create a recipient of this currency type.",
      invalidSinpe: "Destination is not a valid phone number.",
      invalidIban: "Destination is not a valid IBAN account.",
      invalidCurrency: "Invalid currency for this order.",
      invalidDestination: "Unable to locate the details for this account.",
    },
  },

  orders: {
    title: "Orders",
    subtitle: "A list of all the orders in your account.",

    createBtn: "Create Order",

    date: "Date",
    orderNumber: "Order #",
    type: "Type",
    source: "Source",
    status: "Status",
    amount: "Amount",

    none: "No orders found.",

    viewBtn: "Details",
  },

  settings: {
    title: "Settings",
    subtitle: "Manage your account details.",

    email: "Email Address",
    password: "Password",
    name: "Full Name",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    country: "Country",
    userNumber: "User Number",
    identity: "Identity",

    verifyBtn: "Verify",
    updateBtn: "Update",

    pendingBalance: "Pending Payments",
  },

  onboarding: {
    step: "Step",

    step1Title: "Email Verification",
    step2Title: "Phone Verification",
    step3Title: "Name Verification",
  },

  verifyphone: {
    title: "Verify Phone Number",
    subtitle1: "Please enter your phone number to receive a code.",
    subtitle2: "Please enter the code that was just sent to your phone.",
    rejected: "Sorry, we don't accept phone numbers from this country.",

    code: "Verification Code",
    resendBtn: "Resend Code",
    verifyBtn: "Verify Number",
  },

  verifyemail: {
    title: "Verify Email",
    subtitle: "Please check {email} and click the link to verify your address.",
    resendBtn: "Re-send Email",
    confirmBtn: "OK, All Set",
  },

  verifyname: {
    title: "Verify Name",
    subtitle: "Please add your full name to your profile.",
    confirmBtn: "Verify Name",
  },

  verifyidentity: {
    title: "Verify Identity",
    subtitle: "Please verify your identity to increase your limits.",
    text: "Please click the button below to get started. You will need a mobile device with a camera and your ID.",
    confirmBtn: "Start Now",

    notAllowedToTry: "Please complete verificiation of your email, phone & name first.",
  },

  createorderprogress: {
    amount: "Amount",
    recipient: "Recipient",
    message: "Message",
    confirm: "Confirm",
    deposit: "Deposit",
    method: "Method",
    rate: "1 BTC",

    IN_CRC_RDV_SINPE: "SINPE",
    IN_CRC_RDV_IBAN: "IBAN",
    IN_USD_RDV_IBAN: "IBAN",

    OUT_LN: "Lightning",
    OUT_LNURL_PAY: "Lightning Address",
    OUT_BITCOIN: "Bitcoin",
  },

  amount: {
    title: "Amount",
    subtitle: "Enter the amount you wish to sell.",
    buySubtitle: "Enter the amount you wish to buy.",

    satsBtn: "Sell all",
    satsBtnConfirm: "Are you sure you want to sell all your sats?",

    errors: {
      amount: "Amount is required.",
      invalidAmount: "Invalid amount.",
      currency: "Currency is required.",
      invalidCurrency: "Invalid currency for this recipient.",
      disabledCurrency: "This currency is temporarily disabled. Please try another currency or come back later.",
    },
  },

  message: {
    title: "Message",
    subtitle: "Enter an optional message to include with your payment.",
    placeholder: "Fruits and Veggies",
  },

  confirmsell: {
    title: "Confirm Order",
    subtitle: "Please review and confirm your order details.",
    confirmBtn: "Send Payment",
    includesFees: "Total Fees",

    errors: {
      overBalance: "This order amount exceeds your wallet balance.",
    },
  },

  confirmbuy: {
    confirmBtn: "Place Order",
    
    bolt11Prompt: "Please provide a lightning invoice for {satAmount} sats.",
    bolt11AmountError: "The lightning invoice provided was for the wrong amount. Please try again.",
  
    addressInput: "Destination Address",
    invalidAddress: "Invalid Bitcoin address.",
    invalidLightningAddress: "Invalid Lightning address.",
    invalidInvoice: "Invalid Lightning invoice.",
    
    myLightningAddress: "My Bitcoin Jungle Wallet",
  },

  processorder: {
    title: "Processing Order",
    subtitle: "We are processing your order, please wait.",

    successTitle: "Order completed successfully!",
    orderNumber: "Order #",
    referenceNumber: "Reference # ",

    paying: "Paying the lightning invoice now",

    error: "There was an error placing your order. Please try again later.",
    timeoutError: "We have received your order and are working to process it as quickly as possible.",

    returnToWallet: "Return to Wallet",
  },

  rules: {
    title: "Important Rules",
    subtitle: "Please keep the following rules in mind before buying Bitcoin.",
   
    one: "We don't accept third party transfers. This means that all funds must originate from a bank account in your (or your business) name.",
    two: "We recommend not writing things like bitcoin, btc, crypto, et. cetera. in the memo field. This is for your privacy.",
    three: "For Lightning orders, we only accept instant bank transfers. For Bitcoin (on-chain) orders, we accept both instant & slow (1-3 day) bank transfers.",
    four: "Your order currency must match the currency you send to us from your bank.",
    
    after: "Failure to adhere to these rules may result in a permanent ban from Bull Bitcoin and Toro Pagos.",

    rule: "Rule",

    checkingPermission: "Checking permissions",
    noBuyPermission: "You can only buy Bitcoin if your phone number is registered with SINPE Móvil or if your identity has been verified. Contact support if you don't have SINPE Móvil and wish to purchase with your bank account.",
    noSellPermission: "You can only sell Bitcoin after verifying your email, phone & name. Contact support if you have any questions.",
    dailyLimitHit: "You have reached your daily limits. These limits apply per 24 hour period.",
    noPermission: "Your account does not have permission to perform this action. Contact support if you have any questions.",
  },

  deposit: {
    title: "Deposit",
    subtitle: "Please transfer {amount} from your bank account to ours.",

    details: "Here are our account details.",
    cedula: "Our Cédula Jurídica is 3-102-875766, Toro Pagos Limitada.",

    automatic: "Send SINPE by Message",
    manual: "Send SINPE Manually",

    descriptionTitle: "Include the following description with your transfer.",
    descriptionSubtitle: "Do not include any other description.",

    slowAllowed: "Bitcoin (on-chain) orders support slow bank transfer methods (1-3 days) as well as instant transfer methods. Please note that if you do choose a slow bank transfer method, your quote will be recalculated at the moment we receive the bank transfer.",

    confirmTitle: "Confirm that you have completed your transfer.",
    confirmSubtitle: "If you do not make the immediate transfer now, your quote may change.",
    confirmLabel: "I have completed the bank transfer.",

  },

  sendsms: {
    title: "Choose Your Bank",
    subtitle: "Please select the bank you will be sending from below.",

  },

  buytype: {
    title: "Transfer Methods",
    subtitle: "Select your desired inbound and outbound transfer methods.",

    fiatTitle: "Inbound Transfer Method",
    fiatSubtitle: "Select how you will be making the transfer from your bank to ours.",

    bitcoinTitle: "Outbound Transfer Method",
    bitcoinSubtitle: "Select how you would like to receive your Bitcoin.",
  },

  orderdetails: {
    title: "Order Details",
    subtitle: "Use this page to view the details of a specific order.",
    receiptBtn: "View Receipt",
    success: "Transfer Successful",

    type: "Type",
    bitcoinAmount: "Bitcoin Amount",
    fiatAmount: "Fiat Amount",
    fiatAmountNoFiat: "Amount",
    transferCode: "Transfer Code",
    destinationAddress: "Destination Address",
    destinationHash: "Bitcoin Transaction",
    message: "Message",
    origin: "Origin",
    destination: "Destination",
    rate: "1 BTC",
    network: "Network",

    SELL: "Sell",
    BUY: "Buy",

  },

  invoice: {
    pay: "Pay Invoice",
    copied: "The invoice has been copied to the clipboard. Please open your wallet and pay this invoice.",

  },

  rates: {
    title: "Rates",
    subtitle: "Use this page to see the current buy and sell rate.",
    buy: "Buy Rate",
    sell: "Sell Rate",
    index: "Index Rate",
    explainer1: "Bull Bitcoin calculates the Bitcoin Buy Rate and the Bitcoin Sell Rate to include the USD Buy Rate and USD sell rate it gets from its banking partners. This is caused by the fact there there is no public marketplace where Bitcoin is traded for Colones.",
    explainer2: "The rates charged by Bull Bitcoin are set to the minimum possible to ensure that it doesn't lose money by providing the exchange. We are committed to maintaining the lowest possible fees to benefit the users.",
    explainer3: "Bitcoin Jungle is an independent organization which calculates its own Bitcoin exchange rates. As a result, the rates used by Bull Bitcoin and Bitcoin Jungle will be different.",
    readMore: "Read More",
  },

  support: {
    title: "Support",
    subtitle: "Get in touch with us if you have any questions!",

    whatsapp: "WhatsApp",
    faq: "FAQ",
    email: "Email",
    twitter: "Twitter",
  },

  loadingMessages: [
    "Remember to take self custody of your Bitcoin",
    "Don't trust, verify!",
    "Study Bitcoin",
    "Bitcoin is a tool for freeing humanity from oligarchs and tyrants",
    "Bitcoin is the most significant monetary advance since the creation of coinage",
    "Cypherpunks write code",
    "There will be an internet native currency within our lifetime",
    "Chancellor on brink of second bailout for banks",
    "We engineer sovereignty",
    "Personal responsibility is the cornerstone of society",
    "There is no second best",
  ],

  createpointofsaleprogress: {
    authenticate: "Authenticate",
    recipient: "Recipient",
    percent: "Percent",
    create: "Create",
  },

  posform: {
    title: "Your store is ready",
    subtitle: "You can now start accepting payments.",
    open: "Open My Store",
  },

  apiauth: {
    title: "Authentication",
    subtitle: "Please log in with your Bull Bitcoin credentials to continue.",
    email: "Email",
    password: "Password",
  },

  percentslider: {
    title: "Set Percentage",
    subtitle: "Please select a percentage between 1 and 100. This percentage represents the portion that should be converted to fiat.",
    percentage: "Percentage",
  },

  posstore: {
    title: "Create Store",
    subtitle: "Please fill in the details to create a store.",
    storeName: "Store Name",
    storeOwnerEmail: "Store Owner Email",
    currency: "Currency",
    language: "Language",
    bitcoinJungleUsername: "Bitcoin Jungle Username",
    create: "Create Store",
  },

  pos: {
    title: "Point of Sale Stores",
    subtitle: "Use this page to view the details of a specific store.",

    none: "No stores found.",

    storeId: "BTCPay Store",
    recipient: "Recipient",

    explainerText: "The Point of Sale (POS) is a feature that allows you to collect payments from your customers in Bitcoin. Every time your customer pays you in Bitcoin, it will automatically convert your desired % of the sale back into dollars or colones to your bank account and deliver the remaining balance in Bitcoin to your wallet.",
    tryItOut: "Try it out!",
    customerPays: "Customer Pays",
    yourBusinessSplits: "Your Business Splits",

    qrCodeText: "Scan to open your Point of Sale",
    qrCodeCopied: "The Point of Sale has been copied to your clipboard. You can now open this link in any web browser.",

  },


}

export default en