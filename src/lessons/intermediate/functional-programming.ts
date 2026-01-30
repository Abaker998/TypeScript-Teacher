import { Lesson } from '@/types/lesson';

export const functionalProgramming: Lesson = {
  slug: 'functional-programming',
  title: 'Functional Programming',
  description: 'Learn closures, higher-order functions, pure functions, and recursion.',
  difficulty: 'intermediate',
  order: 18,
  content: `
# Functional Programming Basics

Functional programming is a style that treats computation as evaluating functions. These concepts make your code more predictable and easier to test.

## Closures

A closure is a function that "remembers" variables from its outer scope, even after the outer function has finished:

\`\`\`typescript
function createCounter() {
  let count = 0;  // This variable is "closed over"

  return function() {
    count++;
    return count;
  };
}

let counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3
\`\`\`

The inner function "closes over" the \`count\` variable and remembers it between calls.

### Practical Closure Example

\`\`\`typescript
function createMultiplier(factor: number) {
  return function(num: number) {
    return num * factor;  // factor is remembered
  };
}

let double = createMultiplier(2);
let triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
\`\`\`

## Higher-Order Functions

A higher-order function either:
- Takes a function as an argument, OR
- Returns a function

\`\`\`typescript
// Takes a function as argument
function applyOperation(x: number, y: number, operation: (a: number, b: number) => number) {
  return operation(x, y);
}

console.log(applyOperation(5, 3, (a, b) => a + b));  // 8
console.log(applyOperation(5, 3, (a, b) => a * b));  // 15
\`\`\`

### Built-in Higher-Order Functions

Arrays have many higher-order methods:

\`\`\`typescript
let numbers = [1, 2, 3, 4, 5];

// map - transform each element
let doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter - keep elements that pass test
let evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce - combine into single value
let sum = numbers.reduce((acc, n) => acc + n, 0);
// 15
\`\`\`

## Pure Functions

A pure function:
1. Always returns the same output for the same input
2. Has no side effects (doesn't modify external state)

\`\`\`typescript
// PURE - same input = same output, no side effects
function add(a: number, b: number): number {
  return a + b;
}

// IMPURE - modifies external state
let total = 0;
function addToTotal(n: number): number {
  total += n;  // Side effect!
  return total;
}

// IMPURE - depends on external state
function getRandomGreeting(name: string): string {
  let greetings = ["Hi", "Hello", "Hey"];
  let random = Math.floor(Math.random() * 3);  // Not predictable!
  return greetings[random] + ", " + name;
}
\`\`\`

### Why Pure Functions Matter

\`\`\`typescript
// Pure functions are:
// - Predictable (easy to test)
// - Cacheable (same input = same output)
// - Parallelizable (no shared state)

function calculateTax(amount: number, rate: number): number {
  return amount * rate;
}

// Always returns 10 for these inputs
console.log(calculateTax(100, 0.1));  // 10
console.log(calculateTax(100, 0.1));  // 10
\`\`\`

## Recursion

Recursion is when a function calls itself. Every recursive function needs:
1. A base case (when to stop)
2. A recursive case (calling itself with smaller input)

\`\`\`typescript
function factorial(n: number): number {
  // Base case
  if (n <= 1) return 1;

  // Recursive case
  return n * factorial(n - 1);
}

console.log(factorial(5));  // 120 (5 * 4 * 3 * 2 * 1)
\`\`\`

### Recursion with Arrays

\`\`\`typescript
function sum(numbers: number[]): number {
  // Base case - empty array
  if (numbers.length === 0) return 0;

  // Recursive case - first + sum of rest
  let [first, ...rest] = numbers;
  return first + sum(rest);
}

console.log(sum([1, 2, 3, 4]));  // 10
\`\`\`

### When to Use Recursion

- Tree structures (file systems, DOM)
- Nested data (JSON parsing)
- Mathematical sequences (factorial, fibonacci)
- Problems that naturally divide into smaller versions

## Function Composition

Combine small functions into larger ones:

\`\`\`typescript
let addOne = (x: number) => x + 1;
let double = (x: number) => x * 2;
let square = (x: number) => x * x;

// Compose: apply right to left
function compose<T>(...fns: ((x: T) => T)[]) {
  return (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);
}

let transform = compose(square, double, addOne);
console.log(transform(3));  // ((3 + 1) * 2)² = 64
\`\`\`

## The Big Picture: Functional Programming in Real Applications

Functional programming concepts are fundamental to modern JavaScript and TypeScript development. Here's how they're used in production:

### React Hooks (Closures in Action)
\`\`\`typescript
// Custom hooks use closures to maintain state between renders
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  // These functions close over count and setCount
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

// Debounce hook using closures
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Closure captures the current value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function also uses closure
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Local storage hook with closure
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // setValue closes over key
  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}
\`\`\`

### Higher-Order Functions for Data Transformation
\`\`\`typescript
// Real-world data processing pipeline
interface RawProduct {
  id: string;
  name: string;
  price_cents: number;
  category_id: string;
  is_active: boolean;
  created_at: string;
}

interface DisplayProduct {
  id: string;
  name: string;
  price: string;
  category: string;
  isNew: boolean;
}

// Category lookup (would come from API)
const categories: Record<string, string> = {
  '1': 'Electronics',
  '2': 'Clothing',
  '3': 'Books'
};

// Transform raw API data into display format
function processProducts(products: RawProduct[]): DisplayProduct[] {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return products
    // Filter active products
    .filter(p => p.is_active)
    // Transform to display format
    .map(p => ({
      id: p.id,
      name: p.name,
      price: formatCurrency(p.price_cents / 100),
      category: categories[p.category_id] ?? 'Other',
      isNew: new Date(p.created_at).getTime() > oneWeekAgo
    }))
    // Sort by newest first
    .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
}

// Aggregation using reduce
function getProductStats(products: RawProduct[]) {
  return products.reduce((stats, product) => {
    const category = categories[product.category_id] ?? 'Other';
    stats.totalProducts++;
    stats.totalValue += product.price_cents;
    stats.byCategory[category] = (stats.byCategory[category] ?? 0) + 1;
    if (product.is_active) stats.activeCount++;
    return stats;
  }, {
    totalProducts: 0,
    totalValue: 0,
    activeCount: 0,
    byCategory: {} as Record<string, number>
  });
}
\`\`\`

### Middleware Pattern (Higher-Order Functions)
\`\`\`typescript
// Express-style middleware using higher-order functions
type Handler = (req: Request, res: Response) => Promise<void>;
type Middleware = (handler: Handler) => Handler;

// Logging middleware
const withLogging: Middleware = (handler) => async (req, res) => {
  const start = Date.now();
  console.log(\`[\${req.method}] \${req.url} - Start\`);

  await handler(req, res);

  const duration = Date.now() - start;
  console.log(\`[\${req.method}] \${req.url} - \${duration}ms\`);
};

// Error handling middleware
const withErrorHandling: Middleware = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Authentication middleware
const withAuth = (requiredRole?: string): Middleware => (handler) => async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await verifyToken(token);
  if (requiredRole && user.role !== requiredRole) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  req.user = user;
  await handler(req, res);
};

// Compose middleware
const compose = (...middlewares: Middleware[]): Middleware =>
  middlewares.reduce((acc, middleware) => (handler) => acc(middleware(handler)));

// Usage
const protectedHandler = compose(
  withErrorHandling,
  withLogging,
  withAuth('admin')
)(async (req, res) => {
  res.json({ message: 'Admin data', user: req.user });
});
\`\`\`

### Memoization (Pure Functions + Closures)
\`\`\`typescript
// Generic memoization function
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = new Map<string, Result>();

  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Expensive computation memoized
const memoizedFactorial = memoize((n: number): number => {
  if (n <= 1) return 1;
  return n * memoizedFactorial(n - 1);
});

// React selector memoization
function createSelector<State, Result>(
  selector: (state: State) => Result
): (state: State) => Result {
  let lastState: State | undefined;
  let lastResult: Result | undefined;

  return (state: State) => {
    if (state === lastState && lastResult !== undefined) {
      return lastResult;
    }
    lastState = state;
    lastResult = selector(state);
    return lastResult;
  };
}

const selectActiveUsers = createSelector((state: AppState) =>
  state.users.filter(u => u.isActive)
);
\`\`\`

### Recursion for Tree Structures
\`\`\`typescript
// File system tree
interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number;
}

// Calculate total size recursively
function getTotalSize(node: FileNode): number {
  if (node.type === 'file') {
    return node.size ?? 0;
  }
  // Folder: sum children sizes
  return (node.children ?? []).reduce(
    (total, child) => total + getTotalSize(child),
    0
  );
}

// Find files matching pattern recursively
function findFiles(node: FileNode, pattern: RegExp, path: string = ''): string[] {
  const currentPath = path ? \`\${path}/\${node.name}\` : node.name;

  if (node.type === 'file') {
    return pattern.test(node.name) ? [currentPath] : [];
  }

  return (node.children ?? []).flatMap(child =>
    findFiles(child, pattern, currentPath)
  );
}

// Flatten nested tree to array
function flattenTree(node: FileNode): FileNode[] {
  if (node.type === 'file') {
    return [node];
  }
  return [
    node,
    ...(node.children ?? []).flatMap(child => flattenTree(child))
  ];
}

// Transform tree structure
function mapTree<T>(
  node: FileNode,
  transform: (node: FileNode) => T,
  getChildren: (result: T, children: T[]) => T
): T {
  const transformed = transform(node);
  if (node.type === 'file' || !node.children) {
    return transformed;
  }
  const transformedChildren = node.children.map(child =>
    mapTree(child, transform, getChildren)
  );
  return getChildren(transformed, transformedChildren);
}
\`\`\`

### Redux Reducers (Pure Functions)
\`\`\`typescript
// State and action types
interface TodoState {
  items: Todo[];
  filter: 'all' | 'active' | 'completed';
  isLoading: boolean;
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { filter: TodoState['filter'] } }
  | { type: 'LOAD_TODOS_START' }
  | { type: 'LOAD_TODOS_SUCCESS'; payload: { todos: Todo[] } };

// Pure reducer function
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: crypto.randomUUID(),
            text: action.payload.text,
            completed: false,
            createdAt: new Date().toISOString()
          }
        ]
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        items: state.items.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...state,
        items: state.items.filter(todo => todo.id !== action.payload.id)
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload.filter
      };

    case 'LOAD_TODOS_START':
      return {
        ...state,
        isLoading: true
      };

    case 'LOAD_TODOS_SUCCESS':
      return {
        ...state,
        items: action.payload.todos,
        isLoading: false
      };

    default:
      return state;
  }
}
\`\`\`

### Function Composition for Validation
\`\`\`typescript
// Composable validation functions
type Validator<T> = (value: T) => string | null;

function compose<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: T) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}

// Individual validators (pure functions)
const required: Validator<string> = (value) =>
  value.trim() ? null : 'This field is required';

const minLength = (min: number): Validator<string> => (value) =>
  value.length >= min ? null : \`Must be at least \${min} characters\`;

const maxLength = (max: number): Validator<string> => (value) =>
  value.length <= max ? null : \`Must be at most \${max} characters\`;

const email: Validator<string> = (value) =>
  /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) ? null : 'Invalid email format';

const pattern = (regex: RegExp, message: string): Validator<string> => (value) =>
  regex.test(value) ? null : message;

// Compose validators
const validateUsername = compose(
  required,
  minLength(3),
  maxLength(20),
  pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
);

const validateEmail = compose(required, email);

const validatePassword = compose(
  required,
  minLength(8),
  pattern(/[A-Z]/, 'Must contain uppercase letter'),
  pattern(/[a-z]/, 'Must contain lowercase letter'),
  pattern(/[0-9]/, 'Must contain number')
);

// Usage
function validateForm(data: { username: string; email: string; password: string }) {
  return {
    username: validateUsername(data.username),
    email: validateEmail(data.email),
    password: validatePassword(data.password)
  };
}
\`\`\`

### Event Handling with Closures
\`\`\`typescript
// Event subscription system using closures
type Listener<T> = (data: T) => void;
type Unsubscribe = () => void;

function createEventEmitter<Events extends Record<string, unknown>>() {
  const listeners = new Map<keyof Events, Set<Listener<unknown>>>();

  return {
    on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): Unsubscribe {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(listener as Listener<unknown>);

      // Return unsubscribe function (closure over event and listener)
      return () => {
        listeners.get(event)?.delete(listener as Listener<unknown>);
      };
    },

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
      listeners.get(event)?.forEach(listener => listener(data));
    },

    // One-time listener using closure
    once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): Unsubscribe {
      const unsubscribe = this.on(event, (data) => {
        unsubscribe(); // Remove after first call
        listener(data);
      });
      return unsubscribe;
    }
  };
}

// Usage
interface AppEvents {
  userLogin: { userId: string; timestamp: number };
  notification: { message: string; type: 'info' | 'error' };
  dataUpdate: { entity: string; id: string };
}

const events = createEventEmitter<AppEvents>();

const unsubscribe = events.on('userLogin', ({ userId }) => {
  console.log(\`User \${userId} logged in\`);
});

events.emit('userLogin', { userId: '123', timestamp: Date.now() });
unsubscribe(); // Clean up
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create and use closures for data encapsulation
- Write and use higher-order functions
- Understand what makes a function pure
- Implement recursive solutions for appropriate problems
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create a Closure',
      description: `A closure is a function that "remembers" variables from its outer scope.

**Your task:**
1. Complete the createGreeter function to return an inner function
2. The inner function should return "Hello, " + name + "!"
3. Uncomment the test code to verify it works`,
      starterCode: `function createGreeter(name: string) {
  // Step 1: Return a function that uses 'name'

}

// Step 2: Uncomment to test
`,
      solution: `function createGreeter(name: string) {
  return function() {
    return "Hello, " + name + "!";
  };
}

let greetAlice = createGreeter("Alice");
console.log(greetAlice());`,
      expectedOutput: ['Hello, Alice!'],
      hints: [
        'Uncomment the return statement inside createGreeter',
        'The inner function "closes over" the name parameter',
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Higher-Order Function',
      description: `A higher-order function takes a function as an argument or returns one.

**Scenario:** You're building a currency converter. You have prices in cents [1, 2, 3] and need to convert them to dollars by multiplying by 10. Instead of hardcoding the multiplier, create a flexible function that applies ANY transformation.

**Your task:**
1. Create an empty result array
2. Loop through arr and apply fn to each element
3. Push each result to the array and return it
4. Test by converting cents [1, 2, 3] to dollars (multiply by 10)`,
      starterCode: `function applyToAll(arr: number[], fn: (n: number) => number): number[] {
  // Step 1: Create empty result array


  // Step 2: Loop and apply fn to each element


  // Step 3: Return the result

}

// Step 4: Convert cents to dollars - multiply [1, 2, 3] by 10
`,
      solution: `function applyToAll(arr: number[], fn: (n: number) => number): number[] {
  let result: number[] = [];
  for (let item of arr) {
    result.push(fn(item));
  }
  return result;
}

let dollars = applyToAll([1, 2, 3], n => n * 10);
console.log(dollars);`,
      expectedOutput: ['[10, 20, 30]'],
      hints: [
        'Create an empty array: let result: number[] = [];',
        'Loop with for...of: for (let item of arr) { ... }',
        'Apply the function and push: result.push(fn(item))',
        'Call applyToAll with an arrow function: n => n * 10',
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Simple Recursion',
      description: `Recursion is when a function calls itself. It needs a base case (when to stop) and a recursive case.

**Scenario:** You're building a rocket launch sequence. The countdown must go from 5 to 1, then launch! Use recursion to print each number in the sequence.

**Your task:**
1. Add a base case: return if n <= 0 (countdown complete)
2. Print the current countdown number
3. Recursively call countdown with n - 1
4. Start the launch sequence from 5`,
      starterCode: `function countdown(n: number): void {
  // Step 1: Base case - stop when n <= 0


  // Step 2: Print the current countdown number


  // Step 3: Recursive call with n - 1

}

// Step 4: Start the launch sequence from 5
`,
      solution: `function countdown(n: number): void {
  if (n <= 0) return;
  console.log(n);
  countdown(n - 1);
}

countdown(5);`,
      expectedOutput: ['5', '4', '3', '2', '1'],
      hints: [
        'Base case: if (n <= 0) return;',
        'Print with console.log(n)',
        'Recursive call: countdown(n - 1)',
        'Each call brings n closer to 0',
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Higher-Order Function',
      description: `Create a higher-order function that returns a new function.

**Your task:**
1. Write a function \`multiplyBy(factor: number)\` that returns a new function
2. The returned function should take a number and return it multiplied by factor
3. Create \`double\` by calling multiplyBy(2)
4. Create \`triple\` by calling multiplyBy(3)
5. Test both functions`,
      starterCode: `// Step 1: Write the multiplyBy higher-order function


// Step 2: Create double by calling multiplyBy(2)


// Step 3: Create triple by calling multiplyBy(3)


// Step 4: Test and log double(5) and triple(5)
`,
      solution: `function multiplyBy(factor: number): (n: number) => number {
  return (n: number) => n * factor;
}

let double = multiplyBy(2);
let triple = multiplyBy(3);

console.log(double(5));
console.log(triple(5));`,
      expectedOutput: ['10', '15'],
      hints: [
        'Return type: (n: number) => number',
        'Return an arrow function: (n) => n * factor',
        'The inner function "closes over" factor'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is a closure in JavaScript/TypeScript?',
      options: [
        'A function that closes the browser window',
        'A function that remembers variables from its outer scope',
        'A class with private members',
        'A way to end a loop early'
      ],
      correctIndex: 1,
      explanation: 'A closure is a function that retains access to variables from its outer (enclosing) scope, even after that scope has finished executing.'
    },
    {
      question: 'What is a pure function?',
      options: [
        'A function with no parameters',
        'A function that only uses primitive types',
        'A function with no side effects that returns the same output for the same input',
        'A function defined with the function keyword (not arrow)'
      ],
      correctIndex: 2,
      explanation: 'A pure function has no side effects (doesn\'t modify external state) and always returns the same output for the same input.'
    },
    {
      question: 'What is a higher-order function?',
      options: [
        'A function that runs faster than others',
        'A function that takes or returns other functions',
        'A function defined at the top of a file',
        'A function with more than 3 parameters'
      ],
      correctIndex: 1,
      explanation: 'A higher-order function either takes functions as arguments, returns a function, or both.'
    },
    {
      question: 'What must every recursive function have to avoid infinite recursion?',
      options: [
        'A return statement',
        'A base case that stops the recursion',
        'At least two parameters',
        'A try-catch block'
      ],
      correctIndex: 1,
      explanation: 'Every recursive function needs a base case - a condition that stops the recursion and returns a value directly.'
    }
  ],
  buildNote: {
    title: 'Functional Programming in Practice',
    explanation: `Functional programming concepts appear throughout modern JavaScript and TypeScript. Closures power React hooks (useState "remembers" state between renders). Higher-order functions like map and filter are used everywhere for data transformation. Pure functions make testing easy because they're predictable. Understanding these concepts is essential for reading and writing modern code.`,
    relatedFiles: [
      'src/hooks/useProgress.ts',
      'src/components/Quiz.tsx'
    ],
    inTheRealWorld: `React is heavily influenced by functional programming. Redux reducers must be pure functions. RxJS uses higher-order functions for reactive programming. Recursion is used for tree traversal, parsing, and algorithms. Libraries like Ramda and Lodash/fp provide functional utilities. Even if you don't write "pure functional" code, understanding these concepts makes you a better developer.`
  }
};
