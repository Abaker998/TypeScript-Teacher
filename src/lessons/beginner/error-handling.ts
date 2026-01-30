import { Lesson } from '@/types/lesson';

export const errorHandling: Lesson = {
  slug: 'error-handling',
  title: 'Basic Error Handling',
  description: 'Learn to handle errors gracefully with try/catch and understand error types in TypeScript.',
  difficulty: 'beginner',
  order: 6,  // Sixth lesson in curriculum
  content: `
# Basic Error Handling

Errors happen. Good code handles them gracefully. TypeScript helps you write safer error handling code.

## Try/Catch Basics

Wrap risky code in a try block, handle errors in catch:

\`\`\`typescript
try {
  // Code that might throw an error
  let result = riskyOperation();
  console.log(result);
} catch (error) {
  // Handle the error
  console.log("Something went wrong!");
}
\`\`\`

## The Error Object

When an error is thrown, you can access its message:

\`\`\`typescript
try {
  throw new Error("Oops!");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);  // "Oops!"
  }
}
\`\`\`

**Note:** In TypeScript, \`error\` in catch blocks is typed as \`unknown\` by default. You need to check its type before using it.

## Throwing Errors

Use \`throw\` to signal something went wrong:

\`\`\`typescript
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero!");
  }
  return a / b;
}

try {
  let result = divide(10, 0);
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);  // "Cannot divide by zero!"
  }
}
\`\`\`

## The Finally Block

Code in \`finally\` runs whether or not an error occurred:

\`\`\`typescript
try {
  console.log("Trying...");
  throw new Error("Oops!");
} catch (error) {
  console.log("Caught error!");
} finally {
  console.log("This always runs");
}
// Output:
// Trying...
// Caught error!
// This always runs
\`\`\`

## Type-Safe Error Handling

TypeScript's \`unknown\` type for errors makes you check before using:

\`\`\`typescript
try {
  // some code
} catch (error) {
  // error is 'unknown' - must check type
  if (error instanceof Error) {
    console.log(error.message);  // Safe!
  } else {
    console.log("Unknown error occurred");
  }
}
\`\`\`

## Custom Error Messages

Create descriptive error messages:

\`\`\`typescript
function validateAge(age: number): void {
  if (age < 0) {
    throw new Error("Age cannot be negative");
  }
  if (age > 150) {
    throw new Error("Age seems unrealistic");
  }
  console.log("Age is valid");
}
\`\`\`

## When to Use Error Handling

Use try/catch when:
- Parsing user input that might be invalid
- Making network requests that might fail
- Reading files that might not exist
- Any operation that could fail at runtime

## Returning vs Throwing

Sometimes returning a value is better than throwing:

\`\`\`typescript
// Throwing approach
function findUserOrThrow(id: number): User {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// Returning approach (often preferred)
function findUser(id: number): User | undefined {
  return users.find(u => u.id === id);
}
\`\`\`

## The Big Picture: Error Handling in Real Applications

Error handling is critical in production code. Here's how it looks in real applications:

### API Request Handling
\`\`\`typescript
async function fetchUserProfile(userId: string): Promise<{
  success: boolean;
  data?: { id: string; name: string; email: string };
  error?: string;
}> {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "User not found" };
      }
      if (response.status === 401) {
        return { success: false, error: "Please log in to view this profile" };
      }
      return { success: false, error: "Failed to load profile" };
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    // Network errors, JSON parsing errors, etc.
    if (error instanceof TypeError) {
      return { success: false, error: "Network error - please check your connection" };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Usage
const result = await fetchUserProfile("123");
if (result.success) {
  displayProfile(result.data!);
} else {
  showErrorMessage(result.error!);
}
\`\`\`

### Form Submission with Validation
\`\`\`typescript
async function submitContactForm(formData: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  try {
    // Validate locally first
    if (!formData.name.trim()) {
      throw new Error("Name is required");
    }
    if (!formData.email.includes("@")) {
      throw new Error("Please enter a valid email");
    }
    if (formData.message.length < 10) {
      throw new Error("Message must be at least 10 characters");
    }

    // Submit to server
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send message");
    }

    showSuccessMessage("Message sent successfully!");

  } catch (error) {
    if (error instanceof Error) {
      showErrorMessage(error.message);
    } else {
      showErrorMessage("Something went wrong. Please try again.");
    }
  }
}
\`\`\`

### File Upload with Progress
\`\`\`typescript
async function uploadFile(file: File): Promise<string> {
  try {
    // Validate file before upload
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File too large. Maximum size is 10MB");
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Allowed: JPG, PNG, PDF");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error("File too large for server");
      }
      throw new Error("Upload failed");
    }

    const { url } = await response.json();
    return url;

  } catch (error) {
    if (error instanceof Error) {
      console.error("Upload error:", error.message);
      throw error;  // Re-throw for caller to handle
    }
    throw new Error("Unknown upload error");
  }
}
\`\`\`

### Database Operations
\`\`\`typescript
async function createUser(userData: {
  email: string;
  password: string;
  name: string;
}): Promise<{ id: string } | { error: string }> {
  try {
    // Check if user exists
    const existing = await db.users.findOne({ email: userData.email });
    if (existing) {
      return { error: "An account with this email already exists" };
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await db.users.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      createdAt: new Date()
    });

    return { id: user.id };

  } catch (error) {
    console.error("Database error:", error);

    // Don't expose internal errors to users
    return { error: "Unable to create account. Please try again later." };
  }
}
\`\`\`

### Payment Processing
\`\`\`typescript
async function processPayment(paymentDetails: {
  amount: number;
  cardToken: string;
  orderId: string;
}): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    // Validate amount
    if (paymentDetails.amount <= 0) {
      return { success: false, error: "Invalid payment amount" };
    }

    // Call payment gateway
    const result = await paymentGateway.charge({
      amount: paymentDetails.amount,
      source: paymentDetails.cardToken,
      metadata: { orderId: paymentDetails.orderId }
    });

    // Update order status
    await db.orders.update(paymentDetails.orderId, {
      status: "paid",
      transactionId: result.id
    });

    return { success: true, transactionId: result.id };

  } catch (error) {
    // Log for debugging but don't expose to user
    console.error("Payment error:", error);

    if (error instanceof PaymentDeclinedError) {
      return { success: false, error: "Card was declined. Please try another card." };
    }

    if (error instanceof InsufficientFundsError) {
      return { success: false, error: "Insufficient funds. Please try another card." };
    }

    return { success: false, error: "Payment failed. Please try again." };
  }
}
\`\`\`

### Authentication Flow
\`\`\`typescript
async function loginUser(email: string, password: string): Promise<{
  success: boolean;
  user?: { id: string; name: string };
  token?: string;
  error?: string;
}> {
  try {
    // Find user
    const user = await db.users.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal whether email exists
      return { success: false, error: "Invalid email or password" };
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return { success: false, error: "Account temporarily locked. Try again later." };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      // Track failed attempts
      await db.users.update(user.id, {
        failedAttempts: user.failedAttempts + 1,
        lockedUntil: user.failedAttempts >= 4 ? addMinutes(new Date(), 15) : null
      });
      return { success: false, error: "Invalid email or password" };
    }

    // Reset failed attempts on success
    await db.users.update(user.id, { failedAttempts: 0, lockedUntil: null });

    // Generate token
    const token = generateJWT({ userId: user.id });

    return {
      success: true,
      user: { id: user.id, name: user.name },
      token
    };

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}
\`\`\`

### Graceful Degradation
\`\`\`typescript
async function loadDashboard(): Promise<DashboardData> {
  const dashboard: DashboardData = {
    stats: null,
    recentActivity: [],
    notifications: []
  };

  // Load each section independently - one failure shouldn't break everything
  try {
    dashboard.stats = await fetchStats();
  } catch (error) {
    console.error("Failed to load stats:", error);
    // Continue without stats
  }

  try {
    dashboard.recentActivity = await fetchRecentActivity();
  } catch (error) {
    console.error("Failed to load activity:", error);
    // Continue without activity
  }

  try {
    dashboard.notifications = await fetchNotifications();
  } catch (error) {
    console.error("Failed to load notifications:", error);
    // Continue without notifications
  }

  return dashboard;
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use try/catch/finally to handle errors
- Throw custom errors with descriptive messages
- Safely access error properties with type checking
- Decide when to throw vs return error values
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Try/Catch',
      description: `Learn to catch errors with try/catch.

**Your task:**
1. In the try block, throw an error with message "Something failed!"
2. In the catch block, print the error message

**Important:** In TypeScript, you must check if the error is an Error object before accessing .message

**Try/catch syntax:**
\`\`\`
try {
  throw new Error("message");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
\`\`\``,
      starterCode: `// Write a try/catch block:
// - In try: throw new Error("Something failed!")
// - In catch: print the error message (check instanceof Error first)

`,
      solution: `try {
  throw new Error("Something failed!");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}`,
      expectedOutput: ['Something failed!'],
      hints: [
        'try and catch go together: try { } catch (error) { }',
        'throw new Error("Something failed!"); creates and throws an error',
        'error instanceof Error checks if it\'s an Error object',
        'error.message gives you the error text'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Safe Division Function',
      description: `Create a function that throws an error for invalid input.

**Your task:**
1. Create function \`safeDivide(a, b)\` that returns a/b
2. If b is 0, throw an Error with message "Division by zero"
3. Call safeDivide(10, 2) and print the result (should print 5)
4. Call safeDivide(10, 0) inside try/catch and print the error message`,
      starterCode: `// Create safeDivide(a, b) - throw "Division by zero" if b is 0


// Print safeDivide(10, 2)


// Call safeDivide(10, 0) in a try/catch and print the error message

`,
      solution: `function safeDivide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

console.log(safeDivide(10, 2));

try {
  safeDivide(10, 0);
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}`,
      expectedOutput: ['5', 'Division by zero'],
      hints: [
        'Function: function safeDivide(a: number, b: number): number',
        'Check b === 0 first, throw if true',
        '10/2 = 5, prints normally',
        '10/0 throws, so catch it and print error.message'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Try/Catch/Finally',
      description: `The finally block ALWAYS runs, whether there's an error or not.

**Your task:**
1. In try: print "Start", then throw an error
2. In catch: print "Error caught"
3. In finally: print "Cleanup done"

**Expected output:** Start, Error caught, Cleanup done (in that order)`,
      starterCode: `// Write try/catch/finally:
// try: print "Start", then throw an error
// catch: print "Error caught"
// finally: print "Cleanup done"

`,
      solution: `try {
  console.log("Start");
  throw new Error("Oops");
} catch (error) {
  console.log("Error caught");
} finally {
  console.log("Cleanup done");
}`,
      expectedOutput: ['Start', 'Error caught', 'Cleanup done'],
      hints: [
        'try block: console.log("Start"); then throw new Error("Oops");',
        'catch block: console.log("Error caught");',
        'finally block: console.log("Cleanup done");',
        'finally ALWAYS runs, even after an error is caught'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Validate Age Function',
      description: `Create a function that validates age and throws appropriate errors.

**Your task:**
1. Create function \`validateAge(age: number)\` that:
   - Throws "Age cannot be negative" if age < 0
   - Throws "Age must be a reasonable value" if age > 150
   - Prints "Valid age: [age]" if the age is valid
2. Test with validateAge(25) - should print the valid message
3. Test with validateAge(-5) in try/catch - should print the error message`,
      starterCode: `// Create validateAge function that validates the age
// Throw errors for invalid ages, print success for valid ages


// Test with a valid age (25)


// Test with invalid age (-5) in try/catch

`,
      solution: `function validateAge(age: number): void {
  if (age < 0) {
    throw new Error("Age cannot be negative");
  }
  if (age > 150) {
    throw new Error("Age must be a reasonable value");
  }
  console.log("Valid age: " + age);
}

validateAge(25);

try {
  validateAge(-5);
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}`,
      expectedOutput: ['Valid age: 25', 'Age cannot be negative'],
      hints: [
        'Check age < 0 first and throw the appropriate error',
        'Check age > 150 second and throw its error',
        'If neither condition is true, print the success message',
        'Wrap the invalid age call in try/catch to handle the error'
      ]
    }
  ],
  quiz: [
    {
      question: 'What type does TypeScript assign to the error parameter in a catch block by default?',
      options: ['Error', 'any', 'unknown', 'string'],
      correctIndex: 2,
      explanation: 'TypeScript uses "unknown" for catch parameters because anything can be thrown, not just Error objects. You must check the type before using it.'
    },
    {
      question: 'What happens if code in the "finally" block throws an error?',
      options: [
        'The original error is still thrown',
        'Both errors are thrown',
        'The finally error replaces the original error',
        'The finally error is silently ignored'
      ],
      correctIndex: 2,
      explanation: 'If finally throws, its error replaces any previous error. This is why you should avoid throwing in finally blocks.'
    },
    {
      question: 'Why should you check "error instanceof Error" before accessing error.message?',
      options: [
        'To improve performance',
        'Because error could be any type, not just Error',
        'To convert the error to a string',
        'It\'s just a coding style preference'
      ],
      correctIndex: 1,
      explanation: 'In JavaScript/TypeScript, you can throw anything (strings, numbers, objects). The instanceof check ensures you have an actual Error object before accessing its properties.'
    },
    {
      question: 'When should you use "throw" vs returning an error value?',
      options: [
        'Always use throw - it\'s the standard way',
        'Always return errors - throwing is bad practice',
        'Throw for unexpected errors; return for expected/recoverable ones',
        'It doesn\'t matter - they\'re the same'
      ],
      correctIndex: 2,
      explanation: 'Throw for truly exceptional cases (bugs, system failures). Return error values for expected failures (user not found, validation failed) that callers should handle.'
    }
  ],
  buildNote: {
    title: 'Error Handling in the App',
    explanation: `In \`src/lib/typescript-runner.ts\`, the code execution is wrapped in try/catch because compiling and running user code can fail in many ways — syntax errors, runtime errors, infinite loops. The catch block formats errors into a user-friendly format with line numbers. In \`src/app/lessons/[slug]/page.tsx\`, the \`handleRun\` function catches errors from the TypeScript runner and displays them in the output panel. We use the pattern of checking \`error instanceof Error\` to safely access the message property. This defensive approach ensures the app never crashes from user code errors.`,
    relatedFiles: [
      'src/lib/typescript-runner.ts',
      'src/app/lessons/[slug]/page.tsx',
      'src/components/OutputPanel.tsx'
    ],
    inTheRealWorld: `Production applications use structured error handling extensively. Backend APIs return error objects with status codes and messages. Frontend apps catch network errors and show user-friendly messages. Libraries like \`neverthrow\` provide Result types (Ok/Err) as an alternative to throwing. The trend in TypeScript is moving toward explicit error handling with union types (\`Result | Error\`) rather than try/catch, but both patterns are valid and widely used.`
  }
};
