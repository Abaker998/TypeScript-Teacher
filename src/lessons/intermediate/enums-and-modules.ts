import { Lesson } from '@/types/lesson';

export const enumsAndModules: Lesson = {
  slug: 'enums-and-modules',
  title: 'Enums & Modules',
  description: 'Learn to use enums for named constants and organize code with modules.',
  difficulty: 'intermediate',
  order: 16,
  content: `
# Enums & Modules

Enums provide named constants, and modules help organize code into reusable pieces.

## Numeric Enums

By default, enums are numbered starting from 0:

\`\`\`typescript
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right   // 3
}

let move: Direction = Direction.Up;
console.log(move);  // 0
\`\`\`

## Custom Numeric Values

Set specific numbers:

\`\`\`typescript
enum StatusCode {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}

console.log(StatusCode.OK);  // 200
\`\`\`

## String Enums

More readable in output:

\`\`\`typescript
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}

let favorite: Color = Color.Red;
console.log(favorite);  // "RED"
\`\`\`

## When to Use Enums

Enums are great for:
- Status codes
- Directions
- Days of the week
- Configuration options
- Any fixed set of related constants

\`\`\`typescript
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR"
}

function log(message: string, level: LogLevel) {
  console.log(\`[\${level}] \${message}\`);
}

log("Starting app", LogLevel.Info);
\`\`\`

## Enums vs Union Types

For simple cases, union types work too:

\`\`\`typescript
// Enum approach
enum Status {
  Active = "active",
  Inactive = "inactive"
}

// Union type approach
type Status = "active" | "inactive";
\`\`\`

Use enums when you need:
- Numeric values
- Reverse mapping
- Runtime object

Use unions when you just need string literals.

## Modules Basics

TypeScript uses ES modules with import/export:

\`\`\`typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

// main.ts
import { add, PI } from "./math";
console.log(add(2, 3));  // 5
\`\`\`

## Default Exports

One default export per file:

\`\`\`typescript
// greet.ts
export default function greet(name: string): string {
  return "Hello, " + name;
}

// main.ts
import greet from "./greet";  // No braces needed
console.log(greet("World"));
\`\`\`

## Named vs Default Exports

\`\`\`typescript
// Named exports (can have many)
export function foo() {}
export function bar() {}

// Default export (one per file)
export default function main() {}

// Importing
import main, { foo, bar } from "./module";
\`\`\`

## Re-exporting

Combine exports from multiple files:

\`\`\`typescript
// index.ts (barrel file)
export { User } from "./user";
export { Product } from "./product";
export { Order } from "./order";

// main.ts
import { User, Product, Order } from "./models";
\`\`\`

## Type-Only Imports

Import types without runtime code:

\`\`\`typescript
import type { User } from "./types";

// This import is erased at compile time
// Use when you only need the type, not the value
\`\`\`

## Module Organization

Typical project structure:

\`\`\`
src/
  types/
    index.ts      (type definitions)
  utils/
    math.ts
    strings.ts
    index.ts      (re-exports)
  components/
    Button.tsx
    index.ts
  index.ts        (main entry)
\`\`\`

## The Big Picture: Enums & Modules in Real Applications

Enums and modules are fundamental to organizing professional codebases. Here's how they're used in production:

### Application Configuration Enums
\`\`\`typescript
// Environment and feature configuration
enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production'
}

enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
  Critical = 4
}

enum FeatureFlag {
  NewDashboard = 'new_dashboard',
  BetaCheckout = 'beta_checkout',
  DarkMode = 'dark_mode',
  AIAssistant = 'ai_assistant'
}

// Configuration based on environment
const config = {
  environment: Environment.Production,
  logLevel: Environment.Production === Environment.Development
    ? LogLevel.Debug
    : LogLevel.Warning,
  apiUrl: {
    [Environment.Development]: 'http://localhost:3000',
    [Environment.Staging]: 'https://staging-api.example.com',
    [Environment.Production]: 'https://api.example.com'
  }[Environment.Production]
};
\`\`\`

### HTTP and API Enums
\`\`\`typescript
// HTTP status codes
enum HttpStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503
}

// HTTP methods
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// API response handling
function handleResponse(status: HttpStatus): void {
  if (status >= HttpStatus.OK && status < 300) {
    console.log('Success');
  } else if (status === HttpStatus.Unauthorized) {
    redirectToLogin();
  } else if (status === HttpStatus.TooManyRequests) {
    showRateLimitWarning();
  } else if (status >= HttpStatus.InternalServerError) {
    showServerError();
  }
}
\`\`\`

### User Permissions and Roles
\`\`\`typescript
// Role-based access control
enum UserRole {
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin',
  SuperAdmin = 'super_admin'
}

enum Permission {
  Read = 1,
  Write = 2,
  Delete = 4,
  Manage = 8,
  Admin = 16
}

// Bitwise permissions
const rolePermissions: Record<UserRole, number> = {
  [UserRole.Guest]: Permission.Read,
  [UserRole.User]: Permission.Read | Permission.Write,
  [UserRole.Moderator]: Permission.Read | Permission.Write | Permission.Delete,
  [UserRole.Admin]: Permission.Read | Permission.Write | Permission.Delete | Permission.Manage,
  [UserRole.SuperAdmin]: Permission.Read | Permission.Write | Permission.Delete | Permission.Manage | Permission.Admin
};

function hasPermission(role: UserRole, permission: Permission): boolean {
  return (rolePermissions[role] & permission) === permission;
}

// Usage
hasPermission(UserRole.Moderator, Permission.Delete);  // true
hasPermission(UserRole.User, Permission.Delete);       // false
\`\`\`

### Module Organization - Feature-Based
\`\`\`typescript
// src/features/auth/index.ts (barrel file)
export { AuthProvider, useAuth } from './context';
export { LoginForm, SignupForm, LogoutButton } from './components';
export { authReducer } from './reducer';
export { login, logout, signup, refreshToken } from './actions';
export type { AuthState, AuthAction, Credentials } from './types';

// src/features/auth/types.ts
export interface Credentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

// src/features/auth/actions.ts
import type { Credentials } from './types';
import { api } from '@/services/api';

export async function login(credentials: Credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

// Usage from anywhere in the app
import { useAuth, login, type Credentials } from '@/features/auth';
\`\`\`

### Service Layer Modules
\`\`\`typescript
// src/services/index.ts
export { ApiService } from './api';
export { AuthService } from './auth';
export { StorageService } from './storage';
export { AnalyticsService } from './analytics';

// src/services/api.ts
import type { ApiResponse } from '@/types';

class ApiServiceImpl {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export const ApiService = new ApiServiceImpl(process.env.API_URL!);
\`\`\`

### Component Library Organization
\`\`\`typescript
// src/components/ui/index.ts
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Select, type SelectProps } from './Select';
export { Modal, type ModalProps } from './Modal';
export { Card, type CardProps } from './Card';
export { Badge, type BadgeProps } from './Badge';

// src/components/forms/index.ts
export { Form, type FormProps } from './Form';
export { FormField, type FormFieldProps } from './FormField';
export { FormError, type FormErrorProps } from './FormError';
export { useForm } from './useForm';

// src/components/layout/index.ts
export { Header } from './Header';
export { Footer } from './Footer';
export { Sidebar } from './Sidebar';
export { PageLayout } from './PageLayout';

// Usage
import { Button, Input, Modal } from '@/components/ui';
import { Form, FormField, useForm } from '@/components/forms';
import { PageLayout } from '@/components/layout';
\`\`\`

### Type-Only Module Exports
\`\`\`typescript
// src/types/api.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
}

// src/types/index.ts
export type { User, Product, Order } from './api';
export type { AppState, AppAction } from './state';
export type { Theme, ThemeColors } from './theme';

// Usage - types are erased at compile time
import type { User, Product } from '@/types';
\`\`\`

### Constants and Configuration Modules
\`\`\`typescript
// src/constants/index.ts
export * from './routes';
export * from './api';
export * from './validation';

// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => \`/products/\${id}\`,
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => \`/orders/\${id}\`
} as const;

// src/constants/api.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  USERS: {
    ME: '/users/me',
    BY_ID: (id: string) => \`/users/\${id}\`
  },
  PRODUCTS: {
    LIST: '/products',
    BY_ID: (id: string) => \`/products/\${id}\`
  }
} as const;

// Usage
import { ROUTES, API_ENDPOINTS } from '@/constants';
navigate(ROUTES.DASHBOARD);
api.get(API_ENDPOINTS.USERS.ME);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create numeric and string enums
- Know when to use enums vs union types
- Export and import functions, classes, and types
- Use default and named exports appropriately
- Organize code with barrel files
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: String Enum',
      description: `String enums assign readable string values to each member, making debugging easier.

**Your task:**
1. Create an enum called \`Size\` with three members
2. Assign string values: Small="S", Medium="M", Large="L"
3. Create a variable \`shirtSize\` of type \`Size\` set to Medium
4. Log the variable`,
      starterCode: `// Step 1-2: Create the Size enum with string values


// Step 3: Create a variable of type Size


// Step 4: Log the value
`,
      solution: `enum Size {
  Small = "S",
  Medium = "M",
  Large = "L"
}

let shirtSize: Size = Size.Medium;

console.log(shirtSize);`,
      expectedOutput: ['M'],
      hints: [
        'Syntax: enum Name { Key = "value" }',
        'Type the variable as Size, assign Size.Medium',
        'Logging prints the string value "M"'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Numeric Enum',
      description: `Numeric enums assign number values to members. You can set explicit values or let TypeScript auto-increment.

**Your task:**
1. Create an enum called \`Priority\` with three members
2. Assign numeric values: Low=1, Medium=2, High=3
3. Log \`Priority.High\``,
      starterCode: `// Step 1-2: Create the Priority enum with numeric values


// Step 3: Log Priority.High
`,
      solution: `enum Priority {
  Low = 1,
  Medium = 2,
  High = 3
}

console.log(Priority.High);`,
      expectedOutput: ['3'],
      hints: [
        'Syntax: enum Name { Key = number }',
        'Access members with EnumName.Member',
        'Logging Priority.High outputs 3'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Using Enum in Function',
      description: `Enums work great as function parameter types to restrict valid inputs.

**Your task:**
1. Create an enum \`Day\` with weekdays: Mon=1, Tue=2, Wed=3, Thu=4, Fri=5
2. Write a function \`isWeekend\` that takes a \`Day\` and returns \`boolean\`
3. Return \`false\` (since all Day values are weekdays)
4. Log the result of calling \`isWeekend(Day.Wed)\``,
      starterCode: `// Step 1: Create the Day enum for weekdays


// Step 2-3: Write isWeekend function


// Step 4: Log the result
`,
      solution: `enum Day {
  Mon = 1,
  Tue = 2,
  Wed = 3,
  Thu = 4,
  Fri = 5
}

function isWeekend(day: Day): boolean {
  return false;
}

console.log(isWeekend(Day.Wed));`,
      expectedOutput: ['false'],
      hints: [
        'Parameter type: (day: Day)',
        'All Day members are weekdays, so return false',
        'Call with isWeekend(Day.Wed)'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: String Enum',
      description: `Create a string enum for API endpoints.

**Your task:**
1. Create a string enum \`ApiEndpoint\` with:
   - Users = "/api/users"
   - Posts = "/api/posts"
   - Comments = "/api/comments"
2. Write a function \`buildUrl(base: string, endpoint: ApiEndpoint): string\`
3. Test by building URLs with base "https://example.com" for Users and Posts`,
      starterCode: `// Step 1: Create the string enum


// Step 2: Write the buildUrl function


// Step 3: Build and log URL for Users endpoint


// Step 4: Build and log URL for Posts endpoint
`,
      solution: `enum ApiEndpoint {
  Users = "/api/users",
  Posts = "/api/posts",
  Comments = "/api/comments"
}

function buildUrl(base: string, endpoint: ApiEndpoint): string {
  return base + endpoint;
}

console.log(buildUrl("https://example.com", ApiEndpoint.Users));
console.log(buildUrl("https://example.com", ApiEndpoint.Posts));`,
      expectedOutput: ['https://example.com/api/users', 'https://example.com/api/posts'],
      hints: [
        'String enums: enum Name { Key = "value" }',
        'Concatenate: base + endpoint',
        'Access with ApiEndpoint.Users'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the default value of the first member in a numeric enum?',
      options: [
        '1',
        '0',
        'undefined',
        'null'
      ],
      correctIndex: 1,
      explanation: 'Numeric enums start at 0 by default, and subsequent members increment by 1.'
    },
    {
      question: 'What is the main difference between a numeric enum and a string enum?',
      options: [
        'String enums cannot have more than 10 members',
        'Numeric enums auto-increment values; string enums require explicit values',
        'String enums are faster at runtime',
        'Numeric enums cannot be used as function parameters'
      ],
      correctIndex: 1,
      explanation: 'Numeric enums auto-increment (0, 1, 2...) but string enums require you to explicitly set each value.'
    },
    {
      question: 'What does `export` do when placed before a function or type?',
      options: [
        'Makes it run automatically when the file loads',
        'Makes it available for import in other files',
        'Converts it to a global variable',
        'Optimizes it for production'
      ],
      correctIndex: 1,
      explanation: 'The export keyword makes a declaration available for other modules to import and use.'
    },
    {
      question: 'Given `enum Color { Red, Green, Blue }`, what is the value of `Color.Green`?',
      options: [
        '"Green"',
        '0',
        '1',
        '2'
      ],
      correctIndex: 2,
      explanation: 'With no explicit values, Color.Red is 0, Color.Green is 1, and Color.Blue is 2.'
    }
  ],
  buildNote: {
    title: 'Enums & Modules in the App',
    explanation: `This app uses modules extensively. Each component is in its own file and exported. The \`src/lessons/index.ts\` file is a barrel that re-exports all lesson functions. The \`src/types/lesson.ts\` exports type definitions. While we use union types for \`Difficulty\` instead of an enum (since we only need string literals), enums would work too. The module structure allows importing exactly what's needed: \`import { getLessonBySlug } from '@/lessons'\` instead of importing everything.`,
    relatedFiles: [
      'src/lessons/index.ts',
      'src/types/lesson.ts',
      'src/components/index.ts'
    ],
    inTheRealWorld: `Large TypeScript projects rely heavily on modules for organization. Enums are common for things like HTTP status codes, log levels, and application states. Many teams prefer const enums for smaller bundle sizes, or union types for simpler cases. The barrel file pattern (index.ts re-exporting) is standard in component libraries. Libraries like Material-UI and Chakra export components through barrel files for clean imports.`
  }
};
