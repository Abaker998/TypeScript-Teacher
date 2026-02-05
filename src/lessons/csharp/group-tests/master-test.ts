import { Lesson } from '@/types/lesson';

export const masterTest: Lesson = {
  slug: 'csharp-master-test',
  title: 'Master Test',
  description: 'The ultimate C# challenge combining all concepts in expert-level scenarios.',
  difficulty: 'master',
  order: 30,
  content: `
# Master Test

You've completed the entire C# curriculum! This final test combines concepts from all sections into challenging, real-world scenarios that would test even experienced C# developers.

## What This Test Covers

This comprehensive test draws from **all** previous sections:

**Beginner Concepts:** Variables, types, methods, collections, control flow, exception handling

**Intermediate Concepts:** Interfaces, generics, classes, pattern matching, LINQ, async/await

**Advanced Concepts:** Reflection, attributes, extension methods, expression trees, DI, design patterns

## Challenge Level

These questions and exercises are designed to be **genuinely difficult**. They combine multiple concepts, require careful reasoning, and reflect real challenges you'd encounter in production C# codebases.

## Test Format

- **15+ Multiple choice questions** - Expert-level conceptual challenges
- **3 Coding exercises** - Complex real-world scenarios

Don't be discouraged if you find this challenging. Review the relevant lessons and try again!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Type-Safe Event System with Generics',
      description: `Build a type-safe event emitter using generics and constraints.

**Your task:**
1. Define event types:
   - \`UserLoginEvent\` record with: string UserId, DateTime Timestamp
   - \`UserLogoutEvent\` record with: string UserId
   - \`ErrorEvent\` record with: string Message, int Code

2. Create a generic class \`TypedEmitter<TEvent>\` with:
   - A private list of Action<TEvent> handlers
   - \`Subscribe(Action<TEvent> handler)\` method to add handlers
   - \`Emit(TEvent evt)\` method to invoke all handlers

3. Create an emitter for UserLoginEvent
4. Subscribe a handler that prints the UserId
5. Emit a UserLoginEvent with UserId "user123"

**The generic constraint ensures type safety at compile time.**`,
      starterCode: `using System;
using System.Collections.Generic;

// Define event records


// Create TypedEmitter<TEvent> class


// Create emitter instance


// Subscribe handler


// Emit event

`,
      solution: `using System;
using System.Collections.Generic;

public record UserLoginEvent(string UserId, DateTime Timestamp);
public record UserLogoutEvent(string UserId);
public record ErrorEvent(string Message, int Code);

public class TypedEmitter<TEvent>
{
    private readonly List<Action<TEvent>> _handlers = new();

    public void Subscribe(Action<TEvent> handler)
    {
        _handlers.Add(handler);
    }

    public void Emit(TEvent evt)
    {
        foreach (var handler in _handlers)
        {
            handler(evt);
        }
    }
}

var loginEmitter = new TypedEmitter<UserLoginEvent>();

loginEmitter.Subscribe(evt =>
{
    Console.WriteLine(evt.UserId);
});

loginEmitter.Emit(new UserLoginEvent("user123", DateTime.Now));`,
      expectedOutput: [
        'user123'
      ],
      hints: [
        'Records provide immutable data types with value semantics',
        'Action<T> represents a delegate that takes T and returns void',
        'Store handlers in a List<Action<TEvent>>',
        'Loop through handlers and invoke each one with the event'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: LINQ Expression Builder',
      description: `Create a fluent query builder that compiles to LINQ expressions.

**Your task:**
1. Create a \`Person\` class with: string Name, int Age, string City

2. Create a \`QueryBuilder<T>\` class with:
   - Private list of Func<T, bool> predicates
   - \`Where(Func<T, bool> predicate)\` - adds predicate, returns this (fluent)
   - \`Execute(IEnumerable<T> source)\` - applies all predicates and returns filtered results

3. Create sample data: 3 people with different ages and cities
4. Use the query builder to find people over 25 from "NYC"
5. Print the count of matching people

**This pattern is used in ORMs and query APIs.**`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

// Create Person class


// Create QueryBuilder<T> class


// Create sample data


// Build and execute query


// Print count

`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string City { get; set; }
}

public class QueryBuilder<T>
{
    private readonly List<Func<T, bool>> _predicates = new();

    public QueryBuilder<T> Where(Func<T, bool> predicate)
    {
        _predicates.Add(predicate);
        return this;
    }

    public IEnumerable<T> Execute(IEnumerable<T> source)
    {
        var result = source;
        foreach (var predicate in _predicates)
        {
            result = result.Where(predicate);
        }
        return result;
    }
}

var people = new List<Person>
{
    new Person { Name = "Alice", Age = 30, City = "NYC" },
    new Person { Name = "Bob", Age = 20, City = "NYC" },
    new Person { Name = "Charlie", Age = 35, City = "LA" }
};

var query = new QueryBuilder<Person>()
    .Where(p => p.Age > 25)
    .Where(p => p.City == "NYC");

var results = query.Execute(people);
Console.WriteLine(results.Count());`,
      expectedOutput: [
        '1'
      ],
      hints: [
        'Return "this" from Where to enable fluent chaining',
        'Store predicates as Func<T, bool> in a list',
        'Apply each predicate using LINQ Where in Execute',
        'Only Alice (age 30, NYC) matches both conditions'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Dependency Injection Container',
      description: `Implement a simple DI container using reflection.

**Your task:**
1. Create an interface \`ILogger\` with: void Log(string message)
2. Create a class \`ConsoleLogger\` implementing ILogger
3. Create a class \`UserService\` that:
   - Takes ILogger in its constructor
   - Has a method \`CreateUser(string name)\` that logs "Creating user: {name}"

4. Create a \`SimpleContainer\` class with:
   - Dictionary to store type registrations
   - \`Register<TInterface, TImplementation>()\` method
   - \`Resolve<T>()\` method that creates instances with dependency injection

5. Register ILogger -> ConsoleLogger
6. Resolve UserService and call CreateUser("Alice")

**This demonstrates how real DI containers work.**`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

// Create ILogger interface


// Create ConsoleLogger class


// Create UserService class


// Create SimpleContainer class


// Register and resolve

`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;

public interface ILogger
{
    void Log(string message);
}

public class ConsoleLogger : ILogger
{
    public void Log(string message)
    {
        Console.WriteLine(message);
    }
}

public class UserService
{
    private readonly ILogger _logger;

    public UserService(ILogger logger)
    {
        _logger = logger;
    }

    public void CreateUser(string name)
    {
        _logger.Log($"Creating user: {name}");
    }
}

public class SimpleContainer
{
    private readonly Dictionary<Type, Type> _registrations = new();

    public void Register<TInterface, TImplementation>() where TImplementation : TInterface
    {
        _registrations[typeof(TInterface)] = typeof(TImplementation);
    }

    public T Resolve<T>()
    {
        return (T)Resolve(typeof(T));
    }

    private object Resolve(Type type)
    {
        // Check if we have a registration for this type
        if (_registrations.TryGetValue(type, out var implementationType))
        {
            return Resolve(implementationType);
        }

        // Get the first constructor and resolve its parameters
        var constructor = type.GetConstructors().First();
        var parameters = constructor.GetParameters()
            .Select(p => Resolve(p.ParameterType))
            .ToArray();

        return Activator.CreateInstance(type, parameters);
    }
}

var container = new SimpleContainer();
container.Register<ILogger, ConsoleLogger>();

var userService = container.Resolve<UserService>();
userService.CreateUser("Alice");`,
      expectedOutput: [
        'Creating user: Alice'
      ],
      hints: [
        'Use Dictionary<Type, Type> to map interfaces to implementations',
        'Use reflection to get constructor parameters',
        'Recursively resolve dependencies for constructor parameters',
        'Activator.CreateInstance creates objects dynamically'
      ]
    }
  ],
  buildNote: {
    title: 'Master-Level Patterns in Production',
    explanation: `These patterns appear in sophisticated C# applications and frameworks. Type-safe event systems are used in CQRS and event-driven architectures. Query builders power ORMs like Entity Framework and Dapper. DI containers like Microsoft.Extensions.DependencyInjection, Autofac, and Ninject all use similar reflection-based techniques. Understanding these patterns prepares you for contributing to open-source libraries, designing robust APIs, and building enterprise applications.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/csharp/index.ts'
    ],
    inTheRealWorld: `These are the patterns used by C# experts at companies like Microsoft, Stack Overflow, and JetBrains. Framework authors use reflection for DI containers and serialization. Companies building scalable systems use event-driven patterns. Understanding these concepts opens doors to architecture roles and framework development.`
  },
  quiz: [
    {
      question: 'What does this code output?\n\n```csharp\nvar list = new List<int> { 1, 2, 3 };\nvar query = list.Where(x => x > 1);\nlist.Add(4);\nConsole.WriteLine(query.Count());\n```',
      options: ['2', '3', '4', 'Error'],
      correctIndex: 1,
      explanation: 'LINQ queries are lazily evaluated. When Count() is called, it evaluates the query against the current list state, which now includes 4. Numbers > 1 are: 2, 3, 4 = 3 items.'
    },
    {
      question: 'What is the purpose of the "yield return" statement?',
      options: [
        'To return from a method immediately',
        'To create an iterator that produces values lazily',
        'To throw an exception',
        'To break out of a loop'
      ],
      correctIndex: 1,
      explanation: 'yield return creates an iterator method that produces values one at a time as they are requested, enabling lazy evaluation and memory efficiency for large sequences.'
    },
    {
      question: 'What does covariance allow in this code?\n\n```csharp\nIEnumerable<Animal> animals = new List<Dog>();\n```',
      options: [
        'This code will not compile',
        'Dogs can be treated as Animals because IEnumerable<T> is covariant (out T)',
        'Animals can be treated as Dogs',
        'The list becomes read-only'
      ],
      correctIndex: 1,
      explanation: 'IEnumerable<T> is covariant (declared as IEnumerable<out T>). Since Dog derives from Animal, IEnumerable<Dog> can be assigned to IEnumerable<Animal>.'
    },
    {
      question: 'What is the difference between IEnumerable and IQueryable?',
      options: [
        'They are identical',
        'IEnumerable executes in memory, IQueryable can translate to SQL/external query',
        'IQueryable is faster',
        'IEnumerable supports async'
      ],
      correctIndex: 1,
      explanation: 'IEnumerable executes LINQ in memory. IQueryable uses expression trees that can be translated to SQL, enabling efficient database queries by pushing filtering to the server.'
    },
    {
      question: 'What pattern does this code demonstrate?\n\n```csharp\npublic class Logger\n{\n    private static readonly Lazy<Logger> _instance = new(() => new Logger());\n    private Logger() { }\n    public static Logger Instance => _instance.Value;\n}\n```',
      options: [
        'Factory pattern',
        'Singleton pattern with thread-safe lazy initialization',
        'Builder pattern',
        'Prototype pattern'
      ],
      correctIndex: 1,
      explanation: 'This is a thread-safe Singleton using Lazy<T>, which ensures the instance is created only once, even with concurrent access, and only when first requested.'
    },
    {
      question: 'What does the "in" modifier do on a method parameter?',
      options: [
        'Makes the parameter optional',
        'Passes by reference but prevents modification (readonly reference)',
        'Creates an input parameter for SQL',
        'Enables pattern matching'
      ],
      correctIndex: 1,
      explanation: 'The "in" modifier passes large structs by reference for efficiency while preventing the method from modifying the value. It combines ref semantics with readonly protection.'
    },
    {
      question: 'What does ConfigureAwait(false) do?',
      options: [
        'Disables async/await',
        'Continues on any available thread instead of capturing the synchronization context',
        'Makes the operation synchronous',
        'Throws if the operation fails'
      ],
      correctIndex: 1,
      explanation: 'ConfigureAwait(false) tells the awaiter not to capture and resume on the original context (like UI thread). This improves performance in library code where context is not needed.'
    },
    {
      question: 'What is the result of boxing and unboxing?',
      options: [
        'Compile-time type conversion',
        'Converting value types to/from object (heap allocation)',
        'Creating a copy of a reference type',
        'Encrypting data'
      ],
      correctIndex: 1,
      explanation: 'Boxing wraps a value type in an object (heap allocation). Unboxing extracts the value. This has performance implications as it involves memory allocation and copying.'
    },
    {
      question: 'What does the "record" keyword provide in C#?',
      options: [
        'Database logging',
        'Immutable types with value equality, deconstruction, and with-expressions',
        'Audio recording capabilities',
        'Transaction logging'
      ],
      correctIndex: 1,
      explanation: 'Records provide immutable reference types with automatic value-based equality, ToString(), deconstruction, and non-destructive mutation via with-expressions.'
    },
    {
      question: 'What does this expression tree code do?\n\n```csharp\nExpression<Func<int, bool>> expr = x => x > 5;\nvar compiled = expr.Compile();\nConsole.WriteLine(compiled(10));\n```',
      options: [
        'Throws an exception',
        'Compiles the expression tree to a delegate and executes it, printing "True"',
        'Prints the expression as a string',
        'Prints "10"'
      ],
      correctIndex: 1,
      explanation: 'Expression trees represent code as data. Compile() converts the expression tree to an executable delegate. compiled(10) evaluates 10 > 5, which is True.'
    },
    {
      question: 'What is the Specification pattern used for?',
      options: [
        'Documenting code requirements',
        'Encapsulating business rules as reusable, composable objects',
        'Specifying database schema',
        'Type specification'
      ],
      correctIndex: 1,
      explanation: 'The Specification pattern encapsulates business rules in objects that can be combined (And, Or, Not). This enables reusable queries and business logic validation.'
    },
    {
      question: 'What does "Span<T>" provide that arrays don\'t?',
      options: [
        'Larger storage capacity',
        'A view over contiguous memory (array, stack, native) without allocation',
        'Network streaming',
        'Parallel processing'
      ],
      correctIndex: 1,
      explanation: 'Span<T> is a ref struct that provides a type-safe view over contiguous memory without heap allocation. It can point to arrays, stackalloc memory, or native memory.'
    },
    {
      question: 'What is the purpose of IAsyncEnumerable<T>?',
      options: [
        'To make arrays asynchronous',
        'To enable async iteration with await foreach',
        'To parallelize enumeration',
        'To cache enumeration results'
      ],
      correctIndex: 1,
      explanation: 'IAsyncEnumerable<T> enables asynchronous streaming of data using await foreach. Each element can be asynchronously produced, ideal for database streaming or API pagination.'
    },
    {
      question: 'What does source generation provide in modern C#?',
      options: [
        'Random number generation',
        'Compile-time code generation to avoid runtime reflection',
        'Source code formatting',
        'Documentation generation'
      ],
      correctIndex: 1,
      explanation: 'Source generators analyze code and generate additional source at compile time. This enables reflection-free serialization, strongly-typed DI, and better performance.'
    },
    {
      question: 'What is the difference between Task.WhenAll and Task.WhenAny?',
      options: [
        'They are identical',
        'WhenAll waits for all tasks, WhenAny completes when any single task completes',
        'WhenAny is deprecated',
        'WhenAll runs tasks sequentially'
      ],
      correctIndex: 1,
      explanation: 'Task.WhenAll returns a task that completes when all input tasks complete. Task.WhenAny returns when the first task completes, useful for timeouts or racing operations.'
    },
    {
      question: 'What does the "init" accessor provide?',
      options: [
        'Initializes static fields',
        'Allows property setting only during object initialization',
        'Runs initialization code',
        'Creates constructor parameters'
      ],
      correctIndex: 1,
      explanation: 'The init accessor allows properties to be set during object initialization (object initializer or constructor) but makes them immutable afterward, unlike set which allows any-time mutation.'
    }
  ]
};
