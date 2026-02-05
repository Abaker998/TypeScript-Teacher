import { Lesson } from '@/types/lesson';

export const csharpTypeAliases: Lesson = {
  slug: 'csharp-type-aliases',
  title: 'C# Type Aliases',
  description: 'Create type aliases using directives and global usings for cleaner code.',
  difficulty: 'intermediate',
  order: 11,
  content: `
# C# Type Aliases

C# allows you to create aliases for types using \`using\` directives. This makes complex types more readable and creates domain-specific names.

## Basic Using Alias

Create an alias for a type with the \`using\` directive:

\`\`\`csharp
using UserId = System.Int32;
using Email = System.String;

public class User
{
    public UserId Id { get; set; }
    public Email EmailAddress { get; set; }
}

UserId id = 42;
Email email = "user@example.com";
Console.WriteLine($"User {id}: {email}");
\`\`\`

## Aliasing Generic Types

Simplify complex generic types:

\`\`\`csharp
using UserList = System.Collections.Generic.List<User>;
using UserDictionary = System.Collections.Generic.Dictionary<int, User>;

UserList users = new UserList();
users.Add(new User { Id = 1, Name = "Alice" });

UserDictionary userById = new UserDictionary();
userById[1] = users[0];
\`\`\`

## Namespace Aliases

Create short names for long namespaces:

\`\`\`csharp
using WinForms = System.Windows.Forms;
using IO = System.IO;

WinForms.Button button = new WinForms.Button();
IO.File.WriteAllText("test.txt", "Hello");
\`\`\`

This is especially useful when you have naming conflicts:

\`\`\`csharp
using WinFormsTimer = System.Windows.Forms.Timer;
using ThreadingTimer = System.Threading.Timer;

WinFormsTimer uiTimer = new WinFormsTimer();
ThreadingTimer backgroundTimer = new ThreadingTimer(callback, null, 0, 1000);
\`\`\`

## Global Using Directives (C# 10+)

Apply aliases across all files in a project:

\`\`\`csharp
// In GlobalUsings.cs or any file
global using UserId = System.Int32;
global using Email = System.String;
global using UserList = System.Collections.Generic.List<User>;

// Now available in all files without redeclaring
public class UserService
{
    public User GetUser(UserId id) { ... }
    public UserList GetAllUsers() { ... }
}
\`\`\`

## Using Alias for Tuples (C# 12+)

Create aliases for tuple types:

\`\`\`csharp
using Point = (int X, int Y);
using Rectangle = (int X, int Y, int Width, int Height);

Point origin = (0, 0);
Point destination = (10, 20);

Rectangle bounds = (0, 0, 100, 50);
Console.WriteLine($"Area: {bounds.Width * bounds.Height}");
\`\`\`

## Type Aliases vs Inheritance

Aliases create alternative names, not new types:

\`\`\`csharp
using Age = System.Int32;
using Count = System.Int32;

Age userAge = 25;
Count itemCount = 25;

// These are the SAME type - just different names
bool areEqual = userAge.GetType() == itemCount.GetType();  // true

// Can assign between aliases of same underlying type
userAge = itemCount;  // Valid! Both are Int32
\`\`\`

## Creating Semantic Types (Alternative Pattern)

For true type safety, consider readonly structs:

\`\`\`csharp
public readonly struct UserId
{
    public int Value { get; }

    public UserId(int value) => Value = value;

    public override string ToString() => Value.ToString();

    public static implicit operator int(UserId id) => id.Value;
    public static explicit operator UserId(int value) => new UserId(value);
}

public readonly struct Email
{
    public string Value { get; }

    public Email(string value)
    {
        if (!value.Contains("@"))
            throw new ArgumentException("Invalid email");
        Value = value;
    }
}

// Now these are distinct types
UserId userId = new UserId(1);
Email email = new Email("user@example.com");

// UserId and int are not implicitly interchangeable
// int x = userId;        // Only works with implicit operator
// UserId id = 5;         // Requires explicit cast
\`\`\`

## Aliasing Delegates

Create readable names for delegate types:

\`\`\`csharp
using Predicate = System.Func<int, bool>;
using Transformer = System.Func<string, string>;
using EventCallback = System.Action<object, System.EventArgs>;

Predicate isPositive = x => x > 0;
Transformer toUpper = s => s.ToUpper();

Console.WriteLine(isPositive(5));     // True
Console.WriteLine(toUpper("hello"));  // HELLO
\`\`\`

## Nullable Type Aliases

Include nullability in aliases:

\`\`\`csharp
using OptionalName = System.String?;
using OptionalId = System.Int32?;

public class SearchResult
{
    public OptionalName MatchedName { get; set; }
    public OptionalId ParentId { get; set; }
}

var result = new SearchResult
{
    MatchedName = null,
    ParentId = 42
};
\`\`\`

## Best Practices

\`\`\`csharp
// GOOD: Aliases for complex generics
using UserCache = Dictionary<string, List<User>>;

// GOOD: Resolving naming conflicts
using SqlConnection = Microsoft.Data.SqlClient.SqlConnection;
using OldSqlConnection = System.Data.SqlClient.SqlConnection;

// GOOD: Domain-specific semantics
using OrderId = System.Guid;
using Money = System.Decimal;

// AVOID: Aliases that obscure rather than clarify
using X = System.String;  // What is X?

// PREFER: Strongly-typed wrappers for important domain concepts
public readonly record struct CustomerId(int Value);
\`\`\`

## File-Scoped Using (C# 10+)

Combine with file-scoped namespaces:

\`\`\`csharp
global using System;
global using System.Collections.Generic;
global using UserId = System.Int32;

namespace MyApp.Models;

public class User
{
    public UserId Id { get; set; }
    public string Name { get; set; }
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create type aliases with using directives
- Use global usings for project-wide aliases
- Distinguish between aliases and true new types
- Apply aliases to simplify complex generic types
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Type Alias',
      description: `Type aliases give descriptive names to existing types.

**Your task:**
1. Create a using alias \`ProductId\` for \`int\`
2. Create a using alias \`Price\` for \`decimal\`
3. Create variables using these aliases
4. Print the values`,
      starterCode: `// Step 1: Create ProductId alias for int


// Step 2: Create Price alias for decimal


// Step 3: Create variables with the aliases


// Step 4: Print the values

`,
      solution: `using ProductId = System.Int32;
using Price = System.Decimal;

ProductId id = 1001;
Price cost = 29.99m;

Console.WriteLine($"Product {id} costs {cost}");`,
      expectedOutput: ['Product 1001 costs 29.99'],
      hints: [
        'Syntax: using AliasName = System.Type;',
        'Use System.Int32 for int, System.Decimal for decimal',
        'Use the alias like a regular type: ProductId id = 1001;'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Generic Type Alias',
      description: `Aliases can simplify complex generic types.

**Your task:**
1. Create an alias \`StringList\` for \`List<string>\`
2. Create a StringList and add "apple", "banana", "cherry"
3. Print each item using a foreach loop`,
      starterCode: `using System.Collections.Generic;

// Step 1: Create StringList alias


// Step 2: Create list and add items


// Step 3: Print each item

`,
      solution: `using System.Collections.Generic;
using StringList = System.Collections.Generic.List<string>;

StringList fruits = new StringList();
fruits.Add("apple");
fruits.Add("banana");
fruits.Add("cherry");

foreach (string fruit in fruits)
{
    Console.WriteLine(fruit);
}`,
      expectedOutput: ['apple', 'banana', 'cherry'],
      hints: [
        'using StringList = System.Collections.Generic.List<string>;',
        'Use full namespace path in the alias',
        'Use like any other List: new StringList()'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Namespace Alias',
      description: `Create short aliases for long namespaces to resolve conflicts.

**Your task:**
1. Create a namespace alias \`IO\` for \`System.IO\`
2. Use IO.Path.GetFileName to extract filename from a path
3. Print the extracted filename`,
      starterCode: `// Step 1: Create IO namespace alias


// Step 2: Use IO.Path.GetFileName


// Step 3: Print the result

`,
      solution: `using IO = System.IO;

string fullPath = "/users/documents/report.pdf";
string fileName = IO.Path.GetFileName(fullPath);

Console.WriteLine(fileName);`,
      expectedOutput: ['report.pdf'],
      hints: [
        'Syntax: using IO = System.IO;',
        'Access members with IO.Path, IO.File, etc.',
        'GetFileName extracts just the filename from a path'
      ],
    }
  ],
  quiz: [
    {
      question: 'What does a C# using alias create?',
      options: [
        'A new distinct type',
        'An alternative name for an existing type',
        'A subclass of the original type',
        'A copy of the type'
      ],
      correctIndex: 1,
      explanation: 'Using aliases create alternative names, not new types. The alias and original type are completely interchangeable.'
    },
    {
      question: 'What is the scope of a global using directive?',
      options: [
        'Only the current file',
        'Only the current namespace',
        'The entire project',
        'Only derived classes'
      ],
      correctIndex: 2,
      explanation: 'Global using directives (global using) apply across all files in the project without needing to redeclare them.'
    },
    {
      question: 'Why would you use a namespace alias?',
      options: [
        'To make code run faster',
        'To resolve naming conflicts between namespaces',
        'To create new namespaces',
        'To hide implementation details'
      ],
      correctIndex: 1,
      explanation: 'Namespace aliases help when two namespaces have types with the same name, like System.Windows.Forms.Timer and System.Threading.Timer.'
    },
    {
      question: 'What is required when aliasing a generic type?',
      options: [
        'Only the generic type name',
        'The full namespace path including generic parameters',
        'A special Generic keyword',
        'Registration in a config file'
      ],
      correctIndex: 1,
      explanation: 'Generic type aliases require the full path: using MyList = System.Collections.Generic.List<string>;'
    }
  ],
  buildNote: {
    title: 'Type Aliases in C# Applications',
    explanation: `Type aliases are commonly used in C# to simplify complex generic types and resolve namespace conflicts. In large projects, global usings consolidate common imports. ASP.NET projects often alias Microsoft.Extensions namespaces. For true type safety in domain modeling, C# developers often create readonly record structs or value objects rather than simple aliases, as aliases don't prevent mixing up semantically different values of the same underlying type.`,
    relatedFiles: [
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Production C# code uses global usings to reduce boilerplate. Large solutions with many projects use namespace aliases to manage naming conflicts. Domain-Driven Design practitioners often create strongly-typed IDs (record structs) rather than using aliases, providing true type safety. Libraries like StronglyTypedId generate these wrappers automatically.`
  }
};
