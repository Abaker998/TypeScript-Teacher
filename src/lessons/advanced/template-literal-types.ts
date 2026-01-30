import { Lesson } from '@/types/lesson';

export const templateLiteralTypes: Lesson = {
  slug: 'template-literal-types',
  title: 'Template Literal Types',
  description: 'Create powerful string types using template literal syntax for precise typing.',
  difficulty: 'advanced',
  order: 22,
  content: `
# Template Literal Types

Template literal types let you build string types from other types, creating precise and expressive string patterns.

## Basic Template Literals

Combine string literals:

\`\`\`typescript
type Greeting = \`Hello, \${string}\`;

let g1: Greeting = "Hello, World";   // OK
let g2: Greeting = "Hello, Alice";   // OK
// let g3: Greeting = "Hi, Alice";   // Error! Must start with "Hello, "
\`\`\`

## Combining Literal Unions

Create all combinations:

\`\`\`typescript
type Color = "red" | "blue";
type Size = "small" | "large";

type ColorSize = \`\${Color}-\${Size}\`;
// "red-small" | "red-large" | "blue-small" | "blue-large"
\`\`\`

TypeScript automatically generates all combinations!

## Event Handler Types

Common pattern for event names:

\`\`\`typescript
type EventName = "click" | "focus" | "blur";
type Handler = \`on\${Capitalize<EventName>}\`;
// "onClick" | "onFocus" | "onBlur"
\`\`\`

## CSS-like Patterns

Create typed CSS values:

\`\`\`typescript
type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = \`\${number}\${CSSUnit}\`;

let width: CSSValue = "100px";   // OK
let height: CSSValue = "50%";    // OK
// let bad: CSSValue = "100";    // Error! Missing unit
\`\`\`

## String Manipulation Types

TypeScript provides built-in string utilities:

\`\`\`typescript
type Upper = Uppercase<"hello">;     // "HELLO"
type Lower = Lowercase<"HELLO">;     // "hello"
type Cap = Capitalize<"hello">;       // "Hello"
type Uncap = Uncapitalize<"Hello">;  // "hello"
\`\`\`

## Getter/Setter Pattern

Generate accessor names:

\`\`\`typescript
type PropName = "name" | "age" | "email";

type Getter = \`get\${Capitalize<PropName>}\`;
// "getName" | "getAge" | "getEmail"

type Setter = \`set\${Capitalize<PropName>}\`;
// "setName" | "setAge" | "setEmail"
\`\`\`

## API Route Types

Type your API endpoints:

\`\`\`typescript
type Resource = "users" | "posts" | "comments";
type APIRoute = \`/api/\${Resource}\`;
// "/api/users" | "/api/posts" | "/api/comments"

type APIRouteWithId = \`/api/\${Resource}/\${number}\`;
// "/api/users/123" matches
\`\`\`

## Key Remapping

Transform object keys:

\`\`\`typescript
type User = {
  name: string;
  age: number;
};

type Getters = {
  [K in keyof User as \`get\${Capitalize<K & string>}\`]: () => User[K]
};
// { getName: () => string; getAge: () => number }
\`\`\`

## Practical Example: Event Emitter

\`\`\`typescript
type Events = {
  userCreated: { id: number; name: string };
  userDeleted: { id: number };
};

type EventHandler<T> = (data: T) => void;

type EventEmitter = {
  [K in keyof Events as \`on\${Capitalize<K & string>}\`]: EventHandler<Events[K]>
};
// {
//   onUserCreated: (data: { id: number; name: string }) => void;
//   onUserDeleted: (data: { id: number }) => void;
// }
\`\`\`

## Combining with Generics

\`\`\`typescript
type PropEventType<T extends string> = \`\${T}Changed\`;

type NameChanged = PropEventType<"name">;  // "nameChanged"
type AgeChanged = PropEventType<"age">;    // "ageChanged"
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create template literal types from string literals
- Generate all combinations from union types
- Use string manipulation types (Uppercase, Capitalize, etc.)
- Build typed patterns for events, CSS, and APIs
- Remap object keys using template literals
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Template Literal',
      description: `Build a template literal type that combines HTTP methods with an API path.

**Your task:**
1. Create a type HttpMethod as a union of "GET" and "POST"
2. Create a type ApiCall using a template literal that produces "GET /api" | "POST /api"
3. Declare a variable of type ApiCall with a valid value
4. Log the variable`,
      starterCode: `// Step 1: Define the HttpMethod union type


// Step 2: Create ApiCall using template literal syntax: \`\${...} /api\`


// Step 3: Declare a variable with type ApiCall


// Step 4: Log the variable
`,
      solution: `type HttpMethod = "GET" | "POST";
type ApiCall = \`\${HttpMethod} /api\`;

let call: ApiCall = "GET /api";

console.log(call);`,
      expectedOutput: ['GET /api'],
      hints: [
        'Template literal syntax: `${Type} text`',
        'Union in template = union of all combinations'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Capitalize Pattern',
      description: `Use Capitalize to transform string literals in a template type.

**Your task:**
1. Create a type Color as "red" | "blue"
2. Create EventType using template literal with Capitalize to get "onRedClick" | "onBlueClick"
3. Declare and log a valid EventType value`,
      starterCode: `// Step 1: Define the Color union


// Step 2: Create EventType: \`on\${Capitalize<...>}Click\`


// Step 3: Declare a variable and log it
`,
      solution: `type Color = "red" | "blue";
type EventType = \`on\${Capitalize<Color>}Click\`;

let event: EventType = "onRedClick";

console.log(event);`,
      expectedOutput: ['onRedClick'],
      hints: [
        'Capitalize<"red"> produces "Red"',
        'Wrap the type in Capitalize<...> inside the template'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: CSS Value Type',
      description: `Create a type for CSS length values like "16px" or "1.5rem".

**Your task:**
1. Create a type Unit as "px" | "rem"
2. Create CSSLength using \${number} followed by \${Unit}
3. Declare a valid CSSLength value and log it`,
      starterCode: `// Step 1: Define the Unit union


// Step 2: Create CSSLength: \`\${number}\${...}\`


// Step 3: Declare a variable and log it
`,
      solution: `type Unit = "px" | "rem";
type CSSLength = \`\${number}\${Unit}\`;

let fontSize: CSSLength = "16px";

console.log(fontSize);`,
      expectedOutput: ['16px'],
      hints: [
        '\${number} matches any numeric string',
        'Combine two template parts: \`\${number}\${Unit}\`'
      ]
    }
  ],
  buildNote: {
    title: 'Template Literal Types in the App',
    explanation: `Template literal types could enhance this app in several ways. The lesson slugs could be typed as \`\${Difficulty}-\${string}\` to enforce naming conventions. Event handlers in React often follow patterns like \`on\${Event}\` which template literals can type precisely. CSS class names could be typed as \`\${component}-\${variant}\` for design systems. While this app uses simpler string types, template literal types would add compile-time validation for string patterns.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/components/OutputPanel.tsx'
    ],
    inTheRealWorld: `Template literal types are heavily used in modern TypeScript libraries. Next.js uses them for route typing. CSS-in-JS libraries like Tailwind's types use them for class name validation. GraphQL code generators create query types using template literals. Event systems use them for typed event names. They're especially powerful for creating type-safe DSLs (domain-specific languages) within TypeScript.`
  }
};
