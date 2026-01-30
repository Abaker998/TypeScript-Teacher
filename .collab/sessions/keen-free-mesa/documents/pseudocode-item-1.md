# Pseudocode: Item 1 — React TypeScript Teaching App

---

### getAllLessons()

```
1. Import all lesson files from beginner/, intermediate/, advanced/ directories
2. Collect into a single array
3. Sort by difficulty order (beginner=0, intermediate=1, advanced=2), then by lesson.order within each group
4. Return the sorted array
```

**Edge Cases:**
- No lessons defined: Returns empty array

---

### getLessonBySlug(slug)

```
1. Call getAllLessons()
2. Find lesson where lesson.slug === slug
3. Return the lesson, or undefined if not found
```

**Edge Cases:**
- Empty slug: Returns undefined
- Non-existent slug: Returns undefined (caller handles 404)

---

### getLessonsByDifficulty()

```
1. Call getAllLessons()
2. Group lessons by difficulty field
3. For each group, create a LessonGroup:
   - difficulty: the key
   - label: capitalize first letter ("beginner" → "Beginner")
   - lessons: sorted by order within the group
4. Return array of 3 groups in order: beginner, intermediate, advanced
```

**Edge Cases:**
- A difficulty with no lessons: Include the group with empty lessons array

---

### getAdjacentLessons(slug)

```
1. Call getAllLessons() (already sorted globally)
2. Find index where lesson.slug === slug
3. If not found: return { prev: null, next: null }
4. prev = index > 0 ? lessons[index - 1] : null
5. next = index < lessons.length - 1 ? lessons[index + 1] : null
6. Return { prev, next }
```

**Edge Cases:**
- First lesson: prev is null
- Last lesson: next is null
- Non-existent slug: both null

---

### transpileTypeScript(source)

```
1. Load TypeScript compiler (import typescript package)
2. Call ts.transpileModule(source, compilerOptions)
   - compilerOptions: { target: ES2020, module: ESNext, strict: true }
3. Collect diagnostics from the result
4. If diagnostics exist:
   - Map each to CompileError { line, column, message }
   - Return { success: false, js: "", errors }
5. If no diagnostics:
   - Return { success: true, js: transpiledOutput, errors: [] }
```

**Error Handling:**
- If TypeScript compiler throws unexpectedly: catch, return { success: false, js: "", errors: [{ line: 0, column: 0, message: "Unexpected compiler error" }] }

**Edge Cases:**
- Empty source string: Transpiles successfully to empty JS
- Syntax errors: Caught by diagnostics, returned as CompileError array

---

### executeInSandbox(js, timeoutMs = 5000)

```
1. Create a hidden <iframe> with sandbox="allow-scripts"
2. Build iframe HTML:
   - Override console.log to capture arguments:
     window.console.log = (...args) => {
       output.push(args.map(String).join(" "))
       parent.postMessage({ type: "log", data: args.map(String).join(" ") }, "*")
     }
   - Wrap user JS in try/catch:
     try { eval(userJS) } catch(e) { parent.postMessage({ type: "error", data: e.message }, "*") }
   - After execution: parent.postMessage({ type: "done" }, "*")
3. Set iframe.srcdoc to the built HTML
4. Listen for postMessage events from iframe:
   - "log": push to output array
   - "error": push to errors array
   - "done": resolve the promise
5. Set a timeout (timeoutMs):
   - If timeout fires before "done": resolve with { success: false, output: [...captured], errors: [{ line: 0, column: 0, message: "Execution timed out (5s limit)" }] }
6. Clean up: remove iframe from DOM, remove event listener
7. Return RunResult { success, output, errors }
```

**Error Handling:**
- Runtime errors in user code: Caught by try/catch in iframe, reported via postMessage
- Infinite loops: Killed by timeout
- iframe creation failure: Return error RunResult

**Edge Cases:**
- Empty JS string: Executes successfully with no output
- Code that produces no console.log: Returns { success: true, output: [], errors: [] }
- Code with both output and errors: Captures partial output before error

---

### runTypeScript(source)

