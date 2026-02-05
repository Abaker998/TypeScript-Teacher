import { Lesson } from '@/types/lesson';

export const advancedPatterns: Lesson = {
  slug: 'advanced-patterns',
  title: 'Advanced Patterns',
  description: 'Master discriminated unions, exhaustive checks, branded types, and other advanced TypeScript patterns.',
  difficulty: 'advanced',
  order: 27,
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

## The Big Picture: Advanced Patterns in Real Applications

These advanced patterns are used throughout production TypeScript codebases to ensure type safety and prevent runtime errors. Here's how they're applied:

### State Machines with Discriminated Unions
\`\`\`typescript
// Order state machine
type OrderState =
  | { status: 'pending'; createdAt: Date }
  | { status: 'confirmed'; confirmedAt: Date; estimatedDelivery: Date }
  | { status: 'shipped'; shippedAt: Date; trackingNumber: string }
  | { status: 'delivered'; deliveredAt: Date; signature?: string }
  | { status: 'cancelled'; cancelledAt: Date; reason: string };

// State transitions
function confirmOrder(order: Extract<OrderState, { status: 'pending' }>): Extract<OrderState, { status: 'confirmed' }> {
  return {
    status: 'confirmed',
    confirmedAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
}

function shipOrder(
  order: Extract<OrderState, { status: 'confirmed' }>,
  trackingNumber: string
): Extract<OrderState, { status: 'shipped' }> {
  return {
    status: 'shipped',
    shippedAt: new Date(),
    trackingNumber
  };
}

// State-specific UI rendering
function OrderStatusBadge({ order }: { order: OrderState }) {
  switch (order.status) {
    case 'pending':
      return <Badge color="gray">Pending since {order.createdAt.toDateString()}</Badge>;
    case 'confirmed':
      return <Badge color="blue">Confirmed - Arrives {order.estimatedDelivery.toDateString()}</Badge>;
    case 'shipped':
      return <Badge color="yellow">Shipped - Track: {order.trackingNumber}</Badge>;
    case 'delivered':
      return <Badge color="green">Delivered {order.deliveredAt.toDateString()}</Badge>;
    case 'cancelled':
      return <Badge color="red">Cancelled: {order.reason}</Badge>;
  }
}
\`\`\`

### Branded Types for Domain Safety
\`\`\`typescript
// Create branded type helper
type Brand<T, B> = T & { readonly __brand: B };

// ID types that can't be mixed up
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;
type ProductId = Brand<string, 'ProductId'>;

// Constructor functions
const UserId = (id: string): UserId => id as UserId;
const OrderId = (id: string): OrderId => id as OrderId;
const ProductId = (id: string): ProductId => id as ProductId;

// Validation branded types
type Email = Brand<string, 'Email'>;
type PhoneNumber = Brand<string, 'PhoneNumber'>;
type PositiveNumber = Brand<number, 'PositiveNumber'>;

function validateEmail(email: string): Email | null {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) ? email as Email : null;
}

function validatePositive(n: number): PositiveNumber | null {
  return n > 0 ? n as PositiveNumber : null;
}

// Usage ensures correct types
function getUser(id: UserId): Promise<User> { /* ... */ }
function getOrder(id: OrderId): Promise<Order> { /* ... */ }

const userId = UserId('user-123');
const orderId = OrderId('order-456');

getUser(userId);  // OK
// getUser(orderId);  // Error! OrderId is not assignable to UserId
\`\`\`

### Exhaustive Pattern Matching
\`\`\`typescript
// Assert all cases handled
function assertNever(x: never, message?: string): never {
  throw new Error(message ?? \`Unhandled case: \${JSON.stringify(x)}\`);
}

// API response handling
type ApiResponse<T> =
  | { type: 'success'; data: T }
  | { type: 'error'; error: { code: string; message: string } }
  | { type: 'loading' }
  | { type: 'idle' };

function handleResponse<T>(response: ApiResponse<T>): string {
  switch (response.type) {
    case 'success':
      return \`Got data: \${JSON.stringify(response.data)}\`;
    case 'error':
      return \`Error \${response.error.code}: \${response.error.message}\`;
    case 'loading':
      return 'Loading...';
    case 'idle':
      return 'Ready';
    default:
      return assertNever(response);
  }
}

// Adding a new type forces updating all switches
type ApiResponseV2<T> = ApiResponse<T> | { type: 'retrying'; attempt: number };

// function handleResponseV2<T>(response: ApiResponseV2<T>): string {
//   switch (response.type) {
//     // ... existing cases
//     default:
//       return assertNever(response);  // Error! 'retrying' not handled
//   }
// }
\`\`\`

### Type-Safe Event System
\`\`\`typescript
// Define event types
interface AppEvents {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string; sessionDuration: number };
  'cart:add': { productId: string; quantity: number };
  'cart:remove': { productId: string };
  'order:placed': { orderId: string; total: number };
  'order:shipped': { orderId: string; trackingNumber: string };
}

// Type-safe event emitter
class TypedEventEmitter<Events extends Record<string, any>> {
  private handlers = new Map<keyof Events, Set<Function>>();

  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    return () => this.handlers.get(event)?.delete(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.handlers.get(event)?.forEach(handler => handler(data));
  }

  once<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): () => void {
    const unsubscribe = this.on(event, (data) => {
      unsubscribe();
      handler(data);
    });
    return unsubscribe;
  }
}

const events = new TypedEventEmitter<AppEvents>();

// Fully typed - autocomplete for event names and payloads
events.on('user:login', ({ userId, timestamp }) => {
  console.log(\`User \${userId} logged in at \${timestamp}\`);
});

events.emit('cart:add', { productId: 'prod-123', quantity: 2 });
// events.emit('cart:add', { productId: 'prod-123' });  // Error! Missing quantity
\`\`\`

### Builder Pattern with Type Safety
\`\`\`typescript
// Query builder that tracks selections
class QueryBuilder<
  T extends object,
  Selected extends keyof T = never
> {
  private selections = new Set<keyof T>();
  private conditions: Array<{ field: keyof T; op: string; value: any }> = [];
  private orderByField?: keyof T;
  private orderDir: 'asc' | 'desc' = 'asc';
  private limitValue?: number;

  select<K extends keyof T>(...fields: K[]): QueryBuilder<T, Selected | K> {
    fields.forEach(f => this.selections.add(f));
    return this as any;
  }

  where<K extends keyof T>(field: K, op: '=' | '>' | '<' | 'LIKE', value: T[K]): this {
    this.conditions.push({ field, op, value });
    return this;
  }

  orderBy(field: keyof T, dir: 'asc' | 'desc' = 'asc'): this {
    this.orderByField = field;
    this.orderDir = dir;
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  build(): { selections: Set<keyof T>; conditions: typeof this.conditions } {
    return {
      selections: this.selections,
      conditions: this.conditions
    };
  }

  // Execute returns only selected fields
  async execute(): Promise<Pick<T, Selected>[]> {
    // Implementation would run actual query
    return [] as Pick<T, Selected>[];
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

// Type-safe query building
const query = new QueryBuilder<User>()
  .select('id', 'name', 'email')
  .where('age', '>', 18)
  .orderBy('createdAt', 'desc')
  .limit(10);

const users = await query.execute();
// Type: Pick<User, 'id' | 'name' | 'email'>[]

users[0].name;  // OK
// users[0].age;  // Error! 'age' not selected
\`\`\`

### Const Assertions for Immutable Configs
\`\`\`typescript
// Route configuration
const routes = {
  home: '/',
  users: '/users',
  user: (id: string) => \`/users/\${id}\`,
  products: '/products',
  product: (id: string) => \`/products/\${id}\`,
  cart: '/cart',
  checkout: '/checkout',
} as const;

// Type is readonly with literal types
type Routes = typeof routes;
// {
//   readonly home: "/";
//   readonly users: "/users";
//   readonly user: (id: string) => string;
//   ...
// }

// Extract static routes
type StaticRoutes = {
  [K in keyof Routes]: Routes[K] extends string ? Routes[K] : never;
}[keyof Routes];
// "/" | "/users" | "/products" | "/cart" | "/checkout"

// API endpoints
const api = {
  users: {
    list: { method: 'GET', path: '/api/users' },
    get: { method: 'GET', path: '/api/users/:id' },
    create: { method: 'POST', path: '/api/users' },
    update: { method: 'PUT', path: '/api/users/:id' },
    delete: { method: 'DELETE', path: '/api/users/:id' },
  },
  products: {
    list: { method: 'GET', path: '/api/products' },
    get: { method: 'GET', path: '/api/products/:id' },
  },
} as const;

// Types are fully literal
type UserEndpoints = typeof api.users;
type ListUsersMethod = typeof api.users.list.method;  // 'GET'
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
    },
    {
      id: 4,
      title: 'Exercise 4: Branded Types',
      description: `Create branded types to distinguish between structurally identical types.

**Your task:**
1. Create a branded type \`UserId\` that is a string with a brand
2. Create a branded type \`OrderId\` that is also a string with a brand
3. Write functions that accept only the correct ID type
4. Show that you cannot accidentally pass a UserId where OrderId is expected`,
      starterCode: `// Step 1: Create the brand utility type
type Brand<T, B> = T & { __brand: B };

// Step 2: Create UserId and OrderId branded types


// Step 3: Create helper functions to create branded IDs


// Step 4: Write a function that only accepts UserId


// Step 5: Test - create IDs and call the function
`,
      solution: `type Brand<T, B> = T & { __brand: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function createUserId(id: string): UserId {
  return id as UserId;
}

function createOrderId(id: string): OrderId {
  return id as OrderId;
}

function getUser(id: UserId): void {
  console.log("Getting user: " + id);
}

const userId = createUserId("user-123");
const orderId = createOrderId("order-456");

getUser(userId);
// getUser(orderId); // Would error: OrderId not assignable to UserId`,
      expectedOutput: ['Getting user: user-123'],
      hints: [
        'Brand adds a phantom __brand property for type distinction',
        'Use "as UserId" to cast regular strings to branded types',
        'Functions can require specific branded types'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is a discriminated union in TypeScript?',
      options: [
        'A union that discriminates against certain types',
        'A union where each member has a common property with a unique literal value',
        'A union of exactly two types',
        'A union that cannot be narrowed'
      ],
      correctIndex: 1,
      explanation: 'A discriminated union has a common "discriminant" property (like type or kind) with unique literal values that TypeScript can use for narrowing.'
    },
    {
      question: 'What is the purpose of branded types (nominal typing)?',
      options: [
        'To add runtime type checking',
        'To make types smaller',
        'To distinguish structurally identical types at compile time',
        'To create branded marketing for types'
      ],
      correctIndex: 2,
      explanation: 'Branded types add a phantom property to distinguish types that would otherwise be structurally identical, like UserId vs OrderId.'
    },
    {
      question: 'What does an exhaustiveness check with `assertNever` catch?',
      options: [
        'Runtime errors',
        'Missing cases in switch statements when new union members are added',
        'Null pointer exceptions',
        'Type casting errors'
      ],
      correctIndex: 1,
      explanation: 'assertNever(x: never) in the default case errors at compile time if x could still have a value, meaning you missed handling a union member.'
    },
    {
      question: 'In a discriminated union, what happens when you check the discriminant property?',
      options: [
        'Nothing special',
        'TypeScript narrows the type to the specific variant',
        'The property is removed',
        'A runtime check is added'
      ],
      correctIndex: 1,
      explanation: 'When you check the discriminant (e.g., if (x.type === "success")), TypeScript narrows x to the specific variant with that type value.'
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
