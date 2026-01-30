import { Lesson } from '@/types/lesson';

export const advancedPatterns: Lesson = {
  slug: 'advanced-patterns',
  title: 'Advanced Patterns',
  description: 'Master discriminated unions, exhaustive checks, branded types, and other advanced TypeScript patterns.',
  difficulty: 'advanced',
  order: 25,
  content: `
# Advanced TypeScript Patterns

These patterns solve common problems elegantly and are used throughout professional TypeScript codebases.

## Discriminated Unions

Use a common property to distinguish between types:

\`\`\`typescript
type Success = { status: "success"; data: string };
type Error = { status: "error"; message: string };
type Loading = { status: "loading" };

type State = Success | Error | Loading;

function handleState(state: State) {
  switch (state.status) {
    case "success":
      console.log(state.data);  // TypeScript knows data exists
      break;
    case "error":
      console.log(state.message);  // TypeScript knows message exists
      break;
    case "loading":
      console.log("Loading...");
      break;
  }
}
\`\`\`

## Exhaustive Checking

Ensure all cases are handled:

\`\`\`typescript
function assertNever(x: never): never {
  throw new Error("Unexpected value: " + x);
}

function handleState(state: State) {
  switch (state.status) {
    case "success":
      return state.data;
    case "error":
      return state.message;
    case "loading":
      return "Loading...";
    default:
      return assertNever(state);  // Compile error if case is missing!
  }
}
\`\`\`

## Branded Types

Create distinct types from primitives:

\`\`\`typescript
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createOrderId(id: string): OrderId {
  return id as OrderId;
}

function getUser(id: UserId) { /* ... */ }

const userId = createUserId("user-123");
const orderId = createOrderId("order-456");

getUser(userId);   // OK
// getUser(orderId);  // Error! OrderId is not UserId
\`\`\`

## Builder Pattern

Chain methods with type safety:

\`\`\`typescript
class QueryBuilder<T extends object = {}> {
  private query: T;

  constructor(query: T = {} as T) {
    this.query = query;
  }

  where<K extends string, V>(key: K, value: V): QueryBuilder<T & { [P in K]: V }> {
    return new QueryBuilder({ ...this.query, [key]: value } as any);
  }

  build(): T {
    return this.query;
  }
}

const query = new QueryBuilder()
  .where("name", "Alice")
  .where("age", 30)
  .build();
// Type: { name: string; age: number }
\`\`\`

## Type-Safe Event Emitter

\`\`\`typescript
type Events = {
  login: { userId: string };
  logout: { userId: string };
  error: { message: string };
};

class TypedEmitter<T extends Record<string, any>> {
  private handlers: { [K in keyof T]?: ((data: T[K]) => void)[] } = {};

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event]!.push(handler);
  }

  emit<K extends keyof T>(event: K, data: T[K]) {
    this.handlers[event]?.forEach(h => h(data));
  }
}

const emitter = new TypedEmitter<Events>();
emitter.on("login", (data) => console.log(data.userId));  // Typed!
emitter.emit("login", { userId: "123" });  // Must match shape
\`\`\`

## Const Assertions

Lock down literal types:

\`\`\`typescript
// Without const assertion
const config1 = { theme: "dark", version: 1 };
// Type: { theme: string; version: number }

// With const assertion
const config2 = { theme: "dark", version: 1 } as const;
// Type: { readonly theme: "dark"; readonly version: 1 }
\`\`\`

## Readonly Deep

Make objects deeply immutable:

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type User = {
  name: string;
  settings: {
    theme: string;
  };
};

type ReadonlyUser = DeepReadonly<User>;
// All nested properties are readonly
\`\`\`

## Function Overloads

Multiple signatures for different inputs:

\`\`\`typescript
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

format("hello");  // Returns string, knows it's from first overload
format(42);       // Returns string, knows it's from second overload
\`\`\`

## Nominal Typing Pattern

Prevent type confusion:

\`\`\`typescript
type Kilometers = number & { _brand: "km" };
type Miles = number & { _brand: "mi" };

function kmToMiles(km: Kilometers): Miles {
  return (km * 0.621371) as Miles;
}

const distance = 100 as Kilometers;
const miles = kmToMiles(distance);  // OK
// kmToMiles(100);  // Error! number is not Kilometers
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use discriminated unions for type-safe state management
- Implement exhaustive checking with never
- Create branded/nominal types for type safety
- Build type-safe builders and event emitters
- Use const assertions and function overloads
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Discriminated Union',
      description: `Discriminated unions use a common property to distinguish between types.

**Your task:**
1. Define a \`Success\` type with type: "success" and value: number
2. Define a \`Failure\` type with type: "failure" and error: string
3. Create a \`Result\` union of both types
4. Write a \`handleResult\` function that prints value for success, error for failure
5. Test with a success result

**Pattern:** The \`type\` property acts as a "discriminator" that tells TypeScript which variant you have`,
      starterCode: `// Step 1: Define Success type


// Step 2: Define Failure type


// Step 3: Create Result union


// Step 4: Write handleResult function


// Step 5: Test with a success result

`,
      solution: `type Success = { type: "success"; value: number };
type Failure = { type: "failure"; error: string };
type Result = Success | Failure;

function handleResult(result: Result): void {
  if (result.type === "success") {
    console.log(result.value);
  } else {
    console.log(result.error);
  }
}

handleResult({ type: "success", value: 42 });`,
      expectedOutput: ['42'],
      hints: [
        'Success has type: "success" (literal string, not just string)',
        'Failure has type: "failure" (literal string)',
        'Checking result.type narrows the union',
        'Pass an object with type: "success" and value: 42'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Const Assertion',
      description: `Const assertions lock down object types to their literal values.

**Your task:**
1. Create a config object with apiUrl and maxRetries properties
2. Add \`as const\` after the object to make it readonly with literal types
3. Print the apiUrl

**Without as const:** \`{ theme: "dark" }\` has type \`{ theme: string }\`
**With as const:** \`{ theme: "dark" } as const\` has type \`{ readonly theme: "dark" }\``,
      starterCode: `// Step 1: Create config object with as const


// Step 2: Print the apiUrl

`,
      solution: `const config = {
  apiUrl: "https://api.example.com",
  maxRetries: 3
} as const;

console.log(config.apiUrl);`,
      expectedOutput: ['https://api.example.com'],
      hints: [
        'Add "as const" right after the closing brace',
        'This makes all properties readonly',
        'apiUrl becomes type "https://api.example.com" (not string)',
        'Access with config.apiUrl like any normal object'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Exhaustive Switch',
      description: `Use \`assertNever\` to ensure all union cases are handled in a switch statement.

**Your task:**
1. Define an \`assertNever\` function that takes \`never\` and throws
2. Define a \`Status\` type: "pending" | "approved" | "rejected"
3. Write \`getMessage\` that returns a message for each status
4. Use \`assertNever\` in the default case
5. Print the message for "approved"

**Why this works:** If you handle all cases, the default is unreachable (type is \`never\`).
If you miss a case, TypeScript errors because that case isn't \`never\`.`,
      starterCode: `// Step 1: Define assertNever function


// Step 2: Define Status type


// Step 3: Write getMessage with exhaustive switch


// Step 4: Print message for "approved"

`,
      solution: `function assertNever(x: never): never {
  throw new Error("Unexpected: " + x);
}

type Status = "pending" | "approved" | "rejected";

function getMessage(status: Status): string {
  switch (status) {
    case "pending":
      return "Waiting...";
    case "approved":
      return "Approved!";
    case "rejected":
      return "Rejected";
    default:
      return assertNever(status);
  }
}

console.log(getMessage("approved"));`,
      expectedOutput: ['Approved!'],
      hints: [
        'assertNever takes never and returns never',
        'Each case returns a different string message',
        'default: return assertNever(status) catches missed cases',
        'If you add a new status value, TypeScript will error until you handle it'
      ]
    }
  ],
  buildNote: {
    title: 'Advanced Patterns in Practice',
    explanation: `This app uses discriminated unions for the run result type — it either has success with output, or failure with errors. The \`OutputPanel\` component uses this pattern to render different UI based on the result status. Exhaustive checking could be added to ensure all grade types are handled. The progress state could use branded types to distinguish lesson slugs from arbitrary strings. These patterns make the codebase more robust and self-documenting.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/components/OutputPanel.tsx',
      'src/components/Quiz.tsx'
    ],
    inTheRealWorld: `These patterns are foundational in production TypeScript. Redux uses discriminated unions for actions. React Query uses them for query states (loading/error/success). Stripe's SDK uses branded types for different ID types. The builder pattern appears in ORMs like Prisma. Exhaustive checking prevents bugs when adding new enum values. These patterns separate amateur from professional TypeScript code.`
  }
};
