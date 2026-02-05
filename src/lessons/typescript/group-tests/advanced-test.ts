import { Lesson } from '@/types/lesson';

export const advancedTest: Lesson = {
  slug: 'advanced-test',
  title: 'Advanced Test',
  description: 'Test your mastery of mapped types, conditional types, utility types, and advanced patterns.',
  difficulty: 'advanced',
  order: 28,
  content: `
# Advanced Test

Outstanding progress! You've completed the Advanced section. This test will challenge your understanding of TypeScript's most powerful type-level features.

## What This Test Covers

- **Mapped Types** — Transforming types structurally
- **Conditional Types** — Type-level conditionals with \`extends\`
- **Utility Types** — Pick, Omit, Record, Partial, Required
- **Template Literal Types** — String interpolation in the type system
- **Infer Keyword** — Extracting types from type patterns
- **Decorators & Patterns** — Advanced OOP patterns
- **Advanced Patterns** — Complex type compositions

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** — reading complex type operations
- **Coding exercises** — implementing advanced type utilities

These are the skills that distinguish expert TypeScript developers. Think carefully!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Custom Mapped Type',
      description: `Create a mapped type that makes all properties optional and nullable.

**Your task:**
1. Create a type \`OptionalNullable<T>\` that for each property in T:
   - Makes it optional (?)
   - Allows it to be the original type OR null
2. Define an interface \`User\` with: name (string), age (number)
3. Create a type \`PartialUser\` using OptionalNullable<User>
4. Create an object of type PartialUser with only name set to null
5. Print "Valid partial user" to confirm it compiles

**Hint:** Use [K in keyof T]?: T[K] | null`,
      starterCode: `// Create the OptionalNullable mapped type


// Define User interface


// Create PartialUser type


// Create an object with only name set to null


// Print confirmation

`,
      solution: `type OptionalNullable<T> = {
  [K in keyof T]?: T[K] | null;
};

interface User {
  name: string;
  age: number;
}

type PartialUser = OptionalNullable<User>;

const partialUser: PartialUser = {
  name: null
};

console.log("Valid partial user");`,
      expectedOutput: [
        'Valid partial user'
      ],
      hints: [
        'Mapped type syntax: { [K in keyof T]: NewType }',
        'Add ? after ] to make properties optional',
        'Use | null to create a union with null',
        'The object only needs the properties you want to set'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Conditional Type with Infer',
      description: `Create a conditional type that extracts the return type of a function.

**Your task:**
1. Create a type \`MyReturnType<T>\` that:
   - If T is a function, extracts and returns its return type
   - Otherwise returns never
   - Use \`infer R\` to capture the return type
2. Define a function type \`GetUser\` that returns { id: number; name: string }
3. Create a type \`UserResult\` = MyReturnType<GetUser>
4. Create a user object of type UserResult
5. Print the user's name

**Note:** This recreates TypeScript's built-in ReturnType<T>`,
      starterCode: `// Create MyReturnType conditional type with infer


// Define GetUser function type


// Extract the return type


// Create a user object of that type


// Print the user's name

`,
      solution: `type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type GetUser = () => { id: number; name: string };

type UserResult = MyReturnType<GetUser>;

const user: UserResult = {
  id: 1,
  name: "Alice"
};

console.log(user.name);`,
      expectedOutput: [
        'Alice'
      ],
      hints: [
        'Conditional type: T extends Condition ? TrueType : FalseType',
        'Function pattern: (...args: any[]) => infer R',
        'infer R captures the return type into R',
        'The extracted type can be used like any other type'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Template Literal Type Builder',
      description: `Create template literal types for API endpoint paths.

**Your task:**
1. Create a type \`Resource\` = "users" | "posts" | "comments"
2. Create a type \`Action\` = "get" | "create" | "update" | "delete"
3. Create a template literal type \`Endpoint\` that combines them as: "/api/{resource}/{action}"
4. Create a function \`logEndpoint\` that takes an Endpoint parameter and logs it
5. Call logEndpoint with a valid endpoint and print the result

**Example endpoint:** "/api/users/get"`,
      starterCode: `// Create Resource type


// Create Action type


// Create Endpoint template literal type


// Create logEndpoint function


// Call with a valid endpoint

`,
      solution: `type Resource = "users" | "posts" | "comments";
type Action = "get" | "create" | "update" | "delete";

type Endpoint = \`/api/\${Resource}/\${Action}\`;

function logEndpoint(endpoint: Endpoint): void {
  console.log(endpoint);
}

logEndpoint("/api/users/get");`,
      expectedOutput: [
        '/api/users/get'
      ],
      hints: [
        'Template literal type: `prefix${Type}suffix`',
        'When using union types, all combinations are generated',
        'The function parameter must match one of the valid combinations',
        'Only exact matches from the generated combinations will compile'
      ]
    }
  ],
  buildNote: {
    title: 'Advanced Types in the App',
    explanation: `The TypeScript teaching app uses several advanced patterns. The Difficulty type is a union of literal types. Mapped types could be used to create readonly versions of lessons. Conditional types help with component prop validation. Template literal types could type-check route paths like "/lessons/[slug]". The utility types Partial, Pick, and Omit are useful when components only need some lesson properties. These advanced features enable precise type definitions that catch errors at compile time.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/app/lessons/[slug]/page.tsx',
      'src/components/Sidebar.tsx'
    ],
    inTheRealWorld: `Senior TypeScript positions require deep understanding of the type system. Library authors use mapped types to create flexible APIs. Framework developers use conditional types for type inference. Companies like Vercel, Stripe, and Prisma use advanced TypeScript patterns extensively in their public APIs to provide excellent developer experience with full type safety.`
  },
  quiz: [
    {
      question: 'What does `keyof` return for this type?\n\n```typescript\ntype User = { name: string; age: number };\ntype Keys = keyof User;\n```',
      options: ['["name", "age"]', '"name" | "age"', 'string', '{ name: string; age: number }'],
      correctIndex: 1,
      explanation: 'keyof returns a union of the literal types of all property names. For User, this is "name" | "age" - a union of string literal types.'
    },
    {
      question: 'What does this mapped type produce?\n\n```typescript\ntype Readonly<T> = { readonly [K in keyof T]: T[K] };\n```',
      options: [
        'Makes all properties optional',
        'Makes all properties required',
        'Makes all properties read-only',
        'Removes all properties'
      ],
      correctIndex: 2,
      explanation: 'The readonly modifier before [K in keyof T] makes each mapped property read-only, preventing reassignment after initialization.'
    },
    {
      question: 'What is the result of this conditional type?\n\n```typescript\ntype IsString<T> = T extends string ? "yes" : "no";\ntype Result = IsString<"hello">;\n```',
      options: ['"hello"', 'string', '"yes"', '"no"'],
      correctIndex: 2,
      explanation: '"hello" is a string literal type, which extends string. So the conditional evaluates to the true branch: "yes".'
    },
    {
      question: 'What does `infer` do in conditional types?',
      options: [
        'Infers the type of a variable at runtime',
        'Captures a type from a pattern for use in the true branch',
        'Automatically converts types',
        'Validates that a type exists'
      ],
      correctIndex: 1,
      explanation: 'infer declares a type variable that captures part of the type being matched. It can only be used in the extends clause and the captured type is available in the true branch.'
    },
    {
      question: 'What does this utility type do?\n\n```typescript\ntype Pick<T, K extends keyof T> = { [P in K]: T[P] };\n```',
      options: [
        'Removes properties K from T',
        'Makes properties K optional',
        'Creates a new type with only properties K from T',
        'Adds new properties K to T'
      ],
      correctIndex: 2,
      explanation: 'Pick creates a new type containing only the specified properties K from T. It iterates over K (not keyof T) and maps only those properties.'
    },
    {
      question: 'What template literal type does this produce?\n\n```typescript\ntype Size = "sm" | "lg";\ntype Color = "red" | "blue";\ntype Class = `${Size}-${Color}`;\n```',
      options: [
        '"sm-red"',
        '"sm" | "lg" | "red" | "blue"',
        '"sm-red" | "sm-blue" | "lg-red" | "lg-blue"',
        'string'
      ],
      correctIndex: 2,
      explanation: 'Template literal types with unions create all combinations. Size has 2 options, Color has 2 options, so the result is 2 x 2 = 4 literal types.'
    },
    {
      question: 'What does `Partial<T>` do?',
      options: [
        'Makes all properties required',
        'Makes all properties optional',
        'Removes all properties',
        'Makes all properties readonly'
      ],
      correctIndex: 1,
      explanation: 'Partial<T> is a utility type that makes all properties of T optional by adding ? to each property in the mapped type.'
    },
    {
      question: 'What is extracted by this type?\n\n```typescript\ntype ArrayElement<T> = T extends (infer E)[] ? E : never;\ntype Elem = ArrayElement<string[]>;\n```',
      options: ['string[]', 'never', 'string', 'unknown'],
      correctIndex: 2,
      explanation: 'The pattern (infer E)[] matches an array type and captures the element type E. For string[], E is inferred as string.'
    },
    {
      question: 'What does the `-` modifier do in mapped types?\n\n```typescript\ntype Required<T> = { [K in keyof T]-?: T[K] };\n```',
      options: [
        'Adds the optional modifier',
        'Removes the optional modifier',
        'Subtracts properties',
        'Makes properties negative numbers'
      ],
      correctIndex: 1,
      explanation: 'The - modifier removes a modifier. -? removes the optional modifier, making all properties required. Similarly, -readonly would remove readonly.'
    },
    {
      question: 'What does `Omit<T, K>` do?',
      options: [
        'Keeps only properties K from T',
        'Creates a type with all properties of T except K',
        'Makes properties K optional',
        'Adds properties K to T'
      ],
      correctIndex: 1,
      explanation: 'Omit<T, K> is the opposite of Pick. It creates a new type with all properties from T except those in K. It\'s implemented as Pick<T, Exclude<keyof T, K>>.'
    }
  ]
};
