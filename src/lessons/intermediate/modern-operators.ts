import { Lesson } from '@/types/lesson';

export const modernOperators: Lesson = {
  slug: 'modern-operators',
  title: 'Modern Operators',
  description: 'Master optional chaining, nullish coalescing, and other modern JavaScript operators.',
  difficulty: 'intermediate',
  order: 17,
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

## The Big Picture: Modern Operators in Real Applications

Modern operators dramatically reduce code verbosity and eliminate entire categories of runtime errors. Here's how they're used in production:

### API Response Handling
\`\`\`typescript
// Safely extract nested data from API responses
interface ApiResponse {
  data?: {
    user?: {
      profile?: {
        avatar?: string;
        preferences?: {
          theme?: 'light' | 'dark';
          notifications?: boolean;
        };
      };
    };
  };
  error?: {
    message?: string;
    code?: number;
  };
}

function processApiResponse(response: ApiResponse) {
  // Chain through potentially missing nested properties
  const avatar = response.data?.user?.profile?.avatar ?? '/default-avatar.png';
  const theme = response.data?.user?.profile?.preferences?.theme ?? 'light';
  const notifications = response.data?.user?.profile?.preferences?.notifications ?? true;

  // Handle errors with fallback messages
  const errorMessage = response.error?.message ?? 'An unknown error occurred';
  const errorCode = response.error?.code ?? 500;

  return { avatar, theme, notifications, errorMessage, errorCode };
}
\`\`\`

### Configuration Management
\`\`\`typescript
// Application configuration with environment-specific overrides
interface AppConfig {
  api?: {
    baseUrl?: string;
    timeout?: number;
    retries?: number;
  };
  features?: {
    darkMode?: boolean;
    betaFeatures?: boolean;
    analytics?: boolean;
  };
  cache?: {
    ttl?: number;
    maxSize?: number;
  };
}

function getConfig(env: AppConfig, defaults: AppConfig): Required<AppConfig> {
  return {
    api: {
      baseUrl: env.api?.baseUrl ?? defaults.api?.baseUrl ?? 'https://api.example.com',
      timeout: env.api?.timeout ?? defaults.api?.timeout ?? 5000,
      retries: env.api?.retries ?? defaults.api?.retries ?? 3
    },
    features: {
      darkMode: env.features?.darkMode ?? defaults.features?.darkMode ?? false,
      betaFeatures: env.features?.betaFeatures ?? defaults.features?.betaFeatures ?? false,
      analytics: env.features?.analytics ?? defaults.features?.analytics ?? true
    },
    cache: {
      ttl: env.cache?.ttl ?? defaults.cache?.ttl ?? 3600,
      maxSize: env.cache?.maxSize ?? defaults.cache?.maxSize ?? 100
    }
  };
}
\`\`\`

### React Component Props
\`\`\`typescript
// Component with optional callback props
interface ButtonProps {
  label: string;
  onClick?: () => void;
  onHover?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  icon?: {
    name?: string;
    position?: 'left' | 'right';
  };
}

function Button({ label, onClick, onHover, onFocus, disabled, icon }: ButtonProps) {
  const handleClick = () => {
    // Only call onClick if it exists
    onClick?.();
  };

  const handleMouseEnter = () => {
    onHover?.();
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const iconPosition = icon?.position ?? 'left';
  const iconName = icon?.name ?? 'default';

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      disabled={disabled ?? false}
    >
      {iconPosition === 'left' && <Icon name={iconName} />}
      {label}
      {iconPosition === 'right' && <Icon name={iconName} />}
    </button>
  );
}
\`\`\`

### Form Validation
\`\`\`typescript
// Validate form data with optional fields
interface FormData {
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
  };
  preferences?: {
    contactMethod?: 'email' | 'phone' | 'mail';
  };
}

function validateForm(data: FormData): string[] {
  const errors: string[] = [];

  // Check required fields with fallback to empty string
  const email = data.email ?? '';
  if (!email.includes('@')) {
    errors.push('Valid email is required');
  }

  // Validate optional nested fields only if present
  const zipCode = data.address?.zipCode;
  if (zipCode && !/^\\d{5}$/.test(zipCode)) {
    errors.push('Zip code must be 5 digits');
  }

  // Use nullish coalescing for defaults
  const contactMethod = data.preferences?.contactMethod ?? 'email';

  // Validate based on contact preference
  if (contactMethod === 'phone' && !data.phone) {
    errors.push('Phone required when phone contact is selected');
  }

  return errors;
}
\`\`\`

### Data Fetching with Fallbacks
\`\`\`typescript
// React hook for data fetching with sensible defaults
interface FetchState<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  settings?: {
    itemsPerPage?: number;
    sortOrder?: 'asc' | 'desc';
  };
}

function useUserData(userId: string) {
  const [state, setState] = useState<FetchState<User>>({ isLoading: true });

  // Access with safe defaults
  const itemsPerPage = state.data?.settings?.itemsPerPage ?? 10;
  const sortOrder = state.data?.settings?.sortOrder ?? 'asc';
  const userName = state.data?.name ?? 'Guest';
  const userEmail = state.data?.email ?? '';

  // Error message with fallback
  const errorMessage = state.error?.message ?? 'Failed to load user data';

  return {
    user: state.data,
    isLoading: state.isLoading,
    error: state.error,
    // Derived values with safe defaults
    itemsPerPage,
    sortOrder,
    userName,
    userEmail,
    errorMessage
  };
}
\`\`\`

### Logical Assignment in State Updates
\`\`\`typescript
// Efficient state initialization and updates
interface UserSession {
  user?: {
    id: string;
    name: string;
  };
  token?: string;
  lastActivity?: number;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
  };
}

function initializeSession(session: UserSession): UserSession {
  // Only set defaults if values are null/undefined
  session.preferences.theme ??= 'light';
  session.preferences.language ??= 'en';
  session.lastActivity ??= Date.now();

  return session;
}

function updateSessionActivity(session: UserSession): void {
  // Update only if user exists
  session.user &&= {
    ...session.user,
    // Any user-specific updates
  };

  // Always update last activity
  session.lastActivity = Date.now();
}

// Conditional token refresh
function maybeRefreshToken(session: UserSession, newToken: string): void {
  // Only assign if current token is null/undefined
  session.token ??= newToken;
}
\`\`\`

### DOM Element Access
\`\`\`typescript
// Safe DOM manipulation
function initializeApp() {
  // Safe element access with fallback
  const appRoot = document.getElementById('app') ?? document.body;

  // Safe attribute access
  const dataTheme = appRoot.dataset?.theme ?? 'light';
  const dataVersion = appRoot.dataset?.version ?? '1.0.0';

  // Safe style access
  const backgroundColor = appRoot.style?.backgroundColor ?? '#ffffff';

  // Safe method calls on potentially null elements
  const header = document.querySelector('.header');
  header?.classList?.add('loaded');
  header?.setAttribute?.('data-ready', 'true');

  // Chained DOM traversal
  const navLink = document
    .querySelector('.nav')
    ?.querySelector('.nav-item')
    ?.querySelector('a');

  const href = navLink?.href ?? '/';

  return { appRoot, dataTheme, dataVersion, href };
}
\`\`\`

### Database Query Results
\`\`\`typescript
// Handle database query results safely
interface QueryResult<T> {
  rows?: T[];
  metadata?: {
    totalCount?: number;
    pageSize?: number;
    currentPage?: number;
  };
  error?: {
    code?: string;
    message?: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
}

function processQueryResult(result: QueryResult<Product>) {
  // Extract data with safe defaults
  const products = result.rows ?? [];
  const totalCount = result.metadata?.totalCount ?? products.length;
  const pageSize = result.metadata?.pageSize ?? 20;
  const currentPage = result.metadata?.currentPage ?? 1;

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Handle errors
  const errorCode = result.error?.code ?? 'UNKNOWN';
  const errorMessage = result.error?.message ?? 'Query failed';

  return {
    products,
    pagination: {
      totalCount,
      pageSize,
      currentPage,
      totalPages,
      hasNextPage,
      hasPrevPage
    },
    error: result.error ? { code: errorCode, message: errorMessage } : null
  };
}
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
    },
    {
      id: 4,
      title: 'Exercise 4: Deep Optional Chaining',
      description: `Use optional chaining to safely navigate deeply nested objects.

**Your task:**
1. Create a deeply nested object type representing API response data
2. Create a response object that is missing some nested properties
3. Use optional chaining to safely access a deep property
4. Use nullish coalescing to provide a default value`,
      starterCode: `// Step 1: Create response object with nested data (some missing)
let response: {
  data?: {
    user?: {
      profile?: {
        bio?: string
      }
    }
  }
} = {
  data: {
    user: {}  // profile is missing!
  }
};

// Step 2: Safely get bio with optional chaining, default to "No bio available"


// Step 3: Log the result
`,
      solution: `let response: {
  data?: {
    user?: {
      profile?: {
        bio?: string
      }
    }
  }
} = {
  data: {
    user: {}  // profile is missing!
  }
};

let bio = response.data?.user?.profile?.bio ?? "No bio available";

console.log(bio);`,
      expectedOutput: ['No bio available'],
      hints: [
        'Chain with ?. at each level: response.data?.user?.profile?.bio',
        'Use ?? for the default when the whole chain is undefined',
        'Each ?. stops if the value is null or undefined'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does optional chaining (`?.`) return when it encounters null or undefined?',
      options: [
        'Throws an error',
        'Returns null',
        'Returns undefined',
        'Returns an empty string'
      ],
      correctIndex: 2,
      explanation: 'Optional chaining short-circuits and returns undefined when it encounters null or undefined.'
    },
    {
      question: 'What is the difference between `||` and `??`?',
      options: [
        'They are identical in behavior',
        '|| treats 0 and "" as falsy; ?? only treats null/undefined as nullish',
        '?? is faster than ||',
        '|| works with objects; ?? only works with primitives'
      ],
      correctIndex: 1,
      explanation: 'The || operator uses falsy values (0, "", false, null, undefined), while ?? only considers null and undefined as nullish.'
    },
    {
      question: 'What does `obj?.method?.()` do?',
      options: [
        'Calls method twice',
        'Safely calls method if both obj and method exist',
        'Creates a new method on obj',
        'Throws if method does not exist'
      ],
      correctIndex: 1,
      explanation: 'Optional chaining can be used with method calls - ?.() safely calls the method only if it exists.'
    },
    {
      question: 'Given `let x = 0; let y = x ?? 10;`, what is y?',
      options: [
        '10',
        '0',
        'undefined',
        'null'
      ],
      correctIndex: 1,
      explanation: 'Since x is 0 (not null or undefined), ?? does not use the fallback. y is 0.'
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
