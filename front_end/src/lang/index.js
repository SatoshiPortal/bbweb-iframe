import en from './en.js'
import es from './es.js'

export const localizeText = (lang) => {
  if(lang.indexOf('en') === 0) {
    return en
  }

  if(lang.indexOf('es') === 0) {
    return es
  }

  return en
}

export const localize = (localized, key, vars) => {
  let output = getPropByString(localized, key) || ""

  if(vars) {
    const varKeys = Object.keys(vars)
    for (var i = varKeys.length - 1; i >= 0; i--) {
      const varKey = varKeys[i]
      const myVar = vars[varKey]

      output = output.replace(`{${varKey}}`, myVar)
    }
  }

  return output
}

function getPropByString(obj, propString) {
  if (!propString)
    return obj;

  var prop, props = propString.split('.');

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
}
