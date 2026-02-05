import { Metadata } from 'next';
import { getLessonBySlug } from '@/lessons';
import { isValidLanguage } from '@/data/languages';
import { Language } from '@/types/lesson';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
    slug: string;
  };
}

/**
 * Generate dynamic metadata for lesson pages based on the lesson slug and language.
 * This allows each lesson page to have a unique title and description in the browser tab.
 */
export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const language = isValidLanguage(params.lang) ? params.lang : 'typescript';
  const lesson = getLessonBySlug(language as Language, params.slug);

  const languageNames: Record<Language, string> = {
    typescript: 'TypeScript',
    csharp: 'C#',
    sql: 'SQL',
  };

  if (!lesson) {
    return {
      title: 'Lesson Not Found | Code Tutor',
      description: 'The requested lesson could not be found.',
    };
  }

  return {
    title: `${lesson.title} | ${languageNames[language as Language]} | Code Tutor`,
    description: lesson.description,
  };
}

/**
 * Layout component for lesson pages.
 * Provides consistent structure and metadata for all lesson routes.
 */
export default function LessonLayout({ children }: LayoutProps): JSX.Element {
  return <>{children}</>;
}
