import { Lesson } from '@/types/lesson';

export const csharpGenerics: Lesson = {
  slug: 'csharp-generics',
  title: 'C# Generics',
  description: 'Write flexible, reusable code with generic types, methods, and constraints.',
  difficulty: 'intermediate',
  order: 14,
  content: `
# C# Generics

Generics let you write code that works with any type while maintaining type safety. They're essential for creating reusable data structures and algorithms.

## Generic Methods

\`\`\`csharp
// Without generics - need separate methods
public int MaxInt(int a, int b) => a > b ? a : b;
public double MaxDouble(double a, double b) => a > b ? a : b;

// With generics - one method for all comparable types
public T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) > 0 ? a : b;
}

int maxInt = Max(5, 3);        // 5
double maxDouble = Max(3.14, 2.71);  // 3.14
string maxStr = Max("zebra", "apple");  // "zebra"
\`\`\`

## Generic Classes

\`\`\`csharp
public class Box<T>
{
    private T _content;

    public T Content
    {
        get => _content;
        set => _content = value;
    }

    public bool IsEmpty => _content == null;
}

Box<string> stringBox = new Box<string>();
stringBox.Content = "Hello";
Console.WriteLine(stringBox.Content);  // "Hello"

Box<int> intBox = new Box<int>();
intBox.Content = 42;
\`\`\`

## Multiple Type Parameters

\`\`\`csharp
public class Pair<TFirst, TSecond>
{
    public TFirst First { get; set; }
    public TSecond Second { get; set; }

    public Pair(TFirst first, TSecond second)
    {
        First = first;
        Second = second;
    }

    public void Deconstruct(out TFirst first, out TSecond second)
    {
        first = First;
        second = Second;
    }
}

var pair = new Pair<string, int>("Age", 30);
Console.WriteLine($"{pair.First}: {pair.Second}");

// Deconstruction
var (key, value) = pair;
\`\`\`

## Generic Constraints

Restrict which types can be used:

\`\`\`csharp
// Must be a reference type
public class Container<T> where T : class { }

// Must be a value type
public struct ValueWrapper<T> where T : struct { }

// Must have parameterless constructor
public T CreateInstance<T>() where T : new()
{
    return new T();
}

// Must implement interface
public void Sort<T>(List<T> items) where T : IComparable<T>
{
    items.Sort();
}

// Must inherit from class
public class AnimalShelter<T> where T : Animal { }

// Multiple constraints
public class Repository<T> where T : class, IEntity, new()
{
    public T Create() => new T();
}
\`\`\`

## Common Generic Constraints

| Constraint | Meaning |
|------------|---------|
| \`where T : struct\` | Must be value type |
| \`where T : class\` | Must be reference type |
| \`where T : class?\` | Must be nullable reference type |
| \`where T : notnull\` | Must be non-nullable type |
| \`where T : new()\` | Must have parameterless constructor |
| \`where T : BaseClass\` | Must inherit from BaseClass |
| \`where T : IInterface\` | Must implement IInterface |
| \`where T : U\` | T must derive from U |

## Generic Interfaces

\`\`\`csharp
public interface IRepository<T> where T : class
{
    T GetById(int id);
    IEnumerable<T> GetAll();
    void Add(T entity);
    void Update(T entity);
    void Delete(int id);
}

public class UserRepository : IRepository<User>
{
    private List<User> _users = new();

    public User GetById(int id) => _users.FirstOrDefault(u => u.Id == id);
    public IEnumerable<User> GetAll() => _users;
    public void Add(User entity) => _users.Add(entity);
    public void Update(User entity) { /* ... */ }
    public void Delete(int id) => _users.RemoveAll(u => u.Id == id);
}
\`\`\`

## Built-in Generic Types

\`\`\`csharp
// Collections
List<string> names = new List<string>();
Dictionary<int, User> userById = new Dictionary<int, User>();
HashSet<int> uniqueNumbers = new HashSet<int>();
Queue<Task> taskQueue = new Queue<Task>();
Stack<int> history = new Stack<int>();

// Nullable value types
int? nullableInt = null;
DateTime? optionalDate = DateTime.Now;

// Tuples
(string Name, int Age) person = ("Alice", 30);
Tuple<int, string, bool> data = Tuple.Create(1, "test", true);

// Func and Action delegates
Func<int, int, int> add = (a, b) => a + b;
Action<string> print = Console.WriteLine;
Predicate<int> isPositive = n => n > 0;
\`\`\`

## Covariance and Contravariance

\`\`\`csharp
// Covariance (out) - can return derived types
public interface IProducer<out T>
{
    T Produce();
}

// Contravariance (in) - can accept base types
public interface IConsumer<in T>
{
    void Consume(T item);
}

// Example
IProducer<Dog> dogProducer = new DogProducer();
IProducer<Animal> animalProducer = dogProducer;  // OK - covariant

IConsumer<Animal> animalConsumer = new AnimalConsumer();
IConsumer<Dog> dogConsumer = animalConsumer;  // OK - contravariant
\`\`\`

## Generic Extension Methods

\`\`\`csharp
public static class EnumerableExtensions
{
    public static T FirstOrDefault<T>(this IEnumerable<T> source, T defaultValue)
    {
        foreach (var item in source)
            return item;
        return defaultValue;
    }

    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source)
        where T : class
    {
        return source.Where(x => x != null)!;
    }

    public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
    {
        foreach (var item in source)
            action(item);
    }
}

// Usage
var numbers = new List<int> { 1, 2, 3 };
numbers.ForEach(n => Console.WriteLine(n));
\`\`\`

## Generic Factory Pattern

\`\`\`csharp
public interface IFactory<T>
{
    T Create();
}

public class Factory<T> : IFactory<T> where T : new()
{
    public T Create() => new T();
}

public class UserFactory : IFactory<User>
{
    public User Create() => new User
    {
        Id = Guid.NewGuid(),
        CreatedAt = DateTime.Now
    };
}
\`\`\`

## Default Values with default

\`\`\`csharp
public T GetValueOrDefault<T>(T? value)
{
    return value ?? default(T)!;
}

// For reference types, default is null
// For value types, default is zero/false/etc.

int defaultInt = default;        // 0
string defaultString = default;  // null
bool defaultBool = default;      // false
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create generic methods and classes
- Apply constraints to type parameters
- Use built-in generic types effectively
- Implement generic interfaces
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Generic Method',
      description: `Create a generic method that works with any type.

**Your task:**
1. Create a generic method \`Swap<T>\` that swaps two values by reference
2. Use ref parameters to modify the originals
3. Test with integers and strings`,
      starterCode: `// Step 1: Create the Swap<T> method


// Step 2: Test with integers


// Step 3: Test with strings

`,
      solution: `void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}

int x = 1, y = 2;
Swap(ref x, ref y);
Console.WriteLine($"x={x}, y={y}");

string first = "hello", second = "world";
Swap(ref first, ref second);
Console.WriteLine($"first={first}, second={second}");`,
      expectedOutput: ['x=2, y=1', 'first=world, second=hello'],
      hints: [
        'Use ref keyword for pass-by-reference',
        'Store one value in temp before swapping',
        'Generic type T works for any type'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Generic Class',
      description: `Create a generic stack data structure.

**Your task:**
1. Create a \`Stack<T>\` class with a private List<T>
2. Add Push(T item) and Pop() methods
3. Add a Count property
4. Test with integers: push 1, 2, 3 then pop twice`,
      starterCode: `// Step 1: Create Stack<T> class


// Step 2: Add Push and Pop methods


// Step 3: Add Count property


// Step 4: Test the stack

`,
      solution: `public class Stack<T>
{
    private List<T> _items = new List<T>();

    public void Push(T item)
    {
        _items.Add(item);
    }

    public T Pop()
    {
        if (_items.Count == 0)
            throw new InvalidOperationException("Stack is empty");

        T item = _items[_items.Count - 1];
        _items.RemoveAt(_items.Count - 1);
        return item;
    }

    public int Count => _items.Count;
}

var stack = new Stack<int>();
stack.Push(1);
stack.Push(2);
stack.Push(3);
Console.WriteLine(stack.Pop());
Console.WriteLine(stack.Pop());`,
      expectedOutput: ['3', '2'],
      hints: [
        'Use List<T> as internal storage',
        'Pop returns and removes the last item',
        'Stack is LIFO - last in, first out'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Generic Constraint',
      description: `Use constraints to require specific capabilities.

**Your task:**
1. Create a method \`FindMax<T>\` that finds the maximum in an array
2. Constrain T to implement IComparable<T>
3. Return the maximum value
4. Test with integers and strings`,
      starterCode: `// Step 1-2: Create FindMax<T> with constraint


// Step 3: Implement the logic


// Step 4: Test with numbers and strings

`,
      solution: `T FindMax<T>(T[] items) where T : IComparable<T>
{
    if (items.Length == 0)
        throw new ArgumentException("Array cannot be empty");

    T max = items[0];
    foreach (T item in items)
    {
        if (item.CompareTo(max) > 0)
            max = item;
    }
    return max;
}

int[] numbers = { 3, 1, 4, 1, 5, 9 };
Console.WriteLine(FindMax(numbers));

string[] words = { "apple", "zebra", "banana" };
Console.WriteLine(FindMax(words));`,
      expectedOutput: ['9', 'zebra'],
      hints: [
        'Constraint: where T : IComparable<T>',
        'Use CompareTo() > 0 to check if greater',
        'IComparable is already implemented by int, string, etc.'
      ],
    }
  ],
  quiz: [
    {
      question: 'What does "where T : class" mean in a generic constraint?',
      options: [
        'T must be the class keyword',
        'T must be a reference type',
        'T must be a C# class',
        'T must be static'
      ],
      correctIndex: 1,
      explanation: 'The "class" constraint requires T to be a reference type (class, interface, delegate, or array).'
    },
    {
      question: 'What does "where T : new()" constraint allow?',
      options: [
        'T can be any new type',
        'You can create instances of T using new T()',
        'T must be newly created',
        'T cannot be reused'
      ],
      correctIndex: 1,
      explanation: 'The new() constraint requires T to have a public parameterless constructor, allowing "new T()".'
    },
    {
      question: 'What is covariance in generics?',
      options: [
        'Converting between generic types',
        'Using "out" to allow derived types where base types are expected',
        'Combining multiple generic types',
        'A type of constraint'
      ],
      correctIndex: 1,
      explanation: 'Covariance (out keyword) allows a generic type to be more derived than originally specified, useful for return types.'
    },
    {
      question: 'What is default(T) for a reference type?',
      options: [
        'An empty object',
        'null',
        'A new instance',
        'Zero'
      ],
      correctIndex: 1,
      explanation: 'default(T) returns null for reference types and zero/false for value types.'
    }
  ],
  buildNote: {
    title: 'Generics in C# Applications',
    explanation: `Generics are pervasive in C#. Collections (List<T>, Dictionary<K,V>), LINQ, Entity Framework (DbSet<T>), and dependency injection all use generics. The Repository pattern uses generic interfaces. ASP.NET Core's ILogger<T> provides type-safe logging. Understanding generics is essential for writing reusable C# code.`,
    relatedFiles: [
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Enterprise C# relies heavily on generics. Repository<T> and IRepository<T> patterns abstract data access. AutoMapper maps between generic types. MediatR uses IRequest<TResponse> for CQRS. Entity Framework's DbSet<T> is generic. ASP.NET Core's IOptions<T> pattern is generic. Even dependency injection containers use generics for registration and resolution.`
  }
};
