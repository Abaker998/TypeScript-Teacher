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

## The Big Picture: Developer Tooling in Real Applications

Professional development environments are built around these tools. Here's how they work in production:

### CI/CD Pipeline
\`\`\`yaml
# .github/workflows/ci.yml - Automated checks on every push
name: CI Pipeline

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      # Step 1: TypeScript compile check
      - name: Type Check
        run: npx tsc --noEmit
        # Fails the build if any type errors exist

      # Step 2: Run linter
      - name: Lint
        run: npm run lint
        # Catches style issues, unused vars, etc.

      # Step 3: Run tests
      - name: Test
        run: npm test
        # Unit tests, integration tests

      # Step 4: Build for production
      - name: Build
        run: npm run build
        # Creates optimized bundle

      # Step 5: Deploy (only on main branch)
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: npm run deploy
\`\`\`

### tsconfig.json - Compiler Configuration
\`\`\`json
{
  "compilerOptions": {
    // Strict type checking - catch more errors at compile time
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,

    // Modern JavaScript output
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Paths and output
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    // Development experience
    "sourceMap": true,
    "declaration": true,

    // Extra checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

### ESLint Configuration
\`\`\`javascript
// .eslintrc.js - Linting rules
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // React rules
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
\`\`\`

### Debugging Production Issues
\`\`\`typescript
// Error tracking service integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "https://your-sentry-dsn",
  environment: process.env.NODE_ENV,
  release: process.env.VERSION
});

// Wrap risky operations
async function fetchUserData(userId: string) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    return await response.json();

  } catch (error) {
    // Log to error tracking service
    Sentry.captureException(error, {
      extra: {
        userId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    });

    // Re-throw for caller to handle
    throw error;
  }
}

// Performance monitoring
function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;

  // Log slow operations
  if (duration > 100) {
    console.warn(\`Slow operation: \${name} took \${duration.toFixed(2)}ms\`);
    Sentry.addBreadcrumb({
      category: 'performance',
      message: \`\${name}: \${duration.toFixed(2)}ms\`,
      level: 'warning'
    });
  }
}
\`\`\`

### Development vs Production Builds
\`\`\`typescript
// Environment-specific code
const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.myapp.com'
    : 'http://localhost:3001',

  debug: process.env.NODE_ENV !== 'production',

  features: {
    newCheckout: process.env.FEATURE_NEW_CHECKOUT === 'true',
    betaDashboard: process.env.FEATURE_BETA_DASHBOARD === 'true'
  }
};

// Debug logging only in development
function debugLog(...args: unknown[]) {
  if (config.debug) {
    console.log('[DEBUG]', ...args);
  }
}

// In development, show detailed errors
// In production, show user-friendly messages
function handleError(error: Error) {
  if (config.debug) {
    console.error('Full error:', error);
    console.error('Stack trace:', error.stack);
  } else {
    console.error('An error occurred. Please try again.');
    // Send to error tracking service
  }
}
\`\`\`

### Code Review Checklist
\`\`\`markdown
## Pull Request Checklist

### Type Safety
- [ ] No \`any\` types added (or documented why necessary)
- [ ] Null/undefined handled properly
- [ ] API response types defined
- [ ] Function parameters and returns typed

### Code Quality
- [ ] Lint passes with no warnings
- [ ] No commented-out code
- [ ] No console.log statements (except intentional logging)
- [ ] Functions under 50 lines
- [ ] Descriptive variable names

### Testing
- [ ] New code has tests
- [ ] All tests pass
- [ ] Edge cases covered
- [ ] Error scenarios tested

### Performance
- [ ] No unnecessary re-renders
- [ ] Large lists use virtualization
- [ ] Images optimized
- [ ] No N+1 query problems

### Security
- [ ] User input validated
- [ ] No sensitive data in logs
- [ ] API calls use authentication
- [ ] XSS prevention in place
\`\`\`

### Package.json Scripts
\`\`\`json
{
  "scripts": {
    // Development
    "dev": "next dev",
    "debug": "NODE_OPTIONS='--inspect' next dev",

    // Type checking
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",

    // Linting and formatting
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx}",

    // Testing
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",

    // Building
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",

    // Pre-commit hook (runs before every commit)
    "precommit": "npm run typecheck && npm run lint && npm run test",

    // CI/CD
    "ci": "npm run typecheck && npm run lint && npm run test && npm run build"
  }
}
\`\`\`

### Editor Setup (VS Code)
\`\`\`json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always"
}

// .vscode/extensions.json - Recommended extensions
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
\`\`\`

### Debugging Tips for Common Issues
\`\`\`typescript
// Issue: "Cannot find module" or path issues
// Debug: Check tsconfig.json paths and baseUrl
console.log('Current file:', __filename);
console.log('Import resolved to:', require.resolve('./module'));

// Issue: "Object is possibly undefined"
// Debug: Check what TypeScript thinks the type is
function processUser(user: User | undefined) {
  // Hover over 'user' to see the type
  console.log('User type:', user);

  if (user) {
    // Inside this block, TypeScript knows user is User
    console.log('User exists:', user.name);
  }
}

// Issue: React component not updating
// Debug: Check if state is being set correctly
const [items, setItems] = useState<string[]>([]);

function addItem(item: string) {
  console.log('Before:', items);

  // WRONG: Mutating existing array
  // items.push(item);
  // setItems(items);

  // RIGHT: Creating new array
  setItems([...items, item]);

  console.log('After (might not show new value due to async):', items);
}

// Issue: API call not working
// Debug: Check request and response
async function debugFetch(url: string) {
  console.log('Fetching:', url);

  const response = await fetch(url);
  console.log('Status:', response.status);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));

  const data = await response.json();
  console.log('Data:', data);

  return data;
}
\`\`\`

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
    },
    {
      id: 4,
      title: 'Exercise 4: Debug a Calculation',
      description: `Use console.log to trace through a calculation and find out what's happening at each step.

