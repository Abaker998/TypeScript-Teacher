import { Lesson } from '@/types/lesson';

export const unionAndLiteralTypes: Lesson = {
  slug: 'union-and-literal-types',
  title: 'Union & Literal Types',
  description: 'Combine types with unions and use literal values as types to express exact constraints.',
  difficulty: 'intermediate',
  order: 11,
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
