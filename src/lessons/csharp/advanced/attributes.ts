import { Lesson } from '@/types/lesson';

export const attributes: Lesson = {
  slug: 'csharp-attributes',
  title: 'Attributes',
  description: 'Learn to use and create custom attributes to add metadata to your C# code.',
  difficulty: 'advanced',
  order: 22,
  content: `
# C# Attributes

Attributes add declarative metadata to code elements like classes, methods, and properties. They're extensively used in .NET for serialization, validation, and framework configuration.

## Built-in Attributes

.NET provides many useful attributes out of the box:

\`\`\`csharp
// Obsolete - marks code as deprecated
[Obsolete("Use NewMethod instead", error: false)]
public void OldMethod() { }

[Obsolete("This is removed", error: true)]  // Causes compile error if used
public void RemovedMethod() { }

// Serializable - marks class for binary serialization
[Serializable]
public class GameState
{
    public int Score { get; set; }
    public string PlayerName { get; set; } = "";
}

// Conditional - method only called in DEBUG builds
[Conditional("DEBUG")]
public static void DebugLog(string message)
{
    Console.WriteLine($"DEBUG: {message}");
}
\`\`\`

## JSON Serialization Attributes

Control how objects are serialized to JSON:

\`\`\`csharp
using System.Text.Json.Serialization;

public class User
{
    [JsonPropertyName("user_name")]
    public string Name { get; set; } = "";

    [JsonIgnore]
    public string Password { get; set; } = "";

    [JsonPropertyOrder(1)]
    public int Id { get; set; }

    [JsonInclude]
    private string _internalId = "internal";

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public UserRole Role { get; set; }
}

public enum UserRole { Admin, User, Guest }

// Serializes to: {"Id":1,"user_name":"Alice","Role":"Admin"}
\`\`\`

## Validation Attributes

Used with data annotations for model validation:

\`\`\`csharp
using System.ComponentModel.DataAnnotations;

public class Registration
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Range(18, 120, ErrorMessage = "Age must be between 18 and 120")]
    public int Age { get; set; }

    [RegularExpression(@"^\\d{5}$", ErrorMessage = "Invalid ZIP code")]
    public string ZipCode { get; set; } = "";

    [Compare("Password", ErrorMessage = "Passwords don't match")]
    public string ConfirmPassword { get; set; } = "";
}

// Validate
var context = new ValidationContext(registration);
var results = new List<ValidationResult>();
bool isValid = Validator.TryValidateObject(registration, context, results, true);
\`\`\`

## Creating Custom Attributes

Define your own attributes by inheriting from Attribute:

\`\`\`csharp
// Define the attribute
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method,
    AllowMultiple = false, Inherited = true)]
public class AuthorAttribute : Attribute
{
    public string Name { get; }
    public string? Email { get; set; }
    public string? Version { get; set; }

    public AuthorAttribute(string name)
    {
        Name = name;
    }
}

// Use the attribute
[Author("Alice Smith", Email = "alice@example.com", Version = "1.0")]
public class UserService
{
    [Author("Bob Jones")]
    public void ProcessUser() { }
}
\`\`\`

## AttributeUsage Explained

Control where and how attributes can be applied:

\`\`\`csharp
[AttributeUsage(
    AttributeTargets.Class | AttributeTargets.Method,  // Where it can be applied
    AllowMultiple = true,   // Can apply multiple times to same target
    Inherited = true        // Inherited by derived classes
)]
public class TagAttribute : Attribute
{
    public string Tag { get; }
    public TagAttribute(string tag) => Tag = tag;
}

// Can apply multiple times
[Tag("Important")]
[Tag("Reviewed")]
public class Document { }

// AttributeTargets options:
// Class, Method, Property, Field, Parameter, ReturnValue,
// Constructor, Interface, Enum, Struct, Assembly, All
\`\`\`

## Reading Attributes with Reflection

Access attribute data at runtime:

\`\`\`csharp
// Check if attribute exists
Type type = typeof(UserService);
bool hasAuthor = Attribute.IsDefined(type, typeof(AuthorAttribute));
Console.WriteLine($"Has author: {hasAuthor}");  // True

// Get single attribute
AuthorAttribute? author = (AuthorAttribute?)Attribute.GetCustomAttribute(
    type, typeof(AuthorAttribute)
);
Console.WriteLine($"Author: {author?.Name}");  // Alice Smith

// Get all attributes of a type
var allAuthors = Attribute.GetCustomAttributes(type, typeof(AuthorAttribute));

// Using generic methods (cleaner syntax)
AuthorAttribute? author2 = type.GetCustomAttribute<AuthorAttribute>();

// Get attributes on methods
MethodInfo? method = type.GetMethod("ProcessUser");
AuthorAttribute? methodAuthor = method?.GetCustomAttribute<AuthorAttribute>();
Console.WriteLine($"Method author: {methodAuthor?.Name}");  // Bob Jones
\`\`\`

## Practical Example: Simple Validation Framework

\`\`\`csharp
// Custom validation attributes
[AttributeUsage(AttributeTargets.Property)]
public abstract class ValidationAttribute : Attribute
{
    public string? ErrorMessage { get; set; }
    public abstract bool IsValid(object? value);
}

public class RequiredAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        return value != null && !string.IsNullOrWhiteSpace(value.ToString());
    }
}

public class MinLengthAttribute : ValidationAttribute
{
    public int Length { get; }
    public MinLengthAttribute(int length) => Length = length;

    public override bool IsValid(object? value)
    {
        if (value is string str)
            return str.Length >= Length;
        return false;
    }
}

// Validator using reflection
public static class SimpleValidator
{
    public static List<string> Validate(object obj)
    {
        var errors = new List<string>();
        Type type = obj.GetType();

        foreach (PropertyInfo prop in type.GetProperties())
        {
            var validations = prop.GetCustomAttributes<ValidationAttribute>();
            object? value = prop.GetValue(obj);

            foreach (var validation in validations)
            {
                if (!validation.IsValid(value))
                {
                    errors.Add(validation.ErrorMessage ??
                        $"{prop.Name} failed validation");
                }
            }
        }
        return errors;
    }
}

// Usage
public class Product
{
    [Required(ErrorMessage = "Name is required")]
    [MinLength(3, ErrorMessage = "Name must be at least 3 characters")]
    public string Name { get; set; } = "";
}

var product = new Product { Name = "AB" };
var errors = SimpleValidator.Validate(product);
// errors: ["Name must be at least 3 characters"]
\`\`\`

## Caller Information Attributes

Automatically capture caller info:

\`\`\`csharp
using System.Runtime.CompilerServices;

public static class Logger
{
    public static void Log(
        string message,
        [CallerMemberName] string memberName = "",
        [CallerFilePath] string filePath = "",
        [CallerLineNumber] int lineNumber = 0)
    {
        Console.WriteLine($"[{memberName}] {message}");
        Console.WriteLine($"  at {filePath}:{lineNumber}");
    }
}

// Usage
public class MyService
{
    public void DoWork()
    {
        Logger.Log("Starting work");
        // Output:
        // [DoWork] Starting work
        //   at C:\\MyProject\\MyService.cs:15
    }
}
\`\`\`

## Assembly-Level Attributes

Apply attributes to the entire assembly:

\`\`\`csharp
// Usually in AssemblyInfo.cs or at top of any file
[assembly: AssemblyTitle("My Application")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyCompany("My Company")]
[assembly: AssemblyCopyright("Copyright 2024")]

// Make internal types visible to test assembly
[assembly: InternalsVisibleTo("MyApp.Tests")]

// Global nullable context
[module: System.Runtime.CompilerServices.NullableContext(1)]
\`\`\`

## Common Framework Attributes

\`\`\`csharp
// ASP.NET Core
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(User), 200)]
    [Authorize(Roles = "Admin")]
    public IActionResult GetUser(int id) { }
}

// Entity Framework Core
public class Product
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = "";

    [Column("unit_price", TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [ForeignKey("Category")]
    public int CategoryId { get; set; }
}

// xUnit Testing
public class CalculatorTests
{
    [Fact]
    public void Add_TwoNumbers_ReturnsSum() { }

    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(0, 0, 0)]
    public void Add_Various_ReturnsExpected(int a, int b, int expected) { }
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use built-in attributes like Obsolete, Serializable, and Conditional
- Apply JSON and validation attributes for data handling
- Create custom attributes with AttributeUsage
- Read attributes at runtime using reflection
- Understand how frameworks use attributes for configuration
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Using Built-in Attributes',
      description: `Practice using Obsolete and other built-in attributes.

**Your task:**
1. Create a \`Calculator\` class
2. Add a \`CalculateOld\` method marked as [Obsolete] with a message
3. Add a \`CalculateNew\` method that does the same thing
4. Call both methods and observe the warning

**Note:** The Obsolete attribute generates a compiler warning when the method is used.`,
      starterCode: `using System;

// Step 1-2: Create Calculator class with obsolete method


// Step 3: Add CalculateNew method


// Step 4: Call both methods

`,
      solution: `using System;

public class Calculator
{
    [Obsolete("Use CalculateNew instead")]
    public int CalculateOld(int a, int b)
    {
        return a + b;
    }

    public int CalculateNew(int a, int b)
    {
        return a + b;
    }
}

Calculator calc = new Calculator();
Console.WriteLine($"Old: {calc.CalculateOld(5, 3)}");
Console.WriteLine($"New: {calc.CalculateNew(5, 3)}");`,
      expectedOutput: [
        'Old: 8',
        'New: 8'
      ],
      hints: [
        '[Obsolete("message")] goes above the method',
        'The method still works, but generates a warning',
        'Set error: true to make it a compile error instead',
        'Both methods do the same calculation for this exercise'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Create a Custom Attribute',
      description: `Create and use a custom attribute for marking class importance.

**Your task:**
1. Create a \`PriorityAttribute\` that takes an int level and optional string description
2. Apply AttributeUsage to allow it on classes only
3. Create two classes with different priority levels
4. Use reflection to read and print the priority of each class

**Key:** The attribute constructor takes required parameters, named properties are optional.`,
      starterCode: `using System;
using System.Reflection;

// Step 1-2: Create PriorityAttribute


// Step 3: Create two classes with different priorities


// Step 4: Read and print priorities using reflection

`,
      solution: `using System;
using System.Reflection;

[AttributeUsage(AttributeTargets.Class)]
public class PriorityAttribute : Attribute
{
    public int Level { get; }
    public string? Description { get; set; }

    public PriorityAttribute(int level)
    {
        Level = level;
    }
}

[Priority(1, Description = "Critical system")]
public class PaymentService { }

[Priority(3, Description = "Low priority")]
public class LoggingService { }

Type paymentType = typeof(PaymentService);
Type loggingType = typeof(LoggingService);

PriorityAttribute? paymentPriority = paymentType.GetCustomAttribute<PriorityAttribute>();
PriorityAttribute? loggingPriority = loggingType.GetCustomAttribute<PriorityAttribute>();

Console.WriteLine($"PaymentService: Level {paymentPriority?.Level} - {paymentPriority?.Description}");
Console.WriteLine($"LoggingService: Level {loggingPriority?.Level} - {loggingPriority?.Description}");`,
      expectedOutput: [
        'PaymentService: Level 1 - Critical system',
        'LoggingService: Level 3 - Low priority'
      ],
      hints: [
        'Inherit from Attribute class',
        'Constructor parameters become required in [Priority(1)]',
        'Properties with setters can be set with named syntax',
        'Use GetCustomAttribute<T>() to retrieve the attribute'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Validation Attributes',
      description: `Create a simple validation system using custom attributes.

**Your task:**
1. Create a \`NotEmptyAttribute\` that validates strings are not null or empty
2. Create a \`RangeAttribute\` that validates numbers are within min/max
3. Create a \`Person\` class with Name (not empty) and Age (0-150)
4. Write a validate function and test it

**Key:** Use reflection to check property values against attribute rules.`,
      starterCode: `using System;
using System.Reflection;
using System.Collections.Generic;

// Step 1: Create NotEmptyAttribute


// Step 2: Create RangeAttribute


// Step 3: Create Person class with attributes


// Step 4: Write validate function and test

`,
      solution: `using System;
using System.Reflection;
using System.Collections.Generic;

[AttributeUsage(AttributeTargets.Property)]
public class NotEmptyAttribute : Attribute { }

[AttributeUsage(AttributeTargets.Property)]
public class RangeAttribute : Attribute
{
    public int Min { get; }
    public int Max { get; }
    public RangeAttribute(int min, int max) { Min = min; Max = max; }
}

public class Person
{
    [NotEmpty]
    public string Name { get; set; } = "";

    [Range(0, 150)]
    public int Age { get; set; }
}

List<string> Validate(object obj)
{
    var errors = new List<string>();
    foreach (var prop in obj.GetType().GetProperties())
    {
        var value = prop.GetValue(obj);

        if (prop.GetCustomAttribute<NotEmptyAttribute>() != null)
        {
            if (string.IsNullOrEmpty(value as string))
                errors.Add($"{prop.Name} cannot be empty");
        }

        var range = prop.GetCustomAttribute<RangeAttribute>();
        if (range != null && value is int num)
        {
            if (num < range.Min || num > range.Max)
                errors.Add($"{prop.Name} must be between {range.Min} and {range.Max}");
        }
    }
    return errors;
}

var validPerson = new Person { Name = "Alice", Age = 30 };
var invalidPerson = new Person { Name = "", Age = 200 };

Console.WriteLine($"Valid: {Validate(validPerson).Count} errors");
Console.WriteLine($"Invalid: {string.Join(", ", Validate(invalidPerson))}");`,
      expectedOutput: [
        'Valid: 0 errors',
        'Invalid: Name cannot be empty, Age must be between 0 and 150'
      ],
      hints: [
        'Both attributes need AttributeTargets.Property',
        'GetCustomAttribute returns null if not present',
        'Check each attribute type separately in the validation loop',
        'Cast value appropriately for each check'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the purpose of AttributeUsage?',
      options: [
        'To define what the attribute does',
        'To specify where an attribute can be applied and its behavior',
        'To make attributes faster',
        'To serialize attributes'
      ],
      correctIndex: 1,
      explanation: 'AttributeUsage specifies valid targets (class, method, property, etc.), whether multiple instances are allowed, and whether it is inherited by derived classes.'
    },
    {
      question: 'How do you read custom attributes at runtime?',
      options: [
        'Attributes are only compile-time and cannot be read',
        'Using the Attribute.GetCustomAttribute or GetCustomAttribute<T> methods',
        'Attributes automatically expose their values as properties',
        'Using the GetAttribute() method on any object'
      ],
      correctIndex: 1,
      explanation: 'Attributes are stored in assembly metadata and can be read at runtime using reflection methods like Attribute.GetCustomAttribute() or the generic extension method GetCustomAttribute<T>().'
    },
    {
      question: 'What does [Obsolete("message", true)] do differently from [Obsolete("message")]?',
      options: [
        'It prints the message to console',
        'It causes a compile error instead of a warning when the member is used',
        'It removes the method from the assembly',
        'It logs the usage to a file'
      ],
      correctIndex: 1,
      explanation: 'When the second parameter is true, using the obsolete member causes a compile error instead of just a warning, effectively preventing its use.'
    },
    {
      question: 'In a custom attribute, what is the difference between constructor parameters and properties?',
      options: [
        'There is no difference',
        'Constructor parameters are required, properties with setters are optional and use named syntax',
        'Properties are faster to access',
        'Constructor parameters cannot be strings'
      ],
      correctIndex: 1,
      explanation: 'Constructor parameters must be provided when applying the attribute. Properties with public setters can optionally be set using named parameter syntax: [MyAttr(1, OptionalProp = "value")].'
    }
  ],
  buildNote: {
    title: 'Attributes Power Modern Frameworks',
    explanation: `Attributes are the backbone of declarative programming in .NET. ASP.NET Core uses them for routing ([Route], [HttpGet]), authorization ([Authorize]), and API documentation. Entity Framework uses them for database mapping. Serializers use them to control JSON/XML output. Understanding attributes is essential for using and building .NET frameworks.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/codeRunner.ts'
    ],
    inTheRealWorld: `Every major .NET framework relies heavily on attributes. ASP.NET Core controllers are configured entirely through attributes. Entity Framework Code First uses attributes for database schema definition. JSON serializers like System.Text.Json and Newtonsoft.Json use attributes for customization. Test frameworks like xUnit use [Fact] and [Theory]. Even dependency injection uses [Inject] attributes in some containers.`
  }
};
