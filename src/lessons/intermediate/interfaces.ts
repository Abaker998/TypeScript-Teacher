import { Lesson } from '@/types/lesson';

export const interfaces: Lesson = {
  slug: 'interfaces',
  title: 'Interfaces',
  description: 'Define reusable object shapes with interfaces for cleaner, more maintainable code.',
  difficulty: 'intermediate',
  order: 10,
  content: `
# Interfaces

Interfaces are a core TypeScript feature that define object shapes. Instead of writing object types inline every time, interfaces let you name a shape and reuse it throughout your code.

## Defining an Interface

An interface declares what properties an object should have and their types:

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email: string;
}
\`\`\`

Then you use it like a type:

\`\`\`typescript
const user: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};
\`\`\`

This is cleaner than writing the full type annotation every time.

## Optional Properties

Not all properties are required. Use a question mark to mark a property as optional:

\`\`\`typescript
interface Profile {
  name: string;
  bio?: string;  // Optional — may or may not be present
  followers: number;
}

const profile1: Profile = {
  name: "Alice",
  followers: 100
  // bio is not provided — that's OK
};

const profile2: Profile = {
  name: "Bob",
  bio: "I love TypeScript!",
  followers: 50
};
\`\`\`

## Extending Interfaces

Interfaces can extend other interfaces, adding more properties. This prevents duplication:

\`\`\`typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

// An Employee must have name, age, employeeId, and department
const emp: Employee = {
  name: "Alice",
  age: 30,
  employeeId: 101,
  department: "Engineering"
};
\`\`\`

## Interfaces in Component Props

Interfaces are especially useful for React component prop objects. Instead of defining props inline, define an interface:

\`\`\`typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} disabled={props.disabled}>
      {props.label}
    </button>
  );
}
\`\`\`

## Readonly Properties

Prevent properties from being changed after creation:

\`\`\`typescript
interface Config {
  readonly apiUrl: string;
  readonly maxRetries: number;
  timeout: number;  // This CAN be changed
}

const config: Config = {
  apiUrl: "https://api.example.com",
  maxRetries: 3,
  timeout: 5000
};

config.timeout = 10000;    // OK
config.apiUrl = "new-url"; // Error! Cannot assign to 'apiUrl'
\`\`\`

## Index Signatures

Allow objects with dynamic keys:

\`\`\`typescript
interface StringMap {
  [key: string]: string;
}

const colors: StringMap = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff"
};

// Can add any string key
colors.purple = "#800080";

interface NumberDictionary {
  [key: string]: number;
  length: number;  // Can have specific properties too
}
\`\`\`

## Methods in Interfaces

Interfaces can define methods:

\`\`\`typescript
interface Animal {
  name: string;
  age: number;
  speak(): string;
  move(distance: number): void;
}

const dog: Animal = {
  name: "Rex",
  age: 5,
  speak() {
    return "Woof!";
  },
  move(distance) {
    console.log(\`\${this.name} moved \${distance} meters\`);
  }
};

console.log(dog.speak());  // "Woof!"
\`\`\`

## Interface vs Type Alias

Both can describe object shapes, but interfaces have some advantages:

\`\`\`typescript
// Interface - can extend, can be augmented
interface User {
  name: string;
}

interface User {  // Declaration merging!
  age: number;
}
// Now User has both name and age

// Type alias - more flexible syntax
type Point = {
  x: number;
  y: number;
};

// Type aliases can do things interfaces can't:
type ID = string | number;  // Union types
type Pair = [string, number];  // Tuples
\`\`\`

**Rule of thumb:** Use interfaces for objects, types for unions/primitives.

## Implementing Interfaces with Classes

Classes can implement interfaces:

\`\`\`typescript
interface Printable {
  print(): void;
}

interface Saveable {
  save(): Promise<void>;
}

class Document implements Printable, Saveable {
  constructor(public content: string) {}

  print() {
    console.log(this.content);
  }

  async save() {
    // Save to database...
  }
}
\`\`\`

## Common Patterns

\`\`\`typescript
// API Response pattern
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Partial pattern - all properties optional
interface User {
  name: string;
  email: string;
  age: number;
}

// For updates, you might only send some fields
function updateUser(id: number, updates: Partial<User>) {
  // updates can have any subset of User properties
}

updateUser(1, { name: "New Name" });  // OK
updateUser(2, { age: 25 });           // OK
\`\`\`

## Common Mistakes

\`\`\`typescript
// WRONG: Forgetting to implement all properties
interface Car {
  brand: string;
  year: number;
}

const car: Car = {
  brand: "Toyota"
  // Error: Property 'year' is missing
};

// WRONG: Extra properties in literal
const car: Car = {
  brand: "Toyota",
  year: 2020,
  color: "red"  // Error: 'color' does not exist in type 'Car'
};

// OK: Extra properties via variable
const carData = { brand: "Toyota", year: 2020, color: "red" };
const car: Car = carData;  // OK - excess properties allowed
\`\`\`

## Quick Reference

| Feature | Syntax |
|---------|--------|
| Basic interface | \`interface Name { prop: type }\` |
| Optional property | \`prop?: type\` |
| Readonly property | \`readonly prop: type\` |
| Extend interface | \`interface B extends A { }\` |
| Index signature | \`[key: string]: type\` |
| Method | \`methodName(param: type): returnType\` |
| Function type | \`(param: type): returnType\` |

## The Big Picture: Interfaces in Real Applications

Interfaces are the backbone of typed application architecture. Here's how they're used in production:

### API Type Definitions
\`\`\`typescript
// Complete API type system for a user management service
interface User {
  id: string;
  email: string;
  profile: UserProfile;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
}

interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showActivity: boolean;
}

// API Response wrappers
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ResponseMeta;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

interface ResponseMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// Usage
type UserResponse = ApiResponse<User> | ApiError;
type UsersResponse = ApiResponse<User[]> | ApiError;
\`\`\`

### React Component Interfaces
\`\`\`typescript
// Form component with comprehensive props
interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

// Data table with generic row type
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  pagination?: PaginationConfig;
  emptyMessage?: string;
}

interface ColumnDefinition<T> {
  key: keyof T;
  header: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface PaginationConfig {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

// Modal with actions
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}
\`\`\`

### State Management Interfaces
\`\`\`typescript
// Redux-style state interfaces
interface RootState {
  auth: AuthState;
  users: UsersState;
  notifications: NotificationsState;
  ui: UIState;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UsersState {
  items: User[];
  selectedUser: User | null;
  filters: UserFilters;
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;
}

interface UserFilters {
  search: string;
  role?: string;
  status?: 'active' | 'inactive';
  sortBy: keyof User;
  sortOrder: 'asc' | 'desc';
}

interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

// Actions
interface Action<T extends string, P = void> {
  type: T;
  payload: P;
}

type AuthAction =
  | Action<'AUTH_LOGIN_START'>
  | Action<'AUTH_LOGIN_SUCCESS', { user: User; token: string }>
  | Action<'AUTH_LOGIN_FAILURE', { error: string }>
  | Action<'AUTH_LOGOUT'>;
\`\`\`

### Service Layer Interfaces
\`\`\`typescript
// Repository pattern for data access
interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(filters?: Partial<T>): Promise<T[]>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

// Specific repositories extend the base
interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: string): Promise<User[]>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
}

interface OrderRepository extends Repository<Order> {
  findByUserId(userId: string): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}

// Service interfaces
interface AuthService {
  login(email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<string>;
  resetPassword(email: string): Promise<void>;
  verifyEmail(token: string): Promise<boolean>;
}

interface NotificationService {
  send(notification: Notification): Promise<void>;
  sendBulk(notifications: Notification[]): Promise<void>;
  getUnread(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
}
\`\`\`

### Event System Interfaces
\`\`\`typescript
// Event-driven architecture
interface EventEmitter<Events extends Record<string, unknown>> {
  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void;
  off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void;
  emit<K extends keyof Events>(event: K, data: Events[K]): void;
}

// Define your app's events
interface AppEvents {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'order:created': { orderId: string; userId: string; total: number };
  'order:shipped': { orderId: string; trackingNumber: string };
  'notification:received': { notification: Notification };
}

// Type-safe event handling
const events: EventEmitter<AppEvents> = createEventEmitter();

events.on('user:login', ({ userId, timestamp }) => {
  console.log(\`User \${userId} logged in at \${timestamp}\`);
});

events.emit('user:login', { userId: '123', timestamp: new Date() });
\`\`\`

### Plugin/Extension System
\`\`\`typescript
// Plugin architecture for extensible apps
interface Plugin {
  name: string;
  version: string;
  initialize(app: Application): void | Promise<void>;
  destroy?(): void | Promise<void>;
}

interface Application {
  config: AppConfig;
  services: ServiceContainer;
  hooks: HookSystem;
  registerRoute(route: RouteDefinition): void;
  registerMiddleware(middleware: Middleware): void;
}

interface HookSystem {
  register(hook: string, handler: HookHandler): void;
  call(hook: string, context: unknown): Promise<unknown>;
}

// Example plugin implementation
const analyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',

  initialize(app) {
    app.hooks.register('page:view', async (context) => {
      await trackPageView(context);
    });

    app.hooks.register('user:action', async (context) => {
      await trackUserAction(context);
    });
  }
};
\`\`\`

### Configuration Interfaces
\`\`\`typescript
// Application configuration with strict typing
interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  server: ServerConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  features: FeatureFlags;
}

interface ServerConfig {
  host: string;
  port: number;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

interface DatabaseConfig {
  type: 'postgres' | 'mysql' | 'mongodb';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
}

interface AuthConfig {
  jwtSecret: string;
  jwtExpiration: string;
  refreshTokenExpiration: string;
  bcryptRounds: number;
  providers: {
    google?: OAuthConfig;
    github?: OAuthConfig;
  };
}

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

interface FeatureFlags {
  newDashboard: boolean;
  betaFeatures: boolean;
  maintenanceMode: boolean;
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Define interfaces to describe object shapes
- Use optional properties with the ? syntax
- Extend interfaces to create more specific types
- Apply interfaces to function parameters and component props
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Define a Basic Interface',
      description: `Interfaces define the shape of objects - what properties they must have.

**Your task:**
1. Define an interface called \`Article\` with:
   - title: string
   - author: string
   - published?: boolean (the ? makes it optional)
2. Create an article object that matches the interface
3. Print the article's title

**Interface syntax:**
\`\`\`
interface Name {
  property: type;
  optionalProp?: type;
}
\`\`\``,
      starterCode: `// Step 1: Define the Article interface


// Step 2: Create an article object with type Article


// Step 3: Print the title

`,
      solution: `interface Article {
  title: string;
  author: string;
  published?: boolean;
}

const article: Article = {
  title: "Learning TypeScript",
  author: "Alice",
  published: true
};

console.log(article.title);`,
      expectedOutput: ['Learning TypeScript'],
      hints: [
        'interface Article { ... } defines the shape',
        'Use ? after property name for optional: published?: boolean',
        'Create object: const article: Article = { ... }',
        'Print with console.log(article.title)'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Extending Interfaces',
      description: `Interfaces can extend other interfaces, inheriting all their properties.

**Your task:**
1. Create a \`Person\` interface with name (string) and age (number)
2. Create a \`Student\` interface that EXTENDS Person and adds studentId (number) and optional gpa (number)
3. Create a student object with these values:
   - name: \`"Alice"\`
   - age: \`20\`
   - studentId: \`12345\`
   - gpa: \`3.8\`
4. Print their name and studentId

**Extends syntax:** \`interface Child extends Parent { ... }\``,
      starterCode: `// Step 1: Define Person interface with name and age


// Step 2: Define Student that EXTENDS Person, adding studentId and optional gpa


// Step 3: Create a student: name "Alice", age 20, studentId 12345, gpa 3.8


// Step 4: Print name and studentId

`,
      solution: `interface Person {
  name: string;
  age: number;
}

interface Student extends Person {
  studentId: number;
  gpa?: number;
}

const student: Student = {
  name: "Alice",
  age: 20,
  studentId: 12345,
  gpa: 3.8
};

console.log(student.name);
console.log(student.studentId);`,
      expectedOutput: ['Alice', '12345'],
      hints: [
        'Person has: name: string; age: number;',
        'Student extends Person: interface Student extends Person { }',
        'Student adds: studentId: number; gpa?: number;',
        'A Student object needs name, age, AND studentId'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Interface for Function Types',
      description: `Interfaces can also describe function signatures!

**Your task:**
1. Define a \`Calculator\` interface for functions that take two numbers and return a number
2. Create an \`add\` function matching this interface
3. Create a \`multiply\` function matching this interface
4. Test both and print the results

**Function interface syntax:**
\`\`\`
interface FuncName {
  (param1: type, param2: type): returnType;
}
\`\`\``,
      starterCode: `// Step 1: Define Calculator interface for a function


// Step 2: Create add function with Calculator type


// Step 3: Create multiply function with Calculator type


// Step 4: Test both functions

`,
      solution: `interface Calculator {
  (a: number, b: number): number;
}

const add: Calculator = (a, b) => {
  return a + b;
};

const multiply: Calculator = (a, b) => {
  return a * b;
};

console.log(add(5, 3));
console.log(multiply(4, 7));`,
      expectedOutput: ['8', '28'],
      hints: [
        'Function interface: interface Calculator { (a: number, b: number): number; }',
        'The function is INSIDE the interface with (params): returnType syntax',
        'Use the interface as a type: const add: Calculator = ...',
        'TypeScript infers param types from the interface!'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Interface with Methods',
      description: `Interfaces can include method definitions - functions that objects must implement.

**Your task:**
1. Create a \`Describable\` interface with:
   - name: string
   - describe(): string (a method that returns a string)
2. Create an object \`item\` of type \`Describable\`
3. The describe method should return "This is [name]"
4. Call describe() and print the result

**Method in interface syntax:** \`methodName(): returnType;\``,
      starterCode: `// Step 1: Define Describable interface with name and describe() method


// Step 2: Create an object that implements Describable


// Step 3: Call describe() and print the result

`,
      solution: `interface Describable {
  name: string;
  describe(): string;
}

const item: Describable = {
  name: "Widget",
  describe() {
    return "This is " + this.name;
  }
};

console.log(item.describe());`,
      expectedOutput: ['This is Widget'],
      hints: [
        'Interface: interface Describable { name: string; describe(): string; }',
        'Method returns a string, no parameters',
        'In the object, implement describe as a function',
        'Use this.name inside describe to access the name property'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the main purpose of an interface in TypeScript?',
      options: [
        'To run code at compile time',
        'To define the shape/structure of objects',
        'To convert TypeScript to JavaScript',
        'To create new classes automatically'
      ],
      correctIndex: 1,
      explanation: 'Interfaces define the shape of objects - what properties and methods they must have. They provide a contract for objects to follow.'
    },
    {
      question: 'How do you make a property optional in an interface?',
      options: [
        'Use the optional keyword',
        'Put the property in square brackets',
        'Add a question mark after the property name',
        'Use undefined as the type'
      ],
      correctIndex: 2,
      explanation: 'Add ? after the property name: bio?: string. This means the property can be present or absent.'
    },
    {
      question: 'What does "interface B extends A" mean?',
      options: [
        'B replaces A completely',
        'B inherits all properties from A and can add more',
        'A and B become the same interface',
        'B can only have properties that A has'
      ],
      correctIndex: 1,
      explanation: 'extends means B inherits everything from A. An object of type B must have all of A\'s properties plus any new ones B defines.'
    },
    {
      question: 'What is "declaration merging" with interfaces?',
      options: [
        'Combining two different interfaces into one',
        'Deleting duplicate interfaces',
        'Multiple declarations of the same interface are automatically combined',
        'Splitting one interface into multiple files'
      ],
      correctIndex: 2,
      explanation: 'TypeScript automatically merges multiple declarations of the same interface name. This is useful for extending library types.'
    }
  ],
  buildNote: {
    title: 'Interfaces in the App',
    explanation: `The app uses interfaces extensively throughout its React components to define component contracts. The \`Lesson\` interface in \`src/types/lesson.ts\` defines the complete shape of lesson objects with all required properties. Component prop interfaces are defined at the top of each component file — for example, \`SidebarProps\` describes the props passed to the Sidebar component, including a \`lessons: LessonGroup[]\` array and a \`currentSlug: string\` property. The \`CodeEditorProps\` interface specifies that the editor component receives \`starterCode: string\` and \`slug: string\`. The \`OutputPanelProps\` interface describes what the output display component expects from its parent. Rather than writing inline object types like \`{ lessons: LessonGroup[]; currentSlug: string }\` every time a component is used, interfaces provide a named, reusable contract. This makes component signatures cleaner and easier to understand. If a component's expected props change, updating the interface in one place updates the contract everywhere, and TypeScript immediately shows errors in all places that pass the wrong props. This catches prop-passing bugs before runtime.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/components/Sidebar.tsx',
      'src/components/CodeEditor.tsx',
      'src/components/OutputPanel.tsx'
    ],
    inTheRealWorld: `Enterprise TypeScript codebases rely heavily on interfaces. React libraries like Material-UI define comprehensive interfaces for component props, letting developers see exactly what props are available and their types. Backend frameworks like Nest.js use interfaces to describe DTOs (Data Transfer Objects) for API requests and responses. GraphQL TypeScript bindings generate interfaces matching schema types. Testing libraries use interfaces to describe mock objects. Interface-driven design makes APIs self-documenting and enables tooling like IDE autocomplete, refactoring tools, and type-safe testing.`
  }
};
