import { Lesson } from '@/types/lesson';

export const decoratorsAndPatterns: Lesson = {
  slug: 'decorators-and-patterns',
  title: 'Decorators & Advanced Patterns',
  description: 'Learn class decorators and advanced composition patterns for building scalable applications.',
  difficulty: 'advanced',
  order: 26,
  content: `
# Decorators & Advanced Patterns

Decorators are a TypeScript feature that lets you attach metadata or functionality to classes, methods, and properties. Combined with advanced patterns, they enable powerful, composable architectures.

## Class Decorators

A decorator is a function that receives a class and can modify it:

\`\`\`typescript
function Logger(target: Function) {
  const original = target;

  const f: any = function(...args: any[]) {
    console.log("Creating instance of " + original.name);
    return new original(...args);
  };

  f.prototype = original.prototype;
  return f;
}

@Logger
class User {
  constructor(public name: string) {}
}

const user = new User("Alice");  // Logs: "Creating instance of User"
\`\`\`

The \`@Logger\` syntax is shorthand for \`User = Logger(User)\`.

## Method Decorators

Method decorators wrap individual methods:

\`\`\`typescript
function Timing(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(\`\${propertyKey} took \${end - start}ms\`);
    return result;
  };

  return descriptor;
}

class Calculator {
  @Timing
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3);  // Logs timing information
\`\`\`

## Higher-Order Components (React Pattern)

In React, a higher-order component (HOC) is a function that takes a component and returns an enhanced component:

\`\`\`typescript
interface WithLoadingProps {
  isLoading: boolean;
}

function withLoading<P>(Component: React.ComponentType<P>) {
  return (props: P & WithLoadingProps) => {
    if (props.isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

interface UserListProps {
  users: string[];
}

function UserList({ users }: UserListProps) {
  return <ul>{users.map(u => <li key={u}>{u}</li>)}</ul>;
}

const UserListWithLoading = withLoading(UserList);
// Now you can use: <UserListWithLoading isLoading={false} users={[]} />
\`\`\`

## Render Props Pattern

Another composition pattern uses a function as a child:

\`\`\`typescript
interface DataProviderProps {
  children: (data: string[]) => React.ReactNode;
}

function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<string[]>([]);
  // Fetch data...
  return children(data);
}

// Usage:
<DataProvider>
  {(data) => <UserList users={data} />}
</DataProvider>
\`\`\`

## Composition Over Inheritance

Prefer composing components and types over deep inheritance hierarchies:

\`\`\`typescript
// Avoid: Deep inheritance
class Component { }
class Button extends Component { }
class PrimaryButton extends Button { }

// Prefer: Composition
type ButtonProps = {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
};

function Button({ variant, onClick, children }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{children}</button>;
}
\`\`\`

## The Big Picture: Decorators & Patterns in Real Applications

Decorators and composition patterns are foundational in enterprise TypeScript applications. Here's how they're used:

### Method Decorators for Cross-Cutting Concerns
\`\`\`typescript
// Logging decorator
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = async function(...args: any[]) {
    const start = Date.now();
    console.log(\`[\${propertyKey}] Called with:\`, args);

    try {
      const result = await original.apply(this, args);
      console.log(\`[\${propertyKey}] Returned:\`, result, \`(\${Date.now() - start}ms)\`);
      return result;
    } catch (error) {
      console.error(\`[\${propertyKey}] Failed:\`, error);
      throw error;
    }
  };

  return descriptor;
}

// Retry decorator
function Retry(maxAttempts: number = 3, delayMs: number = 1000) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      let lastError: Error;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await original.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
          }
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

// Cache decorator
function Cache(ttlMs: number) {
  const cache = new Map<string, { value: any; expires: number }>();

  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const key = JSON.stringify(args);
      const cached = cache.get(key);

      if (cached && cached.expires > Date.now()) {
        return cached.value;
      }

      const result = await original.apply(this, args);
      cache.set(key, { value: result, expires: Date.now() + ttlMs });
      return result;
    };

    return descriptor;
  };
}

// Usage
class UserService {
  @Log
  @Retry(3, 1000)
  @Cache(60000)
  async getUser(id: string): Promise<User> {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  }
}
\`\`\`

### Dependency Injection Pattern
\`\`\`typescript
// Service container
class Container {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  register<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  registerSingleton<T>(token: string, factory: () => T): void {
    this.register(token, () => {
      if (!this.services.has(token)) {
        this.services.set(token, factory());
      }
      return this.services.get(token);
    });
  }

  resolve<T>(token: string): T {
    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(\`Service not registered: \${token}\`);
    }
    return factory();
  }
}

// Inject decorator
function Inject(token: string) {
  return function(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get() {
        return container.resolve(token);
      }
    });
  };
}

// Usage
const container = new Container();
container.registerSingleton('database', () => new DatabaseConnection());
container.registerSingleton('userRepo', () => new UserRepository(container.resolve('database')));

class UserController {
  @Inject('userRepo')
  private userRepo!: UserRepository;

  async getUser(id: string) {
    return this.userRepo.findById(id);
  }
}
\`\`\`

### React HOC Patterns (Higher-Order Components)
\`\`\`typescript
// Generic HOC type
type HOC<InjectedProps> = <P extends InjectedProps>(
  Component: React.ComponentType<P>
) => React.ComponentType<Omit<P, keyof InjectedProps>>;

// Authentication HOC
interface WithAuthProps {
  user: User;
  isAuthenticated: boolean;
}

function withAuth<P extends WithAuthProps>(
  Component: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof WithAuthProps>> {
  return function AuthenticatedComponent(props: Omit<P, keyof WithAuthProps>) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return <Component {...(props as P)} user={user} isAuthenticated={isAuthenticated} />;
  };
}

// Loading HOC
interface WithLoadingProps {
  isLoading: boolean;
  error: Error | null;
}

function withLoading<P extends WithLoadingProps>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType = DefaultLoader,
  ErrorComponent: React.ComponentType<{ error: Error }> = DefaultError
): React.ComponentType<Omit<P, keyof WithLoadingProps> & Partial<WithLoadingProps>> {
  return function LoadingComponent(props) {
    if (props.isLoading) {
      return <LoadingComponent />;
    }

    if (props.error) {
      return <ErrorComponent error={props.error} />;
    }

    return <Component {...(props as P)} isLoading={false} error={null} />;
  };
}

// Compose multiple HOCs
const EnhancedUserProfile = withAuth(withLoading(UserProfile));
\`\`\`

### Middleware Pattern
\`\`\`typescript
// Type-safe middleware
type Context = {
  request: Request;
  response: Response;
  user?: User;
  startTime?: number;
};

type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;

// Compose middleware
function compose(...middlewares: Middleware[]): Middleware {
  return async (ctx, next) => {
    let index = -1;

    async function dispatch(i: number): Promise<void> {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;

      const fn = i === middlewares.length ? next : middlewares[i];
      if (fn) {
        await fn(ctx, () => dispatch(i + 1));
      }
    }

    await dispatch(0);
  };
}

// Example middlewares
const timing: Middleware = async (ctx, next) => {
  ctx.startTime = Date.now();
  await next();
  console.log(\`Request took \${Date.now() - ctx.startTime}ms\`);
};

const auth: Middleware = async (ctx, next) => {
  const token = ctx.request.headers.get('Authorization');
  if (token) {
    ctx.user = await verifyToken(token);
  }
  await next();
};

const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.response = new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
};

// Compose and use
const middleware = compose(errorHandler, timing, auth);
\`\`\`

### Observer Pattern
\`\`\`typescript
// Type-safe observable
class Observable<T> {
  private observers: Set<(value: T) => void> = new Set();
  private _value: T;

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this.notify();
  }

  subscribe(observer: (value: T) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  private notify(): void {
    this.observers.forEach(observer => observer(this._value));
  }
}

// Computed observable
function computed<T, R>(
  observable: Observable<T>,
  transform: (value: T) => R
): Observable<R> {
  const result = new Observable(transform(observable.value));

  observable.subscribe(value => {
    result.value = transform(value);
  });

  return result;
}

// Usage
const user = new Observable<User | null>(null);
const isLoggedIn = computed(user, u => u !== null);
const userName = computed(user, u => u?.name ?? 'Guest');

isLoggedIn.subscribe(loggedIn => {
  console.log('Login state:', loggedIn);
});
\`\`\`

### Command Pattern
\`\`\`typescript
// Command interface
interface Command<T = void> {
  execute(): T | Promise<T>;
  undo?(): T | Promise<T>;
}

// Command invoker with history
class CommandInvoker {
  private history: Command[] = [];
  private position = -1;

  async execute<T>(command: Command<T>): Promise<T> {
    const result = await command.execute();

    // Clear redo stack
    this.history = this.history.slice(0, this.position + 1);
    this.history.push(command);
    this.position++;

    return result;
  }

  async undo(): Promise<void> {
    if (this.position < 0) return;

    const command = this.history[this.position];
    if (command.undo) {
      await command.undo();
    }
    this.position--;
  }

  async redo(): Promise<void> {
    if (this.position >= this.history.length - 1) return;

    this.position++;
    const command = this.history[this.position];
    await command.execute();
  }
}

// Example commands
class UpdateUserCommand implements Command {
  constructor(
    private userId: string,
    private updates: Partial<User>,
    private previousState?: Partial<User>
  ) {}

  async execute() {
    this.previousState = await userService.getUser(this.userId);
    await userService.updateUser(this.userId, this.updates);
  }

  async undo() {
    if (this.previousState) {
      await userService.updateUser(this.userId, this.previousState);
    }
  }
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Apply class decorators to add functionality
- Use method decorators for cross-cutting concerns
- Understand higher-order components in React
- Apply composition patterns for flexible architectures
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Class Decorator',
      description: `Class decorators wrap a class constructor to modify behavior.

**Your task:**
1. Create a decorator function \`Uppercase\` that uppercases the \`name\` property
2. Apply it to a \`User\` class using \`@Uppercase\`
3. Create a user with lowercase name and print it (should be uppercase)

**Decorator pattern:**
\`\`\`
function Decorator(target: Function) {
  const original = target;
  const f: any = function(...args: any[]) {
    const instance = new original(...args);
    // modify instance here
    return instance;
  };
  f.prototype = original.prototype;
  return f;
}
\`\`\``,
      starterCode: `// Step 1: Create the Uppercase decorator


// Step 2: Apply decorator to User class


// Step 3: Create user with lowercase name and print

`,
      solution: `function Uppercase(target: Function) {
  const original = target;

  const f: any = function(...args: any[]) {
    const instance = new original(...args);
    if (instance.name && typeof instance.name === "string") {
      instance.name = instance.name.toUpperCase();
    }
    return instance;
  };

  f.prototype = original.prototype;
  return f;
}

@Uppercase
class User {
  constructor(public name: string) {}
}

const user = new User("alice");
console.log(user.name);`,
      expectedOutput: ['ALICE'],
      hints: [
        'The decorator receives the class constructor as its argument',
        'Wrap the original constructor in a new function',
        'Create the instance with new original(...args)',
        'Modify the instance.name property before returning'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Factory Pattern with Types',
      description: `Implement a typed factory that creates different product types based on a discriminator.

**Your task:**
1. Define \`Book\` interface with type: "book" and title: string
2. Define \`Movie\` interface with type: "movie" and director: string
3. Create a \`ProductMap\` interface mapping type names to interfaces
4. Write a generic \`createProduct\` function that returns the correct type
5. Create one book and one movie, print their properties

**Generic factory pattern:**
\`\`\`
function createProduct<T extends keyof ProductMap>(
  type: T,
  data: Omit<ProductMap[T], "type">
): ProductMap[T]
\`\`\``,
      starterCode: `// Step 1: Define Book interface


// Step 2: Define Movie interface


// Step 3: Create ProductMap to map type names to interfaces


// Step 4: Write the generic createProduct function


// Step 5: Create products and print their properties

`,
      solution: `interface Book {
  type: "book";
  title: string;
}

interface Movie {
  type: "movie";
  director: string;
}

type Product = Book | Movie;

interface ProductMap {
  book: Book;
  movie: Movie;
}

function createProduct<T extends keyof ProductMap>(
  type: T,
  data: Omit<ProductMap[T], "type">
): ProductMap[T] {
  return { type, ...data } as ProductMap[T];
}

const book = createProduct("book", { title: "TypeScript Guide" });
const movie = createProduct("movie", { director: "Christopher Nolan" });

console.log(book.type + ": " + book.title);
console.log(movie.type + ": " + movie.director);`,
      expectedOutput: ['book: TypeScript Guide', 'movie: Christopher Nolan'],
      hints: [
        'ProductMap maps "book" to Book and "movie" to Movie',
        'T extends keyof ProductMap constrains type to valid keys',
        'Omit<ProductMap[T], "type"> removes type from required data',
        'The factory automatically adds the type field'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Builder Pattern with Generics',
      description: `Implement a typed builder that tracks which properties have been set.

**Your task:**
1. Define a \`User\` interface with name, age, and email
2. Create \`UserBuilder<T>\` class with setName, setAge, setEmail methods
3. Each setter should return a new builder with an intersection type
4. The \`build\` method should only work when all properties are set
5. Build a user and print each property

**Builder pattern with type tracking:**
Each setter returns \`UserBuilder<T & { prop: type }>\` to track what's been set`,
      starterCode: `// Step 1: Define User interface


// Step 2: Create UserBuilder class with generic type tracking


// Step 3: Use the builder to create a user


// Step 4: Print each property

`,
      solution: `interface User {
  name: string;
  age: number;
  email: string;
}

class UserBuilder<T extends Partial<User> = {}> {
  private data: T;

  constructor(data: T = {} as T) {
    this.data = data;
  }

  setName(name: string): UserBuilder<T & { name: string }> {
    return new UserBuilder({ ...this.data, name });
  }

  setAge(age: number): UserBuilder<T & { age: number }> {
    return new UserBuilder({ ...this.data, age });
  }

  setEmail(email: string): UserBuilder<T & { email: string }> {
    return new UserBuilder({ ...this.data, email });
  }

  build(this: UserBuilder<User>): User {
    return this.data;
  }
}

const user = new UserBuilder()
  .setName("Alice")
  .setAge(30)
  .setEmail("alice@example.com")
  .build();

console.log(user.name);
console.log(user.age);
console.log(user.email);`,
      expectedOutput: ['Alice', '30', 'alice@example.com'],
      hints: [
        'UserBuilder<T> tracks which properties have been set in T',
        'T & { name: string } adds name to the tracked properties',
        'build() uses "this: UserBuilder<User>" to require all properties',
        'Call build() after all three setters for it to type-check'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Decorator Pattern with Functions',
      description: `Implement a simple decorator pattern using higher-order functions.

**Your task:**
1. Write a \`withLogging\` function that wraps another function
2. It should log "Calling: " + function name before calling
3. It should log "Result: " + result after calling
4. Test by wrapping a simple add function`,
      starterCode: `// Step 1: Write the withLogging decorator function
// Takes a function and its name, returns a wrapped version


// Step 2: Create a simple add function


// Step 3: Wrap add with logging


// Step 4: Call the wrapped function and see the logs
`,
      solution: `function withLogging<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: any[]) => {
    console.log("Calling: " + name);
    const result = fn(...args);
    console.log("Result: " + result);
    return result;
  }) as T;
}

function add(a: number, b: number): number {
  return a + b;
}

const loggedAdd = withLogging(add, "add");

loggedAdd(2, 3);`,
      expectedOutput: ['Calling: add', 'Result: 5'],
      hints: [
        'Return a new function that wraps the original',
        'Log before calling fn(...args)',
        'Log the result after calling',
        'Cast the wrapper as T to preserve the type'
      ],
    },
  ],
  quiz: [
    {
      question: 'What is the decorator pattern in programming?',
      options: [
        'A way to add visual decorations to UI components',
        'A pattern that wraps objects/functions to add behavior without modification',
        'A method of documenting code',
        'A way to create abstract classes'
      ],
      correctIndex: 1,
      explanation: 'The decorator pattern wraps an object or function to extend its behavior without modifying its original code.'
    },
    {
      question: 'In TypeScript, what does the @decorator syntax require?',
      options: [
        'No special configuration',
        'The "experimentalDecorators" compiler option enabled',
        'A specific TypeScript version',
        'The decorator must be a class'
      ],
      correctIndex: 1,
      explanation: 'TypeScript\'s @ decorator syntax requires "experimentalDecorators": true in tsconfig.json.'
    },
    {
      question: 'What is a Higher-Order Component (HOC) in React?',
      options: [
        'A component with high priority',
        'A function that takes a component and returns an enhanced component',
        'A component at the top of the tree',
        'A class-based component'
      ],
      correctIndex: 1,
      explanation: 'An HOC is a function that takes a component and returns a new component with additional props or behavior - it\'s the decorator pattern for React.'
    },
    {
      question: 'What is the main benefit of the builder pattern?',
      options: [
        'Faster runtime performance',
        'Smaller bundle sizes',
        'Step-by-step object construction with fluent API',
        'Automatic dependency injection'
      ],
      correctIndex: 2,
      explanation: 'The builder pattern allows constructing complex objects step-by-step with method chaining, often with compile-time validation of required fields.'
    }
  ],
  buildNote: {
    title: 'Decorators & Patterns in the App',
    explanation: `The TypeScript teaching app itself demonstrates key composition and organization patterns. React components like Sidebar in \`src/components/Sidebar.tsx\`, CodeEditor in \`src/components/CodeEditor.tsx\`, and OutputPanel in \`src/components/OutputPanel.tsx\` are independently typed with interfaces and composed together in the lesson page at \`src/app/lessons/[slug]/page.tsx\`. The app doesn't use class decorators (since it's built with functional React), but the composition pattern is a decorator-like approach — each component wraps functionality. The way lessons are structured — as stateless, immutable data objects composed by the page component — is a form of composition over inheritance. The app orchestrates multiple components at different levels: the layout component in \`src/app/layout.tsx\` composes the sidebar and content area, while the lesson page composes the header bar, lesson content, and code editor. Each component has a single responsibility and receives its data via typed props interfaces. The lesson content itself separates concerns elegantly: metadata fields (slug, title, difficulty) are separate from markdown content, which is separate from code examples, which is separate from build notes. This separation enables the app to scale to many more lessons without code duplication or maintenance burden.`,
    relatedFiles: [
      'src/components/Sidebar.tsx',
      'src/components/CodeEditor.tsx',
      'src/components/OutputPanel.tsx',
      'src/app/lessons/[slug]/page.tsx'
    ],
    inTheRealWorld: `Decorators are widely used in enterprise TypeScript frameworks. NestJS extensively uses decorators like \`@Controller\`, \`@Get\`, \`@Post\` for routing and \`@Injectable\` for dependency injection. Angular uses decorators like \`@Component\`, \`@Directive\`, \`@Service\`. TypeORM uses decorators like \`@Entity\`, \`@Column\`, \`@ManyToOne\` for mapping classes to database tables. Higher-order components are standard in React — Redux's \`connect\`, MUI's \`withStyles\`, and many authentication libraries use HOCs. Composition patterns appear everywhere: Redux middleware composes handlers, Express middleware chains handlers, RxJS operators compose streams. The principle is that composition enables flexibility and testability better than inheritance, which creates brittle hierarchies.`
  }
};
