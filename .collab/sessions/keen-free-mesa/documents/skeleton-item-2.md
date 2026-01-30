# Skeleton: Item 2 — How/Why the App Was Built

## Planned Files
- [ ] `src/types/comparison.ts` — NEW: type definitions for comparison cards
- [ ] `src/data/comparisons.ts` — NEW: comparison data (5 architectural decisions)
- [ ] `src/components/ComparisonCard.tsx` — NEW: reusable comparison card component
- [ ] `src/app/why-we-built-it-this-way/page.tsx` — NEW: overview page
- [ ] `src/app/layout.tsx` — MODIFY: add link to overview page in header
- [ ] `src/lessons/beginner/variables-and-types.ts` — MODIFY: populate buildNote
- [ ] `src/lessons/beginner/functions.ts` — MODIFY: populate buildNote
- [ ] `src/lessons/beginner/arrays-and-objects.ts` — MODIFY: populate buildNote
- [ ] `src/lessons/intermediate/interfaces.ts` — MODIFY: populate buildNote
- [ ] `src/lessons/intermediate/union-and-literal-types.ts` — MODIFY: populate buildNote
- [ ] `src/lessons/intermediate/generics.ts` — MODIFY: populate buildNote
- [ ] `src/lessons/advanced/mapped-types.ts` — MODIFY: populate buildNote
- [ ] `src/lessons/advanced/conditional-types.ts` — MODIFY: populate buildNote
- [ ] `src/lessons/advanced/decorators-and-patterns.ts` — MODIFY: populate buildNote

**Note:** These files are documented but NOT created yet. They will be created/modified during the implementation phase by executing-plans.

---

## File Contents

### Planned File: src/types/comparison.ts

```typescript
export interface ProCon {
  text: string;
}

export interface ComparisonOption {
  name: string;
  chosen: boolean;
  pros: ProCon[];
  cons: ProCon[];
}

export interface Comparison {
  id: string;
  title: string;
  question: string;
  options: ComparisonOption[];
  reasoning: string;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/data/comparisons.ts

```typescript
import { Comparison } from "@/types/comparison";

const comparisons: Comparison[] = [
  {
    id: "framework-choice",
    title: "Framework Choice",
    question: "Which framework should we use for this React + TypeScript app?",
    options: [
      {
        name: "Next.js",
        chosen: true,
        pros: [
          { text: "File-based routing built in" },
          { text: "First-class TypeScript support" },
          { text: "SSR/SSG capabilities if needed later" },
          { text: "Large ecosystem and community" },
        ],
        cons: [
          { text: "Heavier than Vite for pure SPA" },
          { text: "More opinionated structure" },
        ],
      },
      {
        name: "Vite",
        chosen: false,
        pros: [
          { text: "Extremely fast dev server" },
          { text: "Lightweight and minimal" },
        ],
        cons: [
          { text: "Need to add routing manually" },
          { text: "Less opinionated (more decisions)" },
        ],
      },
      {
        name: "Create React App",
        chosen: false,
        pros: [{ text: "Simple and familiar" }],
        cons: [
          { text: "Officially deprecated" },
          { text: "Slow build times" },
          { text: "Harder to customize" },
        ],
      },
    ],
    reasoning: `We chose **Next.js** because it provides everything we need out of the box...
    // TODO: Full reasoning paragraph`,
  },
  // TODO: Add 4 more comparisons:
  // - code-editor (Monaco vs CodeMirror vs Textarea)
  // - data-storage (Static vs Database)
  // - code-execution (iframe vs Web Worker)
  // - styling (Tailwind vs CSS Modules vs Styled Components)
];

