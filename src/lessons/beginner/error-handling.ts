import { Lesson } from '@/types/lesson';

export const errorHandling: Lesson = {
  slug: 'error-handling',
  title: 'Basic Error Handling',
  description: 'Learn to handle errors gracefully with try/catch and understand error types in TypeScript.',
  difficulty: 'beginner',
  order: 6,  // Sixth lesson in curriculum
  content: `
# Basic Error Handling

Errors happen. Good code handles them gracefully. TypeScript helps you write safer error handling code.

## Try/Catch Basics

Wrap risky code in a try block, handle errors in catch:

\`\`\`typescript
try {
  // Code that might throw an error
  let result = riskyOperation();
  console.log(result);
} catch (error) {
  // Handle the error
  console.log("Something went wrong!");
}
\`\`\`

## The Error Object

When an error is thrown, you can access its message:

\`\`\`typescript
try {
  throw new Error("Oops!");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);  // "Oops!"
  }
}
\`\`\`

**Note:** In TypeScript, \`error\` in catch blocks is typed as \`unknown\` by default. You need to check its type before using it.

## Throwing Errors

Use \`throw\` to signal something went wrong:

\`\`\`typescript
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero!");
  }
  return a / b;
}

try {
  let result = divide(10, 0);
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);  // "Cannot divide by zero!"
  }
}
\`\`\`

## The Finally Block

Code in \`finally\` runs whether or not an error occurred:

\`\`\`typescript
try {
  console.log("Trying...");
  throw new Error("Oops!");
} catch (error) {
  console.log("Caught error!");
} finally {
  console.log("This always runs");
}
// Output:
// Trying...
// Caught error!
// This always runs
\`\`\`

## Type-Safe Error Handling

TypeScript's \`unknown\` type for errors makes you check before using:

\`\`\`typescript
try {
  // some code
} catch (error) {
  // error is 'unknown' - must check type
  if (error instanceof Error) {
    console.log(error.message);  // Safe!
  } else {
    console.log("Unknown error occurred");
  }
}
\`\`\`

## Custom Error Messages

Create descriptive error messages:

\`\`\`typescript
function validateAge(age: number): void {
  if (age < 0) {
    throw new Error("Age cannot be negative");
  }
  if (age > 150) {
    throw new Error("Age seems unrealistic");
  }
  console.log("Age is valid");
}
\`\`\`

## When to Use Error Handling

Use try/catch when:
- Parsing user input that might be invalid
- Making network requests that might fail
- Reading files that might not exist
- Any operation that could fail at runtime

## Returning vs Throwing

Sometimes returning a value is better than throwing:

\`\`\`typescript
// Throwing approach
function findUserOrThrow(id: number): User {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// Returning approach (often preferred)
function findUser(id: number): User | undefined {
  return users.find(u => u.id === id);
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use try/catch/finally to handle errors
- Throw custom errors with descriptive messages
- Safely access error properties with type checking
- Decide when to throw vs return error values
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Try/Catch',
      description: `Learn to catch errors with try/catch.

**Your task:**
1. In the try block, throw an error with message "Something failed!"
2. In the catch block, print the error message

**Important:** In TypeScript, you must check if the error is an Error object before accessing .message

**Try/catch syntax:**
\`\`\`
try {
  throw new Error("message");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
\`\`\``,
      starterCode: `// Write a try/catch block:
// - In try: throw new Error("Something failed!")
// - In catch: print the error message (check instanceof Error first)

`,
      solution: `try {
  throw new Error("Something failed!");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}`,
      expectedOutput: ['Something failed!'],
      hints: [
        'try and catch go together: try { } catch (error) { }',
        'throw new Error("Something failed!"); creates and throws an error',
        'error instanceof Error checks if it\'s an Error object',
        'error.message gives you the error text'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Safe Division Function',
      description: `Create a function that throws an error for invalid input.

**Your task:**
1. Create function \`safeDivide(a, b)\` that returns a/b
2. If b is 0, throw an Error with message "Division by zero"
3. Call safeDivide(10, 2) and print the result (should print 5)
4. Call safeDivide(10, 0) inside try/catch and print the error message`,
      starterCode: `// Create safeDivide(a, b) - throw "Division by zero" if b is 0


// Print safeDivide(10, 2)


// Call safeDivide(10, 0) in a try/catch and print the error message

`,
      solution: `function safeDivide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

console.log(safeDivide(10, 2));

try {
  safeDivide(10, 0);
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}`,
      expectedOutput: ['5', 'Division by zero'],
      hints: [
        'Function: function safeDivide(a: number, b: number): number',
        'Check b === 0 first, throw if true',
        '10/2 = 5, prints normally',
        '10/0 throws, so catch it and print error.message'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Try/Catch/Finally',
      description: `The finally block ALWAYS runs, whether there's an error or not.

**Your task:**
1. In try: print "Start", then throw an error
2. In catch: print "Error caught"
3. In finally: print "Cleanup done"

**Expected output:** Start, Error caught, Cleanup done (in that order)`,
      starterCode: `// Write try/catch/finally:
// try: print "Start", then throw an error
// catch: print "Error caught"
// finally: print "Cleanup done"

`,
      solution: `try {
  console.log("Start");
  throw new Error("Oops");
} catch (error) {
  console.log("Error caught");
} finally {
  console.log("Cleanup done");
}`,
      expectedOutput: ['Start', 'Error caught', 'Cleanup done'],
      hints: [
        'try block: console.log("Start"); then throw new Error("Oops");',
        'catch block: console.log("Error caught");',
        'finally block: console.log("Cleanup done");',
        'finally ALWAYS runs, even after an error is caught'
      ]
    }
  ],
  buildNote: {
    title: 'Error Handling in the App',
    explanation: `In \`src/lib/typescript-runner.ts\`, the code execution is wrapped in try/catch because compiling and running user code can fail in many ways — syntax errors, runtime errors, infinite loops. The catch block formats errors into a user-friendly format with line numbers. In \`src/app/lessons/[slug]/page.tsx\`, the \`handleRun\` function catches errors from the TypeScript runner and displays them in the output panel. We use the pattern of checking \`error instanceof Error\` to safely access the message property. This defensive approach ensures the app never crashes from user code errors.`,
    relatedFiles: [
      'src/lib/typescript-runner.ts',
      'src/app/lessons/[slug]/page.tsx',
      'src/components/OutputPanel.tsx'
    ],
    inTheRealWorld: `Production applications use structured error handling extensively. Backend APIs return error objects with status codes and messages. Frontend apps catch network errors and show user-friendly messages. Libraries like \`neverthrow\` provide Result types (Ok/Err) as an alternative to throwing. The trend in TypeScript is moving toward explicit error handling with union types (\`Result | Error\`) rather than try/catch, but both patterns are valid and widely used.`
  }
};
