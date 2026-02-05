import { Lesson, LessonGroup, Difficulty } from '@/types/lesson';

// Beginner lessons (8)
import { selectBasics } from './beginner/select-basics';
import { filteringData } from './beginner/filtering-data';
import { sortingData } from './beginner/sorting-data';
import { aggregateFunctions } from './beginner/aggregate-functions';
import { groupingData } from './beginner/grouping-data';
import { joinsIntro } from './beginner/joins-intro';
import { insertUpdateDelete } from './beginner/insert-update-delete';
import { tableBasics } from './beginner/table-basics';

// Intermediate lessons (10)
import { sqlJoins as joins } from './intermediate/joins';
import { sqlSubqueries as subqueries } from './intermediate/subqueries';
import { sqlSetOperations as setOperations } from './intermediate/set-operations';
import { sqlViews as views } from './intermediate/views';
import { sqlIndexes as indexes } from './intermediate/indexes';
import { sqlConstraints as constraints } from './intermediate/constraints';
import { sqlTransactions as transactions } from './intermediate/transactions';
import { sqlStoredProcedures as storedProcedures } from './intermediate/stored-procedures';
import { sqlFunctions as functions } from './intermediate/functions';
import { sqlTriggers as triggers } from './intermediate/triggers';

// Advanced lessons (7)
import { queryOptimization } from './advanced/query-optimization';
import { windowFunctions } from './advanced/window-functions';
import { ctes } from './advanced/ctes';
import { pivotUnpivot } from './advanced/pivot-unpivot';
import { dynamicSql } from './advanced/dynamic-sql';
import { databaseDesign } from './advanced/database-design';
import { advancedPatterns } from './advanced/advanced-patterns';

// Capstone project (1)
import { inventoryDbCapstone } from './capstone/inventory-db';

// Group tests (4)
import { beginnerTest } from './group-tests/beginner-test';
import { intermediateTest } from './group-tests/intermediate-test';
import { advancedTest } from './group-tests/advanced-test';
import { masterTest } from './group-tests/master-test';

// All SQL lessons in curriculum order (30 total)
export const sqlLessons: Lesson[] = [
  // Beginner (1-8)
  selectBasics,
  filteringData,
  sortingData,
  aggregateFunctions,
  groupingData,
  joinsIntro,
  insertUpdateDelete,
  tableBasics,
  // Beginner Test (9)
  beginnerTest,
  // Intermediate (10-19)
  joins,
  subqueries,
  setOperations,
  views,
  indexes,
  constraints,
  transactions,
  storedProcedures,
  functions,
  triggers,
  // Intermediate Test (20)
  intermediateTest,
  // Advanced (21-27)
  queryOptimization,
  windowFunctions,
  ctes,
  pivotUnpivot,
  dynamicSql,
  databaseDesign,
  advancedPatterns,
  // Advanced Test (28)
  advancedTest,
  // Capstone (29)
  inventoryDbCapstone,
  // Master Test (30)
  masterTest,
];

/**
 * Get SQL lessons grouped by difficulty
 */
export function getSqlLessonsByDifficulty(): LessonGroup[] {
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
    lessons: sqlLessons
      .filter((lesson) => lesson.difficulty === difficulty)
      .sort((a, b) => a.order - b.order),
  }));
}
