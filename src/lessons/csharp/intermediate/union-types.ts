import { Lesson } from '@/types/lesson';

export const csharpUnionTypes: Lesson = {
  slug: 'csharp-union-types',
  title: 'Nullable Types & Pattern Matching',
  description: 'Handle optional values with nullable types and use pattern matching as an alternative to union types.',
  difficulty: 'intermediate',
  order: 12,
  content: `
# Nullable Types & Pattern Matching

C# doesn't have union types like TypeScript, but provides nullable types and pattern matching to handle values that might be one of several types or absent.

## Nullable Value Types

Value types (int, bool, DateTime) normally can't be null. Add \`?\` to allow null:

\`\`\`csharp
int regularInt = 5;
// regularInt = null;  // Error!

int? nullableInt = 5;
nullableInt = null;    // OK

// Check before using
if (nullableInt.HasValue)
{
    Console.WriteLine(nullableInt.Value);
}

// Or use null-conditional
Console.WriteLine(nullableInt?.ToString() ?? "No value");
\`\`\`

## Nullable Reference Types (C# 8+)

Enable nullable reference types for null safety:

\`\`\`csharp
#nullable enable

string nonNullable = "Hello";
// nonNullable = null;  // Warning!

string? nullable = null;  // OK

// Must check before using
if (nullable != null)
{
    Console.WriteLine(nullable.Length);  // Safe
}
\`\`\`

## Discriminated Unions with Classes

Create union-like behavior with a base class and derived types:

\`\`\`csharp
public abstract class Result<T>
{
    private Result() { }

    public sealed class Success : Result<T>
    {
        public T Value { get; }
        public Success(T value) => Value = value;
    }

    public sealed class Error : Result<T>
    {
        public string Message { get; }
        public Error(string message) => Message = message;
    }
}

Result<int> Divide(int a, int b)
{
    if (b == 0)
        return new Result<int>.Error("Cannot divide by zero");
    return new Result<int>.Success(a / b);
}
\`\`\`

## Pattern Matching Basics

Use \`is\` with patterns:

\`\`\`csharp
object value = 42;

if (value is int number)
{
    Console.WriteLine($"It's an integer: {number}");
}
else if (value is string text)
{
    Console.WriteLine($"It's a string: {text}");
}
\`\`\`

## Switch Expression (C# 8+)

Pattern matching with switch expressions:

\`\`\`csharp
string Describe(object obj) => obj switch
{
    int n when n < 0 => "Negative number",
    int n when n == 0 => "Zero",
    int n => $"Positive number: {n}",
    string s => $"String of length {s.Length}",
    null => "Nothing",
    _ => "Unknown type"
};

Console.WriteLine(Describe(-5));      // "Negative number"
Console.WriteLine(Describe("hello")); // "String of length 5"
\`\`\`

## Property Patterns

Match based on property values:

\`\`\`csharp
public record Person(string Name, int Age);

string Categorize(Person person) => person switch
{
    { Age: < 13 } => "Child",
    { Age: < 20 } => "Teenager",
    { Age: < 65 } => "Adult",
    { Age: >= 65 } => "Senior",
    _ => "Unknown"
};

var person = new Person("Alice", 25);
Console.WriteLine(Categorize(person));  // "Adult"
\`\`\`

## Tuple Patterns

Match on multiple values:

\`\`\`csharp
string GetQuadrant(int x, int y) => (x, y) switch
{
    ( > 0, > 0) => "Quadrant I",
    ( < 0, > 0) => "Quadrant II",
    ( < 0, < 0) => "Quadrant III",
    ( > 0, < 0) => "Quadrant IV",
    (0, 0) => "Origin",
    (_, 0) => "On X-axis",
    (0, _) => "On Y-axis",
    _ => "Unknown"
};

Console.WriteLine(GetQuadrant(3, 4));   // "Quadrant I"
Console.WriteLine(GetQuadrant(0, 5));   // "On Y-axis"
\`\`\`

## Type Patterns with Records

\`\`\`csharp
public abstract record Shape;
public record Circle(double Radius) : Shape;
public record Rectangle(double Width, double Height) : Shape;
public record Triangle(double Base, double Height) : Shape;

double CalculateArea(Shape shape) => shape switch
{
    Circle c => Math.PI * c.Radius * c.Radius,
    Rectangle r => r.Width * r.Height,
    Triangle t => 0.5 * t.Base * t.Height,
    _ => throw new ArgumentException("Unknown shape")
};

Shape circle = new Circle(5);
Console.WriteLine(CalculateArea(circle));  // ~78.54
\`\`\`

## List Patterns (C# 11+)

Match array and list contents:

\`\`\`csharp
string DescribeList(int[] numbers) => numbers switch
{
    [] => "Empty",
    [var single] => $"Single element: {single}",
    [var first, var second] => $"Two elements: {first}, {second}",
    [var first, .., var last] => $"Starts with {first}, ends with {last}",
};

Console.WriteLine(DescribeList(new[] { 1 }));        // "Single element: 1"
Console.WriteLine(DescribeList(new[] { 1, 2, 3 })); // "Starts with 1, ends with 3"
\`\`\`

## Handling Optional Values

\`\`\`csharp
public record User(string Name, string? Email, int? Age);

void PrintUserInfo(User user)
{
    Console.WriteLine($"Name: {user.Name}");

    // Pattern matching on nullable
    var emailStatus = user.Email switch
    {
        null => "No email provided",
        string email when email.Contains("@") => $"Email: {email}",
        _ => "Invalid email"
    };
    Console.WriteLine(emailStatus);

    // Null-coalescing for defaults
    int displayAge = user.Age ?? 0;
    Console.WriteLine($"Age: {displayAge}");
}
\`\`\`

## Creating OneOf Style Types

\`\`\`csharp
public readonly struct OneOf<T1, T2>
{
    private readonly T1? _value1;
    private readonly T2? _value2;
    private readonly int _index;

    public OneOf(T1 value) { _value1 = value; _index = 0; }
    public OneOf(T2 value) { _value2 = value; _index = 1; }

    public TResult Match<TResult>(
        Func<T1, TResult> case1,
        Func<T2, TResult> case2) =>
        _index == 0 ? case1(_value1!) : case2(_value2!);
}

// Usage
OneOf<int, string> value = new OneOf<int, string>(42);
string result = value.Match(
    number => $"Number: {number}",
    text => $"Text: {text}"
);
Console.WriteLine(result);  // "Number: 42"
\`\`\`

## Null-Forgiving Operator

When you know something isn't null despite the compiler warning:

\`\`\`csharp
#nullable enable

string? GetName() => "Alice";

// You know this won't be null
string name = GetName()!;  // ! suppresses warning

// Use sparingly - prefer proper null checking
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use nullable value and reference types
- Apply pattern matching with switch expressions
- Create discriminated union patterns
- Handle optional values safely
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Nullable Types',
      description: `Nullable types allow value types to hold null.

**Your task:**
1. Create a nullable int variable \`score\` set to null
2. Check if it has a value using HasValue
3. Print "No score" if null, or the score if it has a value
4. Then set score to 95 and print it`,
      starterCode: `// Step 1: Create nullable int


// Step 2-3: Check and print


// Step 4: Set to 95 and print

`,
      solution: `int? score = null;

if (score.HasValue)
{
    Console.WriteLine(score.Value);
}
else
{
    Console.WriteLine("No score");
}

score = 95;
Console.WriteLine(score.Value);`,
      expectedOutput: ['No score', '95'],
      hints: [
        'Declare nullable: int? score = null;',
        'Check with .HasValue property',
        'Access value with .Value when not null'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Switch Expression',
      description: `Switch expressions provide concise pattern matching.

**Your task:**
1. Create a method \`GetDayType\` that takes a string day name
2. Return "Weekday" for Mon-Fri, "Weekend" for Sat-Sun
3. Return "Unknown" for anything else
4. Test with "Monday", "Saturday", and "Holiday"`,
      starterCode: `// Step 1-2: Create GetDayType method using switch expression


// Step 3: Test with different inputs

`,
      solution: `string GetDayType(string day) => day switch
{
    "Monday" or "Tuesday" or "Wednesday" or "Thursday" or "Friday" => "Weekday",
    "Saturday" or "Sunday" => "Weekend",
    _ => "Unknown"
};

Console.WriteLine(GetDayType("Monday"));
Console.WriteLine(GetDayType("Saturday"));
Console.WriteLine(GetDayType("Holiday"));`,
      expectedOutput: ['Weekday', 'Weekend', 'Unknown'],
      hints: [
        'Use switch expression: day switch { pattern => result }',
        'Combine patterns with "or"',
        '_ is the default/catch-all pattern'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Type Pattern Matching',
      description: `Pattern matching can check and extract types.

**Your task:**
1. Create a method \`Describe\` that takes an \`object\`
2. Use switch expression to return descriptions:
   - int: "Integer: {value}"
   - string: "String: {value}"
   - bool: "Boolean: {value}"
   - default: "Unknown type"
3. Test with 42, "hello", and true`,
      starterCode: `// Step 1-2: Create Describe method


// Step 3: Test with different types

`,
      solution: `string Describe(object obj) => obj switch
{
    int i => $"Integer: {i}",
    string s => $"String: {s}",
    bool b => $"Boolean: {b}",
    _ => "Unknown type"
};

Console.WriteLine(Describe(42));
Console.WriteLine(Describe("hello"));
Console.WriteLine(Describe(true));`,
      expectedOutput: ['Integer: 42', 'String: hello', 'Boolean: True'],
      hints: [
        'Pattern: int i extracts the value into variable i',
        'Use string interpolation: $"Integer: {i}"',
        'The underscore _ matches anything'
      ],
    }
  ],
  quiz: [
    {
      question: 'What does int? mean in C#?',
      options: [
        'An optional parameter',
        'A nullable integer that can hold null',
        'An unsigned integer',
        'A question about the int type'
      ],
      correctIndex: 1,
      explanation: 'The ? after a value type creates a nullable version that can hold either a value or null.'
    },
    {
      question: 'What does the _ pattern represent in a switch expression?',
      options: [
        'An error case',
        'An empty value',
        'The default/catch-all case',
        'A private variable'
      ],
      correctIndex: 2,
      explanation: 'The underscore _ is the discard pattern that matches anything, serving as the default case.'
    },
    {
      question: 'What is the advantage of switch expressions over switch statements?',
      options: [
        'They run faster',
        'They use less memory',
        'They are expressions that return values',
        'They support more types'
      ],
      correctIndex: 2,
      explanation: 'Switch expressions return a value directly, making them more concise for mapping input to output.'
    },
    {
      question: 'How do you check if a nullable has a value?',
      options: [
        'Using .IsNull property',
        'Using .HasValue property',
        'Using == undefined',
        'Using .Exists() method'
      ],
      correctIndex: 1,
      explanation: 'Nullable types have a .HasValue property (bool) and a .Value property to access the actual value.'
    }
  ],
  buildNote: {
    title: 'Nullable Types & Patterns in C# Apps',
    explanation: `Nullable reference types are now the default in modern C# projects. Pattern matching is extensively used in ASP.NET Core for request handling and in Entity Framework for query results. The Result pattern (Success/Error) is common for operations that might fail. Libraries like OneOf provide TypeScript-like union type behavior for C#.`,
    relatedFiles: [
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Modern C# codebases enable nullable reference types project-wide to catch null reference exceptions at compile time. Pattern matching simplifies complex conditional logic, especially in API controllers and domain services. The discriminated union pattern with abstract records is becoming popular for modeling domain states. Libraries like LanguageExt bring functional programming patterns including proper Option<T> and Either<L, R> types to C#.`
  }
};
