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

## The Big Picture: The infer Keyword in Real Applications

The \`infer\` keyword is the key to extracting types from complex structures, enabling sophisticated type manipulation in libraries and frameworks. Here's how it's used:

### React Component Props Extraction
\`\`\`typescript
// Extract props from any React component
type ComponentProps<T> =
  T extends React.ComponentType<infer P> ? P : never;

// Extract ref type from forwardRef components
type ComponentRef<T> =
  T extends React.ForwardRefExoticComponent<infer P>
    ? P extends React.RefAttributes<infer R> ? R : never
    : never;

// Extract children type if present
type ChildrenType<T> =
  T extends { children: infer C } ? C : never;

// Usage
type ButtonProps = ComponentProps<typeof Button>;
type InputRef = ComponentRef<typeof Input>;
type LayoutChildren = ChildrenType<LayoutProps>;

// Extract state type from useState
type StateType<T> =
  T extends [infer S, (value: S | ((prev: S) => S)) => void] ? S : never;

const [user, setUser] = useState<User | null>(null);
type UserState = StateType<typeof [user, setUser]>;  // User | null
\`\`\`

### API Response Type Inference
\`\`\`typescript
// Extract data type from API response
type ApiData<T> =
  T extends { data: infer D } ? D :
  T extends Promise<{ data: infer D }> ? D :
  never;

// Extract error type
type ApiError<T> =
  T extends { error: infer E } ? E : never;

// Unwrap nested response structures
type UnwrapResponse<T> =
  T extends { data: { results: infer R } } ? R :
  T extends { data: infer D } ? D :
  T extends Promise<infer P> ? UnwrapResponse<P> :
  T;

// Usage with fetch wrappers
type FetchResult<T> = Promise<{ data: T; status: number }>;
type UserData = UnwrapResponse<FetchResult<{ results: User[] }>>;
// User[]

// Extract all possible error types from union
type ErrorTypes<T> =
  T extends { status: 'error'; error: infer E } ? E : never;

type ApiResult =
  | { status: 'success'; data: User }
  | { status: 'error'; error: 'not_found' }
  | { status: 'error'; error: 'unauthorized' };

type Errors = ErrorTypes<ApiResult>;  // 'not_found' | 'unauthorized'
\`\`\`

### Function Signature Analysis
\`\`\`typescript
// Extract first parameter
type FirstParam<T> =
  T extends (first: infer F, ...rest: any[]) => any ? F : never;

// Extract last parameter
type LastParam<T> =
  T extends (...args: [...infer _, infer L]) => any ? L : never;

// Extract all parameters except first (for middleware patterns)
type RestParams<T> =
  T extends (first: any, ...rest: infer R) => any ? R : never;

// Extract callback parameter type
type CallbackParam<T> =
  T extends (callback: (result: infer R) => void) => any ? R : never;

// Usage
type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
type Req = FirstParam<RequestHandler>;  // Request
type NextFn = LastParam<RequestHandler>;  // NextFunction

type FetchCallback = (cb: (data: User[]) => void) => void;
type FetchedData = CallbackParam<FetchCallback>;  // User[]

// Extract async return type
type AsyncReturn<T> =
  T extends (...args: any[]) => Promise<infer R> ? R :
  T extends (...args: any[]) => infer R ? R :
  never;

type GetUser = (id: string) => Promise<User>;
type UserResult = AsyncReturn<GetUser>;  // User
\`\`\`

### Redux Action Type Extraction
\`\`\`typescript
// Extract payload from action creator
type ActionPayload<T> =
  T extends (payload: infer P) => { type: string; payload: P } ? P : never;

// Extract action type string
type ActionType<T> =
  T extends (...args: any[]) => { type: infer T } ? T : never;

// Action creators
const addUser = (user: User) => ({ type: 'ADD_USER' as const, payload: user });
const removeUser = (id: string) => ({ type: 'REMOVE_USER' as const, payload: id });

type AddUserPayload = ActionPayload<typeof addUser>;  // User
type RemoveUserPayload = ActionPayload<typeof removeUser>;  // string
type AddUserType = ActionType<typeof addUser>;  // 'ADD_USER'

// Extract state type from reducer
type ReducerState<T> =
  T extends (state: infer S, action: any) => infer S ? S : never;

type ReducerAction<T> =
  T extends (state: any, action: infer A) => any ? A : never;

type MyReducer = (state: AppState, action: AppAction) => AppState;
type State = ReducerState<MyReducer>;  // AppState
type Action = ReducerAction<MyReducer>;  // AppAction
\`\`\`

### Object Structure Analysis
\`\`\`typescript
// Extract value type from Record
type RecordValue<T> =
  T extends Record<any, infer V> ? V : never;

// Extract key type from Record
type RecordKey<T> =
  T extends Record<infer K, any> ? K : never;

// Extract deeply nested type
type DeepValue<T, Path extends string> =
  Path extends \`\${infer Key}.\${infer Rest}\`
    ? Key extends keyof T
      ? DeepValue<T[Key], Rest>
      : never
    : Path extends keyof T
      ? T[Path]
      : never;

interface Config {
  database: {
    connection: {
      host: string;
      port: number;
    };
  };
}

type Host = DeepValue<Config, 'database.connection.host'>;  // string
type Port = DeepValue<Config, 'database.connection.port'>;  // number

// Extract optional properties
type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

type RequiredKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T];
\`\`\`

### Tuple Manipulation
\`\`\`typescript
// Extract first element
type Head<T extends any[]> =
  T extends [infer H, ...any[]] ? H : never;

// Extract all but first
type Tail<T extends any[]> =
  T extends [any, ...infer R] ? R : never;

// Extract last element
type Last<T extends any[]> =
  T extends [...any[], infer L] ? L : never;

// Extract all but last
type Init<T extends any[]> =
  T extends [...infer I, any] ? I : never;

// Reverse tuple
type Reverse<T extends any[]> =
  T extends [infer F, ...infer R]
    ? [...Reverse<R>, F]
    : [];

type MyTuple = [string, number, boolean];
type First = Head<MyTuple>;  // string
type Rest = Tail<MyTuple>;  // [number, boolean]
type Final = Last<MyTuple>;  // boolean
type Reversed = Reverse<MyTuple>;  // [boolean, number, string]

// Flatten nested tuples
type Flatten<T> =
  T extends [infer F, ...infer R]
    ? F extends any[]
      ? [...Flatten<F>, ...Flatten<R>]
      : [F, ...Flatten<R>]
    : [];

type Nested = [[1, 2], [3, [4, 5]]];
type Flat = Flatten<Nested>;  // [1, 2, 3, 4, 5]
\`\`\`

### Event Handler Inference
\`\`\`typescript
// Extract event type from handler
type EventType<T> =
  T extends (event: infer E) => any ? E : never;

// Extract handler result
type HandlerResult<T> =
  T extends (event: any) => infer R ? R : never;

// Build event map from handlers
type EventMap<Handlers> = {
  [K in keyof Handlers]: EventType<Handlers[K]>;
};

interface EventHandlers {
  onClick: (event: MouseEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onSubmit: (event: FormEvent) => Promise<void>;
}

type Events = EventMap<EventHandlers>;
// {
//   onClick: MouseEvent;
//   onKeyDown: KeyboardEvent;
//   onSubmit: FormEvent;
// }
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
    },
    {
      id: 4,
      title: 'Exercise 4: Infer Array Element Type',
      description: `Use infer to extract the element type from an array type.

