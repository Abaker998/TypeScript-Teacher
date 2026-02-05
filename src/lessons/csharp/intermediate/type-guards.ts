import { Lesson } from '@/types/lesson';

export const csharpTypeGuards: Lesson = {
  slug: 'csharp-type-checking',
  title: 'Type Checking & Pattern Matching',
  description: 'Master type checking with is, as operators and advanced pattern matching.',
  difficulty: 'intermediate',
  order: 15,
  content: `
# Type Checking & Pattern Matching

C# provides powerful operators and patterns for checking and converting types safely at runtime.

## The is Operator

Check if an object is a specific type:

\`\`\`csharp
object value = "Hello";

if (value is string)
{
    Console.WriteLine("It's a string!");
}

// With variable declaration (pattern matching)
if (value is string text)
{
    Console.WriteLine($"String value: {text}");
}
\`\`\`

## The as Operator

Try to convert, returning null if it fails:

\`\`\`csharp
object value = "Hello";

string text = value as string;
if (text != null)
{
    Console.WriteLine($"Converted: {text}");
}

// as only works with reference types and nullable value types
int? number = value as int?;  // null (can't convert)
\`\`\`

## is vs as vs Cast

\`\`\`csharp
object obj = "Hello";

// Direct cast - throws if wrong type
string s1 = (string)obj;  // Works
// int i1 = (int)obj;     // Throws InvalidCastException

// as operator - returns null if wrong type
string s2 = obj as string;  // "Hello"
int? i2 = obj as int?;      // null

// is operator - checks type, optionally extracts value
if (obj is string s3)
{
    Console.WriteLine(s3);  // "Hello"
}
\`\`\`

## Type Patterns

\`\`\`csharp
object GetValue() => 42;

var result = GetValue() switch
{
    int n => $"Integer: {n}",
    string s => $"String: {s}",
    bool b => $"Boolean: {b}",
    null => "Null value",
    _ => "Unknown type"
};
\`\`\`

## Constant Patterns

\`\`\`csharp
string GetDescription(int value) => value switch
{
    0 => "Zero",
    1 => "One",
    < 0 => "Negative",
    > 100 => "Large",
    _ => "Other"
};
\`\`\`

## Property Patterns

Check object properties:

\`\`\`csharp
public record Person(string Name, int Age, string Country);

string Describe(Person person) => person switch
{
    { Age: < 18 } => "Minor",
    { Age: >= 65, Country: "USA" } => "US Senior",
    { Name: "Alice" } => "It's Alice!",
    { } => "Adult",  // Any non-null person
    null => "No person"
};
\`\`\`

## Nested Property Patterns

\`\`\`csharp
public record Address(string City, string Country);
public record Customer(string Name, Address Address);

string GetTaxRate(Customer customer) => customer switch
{
    { Address: { Country: "USA", City: "Oregon" } } => "No sales tax",
    { Address: { Country: "USA" } } => "US tax applies",
    { Address: { Country: "UK" } } => "VAT applies",
    _ => "Unknown tax situation"
};

// C# 10+ simplified nested patterns
string GetTaxRateSimple(Customer customer) => customer switch
{
    { Address.Country: "USA", Address.City: "Oregon" } => "No sales tax",
    { Address.Country: "USA" } => "US tax applies",
    _ => "Unknown"
};
\`\`\`

## Relational Patterns

\`\`\`csharp
string GetGrade(int score) => score switch
{
    >= 90 => "A",
    >= 80 and < 90 => "B",
    >= 70 and < 80 => "C",
    >= 60 and < 70 => "D",
    < 60 => "F"
};
\`\`\`

## Combining Patterns with and, or, not

\`\`\`csharp
bool IsLetter(char c) => c is (>= 'a' and <= 'z') or (>= 'A' and <= 'Z');

bool IsNotNull(object obj) => obj is not null;

string Categorize(int n) => n switch
{
    > 0 and < 10 => "Single digit positive",
    < 0 and > -10 => "Single digit negative",
    0 => "Zero",
    _ => "Multiple digits"
};
\`\`\`

## Tuple Patterns

\`\`\`csharp
string RockPaperScissors(string player1, string player2)
    => (player1, player2) switch
    {
        ("rock", "scissors") => "Player 1 wins",
        ("scissors", "paper") => "Player 1 wins",
        ("paper", "rock") => "Player 1 wins",
        ("scissors", "rock") => "Player 2 wins",
        ("paper", "scissors") => "Player 2 wins",
        ("rock", "paper") => "Player 2 wins",
        (_, _) when player1 == player2 => "Tie",
        _ => "Invalid input"
    };
\`\`\`

## List Patterns (C# 11+)

\`\`\`csharp
string DescribeArray(int[] arr) => arr switch
{
    [] => "Empty",
    [var single] => $"Single: {single}",
    [var first, var second] => $"Pair: {first}, {second}",
    [var first, .., var last] => $"From {first} to {last}",
};

// Slice patterns
bool StartsWithZero(int[] arr) => arr is [0, ..];
bool EndsWithNine(int[] arr) => arr is [.., 9];
bool HasMiddleElement(int[] arr) => arr is [_, var middle, _];
\`\`\`

## When Guards

Add conditions to patterns:

\`\`\`csharp
string Classify(object obj) => obj switch
{
    int n when n < 0 => "Negative integer",
    int n when n == 0 => "Zero",
    int n when n > 0 => "Positive integer",
    string s when s.Length == 0 => "Empty string",
    string s when s.Length < 10 => "Short string",
    string s => "Long string",
    _ => "Something else"
};
\`\`\`

## Type Testing in Methods

\`\`\`csharp
public void Process(object item)
{
    // Traditional approach
    if (item is string str)
    {
        Console.WriteLine($"String: {str.ToUpper()}");
    }
    else if (item is int num)
    {
        Console.WriteLine($"Int: {num * 2}");
    }
    else if (item is IEnumerable<int> numbers)
    {
        Console.WriteLine($"Ints: {string.Join(", ", numbers)}");
    }
}
\`\`\`

## Null Checking Patterns

\`\`\`csharp
// C# 9+ null checking patterns
void ProcessValue(string? input)
{
    if (input is not null)
    {
        Console.WriteLine(input.Length);
    }

    // With variable binding
    if (input is { Length: > 0 } validInput)
    {
        Console.WriteLine(validInput);
    }
}

// Switch with null handling
string Handle(object? obj) => obj switch
{
    null => "Null",
    string { Length: 0 } => "Empty string",
    string s => $"String: {s}",
    _ => "Other"
};
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use is and as operators for type checking
- Apply pattern matching in switch expressions
- Combine patterns with and, or, not
- Use property patterns for complex matching
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Type Checking',
      description: `Use the is operator with variable binding.

**Your task:**
1. Create a method \`ProcessObject\` that takes an object parameter
2. Use \`is\` to check if it's a string and print it uppercased
3. Use \`is\` to check if it's an int and print it doubled
4. Print "Unknown" for other types
5. Test with "hello", 21, and 3.14`,
      starterCode: `// Step 1-4: Create ProcessObject method


// Step 5: Test with different types

`,
      solution: `void ProcessObject(object obj)
{
    if (obj is string text)
    {
        Console.WriteLine(text.ToUpper());
    }
    else if (obj is int number)
    {
        Console.WriteLine(number * 2);
    }
    else
    {
        Console.WriteLine("Unknown");
    }
}

ProcessObject("hello");
ProcessObject(21);
ProcessObject(3.14);`,
      expectedOutput: ['HELLO', '42', 'Unknown'],
      hints: [
        'is with pattern: if (obj is string text)',
        'The variable is only available inside the if block',
        'int check doesn\'t match double (3.14)'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Switch Expression',
      description: `Use a switch expression with type patterns.

**Your task:**
1. Create a method \`DescribeType\` that takes an object
2. Use switch expression to return:
   - "Integer: {value}" for int
   - "Text: {value}" for string
   - "Decimal: {value}" for double
   - "Unknown" for anything else
3. Test with 42, "hello", and 3.14`,
      starterCode: `// Step 1-2: Create DescribeType method


// Step 3: Test with different types

`,
      solution: `string DescribeType(object obj) => obj switch
{
    int i => $"Integer: {i}",
    string s => $"Text: {s}",
    double d => $"Decimal: {d}",
    _ => "Unknown"
};

Console.WriteLine(DescribeType(42));
Console.WriteLine(DescribeType("hello"));
Console.WriteLine(DescribeType(3.14));`,
      expectedOutput: ['Integer: 42', 'Text: hello', 'Decimal: 3.14'],
      hints: [
        'Switch expression: obj switch { pattern => result }',
        'Type pattern with variable: int i',
        '_ is the default case'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Property Pattern',
      description: `Use property patterns to match based on object properties.

**Your task:**
1. Create a record \`Product(string Name, decimal Price)\`
2. Create a method \`GetPriceCategory\` using switch expression:
   - Price < 10: "Budget"
   - Price < 50: "Standard"
   - Price >= 50: "Premium"
3. Test with products priced at 5, 25, and 100`,
      starterCode: `// Step 1: Create Product record


// Step 2: Create GetPriceCategory method


// Step 3: Test with products

`,
      solution: `public record Product(string Name, decimal Price);

string GetPriceCategory(Product product) => product switch
{
    { Price: < 10 } => "Budget",
    { Price: < 50 } => "Standard",
    { Price: >= 50 } => "Premium"
};

Console.WriteLine(GetPriceCategory(new Product("Pen", 5)));
Console.WriteLine(GetPriceCategory(new Product("Book", 25)));
Console.WriteLine(GetPriceCategory(new Product("Watch", 100)));`,
      expectedOutput: ['Budget', 'Standard', 'Premium'],
      hints: [
        'Property pattern: { Price: < 10 }',
        'Relational patterns: <, >, >=, <=',
        'Match goes top to bottom'
      ],
    }
  ],
  quiz: [
    {
      question: 'What is the difference between "is" and "as" operators?',
      options: [
        'They are the same',
        'is returns bool/binds variable; as returns the casted object or null',
        'is is faster than as',
        'as only works with value types'
      ],
      correctIndex: 1,
      explanation: 'The "is" operator checks type and optionally binds a variable. The "as" operator attempts conversion and returns null on failure.'
    },
    {
      question: 'What does the underscore (_) represent in a switch expression?',
      options: [
        'An error case',
        'A null value',
        'The default/wildcard pattern that matches anything',
        'An unused variable'
      ],
      correctIndex: 2,
      explanation: 'The underscore is the discard pattern, matching any value not matched by previous patterns.'
    },
    {
      question: 'What does { Name: "Alice" } match?',
      options: [
        'Any object with a Name property equal to "Alice"',
        'Only strings equal to "Alice"',
        'A dictionary with key "Name"',
        'Any object named Alice'
      ],
      correctIndex: 0,
      explanation: 'Property patterns like { Name: "Alice" } match objects where the Name property equals "Alice".'
    },
    {
      question: 'What happens if no pattern matches in a switch expression?',
      options: [
        'Returns null',
        'Returns default value',
        'Throws SwitchExpressionException',
        'Compiles with a warning'
      ],
      correctIndex: 2,
      explanation: 'If no pattern matches and there\'s no default (_) case, a SwitchExpressionException is thrown at runtime.'
    }
  ],
  buildNote: {
    title: 'Type Checking in C# Applications',
    explanation: `Pattern matching is increasingly used in modern C#. ASP.NET Core middleware uses type patterns. Exception handling benefits from pattern matching. LINQ operations often combine with is/as for type filtering. Switch expressions make complex branching logic cleaner and more maintainable.`,
    relatedFiles: [
      'src/components/OutputPanel.tsx'
    ],
    inTheRealWorld: `Production C# code uses pattern matching extensively. API controllers use property patterns for request validation. Domain logic uses discriminated unions with pattern matching. Error handling uses type patterns to handle different exception types. The evolution of C# pattern matching (from 7.0 to 11+) has dramatically improved code readability.`
  }
};
