import { Lesson } from '@/types/lesson';

export const conditionalTypes: Lesson = {
  slug: 'conditional-types',
  title: 'Conditional Types',
  description: 'Write types that change based on conditions, enabling advanced type transformations.',
  difficulty: 'advanced',
  order: 22,
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

## The Big Picture: Conditional Types in Real Applications

Conditional types enable sophisticated type transformations that adapt based on input types. Here's how they're used in production:

### API Response Type Inference
\`\`\`typescript
// Define API endpoints and their response types
interface ApiEndpoints {
  '/users': User[];
  '/users/:id': User;
  '/products': Product[];
  '/products/:id': Product;
  '/orders': Order[];
}

// Extract response type based on endpoint
type ApiResponse<T extends keyof ApiEndpoints> = ApiEndpoints[T];

// Determine if endpoint returns array or single item
type IsArrayResponse<T> = T extends any[] ? true : false;

// Pagination wrapper only for array responses
type PaginatedResponse<T> = T extends any[]
  ? { data: T; total: number; page: number; pageSize: number }
  : T;

// Usage
type UsersResponse = PaginatedResponse<ApiResponse<'/users'>>;
// { data: User[]; total: number; page: number; pageSize: number }

type UserResponse = PaginatedResponse<ApiResponse<'/users/:id'>>;
// User (no pagination wrapper)
\`\`\`

### Form Field Type Resolution
\`\`\`typescript
// Resolve input component based on field type
type InputComponent<T> =
  T extends string ? 'TextInput' :
  T extends number ? 'NumberInput' :
  T extends boolean ? 'Checkbox' :
  T extends Date ? 'DatePicker' :
  T extends string[] ? 'MultiSelect' :
  T extends File ? 'FileUpload' :
  'GenericInput';

// Generate form field config based on data type
type FormFieldConfig<T> = {
  [K in keyof T]: {
    name: K;
    component: InputComponent<T[K]>;
    value: T[K];
    onChange: (value: T[K]) => void;
  };
};

interface UserForm {
  name: string;
  age: number;
  isActive: boolean;
  birthDate: Date;
  tags: string[];
}

type UserFormConfig = FormFieldConfig<UserForm>;
// {
//   name: { name: 'name'; component: 'TextInput'; value: string; onChange: (value: string) => void };
//   age: { name: 'age'; component: 'NumberInput'; value: number; onChange: (value: number) => void };
//   ...
// }
\`\`\`

### Async/Promise Handling
\`\`\`typescript
// Unwrap nested promises
type DeepAwaited<T> =
  T extends Promise<infer U> ? DeepAwaited<U> :
  T extends (...args: any[]) => Promise<infer U> ? (...args: Parameters<T>) => Promise<DeepAwaited<U>> :
  T;

// Determine if type is async
type IsAsync<T> = T extends Promise<any> ? true : false;

// Make synchronous version of async function
type Sync<T> = T extends (...args: infer A) => Promise<infer R>
  ? (...args: A) => R
  : T;

// Make async version of sync function
type Async<T> = T extends (...args: infer A) => infer R
  ? R extends Promise<any> ? T : (...args: A) => Promise<R>
  : T;

// Usage
type FetchUser = (id: string) => Promise<User>;
type SyncFetchUser = Sync<FetchUser>;  // (id: string) => User

type GetName = (user: User) => string;
type AsyncGetName = Async<GetName>;  // (user: User) => Promise<string>
\`\`\`

### Event System Types
\`\`\`typescript
// Event payload types
interface Events {
  click: { x: number; y: number; target: HTMLElement };
  keydown: { key: string; ctrlKey: boolean; shiftKey: boolean };
  submit: { formData: FormData };
  custom: { data: unknown };
}

// Handler type based on event
type EventHandler<K extends keyof Events> = (event: Events[K]) => void;

// Filter events by payload structure
type EventsWithPosition = {
  [K in keyof Events]: Events[K] extends { x: number; y: number } ? K : never;
}[keyof Events];
// 'click'

type EventsWithKeyInfo = {
  [K in keyof Events]: Events[K] extends { key: string } ? K : never;
}[keyof Events];
// 'keydown'

// Create conditional subscription type
type Subscribe<K extends keyof Events> =
  Events[K] extends { x: number; y: number }
    ? (handler: EventHandler<K>, options?: { capture?: boolean }) => void
    : (handler: EventHandler<K>) => void;
\`\`\`

### GraphQL-Style Type Generation
\`\`\`typescript
// Define nullable behavior based on schema
type Nullable<T, IsNullable extends boolean> = IsNullable extends true ? T | null : T;

// Field selection type
type SelectFields<T, Fields extends keyof T> = {
  [K in Fields]: T[K];
};

// Conditional field inclusion
type IncludeField<T, K extends keyof T, Include extends boolean> =
  Include extends true ? Pick<T, K> : {};

// Query result type based on selection
interface User {
  id: string;
  name: string;
  email: string;
  posts: Post[];
  profile: Profile;
}

type UserQuery<
  IncludePosts extends boolean = false,
  IncludeProfile extends boolean = false
> = Pick<User, 'id' | 'name' | 'email'>
  & (IncludePosts extends true ? { posts: Post[] } : {})
  & (IncludeProfile extends true ? { profile: Profile } : {});

type BasicUser = UserQuery;  // { id, name, email }
type UserWithPosts = UserQuery<true>;  // { id, name, email, posts }
type FullUser = UserQuery<true, true>;  // { id, name, email, posts, profile }
\`\`\`

### Type-Safe Validators
\`\`\`typescript
// Validation result type based on input
type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; errors: string[] };

// Conditional validator return type
type Validator<T> = (input: unknown) => ValidationResult<T>;

// Compose validators with conditional logic
type ValidatorFor<T> =
  T extends string ? StringValidator :
  T extends number ? NumberValidator :
  T extends boolean ? BooleanValidator :
  T extends any[] ? ArrayValidator<T[number]> :
  T extends object ? ObjectValidator<T> :
  never;

interface StringValidator {
  minLength: (min: number) => StringValidator;
  maxLength: (max: number) => StringValidator;
  pattern: (regex: RegExp) => StringValidator;
  validate: Validator<string>;
}

interface NumberValidator {
  min: (min: number) => NumberValidator;
  max: (max: number) => NumberValidator;
  integer: () => NumberValidator;
  validate: Validator<number>;
}
\`\`\`

### React Component Type Inference
\`\`\`typescript
// Extract props from component
type ComponentProps<T> =
  T extends React.ComponentType<infer P> ? P :
  T extends (props: infer P) => any ? P :
  never;

// Determine if component is class or function
type IsClassComponent<T> =
  T extends new (...args: any[]) => React.Component<any, any> ? true : false;

// Get ref type for component
type ComponentRef<T> =
  T extends React.ForwardRefExoticComponent<infer P>
    ? P extends React.RefAttributes<infer R> ? R : never
    : T extends new (...args: any[]) => infer I ? I : never;

// Make props controlled or uncontrolled
type ControlledProps<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
} & {
  [K in keyof T as T[K] extends Function ? never : \`on\${Capitalize<K & string>}Change\`]: (value: T[K]) => void;
};
\`\`\`

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
    {
      id: 4,
      title: 'Exercise 4: Extract Function Return Types',
      description: `Create a conditional type that extracts the return type from function types.

**Your task:**
1. Create a type \`GetReturnType<T>\` that extracts the return type if T is a function
2. If T is not a function, return \`never\`
3. Test with a function type that returns a string
4. Test with a non-function type`,
      starterCode: `// Step 1: Create GetReturnType using conditional types
// Hint: T extends (...args: any[]) => infer R ? R : never


// Step 2: Test with a function type
type StringFn = () => string;
type Result1 = GetReturnType<StringFn>;

// Step 3: Test with a non-function type
type Result2 = GetReturnType<number>;

// Step 4: Create variables and log them
`,
      solution: `type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type StringFn = () => string;
type Result1 = GetReturnType<StringFn>;

type Result2 = GetReturnType<number>;

let r1: Result1 = "hello";
let r2: Result2 = undefined as never;

console.log(r1);
console.log(typeof r2);`,
      expectedOutput: ['hello', 'undefined'],
      hints: [
        '(...args: any[]) => infer R matches any function',
        'infer R captures the return type',
        'never is returned for non-functions'
      ],
    },
  ],
  quiz: [
    {
      question: 'What happens when a conditional type is applied to a union type?',
      options: [
        'The entire union is checked as one type',
        'The condition distributes over each member of the union',
        'It throws a compile error',
        'Only the first member is checked'
      ],
      correctIndex: 1,
      explanation: 'Conditional types distribute over union types - each member is checked independently and results are combined back into a union.'
    },
    {
      question: 'What does `T extends U ? X : Y` mean?',
      options: [
        'T must equal U exactly',
        'If T is assignable to U, result is X; otherwise Y',
        'Creates a new type that extends both U and X',
        'Checks if U extends T'
      ],
      correctIndex: 1,
      explanation: 'Conditional types check if T is assignable to U. If true, the type resolves to X; if false, it resolves to Y.'
    },
    {
      question: 'What is the purpose of `never` in conditional type filtering?',
      options: [
        'To throw an error',
        'To create an empty type that disappears from unions',
        'To mark the type as incomplete',
        'To prevent the type from being used'
      ],
      correctIndex: 1,
      explanation: 'never is the empty type - when part of a union, it disappears. This makes it perfect for filtering out unwanted types.'
    },
    {
      question: 'How do you prevent distribution in a conditional type?',
      options: [
        'Use the noDistribute keyword',
        'Wrap T in a tuple: [T] extends [U]',
        'Use T as U instead of extends',
        'Distribution cannot be prevented'
      ],
      correctIndex: 1,
      explanation: 'Wrapping the type in a tuple [T] prevents distribution because tuples are not checked member-by-member.'
    }
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
