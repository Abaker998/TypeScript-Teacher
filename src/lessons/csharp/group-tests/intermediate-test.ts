import { Lesson } from '@/types/lesson';

export const intermediateTest: Lesson = {
  slug: 'csharp-intermediate-test',
  title: 'Intermediate Test',
  description: 'Test your understanding of interfaces, generics, classes, pattern matching, LINQ, and async programming.',
  difficulty: 'intermediate',
  order: 20,
  content: `
# Intermediate Test

Excellent work completing the Intermediate section! This test will assess your understanding of the core C# patterns that professional developers use daily.

## What This Test Covers

- **Interfaces** - Defining contracts for object behavior
- **Type Aliases** - Creating reusable type definitions with using directives
- **Union Types** - Handling multiple types with pattern matching
- **Classes** - Object-oriented programming with C#
- **Generics** - Parameterized types for reusable code
- **Type Guards** - Pattern matching and type checking at runtime
- **Enums & Namespaces** - Enumerations and code organization
- **Modern Operators** - Null-coalescing and null-conditional operators
- **LINQ** - Language Integrated Query for data manipulation
- **Async Programming** - Tasks and async/await

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** - reading code and predicting what it prints
- **Coding exercises** - writing code to solve problems

These concepts form the backbone of professional C# development. Take your time!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Generic Data Container',
      description: `Create a generic container class that can hold any type of data.

**Your task:**
1. Create a generic class \`Container<T>\` with:
   - A private \`_value\` field of type T
   - A constructor that takes the initial value
   - A \`GetValue()\` method that returns the value
   - A \`SetValue(T newValue)\` method to update the value
2. Create a Container holding an int with initial value 10
3. Print the initial value
4. Set a new value of 20
5. Print the updated value

**Expected output:** 10, then 20`,
      starterCode: `using System;

// Create the generic Container class


// Create a Container<int> with initial value 10


// Print the initial value


// Set new value to 20


// Print the updated value

`,
      solution: `using System;

public class Container<T>
{
    private T _value;

    public Container(T initialValue)
    {
        _value = initialValue;
    }

    public T GetValue()
    {
        return _value;
    }

    public void SetValue(T newValue)
    {
        _value = newValue;
    }
}

var numContainer = new Container<int>(10);
Console.WriteLine(numContainer.GetValue());
numContainer.SetValue(20);
Console.WriteLine(numContainer.GetValue());`,
      expectedOutput: [
        '10',
        '20'
      ],
      hints: [
        'Generic class syntax: public class ClassName<T> { }',
        'Private field: private T _value;',
        'Constructor receives and stores the initial value',
        'Methods use T as the type for parameters and return values'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Pattern Matching with Interfaces',
      description: `Create interfaces and use pattern matching to handle different types safely.

**Your task:**
1. Define an interface \`IDog\` with: string Name { get; } and string Bark() method
2. Define an interface \`ICat\` with: string Name { get; } and string Meow() method
3. Create a method \`MakeSound(object pet)\` that uses pattern matching:
   - If pet is IDog, call Bark()
   - If pet is ICat, call Meow()
   - Otherwise return "Unknown animal"
4. Create a Dog class implementing IDog
5. Test with a dog object and print the result

**Note:** Use "is" pattern matching for type checking.`,
      starterCode: `using System;

// Define IDog interface


// Define ICat interface


// Create Dog class implementing IDog


// Create MakeSound method with pattern matching


// Test with a dog object

`,
      solution: `using System;

public interface IDog
{
    string Name { get; }
    string Bark();
}

public interface ICat
{
    string Name { get; }
    string Meow();
}

public class Dog : IDog
{
    public string Name { get; }

    public Dog(string name)
    {
        Name = name;
    }

    public string Bark()
    {
        return "Woof!";
    }
}

public static string MakeSound(object pet)
{
    return pet switch
    {
        IDog dog => dog.Bark(),
        ICat cat => cat.Meow(),
        _ => "Unknown animal"
    };
}

var myDog = new Dog("Buddy");
Console.WriteLine(MakeSound(myDog));`,
      expectedOutput: [
        'Woof!'
      ],
      hints: [
        'Interface syntax: public interface IName { string Property { get; } string Method(); }',
        'Pattern matching switch: pet switch { Type var => ..., _ => default }',
        'The "is" keyword can also be used: if (pet is IDog dog)',
        'Create the dog class with a constructor that sets the Name'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Async Data Fetching',
      description: `Simulate async data fetching with proper typing.

**Your task:**
1. Create a record \`User\` with: int Id, string Name, string Email
2. Create an async method \`FetchUserAsync\` that:
   - Takes an id parameter (int)
   - Returns Task<User>
   - Uses Task.Delay to simulate a 100ms delay
   - Returns a user object with the given id
3. Create an async method \`MainAsync\` that:
   - Awaits FetchUserAsync(1)
   - Prints the user's name
4. Call MainAsync().Wait()

**Note:** Use \`await Task.Delay(100)\` for the delay.`,
      starterCode: `using System;
using System.Threading.Tasks;

// Define User record


// Create async FetchUserAsync method


// Create async MainAsync method


// Call MainAsync().Wait()

`,
      solution: `using System;
using System.Threading.Tasks;

public record User(int Id, string Name, string Email);

public static async Task<User> FetchUserAsync(int id)
{
    await Task.Delay(100);
    return new User(id, "Alice", "alice@example.com");
}

public static async Task MainAsync()
{
    var user = await FetchUserAsync(1);
    Console.WriteLine(user.Name);
}

MainAsync().Wait();`,
      expectedOutput: [
        'Alice'
      ],
      hints: [
        'Async method syntax: public static async Task<ReturnType> MethodName() { }',
        'Use await Task.Delay(milliseconds) to pause asynchronously',
        'Record syntax: public record Name(Type Prop1, Type Prop2);',
        'Use await to get the result from a Task'
      ]
    }
  ],
  buildNote: {
    title: 'Intermediate Patterns in Real Applications',
    explanation: `Professional C# applications use all these intermediate patterns extensively. Interfaces define contracts for dependency injection. Generic types appear in collections, repositories, and service classes. Pattern matching simplifies handling different response types. LINQ powers data access layers with Entity Framework. Async patterns are essential for web APIs to handle concurrent requests efficiently. These patterns work together to create maintainable, testable code.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/csharp/index.ts'
    ],
    inTheRealWorld: `Mid-level C# positions require fluency in these patterns. Companies expect developers to write generic utility classes, use pattern matching for safe type handling, and handle async operations properly. ASP.NET Core applications heavily use these patterns - controllers are async, services use interfaces for DI, and data access relies on LINQ and Entity Framework.`
  },
  quiz: [
    {
      question: 'What is the main difference between an interface and an abstract class in C#?',
      options: [
        'Interfaces are faster at runtime',
        'Abstract classes cannot have method implementations',
        'A class can implement multiple interfaces but inherit from only one class',
        'There is no difference, they are interchangeable'
      ],
      correctIndex: 2,
      explanation: 'C# supports single inheritance for classes but a class can implement multiple interfaces. Abstract classes can have implementations, while interfaces (before C# 8) could only have signatures.'
    },
    {
      question: 'What does this code output?\n\n```csharp\nenum Status { Pending = 1, Approved, Rejected }\nConsole.WriteLine((int)Status.Rejected);\n```',
      options: ['1', '2', '3', '"Rejected"'],
      correctIndex: 2,
      explanation: 'In numeric enums, values auto-increment from the first specified value. Pending = 1, Approved = 2, Rejected = 3. Casting to int returns 3.'
    },
    {
      question: 'What does the generic constraint "where T : class" mean?',
      options: [
        'T must be exactly the object type',
        'T must be a reference type (class, not struct)',
        'T must extend a class called "class"',
        'T can be any type including value types'
      ],
      correctIndex: 1,
      explanation: 'The "where T : class" constraint limits T to reference types only, excluding value types like int, struct, and enum.'
    },
    {
      question: 'What does this code output?\n\n```csharp\nvar obj = new { A = 1, B = 2, C = 3 };\nvar props = obj.GetType().GetProperties();\nConsole.WriteLine(props.Length);\n```',
      options: ['1', '2', '3', '0'],
      correctIndex: 2,
      explanation: 'Anonymous types have properties for each named value. The object has 3 properties (A, B, C), so GetProperties() returns an array of length 3.'
    },
    {
      question: 'What is the purpose of pattern matching in C#?',
      options: [
        'To match regular expressions',
        'To safely check and extract types at runtime',
        'To guard against null values only',
        'To convert types automatically'
      ],
      correctIndex: 1,
      explanation: 'Pattern matching allows you to check types and extract values in a single expression, making code more concise and type-safe than traditional casting.'
    },
    {
      question: 'What does this code output?\n\n```csharp\nstring? name = null;\nConsole.WriteLine(name?.ToUpper() ?? "Unknown");\n```',
      options: ['null', 'Error', 'UNKNOWN', 'Unknown'],
      correctIndex: 3,
      explanation: 'The null-conditional operator (?.) returns null when name is null. The null-coalescing operator (??) then returns "Unknown" since the left side is null.'
    },
    {
      question: 'What is the return type of an async method that returns an int?',
      options: ['int', 'Task<int>', 'async int', 'Awaitable<int>'],
      correctIndex: 1,
      explanation: 'Async methods wrap their return value in a Task. An async method returning an int has the type Task<int>.'
    },
    {
      question: 'What does this LINQ query return?\n\n```csharp\nvar nums = new[] { 1, 2, 3, 4, 5 };\nvar result = nums.Where(n => n % 2 == 0).Select(n => n * 10);\n```',
      options: ['{ 10, 20, 30, 40, 50 }', '{ 20, 40 }', '{ 2, 4 }', 'IEnumerable<int>'],
      correctIndex: 1,
      explanation: 'Where filters to even numbers (2, 4), then Select multiplies each by 10. The result contains 20 and 40.'
    },
    {
      question: 'Which operator safely handles potentially null values when accessing members?',
      options: ['&&', '||', '?.', '!'],
      correctIndex: 2,
      explanation: 'The null-conditional operator (?.) short-circuits and returns null if the left side is null, preventing NullReferenceException when accessing properties or methods.'
    },
    {
      question: 'What does "readonly" do when applied to a field?',
      options: [
        'Makes the field invisible to other classes',
        'Allows assignment only in the declaration or constructor',
        'Makes the field optional',
        'Converts the field to a constant'
      ],
      correctIndex: 1,
      explanation: 'readonly fields can only be assigned during declaration or in a constructor. They cannot be reassigned after the object is constructed.'
    },
    {
      question: 'What does this pattern matching code do?\n\n```csharp\nobject value = 42;\nvar result = value switch {\n    int i when i > 0 => "positive",\n    int i => "non-positive",\n    string s => "string",\n    _ => "unknown"\n};\n```',
      options: [
        'Returns "non-positive"',
        'Returns "positive"',
        'Returns "unknown"',
        'Throws an exception'
      ],
      correctIndex: 1,
      explanation: 'The value is int 42. It matches the first pattern (int i when i > 0) since 42 > 0, so the result is "positive".'
    },
    {
      question: 'What is the difference between Task.Run and async/await?',
      options: [
        'They are exactly the same',
        'Task.Run executes on a thread pool thread, async/await can stay on the same thread',
        'async/await is deprecated',
        'Task.Run is only for CPU-bound work'
      ],
      correctIndex: 1,
      explanation: 'Task.Run schedules work on the thread pool. async/await allows cooperative multitasking - I/O-bound operations can release the thread while waiting.'
    }
  ]
};
