import { Lesson } from '@/types/lesson';

export const arraysAndObjects: Lesson = {
  slug: 'arrays-and-objects',
  title: 'Arrays & Objects',
  description: 'Learn to create typed arrays and objects with consistent, predictable structures.',
  difficulty: 'beginner',
  order: 4,
  content: `
# Arrays & Objects

Beyond individual variables, TypeScript lets you create collections of data — arrays and objects — and specify what types those collections should hold.

## Typed Arrays

**What this example does:** Creates lists of values where every item must be the same type.

**When you'd use this:** Storing lists of users, products, scores, tags, messages - any collection of similar items.

An array is a list of values. TypeScript requires all values in an array to have the same type:

\`\`\`typescript
const names: string[] = ["Alice", "Bob", "Charlie"];
const scores: number[] = [95, 87, 92];
const flags: boolean[] = [true, false, true];
\`\`\`

**Real-world example:** Storing a user's recent search history:
\`\`\`typescript
const recentSearches: string[] = ["typescript tutorial", "react hooks", "css grid"];
\`\`\`

You can also use the generic syntax \`Array<T>\`:

\`\`\`typescript
const names: Array<string> = ["Alice", "Bob"];
\`\`\`

Both syntaxes mean the same thing. The \`string[]\` syntax is more common.

## Common Array Operations

**What this example does:** Shows the essential methods for adding, removing, and finding items in arrays.

**When you'd use this:** Managing shopping carts (add/remove items), todo lists, message queues, any dynamic list that changes.

Arrays come with many useful methods:

\`\`\`typescript
const fruits: string[] = ["apple", "banana", "cherry"];

// Add items
fruits.push("date");           // Add to end
fruits.unshift("apricot");     // Add to beginning

// Remove items
const last = fruits.pop();     // Remove from end
const first = fruits.shift();  // Remove from beginning

// Access items
console.log(fruits[0]);        // First item
console.log(fruits.length);    // Number of items

// Find items
const index = fruits.indexOf("banana");  // Position of item
const hasApple = fruits.includes("apple"); // true or false
\`\`\`

**Real-world example:** Managing a notifications list:
\`\`\`typescript
const notifications: string[] = [];
notifications.push("New message from John");  // Add notification
notifications.shift();  // Remove oldest notification when read
\`\`\`

## Array Methods with Callbacks

**What this example does:** Shows the most powerful array methods that let you transform, filter, and process data.

**When you'd use this:** Processing API data, filtering search results, calculating totals, transforming data for display.

These powerful methods transform arrays:

\`\`\`typescript
const numbers: number[] = [1, 2, 3, 4, 5];

// map: transform each item
const doubled: number[] = numbers.map((n: number): number => n * 2);
// [2, 4, 6, 8, 10]

// filter: keep items that match
const evens: number[] = numbers.filter((n: number): boolean => n % 2 === 0);
// [2, 4]

// find: get first match
const firstBig: number | undefined = numbers.find((n: number): boolean => n > 3);
// 4

// reduce: combine into single value
const sum: number = numbers.reduce((total: number, n: number): number => total + n, 0);
// 15

// forEach: do something with each item
numbers.forEach((n: number): void => {
  console.log(n);
});
\`\`\`

**Real-world example:** Processing a list of products:
\`\`\`typescript
const products = [{ name: "Shirt", price: 25 }, { name: "Pants", price: 50 }];
const names = products.map(p => p.name);        // ["Shirt", "Pants"]
const expensive = products.filter(p => p.price > 30);  // [{ name: "Pants", price: 50 }]
const total = products.reduce((sum, p) => sum + p.price, 0);  // 75
\`\`\`

## Object Shapes

**What this example does:** Creates a single data structure that groups related information together.

**When you'd use this:** User profiles, product details, form data, configuration settings - any time you have related pieces of data.

Objects group related data together. You describe an object's structure using inline type annotations:

\`\`\`typescript
const person: { name: string; age: number; active: boolean } = {
  name: "Alice",
  age: 30,
  active: true
};
\`\`\`

Properties are separated by semicolons or commas. You can access properties with dot notation:

\`\`\`typescript
console.log(person.name);   // "Alice"
console.log(person.age);    // 30
\`\`\`

**Real-world example:** Storing user settings:
\`\`\`typescript
const userSettings: { theme: string; notifications: boolean; language: string } = {
  theme: "dark",
  notifications: true,
  language: "en"
};
\`\`\`

## More Object Examples

\`\`\`typescript
// Object with various property types
const product: {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  tags: string[];
} = {
  id: 1,
  name: "Laptop",
  price: 999.99,
  inStock: true,
  tags: ["electronics", "computers"]
};

// Accessing nested data
console.log(product.tags[0]);  // "electronics"

// Object with optional property (using ?)
const config: {
  host: string;
  port: number;
  ssl?: boolean;  // Optional!
} = {
  host: "localhost",
  port: 3000
  // ssl is optional, can be omitted
};
\`\`\`

## Modifying Objects

\`\`\`typescript
const user: { name: string; score: number } = {
  name: "Alice",
  score: 100
};

// Update a property
user.score = 150;

// Add via bracket notation (if type allows)
user["score"] = 200;

// Spread operator to copy and modify
const updatedUser = { ...user, score: 250 };
\`\`\`

## Arrays of Objects

**What this example does:** Creates a list where each item is an object with the same structure - the most common data pattern in real apps.

**When you'd use this:** User lists, product catalogs, order history, search results, any list of complex items.

Combine these concepts to create arrays of objects:

\`\`\`typescript
const users: { name: string; age: number }[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
];

// Access specific user
console.log(users[0].name);  // "Alice"

// Find a user
const bob = users.find((u): boolean => u.name === "Bob");

// Filter users
const adults = users.filter((u): boolean => u.age >= 18);

// Map to extract data
const names: string[] = users.map((u): string => u.name);
// ["Alice", "Bob"]
\`\`\`

This is powerful for structured data. Each object must have the same properties and types.

**Real-world example:** Displaying an order history:
\`\`\`typescript
const orders: { id: number; product: string; price: number }[] = [
  { id: 1, product: "Laptop", price: 999 },
  { id: 2, product: "Mouse", price: 29 }
];
const orderTotal = orders.reduce((sum, order) => sum + order.price, 0);  // 1028
\`\`\`

## Destructuring

Extract values from arrays and objects easily:

\`\`\`typescript
// Array destructuring
const colors: string[] = ["red", "green", "blue"];
const [first, second, third] = colors;
console.log(first);  // "red"

// Object destructuring
const person = { name: "Alice", age: 30 };
const { name, age } = person;
console.log(name);  // "Alice"

// Destructuring in function parameters
function printUser({ name, age }: { name: string; age: number }): void {
  console.log(\`\${name} is \${age} years old\`);
}
\`\`\`

## Type Safety in Collections

Without types, it's easy to add wrong data:

\`\`\`typescript
const numbers = [1, 2, 3];
numbers.push("four");  // In JavaScript, this works but breaks logic!

// With types:
const numbers: number[] = [1, 2, 3];
numbers.push("four");  // TypeScript error!
\`\`\`

## Common Mistakes to Avoid

\`\`\`typescript
// WRONG: Accessing non-existent property
const user = { name: "Alice" };
console.log(user.age);  // Error: 'age' doesn't exist

// WRONG: Pushing wrong type to array
const nums: number[] = [1, 2, 3];
nums.push("4");  // Error: string is not number

// WRONG: Missing required properties
const person: { name: string; age: number } = {
  name: "Alice"
  // Error: missing 'age' property
};

// WRONG: Array index out of bounds (no error, but undefined)
const arr: string[] = ["a", "b"];
console.log(arr[10]);  // undefined (no TypeScript error!)
\`\`\`

## Printing Arrays and Objects

Use \`console.log()\` to see array and object values:

\`\`\`typescript
const colors: string[] = ["red", "green", "blue"];
console.log(colors[0]);  // Prints: red (first element)
console.log(colors);     // Prints: ["red", "green", "blue"]

const user = { name: "Alice", age: 30 };
console.log(user.name);  // Prints: Alice
console.log(user);       // Prints: { name: "Alice", age: 30 }
\`\`\`

## Quick Reference

| Operation | Syntax | Example |
|-----------|--------|---------|
| Array type | \`type[]\` | \`string[]\`, \`number[]\` |
| Object type | \`{ prop: type }\` | \`{ name: string }\` |
| Array of objects | \`{ prop: type }[]\` | \`{ id: number }[]\` |
| Optional prop | \`prop?: type\` | \`{ age?: number }\` |
| Access array | \`arr[index]\` | \`names[0]\` |
| Access object | \`obj.prop\` | \`user.name\` |

## The Big Picture: Arrays & Objects in Real Applications

Arrays and objects are the backbone of real application data. Here's how they look in production code:

### User Management System
\`\`\`typescript
// Array of user objects - the most common pattern you'll see
const users: {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}[] = [
  { id: 1, username: "admin", email: "admin@company.com", role: "admin", isActive: true },
  { id: 2, username: "john_doe", email: "john@email.com", role: "user", isActive: true },
  { id: 3, username: "jane_smith", email: "jane@email.com", role: "user", isActive: false }
];

// Find active users
const activeUsers = users.filter(user => user.isActive);

// Get all usernames
const usernames = users.map(user => user.username);

// Find admin
const admin = users.find(user => user.role === "admin");
\`\`\`

### Shopping Cart
\`\`\`typescript
// Shopping cart with items array
const cart: {
  items: { productId: number; name: string; price: number; quantity: number }[];
  totalItems: number;
  subtotal: number;
} = {
  items: [
    { productId: 101, name: "Wireless Mouse", price: 29.99, quantity: 2 },
    { productId: 205, name: "USB-C Cable", price: 12.99, quantity: 3 },
    { productId: 310, name: "Laptop Stand", price: 49.99, quantity: 1 }
  ],
  totalItems: 6,
  subtotal: 138.94
};

// Calculate cart total
const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// Find specific item
const mouseItem = cart.items.find(item => item.productId === 101);

// Update quantity
cart.items[0].quantity = 3;
\`\`\`

### API Response Handling
\`\`\`typescript
// Typical API response structure
const apiResponse: {
  success: boolean;
  data: { id: number; title: string; completed: boolean }[];
  pagination: { page: number; totalPages: number; perPage: number };
} = {
  success: true,
  data: [
    { id: 1, title: "Complete TypeScript course", completed: false },
    { id: 2, title: "Build portfolio project", completed: false },
    { id: 3, title: "Apply for jobs", completed: false }
  ],
  pagination: { page: 1, totalPages: 5, perPage: 10 }
};

// Process the response
if (apiResponse.success) {
  const incompleteTasks = apiResponse.data.filter(task => !task.completed);
  console.log(\`You have \${incompleteTasks.length} tasks remaining\`);
}
\`\`\`

### Blog/CMS System
\`\`\`typescript
// Blog posts with nested comments
const posts: {
  id: number;
  title: string;
  author: string;
  content: string;
  tags: string[];
  comments: { userId: number; text: string; timestamp: string }[];
  publishedAt: string;
}[] = [
  {
    id: 1,
    title: "Getting Started with TypeScript",
    author: "Jane Developer",
    content: "TypeScript adds types to JavaScript...",
    tags: ["typescript", "javascript", "tutorial"],
    comments: [
      { userId: 5, text: "Great article!", timestamp: "2024-01-15T10:30:00Z" },
      { userId: 12, text: "This helped me a lot", timestamp: "2024-01-15T14:22:00Z" }
    ],
    publishedAt: "2024-01-14T08:00:00Z"
  }
];

// Get all unique tags across all posts
const allTags = posts.flatMap(post => post.tags);
const uniqueTags = [...new Set(allTags)];

// Find posts by tag
const typescriptPosts = posts.filter(post => post.tags.includes("typescript"));
\`\`\`

### Dashboard Analytics
\`\`\`typescript
// Analytics data for a dashboard
const dashboardData: {
  dailyStats: { date: string; visits: number; signups: number; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  userMetrics: { totalUsers: number; activeToday: number; newThisWeek: number };
} = {
  dailyStats: [
    { date: "2024-01-28", visits: 1250, signups: 45, revenue: 2340.50 },
    { date: "2024-01-29", visits: 1340, signups: 52, revenue: 2890.25 },
    { date: "2024-01-30", visits: 1180, signups: 38, revenue: 2150.00 }
  ],
  topProducts: [
    { name: "Pro Plan", sales: 156, revenue: 7800 },
    { name: "Team Plan", sales: 89, revenue: 8900 },
    { name: "Enterprise", sales: 12, revenue: 14400 }
  ],
  userMetrics: { totalUsers: 15420, activeToday: 3250, newThisWeek: 245 }
};

// Calculate total revenue this period
const totalRevenue = dashboardData.dailyStats.reduce((sum, day) => sum + day.revenue, 0);

// Find best performing day
const bestDay = dashboardData.dailyStats.reduce((best, day) =>
  day.revenue > best.revenue ? day : best
);
\`\`\`

### Form Data Collection
\`\`\`typescript
// Survey form with multiple choice and text responses
const surveyResponses: {
  respondentId: number;
  answers: { questionId: number; response: string | string[] | number }[];
  submittedAt: string;
}[] = [
  {
    respondentId: 1001,
    answers: [
      { questionId: 1, response: "Very Satisfied" },
      { questionId: 2, response: ["Email", "SMS"] },  // Multi-select
      { questionId: 3, response: 8 }  // Rating 1-10
    ],
    submittedAt: "2024-01-30T09:15:00Z"
  }
];

// Analyze responses for a specific question
const question3Responses = surveyResponses
  .map(survey => survey.answers.find(a => a.questionId === 3))
  .filter(answer => answer !== undefined);
\`\`\`

### Game Inventory System
\`\`\`typescript
// Player inventory with items and equipment slots
const playerInventory: {
  playerId: string;
  gold: number;
  items: { id: number; name: string; type: string; quantity: number; rarity: string }[];
  equipped: { weapon: string | null; armor: string | null; accessory: string | null };
} = {
  playerId: "player_12345",
  gold: 2500,
  items: [
    { id: 1, name: "Health Potion", type: "consumable", quantity: 10, rarity: "common" },
    { id: 2, name: "Dragon Sword", type: "weapon", quantity: 1, rarity: "legendary" },
    { id: 3, name: "Iron Shield", type: "armor", quantity: 1, rarity: "uncommon" }
  ],
  equipped: { weapon: "Dragon Sword", armor: "Iron Shield", accessory: null }
};

// Count items by rarity
const legendaryItems = playerInventory.items.filter(item => item.rarity === "legendary");

// Calculate total consumables
const totalConsumables = playerInventory.items
  .filter(item => item.type === "consumable")
  .reduce((total, item) => total + item.quantity, 0);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Declare arrays with specific element types
- Create objects with typed properties
- Use common array methods (map, filter, find)
- Define arrays of objects
- Use destructuring to extract values
- Ensure consistency in collections
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Typed Arrays and Objects',
      description: `Create a typed array and a typed object.

**Your task:**
1. Create an array of names: \`["Alice", "Bob", "Charlie"]\` with type \`string[]\`
2. Create a user object with these values:
   - name: \`"Alice"\`
   - email: \`"alice@example.com"\`
   - score: \`95\`
3. Print the user's name

**Type annotation syntax:**
- Array: \`const names: string[] = [...]\`
- Object: \`const user: { name: string; email: string; score: number } = { ... }\``,
      starterCode: `// Create a names array with type string[]


// Create a user object with:
// - name: "Alice"
// - email: "alice@example.com"
// - score: 95
// Type: { name: string; email: string; score: number }


// Print the user's name

`,
      solution: `const names: string[] = ["Alice", "Bob", "Charlie"];

const user: { name: string; email: string; score: number } = {
  name: "Alice",
  email: "alice@example.com",
  score: 95
};

console.log(user.name);`,
      expectedOutput: ['Alice'],
      hints: [
        'Array type: const names: string[] = ["Alice", "Bob", "Charlie"];',
        'Object type uses semicolons: { name: string; email: string; score: number }',
        'Object values use commas: { name: "Alice", email: "...", score: 95 }',
        'Access with dot notation: user.name'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Multiple Objects',
      description: `**Scenario:** You're building an e-commerce inventory tracker. Each product has a name, price, and stock status so customers know what's available.

**Your task:**
1. Create \`product1\` with: name "Laptop", price 999.99, inStock true
2. Create \`product2\` with: name "Headphones", price 149.99, inStock false
3. Print each product's name and stock status

**Expected output format:** "ProductName - In stock: true/false"`,
      starterCode: `// You're tracking inventory for an online store
// Create product1: Laptop, 999.99, in stock
// Type: { name: string; price: number; inStock: boolean }


// Create product2: Headphones, 149.99, out of stock


// Print each product's availability: "Name - In stock: true/false"

`,
      solution: `const product1: { name: string; price: number; inStock: boolean } = {
  name: "Laptop",
  price: 999.99,
  inStock: true
};

const product2: { name: string; price: number; inStock: boolean } = {
  name: "Headphones",
  price: 149.99,
  inStock: false
};

console.log(product1.name + " - In stock: " + product1.inStock);
console.log(product2.name + " - In stock: " + product2.inStock);`,
      expectedOutput: ['Laptop - In stock: true', 'Headphones - In stock: false'],
      hints: [
        'Both products have the same type annotation',
        'inStock is a boolean (true or false, no quotes)',
        'Concatenate strings with +: "text" + variable + "more text"',
        'Booleans become "true" or "false" when converted to strings'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Arrays of Objects',
      description: `Create an array containing multiple objects - a very common pattern!

**Scenario:** You're building a gradebook app. Each student has a name and their quiz scores from the semester.

**Your task:**
1. Create a \`students\` array containing two student objects
2. Each student has: name (string) and quizScores (number[]) - their scores on 3 quizzes
3. Print the first student's name
4. Print the first student's first quiz score

**Type for array of objects:** \`{ name: string; quizScores: number[] }[]\``,
      starterCode: `// Create a students array with two student objects
// Each student has: name (string) and quizScores (number[])
// Example: Alice scored 95, 87, 92 on her three quizzes
// Example: Bob scored 78, 85, 90 on his three quizzes
// Type: { name: string; quizScores: number[] }[]


// Print the first student's name (use [0] to access first item)


// Print the first student's first quiz score

`,
      solution: `const students: { name: string; quizScores: number[] }[] = [
  {
    name: "Alice",
    quizScores: [95, 87, 92]
  },
  {
    name: "Bob",
    quizScores: [78, 85, 90]
  }
];

console.log(students[0].name);
console.log(students[0].quizScores[0]);`,
      expectedOutput: ['Alice', '95'],
      hints: [
        'Array of objects type: { property: type }[] - the [] makes it an array',
        'students[0] gets the first object in the array',
        'students[0].name gets the name property of the first student',
        'students[0].quizScores[0] gets the first quiz score of the first student'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Array Methods - map and filter',
      description: `Use the powerful array methods map() and filter() to transform data.

**Scenario:** You have a list of product prices and need to apply a 10% discount and find items under $50.

**Your task:**
1. Create an array \`prices\` with values [25, 49.99, 75, 120, 15]
2. Use map() to create \`discountedPrices\` - multiply each by 0.9 (10% off)
3. Use filter() on discountedPrices to find prices under 50, store in \`affordable\`
4. Print the length of affordable (how many items are under $50 after discount)

**Array method syntax:** \`array.map(item => newValue)\` and \`array.filter(item => condition)\``,
      starterCode: `// Create prices array: [25, 49.99, 75, 120, 15]


// Use map() to apply 10% discount (multiply each by 0.9)


// Use filter() to find discounted prices under 50


// Print how many items are affordable (length of affordable array)

`,
      solution: `const prices: number[] = [25, 49.99, 75, 120, 15];

const discountedPrices: number[] = prices.map((price: number): number => price * 0.9);

const affordable: number[] = discountedPrices.filter((price: number): boolean => price < 50);

console.log(affordable.length);`,
      expectedOutput: ['3'],
      hints: [
        'map transforms each element: prices.map(price => price * 0.9)',
        'filter keeps elements that pass the test: discountedPrices.filter(price => price < 50)',
        'After 10% off: [22.5, 44.991, 67.5, 108, 13.5] - three are under 50',
        'Use .length to get the count: affordable.length'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the correct way to type an array of numbers?',
      options: [
        'Array[number]',
        'number[]',
        '[number]',
        'numbers'
      ],
      correctIndex: 1,
      explanation: 'Use type[] syntax for arrays: number[], string[], boolean[]. You can also use Array<number> but the bracket syntax is more common.'
    },
    {
      question: 'How do you access the "name" property of the first object in an array called "users"?',
      options: [
        'users.name[0]',
        'users[0].name',
        'users.0.name',
        'users[name][0]'
      ],
      correctIndex: 1,
      explanation: 'First access the array element with [0], then access the property with dot notation: users[0].name'
    },
    {
      question: 'What does the map() array method do?',
      options: [
        'Removes elements that don\'t match a condition',
        'Finds the first matching element',
        'Transforms each element and returns a new array',
        'Combines all elements into a single value'
      ],
      correctIndex: 2,
      explanation: 'map() creates a new array by transforming each element. For example, numbers.map(n => n * 2) doubles every number.'
    },
    {
      question: 'What happens if you try to push a string into a number[] array?',
      options: [
        'The string is converted to a number',
        'The array becomes (string | number)[]',
        'TypeScript shows a compile-time error',
        'The push is ignored silently'
      ],
      correctIndex: 2,
      explanation: 'TypeScript enforces array types. Pushing the wrong type causes a compile error, preventing bugs before runtime.'
    }
  ],
  buildNote: {
    title: 'Arrays & Objects in the App',
    explanation: `The app's core data structure is an array of \`Lesson\` objects, stored and exported from \`src/lessons/index.ts\`. Each lesson object has a consistent shape with typed properties: \`slug: string\`, \`title: string\`, \`description: string\`, \`difficulty: Difficulty\`, \`order: number\`, \`content: string\` (markdown), \`starterCode: string\`, \`solution: string\`, \`expectedOutput: string[]\` (array of strings), and \`buildNote: BuildNote\` (an object with specific nested properties). The sidebar component uses \`LessonGroup\` objects — objects that contain a \`difficulty\` property and a \`lessons: Lesson[]\` array — to organize lessons by difficulty. When TypeScript compiles the app, it verifies that every lesson object has all required fields with the correct types. If a lesson was accidentally missing a field like \`expectedOutput\` or had the wrong type for \`order\` (e.g., a string instead of a number), TypeScript would catch it at build time, preventing users from encountering runtime errors. The \`getLessonsByDifficulty()\` function demonstrates array filtering and sorting — it filters lessons by difficulty and sorts by the \`order\` field, showing how typed operations on arrays prevent mistakes.`,
    relatedFiles: [
      'src/lessons/index.ts',
      'src/types/lesson.ts',
      'src/components/Sidebar.tsx'
    ],
    inTheRealWorld: `In production codebases, typed arrays and objects are fundamental. A backend API might define types like \`User[]\` for user arrays, or \`{ success: boolean; data: T; error?: string }\` for API responses. React component state often stores arrays of items: \`useState<Todo[]>\`. Database libraries like Prisma auto-generate TypeScript types for tables, ensuring type-safe queries. TypeScript's structural typing means if your data matches the shape, the type-checker is satisfied — this is how frameworks like Next.js validate route parameters and form data.`
  }
};
