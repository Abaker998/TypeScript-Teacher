import { Lesson } from '@/types/lesson';

export const modernOperators: Lesson = {
  slug: 'modern-operators',
  title: 'Modern Operators',
  description: 'Master optional chaining, nullish coalescing, and other modern JavaScript operators.',
  difficulty: 'intermediate',
  order: 16,
  content: `
# Modern Operators

Modern JavaScript and TypeScript include powerful operators that make your code cleaner and safer when dealing with potentially missing values.

## Optional Chaining (?.)

Optional chaining lets you safely access nested properties without checking each level:

\`\`\`typescript
// Without optional chaining - verbose and error-prone
let city: string | undefined;
if (user && user.address && user.address.city) {
  city = user.address.city;
}

// With optional chaining - clean and safe
let city = user?.address?.city;
\`\`\`

If any part of the chain is \`null\` or \`undefined\`, it returns \`undefined\` instead of throwing an error.

### Optional Chaining with Methods

\`\`\`typescript
// Call method only if it exists
user?.getFullName?.();

// Access array elements safely
let firstItem = items?.[0];
\`\`\`

## Nullish Coalescing (??)

The nullish coalescing operator provides a default value only when the left side is \`null\` or \`undefined\`:

\`\`\`typescript
let name = username ?? "Guest";
// If username is null or undefined, use "Guest"
\`\`\`

### ?? vs || (Important Difference!)

\`\`\`typescript
let count = 0;

// || treats 0, "", false as "falsy"
console.log(count || 10);  // 10 (wrong if 0 is valid!)

// ?? only checks for null/undefined
console.log(count ?? 10);  // 0 (correct!)
\`\`\`

Use \`??\` when \`0\`, \`""\`, or \`false\` are valid values.

## Combining ?. and ??

These operators work great together:

\`\`\`typescript
// Get user's theme or use default
let theme = user?.settings?.theme ?? "light";

// Get array length or 0
let length = items?.length ?? 0;

// Get nested config with fallback
let timeout = config?.api?.timeout ?? 5000;
\`\`\`

## Optional Chaining with Type Narrowing

\`\`\`typescript
interface User {
  name: string;
  address?: {
    city: string;
    zip?: string;
  };
}

function getZip(user: User): string {
  // TypeScript knows this might be undefined
  return user.address?.zip ?? "N/A";
}
\`\`\`

## Non-Null Assertion (!)

When you're certain a value exists, use \`!\` to tell TypeScript:

\`\`\`typescript
// You know element exists (use carefully!)
let element = document.getElementById("app")!;

// Better: use optional chaining + fallback
let element = document.getElementById("app") ?? document.body;
\`\`\`

**Warning:** Overusing \`!\` can hide bugs. Prefer \`?.\` and \`??\` when possible.

## Logical Assignment Operators

Modern JavaScript also has logical assignment:

\`\`\`typescript
// Nullish assignment - assign only if null/undefined
user.name ??= "Anonymous";

// Logical OR assignment - assign if falsy
user.name ||= "Anonymous";

// Logical AND assignment - assign if truthy
user.isVerified &&= checkVerification();
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use optional chaining to safely access nested properties
- Apply nullish coalescing for default values
- Understand the difference between ?? and ||
- Combine these operators for clean, safe code
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Safe Property Access',
      description: `**Scenario:** You're building a user profile page. Some users haven't filled in their address yet, so the \`address\` property is missing. You need to display their city, or "Unknown" if they haven't provided it.

Without optional chaining, accessing \`user.address.city\` would crash when address is missing!

**Your task:**
1. Use optional chaining (\`?.\`) to safely access the nested city property
2. Use nullish coalescing (\`??\`) to provide "Unknown" as a fallback
3. Log the result`,
      starterCode: `let user = {
  name: "Alice",
  // address is missing - user hasn't filled in their profile!
};

// Step 1: Use ?. to safely chain through address to city
// Step 2: Use ?? to default to "Unknown" if city is undefined


// Step 3: Log the city
`,
      solution: `let user = {
  name: "Alice",
};

let city = user?.address?.city ?? "Unknown";

console.log(city);`,
      expectedOutput: ['Unknown'],
      hints: [
        'Syntax: user?.address?.city',
        'Add ?? "Unknown" at the end',
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Zero is Valid',
      description: `A player's score is 0, which is a valid value. Using \`||\` would incorrectly replace it with the default because 0 is falsy.

**Your task:**
1. Use nullish coalescing (\`??\`) to keep 0 as a valid score
2. The default should be 100, but since the score is 0, it should stay 0
3. Log the result`,
      starterCode: `let playerScore: number | undefined = 0;

// Step 1: Use ?? (not ||) to preserve 0 as valid


// Step 2: Log the score
`,
      solution: `let playerScore: number | undefined = 0;

let displayScore = playerScore ?? 100;

console.log("Score:", displayScore);`,
      expectedOutput: ['Score: 0'],
      hints: [
        '?? only replaces null/undefined, not 0',
        '|| would give 100 here (wrong!)',
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Method Call Safety',
      description: `**Scenario:** You're building a robot simulator with different robot models. Newer models have a \`greet()\` method, but older models like R2D2 don't have this capability. You need to safely attempt calling greet, with a fallback for robots that can't speak.

Calling \`robot.greet()\` directly on a model without this method would crash!

**Your task:**
1. Use optional chaining (\`?.()\`) to safely attempt calling the method
2. Use nullish coalescing (\`??\`) to provide "Beep boop!" as a fallback
3. Log the result`,
      starterCode: `let robot: { name: string; greet?: () => string } = {
  name: "R2D2"
  // R2D2 is an older model without the greet method!
};

// Step 1: Use ?.() to safely call greet (returns undefined if missing)
// Step 2: Use ?? to fallback to "Beep boop!"


// Step 3: Log the message
`,
      solution: `let robot: { name: string; greet?: () => string } = {
  name: "R2D2"
};

let message = robot.greet?.() ?? "Beep boop!";

console.log(message);`,
      expectedOutput: ['Beep boop!'],
      hints: [
        'Syntax: robot.greet?.()',
        'Add ?? "Beep boop!" for the fallback',
      ]
    }
  ],
  buildNote: {
    title: 'Modern Operators in Practice',
    explanation: `Optional chaining and nullish coalescing are used throughout modern TypeScript applications. In this app, they could be used when accessing lesson progress data that might not exist yet, or when getting user preferences with sensible defaults. These operators eliminate entire categories of "cannot read property of undefined" errors.`,
    relatedFiles: [
      'src/hooks/useProgress.ts',
      'src/lessons/index.ts'
    ],
    inTheRealWorld: `These operators are essential in production code. React apps use them extensively when rendering data that might still be loading. API response handling almost always uses ?. and ?? together. Redux selectors use optional chaining to safely access nested state. Any code dealing with user input, API responses, or optional configuration should use these operators.`
  }
};
