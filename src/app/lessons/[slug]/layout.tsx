import { Metadata } from 'next';
import { getLessonBySlug } from '@/lessons';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

/**
 * Generate dynamic metadata for lesson pages based on the lesson slug.
 * This allows each lesson page to have a unique title and description in the browser tab.
 */
export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const lesson = getLessonBySlug(params.slug);

  if (!lesson) {
    return {
      title: 'Lesson Not Found | TypeScript Teacher',
      description: 'The requested lesson could not be found.',
    };
  }

  return {
    title: `${lesson.title} | TypeScript Teacher`,
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
