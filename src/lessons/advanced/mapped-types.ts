import { Lesson } from '@/types/lesson';

export const mappedTypes: Lesson = {
  slug: 'mapped-types',
  title: 'Mapped Types',
  description: 'Transform object types by iterating over their keys and creating new types programmatically.',
  difficulty: 'advanced',
  order: 21,
  content: `
# Mapped Types

Mapped types transform an existing type into a new one by iterating over its keys. They let you programmatically create new types based on existing ones.

## The Pattern: in keyof

The basic syntax uses a loop through keys:

\`\`\`typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// Result: { readonly name: string; readonly age: number; }
\`\`\`

The \`keyof T\` extracts all property names from type T. The \`in\` keyword iterates over them. \`T[K]\` accesses the property type.

## Built-in Mapped Types

TypeScript includes useful mapped types in its standard library:

- **Partial<T>** — makes all properties optional
- **Required<T>** — makes all properties required
- **Readonly<T>** — makes all properties readonly
- **Record<K, V>** — creates an object with keys K and values V
- **Pick<T, K>** — selects specific properties from T
- **Omit<T, K>** — removes specific properties from T

\`\`\`typescript
interface User {
  name: string;
  email: string;
  age?: number;
}

type PartialUser = Partial<User>;
// All properties become optional

type NameAndEmail = Pick<User, "name" | "email">;
// Only name and email

type NoEmail = Omit<User, "email">;
// Everything except email
\`\`\`

## Custom Mapped Types

You can write your own for custom transformations:

\`\`\`typescript
type Getters<T> = {
  [K in keyof T]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// Result: { name: () => string; age: () => number; }
\`\`\`

This transforms object properties into getter functions.

## Practical Example

\`\`\`typescript
type BooleanFlags<T> = {
  [K in keyof T]: boolean;
};

interface Settings {
  darkMode: string;
  notifications: string;
  autoSave: string;
}

type SettingsFlags = BooleanFlags<Settings>;
// Result: { darkMode: boolean; notifications: boolean; autoSave: boolean; }
\`\`\`

Perfect when you need the same keys but different value types.

## The Big Picture: Mapped Types in Real Applications

Mapped types are fundamental for creating flexible, DRY type definitions in production applications. Here's how they're used:

### Form State Management
\`\`\`typescript
// Create form state types from a data model
interface UserForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Track which fields have been touched
type TouchedFields<T> = {
  [K in keyof T]: boolean;
};

// Track field errors
type FieldErrors<T> = {
  [K in keyof T]?: string;
};

// Track field validation state
type ValidationState<T> = {
  [K in keyof T]: 'valid' | 'invalid' | 'pending';
};

// Complete form state
interface FormState<T> {
  values: T;
  touched: TouchedFields<T>;
  errors: FieldErrors<T>;
  validation: ValidationState<T>;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Usage
const userFormState: FormState<UserForm> = {
  values: { username: '', email: '', password: '', confirmPassword: '' },
  touched: { username: false, email: false, password: false, confirmPassword: false },
  errors: {},
  validation: { username: 'pending', email: 'pending', password: 'pending', confirmPassword: 'pending' },
  isDirty: false,
  isSubmitting: false
};
\`\`\`

### API Request/Response Transformations
\`\`\`typescript
// Transform API response types for frontend use
interface ApiUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  created_at: string;
  updated_at: string;
}

// Make all fields optional for PATCH requests
type UpdateUserRequest = Partial<ApiUser>;

// Omit server-managed fields for POST requests
type CreateUserRequest = Omit<ApiUser, 'user_id' | 'created_at' | 'updated_at'>;

// Transform to camelCase type (conceptually)
type CamelCase<T> = {
  [K in keyof T as CamelCaseKey<K>]: T[K];
};

// Create async loaders for each field
type AsyncLoaders<T> = {
  [K in keyof T as \`load\${Capitalize<K & string>}\`]: () => Promise<T[K]>;
};

type UserLoaders = AsyncLoaders<{ name: string; email: string; avatar: string }>;
// { loadName: () => Promise<string>; loadEmail: () => Promise<string>; loadAvatar: () => Promise<string> }
\`\`\`

### Redux State Slices
\`\`\`typescript
// Create loading/error states for each data slice
interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

type SliceStates<T> = {
  [K in keyof T]: DataState<T[K]>;
};

// Define data types
interface AppData {
  users: User[];
  products: Product[];
  orders: Order[];
}

// Automatically generate state shape
type AppState = SliceStates<AppData>;
// {
//   users: DataState<User[]>;
//   products: DataState<Product[]>;
//   orders: DataState<Order[]>;
// }

// Create selectors for each slice
type Selectors<T> = {
  [K in keyof T as \`select\${Capitalize<K & string>}\`]: (state: { [P in K]: T[K] }) => T[K];
};
\`\`\`

### Component Props Transformations
\`\`\`typescript
// Base component props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  loading: boolean;
}

// Make all props optional with defaults
type OptionalProps<T> = {
  [K in keyof T]?: T[K];
};

// Create controlled/uncontrolled variants
type ControlledProps<T> = {
  [K in keyof T as \`\${K & string}Value\`]: T[K];
} & {
  [K in keyof T as \`onChange\${Capitalize<K & string>}\`]: (value: T[K]) => void;
};

// Generate test props with mock values
type MockProps<T> = {
  [K in keyof T]: T[K] extends string ? 'mock-string'
    : T[K] extends number ? 0
    : T[K] extends boolean ? false
    : T[K];
};
\`\`\`

### Database Model Utilities
\`\`\`typescript
// Base entity with common fields
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Remove base fields for create operations
type CreateInput<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

// Make non-id fields optional for update operations
type UpdateInput<T extends BaseEntity> = Partial<Omit<T, 'id'>> & Pick<T, 'id'>;

// Add relation loading flags
type WithRelations<T, Relations extends string> = T & {
  [K in Relations]?: unknown;
};

// Example entity
interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

type CreateUser = CreateInput<User>;
// { email: string; name: string; role: 'admin' | 'user' }

type UpdateUser = UpdateInput<User>;
// { id: string; email?: string; name?: string; role?: 'admin' | 'user'; createdAt?: Date; ... }
\`\`\`

### Event Handler Maps
\`\`\`typescript
// Define event payloads
interface EventPayloads {
  userCreated: { userId: string; email: string };
  userUpdated: { userId: string; changes: Partial<User> };
  userDeleted: { userId: string };
  orderPlaced: { orderId: string; items: OrderItem[] };
  orderShipped: { orderId: string; trackingNumber: string };
}

// Generate handler type for each event
type EventHandlers<T> = {
  [K in keyof T]: (payload: T[K]) => void | Promise<void>;
};

// Generate async handler type
type AsyncEventHandlers<T> = {
  [K in keyof T]: (payload: T[K]) => Promise<void>;
};

// Event subscription methods
type EventSubscriptions<T> = {
  [K in keyof T as \`on\${Capitalize<K & string>}\`]: (handler: (payload: T[K]) => void) => () => void;
};

type AppEventSubscriptions = EventSubscriptions<EventPayloads>;
// {
//   onUserCreated: (handler: (payload: { userId: string; email: string }) => void) => () => void;
//   onUserUpdated: ...
//   ...
// }
\`\`\`

### Configuration Schemas
\`\`\`typescript
// Define configuration shape
interface AppConfig {
  apiUrl: string;
  apiKey: string;
  timeout: number;
  retries: number;
  debug: boolean;
}

// Environment variable names (uppercase with prefix)
type EnvVarNames<T, Prefix extends string = 'APP'> = {
  [K in keyof T as \`\${Prefix}_\${Uppercase<K & string>}\`]: string;
};

type AppEnvVars = EnvVarNames<AppConfig>;
// { APP_APIURL: string; APP_APIKEY: string; APP_TIMEOUT: string; ... }

// Validation functions for each config field
type ConfigValidators<T> = {
  [K in keyof T]: (value: unknown) => T[K];
};

// Default values (same shape, all optional)
type ConfigDefaults<T> = {
  [K in keyof T]?: T[K];
};
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Understand mapped type syntax with in keyof
- Use built-in mapped types like Partial and Required
- Transform property types across an object
- Write custom mapped types for domain-specific logic
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Using Built-in Mapped Types',
      description: `Transform object properties into getter functions using a mapped type.

**Your task:**
1. Define a mapped type \`Getters<T>\` that converts each property to a function returning that type
2. Create the \`Config\` interface with \`timeout: number\` and \`url: string\`
3. Apply \`Getters\` to create \`ConfigGetters\`
4. Create a \`config\` object with getter functions and log their return values`,
      starterCode: `// Step 1: Define the Getters<T> mapped type


// Step 2: Create the Config interface


// Step 3: Apply Getters to Config


// Step 4: Create config object and log values
`,
      solution: `type Getters<T> = {
  [K in keyof T]: () => T[K];
};

interface Config {
  timeout: number;
  url: string;
}

type ConfigGetters = Getters<Config>;
// Result: { timeout: () => number; url: () => string; }

const config: ConfigGetters = {
  timeout: () => 5000,
  url: () => "http://api.example.com"
};

console.log(config.timeout());
console.log(config.url());`,
      expectedOutput: ['5000', 'http://api.example.com'],
      hints: [
        'Mapped type syntax: { [K in keyof T]: NewType }',
        'For getters, use () => T[K] as the value type',
        'Call the functions when logging: config.timeout()'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Creating Custom Mapped Type',
      description: `Create a mapped type that adds null as a possible value for every property.

**Your task:**
1. Define a \`Nullable<T>\` mapped type using union with \`null\`
2. Create a \`User\` interface with \`id\`, \`name\`, and \`email\`
3. Apply \`Nullable\` to create \`NullableUser\`
4. Create a user object with \`email: null\` and log all three properties`,
      starterCode: `// Step 1: Define the Nullable<T> mapped type


// Step 2: Create the User interface


// Step 3: Apply Nullable to User


// Step 4: Create object with null email and log values
`,
      solution: `type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  id: number;
  name: string;
  email: string;
}

type NullableUser = Nullable<User>;

const partialUser: NullableUser = {
  id: 1,
  name: "Alice",
  email: null  // Can be null now
};

console.log(partialUser.id);
console.log(partialUser.name);
console.log(partialUser.email);`,
      expectedOutput: ['1', 'Alice', 'null'],
      hints: [
        'Use T[K] | null to allow null for each property',
        'keyof T extracts all property names as a union',
        'T[K] accesses the type of property K'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Combining Mapped Types',
      description: `Create setter methods from properties, then make them optional using Partial.

**Your task:**
1. Define a \`Methods<T>\` type where each property becomes \`(value: T[K]) => void\`
2. Define \`OptionalMethods<T>\` as \`Partial<Methods<T>>\`
3. Create a \`Settings\` interface with \`theme: string\` and \`volume: number\`
4. Create a handlers object with only the \`theme\` setter and test it`,
      starterCode: `// Step 1: Define the Methods<T> mapped type


// Step 2: Define OptionalMethods using Partial


// Step 3: Create the Settings interface


// Step 4: Create handlers with only theme setter
`,
      solution: `type Methods<T> = {
  [K in keyof T]: (value: T[K]) => void;
};

type OptionalMethods<T> = Partial<Methods<T>>;

interface Settings {
  theme: string;
  volume: number;
}

type SettingsMethods = Methods<Settings>;
type OptionalSettingsMethods = OptionalMethods<Settings>;

const handlers: OptionalSettingsMethods = {
  theme: (value) => console.log("Theme set to: " + value)
  // volume is optional, so we can omit it
};

handlers.theme?.("dark");
console.log("Volume handler exists: " + (handlers.volume !== undefined));`,
      expectedOutput: ['Theme set to: dark', 'Volume handler exists: false'],
      hints: [
        'Setter type: (value: T[K]) => void',
        'Compose types: Partial<Methods<T>>',
        'Use optional chaining (?.) for possibly undefined methods'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Key Remapping',
      description: `Use key remapping with \`as\` to transform property names in a mapped type.

**Your task:**
1. Create a type \`Getters<T>\` that transforms each property into a getter method
2. For a property \`name: string\`, create \`getName: () => string\`
3. Use template literal types with \`as\` for remapping
4. Apply it to a Person type and create an object with the getter methods`,
      starterCode: `// Step 1: Create the Getters type
// Syntax: { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] }


// Step 2: Define a Person type with name and age


// Step 3: Create a person object


// Step 4: Create a getter object and call getName
`,
      solution: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
};

type Person = { name: string; age: number };

let person: Person = { name: "Alice", age: 30 };

let getters: Getters<Person> = {
  getName: () => person.name,
  getAge: () => person.age
};

console.log(getters.getName());`,
      expectedOutput: ['Alice'],
      hints: [
        'as clause remaps keys: as `get\${Capitalize<...>}`',
        'Capitalize<string & K> capitalizes the property name',
        'Each property becomes a getter function'
      ],
    },
  ],
  quiz: [
    {
      question: 'What does `[K in keyof T]` mean in a mapped type?',
      options: [
        'Creates a new key K on type T',
        'Iterates over each key K in type T to create new properties',
        'Removes key K from type T',
        'Checks if K is a valid key of T'
      ],
      correctIndex: 1,
      explanation: 'The [K in keyof T] syntax iterates over each key in T, creating a new property for each one in the resulting type.'
    },
    {
      question: 'What does the `-readonly` modifier do in a mapped type?',
      options: [
        'Makes all properties readonly',
        'Removes the readonly modifier from properties',
        'Creates a new readonly property',
        'Prevents the type from being modified'
      ],
      correctIndex: 1,
      explanation: 'The - prefix removes a modifier. -readonly removes readonly, making properties mutable.'
    },
    {
      question: 'What is `Record<K, V>` equivalent to?',
      options: [
        '{ K: V }',
        '{ [key: K]: V }',
        '{ [P in K]: V }',
        'K extends V'
      ],
      correctIndex: 2,
      explanation: 'Record<K, V> is a mapped type that creates an object with keys from K and values of type V: { [P in K]: V }'
    },
    {
      question: 'What does `as` do in a mapped type like `[K in keyof T as NewKey]`?',
      options: [
        'Casts the value to a new type',
        'Remaps the key to a different name',
        'Creates an alias for the type',
        'Asserts the key exists'
      ],
      correctIndex: 1,
      explanation: 'The as clause in mapped types allows you to remap keys to different names, including using template literal types.'
    }
  ],
  buildNote: {
    title: 'Mapped Types in the App',
    explanation: `The app uses \`Record<Difficulty, number>\` extensively throughout \`src/lessons/index.ts\` — this is a mapped type that creates an object with keys from the \`Difficulty\` union and values of type \`number\`. The helper function \`getLessonsByDifficulty()\` uses \`Record<Difficulty, string>\` to map each difficulty level to its display label ("Beginner", "Intermediate", "Advanced"). When you define \`const labels: Record<Difficulty, string> = { beginner: '...', ... }\`, TypeScript verifies you've provided all three keys — if you forget "advanced", you get a compile error. Another example: the app could compute \`lessonCounts: Record<Difficulty, number>\` to track how many lessons are in each category. Mapped types are powerful because they enforce consistency — if the Difficulty type changes to include "expert", all your Record types would immediately show errors, forcing you to update them. This prevents the subtle bugs where you forget to handle a new difficulty level in some utility function. Pick, Omit, and Partial are also mapped types that transform existing types into new variants by modifying their properties.`,
    relatedFiles: [
      'src/lessons/index.ts',
      'src/components/Sidebar.tsx',
      'src/lib/lesson-utils.ts'
    ],
    inTheRealWorld: `Mapped types are powerful in large codebases. GraphQL clients use \`type FieldMap<T> = { [K in keyof T]: T[K] | null }\` to add nullable variants of fields. Component libraries use \`type Disabled<T> = { [K in keyof T]: boolean }\` to control which props are disabled. Form validation libraries use mapped types to create error objects matching form shapes. CSS-in-JS libraries use them to ensure style objects match component prop types. Testing libraries use mapped types to create test suites that mirror interface properties, ensuring comprehensive test coverage.`
  }
};
