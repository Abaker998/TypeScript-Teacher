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
