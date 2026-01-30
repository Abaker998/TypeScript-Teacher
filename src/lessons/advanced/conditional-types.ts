import { Lesson } from '@/types/lesson';

export const conditionalTypes: Lesson = {
  slug: 'conditional-types',
  title: 'Conditional Types',
  description: 'Write types that change based on conditions, enabling advanced type transformations.',
  difficulty: 'advanced',
  order: 20,
  content: `
# Conditional Types

Conditional types allow you to select one type or another based on a condition. They're like if-else statements for types.

## Basic Syntax

The syntax is: \`T extends U ? X : Y\`

Read it as: "If T is assignable to U, the type is X, otherwise it's Y."

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;      // true
type B = IsString<42>;           // false
type C = IsString<string>;       // true
\`\`\`

## The extends Keyword

The \`extends\` keyword checks if a type is assignable to another. Think of it as "can T be assigned to U?"

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>;      // true
type B = IsArray<string>;        // false
\`\`\`

## Using infer for Type Extraction

The \`infer\` keyword captures a type within a conditional:

\`\`\`typescript
type GetArrayElement<T> = T extends (infer E)[] ? E : never;

type StringElement = GetArrayElement<string[]>;  // string
type NumberElement = GetArrayElement<number[]>;  // number
type NotArray = GetArrayElement<string>;         // never
\`\`\`

This extracts the element type from an array. The \`infer E\` says "whatever type is in the array, call it E."

## Extract and Exclude Utilities

TypeScript provides Extract and Exclude — built-in conditional types:

\`\`\`typescript
type Status = "pending" | "success" | "error";

type SuccessStatuses = Extract<Status, "success" | "error">;
// Result: "success" | "error"

type NonErrorStatuses = Exclude<Status, "error">;
// Result: "pending" | "success"
\`\`\`

Extract keeps types matching a condition. Exclude removes them.

## Practical Example: Flatten

\`\`\`typescript
type Flatten<T> = T extends any[] ? T[number] : T;

type A = Flatten<string[]>;      // string
type B = Flatten<number[]>;      // number
type C = Flatten<string>;        // string
\`\`\`

This extracts the element type from arrays, or returns the type unchanged if it's not an array.

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write conditional types using extends
- Understand type assignment relationships
- Use infer to capture and extract types
- Apply Extract and Exclude for filtering unions
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Conditional Type',
      description: `Extract the inner type from a Promise using conditional types and the \`infer\` keyword.

**Your task:**
1. Define a conditional type \`GetPromiseType<T>\`
2. If T is a Promise, extract and return the inner type using \`infer\`
3. If T is not a Promise, return \`never\`
4. Test with \`Promise<string>\`, \`Promise<number>\`, and \`string\``,
      starterCode: `// Step 1: Define the conditional type


// Step 2: Test with Promise<string> - should extract string


// Step 3: Test with Promise<number> - should extract number


// Step 4: Test with a non-Promise - should be never


// Step 5: Verify with runtime values
`,
      solution: `type GetPromiseType<T> = T extends Promise<infer R> ? R : never;

type StringPromise = GetPromiseType<Promise<string>>;  // string
type NumberPromise = GetPromiseType<Promise<number>>;  // number
type NotPromise = GetPromiseType<string>;              // never

// Test the types
const test1: StringPromise = "hello";
const test2: NumberPromise = 42;

console.log(test1);
console.log(test2);`,
      expectedOutput: ['hello', '42'],
      hints: [
        'Syntax: T extends U ? TrueType : FalseType',
        'Use infer R to capture the inner type: Promise<infer R>',
        'Return R when matched, never otherwise'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Using the infer Keyword',
      description: `Create a type that extracts the return type from any function signature.

**Your task:**
1. Define a conditional type \`ReturnTypeOf<T>\`
2. Match the function pattern \`(...args: any[]) => SomeType\`
3. Use \`infer R\` to capture the return type
4. Return \`never\` for non-functions`,
      starterCode: `// Step 1: Define the conditional type for functions


// Step 2: Test with a function returning string


// Step 3: Test with a function returning number


// Step 4: Test with a non-function


// Step 5: Verify the extracted types
`,
      solution: `type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

type StringReturn = ReturnTypeOf<(x: number) => string>;  // string
type NumberReturn = ReturnTypeOf<() => number>;           // number
type NotFunction = ReturnTypeOf<number>;                  // never

const test1: StringReturn = "result";
const test2: NumberReturn = 42;

console.log(test1);
console.log(test2);
console.log("NotFunction is never type");`,
      expectedOutput: ['result', '42', 'NotFunction is never type'],
      hints: [
        'Function pattern: (...args: any[]) => ReturnType',
        'Place infer R after the arrow: => infer R',
        'This recreates TypeScript\'s built-in ReturnType<T>'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Distributive Conditional Types',
      description: `Build a type that filters out \`null\` and \`undefined\` from union types.

**Your task:**
1. Define \`NonNullableProps<T>\` as a conditional type
2. Return \`never\` when T is \`null\` or \`undefined\`
3. Return T unchanged for all other types
4. Watch how it automatically distributes over unions`,
      starterCode: `// Step 1: Define the filtering conditional type


// Step 2: Test with string | null | undefined


// Step 3: Test with number | null


// Step 4: Test with mixed union


// Step 5: Verify the filtered types work
`,
      solution: `type NonNullableProps<T> = T extends null | undefined ? never : T;

type CleanString = NonNullableProps<string | null | undefined>;  // string
type CleanNumber = NonNullableProps<number | null>;              // number
type CleanMixed = NonNullableProps<string | number | null>;      // string | number

const test1: CleanString = "hello";
const test2: CleanNumber = 42;
const test3: CleanMixed = "mixed";

console.log(test1);
console.log(test2);
console.log(test3);
console.log("Null and undefined removed from unions!");`,
      expectedOutput: ['hello', '42', 'mixed', 'Null and undefined removed from unions!'],
      hints: [
        'Check: T extends null | undefined',
        'Return never to filter out, T to keep',
        'Unions distribute automatically - each member is checked separately'
      ],
    },
  ],
  buildNote: {
    title: 'Conditional Types in the App',
    explanation: `The app uses type narrowing extensively, which relies on conditional logic. In the output panel component in \`src/components/OutputPanel.tsx\`, when displaying a \`RunResult\`, the code checks \`if (result.success)\` — this is runtime narrowing, and TypeScript models it with conditional type narrowing under the hood. After the check, TypeScript knows that inside the if-block, result is the success case with an \`output\` array, while outside is the error case with an \`errors\` array. The \`RunResult\` interface demonstrates how discriminated unions pair with conditional logic for type safety. The code executor returns \`Promise<RunResult>\`, and conditional types could theoretically extract the success or error branches separately. Optional chaining patterns throughout the codebase like \`result?.data\` rely on TypeScript understanding when values might be undefined. Conditional types shine in utility functions — Extract and Exclude utilities let you filter union types based on conditions. While the app doesn't explicitly use advanced conditional types, the pattern of type guards and type narrowing is conditional type logic at the runtime level.`,
    relatedFiles: [
      'src/components/OutputPanel.tsx',
      'src/types/lesson.ts',
      'src/lib/code-executor.ts'
    ],
    inTheRealWorld: `Conditional types are essential in advanced TypeScript libraries. The entire React type system uses conditional types — hooks like \`useCallback\` use them to infer callback signatures. GraphQL libraries use conditional types to determine whether a field is nullable based on schema definitions. ORM libraries like Prisma use conditional types to ensure queries return the correct shape based on select clauses. Utility type libraries like Lodash have types using conditionals to preserve property optionality. Testing frameworks use conditional types to ensure assertions match runtime behavior. Without conditional types, many modern TypeScript patterns — from discriminated unions to generic utilities — would be impossible.`
  }
};
