import { Lesson } from '@/types/lesson';

export const utilityTypes: Lesson = {
  slug: 'utility-types',
  title: 'Utility Types',
  description: 'Master TypeScript built-in utility types: Partial, Required, Pick, Omit, and more.',
  difficulty: 'advanced',
  order: 23,
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

## The Big Picture: Utility Types in Real Applications

Utility types are the workhorses of TypeScript, used constantly in production code to transform and adapt types. Here's how they're applied:

### API Data Transfer Objects
\`\`\`typescript
// Full database entity
interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatar: string | null;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  isVerified: boolean;
  verificationToken: string | null;
}

// Public API response - hide sensitive fields
type PublicUser = Omit<User, 'passwordHash' | 'verificationToken'>;

// Create user request - only required fields for creation
type CreateUserRequest = Pick<User, 'email' | 'name'> & { password: string };

// Update user request - partial update of allowed fields
type UpdateUserRequest = Partial<Pick<User, 'name' | 'avatar'>>;

// Admin view - everything readable
type AdminUserView = Readonly<User>;

// Login response
type LoginResponse = Pick<User, 'id' | 'email' | 'name' | 'role'> & { token: string };
\`\`\`

### State Management Patterns
\`\`\`typescript
// Base state shape
interface AppState {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
  };
}

// Select specific slices for components
type UserState = Pick<AppState, 'user'>;
type ShopState = Pick<AppState, 'products' | 'cart'>;
type UiState = Pick<AppState, 'ui'>;

// Partial state for updates
type StateUpdate = Partial<AppState>;

// Readonly state for selectors
type ImmutableState = Readonly<AppState>;

// Loading states for async data
type LoadingState<T> = {
  [K in keyof T]: T[K] | 'loading' | 'error';
};

// Action payloads
type ActionPayloads = {
  setUser: User | null;
  addToCart: CartItem;
  removeFromCart: string;
  setTheme: AppState['ui']['theme'];
};

// Generate action types
type Actions = {
  [K in keyof ActionPayloads]: { type: K; payload: ActionPayloads[K] };
}[keyof ActionPayloads];
\`\`\`

### Form Handling
\`\`\`typescript
// Registration form
interface RegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  agreeToTerms: boolean;
  newsletter: boolean;
}

// Form values (all optional during editing)
type FormValues = Partial<RegistrationForm>;

// Form errors (optional error message per field)
type FormErrors = Partial<Record<keyof RegistrationForm, string>>;

// Form touched state
type FormTouched = Partial<Record<keyof RegistrationForm, boolean>>;

// Required fields for submission
type RequiredFields = Required<Pick<RegistrationForm, 'email' | 'password' | 'name' | 'agreeToTerms'>>;

// Field validators
type FieldValidators = Record<keyof RegistrationForm, (value: unknown) => string | null>;

// Submission data (exclude UI-only fields)
type SubmissionData = Omit<RegistrationForm, 'confirmPassword' | 'agreeToTerms'>;
\`\`\`

### Function Type Manipulation
\`\`\`typescript
// Service method signatures
class UserService {
  async getUser(id: string): Promise<User> { /* ... */ }
  async createUser(data: CreateUserRequest): Promise<User> { /* ... */ }
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> { /* ... */ }
  async deleteUser(id: string): Promise<void> { /* ... */ }
}

// Extract method parameters for mocking
type GetUserParams = Parameters<UserService['getUser']>;  // [string]
type CreateUserParams = Parameters<UserService['createUser']>;  // [CreateUserRequest]

// Extract return types for testing
type GetUserReturn = ReturnType<UserService['getUser']>;  // Promise<User>
type CreateUserReturn = Awaited<ReturnType<UserService['createUser']>>;  // User

// Create mock implementation type
type MockUserService = {
  [K in keyof UserService]: jest.Mock<
    ReturnType<UserService[K]>,
    Parameters<UserService[K]>
  >;
};
\`\`\`

### Configuration Management
\`\`\`typescript
// Full configuration
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  poolSize: number;
  connectionTimeout: number;
}

// Required configuration (must be provided)
type RequiredConfig = Required<Pick<DatabaseConfig, 'host' | 'database' | 'username' | 'password'>>;

// Optional configuration (has defaults)
type OptionalConfig = Partial<Omit<DatabaseConfig, keyof RequiredConfig>>;

// Configuration input (required + optional)
type ConfigInput = RequiredConfig & OptionalConfig;

// Readonly runtime config
type RuntimeConfig = Readonly<Required<DatabaseConfig>>;

// Config with environment overrides
type EnvConfig = Record<\`DB_\${Uppercase<keyof DatabaseConfig>}\`, string | undefined>;
\`\`\`

### Component Props Patterns
\`\`\`typescript
// Base button props
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  fullWidth: boolean;
  icon: React.ReactNode;
  className: string;
}

// Common usage - most props optional
type StandardButtonProps = Required<Pick<ButtonProps, 'children'>> &
  Partial<Omit<ButtonProps, 'children'>>;

// Icon button - different required props
type IconButtonProps = Required<Pick<ButtonProps, 'icon' | 'onClick'>> &
  Partial<Omit<ButtonProps, 'icon' | 'onClick' | 'children'>>;

// Link button - no onClick
type LinkButtonProps = Omit<StandardButtonProps, 'onClick'> & { href: string };

// Native button props
type NativeButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps>;

// Combined props
type FullButtonProps = StandardButtonProps & NativeButtonProps;
\`\`\`

### Type Filtering
\`\`\`typescript
// All possible event types
type EventType = 'click' | 'hover' | 'focus' | 'blur' | 'submit' | 'change' | 'scroll' | 'resize';

// Mouse events only
type MouseEvents = Extract<EventType, 'click' | 'hover' | 'scroll'>;  // 'click' | 'hover' | 'scroll'

// Form events only
type FormEvents = Extract<EventType, 'submit' | 'change' | 'focus' | 'blur'>;  // all four

// Exclude deprecated events
type SupportedEvents = Exclude<EventType, 'hover'>;  // all except 'hover'

// Response types
type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' }
  | null
  | undefined;

// Remove null/undefined
type DefiniteResult<T> = NonNullable<ApiResult<T>>;

// Extract only success case
type SuccessResult<T> = Extract<ApiResult<T>, { status: 'success' }>;
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
    },
    {
      id: 4,
      title: 'Exercise 4: Combining Utility Types',
      description: `Combine multiple utility types to create complex transformations.

**Your task:**
1. Define a User type with id, name, email, and password properties
2. Create a PublicUser type using Omit to remove password
3. Create a UserUpdate type using Partial and Omit (all fields optional except id)
4. Create objects of each type and log them`,
      starterCode: `// Step 1: Define User type


// Step 2: Create PublicUser (no password)


// Step 3: Create UserUpdate (partial without id, but id is required)
// Hint: Combine Partial<Omit<...>> with Pick<...> using &


// Step 4: Create objects and log
`,
      solution: `type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

type PublicUser = Omit<User, "password">;

type UserUpdate = Pick<User, "id"> & Partial<Omit<User, "id">>;

let publicUser: PublicUser = { id: 1, name: "Alice", email: "alice@test.com" };
let update: UserUpdate = { id: 1, name: "Alicia" };

console.log(publicUser.name);
console.log(update.name);`,
      expectedOutput: ['Alice', 'Alicia'],
      hints: [
        'Omit<User, "password"> removes the password field',
        'Pick<User, "id"> keeps only id',
        'Use & to combine required and optional parts'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does `Partial<T>` do to a type?',
      options: [
        'Removes some properties from T',
        'Makes all properties of T optional',
        'Makes all properties of T required',
        'Creates a partial copy of T at runtime'
      ],
      correctIndex: 1,
      explanation: 'Partial<T> makes all properties of T optional by adding ? to each property.'
    },
    {
      question: 'What is the difference between `Pick<T, K>` and `Omit<T, K>`?',
      options: [
        'Pick removes K; Omit keeps K',
        'Pick keeps only K; Omit removes K',
        'They are the same',
        'Pick works with types; Omit works with interfaces'
      ],
      correctIndex: 1,
      explanation: 'Pick<T, K> creates a type with only the properties in K. Omit<T, K> creates a type without the properties in K.'
    },
    {
      question: 'What does `Required<T>` do?',
      options: [
        'Throws if any property is missing at runtime',
        'Makes all optional properties required',
        'Adds validation to the type',
        'Requires T to be a specific type'
      ],
      correctIndex: 1,
      explanation: 'Required<T> is the opposite of Partial - it removes the optional modifier (?) from all properties.'
    },
    {
      question: 'What does `Readonly<T>` prevent?',
      options: [
        'Reading properties',
        'Reassigning property values after creation',
        'Creating new objects of type T',
        'Extending the type'
      ],
      correctIndex: 1,
      explanation: 'Readonly<T> makes all properties readonly, preventing reassignment of property values (though nested objects can still be mutated).'
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
