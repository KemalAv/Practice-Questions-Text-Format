
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { translations, TranslationKeys, formatString, TranslationSet } from '../translations';
import { Language } from '../types';

// Re-export TranslationSet so it can be imported from this module
export type { TranslationSet };

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys, ...args: (string | number)[]) => string;
  getCurrentTranslations: () => TranslationSet;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id'); // Default to Indonesian

  const t = useCallback((key: TranslationKeys, ...args: (string | number)[]): string => {
    const langSet = translations[language] as TranslationSet;
    const fallbackLangSet = translations['id'] as TranslationSet; // Fallback to 'id' if key missing in 'en' for some reason
    
    let text: string | undefined = langSet[key];

    if (text === undefined) {
      // Fallback to English if not found in current language, then to key itself
      text = (translations['en'] as TranslationSet)[key] || (fallbackLangSet[key] as string | undefined);
      if (text === undefined) {
        console.warn(`Translation key "${String(key)}" not found in language "${language}" or fallbacks.`);
        text = String(key); // Return key if not found anywhere
      }
    }
    
    if (args.length > 0) {
      return formatString(text, ...args);
    }
    return text;
  }, [language]);

  const getCurrentTranslations = useCallback((): TranslationSet => {
    return translations[language] as TranslationSet;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, getCurrentTranslations }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