export function getAllComparisons(): Comparison[] {
  return comparisons;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/components/ComparisonCard.tsx

```typescript
import { Comparison } from "@/types/comparison";

interface ComparisonCardProps {
  comparison: Comparison;
}

export default function ComparisonCard({ comparison }: ComparisonCardProps) {
  // TODO: Render card with:
  // - Title and question
  // - Options table with pros/cons columns
  // - Reasoning section as markdown
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/app/why-we-built-it-this-way/page.tsx

```typescript
import { getAllComparisons } from "@/data/comparisons";
import ComparisonCard from "@/components/ComparisonCard";

export default function WhyWeBuiltItThisWayPage() {
  const comparisons = getAllComparisons();

  // TODO: Render page with:
  // - Page title
  // - Intro paragraph
  // - List of ComparisonCard components
  // - Footer link back to lessons
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned Modification: src/app/layout.tsx

```typescript
// ADD to header bar:
// - Link to /why-we-built-it-this-way
// - Position: right side of header
// - Text: "Why This Way?"
```

**Status:** [ ] Will be modified during implementation

---

### Planned Modifications: All 9 lesson files

Each lesson file's `buildNote` field will be populated with substantive content. Example for variables-and-types.ts:

```typescript
buildNote: {
  title: "How This App Uses Variables & Types",
  explanation: `
In this app, basic TypeScript types are used throughout. Look at \`src/types/lesson.ts\`:

\`\`\`typescript
export interface Lesson {
  slug: string;        // string type
  title: string;       // string type
  order: number;       // number type
  // ...
}
\`\`\`

The \`slug\` field is a \`string\` that uniquely identifies each lesson in the URL.
The \`order\` field is a \`number\` that determines sort order within a difficulty group.

**In the real world:** These basic types are the foundation of every TypeScript codebase.
API responses, form data, configuration objects — they all start with string, number, and boolean.
  `,
  relatedFiles: ["src/types/lesson.ts"],
},
```

**Status:** [ ] Will be modified during implementation (all 9 files follow this pattern)

---

## Task Dependency Graph

```yaml
tasks:
  - id: comparison-types
    files: [src/types/comparison.ts]
    tests: [src/types/comparison.test.ts, src/types/__tests__/comparison.test.ts]
    description: Type definitions for comparison cards
    parallel: true
    depends-on: []

  - id: comparison-data
    files: [src/data/comparisons.ts]
    tests: [src/data/comparisons.test.ts, src/data/__tests__/comparisons.test.ts]
    description: Static comparison data for 5 architectural decisions
    parallel: false
    depends-on: [comparison-types]

  - id: comparison-card
    files: [src/components/ComparisonCard.tsx]
    tests: [src/components/ComparisonCard.test.tsx, src/components/__tests__/ComparisonCard.test.tsx]
    description: Reusable comparison card component
    parallel: false
    depends-on: [comparison-types]

  - id: why-page
    files: [src/app/why-we-built-it-this-way/page.tsx]
    tests: []
    description: Why We Built It This Way overview page
    parallel: false
    depends-on: [comparison-data, comparison-card]

  - id: layout-link
    files: [src/app/layout.tsx]
    tests: []
    description: Add link to overview page in header
    parallel: false
    depends-on: [why-page]

  - id: build-notes-content
    files:
      - src/lessons/beginner/variables-and-types.ts
      - src/lessons/beginner/functions.ts
      - src/lessons/beginner/arrays-and-objects.ts
      - src/lessons/intermediate/interfaces.ts
      - src/lessons/intermediate/union-and-literal-types.ts
      - src/lessons/intermediate/generics.ts
      - src/lessons/advanced/mapped-types.ts
      - src/lessons/advanced/conditional-types.ts
      - src/lessons/advanced/decorators-and-patterns.ts
    tests: []
    description: Populate buildNote content for all 9 lessons
    parallel: true
    depends-on: []
```

---

## Execution Order

**Wave 1 (parallel, no dependencies):**
- `comparison-types`
- `build-notes-content` (can run in parallel — modifies different files)

**Wave 2 (after Wave 1):**
- `comparison-data` (needs comparison-types)
- `comparison-card` (needs comparison-types)

**Wave 3 (after Wave 2):**
- `why-page` (needs comparison-data + comparison-card)

**Wave 4 (after Wave 3):**
- `layout-link` (needs why-page to exist)

---

## Verification

- [x] All 13 files from Interface are documented
- [x] File paths match exactly
- [x] All types defined (Comparison, ComparisonOption, ProCon)
- [x] All function signatures present (getAllComparisons, ComparisonCard)
- [x] TODO comments match pseudocode
- [x] Dependency graph covers all files (6 tasks)
- [x] No circular dependencies