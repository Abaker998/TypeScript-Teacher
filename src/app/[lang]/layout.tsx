import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { isValidLanguage } from '@/data/languages';
import { Language } from '@/types/lesson';

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

/**
 * Generate metadata for language-specific pages.
 */
export async function generateMetadata({ params }: Omit<LanguageLayoutProps, 'children'>): Promise<Metadata> {
  if (!isValidLanguage(params.lang)) {
    return {
      title: 'Not Found | Code Tutor',
    };
  }

  const languageNames: Record<Language, string> = {
    typescript: 'TypeScript',
    csharp: 'C#',
    sql: 'SQL',
  };

  return {
    title: `Learn ${languageNames[params.lang]} | Code Tutor`,
    description: `Interactive ${languageNames[params.lang]} lessons with hands-on coding exercises`,
  };
}

/**
 * Generate static params for language routes.
 */
export function generateStaticParams() {
  return [{ lang: 'typescript' }, { lang: 'csharp' }];
}

/**
 * Layout component for language-specific routes.
 * Validates the language parameter and provides LanguageContext.
 */
export default function LanguageLayout({ children, params }: LanguageLayoutProps): JSX.Element {
  // Validate language parameter
  if (!isValidLanguage(params.lang)) {
    notFound();
  }

  return (
    <LanguageProvider languageOverride={params.lang}>
      {children}
    </LanguageProvider>
  );
}
