import { Lesson } from '@/types/lesson';

export const typeGuards: Lesson = {
  slug: 'type-guards',
  title: 'Type Guards & Narrowing',
  description: 'Master techniques for narrowing types and writing type-safe conditional logic.',
  difficulty: 'intermediate',
  order: 14,
  content: `
# Type Guards & Narrowing

When a variable could be multiple types, TypeScript needs help knowing which type you're working with. Type guards narrow the type within a code block.

## The Problem

\`\`\`typescript
function process(value: string | number) {
  // TypeScript doesn't know if value is string or number
  // value.toUpperCase() - Error! number doesn't have toUpperCase
}
\`\`\`

## typeof Guard

The most common type guard:

\`\`\`typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // Here, value is narrowed to string
    console.log(value.toUpperCase());
  } else {
    // Here, value is narrowed to number
    console.log(value.toFixed(2));
  }
}
\`\`\`

## typeof for Primitives

Works for: "string", "number", "boolean", "undefined", "object", "function"

\`\`\`typescript
function describe(value: unknown) {
  if (typeof value === "string") {
    return "String: " + value;
  }
  if (typeof value === "number") {
    return "Number: " + value;
  }
  return "Other type";
}
\`\`\`

## instanceof Guard

Check if an object is an instance of a class:

\`\`\`typescript
class Dog {
  bark() { return "Woof!"; }
}

class Cat {
  meow() { return "Meow!"; }
}

function speak(pet: Dog | Cat) {
  if (pet instanceof Dog) {
    console.log(pet.bark());  // TypeScript knows it's Dog
  } else {
    console.log(pet.meow());  // TypeScript knows it's Cat
  }
}
\`\`\`

## in Operator Guard

Check if a property exists:

\`\`\`typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();  // TypeScript knows it's Fish
  } else {
    animal.fly();   // TypeScript knows it's Bird
  }
}
\`\`\`

## Truthiness Narrowing

Check for null/undefined:

\`\`\`typescript
function greet(name: string | null) {
  if (name) {
    console.log("Hello, " + name);  // name is string
  } else {
    console.log("Hello, stranger");  // name is null
  }
}
\`\`\`

## Equality Narrowing

Direct comparison narrows types:

\`\`\`typescript
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // x and y must both be string (the only common type)
    console.log(x.toUpperCase());
  }
}
\`\`\`

## Discriminated Unions

Use a common property to distinguish types:

\`\`\`typescript
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; size: number };
type Shape = Circle | Square;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
  }
}
\`\`\`

## Custom Type Guards

Create reusable type guard functions:

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase());  // TypeScript knows it's string
  }
}
\`\`\`

The \`value is string\` return type is a **type predicate**.

## Non-null Assertion

When you know a value isn't null (use carefully):

\`\`\`typescript
function process(value: string | null) {
  // The ! tells TypeScript "trust me, this isn't null"
  console.log(value!.toUpperCase());
}
\`\`\`

**Warning:** Only use when you're absolutely certain!

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use typeof for primitive type guards
- Use instanceof for class type guards
- Use the "in" operator to check for properties
- Create discriminated unions with kind properties
- Write custom type guard functions
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: typeof Guard',
      description: `Use \`typeof\` to narrow a union type and handle each case differently.

**Your task:**
1. Create a function \`formatValue\` that takes \`string | number\` and returns \`string\`
2. Use \`typeof\` to check if the value is a string
3. If string, return it uppercase; if number, return it with 2 decimal places
4. Test with both "hello" and 42.5`,
      starterCode: `// Step 1: Create the function


// Step 2: Check the type with typeof


// Step 3: Handle each case


// Step 4: Test with both types
`,
      solution: `function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

console.log(formatValue("hello"));
console.log(formatValue(42.5));`,
      expectedOutput: ['HELLO', '42.50'],
      hints: [
        'typeof value === "string" narrows to string type',
        'In else block, TypeScript knows it must be number',
        '.toFixed(2) formats numbers with 2 decimals'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Truthiness Guard',
      description: `Use truthiness checking to handle \`null\` values safely.

**Your task:**
1. Create a function \`greetUser\` that takes \`string | null\` and returns nothing
2. Use an if statement to check if the name is truthy
3. If name exists, log "Hello, [name]!"; otherwise log "Hello, guest!"
4. Test with "Alice" and null`,
      starterCode: `// Step 1: Create the function


// Step 2: Check if name is truthy


// Step 3: Handle each case


// Step 4: Test with both values
`,
      solution: `function greetUser(name: string | null): void {
  if (name) {
    console.log("Hello, " + name + "!");
  } else {
    console.log("Hello, guest!");
  }
}

greetUser("Alice");
greetUser(null);`,
      expectedOutput: ['Hello, Alice!', 'Hello, guest!'],
      hints: [
        'if (name) is true when name is not null/empty',
        'Inside if block, TypeScript narrows to string',
        'Concatenate: "Hello, " + name + "!"'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: in Operator Guard',
      description: `Use the \`in\` operator to check which properties exist on a union type.

**Your task:**
1. Define types Car (with drive method) and Boat (with sail method)
2. Create one object of each type that returns "Driving..." or "Sailing..."
3. Write a function \`operate\` that uses "in" to check which method exists
4. Test with both vehicle types`,
      starterCode: `// Step 1: Define the types


// Step 2: Create objects


// Step 3: Write the operate function


// Step 4: Test with both
`,
      solution: `type Car = { drive: () => string };
type Boat = { sail: () => string };

let car: Car = { drive: () => "Driving..." };
let boat: Boat = { sail: () => "Sailing..." };

function operate(vehicle: Car | Boat): void {
  if ("drive" in vehicle) {
    console.log(vehicle.drive());
  } else {
    console.log(vehicle.sail());
  }
}

operate(car);
operate(boat);`,
      expectedOutput: ['Driving...', 'Sailing...'],
      hints: [
        '"drive" in vehicle checks if property exists',
        'This narrows the type to Car in the if block',
        'In else, TypeScript knows it must be Boat'
      ]
    }
  ],
  buildNote: {
    title: 'Type Guards in the App',
    explanation: `Type guards are used throughout this app. In \`src/components/OutputPanel.tsx\`, we check \`if (result?.success)\` to narrow the type before accessing result properties. The error handling uses \`if (error instanceof Error)\` to safely access error.message. In the lesson page, we check \`if (!lesson)\` to handle the not-found case before rendering lesson content. The \`gradeOutput\` function uses truthiness checks on array indices. These patterns make the code robust against null/undefined errors.`,
    relatedFiles: [
      'src/components/OutputPanel.tsx',
      'src/app/lessons/[slug]/page.tsx',
      'src/components/Quiz.tsx'
    ],
    inTheRealWorld: `Type guards are essential for working with API responses, user input, and any external data. Libraries like Zod use type guards to validate and narrow types at runtime. Redux Toolkit uses discriminated unions for actions. The pattern of checking \`if ("error" in response)\` vs \`if ("data" in response)\` is standard for handling API results. Custom type guards with type predicates are used in utility libraries to create reusable validation functions.`
  }
};
