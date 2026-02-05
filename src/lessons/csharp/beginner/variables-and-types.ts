import { Lesson } from '@/types/lesson';

export const variablesAndTypes: Lesson = {
  slug: 'csharp-variables-and-types',
  title: 'Variables & Types',
  description: 'Learn to declare variables with explicit type annotations using int, string, bool, and double in C#.',
  difficulty: 'beginner',
  order: 1,
  content: `
# Variables & Types in C#

C# is a strongly-typed language where every variable must have a declared type. This prevents bugs by catching type mismatches at compile time rather than at runtime.

## The Four Basic Types

In C#, the most common primitive types are:

- **string** - text data like names, messages, or URLs
- **int** - whole numbers (integers) like 5, -10, 42
- **double** - decimal numbers like 3.14, -10.5, 99.99
- **bool** - true or false values

Type annotations are written before the variable name:

\`\`\`csharp
string message = "Hello, C#!";
int count = 42;
double price = 19.99;
bool isActive = true;
\`\`\`

## More String Examples

**What this example does:** Shows how to create, combine, and manipulate text in C#.

**When you'd use this:** User names, messages, emails, URLs, form inputs, display text - anywhere you work with text.

\`\`\`csharp
// BASIC STRING CREATION
string single = "Hello";
string name = "World";

// COMBINING STRINGS (Concatenation)
// Use + to join strings together
string combined = single + ", " + name + "!";  // Result: "Hello, World!"

// STRING INTERPOLATION (Recommended!)
// Start with $ then use {variable} to insert values
// This is cleaner and easier to read
string greeting = $"Hello, {name}!";  // Result: "Hello, World!"

// MULTI-LINE STRINGS
// Start with @ to keep line breaks and special characters
string multiline = @"
  This is line 1
  This is line 2
";

// USEFUL STRING METHODS
// .ToUpper() makes everything UPPERCASE
string upper = "hello".ToUpper();    // Result: "HELLO"

// .Length tells you how many characters
int length = "hello".Length;         // Result: 5
\`\`\`

**Real-world example:** Building a personalized email greeting:
\`\`\`csharp
string firstName = "Sarah";
string orderNumber = "12345";
string emailSubject = $"Hi {firstName}, your order #{orderNumber} has shipped!";
// Result: "Hi Sarah, your order #12345 has shipped!"
\`\`\`

## More Number Examples

**What this example does:** Shows how to work with whole numbers (int) and decimal numbers (double) in C#.

**When you'd use this:** Prices, quantities, scores, ages, measurements, calculations - any math operations.

\`\`\`csharp
// INTEGERS (int) - Whole numbers only
// Use for counts, IDs, ages, quantities
int integer = 42;
int negative = -100;
int million = 1_000_000;  // Underscores make big numbers readable!

// DOUBLES (double) - Decimal numbers
// Use for prices, measurements, percentages
double price = 3.14159;
double scientific = 1.5e6;    // Scientific notation = 1,500,000

// BASIC MATH OPERATIONS
int sum = 10 + 5;              // Addition: 15
int product = 10 * 5;          // Multiplication: 50
double quotient = 10.0 / 3.0;  // Division: 3.333...
int remainder = 10 % 3;        // Modulo (remainder): 1

// MATH CLASS FUNCTIONS
// Math.Round() rounds to nearest whole number
double rounded = Math.Round(3.7);    // Result: 4

// Math.Floor() always rounds DOWN
double floored = Math.Floor(3.7);    // Result: 3

// Random numbers
double random = new Random().NextDouble();  // Result: 0.0 to 1.0
\`\`\`

**Real-world example:** Calculating a restaurant bill with tip:
\`\`\`csharp
double mealPrice = 45.50;
double tipPercent = 0.20;  // 20% tip
double tip = mealPrice * tipPercent;  // $9.10
double total = mealPrice + tip;       // $54.60
Console.WriteLine($"Meal: {mealPrice:C}, Tip: {tip:C}, Total: {total:C}");
\`\`\`

## More Boolean Examples

**What this example does:** Shows how to work with true/false values for making decisions in your code.

**When you'd use this:** Login status, permissions, form validation, feature toggles, any yes/no decision.

\`\`\`csharp
// BASIC BOOLEAN VALUES
// Use for anything that's either ON or OFF, YES or NO
bool isLoggedIn = true;      // Is the user signed in?
bool hasPermission = false;  // Can they access this feature?

// COMPARISON OPERATORS (return true or false)
bool isEqual = 5 == 5;       // "Is 5 equal to 5?" → true
bool isGreater = 10 > 5;     // "Is 10 greater than 5?" → true
bool isLess = 3 < 1;         // "Is 3 less than 1?" → false

// LOGICAL OPERATORS (combine conditions)

// AND (&&) - BOTH conditions must be true
bool both = true && false;   // Result: false

// OR (||) - AT LEAST ONE must be true
bool either = true || false; // Result: true

// NOT (!) - Flips true to false, false to true
bool opposite = !true;       // Result: false

// COMMON REAL-WORLD PATTERN
int age = 20;
bool isCitizen = true;
bool isAdult = age >= 18;              // true (20 >= 18)
bool canVote = isAdult && isCitizen;   // true (both are true)
\`\`\`

**Real-world example:** Checking if a user can make a purchase:
\`\`\`csharp
bool isLoggedIn = true;
bool hasPaymentMethod = true;
bool itemInStock = true;
double accountBalance = 100.00;
double itemPrice = 49.99;

bool hasEnoughMoney = accountBalance >= itemPrice;
bool canPurchase = isLoggedIn && hasPaymentMethod && itemInStock && hasEnoughMoney;

Console.WriteLine($"Can purchase: {canPurchase}");  // Output: Can purchase: True
\`\`\`

## Printing Output with Console.WriteLine()

**What this does:** Displays values in the output so you can see what's happening in your code.

**When you'd use this:** Debugging, checking if code works, displaying results to users.

\`\`\`csharp
// BASIC PRINTING
// Put any value inside the parentheses to display it
string name = "Alice";
Console.WriteLine(name);  // Output: Alice

int age = 25;
Console.WriteLine(age);   // Output: 25

bool isStudent = true;
Console.WriteLine(isStudent);  // Output: True
\`\`\`

**Using string interpolation for cleaner output:**

\`\`\`csharp
// LABELED OUTPUT (much easier to read!)
// Use $"text {variable}" to mix text and values
string playerName = "Hero";
int score = 1500;
int level = 5;

Console.WriteLine($"Player: {playerName}");
Console.WriteLine($"Score: {score}");
Console.WriteLine($"Level: {level}");

// Or combine everything on one line:
Console.WriteLine($"Player {playerName} has {score} points at level {level}");
// Output: Player Hero has 1500 points at level 5
\`\`\`

You can also print multiple values or add labels:

\`\`\`csharp
int score = 95;
Console.WriteLine("Your score is: " + score);  // Prints: Your score is: 95

// Using string interpolation (preferred)
Console.WriteLine($"Your score is: {score}");  // Prints: Your score is: 95

// Print multiple values
int x = 10;
int y = 20;
Console.WriteLine($"x: {x}, y: {y}");  // Prints: x: 10, y: 20
\`\`\`

**Important:** In the exercises below, you'll need to use \`Console.WriteLine()\` to display your variables.

## Value Types vs Reference Types

C# distinguishes between value types and reference types:

**Value Types** (stored directly on the stack):
- int, double, bool, char, struct
- Copying creates an independent copy

\`\`\`csharp
int a = 5;
int b = a;  // b gets a copy of the value
b = 10;     // a is still 5
\`\`\`

**Reference Types** (stored on the heap, variable holds a reference):
- string, arrays, classes
- Copying shares the same object (but strings are immutable)

\`\`\`csharp
string s1 = "Hello";
string s2 = s1;  // s2 references same string
// But strings are immutable, so this is safe
\`\`\`

## Constants with const

Use \`const\` for values that never change:

\`\`\`csharp
const double PI = 3.14159;
const string APP_NAME = "My App";
const int MAX_USERS = 100;

// PI = 3.14;  // Error - cannot modify a constant
\`\`\`

## Common Mistakes to Avoid

Here are frequent errors beginners make:

\`\`\`csharp
// WRONG: Using the wrong type
int age = "25";  // Error! "25" is a string

// WRONG: Case sensitivity
String name = "Alice";  // Works but use lowercase 'string'
Int count = 5;         // Error! Use lowercase 'int'

// WRONG: Trying to reassign a const
const int score = 100;
score = 200;  // Error!

// WRONG: Using uninitialized variable
int value;
Console.WriteLine(value);  // Error: use of unassigned variable
\`\`\`

## Why Types Matter

Without proper types, a number might accidentally be treated as text:

\`\`\`csharp
// This won't compile - C# catches this error!
int total = "100";  // Error - cannot assign string to int
\`\`\`

This catches bugs before your code runs, saving you debugging time.

## Quick Reference

| Type | Example Values | Use For |
|------|---------------|---------|
| string | "hello", "world" | Text, names, messages |
| int | 42, -10, 0 | Whole numbers, counts |
| double | 3.14, -10.5 | Decimal numbers, prices |
| bool | true, false | Flags, conditions |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Declare variables with explicit type annotations
- Use string, int, double, and bool types correctly
- Print variable values using Console.WriteLine()
- Understand the difference between value and reference types
- Use constants for values that shouldn't change
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Variable Declarations',
      description: `Create three variables with type annotations, then print them using Console.WriteLine().

**Your task:**
1. Create a string variable called \`greeting\` with the message "Hello, C#!"
2. Create an int constant called \`answer\` with the value 42
3. Create a bool variable called \`isLearning\` set to true
4. Print all three variables using Console.WriteLine()

**Syntax reminder:** \`string name = "value";\` and \`Console.WriteLine(name);\``,
      starterCode: `// Create your three variables below:



// Print all three variables:

`,
      solution: `string greeting = "Hello, C#!";
const int answer = 42;
bool isLearning = true;

Console.WriteLine(greeting);
Console.WriteLine(answer);
Console.WriteLine(isLearning);`,
      expectedOutput: [
        'Hello, C#!',
        '42',
        'True'
      ],
      hints: [
        'Variable syntax: type variableName = value;',
        'Use const for answer since it won\'t change',
        'Boolean values are just: true or false (no quotes)',
        'Print each variable with its own Console.WriteLine() call'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Working with Numbers',
      description: `Practice using both int and double types for different purposes.

**Your task:**
1. Create an int called \`wholeNumber\` with value 100
2. Create a double called \`decimalNumber\` with value 50.5
3. Create a double called \`total\` that adds them together
4. Print all three using Console.WriteLine()

**Note:** When you add int and double, the result is a double.`,
      starterCode: `// Create wholeNumber (int) with value 100


// Create decimalNumber (double) with value 50.5


// Create total (double) that adds them together


// Print all three:

`,
      solution: `int wholeNumber = 100;
double decimalNumber = 50.5;
double total = wholeNumber + decimalNumber;

Console.WriteLine(wholeNumber);
Console.WriteLine(decimalNumber);
Console.WriteLine(total);`,
      expectedOutput: [
        '100',
        '50.5',
        '150.5'
      ],
      hints: [
        'Integer: int wholeNumber = 100;',
        'Double: double decimalNumber = 50.5;',
        'Adding int + double gives double: 100 + 50.5 = 150.5',
        'Print each variable on its own line'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Calculating Tax',
      description: `Practice calculations with constants and variables.

**Your task:**
1. Create a const double called \`taxRate\` set to 0.08 (8% tax rate)
2. Create a double called \`price\` set to 100.0
3. Calculate the tax: multiply price by taxRate and store in a double called \`tax\`
4. Update price to include the tax (add tax to price)
5. Print the final price

**Expected output:** 108 (which is 100 + 8% tax)`,
      starterCode: `// Create the tax rate constant (0.08)


// Create the price variable (100.0)


// Calculate the tax amount


// Add tax to price


// Print the final price

`,
      solution: `const double taxRate = 0.08;
double price = 100.0;
double tax = price * taxRate;
price = price + tax;

Console.WriteLine(price);`,
      expectedOutput: [
        '108'
      ],
      hints: [
        'taxRate uses const because tax rates don\'t change mid-calculation',
        'price uses double because you need decimals and will update it',
        'Calculate tax: double tax = price * taxRate;',
        'Update price: price = price + tax;'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: User Profile Variables',
      description: `Create a set of variables to represent a user's profile information.

**Your task:**
1. Create a string constant called \`username\` with value "player_one"
2. Create an int variable called \`score\` with value 0
3. Create a bool variable called \`isOnline\` with value true
4. Update score to 150 (the player earned points!)
5. Print all three variables in order: username, score, isOnline

**Think about:** Why is username a const but score is a regular variable?`,
      starterCode: `// Create username (const - usernames don't change)


// Create score (int - scores change during gameplay)


// Create isOnline status (bool - can go offline)


// Update the score to 150


// Print all three variables:



`,
      solution: `const string username = "player_one";
int score = 0;
bool isOnline = true;

score = 150;

Console.WriteLine(username);
Console.WriteLine(score);
Console.WriteLine(isOnline);`,
      expectedOutput: [
        'player_one',
        '150',
        'True'
      ],
      hints: [
        'Username is const because it shouldn\'t change: const string username = "player_one";',
        'Score uses int because it gets updated: int score = 0;',
        'Update score with: score = 150;',
        'Print in order: username first, then score, then isOnline'
      ]
    }
  ],
  quiz: [
    {
      question: 'Which keyword should you use for a value that will never be reassigned in C#?',
      options: ['var', 'let', 'const', 'static'],
      correctIndex: 2,
      explanation: 'const declares a constant that cannot be reassigned. Use it for values that should never change, like configuration values or tax rates.'
    },
    {
      question: 'What is the correct way to declare an integer variable in C#?',
      options: [
        'let count = 42;',
        'int count = 42;',
        'var count: int = 42;',
        'integer count = 42;'
      ],
      correctIndex: 1,
      explanation: 'In C#, the type comes before the variable name: int count = 42;'
    },
    {
      question: 'What happens if you try to assign a string to a variable declared as int?',
      options: [
        'C# converts it automatically',
        'The code runs but with undefined behavior',
        'C# shows a compile-time error',
        'The string becomes 0'
      ],
      correctIndex: 2,
      explanation: 'C# catches type mismatches at compile time, before your code runs. This prevents bugs from making it to production.'
    },
    {
      question: 'Which type should you use for a price like $19.99?',
      options: [
        'int',
        'string',
        'bool',
        'double'
      ],
      correctIndex: 3,
      explanation: 'Use double for decimal numbers like prices. int can only hold whole numbers, so it can\'t represent $19.99 accurately.'
    }
  ],
  buildNote: {
    title: 'Variables & Types in C# Applications',
    explanation: `C# applications use strong typing extensively. In ASP.NET Core, model classes define the shape of data with explicit types for each property. Entity Framework uses typed DbSet<T> collections to represent database tables. Configuration values are often stored as constants in static classes. The compiler verifies all type assignments at build time, catching errors before the application runs. This is especially important in enterprise applications where type safety prevents entire categories of bugs.`,
    relatedFiles: [
      'Models/User.cs',
      'appsettings.json',
      'Program.cs'
    ],
    inTheRealWorld: `In production C# codebases, type annotations are crucial for maintainability. Large codebases like .NET itself, Visual Studio, and Azure services use C# with strict type checking. Model classes use specific types like decimal for financial calculations (more precise than double), DateTime for timestamps, and Guid for unique identifiers. Libraries like Entity Framework and ASP.NET Core rely heavily on types for database mapping and request binding.`
  }
};
