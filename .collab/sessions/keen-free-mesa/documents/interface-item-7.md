# Interface Definition: Item 7 - Progress Tracking

## File Structure

- `src/types/lesson.ts` - Add LessonProgress and ProgressState types
- `src/hooks/useProgress.ts` - Progress tracking hook (new)
- `src/components/Sidebar.tsx` - Update to show progress bars
- `src/components/ProgressBar.tsx` - Progress bar component (new)

## Type Definitions

```typescript
// src/types/lesson.ts (additions)

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

## Function Signatures

```typescript
// src/hooks/useProgress.ts

export interface UseProgressReturn {
  /** Current progress state */
  progress: ProgressState;

  /** Mark a lesson's quiz as complete */
  markQuizComplete: (slug: string) => void;

  /** Mark a specific exercise as complete */
  markExerciseComplete: (slug: string, exerciseId: number) => void;

  /** Check if a lesson is fully complete */
  isLessonComplete: (slug: string, exerciseCount: number) => boolean;

  /** Get progress for a difficulty group */
  getGroupProgress: (difficulty: Difficulty, lessons: Lesson[]) => {
    completed: number;
    total: number;
  };

  /** Reset all progress */
  resetProgress: () => void;
}

/**
 * Hook for managing lesson progress in localStorage.
 */
export function useProgress(): UseProgressReturn {
  // Implementation
}
```

```typescript
// src/components/ProgressBar.tsx

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
  // Implementation
}
```

## Component Interactions

- `useProgress` hook loaded in `LessonPage` and `Sidebar`
- `Quiz.onComplete` calls `markQuizComplete(slug)`
- `OutputPanel` calls `markExerciseComplete(slug, exerciseId)` when output matches
- `Sidebar` calls `getGroupProgress(difficulty, lessons)` for each group
- `Sidebar` renders `ProgressBar` under each difficulty header
- Reset button calls `resetProgress()` with confirmation dialog
- localStorage key: `typescript-teacher-progress`
