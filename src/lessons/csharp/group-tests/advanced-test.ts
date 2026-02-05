import { Lesson } from '@/types/lesson';

export const advancedTest: Lesson = {
  slug: 'csharp-advanced-test',
  title: 'Advanced Test',
  description: 'Test your mastery of reflection, attributes, extension methods, expression trees, and advanced patterns.',
  difficulty: 'advanced',
  order: 28,
  content: `
# Advanced Test

Outstanding progress! You've completed the Advanced section. This test will challenge your understanding of C#'s most powerful features.

## What This Test Covers

- **Reflection** - Inspecting and manipulating types at runtime
- **Attributes** - Metadata and custom attributes
- **Extension Methods** - Adding methods to existing types
- **Expression Trees** - Building and analyzing code as data
- **Advanced Generics** - Covariance, contravariance, and constraints
- **Dependency Injection** - IoC containers and service lifetimes
- **Advanced Patterns** - Repository, Unit of Work, Specification patterns

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** - reading complex operations
- **Coding exercises** - implementing advanced utilities

These are the skills that distinguish expert C# developers. Think carefully!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Custom Attribute and Reflection',
      description: `Create a custom attribute and use reflection to read it.

**Your task:**
1. Create a custom attribute \`[Description("text")]\` that can be applied to classes
2. Create a class \`Product\` decorated with [Description("Represents a product in the catalog")]
3. Use reflection to:
   - Get the Description attribute from the Product class
   - Extract and print the description text
4. Print the description

**Hint:** Use typeof(Product).GetCustomAttribute<DescriptionAttribute>()`,
      starterCode: `using System;
using System.Reflection;

// Create the DescriptionAttribute class


// Create the Product class with the attribute


// Use reflection to get and print the description

`,
      solution: `using System;
using System.Reflection;

[AttributeUsage(AttributeTargets.Class)]
public class DescriptionAttribute : Attribute
{
    public string Text { get; }

    public DescriptionAttribute(string text)
    {
        Text = text;
    }
}

[Description("Represents a product in the catalog")]
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
}

var attr = typeof(Product).GetCustomAttribute<DescriptionAttribute>();
Console.WriteLine(attr?.Text);`,
      expectedOutput: [
        'Represents a product in the catalog'
      ],
      hints: [
        'Attribute class syntax: public class NameAttribute : Attribute { }',
        'Use [AttributeUsage] to specify where the attribute can be applied',
        'typeof(T) gets the Type object for reflection',
        'GetCustomAttribute<T>() returns the attribute instance or null'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Extension Methods',
      description: `Create extension methods to add functionality to existing types.

**Your task:**
1. Create a static class \`StringExtensions\` with extension methods for string:
   - \`ToTitleCase()\` - capitalizes the first letter of each word
   - \`WordCount()\` - returns the number of words (split by space)
2. Create a static class \`EnumerableExtensions\` with extension method:
   - \`SecondOrDefault<T>()\` - returns the second element or default
3. Test all three extension methods and print results

**Note:** Extension methods use "this" keyword on the first parameter.`,
      starterCode: `using System;
using System.Linq;
using System.Collections.Generic;

// Create StringExtensions class


// Create EnumerableExtensions class


// Test the extension methods

`,
      solution: `using System;
using System.Linq;
using System.Collections.Generic;
using System.Globalization;

public static class StringExtensions
{
    public static string ToTitleCase(this string str)
    {
        return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(str.ToLower());
    }

    public static int WordCount(this string str)
    {
        return str.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
    }
}

public static class EnumerableExtensions
{
    public static T SecondOrDefault<T>(this IEnumerable<T> source)
    {
        return source.Skip(1).FirstOrDefault();
    }
}

string text = "hello world example";
Console.WriteLine(text.ToTitleCase());
Console.WriteLine(text.WordCount());

var numbers = new[] { 10, 20, 30 };
Console.WriteLine(numbers.SecondOrDefault());`,
      expectedOutput: [
        'Hello World Example',
        '3',
        '20'
      ],
      hints: [
        'Extension method syntax: public static ReturnType Name(this TargetType param)',
        'The method must be in a static class',
        'Use TextInfo.ToTitleCase for proper title casing',
        'Skip(1).FirstOrDefault() gets the second element safely'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Generic Repository Pattern',
      description: `Implement a generic repository pattern with constraints.

**Your task:**
1. Create an interface \`IEntity\` with an int Id property
2. Create a generic interface \`IRepository<T>\` where T : IEntity with methods:
   - T GetById(int id)
   - void Add(T entity)
   - IEnumerable<T> GetAll()
3. Create a \`Product\` class implementing IEntity
4. Create an \`InMemoryRepository<T>\` implementing IRepository<T>
5. Test by adding products and retrieving them

**This is a fundamental pattern for data access layers.**`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

// Create IEntity interface


// Create IRepository<T> interface with constraint


// Create Product class


// Create InMemoryRepository<T> class


// Test the repository

`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;

public interface IEntity
{
    int Id { get; set; }
}

public interface IRepository<T> where T : IEntity
{
    T GetById(int id);
    void Add(T entity);
    IEnumerable<T> GetAll();
}

public class Product : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class InMemoryRepository<T> : IRepository<T> where T : IEntity
{
    private readonly List<T> _items = new();

    public T GetById(int id)
    {
        return _items.FirstOrDefault(x => x.Id == id);
    }

    public void Add(T entity)
    {
        _items.Add(entity);
    }

    public IEnumerable<T> GetAll()
    {
        return _items;
    }
}

var repo = new InMemoryRepository<Product>();
repo.Add(new Product { Id = 1, Name = "Laptop" });
repo.Add(new Product { Id = 2, Name = "Mouse" });

Console.WriteLine(repo.GetAll().Count());
Console.WriteLine(repo.GetById(1).Name);`,
      expectedOutput: [
        '2',
        'Laptop'
      ],
      hints: [
        'Interface constraint: where T : IEntity',
        'Store items in a List<T> field',
        'Use LINQ FirstOrDefault with a predicate to find by Id',
        'The repository is generic - it works with any IEntity type'
      ]
    }
  ],
  buildNote: {
    title: 'Advanced Patterns in Production',
    explanation: `These advanced patterns appear in sophisticated C# applications. Reflection powers serialization, dependency injection, and ORM mapping. Attributes provide metadata for validation, routing, and authorization in ASP.NET Core. Extension methods add fluent APIs to existing types. The repository pattern abstracts data access, making code testable and maintainable. These patterns are essential for building enterprise applications and frameworks.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/csharp/index.ts'
    ],
    inTheRealWorld: `Senior C# positions require deep understanding of these patterns. Library authors use reflection to build flexible APIs. Framework developers use attributes for declarative programming. Companies like Microsoft, Stack Overflow, and countless enterprises use repository patterns with Entity Framework for data access.`
  },
  quiz: [
    {
      question: 'What does reflection allow you to do in C#?',
      options: [
        'Make objects immutable',
        'Inspect and manipulate types, methods, and properties at runtime',
        'Speed up code execution',
        'Create compile-time constants'
      ],
      correctIndex: 1,
      explanation: 'Reflection provides the ability to examine type metadata, invoke methods dynamically, and access properties at runtime - essential for serialization, DI containers, and ORMs.'
    },
    {
      question: 'What does the [AttributeUsage] attribute do?',
      options: [
        'Runs code when the attribute is used',
        'Specifies where (classes, methods, etc.) a custom attribute can be applied',
        'Makes the attribute required',
        'Caches the attribute for performance'
      ],
      correctIndex: 1,
      explanation: 'AttributeUsage specifies valid targets (Class, Method, Property, etc.) and whether the attribute can be applied multiple times or inherited.'
    },
    {
      question: 'What makes a method an "extension method" in C#?',
      options: [
        'Using the "extend" keyword',
        'Being static with "this" keyword on the first parameter',
        'Having "Extension" in the name',
        'Implementing IExtension interface'
      ],
      correctIndex: 1,
      explanation: 'Extension methods must be static methods in a static class, with "this" modifier on the first parameter, which specifies the type being extended.'
    },
    {
      question: 'What is the purpose of Expression<Func<T, bool>> vs Func<T, bool>?',
      options: [
        'They are identical in function',
        'Expression can be analyzed and translated (e.g., to SQL), Func is just executable',
        'Func is faster than Expression',
        'Expression is deprecated'
      ],
      correctIndex: 1,
      explanation: 'Expression trees represent code as data structures that can be analyzed and transformed. This enables LINQ to SQL/EF to translate C# expressions into SQL queries.'
    },
    {
      question: 'What does "covariance" mean for generic types?',
      options: [
        'T can only be used as input',
        'T can vary to a more derived type (out T)',
        'T must be exactly the specified type',
        'T is automatically converted'
      ],
      correctIndex: 1,
      explanation: 'Covariance (out T) allows using a more derived type. IEnumerable<Dog> can be assigned to IEnumerable<Animal> because it only outputs T values.'
    },
    {
      question: 'What does "contravariance" mean for generic types?',
      options: [
        'T can only be used as output',
        'T can vary to a less derived (base) type (in T)',
        'T must be exactly the specified type',
        'T is automatically converted'
      ],
      correctIndex: 1,
      explanation: 'Contravariance (in T) allows using a less derived type. Action<Animal> can be assigned to Action<Dog> because it only consumes T values.'
    },
    {
      question: 'In dependency injection, what is "Singleton" lifetime?',
      options: [
        'A new instance is created for each request',
        'One instance is shared for the entire application lifetime',
        'A new instance is created for each scope',
        'The instance is never created'
      ],
      correctIndex: 1,
      explanation: 'Singleton lifetime means one instance is created and shared across all requests and scopes for the lifetime of the application.'
    },
    {
      question: 'What does this code return?\n\n```csharp\ntypeof(List<int>).GetGenericArguments()[0].Name\n```',
      options: [
        '"List"',
        '"Int32"',
        '"int"',
        '"List<int>"'
      ],
      correctIndex: 1,
      explanation: 'GetGenericArguments() returns the type arguments used in a generic type. For List<int>, it returns typeof(int), whose Name property is "Int32".'
    },
    {
      question: 'What is the Repository pattern primarily used for?',
      options: [
        'Caching data in memory',
        'Abstracting data access to enable testability and separation of concerns',
        'Logging database queries',
        'Encrypting database connections'
      ],
      correctIndex: 1,
      explanation: 'The Repository pattern abstracts data persistence, allowing business logic to work with in-memory collections while hiding database details. This enables unit testing with mock repositories.'
    },
    {
      question: 'What constraint does "where T : new()" require?',
      options: [
        'T must be a reference type',
        'T must have a public parameterless constructor',
        'T must be a value type',
        'T must implement IDisposable'
      ],
      correctIndex: 1,
      explanation: 'The new() constraint requires T to have a public parameterless constructor, allowing the generic code to create instances using new T().'
    },
    {
      question: 'What does GetCustomAttributes(true) return when passed "true"?',
      options: [
        'Only attributes on the current type',
        'Attributes including inherited ones from base classes',
        'Only non-inherited attributes',
        'Attributes sorted alphabetically'
      ],
      correctIndex: 1,
      explanation: 'The boolean parameter indicates whether to search the inheritance chain. "true" includes attributes from base classes and interfaces.'
    },
    {
      question: 'What is the Unit of Work pattern used for?',
      options: [
        'Measuring code performance',
        'Maintaining a list of business transactions and coordinating their persistence',
        'Breaking code into smaller methods',
        'Unit testing repositories'
      ],
      correctIndex: 1,
      explanation: 'Unit of Work tracks changes to entities during a business transaction and commits them together, ensuring consistency. Often used with Repository pattern in data access layers.'
    }
  ]
};
