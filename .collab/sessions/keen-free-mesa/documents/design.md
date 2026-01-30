# Session: keen-free-mesa

## Session Context
**Out of Scope:** (session-wide boundaries)
**Shared Decisions:** (cross-cutting choices)

---

## Work Items

### Item 1: Create a React TypeScript app that teaches TypeScript
**Type:** code
**Status:** documented

**Problem/Goal:**
Build a React application written in TypeScript that serves as an interactive TypeScript learning platform.

**Approach:**
- Text-based lessons with syntax-highlighted code snippets for explanations
- Embedded interactive code editor for hands-on practice within each lesson
- Sidebar navigation with lesson list on the left, content on the right

**Success Criteria:**
- App boots with Next.js and renders lesson content
- Sidebar lists all lessons grouped by difficulty
- Each lesson page shows text content with syntax highlighting and an interactive editor
- User can write and run TypeScript in the editor

### Design Section 1: App Architecture

**Project structure:** Next.js App Router with Tailwind CSS. Lessons are defined as TypeScript objects in `/src/lessons/` — each file exports a lesson with metadata (title, slug, difficulty, order) and content (markdown text, starter code, expected output/solution). The App Router layout (`/app/layout.tsx`) renders a persistent sidebar and a content area. Routes follow `/lessons/[slug]` pattern. The sidebar component reads all lesson metadata, groups them by difficulty (Beginner, Intermediate, Advanced), and renders navigation links. The lesson page component fetches the lesson by slug and renders the markdown content with syntax highlighting (using a library like `react-syntax-highlighter`) alongside an embedded code editor. For the code editor, Monaco Editor is the strongest choice — it provides full TypeScript IntelliSense, autocompletion, and error highlighting out of the box since it's the engine behind VS Code. TypeScript execution in the browser will use the TypeScript compiler API transpiled to JS, then evaluated in a sandboxed iframe or Web Worker for safety.

### Design Section 2: UI Layout

**Page layout:** A single-panel focused design using Tailwind CSS. The sidebar is **collapsible** — hidden by default so the lesson content takes full width and focus. A toggle button (hamburger icon or "Lessons" button) in the top-left opens the sidebar as an overlay or slide-in panel (250px wide, dark background). When open, it shows the app title, collapsible difficulty groups (Beginner, Intermediate, Advanced) with lesson links, and the active lesson highlighted. Clicking a lesson or the close button hides the sidebar. The main content area is always full-width and contains: (1) a header bar with the sidebar toggle, lesson title, difficulty badge, and progress indicator, (2) the lesson body rendered from markdown with syntax-highlighted code blocks, (3) an interactive practice section with the Monaco Editor, a "Run Code" button, and an output panel below showing console output or errors, and (4) a "How This Was Built" collapsible section at the bottom (for Item 2). Sidebar state is managed via React state — no layout shift, just an overlay.

### Design Section 3: Lesson Data Model

**Lesson structure:** Each lesson is a TypeScript object conforming to a `Lesson` interface defined in `/src/types/lesson.ts`. Fields: `slug` (URL-friendly ID), `title`, `description` (short summary for the sidebar), `difficulty` (enum: `beginner`, `intermediate`, `advanced`), `order` (numeric sort within its difficulty group), `content` (markdown string with the lesson text and code examples), `starterCode` (pre-filled code for the editor), `solution` (correct answer for validation), `expectedOutput` (what running the solution should produce), and `buildNote` (an object with `title`, `explanation` markdown, and `relatedFiles` array for the "How This Was Built" section). All lessons are collected in `/src/lessons/index.ts` which exports an array. A helper function `getLessonBySlug()` retrieves a lesson, and `getLessonsByDifficulty()` returns grouped lessons for the sidebar. No database needed — lessons are static data bundled with the app. Adding a new lesson means creating a new file in `/src/lessons/` and adding it to the index.

### Design Section 4: Code Execution

**How TypeScript runs in the browser:** When the user clicks "Run Code", the flow is: (1) Monaco Editor sends the source to the TypeScript compiler loaded in the browser (via the `typescript` npm package). (2) The compiler transpiles TS to JS. If there are compilation errors, they're displayed in the output panel with line numbers and messages. (3) On success, the transpiled JS is sent to a sandboxed `<iframe>` with `sandbox="allow-scripts"` for safe execution. The iframe intercepts `console.log` calls and posts messages back to the parent window. (4) The parent window collects these messages and displays them in the output panel. This approach runs entirely client-side — no server needed for code execution. The sandbox prevents user code from accessing the parent page's DOM, cookies, or storage. A timeout (5 seconds) kills long-running or infinite loops. The output panel shows both successful output and runtime errors. Monaco also provides real-time TypeScript error squiggles as the user types, since it has built-in TS language service support.

