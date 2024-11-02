import { createContext, useState } from 'react';

import { getLanguage } from '../utils/index.js'
import { localizeText } from '../lang/index.js';

export const LanguageContext = createContext({
    lang: "",
    setLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(getLanguage());
  
    const languageContext = {
      ...localizeText(language),
      lang: language,
      setLanguage: setLanguage
    };
  
    return (
      <LanguageContext.Provider value={languageContext}>
        {children}
      </LanguageContext.Provider>
    );
  };