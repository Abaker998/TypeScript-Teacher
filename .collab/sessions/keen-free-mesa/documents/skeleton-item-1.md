# Skeleton: Item 1 — React TypeScript Teaching App

## Planned Files
- [ ] `src/types/lesson.ts` — Core type definitions
- [ ] `src/lessons/index.ts` — Lesson registry and helper functions
- [ ] `src/lessons/beginner/variables-and-types.ts` — Beginner lesson 1
- [ ] `src/lessons/beginner/functions.ts` — Beginner lesson 2
- [ ] `src/lessons/beginner/arrays-and-objects.ts` — Beginner lesson 3
- [ ] `src/lessons/intermediate/interfaces.ts` — Intermediate lesson 1
- [ ] `src/lessons/intermediate/union-and-literal-types.ts` — Intermediate lesson 2
- [ ] `src/lessons/intermediate/generics.ts` — Intermediate lesson 3
- [ ] `src/lessons/advanced/mapped-types.ts` — Advanced lesson 1
- [ ] `src/lessons/advanced/conditional-types.ts` — Advanced lesson 2
- [ ] `src/lessons/advanced/decorators-and-patterns.ts` — Advanced lesson 3
- [ ] `src/lib/typescript-runner.ts` — TypeScript transpile + sandbox execution
- [ ] `src/components/Sidebar.tsx` — Collapsible sidebar overlay
- [ ] `src/components/LessonContent.tsx` — Markdown lesson renderer
- [ ] `src/components/CodeEditor.tsx` — Monaco editor wrapper
- [ ] `src/components/OutputPanel.tsx` — Code execution output display
- [ ] `src/components/BuildNote.tsx` — \"How This Was Built\" section
- [ ] `src/app/layout.tsx` — Root layout with header bar
- [ ] `src/app/page.tsx` — Home page (redirect to first lesson)
- [ ] `src/app/lessons/[slug]/page.tsx` — Lesson page

**Note:** These files are documented but NOT created yet. They will be created during the implementation phase by executing-plans.

---

## File Contents

### Planned File: src/types/lesson.ts

```typescript
export type Difficulty = \"beginner\" | \"intermediate\" | \"advanced\";

export interface BuildNote {
  title: string;
  explanation: string;
  relatedFiles: string[];
}

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  order: number;
  content: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  buildNote: BuildNote;
}

export interface LessonGroup {
  difficulty: Difficulty;
  label: string;
  lessons: Lesson[];
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/lessons/index.ts

```typescript
import { Lesson, LessonGroup, Difficulty } from \"@/types/lesson\";

// Import all lessons
import { variablesAndTypes } from \"./beginner/variables-and-types\";
import { functions } from \"./beginner/functions\";
import { arraysAndObjects } from \"./beginner/arrays-and-objects\";
import { interfaces } from \"./intermediate/interfaces\";
import { unionAndLiteralTypes } from \"./intermediate/union-and-literal-types\";
import { generics } from \"./intermediate/generics\";
import { mappedTypes } from \"./advanced/mapped-types\";
import { conditionalTypes } from \"./advanced/conditional-types\";
import { decoratorsAndPatterns } from \"./advanced/decorators-and-patterns\";

const difficultyOrder: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const difficultyLabels: Record<Difficulty, string> = {
  beginner: \"Beginner\",
  intermediate: \"Intermediate\",
  advanced: \"Advanced\",
};

