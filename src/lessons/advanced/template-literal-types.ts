import { Lesson } from '@/types/lesson';

export const templateLiteralTypes: Lesson = {
  slug: 'template-literal-types',
  title: 'Template Literal Types',
  description: 'Create powerful string types using template literal syntax for precise typing.',
  difficulty: 'advanced',
  order: 24,
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

## The Big Picture: Template Literal Types in Real Applications

Template literal types enable powerful string pattern validation and transformation at the type level. Here's how they're used in production:

### Route Type Safety
\`\`\`typescript
// Define route patterns
type RouteBase = '/users' | '/products' | '/orders';
type RouteWithId = \`\${RouteBase}/\${string}\`;
type RouteWithAction = \`\${RouteBase}/\${string}/\${'edit' | 'delete' | 'view'}\`;

// API method patterns
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ApiEndpoint = \`\${HttpMethod} \${RouteBase | RouteWithId}\`;

// Valid endpoints
const validEndpoint: ApiEndpoint = 'GET /users';
const validEndpointWithId: ApiEndpoint = 'DELETE /users/123';

// Route parameter extraction pattern
type ExtractParams<T extends string> =
  T extends \`\${infer _Start}:\${infer Param}/\${infer Rest}\`
    ? Param | ExtractParams<Rest>
    : T extends \`\${infer _Start}:\${infer Param}\`
      ? Param
      : never;

type UserRouteParams = ExtractParams<'/users/:userId/posts/:postId'>;
// 'userId' | 'postId'
\`\`\`

### CSS-in-JS Type Safety
\`\`\`typescript
// CSS units
type CSSUnit = 'px' | 'em' | 'rem' | '%' | 'vh' | 'vw';
type CSSLength = \`\${number}\${CSSUnit}\` | '0' | 'auto';

// CSS colors
type HexColor = \`#\${string}\`;
type RgbColor = \`rgb(\${number}, \${number}, \${number})\`;
type RgbaColor = \`rgba(\${number}, \${number}, \${number}, \${number})\`;
type CSSColor = HexColor | RgbColor | RgbaColor | 'transparent' | 'inherit';

// Spacing scale
type SpacingKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpacingValue = \`\${number}\${CSSUnit}\`;
type SpacingScale = Record<SpacingKey, SpacingValue>;

// Style property patterns
type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';

// Responsive breakpoints
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
type ResponsiveValue<T> = T | { [K in Breakpoint]?: T };
type ResponsiveStyle = ResponsiveValue<CSSLength>;
\`\`\`

### Event System Types
\`\`\`typescript
// Event name patterns
type DOMEvent = 'click' | 'focus' | 'blur' | 'change' | 'submit';
type EventHandler = \`on\${Capitalize<DOMEvent>}\`;
// 'onClick' | 'onFocus' | 'onBlur' | 'onChange' | 'onSubmit'

// Custom event patterns
type EntityType = 'user' | 'product' | 'order';
type ActionType = 'created' | 'updated' | 'deleted';
type EntityEvent = \`\${EntityType}:\${ActionType}\`;
// 'user:created' | 'user:updated' | 'user:deleted' | 'product:created' | ...

// Event handler names
type EntityEventHandler = \`on\${Capitalize<EntityType>}\${Capitalize<ActionType>}\`;
// 'onUserCreated' | 'onUserUpdated' | 'onUserDeleted' | 'onProductCreated' | ...

// WebSocket message types
type WsAction = 'subscribe' | 'unsubscribe' | 'publish';
type WsChannel = 'chat' | 'notifications' | 'updates';
type WsMessage = \`\${WsAction}:\${WsChannel}\`;
\`\`\`

### Database Query Types
\`\`\`typescript
// Column selectors
type Column = 'id' | 'name' | 'email' | 'createdAt';
type SelectColumn = \`\${Column}\` | \`\${Column} AS \${string}\`;
type OrderBy = \`\${Column} \${'ASC' | 'DESC'}\`;

// Query builder types
type Operator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN';
type WhereClause = \`\${Column} \${Operator} ?\`;

// Table relations
type Table = 'users' | 'orders' | 'products';
type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
type JoinClause = \`\${JoinType} JOIN \${Table} ON \${string}\`;

// Index naming convention
type IndexName = \`idx_\${Table}_\${Column}\`;
type ForeignKeyName = \`fk_\${Table}_\${Table}\`;
\`\`\`

### Environment Variables
\`\`\`typescript
// Environment variable patterns
type EnvPrefix = 'NEXT_PUBLIC' | 'VITE' | 'REACT_APP';
type EnvCategory = 'API' | 'AUTH' | 'DB' | 'CACHE';
type EnvName = 'URL' | 'KEY' | 'SECRET' | 'HOST' | 'PORT';

type PublicEnvVar = \`\${EnvPrefix}_\${EnvCategory}_\${EnvName}\`;
type PrivateEnvVar = \`\${EnvCategory}_\${EnvName}\`;

// Validate env var format
type ValidEnvVar = PublicEnvVar | PrivateEnvVar;

// Example valid env vars
type ExampleEnvVars = {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_API_KEY: string;
  DB_HOST: string;
  DB_PORT: string;
  AUTH_SECRET: string;
};
\`\`\`

### Component Variant Types
\`\`\`typescript
// Button variants
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonState = 'default' | 'hover' | 'active' | 'disabled';

// CSS class naming convention (BEM-like)
type ButtonClass = \`btn-\${ButtonVariant}\` | \`btn-\${ButtonSize}\` | \`btn-\${ButtonState}\`;
type ButtonModifier = \`btn--\${ButtonVariant | ButtonSize}\`;

// Tailwind-style utility classes
type Spacing = '0' | '1' | '2' | '4' | '8' | '16';
type SpacingClass = \`p-\${Spacing}\` | \`m-\${Spacing}\` | \`px-\${Spacing}\` | \`py-\${Spacing}\`;

type Color = 'red' | 'blue' | 'green' | 'gray';
type Shade = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type ColorClass = \`text-\${Color}-\${Shade}\` | \`bg-\${Color}-\${Shade}\`;
\`\`\`

### i18n Key Patterns
\`\`\`typescript
// Translation key patterns
type Namespace = 'common' | 'auth' | 'dashboard' | 'settings';
type TranslationKey = \`\${Namespace}.\${string}\`;

// Typed translation keys
type CommonKeys = 'common.submit' | 'common.cancel' | 'common.loading' | 'common.error';
type AuthKeys = 'auth.login' | 'auth.logout' | 'auth.signup' | 'auth.forgotPassword';

// Interpolation patterns
type InterpolatedKey = \`\${string}{{count}}\${string}\` | \`\${string}{{name}}\${string}\`;

// Pluralization
type PluralKey = \`\${string}_one\` | \`\${string}_other\`;
\`\`\`

### API Contract Types
\`\`\`typescript
// REST endpoint patterns
type ApiVersion = 'v1' | 'v2';
type Resource = 'users' | 'products' | 'orders';
type ApiPath = \`/api/\${ApiVersion}/\${Resource}\`;
type ApiPathWithId = \`\${ApiPath}/\${string}\`;

// GraphQL operation names
type OperationType = 'Query' | 'Mutation' | 'Subscription';
type GraphQLOperation = \`\${Lowercase<OperationType>}\${Capitalize<Resource>}\`;
// 'queryUsers' | 'mutationUsers' | 'subscriptionUsers' | ...

// RPC method names
type RpcNamespace = 'user' | 'order' | 'payment';
type RpcAction = 'get' | 'list' | 'create' | 'update' | 'delete';
type RpcMethod = \`\${RpcNamespace}.\${RpcAction}\`;
// 'user.get' | 'user.list' | 'user.create' | 'order.get' | ...
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
    },
    {
      id: 4,
      title: 'Exercise 4: Event Handler Types',
      description: `Use template literal types to create typed event handler names.

**Your task:**
1. Create a type \`EventName\` = "click" | "focus" | "blur"
2. Create a type \`HandlerName<T>\` that transforms T to "on" + capitalized T
3. Apply HandlerName to EventName to create valid handler names
4. Create an object with handler methods and call one`,
      starterCode: `// Step 1: Create EventName type


// Step 2: Create HandlerName type using template literals
// Hint: \`on\${Capitalize<T>}\`


// Step 3: Create a type for all handler names


// Step 4: Create handlers object and call onClick
`,
      solution: `type EventName = "click" | "focus" | "blur";

type HandlerName<T extends string> = \`on\${Capitalize<T>}\`;

type AllHandlers = HandlerName<EventName>;

let handlers: { [K in AllHandlers]?: () => void } = {
  onClick: () => console.log("Clicked!"),
  onFocus: () => console.log("Focused!")
};

handlers.onClick?.();`,
      expectedOutput: ['Clicked!'],
      hints: [
        'Capitalize<T> capitalizes the first letter',
        'Template literal creates "onClick", "onFocus", "onBlur"',
        'Use mapped type to create handler object type'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does the template literal type `\\`hello-\\${string}\\`` match?',
      options: [
        'Only the exact string "hello-string"',
        'Any string starting with "hello-"',
        'Only "hello-" with no suffix',
        'Any string containing "hello"'
      ],
      correctIndex: 1,
      explanation: 'Template literal types with ${string} match any string in that position, so `hello-${string}` matches "hello-world", "hello-123", etc.'
    },
    {
      question: 'What does `Capitalize<"hello">` produce?',
      options: [
        '"HELLO"',
        '"Hello"',
        '"hello"',
        'An error'
      ],
      correctIndex: 1,
      explanation: 'Capitalize is an intrinsic string manipulation type that capitalizes only the first character, producing "Hello".'
    },
    {
      question: 'Which intrinsic type converts "Hello" to "hello"?',
      options: [
        'Lowercase<"Hello">',
        'Uncapitalize<"Hello">',
        'Both Lowercase and Uncapitalize',
        'Neither - they produce different results'
      ],
      correctIndex: 2,
      explanation: 'For "Hello", both produce "hello". But they differ on "HELLO": Lowercase gives "hello", Uncapitalize gives "hELLO".'
    },
    {
      question: 'What happens when template literal types are combined with unions?',
      options: [
        'Only the first union member is used',
        'All combinations are generated',
        'It throws a compile error',
        'The union is converted to a single string'
      ],
      correctIndex: 1,
      explanation: 'Template literal types distribute over unions, generating all possible combinations. `a-${("x"|"y")}` produces "a-x" | "a-y".'
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
