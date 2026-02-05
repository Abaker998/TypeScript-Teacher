import { Lesson } from '@/types/lesson';

export const errorHandling: Lesson = {
  slug: 'csharp-error-handling',
  title: 'Error Handling',
  description: 'Learn to handle errors gracefully with try/catch/finally and understand exception types in C#.',
  difficulty: 'beginner',
  order: 6,
  content: `
# Error Handling in C#

Errors happen. Good code handles them gracefully. C# provides structured exception handling with try/catch/finally.

## Try/Catch Basics

Wrap risky code in a try block, handle errors in catch:

\`\`\`csharp
try
{
    // Code that might throw an exception
    int result = 10 / 0;  // This throws DivideByZeroException
    Console.WriteLine(result);
}
catch (Exception ex)
{
    // Handle the error
    Console.WriteLine("Something went wrong: " + ex.Message);
}
\`\`\`

## Common Exception Types

C# has many built-in exception types:

\`\`\`csharp
// NullReferenceException - accessing null object
string name = null;
// int len = name.Length;  // Throws NullReferenceException

// ArgumentNullException - null argument to method
// void Process(string data) { if (data == null) throw new ArgumentNullException(nameof(data)); }

// ArgumentException - invalid argument
// if (age < 0) throw new ArgumentException("Age cannot be negative");

// InvalidOperationException - invalid state
// if (!isInitialized) throw new InvalidOperationException("Not initialized");

// IndexOutOfRangeException - array index out of bounds
int[] arr = { 1, 2, 3 };
// int x = arr[10];  // Throws IndexOutOfRangeException

// FormatException - invalid format
// int num = int.Parse("hello");  // Throws FormatException

// DivideByZeroException
// int result = 10 / 0;  // Throws DivideByZeroException
\`\`\`

## Catching Specific Exceptions

Handle different exceptions differently:

\`\`\`csharp
try
{
    string input = "hello";
    int number = int.Parse(input);
}
catch (FormatException)
{
    Console.WriteLine("Invalid number format");
}
catch (OverflowException)
{
    Console.WriteLine("Number too large or small");
}
catch (Exception ex)
{
    Console.WriteLine("Unexpected error: " + ex.Message);
}
\`\`\`

**Order matters!** Catch specific exceptions before general ones.

## The Finally Block

Code in \`finally\` runs whether or not an exception occurred:

\`\`\`csharp
try
{
    Console.WriteLine("Trying...");
    throw new Exception("Oops!");
}
catch (Exception)
{
    Console.WriteLine("Caught error!");
}
finally
{
    Console.WriteLine("This always runs");
}
// Output:
// Trying...
// Caught error!
// This always runs
\`\`\`

**Use finally for cleanup:** closing files, database connections, releasing resources.

## Throwing Exceptions

Use \`throw\` to signal something went wrong:

\`\`\`csharp
int Divide(int a, int b)
{
    if (b == 0)
    {
        throw new DivideByZeroException("Cannot divide by zero!");
    }
    return a / b;
}

try
{
    int result = Divide(10, 0);
}
catch (DivideByZeroException ex)
{
    Console.WriteLine(ex.Message);  // "Cannot divide by zero!"
}
\`\`\`

## Custom Exception Messages

Create descriptive error messages:

\`\`\`csharp
void ValidateAge(int age)
{
    if (age < 0)
    {
        throw new ArgumentException("Age cannot be negative", nameof(age));
    }
    if (age > 150)
    {
        throw new ArgumentException("Age seems unrealistic", nameof(age));
    }
    Console.WriteLine("Age is valid");
}
\`\`\`

## Creating Custom Exceptions

For domain-specific errors, create custom exception types:

\`\`\`csharp
public class InsufficientFundsException : Exception
{
    public decimal Balance { get; }
    public decimal AttemptedWithdrawal { get; }

    public InsufficientFundsException(decimal balance, decimal attempted)
        : base($"Insufficient funds. Balance: {balance}, Attempted: {attempted}")
    {
        Balance = balance;
        AttemptedWithdrawal = attempted;
    }
}

// Usage
void Withdraw(decimal amount)
{
    if (amount > balance)
    {
        throw new InsufficientFundsException(balance, amount);
    }
    balance -= amount;
}
\`\`\`

## Exception Filters (C# 6+)

Add conditions to catch blocks:

\`\`\`csharp
try
{
    // some operation
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    Console.WriteLine("Resource not found");
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.Unauthorized)
{
    Console.WriteLine("Not authorized");
}
catch (HttpRequestException ex)
{
    Console.WriteLine("HTTP error: " + ex.Message);
}
\`\`\`

## Re-throwing Exceptions

Sometimes you catch an exception, log it, and re-throw:

\`\`\`csharp
try
{
    // risky operation
}
catch (Exception ex)
{
    Console.WriteLine("Logging error: " + ex.Message);
    throw;  // Re-throw with original stack trace
}

// DON'T do this - loses stack trace:
// throw ex;  // Bad! Resets stack trace
\`\`\`

## The using Statement

For resources that need cleanup, use the \`using\` statement:

\`\`\`csharp
// Automatically disposes the StreamReader when done
using (StreamReader reader = new StreamReader("file.txt"))
{
    string content = reader.ReadToEnd();
    Console.WriteLine(content);
}  // reader is disposed here, even if an exception occurs

// Modern syntax (C# 8+)
using var reader = new StreamReader("file.txt");
string content = reader.ReadToEnd();
// disposed at end of scope
\`\`\`

## When to Use Exceptions

Use exceptions for:
- Invalid input that can't be processed
- External failures (network, file system, database)
- Programming errors that shouldn't happen

Avoid exceptions for:
- Normal control flow
- Expected conditions (use return values instead)
- Validation that users can fix

## The Result Pattern (Alternative)

Sometimes returning a result is better than throwing:

\`\`\`csharp
public class Result<T>
{
    public bool IsSuccess { get; }
    public T Value { get; }
    public string Error { get; }

    private Result(bool isSuccess, T value, string error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new Result<T>(true, value, null);
    public static Result<T> Failure(string error) => new Result<T>(false, default, error);
}

// Usage
Result<User> FindUser(int id)
{
    var user = database.Find(id);
    if (user == null)
        return Result<User>.Failure("User not found");
    return Result<User>.Success(user);
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use try/catch/finally to handle exceptions
- Throw exceptions with descriptive messages
- Catch specific exception types
- Understand when to use exceptions vs return values
- Use the using statement for resource cleanup
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Try/Catch',
      description: `Learn to catch exceptions with try/catch.

**Your task:**
1. In the try block, throw an exception with message "Something failed!"
2. In the catch block, print the exception message

**Try/catch syntax:**
\`\`\`
try
{
    throw new Exception("message");
}
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
}
\`\`\``,
      starterCode: `// Write a try/catch block:
// - In try: throw new Exception("Something failed!")
// - In catch: print the exception message

`,
      solution: `try
{
    throw new Exception("Something failed!");
}
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
}`,
      expectedOutput: ['Something failed!'],
      hints: [
        'try and catch go together: try { } catch (Exception ex) { }',
        'throw new Exception("Something failed!"); creates and throws an exception',
        'ex.Message gives you the exception text',
        'Console.WriteLine(ex.Message); prints the message'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Safe Division Method',
      description: `Create a method that throws an exception for invalid input.

**Your task:**
1. Create method \`SafeDivide(int a, int b)\` that returns a/b
2. If b is 0, throw a DivideByZeroException with message "Division by zero"
3. Call SafeDivide(10, 2) and print the result (should print 5)
4. Call SafeDivide(10, 0) inside try/catch and print the exception message`,
      starterCode: `// Create SafeDivide(int a, int b) - throw if b is 0


// Print SafeDivide(10, 2)


// Call SafeDivide(10, 0) in a try/catch and print the exception message

`,
      solution: `int SafeDivide(int a, int b)
{
    if (b == 0)
    {
        throw new DivideByZeroException("Division by zero");
    }
    return a / b;
}

Console.WriteLine(SafeDivide(10, 2));

try
{
    SafeDivide(10, 0);
}
catch (DivideByZeroException ex)
{
    Console.WriteLine(ex.Message);
}`,
      expectedOutput: ['5', 'Division by zero'],
      hints: [
        'Method: int SafeDivide(int a, int b) { ... }',
        'Check b == 0 first, throw if true',
        '10/2 = 5, prints normally',
        '10/0 throws, so catch it and print ex.Message'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Try/Catch/Finally',
      description: `The finally block ALWAYS runs, whether there's an exception or not.

**Your task:**
1. In try: print "Start", then throw an exception
2. In catch: print "Error caught"
3. In finally: print "Cleanup done"

**Expected output:** Start, Error caught, Cleanup done (in that order)`,
      starterCode: `// Write try/catch/finally:
// try: print "Start", then throw an exception
// catch: print "Error caught"
// finally: print "Cleanup done"

`,
      solution: `try
{
    Console.WriteLine("Start");
    throw new Exception("Oops");
}
catch (Exception)
{
    Console.WriteLine("Error caught");
}
finally
{
    Console.WriteLine("Cleanup done");
}`,
      expectedOutput: ['Start', 'Error caught', 'Cleanup done'],
      hints: [
        'try block: Console.WriteLine("Start"); then throw new Exception("Oops");',
        'catch block: Console.WriteLine("Error caught");',
        'finally block: Console.WriteLine("Cleanup done");',
        'finally ALWAYS runs, even after an exception is caught'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Validate Age Method',
      description: `Create a method that validates age and throws appropriate exceptions.

**Your task:**
1. Create method \`ValidateAge(int age)\` that:
   - Throws ArgumentException with "Age cannot be negative" if age < 0
   - Throws ArgumentException with "Age must be reasonable" if age > 150
   - Prints "Valid age: [age]" if the age is valid
2. Test with ValidateAge(25) - should print the valid message
3. Test with ValidateAge(-5) in try/catch - should print the exception message`,
      starterCode: `// Create ValidateAge method that validates the age
// Throw ArgumentException for invalid ages, print success for valid ages


// Test with a valid age (25)


// Test with invalid age (-5) in try/catch

`,
      solution: `void ValidateAge(int age)
{
    if (age < 0)
    {
        throw new ArgumentException("Age cannot be negative");
    }
    if (age > 150)
    {
        throw new ArgumentException("Age must be reasonable");
    }
    Console.WriteLine("Valid age: " + age);
}

ValidateAge(25);

try
{
    ValidateAge(-5);
}
catch (ArgumentException ex)
{
    Console.WriteLine(ex.Message);
}`,
      expectedOutput: ['Valid age: 25', 'Age cannot be negative'],
      hints: [
        'Check age < 0 first and throw ArgumentException',
        'Check age > 150 second and throw ArgumentException',
        'If neither condition is true, print the success message',
        'Wrap the invalid age call in try/catch to handle the exception'
      ]
    }
  ],
  quiz: [
    {
      question: 'What happens if code in the "finally" block throws an exception?',
      options: [
        'The original exception is still thrown',
        'Both exceptions are thrown',
        'The finally exception replaces the original exception',
        'The finally exception is silently ignored'
      ],
      correctIndex: 2,
      explanation: 'If finally throws, its exception replaces any previous exception. This is why you should avoid throwing in finally blocks.'
    },
    {
      question: 'What is the correct order to catch multiple exception types?',
      options: [
        'Any order is fine',
        'Most general (Exception) first',
        'Most specific first, then more general',
        'Alphabetical order'
      ],
      correctIndex: 2,
      explanation: 'Catch specific exceptions first, then more general ones. If you catch Exception first, the specific catches are unreachable.'
    },
    {
      question: 'What is the difference between "throw ex" and "throw" in a catch block?',
      options: [
        'They are identical',
        '"throw" preserves the stack trace, "throw ex" resets it',
        '"throw ex" preserves the stack trace, "throw" resets it',
        '"throw" is not valid syntax'
      ],
      correctIndex: 1,
      explanation: '"throw" re-throws the exception with its original stack trace. "throw ex" resets the stack trace, losing information about where the error originated.'
    },
    {
      question: 'What is the purpose of the "using" statement in C#?',
      options: [
        'To import namespaces',
        'To automatically dispose resources when done',
        'To catch exceptions',
        'To declare variables'
      ],
      correctIndex: 1,
      explanation: 'The using statement ensures that IDisposable objects are properly disposed, even if an exception occurs. It\'s commonly used for file handles, database connections, etc.'
    }
  ],
  buildNote: {
    title: 'Error Handling in C# Applications',
    explanation: `ASP.NET Core has built-in exception handling middleware that catches unhandled exceptions and returns appropriate HTTP responses. Controllers use try/catch for expected failures and let unexpected exceptions bubble up to the middleware. Entity Framework throws specific exceptions like DbUpdateException and DbUpdateConcurrencyException. The using statement is essential for database contexts, file streams, and HTTP clients. Custom exception types help distinguish between different error conditions and provide structured error information to API consumers.`,
    relatedFiles: [
      'Middleware/ExceptionHandlingMiddleware.cs',
      'Controllers/BaseController.cs',
      'Services/DataService.cs'
    ],
    inTheRealWorld: `Production C# applications use structured exception handling extensively. Global exception handlers log errors to services like Application Insights or Sentry. API endpoints return structured error responses with status codes. Database operations use transactions that automatically rollback on exception. The Result pattern and libraries like FluentResults provide an alternative to exceptions for expected failures. ASP.NET Core's ProblemDetails standard provides a consistent format for API error responses.`
  }
};
