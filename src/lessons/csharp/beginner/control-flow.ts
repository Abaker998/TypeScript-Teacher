import { Lesson } from '@/types/lesson';

export const controlFlow: Lesson = {
  slug: 'csharp-control-flow',
  title: 'Control Flow',
  description: 'Master if/else statements, switch expressions, for loops, while loops, and foreach in C#.',
  difficulty: 'beginner',
  order: 5,
  content: `
# Control Flow in C#

Control flow determines which code runs and when. C# provides powerful constructs for making decisions and repeating actions.

## If/Else Statements

**What this example does:** Makes a decision based on a condition - runs one block of code if true, another if false.

**When you'd use this:** Login validation, age checks, permission checks, form validation, any yes/no decision in your code.

\`\`\`csharp
int age = 18;

if (age >= 18)
{
    Console.WriteLine("Adult");
}
else
{
    Console.WriteLine("Minor");
}
\`\`\`

**Real-world example:** Checking if a user can access premium content:
\`\`\`csharp
bool isPremiumUser = true;
if (isPremiumUser)
{
    Console.WriteLine("Welcome! Enjoy premium features.");
}
else
{
    Console.WriteLine("Upgrade to premium for full access.");
}
\`\`\`

## Comparison Operators

**What this example does:** Shows all the ways to compare two values and get a true/false result.

**When you'd use this:** Price comparisons, score checking, date validation, sorting logic, any time you need to know how two values relate.

\`\`\`csharp
int a = 5;
int b = 10;

bool equal = a == b;      // Equal - false
bool notEqual = a != b;   // Not equal - true
bool greater = a > b;     // Greater than - false
bool less = a < b;        // Less than - true
bool greaterEq = a >= b;  // Greater or equal - false
bool lessEq = a <= b;     // Less or equal - true
\`\`\`

**Real-world example:** Checking if an order qualifies for free shipping:
\`\`\`csharp
double orderTotal = 75.00;
double freeShippingThreshold = 50.00;
bool qualifiesForFreeShipping = orderTotal >= freeShippingThreshold;  // true
\`\`\`

## Logical Operators

Combine conditions with \`&&\` (and), \`||\` (or), and \`!\` (not):

\`\`\`csharp
bool isLoggedIn = true;
bool isAdmin = false;

if (isLoggedIn && isAdmin)
{
    Console.WriteLine("Welcome, admin!");
}
else if (isLoggedIn)
{
    Console.WriteLine("Welcome, user!");
}
else
{
    Console.WriteLine("Please log in");
}
\`\`\`

## For Loops

**What this example does:** Repeats code a specific number of times, keeping track of which iteration you're on.

**When you'd use this:** Processing items by index, generating numbered lists, doing something N times, countdown timers.

\`\`\`csharp
for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i);  // 0, 1, 2, 3, 4
}
\`\`\`

**Real-world example:** Displaying a 5-star rating system:
\`\`\`csharp
int rating = 4;
for (int i = 0; i < rating; i++)
{
    Console.Write("★");  // Prints 4 stars
}
\`\`\`

## Foreach Loops

**What this example does:** Goes through each item in a collection one at a time, without needing to track an index.

**When you'd use this:** Processing lists of users, products, orders - anytime you have a collection and need to do something with each item.

\`\`\`csharp
string[] colors = { "red", "green", "blue" };

foreach (string color in colors)
{
    Console.WriteLine(color);
}
\`\`\`

This is cleaner than using index-based for loops for collections.

**Real-world example:** Sending emails to all subscribers:
\`\`\`csharp
string[] subscribers = { "alice@email.com", "bob@email.com", "carol@email.com" };
foreach (string email in subscribers)
{
    Console.WriteLine($"Sending newsletter to {email}");
}
\`\`\`

## While Loops

**What this example does:** Keeps repeating code as long as a condition remains true - you don't know in advance how many times it will run.

**When you'd use this:** Reading user input until valid, processing data until empty, game loops, retry logic until success.

\`\`\`csharp
int count = 0;

while (count < 3)
{
    Console.WriteLine(count);
    count++;
}
\`\`\`

**Real-world example:** Retrying a network request until it succeeds:
\`\`\`csharp
int attempts = 0;
bool success = false;
while (!success && attempts < 3)
{
    Console.WriteLine($"Attempt {attempts + 1}...");
    // Try to connect
    attempts++;
}
\`\`\`

## Do-While Loops

Execute at least once, then check condition:

\`\`\`csharp
int count = 0;

do
{
    Console.WriteLine(count);
    count++;
} while (count < 3);
\`\`\`

## Switch Statements

**What this example does:** Checks a value against multiple specific cases - cleaner than writing many if/else if statements.

**When you'd use this:** Menu selections, status codes, day of week, user roles, command handling - when you have several specific values to check.

\`\`\`csharp
int day = 1;

switch (day)
{
    case 1:
        Console.WriteLine("Monday");
        break;
    case 2:
        Console.WriteLine("Tuesday");
        break;
    case 6:
    case 7:
        Console.WriteLine("Weekend!");
        break;
    default:
        Console.WriteLine("Other day");
        break;
}
\`\`\`

**Real-world example:** Handling different order statuses:
\`\`\`csharp
string status = "shipped";
switch (status)
{
    case "pending":
        Console.WriteLine("Order is being processed");
        break;
    case "shipped":
        Console.WriteLine("Order is on its way!");
        break;
    case "delivered":
        Console.WriteLine("Order has arrived");
        break;
}
\`\`\`

## Switch Expressions (C# 8+)

**What this example does:** A more concise way to map values - returns a result directly instead of using case/break blocks.

**When you'd use this:** When you need to convert one value to another - status codes to messages, enum values to strings, HTTP codes to descriptions.

\`\`\`csharp
int day = 1;
string dayName = day switch
{
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    4 => "Thursday",
    5 => "Friday",
    6 or 7 => "Weekend",
    _ => "Invalid day"
};
Console.WriteLine(dayName);
\`\`\`

**Real-world example:** Converting HTTP status codes to user-friendly messages:
\`\`\`csharp
int statusCode = 404;
string message = statusCode switch
{
    200 => "Success!",
    400 => "Bad request - check your input",
    404 => "Not found - the page doesn't exist",
    500 => "Server error - try again later",
    _ => "Unknown status"
};
\`\`\`

## Pattern Matching

C# has powerful pattern matching in conditions:

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

// Pattern matching in switch
string Describe(object obj) => obj switch
{
    int n when n > 0 => "Positive integer",
    int n when n < 0 => "Negative integer",
    int => "Zero",
    string s => $"String of length {s.Length}",
    null => "Null value",
    _ => "Unknown type"
};
\`\`\`

## The Ternary Operator

**What this example does:** A one-line shortcut for simple if/else decisions that assign a value.

**When you'd use this:** Quick inline decisions - setting text based on a condition, choosing between two values, simple toggles.

\`\`\`csharp
int age = 20;
string status = age >= 18 ? "adult" : "minor";
Console.WriteLine(status);  // "adult"
\`\`\`

**Real-world example:** Displaying singular or plural text:
\`\`\`csharp
int itemCount = 3;
string itemText = itemCount == 1 ? "item" : "items";
Console.WriteLine($"You have {itemCount} {itemText} in your cart");
// Output: "You have 3 items in your cart"
\`\`\`

## Break and Continue

Control loop execution flow:

\`\`\`csharp
// break: exit loop entirely
for (int i = 1; i <= 10; i++)
{
    if (i == 5)
    {
        break;  // Stop at 5
    }
    Console.WriteLine(i);  // Prints 1, 2, 3, 4
}

// continue: skip to next iteration
for (int i = 1; i <= 5; i++)
{
    if (i == 3)
    {
        continue;  // Skip 3
    }
    Console.WriteLine(i);  // Prints 1, 2, 4, 5
}
\`\`\`

## Null-Conditional and Null-Coalescing

Handle null values elegantly:

\`\`\`csharp
string name = null;

// Null-conditional operator (?.)
int? length = name?.Length;  // null if name is null

// Null-coalescing operator (??)
string displayName = name ?? "Anonymous";  // "Anonymous" if name is null

// Null-coalescing assignment (??=)
name ??= "Default";  // Assign only if null
\`\`\`

## Common Mistakes to Avoid

\`\`\`csharp
// WRONG: Using = instead of ==
if (x = 5) { }  // This assigns, not compares! Won't compile in C#

// WRONG: Forgetting break in switch
switch (day)
{
    case 1:
        Console.WriteLine("Monday");
        // Missing break! Falls through to case 2
    case 2:
        Console.WriteLine("Tuesday");
        break;
}

// WRONG: Infinite loop
int i = 0;
while (i < 10)
{
    Console.WriteLine(i);
    // Forgot i++; — loops forever!
}

// WRONG: Off-by-one error
int[] array = { 1, 2, 3 };
for (int j = 0; j <= array.Length; j++)  // Should be <, not <=
{
    Console.WriteLine(array[j]);  // IndexOutOfRangeException on last iteration!
}
\`\`\`

## Quick Reference

| Statement | Use Case |
|-----------|----------|
| if/else | Binary decisions |
| else if | Multiple conditions |
| switch statement | Many specific values |
| switch expression | Return value based on pattern |
| for | Known number of iterations |
| foreach | Iterate collection elements |
| while | Unknown iterations |
| do-while | At least one iteration |
| break | Exit loop early |
| continue | Skip to next iteration |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write if/else statements with proper C# syntax
- Use comparison and logical operators
- Create for, foreach, and while loops
- Use switch statements and switch expressions
- Understand pattern matching basics
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Conditionals',
      description: `Use an if/else statement to make a decision based on a value.

**Your task:**
1. Create a variable \`score\` with value 85
2. If score is 60 or above, print "Pass"
3. Otherwise, print "Fail"

**If/else syntax:**
\`\`\`
if (condition)
{
    // runs if condition is true
}
else
{
    // runs if condition is false
}
\`\`\``,
      starterCode: `// Create a score variable with value 85


// Write an if/else: if score >= 60, print "Pass", otherwise print "Fail"

`,
      solution: `int score = 85;

if (score >= 60)
{
    Console.WriteLine("Pass");
}
else
{
    Console.WriteLine("Fail");
}`,
      expectedOutput: ['Pass'],
      hints: [
        'First line: int score = 85;',
        'Use >= for "greater than or equal to"',
        'Inside if block: Console.WriteLine("Pass");',
        'Inside else block: Console.WriteLine("Fail");'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Loop Through Array with foreach',
      description: `Use a foreach loop to print each item in an array.

**Your task:**
1. Create an array \`fruits\` with: "apple", "banana", "cherry"
2. Use a foreach loop to print each fruit

**Foreach syntax:**
\`\`\`
foreach (type item in collection)
{
    Console.WriteLine(item);
}
\`\`\``,
      starterCode: `// Create an array of fruits: "apple", "banana", "cherry"


// Use a foreach loop to print each fruit

`,
      solution: `string[] fruits = { "apple", "banana", "cherry" };

foreach (string fruit in fruits)
{
    Console.WriteLine(fruit);
}`,
      expectedOutput: ['apple', 'banana', 'cherry'],
      hints: [
        'Array: string[] fruits = { "apple", "banana", "cherry" };',
        'Foreach: foreach (string fruit in fruits) { }',
        'Inside the loop, fruit becomes each element in order',
        'Print with Console.WriteLine(fruit);'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Counting Loop',
      description: `Use a classic for loop to count from 1 to 5.

**Your task:**
Print the numbers 1, 2, 3, 4, 5 (each on a new line)

**For loop syntax:**
\`\`\`
for (int i = start; i <= end; i++)
{
    Console.WriteLine(i);
}
\`\`\`

**The three parts:**
- \`int i = 1\` - start at 1
- \`i <= 5\` - continue while i is 5 or less
- \`i++\` - add 1 to i after each loop`,
      starterCode: `// Use a for loop to print 1, 2, 3, 4, 5
// Hint: for (int i = start; i <= end; i++) { ... }

`,
      solution: `for (int i = 1; i <= 5; i++)
{
    Console.WriteLine(i);
}`,
      expectedOutput: ['1', '2', '3', '4', '5'],
      hints: [
        'Start: int i = 1 (begin counting at 1)',
        'Condition: i <= 5 (keep going while 5 or less)',
        'Increment: i++ (add 1 after each loop)',
        'Body: Console.WriteLine(i); (print the current number)'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Switch Expression',
      description: `Use a switch expression to convert a number to its day name.

**Your task:**
1. Create a variable \`day\` with value 3
2. Use a switch expression to set \`dayName\` to:
   - 1 => "Monday"
   - 2 => "Tuesday"
   - 3 => "Wednesday"
   - 4 => "Thursday"
   - 5 => "Friday"
   - _ => "Weekend"
3. Print the dayName

**Switch expression syntax:**
\`\`\`
string result = value switch
{
    1 => "One",
    2 => "Two",
    _ => "Other"
};
\`\`\``,
      starterCode: `// Create day with value 3


// Use switch expression to get the day name


// Print the day name

`,
      solution: `int day = 3;

string dayName = day switch
{
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    4 => "Thursday",
    5 => "Friday",
    _ => "Weekend"
};

Console.WriteLine(dayName);`,
      expectedOutput: ['Wednesday'],
      hints: [
        'Create: int day = 3;',
        'Switch expression assigns a value: string dayName = day switch { ... };',
        'Each case: number => "value",',
        '_ is the default case (like "else")'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the result of: 5 == "5" in C#?',
      options: ['true', 'false', 'Compile error', '"5"'],
      correctIndex: 2,
      explanation: 'In C#, you cannot compare int and string with ==. This causes a compile-time error because they are different types.'
    },
    {
      question: 'Which loop is best for iterating over array elements in C#?',
      options: [
        'for (int i = 0; i < arr.Length; i++)',
        'foreach (var item in arr)',
        'while (arr.Length > 0)',
        'for (var key in arr)'
      ],
      correctIndex: 1,
      explanation: 'foreach is the cleanest and most idiomatic way to iterate collection elements in C#. It gives you each value directly without needing an index.'
    },
    {
      question: 'What does the "break" keyword do inside a loop?',
      options: [
        'Pauses the loop temporarily',
        'Skips to the next iteration',
        'Exits the loop completely',
        'Restarts the loop from the beginning'
      ],
      correctIndex: 2,
      explanation: 'break immediately exits the loop. Use continue to skip to the next iteration instead.'
    },
    {
      question: 'What does the _ (underscore) mean in a switch expression?',
      options: [
        'Skip this case',
        'Throw an exception',
        'Default case (matches anything)',
        'Null value'
      ],
      correctIndex: 2,
      explanation: 'The _ is the discard pattern, which matches anything. In switch expressions, it serves as the default case.'
    }
  ],
  buildNote: {
    title: 'Control Flow in C# Applications',
    explanation: `Control flow is everywhere in C# applications. ASP.NET Core middleware uses if/else to check authentication status and route requests. LINQ's Where method is essentially a functional if statement for filtering. Switch expressions are used extensively for pattern matching on API responses and state management. The null-conditional and null-coalescing operators (?. and ??) are essential for safely handling nullable data from databases and external APIs. Entity Framework queries use conditions in Where clauses that translate to SQL WHERE conditions.`,
    relatedFiles: [
      'Controllers/AuthController.cs',
      'Middleware/AuthenticationMiddleware.cs',
      'Services/ValidationService.cs'
    ],
    inTheRealWorld: `Modern C# heavily uses pattern matching and switch expressions. ASP.NET Core uses pattern matching for route matching and model binding. Libraries like MediatR use pattern matching to dispatch commands to handlers. The null-coalescing operators prevent NullReferenceExceptions, which are among the most common runtime errors. C# 11+ adds list patterns and more advanced pattern matching, making control flow even more expressive and safe.`
  }
};
