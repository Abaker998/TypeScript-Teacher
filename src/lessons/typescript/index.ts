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

// Capstone project (1)
import { todoAppCapstone } from './capstone/todo-app';

// Group tests (4)
import { beginnerTest } from './group-tests/beginner-test';
import { intermediateTest } from './group-tests/intermediate-test';
import { advancedTest } from './group-tests/advanced-test';
import { masterTest } from './group-tests/master-test';

// All TypeScript lessons in curriculum order (30 total)
export const typescriptLessons: Lesson[] = [
  // Beginner (1-8)
  variablesAndTypes,
  typeInference,
  functions,
  arraysAndObjects,
  controlFlow,
  errorHandling,
  webFundamentals,
  developerTooling,
  // Beginner Test (9)
  beginnerTest,
  // Intermediate (10-19)
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
  // Intermediate Test (20)
  intermediateTest,
  // Advanced (21-27)
  mappedTypes,
  conditionalTypes,
  utilityTypes,
  templateLiteralTypes,
  inferKeyword,
  decoratorsAndPatterns,
  advancedPatterns,
  // Advanced Test (28)
  advancedTest,
  // Capstone (29)
  todoAppCapstone,
  // Master Test (30)
  masterTest,
];

/**
 * Get TypeScript lessons grouped by difficulty
 */
export function getTypescriptLessonsByDifficulty(): LessonGroup[] {
  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'master'];
  const labels: Record<Difficulty, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    master: 'Master',
  };

  return difficulties.map((difficulty) => ({
    difficulty,
    label: labels[difficulty],
    lessons: typescriptLessons
      .filter((lesson) => lesson.difficulty === difficulty)
      .sort((a, b) => a.order - b.order),
  }));
}
