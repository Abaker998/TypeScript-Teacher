import { Lesson } from '@/types/lesson';

export const unionAndLiteralTypes: Lesson = {
  slug: 'union-and-literal-types',
  title: 'Union & Literal Types',
  description: 'Combine types with unions and use literal values as types to express exact constraints.',
  difficulty: 'intermediate',
  order: 12,
  content: `
# Union & Literal Types

Union types and literal types give you precise control over what values are allowed in a variable or function parameter.

## Union Types

A union type says a value can be one of several types, separated by a pipe (|):

\`\`\`typescript
let id: string | number;

id = "123";   // OK — string
id = 123;     // OK — number
id = true;    // Error — boolean is not allowed
\`\`\`

Unions are useful for functions that accept multiple input types:

\`\`\`typescript
function formatId(id: string | number): string {
  if (typeof id === "string") {
    return "ID: " + id;
  } else {
    return "ID: " + id.toString();
  }
}
\`\`\`

## Literal Types

A literal type specifies exact values:

\`\`\`typescript
let status: "pending" | "complete" | "error";

status = "pending";   // OK
status = "complete";  // OK
status = "error";     // OK
status = "waiting";   // Error — not one of the allowed literals
\`\`\`

Literal types are perfect for enums — a fixed set of options. They're clearer than magic strings scattered throughout code.

## Type Narrowing

When you have a union, TypeScript requires you to check which type you have before using type-specific operations. This is called "type narrowing":

\`\`\`typescript
function printLength(value: string | number[]): void {
  if (typeof value === "string") {
    console.log(value.length);  // string.length
  } else {
    console.log(value.length);  // array.length
  }
}
\`\`\`

Without the type check, TypeScript won't know if \`.length\` exists — only strings and arrays have it, not numbers.

## Combining with Interfaces

You can use unions in interfaces for flexible object structures:

\`\`\`typescript
interface SuccessResult {
  success: true;
  data: string;
}

interface ErrorResult {
  success: false;
  error: string;
}

type Result = SuccessResult | ErrorResult;

function handleResult(result: Result) {
  if (result.success) {
    console.log(result.data);   // OK — we know data exists
  } else {
    console.log(result.error);  // OK — we know error exists
  }
}
\`\`\`

## The Big Picture: Union & Literal Types in Real Applications

Union and literal types are essential for modeling real-world data that can be in multiple states. Here's how they're used in production:

### State Machines and Status Modeling
\`\`\`typescript
// Order lifecycle with literal types
type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Only valid status transitions
type StatusTransition = {
  from: OrderStatus;
  to: OrderStatus;
  allowed: boolean;
};

const allowedTransitions: StatusTransition[] = [
  { from: 'pending', to: 'confirmed', allowed: true },
  { from: 'pending', to: 'cancelled', allowed: true },
  { from: 'confirmed', to: 'processing', allowed: true },
  { from: 'processing', to: 'shipped', allowed: true },
  { from: 'shipped', to: 'delivered', allowed: true },
  { from: 'delivered', to: 'refunded', allowed: true },
];

function canTransition(current: OrderStatus, next: OrderStatus): boolean {
  return allowedTransitions.some(
    t => t.from === current && t.to === next && t.allowed
  );
}
\`\`\`

### Discriminated Unions for API Responses
\`\`\`typescript
// Type-safe API responses
type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T; timestamp: Date }
  | { status: 'error'; error: ApiError; retryable: boolean };

type ApiError = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};

// React component using discriminated union
function UserProfile({ response }: { response: ApiResponse<User> }) {
  switch (response.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <ProfileCard user={response.data} />;  // TypeScript knows data exists
    case 'error':
      return (
        <ErrorMessage
          message={response.error.message}
          showRetry={response.retryable}
        />
      );
  }
}
\`\`\`

### Form Validation Results
\`\`\`typescript
// Validation with discriminated unions
type ValidationResult =
  | { valid: true }
  | { valid: false; errors: ValidationError[] };

type ValidationError = {
  field: string;
  rule: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message: string;
};

function validateForm(data: FormData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.email) {
    errors.push({ field: 'email', rule: 'required', message: 'Email is required' });
  }

  if (data.password.length < 8) {
    errors.push({ field: 'password', rule: 'minLength', message: 'Password must be at least 8 characters' });
  }

  return errors.length > 0
    ? { valid: false, errors }
    : { valid: true };
}

// Usage
const result = validateForm(formData);
if (result.valid) {
  submitForm(formData);
} else {
  showErrors(result.errors);  // TypeScript knows errors exists here
}
\`\`\`

### Payment Processing States
\`\`\`typescript
// Payment state machine
type PaymentState =
  | { state: 'idle' }
  | { state: 'processing'; transactionId: string }
  | { state: 'requires_action'; actionUrl: string; actionType: 'redirect' | '3ds' }
  | { state: 'succeeded'; receipt: Receipt }
  | { state: 'failed'; error: PaymentError; canRetry: boolean };

type Receipt = {
  id: string;
  amount: number;
  currency: string;
  timestamp: Date;
};

type PaymentError = {
  code: 'insufficient_funds' | 'card_declined' | 'expired_card' | 'network_error';
  message: string;
};

function PaymentStatus({ payment }: { payment: PaymentState }) {
  switch (payment.state) {
    case 'idle':
      return <button>Pay Now</button>;
    case 'processing':
      return <p>Processing transaction {payment.transactionId}...</p>;
    case 'requires_action':
      return payment.actionType === 'redirect'
        ? <a href={payment.actionUrl}>Complete Payment</a>
        : <ThreeDSFrame url={payment.actionUrl} />;
    case 'succeeded':
      return <ReceiptDisplay receipt={payment.receipt} />;
    case 'failed':
      return (
        <>
          <p>Payment failed: {payment.error.message}</p>
          {payment.canRetry && <button>Retry</button>}
        </>
      );
  }
}
\`\`\`

### User Permission Systems
\`\`\`typescript
// Role-based permissions
type UserRole = 'guest' | 'user' | 'moderator' | 'admin' | 'superadmin';
type Permission = 'read' | 'write' | 'delete' | 'manage_users' | 'manage_settings';

// Permission mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  guest: ['read'],
  user: ['read', 'write'],
  moderator: ['read', 'write', 'delete'],
  admin: ['read', 'write', 'delete', 'manage_users'],
  superadmin: ['read', 'write', 'delete', 'manage_users', 'manage_settings']
};

function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

// Type-safe permission checks
function ProtectedAction({ userRole, requiredPermission, children }: {
  userRole: UserRole;
  requiredPermission: Permission;
  children: React.ReactNode;
}) {
  if (!hasPermission(userRole, requiredPermission)) {
    return null;
  }
  return <>{children}</>;
}
\`\`\`

### Event Handling with Unions
\`\`\`typescript
// Type-safe event system
type AppEvent =
  | { type: 'USER_LOGIN'; payload: { userId: string; timestamp: Date } }
  | { type: 'USER_LOGOUT'; payload: { userId: string } }
  | { type: 'PAGE_VIEW'; payload: { path: string; referrer?: string } }
  | { type: 'BUTTON_CLICK'; payload: { buttonId: string; context: string } }
  | { type: 'ERROR'; payload: { error: Error; componentStack?: string } };

function trackEvent(event: AppEvent): void {
  switch (event.type) {
    case 'USER_LOGIN':
      analytics.identify(event.payload.userId);
      analytics.track('Login', { timestamp: event.payload.timestamp });
      break;
    case 'USER_LOGOUT':
      analytics.track('Logout');
      analytics.reset();
      break;
    case 'PAGE_VIEW':
      analytics.page(event.payload.path, { referrer: event.payload.referrer });
      break;
    case 'BUTTON_CLICK':
      analytics.track('Click', {
        button: event.payload.buttonId,
        context: event.payload.context
      });
      break;
    case 'ERROR':
      errorReporting.captureException(event.payload.error, {
        componentStack: event.payload.componentStack
      });
      break;
  }
}
\`\`\`

### Database Query Results
\`\`\`typescript
// Query result patterns
type QueryResult<T> =
  | { type: 'single'; data: T }
  | { type: 'multiple'; data: T[]; count: number }
  | { type: 'empty' }
  | { type: 'error'; error: DatabaseError };

type DatabaseError = {
  code: 'not_found' | 'connection_failed' | 'timeout' | 'constraint_violation';
  message: string;
  query?: string;
};

async function handleQuery<T>(result: QueryResult<T>): Promise<void> {
  switch (result.type) {
    case 'single':
      console.log('Found one:', result.data);
      break;
    case 'multiple':
      console.log(\`Found \${result.count} results:\`, result.data);
      break;
    case 'empty':
      console.log('No results found');
      break;
    case 'error':
      console.error(\`Database error (\${result.error.code}): \${result.error.message}\`);
      break;
  }
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use union types to express multiple possibilities
- Write literal types for fixed value sets
- Narrow union types with conditionals
- Design interfaces using union discriminators
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Union Types',
      description: `Create a type alias using literal string unions and use it to type-check function parameters.

**Your task:**
1. Create a type alias \`Status\` that can only be "active", "inactive", or "pending"
2. Write a \`reportStatus\` function that takes a \`Status\` parameter and logs "Status: " followed by the value
3. Call the function three times with each valid status`,
      starterCode: `// Step 1: Create the Status type alias


// Step 2: Write the reportStatus function


// Step 3: Call the function with each status
`,
      solution: `type Status = "active" | "inactive" | "pending";

function reportStatus(status: Status): void {
  console.log("Status: " + status);
}

reportStatus("active");
reportStatus("inactive");
reportStatus("pending");`,
      expectedOutput: [
        'Status: active',
        'Status: inactive',
        'Status: pending'
      ],
      hints: [
        'Use pipe (|) to separate literal values: type Status = "active" | "inactive" | "pending"',
        'The function parameter uses your type: (status: Status)',
        'Uncomment and complete each step in order'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Type Narrowing with Conditionals',
      description: `Use \`typeof\` to narrow a union type and handle each case differently.

**Your task:**
1. Write a function \`processValue\` that accepts \`string | number\`
2. If it's a string, log it in uppercase
3. If it's a number, log it doubled
4. Test with "hello" and 21`,
      starterCode: `// Step 1: Define the function with union parameter


// Step 2: Check if value is a string and log uppercase


// Step 3: Otherwise it's a number - log it doubled


// Step 4: Test with both types
`,
      solution: `function processValue(value: string | number): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value * 2);
  }
}

processValue("hello");
processValue(21);`,
      expectedOutput: ['HELLO', '42'],
      hints: [
        'typeof value === "string" narrows the type inside the if block',
        'In the else block, TypeScript knows value must be number',
        'Strings have .toUpperCase(), numbers support arithmetic'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Discriminated Unions',
      description: `Create a discriminated union where a shared property (the "discriminant") determines which interface applies.

**Your task:**
1. Define \`SuccessResponse\` interface with \`status: "success"\` and \`data: string\`
2. Define \`ErrorResponse\` interface with \`status: "error"\` and \`message: string\`
3. Create union type \`ApiResponse = SuccessResponse | ErrorResponse\`
4. Write \`handleResponse\` that logs "Data: " + data for success, "Error: " + message for error
5. Test with both response types`,
      starterCode: `// Step 1: Define SuccessResponse interface


// Step 2: Define ErrorResponse interface


// Step 3: Create the union type


// Step 4: Write the handler function


// Step 5: Test with both response types
`,
      solution: `interface SuccessResponse {
  status: "success";
  data: string;
}

interface ErrorResponse {
  status: "error";
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse): void {
  if (response.status === "success") {
    console.log("Data: " + response.data);
  } else {
    console.log("Error: " + response.message);
  }
}

handleResponse({ status: "success", data: "User loaded" });
handleResponse({ status: "error", message: "Not found" });`,
      expectedOutput: ['Data: User loaded', 'Error: Not found'],
      hints: [
        'status: "success" is a literal type, not string - include the quotes',
        'The status property is the "discriminant" that tells types apart',
        'Checking response.status narrows to the matching interface'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Numeric Literal Types',
      description: `Literal types work with numbers too - great for fixed values like status codes or dice values.

**Your task:**
1. Create a type \`DiceRoll\` that only allows the numbers 1, 2, 3, 4, 5, or 6
2. Create a function \`rollDice\` that returns a random DiceRoll (hint: use Math.random())
3. Call rollDice() and print the result
4. Also print a second roll to show randomness

**Hint:** Math.floor(Math.random() * 6) + 1 gives 1-6`,
      starterCode: `// Step 1: Create DiceRoll type for numbers 1-6


// Step 2: Create rollDice function


// Step 3-4: Roll twice and print results

`,
      solution: `type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

console.log(rollDice());
console.log(rollDice());`,
      expectedOutput: ['*', '*'],
      hints: [
        'Numeric literals: type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6',
        'Math.floor(Math.random() * 6) + 1 gives random 1-6',
        'Use "as DiceRoll" to tell TypeScript the result is valid',
        'Output varies since it\'s random!'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the result of: type ID = string | number?',
      options: [
        'A string that is also a number',
        'A type that can be either string OR number',
        'An error - you can\'t combine types',
        'A new primitive type'
      ],
      correctIndex: 1,
      explanation: 'Union types (using |) create a type that can be any ONE of the listed types. ID can hold a string OR a number, but not both at once.'
    },
    {
      question: 'What is a "discriminated union"?',
      options: [
        'A union that excludes certain types',
        'A union where each type has a common property with different literal values',
        'A union of only string types',
        'A union that TypeScript cannot narrow'
      ],
      correctIndex: 1,
      explanation: 'Discriminated unions have a common "discriminant" property (like status: "success" | status: "error") that TypeScript uses to narrow the type.'
    },
    {
      question: 'What does "type narrowing" mean?',
      options: [
        'Making types smaller',
        'TypeScript determining a more specific type within a conditional block',
        'Removing properties from a type',
        'Converting a type to a literal'
      ],
      correctIndex: 1,
      explanation: 'Type narrowing is when TypeScript uses runtime checks (like typeof or property checks) to determine a more specific type within a code block.'
    },
    {
      question: 'What is the type: "north" | "south" | "east" | "west"?',
      options: [
        'A string type',
        'A union of string literal types',
        'An enum',
        'An array of strings'
      ],
      correctIndex: 1,
      explanation: 'This is a union of string literal types. A variable of this type can only be one of those exact four string values.'
    }
  ],
  buildNote: {
    title: 'Union & Literal Types in the App',
    explanation: `The app defines the \`Difficulty\` type as a union of literal strings in \`src/types/lesson.ts\`: \`type Difficulty = 'beginner' | 'intermediate' | 'advanced'\`. This ensures lessons are always one of three valid difficulty levels — TypeScript prevents typos like "advance" or "novice" from even being assigned. The \`RunResult\` interface demonstrates discriminated unions: it has a \`success: boolean\` field that acts as a "discriminant" — a tag indicating which branch of the union we're in. When \`success\` is true, you should read the \`output: string[]\` array. When \`success\` is false, you should read the \`errors: CompileError[]\` array. Throughout the app, type narrowing is used in the output panel — checking \`if (result.success)\` tells TypeScript that inside the if-block, result is the success case, and outside is the error case. This prevents reading \`result.output\` when we're in the error state. This pattern is powerful because it prevents impossible states — you can never have both \`success: true\` and errors simultaneously. Discriminated unions are everywhere in modern TypeScript: request states, database operations, authentication statuses.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/app/lessons/[slug]/page.tsx',
      'src/components/OutputPanel.tsx'
    ],
    inTheRealWorld: `Union types and discriminated unions are fundamental patterns in production TypeScript. Redux actions use discriminated unions with a \`type\` field to route to different handlers. GraphQL clients use unions to represent different response states. React libraries like React Query return discriminated unions: \`{ status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error }\`. HTTP libraries model responses as unions: \`{ ok: true; body: T } | { ok: false; status: number }\`. This pattern eliminates impossible states — you can never have success: true with an error field simultaneously.`
  }
};
