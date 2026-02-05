import { Lesson } from '@/types/lesson';

export const beginnerTest: Lesson = {
  slug: 'csharp-beginner-test',
  title: 'Beginner Test',
  description: 'Test your understanding of C# fundamentals: variables, types, methods, collections, and more.',
  difficulty: 'beginner',
  order: 9,
  content: `
# Beginner Test

Congratulations on completing the Beginner section! This test will assess your understanding of the fundamental C# concepts you've learned.

## What This Test Covers

- **Variables & Types** - Declaring variables with type annotations
- **Type Inference** - Understanding when C# figures out types automatically (var keyword)
- **Methods** - Writing typed methods with parameters and return types
- **Collections & Objects** - Working with arrays, lists, and structured data
- **Control Flow** - Conditionals, loops, and switches
- **Error Handling** - try/catch blocks and exception types
- **Web Fundamentals** - HTTP basics and ASP.NET Core concepts
- **Developer Tooling** - .NET CLI, MSBuild, and project configuration

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** - reading code and predicting what it prints
- **Coding exercises** - writing code to solve problems

Take your time and think through each question carefully. You can use the hints if you get stuck on coding exercises.

## Ready?

Complete the quiz and exercises below to demonstrate your C# fundamentals knowledge!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Type-Safe User Profile',
      description: `Create a properly typed user profile class and a method to display it.

**Your task:**
1. Create a \`User\` class with:
   - \`Name\`: string property
   - \`Age\`: int property
   - \`IsActive\`: bool property
   - \`Hobbies\`: List<string> property
2. Create a method \`GreetUser\` that takes a name (string) and returns a greeting string
3. Create a User instance and print the result of calling \`GreetUser\` with the user's name
4. Print the number of hobbies the user has

**Expected output should match the format shown.**`,
      starterCode: `using System;
using System.Collections.Generic;

// Create the User class with proper types


// Create the GreetUser method


// Create a user instance and call GreetUser


// Print the number of hobbies

`,
      solution: `using System;
using System.Collections.Generic;

public class User
{
    public string Name { get; set; }
    public int Age { get; set; }
    public bool IsActive { get; set; }
    public List<string> Hobbies { get; set; }
}

public static string GreetUser(string name)
{
    return "Hello, " + name + "!";
}

var user = new User
{
    Name = "Alice",
    Age = 25,
    IsActive = true,
    Hobbies = new List<string> { "reading", "coding" }
};

Console.WriteLine(GreetUser(user.Name));
Console.WriteLine(user.Hobbies.Count);`,
      expectedOutput: [
        'Hello, Alice!',
        '2'
      ],
      hints: [
        'Class syntax: public class ClassName { public Type PropertyName { get; set; } }',
        'Method syntax: public static ReturnType MethodName(Type param) { }',
        'Access list count with .Count property',
        'Use string concatenation or string interpolation for the greeting'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Collection Processing with LINQ',
      description: `Use LINQ methods with proper typing to process a list of numbers.

**Your task:**
1. Create a \`numbers\` list of type \`List<int>\` containing: 10, 25, 30, 45, 50
2. Use \`Where\` to get only numbers greater than 20, store in \`filtered\`
3. Use \`Select\` on filtered to double each number, store in \`doubled\`
4. Use \`Sum\` to sum all doubled numbers, store in \`sum\`
5. Print the sum

**Hint:** Where, Select, and Sum are LINQ methods that take lambda expressions.`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

// Create the numbers list


// Filter to keep only numbers > 20


// Double each filtered number


// Sum all the doubled numbers


// Print the sum

`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;

List<int> numbers = new List<int> { 10, 25, 30, 45, 50 };
var filtered = numbers.Where(n => n > 20);
var doubled = filtered.Select(n => n * 2);
int sum = doubled.Sum();

Console.WriteLine(sum);`,
      expectedOutput: [
        '300'
      ],
      hints: [
        'Where syntax: list.Where(item => condition)',
        'Select syntax: list.Select(item => transformedItem)',
        'Sum syntax: enumerable.Sum()',
        '25+30+45+50 = 150, doubled = 300'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Error Handling Method',
      description: `Create a method that safely divides numbers with proper exception handling.

**Your task:**
1. Create a method \`SafeDivide\` that takes two integers (a, b) and returns an integer
2. Inside the method, use try/catch to handle division
3. If b is 0, throw a new DivideByZeroException with message "Cannot divide by zero"
4. In the catch block, return -1 to indicate an error
5. Test by calling SafeDivide(10, 2) and SafeDivide(10, 0)
6. Print both results

**Expected behavior:** 10/2 = 5, 10/0 should return -1 (error case)`,
      starterCode: `using System;

// Create the SafeDivide method with error handling


// Test with valid division


// Test with division by zero


// Print both results

`,
      solution: `using System;

public static int SafeDivide(int a, int b)
{
    try
    {
        if (b == 0)
        {
            throw new DivideByZeroException("Cannot divide by zero");
        }
        return a / b;
    }
    catch (DivideByZeroException)
    {
        return -1;
    }
}

int result1 = SafeDivide(10, 2);
int result2 = SafeDivide(10, 0);

Console.WriteLine(result1);
Console.WriteLine(result2);`,
      expectedOutput: [
        '5',
        '-1'
      ],
      hints: [
        'Check if b == 0 before dividing',
        'throw new DivideByZeroException("message") creates an exception',
        'The catch block handles the thrown exception',
        'Return -1 in the catch block to signal an error occurred'
      ]
    }
  ],
  buildNote: {
    title: 'Testing Knowledge in Real Applications',
    explanation: `This test combines concepts from all beginner lessons. In production C# applications, these foundational concepts appear everywhere: classes define data structures, LINQ operations process collections, and exception handling protects against runtime errors. ASP.NET Core controllers use these patterns extensively - a typical controller action might validate input, query a database using LINQ, and return appropriate responses while handling exceptions gracefully.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/csharp/index.ts'
    ],
    inTheRealWorld: `Entry-level C# interviews often test these exact concepts. Companies like Microsoft, Amazon, and countless enterprises expect developers to understand variable declarations, basic types, method signatures, LINQ operations, and exception handling. These fundamentals form the foundation for everything else in C# development.`
  },
  quiz: [
    // Definition questions
    {
      question: 'What is a "type annotation" in C#?',
      options: [
        'A comment that describes a variable',
        'A way to explicitly declare what type a variable can hold',
        'An error message from the compiler',
        'A method that converts types'
      ],
      correctIndex: 1,
      explanation: 'A type annotation explicitly tells the C# compiler what type a variable, parameter, or return value should be, such as int, string, or List<string>.'
    },
    {
      question: 'What does the "var" keyword do in C#?',
      options: [
        'Creates a variable that can hold any type',
        'Tells the compiler to infer the type from the assigned value',
        'Creates a variable with no type',
        'Declares a global variable'
      ],
      correctIndex: 1,
      explanation: 'The var keyword enables type inference - the compiler determines the type based on the assigned value. The variable is still strongly typed.'
    },
    {
      question: 'What is the purpose of a "return type" in a method?',
      options: [
        'To name the method',
        'To specify what type of value the method will return',
        'To define the method\'s parameters',
        'To make the method run faster'
      ],
      correctIndex: 1,
      explanation: 'A return type (like int or string before the method name) declares what type of value a method will return, helping catch errors when the wrong type is returned.'
    },
    {
      question: 'What does the "void" keyword represent as a return type?',
      options: [
        'An empty string',
        'The number zero',
        'A method that doesn\'t return a value',
        'An undefined variable'
      ],
      correctIndex: 2,
      explanation: 'void is used as a return type for methods that don\'t return anything. It signals that the caller shouldn\'t expect a return value.'
    },
    {
      question: 'What is a List<T> in C#?',
      options: [
        'A fixed-size array',
        'A dynamic collection that can grow and shrink',
        'A method that takes multiple parameters',
        'A way to store key-value pairs'
      ],
      correctIndex: 1,
      explanation: 'List<T> is a generic collection class that stores elements of type T and can dynamically grow or shrink as elements are added or removed.'
    },
    // Concept questions
    {
      question: 'Which keyword creates a constant that cannot be changed?',
      options: ['var', 'let', 'const', 'readonly'],
      correctIndex: 2,
      explanation: 'const declares a compile-time constant that cannot be changed. readonly is similar but for instance fields that can be set in constructors.'
    },
    {
      question: 'What is the difference between "int" and "int?" in C#?',
      options: [
        'int is faster, int? is slower',
        'int cannot be null, int? can be null',
        'int? is for larger numbers',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'int is a non-nullable value type. int? (nullable int) can hold either an integer value or null, using Nullable<int> under the hood.'
    },
    {
      question: 'Which statement about var is TRUE?',
      options: [
        'var makes the variable dynamically typed',
        'var can only be used with numbers',
        'var requires an initializer - the compiler infers the type from it',
        'var is deprecated in modern C#'
      ],
      correctIndex: 2,
      explanation: 'var requires initialization because the compiler needs the right-hand side expression to infer the type. You cannot write "var x;" without assignment.'
    },
    {
      question: 'What happens when you try to compile this code?\n\n```csharp\nint age = "twenty";\n```',
      options: [
        'It compiles and runs normally',
        'It throws a runtime error',
        'It shows a compile-time type error',
        'It converts "twenty" to a number'
      ],
      correctIndex: 2,
      explanation: 'C# catches type mismatches at compile time. Assigning a string to an int variable produces a compiler error before the code can run.'
    },
    {
      question: 'Which LINQ method would you use to find a single item that matches a condition?',
      options: ['Select', 'Where', 'FirstOrDefault', 'Aggregate'],
      correctIndex: 2,
      explanation: 'FirstOrDefault() returns the first element that matches the condition, or the default value (null for reference types) if none match. Where() returns all matches as an enumerable.'
    },
    // Code output questions
    {
      question: 'What does this code output?\n\n```csharp\nvar arr = new[] { 1, 2, 3 };\nConsole.WriteLine(string.Join(", ", arr.Select(x => x * 2)));\n```',
      options: ['1, 2, 3', '2, 4, 6', '6', 'undefined'],
      correctIndex: 1,
      explanation: 'The Select method creates a new sequence by applying the lambda to each element. Each element is doubled: 1*2=2, 2*2=4, 3*2=6.'
    },
    {
      question: 'What is the return type of this method?\n\n```csharp\npublic string GetMessage()\n{\n    return "Hello";\n}\n```',
      options: ['void', 'object', 'string', 'var'],
      correctIndex: 2,
      explanation: 'The method explicitly declares its return type as string before the method name. It returns the string "Hello" which matches this type.'
    },
    {
      question: 'What does this code output?\n\n```csharp\nvar nums = new List<int> { 5, 10, 15 };\nConsole.WriteLine(nums.Where(n => n > 7).Count());\n```',
      options: ['1', '2', '3', 'Error'],
      correctIndex: 1,
      explanation: 'Where(n => n > 7) keeps only numbers greater than 7, resulting in { 10, 15 }. The .Count() method then returns 2.'
    },
    {
      question: 'What does this code output?\n\n```csharp\ntry\n{\n    throw new Exception("Oops");\n    Console.WriteLine("After throw");\n}\ncatch (Exception e)\n{\n    Console.WriteLine("Caught");\n}\n```',
      options: ['Oops', 'After throw', 'Caught', 'After throw\\nCaught'],
      correctIndex: 2,
      explanation: 'When an exception is thrown, execution jumps immediately to the catch block. The Console.WriteLine("After throw") line is never reached.'
    },
    {
      question: 'What does this code output?\n\n```csharp\nint x = 10;\nif (x > 5)\n{\n    Console.WriteLine("big");\n}\nelse\n{\n    Console.WriteLine("small");\n}\n```',
      options: ['big', 'small', '10', 'true'],
      correctIndex: 0,
      explanation: 'Since x (10) is greater than 5, the condition is true, so "big" is logged. The else branch is not executed.'
    },
    {
      question: 'What does this code output?\n\n```csharp\nvar person = new { Name = "Alice", Age = 30 };\nConsole.WriteLine(person.Name);\n```',
      options: ['{ Name = Alice, Age = 30 }', 'Alice', 'Name', 'Error'],
      correctIndex: 1,
      explanation: 'Anonymous types in C# create objects with named properties. Accessing person.Name returns the value "Alice".'
    }
  ]
};
