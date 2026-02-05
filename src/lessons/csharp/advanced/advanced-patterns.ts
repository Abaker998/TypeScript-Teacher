import { Lesson } from '@/types/lesson';

export const advancedPatterns: Lesson = {
  slug: 'csharp-advanced-patterns',
  title: 'Advanced Patterns',
  description: 'Master C# records, init-only setters, and design patterns for modern application development.',
  difficulty: 'advanced',
  order: 27,
  content: `
# Advanced C# Patterns

Modern C# provides powerful features for writing clean, maintainable code. This lesson covers records, init-only setters, and essential design patterns.

## Records - Immutable Data Types

Records are reference types optimized for immutable data:

\`\`\`csharp
// Record declaration (C# 9+)
public record Person(string Name, int Age);

// Usage
var person = new Person("Alice", 30);
Console.WriteLine(person);  // Person { Name = Alice, Age = 30 }

// Value-based equality (not reference equality)
var person2 = new Person("Alice", 30);
Console.WriteLine(person == person2);  // True!

// Deconstruction
var (name, age) = person;
Console.WriteLine($"{name} is {age}");  // Alice is 30

// Records are immutable - use "with" for copies
var older = person with { Age = 31 };
Console.WriteLine(older);  // Person { Name = Alice, Age = 31 }
Console.WriteLine(person.Age);  // Still 30 - original unchanged
\`\`\`

## Record Variations

\`\`\`csharp
// Positional record (shorthand)
public record Point(int X, int Y);

// Record with body (add methods, computed properties)
public record Rectangle(int Width, int Height)
{
    public int Area => Width * Height;
    public bool IsSquare => Width == Height;
}

// Record class (explicit, same as just 'record')
public record class Customer(string Name, string Email);

// Record struct (value type, C# 10+)
public readonly record struct Temperature(double Celsius)
{
    public double Fahrenheit => Celsius * 9 / 5 + 32;
}

// Record with inheritance
public record Animal(string Name);
public record Dog(string Name, string Breed) : Animal(Name);

var dog = new Dog("Buddy", "Labrador");
Console.WriteLine(dog);  // Dog { Name = Buddy, Breed = Labrador }
\`\`\`

## Init-Only Setters

Allow properties to be set only during initialization:

\`\`\`csharp
public class Person
{
    public string Name { get; init; }  // Can only be set during init
    public int Age { get; init; }

    public Person()
    {
        Name = "";  // Required in constructor for non-nullable
    }
}

// Valid - during object initialization
var person = new Person { Name = "Alice", Age = 30 };

// Invalid - cannot modify after initialization
// person.Name = "Bob";  // Compile error!

// Useful for immutable-ish classes without full records
public class Configuration
{
    public string ConnectionString { get; init; } = "";
    public int Timeout { get; init; } = 30;
    public bool EnableLogging { get; init; }
}

var config = new Configuration
{
    ConnectionString = "Server=localhost",
    EnableLogging = true
    // Timeout keeps default value of 30
};
\`\`\`

## Required Properties (C# 11)

\`\`\`csharp
public class User
{
    public required string Email { get; init; }
    public required string Username { get; init; }
    public string? DisplayName { get; init; }
}

// Must provide required properties
var user = new User
{
    Email = "alice@example.com",
    Username = "alice"
    // DisplayName is optional
};

// Compile error if required property missing
// var invalid = new User { Email = "test@test.com" };  // Missing Username!

// Works with constructors too
public class Product
{
    public required string Name { get; init; }

    [SetsRequiredMembers]
    public Product(string name)
    {
        Name = name;
    }
}
\`\`\`

## Pattern Matching Enhancements

\`\`\`csharp
// Property patterns
public record Order(string Status, decimal Total, Customer Customer);
public record Customer(string Name, bool IsPremium);

bool IsHighValuePremiumOrder(Order order) => order is
{
    Total: > 1000,
    Customer.IsPremium: true
};

// List patterns (C# 11)
int[] numbers = { 1, 2, 3, 4, 5 };

var result = numbers switch
{
    [1, 2, 3, 4, 5] => "Exact match",
    [1, .., 5] => "Starts with 1, ends with 5",
    [_, _, 3, ..] => "Third element is 3",
    { Length: > 3 } => "More than 3 elements",
    [] => "Empty",
    _ => "Other"
};

// Extended property patterns
if (order is { Customer.Name.Length: > 10 })
{
    Console.WriteLine("Long customer name");
}

// Combining patterns
string Classify(object obj) => obj switch
{
    int n when n < 0 => "Negative",
    int n when n > 0 => "Positive",
    int => "Zero",
    string { Length: 0 } => "Empty string",
    string s => $"String: {s}",
    null => "Null",
    _ => "Unknown"
};
\`\`\`

## Factory Pattern

\`\`\`csharp
public interface INotification
{
    void Send(string message);
}

public class EmailNotification : INotification
{
    public void Send(string message) => Console.WriteLine($"Email: {message}");
}

public class SmsNotification : INotification
{
    public void Send(string message) => Console.WriteLine($"SMS: {message}");
}

public class PushNotification : INotification
{
    public void Send(string message) => Console.WriteLine($"Push: {message}");
}

// Factory class
public static class NotificationFactory
{
    public static INotification Create(string type) => type.ToLower() switch
    {
        "email" => new EmailNotification(),
        "sms" => new SmsNotification(),
        "push" => new PushNotification(),
        _ => throw new ArgumentException($"Unknown notification type: {type}")
    };
}

// Usage
var notification = NotificationFactory.Create("email");
notification.Send("Hello!");  // Email: Hello!
\`\`\`

## Builder Pattern with Records

\`\`\`csharp
public record EmailMessage
{
    public string To { get; init; } = "";
    public string From { get; init; } = "";
    public string Subject { get; init; } = "";
    public string Body { get; init; } = "";
    public bool IsHtml { get; init; }
    public IReadOnlyList<string> Attachments { get; init; } = Array.Empty<string>();
}

public class EmailBuilder
{
    private string _to = "";
    private string _from = "";
    private string _subject = "";
    private string _body = "";
    private bool _isHtml;
    private readonly List<string> _attachments = new();

    public EmailBuilder To(string address) { _to = address; return this; }
    public EmailBuilder From(string address) { _from = address; return this; }
    public EmailBuilder Subject(string subject) { _subject = subject; return this; }
    public EmailBuilder Body(string body, bool isHtml = false)
    {
        _body = body;
        _isHtml = isHtml;
        return this;
    }
    public EmailBuilder Attach(string path) { _attachments.Add(path); return this; }

    public EmailMessage Build() => new()
    {
        To = _to,
        From = _from,
        Subject = _subject,
        Body = _body,
        IsHtml = _isHtml,
        Attachments = _attachments.AsReadOnly()
    };
}

// Usage
var email = new EmailBuilder()
    .To("user@example.com")
    .From("noreply@example.com")
    .Subject("Welcome!")
    .Body("<h1>Hello</h1>", isHtml: true)
    .Attach("welcome.pdf")
    .Build();
\`\`\`

## Strategy Pattern

\`\`\`csharp
public interface IPricingStrategy
{
    decimal CalculatePrice(decimal basePrice, int quantity);
}

public class RegularPricing : IPricingStrategy
{
    public decimal CalculatePrice(decimal basePrice, int quantity)
        => basePrice * quantity;
}

public class BulkPricing : IPricingStrategy
{
    public decimal CalculatePrice(decimal basePrice, int quantity)
        => quantity >= 10 ? basePrice * quantity * 0.9m : basePrice * quantity;
}

public class PremiumPricing : IPricingStrategy
{
    public decimal CalculatePrice(decimal basePrice, int quantity)
        => basePrice * quantity * 0.8m;  // 20% off always
}

public class ShoppingCart
{
    private readonly IPricingStrategy _strategy;

    public ShoppingCart(IPricingStrategy strategy)
    {
        _strategy = strategy;
    }

    public decimal GetTotal(decimal itemPrice, int quantity)
        => _strategy.CalculatePrice(itemPrice, quantity);
}

// Usage
var regularCart = new ShoppingCart(new RegularPricing());
var premiumCart = new ShoppingCart(new PremiumPricing());

Console.WriteLine($"Regular: {regularCart.GetTotal(100, 5)}");  // 500
Console.WriteLine($"Premium: {premiumCart.GetTotal(100, 5)}");  // 400
\`\`\`

## Repository Pattern

\`\`\`csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

public class UserRepository : IRepository<User>
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context) => _context = context;

    public async Task<User?> GetByIdAsync(int id)
        => await _context.Users.FindAsync(id);

    public async Task<IEnumerable<User>> GetAllAsync()
        => await _context.Users.ToListAsync();

    public async Task<User> AddAsync(User entity)
    {
        _context.Users.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(User entity)
    {
        _context.Users.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _context.Users.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
\`\`\`

## Result Pattern for Error Handling

\`\`\`csharp
public record Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    private Result(bool isSuccess, T? value, string? error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(string error) => new(false, default, error);

    public TResult Match<TResult>(Func<T, TResult> onSuccess, Func<string, TResult> onFailure)
        => IsSuccess ? onSuccess(Value!) : onFailure(Error!);
}

// Usage
public Result<User> GetUser(int id)
{
    var user = _repository.FindById(id);
    return user != null
        ? Result<User>.Success(user)
        : Result<User>.Failure($"User {id} not found");
}

var result = GetUser(42);
var message = result.Match(
    user => $"Found: {user.Name}",
    error => $"Error: {error}"
);
\`\`\`

## Specification Pattern

\`\`\`csharp
public interface ISpecification<T>
{
    bool IsSatisfiedBy(T entity);
    Expression<Func<T, bool>> ToExpression();
}

public abstract class Specification<T> : ISpecification<T>
{
    public bool IsSatisfiedBy(T entity) => ToExpression().Compile()(entity);
    public abstract Expression<Func<T, bool>> ToExpression();

    public Specification<T> And(Specification<T> other)
        => new AndSpecification<T>(this, other);

    public Specification<T> Or(Specification<T> other)
        => new OrSpecification<T>(this, other);
}

public class PremiumCustomerSpec : Specification<Customer>
{
    public override Expression<Func<Customer, bool>> ToExpression()
        => c => c.TotalPurchases > 10000;
}

public class ActiveCustomerSpec : Specification<Customer>
{
    public override Expression<Func<Customer, bool>> ToExpression()
        => c => c.LastPurchase > DateTime.Now.AddMonths(-6);
}

// Combine specifications
var vipSpec = new PremiumCustomerSpec().And(new ActiveCustomerSpec());
var vipCustomers = customers.Where(vipSpec.IsSatisfiedBy);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use records for immutable data with value equality
- Apply init-only and required properties appropriately
- Implement common design patterns in C#
- Use pattern matching for elegant conditional logic
- Create Result types for explicit error handling
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Working with Records',
      description: `Create and manipulate records with the "with" expression.

**Your task:**
1. Create a record \`Product\` with Name (string) and Price (decimal)
2. Create a product instance
3. Use "with" to create a discounted version (10% off)
4. Print both to show the original is unchanged

**Remember:** Records use value equality and "with" creates copies.`,
      starterCode: `using System;

// Step 1: Create Product record


// Step 2: Create a product


// Step 3: Create discounted version using "with"


// Step 4: Print both products

`,
      solution: `using System;

public record Product(string Name, decimal Price);

var laptop = new Product("Laptop", 999.99m);

var discounted = laptop with { Price = laptop.Price * 0.9m };

Console.WriteLine($"Original: {laptop}");
Console.WriteLine($"Discounted: {discounted}");
Console.WriteLine($"Same product: {laptop == discounted}");`,
      expectedOutput: [
        'Original: Product { Name = Laptop, Price = 999.99 }',
        'Discounted: Product { Name = Laptop, Price = 899.991 }',
        'Same product: False'
      ],
      hints: [
        'Record syntax: public record Name(Type Prop1, Type Prop2)',
        'Use "with { Property = NewValue }" to create modified copy',
        'Original record remains unchanged',
        'Records have value equality, so different prices means not equal'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Factory Pattern',
      description: `Implement a factory that creates different shape objects.

**Your task:**
1. Create IShape interface with CalculateArea() method
2. Create Circle and Rectangle implementations
3. Create ShapeFactory with Create(string type, params) method
4. Use the factory to create and calculate areas

**Key:** Factory encapsulates object creation logic.`,
      starterCode: `using System;

// Step 1: Create IShape interface


// Step 2: Create Circle and Rectangle


// Step 3: Create ShapeFactory


// Step 4: Test the factory

`,
      solution: `using System;

public interface IShape
{
    double CalculateArea();
}

public class Circle : IShape
{
    public double Radius { get; }
    public Circle(double radius) => Radius = radius;
    public double CalculateArea() => Math.PI * Radius * Radius;
}

public class Rectangle : IShape
{
    public double Width { get; }
    public double Height { get; }
    public Rectangle(double width, double height) { Width = width; Height = height; }
    public double CalculateArea() => Width * Height;
}

public static class ShapeFactory
{
    public static IShape Create(string type, params double[] args) => type.ToLower() switch
    {
        "circle" => new Circle(args[0]),
        "rectangle" => new Rectangle(args[0], args[1]),
        _ => throw new ArgumentException($"Unknown shape: {type}")
    };
}

var circle = ShapeFactory.Create("circle", 5);
var rectangle = ShapeFactory.Create("rectangle", 4, 6);

Console.WriteLine($"Circle area: {circle.CalculateArea():F2}");
Console.WriteLine($"Rectangle area: {rectangle.CalculateArea():F2}");`,
      expectedOutput: [
        'Circle area: 78.54',
        'Rectangle area: 24.00'
      ],
      hints: [
        'Interface defines the contract all shapes must follow',
        'Each shape implements its own area calculation',
        'Factory uses switch expression for type selection',
        'params double[] allows variable number of arguments'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Result Pattern',
      description: `Implement a Result type for explicit error handling without exceptions.

**Your task:**
1. Create Result<T> with IsSuccess, Value, and Error properties
2. Add static Success(T) and Failure(string) factory methods
3. Create a Divide function that returns Result<double>
4. Handle both success and failure cases

**Key:** Result pattern makes errors explicit in the return type.`,
      starterCode: `using System;

// Step 1-2: Create Result<T> class with factory methods


// Step 3: Create Divide function returning Result


// Step 4: Test with success and failure cases

`,
      solution: `using System;

public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    private Result(bool success, T? value, string? error)
    {
        IsSuccess = success;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(string error) => new(false, default, error);
}

Result<double> Divide(double a, double b)
{
    if (b == 0)
        return Result<double>.Failure("Cannot divide by zero");
    return Result<double>.Success(a / b);
}

var success = Divide(10, 2);
var failure = Divide(10, 0);

Console.WriteLine(success.IsSuccess ? $"Result: {success.Value}" : $"Error: {success.Error}");
Console.WriteLine(failure.IsSuccess ? $"Result: {failure.Value}" : $"Error: {failure.Error}");`,
      expectedOutput: [
        'Result: 5',
        'Error: Cannot divide by zero'
      ],
      hints: [
        'Private constructor forces use of factory methods',
        'Success stores the value, Failure stores the error',
        'Check IsSuccess before accessing Value or Error',
        'This pattern avoids throwing exceptions for expected failures'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the key difference between a record and a class in C#?',
      options: [
        'Records are faster',
        'Records have value-based equality and are optimized for immutable data',
        'Records cannot have methods',
        'Records are always structs'
      ],
      correctIndex: 1,
      explanation: 'Records provide value-based equality (comparing by content, not reference), built-in ToString, and the "with" expression for non-destructive mutation. They are designed for immutable data transfer objects.'
    },
    {
      question: 'What does "init" in a property setter mean?',
      options: [
        'The property must be initialized in the constructor',
        'The property can only be set during object initialization, not after',
        'The property is read-only',
        'The property is initialized to default value'
      ],
      correctIndex: 1,
      explanation: 'Init-only setters allow properties to be set during object initialization (new MyClass { Prop = value }) but become read-only after the object is constructed.'
    },
    {
      question: 'What is the purpose of the Factory pattern?',
      options: [
        'To make objects faster to create',
        'To encapsulate object creation logic and decouple it from the client',
        'To share objects between different parts of the application',
        'To ensure only one instance exists'
      ],
      correctIndex: 1,
      explanation: 'The Factory pattern encapsulates the creation of objects, allowing the client code to request objects without knowing the specific class or creation details.'
    },
    {
      question: 'What advantage does the Result<T> pattern provide over throwing exceptions?',
      options: [
        'Better performance',
        'Makes error cases explicit in the return type, forcing callers to handle them',
        'Automatically retries failed operations',
        'Logs errors automatically'
      ],
      correctIndex: 1,
      explanation: 'The Result pattern makes potential failures explicit in the method signature. Callers must explicitly handle the Result, unlike exceptions which can be accidentally ignored or cause unexpected control flow.'
    }
  ],
  buildNote: {
    title: 'Modern C# Patterns in Production',
    explanation: `Records and init-only properties are now standard in C# development, especially for DTOs, API responses, and domain models. Design patterns like Factory, Strategy, and Repository appear in virtually every enterprise application. The Result pattern is increasingly popular as an alternative to exceptions for expected failure cases.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/codeRunner.ts'
    ],
    inTheRealWorld: `Records are heavily used with ASP.NET Core for request/response models. The Factory pattern appears in DI containers and object creation. Strategy pattern is common in payment processing (different payment providers) and pricing systems. Repository pattern is standard for data access. Result/Either patterns are popular in functional C# and libraries like LanguageExt.`
  }
};
