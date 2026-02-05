import { Lesson } from '@/types/lesson';

export const variablesAndTypes: Lesson = {
  slug: 'variables-and-types',
  title: 'Variables & Types',
  description: 'Learn to declare variables with explicit type annotations using string, number, and boolean.',
  difficulty: 'beginner',
  order: 1,
  content: `
# Variables & Types

TypeScript adds type annotations to JavaScript variables, allowing you to specify what type of data a variable should hold. This prevents bugs by catching type mismatches at compile time rather than at runtime.

## The Three Basic Types

In TypeScript, the three most common primitive types are:

- **string** — text data like names, messages, or URLs
- **number** — integers and floating-point numbers (5, 3.14, -10)
- **boolean** — true or false values

Type annotations are written with a colon after the variable name:

\`\`\`typescript
let message: string = "Hello, TypeScript!";
let count: number = 42;
let isActive: boolean = true;
\`\`\`

## More String Examples

Strings can use single quotes, double quotes, or backticks (template literals):

**What this example does:** Shows the three ways to create strings and useful string operations.

**When you'd use this:** Whenever you work with text - user names, messages, URLs, form inputs, or any textual data.

\`\`\`typescript
// BASIC STRING CREATION
// Use single or double quotes for simple text
let single: string = 'Hello';
let double: string = "World";

// TEMPLATE LITERALS (backticks)
// Use when you need to insert variables into text
// The \${} syntax lets you embed expressions
let template: string = \`Hello, \${double}!\`;  // Result: "Hello, World!"

// MULTI-LINE STRINGS
// Template literals preserve line breaks - great for HTML or long messages
let multiline: string = \`
  This is line 1
  This is line 2
\`;

// USEFUL STRING METHODS
// .toUpperCase() converts all letters to capitals
let upper: string = "hello".toUpperCase();  // Result: "HELLO"

// .length gives you the number of characters
let length: number = "hello".length;        // Result: 5
\`\`\`

**Real-world example:** Building a welcome message for a user:
\`\`\`typescript
let userName: string = "Sarah";
let welcomeMessage: string = \`Welcome back, \${userName}! You have 3 new notifications.\`;
// Result: "Welcome back, Sarah! You have 3 new notifications."
\`\`\`

## More Number Examples

Numbers in TypeScript include integers, decimals, and special values:

**What this example does:** Demonstrates different number formats and common math operations you'll use constantly.

**When you'd use this:** Prices, quantities, scores, measurements, calculations, coordinates, percentages - basically any math.

\`\`\`typescript
// DIFFERENT NUMBER FORMATS
let integer: number = 42;           // Whole numbers (counts, IDs, ages)
let decimal: number = 3.14159;      // Decimals (prices, measurements)
let negative: number = -100;        // Negative numbers (debts, temperature)
let scientific: number = 1.5e6;     // Scientific notation = 1,500,000

// BASIC MATH OPERATIONS
// These work just like a calculator
let sum: number = 10 + 5;           // Addition: 15
let product: number = 10 * 5;       // Multiplication: 50
let quotient: number = 10 / 3;      // Division: 3.333...
let remainder: number = 10 % 3;     // Modulo (remainder): 1
let power: number = 2 ** 3;         // Exponent (2³): 8

// MATH FUNCTIONS
// Math.round() - rounds to nearest whole number
let rounded: number = Math.round(3.7);   // Result: 4

// Math.floor() - always rounds DOWN
let floored: number = Math.floor(3.7);   // Result: 3

// Math.random() - generates random decimal between 0 and 1
let random: number = Math.random();      // Result: 0.123... (different each time)
\`\`\`

**Real-world example:** Calculating a shopping cart total:
\`\`\`typescript
let itemPrice: number = 29.99;
let quantity: number = 3;
let subtotal: number = itemPrice * quantity;  // 89.97
let taxRate: number = 0.08;                   // 8% tax
let tax: number = subtotal * taxRate;         // 7.20
let total: number = subtotal + tax;           // 97.17
console.log(Math.round(total * 100) / 100);   // Rounds to 2 decimals: 97.17
\`\`\`

## More Boolean Examples

Booleans represent true/false values and are essential for logic:

**What this example does:** Shows how to create true/false values and combine them for decision-making.

**When you'd use this:** Login status, permissions, form validation, feature toggles, any yes/no decision in your app.

\`\`\`typescript
// BASIC BOOLEAN VALUES
// Use for tracking states that are either ON or OFF
let isLoggedIn: boolean = true;     // Is the user signed in?
let hasPermission: boolean = false; // Can they access this feature?

// COMPARISON OPERATORS
// These compare values and return true or false
let isEqual: boolean = 5 === 5;      // "Is 5 equal to 5?" → true
let isGreater: boolean = 10 > 5;     // "Is 10 greater than 5?" → true
let isLess: boolean = 3 < 1;         // "Is 3 less than 1?" → false

// LOGICAL OPERATORS
// Combine multiple conditions together

// AND (&&) - BOTH must be true
let both: boolean = true && false;   // Result: false (one is false)

// OR (||) - AT LEAST ONE must be true
let either: boolean = true || false; // Result: true (one is true)

// NOT (!) - Flips true to false, false to true
let opposite: boolean = !true;       // Result: false

// COMMON REAL PATTERNS
let age: number = 21;
let isCitizen: boolean = true;
let isAdult: boolean = age >= 18;              // true (21 >= 18)
let canVote: boolean = isAdult && isCitizen;   // true (both are true)
\`\`\`

**Real-world example:** Checking if a user can access premium content:
\`\`\`typescript
let isLoggedIn: boolean = true;
let hasPaidSubscription: boolean = true;
let accountIsActive: boolean = true;

// User needs ALL THREE to access premium content
let canAccessPremium: boolean = isLoggedIn && hasPaidSubscription && accountIsActive;
console.log(canAccessPremium);  // true - they have full access!
\`\`\`

## Printing Output with console.log()

**What this does:** \`console.log()\` displays values in the output panel so you can see what's happening in your code.

**When you'd use this:** Debugging, checking if your code works, displaying results, understanding what values your variables hold.

\`\`\`typescript
// BASIC PRINTING
// Put any value inside the parentheses to display it
let name: string = "Alice";
console.log(name);  // Output: Alice

let age: number = 25;
console.log(age);   // Output: 25

let isStudent: boolean = true;
console.log(isStudent);  // Output: true
\`\`\`

**Adding labels makes debugging easier:**

\`\`\`typescript
// LABELED OUTPUT
// Add a string before your variable to know what you're looking at
let score: number = 95;
console.log("Your score is:", score);  // Output: Your score is: 95

// MULTIPLE VALUES
// Separate values with commas to print them on one line
let x: number = 10;
let y: number = 20;
console.log("x:", x, "y:", y);  // Output: x: 10 y: 20

// DEBUGGING TIP: Label everything!
let total: number = 150;
let discount: number = 25;
let finalPrice: number = total - discount;
console.log("Total:", total, "Discount:", discount, "Final:", finalPrice);
// Output: Total: 150 Discount: 25 Final: 125
\`\`\`

**Important:** In the exercises below, you'll need to use \`console.log()\` to display your variables. The system checks your output to verify your solution is correct.

## Let vs Const

**What's the difference?** \`let\` creates variables you can change later. \`const\` creates variables that stay the same forever.

**When to use which:**
- Use **const** for values that should NEVER change (settings, configuration, fixed values)
- Use **let** for values that WILL change (scores, counters, user input)

### Using let (changeable values)

\`\`\`typescript
// EXAMPLE: A game score that increases as you play
let points: number = 10;
console.log(points);  // Output: 10

points = 20;  // ✓ OK — we can update it!
console.log(points);  // Output: 20

points = points + 5;  // ✓ Add 5 more points
console.log(points);  // Output: 25

// EXAMPLE: A user's name that might change
let userName: string = "Alice";
userName = "Bob";  // ✓ User changed their display name
\`\`\`

### Using const (fixed values)

\`\`\`typescript
// EXAMPLE: Values that should NEVER change
const PI: number = 3.14159;        // Math constant
const APP_NAME: string = "My App"; // App identity
const MAX_USERS: number = 100;     // System limit
const TAX_RATE: number = 0.08;     // Tax percentage

// If you try to change a const, TypeScript stops you:
PI = 3.14;  // ✗ Error! const cannot be reassigned
\`\`\`

**Rule of thumb:** Start with \`const\`. Only change to \`let\` if you realize you need to update the value later. This prevents accidental changes to important values.

## Common Mistakes to Avoid

Here are frequent errors beginners make:

\`\`\`typescript
// WRONG: Forgetting the type annotation
let name = "Alice";  // Works but type is inferred

// WRONG: Using the wrong type
let age: string = 25;  // Error! 25 is a number

// WRONG: Misspelling the type
let count: Number = 5;  // Use lowercase 'number'

// WRONG: Trying to reassign a const
const score: number = 100;
score = 200;  // Error!

// WRONG: Using undefined without checking
let value: string;
console.log(value);  // Error: used before assigned
\`\`\`

## Why Types Matter

Without types, a number might accidentally be treated as a string:

\`\`\`typescript
let total = "100";
let result = total + 50;  // In JavaScript, this gives "10050" — concatenation, not addition!
\`\`\`

With types, TypeScript catches this:

\`\`\`typescript
let total: number = "100";  // Error — can't assign a string to a number variable
\`\`\`

This catches bugs before your code runs, saving you debugging time.

## The Big Picture: Where Variables Fit in Real Apps

In real applications, typed variables are everywhere. Here are examples you'll encounter:

### User Data
\`\`\`typescript
// A user's profile information
const userId: number = 12345;
const username: string = "john_doe";
const email: string = "john@example.com";
const isVerified: boolean = true;
const accountBalance: number = 250.75;
\`\`\`

### Form Inputs
\`\`\`typescript
// Capturing form data from a login page
let emailInput: string = "";        // Empty until user types
let passwordInput: string = "";
let rememberMe: boolean = false;    // Checkbox state
let loginAttempts: number = 0;      // Track failed attempts
\`\`\`

### API Response Data
\`\`\`typescript
// Data received from a weather API
const temperature: number = 72.5;
const humidity: number = 65;
const cityName: string = "New York";
const isRaining: boolean = false;
const windSpeed: number = 12.3;
\`\`\`

### E-commerce
\`\`\`typescript
// Shopping cart calculations
const itemPrice: number = 29.99;
const quantity: number = 3;
const subtotal: number = itemPrice * quantity;  // 89.97
const taxRate: number = 0.08;
const tax: number = subtotal * taxRate;         // 7.20
const total: number = subtotal + tax;           // 97.17

const productName: string = "Wireless Headphones";
const inStock: boolean = true;
const sku: string = "WH-2024-BLK";
\`\`\`

### Game Development
\`\`\`typescript
// Player stats in a game
let playerName: string = "Hero123";
let health: number = 100;
let maxHealth: number = 100;
let level: number = 1;
let experience: number = 0;
let isAlive: boolean = true;
let hasShield: boolean = false;

// When player takes damage
health = health - 25;  // health is now 75
if (health <= 0) {
  isAlive = false;
}
\`\`\`

### Configuration Settings
\`\`\`typescript
// App configuration (typically const since they don't change)
const API_URL: string = "https://api.example.com";
const MAX_FILE_SIZE: number = 5242880;  // 5MB in bytes
const DEBUG_MODE: boolean = false;
const APP_VERSION: string = "2.1.0";
const TIMEOUT_SECONDS: number = 30;
\`\`\`

## When You'll Use Each Type

| Type | Common Uses | Examples |
|------|-------------|----------|
| **string** | Names, emails, URLs, IDs, messages, any text | usernames, error messages, API endpoints |
| **number** | Counts, prices, measurements, IDs, calculations | age, price, quantity, coordinates, scores |
| **boolean** | Yes/no states, toggles, conditions, flags | isLoggedIn, hasPermission, isLoading, isValid |

## Quick Reference

| Type | Example Values | Use For |
|------|---------------|---------|
| string | "hello", 'world', \\\`template\\\` | Text, names, messages |
| number | 42, 3.14, -10 | Math, counts, prices |
| boolean | true, false | Flags, conditions |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Declare variables with explicit type annotations
- Use string, number, and boolean types correctly
- Print variable values using console.log()
- Choose between let and const appropriately
- Understand why type safety prevents runtime errors
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Variable Declarations',
      description: `Create three variables with type annotations, then print them using console.log().

**Your task:**
1. Create a string variable called \`greeting\` with the message "Hello, TypeScript!"
2. Create a number constant called \`answer\` with the value 42
3. Create a boolean variable called \`isLearning\` set to true
4. Print all three variables using console.log()

**Syntax reminder:** \`let name: string = "value";\` and \`console.log(name);\``,
      starterCode: `// Create your three variables below:



// Print all three variables:

`,
      solution: `let greeting: string = "Hello, TypeScript!";
const answer: number = 42;
let isLearning: boolean = true;

console.log(greeting);
console.log(answer);
console.log(isLearning);`,
      expectedOutput: [
        'Hello, TypeScript!',
        '42',
        'true'
      ],
      hints: [
        'Variable syntax: let variableName: type = value;',
        'Use const instead of let for answer since it won\'t change',
        'Boolean values are just: true or false (no quotes)',
        'Print each variable with its own console.log() call'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Type Inference vs Explicit Types',
      description: `TypeScript can figure out types automatically (inference), or you can write them explicitly.

**Your task:**
1. Create a number called \`explicitNum\` with value 100 — include the type annotation
2. Create a number called \`inferredNum\` with value 50 — skip the type annotation
3. Create a string called \`message\` with the text "Type inference works!" — include the type
4. Print all three using console.log()

**Note:** Both approaches work! Explicit types are clearer, inferred types are shorter.`,
      starterCode: `// Number WITH explicit type annotation


// Number WITHOUT type annotation (TypeScript infers it)


// String with explicit type


// Print all three:

`,
      solution: `let explicitNum: number = 100;
let inferredNum = 50;
let message: string = "Type inference works!";

console.log(explicitNum);
console.log(inferredNum);
console.log(message);`,
      expectedOutput: [
        '100',
        '50',
        'Type inference works!'
      ],
      hints: [
        'Explicit type: let explicitNum: number = 100;',
        'Inferred (no type): let inferredNum = 50;',
        'String type: let message: string = "your text";',
        'Each variable needs its own console.log() call'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: const vs let - Calculating Tax',
      description: `Practice when to use const (values that never change) vs let (values that get updated).

**Your task:**
1. Create a const called \`taxRate\` set to 0.08 (8% tax rate)
2. Create a let called \`price\` set to 100
3. Calculate the tax: multiply price by taxRate and store in a const called \`tax\`
4. Update price to include the tax (add tax to price)
5. Print the final price

**Expected output:** 108 (which is 100 + 8% tax)`,
      starterCode: `// Create the tax rate constant (0.08)


// Create the price variable (100)


// Calculate the tax amount


// Add tax to price


// Print the final price

`,
      solution: `const taxRate: number = 0.08;
let price: number = 100;
const tax: number = price * taxRate;
price = price + tax;

console.log(price);`,
      expectedOutput: [
        '108'
      ],
      hints: [
        'taxRate uses const because tax rates don\'t change mid-calculation',
        'price uses let because you need to update it',
        'Calculate tax: const tax: number = price * taxRate;',
        'Update price: price = price + tax;'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: User Profile Variables',
      description: `Create a set of variables to represent a user's profile information.

**Your task:**
1. Create a const string called \`username\` with value "player_one"
2. Create a let number called \`score\` with value 0
3. Create a let boolean called \`isOnline\` with value true
4. Update score to 150 (the player earned points!)
5. Print all three variables in order: username, score, isOnline

**Think about:** Why is username a const but score is a let?`,
      starterCode: `// Create username (const - usernames don't change)


// Create score (let - scores change during gameplay)


// Create isOnline status (let - can go offline)


// Update the score to 150


// Print all three variables:



`,
      solution: `const username: string = "player_one";
let score: number = 0;
let isOnline: boolean = true;

score = 150;

console.log(username);
console.log(score);
console.log(isOnline);`,
      expectedOutput: [
        'player_one',
        '150',
        'true'
      ],
      hints: [
        'Username is const because it shouldn\'t change: const username: string = "player_one";',
        'Score uses let because it gets updated: let score: number = 0;',
        'Update score with: score = 150;',
        'Print in order: username first, then score, then isOnline'
      ]
    }
  ],
  quiz: [
    {
      question: 'Which keyword should you use for a value that will never be reassigned?',
      options: ['var', 'let', 'const', 'static'],
      correctIndex: 2,
      explanation: 'const declares a constant that cannot be reassigned. Use it for values that should never change, like configuration values or tax rates.'
    },
    {
      question: 'What is the correct way to declare a number variable with an explicit type?',
      options: [
        'let count = number: 42;',
        'let count: number = 42;',
        'let number count = 42;',
        'number let count = 42;'
      ],
      correctIndex: 1,
      explanation: 'In TypeScript, type annotations come after the variable name with a colon: variableName: type = value;'
    },
    {
      question: 'What happens if you try to assign a string to a variable declared as number?',
      options: [
        'TypeScript converts it automatically',
        'The code runs but with undefined behavior',
        'TypeScript shows a compile-time error',
        'JavaScript throws a runtime error'
      ],
      correctIndex: 2,
      explanation: 'TypeScript catches type mismatches at compile time, before your code runs. This prevents bugs from making it to production.'
    },
    {
      question: 'Which of these is a valid boolean value in TypeScript?',
      options: [
        '"true"',
        '1',
        'True',
        'true'
      ],
      correctIndex: 3,
      explanation: 'Boolean values in TypeScript are lowercase true or false without quotes. "true" is a string, 1 is a number, and True with capital T is not valid.'
    }
  ],
  buildNote: {
    title: 'Variables & Types in the App',
    explanation: `The TypeScript teaching app uses type annotations extensively in the \`Lesson\` interface defined in \`src/types/lesson.ts\`. Each lesson object has a \`slug: string\` field (the URL identifier used in routes), an \`order: number\` field (the position in the curriculum), and a \`difficulty: Difficulty\` type that is a union of three literal strings: "beginner" | "intermediate" | "advanced". The \`BuildNote\` interface itself demonstrates const declarations with specific types. The lessons themselves, defined in files like \`src/lessons/beginner/variables-and-types.ts\`, are declared as \`const\` because they never change once defined — a perfect use of const with explicit type annotations. By marking lessons as const, we communicate intent to other developers and TypeScript ensures the object's shape matches the \`Lesson\` interface at compile time. The \`expectedOutput\` field is typed as \`string[]\` to ensure it's always an array of strings, preventing runtime errors. Throughout the app, every lesson variable is verified against the \`Lesson\` interface, catching typos in field names or wrong data types before the app even loads.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/beginner/variables-and-types.ts',
      'src/lessons/index.ts'
    ],
    inTheRealWorld: `In production TypeScript codebases, type annotations are crucial for maintainability. Large codebases like Visual Studio Code, Angular, and React use TypeScript with strict type checking. For example, React components use const declarations with function types, and state variables are declared with specific types like \`const [count, setCount] = useState<number>(0)\`. Libraries like Lodash and date-fns export functions with precise parameter and return types. This prevents entire classes of bugs that would be caught at compile time, not after deployment.`
  }
};
