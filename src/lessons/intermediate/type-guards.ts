import { Lesson } from '@/types/lesson';

export const typeGuards: Lesson = {
  slug: 'type-guards',
  title: 'Type Guards & Narrowing',
  description: 'Master techniques for narrowing types and writing type-safe conditional logic.',
  difficulty: 'intermediate',
  order: 15,
  content: `
# Type Guards & Narrowing

When a variable could be multiple types, TypeScript needs help knowing which type you're working with. Type guards narrow the type within a code block.

## The Problem

\`\`\`typescript
function process(value: string | number) {
  // TypeScript doesn't know if value is string or number
  // value.toUpperCase() - Error! number doesn't have toUpperCase
}
\`\`\`

## typeof Guard

The most common type guard:

\`\`\`typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // Here, value is narrowed to string
    console.log(value.toUpperCase());
  } else {
    // Here, value is narrowed to number
    console.log(value.toFixed(2));
  }
}
\`\`\`

## typeof for Primitives

Works for: "string", "number", "boolean", "undefined", "object", "function"

\`\`\`typescript
function describe(value: unknown) {
  if (typeof value === "string") {
    return "String: " + value;
  }
  if (typeof value === "number") {
    return "Number: " + value;
  }
  return "Other type";
}
\`\`\`

## instanceof Guard

Check if an object is an instance of a class:

\`\`\`typescript
class Dog {
  bark() { return "Woof!"; }
}

class Cat {
  meow() { return "Meow!"; }
}

function speak(pet: Dog | Cat) {
  if (pet instanceof Dog) {
    console.log(pet.bark());  // TypeScript knows it's Dog
  } else {
    console.log(pet.meow());  // TypeScript knows it's Cat
  }
}
\`\`\`

## in Operator Guard

Check if a property exists:

\`\`\`typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();  // TypeScript knows it's Fish
  } else {
    animal.fly();   // TypeScript knows it's Bird
  }
}
\`\`\`

## Truthiness Narrowing

Check for null/undefined:

\`\`\`typescript
function greet(name: string | null) {
  if (name) {
    console.log("Hello, " + name);  // name is string
  } else {
    console.log("Hello, stranger");  // name is null
  }
}
\`\`\`

## Equality Narrowing

Direct comparison narrows types:

\`\`\`typescript
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // x and y must both be string (the only common type)
    console.log(x.toUpperCase());
  }
}
\`\`\`

## Discriminated Unions

Use a common property to distinguish types:

\`\`\`typescript
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; size: number };
type Shape = Circle | Square;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
  }
}
\`\`\`

## Custom Type Guards

Create reusable type guard functions:

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase());  // TypeScript knows it's string
  }
}
\`\`\`

The \`value is string\` return type is a **type predicate**.

## Non-null Assertion

When you know a value isn't null (use carefully):

\`\`\`typescript
function process(value: string | null) {
  // The ! tells TypeScript "trust me, this isn't null"
  console.log(value!.toUpperCase());
}
\`\`\`

**Warning:** Only use when you're absolutely certain!

## The Big Picture: Type Guards in Real Applications

Type guards are essential for handling real-world data that comes in various shapes. Here's how they're used in production:

### API Response Handling
\`\`\`typescript
// Handle different API response shapes
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: { code: string; message: string } }
  | { status: 'loading' };

function isSuccess<T>(response: ApiResponse<T>): response is { status: 'success'; data: T } {
  return response.status === 'success';
}

function isError<T>(response: ApiResponse<T>): response is { status: 'error'; error: { code: string; message: string } } {
  return response.status === 'error';
}

// Usage in components
function handleResponse<T>(response: ApiResponse<T>) {
  if (isSuccess(response)) {
    // TypeScript knows response.data exists
    processData(response.data);
  } else if (isError(response)) {
    // TypeScript knows response.error exists
    showError(response.error.message);
  } else {
    // Must be loading
    showSpinner();
  }
}
\`\`\`

### Event Handler Type Narrowing
\`\`\`typescript
// Handle different event types
type AppEvent =
  | { type: 'click'; target: HTMLElement; x: number; y: number }
  | { type: 'keypress'; key: string; ctrlKey: boolean }
  | { type: 'scroll'; scrollTop: number; scrollLeft: number }
  | { type: 'resize'; width: number; height: number };

function handleEvent(event: AppEvent) {
  switch (event.type) {
    case 'click':
      console.log(\`Clicked at (\${event.x}, \${event.y})\`);
      highlightElement(event.target);
      break;
    case 'keypress':
      if (event.ctrlKey && event.key === 's') {
        saveDocument();
      }
      break;
    case 'scroll':
      updateScrollIndicator(event.scrollTop);
      break;
    case 'resize':
      adjustLayout(event.width, event.height);
      break;
  }
}
\`\`\`

### Form Data Validation
\`\`\`typescript
// Validate and narrow form input
type FormField =
  | { type: 'text'; value: string; minLength?: number; maxLength?: number }
  | { type: 'number'; value: number; min?: number; max?: number }
  | { type: 'email'; value: string }
  | { type: 'select'; value: string; options: string[] };

function isTextField(field: FormField): field is { type: 'text'; value: string; minLength?: number; maxLength?: number } {
  return field.type === 'text';
}

function validateField(field: FormField): string | null {
  if (field.type === 'text') {
    if (field.minLength && field.value.length < field.minLength) {
      return \`Must be at least \${field.minLength} characters\`;
    }
    if (field.maxLength && field.value.length > field.maxLength) {
      return \`Must be at most \${field.maxLength} characters\`;
    }
  }

  if (field.type === 'number') {
    if (field.min !== undefined && field.value < field.min) {
      return \`Must be at least \${field.min}\`;
    }
    if (field.max !== undefined && field.value > field.max) {
      return \`Must be at most \${field.max}\`;
    }
  }

  if (field.type === 'email') {
    if (!field.value.includes('@')) {
      return 'Invalid email format';
    }
  }

  if (field.type === 'select') {
    if (!field.options.includes(field.value)) {
      return 'Invalid selection';
    }
  }

  return null;
}
\`\`\`

### Unknown Data Parsing
\`\`\`typescript
// Safely parse unknown JSON data
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// Parse user data from API
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

function parseUser(data: unknown): User | null {
  if (!isObject(data)) return null;
  if (!isNumber(data.id)) return null;
  if (!isString(data.name)) return null;
  if (!isString(data.email)) return null;

  const user: User = {
    id: data.id,
    name: data.name,
    email: data.email
  };

  if (isNumber(data.age)) {
    user.age = data.age;
  }

  return user;
}

// Usage
const rawData = JSON.parse(apiResponse);
const user = parseUser(rawData);
if (user) {
  // Safely use user with full type information
  console.log(user.name);
}
\`\`\`

### Error Type Handling
\`\`\`typescript
// Handle different error types
class NetworkError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class AuthError extends Error {
  constructor(message: string, public shouldRedirect: boolean = true) {
    super(message);
    this.name = 'AuthError';
  }
}

function handleError(error: unknown): void {
  if (error instanceof NetworkError) {
    if (error.statusCode === 404) {
      showNotFound();
    } else if (error.statusCode >= 500) {
      showServerError();
    }
  } else if (error instanceof ValidationError) {
    highlightField(error.field);
    showFieldError(error.field, error.message);
  } else if (error instanceof AuthError) {
    if (error.shouldRedirect) {
      redirectToLogin();
    } else {
      showAuthError(error.message);
    }
  } else if (error instanceof Error) {
    showGenericError(error.message);
  } else {
    showGenericError('An unknown error occurred');
  }
}
\`\`\`

### Component Props Narrowing
\`\`\`typescript
// Polymorphic component props
type ButtonProps =
  | { variant: 'link'; href: string; external?: boolean }
  | { variant: 'button'; onClick: () => void; disabled?: boolean }
  | { variant: 'submit'; form: string; disabled?: boolean };

function Button(props: ButtonProps) {
  if (props.variant === 'link') {
    return (
      <a
        href={props.href}
        target={props.external ? '_blank' : undefined}
        rel={props.external ? 'noopener noreferrer' : undefined}
      >
        {/* children */}
      </a>
    );
  }

  if (props.variant === 'submit') {
    return (
      <button type="submit" form={props.form} disabled={props.disabled}>
        {/* children */}
      </button>
    );
  }

  // Must be 'button' variant
  return (
    <button type="button" onClick={props.onClick} disabled={props.disabled}>
      {/* children */}
    </button>
  );
}
\`\`\`

### WebSocket Message Handling
\`\`\`typescript
// Handle different message types
type WebSocketMessage =
  | { type: 'chat'; roomId: string; userId: string; message: string }
  | { type: 'presence'; userId: string; status: 'online' | 'offline' }
  | { type: 'typing'; roomId: string; userId: string; isTyping: boolean }
  | { type: 'error'; code: number; message: string };

function isMessage(data: unknown): data is WebSocketMessage {
  if (!isObject(data)) return false;
  if (!isString(data.type)) return false;
  return ['chat', 'presence', 'typing', 'error'].includes(data.type);
}

function handleWebSocketMessage(data: unknown) {
  if (!isMessage(data)) {
    console.warn('Invalid message format');
    return;
  }

  switch (data.type) {
    case 'chat':
      displayMessage(data.roomId, data.userId, data.message);
      break;
    case 'presence':
      updateUserStatus(data.userId, data.status);
      break;
    case 'typing':
      showTypingIndicator(data.roomId, data.userId, data.isTyping);
      break;
    case 'error':
      handleConnectionError(data.code, data.message);
      break;
  }
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use typeof for primitive type guards
- Use instanceof for class type guards
- Use the "in" operator to check for properties
- Create discriminated unions with kind properties
- Write custom type guard functions
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: typeof Guard',
      description: `Use \`typeof\` to narrow a union type and handle each case differently.

**Your task:**
1. Create a function \`formatValue\` that takes \`string | number\` and returns \`string\`
2. Use \`typeof\` to check if the value is a string
3. If string, return it uppercase; if number, return it with 2 decimal places
4. Test with both "hello" and 42.5`,
      starterCode: `// Step 1: Create the function


// Step 2: Check the type with typeof


// Step 3: Handle each case


// Step 4: Test with both types
`,
      solution: `function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

console.log(formatValue("hello"));
console.log(formatValue(42.5));`,
      expectedOutput: ['HELLO', '42.50'],
      hints: [
        'typeof value === "string" narrows to string type',
        'In else block, TypeScript knows it must be number',
        '.toFixed(2) formats numbers with 2 decimals'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Truthiness Guard',
      description: `Use truthiness checking to handle \`null\` values safely.

**Your task:**
1. Create a function \`greetUser\` that takes \`string | null\` and returns nothing
2. Use an if statement to check if the name is truthy
3. If name exists, log "Hello, [name]!"; otherwise log "Hello, guest!"
4. Test with "Alice" and null`,
      starterCode: `// Step 1: Create the function


// Step 2: Check if name is truthy


// Step 3: Handle each case


// Step 4: Test with both values
`,
      solution: `function greetUser(name: string | null): void {
  if (name) {
    console.log("Hello, " + name + "!");
  } else {
    console.log("Hello, guest!");
  }
}

greetUser("Alice");
greetUser(null);`,
      expectedOutput: ['Hello, Alice!', 'Hello, guest!'],
      hints: [
        'if (name) is true when name is not null/empty',
        'Inside if block, TypeScript narrows to string',
        'Concatenate: "Hello, " + name + "!"'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: in Operator Guard',
      description: `Use the \`in\` operator to check which properties exist on a union type.

**Your task:**
1. Define types Car (with drive method) and Boat (with sail method)
2. Create one object of each type that returns "Driving..." or "Sailing..."
3. Write a function \`operate\` that uses "in" to check which method exists
4. Test with both vehicle types`,
      starterCode: `// Step 1: Define the types


// Step 2: Create objects


// Step 3: Write the operate function


// Step 4: Test with both
`,
      solution: `type Car = { drive: () => string };
type Boat = { sail: () => string };

let car: Car = { drive: () => "Driving..." };
let boat: Boat = { sail: () => "Sailing..." };

function operate(vehicle: Car | Boat): void {
  if ("drive" in vehicle) {
    console.log(vehicle.drive());
  } else {
    console.log(vehicle.sail());
  }
}

operate(car);
operate(boat);`,
      expectedOutput: ['Driving...', 'Sailing...'],
      hints: [
        '"drive" in vehicle checks if property exists',
        'This narrows the type to Car in the if block',
        'In else, TypeScript knows it must be Boat'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Custom Type Predicate',
      description: `Create a custom type guard function using a type predicate.

**Your task:**
1. Define a type \`Fish\` with \`swim: () => string\` method
2. Define a type \`Bird\` with \`fly: () => string\` method
3. Write a type guard \`isFish(pet: Fish | Bird): pet is Fish\` that checks for swim
4. Create one fish and one bird, test each with the type guard`,
      starterCode: `// Step 1: Define Fish type


// Step 2: Define Bird type


// Step 3: Write isFish type guard function


// Step 4: Create a fish object


// Step 5: Create a bird object


// Step 6: Test both with isFish and log results
`,
      solution: `type Fish = { swim: () => string };
type Bird = { fly: () => string };

function isFish(pet: Fish | Bird): pet is Fish {
  return "swim" in pet;
}

const fish: Fish = { swim: () => "Swimming!" };
const bird: Bird = { fly: () => "Flying!" };

console.log(isFish(fish));
console.log(isFish(bird));`,
      expectedOutput: ['true', 'false'],
      hints: [
        'Type predicate syntax: paramName is Type',
        'Return a boolean that indicates the type',
        'Use "in" operator to check for swim property'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does TypeScript do when you check `if (typeof x === "string")`?',
      options: [
        'Throws an error at runtime',
        'Narrows the type of x to string inside the if block',
        'Converts x to a string',
        'Returns a boolean but does not affect types'
      ],
      correctIndex: 1,
      explanation: 'TypeScript uses typeof checks as type guards - inside the if block, x is narrowed to type string.'
    },
    {
      question: 'What is a type predicate in TypeScript?',
      options: [
        'A function that predicts types at compile time',
        'A return type annotation like `param is Type` that narrows types',
        'A conditional type expression',
        'A way to create new types dynamically'
      ],
      correctIndex: 1,
      explanation: 'A type predicate is a special return type (param is Type) that tells TypeScript the function is a type guard.'
    },
    {
      question: 'When does the `instanceof` type guard work?',
      options: [
        'Only with primitive types like string and number',
        'With any type including type aliases',
        'Only with classes and constructor functions',
        'Only in catch blocks'
      ],
      correctIndex: 2,
      explanation: 'instanceof checks the prototype chain, so it only works with classes and constructor functions, not type aliases or interfaces.'
    },
    {
      question: 'What does the `in` operator check in a type guard?',
      options: [
        'If a value is included in an array',
        'If a property exists on an object',
        'If a type is in a union',
        'If a module is imported'
      ],
      correctIndex: 1,
      explanation: 'The in operator checks if a property name exists on an object, which TypeScript uses to narrow union types.'
    }
  ],
  buildNote: {
    title: 'Type Guards in the App',
    explanation: `Type guards are used throughout this app. In \`src/components/OutputPanel.tsx\`, we check \`if (result?.success)\` to narrow the type before accessing result properties. The error handling uses \`if (error instanceof Error)\` to safely access error.message. In the lesson page, we check \`if (!lesson)\` to handle the not-found case before rendering lesson content. The \`gradeOutput\` function uses truthiness checks on array indices. These patterns make the code robust against null/undefined errors.`,
    relatedFiles: [
      'src/components/OutputPanel.tsx',
      'src/app/lessons/[slug]/page.tsx',
      'src/components/Quiz.tsx'
    ],
    inTheRealWorld: `Type guards are essential for working with API responses, user input, and any external data. Libraries like Zod use type guards to validate and narrow types at runtime. Redux Toolkit uses discriminated unions for actions. The pattern of checking \`if ("error" in response)\` vs \`if ("data" in response)\` is standard for handling API results. Custom type guards with type predicates are used in utility libraries to create reusable validation functions.`
  }
};
