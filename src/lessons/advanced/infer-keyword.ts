import { Lesson } from '@/types/lesson';

export const inferKeyword: Lesson = {
  slug: 'infer-keyword',
  title: 'The infer Keyword',
  description: 'Extract and infer types within conditional types for powerful type manipulation.',
  difficulty: 'advanced',
  order: 25,
  content: `
# The infer Keyword

The \`infer\` keyword lets you extract types from within other types. It's used inside conditional types to "capture" a type for use.

## Basic Syntax

\`\`\`typescript
type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
\`\`\`

Read this as: "If T is a function, infer its return type as R and return R. Otherwise, return never."

## Extracting Return Types

\`\`\`typescript
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(): string {
  return "Hello";
}

type GreetReturn = GetReturn<typeof greet>;  // string
\`\`\`

## Extracting Parameter Types

\`\`\`typescript
type FirstParam<T> = T extends (first: infer P, ...rest: any[]) => any ? P : never;

function add(a: number, b: number): number {
  return a + b;
}

type FirstArg = FirstParam<typeof add>;  // number
\`\`\`

## Extracting Array Element Type

\`\`\`typescript
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type NumElement = ArrayElement<number[]>;  // number
type StrElement = ArrayElement<string[]>;  // string
\`\`\`

## Extracting Promise Value

\`\`\`typescript
type Awaited<T> = T extends Promise<infer V> ? V : T;

type A = Awaited<Promise<string>>;  // string
type B = Awaited<Promise<number>>;  // number
type C = Awaited<string>;           // string (not a promise)
\`\`\`

## Multiple Infer Positions

You can use infer multiple times:

\`\`\`typescript
type SecondParam<T> = T extends (a: any, b: infer B, ...rest: any[]) => any ? B : never;

function process(id: number, name: string, active: boolean) {}

type Second = SecondParam<typeof process>;  // string
\`\`\`

## Extracting Object Property Types

\`\`\`typescript
type PropertyType<T, K extends keyof T> = T extends { [P in K]: infer V } ? V : never;

type User = { name: string; age: number };

type NameType = PropertyType<User, "name">;  // string
\`\`\`

## Extracting Tuple Types

\`\`\`typescript
type First<T> = T extends [infer F, ...any[]] ? F : never;
type Last<T> = T extends [...any[], infer L] ? L : never;

type Tuple = [string, number, boolean];

type FirstType = First<Tuple>;  // string
type LastType = Last<Tuple>;    // boolean
\`\`\`

## Recursive Infer

Flatten nested types:

\`\`\`typescript
type DeepAwaited<T> = T extends Promise<infer V> ? DeepAwaited<V> : T;

type Deep = Promise<Promise<Promise<string>>>;
type Flat = DeepAwaited<Deep>;  // string
\`\`\`

## Practical Example: Event Handler

\`\`\`typescript
type EventData<T> = T extends (event: infer E) => void ? E : never;

type ClickHandler = (event: { x: number; y: number }) => void;
type KeyHandler = (event: { key: string }) => void;

type ClickEvent = EventData<ClickHandler>;  // { x: number; y: number }
type KeyEvent = EventData<KeyHandler>;      // { key: string }
\`\`\`

## Combining with Unions

\`\`\`typescript
type UnboxArray<T> = T extends (infer E)[] ? E : T;

type Test = UnboxArray<string[] | number[] | boolean>;
// string | number | boolean
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use infer to extract return types from functions
- Extract parameter types at specific positions
- Unbox array and promise types
- Extract tuple element types
- Build recursive type transformations
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Extract Return Type',
      description: `Use \`infer\` to extract the return type from a function type.

**Your task:**
1. Define a type \`GetReturn<T>\` using a conditional type with \`infer R\`
2. Create a simple function \`double\` that takes a number and returns a number
3. Use \`GetReturn<typeof double>\` to extract its return type
4. Create a variable of that type and print it

**Infer syntax:**
\`\`\`
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;
\`\`\`
This reads: "If T is a function, infer its return type as R and return R"`,
      starterCode: `// Step 1: Define the GetReturn type using infer


// Step 2: Create a function that returns a number


// Step 3: Extract the return type using GetReturn


// Step 4: Create a variable of that type and print it

`,
      solution: `type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;

function double(n: number): number {
  return n * 2;
}

type DoubleReturn = GetReturn<typeof double>;

let result: DoubleReturn = 42;

console.log(result);`,
      expectedOutput: ['42'],
      hints: [
        'The conditional T extends (...args: any[]) => infer R checks if T is a function',
        'infer R captures whatever the return type is into R',
        'typeof double gets the function TYPE, not its value',
        'DoubleReturn becomes "number" because double returns a number'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Extract Array Element',
      description: `Use \`infer\` to extract the element type from an array type.

**Your task:**
1. Define a type \`ArrayElement<T>\` that extracts the element type from arrays
2. Use it with \`string[]\` to get the element type
3. Create a variable of that type and print it

**Infer with arrays:**
\`\`\`
type ArrayElement<T> = T extends (infer E)[] ? E : never;
\`\`\`
This reads: "If T is an array of E, return E"`,
      starterCode: `// Step 1: Define the ArrayElement type


// Step 2: Extract element type from string[]


// Step 3: Create a variable of that type and print it

`,
      solution: `type ArrayElement<T> = T extends (infer E)[] ? E : never;

type StringElement = ArrayElement<string[]>;

let element: StringElement = "hello";

console.log(element);`,
      expectedOutput: ['hello'],
      hints: [
        '(infer E)[] means "an array of some type E"',
        'When T is string[], E gets inferred as string',
        'StringElement becomes just "string"',
        'Your variable must be a string value'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Unwrap Promise',
      description: `Use \`infer\` to extract the value type from a Promise.

**Your task:**
1. Define a type \`Unwrap<T>\` that extracts the value from Promise<V>
2. If T is not a Promise, return T unchanged
3. Test with \`Promise<boolean>\` and print a value of the extracted type

**Infer with Promise:**
\`\`\`
type Unwrap<T> = T extends Promise<infer V> ? V : T;
\`\`\`
This reads: "If T is a Promise of V, return V, otherwise return T"`,
      starterCode: `// Step 1: Define the Unwrap type for Promises


// Step 2: Extract the value type from Promise<boolean>


// Step 3: Create a variable of that type and print it

`,
      solution: `type Unwrap<T> = T extends Promise<infer V> ? V : T;

type BoolValue = Unwrap<Promise<boolean>>;

let value: BoolValue = true;

console.log(value);`,
      expectedOutput: ['true'],
      hints: [
        'Promise<infer V> captures the promised value type into V',
        'The : T fallback returns non-promises unchanged',
        'Promise<boolean> unwraps to just boolean',
        'Your variable must be true or false'
      ]
    }
  ],
  buildNote: {
    title: 'The infer Keyword in Practice',
    explanation: `The \`infer\` keyword powers many of TypeScript's built-in utility types. \`ReturnType<T>\` uses infer to extract function return types. \`Parameters<T>\` uses infer for parameter tuples. In this app, we could use infer to create types that extract the exercise type from a lesson, or unwrap the progress state structure. The pattern is essential for library authors creating type utilities that work with any user-defined types.`,
    relatedFiles: [
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Advanced TypeScript libraries rely heavily on infer. React's \`ComponentProps<T>\` uses infer to extract props from components. Redux Toolkit uses infer to extract action types from slices. GraphQL clients use infer to derive types from query strings. The pattern is essential for creating "type-level functions" that transform types based on their structure. Understanding infer unlocks the ability to read and write sophisticated type definitions.`
  }
};
