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