### Design Section 5: Lesson Curriculum

**Beginner (fundamentals):** (1) Variables & Types — `string`, `number`, `boolean`, `let` vs `const`. (2) Functions — typed parameters, return types, arrow functions. (3) Arrays & Objects — typed arrays, object shapes, basic type annotations. Each lesson introduces one concept with short examples and a simple exercise like "declare a variable with the correct type."

**Intermediate (type system):** (4) Interfaces — defining object shapes, optional properties, extending interfaces. (5) Union & Literal Types — union types, type narrowing, literal types. (6) Generics — generic functions, generic interfaces, common patterns like `Array<T>`. Exercises involve writing interfaces, narrowing types in conditionals, and creating generic utility functions.

**Advanced (deep TypeScript):** (7) Mapped Types — `Partial`, `Required`, `Pick`, building custom mapped types. (8) Conditional Types — `extends` keyword, `infer`, utility types like `Extract`/`Exclude`. (9) Decorators & Advanced Patterns — class decorators, method decorators, real-world patterns. Exercises challenge users to build their own utility types and apply advanced patterns.

Each level builds on the previous — beginner teaches the vocabulary, intermediate teaches composition, advanced teaches the type system's full power. This gives 9 lessons total as a starting set.

**Decisions:**
- Framework: Next.js
- Lesson format: Text explanations + interactive code editor
- Code editor: Monaco Editor (VS Code engine, built-in TS support)
- Styling: Tailwind CSS

---

### Item 2: Add explanations of how the app itself was built
**Type:** code
**Status:** documented

**Problem/Goal:**
Include sections or pages within the app that explain how the app was constructed, giving learners insight into a real-world TypeScript/React project.

**Approach:**
- Each lesson's buildNote content explains how the app uses the concept being taught
- Also includes brief real-world context on how the concept appears in production codebases
- Dedicated /why-we-built-it-this-way overview page comparing architectural choices against alternatives (e.g., Next.js vs Vite, Monaco vs CodeMirror, static data vs database, iframe sandbox vs Web Worker)

**Success Criteria:**
- All 9 lessons have substantive buildNote content tying the concept to the app's code
- Each buildNote references specific files via relatedFiles
- /why-we-built-it-this-way page loads and displays all comparison sections
- Comparisons cover at least 4 architectural decisions with pros/cons

### Design Section 1: Per-Lesson Build Notes

**Build note mapping:** Each lesson's `buildNote` field is populated with content that connects the lesson's TypeScript concept directly to the app's own source code. The mapping is: (1) Variables & Types → explains `Lesson` interface fields like `slug: string`, `order: number`, and the `Difficulty` type. (2) Functions → explains `getAllLessons()`, `getLessonBySlug()`, and other helpers in `index.ts`. (3) Arrays & Objects → explains the lessons array, `LessonGroup` object shape, and sorting logic. (4) Interfaces → explains component prop interfaces like `SidebarProps`, `CodeEditorProps`, `OutputPanelProps`. (5) Union & Literal Types → explains `Difficulty = "beginner" | "intermediate" | "advanced"` and `RunResult`'s success/error states. (6) Generics → explains `Record<Difficulty, number>`, React's `useState<RunResult | null>`, and `Promise<RunResult>`. (7) Mapped Types → explains `Record` usage for `difficultyOrder` and `difficultyLabels`. (8) Conditional Types → explains type narrowing in the output panel (`if (result.success)`) and optional chaining patterns. (9) Decorators & Advanced Patterns → explains the component composition pattern and how the app orchestrates multiple components. Each build note includes a "In the real world" paragraph with production examples.

### Design Section 2: Why We Built It This Way Page

