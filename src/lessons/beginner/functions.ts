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

## The Big Picture: Functions in Real Applications

Functions are the building blocks of every application. Here's how they look in real codebases:

### Form Validation
\`\`\`typescript
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain an uppercase letter" };
  }
  return { valid: true, message: "Password is valid" };
}

// Usage
const isEmailValid = validateEmail("user@example.com");  // true
const passwordCheck = validatePassword("MyPass123");     // { valid: true, message: "..." }
\`\`\`

### Data Transformation
\`\`\`typescript
function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency
  }).format(amount);
}

function formatDate(date: Date, format: string = "short"): string {
  if (format === "short") {
    return date.toLocaleDateString();
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// Usage
console.log(formatCurrency(1234.56));        // "$1,234.56"
console.log(formatCurrency(99.99, "EUR"));   // "€99.99"
console.log(formatDate(new Date()));         // "1/30/2024"
\`\`\`

### API Helpers
\`\`\`typescript
async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(\`/api/users/\${userId}\`);
  if (!response.ok) {
    throw new Error("User not found");
  }
  return response.json();
}

async function createPost(title: string, content: string, authorId: number): Promise<Post> {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, authorId })
  });
  return response.json();
}
\`\`\`

### Event Handlers (React)
\`\`\`typescript
// Button click handler
const handleSubmit = (event: React.FormEvent): void => {
  event.preventDefault();
  // Process form...
};

// Input change handler
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  const value = event.target.value;
  setInputValue(value);
};

// Keyboard handler
const handleKeyPress = (event: React.KeyboardEvent): void => {
  if (event.key === "Enter") {
    submitForm();
  }
};
\`\`\`

### Utility Functions
\`\`\`typescript
// Generate unique IDs
function generateId(prefix: string = "id"): string {
  return \`\${prefix}_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
}

// Debounce function for search inputs
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Calculate percentage
function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
\`\`\`

### Array Processing
\`\`\`typescript
// Filter and transform data
function getActiveUsers(users: User[]): User[] {
  return users.filter(user => user.isActive);
}

function getUserNames(users: User[]): string[] {
  return users.map(user => user.name);
}

function getTotalRevenue(orders: Order[]): number {
  return orders.reduce((total, order) => total + order.amount, 0);
}

// Find specific items
function findUserById(users: User[], id: number): User | undefined {
  return users.find(user => user.id === id);
}
\`\`\`

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
    },
    {
      id: 4,
      title: 'Exercise 4: Function with Optional Parameter',
      description: `Create a function that uses an optional parameter (marked with ?).

**Your task:**
1. Create a function \`describePerson\` that takes:
   - \`name\`: string (required)
   - \`age\`: number (optional - use ?)
2. If age is provided, return "[name] is [age] years old"
3. If age is NOT provided, return "[name]'s age is unknown"
4. Test with describePerson("Alice", 30) and describePerson("Bob")

**Optional parameter syntax:** \`function greet(name: string, title?: string)\``,
      starterCode: `// Create describePerson with name (required) and age (optional)
// Use ? to mark age as optional: age?: number


// Test with age provided
console.log(describePerson("Alice", 30));

// Test without age
console.log(describePerson("Bob"));
`,
      solution: `function describePerson(name: string, age?: number): string {
  if (age !== undefined) {
    return name + " is " + age + " years old";
  }
  return name + "'s age is unknown";
}

console.log(describePerson("Alice", 30));
console.log(describePerson("Bob"));`,
      expectedOutput: ['Alice is 30 years old', "Bob's age is unknown"],
      hints: [
        'Optional parameter uses ?: age?: number',
        'Check if age was provided: if (age !== undefined)',
        'You can also check with: if (age)',
        'Return different strings based on whether age exists'
      ]
    }
  ],
  quiz: [
    {
      question: 'What return type should you use for a function that doesn\'t return anything?',
      options: ['null', 'undefined', 'void', 'never'],
      correctIndex: 2,
      explanation: 'void indicates a function performs an action but doesn\'t return a value. Use it for functions like logMessage() that just print or have side effects.'
    },
    {
      question: 'What is the correct syntax for an arrow function that multiplies two numbers?',
      options: [
        'const multiply = (a, b) number => a * b;',
        'const multiply = (a: number, b: number): number => a * b;',
        'const multiply: number = (a, b) => a * b;',
        'const multiply => (a: number, b: number): number = a * b;'
      ],
      correctIndex: 1,
      explanation: 'Arrow function syntax: const name = (params: types): returnType => expression; The return type comes after the parameter list with a colon.'
    },
    {
      question: 'How do you make a parameter optional in TypeScript?',
      options: [
        'Add "optional" before the parameter name',
        'Add ? after the parameter name',
        'Wrap the parameter in square brackets',
        'Use the Optional<T> type'
      ],
      correctIndex: 1,
      explanation: 'Add a question mark after the parameter name: function greet(name: string, greeting?: string). Optional parameters can be omitted when calling the function.'
    },
    {
      question: 'What happens if you call a function with the wrong number of arguments in TypeScript?',
      options: [
        'The extra arguments are ignored',
        'Missing arguments become undefined',
        'TypeScript shows a compile-time error',
        'The function throws a runtime error'
      ],
      correctIndex: 2,
      explanation: 'TypeScript catches incorrect argument counts at compile time. This prevents bugs where you forget an argument or pass too many.'
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
