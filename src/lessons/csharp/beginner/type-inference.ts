import { Lesson } from '@/types/lesson';

export const typeInference: Lesson = {
  slug: 'csharp-type-inference',
  title: 'Type Inference with var',
  description: 'Understand how C# automatically infers types using the var keyword without explicit annotations.',
  difficulty: 'beginner',
  order: 2,
  content: `
# Type Inference with var

C# can often figure out types automatically using the \`var\` keyword. This is called **type inference**.

## What is Type Inference?

When you use \`var\` and assign a value, C# looks at the value and determines the type:

\`\`\`csharp
var message = "Hello";  // C# infers: string
var count = 42;         // C# infers: int
var isActive = true;    // C# infers: bool
var price = 19.99;      // C# infers: double
\`\`\`

You didn't write \`string\`, \`int\`, \`bool\`, or \`double\`, but C# figured it out from the values.

## Why Does This Matter?

Type inference gives you the best of both worlds:
- **Less typing** - you don't have to annotate everything
- **Full type safety** - C# still catches errors

\`\`\`csharp
var score = 100;
score = "high";  // Error! Cannot implicitly convert type 'string' to 'int'
\`\`\`

Even though you never wrote \`int\`, C# knows \`score\` is an int and won't let you assign a string.

## When to Use var vs Explicit Types

**Use var** when the type is obvious from the value:

\`\`\`csharp
var name = "Alice";              // Obviously a string
var items = new List<int>();     // Obviously a List<int>
var isValid = false;             // Obviously a bool
\`\`\`

**Use explicit types** when:
- The type isn't clear from context
- You want to be extra clear for documentation
- You're declaring without initializing (var requires initialization)

\`\`\`csharp
string data;                     // Will be assigned later
int userId;                      // Complex type
Dictionary<string, List<int>> lookup;  // Explicit for clarity
\`\`\`

## var Requires Initialization

Unlike explicit types, \`var\` must be initialized:

\`\`\`csharp
// This works - explicit type, assigned later
string name;
name = "Alice";

// This does NOT work - var needs immediate value
var name;  // Error! Implicitly-typed variables must be initialized
\`\`\`

## Inference with Arrays

C# infers array types from their contents:

\`\`\`csharp
var numbers = new int[] { 1, 2, 3 };      // int[]
var words = new string[] { "a", "b" };    // string[]

// Shorthand syntax
var nums = new[] { 1, 2, 3 };             // int[]
var strs = new[] { "hello", "world" };    // string[]
\`\`\`

## Inference with Objects

C# infers types when you create new objects:

\`\`\`csharp
var user = new User { Name = "Alice", Age = 30 };
// C# infers: User

var dict = new Dictionary<string, int>();
// C# infers: Dictionary<string, int>

var list = new List<string> { "a", "b", "c" };
// C# infers: List<string>
\`\`\`

## Inference with Anonymous Types

Anonymous types must use var:

\`\`\`csharp
// Anonymous type - only way to declare this
var person = new { Name = "Alice", Age = 30 };

Console.WriteLine(person.Name);  // "Alice"
Console.WriteLine(person.Age);   // 30

// person.Email = "a@b.c";  // Error! Property doesn't exist
\`\`\`

## Inference with LINQ

var shines with LINQ queries:

\`\`\`csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };

// Complex inferred type
var doubled = numbers.Select(n => n * 2);  // IEnumerable<int>
var evens = numbers.Where(n => n % 2 == 0);  // IEnumerable<int>

// Much cleaner than:
IEnumerable<int> doubled2 = numbers.Select(n => n * 2);
\`\`\`

## The Type is Fixed at Compile Time

Important: var doesn't mean "any type" or "dynamic". The type is determined once at compile time:

\`\`\`csharp
var x = 10;      // x is int, forever
x = 20;          // OK - still int
x = "hello";     // Error! x is int, not string

// This is NOT like JavaScript's var or dynamic typing!
\`\`\`

## var vs dynamic

C# has \`dynamic\` for truly dynamic typing, but it's different from \`var\`:

\`\`\`csharp
var x = 10;        // Type checked at compile time
dynamic y = 10;    // Type checked at runtime

x = "hello";       // Compile error!
y = "hello";       // OK at compile time, but risky
\`\`\`

**Avoid \`dynamic\`** unless you have a specific need (like COM interop).

## Hover to See Inferred Types

In Visual Studio or VS Code, hover over any \`var\` to see its inferred type:

\`\`\`csharp
var message = "Hello";  // Hover shows: string
var count = 42;         // Hover shows: int
var user = new User();  // Hover shows: User
\`\`\`

## Best Practices Summary

| Situation | Recommendation |
|-----------|---------------|
| Type obvious from assignment | Use var |
| new keyword on right side | Use var |
| LINQ queries | Use var |
| Declaring without initializing | Use explicit type |
| Type not obvious | Use explicit type |
| Public APIs/method signatures | Use explicit type |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Understand how C# infers types with var
- Know when to use var vs explicit types
- Recognize that var is still strongly typed
- Understand the difference between var and dynamic
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Observe Inference',
      description: `Let C# figure out the types automatically - use var instead of explicit types!

**Your task:**
1. Create a variable \`myName\` set to \`"Alex"\` using var
2. Create a variable \`myAge\` set to \`25\` using var
3. Create a variable \`likesCoding\` set to \`true\` using var
4. Print all three using Console.WriteLine()

**Key point:** C# automatically knows the types from the values you assign!`,
      starterCode: `// Create a variable myName set to "Alex" using var


// Create a variable myAge set to 25 using var


// Create a variable likesCoding set to true using var


// Print all three variables

`,
      solution: `var myName = "Alex";
var myAge = 25;
var likesCoding = true;

Console.WriteLine(myName);
Console.WriteLine(myAge);
Console.WriteLine(likesCoding);`,
      expectedOutput: ['Alex', '25', 'True'],
      hints: [
        'Use var instead of string/int/bool: var myName = "Alex";',
        'C# sees "Alex" and knows it\'s a string automatically',
        'For the number: var myAge = 25; (no quotes around numbers)',
        'Don\'t forget to print with Console.WriteLine() at the end!'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Array Inference',
      description: `Create arrays and let C# infer their types automatically.

**Your task:**
1. Create an array called \`numbers\` with values [10, 20, 30] using var
2. Create an array called \`colors\` with values ["red", "green", "blue"] using var
3. Print the first element of each array using [0]

**Key point:** C# infers the array type from what you put in it!`,
      starterCode: `// Create a numbers array with [10, 20, 30] using var


// Create a colors array with ["red", "green", "blue"] using var


// Print the first element of each array (use [0])

`,
      solution: `var numbers = new[] { 10, 20, 30 };
var colors = new[] { "red", "green", "blue" };

Console.WriteLine(numbers[0]);
Console.WriteLine(colors[0]);`,
      expectedOutput: ['10', 'red'],
      hints: [
        'Arrays with var: var numbers = new[] { 10, 20, 30 };',
        'Access the first element with [0]: numbers[0] gives 10',
        'C# sees new[] { 10, 20, 30 } and infers int[] automatically',
        'For strings: var colors = new[] { "red", "green", "blue" };'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Object Inference',
      description: `Create objects and let C# infer their types automatically.

**Your task:**
1. Create a \`List<string>\` called \`fruits\` with items "apple", "banana", "cherry" using var
2. Add "date" to the list using Add()
3. Print the first fruit (index 0)
4. Print the total count of fruits

**Key point:** C# infers List<string> from how you initialize it!`,
      starterCode: `// Create a List<string> called fruits with "apple", "banana", "cherry" using var


// Add "date" to the list


// Print the first fruit (index 0)


// Print the total count (use .Count)

`,
      solution: `var fruits = new List<string> { "apple", "banana", "cherry" };

fruits.Add("date");

Console.WriteLine(fruits[0]);
Console.WriteLine(fruits.Count);`,
      expectedOutput: ['apple', '4'],
      hints: [
        'Create list: var fruits = new List<string> { "apple", "banana", "cherry" };',
        'Add item: fruits.Add("date");',
        'First item: fruits[0] gives "apple"',
        'Count: fruits.Count gives 4 (original 3 + 1 added)'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: var vs Explicit Types',
      description: `Compare using var versus explicit type declarations.

**Your task:**
1. Create a variable \`withVar\` using var, set to "Hello"
2. Create a variable \`explicit\` using explicit string type, set to "World"
3. Create a variable \`number\` using var, set to 42
4. Print all three values

**Key insight:** Both var and explicit types work the same way - var just saves typing!`,
      starterCode: `// Create withVar using var - set to "Hello"


// Create explicit using string type - set to "World"


// Create number using var - set to 42


// Print all three values



`,
      solution: `var withVar = "Hello";
string explicit1 = "World";
var number = 42;

Console.WriteLine(withVar);
Console.WriteLine(explicit1);
Console.WriteLine(number);`,
      expectedOutput: ['Hello', 'World', '42'],
      hints: [
        'var withVar = "Hello"; - type inferred as string',
        'string explicit1 = "World"; - type declared explicitly',
        'var number = 42; - type inferred as int',
        'The values print the same regardless of how you declared them!'
      ]
    }
  ],
  quiz: [
    {
      question: 'What type does C# infer for: var age = 25;',
      options: ['double', 'object', 'int', 'var'],
      correctIndex: 2,
      explanation: 'C# infers "int" for whole number literals. There is a separate "double" type for decimals like 25.0.'
    },
    {
      question: 'What happens if you try: var x; x = 10;',
      options: ['x becomes int', 'x becomes object', 'Compile error - var must be initialized', 'x becomes dynamic'],
      correctIndex: 2,
      explanation: 'Variables declared with var must be initialized immediately. The compiler needs a value to infer the type from.'
    },
    {
      question: 'What is the difference between var and dynamic in C#?',
      options: [
        'They are the same thing',
        'var is type-checked at compile time, dynamic at runtime',
        'dynamic is type-checked at compile time, var at runtime',
        'var is only for strings'
      ],
      correctIndex: 1,
      explanation: 'var determines the type at compile time and enforces it. dynamic defers all type checking to runtime, which can lead to runtime errors.'
    },
    {
      question: 'When should you prefer explicit types over var?',
      options: [
        'Always - var is bad practice',
        'Never - var is always better',
        'When the type isn\'t obvious or when declaring without initializing',
        'Only for string variables'
      ],
      correctIndex: 2,
      explanation: 'Use explicit types when the inferred type isn\'t clear from the code, or when you need to declare a variable without immediately assigning a value.'
    }
  ],
  buildNote: {
    title: 'Type Inference in C# Applications',
    explanation: `Throughout C# applications, var is commonly used to reduce verbosity while maintaining full type safety. In ASP.NET Core controllers, you'll see var used extensively with LINQ queries and database results. When calling methods that return complex generic types like IQueryable<T>, var keeps code readable. However, in public APIs and method signatures, explicit types are preferred for clarity. The C# compiler resolves all var declarations at compile time, so there's zero runtime performance difference between var and explicit types.`,
    relatedFiles: [
      'Controllers/UserController.cs',
      'Services/DataService.cs',
      'Program.cs'
    ],
    inTheRealWorld: `Professional C# codebases use var extensively, especially with LINQ and Entity Framework queries where explicit types would be verbose. For example, a query returning IQueryable<IGrouping<int, User>> is much cleaner as var result = users.GroupBy(u => u.DepartmentId). The rule of thumb: if the type is obvious from the right side of the assignment, use var. If it's not obvious, use an explicit type for readability.`
  }
};
