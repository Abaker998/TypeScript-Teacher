import { Lesson } from '@/types/lesson';

export const typeAliases: Lesson = {
  slug: 'type-aliases',
  title: 'Type Aliases',
  description: 'Create custom type names to make your code more readable and maintainable.',
  difficulty: 'intermediate',
  order: 10,
  content: `
# Type Aliases

Type aliases let you create custom names for types. This makes complex types readable and reusable.

## Basic Type Aliases

Use the \`type\` keyword to create an alias:

\`\`\`typescript
type UserID = string;
type Age = number;

let id: UserID = "abc123";
let age: Age = 25;
\`\`\`

## Why Use Type Aliases?

1. **Readability**: \`UserID\` is clearer than \`string\`
2. **Maintainability**: Change the type in one place
3. **Documentation**: The name describes the purpose

## Object Type Aliases

Create aliases for object shapes:

\`\`\`typescript
type User = {
  id: string;
  name: string;
  email: string;
};

let user: User = {
  id: "1",
  name: "Alice",
  email: "alice@example.com"
};
\`\`\`

## Union Type Aliases

Name your union types:

\`\`\`typescript
type Status = "pending" | "approved" | "rejected";
type Result = string | number;

let orderStatus: Status = "pending";
let value: Result = 42;
\`\`\`

## Function Type Aliases

Define function signatures:

\`\`\`typescript
type Greeting = (name: string) => string;

const sayHello: Greeting = (name) => {
  return "Hello, " + name;
};
\`\`\`

## Array Type Aliases

Create named array types:

\`\`\`typescript
type StringList = string[];
type NumberPair = [number, number];  // Tuple

let names: StringList = ["Alice", "Bob"];
let point: NumberPair = [10, 20];
\`\`\`

## Combining Type Aliases

Build complex types from simpler ones:

\`\`\`typescript
type Name = string;
type Age = number;

type Person = {
  name: Name;
  age: Age;
};

type Team = Person[];
\`\`\`

## Type Aliases vs Interfaces

Both can define object shapes:

\`\`\`typescript
// Type alias
type UserType = {
  name: string;
};

// Interface
interface UserInterface {
  name: string;
}
\`\`\`

**Key differences:**
- Type aliases can represent unions, primitives, tuples
- Interfaces can be extended and merged
- Use interfaces for objects, type aliases for everything else

## Intersection Types

Combine types with \`&\`:

\`\`\`typescript
type HasName = { name: string };
type HasAge = { age: number };

type Person = HasName & HasAge;

let person: Person = {
  name: "Alice",
  age: 30
};
\`\`\`

## Generic Type Aliases

Create flexible, reusable types:

\`\`\`typescript
type Container<T> = {
  value: T;
};

let stringBox: Container<string> = { value: "hello" };
let numberBox: Container<number> = { value: 42 };
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create type aliases for primitives, objects, and functions
- Use union and intersection types
- Know when to use type aliases vs interfaces
- Build complex types from simpler ones
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Type Alias',
      description: `Type aliases give custom names to types, making code more readable.

**Your task:**
1. Create a type alias called \`Score\` for the \`number\` type
2. Create a variable \`myScore\` of type \`Score\` with value 95
3. Print the score

**Type alias syntax:** \`type AliasName = actualType;\``,
      starterCode: `// Step 1: Create a type alias for number


// Step 2: Create a variable using your type alias


// Step 3: Print the score

`,
      solution: `type Score = number;

let myScore: Score = 95;

console.log(myScore);`,
      expectedOutput: ['95'],
      hints: [
        'type Score = number; creates the alias',
        'Use it like any type: let myScore: Score = 95;',
        'Print with console.log(myScore)'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Object Type Alias',
      description: `Type aliases can define object shapes, similar to interfaces.

**Your task:**
1. Create a \`Product\` type alias with name (string) and price (number)
2. Create a product object matching that type
3. Print the product's name and price

**Object type syntax:**
\`\`\`
type TypeName = {
  property: type;
};
\`\`\``,
      starterCode: `// Step 1: Create the Product type alias


// Step 2: Create a product object


// Step 3: Print name and price

`,
      solution: `type Product = {
  name: string;
  price: number;
};

let product: Product = {
  name: "Laptop",
  price: 999
};

console.log(product.name);
console.log(product.price);`,
      expectedOutput: ['Laptop', '999'],
      hints: [
        'type Product = { name: string; price: number; };',
        'Create object: let product: Product = { ... };',
        'Access with dot notation: product.name'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Union Type Alias',
      description: `Union type aliases restrict values to specific options - great for status values, directions, etc.

**Your task:**
1. Create a \`Direction\` type that only allows "north", "south", "east", or "west"
2. Create a variable \`heading\` of type \`Direction\` with value "north"
3. Print the heading

**Union syntax:** \`type Name = "option1" | "option2" | "option3";\``,
      starterCode: `// Step 1: Create the Direction union type


// Step 2: Create a variable with one of the allowed values


// Step 3: Print the heading

`,
      solution: `type Direction = "north" | "south" | "east" | "west";

let heading: Direction = "north";

console.log(heading);`,
      expectedOutput: ['north'],
      hints: [
        'Use | to separate options: "north" | "south" | ...',
        'Each option is a string literal in quotes',
        'Variable can only hold one of those exact values'
      ]
    }
  ],
  buildNote: {
    title: 'Type Aliases in the App',
    explanation: `The app uses type aliases extensively in \`src/types/lesson.ts\`. The \`Difficulty\` type is a union alias: \`type Difficulty = "beginner" | "intermediate" | "advanced"\`. This ensures only valid difficulty values are used throughout the app. We also use type aliases for function signatures in hooks — for example, the progress hook's update functions have clear type signatures. Object types like \`LessonProgress\` and \`ProgressState\` are defined as type aliases because they're data structures, not extensible contracts.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/hooks/useProgress.ts',
      'src/lessons/index.ts'
    ],
    inTheRealWorld: `Type aliases are ubiquitous in professional TypeScript. API response types, configuration objects, and state shapes are typically defined as type aliases. Libraries export type aliases for their options and return values. The pattern of creating small, focused type aliases and combining them (like \`type FullUser = User & Permissions & Settings\`) is common in large codebases. This keeps types maintainable and makes refactoring easier.`
  }
};