export function getAllLessons(): Lesson[] {
  // TODO: Collect all lessons, sort by difficulty then order
  throw new Error(\"Not implemented\");
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  // TODO: Find lesson by slug
  throw new Error(\"Not implemented\");
}

export function getLessonsByDifficulty(): LessonGroup[] {
  // TODO: Group lessons by difficulty, return ordered groups
  throw new Error(\"Not implemented\");
}

export function getAdjacentLessons(slug: string): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  // TODO: Find prev/next lessons in global order
  throw new Error(\"Not implemented\");
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/lessons/beginner/variables-and-types.ts (template for all 9 lessons)

```typescript
import { Lesson } from \"@/types/lesson\";

export const variablesAndTypes: Lesson = {
  slug: \"variables-and-types\",
  title: \"Variables & Types\",
  description: \"Learn about string, number, boolean, let vs const\",
  difficulty: \"beginner\",
  order: 1,
  content: `
# Variables & Types

// TODO: Full markdown lesson content
// - Explain string, number, boolean
// - Show let vs const
// - Code examples with syntax highlighting
  `,
  starterCode: \"// TODO: Starter code for the exercise\",
  solution: \"// TODO: Solution code\",
  expectedOutput: \"// TODO: Expected console output\",
  buildNote: {
    title: \"How This Lesson File Works\",
    explanation: \"// TODO: Explain the Lesson interface and how lesson files are structured\",
    relatedFiles: [\"src/types/lesson.ts\", \"src/lessons/index.ts\"],
  },
};
```

**Status:** [ ] Will be created during implementation (repeat pattern for all 9 lessons)

---

### Planned File: src/lib/typescript-runner.ts

```typescript
export interface CompileError {
  line: number;
  column: number;
  message: string;
}

export interface RunResult {
  success: boolean;
  output: string[];
  errors: CompileError[];
}

export function transpileTypeScript(source: string): {
  success: boolean;
  js: string;
  errors: CompileError[];
} {
  // TODO: Load TypeScript compiler
  // TODO: Call ts.transpileModule with strict options
  // TODO: Map diagnostics to CompileError[]
  throw new Error(\"Not implemented\");
}

export function executeInSandbox(
  js: string,
  timeoutMs: number = 5000
): Promise<RunResult> {
  // TODO: Create sandboxed iframe
  // TODO: Override console.log to capture output
  // TODO: Execute JS with try/catch
  // TODO: Listen for postMessage events
  // TODO: Set timeout for infinite loop protection
  // TODO: Clean up iframe
  throw new Error(\"Not implemented\");
}

export async function runTypeScript(source: string): Promise<RunResult> {
  // TODO: Transpile, then execute in sandbox
  throw new Error(\"Not implemented\");
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/components/Sidebar.tsx

```typescript
\"use client\";

import Link from \"next/link\";
import { LessonGroup } from \"@/types/lesson\";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
  lessonGroups: LessonGroup[];
}

export default function Sidebar({
  isOpen,
  onClose,
  currentSlug,
  lessonGroups,
}: SidebarProps) {
  // TODO: Return null if !isOpen
  // TODO: Render overlay backdrop
  // TODO: Render slide-in panel with:
  //   - App title
  //   - Close button
  //   - Collapsible difficulty groups
  //   - Lesson links with active highlighting
  //   - Close sidebar on navigation
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/components/LessonContent.tsx

```typescript
import ReactMarkdown from \"react-markdown\";
import { Prism as SyntaxHighlighter } from \"react-syntax-highlighter\";

interface LessonContentProps {
  content: string;
}

export default function LessonContent({ content }: LessonContentProps) {
  // TODO: Render markdown with react-markdown
  // TODO: Configure code block renderer with syntax highlighting
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/components/CodeEditor.tsx

```typescript
\"use client\";

interface CodeEditorProps {
  initialCode: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ initialCode, onChange }: CodeEditorProps) {
  // TODO: Render Monaco Editor
  // TODO: Configure: language=typescript, theme=vs-dark
  // TODO: Options: no minimap, line numbers, word wrap, font size 14
  // TODO: Fallback textarea if Monaco fails to load
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/components/OutputPanel.tsx

```typescript
import { RunResult } from \"@/lib/typescript-runner\";

interface OutputPanelProps {
  result: RunResult | null;
  isRunning: boolean;
}

export default function OutputPanel({ result, isRunning }: OutputPanelProps) {
  // TODO: Show spinner if isRunning
  // TODO: Show placeholder if result is null
  // TODO: Show output lines if success
  // TODO: Show errors with red styling if failure
  // TODO: Truncate at 100 lines
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/components/BuildNote.tsx

```typescript
\"use client\";

import { BuildNote as BuildNoteType } from \"@/types/lesson\";

interface BuildNoteProps {
  buildNote: BuildNoteType;
}

export default function BuildNote({ buildNote }: BuildNoteProps) {
  // TODO: Collapsible section (collapsed by default)
  // TODO: Header with title, click to toggle
  // TODO: Render explanation as markdown
  // TODO: List relatedFiles as code-styled items
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/app/layout.tsx

```typescript
import type { Metadata } from \"next\";
import \"./globals.css\";

export const metadata: Metadata = {
  title: \"TypeScript Teacher\",
  description: \"Learn TypeScript interactively\",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Render html/body with Tailwind classes
  // TODO: Include global styles
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/app/page.tsx

```typescript
import { redirect } from \"next/navigation\";
import { getAllLessons } from \"@/lessons\";

export default function HomePage() {
  // TODO: Get first lesson slug
  // TODO: Redirect to /lessons/{firstSlug}
  const lessons = getAllLessons();
  if (lessons.length > 0) {
    redirect(`/lessons/${lessons[0].slug}`);
  }
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

### Planned File: src/app/lessons/[slug]/page.tsx

```typescript
\"use client\";

import { useState } from \"react\";
import { getLessonBySlug, getLessonsByDifficulty, getAdjacentLessons } from \"@/lessons\";
import { runTypeScript, RunResult } from \"@/lib/typescript-runner\";
import Sidebar from \"@/components/Sidebar\";
import LessonContent from \"@/components/LessonContent\";
import CodeEditor from \"@/components/CodeEditor\";
import OutputPanel from \"@/components/OutputPanel\";
import BuildNote from \"@/components/BuildNote\";

export default function LessonPage({ params }: { params: { slug: string } }) {
  // TODO: Get lesson by slug, handle 404
  // TODO: Get lesson groups for sidebar
  // TODO: Get adjacent lessons for prev/next
  // TODO: State: sidebarOpen, code, runResult, isRunning
  // TODO: handleRun: call runTypeScript, update state
  // TODO: Render header bar with toggle, title, badge
  // TODO: Render Sidebar, LessonContent, CodeEditor, Run button, OutputPanel, BuildNote
  // TODO: Prev/Next navigation links
  return null;
}
```

**Status:** [ ] Will be created during implementation

---

## Task Dependency Graph

```yaml
tasks:
  - id: project-setup
    files: [package.json, tsconfig.json, tailwind.config.ts, next.config.js, src/app/globals.css]
    tests: []
    description: Initialize Next.js project with TypeScript and Tailwind CSS

  - id: types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts, src/types/__tests__/lesson.test.ts]
    description: Core type definitions (Lesson, BuildNote, LessonGroup, Difficulty)
    depends-on: [project-setup]

  - id: lesson-data
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
    description: All 9 lesson content files
    depends-on: [types]

  - id: lesson-registry
    files: [src/lessons/index.ts]
    tests: [src/lessons/index.test.ts, src/lessons/__tests__/index.test.ts]
    description: Lesson registry with getAllLessons, getLessonBySlug, getLessonsByDifficulty, getAdjacentLessons
    depends-on: [types, lesson-data]

  - id: typescript-runner
    files: [src/lib/typescript-runner.ts]
    tests: [src/lib/typescript-runner.test.ts, src/lib/__tests__/typescript-runner.test.ts]
    description: TypeScript transpiler and sandboxed execution engine
    depends-on: [project-setup]

  - id: lesson-content-component
    files: [src/components/LessonContent.tsx]
    tests: [src/components/LessonContent.test.tsx, src/components/__tests__/LessonContent.test.tsx]
    description: Markdown renderer with syntax highlighting
    depends-on: [project-setup]

  - id: code-editor-component
    files: [src/components/CodeEditor.tsx]
    tests: [src/components/CodeEditor.test.tsx, src/components/__tests__/CodeEditor.test.tsx]
    description: Monaco Editor wrapper
    depends-on: [project-setup]

  - id: output-panel-component
    files: [src/components/OutputPanel.tsx]
    tests: [src/components/OutputPanel.test.tsx, src/components/__tests__/OutputPanel.test.tsx]
    description: Code execution output display
    depends-on: [typescript-runner]

  - id: build-note-component
    files: [src/components/BuildNote.tsx]
    tests: [src/components/BuildNote.test.tsx, src/components/__tests__/BuildNote.test.tsx]
    description: Collapsible \"How This Was Built\" section
    depends-on: [types]

  - id: sidebar-component
    files: [src/components/Sidebar.tsx]
    tests: [src/components/Sidebar.test.tsx, src/components/__tests__/Sidebar.test.tsx]
    description: Collapsible sidebar overlay with lesson navigation
    depends-on: [types, lesson-registry]

  - id: layout
    files: [src/app/layout.tsx]
    tests: []
    description: Root layout with metadata and global styles
    depends-on: [project-setup]

  - id: lesson-page
    files: [src/app/lessons/[slug]/page.tsx]
    tests: [src/app/lessons/[slug]/page.test.tsx]
    description: Main lesson page orchestrator
    depends-on: [lesson-registry, typescript-runner, sidebar-component, lesson-content-component, code-editor-component, output-panel-component, build-note-component, layout]

  - id: home-page
    files: [src/app/page.tsx]
    tests: []
    description: Home page redirect to first lesson
    depends-on: [lesson-registry, layout]
```

## Execution Order

**Wave 1 (parallel):**
- `project-setup`

**Wave 2 (parallel, after project-setup):**
- `types`

**Wave 3 (parallel, after types):**
- `lesson-data`
- `typescript-runner`
- `lesson-content-component`
- `code-editor-component`
- `build-note-component`

**Wave 4 (parallel, after wave 3):**
- `lesson-registry` (needs types + lesson-data)
- `output-panel-component` (needs typescript-runner)

**Wave 5 (parallel, after wave 4):**
- `sidebar-component` (needs types + lesson-registry)

**Wave 6 (parallel, after wave 5):**
- `layout`
- `lesson-page` (needs all components + registry + runner)
- `home-page` (needs lesson-registry + layout)

## Verification

- [x] All 20 files from Interface are documented
- [x] File paths match exactly
- [x] All types defined in stub content
- [x] All function signatures present
- [x] TODO comments match pseudocode logic
- [x] Dependency graph covers all files (13 tasks)
- [x] No circular dependencies