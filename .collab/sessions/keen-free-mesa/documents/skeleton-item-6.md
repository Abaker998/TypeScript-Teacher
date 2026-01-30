# Skeleton: Item 6 - Multiple Exercises

## Planned Files
- [ ] `src/types/lesson.ts` - Refactor Lesson to use exercises[]
- [ ] `src/components/ExerciseTabs.tsx` - Tab navigation component
- [ ] `src/lessons/beginner/variables-and-types.ts` - Migrate to exercises
- [ ] `src/lessons/beginner/functions.ts` - Migrate to exercises
- [ ] `src/lessons/beginner/arrays-and-objects.ts` - Migrate to exercises
- [ ] `src/lessons/intermediate/interfaces.ts` - Migrate to exercises
- [ ] `src/lessons/intermediate/union-and-literal-types.ts` - Migrate to exercises
- [ ] `src/lessons/intermediate/generics.ts` - Migrate to exercises
- [ ] `src/lessons/advanced/mapped-types.ts` - Migrate to exercises
- [ ] `src/lessons/advanced/conditional-types.ts` - Migrate to exercises
- [ ] `src/lessons/advanced/decorators-and-patterns.ts` - Migrate to exercises
- [ ] `src/app/lessons/[slug]/page.tsx` - Update to handle exercises

**Note:** These files are documented but NOT created yet.

## File Contents

### Planned File: src/types/lesson.ts (refactored Lesson)

```typescript
/**
 * Updated Lesson interface with exercises array.
 * Replaces starterCode, solution, expectedOutput with exercises[].
 */
export interface Lesson {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  order: number;
  content: string;
  quiz?: QuizQuestion[];
  exercises: Exercise[];  // NEW: replaces single exercise fields
  buildNote: BuildNote;
}
```

### Planned File: src/components/ExerciseTabs.tsx

```typescript
'use client';

import React from 'react';
import { Exercise } from '@/types/lesson';

export interface ExerciseTabsProps {
  /** All exercises for the current lesson */
  exercises: Exercise[];
  /** Currently selected exercise index (0-based) */
  currentIndex: number;
  /** Callback when user clicks a tab */
  onSelect: (index: number) => void;
  /** Indices of completed exercises (for checkmark display) */
  completedIndices: number[];
}

/**
 * ExerciseTabs provides tab navigation between exercises.
 * Shows completion checkmarks for finished exercises.
 */
export const ExerciseTabs: React.FC<ExerciseTabsProps> = ({
  exercises,
  currentIndex,
  onSelect,
  completedIndices
}) => {
  // TODO: Implement tab rendering with active state
  // TODO: Implement checkmark icons for completed
  // TODO: Implement onClick handlers
  
  throw new Error('Not implemented');
};

export default ExerciseTabs;
```

### Planned File: Lesson Migration Template

Each lesson file will be updated from:
```typescript
{
  starterCode: '...',
  solution: '...',
  expectedOutput: ['...'],
}
```

To:
```typescript
{
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: ...',
      description: '...',
      starterCode: '...',
      solution: '...',
      expectedOutput: ['...'],
      hints: ['hint1', 'hint2', 'hint3'],
    },
    {
      id: 2,
      title: 'Exercise 2: ...',
      // ... additional exercise
    },
  ],
}
```

## Task Dependency Graph

```yaml
tasks:
  - id: lesson-refactor-types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts]
    description: Refactor Lesson to use exercises array
    depends-on: [exercise-types]

  - id: exercise-tabs-component
    files: [src/components/ExerciseTabs.tsx]
    tests: [src/components/ExerciseTabs.test.tsx]
    description: Tab navigation for exercises
    depends-on: [lesson-refactor-types]

  - id: migrate-beginner-lessons
    files: 
      - src/lessons/beginner/variables-and-types.ts
      - src/lessons/beginner/functions.ts
      - src/lessons/beginner/arrays-and-objects.ts
    tests: []
    description: Migrate beginner lessons to exercises array
    depends-on: [lesson-refactor-types]
    parallel: true

  - id: migrate-intermediate-lessons
    files:
      - src/lessons/intermediate/interfaces.ts
      - src/lessons/intermediate/union-and-literal-types.ts
      - src/lessons/intermediate/generics.ts
    tests: []
    description: Migrate intermediate lessons to exercises array
    depends-on: [lesson-refactor-types]
    parallel: true

  - id: migrate-advanced-lessons
    files:
      - src/lessons/advanced/mapped-types.ts
      - src/lessons/advanced/conditional-types.ts
      - src/lessons/advanced/decorators-and-patterns.ts
    tests: []
    description: Migrate advanced lessons to exercises array
    depends-on: [lesson-refactor-types]
    parallel: true

  - id: lesson-page-exercises
    files: [src/app/lessons/[slug]/page.tsx]
    tests: []
    description: Update lesson page to handle exercises
    depends-on: [exercise-tabs-component, migrate-beginner-lessons]
```

## Verification

- [x] All files from Interface documented
- [x] Types defined (refactored Lesson)
- [x] Function signatures present (ExerciseTabsProps)
- [x] Migration template documented
