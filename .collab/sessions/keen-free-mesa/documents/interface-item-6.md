# Interface Definition: Item 6 - Multiple Exercises

## File Structure

- `src/types/lesson.ts` - Refactor Lesson to use Exercise[] instead of single exercise fields
- `src/components/ExerciseTabs.tsx` - Tab navigation component (new)
- `src/lessons/**/*.ts` - Update all 9 lesson files (migrate to exercises array)

## Type Definitions

```typescript
// src/types/lesson.ts (refactored)

/**
 * Updated Lesson interface with exercises array.
 * Replaces starterCode, solution, expectedOutput with exercises[].
 */
export interface Lesson {
  /** URL-friendly identifier */
  slug: string;

  /** Human-readable title */
  title: string;

  /** Short summary for sidebar */
  description: string;

  /** Complexity level */
  difficulty: Difficulty;

  /** Sort order within difficulty group */
  order: number;

  /** Markdown lesson content */
  content: string;

  /** Optional quiz questions (from Item 4) */
  quiz?: QuizQuestion[];

  /** Array of 2-3 exercises (replaces single exercise fields) */
  exercises: Exercise[];

  /** Build notes explaining app architecture */
  buildNote: BuildNote;
}
```

## Function Signatures

```typescript
// src/components/ExerciseTabs.tsx

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
  // Implementation
}
```

## Component Interactions

- `LessonPage` manages `currentExerciseIndex` state
- `ExerciseTabs` renders above the hints panel
- Tab selection updates `currentExerciseIndex`, which updates:
  - `HintsPanel` (new hints for selected exercise)
  - `CodeEditor` (new starterCode)
  - `OutputPanel` (reset output, new expectedOutput)
- Exercise completion updates `completedIndices` for checkmark display
