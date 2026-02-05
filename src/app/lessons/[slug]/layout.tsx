import { Metadata } from 'next';
import { getLessonBySlug } from '@/lessons';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

/**
 * Generate dynamic metadata for legacy lesson routes.
 * Defaults to TypeScript lessons for backwards compatibility.
 */
export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const lesson = getLessonBySlug('typescript', params.slug);

  if (!lesson) {
    return {
      title: 'Lesson Not Found | Code Tutor',
      description: 'The requested lesson could not be found.',
    };
  }

  return {
    title: `${lesson.title} | Code Tutor`,
    description: lesson.description,
  };
}

/**
 * Layout component for legacy lesson routes.
 * These routes redirect to the new language-prefixed routes.
 */
export default function LessonLayout({ children }: LayoutProps): JSX.Element {
  return <>{children}</>;
}
