# Pseudocode: Item 2 — How/Why the App Was Built

---

### getAllComparisons()

```
1. Define array of 5 Comparison objects:
   - "framework-choice": Next.js vs Vite vs CRA
   - "code-editor": Monaco vs CodeMirror vs Textarea
   - "data-storage": Static data vs Database
   - "code-execution": iframe sandbox vs Web Worker
   - "styling": Tailwind vs CSS Modules vs Styled Components
2. Return the array
```

**Edge Cases:**
- None — static data, always returns 5 items

---

### ComparisonCard component

```
1. Receive comparison prop
2. Render card container with:
   - Title (comparison.title)
   - Question text (comparison.question) in italic
3. Render options table:
   - Header row: Option | Pros | Cons
   - For each option in comparison.options:
     - Name column: option.name, bold + checkmark if option.chosen
     - Pros column: bulleted list of option.pros[].text
     - Cons column: bulleted list of option.cons[].text
4. Render reasoning section:
   - "Our Decision" heading
   - Render comparison.reasoning as markdown
```

**Edge Cases:**
- Option with no pros: Show empty pros cell
- Option with no cons: Show empty cons cell
- Long reasoning text: Renders naturally, no truncation needed

---

### why-we-built-it-this-way/page.tsx

```
1. Call getAllComparisons()
2. Render page:
   - Page title: "Why We Built It This Way"
   - Intro paragraph: Explains this page compares the architectural
     choices made in building this app against alternatives
   - For each comparison in comparisons:
     - Render <ComparisonCard comparison={comparison} />
   - Footer: Link back to lessons
```

**Edge Cases:**
- None — static page with static data

---

### Lesson file buildNote modifications (all 9 files)

```
For each lesson file:
1. Replace placeholder buildNote.title with descriptive title
   - Pattern: "How This App Uses [Concept]"
2. Replace placeholder buildNote.explanation with:
   - Paragraph 1: "In this app, [concept] is used in [specific file/component]..."
   - Code snippet: Show actual app code that uses the concept
   - Paragraph 2: "In the real world, [concept] is commonly used for..."
   - Real-world example
3. Update buildNote.relatedFiles with actual paths referenced in explanation
```

**Content mapping:**
- Variables & Types → src/types/lesson.ts (string, number, boolean fields)
- Functions → src/lessons/index.ts (getAllLessons, getLessonBySlug)
- Arrays & Objects → src/lessons/index.ts (lessons array, LessonGroup)
- Interfaces → src/components/*.tsx (SidebarProps, CodeEditorProps, etc.)
- Union & Literal Types → src/types/lesson.ts (Difficulty), src/lib/typescript-runner.ts (RunResult)
- Generics → src/lessons/index.ts (Record<Difficulty, number>), component state
- Mapped Types → src/lessons/index.ts (Record usage for difficultyOrder/Labels)
- Conditional Types → src/components/OutputPanel.tsx (result.success narrowing)
- Decorators & Patterns → src/app/lessons/[slug]/page.tsx (component composition)

**Edge Cases:**
- None — content modifications only, no runtime logic

---

### layout.tsx modification

```
1. Add a link to /why-we-built-it-this-way in the header bar
   - Position: right side of header, next to app title
   - Text: "Why This Way?" or similar short label
```

**Edge Cases:**
- None — static link addition

---

## Verification

- [x] Every function from Interface has pseudocode
- [x] Error handling is explicit (minimal — mostly static data)
- [x] Edge cases identified (empty pros/cons, content mapping)
- [x] External dependencies noted (none — all static data)