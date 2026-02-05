import { Lesson } from '@/types/lesson';

export const csharpModernOperators: Lesson = {
  slug: 'csharp-modern-operators',
  title: 'Modern C# Operators',
  description: 'Master null-conditional, null-coalescing, and pattern matching operators.',
  difficulty: 'intermediate',
  order: 17,
  content: `
# Modern C# Operators

C# provides powerful operators for handling nulls, accessing members safely, and writing concise code.

## Null-Conditional Operator (?.)

Safely access members on potentially null objects:

\`\`\`csharp
string? name = null;
int? length = name?.Length;  // null, not exception

// Chaining
var city = user?.Address?.City;  // Safe even if Address is null

// With method calls
string? upper = name?.ToUpper();

// With indexers
var first = items?[0];
\`\`\`

## Null-Coalescing Operator (??)

Provide a default value for null:

\`\`\`csharp
string? name = null;
string displayName = name ?? "Guest";  // "Guest"

int? count = null;
int total = count ?? 0;  // 0

// Chain multiple fallbacks
string result = first ?? second ?? third ?? "default";
\`\`\`

## Null-Coalescing Assignment (??=)

Assign only if the variable is null:

\`\`\`csharp
string? name = null;
name ??= "Default";  // name is now "Default"

name ??= "Another";  // Still "Default" (not null anymore)

// Useful for lazy initialization
List<string>? items = null;
items ??= new List<string>();
items.Add("First");  // Safe - items is now initialized
\`\`\`

## Combining ?. and ??

\`\`\`csharp
// Get nested value or default
string city = user?.Address?.City ?? "Unknown";

// Get count or 0
int count = items?.Count ?? 0;

// Get first item or default
var first = list?.FirstOrDefault() ?? defaultValue;
\`\`\`

## Null-Forgiving Operator (!)

Tell the compiler "I know this isn't null":

\`\`\`csharp
#nullable enable

string? GetName() => "Alice";

// Without ! - compiler warns
string name1 = GetName();  // Warning: possible null

// With ! - you assert it's not null
string name2 = GetName()!;  // No warning

// Use sparingly - prefer proper null handling
\`\`\`

## Range Operator (..)

Create ranges for slicing:

\`\`\`csharp
int[] numbers = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };

// Slice syntax
int[] middle = numbers[3..7];     // { 3, 4, 5, 6 }
int[] first3 = numbers[..3];      // { 0, 1, 2 }
int[] last3 = numbers[^3..];      // { 7, 8, 9 }
int[] exceptLast = numbers[..^1]; // { 0..8 }

// With strings
string text = "Hello, World!";
string hello = text[..5];         // "Hello"
string world = text[7..12];       // "World"
\`\`\`

## Index from End (^)

\`\`\`csharp
int[] numbers = { 0, 1, 2, 3, 4 };

int last = numbers[^1];    // 4 (last element)
int secondLast = numbers[^2];  // 3

// Combine with range
int[] lastTwo = numbers[^2..];  // { 3, 4 }
\`\`\`

## Expression-Bodied Members

\`\`\`csharp
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }

    // Expression-bodied property
    public string FullName => $"{FirstName} {LastName}";

    // Expression-bodied method
    public string Greet() => $"Hello, I'm {FullName}";

    // Expression-bodied constructor (C# 7+)
    public Person(string first, string last) => (FirstName, LastName) = (first, last);
}
\`\`\`

## Target-Typed New

\`\`\`csharp
// Type is inferred from context
List<string> names = new();
Dictionary<int, string> map = new();

// Works with properties
public List<Order> Orders { get; } = new();

// In method calls
void Process(List<int> numbers) { }
Process(new() { 1, 2, 3 });

// In return statements
List<string> GetNames() => new() { "Alice", "Bob" };
\`\`\`

## Pattern Matching with is

\`\`\`csharp
// Type pattern
if (obj is string text)
{
    Console.WriteLine(text.Length);
}

// Not pattern
if (value is not null)
{
    // Safe to use value
}

// And/or patterns
if (number is > 0 and < 100)
{
    Console.WriteLine("In range");
}

if (day is "Saturday" or "Sunday")
{
    Console.WriteLine("Weekend!");
}
\`\`\`

## Discard (_)

\`\`\`csharp
// Ignore return values
_ = int.TryParse("123", out int result);

// Ignore tuple elements
var (name, _, age) = GetPersonData();

// In pattern matching
object obj = 42;
if (obj is int _)
{
    Console.WriteLine("It's an int");
}
\`\`\`

## Tuple Deconstruction

\`\`\`csharp
// Deconstruct tuple
var (x, y) = (10, 20);

// Deconstruct into existing variables
int a, b;
(a, b) = GetCoordinates();

// Swap values
(a, b) = (b, a);

// In foreach
var points = new[] { (1, 2), (3, 4), (5, 6) };
foreach (var (px, py) in points)
{
    Console.WriteLine($"Point: ({px}, {py})");
}
\`\`\`

## Spread Operator (C# 12+)

\`\`\`csharp
int[] first = { 1, 2, 3 };
int[] second = { 4, 5, 6 };

// Spread into new collection
int[] combined = [..first, ..second];  // { 1, 2, 3, 4, 5, 6 }

// With other elements
int[] extended = [0, ..first, 10];  // { 0, 1, 2, 3, 10 }
\`\`\`

## Conditional Access with Events

\`\`\`csharp
public event EventHandler? MyEvent;

// Safe event invocation
void RaiseEvent()
{
    MyEvent?.Invoke(this, EventArgs.Empty);
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use null-conditional and null-coalescing operators
- Apply range and index operators
- Write expression-bodied members
- Use modern pattern matching syntax
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Null-Safe Access',
      description: `Use null-conditional and null-coalescing operators.

**Your task:**
1. Create a class \`Person\` with nullable \`Address\` property
2. Create \`Address\` class with nullable \`City\` property
3. Create a method \`GetCity\` that safely returns city or "Unknown"
4. Test with a person that has no address`,
      starterCode: `// Step 1: Create Person class


// Step 2: Create Address class


// Step 3: Create GetCity method


// Step 4: Test with null address

`,
      solution: `public class Address
{
    public string? City { get; set; }
}

public class Person
{
    public string Name { get; set; }
    public Address? Address { get; set; }
}

string GetCity(Person person)
{
    return person.Address?.City ?? "Unknown";
}

Person person = new Person { Name = "Alice" };
Console.WriteLine(GetCity(person));`,
      expectedOutput: ['Unknown'],
      hints: [
        'Use ?. to safely access Address',
        'Chain: person.Address?.City',
        'Use ?? for the default value'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Range and Index',
      description: `Use range and index operators for slicing.

**Your task:**
1. Create an array of numbers 1-10
2. Get the first 3 elements
3. Get the last 3 elements
4. Get elements 4-7 (indices 3-6)`,
      starterCode: `// Step 1: Create array 1-10


// Step 2: Get first 3


// Step 3: Get last 3


// Step 4: Get middle portion (4-7)

`,
      solution: `int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

int[] first3 = numbers[..3];
Console.WriteLine(string.Join(", ", first3));

int[] last3 = numbers[^3..];
Console.WriteLine(string.Join(", ", last3));

int[] middle = numbers[3..7];
Console.WriteLine(string.Join(", ", middle));`,
      expectedOutput: ['1, 2, 3', '8, 9, 10', '4, 5, 6, 7'],
      hints: [
        '[..3] means from start to index 3 (exclusive)',
        '[^3..] means last 3 elements',
        '[3..7] means indices 3 through 6'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Null-Coalescing Assignment',
      description: `Use ??= for lazy initialization.

**Your task:**
1. Create a class with a nullable List<string> field
2. Add a method that ensures the list exists, then adds an item
3. Use ??= for lazy initialization
4. Add "first" and "second", then print count`,
      starterCode: `// Step 1: Create Container class with nullable list


// Step 2: Create AddItem method with lazy init


// Step 3-4: Test by adding items

`,
      solution: `public class Container
{
    private List<string>? _items;

    public void AddItem(string item)
    {
        _items ??= new List<string>();
        _items.Add(item);
    }

    public int Count => _items?.Count ?? 0;
}

Container container = new Container();
container.AddItem("first");
container.AddItem("second");
Console.WriteLine(container.Count);`,
      expectedOutput: ['2'],
      hints: [
        '??= assigns only if left side is null',
        '_items ??= new List<string>();',
        'After first call, _items is not null'
      ],
    }
  ],
  quiz: [
    {
      question: 'What does "user?.Address?.City" return when Address is null?',
      options: [
        'Throws NullReferenceException',
        'Empty string',
        'null',
        '"Unknown"'
      ],
      correctIndex: 2,
      explanation: 'Null-conditional operator short-circuits and returns null when any part of the chain is null.'
    },
    {
      question: 'What is the difference between ?? and ??=?',
      options: [
        'They are the same',
        '?? returns a value; ??= assigns a value if null',
        '??= is faster',
        '?? only works with strings'
      ],
      correctIndex: 1,
      explanation: '?? returns left value or right default. ??= assigns right value to left variable only if left is null.'
    },
    {
      question: 'What does numbers[^1] access?',
      options: [
        'The first element',
        'The last element',
        'One element from the end',
        'The element at index 1'
      ],
      correctIndex: 1,
      explanation: '^1 means one from the end, which is the last element. ^0 would be past the end (invalid).'
    },
    {
      question: 'What does [3..7] create?',
      options: [
        'Elements at indices 3 and 7',
        'Elements from index 3 to 7 (inclusive)',
        'Elements from index 3 to 6 (7 exclusive)',
        '4 elements starting at 3'
      ],
      correctIndex: 2,
      explanation: 'Range end is exclusive, so [3..7] includes indices 3, 4, 5, 6 (4 elements).'
    }
  ],
  buildNote: {
    title: 'Modern Operators in C# Applications',
    explanation: `Modern C# operators are used throughout .NET codebases. Null-conditional and null-coalescing operators handle the pervasive null checking in real applications. Range operators simplify collection slicing. ASP.NET Core, Entity Framework, and other libraries use these operators extensively for cleaner, safer code.`,
    relatedFiles: [
      'src/hooks/useProgress.ts'
    ],
    inTheRealWorld: `Production C# code heavily uses these operators. API controllers use ?? for default values. Entity Framework queries use ?. for navigation properties. Configuration binding uses ??= for defaults. Range operators simplify pagination. These operators have transformed C# from verbose null-checking to concise, expressive code.`
  }
};
