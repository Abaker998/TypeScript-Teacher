import { Lesson } from '@/types/lesson';

export const typeInference: Lesson = {
  slug: 'type-inference',
  title: 'Type Inference',
  description: 'Understand how TypeScript automatically figures out types without explicit annotations.',
  difficulty: 'beginner',
  order: 2,  // Second lesson in curriculum
  content: `
# Type Inference

TypeScript is smart. It can often figure out types on its own without you explicitly writing them. This is called **type inference**.

## What is Type Inference?

When you assign a value to a variable, TypeScript looks at the value and automatically determines the type:

\`\`\`typescript
let message = "Hello";  // TypeScript infers: string
let count = 42;         // TypeScript infers: number
let isActive = true;    // TypeScript infers: boolean
\`\`\`

You didn't write \`: string\`, \`: number\`, or \`: boolean\`, but TypeScript figured it out from the values.

## Why Does This Matter?

Type inference gives you the best of both worlds:
- **Less typing** — you don't have to annotate everything
- **Full type safety** — TypeScript still catches errors

\`\`\`typescript
let score = 100;
score = "high";  // Error! Type 'string' is not assignable to type 'number'
\`\`\`

Even though you never wrote \`: number\`, TypeScript knows \`score\` is a number and won't let you assign a string.

## When to Use Explicit Types vs Inference

**Let TypeScript infer** when the type is obvious from the value:

\`\`\`typescript
let name = "Alice";           // Obviously a string
let items = [1, 2, 3];        // Obviously number[]
let isValid = false;          // Obviously boolean
\`\`\`

**Use explicit types** when:
- The type isn't clear from context
- You want to be extra clear for documentation
- You're declaring without initializing

\`\`\`typescript
let data: string;             // Will be assigned later
let userId: number | null;    // Complex type
\`\`\`

## Inference with Arrays

TypeScript infers array types from their contents:

\`\`\`typescript
let numbers = [1, 2, 3];           // number[]
let words = ["a", "b", "c"];       // string[]
let mixed = [1, "two", 3];         // (string | number)[]
\`\`\`

## Inference with Objects

TypeScript infers the shape of objects:

\`\`\`typescript
let user = {
  name: "Alice",
  age: 30
};
// TypeScript infers: { name: string; age: number }

user.name = "Bob";     // OK
user.age = "thirty";   // Error! Type 'string' is not assignable to type 'number'
user.email = "a@b.c";  // Error! Property 'email' does not exist
\`\`\`

## Inference with Functions

TypeScript infers return types from what you return:

\`\`\`typescript
function add(a: number, b: number) {
  return a + b;  // Return type inferred as number
}

function greet(name: string) {
  return "Hello, " + name;  // Return type inferred as string
}
\`\`\`

## The \`const\` Difference

With \`let\`, TypeScript infers general types. With \`const\`, it infers **literal types**:

\`\`\`typescript
let status = "pending";    // Type: string
const STATUS = "pending";  // Type: "pending" (literal)

let count = 5;             // Type: number
const COUNT = 5;           // Type: 5 (literal)
\`\`\`

This matters when you need exact values, like for configuration or state.

## Printing Values with console.log()

Remember: To see your variables' values, use \`console.log()\`:

\`\`\`typescript
let name = "Alice";    // TypeScript infers: string
console.log(name);     // Prints: Alice

let count = 42;        // TypeScript infers: number
console.log(count);    // Prints: 42
\`\`\`

**In the exercises below**, you'll create variables and print them to verify they work correctly.

## Hover to See Inferred Types

In a code editor with TypeScript support, you can hover over any variable to see its inferred type. This is incredibly useful for learning and debugging!

\`\`\`typescript
let message = "Hello";  // Hover shows: let message: string
let count = 42;         // Hover shows: let count: number
let user = {            // Hover shows: let user: { name: string; age: number }
  name: "Alice",
  age: 30
};
\`\`\`

## When Inference Gets It Wrong

Sometimes TypeScript infers a type that's too narrow or too wide:

\`\`\`typescript
// Too narrow - infers empty array as never[]
let items = [];  // Type: never[] - can't add anything!
items.push("hello");  // Error!

// Fix: be explicit when starting empty
let items: string[] = [];  // Now it works!
items.push("hello");  // OK!

// Too wide - loses specific information
let status = "loading";  // Type: string (not "loading")
status = "anything";     // Allowed, but you wanted only specific values

// Fix: use const or explicit literal types
const STATUS = "loading";  // Type: "loading" (literal)
let status: "loading" | "success" | "error" = "loading";
\`\`\`

## Inference with Return Types

TypeScript infers function return types, but explicit types can help:

\`\`\`typescript
// Inferred return type
function getUser() {
  return { name: "Alice", age: 30 };
}
// Inferred: { name: string; age: number }

// Explicit return type catches mistakes
function getUser(): { name: string; age: number } {
  return { name: "Alice" };  // Error! Missing 'age'
}
\`\`\`

## Best Practices Summary

| Situation | Recommendation |
|-----------|---------------|
| Variable with obvious value | Let TypeScript infer |
| Empty array or object | Use explicit type |
| Function parameters | Always explicit |
| Function return type | Explicit for public APIs |
| Complex types | Explicit for clarity |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Understand how TypeScript infers types automatically
- Know when to use explicit types vs letting TypeScript infer
- Recognize how inference works with arrays, objects, and functions
- Understand the difference between \`let\` and \`const\` inference
- Identify when inference might need help
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Observe Inference',
      description: `Let TypeScript figure out the types automatically - no type annotations needed!

**Your task:**
1. Create a variable \`myName\` set to \`"Alex"\` (no \`: string\` needed)
2. Create a variable \`myAge\` set to \`25\` (no \`: number\` needed)
3. Create a variable \`likesCoding\` set to \`true\` (no \`: boolean\` needed)
4. Print all three using console.log()

**Key point:** TypeScript automatically knows the types from the values you assign!`,
      starterCode: `// Create a variable myName set to "Alex" (NO type annotation needed)


// Create a variable myAge set to 25


// Create a variable likesCoding set to true


// Print all three variables

`,
      solution: `let myName = "Alex";
let myAge = 25;
let likesCoding = true;

console.log(myName);
console.log(myAge);
console.log(likesCoding);`,
      expectedOutput: ['Alex', '25', 'true'],
      hints: [
        'No colon or type needed! Just: let myName = "Alex";',
        'TypeScript sees "Alex" and knows it\'s a string automatically',
        'For the number: let myAge = 25; (no quotes around numbers)',
        'Don\'t forget to print with console.log() at the end!'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Array Inference',
      description: `Create arrays and let TypeScript infer their types automatically.

**Your task:**
1. Create an array called \`numbers\` with values [10, 20, 30]
2. Create an array called \`colors\` with values ["red", "green", "blue"]
3. Create a \`mixed\` array with both numbers and strings: [1, "two", 3]
4. Print the first element of each array using [0]

**Key point:** TypeScript infers the array type from what you put in it!`,
      starterCode: `// Create a numbers array with [10, 20, 30]


// Create a colors array with ["red", "green", "blue"]


// Create a mixed array with [1, "two", 3]


// Print the first element of each array (use [0])

`,
      solution: `let numbers = [10, 20, 30];
let colors = ["red", "green", "blue"];
let mixed = [1, "two", 3];

console.log(numbers[0]);
console.log(colors[0]);
console.log(mixed[0]);`,
      expectedOutput: ['10', 'red', '1'],
      hints: [
        'Arrays use square brackets: [value1, value2, value3]',
        'Access the first element with [0]: numbers[0] gives 10',
        'TypeScript sees [10, 20, 30] and infers number[] automatically',
        'Mixed arrays become (string | number)[] - can hold either type'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Object Inference',
      description: `Create an object and let TypeScript infer its structure (called its "shape").

**Your task:**
1. Create a \`book\` object with these properties:
   - title: "TypeScript Handbook"
   - author: "Microsoft"
   - pages: 250
2. Print the book's title
3. Print the book's pages

**Key point:** TypeScript infers the object's shape: { title: string; author: string; pages: number }`,
      starterCode: `// Create a book object with title, author, and pages properties


// Print the book's title using dot notation


// Print the book's pages

`,
      solution: `let book = {
  title: "TypeScript Handbook",
  author: "Microsoft",
  pages: 250
};

console.log(book.title);
console.log(book.pages);`,
      expectedOutput: ['TypeScript Handbook', '250'],
      hints: [
        'Objects use curly braces: { property: value, property2: value2 }',
        'Access properties with a dot: book.title gets the title',
        'TypeScript infers the shape automatically from the values',
        'String values need quotes, numbers don\'t'
      ]
    }
  ],
  buildNote: {
    title: 'Type Inference in the App',
    explanation: `Throughout this app, we rely heavily on type inference to keep code clean. In the lesson data files, when we write \`const lesson = { slug: "...", title: "..." }\`, TypeScript infers the object shape. However, we explicitly type \`const lesson: Lesson = {...}\` to ensure the object matches our interface exactly — this catches typos in property names. In React components, hooks like \`useState\` use inference: \`const [count, setCount] = useState(0)\` automatically types \`count\` as \`number\`. We don't need to write \`useState<number>(0)\` because TypeScript infers it from the initial value. The balance is: let TypeScript infer when it's obvious, but add explicit types at boundaries (function parameters, exported values, complex objects) for clarity and safety.`,
    relatedFiles: [
      'src/lessons/beginner/type-inference.ts',
      'src/hooks/useProgress.ts',
      'src/app/lessons/[slug]/page.tsx'
    ],
    inTheRealWorld: `Professional TypeScript codebases lean heavily on inference. The TypeScript team recommends letting inference work when possible — it reduces noise and makes code more readable. Libraries like React, Vue, and Express are designed to work well with inference. For example, React's \`useState\` hook is generic but rarely needs explicit type arguments because inference handles it. The rule of thumb: if you hover over a variable in your editor and the inferred type is what you want, don't add an annotation.`
  }
};
