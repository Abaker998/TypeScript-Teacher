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

\`\`\`typescript
let single: string = 'Hello';
let double: string = "World";
let template: string = \`Hello, \${double}!\`;  // "Hello, World!"

// Template literals allow multi-line strings
let multiline: string = \`
  This is line 1
  This is line 2
\`;

// String methods work as expected
let upper: string = "hello".toUpperCase();  // "HELLO"
let length: number = "hello".length;        // 5
\`\`\`

## More Number Examples

Numbers in TypeScript include integers, decimals, and special values:

\`\`\`typescript
let integer: number = 42;
let decimal: number = 3.14159;
let negative: number = -100;
let scientific: number = 1.5e6;    // 1,500,000

// Math operations
let sum: number = 10 + 5;          // 15
let product: number = 10 * 5;      // 50
let quotient: number = 10 / 3;     // 3.333...
let remainder: number = 10 % 3;    // 1 (modulo)
let power: number = 2 ** 3;        // 8 (exponent)

// Useful Math functions
let rounded: number = Math.round(3.7);   // 4
let floored: number = Math.floor(3.7);   // 3
let random: number = Math.random();      // 0 to 1
\`\`\`

## More Boolean Examples

Booleans represent true/false values and are essential for logic:

\`\`\`typescript
let isLoggedIn: boolean = true;
let hasPermission: boolean = false;

// Comparison operators return booleans
let isEqual: boolean = 5 === 5;      // true
let isGreater: boolean = 10 > 5;     // true
let isLess: boolean = 3 < 1;         // false

// Logical operators
let both: boolean = true && false;   // false (AND)
let either: boolean = true || false; // true (OR)
let opposite: boolean = !true;       // false (NOT)

// Common patterns
let isAdult: boolean = age >= 18;
let canVote: boolean = isAdult && isCitizen;
\`\`\`

## Printing Output with console.log()

To see the value of a variable, use \`console.log()\`. This prints the value to the output panel:

\`\`\`typescript
let name: string = "Alice";
console.log(name);  // Prints: Alice

let age: number = 25;
console.log(age);   // Prints: 25

let isStudent: boolean = true;
console.log(isStudent);  // Prints: true
\`\`\`

You can also print multiple values or add labels to make output clearer:

\`\`\`typescript
let score: number = 95;
console.log("Your score is:", score);  // Prints: Your score is: 95

// Print multiple values
let x: number = 10;
let y: number = 20;
console.log("x:", x, "y:", y);  // Prints: x: 10 y: 20
\`\`\`

**Important:** In the exercises below, you'll need to use \`console.log()\` to display your variables. The system checks your output to verify your solution is correct.

## Let vs Const

**let** declares a variable that can be reassigned later:

\`\`\`typescript
let points: number = 10;
points = 20;  // OK — we can reassign
console.log(points);  // Prints: 20

let userName: string = "Alice";
userName = "Bob";  // OK — reassignment allowed
\`\`\`

**const** declares a variable that cannot be reassigned after initialization:

\`\`\`typescript
const PI: number = 3.14159;
PI = 3.14;  // Error — const cannot be reassigned

const APP_NAME: string = "My App";
const MAX_USERS: number = 100;
\`\`\`

Use **const** by default for values that shouldn't change. Use **let** when you need to reassign. Avoid **var** — it has confusing scope rules.

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
