# Interface Definition: Item 5 - Hints System

## File Structure

- `src/types/lesson.ts` - Add Exercise interface with hints
- `src/components/HintsPanel.tsx` - Hints panel component (new)

## Type Definitions

```typescript
// src/types/lesson.ts (additions)

/**
 * A single coding exercise within a lesson.
 * Each lesson has 2-3 exercises with progressive difficulty.
 */
export interface Exercise {
  /** Exercise number (1, 2, 3) */
  id: number;

  /** Exercise title (e.g., "Exercise 1: Declare Variables") */
  title: string;

  /** Instructions for the exercise */
  description: string;

  /** Pre-filled starter code for the Monaco Editor */
  starterCode: string;

  /** Correct solution code */
  solution: string;

  /** Expected console output lines */
  expectedOutput: string[];

  /** Progressive hints (3-4 hints, increasingly specific) */
  hints: string[];
}
```

## Function Signatures

```typescript
// src/components/HintsPanel.tsx

export interface HintsPanelProps {
  /** Array of hint strings for the current exercise */
  hints: string[];

  /** Title of the current exercise (for display context) */
  exerciseTitle: string;
}

/**
 * HintsPanel displays progressive hints for coding exercises.
 * Reveals one hint at a time when user clicks "Show Hint".
 */
export const HintsPanel: React.FC<HintsPanelProps> = ({ hints, exerciseTitle }) => {
  // State: revealedCount: number (0 to hints.length)
  // Implementation
}
```

## Component Interactions

- `LessonPage` renders `HintsPanel` above `CodeEditor`
- `HintsPanel` receives hints from `exercises[currentExerciseIndex].hints`
- Hints reset when user switches exercises via tabs
