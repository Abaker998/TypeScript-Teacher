import { Lesson } from '@/types/lesson';

export const asyncProgramming: Lesson = {
  slug: 'async-programming',
  title: 'Async Programming',
  description: 'Master Promises, async/await, and asynchronous JavaScript patterns.',
  difficulty: 'intermediate',
  order: 19,
  content: `
# Asynchronous Programming

JavaScript is single-threaded but needs to handle operations that take time (network requests, file reading, timers). Async programming lets code continue running while waiting.

## What is Asynchronous?

Synchronous code runs line by line, waiting for each operation:

\`\`\`typescript
console.log("1");
console.log("2");  // Waits for line above
console.log("3");  // Waits for line above
// Output: 1, 2, 3
\`\`\`

Asynchronous code doesn't wait:

\`\`\`typescript
console.log("1");
setTimeout(() => console.log("2"), 1000);  // Scheduled for later
console.log("3");  // Runs immediately!
// Output: 1, 3, 2 (2 appears after 1 second)
\`\`\`

## Promises

A Promise represents a future value. It can be:
- **Pending** - still waiting
- **Fulfilled** - completed successfully
- **Rejected** - failed with an error

\`\`\`typescript
// Creating a Promise
let myPromise = new Promise<string>((resolve, reject) => {
  let success = true;

  if (success) {
    resolve("It worked!");
  } else {
    reject("Something went wrong");
  }
});

// Using a Promise
myPromise
  .then(result => console.log(result))  // On success
  .catch(error => console.log(error));   // On failure
\`\`\`

### Promise with Delay

\`\`\`typescript
function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

delay(2000).then(() => {
  console.log("2 seconds passed!");
});
\`\`\`

### Chaining Promises

\`\`\`typescript
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(error => console.log("Error:", error));
\`\`\`

## Async/Await

Async/await makes promises look like synchronous code:

\`\`\`typescript
// With Promises
function getDataPromise() {
  return fetch("/api/data")
    .then(response => response.json())
    .then(data => console.log(data));
}

// With async/await - cleaner!
async function getDataAsync() {
  let response = await fetch("/api/data");
  let data = await response.json();
  console.log(data);
}
\`\`\`

### Async Functions Always Return Promises

\`\`\`typescript
async function greet(): Promise<string> {
  return "Hello!";  // Automatically wrapped in Promise
}

greet().then(message => console.log(message));
\`\`\`

### Error Handling with Try/Catch

\`\`\`typescript
async function fetchUser(id: number) {
  try {
    let response = await fetch(\`/api/users/\${id}\`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    let user = await response.json();
    return user;
  } catch (error) {
    console.log("Error:", error.message);
    return null;
  }
}
\`\`\`

## Parallel vs Sequential

### Sequential (slower)

\`\`\`typescript
async function sequential() {
  let user = await fetchUser(1);      // Wait...
  let posts = await fetchPosts(1);    // Then wait...
  let comments = await fetchComments(1); // Then wait...
  // Total time: user + posts + comments
}
\`\`\`

### Parallel (faster)

\`\`\`typescript
async function parallel() {
  let [user, posts, comments] = await Promise.all([
    fetchUser(1),
    fetchPosts(1),
    fetchComments(1)
  ]);
  // Total time: max(user, posts, comments)
}
\`\`\`

## Promise Utilities

\`\`\`typescript
// Promise.all - wait for ALL to complete
let results = await Promise.all([promise1, promise2, promise3]);

// Promise.race - first one wins
let fastest = await Promise.race([promise1, promise2, promise3]);

// Promise.allSettled - wait for all, even if some fail
let outcomes = await Promise.allSettled([promise1, promise2, promise3]);
\`\`\`

## Common Patterns

### Loading State

\`\`\`typescript
async function loadData() {
  setLoading(true);
  try {
    let data = await fetchData();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
\`\`\`

### Timeout Pattern

\`\`\`typescript
function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
  return Promise.race([promise, timer]);
}

// Use: fail if takes more than 5 seconds
let data = await timeout(fetchData(), 5000);
\`\`\`

## TypeScript with Promises

\`\`\`typescript
// Type the Promise result
async function getUser(id: number): Promise<User> {
  let response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// Type inference works too
let user = await getUser(1);  // TypeScript knows: User
\`\`\`

## Retry Pattern

Automatically retry failed operations:

\`\`\`typescript
async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await delay(1000 * (i + 1));  // Exponential backoff
    }
  }
  throw new Error("Should not reach here");
}

// Usage
let data = await retry(() => fetchData(), 3);
\`\`\`

## Common Mistakes

\`\`\`typescript
// WRONG: Forgetting await
async function bad() {
  let data = fetchData();  // Missing await! data is a Promise, not the value
  console.log(data);  // Prints: Promise { <pending> }
}

// WRONG: Using await in non-async function
function notAsync() {
  let data = await fetchData();  // Error! Can't use await here
}

// WRONG: Await in forEach (doesn't work as expected)
async function processItems(items: string[]) {
  items.forEach(async (item) => {
    await processItem(item);  // These don't run sequentially!
  });
}

// CORRECT: Use for...of for sequential async
async function processItems(items: string[]) {
  for (const item of items) {
    await processItem(item);  // Runs one at a time
  }
}

// CORRECT: Use Promise.all for parallel
async function processItems(items: string[]) {
  await Promise.all(items.map(item => processItem(item)));
}

// WRONG: Not handling errors
async function bad() {
  let data = await fetchData();  // If this throws, error is unhandled!
}

// CORRECT: Always handle errors
async function good() {
  try {
    let data = await fetchData();
  } catch (error) {
    console.error("Failed:", error);
  }
}
\`\`\`

## Quick Reference

| Pattern | Code |
|---------|------|
| Create Promise | \`new Promise((resolve, reject) => {})\` |
| Resolve Promise | \`Promise.resolve(value)\` |
| Reject Promise | \`Promise.reject(error)\` |
| Async function | \`async function name() {}\` |
| Await Promise | \`const result = await promise\` |
| Parallel execution | \`await Promise.all([p1, p2])\` |
| First to finish | \`await Promise.race([p1, p2])\` |
| Wait for all (even failures) | \`await Promise.allSettled([p1, p2])\` |
| Error handling | \`try { await... } catch {}\` |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Understand synchronous vs asynchronous execution
- Create and use Promises
- Write clean async code with async/await
- Handle errors in async functions
- Run operations in parallel with Promise.all
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create a Promise',
      description: `Promises wrap async operations and resolve with a value when complete.

**Your task:**
1. Return a new Promise from the function
2. Inside the Promise, use setTimeout to wait 1000ms
3. After the timeout, resolve with the message parameter
4. Uncomment the test code to verify it works`,
      starterCode: `function delayedMessage(msg: string): Promise<string> {
  // Step 1: Return a new Promise


  // Step 2: Use setTimeout to wait 1000ms


  // Step 3: Resolve with the message


}

// Step 4: Uncomment to test
`,
      solution: `function delayedMessage(msg: string): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(msg);
    }, 1000);
  });
}

