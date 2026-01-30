# Skeleton: Item 7 - Progress Tracking

## Planned Files
- [ ] `src/types/lesson.ts` - Add LessonProgress, ProgressState types
- [ ] `src/hooks/useProgress.ts` - Progress tracking hook
- [ ] `src/components/ProgressBar.tsx` - Progress bar component
- [ ] `src/components/Sidebar.tsx` - Update with progress bars

**Note:** These files are documented but NOT created yet.

## File Contents

### Planned File: src/types/lesson.ts (additions)

```typescript
/**
 * Progress state for a single lesson.
 */
export interface LessonProgress {
  /** Lesson slug for identification */
  lessonSlug: string;
  /** Whether the quiz has been completed */
  quizCompleted: boolean;
  /** Array of completed exercise IDs (e.g., [1, 2, 3]) */
  exercisesCompleted: number[];
}

/**
 * Overall progress state stored in localStorage.
 */
export interface ProgressState {
  /** Progress for each lesson, keyed by slug */
  lessons: Record<string, LessonProgress>;
}
```

### Planned File: src/hooks/useProgress.ts

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Difficulty, Lesson, LessonProgress, ProgressState } from '@/types/lesson';

const STORAGE_KEY = 'typescript-teacher-progress';

export interface UseProgressReturn {
  progress: ProgressState;
  markQuizComplete: (slug: string) => void;
  markExerciseComplete: (slug: string, exerciseId: number) => void;
  isLessonComplete: (slug: string, exerciseCount: number) => boolean;
  getGroupProgress: (difficulty: Difficulty, lessons: Lesson[]) => {
    completed: number;
    total: number;
  };
  resetProgress: () => void;
}

/**
 * Hook for managing lesson progress in localStorage.
 */
export function useProgress(): UseProgressReturn {
  const [progress, setProgress] = useState<ProgressState>(() => {
    // TODO: Load from localStorage
    return { lessons: {} };
  });

  // TODO: Implement useEffect to persist to localStorage
  // TODO: Implement markQuizComplete
  // TODO: Implement markExerciseComplete
  // TODO: Implement isLessonComplete
  // TODO: Implement getGroupProgress
  // TODO: Implement resetProgress

  throw new Error('Not implemented');
}
```

### Planned File: src/components/ProgressBar.tsx

```typescript
'use client';

import React from 'react';

export interface ProgressBarProps {
  /** Number of completed items */
  completed: number;
  /** Total number of items */
  total: number;
  /** Optional label (e.g., "Beginner") */
  label?: string;
}

/**
 * Visual progress bar showing completion percentage.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  label
}) => {
  // TODO: Calculate percentage
  // TODO: Render progress bar with fill
  // TODO: Render label if provided
  
  throw new Error('Not implemented');
};

export default ProgressBar;
```

### Planned File: src/components/Sidebar.tsx (updates)

```typescript
// Add to existing Sidebar component:
// - Import useProgress hook
// - Import ProgressBar component
// - Call getGroupProgress for each difficulty group
// - Render ProgressBar under each group header
// - Add Reset Progress button with confirmation
```

## Task Dependency Graph

```yaml
tasks:
  - id: progress-types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts]
    description: Add LessonProgress and ProgressState types
    depends-on: [lesson-refactor-types]

  - id: progress-hook
    files: [src/hooks/useProgress.ts]
    tests: [src/hooks/useProgress.test.ts]
    description: Progress tracking hook with localStorage
    depends-on: [progress-types]

  - id: progress-bar-component
    files: [src/components/ProgressBar.tsx]
    tests: [src/components/ProgressBar.test.tsx]
    description: Visual progress bar component
    parallel: true

  - id: sidebar-progress
    files: [src/components/Sidebar.tsx]
    tests: [src/components/Sidebar.test.tsx]
    description: Update sidebar with progress bars and reset
    depends-on: [progress-hook, progress-bar-component]

  - id: lesson-page-progress
    files: [src/app/lessons/[slug]/page.tsx]
    tests: []
    description: Integrate progress tracking in lesson page
    depends-on: [progress-hook, lesson-page-exercises]
```

## Verification

- [x] All files from Interface documented
- [x] Types defined (LessonProgress, ProgressState)
- [x] Function signatures present (UseProgressReturn, ProgressBarProps)
- [x] TODO comments match pseudocode
