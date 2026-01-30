# Task Dependency Graph - Learning Enhancements

## Complete Task Graph (YAML)

```yaml
tasks:
  # Item 4: Quizzes
  - id: quiz-types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts]
    description: Add QuizQuestion interface to types
    parallel: true

  - id: quiz-component
    files: [src/components/Quiz.tsx]
    tests: [src/components/Quiz.test.tsx]
    description: Quiz component with retry logic
    depends-on: [quiz-types]

  # Item 5: Hints
  - id: exercise-types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts]
    description: Add Exercise interface with hints field
    depends-on: [quiz-types]

  - id: hints-component
    files: [src/components/HintsPanel.tsx]
    tests: [src/components/HintsPanel.test.tsx]
    description: HintsPanel component with progressive reveal
    depends-on: [exercise-types]

  # Item 6: Multiple Exercises
  - id: lesson-refactor-types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts]
    description: Refactor Lesson to use exercises array
    depends-on: [exercise-types]

  - id: exercise-tabs-component
    files: [src/components/ExerciseTabs.tsx]
    tests: [src/components/ExerciseTabs.test.tsx]
    description: Tab navigation for exercises
    depends-on: [lesson-refactor-types]

  - id: migrate-beginner-lessons
    files:
      - src/lessons/beginner/variables-and-types.ts
      - src/lessons/beginner/functions.ts
      - src/lessons/beginner/arrays-and-objects.ts
    tests: []
    description: Migrate beginner lessons to exercises array
    depends-on: [lesson-refactor-types]
    parallel: true

  - id: migrate-intermediate-lessons
    files:
      - src/lessons/intermediate/interfaces.ts
      - src/lessons/intermediate/union-and-literal-types.ts
      - src/lessons/intermediate/generics.ts
    tests: []
    description: Migrate intermediate lessons to exercises array
    depends-on: [lesson-refactor-types]
    parallel: true

  - id: migrate-advanced-lessons
    files:
      - src/lessons/advanced/mapped-types.ts
      - src/lessons/advanced/conditional-types.ts
      - src/lessons/advanced/decorators-and-patterns.ts
    tests: []
    description: Migrate advanced lessons to exercises array
    depends-on: [lesson-refactor-types]
    parallel: true

  # Item 7: Progress Tracking
  - id: progress-types
    files: [src/types/lesson.ts]
    tests: [src/types/lesson.test.ts]
    description: Add LessonProgress and ProgressState types
    depends-on: [lesson-refactor-types]

  - id: progress-bar-component
    files: [src/components/ProgressBar.tsx]
    tests: [src/components/ProgressBar.test.tsx]
    description: Visual progress bar component
    parallel: true

  - id: progress-hook
    files: [src/hooks/useProgress.ts]
    tests: [src/hooks/useProgress.test.ts]
    description: Progress tracking hook with localStorage
    depends-on: [progress-types]

  - id: sidebar-progress
    files: [src/components/Sidebar.tsx]
    tests: [src/components/Sidebar.test.tsx]
    description: Update sidebar with progress bars and reset
    depends-on: [progress-hook, progress-bar-component]

  # Integration
  - id: lesson-page-integration
    files: [src/app/lessons/[slug]/page.tsx]
    tests: []
    description: Integrate all components in lesson page
    depends-on: 
      - quiz-component
      - hints-component
      - exercise-tabs-component
      - progress-hook
      - migrate-beginner-lessons
```

## Execution Waves

### Wave 1 (Parallel - No dependencies)
- `quiz-types` - QuizQuestion interface
- `progress-bar-component` - ProgressBar component (standalone)

### Wave 2 (Depends on Wave 1)
- `quiz-component` - Quiz component
- `exercise-types` - Exercise interface

### Wave 3 (Depends on Wave 2)
- `hints-component` - HintsPanel component
- `lesson-refactor-types` - Refactor Lesson interface

### Wave 4 (Depends on Wave 3)
- `exercise-tabs-component` - ExerciseTabs component
- `progress-types` - Progress types
- `migrate-beginner-lessons` (parallel)
- `migrate-intermediate-lessons` (parallel)
- `migrate-advanced-lessons` (parallel)

### Wave 5 (Depends on Wave 4)
- `progress-hook` - useProgress hook

### Wave 6 (Depends on Wave 5)
- `sidebar-progress` - Sidebar with progress bars

### Wave 7 (Final Integration)
- `lesson-page-integration` - Wire everything together

## Verification Checklist

- [x] All files from Interface phases documented
- [x] File paths match exactly
- [x] All types defined
- [x] All function signatures present
- [x] TODO comments match pseudocode
- [x] Dependency graph covers all files
- [x] No circular dependencies
