# Pseudocode: Item 7 - Progress Tracking

## useProgress Hook Logic

### State Initialization
```
1. Initialize state from localStorage:
   const [progress, setProgress] = useState<ProgressState>(() => {
     - Try to load from localStorage.getItem('typescript-teacher-progress')
     - If found: parse JSON and return
     - If not found or error: return { lessons: {} }
   })
```

### Persist to localStorage
```
1. useEffect with [progress] dependency:
   - localStorage.setItem('typescript-teacher-progress', JSON.stringify(progress))
```

### markQuizComplete(slug)
```
1. Get or create lesson progress:
   - existing = progress.lessons[slug] || { lessonSlug: slug, quizCompleted: false, exercisesCompleted: [] }

2. Update:
   - existing.quizCompleted = true

3. Set new progress state:
   - setProgress({ lessons: { ...progress.lessons, [slug]: existing } })
```

### markExerciseComplete(slug, exerciseId)
```
1. Get or create lesson progress:
   - existing = progress.lessons[slug] || { lessonSlug: slug, quizCompleted: false, exercisesCompleted: [] }

2. If exerciseId not already in exercisesCompleted:
   - existing.exercisesCompleted = [...existing.exercisesCompleted, exerciseId]

3. Set new progress state:
   - setProgress({ lessons: { ...progress.lessons, [slug]: existing } })
```

### isLessonComplete(slug, exerciseCount)
```
1. Get lesson progress:
   - lessonProgress = progress.lessons[slug]

2. If not exists: return false

3. Check:
   - quizComplete = lessonProgress.quizCompleted
   - allExercisesComplete = lessonProgress.exercisesCompleted.length >= exerciseCount

4. Return quizComplete && allExercisesComplete
```

### getGroupProgress(difficulty, lessons)
```
1. Filter lessons by difficulty:
   - groupLessons = lessons.filter(l => l.difficulty === difficulty)

2. Count completed:
   - completed = groupLessons.filter(lesson => 
       isLessonComplete(lesson.slug, lesson.exercises.length)
     ).length

3. Return { completed, total: groupLessons.length }
```

### resetProgress()
```
1. Set progress = { lessons: {} }
2. localStorage updates via useEffect
```

## ProgressBar Component Logic

### Render Logic
```
1. Calculate percentage:
   - percentage = total > 0 ? (completed / total) * 100 : 0

2. Render:
   - Container div with gray background
   - Inner div with green background, width = percentage%
   - Optional label: "{label} ({completed}/{total})"
```

## Sidebar Updates

### Integration with useProgress
```
1. In Sidebar component:
   - Call useProgress() hook
   - Get all lessons via getAllLessons()

2. For each difficulty group:
   - Call getGroupProgress(difficulty, lessons)
   - Render ProgressBar with completed/total
   - Show label like "Beginner (2/3)"

3. At bottom of sidebar:
   - Render "Reset Progress" button
   - On click: show confirmation dialog
   - If confirmed: call resetProgress()
```

## Error Handling
- localStorage unavailable (private browsing): Catch error, use in-memory only
- Corrupted localStorage data: Catch JSON.parse error, reset to empty state
- Missing lesson slug: Create new entry with defaults

## Edge Cases
- New lesson added: Works automatically (no entry = not complete)
- Lesson removed: Orphaned progress data (harmless)
- Quiz optional (no quiz): Consider quiz complete if lesson.quiz is undefined
- Zero exercises: isLessonComplete returns true if quiz done
