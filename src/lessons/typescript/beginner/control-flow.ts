import { Lesson } from '@/types/lesson';

export const controlFlow: Lesson = {
  slug: 'control-flow',
  title: 'Control Flow',
  description: 'Master if/else statements, loops, and how TypeScript narrows types in conditional blocks.',
  difficulty: 'beginner',
  order: 5,  // Fifth lesson in curriculum
  content: `
# Control Flow

Control flow determines which code runs and when. TypeScript adds type safety to conditionals and loops, catching errors before runtime.

## If/Else Statements

**What this does:** Runs different code depending on whether a condition is true or false.

**When you'd use this:** Checking user permissions, validating input, showing different content based on state, handling login/logout.

\`\`\`typescript
// BASIC IF/ELSE STRUCTURE
// If the condition in parentheses is TRUE, run the first block
// Otherwise, run the else block
let age: number = 18;

if (age >= 18) {
  // This code runs because 18 >= 18 is TRUE
  console.log("Adult");
} else {
  // This code is SKIPPED
  console.log("Minor");
}
// Output: "Adult"
\`\`\`

**Real-world example:** Checking if a user can access content:
\`\`\`typescript
let isLoggedIn: boolean = true;
let hasSubscription: boolean = false;

if (isLoggedIn && hasSubscription) {
  console.log("Welcome! Enjoy premium content.");
} else if (isLoggedIn) {
  console.log("Please upgrade to access premium content.");
} else {
  console.log("Please log in to continue.");
}
// Output: "Please upgrade to access premium content."
\`\`\`

## Comparison Operators

**What this does:** Compares two values and returns true or false.

**When you'd use this:** Checking if prices are within budget, validating ages, comparing scores, checking if values match.

\`\`\`typescript
let a = 5;
let b = 10;

// EQUALITY CHECKS
a === b    // "Is a equal to b?" → false (5 is not 10)
a !== b    // "Is a NOT equal to b?" → true (5 is not 10)

// SIZE COMPARISONS
a > b      // "Is a greater than b?" → false (5 is not > 10)
a < b      // "Is a less than b?" → true (5 < 10)
a >= b     // "Is a greater than OR equal to b?" → false
a <= b     // "Is a less than OR equal to b?" → true
\`\`\`

**Real-world example:** Checking if a purchase is within budget:
\`\`\`typescript
let itemPrice: number = 49.99;
let budget: number = 50.00;

if (itemPrice <= budget) {
  console.log("You can afford this item!");
} else {
  let difference: number = itemPrice - budget;
  console.log("You need $" + difference + " more.");
}
// Output: "You can afford this item!"
\`\`\`

**Important:** Always use \`===\` (strict equality) instead of \`==\` in TypeScript. The \`===\` operator checks both value AND type.

## Logical Operators

Combine conditions with \`&&\` (and), \`||\` (or), and \`!\` (not):

\`\`\`typescript
let isLoggedIn = true;
let isAdmin = false;

if (isLoggedIn && isAdmin) {
  console.log("Welcome, admin!");
} else if (isLoggedIn) {
  console.log("Welcome, user!");
} else {
  console.log("Please log in");
}
\`\`\`

## For Loops

**What this does:** Repeats code a specific number of times.

**When you'd use this:** Processing items in a list, repeating an action N times, counting up or down.

\`\`\`typescript
// FOR LOOP STRUCTURE:
// for (start; condition; increment) { code }

// This loop runs 5 times (i goes from 0 to 4)
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// Output: 0, 1, 2, 3, 4

// BREAKDOWN:
// let i = 0     → Start at 0
// i < 5         → Keep going while i is less than 5
// i++           → Add 1 to i after each loop
\`\`\`

**Real-world example:** Displaying a countdown:
\`\`\`typescript
console.log("Countdown starting...");
for (let seconds = 5; seconds > 0; seconds--) {
  console.log(seconds + "...");
}
console.log("Blast off!");
// Output: "Countdown starting...", "5...", "4...", "3...", "2...", "1...", "Blast off!"
\`\`\`

## For...of Loops

**What this does:** Goes through each item in an array, one at a time.

**When you'd use this:** Processing a list of users, displaying menu items, calculating totals from a list.

\`\`\`typescript
// FOR...OF gives you each item directly (no index needed)
let colors: string[] = ["red", "green", "blue"];

for (let color of colors) {
  console.log(color);  // TypeScript knows color is a string!
}
// Output: "red", "green", "blue"
\`\`\`

**Real-world example:** Calculating total price of items in cart:
\`\`\`typescript
let prices: number[] = [29.99, 9.99, 49.99];
let total: number = 0;

for (let price of prices) {
  total = total + price;
}
console.log("Cart total: $" + total);
// Output: "Cart total: $89.97"
\`\`\`

## While Loops

**What this does:** Keeps repeating code as long as a condition is true.

**When you'd use this:** Waiting for user input, retrying until success, processing until a condition is met.

\`\`\`typescript
// WHILE LOOP: Check condition FIRST, then run code
let count = 0;

while (count < 3) {
  console.log("Count is: " + count);
  count++;  // IMPORTANT: Must change the condition or loop runs forever!
}
// Output: "Count is: 0", "Count is: 1", "Count is: 2"
\`\`\`

**Real-world example:** Simple password retry system:
\`\`\`typescript
let attempts: number = 0;
let maxAttempts: number = 3;

while (attempts < maxAttempts) {
  console.log("Attempt " + (attempts + 1) + " of " + maxAttempts);
  attempts++;
}
console.log("No more attempts allowed.");
\`\`\`

## Type Narrowing with Control Flow

Here's where TypeScript shines. Inside conditional blocks, TypeScript **narrows** types:

\`\`\`typescript
let value: string | number = "hello";

if (typeof value === "string") {
  // Inside this block, TypeScript knows value is string
  console.log(value.toUpperCase());  // OK!
} else {
  // Here, TypeScript knows value is number
  console.log(value.toFixed(2));  // OK!
}
\`\`\`

## Truthiness Narrowing

TypeScript understands truthy/falsy checks:

\`\`\`typescript
let name: string | null = "Alice";

if (name) {
  // TypeScript knows name is string (not null)
  console.log(name.toUpperCase());
}
\`\`\`

## The Ternary Operator

A shorthand for simple if/else:

\`\`\`typescript
let age = 20;
let status = age >= 18 ? "adult" : "minor";
console.log(status);  // "adult"
\`\`\`

## Switch Statements

Handle multiple cases cleanly:

\`\`\`typescript
let day: number = 1;

switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  default:
    console.log("Other day");
}
\`\`\`

## Break and Continue

Control loop execution flow:

\`\`\`typescript
// break: exit loop entirely
for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    break;  // Stop at 5
  }
  console.log(i);  // Prints 1, 2, 3, 4
}

// continue: skip to next iteration
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;  // Skip 3
  }
  console.log(i);  // Prints 1, 2, 4, 5
}
\`\`\`

## Early Return Pattern

Exit a function early when a condition is met:

\`\`\`typescript
function processUser(user: { name: string; age: number } | null): string {
  // Guard clause - return early if invalid
  if (!user) {
    return "No user provided";
  }

  // TypeScript knows user is not null here!
  if (user.age < 18) {
    return "User is a minor";
  }

  return \`Welcome, \${user.name}!\`;
}
\`\`\`

## Common Patterns

\`\`\`typescript
// Find first match in array
function findFirst(numbers: number[], target: number): number {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) {
      return i;  // Return index when found
    }
  }
  return -1;  // Not found
}

// Sum all numbers
function sum(numbers: number[]): number {
  let total = 0;
  for (let num of numbers) {
    total += num;
  }
  return total;
}

// Check if all items pass a test
function allPositive(numbers: number[]): boolean {
  for (let num of numbers) {
    if (num <= 0) {
      return false;  // Found a non-positive, fail fast
    }
  }
  return true;  // All passed
}
\`\`\`

## Nested Loops

Loops inside loops for working with 2D data:

\`\`\`typescript
let grid: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

for (let row of grid) {
  for (let cell of row) {
    console.log(cell);
  }
}
// Prints: 1, 2, 3, 4, 5, 6, 7, 8, 9
\`\`\`

## Common Mistakes to Avoid

\`\`\`typescript
// WRONG: Using = instead of ===
if (x = 5) { }  // This assigns, not compares!

// WRONG: Forgetting break in switch
switch (day) {
  case 1:
    console.log("Monday");
    // Falls through to case 2!
  case 2:
    console.log("Tuesday");
    break;
}

// WRONG: Infinite loop
let i = 0;
while (i < 10) {
  console.log(i);
  // Forgot i++; — loops forever!
}

// WRONG: Off-by-one error
for (let i = 0; i <= array.length; i++) {
  // Should be i < array.length
  console.log(array[i]);  // undefined on last iteration!
}
\`\`\`

## Quick Reference

| Statement | Use Case |
|-----------|----------|
| if/else | Binary decisions |
| else if | Multiple conditions |
| switch | Many specific values |
| for | Known number of iterations |
| for...of | Iterate array elements |
| while | Unknown iterations |
| break | Exit loop early |
| continue | Skip to next iteration |

## The Big Picture: Control Flow in Real Applications

Control flow is how programs make decisions and repeat actions. Here's how it looks in production code:

### Form Validation
\`\`\`typescript
function validateRegistrationForm(data: {
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Email validation
  if (!data.email.includes("@")) {
    errors.push("Invalid email format");
  }

  // Password strength
  if (data.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  } else if (!/[A-Z]/.test(data.password)) {
    errors.push("Password must contain an uppercase letter");
  } else if (!/[0-9]/.test(data.password)) {
    errors.push("Password must contain a number");
  }

  // Password match
  if (data.password !== data.confirmPassword) {
    errors.push("Passwords do not match");
  }

  // Age verification
  if (data.age < 13) {
    errors.push("Must be 13 or older to register");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
\`\`\`

### User Authentication & Authorization
\`\`\`typescript
function checkAccess(user: {
  role: string;
  isActive: boolean;
  permissions: string[];
} | null, requiredPermission: string): string {
  // Guard: no user
  if (!user) {
    return "Please log in";
  }

  // Guard: inactive account
  if (!user.isActive) {
    return "Your account has been deactivated";
  }

  // Admin bypass
  if (user.role === "admin") {
    return "Access granted";
  }

  // Check specific permission
  if (user.permissions.includes(requiredPermission)) {
    return "Access granted";
  }

  return "You don't have permission to access this resource";
}

// Role-based UI rendering
function getNavigationItems(userRole: string): string[] {
  const items = ["Home", "Profile", "Settings"];

  if (userRole === "admin" || userRole === "moderator") {
    items.push("User Management");
  }

  if (userRole === "admin") {
    items.push("System Settings", "Analytics", "Logs");
  }

  return items;
}
\`\`\`

### API Response Handling
\`\`\`typescript
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "loading" };

function handleApiResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case "loading":
      showSpinner();
      break;
    case "success":
      hideSpinner();
      displayData(response.data);  // TypeScript knows data exists here!
      break;
    case "error":
      hideSpinner();
      showErrorMessage(response.message);  // TypeScript knows message exists here!
      break;
  }
}

// Retry logic with loop
async function fetchWithRetry(url: string, maxRetries: number): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      lastError = error as Error;
      console.log(\`Attempt \${attempt} failed, retrying...\`);
    }
  }

  throw lastError || new Error("All retry attempts failed");
}
\`\`\`

### E-commerce Cart Logic
\`\`\`typescript
function calculateCartTotal(cart: {
  items: { price: number; quantity: number }[];
  couponCode: string | null;
  membershipLevel: string;
}): { subtotal: number; discount: number; total: number } {
  // Calculate subtotal
  let subtotal = 0;
  for (const item of cart.items) {
    subtotal += item.price * item.quantity;
  }

  // Apply membership discount
  let discount = 0;
  if (cart.membershipLevel === "gold") {
    discount = subtotal * 0.15;  // 15% off
  } else if (cart.membershipLevel === "silver") {
    discount = subtotal * 0.10;  // 10% off
  } else if (cart.membershipLevel === "bronze") {
    discount = subtotal * 0.05;  // 5% off
  }

  // Apply coupon (if valid)
  if (cart.couponCode) {
    switch (cart.couponCode) {
      case "SAVE20":
        discount += subtotal * 0.20;
        break;
      case "FLAT10":
        discount += 10;
        break;
      case "FREESHIP":
        // Handled separately
        break;
      default:
        console.log("Invalid coupon code");
    }
  }

  // Cap discount at subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  return {
    subtotal,
    discount,
    total: subtotal - discount
  };
}
\`\`\`

### Game Logic
\`\`\`typescript
function processPlayerTurn(player: {
  health: number;
  mana: number;
  statusEffects: string[];
}, action: string, target: { health: number; armor: number }): string {
  // Check if player can act
  if (player.health <= 0) {
    return "Cannot act - player is defeated";
  }

  if (player.statusEffects.includes("stunned")) {
    return "Cannot act - player is stunned";
  }

  // Process action
  switch (action) {
    case "attack":
      const damage = Math.max(10 - target.armor, 1);
      target.health -= damage;
      return \`Dealt \${damage} damage!\`;

    case "heal":
      if (player.mana < 20) {
        return "Not enough mana to heal";
      }
      player.mana -= 20;
      player.health += 30;
      return "Healed for 30 HP";

    case "fireball":
      if (player.mana < 50) {
        return "Not enough mana for fireball";
      }
      player.mana -= 50;
      target.health -= 40;  // Ignores armor
      return "Fireball dealt 40 damage!";

    default:
      return "Unknown action";
  }
}

// Game loop processing
function gameLoop(enemies: { id: number; health: number; isActive: boolean }[]): void {
  for (const enemy of enemies) {
    if (!enemy.isActive) {
      continue;  // Skip inactive enemies
    }

    if (enemy.health <= 0) {
      enemy.isActive = false;
      console.log(\`Enemy \${enemy.id} defeated!\`);
      continue;
    }

    // Process enemy turn...
    console.log(\`Enemy \${enemy.id} takes action\`);
  }
}
\`\`\`

### Data Processing Pipeline
\`\`\`typescript
function processUserData(users: {
  id: number;
  email: string;
  status: string;
  lastLogin: Date | null;
}[]): {
  active: number;
  inactive: number;
  neverLoggedIn: number;
} {
  let active = 0;
  let inactive = 0;
  let neverLoggedIn = 0;

  for (const user of users) {
    // Skip invalid users
    if (!user.email || !user.email.includes("@")) {
      continue;
    }

    // Categorize by status
    if (user.status === "active") {
      active++;
    } else if (user.status === "inactive") {
      inactive++;
    }

    // Track users who never logged in
    if (user.lastLogin === null) {
      neverLoggedIn++;
    }
  }

  return { active, inactive, neverLoggedIn };
}

// Search with early exit
function findUserById(users: { id: number; name: string }[], targetId: number): string | null {
  for (const user of users) {
    if (user.id === targetId) {
      return user.name;  // Found! Exit immediately
    }
  }
  return null;  // Not found after checking all
}
\`\`\`

### Feature Flags & A/B Testing
\`\`\`typescript
function renderButton(featureFlags: {
  newCheckoutEnabled: boolean;
  experimentGroup: "A" | "B" | "control";
}): string {
  // Feature flag check
  if (!featureFlags.newCheckoutEnabled) {
    return '<button class="btn-old">Checkout</button>';
  }

  // A/B test variants
  switch (featureFlags.experimentGroup) {
    case "A":
      return '<button class="btn-green">Complete Purchase</button>';
    case "B":
      return '<button class="btn-blue">Buy Now</button>';
    case "control":
    default:
      return '<button class="btn-standard">Checkout</button>';
  }
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write if/else statements with proper TypeScript types
- Use comparison and logical operators
- Create for, for...of, and while loops
- Understand how TypeScript narrows types in conditional blocks
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Conditionals',
      description: `Use an if/else statement to make a decision based on a value.

**Your task:**
1. Create a variable \`score\` with value 85
2. If score is 60 or above, print "Pass"
3. Otherwise, print "Fail"

**If/else syntax:**
\`\`\`
if (condition) {
  // runs if condition is true
} else {
  // runs if condition is false
}
\`\`\``,
      starterCode: `// Create a score variable with value 85


// Write an if/else: if score >= 60, print "Pass", otherwise print "Fail"

`,
      solution: `let score: number = 85;

if (score >= 60) {
  console.log("Pass");
} else {
  console.log("Fail");
}`,
      expectedOutput: ['Pass'],
      hints: [
        'First line: let score: number = 85;',
        'Use >= for "greater than or equal to"',
        'Inside if block: console.log("Pass");',
        'Inside else block: console.log("Fail");'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Loop Through Array',
      description: `Use a for...of loop to print each item in an array.

**Your task:**
1. Create an array \`fruits\` with: "apple", "banana", "cherry"
2. Use a for...of loop to print each fruit

**For...of syntax:**
\`\`\`
for (let item of array) {
  console.log(item);
}
\`\`\``,
      starterCode: `// Create an array of fruits: "apple", "banana", "cherry"


// Use a for...of loop to print each fruit

`,
      solution: `let fruits: string[] = ["apple", "banana", "cherry"];

for (let fruit of fruits) {
  console.log(fruit);
}`,
      expectedOutput: ['apple', 'banana', 'cherry'],
      hints: [
        'Array: let fruits: string[] = ["apple", "banana", "cherry"];',
        'For...of: for (let fruit of fruits) { }',
        'Inside the loop, fruit becomes each element in order',
        'Print with console.log(fruit);'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Counting Loop',
      description: `Use a classic for loop to count from 1 to 5.

**Your task:**
Print the numbers 1, 2, 3, 4, 5 (each on a new line)

**For loop syntax:**
\`\`\`
for (let i = start; i <= end; i++) {
  console.log(i);
}
\`\`\`

**The three parts:**
- \`let i = 1\` — start at 1
- \`i <= 5\` — continue while i is 5 or less
- \`i++\` — add 1 to i after each loop`,
      starterCode: `// Use a for loop to print 1, 2, 3, 4, 5
// Hint: for (let i = start; i <= end; i++) { ... }

`,
      solution: `for (let i = 1; i <= 5; i++) {
  console.log(i);
}`,
      expectedOutput: ['1', '2', '3', '4', '5'],
      hints: [
        'Start: let i = 1 (begin counting at 1)',
        'Condition: i <= 5 (keep going while 5 or less)',
        'Increment: i++ (add 1 after each loop)',
        'Body: console.log(i); (print the current number)'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Grade Calculator with else if',
      description: `Use else if to handle multiple conditions.

**Your task:**
1. Create a variable \`score\` with value 78
2. Print the letter grade based on these rules:
   - 90 or above: print "A"
   - 80 or above: print "B"
   - 70 or above: print "C"
   - 60 or above: print "D"
   - Below 60: print "F"

**Else if syntax:**
\`\`\`
if (condition1) {
  // ...
} else if (condition2) {
  // ...
} else {
  // ...
}
\`\`\``,
      starterCode: `// Create score with value 78


// Use if/else if/else to print the letter grade
// 90+ = A, 80+ = B, 70+ = C, 60+ = D, below 60 = F

`,
      solution: `let score: number = 78;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 70) {
  console.log("C");
} else if (score >= 60) {
  console.log("D");
} else {
  console.log("F");
}`,
      expectedOutput: ['C'],
      hints: [
        'Start with the highest grade: if (score >= 90)',
        'Chain with else if for each lower grade',
        'Order matters! Check 90 before 80 before 70...',
        '78 is >= 70 but < 80, so it prints "C"'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the result of: 5 === "5" in TypeScript?',
      options: ['true', 'false', 'Error', '"5"'],
      correctIndex: 1,
      explanation: 'The === operator checks both value and type. 5 is a number and "5" is a string, so they are not strictly equal.'
    },
    {
      question: 'What does "type narrowing" mean in TypeScript?',
      options: [
        'Converting a type to a smaller size',
        'TypeScript knowing a more specific type inside a conditional block',
        'Removing properties from an object type',
        'Restricting what values can be assigned'
      ],
      correctIndex: 1,
      explanation: 'Type narrowing is when TypeScript infers a more specific type inside a conditional. For example, inside if (typeof x === "string"), TypeScript knows x is a string.'
    },
    {
      question: 'What does the "break" keyword do inside a loop?',
      options: [
        'Pauses the loop temporarily',
        'Skips to the next iteration',
        'Exits the loop completely',
        'Restarts the loop from the beginning'
      ],
      correctIndex: 2,
      explanation: 'break immediately exits the loop. Use continue to skip to the next iteration instead.'
    },
    {
      question: 'Which loop is best for iterating over array elements?',
      options: [
        'for (let i = 0; i < arr.length; i++)',
        'for (let item of arr)',
        'while (arr.length > 0)',
        'for (let key in arr)'
      ],
      correctIndex: 1,
      explanation: 'for...of is the cleanest way to iterate array elements. It gives you each value directly without needing an index.'
    }
  ],
  buildNote: {
    title: 'Control Flow in the App',
    explanation: `Control flow is everywhere in this app. In \`src/components/OutputPanel.tsx\`, we use conditionals to show different UI based on the grade: if perfect, show celebration; if partial, show encouragement; if error, show tips. The \`gradeOutput\` function uses a for loop to compare each line of actual output against expected output. In \`src/hooks/useProgress.ts\`, we loop through completed exercises to calculate progress percentages. Type narrowing is used when checking if \`result\` exists before accessing its properties — TypeScript knows inside the \`if (result)\` block that result is not null.`,
    relatedFiles: [
      'src/components/OutputPanel.tsx',
      'src/components/Quiz.tsx',
      'src/hooks/useProgress.ts'
    ],
    inTheRealWorld: `Control flow with type narrowing is one of TypeScript's killer features. In production code, you'll often have values that could be multiple types (like API responses that might be data or an error). Using \`if (response.error)\` lets TypeScript narrow the type so you can safely access error properties in that block, and data properties in the else block. Libraries like Zod and io-ts build on this pattern for runtime validation with full type inference.`
  }
};
