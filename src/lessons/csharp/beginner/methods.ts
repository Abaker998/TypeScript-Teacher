import { Lesson } from '@/types/lesson';

export const methods: Lesson = {
  slug: 'csharp-methods',
  title: 'Methods',
  description: 'Learn to write typed methods with parameter types and return type annotations in C#.',
  difficulty: 'beginner',
  order: 3,
  content: `
# Methods in C#

Methods are reusable blocks of code that perform specific tasks. In C#, you must declare the types of parameters and the return type, making your methods safer and more self-documenting.

## Method Basics

A C# method declares the return type, name, and typed parameters:

\`\`\`csharp
string Greet(string name)
{
    return "Hello, " + name + "!";
}

string result = Greet("Alice");  // result is "Hello, Alice!"
\`\`\`

The syntax is: **returnType MethodName(parameterType parameterName) { ... }**

## More Method Examples

Here are common method patterns you'll use frequently:

\`\`\`csharp
// Method with multiple parameters
string CreateUser(string name, int age, bool isAdmin)
{
    return $"User: {name}, Age: {age}, Admin: {isAdmin}";
}

// Method that calculates something
int CalculateArea(int width, int height)
{
    return width * height;
}

// Method that checks a condition
bool IsEven(int num)
{
    return num % 2 == 0;
}

// Using the methods
Console.WriteLine(CreateUser("Alice", 30, true));
Console.WriteLine(CalculateArea(5, 10));  // 50
Console.WriteLine(IsEven(4));  // True
\`\`\`

## Expression-Bodied Methods

For simple one-line methods, use the arrow syntax:

\`\`\`csharp
int Add(int a, int b) => a + b;
int Square(int n) => n * n;
bool IsPositive(int n) => n > 0;
string Greet(string name) => $"Hello, {name}!";

int sum = Add(5, 3);  // sum is 8
\`\`\`

## Methods Without Return Values (void)

Some methods perform actions without returning a value. Use the **void** return type:

\`\`\`csharp
void LogMessage(string message)
{
    Console.WriteLine(message);
}

void ShowAlert(string title, string body)
{
    Console.WriteLine($"Alert: {title}");
    Console.WriteLine(body);
}

LogMessage("This prints but returns nothing");
\`\`\`

## Optional Parameters

Parameters can have default values, making them optional:

\`\`\`csharp
string Greet(string name, string greeting = "Hello")
{
    return $"{greeting}, {name}!";
}

Console.WriteLine(Greet("Alice"));           // "Hello, Alice!"
Console.WriteLine(Greet("Bob", "Welcome"));  // "Welcome, Bob!"
\`\`\`

## Named Arguments

You can specify arguments by name for clarity:

\`\`\`csharp
void CreateAccount(string username, string email, int age)
{
    Console.WriteLine($"Creating account for {username}");
}

// Called with named arguments - more readable
CreateAccount(
    username: "alice",
    email: "alice@example.com",
    age: 25
);

// Can reorder when using names
CreateAccount(
    age: 30,
    email: "bob@example.com",
    username: "bob"
);
\`\`\`

## Method Overloading

C# allows multiple methods with the same name but different parameters:

\`\`\`csharp
// Same method name, different parameters
int Add(int a, int b) => a + b;
double Add(double a, double b) => a + b;
string Add(string a, string b) => a + b;

Console.WriteLine(Add(5, 3));        // 8 (calls int version)
Console.WriteLine(Add(5.5, 3.3));    // 8.8 (calls double version)
Console.WriteLine(Add("Hello", " World"));  // "Hello World" (calls string version)
\`\`\`

## ref and out Parameters

Pass by reference to modify the original variable:

\`\`\`csharp
// ref - must be initialized before passing
void Double(ref int value)
{
    value = value * 2;
}

int x = 5;
Double(ref x);
Console.WriteLine(x);  // 10

// out - doesn't need to be initialized, must be assigned in method
void GetDimensions(out int width, out int height)
{
    width = 1920;
    height = 1080;
}

GetDimensions(out int w, out int h);
Console.WriteLine($"{w} x {h}");  // 1920 x 1080
\`\`\`

## params for Variable Arguments

Accept any number of arguments:

\`\`\`csharp
int Sum(params int[] numbers)
{
    int total = 0;
    foreach (int n in numbers)
    {
        total += n;
    }
    return total;
}

Console.WriteLine(Sum(1, 2, 3));       // 6
Console.WriteLine(Sum(10, 20, 30, 40)); // 100
\`\`\`

## Why Method Types Matter

Typed parameters prevent mistakes. Without types, you might call a method incorrectly:

\`\`\`csharp
// C# catches this at compile time!
int CalculateAge(int birthYear)
{
    return 2024 - birthYear;
}

// CalculateAge("2000");  // Error! Cannot convert string to int
CalculateAge(2000);       // OK - returns 24
\`\`\`

## Common Mistakes to Avoid

\`\`\`csharp
// WRONG: Wrong number of arguments
string Greet(string name)
{
    return "Hello " + name;
}
Greet();  // Error: missing argument
Greet("Alice", "Bob");  // Error: too many arguments

// WRONG: Returning wrong type
int GetAge()
{
    return "25";  // Error: cannot convert string to int
}

// WRONG: Not all code paths return a value
int Divide(int a, int b)
{
    if (b != 0)
    {
        return a / b;
    }
    // Error: not all code paths return a value
}
\`\`\`

## Quick Reference

| Feature | Syntax |
|---------|--------|
| Basic method | \`returnType Name(type param) { }\` |
| Expression body | \`returnType Name(type param) => expression;\` |
| Optional param | \`void Name(type param = default)\` |
| Variable args | \`void Name(params type[] args)\` |
| No return | \`void Name() { }\` |
| Pass by ref | \`void Name(ref type param)\` |
| Out parameter | \`void Name(out type param)\` |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write method signatures with typed parameters
- Specify return types explicitly
- Use expression-bodied syntax for simple methods
- Work with optional parameters and method overloading
- Understand when to use void return type
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Typed Method',
      description: `Create a method that adds two numbers together.

**Your task:**
1. Create a method called \`Add\` that takes two int parameters: \`a\` and \`b\`
2. It should return an int (the sum)
3. Call Add(10, 5) and print the result

**Expected output:** 15`,
      starterCode: `// Create a method called 'Add' that takes two ints and returns their sum


// Call Add(10, 5) and store the result


// Print the result

`,
      solution: `int Add(int a, int b)
{
    return a + b;
}

int result = Add(10, 5);
Console.WriteLine(result);`,
      expectedOutput: ['15'],
      hints: [
        'Method syntax: int Add(int a, int b) { return a + b; }',
        'The return type (int) comes before the method name',
        'Inside the method, use return a + b;',
        'Call it with Add(10, 5) and use Console.WriteLine() to print'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Expression-Bodied Methods',
      description: `Learn the concise expression-bodied syntax (one-liners).

**Your task:**
1. Create a \`Multiply\` method using expression-bodied syntax
2. Create a \`Greet\` method that returns "Hello, [name]!"
3. Print Multiply(4, 5)
4. Print Greet("C#")

**Expression syntax example:** \`int Double(int n) => n * 2;\``,
      starterCode: `// Create Multiply using expression-bodied syntax (=>)


// Create Greet that takes a name and returns "Hello, [name]!"


// Print Multiply(4, 5) and Greet("C#")

`,
      solution: `int Multiply(int a, int b) => a * b;

string Greet(string name) => $"Hello, {name}!";

Console.WriteLine(Multiply(4, 5));
Console.WriteLine(Greet("C#"));`,
      expectedOutput: ['20', 'Hello, C#!'],
      hints: [
        'Expression syntax: int Multiply(int a, int b) => a * b;',
        'No curly braces {} needed with => syntax',
        'For Greet, use string interpolation: $"Hello, {name}!"',
        'Print directly: Console.WriteLine(Multiply(4, 5));'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Default Parameters',
      description: `Create a method with a default parameter value.

**Your task:**
1. Create a \`FormatPrice\` method that takes:
   - \`price\`: double (required)
   - \`currency\`: string (optional, defaults to "$")
2. Return the currency + price as a string
3. Call FormatPrice(99.99) - should use default "$"
4. Call FormatPrice(49.99, "EUR ") - uses "EUR "

**Default parameter syntax:** \`string Greet(string name = "friend")\``,
      starterCode: `// Create FormatPrice with price (required) and currency (defaults to "$")
// Return the currency + price as a string


// Call FormatPrice(99.99) - should use default currency


// Call FormatPrice(49.99, "EUR ") - uses custom currency

`,
      solution: `string FormatPrice(double price, string currency = "$")
{
    return currency + price;
}

Console.WriteLine(FormatPrice(99.99));
Console.WriteLine(FormatPrice(49.99, "EUR "));`,
      expectedOutput: ['$99.99', 'EUR 49.99'],
      hints: [
        'Default parameter: string currency = "$"',
        'The = "$" means if no argument is passed, use "$"',
        'Return currency + price (they get concatenated into a string)',
        'FormatPrice(99.99) uses "$", FormatPrice(49.99, "EUR ") uses "EUR "'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Method Overloading',
      description: `Create overloaded methods - same name, different parameters.

**Your task:**
1. Create \`Describe(string name)\` that returns "[name] is a string"
2. Create \`Describe(int number)\` that returns "[number] is an integer"
3. Call both versions and print the results

**Overloading:** Multiple methods with the same name but different parameter types.`,
      starterCode: `// Create Describe(string name) - returns "[name] is a string"


// Create Describe(int number) - returns "[number] is an integer"


// Test with Describe("Hello") and Describe(42)

`,
      solution: `string Describe(string name)
{
    return name + " is a string";
}

string Describe(int number)
{
    return number + " is an integer";
}

Console.WriteLine(Describe("Hello"));
Console.WriteLine(Describe(42));`,
      expectedOutput: ['Hello is a string', '42 is an integer'],
      hints: [
        'Both methods have the same name but different parameter types',
        'C# picks the right version based on the argument type',
        'Describe("Hello") calls the string version',
        'Describe(42) calls the int version'
      ]
    }
  ],
  quiz: [
    {
      question: 'What return type should you use for a method that doesn\'t return anything?',
      options: ['null', 'nothing', 'void', 'empty'],
      correctIndex: 2,
      explanation: 'void indicates a method performs an action but doesn\'t return a value. Use it for methods that just print or have side effects.'
    },
    {
      question: 'What is the correct syntax for a method that multiplies two integers?',
      options: [
        'Multiply(int a, int b): int => a * b;',
        'int Multiply(int a, int b) => a * b;',
        'function Multiply(a: int, b: int): int { return a * b; }',
        'def Multiply(int a, int b) => a * b'
      ],
      correctIndex: 1,
      explanation: 'C# method syntax: returnType MethodName(params) => expression; The return type comes first.'
    },
    {
      question: 'What is method overloading in C#?',
      options: [
        'Making a method do too much work',
        'Multiple methods with the same name but different parameter lists',
        'Calling a method too many times',
        'A method that calls itself'
      ],
      correctIndex: 1,
      explanation: 'Method overloading lets you create multiple methods with the same name but different parameters. C# picks the right version based on the arguments.'
    },
    {
      question: 'What happens if you call a method with the wrong number of arguments in C#?',
      options: [
        'The extra arguments are ignored',
        'Missing arguments become null',
        'C# shows a compile-time error',
        'The method throws a runtime exception'
      ],
      correctIndex: 2,
      explanation: 'C# catches incorrect argument counts at compile time. This prevents bugs where you forget an argument or pass too many.'
    }
  ],
  buildNote: {
    title: 'Methods in C# Applications',
    explanation: `C# applications are built around methods organized in classes. In ASP.NET Core, controller actions are methods that handle HTTP requests: public IActionResult GetUser(int id). Service classes encapsulate business logic in methods like public async Task<User> CreateUserAsync(UserDto dto). Repository patterns use methods like FindByIdAsync, SaveAsync, and DeleteAsync. The method signature with its return type and parameters acts as a contract that other code depends on. C#'s strong typing ensures that callers must pass the correct types, preventing entire categories of runtime errors.`,
    relatedFiles: [
      'Controllers/UsersController.cs',
      'Services/UserService.cs',
      'Repositories/IUserRepository.cs'
    ],
    inTheRealWorld: `Typed methods are fundamental to C# programming. ASP.NET Core uses conventions based on method signatures - methods returning Task<IActionResult> become async endpoints. Entity Framework Core uses method chaining with typed lambdas: context.Users.Where(u => u.Age > 18).ToListAsync(). Libraries like AutoMapper use method signatures to infer mapping configurations. The compile-time checking of method calls prevents entire categories of bugs that would only appear at runtime in dynamically-typed languages.`
  }
};
