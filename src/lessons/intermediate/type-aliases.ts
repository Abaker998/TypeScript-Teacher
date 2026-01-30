import { Lesson } from '@/types/lesson';

export const typeAliases: Lesson = {
  slug: 'type-aliases',
  title: 'Type Aliases',
  description: 'Create custom type names to make your code more readable and maintainable.',
  difficulty: 'intermediate',
  order: 11,
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

## The Big Picture: Type Aliases in Real Applications

Type aliases are essential for creating expressive, self-documenting type systems. Here's how they're used in production:

### Domain-Specific Types
\`\`\`typescript
// E-commerce domain types
type ProductId = string;
type SKU = string;
type Price = number;
type Quantity = number;
type Percentage = number;

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
type OrderStatus = 'created' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
type ShippingMethod = 'standard' | 'express' | 'overnight' | 'pickup';

type Money = {
  amount: Price;
  currency: Currency;
};

type CartItem = {
  productId: ProductId;
  sku: SKU;
  quantity: Quantity;
  unitPrice: Money;
  discount?: Percentage;
};

type Order = {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: Money;
  tax: Money;
  shipping: Money;
  total: Money;
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethod;
  createdAt: Date;
};
\`\`\`

### API Response Types
\`\`\`typescript
// Flexible API response patterns
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

type ApiError = {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, string>;
};

type PaginatedResult<T> = {
  items: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Specific API responses
type UserResponse = ApiResult<User>;
type UsersResponse = ApiResult<PaginatedResult<User>>;
type ProductResponse = ApiResult<Product>;
type OrdersResponse = ApiResult<PaginatedResult<Order>>;

// Usage
async function fetchUsers(): Promise<UsersResponse> {
  const response = await fetch('/api/users');
  return response.json();
}

const result = await fetchUsers();
if (result.success) {
  console.log(result.data.items);  // User[]
  console.log(result.data.pagination.total);
} else {
  console.error(result.error.message);
}
\`\`\`

### UI State Types
\`\`\`typescript
// Comprehensive UI state modeling
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

type AsyncData<T> =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'success'; data: T }
  | { state: 'error'; error: Error };

// Form state
type FormFieldState = {
  value: string;
  touched: boolean;
  error: string | null;
};

type FormState<T extends Record<string, unknown>> = {
  fields: { [K in keyof T]: FormFieldState };
  isValid: boolean;
  isSubmitting: boolean;
  submitError: string | null;
};

// Modal state
type ModalState =
  | { isOpen: false }
  | { isOpen: true; type: 'confirm'; message: string; onConfirm: () => void }
  | { isOpen: true; type: 'alert'; message: string }
  | { isOpen: true; type: 'form'; formId: string };

// Toast notifications
type ToastType = 'info' | 'success' | 'warning' | 'error';
type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
};
\`\`\`

### Function Types
\`\`\`typescript
// Event handlers
type EventHandler<E = Event> = (event: E) => void;
type ClickHandler = EventHandler<MouseEvent>;
type ChangeHandler = EventHandler<React.ChangeEvent<HTMLInputElement>>;
type SubmitHandler = EventHandler<React.FormEvent>;

// Callbacks
type Callback<T = void> = () => T;
type AsyncCallback<T = void> = () => Promise<T>;
type Predicate<T> = (value: T) => boolean;
type Mapper<T, U> = (value: T) => U;
type Reducer<T, A> = (accumulator: A, value: T) => A;
type Comparator<T> = (a: T, b: T) => number;

// Middleware pattern
type Middleware<T> = (value: T, next: (value: T) => T) => T;

// Validation
type Validator<T> = (value: T) => ValidationResult;
type ValidationResult = { valid: true } | { valid: false; errors: string[] };

// Examples in use
const isAdult: Predicate<User> = (user) => user.age >= 18;
const getName: Mapper<User, string> = (user) => user.name;
const sortByAge: Comparator<User> = (a, b) => a.age - b.age;

const adults = users.filter(isAdult);
const names = users.map(getName);
users.sort(sortByAge);
\`\`\`

### Utility Types
\`\`\`typescript
// Build reusable utility types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type WithId<T> = T & { id: string };
type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date };
type Timestamped<T> = WithId<WithTimestamps<T>>;

// Usage
type UserInput = { name: string; email: string };
type User = Timestamped<UserInput>;
// User = { id: string; name: string; email: string; createdAt: Date; updatedAt: Date }

type NullableUser = Nullable<User>;  // User | null
type PartialUser = DeepPartial<User>;  // All fields optional, nested too
\`\`\`

### Action Types (Redux/State Management)
\`\`\`typescript
// Type-safe action creators
type Action<T extends string = string, P = undefined> = P extends undefined
  ? { type: T }
  : { type: T; payload: P };

// Define all actions for a feature
type UserActions =
  | Action<'FETCH_USERS_START'>
  | Action<'FETCH_USERS_SUCCESS', User[]>
  | Action<'FETCH_USERS_ERROR', string>
  | Action<'SELECT_USER', string>
  | Action<'UPDATE_USER', { id: string; updates: Partial<User> }>
  | Action<'DELETE_USER', string>;

type CartActions =
  | Action<'ADD_TO_CART', { productId: string; quantity: number }>
  | Action<'REMOVE_FROM_CART', string>
  | Action<'UPDATE_QUANTITY', { productId: string; quantity: number }>
  | Action<'CLEAR_CART'>;

// Reducer type
type Reducer<S, A extends Action> = (state: S, action: A) => S;

// Usage
const userReducer: Reducer<UsersState, UserActions> = (state, action) => {
  switch (action.type) {
    case 'FETCH_USERS_SUCCESS':
      return { ...state, users: action.payload };  // payload is User[]
    case 'SELECT_USER':
      return { ...state, selectedId: action.payload };  // payload is string
    default:
      return state;
  }
};
\`\`\`

### Configuration Types
\`\`\`typescript
// Feature flags
type FeatureFlag = 'newDashboard' | 'betaCheckout' | 'darkMode' | 'analytics';
type FeatureFlags = Record<FeatureFlag, boolean>;

// Environment configuration
type Environment = 'development' | 'staging' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type Config = {
  environment: Environment;
  apiUrl: string;
  logLevel: LogLevel;
  features: FeatureFlags;
  limits: {
    maxUploadSize: number;
    maxRequestsPerMinute: number;
    sessionTimeout: number;
  };
};

// Type-safe config access
const config: Config = {
  environment: 'development',
  apiUrl: 'http://localhost:3000',
  logLevel: 'debug',
  features: {
    newDashboard: true,
    betaCheckout: false,
    darkMode: true,
    analytics: false
  },
  limits: {
    maxUploadSize: 10 * 1024 * 1024,
    maxRequestsPerMinute: 100,
    sessionTimeout: 30 * 60 * 1000
  }
};
\`\`\`

### Database/ORM Types
\`\`\`typescript
// Query builder types
type SortOrder = 'asc' | 'desc';
type ComparisonOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';

type WhereClause<T> = {
  [K in keyof T]?: T[K] | { op: ComparisonOperator; value: T[K] | T[K][] };
};

type QueryOptions<T> = {
  where?: WhereClause<T>;
  orderBy?: { field: keyof T; order: SortOrder }[];
  limit?: number;
  offset?: number;
  include?: string[];
};

// Type-safe queries
const query: QueryOptions<User> = {
  where: {
    age: { op: 'gte', value: 18 },
    status: 'active'
  },
  orderBy: [{ field: 'createdAt', order: 'desc' }],
  limit: 10
};
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
    },
    {
      id: 4,
      title: 'Exercise 4: Intersection Types',
      description: `Intersection types combine multiple types into one using &.

**Your task:**
1. Create a \`HasName\` type with name: string
2. Create a \`HasAge\` type with age: number
3. Create a \`Person\` type that is the intersection of both (HasName & HasAge)
4. Create a person object and print their name and age

**Intersection syntax:** \`type Combined = TypeA & TypeB;\``,
      starterCode: `// Step 1: Create HasName type


// Step 2: Create HasAge type


// Step 3: Create Person as intersection of both


// Step 4: Create a person and print name and age

`,
      solution: `type HasName = {
  name: string;
};

type HasAge = {
  age: number;
};

type Person = HasName & HasAge;

const person: Person = {
  name: "Alice",
  age: 30
};

console.log(person.name);
console.log(person.age);`,
      expectedOutput: ['Alice', '30'],
      hints: [
        'type HasName = { name: string };',
        'type HasAge = { age: number };',
        'type Person = HasName & HasAge;',
        'A Person must have BOTH name AND age properties'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the difference between a type alias and an interface?',
      options: [
        'They are exactly the same',
        'Type aliases can represent unions/primitives; interfaces are for object shapes',
        'Interfaces are faster at runtime',
        'Type aliases can only be used with classes'
      ],
      correctIndex: 1,
      explanation: 'Type aliases are more flexible - they can represent unions, primitives, tuples. Interfaces are specifically for object shapes and can be extended/merged.'
    },
    {
      question: 'What does the & operator do in TypeScript types?',
      options: [
        'Creates a union of two types',
        'Checks if two types are equal',
        'Creates an intersection - combines properties from both types',
        'Subtracts properties from a type'
      ],
      correctIndex: 2,
      explanation: 'The & operator creates an intersection type. The resulting type must have ALL properties from BOTH types.'
    },
    {
      question: 'What is the type of: type Status = "active" | "inactive"?',
      options: [
        'string',
        'boolean',
        'A union of string literals',
        'An array of strings'
      ],
      correctIndex: 2,
      explanation: 'This is a union of string literal types. A variable of type Status can only be exactly "active" or "inactive" - not any string.'
    },
    {
      question: 'Which is the correct syntax for a function type alias?',
      options: [
        'type Fn = function(x: number): string',
        'type Fn = (x: number) => string',
        'type Fn = { function(x: number): string }',
        'function type Fn(x: number): string'
      ],
      correctIndex: 1,
      explanation: 'Function type aliases use arrow syntax: type Fn = (params) => returnType. This describes the function signature.'
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