**Overview page at `/why-we-built-it-this-way`:** A standalone page accessible from the header bar (a link next to the sidebar toggle). It presents the app's architectural decisions as comparison cards. Each card covers one decision: what we chose, what the alternatives were, and why we went this direction. The comparisons are: (1) **Next.js vs Vite vs Create React App** — why we chose Next.js (file-based routing, SSR capability, built-in TypeScript support) over Vite (lighter but less opinionated) and CRA (deprecated). (2) **Monaco Editor vs CodeMirror vs plain textarea** — why Monaco (full VS Code engine, native TypeScript IntelliSense) over CodeMirror (lighter but needs plugins for TS) and textarea (too basic). (3) **Static lesson data vs database** — why static TypeScript objects (type-safe, version-controlled, zero infrastructure) over a database (more complex, unnecessary for static content). (4) **iframe sandbox vs Web Worker** — why sandboxed iframe (simple DOM isolation, easy console capture) over Web Worker (no DOM access, harder to capture output). (5) **Tailwind CSS vs CSS Modules vs Styled Components** — why Tailwind (utility-first, fast iteration, good Next.js support) over alternatives. Each card shows a summary table with pros/cons columns, then a paragraph explaining the reasoning. The page is a new file at `src/app/why-we-built-it-this-way/page.tsx` and uses a reusable `ComparisonCard` component.

**Decisions:**
- Build note scope: App usage + real-world context
- Overview page: "Why We Built It This Way" — comparisons, not a how-to

---

### Item 3: Implement progressive difficulty — lessons start easy and get more in-depth and challenging
**Type:** code
**Status:** documented

**Problem/Goal:**
Structure the teaching content so it begins with fundamentals and gradually increases in complexity, providing a smooth learning curve.

**Approach:**
- Add difficulty indicators to exercises using star ratings (⭐, ⭐⭐, ⭐⭐⭐)
- Rating applies at lesson level: beginner=⭐, intermediate=⭐⭐, advanced=⭐⭐⭐
- Display star rating in the header bar next to the difficulty badge

**Success Criteria:**
- Star rating displays in lesson header based on difficulty
- Beginner shows ⭐, intermediate shows ⭐⭐, advanced shows ⭐⭐⭐
- Stars render correctly on all 9 lessons

### Design Section 1: Star Rating Display

**Implementation:** A small helper function `getStarRating(difficulty: Difficulty): number` returns 1, 2, or 3 based on the difficulty level. This function lives in `src/lib/lesson-utils.ts` (new file) or inline in the lesson page. The lesson page header bar already shows the lesson title and a difficulty badge — the star rating renders next to the badge using a simple loop: `Array(starCount).fill('⭐').join('')`. Alternatively, use a `StarRating` component that takes a `count` prop and renders that many star icons. The stars use a gold/yellow color (`text-yellow-500` in Tailwind) to stand out. No changes to the `Lesson` interface are needed — the star count derives from the existing `difficulty` field. The mapping is: `{ beginner: 1, intermediate: 2, advanced: 3 }`. This is a visual-only enhancement with no new data requirements.

**Decisions:**
- Difficulty indicator style: Star rating (1-3 stars)

---

### Item 4: Add quizzes with multiple-choice questions after each lesson
**Type:** code
**Status:** documented

**Problem/Goal:**
Add comprehension quizzes after each lesson to test understanding before moving on.

**Approach:**
- Quiz appears after lesson content, before the code editor
- Tests conceptual understanding before hands-on practice
- 4-5 multiple-choice questions per lesson
- Allow retry on incorrect answers (keep trying until correct)
- Quiz is optional — users can skip to code exercise

**Success Criteria:**
- Each lesson has 4-5 quiz questions
- Quiz component renders with multiple-choice options
- Incorrect answers allow retry with feedback
- Skip button available to proceed to code editor
- Correct answers show success state

**Decisions:**
- Placement: After content, before code editor
- Questions per quiz: 4-5
- Wrong answer behavior: Allow retry
- Quiz requirement: Optional (can skip)

### Design Section 1: Quiz Data Model

**Types:** Add to `src/types/lesson.ts`:

```typescript
interface QuizQuestion {
  question: string;           // The question text
  options: string[];          // 4 answer choices
  correctIndex: number;       // Index of correct answer (0-3)
  explanation?: string;       // Optional explanation shown after correct answer
}
```

**Lesson extension:** Add optional `quiz` field to `Lesson` interface:

```typescript
interface Lesson {
  // ... existing fields
  quiz?: QuizQuestion[];      // 4-5 questions per lesson
}
```