**Your task:**
1. Start with price = 100
2. Apply 20% discount (multiply by 0.8)
3. Add 8% tax (multiply by 1.08)
4. Print each step: "Price:", "After discount:", "After tax:"

**Debugging tip:** Print intermediate values to understand the calculation flow!`,
      starterCode: `// Start with price = 100
let price = 100;
console.log("Price: " + price);

// Apply 20% discount (multiply by 0.8)


// Add 8% tax (multiply by 1.08)

`,
      solution: `let price = 100;
console.log("Price: " + price);

price = price * 0.8;
console.log("After discount: " + price);

price = price * 1.08;
console.log("After tax: " + price);`,
      expectedOutput: ['Price: 100', 'After discount: 80', 'After tax: 86.4'],
      hints: [
        '20% off means you pay 80%, so multiply by 0.8',
        'After discount: 100 * 0.8 = 80',
        '8% tax means multiply by 1.08',
        'After tax: 80 * 1.08 = 86.4'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the difference between compile time and runtime?',
      options: [
        'Compile time is faster than runtime',
        'Compile time is when code is checked; runtime is when code executes',
        'Compile time is in the browser; runtime is on the server',
        'There is no difference - they mean the same thing'
      ],
      correctIndex: 1,
      explanation: 'Compile time is when TypeScript checks your code for errors. Runtime is when the JavaScript actually executes in the browser or Node.js.'
    },
    {
      question: 'What happens to TypeScript type annotations when the code is transpiled?',
      options: [
        'They are converted to runtime type checks',
        'They are removed completely',
        'They become JavaScript comments',
        'They stay in the code but are ignored'
      ],
      correctIndex: 1,
      explanation: 'Type annotations are completely removed during transpilation. Types only exist at compile time to catch errors - they don\'t exist at runtime.'
    },
    {
      question: 'Why is using "any" type considered dangerous?',
      options: [
        'It makes the code run slower',
        'It uses more memory',
        'It bypasses TypeScript\'s type checking, hiding errors until runtime',
        'It is not valid TypeScript syntax'
      ],
      correctIndex: 2,
      explanation: 'The "any" type disables TypeScript\'s type checking for that value. Errors that TypeScript would normally catch at compile time slip through and crash at runtime.'
    },
    {
      question: 'What does a linter like ESLint do?',
      options: [
        'Compiles TypeScript to JavaScript',
        'Checks code for style issues, bugs, and best practices',
        'Runs the code and shows output',
        'Converts code to run in older browsers'
      ],
      correctIndex: 1,
      explanation: 'A linter analyzes your code for potential problems, style violations, and best practice issues. Unlike TypeScript errors, lint warnings don\'t stop compilation.'
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
