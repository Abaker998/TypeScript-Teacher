import { Lesson } from '@/types/lesson';

export const utilityTypes: Lesson = {
  slug: 'utility-types',
  title: 'Utility Types',
  description: 'Master TypeScript built-in utility types: Partial, Required, Pick, Omit, and more.',
  difficulty: 'advanced',
  order: 21,
  content: `
# Utility Types

TypeScript provides built-in utility types that transform existing types. These save you from writing repetitive type definitions.

## Partial<T>

Makes all properties optional:

\`\`\`typescript
type User = {
  name: string;
  email: string;
  age: number;
};

type PartialUser = Partial<User>;
// Equivalent to:
// { name?: string; email?: string; age?: number }

function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}
\`\`\`

## Required<T>

Makes all properties required (opposite of Partial):

\`\`\`typescript
type Config = {
  host?: string;
  port?: number;
};

type RequiredConfig = Required<Config>;
// { host: string; port: number }
\`\`\`

## Readonly<T>

Makes all properties read-only:

\`\`\`typescript
type User = {
  name: string;
  age: number;
};

type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = { name: "Alice", age: 30 };
// user.name = "Bob";  // Error! Cannot assign to read-only property
\`\`\`

## Pick<T, K>

Select specific properties:

\`\`\`typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }
\`\`\`

## Omit<T, K>

Remove specific properties:

\`\`\`typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

type SafeUser = Omit<User, "password">;
// { id: number; name: string; email: string }
\`\`\`

## Record<K, V>

Create an object type with specific keys and value type:

\`\`\`typescript
type Fruit = "apple" | "banana" | "orange";
type Inventory = Record<Fruit, number>;

const stock: Inventory = {
  apple: 10,
  banana: 5,
  orange: 8
};
\`\`\`

## Exclude<T, U>

Remove types from a union:

\`\`\`typescript
type Status = "pending" | "approved" | "rejected" | "cancelled";
type ActiveStatus = Exclude<Status, "cancelled">;
// "pending" | "approved" | "rejected"
\`\`\`

## Extract<T, U>

Keep only matching types from a union:

\`\`\`typescript
type Status = "pending" | "approved" | "rejected" | 1 | 2;
type StringStatus = Extract<Status, string>;
// "pending" | "approved" | "rejected"
\`\`\`

## NonNullable<T>

Remove null and undefined:

\`\`\`typescript
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string
\`\`\`

## ReturnType<T>

Get the return type of a function:

\`\`\`typescript
function createUser() {
  return { id: 1, name: "Alice" };
}

type User = ReturnType<typeof createUser>;
// { id: number; name: string }
\`\`\`

## Parameters<T>

Get parameter types as a tuple:

\`\`\`typescript
function greet(name: string, age: number): void {}

type GreetParams = Parameters<typeof greet>;
// [string, number]
\`\`\`

## Combining Utility Types

Chain them for complex transformations:

\`\`\`typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

// Partial user without password
type UserUpdate = Partial<Omit<User, "id" | "password">>;
// { name?: string; email?: string }
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use Partial, Required, and Readonly for property modifiers
- Use Pick and Omit to select/exclude properties
- Use Record for object type creation
- Use Exclude, Extract, and NonNullable for union manipulation
- Combine utility types for complex type transformations
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Partial for Updates',
      description: `Partial<T> makes all properties optional - perfect for update operations where you only change some fields.

**Your task:**
1. Define a Product type with name (string), price (number), and inStock (boolean)
2. Create an UpdateProduct type using Partial<Product>
3. Create an update object with only price set to 29.99
4. Log the price value`,
      starterCode: `// Step 1: Define the Product type


// Step 2: Create UpdateProduct using Partial


// Step 3: Create an update with just the price


// Step 4: Log the price
`,
      solution: `type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

type UpdateProduct = Partial<Product>;

let update: UpdateProduct = { price: 29.99 };

console.log(update.price);`,
      expectedOutput: ['29.99'],
      hints: [
        'Partial<T> makes all properties optional',
        'UpdateProduct only needs the fields you want to change',
        'Log with console.log(update.price)'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Pick for Safety',
      description: `Pick<T, K> creates a type with only the specified properties - useful for hiding sensitive data.

**Your task:**
1. Define a User type with id (number), name (string), email (string), and password (string)
2. Create a SafeUser type using Pick to select only id, name, and email
3. Create a safeUser object with those three properties
4. Log the user's name`,
      starterCode: `// Step 1: Define the full User type


// Step 2: Pick only safe fields (exclude password)


// Step 3: Create a safe user object


// Step 4: Log the name
`,
      solution: `type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

type SafeUser = Pick<User, "id" | "name" | "email">;

let safeUser: SafeUser = {
  id: 1,
  name: "Alice",
  email: "alice@test.com"
};

console.log(safeUser.name);`,
      expectedOutput: ['Alice'],
      hints: [
        'Pick<T, K> selects only the keys in K',
        'Combine keys with |: "id" | "name" | "email"',
        'SafeUser cannot have a password property'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Record for Mapping',
      description: `Record<K, V> creates an object type where all keys of type K map to values of type V.

**Your task:**
1. Define a Day type as a union of weekday strings
2. Create a Schedule type using Record<Day, boolean>
3. Create a schedule object marking all days as true (work days)
4. Log Monday's value`,
      starterCode: `// Step 1: Define the Day union type


// Step 2: Create Schedule using Record


// Step 3: Create schedule with all days set to true


// Step 4: Log Monday's value
`,
      solution: `type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type Schedule = Record<Day, boolean>;

let schedule: Schedule = {
  Monday: true,
  Tuesday: true,
  Wednesday: true,
  Thursday: true,
  Friday: true
};

console.log(schedule.Monday);`,
      expectedOutput: ['true'],
      hints: [
        'Record<K, V> requires all keys from K',
        'Every Day must have a boolean value',
        'Access with schedule.Monday'
      ]
    }
  ],
  buildNote: {
    title: 'Utility Types in the App',
    explanation: `Utility types appear throughout this app. The progress hook could use \`Partial<LessonProgress>\` for updates. The lesson data uses \`Record<string, LessonProgress>\` for the progress state. When passing props to components, \`Pick<Lesson, "title" | "slug">\` could create focused prop types. The \`Omit\` type is useful when you want "everything except these fields" - like creating a type for new records that don't have an ID yet. These utilities reduce boilerplate and make type relationships clear.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/hooks/useProgress.ts',
      'src/lessons/index.ts'
    ],
    inTheRealWorld: `Utility types are essential in production TypeScript. API libraries use \`Partial<T>\` for PATCH requests. ORMs use \`Omit<Entity, "id">\` for create operations. React component libraries use \`Pick\` to create focused prop types. The Redux Toolkit uses \`ReturnType\` extensively for type inference. Libraries like react-hook-form and Zod leverage these utilities for type transformations. Understanding utility types is key to reading and writing advanced TypeScript.`
  }
};
