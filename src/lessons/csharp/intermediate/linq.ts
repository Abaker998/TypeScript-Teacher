import { Lesson } from '@/types/lesson';

export const csharpLinq: Lesson = {
  slug: 'csharp-linq',
  title: 'LINQ',
  description: 'Query and transform data with Language Integrated Query (LINQ).',
  difficulty: 'intermediate',
  order: 18,
  content: `
# LINQ - Language Integrated Query

LINQ provides a consistent way to query data from any source - arrays, lists, databases, XML, and more.

## Method Syntax vs Query Syntax

\`\`\`csharp
int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Method syntax (fluent)
var evensMethod = numbers.Where(n => n % 2 == 0).ToList();

// Query syntax (SQL-like)
var evensQuery = (from n in numbers
                  where n % 2 == 0
                  select n).ToList();

// Both produce: { 2, 4, 6, 8, 10 }
\`\`\`

## Where - Filtering

\`\`\`csharp
var products = GetProducts();

// Filter with condition
var expensive = products.Where(p => p.Price > 100);

// Multiple conditions
var filtered = products.Where(p => p.Price > 50 && p.InStock);

// Query syntax
var cheap = from p in products
            where p.Price < 20
            select p;
\`\`\`

## Select - Projection

\`\`\`csharp
var products = GetProducts();

// Transform to new shape
var names = products.Select(p => p.Name);

// Create anonymous type
var summary = products.Select(p => new {
    p.Name,
    p.Price,
    OnSale = p.Price < 50
});

// Query syntax
var descriptions = from p in products
                   select \$"{p.Name}: {p.Price}";
\`\`\`

## OrderBy / OrderByDescending

\`\`\`csharp
var products = GetProducts();

// Sort ascending
var byPrice = products.OrderBy(p => p.Price);

// Sort descending
var mostExpensive = products.OrderByDescending(p => p.Price);

// Multiple sort criteria
var sorted = products
    .OrderBy(p => p.Category)
    .ThenByDescending(p => p.Price);

// Query syntax
var ordered = from p in products
              orderby p.Price descending
              select p;
\`\`\`

## First, Last, Single

\`\`\`csharp
var numbers = new[] { 1, 2, 3, 4, 5 };

// First element (throws if empty)
int first = numbers.First();                    // 1
int firstEven = numbers.First(n => n % 2 == 0); // 2

// First or default (returns default if empty)
int firstOrZero = numbers.FirstOrDefault();     // 1
int? missing = numbers.FirstOrDefault(n => n > 100); // 0

// Last element
int last = numbers.Last();                      // 5

// Single (throws if not exactly one)
var single = numbers.Single(n => n == 3);       // 3
\`\`\`

## Any, All, Contains

\`\`\`csharp
var numbers = new[] { 1, 2, 3, 4, 5 };

// Check if any match condition
bool hasEven = numbers.Any(n => n % 2 == 0);    // true
bool hasAny = numbers.Any();                     // true

// Check if all match condition
bool allPositive = numbers.All(n => n > 0);     // true

// Check if contains value
bool hasThree = numbers.Contains(3);            // true
\`\`\`

## Count, Sum, Average, Min, Max

\`\`\`csharp
var numbers = new[] { 1, 2, 3, 4, 5 };

int count = numbers.Count();                    // 5
int evenCount = numbers.Count(n => n % 2 == 0); // 2

int sum = numbers.Sum();                        // 15
int sumOfEven = numbers.Where(n => n % 2 == 0).Sum(); // 6

double avg = numbers.Average();                 // 3.0
int min = numbers.Min();                        // 1
int max = numbers.Max();                        // 5

// With projection
var products = GetProducts();
decimal maxPrice = products.Max(p => p.Price);
\`\`\`

## GroupBy

\`\`\`csharp
var products = GetProducts();

// Group by category
var byCategory = products.GroupBy(p => p.Category);

foreach (var group in byCategory)
{
    Console.WriteLine($"Category: {group.Key}");
    foreach (var product in group)
    {
        Console.WriteLine($"  - {product.Name}");
    }
}

// With projection
var categorySummary = products
    .GroupBy(p => p.Category)
    .Select(g => new {
        Category = g.Key,
        Count = g.Count(),
        AvgPrice = g.Average(p => p.Price)
    });
\`\`\`

## Join

\`\`\`csharp
var orders = GetOrders();
var customers = GetCustomers();

// Inner join
var orderDetails = orders.Join(
    customers,
    order => order.CustomerId,
    customer => customer.Id,
    (order, customer) => new {
        OrderId = order.Id,
        CustomerName = customer.Name,
        order.Total
    }
);

// Query syntax
var details = from o in orders
              join c in customers on o.CustomerId equals c.Id
              select new { o.Id, c.Name, o.Total };
\`\`\`

## SelectMany - Flattening

\`\`\`csharp
var customers = GetCustomers(); // Each has List<Order> Orders

// Flatten all orders from all customers
var allOrders = customers.SelectMany(c => c.Orders);

// With both customer and order data
var orderDetails = customers.SelectMany(
    c => c.Orders,
    (customer, order) => new {
        CustomerName = customer.Name,
        OrderId = order.Id
    }
);
\`\`\`

## Take, Skip - Pagination

\`\`\`csharp
var numbers = Enumerable.Range(1, 100);

// First 10 elements
var first10 = numbers.Take(10);

// Skip first 20, take next 10
var page3 = numbers.Skip(20).Take(10);

// Take while condition is true
var beforeFive = numbers.TakeWhile(n => n < 5);

// Skip while condition is true
var afterFive = numbers.SkipWhile(n => n < 5);
\`\`\`

## Distinct, Union, Intersect, Except

\`\`\`csharp
var list1 = new[] { 1, 2, 3, 4, 5 };
var list2 = new[] { 4, 5, 6, 7, 8 };

var unique = list1.Distinct();           // Remove duplicates
var combined = list1.Union(list2);       // { 1, 2, 3, 4, 5, 6, 7, 8 }
var common = list1.Intersect(list2);     // { 4, 5 }
var diff = list1.Except(list2);          // { 1, 2, 3 }
\`\`\`

## ToList, ToArray, ToDictionary

\`\`\`csharp
var query = numbers.Where(n => n > 5);

// Execute and convert to collection
List<int> list = query.ToList();
int[] array = query.ToArray();

// Create dictionary
var dict = products.ToDictionary(
    p => p.Id,      // Key
    p => p.Name     // Value
);

// With object as value
var productById = products.ToDictionary(p => p.Id);
\`\`\`

## Deferred Execution

\`\`\`csharp
var numbers = new List<int> { 1, 2, 3 };

// Query is NOT executed here
var query = numbers.Where(n => n > 1);

// Modify source
numbers.Add(4);

// Query executed here - includes 4!
foreach (var n in query)
{
    Console.WriteLine(n);  // 2, 3, 4
}

// Force immediate execution
var results = numbers.Where(n => n > 1).ToList();
numbers.Add(5);
// results still only has 2, 3, 4
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Filter data with Where
- Transform data with Select
- Aggregate with Sum, Count, Average
- Group and join data
- Understand deferred execution
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Filtering and Projection',
      description: `Use Where and Select to filter and transform data.

**Your task:**
1. Create an array of numbers 1-10
2. Filter to only even numbers
3. Square each number
4. Print each result`,
      starterCode: `// Step 1: Create array


// Step 2-3: Filter and transform


// Step 4: Print results

`,
      solution: `int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

var evenSquares = numbers
    .Where(n => n % 2 == 0)
    .Select(n => n * n);

foreach (var n in evenSquares)
{
    Console.WriteLine(n);
}`,
      expectedOutput: ['4', '16', '36', '64', '100'],
      hints: [
        'Where filters: n => n % 2 == 0',
        'Select transforms: n => n * n',
        'Chain them together'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Aggregation',
      description: `Use aggregate functions on collections.

**Your task:**
1. Create an array of numbers: 5, 10, 15, 20, 25
2. Calculate and print: count, sum, average, min, max`,
      starterCode: `// Step 1: Create array


// Step 2: Calculate aggregates

`,
      solution: `int[] numbers = { 5, 10, 15, 20, 25 };

Console.WriteLine($"Count: {numbers.Count()}");
Console.WriteLine($"Sum: {numbers.Sum()}");
Console.WriteLine($"Average: {numbers.Average()}");
Console.WriteLine($"Min: {numbers.Min()}");
Console.WriteLine($"Max: {numbers.Max()}");`,
      expectedOutput: ['Count: 5', 'Sum: 75', 'Average: 15', 'Min: 5', 'Max: 25'],
      hints: [
        'Use .Count(), .Sum(), .Average()',
        '.Min() and .Max() for extremes',
        'These are extension methods on IEnumerable'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: OrderBy and Take',
      description: `Sort and limit results.

**Your task:**
1. Create an array of names: "Charlie", "Alice", "Bob", "Diana"
2. Sort alphabetically
3. Take the first 2
4. Print each name`,
      starterCode: `// Step 1: Create array


// Step 2-3: Sort and take 2


// Step 4: Print results

`,
      solution: `string[] names = { "Charlie", "Alice", "Bob", "Diana" };

var firstTwo = names
    .OrderBy(n => n)
    .Take(2);

foreach (var name in firstTwo)
{
    Console.WriteLine(name);
}`,
      expectedOutput: ['Alice', 'Bob'],
      hints: [
        'OrderBy(n => n) sorts by the value itself',
        'Take(2) limits to first 2',
        'Order before Take matters!'
      ],
    }
  ],
  quiz: [
    {
      question: 'What is deferred execution in LINQ?',
      options: [
        'LINQ queries run in a separate thread',
        'Queries are not executed until results are enumerated',
        'LINQ defers errors to runtime',
        'Queries are cached for later use'
      ],
      correctIndex: 1,
      explanation: 'LINQ queries are lazy - they don\'t execute until you iterate (foreach) or force execution (ToList, Count, etc.).'
    },
    {
      question: 'What does SelectMany do?',
      options: [
        'Selects multiple columns',
        'Flattens nested collections into a single sequence',
        'Creates multiple copies of items',
        'Runs multiple select operations'
      ],
      correctIndex: 1,
      explanation: 'SelectMany flattens - if each item has a collection, it combines all those collections into one sequence.'
    },
    {
      question: 'What is the difference between First() and FirstOrDefault()?',
      options: [
        'They are the same',
        'First throws if empty; FirstOrDefault returns default value',
        'FirstOrDefault is faster',
        'First works only with arrays'
      ],
      correctIndex: 1,
      explanation: 'First() throws InvalidOperationException if sequence is empty. FirstOrDefault() returns the default value (null for references, 0 for ints, etc.).'
    },
    {
      question: 'When is a LINQ query executed?',
      options: [
        'When the query variable is assigned',
        'When ToList(), Count(), or foreach is called',
        'Immediately after the source is created',
        'Only in debug mode'
      ],
      correctIndex: 1,
      explanation: 'LINQ uses deferred execution. The query runs when you materialize it (ToList, ToArray) or iterate it (foreach).'
    }
  ],
  buildNote: {
    title: 'LINQ in C# Applications',
    explanation: `LINQ is central to C# development. Entity Framework translates LINQ to SQL. ASP.NET Core uses LINQ for filtering, sorting, and pagination. Data processing, reporting, and API responses all leverage LINQ. Understanding LINQ is essential for any C# developer.`,
    relatedFiles: [
      'src/lessons/index.ts'
    ],
    inTheRealWorld: `Production C# applications use LINQ extensively. Entity Framework Core translates LINQ expressions to optimized SQL. API controllers use LINQ for filtering and pagination. Data transformation, reporting, and analytics rely on LINQ. Libraries like MoreLINQ extend LINQ with additional operators. Performance-critical code sometimes uses explicit loops, but LINQ is the default choice for data manipulation.`
  }
};