**Example quiz question:**
```typescript
{
  question: "What is the correct way to declare a string variable?",
  options: [
    "let name: string = 'Alice';",
    "let name = string('Alice');",
    "string name = 'Alice';",
    "var name: String = 'Alice';"
  ],
  correctIndex: 0,
  explanation: "TypeScript uses a colon followed by the type name after the variable."
}
```

### Design Section 2: Quiz Component

**Component:** `src/components/Quiz.tsx`

**Props:**
```typescript
interface QuizProps {
  questions: QuizQuestion[];
  onComplete: () => void;     // Called when all questions answered correctly
  onSkip: () => void;         // Called when user skips quiz
}
```

**State:**
- `currentQuestion: number` — index of current question (0 to N-1)
- `selectedAnswer: number | null` — user's selected option
- `answeredCorrectly: boolean[]` — tracks which questions are done
- `showFeedback: boolean` — whether to show correct/incorrect feedback

**UI Layout:**
- Question counter: "Question 2 of 5"
- Question text in bold
- 4 radio button options styled as cards
- "Check Answer" button (disabled until selection)
- On incorrect: shake animation, "Try again" message
- On correct: green highlight, show explanation, "Next" button
- "Skip Quiz" link at bottom
- After all correct: "Quiz Complete!" with proceed button

---

### Item 5: Add hints system with progressive hints for coding exercises
**Type:** code
**Status:** documented

**Problem/Goal:**
Provide progressive hints when users get stuck on coding exercises, revealing more detail with each hint.

**Approach:**
- 3-4 progressive hints per exercise
- Hints revealed one at a time via "Show hint" button
- Hints appear above the code editor
- Each hint provides more specific guidance than the last

**Success Criteria:**
- Each exercise has 3-4 hints defined
- "Show hint" button reveals next hint
- Hints panel renders above code editor
- Previously revealed hints remain visible
- All 9 lessons have hints for their exercises

**Decisions:**
- Reveal method: One at a time (progressive)
- Hints per exercise: 3-4
- UI location: Above code editor

### Design Section 1: Hints Data Model

**Hints are per-exercise:** Each exercise in a lesson has its own hints array.

```typescript
interface Exercise {
  title: string;              // "Exercise 1: Basic Variables"
  description: string;        // What to do (replaces starterCode comments)
  starterCode: string;
  solution: string;
  expectedOutput: string[];
  hints: string[];            // 3-4 progressive hints
}
```

**Hint progression example (Variables lesson):**
1. "Start by declaring a variable with `let` and specify its type after a colon."
2. "For a string, use `let variableName: string = \"value\";`"
3. "Don't forget to use `console.log()` to print the values."
4. "The solution uses `let greeting: string = \"Hello, TypeScript!\";`"

### Design Section 2: Hints Component

**Component:** `src/components/HintsPanel.tsx`

**Props:**
```typescript
interface HintsPanelProps {
  hints: string[];
  exerciseTitle: string;
}
```

**State:**
- `revealedCount: number` — how many hints shown (0 to hints.length)

**UI Layout:**
- Positioned above the code editor
- "Need help?" heading with hint count: "(0/4 hints revealed)"
- "Show Hint" button (disabled when all revealed)
- Revealed hints stack vertically with numbered labels
- Each hint in a light yellow/amber background card
- Subtle animation when new hint appears

**Integration:** The lesson page passes the current exercise's hints to this component. When user switches exercises via tabs, the hints reset.

---

### Item 6: Add multiple exercises per lesson (2-3 practice problems)
**Type:** code
**Status:** documented

**Problem/Goal:**
Expand from one exercise per lesson to 2-3 practice problems for more hands-on learning.

**Approach:**
- Each lesson has 2-3 exercises instead of one
- Tab navigation: Exercise 1 | Exercise 2 | Exercise 3
- Exercises increase in difficulty within each lesson
- Each exercise has its own starterCode, solution, expectedOutput, hints

**Success Criteria:**
- All 9 lessons have 2-3 exercises each
- Tab UI renders above code editor for exercise selection
- Each exercise maintains separate state (code, results)
- Progressive difficulty within each lesson

**Decisions:**
- Navigation: Tabs above editor
- Exercises per lesson: 2-3
- Difficulty progression: Yes (easiest to hardest within lesson)

### Design Section 1: Exercise Data Model

**Refactor Lesson interface:** Replace single exercise fields with an array.

