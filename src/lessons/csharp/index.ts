import { Lesson, LessonGroup, Difficulty } from '@/types/lesson';

// Beginner lessons (8)
import { variablesAndTypes } from './beginner/variables-and-types';
import { typeInference } from './beginner/type-inference';
import { methods } from './beginner/methods';
import { collectionsAndObjects } from './beginner/collections-and-objects';
import { controlFlow } from './beginner/control-flow';
import { errorHandling } from './beginner/error-handling';
import { webFundamentals } from './beginner/web-fundamentals';
import { developerTooling } from './beginner/developer-tooling';

// Intermediate lessons (10)
import { csharpInterfaces as interfaces } from './intermediate/interfaces';
import { csharpTypeAliases as typeAliases } from './intermediate/type-aliases';
import { csharpUnionTypes as unionTypes } from './intermediate/union-types';
import { csharpClasses as classes } from './intermediate/classes';
import { csharpGenerics as generics } from './intermediate/generics';
import { csharpTypeGuards as typeGuards } from './intermediate/type-guards';
import { csharpEnumsAndNamespaces as enumsAndNamespaces } from './intermediate/enums-and-namespaces';
import { csharpModernOperators as modernOperators } from './intermediate/modern-operators';
import { csharpLinq as linq } from './intermediate/linq';
import { csharpAsyncProgramming as asyncProgramming } from './intermediate/async-programming';

// Advanced lessons (7)
import { reflection } from './advanced/reflection';
import { attributes } from './advanced/attributes';
import { extensionMethods } from './advanced/extension-methods';
import { expressionTrees } from './advanced/expression-trees';
import { advancedGenerics } from './advanced/advanced-generics';
import { dependencyInjection } from './advanced/dependency-injection';
import { advancedPatterns } from './advanced/advanced-patterns';

// Capstone project (1)
import { todoAppCapstone } from './capstone/todo-app';

// Group tests (4)
import { beginnerTest } from './group-tests/beginner-test';
import { intermediateTest } from './group-tests/intermediate-test';
import { advancedTest } from './group-tests/advanced-test';
import { masterTest } from './group-tests/master-test';

// All C# lessons in curriculum order (30 total)
export const csharpLessons: Lesson[] = [
  // Beginner (1-8)
  variablesAndTypes,
  typeInference,
  methods,
  collectionsAndObjects,
  controlFlow,
  errorHandling,
  webFundamentals,
  developerTooling,
  // Beginner Test (9)
  beginnerTest,
  // Intermediate (10-19)
  interfaces,
  typeAliases,
  unionTypes,
  classes,
  generics,
  typeGuards,
  enumsAndNamespaces,
  modernOperators,
  linq,
  asyncProgramming,
  // Intermediate Test (20)
  intermediateTest,
  // Advanced (21-27)
  reflection,
  attributes,
  extensionMethods,
  expressionTrees,
  advancedGenerics,
  dependencyInjection,
  advancedPatterns,
  // Advanced Test (28)
  advancedTest,
  // Capstone (29)
  todoAppCapstone,
  // Master Test (30)
  masterTest,
];

/**
 * Get C# lessons grouped by difficulty
 */
export function getCsharpLessonsByDifficulty(): LessonGroup[] {
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
    lessons: csharpLessons
      .filter((lesson) => lesson.difficulty === difficulty)
      .sort((a, b) => a.order - b.order),
  }));
}
