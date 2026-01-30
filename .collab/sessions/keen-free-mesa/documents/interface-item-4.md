# Interface Definition: Item 4 - Quizzes

## File Structure

- `src/types/lesson.ts` - Add QuizQuestion interface, extend Lesson
- `src/components/Quiz.tsx` - Quiz component (new)

## Type Definitions

```typescript
// src/types/lesson.ts (additions)

/**
 * A single multiple-choice question in a lesson quiz.
 */
export interface QuizQuestion {
  /** The question text */
  question: string;

  /** Array of 4 answer choices */
  options: string[];

  /** Index of the correct answer (0-3) */
  correctIndex: number;

  /** Optional explanation shown after answering correctly */
  explanation?: string;
}

// Extend Lesson interface
export interface Lesson {
  // ... existing fields ...

  /** Optional quiz questions for this lesson (4-5 questions) */
  quiz?: QuizQuestion[];
}
```

## Function Signatures

```typescript
// src/components/Quiz.tsx

export interface QuizProps {
  /** Array of quiz questions to display */
  questions: QuizQuestion[];

  /** Callback when user completes all questions correctly */
  onComplete: () => void;

  /** Callback when user clicks skip */
  onSkip: () => void;
}

/**
 * Quiz component for testing comprehension after lesson content.
 * Displays questions one at a time with retry on incorrect answers.
 */
export const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onSkip }) => {
  // Implementation
}
```

## Component Interactions

- `LessonPage` renders `Quiz` after `LessonContent` if `lesson.quiz` exists
- `Quiz.onComplete` triggers progress tracking (Item 7)
- `Quiz.onSkip` allows proceeding to code editor without completing quiz
