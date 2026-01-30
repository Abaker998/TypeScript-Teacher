# Pseudocode: Item 4 - Quizzes

## Quiz Component Logic

### State Initialization
```
1. Initialize state:
   - currentQuestion = 0
   - selectedAnswer = null
   - answeredCorrectly = Array(questions.length).fill(false)
   - showFeedback = false
   - feedbackType = null ('correct' | 'incorrect')
```

### handleSelectAnswer(optionIndex)
```
1. Set selectedAnswer = optionIndex
2. Set showFeedback = false (clear previous feedback)
```

### handleCheckAnswer()
```
1. If selectedAnswer === null: return (button should be disabled)

2. Check if answer is correct:
   - correctIndex = questions[currentQuestion].correctIndex
   - isCorrect = selectedAnswer === correctIndex

3. If isCorrect:
   - Set feedbackType = 'correct'
   - Set showFeedback = true
   - Update answeredCorrectly[currentQuestion] = true

4. If not correct:
   - Set feedbackType = 'incorrect'
   - Set showFeedback = true
   - Do NOT advance (allow retry)
```

### handleNextQuestion()
```
1. If currentQuestion < questions.length - 1:
   - Increment currentQuestion
   - Reset selectedAnswer = null
   - Reset showFeedback = false

2. If currentQuestion === questions.length - 1:
   - All questions complete
   - Call onComplete()
```

### handleSkip()
```
1. Call onSkip()
```

### Render Logic
```
1. Get current question: questions[currentQuestion]

2. Show question counter: "Question {currentQuestion + 1} of {questions.length}"

3. Show question text

4. For each option in question.options:
   - Render as clickable card
   - Highlight if selected
   - If showFeedback && correct: green border
   - If showFeedback && incorrect && selected: red border + shake

5. Show feedback message:
   - If correct: "Correct!" + explanation (if exists)
   - If incorrect: "Try again!"

6. Show buttons:
   - "Check Answer" (disabled if no selection or already correct)
   - "Next" (only if current question answered correctly)
   - "Skip Quiz" link at bottom

7. If all answered correctly:
   - Show "Quiz Complete!" message
   - Show "Continue to Exercises" button
```

## Error Handling
- Empty questions array: Render nothing or "No quiz available"
- Missing correctIndex: Default to 0 (shouldn't happen with typed data)

## Edge Cases
- User refreshes page: Quiz state resets (stateless, no persistence)
- All questions answered: Show completion state, call onComplete
- Question has no explanation: Don't render explanation section