```
1. Call transpileTypeScript(source)
2. If transpile failed: return { success: false, output: [], errors: transpileResult.errors }
3. Call executeInSandbox(transpileResult.js)
4. Return the sandbox result
```

**Error Handling:**
- Transpile errors: Returned directly without attempting execution
- Runtime errors: Returned from sandbox

---

### Sidebar component

```
1. If !isOpen: render nothing (return null)
2. Render overlay backdrop (semi-transparent, clicking it calls onClose)
3. Render sidebar panel (250px, slide-in from left):
   - App title "TypeScript Teacher" at top
   - Close button (✕) calling onClose
   - For each lessonGroup in lessonGroups:
     - Render collapsible group header (difficulty label)
     - For each lesson in group.lessons:
       - Render Next.js <Link> to /lessons/{lesson.slug}
       - If lesson.slug === currentSlug: apply active styling
       - onClick: also call onClose (close sidebar on navigation)
```

**Edge Cases:**
- No lessons in a group: Render group header with "No lessons yet" text
- Very long lesson titles: Truncate with ellipsis via CSS

---

### LessonContent component

```
1. Receive content (markdown string)
2. Render using react-markdown
3. Configure code block renderer:
   - Use react-syntax-highlighter with a dark theme
   - Detect language from markdown fence (```typescript, ```javascript, etc.)
   - Apply syntax highlighting
4. Return rendered markdown
```

**Edge Cases:**
- Empty content: Render nothing
- Malformed markdown: react-markdown handles gracefully

---

### CodeEditor component

```
1. Receive initialCode and onChange callback
2. Render Monaco Editor with:
   - language: "typescript"
   - theme: "vs-dark"
   - value: initialCode
   - onChange: call props.onChange with new value
   - options: minimap disabled, line numbers on, word wrap on, font size 14
3. Monaco loads TypeScript language service automatically (provides IntelliSense)
```

**Edge Cases:**
- Monaco fails to load (large bundle): Show fallback textarea
- Empty initialCode: Show empty editor with placeholder comment

---

### OutputPanel component

```
1. If isRunning: show spinner with "Running..."
2. If result is null: show placeholder "Click 'Run Code' to see output"
3. If result.success:
   - If output is empty: show "Code ran successfully (no output)"
   - Else: render each output line in a monospace pre block
4. If !result.success:
   - Render errors with red styling
   - Show line/column info for each error
```

**Edge Cases:**
- Very long output: Cap at 100 lines, show "... truncated" message
- Output with special characters: Escape HTML

---

### BuildNote component

```
1. Receive buildNote prop
2. Render as collapsible section (collapsed by default)
3. Header: "🔧 How This Was Built: {buildNote.title}" — click to toggle
4. When expanded:
   - Render buildNote.explanation as markdown (same renderer as LessonContent)
   - List relatedFiles as code-styled inline links
```

**Edge Cases:**
- Empty explanation: Show "No build notes for this lesson"
- Empty relatedFiles: Don't render the files section

---

### lessons/[slug]/page.tsx (Lesson Page)

```
1. Extract slug from route params
2. Call getLessonBySlug(slug)
3. If not found: show Next.js notFound()
4. Call getLessonsByDifficulty() for sidebar data
5. Call getAdjacentLessons(slug) for prev/next navigation
6. Initialize state:
   - sidebarOpen: false
   - code: lesson.starterCode
   - runResult: null
   - isRunning: false
7. Define handleRun:
   - Set isRunning = true
   - Call runTypeScript(code)
   - Set runResult = result
   - Set isRunning = false
8. Render:
   - Header bar: sidebar toggle button, lesson.title, difficulty badge
   - <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} currentSlug={slug} lessonGroups={groups} />
   - <LessonContent content={lesson.content} />
   - <CodeEditor initialCode={lesson.starterCode} onChange={setCode} />
   - <button onClick={handleRun}>Run Code</button>
   - <OutputPanel result={runResult} isRunning={isRunning} />
   - <BuildNote buildNote={lesson.buildNote} />
   - Prev/Next navigation links at bottom
```

**Error Handling:**
- Invalid slug: Next.js notFound() returns 404 page
- runTypeScript failure: Caught in handleRun, displayed in OutputPanel