delayedMessage("Hello!").then(msg => console.log(msg));`,
      expectedOutput: ['Hello!'],
      hints: [
        'new Promise(resolve => { ... }) creates a Promise',
        'setTimeout(() => { }, 1000) waits 1 second',
        'resolve(msg) completes the Promise with the value',
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Async/Await',
      description: `Async/await makes Promise code look synchronous and easier to read.

**Your task:**
1. Add the async keyword to the showData function
2. Use await to get the result from getData()
3. Log the result to the console
4. Call the function to run it`,
      starterCode: `function getData(): Promise<number> {
  return Promise.resolve(42);
}

// Step 1: Add async keyword


// Step 2: Await the Promise


// Step 3: Log the result


// Step 4: Call the function
`,
      solution: `function getData(): Promise<number> {
  return Promise.resolve(42);
}

async function showData() {
  let result = await getData();
  console.log(result);
}

showData();`,
      expectedOutput: ['42'],
      hints: [
        'async goes before function keyword',
        'await pauses until Promise resolves',
        'The awaited value is stored in result',
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Promise.all',
      description: `Promise.all runs multiple Promises in parallel and waits for all to complete.

**Your task:**
1. Create an async function called sumAll
2. Use Promise.all to await all three promises at once
3. Add up the results and log the sum
4. Call sumAll() to run it`,
      starterCode: `let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = Promise.resolve(3);

// Step 1: Create async function


// Step 2: Await all promises with Promise.all


// Step 3: Sum and log the results


// Step 4: Call the function
`,
      solution: `let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = Promise.resolve(3);

async function sumAll() {
  let results = await Promise.all([p1, p2, p3]);
  let sum = results[0] + results[1] + results[2];
  console.log(sum);
}

sumAll();`,
      expectedOutput: ['6'],
      hints: [
        'Promise.all([...]) takes an array of Promises',
        'Results array matches input order: [1, 2, 3]',
        'Add results[0] + results[1] + results[2]',
      ]
    }
  ],
  buildNote: {
    title: 'Async Programming in Practice',
    explanation: `Async programming is fundamental to web development. Every API call, database query, and file operation is asynchronous. In this app, if we added user accounts, we'd use async/await for authentication and saving progress to a server. The code editor could use async for running TypeScript compilation in the background.`,
    relatedFiles: [
      'src/hooks/useProgress.ts'
    ],
    inTheRealWorld: `Modern web apps are heavily async. React data fetching libraries (React Query, SWR) wrap Promises. Node.js is built on async I/O. Every fetch() call is a Promise. Understanding async patterns is essential for building responsive UIs that don't freeze while loading data. Error boundaries in React exist specifically to handle async failures gracefully.`
  }
};
