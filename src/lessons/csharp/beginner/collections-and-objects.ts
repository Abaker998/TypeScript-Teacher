import { Lesson } from '@/types/lesson';

export const collectionsAndObjects: Lesson = {
  slug: 'csharp-collections-and-objects',
  title: 'Collections & Objects',
  description: 'Learn to create typed arrays, lists, and dictionaries with consistent, predictable structures in C#.',
  difficulty: 'beginner',
  order: 4,
  content: `
# Collections & Objects in C#

Beyond individual variables, C# lets you create collections of data - arrays, lists, and dictionaries - and specify what types those collections should hold.

## Arrays

An array is a fixed-size list of values. All values must have the same type:

\`\`\`csharp
string[] names = new string[] { "Alice", "Bob", "Charlie" };
int[] scores = new int[] { 95, 87, 92 };
bool[] flags = new bool[] { true, false, true };

// Simplified syntax
string[] colors = { "red", "green", "blue" };
int[] numbers = { 1, 2, 3, 4, 5 };
\`\`\`

## Common Array Operations

\`\`\`csharp
string[] fruits = { "apple", "banana", "cherry" };

// Access items
Console.WriteLine(fruits[0]);        // "apple" (first item)
Console.WriteLine(fruits.Length);    // 3 (number of items)

// Modify items
fruits[1] = "blueberry";             // Replace "banana"

// Find items
int index = Array.IndexOf(fruits, "cherry");  // 2
bool hasApple = fruits.Contains("apple");     // true
\`\`\`

**Note:** Arrays have a fixed size. You can't add or remove elements after creation.

## Lists - Dynamic Size Collections

For collections that need to grow or shrink, use List<T>:

\`\`\`csharp
List<string> fruits = new List<string> { "apple", "banana" };

// Add items
fruits.Add("cherry");           // Add to end
fruits.Insert(0, "apricot");    // Add at index

// Remove items
fruits.Remove("banana");        // Remove by value
fruits.RemoveAt(0);             // Remove by index

// Access items
Console.WriteLine(fruits[0]);   // First item
Console.WriteLine(fruits.Count); // Number of items

// Check if item exists
bool hasApple = fruits.Contains("apple");
\`\`\`

## Dictionaries - Key-Value Pairs

Store data with unique keys:

\`\`\`csharp
Dictionary<string, int> ages = new Dictionary<string, int>
{
    { "Alice", 30 },
    { "Bob", 25 },
    { "Charlie", 35 }
};

// Access by key
Console.WriteLine(ages["Alice"]);  // 30

// Add new entry
ages["Dave"] = 28;

// Check if key exists
if (ages.ContainsKey("Alice"))
{
    Console.WriteLine("Alice is in the dictionary");
}

// Safe access with TryGetValue
if (ages.TryGetValue("Eve", out int eveAge))
{
    Console.WriteLine(eveAge);
}
else
{
    Console.WriteLine("Eve not found");
}
\`\`\`

## LINQ - Querying Collections

C# has powerful built-in methods for working with collections:

\`\`\`csharp
List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };

// Select: transform each item (like map)
var doubled = numbers.Select(n => n * 2).ToList();
// [2, 4, 6, 8, 10]

// Where: keep items that match (like filter)
var evens = numbers.Where(n => n % 2 == 0).ToList();
// [2, 4]

// First: get first match
int firstBig = numbers.First(n => n > 3);  // 4

// Sum, Average, Min, Max
int sum = numbers.Sum();       // 15
double avg = numbers.Average(); // 3

// Any, All
bool hasEven = numbers.Any(n => n % 2 == 0);  // true
bool allPositive = numbers.All(n => n > 0);   // true
\`\`\`

## Classes - Custom Object Types

Define your own types with classes:

\`\`\`csharp
class User
{
    public string Name { get; set; }
    public int Age { get; set; }
    public bool IsActive { get; set; }
}

// Create instances
User user = new User
{
    Name = "Alice",
    Age = 30,
    IsActive = true
};

Console.WriteLine(user.Name);   // "Alice"
Console.WriteLine(user.Age);    // 30
\`\`\`

## Lists of Objects

Combine List<T> with custom classes:

\`\`\`csharp
class Product
{
    public string Name { get; set; }
    public double Price { get; set; }
    public bool InStock { get; set; }
}

List<Product> products = new List<Product>
{
    new Product { Name = "Laptop", Price = 999.99, InStock = true },
    new Product { Name = "Mouse", Price = 29.99, InStock = false }
};

// Access specific product
Console.WriteLine(products[0].Name);  // "Laptop"

// Find products with LINQ
var inStock = products.Where(p => p.InStock).ToList();
var names = products.Select(p => p.Name).ToList();  // ["Laptop", "Mouse"]
\`\`\`

## Records - Immutable Data Objects

For simple data containers, use records (C# 9+):

\`\`\`csharp
record Person(string Name, int Age);

var alice = new Person("Alice", 30);
Console.WriteLine(alice.Name);  // "Alice"

// Records are immutable - create new with changes
var olderAlice = alice with { Age = 31 };
\`\`\`

## Anonymous Types

Quick inline objects when you don't need a full class:

\`\`\`csharp
var person = new { Name = "Alice", Age = 30 };
Console.WriteLine(person.Name);  // "Alice"

// Useful with LINQ
var summaries = products.Select(p => new { p.Name, p.Price }).ToList();
\`\`\`

## Common Mistakes to Avoid

\`\`\`csharp
// WRONG: Array index out of bounds
string[] arr = { "a", "b" };
Console.WriteLine(arr[5]);  // Runtime error!

// WRONG: Adding to array (arrays are fixed size)
string[] arr2 = { "a", "b" };
// arr2.Add("c");  // Error! Arrays don't have Add

// WRONG: Accessing dictionary with missing key
Dictionary<string, int> ages = new Dictionary<string, int>();
// Console.WriteLine(ages["missing"]);  // KeyNotFoundException!

// RIGHT: Check first or use TryGetValue
if (ages.TryGetValue("missing", out int age))
{
    Console.WriteLine(age);
}
\`\`\`

## Quick Reference

| Type | Use Case | Syntax |
|------|----------|--------|
| Array | Fixed-size collection | \`int[] nums = { 1, 2, 3 };\` |
| List<T> | Dynamic collection | \`List<int> nums = new List<int>();\` |
| Dictionary | Key-value pairs | \`Dictionary<string, int> dict = new();\` |
| Class | Custom object type | \`class User { public string Name; }\` |
| Record | Immutable data | \`record Person(string Name);\` |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Declare arrays with specific element types
- Use List<T> for dynamic collections
- Create and query dictionaries
- Define custom types with classes
- Use LINQ to transform and filter collections
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Arrays and Lists',
      description: `Create a typed array and a List.

**Your task:**
1. Create a string array called \`names\` with values "Alice", "Bob", "Charlie"
2. Create a List<int> called \`scores\` with values 95, 87, 92
3. Print the first name (index 0)
4. Print the count of scores

**Array syntax:** \`string[] names = { "a", "b", "c" };\`
**List syntax:** \`List<int> scores = new List<int> { 1, 2, 3 };\``,
      starterCode: `// Create a string array with "Alice", "Bob", "Charlie"


// Create a List<int> with scores 95, 87, 92


// Print the first name (index 0)


// Print the count of scores

`,
      solution: `string[] names = { "Alice", "Bob", "Charlie" };

List<int> scores = new List<int> { 95, 87, 92 };

Console.WriteLine(names[0]);
Console.WriteLine(scores.Count);`,
      expectedOutput: ['Alice', '3'],
      hints: [
        'Array: string[] names = { "Alice", "Bob", "Charlie" };',
        'List: List<int> scores = new List<int> { 95, 87, 92 };',
        'First element: names[0]',
        'Count property for lists: scores.Count'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Dictionary Operations',
      description: `Create and use a Dictionary for key-value data.

**Your task:**
1. Create a Dictionary<string, int> called \`ages\` with:
   - "Alice" -> 30
   - "Bob" -> 25
2. Add "Charlie" -> 35 to the dictionary
3. Print Alice's age
4. Print the total number of entries

**Dictionary syntax:** \`Dictionary<string, int> dict = new Dictionary<string, int> { { "key", value } };\``,
      starterCode: `// Create a Dictionary with Alice -> 30, Bob -> 25


// Add Charlie -> 35


// Print Alice's age


// Print the count of entries

`,
      solution: `Dictionary<string, int> ages = new Dictionary<string, int>
{
    { "Alice", 30 },
    { "Bob", 25 }
};

ages["Charlie"] = 35;

Console.WriteLine(ages["Alice"]);
Console.WriteLine(ages.Count);`,
      expectedOutput: ['30', '3'],
      hints: [
        'Dictionary initialization: { { "Alice", 30 }, { "Bob", 25 } }',
        'Add/update: ages["Charlie"] = 35;',
        'Access by key: ages["Alice"]',
        'Count property: ages.Count'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Working with Classes',
      description: `Create a simple class and use it.

**Your task:**
1. The Product class is provided below
2. Create a Product called \`laptop\` with Name "Laptop" and Price 999.99
3. Create a Product called \`mouse\` with Name "Mouse" and Price 29.99
4. Print the laptop's name
5. Print the mouse's price

**Class instantiation:** \`var item = new Product { Name = "Item", Price = 10.0 };\``,
      starterCode: `// Product class is provided
class Product
{
    public string Name { get; set; }
    public double Price { get; set; }
}

// Create laptop with Name "Laptop", Price 999.99


// Create mouse with Name "Mouse", Price 29.99


// Print the laptop's name


// Print the mouse's price

`,
      solution: `class Product
{
    public string Name { get; set; }
    public double Price { get; set; }
}

var laptop = new Product { Name = "Laptop", Price = 999.99 };
var mouse = new Product { Name = "Mouse", Price = 29.99 };

Console.WriteLine(laptop.Name);
Console.WriteLine(mouse.Price);`,
      expectedOutput: ['Laptop', '29.99'],
      hints: [
        'Create object: var laptop = new Product { Name = "Laptop", Price = 999.99 };',
        'Access properties: laptop.Name, mouse.Price',
        'Property names must match the class definition',
        'Use dot notation to access: object.Property'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: LINQ Basics',
      description: `Use LINQ to query and transform collections.

**Your task:**
1. Create a List<int> with values 1, 2, 3, 4, 5
2. Use Where() to filter only even numbers
3. Use Sum() to get the total
4. Print the count of even numbers
5. Print the sum of all numbers

**LINQ example:** \`var evens = numbers.Where(n => n % 2 == 0).ToList();\``,
      starterCode: `// Create a List<int> with values 1, 2, 3, 4, 5


// Filter to get only even numbers (use Where)


// Get the sum of all original numbers


// Print count of even numbers


// Print the sum

`,
      solution: `List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };

var evens = numbers.Where(n => n % 2 == 0).ToList();

int sum = numbers.Sum();

Console.WriteLine(evens.Count);
Console.WriteLine(sum);`,
      expectedOutput: ['2', '15'],
      hints: [
        'List: List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };',
        'Filter evens: numbers.Where(n => n % 2 == 0).ToList()',
        'Sum all: numbers.Sum()',
        'Even numbers are 2 and 4 (count = 2), sum of all is 15'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the difference between an array and a List in C#?',
      options: [
        'Arrays are faster',
        'Arrays have fixed size, Lists can grow and shrink',
        'Lists can only hold strings',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'Arrays have a fixed size determined at creation. List<T> can dynamically add and remove elements with Add(), Remove(), etc.'
    },
    {
      question: 'How do you safely access a Dictionary value when the key might not exist?',
      options: [
        'dict.Get(key)',
        'dict.SafeGet(key)',
        'dict.TryGetValue(key, out value)',
        'dict[key] ?? default'
      ],
      correctIndex: 2,
      explanation: 'TryGetValue returns true if the key exists and assigns the value to the out parameter, or returns false without throwing an exception.'
    },
    {
      question: 'What does the Where() LINQ method do?',
      options: [
        'Transforms each element to a new value',
        'Filters elements that match a condition',
        'Finds the first matching element',
        'Combines all elements into one'
      ],
      correctIndex: 1,
      explanation: 'Where() filters a collection, keeping only elements that satisfy the predicate. It\'s like filter() in other languages.'
    },
    {
      question: 'What is a record in C#?',
      options: [
        'A database row',
        'A type of array',
        'An immutable data type with value-based equality',
        'A method that logs data'
      ],
      correctIndex: 2,
      explanation: 'Records are reference types that provide value-based equality and are typically immutable. They\'re great for simple data transfer objects.'
    }
  ],
  buildNote: {
    title: 'Collections in C# Applications',
    explanation: `C# applications heavily use generic collections. Entity Framework returns IQueryable<T> and List<T> from database queries. ASP.NET Core model binding can deserialize JSON arrays into List<T> or arrays. Dictionaries are commonly used for caching and lookup tables. LINQ methods like Where, Select, and GroupBy are used extensively to query in-memory data and databases alike. The type parameter <T> ensures compile-time safety - you can't accidentally add a string to a List<int>.`,
    relatedFiles: [
      'Models/Order.cs',
      'Services/OrderService.cs',
      'Controllers/OrdersController.cs'
    ],
    inTheRealWorld: `Professional C# code uses collections everywhere. Entity Framework queries return typed collections that map to database tables. API endpoints accept and return List<T> serialized as JSON arrays. Dictionaries power configuration systems and caching layers. LINQ to Objects and LINQ to Entities share the same syntax, so queries work the same whether data is in memory or in a database. Understanding collections and LINQ is essential for any C# developer.`
  }
};
