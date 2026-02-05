import { Lesson } from '@/types/lesson';

export const expressionTrees: Lesson = {
  slug: 'csharp-expression-trees',
  title: 'Expression Trees',
  description: 'Learn how expression trees represent code as data, enabling dynamic queries and LINQ providers.',
  difficulty: 'advanced',
  order: 24,
  content: `
# C# Expression Trees

Expression trees represent code as a data structure that can be examined, modified, or executed. They're the foundation for LINQ providers like Entity Framework that translate C# code to SQL.

## Expressions vs Delegates

\`\`\`csharp
using System.Linq.Expressions;

// Regular delegate (compiled code)
Func<int, int, int> addFunc = (a, b) => a + b;
int result1 = addFunc(3, 4);  // 7

// Expression tree (code as data)
Expression<Func<int, int, int>> addExpr = (a, b) => a + b;
// Can't call directly - must compile first
Func<int, int, int> compiledAdd = addExpr.Compile();
int result2 = compiledAdd(3, 4);  // 7

// Expression tree can be examined
Console.WriteLine(addExpr.Body);  // (a + b)
Console.WriteLine(addExpr.Body.NodeType);  // Add
\`\`\`

## Examining Expression Trees

\`\`\`csharp
Expression<Func<int, bool>> isPositive = x => x > 0;

// Navigate the tree structure
Console.WriteLine($"Body: {isPositive.Body}");           // (x > 0)
Console.WriteLine($"Body type: {isPositive.Body.NodeType}");  // GreaterThan

// Cast to specific expression type
if (isPositive.Body is BinaryExpression binary)
{
    Console.WriteLine($"Left: {binary.Left}");    // x
    Console.WriteLine($"Right: {binary.Right}");  // 0
    Console.WriteLine($"Operator: {binary.NodeType}");  // GreaterThan
}

// Parameters
foreach (var param in isPositive.Parameters)
{
    Console.WriteLine($"Parameter: {param.Name} ({param.Type.Name})");
}
\`\`\`

## Building Expression Trees Manually

\`\`\`csharp
using System.Linq.Expressions;

// Build: (x, y) => x + y
ParameterExpression paramX = Expression.Parameter(typeof(int), "x");
ParameterExpression paramY = Expression.Parameter(typeof(int), "y");
BinaryExpression body = Expression.Add(paramX, paramY);

Expression<Func<int, int, int>> addExpression =
    Expression.Lambda<Func<int, int, int>>(body, paramX, paramY);

Console.WriteLine(addExpression);  // (x, y) => (x + y)

// Compile and execute
Func<int, int, int> addFunc = addExpression.Compile();
Console.WriteLine(addFunc(10, 20));  // 30

// Build: person => person.Name == "Alice"
ParameterExpression personParam = Expression.Parameter(typeof(Person), "person");
MemberExpression nameProperty = Expression.Property(personParam, "Name");
ConstantExpression aliceConstant = Expression.Constant("Alice");
BinaryExpression comparison = Expression.Equal(nameProperty, aliceConstant);

var nameIsAlice = Expression.Lambda<Func<Person, bool>>(comparison, personParam);
Console.WriteLine(nameIsAlice);  // person => (person.Name == "Alice")
\`\`\`

## Expression Types

\`\`\`csharp
// Constant expressions
ConstantExpression five = Expression.Constant(5);
ConstantExpression hello = Expression.Constant("Hello");

// Parameter expressions
ParameterExpression x = Expression.Parameter(typeof(int), "x");

// Binary expressions
BinaryExpression add = Expression.Add(x, five);
BinaryExpression subtract = Expression.Subtract(x, five);
BinaryExpression multiply = Expression.Multiply(x, five);
BinaryExpression greaterThan = Expression.GreaterThan(x, five);
BinaryExpression andAlso = Expression.AndAlso(
    Expression.GreaterThan(x, Expression.Constant(0)),
    Expression.LessThan(x, Expression.Constant(100))
);

// Unary expressions
UnaryExpression negate = Expression.Negate(x);
UnaryExpression not = Expression.Not(Expression.Constant(true));

// Method call expressions
MethodCallExpression toStringCall = Expression.Call(
    x,
    typeof(int).GetMethod("ToString", Type.EmptyTypes)!
);

// Member access expressions
ParameterExpression str = Expression.Parameter(typeof(string), "str");
MemberExpression lengthAccess = Expression.Property(str, "Length");

// Conditional expressions
ConditionalExpression conditional = Expression.Condition(
    Expression.GreaterThan(x, Expression.Constant(0)),
    Expression.Constant("Positive"),
    Expression.Constant("Non-positive")
);
\`\`\`

## Dynamic Filter Building

Build queries at runtime based on user input:

\`\`\`csharp
public class Product
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string Category { get; set; } = "";
}

public static class DynamicFilter
{
    public static Expression<Func<T, bool>> BuildFilter<T>(
        string propertyName,
        string operation,
        object value)
    {
        ParameterExpression param = Expression.Parameter(typeof(T), "x");
        MemberExpression property = Expression.Property(param, propertyName);
        ConstantExpression constant = Expression.Constant(value);

        Expression comparison = operation switch
        {
            "==" => Expression.Equal(property, constant),
            "!=" => Expression.NotEqual(property, constant),
            ">" => Expression.GreaterThan(property, constant),
            "<" => Expression.LessThan(property, constant),
            ">=" => Expression.GreaterThanOrEqual(property, constant),
            "<=" => Expression.LessThanOrEqual(property, constant),
            _ => throw new ArgumentException($"Unknown operation: {operation}")
        };

        return Expression.Lambda<Func<T, bool>>(comparison, param);
    }
}

// Usage
var products = new List<Product>
{
    new() { Name = "Laptop", Price = 999.99m, Category = "Electronics" },
    new() { Name = "Book", Price = 19.99m, Category = "Books" },
    new() { Name = "Phone", Price = 699.99m, Category = "Electronics" }
};

// Build filter: x => x.Price > 100
var priceFilter = DynamicFilter.BuildFilter<Product>("Price", ">", 100m);
var expensive = products.AsQueryable().Where(priceFilter).ToList();
Console.WriteLine($"Expensive items: {expensive.Count}");  // 2

// Build filter: x => x.Category == "Electronics"
var categoryFilter = DynamicFilter.BuildFilter<Product>("Category", "==", "Electronics");
var electronics = products.AsQueryable().Where(categoryFilter).ToList();
Console.WriteLine($"Electronics: {electronics.Count}");  // 2
\`\`\`

## Combining Expressions

\`\`\`csharp
public static class ExpressionExtensions
{
    public static Expression<Func<T, bool>> And<T>(
        this Expression<Func<T, bool>> left,
        Expression<Func<T, bool>> right)
    {
        var parameter = Expression.Parameter(typeof(T), "x");

        var leftBody = ReplaceParameter(left.Body, left.Parameters[0], parameter);
        var rightBody = ReplaceParameter(right.Body, right.Parameters[0], parameter);

        var combined = Expression.AndAlso(leftBody, rightBody);
        return Expression.Lambda<Func<T, bool>>(combined, parameter);
    }

    public static Expression<Func<T, bool>> Or<T>(
        this Expression<Func<T, bool>> left,
        Expression<Func<T, bool>> right)
    {
        var parameter = Expression.Parameter(typeof(T), "x");

        var leftBody = ReplaceParameter(left.Body, left.Parameters[0], parameter);
        var rightBody = ReplaceParameter(right.Body, right.Parameters[0], parameter);

        var combined = Expression.OrElse(leftBody, rightBody);
        return Expression.Lambda<Func<T, bool>>(combined, parameter);
    }

    private static Expression ReplaceParameter(
        Expression expression,
        ParameterExpression oldParam,
        ParameterExpression newParam)
    {
        return new ParameterReplacer(oldParam, newParam).Visit(expression);
    }
}

class ParameterReplacer : ExpressionVisitor
{
    private readonly ParameterExpression _oldParam;
    private readonly ParameterExpression _newParam;

    public ParameterReplacer(ParameterExpression oldParam, ParameterExpression newParam)
    {
        _oldParam = oldParam;
        _newParam = newParam;
    }

    protected override Expression VisitParameter(ParameterExpression node)
    {
        return node == _oldParam ? _newParam : base.VisitParameter(node);
    }
}

// Usage
Expression<Func<Product, bool>> isPricey = p => p.Price > 500;
Expression<Func<Product, bool>> isElectronics = p => p.Category == "Electronics";

var combined = isPricey.And(isElectronics);
// Result: p => (p.Price > 500) && (p.Category == "Electronics")

var priceyElectronics = products.AsQueryable().Where(combined).ToList();
\`\`\`

## How LINQ Providers Use Expression Trees

\`\`\`csharp
// When you write:
var query = dbContext.Products.Where(p => p.Price > 100);

// Entity Framework receives an expression tree, not compiled code
// It walks the tree and translates it to SQL:
// SELECT * FROM Products WHERE Price > 100

// The expression tree allows EF to:
// 1. See what properties are accessed (for SELECT optimization)
// 2. Translate operators to SQL equivalents
// 3. Handle method calls (like .Contains() -> SQL IN)
// 4. Build parameterized queries (preventing SQL injection)

// This is why you can't do arbitrary C# in EF queries:
// dbContext.Products.Where(p => CustomMethod(p))  // Error! Can't translate
\`\`\`

## Expression Visitor Pattern

Transform expressions by visiting each node:

\`\`\`csharp
public class DebugExpressionVisitor : ExpressionVisitor
{
    protected override Expression VisitBinary(BinaryExpression node)
    {
        Console.WriteLine($"Binary: {node.NodeType}");
        Console.WriteLine($"  Left: {node.Left}");
        Console.WriteLine($"  Right: {node.Right}");
        return base.VisitBinary(node);
    }

    protected override Expression VisitConstant(ConstantExpression node)
    {
        Console.WriteLine($"Constant: {node.Value}");
        return base.VisitConstant(node);
    }

    protected override Expression VisitParameter(ParameterExpression node)
    {
        Console.WriteLine($"Parameter: {node.Name}");
        return base.VisitParameter(node);
    }

    protected override Expression VisitMember(MemberExpression node)
    {
        Console.WriteLine($"Member: {node.Member.Name}");
        return base.VisitMember(node);
    }
}

// Usage
Expression<Func<Person, bool>> expr = p => p.Age > 18 && p.Name != null;
var visitor = new DebugExpressionVisitor();
visitor.Visit(expr);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Understand the difference between delegates and expression trees
- Examine and navigate expression tree structures
- Build expression trees programmatically
- Combine expressions dynamically
- Understand how LINQ providers translate expressions to queries
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Examine an Expression Tree',
      description: `Explore the structure of a simple expression tree.

**Your task:**
1. Create an Expression<Func<int, bool>> for x => x > 10
2. Print the body of the expression
3. Cast the body to BinaryExpression
4. Print the left operand, operator, and right operand

**Remember:** Expression<Func> creates an expression tree, not compiled code.`,
      starterCode: `using System;
using System.Linq.Expressions;

// Step 1: Create the expression


// Step 2: Print the body


// Step 3-4: Examine the binary expression parts

`,
      solution: `using System;
using System.Linq.Expressions;

Expression<Func<int, bool>> expr = x => x > 10;

Console.WriteLine($"Body: {expr.Body}");

if (expr.Body is BinaryExpression binary)
{
    Console.WriteLine($"Left: {binary.Left}");
    Console.WriteLine($"Operator: {binary.NodeType}");
    Console.WriteLine($"Right: {binary.Right}");
}`,
      expectedOutput: [
        'Body: (x > 10)',
        'Left: x',
        'Operator: GreaterThan',
        'Right: 10'
      ],
      hints: [
        'Use Expression<Func<int, bool>> not just Func<int, bool>',
        'The Body property contains the expression content',
        'Cast to BinaryExpression using "is" pattern',
        'NodeType gives you the operator type'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Build an Expression Manually',
      description: `Create an expression tree programmatically without using lambda syntax.

**Your task:**
1. Create a parameter expression for an int called "n"
2. Create a constant expression for 100
3. Create a binary expression that multiplies them
4. Create a lambda expression and compile it
5. Test with the value 5

**Key APIs:** Expression.Parameter, Expression.Constant, Expression.Multiply, Expression.Lambda`,
      starterCode: `using System;
using System.Linq.Expressions;

// Step 1: Create parameter


// Step 2: Create constant


// Step 3: Create multiplication


// Step 4: Create and compile lambda


// Step 5: Test

`,
      solution: `using System;
using System.Linq.Expressions;

ParameterExpression param = Expression.Parameter(typeof(int), "n");

ConstantExpression constant = Expression.Constant(100);

BinaryExpression multiply = Expression.Multiply(param, constant);

Expression<Func<int, int>> lambda =
    Expression.Lambda<Func<int, int>>(multiply, param);

Console.WriteLine($"Expression: {lambda}");

Func<int, int> compiled = lambda.Compile();
Console.WriteLine($"5 * 100 = {compiled(5)}");`,
      expectedOutput: [
        'Expression: n => (n * 100)',
        '5 * 100 = 500'
      ],
      hints: [
        'Expression.Parameter takes the type and a name string',
        'Expression.Constant wraps a value',
        'Expression.Multiply takes two expressions',
        'Expression.Lambda combines body and parameters'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Dynamic Property Filter',
      description: `Build a dynamic filter that works with any property by name.

**Your task:**
1. Create a Person class with Name (string) and Age (int)
2. Write a method that builds Expression<Func<Person, bool>> for equality checks
3. The method takes propertyName and value as parameters
4. Test filtering a list of people by Name

**This pattern is how ORMs build dynamic queries!**`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

// Step 1: Create Person class


// Step 2-3: Write BuildEquals method


// Step 4: Test with a list

`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

public class Person
{
    public string Name { get; set; } = "";
    public int Age { get; set; }
}

Expression<Func<Person, bool>> BuildEquals(string propertyName, object value)
{
    var param = Expression.Parameter(typeof(Person), "p");
    var property = Expression.Property(param, propertyName);
    var constant = Expression.Constant(value);
    var equals = Expression.Equal(property, constant);
    return Expression.Lambda<Func<Person, bool>>(equals, param);
}

var people = new List<Person>
{
    new() { Name = "Alice", Age = 30 },
    new() { Name = "Bob", Age = 25 },
    new() { Name = "Alice", Age = 35 }
};

var filter = BuildEquals("Name", "Alice");
Console.WriteLine($"Filter: {filter}");

var results = people.AsQueryable().Where(filter).ToList();
Console.WriteLine($"Found {results.Count} people named Alice");`,
      expectedOutput: [
        'Filter: p => (p.Name == "Alice")',
        'Found 2 people named Alice'
      ],
      hints: [
        'Expression.Property accesses a property by name',
        'Expression.Equal creates an equality comparison',
        'Expression.Lambda wraps it all into a callable expression',
        'Use AsQueryable() to use expression-based Where'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the main difference between Func<T> and Expression<Func<T>>?',
      options: [
        'Func is faster',
        'Expression can only work with value types',
        'Func is compiled code, Expression is code represented as a data structure',
        'There is no practical difference'
      ],
      correctIndex: 2,
      explanation: 'Func<T> is compiled IL code that can be executed directly. Expression<Func<T>> represents that same code as a tree data structure that can be examined, modified, or translated (like to SQL).'
    },
    {
      question: 'Why does Entity Framework use expression trees instead of delegates?',
      options: [
        'Expressions are faster to execute',
        'Expressions can be examined and translated to SQL queries',
        'Delegates are deprecated',
        'Expressions use less memory'
      ],
      correctIndex: 1,
      explanation: 'Entity Framework examines expression trees to understand what your code is trying to do, then translates it to SQL. With a delegate, EF would only see compiled code it cannot inspect.'
    },
    {
      question: 'What does ExpressionVisitor do?',
      options: [
        'Executes expression trees',
        'Compiles expressions to delegates',
        'Visits each node in an expression tree, enabling examination or transformation',
        'Validates expression syntax'
      ],
      correctIndex: 2,
      explanation: 'ExpressionVisitor walks through every node in an expression tree, calling a virtual method for each type of node. You can override these methods to examine or transform the expression.'
    },
    {
      question: 'What happens when you call .Compile() on an Expression<Func<T>>?',
      options: [
        'It validates the expression',
        'It converts the expression tree into an executable delegate',
        'It serializes the expression',
        'It optimizes the expression'
      ],
      correctIndex: 1,
      explanation: 'Compile() converts the expression tree back into executable IL code, returning a delegate you can invoke like any other delegate.'
    }
  ],
  buildNote: {
    title: 'Expression Trees Power LINQ Providers',
    explanation: `Expression trees are what make LINQ-to-SQL, Entity Framework, and other LINQ providers possible. When you write a LINQ query against a database context, the lambda expressions are not compiled to IL - they become expression trees that the provider translates to SQL. This is why some C# code works in EF queries and some does not - only translatable expressions are supported.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/codeRunner.ts'
    ],
    inTheRealWorld: `Beyond ORMs, expression trees are used in: dynamic query builders (letting users filter data without writing code), API query languages (like OData), mocking frameworks (Moq uses expressions to set up expectations), serialization (capturing property accessors), and code analysis tools. Understanding expression trees opens doors to meta-programming scenarios.`
  }
};
