import { Lesson, LessonGroup, Difficulty } from '@/types/lesson';

// Beginner lessons (8)
import { variablesAndTypes } from './beginner/variables-and-types';
import { typeInference } from './beginner/type-inference';
import { functions } from './beginner/functions';
import { arraysAndObjects } from './beginner/arrays-and-objects';
import { controlFlow } from './beginner/control-flow';
import { errorHandling } from './beginner/error-handling';
import { webFundamentals } from './beginner/web-fundamentals';
import { developerTooling } from './beginner/developer-tooling';

// Intermediate lessons (10)
import { interfaces } from './intermediate/interfaces';
import { typeAliases } from './intermediate/type-aliases';
import { unionAndLiteralTypes } from './intermediate/union-and-literal-types';
import { classes } from './intermediate/classes';
import { generics } from './intermediate/generics';
import { typeGuards } from './intermediate/type-guards';
import { enumsAndModules } from './intermediate/enums-and-modules';
import { modernOperators } from './intermediate/modern-operators';
import { functionalProgramming } from './intermediate/functional-programming';
import { asyncProgramming } from './intermediate/async-programming';

// Advanced lessons (7)
import { mappedTypes } from './advanced/mapped-types';
import { conditionalTypes } from './advanced/conditional-types';
import { utilityTypes } from './advanced/utility-types';
import { templateLiteralTypes } from './advanced/template-literal-types';
import { inferKeyword } from './advanced/infer-keyword';
import { decoratorsAndPatterns } from './advanced/decorators-and-patterns';
import { advancedPatterns } from './advanced/advanced-patterns';

// All lessons in curriculum order (25 total)
const allLessons: Lesson[] = [
  // Beginner (1-8)
  variablesAndTypes,
  typeInference,
  functions,
  arraysAndObjects,
  controlFlow,
  errorHandling,
  webFundamentals,
  developerTooling,
  // Intermediate (9-18)
  interfaces,
  typeAliases,
  unionAndLiteralTypes,
  classes,
  generics,
  typeGuards,
  enumsAndModules,
  modernOperators,
  functionalProgramming,
  asyncProgramming,
  // Advanced (19-25)
  mappedTypes,
  conditionalTypes,
  utilityTypes,
  templateLiteralTypes,
  inferKeyword,
  decoratorsAndPatterns,
  advancedPatterns,
];

/**
 * Get all lessons in order
 */
export function getAllLessons(): Lesson[] {
  return allLessons;
}

/**
 * Get a lesson by its slug
 */
export function getLessonBySlug(slug: string): Lesson | undefined {
  return allLessons.find((lesson) => lesson.slug === slug);
}

/**
 * Get lessons grouped by difficulty
 */
export function getLessonsByDifficulty(): LessonGroup[] {
  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
  const labels: Record<Difficulty, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return difficulties.map((difficulty) => ({
    difficulty,
    label: labels[difficulty],
    lessons: allLessons
      .filter((lesson) => lesson.difficulty === difficulty)
      .sort((a, b) => a.order - b.order),
  }));
}

/**
 * Get the next and previous lessons for navigation
 */
export function getAdjacentLessons(currentSlug: string): {
  previous: Lesson | null;
  next: Lesson | null;
} {
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
 * Get lesson order (1-20)
 */
export function getLessonOrder(slug: string): number | undefined {
  return getLessonBySlug(slug)?.order;
}
