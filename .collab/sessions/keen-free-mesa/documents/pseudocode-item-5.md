# Pseudocode: Item 5 - Hints System

## HintsPanel Component Logic

### State Initialization
```
1. Initialize state:
   - revealedCount = 0
```

### Reset on Exercise Change
```
1. useEffect with [exerciseTitle] dependency:
   - Set revealedCount = 0
   - (Resets hints when user switches exercises)
```

### handleShowHint()
```
1. If revealedCount < hints.length:
   - Increment revealedCount
```

### Render Logic
```
1. Show header: "Need help?"

2. Show hint counter: "({revealedCount}/{hints.length} hints revealed)"

3. Show "Show Hint" button:
   - Disabled if revealedCount >= hints.length
   - Text: "Show Hint" or "All hints revealed"

4. For each hint from 0 to revealedCount - 1:
   - Render hint card with amber/yellow background
   - Show hint number: "Hint {i + 1}:"
   - Show hint text
   - Apply fade-in animation for newest hint

5. If no hints revealed yet:
   - Show encouraging message: "Try the exercise first!"
```

## Error Handling
- Empty hints array: Hide entire panel or show "No hints available"
- hints is undefined: Default to empty array

## Edge Cases
- All hints revealed: Disable button, show "All hints revealed"
- Single hint: Works fine, shows "(0/1 hints revealed)"
- Exercise switch: Reset revealedCount to 0
