# Skeleton: Item 3 - Star Rating Display

## Planned Files
- [ ] `src/lib/lesson-utils.ts` - **NEW** - Helper functions for star rating
- [ ] `src/app/lessons/[slug]/page.tsx` - **MODIFIED** - Add star display to header

**Note:** These files are documented but NOT created yet. They will be created during the implementation phase by executing-plans.

## File Contents

### Planned File: src/lib/lesson-utils.ts

```typescript
import { Difficulty } from '@/types/lesson';

const starMapping: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

/**
 * Returns the star count (1-3) based on lesson difficulty.
 */
export function getStarRating(difficulty: Difficulty): number {
  // TODO: Return star count from mapping
  // - beginner = 1
  // - intermediate = 2
  // - advanced = 3
  return starMapping[difficulty];
}

/**
 * Returns a string of star emoji for display.
 */
export function getStarDisplay(difficulty: Difficulty): string {
  // TODO: Build star string from count
  // - Get count via getStarRating
  // - Create array of that length
  // - Fill with '⭐' and join
  const count = getStarRating(difficulty);
  return Array(count).fill('⭐').join('');
}
```

**Status:** [ ] Will be created during implementation

---

### Planned Modification: src/app/lessons/[slug]/page.tsx

```typescript
// ADD import at top of file:
import { getStarDisplay } from '@/lib/lesson-utils';

// MODIFY header bar section (after difficulty badge):
// Find the header bar that shows lesson title and difficulty badge
// Add star display after the badge:

// Before:
//   <span className="...">{lesson.difficulty}</span>

// After:
//   <span className="...">{lesson.difficulty}</span>
//   <span className="text-yellow-500 ml-2">{getStarDisplay(lesson.difficulty)}</span>
```

**Status:** [ ] Will be modified during implementation

---

## Task Dependency Graph

```yaml
tasks:
  - id: lesson-utils
    files: [src/lib/lesson-utils.ts]
    tests: [src/lib/lesson-utils.test.ts, src/lib/__tests__/lesson-utils.test.ts]
    description: Create helper functions getStarRating and getStarDisplay
    parallel: true

  - id: lesson-page-stars
    files: [src/app/lessons/[slug]/page.tsx]
    tests: []
    description: Add star display to lesson page header
    depends-on: [lesson-utils]
```

## Execution Order

**Wave 1 (no dependencies):**
- lesson-utils

**Wave 2 (depends on Wave 1):**
- lesson-page-stars

## Verification Checklist
- [x] All files from Interface are documented (NOT created)
- [x] File paths match exactly
- [x] All types are defined (uses existing Difficulty type)
- [x] All function signatures present (getStarRating, getStarDisplay)
- [x] TODO comments match pseudocode
- [x] Dependency graph covers all files
- [x] No circular dependencies
