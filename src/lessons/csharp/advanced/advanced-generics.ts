import { Lesson } from '@/types/lesson';

export const advancedGenerics: Lesson = {
  slug: 'csharp-advanced-generics',
  title: 'Advanced Generics',
  description: 'Master covariance, contravariance, and advanced generic constraints in C#.',
  difficulty: 'advanced',
  order: 25,
  content: `
# Advanced C# Generics

Beyond basic generics, C# provides variance annotations and sophisticated constraints that enable flexible, type-safe APIs.

## Covariance with \`out\`

Covariance lets you use a more derived type than originally specified. Use \`out\` for types that are only returned (produced):

\`\`\`csharp
// IEnumerable<T> is covariant (defined with out T)
// public interface IEnumerable<out T> { ... }

IEnumerable<string> strings = new List<string> { "a", "b", "c" };
IEnumerable<object> objects = strings;  // OK! string is more derived than object

// This works because IEnumerable only produces T values (via iteration)
// It never consumes T values

// Covariant interface example
public interface IProducer<out T>
{
    T Produce();  // OK - T is in output position
    // void Consume(T item);  // Error! T cannot be in input position
}

public class AnimalProducer : IProducer<Animal>
{
    public Animal Produce() => new Animal();
}

public class DogProducer : IProducer<Dog>
{
    public Dog Produce() => new Dog();
}

// Covariance in action
IProducer<Animal> producer = new DogProducer();  // Dog is more derived than Animal
Animal animal = producer.Produce();  // Gets a Dog, assigned to Animal
\`\`\`

## Contravariance with \`in\`

Contravariance lets you use a less derived type than originally specified. Use \`in\` for types that are only accepted (consumed):

\`\`\`csharp
// Action<T> is contravariant (defined with in T)
// public delegate void Action<in T>(T obj);

Action<object> objectAction = obj => Console.WriteLine(obj);
Action<string> stringAction = objectAction;  // OK! Can pass string to object handler

stringAction("Hello");  // Works: string is passed to handler expecting object

// Contravariant interface example
public interface IConsumer<in T>
{
    void Consume(T item);  // OK - T is in input position
    // T Produce();  // Error! T cannot be in output position
}

public class AnimalConsumer : IConsumer<Animal>
{
    public void Consume(Animal animal) => Console.WriteLine($"Consuming {animal}");
}

// Contravariance in action
IConsumer<Dog> dogConsumer = new AnimalConsumer();  // Animal is less derived
dogConsumer.Consume(new Dog());  // Passes Dog to handler expecting Animal
\`\`\`

## Variance Rules Summary

\`\`\`csharp
// COVARIANCE (out) - "out means output"
// - Can only appear in output positions (return types)
// - Allows: MoreDerived -> LessDerived (Dog -> Animal)
// - Think: "Producer of Dogs can be used as Producer of Animals"
public interface IProducer<out T> { T Get(); }

// CONTRAVARIANCE (in) - "in means input"
// - Can only appear in input positions (parameters)
// - Allows: LessDerived -> MoreDerived (Animal -> Dog)
// - Think: "Consumer of Animals can be used as Consumer of Dogs"
public interface IConsumer<in T> { void Process(T item); }

// INVARIANCE (no modifier) - default
// - Can appear in both input and output positions
// - No variance allowed
public interface IList<T> { T Get(int i); void Set(int i, T item); }
\`\`\`

## Practical Variance Examples

\`\`\`csharp
// Repository pattern with variance
public interface IReadRepository<out T>
{
    T GetById(int id);
    IEnumerable<T> GetAll();
}

public interface IWriteRepository<in T>
{
    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
}

// Combined (invariant because T appears in both positions)
public interface IRepository<T> : IReadRepository<T>, IWriteRepository<T> { }

// Usage
public class Animal { public string Name { get; set; } = ""; }
public class Dog : Animal { public string Breed { get; set; } = ""; }

public class DogRepository : IReadRepository<Dog>
{
    public Dog GetById(int id) => new Dog { Name = "Buddy", Breed = "Labrador" };
    public IEnumerable<Dog> GetAll() => new[] { GetById(1) };
}

// Covariance allows this assignment
IReadRepository<Animal> animalRepo = new DogRepository();
Animal animal = animalRepo.GetById(1);  // Returns Dog as Animal
\`\`\`

## Advanced Generic Constraints

\`\`\`csharp
// Single constraint
public class Container<T> where T : class { }       // Reference type
public class ValueContainer<T> where T : struct { } // Value type (non-nullable)
public class NewContainer<T> where T : new() { }    // Has parameterless constructor

// Multiple constraints
public class Service<T> where T : class, IDisposable, new()
{
    public T CreateAndUse()
    {
        T instance = new T();
        // Use instance...
        instance.Dispose();
        return instance;
    }
}

// Base class constraint
public class AnimalService<T> where T : Animal
{
    public void Feed(T animal) => Console.WriteLine($"Feeding {animal.Name}");
}

// Multiple type parameters with constraints
public class Mapper<TSource, TTarget>
    where TSource : class
    where TTarget : class, new()
{
    public TTarget Map(TSource source)
    {
        TTarget target = new TTarget();
        // Map properties...
        return target;
    }
}

// notnull constraint (C# 8+)
public class NonNullContainer<T> where T : notnull
{
    private T _value;
    public NonNullContainer(T value) => _value = value;
}
\`\`\`

## The \`default\` Constraint

\`\`\`csharp
// Problem: What if you want to allow both class and struct?
// Solution: Use default constraint (C# 9+)

public class FlexibleContainer<T>
{
    private T? _value;  // Nullable regardless of T being class or struct

    public void Set(T value) => _value = value;

    public T? Get() => _value;

    public void Clear() => _value = default;  // null for class, default value for struct
}

// Works with both
var stringContainer = new FlexibleContainer<string>();
var intContainer = new FlexibleContainer<int>();

stringContainer.Set("Hello");
intContainer.Set(42);

stringContainer.Clear();  // _value = null
intContainer.Clear();     // _value = 0
\`\`\`

## Generic Method Constraints

\`\`\`csharp
public static class GenericMethods
{
    // Comparable items
    public static T Max<T>(T a, T b) where T : IComparable<T>
    {
        return a.CompareTo(b) > 0 ? a : b;
    }

    // Cloneable items
    public static T Clone<T>(T item) where T : ICloneable
    {
        return (T)item.Clone();
    }

    // Create instances
    public static T CreateDefault<T>() where T : new()
    {
        return new T();
    }

    // Constrain to enum
    public static string[] GetNames<T>() where T : struct, Enum
    {
        return Enum.GetNames(typeof(T));
    }

    // Constrain to delegate
    public static void InvokeIfNotNull<T>(T? handler, object sender, EventArgs args)
        where T : Delegate
    {
        handler?.DynamicInvoke(sender, args);
    }
}

// Usage
int bigger = GenericMethods.Max(5, 10);  // 10
string[] days = GenericMethods.GetNames<DayOfWeek>();
\`\`\`

## Self-Referencing Generics

\`\`\`csharp
// Fluent builder with self-referencing generic
public abstract class BuilderBase<TBuilder, TResult>
    where TBuilder : BuilderBase<TBuilder, TResult>
{
    protected abstract TResult Build();

    protected TBuilder This => (TBuilder)this;
}

public class PersonBuilder : BuilderBase<PersonBuilder, Person>
{
    private string _name = "";
    private int _age;

    public PersonBuilder WithName(string name)
    {
        _name = name;
        return This;  // Returns PersonBuilder, not BuilderBase
    }

    public PersonBuilder WithAge(int age)
    {
        _age = age;
        return This;
    }

    protected override Person Build() => new Person { Name = _name, Age = _age };

    public Person Create() => Build();
}

// Fluent API
var person = new PersonBuilder()
    .WithName("Alice")
    .WithAge(30)
    .Create();
\`\`\`

## Covariant Return Types (C# 9+)

\`\`\`csharp
public class Animal
{
    public virtual Animal Clone() => new Animal();
}

public class Dog : Animal
{
    public override Dog Clone() => new Dog();  // Returns Dog, not Animal!
}

// This enables cleaner APIs
Dog original = new Dog();
Dog copy = original.Clone();  // No cast needed!
\`\`\`

## Practical Example: Event Aggregator

\`\`\`csharp
// Contravariant event handler
public interface IEventHandler<in TEvent>
{
    void Handle(TEvent @event);
}

// Event hierarchy
public class OrderEvent { public int OrderId { get; init; } }
public class OrderPlacedEvent : OrderEvent { public decimal Total { get; init; } }
public class OrderShippedEvent : OrderEvent { public string TrackingNumber { get; init; } }

// Generic handler handles all order events
public class OrderEventLogger : IEventHandler<OrderEvent>
{
    public void Handle(OrderEvent @event)
    {
        Console.WriteLine($"Order event: {@@event.OrderId}");
    }
}

// Specialized handler for placed events
public class OrderPlacedHandler : IEventHandler<OrderPlacedEvent>
{
    public void Handle(OrderPlacedEvent @event)
    {
        Console.WriteLine($"Order {@@event.OrderId} placed for {@@event.Total:C}");
    }
}

// Event aggregator using contravariance
public class EventAggregator
{
    private Dictionary<Type, List<object>> _handlers = new();

    public void Subscribe<TEvent>(IEventHandler<TEvent> handler)
    {
        var type = typeof(TEvent);
        if (!_handlers.ContainsKey(type))
            _handlers[type] = new List<object>();
        _handlers[type].Add(handler);
    }

    public void Publish<TEvent>(TEvent @event)
    {
        var type = typeof(TEvent);
        if (_handlers.TryGetValue(type, out var handlers))
        {
            foreach (IEventHandler<TEvent> handler in handlers.Cast<IEventHandler<TEvent>>())
            {
                handler.Handle(@event);
            }
        }
    }
}

// Usage
var aggregator = new EventAggregator();
aggregator.Subscribe<OrderPlacedEvent>(new OrderPlacedHandler());

// Because IEventHandler is contravariant, OrderEventLogger can handle OrderPlacedEvent
IEventHandler<OrderPlacedEvent> logger = new OrderEventLogger();  // Contravariance!
aggregator.Subscribe(logger);

aggregator.Publish(new OrderPlacedEvent { OrderId = 1, Total = 99.99m });
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use covariance (out) for producer interfaces
- Use contravariance (in) for consumer interfaces
- Apply advanced generic constraints
- Implement self-referencing generics for fluent APIs
- Design variance-aware generic interfaces
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Covariant Producer',
      description: `Create a covariant interface that produces values.

**Your task:**
1. Create an Animal base class and a Dog subclass
2. Create IFactory<out T> interface with a Create() method
3. Implement DogFactory that implements IFactory<Dog>
4. Assign DogFactory to IFactory<Animal> and call Create()

**Remember:** Covariance allows assigning Factory<Derived> to Factory<Base>`,
      starterCode: `using System;

// Step 1: Create Animal and Dog classes


// Step 2: Create covariant IFactory interface


// Step 3: Implement DogFactory


// Step 4: Demonstrate covariance

`,
      solution: `using System;

public class Animal
{
    public virtual string Speak() => "Some sound";
}

public class Dog : Animal
{
    public override string Speak() => "Woof!";
}

public interface IFactory<out T>
{
    T Create();
}

public class DogFactory : IFactory<Dog>
{
    public Dog Create() => new Dog();
}

// Covariance: IFactory<Dog> can be assigned to IFactory<Animal>
IFactory<Animal> animalFactory = new DogFactory();
Animal animal = animalFactory.Create();

Console.WriteLine($"Created: {animal.GetType().Name}");
Console.WriteLine($"Says: {animal.Speak()}");`,
      expectedOutput: [
        'Created: Dog',
        'Says: Woof!'
      ],
      hints: [
        'Use "out T" in the interface declaration for covariance',
        'Covariance means: Dog -> Animal direction',
        'Factory<Dog> can be used as Factory<Animal>',
        'The Create() method returns the actual type (Dog)'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Contravariant Consumer',
      description: `Create a contravariant interface that consumes values.

**Your task:**
1. Use the Animal/Dog classes from before
2. Create IHandler<in T> interface with a Handle(T item) method
3. Implement AnimalHandler that handles any Animal
4. Assign AnimalHandler to IHandler<Dog> and handle a Dog

**Remember:** Contravariance allows assigning Handler<Base> to Handler<Derived>`,
      starterCode: `using System;

public class Animal { public string Name { get; set; } = ""; }
public class Dog : Animal { public string Breed { get; set; } = ""; }

// Step 1: Create contravariant IHandler interface


// Step 2: Implement AnimalHandler


// Step 3: Demonstrate contravariance

`,
      solution: `using System;

public class Animal { public string Name { get; set; } = ""; }
public class Dog : Animal { public string Breed { get; set; } = ""; }

public interface IHandler<in T>
{
    void Handle(T item);
}

public class AnimalHandler : IHandler<Animal>
{
    public void Handle(Animal animal)
    {
        Console.WriteLine($"Handling animal: {animal.Name}");
    }
}

// Contravariance: IHandler<Animal> can be assigned to IHandler<Dog>
IHandler<Dog> dogHandler = new AnimalHandler();
dogHandler.Handle(new Dog { Name = "Buddy", Breed = "Labrador" });`,
      expectedOutput: [
        'Handling animal: Buddy'
      ],
      hints: [
        'Use "in T" in the interface declaration for contravariance',
        'Contravariance means: Animal -> Dog direction (opposite!)',
        'Handler<Animal> can be used as Handler<Dog>',
        'The Handle method receives the actual type (Dog)'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Generic Constraints',
      description: `Create a method with multiple generic constraints.

**Your task:**
1. Create an IEntity interface with int Id property
2. Create a method FindAndClone<T> that finds an entity by ID and clones it
3. Constrain T to implement IEntity, ICloneable, and have a parameterless constructor
4. Test with a Product class implementing both interfaces

**Key:** Multiple constraints use comma separation after \`where T :\``,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

// Step 1: Create IEntity interface


// Step 2: Create Product class implementing IEntity and ICloneable


// Step 3: Create FindAndClone method with constraints


// Step 4: Test

`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;

public interface IEntity
{
    int Id { get; }
}

public class Product : IEntity, ICloneable
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    public object Clone() => new Product { Id = Id, Name = Name + " (Copy)" };
}

T? FindAndClone<T>(IEnumerable<T> items, int id)
    where T : class, IEntity, ICloneable, new()
{
    T? found = items.FirstOrDefault(x => x.Id == id);
    if (found == null) return null;
    return (T)found.Clone();
}

var products = new List<Product>
{
    new() { Id = 1, Name = "Laptop" },
    new() { Id = 2, Name = "Phone" }
};

Product? cloned = FindAndClone(products, 1);
Console.WriteLine($"Original: {products[0].Name}");
Console.WriteLine($"Cloned: {cloned?.Name}");`,
      expectedOutput: [
        'Original: Laptop',
        'Cloned: Laptop (Copy)'
      ],
      hints: [
        'Multiple constraints: where T : class, IEntity, ICloneable, new()',
        'Use FirstOrDefault to find by Id',
        'Cast Clone() result back to T',
        'Return null if not found'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does "out T" in a generic interface declaration mean?',
      options: [
        'T must be an output parameter',
        'T is covariant and can only appear in output (return) positions',
        'T cannot be null',
        'T must be a value type'
      ],
      correctIndex: 1,
      explanation: 'The "out" modifier makes T covariant, meaning it can only be used in output positions (return types). This allows IProducer<Dog> to be assigned to IProducer<Animal>.'
    },
    {
      question: 'When would you use contravariance (in T)?',
      options: [
        'When T is only produced/returned by the interface',
        'When T is only consumed/accepted as parameters by the interface',
        'When T must be a reference type',
        'When T must have a default constructor'
      ],
      correctIndex: 1,
      explanation: 'Contravariance (in T) is used when T only appears in input positions (parameters). This allows IConsumer<Animal> to be assigned to IConsumer<Dog>.'
    },
    {
      question: 'Why is List<T> invariant (not covariant or contravariant)?',
      options: [
        'Lists are special types',
        'Because T appears in both input and output positions (Add takes T, indexer returns T)',
        'For performance reasons',
        'Lists were designed before variance was added to C#'
      ],
      correctIndex: 1,
      explanation: 'List<T> uses T in both input positions (Add method) and output positions (indexer). This makes it impossible to be safely covariant or contravariant.'
    },
    {
      question: 'What constraint would you use to require T has a parameterless constructor?',
      options: [
        'where T : new()',
        'where T : constructor',
        'where T : default',
        'where T : init'
      ],
      correctIndex: 0,
      explanation: 'The new() constraint requires that T has a public parameterless constructor, allowing you to use new T() in your generic code.'
    }
  ],
  buildNote: {
    title: 'Variance in .NET Framework Design',
    explanation: `The .NET framework uses variance extensively. IEnumerable<out T> is covariant (you can assign List<string> to IEnumerable<object>). Action<in T> and IComparable<in T> are contravariant. Understanding variance helps you design flexible APIs and understand why certain assignments work or fail.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/codeRunner.ts'
    ],
    inTheRealWorld: `Variance appears throughout professional codebases. Repository patterns often use covariant read interfaces and contravariant write interfaces. Event systems use contravariant handlers. Dependency injection containers must understand variance for proper service resolution. Libraries like MediatR use variance for flexible request/response handling.`
  }
};
