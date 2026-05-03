import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const getByPath = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('mindbridge_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('mindbridge_lang', language);
  }, [language]);

  const t = useMemo(() => {
    return (key, fallback = key) => {
      const current = getByPath(translations[language], key);
      if (current !== undefined) return current;
      const english = getByPath(translations.en, key);
      return english !== undefined ? english : fallback;
    };
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
