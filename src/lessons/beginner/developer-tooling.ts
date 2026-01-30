import { Lesson } from '@/types/lesson';

export const developerTooling: Lesson = {
  slug: 'developer-tooling',
  title: 'Developer Tooling',
  description: 'Learn about debugging, compile time vs runtime, linting, and transpiling.',
  difficulty: 'beginner',
  order: 8,  // Eighth lesson in curriculum
  content: `
# Developer Tooling

Understanding how code goes from what you write to what runs helps you debug effectively and use modern tools.

## Compile Time vs Runtime

These are two different phases of your code's life:

### Compile Time

**When TypeScript checks your code before running it.**

\`\`\`typescript
// TypeScript catches this BEFORE your code runs
let name: string = 42;  // Error at compile time!

// You see the red squiggly line in your editor
// The code never even runs
\`\`\`

Compile time catches:
- Type mismatches
- Missing properties
- Typos in variable names
- Wrong number of function arguments

### Runtime

**When your code actually executes in the browser or Node.js.**

\`\`\`typescript
// This passes compile time but fails at runtime
let data: any = null;
console.log(data.name);  // Runtime error! Cannot read property of null

// TypeScript can't catch this because 'any' bypasses type checking
\`\`\`

Runtime issues:
- Null/undefined access
- API failures
- Logic errors
- Invalid user input

### The Goal

**Catch as many errors as possible at compile time!**

\`\`\`typescript
// Bad: 'any' delays errors to runtime
function process(data: any) {
  return data.name.toUpperCase();  // Might crash at runtime
}

// Good: Types catch errors at compile time
function process(data: { name: string }) {
  return data.name.toUpperCase();  // TypeScript ensures this is safe
}
\`\`\`

## What is Transpiling?

**Transpiling converts code from one language to another.**

TypeScript transpiles (compiles) to JavaScript:

\`\`\`typescript
// TypeScript (what you write)
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// JavaScript (what runs in browser)
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

**What gets removed:**
- Type annotations
- Interfaces
- Type aliases
- Generics syntax

**Types exist only at compile time—they disappear at runtime!**

### The TypeScript Compiler (tsc)

\`\`\`bash
# Compile a file
tsc myfile.ts

# Compile and watch for changes
tsc --watch

# Use a config file
tsc --project tsconfig.json
\`\`\`

## What is Linting?

**Linting checks code for style issues, bugs, and best practices.**

ESLint is the most popular linter:

\`\`\`typescript
// Linter warnings:

// "Unexpected var, use let or const instead"
var x = 5;

// "x is defined but never used"
let x = 5;

// "Use === instead of =="
if (a == b) { }

// "Function is too complex (cyclomatic complexity)"
function doEverything() { /* 500 lines */ }
\`\`\`

### Linting vs Type Checking

| TypeScript | Linter |
|------------|--------|
| "Type 'string' is not assignable to 'number'" | "Prefer const over let" |
| "Property 'x' does not exist" | "Missing semicolon" |
| "Cannot find name 'foo'" | "Unused variable" |
| Hard errors (won't compile) | Warnings (code still runs) |

## Debugging

**Debugging is finding and fixing errors in your code.**

### Console Methods

\`\`\`typescript
// Basic logging
console.log("Value:", x);

// Warnings and errors
console.warn("This might be a problem");
console.error("Something went wrong!");

// Formatted table
console.table([{ name: "Alice" }, { name: "Bob" }]);

// Group related logs
console.group("User Data");
console.log("Name:", user.name);
console.log("Age:", user.age);
console.groupEnd();

// Timing
console.time("operation");
// ... do something ...
console.timeEnd("operation");  // "operation: 42ms"
\`\`\`

### Debugging Strategies

\`\`\`typescript
// 1. Add checkpoints
function processData(data) {
  console.log("Step 1 - Input:", data);

  let result = transform(data);
  console.log("Step 2 - After transform:", result);

  let final = validate(result);
  console.log("Step 3 - After validate:", final);

  return final;
}

// 2. Check types at runtime
function process(input: unknown) {
  console.log("Type:", typeof input);
  console.log("Is array:", Array.isArray(input));
  console.log("Value:", input);
}

// 3. Try/catch to see errors
try {
  riskyOperation();
} catch (error) {
  console.error("Error:", error);
  console.error("Stack:", error.stack);
}
\`\`\`

### Browser DevTools

- **Console tab**: See logs, run JavaScript
- **Sources tab**: Set breakpoints, step through code
- **Network tab**: See API requests and responses
- **Elements tab**: Inspect and modify the DOM

### Breakpoints

Instead of console.log everywhere, use the \`debugger\` statement:

\`\`\`typescript
function calculate(x: number) {
  debugger;  // Execution pauses here in DevTools
  let result = x * 2;
  return result;
}
\`\`\`

## Source Maps

**Source maps link compiled JavaScript back to your TypeScript.**

Without source maps:
- Errors show line numbers from compiled JS
- Hard to find the original TypeScript

With source maps:
- Errors show line numbers from your TypeScript
- Debug TypeScript directly in DevTools

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
\`\`\`

## Build Tools

Modern projects use build tools that combine everything:

- **Webpack**: Bundles files, handles imports
- **Vite**: Fast development server
- **esbuild**: Super fast compilation
- **Babel**: Transpiles modern JS to older JS

These tools usually:
1. Compile TypeScript
2. Run linters
3. Bundle files together
4. Generate source maps

## Learning Objectives

By the end of this lesson, you'll understand:
- The difference between compile time and runtime errors
- How TypeScript transpiles to JavaScript
- What linting does and why it helps
- Debugging strategies and tools
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Compile Time vs Runtime',
      description: `Understand when errors are caught by TypeScript vs when they crash at runtime.

**Your task:**
Print these three statements explaining when each error type is caught:

1. Type mismatch (string to number) → **Compile time**
2. Accessing null property → **Compile time** (TypeScript knows it might be null)
3. Using \`any\` type → **Runtime** (any bypasses type checking!)

**Key insight:** \`any\` is dangerous because it disables TypeScript's protection!`,
      starterCode: `// Print three explanations about when errors are caught:
// 1. Type mismatch errors
// 2. Accessing null errors
// 3. Errors when using 'any' type

`,
      solution: `console.log("Example 1: Compile time - TypeScript catches type mismatch");

console.log("Example 2: Compile time - TypeScript catches possible null");

console.log("Example 3: Runtime - 'any' allows the error through");`,
      expectedOutput: [
        'Example 1: Compile time - TypeScript catches type mismatch',
        'Example 2: Compile time - TypeScript catches possible null',
        'Example 3: Runtime - \'any\' allows the error through'
      ],
      hints: [
        'TypeScript catches type errors before code runs',
        'If TypeScript can analyze the problem, it\'s compile time',
        'any disables type checking = errors at runtime',
        'Just print the three console.log statements!'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Debugging with console.log',
      description: `Use console.log to trace through code and understand what's happening.

**Your task:**
1. Create an array \`numbers\` with values \`[1, 2, 3]\`
2. Loop through and print each value
3. Calculate and print the sum (should be 6)

**Debugging tip:** Print values at each step to see what's happening!`,
      starterCode: `// Create an array with [1, 2, 3]


// Loop through and print each number


// Calculate the sum and print "Sum: 6"

`,
      solution: `let numbers = [1, 2, 3];

for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}

let sum = 1 + 2 + 3;
console.log("Sum: " + sum);`,
      expectedOutput: [
        '1',
        '2',
        '3',
        'Sum: 6'
      ],
      hints: [
        'Create the array: let numbers = [1, 2, 3]',
        'Loop with: for (let i = 0; i < numbers.length; i++)',
        'Print each value: console.log(numbers[i])',
        'Print the sum with string concatenation: "Sum: " + sum'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Runtime Type Checking',
      description: `Use \`typeof\` to check types at runtime when the type is \`unknown\`.

**Your task:**
1. Print the type of the value
2. If string: print its length
3. If number: print "Positive" or "Negative"
4. Otherwise: print "Other"

**Syntax:** \`typeof value\` returns "string", "number", "boolean", etc.`,
      starterCode: `// Complete this function - check the type and print appropriate info
function describe(value: unknown) {
  // Print the type using: typeof value

  // If string: print its length
  // If number: print "Positive" or "Negative"
  // Otherwise: print "Other"
}

// Test with different types
describe("hello");
describe(42);
describe(true);
`,
      solution: `function describe(value: unknown) {
  console.log("Type:", typeof value);

  if (typeof value === "string") {
    console.log("Length:", value.length);
  } else if (typeof value === "number") {
    console.log(value >= 0 ? "Positive" : "Negative");
  } else {
    console.log("Other");
  }
}

describe("hello");
describe(42);
describe(true);`,
      expectedOutput: [
        'Type: string',
        'Length: 5',
        'Type: number',
        'Positive',
        'Type: boolean',
        'Other'
      ],
      hints: [
        'typeof "hello" returns "string"',
        'typeof 42 returns "number"',
        'typeof true returns "boolean"',
        'Inside if (typeof === "string"), TypeScript knows it\'s a string!'
      ]
    }
  ],
  buildNote: {
    title: 'Developer Tooling in Practice',
    explanation: `This app uses all these tools. TypeScript catches type errors at compile time before you even run the code. The build process transpiles TypeScript to JavaScript and bundles everything. ESLint could enforce code style. When errors occur in the code editor, we use console-based output to show them. Source maps would help debug the compiled output.`,
    relatedFiles: [
      'tsconfig.json',
      'package.json'
    ],
    inTheRealWorld: `Professional development relies on these tools. CI/CD pipelines run TypeScript and linters before deploying. Source maps are essential for debugging production issues. Understanding compile time vs runtime helps you write code that fails fast (at compile time) rather than crashing in production (at runtime). Every job posting expecting TypeScript knowledge also expects familiarity with these tools.`
  }
};
