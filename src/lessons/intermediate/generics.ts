import { Lesson } from '@/types/lesson';

export const generics: Lesson = {
  slug: 'generics',
  title: 'Generics',
  description: 'Write flexible, reusable types and functions that work with any data type.',
  difficulty: 'intermediate',
  order: 14,
  content: `
# Generics

Generics let you write functions and types that work with any data type, not just specific ones. They're a way to parameterize types — like function parameters but for types themselves.

## Generic Functions

Suppose you want a function that returns its input unchanged:

\`\`\`typescript
function identity(value: any): any {
  return value;
}
\`\`\`

With \`any\`, you lose type information. A generic function uses a type variable (usually called \`T\`):

\`\`\`typescript
function identity<T>(value: T): T {
  return value;
}

const str = identity<string>("hello");  // str has type string
const num = identity<number>(42);       // num has type number
\`\`\`

TypeScript infers the type, so you don't have to write it:

\`\`\`typescript
const str = identity("hello");  // TypeScript knows it's string
const num = identity(42);       // TypeScript knows it's number
\`\`\`

## Generic Interfaces

Interfaces can be generic too:

\`\`\`typescript
interface Container<T> {
  value: T;
  getValue(): T;
}

const stringContainer: Container<string> = {
  value: "hello",
  getValue() { return this.value; }
};

const numberContainer: Container<number> = {
  value: 42,
  getValue() { return this.value; }
};
\`\`\`

## Common Generic Types

Arrays are generic — \`Array<T>\` or \`T[]\`. Promises are generic — \`Promise<T>\` resolves with a value of type T. React hooks use generics — \`useState<T>\` manages state of any type:

\`\`\`typescript
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>("");

function fetchUser(): Promise<User> {
  return fetch("/api/user").then(r => r.json());
}
\`\`\`

## Record — A Powerful Generic Type

\`Record<K, V>\` creates an object with keys of type K and values of type V:

\`\`\`typescript
type Difficulty = "beginner" | "intermediate" | "advanced";

const lessonCounts: Record<Difficulty, number> = {
  beginner: 3,
  intermediate: 3,
  advanced: 3
};
\`\`\`

If you forget a key or misspell it, TypeScript catches it immediately.

## Multiple Type Parameters

Generics can have multiple type parameters:

\`\`\`typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair("hello", 42);      // [string, number]
const p2 = pair(true, "world");    // [boolean, string]

// Map-like structure
interface KeyValue<K, V> {
  key: K;
  value: V;
}

const item: KeyValue<string, number> = {
  key: "age",
  value: 25
};
\`\`\`

## Generic Constraints

Limit what types can be used with \`extends\`:

\`\`\`typescript
// T must have a length property
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "hi");           // "hello"
longest([1, 2, 3], [1]);          // [1, 2, 3]
longest({ length: 10 }, { length: 5 }); // { length: 10 }

// T must be a key of the object
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
const name = getProperty(user, "name");  // string
const age = getProperty(user, "age");    // number
// getProperty(user, "email");  // Error! "email" not in keyof user
\`\`\`

## Default Type Parameters

Provide defaults like default function parameters:

\`\`\`typescript
interface ApiResponse<T = any> {
  data: T;
  status: number;
}

// Uses default type (any)
const response1: ApiResponse = { data: "hello", status: 200 };

// Specifies type
const response2: ApiResponse<User[]> = {
  data: [{ name: "Alice" }],
  status: 200
};
\`\`\`

## Generic Classes

Classes can be generic too:

\`\`\`typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop());  // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
\`\`\`

## Generic Utility Functions

Common patterns you'll see everywhere:

\`\`\`typescript
// Wrap a value in an array
function toArray<T>(value: T): T[] {
  return [value];
}

// Create an object with default values
function withDefaults<T>(defaults: T, overrides: Partial<T>): T {
  return { ...defaults, ...overrides };
}

// Swap tuple elements
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

// Filter array by type
function filterByType<T>(
  arr: unknown[],
  predicate: (item: unknown) => item is T
): T[] {
  return arr.filter(predicate);
}
\`\`\`

## When to Use Generics

| Situation | Example |
|-----------|---------|
| Function works with multiple types | \`identity<T>(x: T): T\` |
| Container/wrapper types | \`Box<T> { value: T }\` |
| Type depends on input | \`first<T>(arr: T[]): T\` |
| Building reusable utilities | \`map<T, U>(arr: T[], fn): U[]\` |

## Common Mistakes

\`\`\`typescript
// WRONG: Using 'any' instead of generics
function identity(value: any): any {
  return value;  // Loses type information!
}

// WRONG: Unnecessary generics
function add<T extends number>(a: T, b: T): number {
  return a + b;  // Just use 'number' directly
}

// WRONG: Forgetting to use the type parameter
function log<T>(value: T): void {
  console.log(value);  // T is never used for type safety
}

// CORRECT: Generic that preserves type info
function identity<T>(value: T): T {
  return value;  // Returns same type as input
}
\`\`\`

## The Big Picture: Generics in Real Applications

Generics are the foundation of reusable, type-safe code. Here's how they're used in production:

### Data Fetching Hooks
\`\`\`typescript
// Generic hook for any API endpoint
function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then((data: T) => setData(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage - TypeScript knows the data type
const { data: users } = useFetch<User[]>('/api/users');
const { data: post } = useFetch<Post>('/api/posts/1');
\`\`\`

### Form State Management
\`\`\`typescript
// Generic form hook
function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const setError = <K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const reset = () => setValues(initialValues);

  return { values, errors, setValue, setError, reset };
}

// Usage
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const { values, setValue } = useForm<LoginForm>({
  email: '',
  password: '',
  rememberMe: false
});

setValue('email', 'user@example.com');  // Type-safe!
\`\`\`

### API Client
\`\`\`typescript
// Generic API client
class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
    return response.json();
  }

  async post<T, R = T>(endpoint: string, data: T): Promise<R> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async paginated<T>(
    endpoint: string,
    page: number,
    perPage: number
  ): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(
      \`\${endpoint}?page=\${page}&perPage=\${perPage}\`
    );
  }
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

// Usage
const api = new ApiClient('/api');
const users = await api.get<User[]>('/users');
const newUser = await api.post<CreateUserDto, User>('/users', { name: 'Alice' });
const page = await api.paginated<Product>('/products', 1, 20);
\`\`\`

### Collection Utilities
\`\`\`typescript
// Generic collection helpers
function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

function unique<T, K>(items: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return items.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return order === 'asc' ? cmp : -cmp;
  });
}

// Usage
const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'admin' }
];

const byRole = groupBy(users, u => u.role);
// { admin: [Alice, Charlie], user: [Bob] }

const sorted = sortBy(users, u => u.name);
// [Alice, Bob, Charlie]
\`\`\`

### Cache System
\`\`\`typescript
// Generic cache with TTL
class Cache<T> {
  private store = new Map<string, { value: T; expires: number }>();

  constructor(private defaultTtl: number = 60000) {}

  set(key: string, value: T, ttl?: number): void {
    this.store.set(key, {
      value,
      expires: Date.now() + (ttl ?? this.defaultTtl)
    });
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async getOrSet(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== null) return cached;

    const value = await fetcher();
    this.set(key, value, ttl);
    return value;
  }
}

// Usage
const userCache = new Cache<User>(5 * 60 * 1000); // 5 min TTL
const user = await userCache.getOrSet(
  \`user:\${userId}\`,
  () => api.getUser(userId)
);
\`\`\`

### Event System
\`\`\`typescript
// Type-safe event emitter
type EventMap = Record<string, unknown>;

class TypedEventEmitter<E extends EventMap> {
  private handlers = new Map<keyof E, Set<(data: E[keyof E]) => void>>();

  on<K extends keyof E>(event: K, handler: (data: E[K]) => void): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as (data: E[keyof E]) => void);

    return () => this.off(event, handler);
  }

  off<K extends keyof E>(event: K, handler: (data: E[K]) => void): void {
    this.handlers.get(event)?.delete(handler as (data: E[keyof E]) => void);
  }

  emit<K extends keyof E>(event: K, data: E[K]): void {
    this.handlers.get(event)?.forEach(handler => handler(data));
  }
}

// Define event types
interface AppEvents {
  'auth:login': { userId: string; timestamp: Date };
  'auth:logout': { userId: string };
  'cart:update': { items: CartItem[] };
  'notification:show': { message: string; type: 'info' | 'error' };
}

const events = new TypedEventEmitter<AppEvents>();

events.on('auth:login', ({ userId }) => {
  console.log(\`User \${userId} logged in\`);
});

events.emit('auth:login', { userId: '123', timestamp: new Date() });
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write generic functions that work with any type
- Define generic interfaces
- Use generic types like Array<T> and Promise<T>
- Create Record types for key-value mappings
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Generic Function',
      description: `Generic functions use type parameters (like \`<T>\`) to work with any type while preserving type information.

**Scenario:** You're building a form validator. Each input field can have multiple validation errors. You need a utility function to get the first (most important) error from any error list - whether it's a list of error messages (strings) or error codes (numbers).

**Your task:**
1. Write a generic function \`first<T>\` that takes an array of type \`T[]\`
2. Return the first element, or \`undefined\` if the array is empty
3. Test with error messages: \`["a", "b", "c"]\`
4. Test with error codes: \`[1, 2, 3]\`
5. Test with an empty array (no errors)`,
      starterCode: `// Step 1: Write a generic function first<T>
// It should work with ANY type of array


// Step 2: Test with error messages (strings)


// Step 3: Test with error codes (numbers)


// Step 4: Test with an empty array


// Step 5: Log all results
`,
      solution: `function first<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[0] : undefined;
}

const firstStr = first(["a", "b", "c"]);
const firstNum = first([1, 2, 3]);
const firstEmpty = first([]);

console.log(firstStr);
console.log(firstNum);
console.log(firstEmpty);`,
      expectedOutput: ['a', '1', 'undefined'],
      hints: [
        'Syntax: function first<T>(items: T[]): T | undefined',
        'Check items.length > 0 before returning items[0]',
        'Return undefined for empty arrays'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Generic Interface',
      description: `Generic interfaces let you create reusable type structures that work with different data types.

**Scenario:** You're building a caching system for an app. Each cached item needs to store a value (which could be any type) and a label describing what's cached. Create a generic \`CacheEntry<T>\` interface.

**Your task:**
1. Define a generic interface \`CacheEntry<T>\` with \`value: T\` and \`label: string\`
2. Create a \`CacheEntry<number>\` to cache a user's age (42) with label "userAge"
3. Create a \`CacheEntry<string>\` to cache a greeting ("hello") with label "welcomeMsg"
4. Log both cached values`,
      starterCode: `// Step 1: Define the generic interface CacheEntry<T>


// Step 2: Create a CacheEntry<number> for cached age


// Step 3: Create a CacheEntry<string> for cached message


// Step 4: Log the cached values
`,
      solution: `interface CacheEntry<T> {
  value: T;
  label: string;
}

const ageCache: CacheEntry<number> = {
  value: 42,
  label: "userAge"
};

const messageCache: CacheEntry<string> = {
  value: "hello",
  label: "welcomeMsg"
};

console.log(ageCache.value);
console.log(messageCache.value);`,
      expectedOutput: ['42', 'hello'],
      hints: [
        'Syntax: interface CacheEntry<T> { value: T; label: string; }',
        'Specify the type when using: CacheEntry<number> or CacheEntry<string>',
        'The value property must match the type parameter'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Generic Constraints',
      description: `Generic constraints use \`extends\` to restrict which types can be used with a generic. This ensures the type has specific properties.

**Your task:**
1. Define an interface \`Lengthable\` with a \`length: number\` property
2. Write a function \`getLength<T extends Lengthable>\` that returns the length
3. Test it with these values:
   - String: \`"hello"\` (length 5)
   - Array: \`[1, 2, 3, 4]\` (length 4)
   - Custom object: \`{ length: 10, name: "custom" }\` (length 10)`,
      starterCode: `// Step 1: Define the constraint interface Lengthable


// Step 2: Write the constrained generic function getLength


// Step 3: Test with string "hello" and log result


// Step 4: Test with array [1, 2, 3, 4] and log result


// Step 5: Test with object { length: 10, name: "custom" } and log result
`,
      solution: `interface Lengthable {
  length: number;
}

function getLength<T extends Lengthable>(item: T): number {
  return item.length;
}

console.log(getLength("hello"));
console.log(getLength([1, 2, 3, 4]));
console.log(getLength({ length: 10, name: "custom" }));`,
      expectedOutput: ['5', '4', '10'],
      hints: [
        'Syntax: <T extends Lengthable> constrains T to have a length property',
        'Strings and arrays both have .length built-in',
        'Any object with { length: number } satisfies the constraint'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Generic Utility Function',
      description: `Create a generic utility function that works with key-value pairs.

**Your task:**
1. Write a generic function \`getProperty<T, K extends keyof T>(obj: T, key: K): T[K]\`
2. This function takes an object and a key, returning the value at that key
3. Create a person object: \`{ name: "Alice", age: 30, active: true }\`
4. Use getProperty to get and log name, age, and active values`,
      starterCode: `// Step 1: Write the generic getProperty function


// Step 2: Create a person object


// Step 3: Use getProperty to get name and log it


// Step 4: Use getProperty to get age and log it


// Step 5: Use getProperty to get active and log it
`,
      solution: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, active: true };

console.log(getProperty(person, "name"));
console.log(getProperty(person, "age"));
console.log(getProperty(person, "active"));`,
      expectedOutput: ['Alice', '30', 'true'],
      hints: [
        'keyof T gives you a union of all keys in T',
        'K extends keyof T means K must be a valid key of T',
        'T[K] is the type of the value at key K in type T'
      ],
    },
  ],
  quiz: [
    {
      question: 'What does the generic function `function identity<T>(arg: T): T` return?',
      options: [
        'Always returns undefined',
        'Returns the argument with the same type it was given',
        'Returns a new object of type T',
        'Returns the type T itself'
      ],
      correctIndex: 1,
      explanation: 'A generic identity function returns the same value with the same type - if you pass a string, you get a string back; pass a number, get a number back.'
    },
    {
      question: 'What does `<T extends string>` mean in a generic function?',
      options: [
        'T must be exactly the string type',
        'T can be any type',
        'T must be string or a subtype of string (like literal types)',
        'T extends the String prototype'
      ],
      correctIndex: 2,
      explanation: 'The extends keyword in generics creates a constraint - T must be assignable to string, which includes string literals like "hello".'
    },
    {
      question: 'What is the purpose of `keyof T` in TypeScript generics?',
      options: [
        'Creates a new key on type T',
        'Returns a union type of all property names in T',
        'Checks if T has any keys',
        'Removes keys from type T'
      ],
      correctIndex: 1,
      explanation: 'keyof T produces a union of literal types representing all the property names (keys) of type T.'
    },
    {
      question: 'Given `function wrap<T>(value: T): { data: T }`, what is the return type of `wrap(42)`?',
      options: [
        '{ data: any }',
        '{ data: number }',
        '{ data: T }',
        '{ data: 42 }'
      ],
      correctIndex: 1,
      explanation: 'TypeScript infers T as number from the argument 42, so the return type is { data: number }.'
    }
  ],
  buildNote: {
    title: 'Generics in the App',
    explanation: `Generics are pervasive throughout the app's type system, enabling both flexibility and type safety. React's \`useState<RunResult | null>\` is a generic hook that manages execution results — the generic parameter \`RunResult | null\` means the hook is type-safe for exactly this data shape. The null part of the union lets us represent "code hasn't been run yet." The \`Promise<RunResult>\` type returned from a code execution worker is generic over the result shape — it promises to eventually return a RunResult. The \`Record<Difficulty, number>\` type used in \`src/lessons/index.ts\` is a generic utility that creates an object with keys from the Difficulty union and values of type number — a generic that ensures all three difficulties have an associated value. React component types themselves are generic — \`React.FC<Props>\` means "a functional component accepting these specific props." The Monaco Editor Monaco library itself is generic, accepting a language type parameter. Understanding generics is essential because they appear in every modern TypeScript library and framework — they make libraries reusable while maintaining strict type safety for specific use cases.`,
    relatedFiles: [
      'src/app/lessons/[slug]/page.tsx',
      'src/types/lesson.ts',
      'src/lib/code-executor.ts'
    ],
    inTheRealWorld: `Generics are essential in production TypeScript. The entire DOM API is generic — \`Document.getElementById<T>()\` returns \`T | null\`. React's typing relies heavily on generics — \`React.FC<Props>\`, \`useCallback<T>\`, and \`useRef<T>\` all use generics. Database libraries like Prisma and TypeORM use generics for type-safe queries returning \`Promise<User[]>\`. Testing libraries like Jest use \`expect<T>()\` and generic matchers. Modern async utilities are generic: \`Promise.all<T>(promises: Promise<T>[]): Promise<T[]>\`. Library authors use generics to provide reusable, type-safe APIs that work with user-defined types.`
  }
};
