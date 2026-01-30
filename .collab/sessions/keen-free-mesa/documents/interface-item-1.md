## Interface Definition — Item 1: React TypeScript Teaching App

### File Structure
- `src/types/lesson.ts` — Core type definitions
- `src/lessons/index.ts` — Lesson registry and helper functions
- `src/lessons/beginner/variables-and-types.ts` — Example lesson file
- `src/lessons/beginner/functions.ts`
- `src/lessons/beginner/arrays-and-objects.ts`
- `src/lessons/intermediate/interfaces.ts`
- `src/lessons/intermediate/union-and-literal-types.ts`
- `src/lessons/intermediate/generics.ts`
- `src/lessons/advanced/mapped-types.ts`
- `src/lessons/advanced/conditional-types.ts`
- `src/lessons/advanced/decorators-and-patterns.ts`
- `src/app/layout.tsx` — Root layout with header bar
- `src/app/page.tsx` — Home/landing page (redirects to first lesson)
- `src/app/lessons/[slug]/page.tsx` — Lesson page
- `src/components/Sidebar.tsx` — Collapsible sidebar overlay
- `src/components/LessonContent.tsx` — Markdown lesson renderer
- `src/components/CodeEditor.tsx` — Monaco editor wrapper
- `src/components/OutputPanel.tsx` — Code execution output display
- `src/components/BuildNote.tsx` — "How This Was Built" collapsible section
- `src/lib/typescript-runner.ts` — TypeScript transpile + sandbox execution

### Type Definitions

```typescript
// src/types/lesson.ts

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface BuildNote {
  title: string;
  explanation: string; // markdown
  relatedFiles: string[];
}

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  order: number;
  content: string; // markdown
  starterCode: string;
  solution: string;
  expectedOutput: string;
  buildNote: BuildNote;
}

export interface LessonGroup {
  difficulty: Difficulty;
  label: string; // "Beginner", "Intermediate", "Advanced"
  lessons: Lesson[];
}
```

### Function Signatures

```typescript
// src/lessons/index.ts
export function getAllLessons(): Lesson[]
export function getLessonBySlug(slug: string): Lesson | undefined
export function getLessonsByDifficulty(): LessonGroup[]
export function getAdjacentLessons(slug: string): {
  prev: Lesson | null;
  next: Lesson | null;
}
```

```typescript
// src/lib/typescript-runner.ts
export interface RunResult {
  success: boolean;
  output: string[];      // captured console.log lines
  errors: CompileError[];
}

export interface CompileError {
  line: number;
  column: number;
  message: string;
}

export function transpileTypeScript(source: string): {
  success: boolean;
  js: string;
  errors: CompileError[];
}

export function executeInSandbox(js: string, timeoutMs?: number): Promise<RunResult>

export function runTypeScript(source: string): Promise<RunResult>
```

```typescript
// src/components/Sidebar.tsx
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
  lessonGroups: LessonGroup[];
}
export default function Sidebar(props: SidebarProps): JSX.Element
```

```typescript
// src/components/LessonContent.tsx
interface LessonContentProps {
  content: string; // markdown
}
export default function LessonContent(props: LessonContentProps): JSX.Element
```

```typescript
// src/components/CodeEditor.tsx
interface CodeEditorProps {
  initialCode: string;
  onChange: (code: string) => void;
}
export default function CodeEditor(props: CodeEditorProps): JSX.Element
```

```typescript
// src/components/OutputPanel.tsx
interface OutputPanelProps {
  result: RunResult | null;
  isRunning: boolean;
}
export default function OutputPanel(props: OutputPanelProps): JSX.Element
```

```typescript
// src/components/BuildNote.tsx
interface BuildNoteProps {
  buildNote: BuildNote;
}
export default function BuildNote(props: BuildNoteProps): JSX.Element
```

```typescript
// src/app/lessons/[slug]/page.tsx
// Next.js App Router page component
// Params: { slug: string }
// Fetches lesson by slug, renders LessonContent + CodeEditor + OutputPanel + BuildNote
// Manages sidebar open/close state and code execution state
```

### Component Interactions
- `layout.tsx` renders the header bar (always visible) and `{children}`
- `lessons/[slug]/page.tsx` is the main orchestrator — it holds state for sidebar visibility, current code, and run results
- `Sidebar` receives `lessonGroups` from `getLessonsByDifficulty()` and navigates via Next.js `<Link>`
- `CodeEditor` calls `onChange` on every keystroke; parent holds the current code string
- When user clicks "Run", parent calls `runTypeScript(code)` and passes the `RunResult` to `OutputPanel`
- `LessonContent` renders markdown independently using `react-markdown` + `react-syntax-highlighter`
- `BuildNote` is a collapsible section at the bottom, rendered from lesson data