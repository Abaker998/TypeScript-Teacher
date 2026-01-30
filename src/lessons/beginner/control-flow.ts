import { Lesson } from '@/types/lesson';

export const controlFlow: Lesson = {
  slug: 'control-flow',
  title: 'Control Flow',
  description: 'Master if/else statements, loops, and how TypeScript narrows types in conditional blocks.',
  difficulty: 'beginner',
  order: 5,  // Fifth lesson in curriculum
  content: `
# Control Flow

Control flow determines which code runs and when. TypeScript adds type safety to conditionals and loops, catching errors before runtime.

## If/Else Statements

The basic building block of control flow:

\`\`\`typescript
let age: number = 18;

if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
\`\`\`

## Comparison Operators

TypeScript supports all JavaScript comparison operators:

\`\`\`typescript
let a = 5;
let b = 10;

a === b    // Equal (strict) - false
a !== b    // Not equal - true
a > b      // Greater than - false
a < b      // Less than - true
a >= b     // Greater or equal - false
a <= b     // Less or equal - true
\`\`\`

**Important:** Always use \`===\` (strict equality) instead of \`==\` in TypeScript.

## Logical Operators

Combine conditions with \`&&\` (and), \`||\` (or), and \`!\` (not):

\`\`\`typescript
let isLoggedIn = true;
let isAdmin = false;

if (isLoggedIn && isAdmin) {
  console.log("Welcome, admin!");
} else if (isLoggedIn) {
  console.log("Welcome, user!");
} else {
  console.log("Please log in");
}
\`\`\`

## For Loops

Iterate a specific number of times:

\`\`\`typescript
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}
\`\`\`

TypeScript ensures \`i\` is a number throughout the loop.

## For...of Loops

Iterate over array elements:

\`\`\`typescript
let colors: string[] = ["red", "green", "blue"];

for (let color of colors) {
  console.log(color);  // TypeScript knows color is string
}
\`\`\`

## While Loops

Loop while a condition is true:

\`\`\`typescript
let count = 0;

while (count < 3) {
  console.log(count);
  count++;
}
\`\`\`

## Type Narrowing with Control Flow

Here's where TypeScript shines. Inside conditional blocks, TypeScript **narrows** types:

\`\`\`typescript
let value: string | number = "hello";

if (typeof value === "string") {
  // Inside this block, TypeScript knows value is string
  console.log(value.toUpperCase());  // OK!
} else {
  // Here, TypeScript knows value is number
  console.log(value.toFixed(2));  // OK!
}
\`\`\`

## Truthiness Narrowing

TypeScript understands truthy/falsy checks:

\`\`\`typescript
let name: string | null = "Alice";

if (name) {
  // TypeScript knows name is string (not null)
  console.log(name.toUpperCase());
}
\`\`\`

## The Ternary Operator

A shorthand for simple if/else:

\`\`\`typescript
let age = 20;
let status = age >= 18 ? "adult" : "minor";
console.log(status);  // "adult"
\`\`\`

## Switch Statements

Handle multiple cases cleanly:

\`\`\`typescript
let day: number = 1;

switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  default:
    console.log("Other day");
}
\`\`\`

## Break and Continue

Control loop execution flow:

\`\`\`typescript
// break: exit loop entirely
for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    break;  // Stop at 5
  }
  console.log(i);  // Prints 1, 2, 3, 4
}

// continue: skip to next iteration
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;  // Skip 3
  }
  console.log(i);  // Prints 1, 2, 4, 5
}
\`\`\`

## Early Return Pattern

Exit a function early when a condition is met:

\`\`\`typescript
function processUser(user: { name: string; age: number } | null): string {
  // Guard clause - return early if invalid
  if (!user) {
    return "No user provided";
  }

  // TypeScript knows user is not null here!
  if (user.age < 18) {
    return "User is a minor";
  }

  return \`Welcome, \${user.name}!\`;
}
\`\`\`

## Common Patterns

\`\`\`typescript
// Find first match in array
function findFirst(numbers: number[], target: number): number {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) {
      return i;  // Return index when found
    }
  }
  return -1;  // Not found
}

// Sum all numbers
function sum(numbers: number[]): number {
  let total = 0;
  for (let num of numbers) {
    total += num;
  }
  return total;
}

// Check if all items pass a test
function allPositive(numbers: number[]): boolean {
  for (let num of numbers) {
    if (num <= 0) {
      return false;  // Found a non-positive, fail fast
    }
  }
  return true;  // All passed
}
\`\`\`

## Nested Loops

Loops inside loops for working with 2D data:

\`\`\`typescript
let grid: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

for (let row of grid) {
  for (let cell of row) {
    console.log(cell);
  }
}
// Prints: 1, 2, 3, 4, 5, 6, 7, 8, 9
\`\`\`

## Common Mistakes to Avoid

\`\`\`typescript
// WRONG: Using = instead of ===
if (x = 5) { }  // This assigns, not compares!

// WRONG: Forgetting break in switch
switch (day) {
  case 1:
    console.log("Monday");
    // Falls through to case 2!
  case 2:
    console.log("Tuesday");
    break;
}

// WRONG: Infinite loop
let i = 0;
while (i < 10) {
  console.log(i);
  // Forgot i++; — loops forever!
}

// WRONG: Off-by-one error
for (let i = 0; i <= array.length; i++) {
  // Should be i < array.length
  console.log(array[i]);  // undefined on last iteration!
}
\`\`\`

## Quick Reference

| Statement | Use Case |
|-----------|----------|
| if/else | Binary decisions |
| else if | Multiple conditions |
| switch | Many specific values |
| for | Known number of iterations |
| for...of | Iterate array elements |
| while | Unknown iterations |
| break | Exit loop early |
| continue | Skip to next iteration |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write if/else statements with proper TypeScript types
- Use comparison and logical operators
- Create for, for...of, and while loops
- Understand how TypeScript narrows types in conditional blocks
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Conditionals',
      description: `Use an if/else statement to make a decision based on a value.

**Your task:**
1. Create a variable \`score\` with value 85
2. If score is 60 or above, print "Pass"
3. Otherwise, print "Fail"

**If/else syntax:**
\`\`\`
if (condition) {
  // runs if condition is true
} else {
  // runs if condition is false
}
\`\`\``,
      starterCode: `// Create a score variable with value 85


// Write an if/else: if score >= 60, print "Pass", otherwise print "Fail"

`,
      solution: `let score: number = 85;

if (score >= 60) {
  console.log("Pass");
} else {
  console.log("Fail");
}`,
      expectedOutput: ['Pass'],
      hints: [
        'First line: let score: number = 85;',
        'Use >= for "greater than or equal to"',
        'Inside if block: console.log("Pass");',
        'Inside else block: console.log("Fail");'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Loop Through Array',
      description: `Use a for...of loop to print each item in an array.

**Your task:**
1. Create an array \`fruits\` with: "apple", "banana", "cherry"
2. Use a for...of loop to print each fruit

**For...of syntax:**
\`\`\`
for (let item of array) {
  console.log(item);
}
\`\`\``,
      starterCode: `// Create an array of fruits: "apple", "banana", "cherry"


// Use a for...of loop to print each fruit

`,
      solution: `let fruits: string[] = ["apple", "banana", "cherry"];

for (let fruit of fruits) {
  console.log(fruit);
}`,
      expectedOutput: ['apple', 'banana', 'cherry'],
      hints: [
        'Array: let fruits: string[] = ["apple", "banana", "cherry"];',
        'For...of: for (let fruit of fruits) { }',
        'Inside the loop, fruit becomes each element in order',
        'Print with console.log(fruit);'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Counting Loop',
      description: `Use a classic for loop to count from 1 to 5.

**Your task:**
Print the numbers 1, 2, 3, 4, 5 (each on a new line)

**For loop syntax:**
\`\`\`
for (let i = start; i <= end; i++) {
  console.log(i);
}
\`\`\`

**The three parts:**
- \`let i = 1\` — start at 1
- \`i <= 5\` — continue while i is 5 or less
- \`i++\` — add 1 to i after each loop`,
      starterCode: `// Use a for loop to print 1, 2, 3, 4, 5
// Hint: for (let i = start; i <= end; i++) { ... }

`,
      solution: `for (let i = 1; i <= 5; i++) {
  console.log(i);
}`,
      expectedOutput: ['1', '2', '3', '4', '5'],
      hints: [
        'Start: let i = 1 (begin counting at 1)',
        'Condition: i <= 5 (keep going while 5 or less)',
        'Increment: i++ (add 1 after each loop)',
        'Body: console.log(i); (print the current number)'
      ]
    }
  ],
  buildNote: {
    title: 'Control Flow in the App',
    explanation: `Control flow is everywhere in this app. In \`src/components/OutputPanel.tsx\`, we use conditionals to show different UI based on the grade: if perfect, show celebration; if partial, show encouragement; if error, show tips. The \`gradeOutput\` function uses a for loop to compare each line of actual output against expected output. In \`src/hooks/useProgress.ts\`, we loop through completed exercises to calculate progress percentages. Type narrowing is used when checking if \`result\` exists before accessing its properties — TypeScript knows inside the \`if (result)\` block that result is not null.`,
    relatedFiles: [
      'src/components/OutputPanel.tsx',
      'src/components/Quiz.tsx',
      'src/hooks/useProgress.ts'
    ],
    inTheRealWorld: `Control flow with type narrowing is one of TypeScript's killer features. In production code, you'll often have values that could be multiple types (like API responses that might be data or an error). Using \`if (response.error)\` lets TypeScript narrow the type so you can safely access error properties in that block, and data properties in the else block. Libraries like Zod and io-ts build on this pattern for runtime validation with full type inference.`
  }
};
