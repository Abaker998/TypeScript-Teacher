import { Lesson } from '@/types/lesson';

export const csharpEnumsAndNamespaces: Lesson = {
  slug: 'csharp-enums-namespaces',
  title: 'Enums & Namespaces',
  description: 'Use enums for named constants and namespaces to organize your code.',
  difficulty: 'intermediate',
  order: 16,
  content: `
# Enums & Namespaces

Enums provide named constants for fixed sets of values. Namespaces organize code into logical groups.

## Basic Enum

\`\`\`csharp
public enum DayOfWeek
{
    Sunday,    // 0
    Monday,    // 1
    Tuesday,   // 2
    Wednesday, // 3
    Thursday,  // 4
    Friday,    // 5
    Saturday   // 6
}

DayOfWeek today = DayOfWeek.Wednesday;
Console.WriteLine(today);        // "Wednesday"
Console.WriteLine((int)today);   // 3
\`\`\`

## Explicit Values

\`\`\`csharp
public enum HttpStatusCode
{
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    InternalServerError = 500
}

HttpStatusCode status = HttpStatusCode.OK;
Console.WriteLine((int)status);  // 200
\`\`\`

## Flags Enum

Use \`[Flags]\` for bit fields that can be combined:

\`\`\`csharp
[Flags]
public enum Permissions
{
    None = 0,
    Read = 1,        // 0001
    Write = 2,       // 0010
    Execute = 4,     // 0100
    Delete = 8,      // 1000
    All = Read | Write | Execute | Delete
}

Permissions userPerms = Permissions.Read | Permissions.Write;
Console.WriteLine(userPerms);  // "Read, Write"

// Check for specific permission
bool canRead = (userPerms & Permissions.Read) != 0;
// Or use HasFlag
bool canWrite = userPerms.HasFlag(Permissions.Write);
\`\`\`

## Enum Methods

\`\`\`csharp
public enum Color { Red, Green, Blue }

// Get all values
Color[] colors = Enum.GetValues<Color>();

// Get all names
string[] names = Enum.GetNames<Color>();

// Parse from string
Color red = Enum.Parse<Color>("Red");

// Try parse (safe)
if (Enum.TryParse<Color>("Green", out Color color))
{
    Console.WriteLine($"Parsed: {color}");
}

// Check if value is defined
bool exists = Enum.IsDefined(typeof(Color), "Blue");
\`\`\`

## Enum with Switch

\`\`\`csharp
public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

string GetStatusMessage(OrderStatus status) => status switch
{
    OrderStatus.Pending => "Your order is pending",
    OrderStatus.Processing => "Your order is being processed",
    OrderStatus.Shipped => "Your order has shipped",
    OrderStatus.Delivered => "Your order was delivered",
    OrderStatus.Cancelled => "Your order was cancelled",
    _ => "Unknown status"
};
\`\`\`

## Enum Extension Methods

\`\`\`csharp
public static class OrderStatusExtensions
{
    public static string ToFriendlyString(this OrderStatus status) => status switch
    {
        OrderStatus.Pending => "Awaiting Confirmation",
        OrderStatus.Processing => "Being Prepared",
        _ => status.ToString()
    };

    public static bool IsComplete(this OrderStatus status) =>
        status is OrderStatus.Delivered or OrderStatus.Cancelled;
}

OrderStatus status = OrderStatus.Processing;
Console.WriteLine(status.ToFriendlyString());  // "Being Prepared"
\`\`\`

## Namespaces

Organize code into logical groups:

\`\`\`csharp
namespace MyCompany.MyApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}

namespace MyCompany.MyApp.Services
{
    public class UserService
    {
        public Models.User GetUser(int id) { ... }
    }
}
\`\`\`

## File-Scoped Namespaces (C# 10+)

\`\`\`csharp
// Entire file belongs to this namespace
namespace MyCompany.MyApp.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
}
\`\`\`

## Using Directives

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

// Alias for long namespace
using Models = MyCompany.MyApp.Data.Models;

// Static import
using static System.Math;
using static System.Console;

// Now can use without prefix
double result = Sqrt(16);  // Instead of Math.Sqrt
WriteLine("Hello");        // Instead of Console.WriteLine
\`\`\`

## Global Usings (C# 10+)

\`\`\`csharp
// GlobalUsings.cs - applies to entire project
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using Microsoft.Extensions.Logging;

// No need to repeat in every file
\`\`\`

## Namespace Best Practices

\`\`\`csharp
// Follow convention: Company.Product.Feature
namespace Contoso.Ecommerce.Orders;

// Match folder structure to namespace
// src/
//   Contoso.Ecommerce/
//     Orders/
//       Order.cs           -> Contoso.Ecommerce.Orders
//       OrderService.cs    -> Contoso.Ecommerce.Orders
//     Products/
//       Product.cs         -> Contoso.Ecommerce.Products
\`\`\`

## Nested Types

Types can be nested within other types:

\`\`\`csharp
public class Order
{
    public int Id { get; set; }
    public OrderStatus Status { get; set; }
    public List<OrderItem> Items { get; set; }

    // Nested enum
    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Shipped
    }

    // Nested class
    public class OrderItem
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
    }
}

// Usage
Order.OrderStatus status = Order.OrderStatus.Pending;
Order.OrderItem item = new Order.OrderItem();
\`\`\`

## Avoiding Naming Conflicts

\`\`\`csharp
// When two namespaces have same type name
using WinTimer = System.Windows.Forms.Timer;
using ThreadTimer = System.Threading.Timer;

// Or use full qualification
System.Windows.Forms.Timer uiTimer = new();
System.Threading.Timer bgTimer = new(callback, null, 0, 1000);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create and use enums for named constants
- Use flags enums for bit fields
- Organize code with namespaces
- Apply using directives and global usings
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Enum',
      description: `Create an enum for traffic light colors.

**Your task:**
1. Create an enum \`TrafficLight\` with Red, Yellow, Green
2. Create a method that returns the action for each light:
   - Red: "Stop"
   - Yellow: "Caution"
   - Green: "Go"
3. Test with all three values`,
      starterCode: `// Step 1: Create TrafficLight enum


// Step 2: Create GetAction method


// Step 3: Test all values

`,
      solution: `public enum TrafficLight
{
    Red,
    Yellow,
    Green
}

string GetAction(TrafficLight light) => light switch
{
    TrafficLight.Red => "Stop",
    TrafficLight.Yellow => "Caution",
    TrafficLight.Green => "Go",
    _ => "Unknown"
};

Console.WriteLine(GetAction(TrafficLight.Red));
Console.WriteLine(GetAction(TrafficLight.Yellow));
Console.WriteLine(GetAction(TrafficLight.Green));`,
      expectedOutput: ['Stop', 'Caution', 'Go'],
      hints: [
        'Enum syntax: public enum Name { Value1, Value2 }',
        'Access with EnumName.Value',
        'Switch expression works well with enums'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Enum with Values',
      description: `Create an enum with explicit numeric values.

**Your task:**
1. Create a \`Priority\` enum with:
   - Low = 1
   - Medium = 5
   - High = 10
   - Critical = 20
2. Print each priority name and its numeric value`,
      starterCode: `// Step 1: Create Priority enum with values


// Step 2: Print names and values

`,
      solution: `public enum Priority
{
    Low = 1,
    Medium = 5,
    High = 10,
    Critical = 20
}

foreach (Priority p in Enum.GetValues<Priority>())
{
    Console.WriteLine($"{p}: {(int)p}");
}`,
      expectedOutput: ['Low: 1', 'Medium: 5', 'High: 10', 'Critical: 20'],
      hints: [
        'Assign values: Value = number',
        'Enum.GetValues<T>() returns all values',
        'Cast to int: (int)enumValue'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Flags Enum',
      description: `Create a flags enum for file access modes.

**Your task:**
1. Create a \`[Flags]\` enum \`FileAccess\` with:
   - None = 0
   - Read = 1
   - Write = 2
   - Execute = 4
2. Create a variable with Read and Write permissions combined
3. Check if it has Write permission using HasFlag
4. Print the combined permission and the check result`,
      starterCode: `// Step 1: Create FileAccess flags enum


// Step 2: Create combined permission


// Step 3: Check for Write permission


// Step 4: Print results

`,
      solution: `[Flags]
public enum FileAccess
{
    None = 0,
    Read = 1,
    Write = 2,
    Execute = 4
}

FileAccess myAccess = FileAccess.Read | FileAccess.Write;
bool canWrite = myAccess.HasFlag(FileAccess.Write);

Console.WriteLine(myAccess);
Console.WriteLine(canWrite);`,
      expectedOutput: ['Read, Write', 'True'],
      hints: [
        'Use [Flags] attribute before enum',
        'Combine with |: Read | Write',
        'Check with .HasFlag() method'
      ],
    }
  ],
  quiz: [
    {
      question: 'What is the default underlying type of an enum in C#?',
      options: [
        'string',
        'int',
        'byte',
        'long'
      ],
      correctIndex: 1,
      explanation: 'By default, enums use int as their underlying type. You can change this with : byte, : short, etc.'
    },
    {
      question: 'What does the [Flags] attribute enable?',
      options: [
        'Faster enum comparisons',
        'Combining multiple enum values with bitwise operations',
        'String representation of enums',
        'Enum validation'
      ],
      correctIndex: 1,
      explanation: '[Flags] indicates the enum can be treated as bit flags, allowing combination with | and checking with &.'
    },
    {
      question: 'What does "using static System.Console;" allow?',
      options: [
        'Makes Console faster',
        'Creates a Console variable',
        'Allows calling Console methods without the "Console." prefix',
        'Imports all of System namespace'
      ],
      correctIndex: 2,
      explanation: 'Static using imports static members, so you can write WriteLine() instead of Console.WriteLine().'
    },
    {
      question: 'What is the purpose of file-scoped namespaces?',
      options: [
        'Better performance',
        'Reduces indentation by one level for the entire file',
        'Makes the file private',
        'Enables file-level caching'
      ],
      correctIndex: 1,
      explanation: 'File-scoped namespaces (namespace X;) apply to the whole file, reducing indentation and boilerplate.'
    }
  ],
  buildNote: {
    title: 'Enums & Namespaces in C# Applications',
    explanation: `Enums are used extensively in .NET for status codes, options, and flags. ASP.NET Core uses enums for HTTP status codes, log levels, and configuration options. Namespaces organize large codebases - Microsoft.Extensions, System.Collections, etc. Modern C# projects use global usings to reduce boilerplate and file-scoped namespaces for cleaner code.`,
    relatedFiles: [
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Production C# uses enums for type-safe constants throughout the codebase. [Flags] enums model permissions, features, and options. Namespaces follow company/product/feature conventions. Large solutions rely heavily on proper namespace organization. Global usings are now standard in .NET 6+ projects to eliminate repetitive using statements.`
  }
};
