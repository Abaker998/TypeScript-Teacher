# Pseudocode: Item 3 - Star Rating Display

## getStarRating(difficulty: Difficulty): number

```
1. Define mapping object
   - { beginner: 1, intermediate: 2, advanced: 3 }

2. Look up difficulty in mapping
   - Return the corresponding number (1, 2, or 3)
```

**Error Handling:**
- None needed — TypeScript's type system ensures `difficulty` is always a valid `Difficulty` value
- The mapping covers all three cases exhaustively

**Edge Cases:**
- None — `Difficulty` is a union type with exactly 3 literal values, all are handled

**Dependencies:**
- `Difficulty` type from `src/types/lesson.ts`

---

## getStarDisplay(difficulty: Difficulty): string

```
1. Get star count by calling getStarRating(difficulty)
   - Returns 1, 2, or 3

2. Build star string
   - Create array of length starCount
   - Fill with '⭐' emoji
   - Join into single string

3. Return the star string
   - "⭐" for beginner
   - "⭐⭐" for intermediate
   - "⭐⭐⭐" for advanced
```

**Error Handling:**
- None needed — delegates to getStarRating which handles all cases

**Edge Cases:**
- None — all difficulty values produce valid star strings

**Dependencies:**
- `getStarRating` function (same file)
- `Difficulty` type from `src/types/lesson.ts`

---

## Lesson Page Header Modification

```
1. Import getStarDisplay from lesson-utils

2. In header bar section, after difficulty badge:
   - Call getStarDisplay(lesson.difficulty)
   - Render result in a span with gold color (text-yellow-500)

3. Layout: [Title] [Badge] [Stars]
```

**Error Handling:**
- None needed — lesson.difficulty is always present and valid

**Edge Cases:**
- None — all lessons have a difficulty field

**Dependencies:**
- `getStarDisplay` from `src/lib/lesson-utils.ts`
- `lesson` object from page props

---

## Verification Checklist
- [x] Every function from Interface has pseudocode (getStarRating, getStarDisplay)
- [x] Error handling is explicit for each function (none needed — type-safe)
- [x] Edge cases are identified (none — exhaustive type coverage)
- [x] External dependencies are noted (Difficulty type)
