# Skeleton: Item 4 - Quizzes

## Planned Files
- [ ] `src/types/lesson.ts` - Add QuizQuestion interface
- [ ] `src/components/Quiz.tsx` - Quiz component

**Note:** These files are documented but NOT created yet. They will be created during the implementation phase by executing-plans.

## File Contents

### Planned File: src/types/lesson.ts (additions)

```typescript
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

// Update Lesson interface to add:
// quiz?: QuizQuestion[];
```

### Planned File: src/components/Quiz.tsx

```typescript
'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/types/lesson';

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);

  // TODO: Implement handleSelectAnswer
  // TODO: Implement handleCheckAnswer
  // TODO: Implement handleNextQuestion
  // TODO: Implement render logic with question display, options, feedback
  
  throw new Error('Not implemented');
};

export default Quiz;
```

## Task Dependency Graph

```yaml
tasks:
  - id: quiz-types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts]
    description: Add QuizQuestion interface to types
    parallel: true

  - id: quiz-component
    files: [src/components/Quiz.tsx]
    tests: [src/components/Quiz.test.tsx]
    description: Quiz component with retry logic
    depends-on: [quiz-types]
```

## Verification

- [x] All files from Interface documented
- [x] Types defined (QuizQuestion)
- [x] Function signatures present (QuizProps)
- [x] TODO comments match pseudocode
