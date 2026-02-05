/**
 * Predefined learning paths - curated sequences of lessons
 * for different learning goals and time commitments.
 */

import type { Language, LearningPath } from '@/types/lesson';

// =============================================================================
// TypeScript Learning Paths
// =============================================================================

/**
 * Quick Start path - Essential TypeScript fundamentals
 * Perfect for developers who want to get productive quickly.
 */
const tsQuickStart: LearningPath = {
  id: 'ts-quick-start',
  name: 'Quick Start',
  description: 'Get up and running with TypeScript essentials. Perfect for developers who want to be productive quickly.',
  icon: '🚀',
  language: 'typescript',
  lessonSlugs: [
    'variables-and-types',
    'type-inference',
    'functions',
    'interfaces',
    'union-and-literal-types',
  ],
  estimatedHours: 3,
};

/**
 * Frontend Focus path - TypeScript for web development
 * Covers basics plus web-specific patterns and DOM typing.
 */
const tsFrontendFocus: LearningPath = {
  id: 'ts-frontend-focus',
  name: 'Frontend Focus',
  description: 'TypeScript for web developers. Covers fundamentals plus web-specific patterns, DOM typing, and React-friendly generics.',
  icon: '🌐',
  language: 'typescript',
  lessonSlugs: [
    'variables-and-types',
    'type-inference',
    'functions',
    'arrays-and-objects',
    'interfaces',
    'union-and-literal-types',
    'web-fundamentals',
    'generics',
    'async-programming',
  ],
  estimatedHours: 6,
};

/**
 * Type System Deep Dive - Advanced type manipulation
 * For developers who want to master TypeScript's type system.
 */
const tsTypeSystemDeepDive: LearningPath = {
  id: 'ts-type-system-deep-dive',
  name: 'Type System Deep Dive',
  description: 'Master advanced type manipulation. From type inference to conditional types, mapped types, and the infer keyword.',
  icon: '🔬',
  language: 'typescript',
  lessonSlugs: [
    'type-inference',
    'type-aliases',
    'union-and-literal-types',
    'type-guards',
    'generics',
    'mapped-types',
    'conditional-types',
    'utility-types',
    'template-literal-types',
    'infer-keyword',
  ],
  estimatedHours: 8,
};

// =============================================================================
// C# Learning Paths
// =============================================================================

/**
 * Quick Start path - Essential C# fundamentals
 * Perfect for developers who want to get productive quickly.
 */
const csQuickStart: LearningPath = {
  id: 'cs-quick-start',
  name: 'Quick Start',
  description: 'Get up and running with C# essentials. Perfect for developers who want to be productive quickly.',
  icon: '🚀',
  language: 'csharp',
  lessonSlugs: [
    'variables-and-types',
    'type-inference',
    'methods',
    'interfaces',
    'union-types',
  ],
  estimatedHours: 3,
};

/**
 * Backend Focus path - C# for backend development
 * Covers basics plus backend-specific patterns and ASP.NET patterns.
 */
const csBackendFocus: LearningPath = {
  id: 'cs-backend-focus',
  name: 'Backend Focus',
  description: 'C# for backend developers. Covers fundamentals plus ASP.NET patterns, dependency injection, and async programming.',
  icon: '🔧',
  language: 'csharp',
  lessonSlugs: [
    'variables-and-types',
    'type-inference',
    'methods',
    'collections-and-objects',
    'interfaces',
    'classes',
    'web-fundamentals',
    'dependency-injection',
    'async-programming',
  ],
  estimatedHours: 6,
};

/**
 * Type System Deep Dive - Advanced C# type features
 * For developers who want to master C#'s type system.
 */
const csTypeSystemDeepDive: LearningPath = {
  id: 'cs-type-system-deep-dive',
  name: 'Type System Deep Dive',
  description: 'Master advanced C# type features. From generics to reflection, attributes, and expression trees.',
  icon: '🔬',
  language: 'csharp',
  lessonSlugs: [
    'type-inference',
    'type-aliases',
    'union-types',
    'type-guards',
    'generics',
    'advanced-generics',
    'reflection',
    'attributes',
    'expression-trees',
    'extension-methods',
  ],
  estimatedHours: 8,
};

// =============================================================================
// SQL Learning Paths
// =============================================================================

/**
 * Quick Start path - Essential SQL fundamentals
 * Perfect for beginners who want to start querying data quickly.
 */
const sqlQuickStart: LearningPath = {
  id: 'sql-quick-start',
  name: 'Quick Start',
  description: 'Get up and running with SQL essentials. Perfect for beginners who want to start querying data quickly.',
  icon: '🚀',
  language: 'sql',
  lessonSlugs: [
    'sql-select-basics',
    'sql-filtering-data',
    'sql-sorting-data',
    'sql-aggregate-functions',
    'sql-joins-intro',
  ],
  estimatedHours: 3,
};

/**
 * Data Analysis Focus - SQL for data analysis
 * Covers queries, aggregations, and analytics patterns.
 */
const sqlDataAnalysisFocus: LearningPath = {
  id: 'sql-data-analysis-focus',
  name: 'Data Analysis Focus',
  description: 'SQL for data analysts. Covers querying, aggregations, window functions, and common analytics patterns.',
  icon: '📊',
  language: 'sql',
  lessonSlugs: [
    'sql-select-basics',
    'sql-filtering-data',
    'sql-sorting-data',
    'sql-aggregate-functions',
    'sql-grouping-data',
    'sql-joins',
    'sql-subqueries',
    'sql-window-functions',
    'sql-ctes',
  ],
  estimatedHours: 6,
};

/**
 * Database Developer path - Advanced SQL for developers
 * For developers who want to master database programming.
 */
const sqlDatabaseDeveloper: LearningPath = {
  id: 'sql-database-developer',
  name: 'Database Developer',
  description: 'Master database programming. From stored procedures to optimization, design patterns, and advanced features.',
  icon: '🔬',
  language: 'sql',
  lessonSlugs: [
    'sql-table-basics',
    'sql-constraints',
    'sql-indexes',
    'sql-views',
    'sql-stored-procedures',
    'sql-functions',
    'sql-triggers',
    'sql-transactions',
    'sql-query-optimization',
    'sql-database-design',
  ],
  estimatedHours: 8,
};

// =============================================================================
// All Learning Paths
// =============================================================================

/**
 * All predefined learning paths for TypeScript
 */
export const typescriptLearningPaths: LearningPath[] = [
  tsQuickStart,
  tsFrontendFocus,
  tsTypeSystemDeepDive,
];

/**
 * All predefined learning paths for C#
 */
export const csharpLearningPaths: LearningPath[] = [
  csQuickStart,
  csBackendFocus,
  csTypeSystemDeepDive,
];

/**
 * All predefined learning paths for SQL
 */
export const sqlLearningPaths: LearningPath[] = [
  sqlQuickStart,
  sqlDataAnalysisFocus,
  sqlDatabaseDeveloper,
];

/**
 * All predefined learning paths
 */
export const learningPaths: LearningPath[] = [
  ...typescriptLearningPaths,
  ...csharpLearningPaths,
  ...sqlLearningPaths,
];

/**
 * Get a learning path by its ID
 */
export function getLearningPathById(id: string): LearningPath | undefined {
  return learningPaths.find((path) => path.id === id);
}

/**
 * Get all learning paths
 */
export function getAllLearningPaths(): LearningPath[] {
  return learningPaths;
}

/**
 * Get learning paths for a specific language
 */
export function getLearningPathsByLanguage(language: Language): LearningPath[] {
  return learningPaths.filter((path) => path.language === language);
}
