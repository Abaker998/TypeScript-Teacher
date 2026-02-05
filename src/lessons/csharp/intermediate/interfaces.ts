import { Lesson } from '@/types/lesson';

export const csharpInterfaces: Lesson = {
  slug: 'csharp-interfaces',
  title: 'C# Interfaces',
  description: 'Define contracts for classes with interfaces and explicit implementation in C#.',
  difficulty: 'intermediate',
  order: 10,
  content: `
# C# Interfaces

Interfaces define a contract that classes must implement. They specify what a class must do, but not how it does it.

## Defining an Interface

An interface declares method signatures, properties, events, and indexers:

\`\`\`csharp
public interface IAnimal
{
    string Name { get; set; }
    void Speak();
    string GetDescription();
}
\`\`\`

By convention, C# interface names start with "I".

## Implementing an Interface

A class uses the colon to implement an interface:

\`\`\`csharp
public class Dog : IAnimal
{
    public string Name { get; set; }

    public Dog(string name)
    {
        Name = name;
    }

    public void Speak()
    {
        Console.WriteLine($"{Name} says: Woof!");
    }

    public string GetDescription()
    {
        return $"A dog named {Name}";
    }
}

Dog dog = new Dog("Buddy");
dog.Speak();  // "Buddy says: Woof!"
\`\`\`

## Interface as a Type

Use interfaces to write flexible code:

\`\`\`csharp
public void MakeSpeak(IAnimal animal)
{
    animal.Speak();  // Works with any IAnimal
}

Dog dog = new Dog("Rex");
Cat cat = new Cat("Whiskers");

MakeSpeak(dog);  // "Rex says: Woof!"
MakeSpeak(cat);  // "Whiskers says: Meow!"
\`\`\`

## Multiple Interface Implementation

A class can implement multiple interfaces:

\`\`\`csharp
public interface ISwimmable
{
    void Swim();
}

public interface IFlyable
{
    void Fly();
}

public class Duck : IAnimal, ISwimmable, IFlyable
{
    public string Name { get; set; }

    public void Speak() => Console.WriteLine("Quack!");
    public string GetDescription() => $"A duck named {Name}";
    public void Swim() => Console.WriteLine($"{Name} is swimming");
    public void Fly() => Console.WriteLine($"{Name} is flying");
}
\`\`\`

## Explicit Interface Implementation

When two interfaces have the same member, or you want to hide interface members:

\`\`\`csharp
public interface IPrinter
{
    void Print();
}

public interface IScanner
{
    void Print();  // Same name as IPrinter!
}

public class MultiFunctionDevice : IPrinter, IScanner
{
    // Explicit implementation - must cast to access
    void IPrinter.Print()
    {
        Console.WriteLine("Printing document...");
    }

    void IScanner.Print()
    {
        Console.WriteLine("Printing scan preview...");
    }
}

MultiFunctionDevice device = new MultiFunctionDevice();
// device.Print();  // Error! No public Print method

// Must cast to the interface:
((IPrinter)device).Print();   // "Printing document..."
((IScanner)device).Print();   // "Printing scan preview..."
\`\`\`

## Interface Inheritance

Interfaces can extend other interfaces:

\`\`\`csharp
public interface IShape
{
    double Area { get; }
}

public interface IColoredShape : IShape
{
    string Color { get; set; }
}

public class ColoredCircle : IColoredShape
{
    public double Radius { get; set; }
    public string Color { get; set; }

    public double Area => Math.PI * Radius * Radius;
}
\`\`\`

## Default Interface Methods (C# 8.0+)

Interfaces can provide default implementations:

\`\`\`csharp
public interface ILogger
{
    void Log(string message);

    // Default implementation
    void LogError(string message)
    {
        Log($"ERROR: {message}");
    }

    void LogWarning(string message)
    {
        Log($"WARNING: {message}");
    }
}
\`\`\`

## Properties in Interfaces

\`\`\`csharp
public interface IIdentifiable
{
    int Id { get; }           // Read-only
    string Code { get; set; } // Read-write
}

public interface ITimestamped
{
    DateTime CreatedAt { get; }
    DateTime? UpdatedAt { get; set; }
}

public class Product : IIdentifiable, ITimestamped
{
    public int Id { get; private set; }
    public string Code { get; set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; set; }
    public string Name { get; set; }

    public Product(int id, string code, string name)
    {
        Id = id;
        Code = code;
        Name = name;
        CreatedAt = DateTime.Now;
    }
}
\`\`\`

## Common .NET Interfaces

\`\`\`csharp
// IDisposable - for cleanup
public class DatabaseConnection : IDisposable
{
    public void Dispose()
    {
        // Clean up resources
    }
}

// IComparable - for sorting
public class Person : IComparable<Person>
{
    public string Name { get; set; }

    public int CompareTo(Person other)
    {
        return Name.CompareTo(other.Name);
    }
}

// IEnumerable - for iteration
public class NumberRange : IEnumerable<int>
{
    private int start, end;

    public IEnumerator<int> GetEnumerator()
    {
        for (int i = start; i <= end; i++)
            yield return i;
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
\`\`\`

## Interface vs Abstract Class

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| Multiple inheritance | Yes | No |
| Fields | No | Yes |
| Constructors | No | Yes |
| Access modifiers | Public only* | Any |
| Default implementation | C# 8.0+ | Yes |

*Default interface methods can have access modifiers in C# 8.0+

## Common Patterns

\`\`\`csharp
// Repository pattern
public interface IRepository<T>
{
    T GetById(int id);
    IEnumerable<T> GetAll();
    void Add(T entity);
    void Update(T entity);
    void Delete(int id);
}

// Service pattern
public interface IEmailService
{
    Task SendAsync(string to, string subject, string body);
    Task<bool> ValidateEmailAsync(string email);
}

// Factory pattern
public interface IVehicleFactory
{
    IVehicle CreateVehicle(string type);
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Define interfaces to establish contracts
- Implement interfaces in classes
- Use explicit interface implementation
- Apply interfaces for loose coupling
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Define and Implement an Interface',
      description: `Interfaces define contracts that classes must follow.

**Your task:**
1. Define an interface \`IVehicle\` with:
   - A property \`Brand\` (string, get only)
   - A method \`Start()\` that returns void
2. Create a \`Car\` class that implements IVehicle
3. Implement Brand and Start (print "Car started")
4. Create a car and call Start()`,
      starterCode: `// Step 1: Define the IVehicle interface


// Step 2: Create Car class implementing IVehicle


// Step 3: Implement the interface members


// Step 4: Create a car and start it

`,
      solution: `public interface IVehicle
{
    string Brand { get; }
    void Start();
}

public class Car : IVehicle
{
    public string Brand { get; }

    public Car(string brand)
    {
        Brand = brand;
    }

    public void Start()
    {
        Console.WriteLine("Car started");
    }
}

Car car = new Car("Toyota");
car.Start();`,
      expectedOutput: ['Car started'],
      hints: [
        'Interface: public interface IVehicle { }',
        'Implement with colon: class Car : IVehicle',
        'All interface members must be public in the class'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Multiple Interfaces',
      description: `A class can implement multiple interfaces, gaining all their contracts.

**Your task:**
1. Define \`IPlayable\` with a \`Play()\` method returning void
2. Define \`IRecordable\` with a \`Record()\` method returning void
3. Create a \`MediaPlayer\` class implementing both
4. Test by calling both methods`,
      starterCode: `// Step 1: Define IPlayable interface


// Step 2: Define IRecordable interface


// Step 3: Create MediaPlayer implementing both


// Step 4: Test both methods

`,
      solution: `public interface IPlayable
{
    void Play();
}

public interface IRecordable
{
    void Record();
}

public class MediaPlayer : IPlayable, IRecordable
{
    public void Play()
    {
        Console.WriteLine("Playing media");
    }

    public void Record()
    {
        Console.WriteLine("Recording media");
    }
}

MediaPlayer player = new MediaPlayer();
player.Play();
player.Record();`,
      expectedOutput: ['Playing media', 'Recording media'],
      hints: [
        'Separate multiple interfaces with commas',
        'class MediaPlayer : IPlayable, IRecordable',
        'Implement all methods from both interfaces'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Explicit Interface Implementation',
      description: `When interfaces have conflicting members, use explicit implementation.

**Your task:**
1. Create \`IFileReader\` with \`Read()\` returning "Reading file"
2. Create \`INetworkReader\` with \`Read()\` returning "Reading network"
3. Create \`DataReader\` explicitly implementing both
4. Cast to each interface and call Read()`,
      starterCode: `// Step 1: Define IFileReader


// Step 2: Define INetworkReader


// Step 3: Create DataReader with explicit implementation


// Step 4: Test with interface casts

`,
      solution: `public interface IFileReader
{
    string Read();
}

public interface INetworkReader
{
    string Read();
}

public class DataReader : IFileReader, INetworkReader
{
    string IFileReader.Read()
    {
        return "Reading file";
    }

    string INetworkReader.Read()
    {
        return "Reading network";
    }
}

DataReader reader = new DataReader();
Console.WriteLine(((IFileReader)reader).Read());
Console.WriteLine(((INetworkReader)reader).Read());`,
      expectedOutput: ['Reading file', 'Reading network'],
      hints: [
        'Explicit: string IFileReader.Read() { }',
        'No public keyword in explicit implementation',
        'Must cast to interface to call: ((IFileReader)reader).Read()'
      ],
    }
  ],
  quiz: [
    {
      question: 'What is the naming convention for interfaces in C#?',
      options: [
        'Start with "Interface"',
        'Start with capital "I"',
        'End with "able"',
        'Use all uppercase'
      ],
      correctIndex: 1,
      explanation: 'C# convention is to prefix interface names with "I", like IDisposable, IEnumerable, IComparable.'
    },
    {
      question: 'What happens when a class implements an interface?',
      options: [
        'It inherits all the code from the interface',
        'It must provide implementations for all interface members',
        'It becomes an abstract class',
        'It can only be used as that interface type'
      ],
      correctIndex: 1,
      explanation: 'A class implementing an interface must provide concrete implementations for all members defined in that interface.'
    },
    {
      question: 'When should you use explicit interface implementation?',
      options: [
        'Always, for better performance',
        'When two interfaces have members with the same signature',
        'Only with generic interfaces',
        'When the interface has more than 5 methods'
      ],
      correctIndex: 1,
      explanation: 'Explicit implementation resolves conflicts when multiple interfaces have members with the same name and signature.'
    },
    {
      question: 'How many interfaces can a C# class implement?',
      options: [
        'Only one',
        'Up to three',
        'Unlimited',
        'One per method'
      ],
      correctIndex: 2,
      explanation: 'C# supports implementing unlimited interfaces. This enables composition over inheritance.'
    }
  ],
  buildNote: {
    title: 'Interfaces in C# Applications',
    explanation: `Interfaces are fundamental to C# application architecture. ASP.NET Core uses interfaces extensively for dependency injection - you define services as interfaces (IUserService, IEmailService) and register implementations in the DI container. Entity Framework uses IDbContext. The entire .NET class library is built on interfaces like IEnumerable<T>, IDisposable, and IComparable<T>. Interface-based design enables unit testing through mocking - you can substitute real implementations with test doubles.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/components/Sidebar.tsx'
    ],
    inTheRealWorld: `Enterprise C# applications are built on interfaces. Clean Architecture separates concerns using interface boundaries. Repository patterns use IRepository<T> to abstract data access. SOLID principles, especially Dependency Inversion, rely heavily on interfaces. Libraries like MediatR use IRequest<T> and IRequestHandler<TRequest, TResponse> for CQRS patterns. Understanding interfaces is essential for working with any modern C# codebase.`
  }
};
