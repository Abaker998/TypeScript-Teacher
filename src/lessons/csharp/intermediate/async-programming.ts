import { Lesson } from '@/types/lesson';

export const csharpAsyncProgramming: Lesson = {
  slug: 'csharp-async-programming',
  title: 'Async Programming',
  description: 'Master async/await, Task, and asynchronous patterns in C#.',
  difficulty: 'intermediate',
  order: 19,
  content: `
# Async Programming in C#

Asynchronous programming lets your application remain responsive while waiting for long-running operations like I/O, network requests, or database queries.

## Task and Task<T>

\`\`\`csharp
// Task - async operation with no return value
Task DoSomethingAsync() { ... }

// Task<T> - async operation that returns T
Task<string> GetDataAsync() { ... }

// ValueTask<T> - optimized for hot paths
ValueTask<int> GetCachedValueAsync() { ... }
\`\`\`

## Basic async/await

\`\`\`csharp
public async Task<string> FetchDataAsync()
{
    // await pauses until the task completes
    string result = await httpClient.GetStringAsync("https://api.example.com/data");
    return result;
}

// Calling async method
public async Task ProcessAsync()
{
    string data = await FetchDataAsync();
    Console.WriteLine(data);
}
\`\`\`

## Async Method Patterns

\`\`\`csharp
// Async void - only for event handlers!
private async void Button_Click(object sender, EventArgs e)
{
    await DoWorkAsync();
}

// Async Task - for methods that don't return a value
public async Task SaveDataAsync(string data)
{
    await File.WriteAllTextAsync("file.txt", data);
}

// Async Task<T> - for methods that return a value
public async Task<User> GetUserAsync(int id)
{
    var response = await httpClient.GetAsync($"/users/{id}");
    return await response.Content.ReadFromJsonAsync<User>();
}
\`\`\`

## Creating Tasks

\`\`\`csharp
// Task.Run - run CPU-bound work on thread pool
Task<int> task = Task.Run(() => ComputeExpensiveValue());

// Task.FromResult - create completed task with value
Task<int> completed = Task.FromResult(42);

// Task.CompletedTask - completed task with no value
Task done = Task.CompletedTask;

// Task.Delay - wait without blocking
await Task.Delay(1000);  // Wait 1 second
\`\`\`

## Parallel Execution

\`\`\`csharp
// Wait for all tasks (parallel)
var task1 = GetUserAsync(1);
var task2 = GetUserAsync(2);
var task3 = GetUserAsync(3);

User[] users = await Task.WhenAll(task1, task2, task3);

// Wait for first to complete
Task<User> firstComplete = await Task.WhenAny(task1, task2, task3);
User first = await firstComplete;
\`\`\`

## Exception Handling

\`\`\`csharp
public async Task ProcessAsync()
{
    try
    {
        await RiskyOperationAsync();
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"Network error: {ex.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Unexpected error: {ex.Message}");
    }
    finally
    {
        // Cleanup code
    }
}

// Handling multiple task exceptions
try
{
    await Task.WhenAll(task1, task2, task3);
}
catch (Exception)
{
    // Task.WhenAll throws first exception
    // Access all via tasks
    foreach (var task in new[] { task1, task2, task3 })
    {
        if (task.IsFaulted)
        {
            Console.WriteLine(task.Exception?.InnerException?.Message);
        }
    }
}
\`\`\`

## Cancellation

\`\`\`csharp
public async Task<string> DownloadAsync(CancellationToken cancellationToken)
{
    // Pass token to async operations
    var response = await httpClient.GetAsync(url, cancellationToken);

    // Check for cancellation
    cancellationToken.ThrowIfCancellationRequested();

    return await response.Content.ReadAsStringAsync(cancellationToken);
}

// Using cancellation
var cts = new CancellationTokenSource();

// Cancel after timeout
cts.CancelAfter(TimeSpan.FromSeconds(30));

try
{
    var result = await DownloadAsync(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Operation was cancelled");
}
\`\`\`

## ConfigureAwait

\`\`\`csharp
// UI app - return to UI thread
await SomeOperationAsync();  // Returns to original context

// Library code - don't capture context
await SomeOperationAsync().ConfigureAwait(false);

// General rule:
// - UI code: use default (capture context)
// - Library code: use ConfigureAwait(false)
\`\`\`

## Async Streams (C# 8+)

\`\`\`csharp
// Produce values asynchronously
public async IAsyncEnumerable<int> GenerateNumbersAsync()
{
    for (int i = 0; i < 10; i++)
    {
        await Task.Delay(100);
        yield return i;
    }
}

// Consume async stream
await foreach (var number in GenerateNumbersAsync())
{
    Console.WriteLine(number);
}
\`\`\`

## Async Disposal

\`\`\`csharp
public class AsyncResource : IAsyncDisposable
{
    public async ValueTask DisposeAsync()
    {
        await CleanupAsync();
    }
}

// Using with await using
await using var resource = new AsyncResource();
await resource.DoWorkAsync();
// DisposeAsync called automatically
\`\`\`

## Common Patterns

### Retry Pattern

\`\`\`csharp
public async Task<T> WithRetryAsync<T>(
    Func<Task<T>> operation,
    int maxRetries = 3,
    int delayMs = 1000)
{
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            return await operation();
        }
        catch (Exception) when (i < maxRetries - 1)
        {
            await Task.Delay(delayMs * (i + 1));
        }
    }
    throw new Exception("Max retries exceeded");
}

// Usage
var result = await WithRetryAsync(() => FetchDataAsync());
\`\`\`

### Timeout Pattern

\`\`\`csharp
public async Task<T> WithTimeoutAsync<T>(
    Task<T> task,
    TimeSpan timeout)
{
    using var cts = new CancellationTokenSource();
    var delayTask = Task.Delay(timeout, cts.Token);

    var completedTask = await Task.WhenAny(task, delayTask);

    if (completedTask == delayTask)
    {
        throw new TimeoutException();
    }

    cts.Cancel();  // Cancel the delay
    return await task;
}
\`\`\`

### Semaphore for Throttling

\`\`\`csharp
private readonly SemaphoreSlim _semaphore = new(10);  // Max 10 concurrent

public async Task ProcessAllAsync(IEnumerable<string> items)
{
    var tasks = items.Select(async item =>
    {
        await _semaphore.WaitAsync();
        try
        {
            await ProcessItemAsync(item);
        }
        finally
        {
            _semaphore.Release();
        }
    });

    await Task.WhenAll(tasks);
}
\`\`\`

## Common Mistakes

\`\`\`csharp
// DON'T: Use async void (except event handlers)
public async void BadMethod() { }  // Exceptions are lost!

// DO: Return Task
public async Task GoodMethod() { }

// DON'T: Block on async code (deadlock risk!)
var result = GetDataAsync().Result;  // Blocks!

// DO: Await properly
var result = await GetDataAsync();

// DON'T: Forget to await
public async Task BadAsync()
{
    DoWorkAsync();  // Fire and forget - lost!
}

// DO: Always await
public async Task GoodAsync()
{
    await DoWorkAsync();
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use async/await for non-blocking operations
- Handle exceptions in async code
- Implement cancellation patterns
- Run tasks in parallel with Task.WhenAll
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Async Method',
      description: `Create an async method that simulates a delay.

**Your task:**
1. Create an async method \`DelayedMessageAsync\` that takes a message and delay
2. Wait for the specified milliseconds
3. Return the message
4. Call it and print the result`,
      starterCode: `// Step 1-3: Create DelayedMessageAsync method


// Step 4: Call and print

`,
      solution: `async Task<string> DelayedMessageAsync(string message, int delayMs)
{
    await Task.Delay(delayMs);
    return message;
}

async Task Main()
{
    string result = await DelayedMessageAsync("Hello!", 1000);
    Console.WriteLine(result);
}

await Main();`,
      expectedOutput: ['Hello!'],
      hints: [
        'Use Task.Delay(ms) to wait',
        'Return type is Task<string>',
        'Use await when calling the method'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Parallel Tasks',
      description: `Run multiple tasks in parallel.

**Your task:**
1. Create an async method that returns a number after a delay
2. Start three tasks with values 10, 20, 30 (different delays)
3. Use Task.WhenAll to wait for all
4. Print the sum of all results`,
      starterCode: `// Step 1: Create the async method


// Step 2-4: Start tasks, wait, and sum

`,
      solution: `async Task<int> GetNumberAsync(int value, int delayMs)
{
    await Task.Delay(delayMs);
    return value;
}

async Task Main()
{
    var task1 = GetNumberAsync(10, 100);
    var task2 = GetNumberAsync(20, 200);
    var task3 = GetNumberAsync(30, 300);

    int[] results = await Task.WhenAll(task1, task2, task3);
    int sum = results.Sum();
    Console.WriteLine(sum);
}

await Main();`,
      expectedOutput: ['60'],
      hints: [
        'Don\'t await when starting tasks',
        'Task.WhenAll returns an array',
        'Use .Sum() on the results'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Exception Handling',
      description: `Handle exceptions in async code.

**Your task:**
1. Create an async method that throws an exception after a delay
2. Call it in a try-catch block
3. Print "Error: " + the exception message
4. Add a finally block that prints "Cleanup complete"`,
      starterCode: `// Step 1: Create throwing async method


// Step 2-4: Call with try-catch-finally

`,
      solution: `async Task RiskyOperationAsync()
{
    await Task.Delay(100);
    throw new InvalidOperationException("Something went wrong");
}

async Task Main()
{
    try
    {
        await RiskyOperationAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
    finally
    {
        Console.WriteLine("Cleanup complete");
    }
}

await Main();`,
      expectedOutput: ['Error: Something went wrong', 'Cleanup complete'],
      hints: [
        'throw new InvalidOperationException("message")',
        'Catch Exception ex to catch all',
        'finally always runs'
      ],
    }
  ],
  quiz: [
    {
      question: 'What does the "await" keyword do?',
      options: [
        'Creates a new thread',
        'Blocks the current thread',
        'Pauses execution until the task completes, without blocking',
        'Cancels the operation'
      ],
      correctIndex: 2,
      explanation: 'await asynchronously waits for a task to complete. It releases the thread to do other work while waiting.'
    },
    {
      question: 'Why should you avoid async void methods?',
      options: [
        'They are slower',
        'Exceptions cannot be caught and propagate unexpectedly',
        'They don\'t work with await',
        'They use more memory'
      ],
      correctIndex: 1,
      explanation: 'async void methods cannot be awaited, so exceptions escape and crash the application. Use async Task instead.'
    },
    {
      question: 'What does Task.WhenAll do?',
      options: [
        'Runs tasks one after another',
        'Runs all tasks in parallel and waits for all to complete',
        'Cancels all tasks',
        'Returns the first completed task'
      ],
      correctIndex: 1,
      explanation: 'Task.WhenAll runs tasks concurrently and returns when ALL tasks complete. It returns an array of results.'
    },
    {
      question: 'What is the purpose of CancellationToken?',
      options: [
        'To speed up operations',
        'To allow cooperative cancellation of async operations',
        'To retry failed operations',
        'To run tasks in parallel'
      ],
      correctIndex: 1,
      explanation: 'CancellationToken enables cooperative cancellation - async methods check it and throw OperationCanceledException when cancelled.'
    }
  ],
  buildNote: {
    title: 'Async Programming in C# Applications',
    explanation: `Async programming is fundamental to modern C#. ASP.NET Core is built on async - controllers, middleware, and database access all use async/await. Entity Framework Core provides async methods for all database operations. HttpClient is async-first. Understanding async patterns is essential for building scalable, responsive applications.`,
    relatedFiles: [
      'src/hooks/useProgress.ts'
    ],
    inTheRealWorld: `Production C# applications are heavily async. ASP.NET Core handles requests asynchronously for scalability. Database access through Entity Framework uses async methods. HTTP calls use HttpClient with async. Background services use async for processing. Libraries like Polly provide async resilience patterns. Proper async usage is critical for application performance and scalability.`
  }
};
