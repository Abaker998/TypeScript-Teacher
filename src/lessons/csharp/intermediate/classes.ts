import { Lesson } from '@/types/lesson';

export const csharpClasses: Lesson = {
  slug: 'csharp-classes',
  title: 'C# Classes & Properties',
  description: 'Master object-oriented programming with C# classes, properties, and inheritance.',
  difficulty: 'intermediate',
  order: 13,
  content: `
# C# Classes & Object-Oriented Programming

Classes are blueprints for creating objects. C# provides rich OOP features including properties, access modifiers, and inheritance.

## Basic Class Structure

\`\`\`csharp
public class Person
{
    // Fields (private by convention)
    private string _name;
    private int _age;

    // Constructor
    public Person(string name, int age)
    {
        _name = name;
        _age = age;
    }

    // Method
    public string Introduce()
    {
        return $"Hi, I'm {_name} and I'm {_age} years old.";
    }
}

Person person = new Person("Alice", 30);
Console.WriteLine(person.Introduce());
\`\`\`

## Properties

Properties provide controlled access to fields:

\`\`\`csharp
public class Product
{
    // Auto-implemented property
    public string Name { get; set; }

    // Read-only property
    public DateTime CreatedAt { get; } = DateTime.Now;

    // Property with backing field
    private decimal _price;
    public decimal Price
    {
        get => _price;
        set
        {
            if (value < 0)
                throw new ArgumentException("Price cannot be negative");
            _price = value;
        }
    }

    // Computed property
    public decimal PriceWithTax => Price * 1.1m;
}
\`\`\`

## Init-Only Properties (C# 9+)

Allow setting only during initialization:

\`\`\`csharp
public class User
{
    public int Id { get; init; }
    public string Name { get; init; }
    public string Email { get; set; }
}

// Can set during creation
User user = new User { Id = 1, Name = "Alice", Email = "alice@example.com" };

// But not after
// user.Id = 2;  // Error! Init-only property
user.Email = "newemail@example.com";  // OK - regular setter
\`\`\`

## Access Modifiers

\`\`\`csharp
public class BankAccount
{
    public string Owner { get; set; }           // Accessible everywhere
    private decimal _balance;                    // Only in this class
    protected string AccountNumber { get; set; } // This class + derived
    internal int BranchId { get; set; }         // Same assembly only
    protected internal string Region { get; set; } // Protected OR internal
    private protected string Code { get; set; }    // Protected AND internal

    public decimal GetBalance() => _balance;

    public void Deposit(decimal amount)
    {
        if (amount > 0)
            _balance += amount;
    }
}
\`\`\`

## Constructor Overloading

\`\`\`csharp
public class Rectangle
{
    public double Width { get; }
    public double Height { get; }

    // Primary constructor
    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }

    // Overloaded constructor (square)
    public Rectangle(double size) : this(size, size)
    {
    }

    // Default constructor
    public Rectangle() : this(1, 1)
    {
    }

    public double Area => Width * Height;
}

var rect1 = new Rectangle(4, 5);    // 4x5
var rect2 = new Rectangle(3);       // 3x3 square
var rect3 = new Rectangle();        // 1x1 default
\`\`\`

## Inheritance

\`\`\`csharp
public class Animal
{
    public string Name { get; set; }

    public Animal(string name)
    {
        Name = name;
    }

    public virtual string Speak()
    {
        return $"{Name} makes a sound";
    }
}

public class Dog : Animal
{
    public string Breed { get; set; }

    public Dog(string name, string breed) : base(name)
    {
        Breed = breed;
    }

    public override string Speak()
    {
        return $"{Name} says: Woof!";
    }

    public void Fetch()
    {
        Console.WriteLine($"{Name} fetches the ball!");
    }
}

Dog dog = new Dog("Buddy", "Golden Retriever");
Console.WriteLine(dog.Speak());  // "Buddy says: Woof!"
\`\`\`

## Abstract Classes

\`\`\`csharp
public abstract class Shape
{
    public string Color { get; set; }

    // Abstract method - must be implemented
    public abstract double CalculateArea();

    // Virtual method - can be overridden
    public virtual string Describe()
    {
        return $"A {Color} shape with area {CalculateArea()}";
    }
}

public class Circle : Shape
{
    public double Radius { get; set; }

    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }
}
\`\`\`

## Records (C# 9+)

Concise syntax for immutable data classes:

\`\`\`csharp
// Record with positional parameters
public record Person(string Name, int Age);

// Creates immutable class with:
// - Constructor
// - Properties (Name, Age)
// - ToString()
// - Equals() / GetHashCode()
// - Deconstruction

var person1 = new Person("Alice", 30);
var person2 = new Person("Alice", 30);

Console.WriteLine(person1 == person2);  // True (value equality)
Console.WriteLine(person1);  // "Person { Name = Alice, Age = 30 }"

// Non-destructive mutation
var person3 = person1 with { Age = 31 };
\`\`\`

## Primary Constructors (C# 12+)

\`\`\`csharp
public class Person(string name, int age)
{
    public string Name { get; } = name;
    public int Age { get; } = age;

    public string Introduce() => $"Hi, I'm {name}!";
}

// Parameters captured directly
Person person = new Person("Alice", 30);
\`\`\`

## Static Members

\`\`\`csharp
public class MathHelper
{
    public static double Pi => 3.14159;

    public static double Square(double x) => x * x;

    private static int _callCount = 0;

    public static int GetCallCount()
    {
        _callCount++;
        return _callCount;
    }
}

// No instance needed
Console.WriteLine(MathHelper.Pi);
Console.WriteLine(MathHelper.Square(5));  // 25
\`\`\`

## Sealed Classes

Prevent inheritance:

\`\`\`csharp
public sealed class Logger
{
    public void Log(string message)
    {
        Console.WriteLine($"[LOG] {message}");
    }
}

// public class SpecialLogger : Logger { }  // Error! Cannot inherit
\`\`\`

## Partial Classes

Split a class across files:

\`\`\`csharp
// File: User.cs
public partial class User
{
    public string Name { get; set; }
    public string Email { get; set; }
}

// File: User.Validation.cs
public partial class User
{
    public bool IsValid()
    {
        return !string.IsNullOrEmpty(Name) && Email.Contains("@");
    }
}
\`\`\`

## Object Initializers

\`\`\`csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public List<string> Hobbies { get; set; } = new();
}

// Object initializer syntax
var person = new Person
{
    Name = "Alice",
    Age = 30,
    Hobbies = { "Reading", "Gaming", "Hiking" }
};
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create classes with properties and methods
- Use access modifiers appropriately
- Implement inheritance and override methods
- Use records for immutable data types
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Class with Properties',
      description: `Create a class with auto-implemented properties.

**Your task:**
1. Create a \`Book\` class with Title and Author properties (string)
2. Add a constructor that takes both values
3. Add a GetInfo() method returning "Title by Author"
4. Create a book and print its info`,
      starterCode: `// Step 1: Create Book class with properties


// Step 2: Add constructor


// Step 3: Add GetInfo method


// Step 4: Create book and print info

`,
      solution: `public class Book
{
    public string Title { get; set; }
    public string Author { get; set; }

    public Book(string title, string author)
    {
        Title = title;
        Author = author;
    }

    public string GetInfo()
    {
        return $"{Title} by {Author}";
    }
}

Book book = new Book("1984", "George Orwell");
Console.WriteLine(book.GetInfo());`,
      expectedOutput: ['1984 by George Orwell'],
      hints: [
        'Auto-property: public string Title { get; set; }',
        'Constructor assigns: Title = title;',
        'Use string interpolation: $"{Title} by {Author}"'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Property with Validation',
      description: `Create a property that validates its value.

**Your task:**
1. Create a \`Temperature\` class with a private field \`_celsius\`
2. Add a Celsius property that prevents values below -273.15 (absolute zero)
3. If invalid, throw ArgumentException
4. Add a Fahrenheit read-only property that converts
5. Test by setting 25 Celsius and printing Fahrenheit`,
      starterCode: `// Step 1-2: Create Temperature class with validated Celsius


// Step 3: Add Fahrenheit computed property


// Step 4: Test the class

`,
      solution: `public class Temperature
{
    private double _celsius;

    public double Celsius
    {
        get => _celsius;
        set
        {
            if (value < -273.15)
                throw new ArgumentException("Below absolute zero!");
            _celsius = value;
        }
    }

    public double Fahrenheit => _celsius * 9 / 5 + 32;
}

Temperature temp = new Temperature();
temp.Celsius = 25;
Console.WriteLine(temp.Fahrenheit);`,
      expectedOutput: ['77'],
      hints: [
        'Property setter can include validation logic',
        'throw new ArgumentException("message");',
        'Fahrenheit formula: C * 9/5 + 32'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Inheritance',
      description: `Create a class hierarchy with virtual methods.

**Your task:**
1. Create a base \`Vehicle\` class with a Name property and virtual StartEngine() method
2. StartEngine should return "Engine started"
3. Create \`ElectricCar\` that inherits from Vehicle
4. Override StartEngine to return "Electric motor activated"
5. Test both classes`,
      starterCode: `// Step 1-2: Create Vehicle base class


// Step 3-4: Create ElectricCar subclass


// Step 5: Test both

`,
      solution: `public class Vehicle
{
    public string Name { get; set; }

    public Vehicle(string name)
    {
        Name = name;
    }

    public virtual string StartEngine()
    {
        return "Engine started";
    }
}

public class ElectricCar : Vehicle
{
    public ElectricCar(string name) : base(name)
    {
    }

    public override string StartEngine()
    {
        return "Electric motor activated";
    }
}

Vehicle car = new Vehicle("Regular Car");
Console.WriteLine(car.StartEngine());

ElectricCar tesla = new ElectricCar("Tesla");
Console.WriteLine(tesla.StartEngine());`,
      expectedOutput: ['Engine started', 'Electric motor activated'],
      hints: [
        'Use virtual keyword for overridable methods',
        'Use override keyword in derived class',
        'Call base constructor with : base(name)'
      ],
    }
  ],
  quiz: [
    {
      question: 'What is the difference between a field and a property in C#?',
      options: [
        'They are the same thing',
        'Properties provide controlled access with getters/setters',
        'Fields are public, properties are private',
        'Properties can only be read'
      ],
      correctIndex: 1,
      explanation: 'Properties wrap fields with get/set accessors, allowing validation, computed values, and encapsulation.'
    },
    {
      question: 'What does the "virtual" keyword indicate?',
      options: [
        'The method doesn\'t exist yet',
        'The method can be overridden in derived classes',
        'The method is static',
        'The method is private'
      ],
      correctIndex: 1,
      explanation: 'Virtual methods can be overridden by derived classes using the override keyword.'
    },
    {
      question: 'What is a record in C#?',
      options: [
        'A database table',
        'A type with built-in value equality and immutability',
        'A log file',
        'A type of array'
      ],
      correctIndex: 1,
      explanation: 'Records are reference types with value-based equality, automatic ToString, and support for non-destructive mutation with "with".'
    },
    {
      question: 'What does the "init" accessor do?',
      options: [
        'Initializes the property to zero',
        'Allows setting only during object initialization',
        'Runs initialization code',
        'Creates a default constructor'
      ],
      correctIndex: 1,
      explanation: 'Init-only setters (C# 9+) allow properties to be set during object creation but become read-only afterward.'
    }
  ],
  buildNote: {
    title: 'Classes in C# Applications',
    explanation: `C# classes are the foundation of .NET applications. ASP.NET Core uses classes for controllers, services, and models. Entity Framework uses classes as database entities. The Repository pattern encapsulates data access in classes. Modern C# favors records for DTOs and value objects, and init-only properties for configuration objects.`,
    relatedFiles: [
      'src/components/Sidebar.tsx',
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Enterprise C# applications heavily use class hierarchies for domain modeling. Dependency injection relies on class/interface pairs. ASP.NET Core's middleware, controllers, and services are all classes. Entity Framework Core maps classes to database tables. Records are increasingly used for API responses and domain events. Understanding OOP principles is essential for working with any C# codebase.`
  }
};
