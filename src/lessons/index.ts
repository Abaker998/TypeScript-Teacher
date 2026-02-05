import { Lesson, LessonGroup, Language } from '@/types/lesson';
import { typescriptLessons, getTypescriptLessonsByDifficulty } from './typescript';
import { csharpLessons, getCsharpLessonsByDifficulty } from './csharp';
import { sqlLessons, getSqlLessonsByDifficulty } from './sql';

/**
 * Get all lessons for a specific language
 */
export function getAllLessons(language: Language = 'typescript'): Lesson[] {
  switch (language) {
    case 'typescript':
      return typescriptLessons;
    case 'csharp':
      return csharpLessons;
    case 'sql':
      return sqlLessons;
    default:
      return typescriptLessons;
  }
}

/**
 * Get a lesson by its slug for a specific language
 */
export function getLessonBySlug(language: Language, slug: string): Lesson | undefined {
  const lessons = getAllLessons(language);
  return lessons.find((lesson) => lesson.slug === slug);
}

/**
 * Get lessons grouped by difficulty for a specific language
 */
export function getLessonsByDifficulty(language: Language = 'typescript'): LessonGroup[] {
  switch (language) {
    case 'typescript':
      return getTypescriptLessonsByDifficulty();
    case 'csharp':
      return getCsharpLessonsByDifficulty();
    case 'sql':
      return getSqlLessonsByDifficulty();
    default:
      return getTypescriptLessonsByDifficulty();
  }
}

/**
 * Get the next and previous lessons for navigation
 */
export function getAdjacentLessons(
  language: Language,
  currentSlug: string
): {
  previous: Lesson | null;
  next: Lesson | null;
} {
  const allLessons = getAllLessons(language);
  const currentIndex = allLessons.findIndex((l) => l.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
    next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
  };
}

/**
 * Get lesson order (1-30) for a specific language
 */
export function getLessonOrder(language: Language, slug: string): number | undefined {
  return getLessonBySlug(language, slug)?.order;
}

/**
 * Get multiple lessons by their slugs for a specific language, preserving the order of the input slugs.
 * Filters out any slugs that don't match existing lessons.
 */
export function getLessonsBySlugs(language: Language, slugs: string[]): Lesson[] {
  return slugs
    .map((slug) => getLessonBySlug(language, slug))
    .filter((lesson): lesson is Lesson => lesson !== undefined);
}

// Re-export for backwards compatibility and direct access
export { typescriptLessons } from './typescript';
export { csharpLessons } from './csharp';
export { sqlLessons } from './sql';
