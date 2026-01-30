import { Lesson } from '@/types/lesson';

export const classes: Lesson = {
  slug: 'classes',
  title: 'Classes & OOP',
  description: 'Learn object-oriented programming with TypeScript classes, constructors, and access modifiers.',
  difficulty: 'intermediate',
  order: 13,
  content: `
# Classes & Object-Oriented Programming

Classes are blueprints for creating objects. TypeScript adds type safety and access modifiers to JavaScript classes.

## Basic Class Structure

\`\`\`typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return "Hello, I'm " + this.name;
  }
}

let person = new Person("Alice", 30);
console.log(person.greet());  // "Hello, I'm Alice"
\`\`\`

## The Constructor

The constructor runs when you create a new instance:

\`\`\`typescript
class Car {
  brand: string;
  year: number;

  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }
}

let myCar = new Car("Toyota", 2022);
\`\`\`

## Access Modifiers

TypeScript provides three access levels:

\`\`\`typescript
class BankAccount {
  public owner: string;       // Accessible everywhere
  private balance: number;    // Only inside class
  protected id: string;       // Inside class and subclasses

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
    this.id = Math.random().toString();
  }

  public deposit(amount: number): void {
    this.balance += amount;
  }

  public getBalance(): number {
    return this.balance;
  }
}

let account = new BankAccount("Alice", 100);
console.log(account.owner);      // OK - public
// console.log(account.balance); // Error! - private
console.log(account.getBalance()); // OK - public method
\`\`\`

## Shorthand Constructor

TypeScript lets you declare and initialize in one step:

\`\`\`typescript
class User {
  constructor(
    public name: string,
    public email: string,
    private password: string
  ) {}

  // name, email, and password are automatically set
}

let user = new User("Alice", "alice@mail.com", "secret");
\`\`\`

## Methods

Functions inside classes are called methods:

\`\`\`typescript
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}

let calc = new Calculator();
console.log(calc.add(5, 3));  // 8
\`\`\`

## Inheritance

Extend classes to create specialized versions:

\`\`\`typescript
class Animal {
  constructor(public name: string) {}

  speak(): string {
    return this.name + " makes a sound";
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);  // Call parent constructor
  }

  speak(): string {
    return this.name + " barks!";
  }
}

let dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.speak());  // "Buddy barks!"
\`\`\`

## Getters and Setters

Control property access:

\`\`\`typescript
class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Below absolute zero!");
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return this._celsius * 9/5 + 32;
  }
}

let temp = new Temperature();
temp.celsius = 25;
console.log(temp.fahrenheit);  // 77
\`\`\`

## Static Members

Properties and methods on the class itself:

\`\`\`typescript
class MathUtils {
  static PI = 3.14159;

  static square(n: number): number {
    return n * n;
  }
}

console.log(MathUtils.PI);        // 3.14159
console.log(MathUtils.square(4)); // 16
// No need to create an instance!
\`\`\`

## The Big Picture: Classes in Real Applications

Classes organize complex application logic into reusable, encapsulated units. Here's how they're used in production:

### Service Classes
\`\`\`typescript
// API service with dependency injection
class ApiService {
  constructor(
    private baseUrl: string,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    const token = await this.authService.getToken();
    const response = await this.httpClient.request({
      method,
      url: \`\${this.baseUrl}\${endpoint}\`,
      headers: { Authorization: \`Bearer \${token}\` },
      data
    });
    return response.data;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  async delete(endpoint: string): Promise<void> {
    return this.request<void>('DELETE', endpoint);
  }
}

// Domain-specific service
class UserService {
  constructor(private api: ApiService) {}

  async getUser(id: string): Promise<User> {
    return this.api.get<User>(\`/users/\${id}\`);
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.api.post<User>('/users', data);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return this.api.put<User>(\`/users/\${id}\`, data);
  }
}
\`\`\`

### Repository Pattern
\`\`\`typescript
// Generic repository base class
abstract class Repository<T extends { id: string }> {
  protected items: Map<string, T> = new Map();

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async save(entity: T): Promise<T> {
    this.items.set(entity.id, entity);
    return entity;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  abstract validate(entity: T): boolean;
}

// Concrete implementation
class UserRepository extends Repository<User> {
  validate(user: User): boolean {
    return !!user.email && user.email.includes('@');
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(u => u.email === email) || null;
  }
}
\`\`\`

### State Management
\`\`\`typescript
// Observable store pattern
class Store<T> {
  private state: T;
  private listeners: Set<(state: T) => void> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(updater: (current: T) => T): void {
    this.state = updater(this.state);
    this.notify();
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Usage
interface AppState {
  user: User | null;
  items: Item[];
  loading: boolean;
}

const store = new Store<AppState>({
  user: null,
  items: [],
  loading: false
});

store.subscribe(state => console.log('State changed:', state));
store.setState(s => ({ ...s, loading: true }));
\`\`\`

### Builder Pattern
\`\`\`typescript
// Fluent builder for complex objects
class QueryBuilder<T> {
  private filters: Record<string, unknown> = {};
  private sortField?: keyof T;
  private sortOrder: 'asc' | 'desc' = 'asc';
  private limitValue?: number;
  private offsetValue?: number;

  where(field: keyof T, value: unknown): this {
    this.filters[field as string] = value;
    return this;
  }

  orderBy(field: keyof T, order: 'asc' | 'desc' = 'asc'): this {
    this.sortField = field;
    this.sortOrder = order;
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  offset(n: number): this {
    this.offsetValue = n;
    return this;
  }

  build(): QueryOptions<T> {
    return {
      filters: this.filters,
      sort: this.sortField ? { field: this.sortField, order: this.sortOrder } : undefined,
      limit: this.limitValue,
      offset: this.offsetValue
    };
  }
}

// Fluent usage
const query = new QueryBuilder<User>()
  .where('status', 'active')
  .where('role', 'admin')
  .orderBy('createdAt', 'desc')
  .limit(10)
  .build();
\`\`\`

### Event Emitter
\`\`\`typescript
// Type-safe event emitter
class EventEmitter<Events extends Record<string, unknown>> {
  private handlers = new Map<keyof Events, Set<(data: unknown) => void>>();

  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as (data: unknown) => void);
  }

  off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {
    this.handlers.get(event)?.delete(handler as (data: unknown) => void);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.handlers.get(event)?.forEach(handler => handler(data));
  }
}

// Usage
interface AppEvents {
  userLogin: { userId: string };
  itemAdded: { item: Item };
  error: { message: string };
}

const events = new EventEmitter<AppEvents>();
events.on('userLogin', ({ userId }) => console.log(\`User \${userId} logged in\`));
events.emit('userLogin', { userId: '123' });
\`\`\`

### Singleton Pattern
\`\`\`typescript
// Configuration singleton
class Config {
  private static instance: Config;
  private settings: Map<string, string> = new Map();

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  get(key: string): string | undefined {
    return this.settings.get(key);
  }

  set(key: string, value: string): void {
    this.settings.set(key, value);
  }
}

// Always gets the same instance
const config1 = Config.getInstance();
const config2 = Config.getInstance();
console.log(config1 === config2);  // true
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create classes with properties and methods
- Use constructors and the shorthand syntax
- Apply access modifiers (public, private, protected)
- Extend classes with inheritance
- Use getters, setters, and static members
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Class',
      description: `Build a Rectangle class that calculates area from its dimensions.

**Your task:**
1. Create a class called Rectangle with width and height properties (both numbers)
2. Add a constructor that takes width and height parameters and assigns them
3. Add an area() method that returns width multiplied by height
4. Create a rectangle with width 5 and height 3
5. Log the area to the console`,
      starterCode: `// Step 1: Create the Rectangle class with properties


// Step 2: Add constructor


// Step 3: Add area() method


// Step 4: Create a 5x3 rectangle


// Step 5: Log the area
`,
      solution: `class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

let rect = new Rectangle(5, 3);
console.log(rect.area());`,
      expectedOutput: ['15'],
      hints: [
        'Properties go inside the class: width: number;',
        'Constructor assigns: this.width = width;',
        'Method returns: this.width * this.height'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Shorthand Constructor',
      description: `Use TypeScript's shorthand constructor to create a Book class more concisely.

**Your task:**
1. Create a Book class using shorthand constructor syntax (public in parameters)
2. The class needs title (string) and author (string) properties
3. Create a book with title "1984" and author "George Orwell"
4. Log the book's title
5. Log the book's author`,
      starterCode: `// Step 1-2: Create Book class with shorthand constructor


// Step 3: Create the book


// Step 4: Log title


// Step 5: Log author
`,
      solution: `class Book {
  constructor(public title: string, public author: string) {}
}

let book = new Book("1984", "George Orwell");
console.log(book.title);
console.log(book.author);`,
      expectedOutput: ['1984', 'George Orwell'],
      hints: [
        'Shorthand: constructor(public title: string) creates and assigns automatically',
        'Class body can be empty {} with shorthand',
        'Access with book.title and book.author'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Private Property',
      description: `Create a Counter class that protects its internal count using private access.

**Your task:**
1. Create a Counter class with a private count property initialized to 0
2. Add an increment() method that adds 1 to count
3. Add a getCount() method that returns the current count
4. Create a counter instance
5. Call increment() twice
6. Log the count using getCount()`,
      starterCode: `// Step 1: Create Counter class with private count


// Step 2: Add increment() method


// Step 3: Add getCount() method


// Step 4: Create counter


// Step 5: Increment twice


// Step 6: Log the count
`,
      solution: `class Counter {
  private count: number = 0;

  increment(): void {
    this.count++;
  }

  getCount(): number {
    return this.count;
  }
}

let counter = new Counter();
counter.increment();
counter.increment();
console.log(counter.getCount());`,
      expectedOutput: ['2'],
      hints: [
        'Private property: private count: number = 0;',
        'Increment with: this.count++',
        'Cannot access counter.count directly - use getCount()'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Inheritance',
      description: `Create a class hierarchy where a child class extends a parent class.

**Your task:**
1. Create an \`Animal\` class with a name property and a speak() method that returns "[name] makes a sound"
2. Create a \`Cat\` class that extends Animal
3. Override speak() in Cat to return "[name] meows"
4. Create a cat named "Whiskers"
5. Print the result of speak()

**Inheritance syntax:** \`class Child extends Parent { }\``,
      starterCode: `// Step 1: Create Animal class with name and speak()


// Step 2: Create Cat class that extends Animal


// Step 3: Override speak() to return "[name] meows"


// Step 4: Create a cat named "Whiskers"


// Step 5: Print the speak() result

`,
      solution: `class Animal {
  constructor(public name: string) {}

  speak(): string {
    return this.name + " makes a sound";
  }
}

class Cat extends Animal {
  speak(): string {
    return this.name + " meows";
  }
}

let cat = new Cat("Whiskers");
console.log(cat.speak());`,
      expectedOutput: ['Whiskers meows'],
      hints: [
        'Animal uses shorthand constructor: constructor(public name: string) {}',
        'Cat extends Animal - it inherits name automatically',
        'Override speak() in Cat to change the behavior',
        'No need for super() if not adding new properties in Cat constructor'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does "private" access modifier mean?',
      options: [
        'The property can only be read, not written',
        'The property is only accessible within the class itself',
        'The property is hidden from TypeScript',
        'The property can be accessed by subclasses'
      ],
      correctIndex: 1,
      explanation: 'private members can only be accessed inside the class that defines them. Not even subclasses can access them directly.'
    },
    {
      question: 'What does the shorthand constructor syntax do?',
      options: [
        'Creates a constructor with no parameters',
        'Automatically creates and assigns properties from constructor parameters',
        'Makes the class abstract',
        'Removes the need for a constructor'
      ],
      correctIndex: 1,
      explanation: 'constructor(public name: string) {} automatically creates a name property and assigns the parameter value to it.'
    },
    {
      question: 'What does "extends" keyword do?',
      options: [
        'Adds more properties to an existing class',
        'Creates a new class that inherits from a parent class',
        'Makes a class longer',
        'Connects two unrelated classes'
      ],
      correctIndex: 1,
      explanation: 'extends creates inheritance. The child class gets all properties and methods from the parent, and can add or override them.'
    },
    {
      question: 'When must you call super() in a constructor?',
      options: [
        'Always',
        'Never',
        'When the class extends another class',
        'Only when using private properties'
      ],
      correctIndex: 2,
      explanation: 'super() must be called in a subclass constructor before accessing "this". It calls the parent class constructor.'
    }
  ],
  buildNote: {
    title: 'Classes in the App',
    explanation: `While this React app primarily uses functional components and hooks, classes appear in the TypeScript runner. The concept of encapsulation (private/public) is used conceptually even in functional code — hooks encapsulate state and expose only what's needed. The \`useProgress\` hook, for example, keeps the localStorage logic private and exposes only the methods components need. If this app used class components (older React pattern), you'd see classes everywhere. Understanding classes is essential for working with libraries that use them, like many Node.js libraries.`,
    relatedFiles: [
      'src/hooks/useProgress.ts',
      'src/lib/typescript-runner.ts'
    ],
    inTheRealWorld: `Classes are fundamental in many TypeScript codebases. Angular is built entirely on classes for components, services, and modules. NestJS uses classes with decorators for controllers and providers. Even in React, many libraries expose class-based APIs. Libraries like TypeORM use classes to define database entities. Understanding OOP concepts — encapsulation, inheritance, polymorphism — is essential for working with enterprise TypeScript applications.`
  }
};
