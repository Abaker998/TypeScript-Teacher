import { Lesson } from '@/types/lesson';

export const functions: Lesson = {
  slug: 'functions',
  title: 'Functions',
  description: 'Learn to write typed functions with parameter types and return type annotations.',
  difficulty: 'beginner',
  order: 3,
  content: `
# Functions

Functions are reusable blocks of code that perform specific tasks. TypeScript lets you annotate function parameters and return types, making your functions safer and more self-documenting.

## Function Basics

A TypeScript function declares the types of its parameters and its return type:

\`\`\`typescript
function greet(name: string): string {
  return "Hello, " + name + "!";
}

const result = greet("Alice");  // result has type string
\`\`\`

The syntax is: **function name(parameter: type): returnType { ... }**

## More Function Examples

Here are common function patterns you'll use frequently:

\`\`\`typescript
// Function with multiple parameters
function createUser(name: string, age: number, isAdmin: boolean): string {
  return \`User: \${name}, Age: \${age}, Admin: \${isAdmin}\`;
}

// Function that calculates something
function calculateArea(width: number, height: number): number {
  return width * height;
}

// Function that checks a condition
function isEven(num: number): boolean {
  return num % 2 === 0;
}

// Using the functions
console.log(createUser("Alice", 30, true));
console.log(calculateArea(5, 10));  // 50
console.log(isEven(4));  // true
\`\`\`

## Arrow Functions

Arrow functions are a concise syntax that TypeScript also supports:

\`\`\`typescript
const add = (a: number, b: number): number => {
  return a + b;
};

const sum = add(5, 3);  // sum is 8
\`\`\`

For single-line functions, you can omit the braces and TypeScript infers the return:

\`\`\`typescript
const multiply = (a: number, b: number): number => a * b;
const square = (n: number): number => n * n;
const isPositive = (n: number): boolean => n > 0;
\`\`\`

## Arrow Functions vs Regular Functions

Both styles work, but arrow functions are often preferred in modern code:

\`\`\`typescript
// Regular function
function addRegular(a: number, b: number): number {
  return a + b;
}

// Arrow function (equivalent)
const addArrow = (a: number, b: number): number => a + b;

// Arrow functions are great for callbacks
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n: number): number => n * 2);
// doubled is [2, 4, 6, 8, 10]
\`\`\`

## Functions Without Return Values

Some functions perform actions without returning a value. Use the **void** return type:

\`\`\`typescript
function logMessage(message: string): void {
  console.log(message);
}

function showAlert(title: string, body: string): void {
  console.log(\`Alert: \${title}\`);
  console.log(body);
}

logMessage("This prints but returns nothing");
\`\`\`

## Optional Parameters

Parameters can be optional using the \`?\` symbol:

\`\`\`typescript
function greet(name: string, greeting?: string): string {
  if (greeting) {
    return \`\${greeting}, \${name}!\`;
  }
  return \`Hello, \${name}!\`;
}

console.log(greet("Alice"));           // "Hello, Alice!"
console.log(greet("Bob", "Welcome"));  // "Welcome, Bob!"
\`\`\`

## Default Parameters

You can also provide default values:

\`\`\`typescript
function greet(name: string, greeting: string = "Hello"): string {
  return \`\${greeting}, \${name}!\`;
}

console.log(greet("Alice"));           // "Hello, Alice!"
console.log(greet("Bob", "Hi"));       // "Hi, Bob!"

// Default values with calculations
function createId(prefix: string = "ID", num: number = Date.now()): string {
  return \`\${prefix}-\${num}\`;
}
\`\`\`

## Rest Parameters

Collect multiple arguments into an array:

\`\`\`typescript
function sum(...numbers: number[]): number {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

console.log(sum(1, 2, 3));       // 6
console.log(sum(10, 20, 30, 40)); // 100
\`\`\`

## Why Function Types Matter

Typed parameters prevent mistakes. Without types, you might call a function incorrectly:

\`\`\`typescript
// Without types — no error until runtime
function calculateAge(birthYear) {
  return 2024 - birthYear;
}

calculateAge("2000");  // Returns NaN — oops!

// With types — error caught immediately
function calculateAge(birthYear: number): number {
  return 2024 - birthYear;
}

calculateAge("2000");  // TypeScript error!
\`\`\`

## Common Mistakes to Avoid

\`\`\`typescript
// WRONG: Forgetting return type
function add(a: number, b: number) {  // Works but unclear
  return a + b;
}

// WRONG: Wrong number of arguments
function greet(name: string): string {
  return "Hello " + name;
}
greet();  // Error: missing argument
greet("Alice", "Bob");  // Error: too many arguments

// WRONG: Returning wrong type
function getAge(): number {
  return "25";  // Error: string is not number
}

// WRONG: Not handling all code paths
function divide(a: number, b: number): number {
  if (b !== 0) {
    return a / b;
  }
  // Error: not all code paths return a value
}
\`\`\`

## Printing Function Results

To see what a function returns, call it and print the result with \`console.log()\`:

\`\`\`typescript
function double(n: number): number {
  return n * 2;
}

const result = double(5);
console.log(result);  // Prints: 10

// Or print directly:
console.log(double(7));  // Prints: 14
\`\`\`

## Quick Reference

| Feature | Syntax |
|---------|--------|
| Basic function | \`function name(param: type): returnType { }\` |
| Arrow function | \`const name = (param: type): returnType => { }\` |
| Short arrow | \`const name = (param: type): returnType => expression\` |
| Optional param | \`function name(param?: type): returnType\` |
| Default param | \`function name(param: type = default): returnType\` |
| Rest params | \`function name(...params: type[]): returnType\` |
| No return | \`function name(): void { }\` |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write function signatures with typed parameters
- Specify return types explicitly
- Use arrow function syntax with TypeScript
- Work with optional and default parameters
- Understand when to use void return types
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Typed Function',
      description: `Create a function that adds two numbers together.

**Your task:**
1. Create an arrow function called \`add\`
2. It takes two parameters: \`a\` and \`b\`, both of type \`number\`
3. It returns a \`number\` (the sum)
4. Call add(10, 5) and print the result

**Expected output:** 15`,
      starterCode: `// Create an arrow function called 'add' that takes two numbers and returns their sum


// Call add(10, 5) and store the result


// Print the result

`,
      solution: `const add = (a: number, b: number): number => {
  return a + b;
};

const result = add(10, 5);
console.log(result);`,
      expectedOutput: ['15'],
      hints: [
        'Arrow function syntax: const add = (a: number, b: number): number => { return a + b; }',
        'The : number after the parentheses is the return type',
        'Inside the function, use return a + b;',
        'Call it with add(10, 5) and use console.log() to print'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Arrow Functions - Short Syntax',
      description: `Learn the concise arrow function syntax (one-liners).

**Your task:**
1. Create a \`multiply\` function using the SHORT syntax (no braces, no return keyword)
2. Create a \`greet\` function that returns "Hello, [name]!"
3. Print multiply(4, 5)
4. Print greet("TypeScript")

**Short syntax example:** \`const double = (n: number): number => n * 2;\``,
      starterCode: `// Create multiply using SHORT syntax (no braces, no return keyword)
// Example of short syntax: const double = (n: number): number => n * 2;


// Create greet that takes a name and returns "Hello, [name]!"


// Print multiply(4, 5) and greet("TypeScript")

`,
      solution: `const multiply = (a: number, b: number): number => a * b;

const greet = (name: string): string => {
  return "Hello, " + name + "!";
};

console.log(multiply(4, 5));
console.log(greet("TypeScript"));`,
      expectedOutput: ['20', 'Hello, TypeScript!'],
      hints: [
        'Short syntax: const multiply = (a: number, b: number): number => a * b;',
        'No curly braces {} means the expression is automatically returned',
        'For greet, combine strings: "Hello, " + name + "!"',
        'Print directly: console.log(multiply(4, 5));'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Default Parameters',
      description: `Create a function with a default parameter value.

**Your task:**
1. Create a \`formatPrice\` function that takes:
   - \`price\`: number (required)
   - \`currency\`: string (optional, defaults to "$")
2. Return the currency + price as a string
3. Call formatPrice(99.99) - should use default "$"
4. Call formatPrice(49.99, "EUR ") - uses "EUR "

**Default parameter syntax:** \`function greet(name: string = "friend")\``,
      starterCode: `// Create formatPrice with price (required) and currency (defaults to "$")
// Return the currency + price as a string


// Call formatPrice(99.99) - should use default currency


// Call formatPrice(49.99, "EUR ") - uses custom currency

`,
      solution: `const formatPrice = (price: number, currency: string = "$"): string => {
  return currency + price;
};

console.log(formatPrice(99.99));
console.log(formatPrice(49.99, "EUR "));`,
      expectedOutput: ['$99.99', 'EUR 49.99'],
      hints: [
        'Default parameter: currency: string = "$"',
        'The = "$" means if no argument is passed, use "$"',
        'Return currency + price (they get concatenated into a string)',
        'formatPrice(99.99) uses "$", formatPrice(49.99, "EUR ") uses "EUR "'
      ]
    }
  ],
  buildNote: {
    title: 'Functions in the App',
    explanation: `The app's lesson system relies on helper functions defined in \`src/lessons/index.ts\`. The \`getAllLessons()\` function returns an array of all lesson objects with the explicit return type \`Lesson[]\`, ensuring it never accidentally returns something else. The \`getLessonBySlug(slug: string)\` function takes a string parameter and returns either a \`Lesson\` or \`undefined\` (the union type \`Lesson | undefined\`), communicating to callers that the lookup might fail. The \`getLessonsByDifficulty()\` function shows parameter typing in action, returning grouped lessons for the sidebar. These functions are called from the lesson page route handler in \`src/app/lessons/[slug]/page.tsx\` to fetch the correct lesson content based on the URL. Throughout the React components, event handler functions have typed parameters — for example, \`onClick\` handlers receive \`React.MouseEvent\`, and input change handlers receive \`React.ChangeEvent<HTMLInputElement>\`. Without these type annotations, mismatched event handlers would cause confusing bugs at runtime. The TypeScript compiler validates that event handlers match their expected signatures before the code runs.`,
    relatedFiles: [
      'src/lessons/index.ts',
      'src/app/lessons/[slug]/page.tsx',
      'src/components/CodeEditor.tsx'
    ],
    inTheRealWorld: `Typed functions are a cornerstone of production TypeScript. Express.js route handlers use types like \`(req: Request, res: Response): void\`. Utility libraries export functions with precise signatures, e.g., Lodash's \`_.map<T, R>(array: T[], iteratee: (item: T) => R): R[]\`. This clarity makes APIs self-documenting and prevents entire categories of parameter-passing bugs. Teams using strict function types catch issues during code review and CI, not after users encounter them.`
  }
};