**Your task:**
1. Create a type \`ArrayElement<T>\` that extracts the element type from T[]
2. If T is not an array, return \`never\`
3. Test with string[] and number[]
4. Test with a non-array type`,
      starterCode: `// Step 1: Create ArrayElement type
// Hint: T extends (infer E)[] ? E : never


// Step 2: Test with string[]
type StrElement = ArrayElement<string[]>;

// Step 3: Test with number[]
type NumElement = ArrayElement<number[]>;

// Step 4: Create variables and log
`,
      solution: `type ArrayElement<T> = T extends (infer E)[] ? E : never;

type StrElement = ArrayElement<string[]>;
type NumElement = ArrayElement<number[]>;

let str: StrElement = "hello";
let num: NumElement = 42;

console.log(str);
console.log(num);`,
      expectedOutput: ['hello', '42'],
      hints: [
        '(infer E)[] matches any array and captures element type',
        'string[] unwraps to string',
        'number[] unwraps to number'
      ]
    }
  ],
  quiz: [
    {
      question: 'Where can the `infer` keyword be used?',
      options: [
        'Anywhere in a type definition',
        'Only in the extends clause of a conditional type',
        'Only with function types',
        'Only with generic type parameters'
      ],
      correctIndex: 1,
      explanation: 'The infer keyword can only be used in the extends clause of conditional types to capture a type from a pattern.'
    },
    {
      question: 'What does `T extends (...args: infer P) => any ? P : never` extract?',
      options: [
        'The return type of the function',
        'The function itself',
        'A tuple type of the parameter types',
        'The first parameter type'
      ],
      correctIndex: 2,
      explanation: 'infer P in the parameter position captures all parameters as a tuple type, which is how the Parameters<T> utility type works.'
    },
    {
      question: 'What happens if infer captures multiple possible types?',
      options: [
        'It throws a compile error',
        'It picks the first match',
        'It creates a union of all possible types',
        'It returns never'
      ],
      correctIndex: 2,
      explanation: 'When infer could match multiple types (like in union or overload scenarios), TypeScript creates a union of all possible matches.'
    },
    {
      question: 'What is `ReturnType<T>` implemented as?',
      options: [
        'T extends Function ? T : never',
        'T extends (...args: any[]) => infer R ? R : never',
        'infer R from T',
        'typeof T.return'
      ],
      correctIndex: 1,
      explanation: 'ReturnType uses infer to capture the return type: T extends (...args: any[]) => infer R ? R : never'
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
