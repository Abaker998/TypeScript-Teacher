import { Lesson } from '@/types/lesson';

export const enumsAndModules: Lesson = {
  slug: 'enums-and-modules',
  title: 'Enums & Modules',
  description: 'Learn to use enums for named constants and organize code with modules.',
  difficulty: 'intermediate',
  order: 15,
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
