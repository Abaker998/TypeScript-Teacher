# Skeleton: Item 5 - Hints System

## Planned Files
- [ ] `src/types/lesson.ts` - Add Exercise interface with hints
- [ ] `src/components/HintsPanel.tsx` - Hints panel component

**Note:** These files are documented but NOT created yet. They will be created during the implementation phase by executing-plans.

## File Contents

### Planned File: src/types/lesson.ts (additions)

```typescript
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

### Planned File: src/components/HintsPanel.tsx

```typescript
'use client';

import React, { useState, useEffect } from 'react';

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
  const [revealedCount, setRevealedCount] = useState(0);

  // Reset hints when exercise changes
  useEffect(() => {
    setRevealedCount(0);
  }, [exerciseTitle]);

  // TODO: Implement handleShowHint
  // TODO: Implement render logic with hint cards and button
  
  throw new Error('Not implemented');
};

export default HintsPanel;
```

## Task Dependency Graph

```yaml
tasks:
  - id: exercise-types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts]
    description: Add Exercise interface with hints field
    depends-on: [quiz-types]
    
  - id: hints-component
    files: [src/components/HintsPanel.tsx]
    tests: [src/components/HintsPanel.test.tsx]
    description: HintsPanel component with progressive reveal
    depends-on: [exercise-types]
```

## Verification

- [x] All files from Interface documented
- [x] Types defined (Exercise with hints)
- [x] Function signatures present (HintsPanelProps)
- [x] TODO comments match pseudocode
