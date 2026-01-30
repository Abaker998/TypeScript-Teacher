# Pseudocode: Item 6 - Multiple Exercises

## ExerciseTabs Component Logic

### Render Logic
```
1. For each exercise in exercises:
   - Render tab button with exercise.title or "Exercise {exercise.id}"
   - Apply active styles if index === currentIndex
   - Show checkmark icon if completedIndices.includes(exercise.id)

2. Tab click: call onSelect(index)
```

## LessonPage Updates

### State Changes
```
1. Add new state:
   - currentExerciseIndex = 0
   - completedExerciseIds: number[] = []
   - exerciseCode: Record<number, string> = {} (per-exercise code state)

2. On lesson load (useEffect):
   - Initialize exerciseCode with starterCode for each exercise
   - Reset currentExerciseIndex = 0
   - Reset completedExerciseIds = []
```

### handleExerciseSelect(index)
```
1. Save current code to exerciseCode[currentExerciseIndex]
2. Set currentExerciseIndex = index
3. Load code from exerciseCode[index] or exercises[index].starterCode
4. Reset result = null
```

### handleExerciseComplete(exerciseId)
```
1. If exerciseId not in completedExerciseIds:
   - Add to completedExerciseIds
   - Call progress.markExerciseComplete(slug, exerciseId) (Item 7)
```

### getCurrentExercise()
```
1. Return lesson.exercises[currentExerciseIndex]
```

### Render Integration
```
1. Render ExerciseTabs above HintsPanel:
   - exercises = lesson.exercises
   - currentIndex = currentExerciseIndex
   - onSelect = handleExerciseSelect
   - completedIndices = completedExerciseIds

2. Pass to HintsPanel:
   - hints = getCurrentExercise().hints
   - exerciseTitle = getCurrentExercise().title

3. Pass to CodeEditor:
   - initialCode = exerciseCode[currentExerciseIndex]
   - onChange updates exerciseCode[currentExerciseIndex]

4. Pass to OutputPanel:
   - expectedOutput = getCurrentExercise().expectedOutput
   - solution = getCurrentExercise().solution
   - onSuccess = () => handleExerciseComplete(getCurrentExercise().id)
```

## Lesson Data Migration

### For each lesson file:
```
1. Create exercises array from existing fields:
   exercises: [
     {
       id: 1,
       title: "Exercise 1: [derived from lesson context]",
       description: "[extracted from starterCode comments]",
       starterCode: lesson.starterCode,
       solution: lesson.solution,
       expectedOutput: lesson.expectedOutput,
       hints: ["hint 1", "hint 2", "hint 3"]
     },
     // Add 1-2 more exercises per lesson
   ]

2. Remove old fields:
   - starterCode (moved to exercises[0])
   - solution (moved to exercises[0])
   - expectedOutput (moved to exercises[0])
```

## Error Handling
- Empty exercises array: Should never happen, type requires at least one
- Exercise without hints: Default to empty array

## Edge Cases
- Single exercise: Tabs still render, just one tab
- User edits code then switches tabs: Code preserved in exerciseCode state
- Page refresh: All code resets to starterCode (no persistence)
