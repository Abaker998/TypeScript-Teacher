# Interface Definition: Item 3 - Star Rating Display

## File Structure
- `src/lib/lesson-utils.ts` - **NEW** - Helper functions for lesson display
- `src/app/lessons/[slug]/page.tsx` - **MODIFIED** - Add star rating to header

## Type Definitions

```typescript
// src/lib/lesson-utils.ts
// Uses existing Difficulty type from src/types/lesson.ts
import { Difficulty } from '@/types/lesson';
```

No new types needed — star count derives from existing `Difficulty` type.

## Function Signatures

```typescript
// src/lib/lesson-utils.ts

/**
 * Returns the star count (1-3) based on lesson difficulty.
 * beginner = 1, intermediate = 2, advanced = 3
 */
export function getStarRating(difficulty: Difficulty): number

/**
 * Returns a string of star emoji for display.
 * E.g., getStarDisplay("intermediate") returns "⭐⭐"
 */
export function getStarDisplay(difficulty: Difficulty): string
```

## Component Changes

```typescript
// src/app/lessons/[slug]/page.tsx
// Header bar modification - add after difficulty badge:
//
// Current:  [Lesson Title]  [Difficulty Badge]
// New:      [Lesson Title]  [Difficulty Badge]  [⭐⭐⭐]
//
// The star display uses text-yellow-500 for gold color
```

## Component Interactions
- `page.tsx` imports `getStarDisplay` from `lesson-utils.ts`
- `getStarDisplay` internally calls `getStarRating` and builds the star string
- No new props or state needed — difficulty is already available on the lesson object

## Dependencies
- Requires `Difficulty` type from `src/types/lesson.ts` (Item 1)
- Modifies lesson page from Item 1

## Verification Checklist
- [x] All files listed
- [x] All public interfaces have signatures
- [x] Parameter types are explicit (no `any`)
- [x] Return types are explicit
- [x] Component interactions documented
