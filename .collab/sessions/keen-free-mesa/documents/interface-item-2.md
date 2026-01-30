## Interface Definition — Item 2: How/Why the App Was Built

### File Structure
- `src/lessons/beginner/variables-and-types.ts` — (MODIFY) populate buildNote content
- `src/lessons/beginner/functions.ts` — (MODIFY) populate buildNote content
- `src/lessons/beginner/arrays-and-objects.ts` — (MODIFY) populate buildNote content
- `src/lessons/intermediate/interfaces.ts` — (MODIFY) populate buildNote content
- `src/lessons/intermediate/union-and-literal-types.ts` — (MODIFY) populate buildNote content
- `src/lessons/intermediate/generics.ts` — (MODIFY) populate buildNote content
- `src/lessons/advanced/mapped-types.ts` — (MODIFY) populate buildNote content
- `src/lessons/advanced/conditional-types.ts` — (MODIFY) populate buildNote content
- `src/lessons/advanced/decorators-and-patterns.ts` — (MODIFY) populate buildNote content
- `src/types/comparison.ts` — NEW: type definitions for comparison cards
- `src/components/ComparisonCard.tsx` — NEW: reusable comparison card component
- `src/data/comparisons.ts` — NEW: comparison data (5 architectural decisions)
- `src/app/why-we-built-it-this-way/page.tsx` — NEW: overview page

### Type Definitions

```typescript
// src/types/comparison.ts

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
  title: string;          // e.g., "Framework Choice"
  question: string;       // e.g., "Which framework should we use?"
  options: ComparisonOption[];
  reasoning: string;      // markdown explaining the decision
}
```

### Function Signatures

```typescript
// src/data/comparisons.ts
import { Comparison } from "@/types/comparison";

export function getAllComparisons(): Comparison[]
```

```typescript
// src/components/ComparisonCard.tsx
import { Comparison } from "@/types/comparison";

interface ComparisonCardProps {
  comparison: Comparison;
}

export default function ComparisonCard(props: ComparisonCardProps): JSX.Element
```

```typescript
// src/app/why-we-built-it-this-way/page.tsx
// Next.js page component
// Renders page title, intro paragraph, and list of ComparisonCard components
// No props — fetches data from getAllComparisons()
```

### Component Interactions
- `why-we-built-it-this-way/page.tsx` calls `getAllComparisons()` and maps over results to render `ComparisonCard` components
- `ComparisonCard` receives a single `Comparison` and renders the title, options table (with pros/cons), and reasoning paragraph
- The header bar in `layout.tsx` (from Item 1) needs a link to `/why-we-built-it-this-way`
- Lesson files are modified only in their `buildNote` field — no structural changes

### Notes on Lesson File Modifications
The 9 lesson files are modified (not created) by this item. Item 1 creates them with placeholder buildNote content. Item 2 replaces the placeholder with substantive content:
- `buildNote.title` — descriptive title like "How This App Uses Variables & Types"
- `buildNote.explanation` — markdown with app code references + "In the real world" paragraph
- `buildNote.relatedFiles` — actual file paths referenced in the explanation