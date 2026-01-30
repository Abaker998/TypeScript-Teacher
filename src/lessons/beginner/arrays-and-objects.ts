import { Lesson } from '@/types/lesson';

export const arraysAndObjects: Lesson = {
  slug: 'arrays-and-objects',
  title: 'Arrays & Objects',
  description: 'Learn to create typed arrays and objects with consistent, predictable structures.',
  difficulty: 'beginner',
  order: 4,
  content: `
# Arrays & Objects

Beyond individual variables, TypeScript lets you create collections of data — arrays and objects — and specify what types those collections should hold.

## Typed Arrays

An array is a list of values. TypeScript requires all values in an array to have the same type:

\`\`\`typescript
const names: string[] = ["Alice", "Bob", "Charlie"];
const scores: number[] = [95, 87, 92];
const flags: boolean[] = [true, false, true];
\`\`\`

You can also use the generic syntax \`Array<T>\`:

\`\`\`typescript
const names: Array<string> = ["Alice", "Bob"];
\`\`\`

Both syntaxes mean the same thing. The \`string[]\` syntax is more common.

## Common Array Operations

Arrays come with many useful methods:

\`\`\`typescript
const fruits: string[] = ["apple", "banana", "cherry"];

// Add items
fruits.push("date");           // Add to end
fruits.unshift("apricot");     // Add to beginning

// Remove items
const last = fruits.pop();     // Remove from end
const first = fruits.shift();  // Remove from beginning

// Access items
console.log(fruits[0]);        // First item
console.log(fruits.length);    // Number of items

// Find items
const index = fruits.indexOf("banana");  // Position of item
const hasApple = fruits.includes("apple"); // true or false
\`\`\`

## Array Methods with Callbacks

These powerful methods transform arrays:

\`\`\`typescript
const numbers: number[] = [1, 2, 3, 4, 5];

// map: transform each item
const doubled: number[] = numbers.map((n: number): number => n * 2);
// [2, 4, 6, 8, 10]

// filter: keep items that match
const evens: number[] = numbers.filter((n: number): boolean => n % 2 === 0);
// [2, 4]

// find: get first match
const firstBig: number | undefined = numbers.find((n: number): boolean => n > 3);
// 4

// reduce: combine into single value
const sum: number = numbers.reduce((total: number, n: number): number => total + n, 0);
// 15

// forEach: do something with each item
numbers.forEach((n: number): void => {
  console.log(n);
});
\`\`\`

## Object Shapes

Objects group related data together. You describe an object's structure using inline type annotations:

\`\`\`typescript
const person: { name: string; age: number; active: boolean } = {
  name: "Alice",
  age: 30,
  active: true
};
\`\`\`

Properties are separated by semicolons or commas. You can access properties with dot notation:

\`\`\`typescript
console.log(person.name);   // "Alice"
console.log(person.age);    // 30
\`\`\`

## More Object Examples

\`\`\`typescript
// Object with various property types
const product: {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  tags: string[];
} = {
  id: 1,
  name: "Laptop",
  price: 999.99,
  inStock: true,
  tags: ["electronics", "computers"]
};

// Accessing nested data
console.log(product.tags[0]);  // "electronics"

// Object with optional property (using ?)
const config: {
  host: string;
  port: number;
  ssl?: boolean;  // Optional!
} = {
  host: "localhost",
  port: 3000
  // ssl is optional, can be omitted
};
\`\`\`

## Modifying Objects

\`\`\`typescript
const user: { name: string; score: number } = {
  name: "Alice",
  score: 100
};

// Update a property
user.score = 150;

// Add via bracket notation (if type allows)
user["score"] = 200;

// Spread operator to copy and modify
const updatedUser = { ...user, score: 250 };
\`\`\`

## Arrays of Objects

Combine these concepts to create arrays of objects:

\`\`\`typescript
const users: { name: string; age: number }[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
];

// Access specific user
console.log(users[0].name);  // "Alice"

// Find a user
const bob = users.find((u): boolean => u.name === "Bob");

// Filter users
const adults = users.filter((u): boolean => u.age >= 18);

// Map to extract data
const names: string[] = users.map((u): string => u.name);
// ["Alice", "Bob"]
\`\`\`

This is powerful for structured data. Each object must have the same properties and types.

## Destructuring

Extract values from arrays and objects easily:

\`\`\`typescript
// Array destructuring
const colors: string[] = ["red", "green", "blue"];
const [first, second, third] = colors;
console.log(first);  // "red"

// Object destructuring
const person = { name: "Alice", age: 30 };
const { name, age } = person;
console.log(name);  // "Alice"

// Destructuring in function parameters
function printUser({ name, age }: { name: string; age: number }): void {
  console.log(\`\${name} is \${age} years old\`);
}
\`\`\`

## Type Safety in Collections

Without types, it's easy to add wrong data:

\`\`\`typescript
const numbers = [1, 2, 3];
numbers.push("four");  // In JavaScript, this works but breaks logic!

// With types:
const numbers: number[] = [1, 2, 3];
numbers.push("four");  // TypeScript error!
\`\`\`

## Common Mistakes to Avoid

\`\`\`typescript
// WRONG: Accessing non-existent property
const user = { name: "Alice" };
console.log(user.age);  // Error: 'age' doesn't exist

// WRONG: Pushing wrong type to array
const nums: number[] = [1, 2, 3];
nums.push("4");  // Error: string is not number

// WRONG: Missing required properties
const person: { name: string; age: number } = {
  name: "Alice"
  // Error: missing 'age' property
};

// WRONG: Array index out of bounds (no error, but undefined)
const arr: string[] = ["a", "b"];
console.log(arr[10]);  // undefined (no TypeScript error!)
\`\`\`

## Printing Arrays and Objects

Use \`console.log()\` to see array and object values:

\`\`\`typescript
const colors: string[] = ["red", "green", "blue"];
console.log(colors[0]);  // Prints: red (first element)
console.log(colors);     // Prints: ["red", "green", "blue"]

const user = { name: "Alice", age: 30 };
console.log(user.name);  // Prints: Alice
console.log(user);       // Prints: { name: "Alice", age: 30 }
\`\`\`

## Quick Reference

| Operation | Syntax | Example |
|-----------|--------|---------|
| Array type | \`type[]\` | \`string[]\`, \`number[]\` |
| Object type | \`{ prop: type }\` | \`{ name: string }\` |
| Array of objects | \`{ prop: type }[]\` | \`{ id: number }[]\` |
| Optional prop | \`prop?: type\` | \`{ age?: number }\` |
| Access array | \`arr[index]\` | \`names[0]\` |
| Access object | \`obj.prop\` | \`user.name\` |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Declare arrays with specific element types
- Create objects with typed properties
- Use common array methods (map, filter, find)
- Define arrays of objects
- Use destructuring to extract values
- Ensure consistency in collections
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Typed Arrays and Objects',
      description: `Create a typed array and a typed object.

**Your task:**
1. Create an array of names: \`["Alice", "Bob", "Charlie"]\` with type \`string[]\`
2. Create a user object with these values:
   - name: \`"Alice"\`
   - email: \`"alice@example.com"\`
   - score: \`95\`
3. Print the user's name

**Type annotation syntax:**
- Array: \`const names: string[] = [...]\`
- Object: \`const user: { name: string; email: string; score: number } = { ... }\``,
      starterCode: `// Create a names array with type string[]


// Create a user object with:
// - name: "Alice"
// - email: "alice@example.com"
// - score: 95
// Type: { name: string; email: string; score: number }


// Print the user's name

`,
      solution: `const names: string[] = ["Alice", "Bob", "Charlie"];

const user: { name: string; email: string; score: number } = {
  name: "Alice",
  email: "alice@example.com",
  score: 95
};

console.log(user.name);`,
      expectedOutput: ['Alice'],
      hints: [
        'Array type: const names: string[] = ["Alice", "Bob", "Charlie"];',
        'Object type uses semicolons: { name: string; email: string; score: number }',
        'Object values use commas: { name: "Alice", email: "...", score: 95 }',
        'Access with dot notation: user.name'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Multiple Objects',
      description: `**Scenario:** You're building an e-commerce inventory tracker. Each product has a name, price, and stock status so customers know what's available.

**Your task:**
1. Create \`product1\` with: name "Laptop", price 999.99, inStock true
2. Create \`product2\` with: name "Headphones", price 149.99, inStock false
3. Print each product's name and stock status

**Expected output format:** "ProductName - In stock: true/false"`,
      starterCode: `// You're tracking inventory for an online store
// Create product1: Laptop, 999.99, in stock
// Type: { name: string; price: number; inStock: boolean }


// Create product2: Headphones, 149.99, out of stock


// Print each product's availability: "Name - In stock: true/false"

`,
      solution: `const product1: { name: string; price: number; inStock: boolean } = {
  name: "Laptop",
  price: 999.99,
  inStock: true
};

const product2: { name: string; price: number; inStock: boolean } = {
  name: "Headphones",
  price: 149.99,
  inStock: false
};

console.log(product1.name + " - In stock: " + product1.inStock);
console.log(product2.name + " - In stock: " + product2.inStock);`,
      expectedOutput: ['Laptop - In stock: true', 'Headphones - In stock: false'],
      hints: [
        'Both products have the same type annotation',
        'inStock is a boolean (true or false, no quotes)',
        'Concatenate strings with +: "text" + variable + "more text"',
        'Booleans become "true" or "false" when converted to strings'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Arrays of Objects',
      description: `Create an array containing multiple objects - a very common pattern!

**Scenario:** You're building a gradebook app. Each student has a name and their quiz scores from the semester.

**Your task:**
1. Create a \`students\` array containing two student objects
2. Each student has: name (string) and quizScores (number[]) - their scores on 3 quizzes
3. Print the first student's name
4. Print the first student's first quiz score

**Type for array of objects:** \`{ name: string; quizScores: number[] }[]\``,
      starterCode: `// Create a students array with two student objects
// Each student has: name (string) and quizScores (number[])
// Example: Alice scored 95, 87, 92 on her three quizzes
// Example: Bob scored 78, 85, 90 on his three quizzes
// Type: { name: string; quizScores: number[] }[]


// Print the first student's name (use [0] to access first item)


// Print the first student's first quiz score

`,
      solution: `const students: { name: string; quizScores: number[] }[] = [
  {
    name: "Alice",
    quizScores: [95, 87, 92]
  },
  {
    name: "Bob",
    quizScores: [78, 85, 90]
  }
];

console.log(students[0].name);
console.log(students[0].quizScores[0]);`,
      expectedOutput: ['Alice', '95'],
      hints: [
        'Array of objects type: { property: type }[] - the [] makes it an array',
        'students[0] gets the first object in the array',
        'students[0].name gets the name property of the first student',
        'students[0].quizScores[0] gets the first quiz score of the first student'
      ]
    }
  ],
  buildNote: {
    title: 'Arrays & Objects in the App',
    explanation: `The app's core data structure is an array of \`Lesson\` objects, stored and exported from \`src/lessons/index.ts\`. Each lesson object has a consistent shape with typed properties: \`slug: string\`, \`title: string\`, \`description: string\`, \`difficulty: Difficulty\`, \`order: number\`, \`content: string\` (markdown), \`starterCode: string\`, \`solution: string\`, \`expectedOutput: string[]\` (array of strings), and \`buildNote: BuildNote\` (an object with specific nested properties). The sidebar component uses \`LessonGroup\` objects — objects that contain a \`difficulty\` property and a \`lessons: Lesson[]\` array — to organize lessons by difficulty. When TypeScript compiles the app, it verifies that every lesson object has all required fields with the correct types. If a lesson was accidentally missing a field like \`expectedOutput\` or had the wrong type for \`order\` (e.g., a string instead of a number), TypeScript would catch it at build time, preventing users from encountering runtime errors. The \`getLessonsByDifficulty()\` function demonstrates array filtering and sorting — it filters lessons by difficulty and sorts by the \`order\` field, showing how typed operations on arrays prevent mistakes.`,
    relatedFiles: [
      'src/lessons/index.ts',
      'src/types/lesson.ts',
      'src/components/Sidebar.tsx'
    ],
    inTheRealWorld: `In production codebases, typed arrays and objects are fundamental. A backend API might define types like \`User[]\` for user arrays, or \`{ success: boolean; data: T; error?: string }\` for API responses. React component state often stores arrays of items: \`useState<Todo[]>\`. Database libraries like Prisma auto-generate TypeScript types for tables, ensuring type-safe queries. TypeScript's structural typing means if your data matches the shape, the type-checker is satisfied — this is how frameworks like Next.js validate route parameters and form data.`
  }
};
