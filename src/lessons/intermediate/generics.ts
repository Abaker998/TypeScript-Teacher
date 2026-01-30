import { Lesson } from '@/types/lesson';

export const generics: Lesson = {
  slug: 'generics',
  title: 'Generics',
  description: 'Write flexible, reusable types and functions that work with any data type.',
  difficulty: 'intermediate',
  order: 13,
  content: `
# Generics

Generics let you write functions and types that work with any data type, not just specific ones. They're a way to parameterize types — like function parameters but for types themselves.

## Generic Functions

Suppose you want a function that returns its input unchanged:

\`\`\`typescript
function identity(value: any): any {
  return value;
}
\`\`\`

With \`any\`, you lose type information. A generic function uses a type variable (usually called \`T\`):

\`\`\`typescript
function identity<T>(value: T): T {
  return value;
}

const str = identity<string>("hello");  // str has type string
const num = identity<number>(42);       // num has type number
\`\`\`

TypeScript infers the type, so you don't have to write it:

\`\`\`typescript
const str = identity("hello");  // TypeScript knows it's string
const num = identity(42);       // TypeScript knows it's number
\`\`\`

## Generic Interfaces

Interfaces can be generic too:

\`\`\`typescript
interface Container<T> {
  value: T;
  getValue(): T;
}

const stringContainer: Container<string> = {
  value: "hello",
  getValue() { return this.value; }
};

const numberContainer: Container<number> = {
  value: 42,
  getValue() { return this.value; }
};
\`\`\`

## Common Generic Types

Arrays are generic — \`Array<T>\` or \`T[]\`. Promises are generic — \`Promise<T>\` resolves with a value of type T. React hooks use generics — \`useState<T>\` manages state of any type:

\`\`\`typescript
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>("");

function fetchUser(): Promise<User> {
  return fetch("/api/user").then(r => r.json());
}
\`\`\`

## Record — A Powerful Generic Type

\`Record<K, V>\` creates an object with keys of type K and values of type V:

\`\`\`typescript
type Difficulty = "beginner" | "intermediate" | "advanced";

const lessonCounts: Record<Difficulty, number> = {
  beginner: 3,
  intermediate: 3,
  advanced: 3
};
\`\`\`

If you forget a key or misspell it, TypeScript catches it immediately.

## Multiple Type Parameters

Generics can have multiple type parameters:

\`\`\`typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair("hello", 42);      // [string, number]
const p2 = pair(true, "world");    // [boolean, string]

// Map-like structure
interface KeyValue<K, V> {
  key: K;
  value: V;
}

const item: KeyValue<string, number> = {
  key: "age",
  value: 25
};
\`\`\`

## Generic Constraints

Limit what types can be used with \`extends\`:

\`\`\`typescript
// T must have a length property
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "hi");           // "hello"
longest([1, 2, 3], [1]);          // [1, 2, 3]
longest({ length: 10 }, { length: 5 }); // { length: 10 }

// T must be a key of the object
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
const name = getProperty(user, "name");  // string
const age = getProperty(user, "age");    // number
// getProperty(user, "email");  // Error! "email" not in keyof user
\`\`\`

## Default Type Parameters

Provide defaults like default function parameters:

\`\`\`typescript
interface ApiResponse<T = any> {
  data: T;
  status: number;
}

// Uses default type (any)
const response1: ApiResponse = { data: "hello", status: 200 };

// Specifies type
const response2: ApiResponse<User[]> = {
  data: [{ name: "Alice" }],
  status: 200
};
\`\`\`

## Generic Classes

Classes can be generic too:

\`\`\`typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop());  // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
\`\`\`

## Generic Utility Functions

Common patterns you'll see everywhere:

\`\`\`typescript
// Wrap a value in an array
function toArray<T>(value: T): T[] {
  return [value];
}

// Create an object with default values
function withDefaults<T>(defaults: T, overrides: Partial<T>): T {
  return { ...defaults, ...overrides };
}

// Swap tuple elements
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

// Filter array by type
function filterByType<T>(
  arr: unknown[],
  predicate: (item: unknown) => item is T
): T[] {
  return arr.filter(predicate);
}
\`\`\`

## When to Use Generics

| Situation | Example |
|-----------|---------|
| Function works with multiple types | \`identity<T>(x: T): T\` |
| Container/wrapper types | \`Box<T> { value: T }\` |
| Type depends on input | \`first<T>(arr: T[]): T\` |
| Building reusable utilities | \`map<T, U>(arr: T[], fn): U[]\` |

## Common Mistakes

\`\`\`typescript
// WRONG: Using 'any' instead of generics
function identity(value: any): any {
  return value;  // Loses type information!
}

// WRONG: Unnecessary generics
function add<T extends number>(a: T, b: T): number {
  return a + b;  // Just use 'number' directly
}

// WRONG: Forgetting to use the type parameter
function log<T>(value: T): void {
  console.log(value);  // T is never used for type safety
}

// CORRECT: Generic that preserves type info
function identity<T>(value: T): T {
  return value;  // Returns same type as input
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write generic functions that work with any type
- Define generic interfaces
- Use generic types like Array<T> and Promise<T>
- Create Record types for key-value mappings
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Generic Function',
      description: `Generic functions use type parameters (like \`<T>\`) to work with any type while preserving type information.

**Scenario:** You're building a form validator. Each input field can have multiple validation errors. You need a utility function to get the first (most important) error from any error list - whether it's a list of error messages (strings) or error codes (numbers).

**Your task:**
1. Write a generic function \`first<T>\` that takes an array of type \`T[]\`
2. Return the first element, or \`undefined\` if the array is empty
3. Test with error messages: \`["a", "b", "c"]\`
4. Test with error codes: \`[1, 2, 3]\`
5. Test with an empty array (no errors)`,
      starterCode: `// Step 1: Write a generic function first<T>
// It should work with ANY type of array


// Step 2: Test with error messages (strings)


// Step 3: Test with error codes (numbers)


// Step 4: Test with an empty array


// Step 5: Log all results
`,
      solution: `function first<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[0] : undefined;
}

const firstStr = first(["a", "b", "c"]);
const firstNum = first([1, 2, 3]);
const firstEmpty = first([]);

console.log(firstStr);
console.log(firstNum);
console.log(firstEmpty);`,
      expectedOutput: ['a', '1', 'undefined'],
      hints: [
        'Syntax: function first<T>(items: T[]): T | undefined',
        'Check items.length > 0 before returning items[0]',
        'Return undefined for empty arrays'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Generic Interface',
      description: `Generic interfaces let you create reusable type structures that work with different data types.

**Scenario:** You're building a caching system for an app. Each cached item needs to store a value (which could be any type) and a label describing what's cached. Create a generic \`CacheEntry<T>\` interface.

**Your task:**
1. Define a generic interface \`CacheEntry<T>\` with \`value: T\` and \`label: string\`
2. Create a \`CacheEntry<number>\` to cache a user's age (42) with label "userAge"
3. Create a \`CacheEntry<string>\` to cache a greeting ("hello") with label "welcomeMsg"
4. Log both cached values`,
      starterCode: `// Step 1: Define the generic interface CacheEntry<T>


// Step 2: Create a CacheEntry<number> for cached age


// Step 3: Create a CacheEntry<string> for cached message


// Step 4: Log the cached values
`,
      solution: `interface CacheEntry<T> {
  value: T;
  label: string;
}

const ageCache: CacheEntry<number> = {
  value: 42,
  label: "userAge"
};

const messageCache: CacheEntry<string> = {
  value: "hello",
  label: "welcomeMsg"
};

console.log(ageCache.value);
console.log(messageCache.value);`,
      expectedOutput: ['42', 'hello'],
      hints: [
        'Syntax: interface CacheEntry<T> { value: T; label: string; }',
        'Specify the type when using: CacheEntry<number> or CacheEntry<string>',
        'The value property must match the type parameter'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Generic Constraints',
      description: `Generic constraints use \`extends\` to restrict which types can be used with a generic. This ensures the type has specific properties.

**Your task:**
1. Define an interface \`Lengthable\` with a \`length: number\` property
2. Write a function \`getLength<T extends Lengthable>\` that returns the length
3. Test it with these values:
   - String: \`"hello"\` (length 5)
   - Array: \`[1, 2, 3, 4]\` (length 4)
   - Custom object: \`{ length: 10, name: "custom" }\` (length 10)`,
      starterCode: `// Step 1: Define the constraint interface Lengthable


// Step 2: Write the constrained generic function getLength


// Step 3: Test with string "hello" and log result


// Step 4: Test with array [1, 2, 3, 4] and log result


// Step 5: Test with object { length: 10, name: "custom" } and log result
`,
      solution: `interface Lengthable {
  length: number;
}

function getLength<T extends Lengthable>(item: T): number {
  return item.length;
}

console.log(getLength("hello"));
console.log(getLength([1, 2, 3, 4]));
console.log(getLength({ length: 10, name: "custom" }));`,
      expectedOutput: ['5', '4', '10'],
      hints: [
        'Syntax: <T extends Lengthable> constrains T to have a length property',
        'Strings and arrays both have .length built-in',
        'Any object with { length: number } satisfies the constraint'
      ],
    },
  ],
  buildNote: {
    title: 'Generics in the App',
    explanation: `Generics are pervasive throughout the app's type system, enabling both flexibility and type safety. React's \`useState<RunResult | null>\` is a generic hook that manages execution results — the generic parameter \`RunResult | null\` means the hook is type-safe for exactly this data shape. The null part of the union lets us represent "code hasn't been run yet." The \`Promise<RunResult>\` type returned from a code execution worker is generic over the result shape — it promises to eventually return a RunResult. The \`Record<Difficulty, number>\` type used in \`src/lessons/index.ts\` is a generic utility that creates an object with keys from the Difficulty union and values of type number — a generic that ensures all three difficulties have an associated value. React component types themselves are generic — \`React.FC<Props>\` means "a functional component accepting these specific props." The Monaco Editor Monaco library itself is generic, accepting a language type parameter. Understanding generics is essential because they appear in every modern TypeScript library and framework — they make libraries reusable while maintaining strict type safety for specific use cases.`,
    relatedFiles: [
      'src/app/lessons/[slug]/page.tsx',
      'src/types/lesson.ts',
      'src/lib/code-executor.ts'
    ],
    inTheRealWorld: `Generics are essential in production TypeScript. The entire DOM API is generic — \`Document.getElementById<T>()\` returns \`T | null\`. React's typing relies heavily on generics — \`React.FC<Props>\`, \`useCallback<T>\`, and \`useRef<T>\` all use generics. Database libraries like Prisma and TypeORM use generics for type-safe queries returning \`Promise<User[]>\`. Testing libraries like Jest use \`expect<T>()\` and generic matchers. Modern async utilities are generic: \`Promise.all<T>(promises: Promise<T>[]): Promise<T[]>\`. Library authors use generics to provide reusable, type-safe APIs that work with user-defined types.`
  }
};