```typescript
interface Exercise {
  id: number;                 // 1, 2, 3
  title: string;              // "Exercise 1: Declare Variables"
  description: string;        // Instructions for the exercise
  starterCode: string;
  solution: string;
  expectedOutput: string[];
  hints: string[];            // 3-4 hints (from Item 5)
}

interface Lesson {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  order: number;
  content: string;
  quiz?: QuizQuestion[];      // From Item 4
  exercises: Exercise[];      // 2-3 exercises, replaces starterCode/solution/expectedOutput
  buildNote: BuildNote;
}
```

**Migration:** Existing lessons have one exercise. Wrap current `starterCode`, `solution`, `expectedOutput` into `exercises[0]`, then add 1-2 more exercises per lesson.

### Design Section 2: Exercise Tabs Component

**Component:** `src/components/ExerciseTabs.tsx`

**Props:**
```typescript
interface ExerciseTabsProps {
  exercises: Exercise[];
  currentIndex: number;
  onSelect: (index: number) => void;
  completedIndices: number[];   // For showing checkmarks
}
```

**UI Layout:**
- Horizontal tab bar above the code editor
- Tabs: "Exercise 1" | "Exercise 2" | "Exercise 3"
- Active tab has purple underline/highlight
- Completed exercises show a small green checkmark
- Tab click switches the exercise content below

**Lesson Page Changes:**
- Add `currentExerciseIndex` state
- Pass `exercises[currentExerciseIndex]` to CodeEditor, OutputPanel, HintsPanel
- Track completed exercises in state (for checkmarks and progress)

---

### Item 7: Add progress tracking with localStorage and visual badges
**Type:** code
**Status:** documented

**Problem/Goal:**
Track completed lessons and exercises in localStorage, display visual progress indicators in the sidebar.

**Approach:**
- Track completion: Quiz + all exercises must be completed
- Store progress in localStorage per lesson
- Show progress bar per difficulty group in sidebar
- Provide reset button to clear all progress

**Success Criteria:**
- Progress persists across page refreshes (localStorage)
- Sidebar shows progress bar for each difficulty group
- Completing quiz + exercises marks lesson as done
- Reset button clears all progress
- Progress updates in real-time as user completes items

**Decisions:**
- Completion criteria: Quiz + all exercises
- Visual indicator: Progress bar per difficulty group
- Reset option: Yes, in sidebar

### Design Section 1: Progress Data Model

**Types:** Add to `src/types/lesson.ts`:

```typescript
interface LessonProgress {
  lessonSlug: string;
  quizCompleted: boolean;
  exercisesCompleted: number[];   // Array of completed exercise IDs
}

interface ProgressState {
  lessons: Record<string, LessonProgress>;  // keyed by slug
}
```

**localStorage key:** `typescript-teacher-progress`

**Example stored data:**
```json
{
  "lessons": {
    "variables-and-types": {
      "lessonSlug": "variables-and-types",
      "quizCompleted": true,
      "exercisesCompleted": [1, 2, 3]
    },
    "functions": {
      "lessonSlug": "functions",
      "quizCompleted": true,
      "exercisesCompleted": [1]
    }
  }
}
```

**Lesson completion logic:** A lesson is "complete" when `quizCompleted === true` AND `exercisesCompleted.length === exercises.length`.

### Design Section 2: Progress Hook & Sidebar

**Custom hook:** `src/hooks/useProgress.ts`

```typescript
function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => {
    // Load from localStorage on init
  });
  
  const markQuizComplete = (slug: string) => { ... };
  const markExerciseComplete = (slug: string, exerciseId: number) => { ... };
  const isLessonComplete = (slug: string, exerciseCount: number) => { ... };
  const getGroupProgress = (difficulty: Difficulty) => { completed: number, total: number };
  const resetProgress = () => { ... };
  
  return { progress, markQuizComplete, markExerciseComplete, isLessonComplete, getGroupProgress, resetProgress };
}
```

**Sidebar updates:**
- Each difficulty group header shows: "Beginner (2/3)"
- Progress bar below group header (green fill)
- "Reset Progress" button at bottom of sidebar
- Confirmation dialog before reset

**Lesson page integration:**
- Quiz component calls `markQuizComplete(slug)` on completion
- OutputPanel calls `markExerciseComplete(slug, exerciseId)` when output matches expected

---

## Diagrams
(auto-synced)