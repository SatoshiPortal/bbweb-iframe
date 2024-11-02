const es = {
  loading: "Cargando",
  sinpe: "SINPE Móvil",
  iban: "Cuenta IBAN",
  crc: "Colones",
  usd: "Dolares",
  btc: "Bitcoin",
  sats: "Sats",
  continue: "Continuar",
  cancel: "Cancelar",
  canceled: "Cancelado",
  save: "Guardar",
  edit: "Actualizar",
  refresh: "Actualizar",
  previous: "Anterior",
  next: "Próxima",
  delete: "Eliminar",
  close: "Cerrar",
  IN_PENDING: "Ingreso Pendiente",
  IN_COMPLETED: "Ingreso Completado",
  OUT_PENDING: "Salida Pendiente",
  OUT_IN_PROGRESS: "Salida en Progreso",
  OUT_COMPLETED: "Salida Completado",
  DONE: "Completado",
  lightning: "Lightning",
  onchain: "Bitcoin (almacenamiento frío)",
  systemAlertTitle: "Noticia Importante",
  my: "Mis",
  new: "Nuevo",
  view: "Ver",
  rejected: "Rechazada",
  approved: "Aprobada",
  processing: "Procesando",
  send: "Enviar",
  balanceUsd: "Saldo Dolares",
  balanceCrc: "Saldo Colones",

  navigation: {
    home: "Inicio",
    recipients: "Destinatarios",
    orders: "Ordenes",
    pos: "Punto de Venta",
    manage: "Actualizar Cuenta",
    logout: "Salir",
  },

  login: {
    welcome: "Bienvenidos a Bull Bitcoin",

    newUserHeader: "Clientes Nuevos",
    newUserText: "Si aún no tienes cuenta con Bull Bitcoin, comience aquí.",
    newUserBtn: "Crear Cuenta",

    returningUserHeader: "Clientes Existentes",
    returningUserText: "Si ya tienes una cuenta con Bull Bitcoin, haga clic aquí para iniciar.",
    returningUserBtn: "Ingresar",

    systemMaintenance: "El sistema está en mantenimiento. ¡Vuelva pronto!",

    bitcoinOnly: "Porque no hay segundo mejor. ¡Sé indómito!",
    bitcoinOnlyTitle: "Solo Bitcoin",
    lightningFast: "Compra y vende Bitcoin en segundos. Onchain y Lightning.",
    lightningFastTitle: "Rápido como rayo",
    selfCustodial: "Bull Bitcoin no toma custodia de fondos. Mantenga control de tus fondos.",
    selfCustodialTitle: "Autocustodia",

    error: "Ha ocurrido un error durante el inicio de sesión",
    mfaError: "Cuentas con MFA no pueden crear Puntos de Venta en este momento. Póngase en contacto con el soporte.",
  },

  home: {
    buyBtnTitle: "Comprar Bitcoin",
    buyBtnSubtitle: "Reciba bitcoin en su billetera",

    sellBtnTitle: "Vender Bitcoin",
    sellBtnSubtitle: "Envia un pago por SINPE",

    contactBtnTitle: "Contactar Soporte",
    contactBtnSubtitle: "Póngase en contacto si tiene alguna pregunta",

    priceBtnTitle: "Ver Precios",
    priceBtnSubtitle: "Revisa la tasa actual",
  },

  recipients: {
    title: "Destinatarios",
    subtitle: "Una lista de todos tus destinatarios.",

    selectTitle: "Seleccione destinatario existente",
    selectSubtitle: "Seleccione el destinatario al que desea enviar.",

    createBtn: "Crear Destinatario",
    sendBtn: "Enviar Pago",

    none: "No se encontraron destinatarios.",

    select: "Seleccionar",
  },

  createrecipient: {
    title: "Crear Destinatario",
    subtitle: "Agregue un destinatario nuevo a su cuenta.",

    editTitle: "Actualizar Destinatario",
    editSubtitle: "Haga cambios en un destinatario existente en su cuenta.",

    nameTitle: "Contacto Favorito (opcional)",
    namePlaceholder: "Carnicería",

    destinationTypeTitle: "Tipo de Destino",

    phoneNumberTitle: "Número de Teléfono",

    delete: "¿Está seguro de que desea eliminar este destinatario?",

    "invalid-sinpe": "Este número de teléfono no está suscrito a SINPE Movil.",
    "uknown-iban": "No se encuentra esta cuenta IBAN.",

    errors: {
      destination: "Se requiere un destino.",
      invalidCurrencyCreate: "No puede crear un destinatario de este tipo de moneda.",
      invalidSinpe: "El destino no es un número de teléfono válido.",
      invalidIban: "El destino no es una cuenta IBAN válida.",
      invalidCurrency: "Moneda no válida para este orden.",
      invalidDestination: "No se puede localizar los detalles de esta cuenta.",
    },
  },

  orders: {
    title: "Ordenes",
    subtitle: "Una lista de todos los ordens en su cuenta.",

    createBtn: "Crear Orden",

    date: "Fecha",
    orderNumber: "Número de Orden",
    type: "Tipo",
    source: "Origen",
    status: "Estado",
    amount: "Monto",

    none: "No se encontraron ordens.",

    viewBtn: "Detalles",
  },

  settings: {
    title: "Configuración",
    subtitle: "Administre los detalles de su cuenta.",

    email: "Correo Electrónico",
    password: "Contraseña",
    name: "Nombre Completo",
    firstName: "Nombres",
    lastName: "Apellidos",
    phone: "Número de Teléfono",
    country: "País",
    userNumber: "Número de Usuario",
    identity: "Identidad",

    verifyBtn: "Verificar",
    updateBtn: "Actualizar",

    pendingBalance: "Pending Payments",
  },

  onboarding: {
    step: "Paso",

    step1Title: "Verificación Correo",
    step2Title: "Verificación Teléfono",
    step3Title: "Verificación Nombre",
  },

  verifyphone: {
    title: "Verifica número de teléfono",
    subtitle1: "Ingrese su número de teléfono para recibir un código.",
    subtitle2: "Ingrese el código que se acaba de enviar a su teléfono.",
    rejected: "No se acepta número de teléfonos de este pais.",

    code: "Código de Verificación",
    resendBtn: "Reenviar Código",
    verifyBtn: "Verifica Número",
  },

  verifyemail: {
    title: "Verifica Correo Electrónico",
    subtitle: "Verifique {email} y haga clic en el enlace para verificar su dirección.",
    resendBtn: "Reenviar Correo",
    confirmBtn: "OK, Listo",
  },

  verifyname: {
    title: "Verifica Nombre",
    subtitle: "Agregue su nombre completo a su perfil.",
    confirmBtn: "Verifica Nombre",
  },

  verifyidentity: {
    title: "Verificar Identidad",
    subtitle: "Por favor, verifique su identidad para aumentar sus límites.",
    text: "Por favor, haga clic en el botón de abajo para comenzar. Necesitará un dispositivo móvil con cámara y su identificación.",
    confirmBtn: "Comenzar Ahora",

    notAllowedToTry: "Por favor, complete primero la verificación de su correo electrónico, teléfono y nombre.",
  },

  createorderprogress: {
    amount: "Monto",
    recipient: "Destinatario",
    message: "Mensaje",
    confirm: "Confirmar",
    deposit: "Depósito",
    method: "Método",
    rate: "1 BTC",

    IN_CRC_RDV_SINPE: "SINPE",
    IN_CRC_RDV_IBAN: "IBAN",
    IN_USD_RDV_IBAN: "IBAN",

    OUT_LN: "Lightning",
    OUT_LNURL_PAY: "Dirección Lightning",
    OUT_BITCOIN: "Bitcoin",
  },

  amount: {
    title: "Monto",
    subtitle: "Ingrese la cantidad que desea vender.",
    buySubtitle: "Ingrese la cantidad que desea comprar.",

    satsBtn: "Vender todo",
    satsBtnConfirm: "¿Estás seguro de que deseas vender todos tus sats?",

    errors: {
      amount: "Se requiere un monto.",
      invalidAmount: "Monto invalido.",
      currency: "Se require una moneda.",
      invalidCurrency: "Moneda no válida para este destinatario.",
      disabledCurrency: "Esta moneda está deshabilitada temporalmente. Pruebe otra moneda o regrese más tarde.",
    },

  },

  message: {
    title: "Mensaje",
    subtitle: "Ingrese un mensaje opcional para incluir con su pago.",
    placeholder: "Frutas y Verduras",
  },

  confirmsell: {
    title: "Confirmar Detalles",
    subtitle: "Revise y confirme los detalles de su orden.",
    confirmBtn: "Envia Pago",
    includesFees: "Tarifa Total",

    errors: {
      overBalance: "Esta cantidad de pedido excede el saldo de su billetera.",
    },
  },

  confirmbuy: {
    confirmBtn: "Crear Orden",

    bolt11Prompt: "Proporcione una factura lightning para {satAmount} sats.",
    bolt11AmountError: "La factura lightning proporcionada fue por la cantidad incorrecta. Inténtalo de nuevo.",

    addressInput: "Dirección Destinatario",
    invalidAddress: "Dirección de Bitcoin inválido",
    invalidLightningAddress: "Dirección de Lightning inválido",
    invalidInvoice: "Factura Lightning inválida",

    myLightningAddress: "Mi Cartera Bitcoin Jungle",
  },

  processorder: {
    title: "Procesando su orden",
    subtitle: "Estamos procesando su orden, espere.",

    successTitle: "Orden completado con éxito!",
    orderNumber: "Número de orden ",
    referenceNumber: "Número de comprobante ",

    paying: "Pagando la factura de lightning",

    error: "Hubo un error que realizaba su orden. Por favor, inténtelo de nuevo más tarde.",
    timeoutError: "Hemos recibido su orden y estamos trabajando para procesarla lo más rápido posible.",

    returnToWallet: "Volver a app",
  },

  rules: {
    title: "Reglas Importantes",
    subtitle: "Tenga en cuenta las siguientes reglas antes de comprar Bitcoin.",

    one: "No aceptamos transferencias de terceros. Esto significa que todos los fondos deben provenir de una cuenta bancaria a su nombre (o el de su empresa).",
    two: "Recomendamos no escribir cosas como bitcoin, btc, crypto, etc. en el campo memo. Esto es por tu privacidad.",
    three: "Para ordenes con entrega por Lightning, solo aceptamos transferencias bancarias instantáneas. Para ordenes de Bitcoin (on-chain), aceptamos transferencias bancarias instantáneas y lentas (de 1 a 3 días).",
    four: "La moneda eligida en este formulario debe corresponder con la moneda que usted nos envía desde su banco.",
    
    after: "El incumplimiento de estas reglas puede resultar en una prohibición permanente de Bull Bitcoin y Toro Pagos.",

    rule: "Regla",

    checkingPermission: "Comprobación de permisos",
    noBuyPermission: "Solo puede comprar Bitcoin si su número de teléfono está registrado en SINPE Móvil o si su identidad ha sido verificado. Póngase en contacto con soporte si no tiene SINPE Móvil y desea comprar con su cuenta bancaria.",
    noSellPermission: "Solo puede vender bitcoin después de verificar su correo electrónico, teléfono y nombre. Póngase en contacto con soporte si tiene alguna pregunta.",
    dailyLimitHit: "Has superado su límite diario. Estos límites se aplican por período de 24 horas.",
    noPermission: "Tu cuenta no tiene permiso para realizar esta acción. Póngase en contacto con el soporte si tiene alguna pregunta.",
  },

  deposit: {
    title: "Depósito",
    subtitle: "Haga una transferencia bancaria al monto de {amount} de su banco al nuestro.",

    details: "Aquí están los detalles de nuestra cuenta.",
    cedula: "Nuestra Cédula Jurídica es 3-102-875766, Toro Pagos Limitada.",

    automatic: "Envia SINPE por mensaje",
    manual: "Envia SINPE manualmente",

    descriptionTitle: "Incluya la siguiente descripción con su transferencia.",
    descriptionSubtitle: "No incluya ninguna otra descripción.",

    slowAllowed: "Los ordenes de Bitcoin (on-chain) admiten métodos de transferencia bancaria lentos (de 1 a 3 días), así como métodos de transferencia bancaria instantánea. Tenga en cuenta que si elige un método de transferencia bancaria lenta, su cotización se volverá a calcular en el momento en que recibamos la transferencia bancaria.",

    confirmTitle: "Confirme que haya completado su transferencia.",
    confirmSubtitle: "Si no realiza la transferencia inmediata ahora, su cotización puede cambiar.",
    confirmLabel: "He completado la transferencia bancaria.",

  },

  sendsms: {
    title: "Elige tu banco",
    subtitle: "Seleccione el banco que enviará desde abajo.",
  },

  buytype: {
    title: "Métodos de Transferencias",
    subtitle: "Seleccione los métodos de transferencia entrantes y salientes que desee.",

    fiatTitle: "Método de Transferencia Entrante",
    fiatSubtitle: "Seleccione cómo enviará la transferencia de su banco al nuestro.",

    bitcoinTitle: "Método de Transferencia Saliente",
    bitcoinSubtitle: "Selecciona cómo te gustaría recibir tu Bitcoin.",
  },

  orderdetails: {
    title: "Detalles de Orden",
    subtitle: "Use esta página para ver los detalles de un pedido específico.",
    receiptBtn: "Ver Comprobante",
    success: "Transferencia Exitosa",

    type: "Tipo",
    bitcoinAmount: "Monto Bitcoin",
    fiatAmount: "Monto Fiat",
    fiatAmountNoFiat: "Monto",
    transferCode: "Descripción de Transferencia",
    destinationAddress: "Dirección de destino",
    destinationHash: "Transacción Bitcoin",
    message: "Descripción",
    origin: "Origen",
    destination: "Destinatario",
    rate: "1 BTC",
    network: "Red",

    SELL: "Venta",
    BUY: "Compra",


  },

  invoice: {
    pay: "Paga Factura",
    copied: "La factura se ha copiado en el portapapeles. Abra su billetera y pague esta factura.",

  },

  rates: {
    title: "Ver Precios",
    subtitle: "Utilice esta página para ver la tasa de compra y venta actual.",
    buy: "Tasa de Compra",
    sell: "Tasa de Venta",
    index: "Tasa Indexada",
    explainer1: "Bull Bitcoin calcula la Tasa de Compra de Bitcoin y la Tasa de Venta de Bitcoin para incluir la Tasa de Compra en USD y la Tasa de Venta en USD que obtiene de sus socios bancarios. Esto se debe al hecho de que no existe un mercado público donde Bitcoin se intercambie por Colones.",
    explainer2: "Las tasas cobradas por Bull Bitcoin se establecen al mínimo posible para garantizar no perder dinero al proporcionar el intercambio. Estamos comprometidos a mantener las tarifas más bajas posibles para beneficiar a los usuarios.",
    explainer3: "Bitcoin Jungle es una organización independiente que calcula sus propias tasas de cambio de Bitcoin. Como resultado, las tasas utilizadas por Bull Bitcoin y Bitcoin Jungle serán diferentes.",
    readMore: "Leer Más",
  },

  support: {
    title: "Soporte",
    subtitle: "¡Ponte en contacto con nosotros si tienes alguna pregunta!",

    whatsapp: "WhatsApp",
    faq: "Preguntas Frecuentes",
    email: "Correo Electrónico",
    twitter: "Twitter",
  },

  loadingMessages: [
    "Recuerda tomar la autocustodia de tu bitcoin",
    "No confíes, verifica",
    "Estudia Bitcoin",
    "Bitcoin es una herramienta para liberar a la humanidad de oligarcas y tiranos",
    "Bitcoin es el avance monetario más significativo desde la creación de monedas",
    "Habrá una moneda nativa de Internet dentro de nuestra vida",
    "Canciller a punto del segundo rescate para los bancos",
    "Construimos soberanía",
    "La responsabilidad personal es el pilar de la sociedad",
    "Bitcoin- No hay segundo mejor",
  ],

  createpointofsaleprogress: {
    authenticate: "Autenticar",
    recipient: "Destinatario",
    percent: "Porcentaje",
    create: "Crear",
  },

  posform: {
    title: "Su tienda está lista",
    subtitle: "Ahora puede empezar a aceptar pagos.",
    open: "Abrir Mi Tienda",
  },

  apiauth: {
    title: "Autenticación",
    subtitle: "Por favor, inicie sesión con sus credenciales de Bull Bitcoin para continuar.",
    email: "Correo Electrónico",
    password: "Contraseña",
  },

  percentslider: {
    title: "Establecer Porcentaje",
    subtitle: "Seleccione un porcentaje entre 1 y 100. Este porcentaje representa la parte que debe ser convertida a fiat.",
    percentage: "Porcentaje",
  },

  posstore: {
    title: "Crear Tienda",
    subtitle: "Por favor, complete los detalles para crear una tienda.",
    storeName: "Nombre de la Tienda",
    storeOwnerEmail: "Correo Electrónico del Propietario de la Tienda",
    currency: "Moneda",
    language: "Idioma",
    bitcoinJungleUsername: "Nombre de Usuario de Bitcoin Jungle",
    create: "Crear Tienda",
  },

  pos: {
    title: "Puntos de Venta",
    subtitle: "Use esta página para ver los detalles de una tienda específica.",
    none: "No se encontraron tiendas.",

    storeId: "BTCPay Tienda",
    recipient: "Destinatario",

    explainerText: "El punto de venta (POS) es una función que le permite recoger pagos de sus clientes en Bitcoin. Cada vez que su cliente paga en Bitcoin, automáticamente convertirá su porcentaje deseado del pago en dólares o colones a su cuenta bancaria y entregará el saldo restante en Bitcoin a su billetera.",
    tryItOut: "¡Inténtalo!",
    customerPays: "El cliente paga",
    yourBusinessSplits: "Cantidad de Bitcoin/Fiat",

    qrCodeText: "Escanea para abrir tu Punto de Venta",
    qrCodeCopied: "El punto de venta ha sido copiado al portapapeles. Ahora puedes abrir este enlace en cualquier navegador web.",
  },
}

export default es