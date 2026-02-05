import { Language, LanguageInfo } from '@/types/lesson';

/**
 * Language definitions for Code Tutor.
 * Each language has display information and editor configuration.
 */
export const languages: Record<Language, LanguageInfo> = {
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    icon: '📘',
    description: 'JavaScript with syntax for types. Build type-safe applications with modern JavaScript features.',
    color: '#3178C6',
    editorLanguage: 'typescript',
  },
  csharp: {
    id: 'csharp',
    name: 'C#',
    icon: '💜',
    description: 'A modern, object-oriented language for building robust applications on the .NET platform.',
    color: '#512BD4',
    editorLanguage: 'csharp',
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    icon: '🗄️',
    description: 'The standard language for storing, manipulating, and retrieving data in relational databases.',
    color: '#336791',
    editorLanguage: 'sql',
  },
};

/**
 * Get language info by language ID.
 */
export function getLanguageInfo(language: Language): LanguageInfo {
  return languages[language];
}

/**
 * Get all supported languages as an array.
 */
export function getAllLanguages(): LanguageInfo[] {
  return Object.values(languages);
}

/**
 * Check if a string is a valid language ID.
 */
export function isValidLanguage(lang: string | undefined): lang is Language {
  return lang === 'typescript' || lang === 'csharp' || lang === 'sql';
}

/**
 * Default language for the platform.
 */
export const DEFAULT_LANGUAGE: Language = 'typescript';
