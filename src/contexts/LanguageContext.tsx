'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { Language, LanguageInfo } from '@/types/lesson';
import { languages, isValidLanguage, DEFAULT_LANGUAGE } from '@/data/languages';

interface LanguageContextType {
  language: Language;
  languageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
  /** Override the language (useful for static pages or testing) */
  languageOverride?: Language;
}

/**
 * Provides the current language context to the app.
 * Extracts language from URL params or uses the override/default.
 */
export function LanguageProvider({ children, languageOverride }: LanguageProviderProps) {
  const params = useParams();

  // Determine the language: override > URL param > default
  let language: Language = DEFAULT_LANGUAGE;

  if (languageOverride) {
    language = languageOverride;
  } else if (params?.lang && typeof params.lang === 'string' && isValidLanguage(params.lang)) {
    language = params.lang;
  }

  const languageInfo = languages[language];

  return (
    <LanguageContext.Provider value={{ language, languageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access the current language context.
 * Must be used within a LanguageProvider.
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}

/**
 * Hook to safely access language context, returning default if not in provider.
 * Also checks URL params directly as fallback for components outside LanguageProvider.
 */
export function useLanguageSafe(): LanguageContextType {
  const context = useContext(LanguageContext);
  const params = useParams();

  if (context) {
    return context;
  }

  // Fallback: try to get language from URL params directly
  if (params?.lang && typeof params.lang === 'string' && isValidLanguage(params.lang)) {
    return {
      language: params.lang,
      languageInfo: languages[params.lang],
    };
  }

  return {
    language: DEFAULT_LANGUAGE,
    languageInfo: languages[DEFAULT_LANGUAGE],
  };
}
