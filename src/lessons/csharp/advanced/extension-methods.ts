import { Lesson } from '@/types/lesson';

export const extensionMethods: Lesson = {
  slug: 'csharp-extension-methods',
  title: 'Extension Methods',
  description: 'Learn to add new methods to existing types without modifying their source code using C# extension methods.',
  difficulty: 'advanced',
  order: 23,
  content: `
# C# Extension Methods

Extension methods let you add new methods to existing types without modifying their source code or creating derived types. They're the foundation of LINQ and widely used throughout .NET.

## Basic Syntax

Extension methods are static methods in static classes, with the first parameter marked with \`this\`:

\`\`\`csharp
public static class StringExtensions
{
    // Extension method for string type
    public static bool IsNullOrEmpty(this string? str)
    {
        return string.IsNullOrEmpty(str);
    }

    public static string Reverse(this string str)
    {
        char[] chars = str.ToCharArray();
        Array.Reverse(chars);
        return new string(chars);
    }
}

// Usage - looks like instance methods!
string name = "Hello";
Console.WriteLine(name.IsNullOrEmpty());  // False
Console.WriteLine(name.Reverse());         // olleH

string? empty = null;
Console.WriteLine(empty.IsNullOrEmpty()); // True
\`\`\`

## Rules and Requirements

\`\`\`csharp
// 1. Must be in a static class
public static class MyExtensions
{
    // 2. Must be a static method
    // 3. First parameter must have 'this' modifier
    public static int WordCount(this string str)
    {
        return str.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
    }
}

// 4. Must be in scope (using directive or same namespace)
// 5. Instance methods take precedence over extension methods
// 6. Cannot access private members of the extended type
\`\`\`

## Extending Different Types

Extension methods can extend any type:

\`\`\`csharp
// Extend IEnumerable<T>
public static class EnumerableExtensions
{
    public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
    {
        foreach (T item in source)
            action(item);
    }

    public static bool IsEmpty<T>(this IEnumerable<T> source)
    {
        return !source.Any();
    }
}

// Extend int
public static class IntExtensions
{
    public static bool IsEven(this int number) => number % 2 == 0;
    public static bool IsOdd(this int number) => number % 2 != 0;
    public static int Square(this int number) => number * number;
}

// Extend DateTime
public static class DateTimeExtensions
{
    public static bool IsWeekend(this DateTime date)
    {
        return date.DayOfWeek == DayOfWeek.Saturday ||
               date.DayOfWeek == DayOfWeek.Sunday;
    }

    public static int Age(this DateTime birthDate)
    {
        var today = DateTime.Today;
        int age = today.Year - birthDate.Year;
        if (birthDate.Date > today.AddYears(-age)) age--;
        return age;
    }
}

// Usage
var numbers = new[] { 1, 2, 3, 4, 5 };
numbers.ForEach(n => Console.WriteLine(n));  // Prints 1-5
Console.WriteLine(numbers.IsEmpty());         // False

Console.WriteLine(42.IsEven());               // True
Console.WriteLine(7.Square());                // 49

var birthday = new DateTime(1990, 6, 15);
Console.WriteLine(birthday.IsWeekend());      // False
\`\`\`

## Generic Extension Methods

Create reusable extension methods with generics:

\`\`\`csharp
public static class GenericExtensions
{
    // Works with any type
    public static T? NullIf<T>(this T value, T comparand) where T : class
    {
        return EqualityComparer<T>.Default.Equals(value, comparand) ? null : value;
    }

    // Collection extensions
    public static T? FirstOrNull<T>(this IEnumerable<T> source) where T : struct
    {
        foreach (T item in source)
            return item;
        return null;
    }

    // Chaining support
    public static T Dump<T>(this T obj, string? label = null)
    {
        Console.WriteLine(label != null ? $"{label}: {obj}" : obj?.ToString());
        return obj;  // Return same object for chaining
    }
}

// Usage
string? result = "".NullIf("");  // null
int? first = new int[] { }.FirstOrNull();  // null

// Chaining
var processed = "hello"
    .Dump("Original")     // Original: hello
    .ToUpper()
    .Dump("Upper")        // Upper: HELLO
    .Reverse()
    .Dump("Reversed");    // Reversed: OLLEH
\`\`\`

## LINQ is Extension Methods

LINQ is built entirely on extension methods:

\`\`\`csharp
// These familiar LINQ methods are all extension methods!
var numbers = new[] { 1, 2, 3, 4, 5 };

// Where, Select, OrderBy, etc. are extensions on IEnumerable<T>
var evens = numbers
    .Where(n => n % 2 == 0)      // Extension method
    .Select(n => n * 10)          // Extension method
    .OrderByDescending(n => n)    // Extension method
    .ToList();                    // Extension method

// You can call them as static methods too
var evens2 = Enumerable.Where(numbers, n => n % 2 == 0);

// Create your own LINQ-style extensions
public static class MyLinqExtensions
{
    public static IEnumerable<T> WhereNot<T>(
        this IEnumerable<T> source,
        Func<T, bool> predicate)
    {
        return source.Where(x => !predicate(x));
    }

    public static IEnumerable<T> TakeLast<T>(
        this IEnumerable<T> source,
        int count)
    {
        return source.Skip(Math.Max(0, source.Count() - count));
    }
}

// Usage
var notEvens = numbers.WhereNot(n => n % 2 == 0);  // 1, 3, 5
var lastTwo = numbers.TakeLast(2);                  // 4, 5
\`\`\`

## Extending Interfaces

Extending interfaces adds methods to all implementing types:

\`\`\`csharp
public interface IEntity
{
    int Id { get; }
    DateTime CreatedAt { get; }
}

public static class EntityExtensions
{
    public static bool IsNew(this IEntity entity)
    {
        return entity.Id == 0;
    }

    public static TimeSpan Age(this IEntity entity)
    {
        return DateTime.UtcNow - entity.CreatedAt;
    }

    public static string Summary(this IEntity entity)
    {
        return $"Entity {entity.Id} created {entity.Age().Days} days ago";
    }
}

// All IEntity implementations get these methods
public class User : IEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Name { get; set; } = "";
}

var user = new User { Id = 1, CreatedAt = DateTime.UtcNow.AddDays(-30), Name = "Alice" };
Console.WriteLine(user.IsNew());    // False
Console.WriteLine(user.Summary());  // Entity 1 created 30 days ago
\`\`\`

## Builder Pattern with Extension Methods

Create fluent APIs using extension methods:

\`\`\`csharp
public class EmailMessage
{
    public string To { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Body { get; set; } = "";
    public bool IsHtml { get; set; }
    public List<string> Attachments { get; set; } = new();
}

public static class EmailBuilderExtensions
{
    public static EmailMessage To(this EmailMessage email, string address)
    {
        email.To = address;
        return email;
    }

    public static EmailMessage WithSubject(this EmailMessage email, string subject)
    {
        email.Subject = subject;
        return email;
    }

    public static EmailMessage WithBody(this EmailMessage email, string body, bool isHtml = false)
    {
        email.Body = body;
        email.IsHtml = isHtml;
        return email;
    }

    public static EmailMessage Attach(this EmailMessage email, string path)
    {
        email.Attachments.Add(path);
        return email;
    }
}

// Fluent usage
var email = new EmailMessage()
    .To("user@example.com")
    .WithSubject("Hello!")
    .WithBody("<h1>Welcome</h1>", isHtml: true)
    .Attach("report.pdf");
\`\`\`

## Practical Examples

\`\`\`csharp
// String utilities
public static class StringUtilities
{
    public static string Truncate(this string str, int maxLength, string suffix = "...")
    {
        if (str.Length <= maxLength) return str;
        return str.Substring(0, maxLength - suffix.Length) + suffix;
    }

    public static string ToSlug(this string str)
    {
        return str.ToLower()
            .Replace(" ", "-")
            .Replace("--", "-");
    }

    public static string Repeat(this string str, int count)
    {
        return string.Concat(Enumerable.Repeat(str, count));
    }
}

// Dictionary utilities
public static class DictionaryExtensions
{
    public static TValue GetOrAdd<TKey, TValue>(
        this Dictionary<TKey, TValue> dict,
        TKey key,
        Func<TValue> factory) where TKey : notnull
    {
        if (!dict.TryGetValue(key, out TValue? value))
        {
            value = factory();
            dict[key] = value;
        }
        return value;
    }

    public static TValue? GetValueOrDefault<TKey, TValue>(
        this Dictionary<TKey, TValue> dict,
        TKey key,
        TValue? defaultValue = default) where TKey : notnull
    {
        return dict.TryGetValue(key, out TValue? value) ? value : defaultValue;
    }
}

// Usage
Console.WriteLine("Hello World".Truncate(8));  // Hello...
Console.WriteLine("My Blog Post".ToSlug());    // my-blog-post
Console.WriteLine("*".Repeat(5));              // *****

var cache = new Dictionary<string, List<int>>();
var list = cache.GetOrAdd("numbers", () => new List<int>());
list.Add(42);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create extension methods for any type
- Understand the rules and limitations of extension methods
- Build fluent APIs using method chaining
- Extend interfaces to add functionality to all implementations
- Create LINQ-style extension methods for collections
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic String Extension',
      description: `Create an extension method that counts words in a string.

**Your task:**
1. Create a static class \`StringExtensions\`
2. Add a \`WordCount\` extension method for string
3. Split by spaces and count non-empty entries
4. Test with a sample sentence

**Remember:** Extension methods must be in a static class and the first parameter needs \`this\`.`,
      starterCode: `using System;

// Step 1-2: Create static class with WordCount extension


// Step 3-4: Test the extension method

`,
      solution: `using System;

public static class StringExtensions
{
    public static int WordCount(this string str)
    {
        if (string.IsNullOrWhiteSpace(str)) return 0;
        return str.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
    }
}

string sentence = "The quick brown fox jumps over the lazy dog";
Console.WriteLine($"Word count: {sentence.WordCount()}");

string empty = "   ";
Console.WriteLine($"Empty string words: {empty.WordCount()}");`,
      expectedOutput: [
        'Word count: 9',
        'Empty string words: 0'
      ],
      hints: [
        'The class must be public static',
        'The method must be public static with this string as first param',
        'Use StringSplitOptions.RemoveEmptyEntries to ignore multiple spaces',
        'Handle null/whitespace strings gracefully'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Generic Collection Extension',
      description: `Create an extension method that gets a random element from a collection.

**Your task:**
1. Create a static class for your extension
2. Add a \`Random<T>\` extension method for IList<T>
3. Use System.Random to pick a random index
4. Test with an array of names

**Key:** Generic extension methods use <T> after the method name.`,
      starterCode: `using System;
using System.Collections.Generic;

// Step 1-2: Create extension class with Random<T> method


// Step 3-4: Test with sample data

`,
      solution: `using System;
using System.Collections.Generic;

public static class CollectionExtensions
{
    private static readonly Random _random = new Random();

    public static T RandomElement<T>(this IList<T> list)
    {
        if (list.Count == 0)
            throw new InvalidOperationException("List is empty");
        return list[_random.Next(list.Count)];
    }
}

var names = new[] { "Alice", "Bob", "Charlie", "Diana" };
Console.WriteLine($"Random name: {names.RandomElement()}");
Console.WriteLine($"Random name: {names.RandomElement()}");

var numbers = new List<int> { 10, 20, 30, 40, 50 };
Console.WriteLine($"Random number: {numbers.RandomElement()}");`,
      expectedOutput: [
        'Random name: *',
        'Random name: *',
        'Random number: *'
      ],
      hints: [
        'Use IList<T> to support both arrays and List<T>',
        'Random.Next(count) returns 0 to count-1',
        'Consider making Random static to avoid repeated instantiation',
        'Handle empty collections with an exception'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Fluent Builder Extensions',
      description: `Create fluent extension methods for configuring an object.

**Your task:**
1. Create a \`ConnectionConfig\` class with Host, Port, and Timeout properties
2. Create extension methods: WithHost, WithPort, WithTimeout
3. Each method should return the config for chaining
4. Build a connection config using the fluent API

**Pattern:** Return \`this\` from each method to enable chaining.`,
      starterCode: `using System;

// Step 1: Create ConnectionConfig class


// Step 2: Create fluent extension methods


// Step 3-4: Build a config using chaining

`,
      solution: `using System;

public class ConnectionConfig
{
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 80;
    public int Timeout { get; set; } = 30;

    public override string ToString() =>
        $"Host: {Host}, Port: {Port}, Timeout: {Timeout}s";
}

public static class ConnectionConfigExtensions
{
    public static ConnectionConfig WithHost(this ConnectionConfig config, string host)
    {
        config.Host = host;
        return config;
    }

    public static ConnectionConfig WithPort(this ConnectionConfig config, int port)
    {
        config.Port = port;
        return config;
    }

    public static ConnectionConfig WithTimeout(this ConnectionConfig config, int seconds)
    {
        config.Timeout = seconds;
        return config;
    }
}

var config = new ConnectionConfig()
    .WithHost("api.example.com")
    .WithPort(443)
    .WithTimeout(60);

Console.WriteLine(config);`,
      expectedOutput: [
        'Host: api.example.com, Port: 443, Timeout: 60s'
      ],
      hints: [
        'Each extension method returns ConnectionConfig',
        'Set the property then return the config parameter',
        'Override ToString for easy printing',
        'Start with new ConnectionConfig() then chain methods'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is required to create an extension method?',
      options: [
        'A virtual method in the base class',
        'A static method in a static class with the first parameter marked with "this"',
        'An interface implementation',
        'A partial class'
      ],
      correctIndex: 1,
      explanation: 'Extension methods must be defined as static methods in a static class, and the first parameter must have the "this" modifier to indicate which type is being extended.'
    },
    {
      question: 'What happens if an instance method with the same signature as an extension method exists?',
      options: [
        'Compilation error due to ambiguity',
        'The extension method takes precedence',
        'The instance method takes precedence',
        'Both methods are called'
      ],
      correctIndex: 2,
      explanation: 'Instance methods always take precedence over extension methods. Extension methods are only called when no matching instance method exists.'
    },
    {
      question: 'How is LINQ implemented?',
      options: [
        'As special compiler syntax',
        'As extension methods on IEnumerable<T>',
        'As virtual methods in a base class',
        'As partial classes'
      ],
      correctIndex: 1,
      explanation: 'LINQ methods like Where, Select, OrderBy, etc. are all extension methods defined on IEnumerable<T> in the System.Linq namespace.'
    },
    {
      question: 'Can extension methods access private members of the extended type?',
      options: [
        'Yes, they have full access',
        'Yes, but only protected members',
        'No, they can only access public members',
        'Only if they are in the same assembly'
      ],
      correctIndex: 2,
      explanation: 'Extension methods can only access public members of the extended type. They are essentially syntactic sugar for static method calls and have no special access privileges.'
    }
  ],
  buildNote: {
    title: 'Extension Methods in .NET Ecosystem',
    explanation: `Extension methods are fundamental to modern C# development. LINQ is built entirely on extension methods, and many libraries provide extensions for common types. They enable fluent APIs and allow adding functionality to types you don't control (like framework types or third-party libraries) without inheritance.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/codeRunner.ts'
    ],
    inTheRealWorld: `Every .NET project uses extension methods through LINQ. Libraries like FluentValidation, Polly, and AutoMapper use them for fluent configuration. ASP.NET Core's startup configuration uses extension methods extensively (AddControllers, UseRouting, etc.). Creating good extension methods is a key skill for building clean, readable APIs.`
  }
};
