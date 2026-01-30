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

## The Big Picture: Async Programming in Real Applications

Async programming is the backbone of modern web applications. Here's how it's used in production:

### Data Fetching Service
\`\`\`typescript
// Production-ready API service
class DataService {
  private baseUrl: string;
  private retryCount = 3;
  private retryDelay = 1000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchWithRetry<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers
          }
        });

        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}\`);
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        console.warn(\`Attempt \${attempt} failed: \${error}\`);

        if (attempt < this.retryCount) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
\`\`\`

### React Data Loading Hook
\`\`\`typescript
// Generic async data hook
function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error, refetch } = useAsyncData(
    () => api.getUser(userId),
    [userId]
  );

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} onRetry={refetch} />;
  return <Profile user={user!} />;
}
\`\`\`

### Parallel Data Loading
\`\`\`typescript
// Dashboard that loads multiple data sources
async function loadDashboard(userId: string) {
  // Load all data in parallel
  const [user, notifications, stats, recentActivity] = await Promise.all([
    userService.getProfile(userId),
    notificationService.getUnread(userId),
    analyticsService.getUserStats(userId),
    activityService.getRecent(userId, 10)
  ]);

  return {
    user,
    notifications,
    stats,
    recentActivity
  };
}

// With error tolerance - some sections can fail
async function loadDashboardSafe(userId: string) {
  const results = await Promise.allSettled([
    userService.getProfile(userId),
    notificationService.getUnread(userId),
    analyticsService.getUserStats(userId),
    activityService.getRecent(userId, 10)
  ]);

  return {
    user: results[0].status === 'fulfilled' ? results[0].value : null,
    notifications: results[1].status === 'fulfilled' ? results[1].value : [],
    stats: results[2].status === 'fulfilled' ? results[2].value : null,
    recentActivity: results[3].status === 'fulfilled' ? results[3].value : []
  };
}
\`\`\`

### Queue Processing
\`\`\`typescript
// Process items with concurrency limit
async function processQueue<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = [];
  const executing = new Set<Promise<void>>();

  for (const item of items) {
    const promise = (async () => {
      const result = await processor(item);
      results.push(result);
    })();

    executing.add(promise);
    promise.finally(() => executing.delete(promise));

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// Usage: Upload 100 files, max 5 at a time
const uploadResults = await processQueue(
  files,
  file => uploadService.upload(file),
  5
);
\`\`\`

### Debounced Search
\`\`\`typescript
// Search with debouncing and cancellation
function useSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  debounceMs: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setLoading(true);
      try {
        const data = await searchFn(query);
        setResults(data);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Search failed:', error);
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, searchFn, debounceMs]);

  return { query, setQuery, results, loading };
}
\`\`\`

### Form Submission
\`\`\`typescript
// Form submission with optimistic updates
async function submitForm<T extends Record<string, unknown>>(
  data: T,
  options: {
    onOptimisticUpdate?: (data: T) => void;
    onSuccess?: (result: T) => void;
    onError?: (error: Error, data: T) => void;
    onFinally?: () => void;
  }
) {
  const { onOptimisticUpdate, onSuccess, onError, onFinally } = options;

  // Optimistic update - assume success
  onOptimisticUpdate?.(data);

  try {
    const result = await api.post<T>('/submit', data);
    onSuccess?.(result);
    return result;
  } catch (error) {
    // Rollback optimistic update
    onError?.(error as Error, data);
    throw error;
  } finally {
    onFinally?.();
  }
}

// Usage
await submitForm(formData, {
  onOptimisticUpdate: (data) => {
    // Immediately show new item in UI
    addItemToList(data);
  },
  onError: (error, data) => {
    // Remove item and show error
    removeItemFromList(data);
    showError(error.message);
  }
});
\`\`\`

### WebSocket Connection
\`\`\`typescript
// Async WebSocket wrapper
class AsyncWebSocket {
  private ws: WebSocket | null = null;
  private messageQueue: Array<(value: unknown) => void> = [];

  async connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('Connection failed'));
      this.ws.onmessage = (event) => {
        const resolver = this.messageQueue.shift();
        if (resolver) {
          resolver(JSON.parse(event.data));
        }
      };
    });
  }

  async send<T>(data: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected'));
        return;
      }

      this.messageQueue.push(resolve as (value: unknown) => void);
      this.ws.send(JSON.stringify(data));

      // Timeout after 30 seconds
      setTimeout(() => {
        const index = this.messageQueue.indexOf(resolve as (value: unknown) => void);
        if (index > -1) {
          this.messageQueue.splice(index, 1);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  close(): void {
    this.ws?.close();
  }
}
\`\`\`

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
    },
    {
      id: 4,
      title: 'Exercise 4: Error Handling with Async/Await',
      description: `Use try/catch to handle errors in async functions.

**Your task:**
1. Create a function \`fetchData\` that returns a rejected Promise with message "Network error"
2. Write an async function \`loadData\` that:
   - Tries to await fetchData()
   - Catches the error and logs "Error: " + error message
3. Call loadData()`,
      starterCode: `// Step 1: Create fetchData that returns a rejected Promise


// Step 2: Write async loadData with try/catch


// Step 3: Call loadData
`,
      solution: `function fetchData(): Promise<string> {
  return Promise.reject("Network error");
}

async function loadData(): Promise<void> {
  try {
    let data = await fetchData();
    console.log(data);
  } catch (error) {
    console.log("Error: " + error);
  }
}

loadData();`,
      expectedOutput: ['Error: Network error'],
      hints: [
        'Promise.reject("message") creates a rejected Promise',
        'Use try { await ... } catch (error) { ... }',
        'The catch block receives the rejection reason'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does the `await` keyword do?',
      options: [
        'Creates a new Promise',
        'Pauses execution until the Promise resolves and returns its value',
        'Runs code in parallel',
        'Converts a sync function to async'
      ],
      correctIndex: 1,
      explanation: 'await pauses the async function execution until the Promise settles, then returns the resolved value (or throws if rejected).'
    },
    {
      question: 'What does `Promise.all()` do when one Promise rejects?',
      options: [
        'Returns the successful results and ignores failures',
        'Waits for all Promises and returns mixed results',
        'Rejects immediately with that error',
        'Retries the failed Promise'
      ],
      correctIndex: 2,
      explanation: 'Promise.all() is "fail-fast" - if any Promise rejects, the entire Promise.all() immediately rejects with that error.'
    },
    {
      question: 'Where can you use the `await` keyword?',
      options: [
        'Anywhere in your code',
        'Only inside functions marked with `async`',
        'Only inside Promise callbacks',
        'Only at the top level of a module'
      ],
      correctIndex: 1,
      explanation: 'The await keyword can only be used inside async functions (or at the top level of ES modules).'
    },
    {
      question: 'What is the return type of an async function that returns a number?',
      options: [
        'number',
        'Promise<number>',
        'async number',
        'Awaited<number>'
      ],
      correctIndex: 1,
      explanation: 'Async functions always return a Promise. If you return a number, the actual return type is Promise<number>.'
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
