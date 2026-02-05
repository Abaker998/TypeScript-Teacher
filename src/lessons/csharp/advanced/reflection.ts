import { Lesson } from '@/types/lesson';

export const reflection: Lesson = {
  slug: 'csharp-reflection',
  title: 'Reflection',
  description: 'Master C# reflection to inspect types, invoke methods, and create instances dynamically at runtime.',
  difficulty: 'advanced',
  order: 21,
  content: `
# C# Reflection

Reflection allows you to inspect and manipulate types, methods, properties, and assemblies at runtime. It's the foundation for many frameworks and libraries.

## The Type Class

Every type in .NET has metadata accessible through the \`Type\` class:

\`\`\`csharp
// Get Type using typeof (compile-time)
Type stringType = typeof(string);
Console.WriteLine(stringType.Name);  // String
Console.WriteLine(stringType.FullName);  // System.String

// Get Type using GetType() (runtime)
string message = "Hello";
Type messageType = message.GetType();
Console.WriteLine(messageType.Name);  // String

// Get Type by name
Type? listType = Type.GetType("System.Collections.Generic.List\`1");
Console.WriteLine(listType?.Name);  // List\`1
\`\`\`

## Inspecting Type Members

Reflection lets you examine properties, methods, fields, and more:

\`\`\`csharp
public class Person
{
    public string Name { get; set; } = "";
    public int Age { get; set; }
    private string _secret = "hidden";

    public void Greet() => Console.WriteLine($"Hello, I'm {Name}");
    private void InternalMethod() { }
}

Type personType = typeof(Person);

// Get all public properties
PropertyInfo[] properties = personType.GetProperties();
foreach (var prop in properties)
{
    Console.WriteLine($"Property: {prop.Name} ({prop.PropertyType.Name})");
}
// Property: Name (String)
// Property: Age (Int32)

// Get all public methods (includes inherited)
MethodInfo[] methods = personType.GetMethods();
foreach (var method in methods)
{
    Console.WriteLine($"Method: {method.Name}");
}

// Get private fields
FieldInfo[] privateFields = personType.GetFields(
    BindingFlags.NonPublic | BindingFlags.Instance
);
Console.WriteLine($"Private field: {privateFields[0].Name}");  // _secret
\`\`\`

## BindingFlags

Control what members are returned:

\`\`\`csharp
// Public instance members
personType.GetMembers(BindingFlags.Public | BindingFlags.Instance);

// Private static members
personType.GetMembers(BindingFlags.NonPublic | BindingFlags.Static);

// All members (public + private, instance + static)
personType.GetMembers(
    BindingFlags.Public | BindingFlags.NonPublic |
    BindingFlags.Instance | BindingFlags.Static
);

// Include inherited members
personType.GetMembers(
    BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy
);
\`\`\`

## Creating Instances with Activator

Create objects dynamically without knowing the type at compile time:

\`\`\`csharp
// Create instance with parameterless constructor
object? person = Activator.CreateInstance(typeof(Person));
Console.WriteLine(person?.GetType().Name);  // Person

// Create instance with constructor arguments
Type listType = typeof(List<int>);
object? list = Activator.CreateInstance(listType);
Console.WriteLine(list?.GetType().Name);  // List\`1

// Generic version (type-safe)
Person? person2 = Activator.CreateInstance<Person>();

// Create from type name
Type? dateType = Type.GetType("System.DateTime");
object? date = Activator.CreateInstance(dateType!);
\`\`\`

## Invoking Methods Dynamically

Call methods without knowing them at compile time:

\`\`\`csharp
public class Calculator
{
    public int Add(int a, int b) => a + b;
    public static int Multiply(int a, int b) => a * b;
}

Type calcType = typeof(Calculator);
object calc = Activator.CreateInstance(calcType)!;

// Invoke instance method
MethodInfo? addMethod = calcType.GetMethod("Add");
object? result = addMethod?.Invoke(calc, new object[] { 5, 3 });
Console.WriteLine($"5 + 3 = {result}");  // 5 + 3 = 8

// Invoke static method
MethodInfo? multiplyMethod = calcType.GetMethod("Multiply");
object? product = multiplyMethod?.Invoke(null, new object[] { 4, 7 });
Console.WriteLine($"4 * 7 = {product}");  // 4 * 7 = 28
\`\`\`

## Getting and Setting Property Values

\`\`\`csharp
Person person = new Person { Name = "Alice", Age = 30 };
Type type = person.GetType();

// Get property value
PropertyInfo? nameProp = type.GetProperty("Name");
object? nameValue = nameProp?.GetValue(person);
Console.WriteLine($"Name: {nameValue}");  // Name: Alice

// Set property value
nameProp?.SetValue(person, "Bob");
Console.WriteLine($"New name: {person.Name}");  // New name: Bob

// Access private field
FieldInfo? secretField = type.GetField("_secret",
    BindingFlags.NonPublic | BindingFlags.Instance);
secretField?.SetValue(person, "exposed!");
Console.WriteLine(secretField?.GetValue(person));  // exposed!
\`\`\`

## Working with Generics

Reflection with generic types requires special handling:

\`\`\`csharp
// Get open generic type definition
Type openListType = typeof(List<>);
Console.WriteLine(openListType.IsGenericTypeDefinition);  // True

// Create closed generic type
Type closedListType = openListType.MakeGenericType(typeof(string));
object? stringList = Activator.CreateInstance(closedListType);

// Get generic type arguments
Type[] typeArgs = closedListType.GetGenericArguments();
Console.WriteLine(typeArgs[0].Name);  // String

// Check if type is generic
Console.WriteLine(typeof(List<int>).IsGenericType);  // True
Console.WriteLine(typeof(List<int>).IsConstructedGenericType);  // True
\`\`\`

## Assembly Reflection

Load and inspect assemblies:

\`\`\`csharp
// Get current assembly
Assembly currentAssembly = Assembly.GetExecutingAssembly();
Console.WriteLine(currentAssembly.FullName);

// Get all types in assembly
Type[] types = currentAssembly.GetTypes();
foreach (Type t in types.Where(t => t.IsClass))
{
    Console.WriteLine($"Class: {t.Name}");
}

// Load assembly by name
Assembly? systemAssembly = Assembly.Load("System.Runtime");

// Find types implementing an interface
var disposableTypes = currentAssembly.GetTypes()
    .Where(t => typeof(IDisposable).IsAssignableFrom(t));
\`\`\`

## Practical Example: Simple Object Mapper

\`\`\`csharp
public static class SimpleMapper
{
    public static TTarget Map<TSource, TTarget>(TSource source)
        where TTarget : new()
    {
        TTarget target = new TTarget();
        Type sourceType = typeof(TSource);
        Type targetType = typeof(TTarget);

        foreach (PropertyInfo sourceProp in sourceType.GetProperties())
        {
            PropertyInfo? targetProp = targetType.GetProperty(sourceProp.Name);
            if (targetProp != null && targetProp.CanWrite)
            {
                if (targetProp.PropertyType == sourceProp.PropertyType)
                {
                    object? value = sourceProp.GetValue(source);
                    targetProp.SetValue(target, value);
                }
            }
        }
        return target;
    }
}

// Usage
public class PersonDto { public string Name { get; set; } = ""; public int Age { get; set; } }
public class PersonEntity { public string Name { get; set; } = ""; public int Age { get; set; } }

PersonDto dto = new() { Name = "Alice", Age = 30 };
PersonEntity entity = SimpleMapper.Map<PersonDto, PersonEntity>(dto);
Console.WriteLine($"{entity.Name}, {entity.Age}");  // Alice, 30
\`\`\`

## Performance Considerations

Reflection is slower than direct code - use caching when possible:

\`\`\`csharp
// Cache MethodInfo for repeated calls
private static readonly MethodInfo _cachedMethod =
    typeof(Calculator).GetMethod("Add")!;

// Better: Use compiled delegates
private static readonly Func<Calculator, int, int, int> _addDelegate =
    (Func<Calculator, int, int, int>)Delegate.CreateDelegate(
        typeof(Func<Calculator, int, int, int>),
        _cachedMethod
    );

// Fastest for repeated calls
int result = _addDelegate(calc, 5, 3);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use Type class to inspect type metadata
- Apply BindingFlags to control member retrieval
- Create instances dynamically with Activator
- Invoke methods and access properties via reflection
- Work with generics and assemblies reflectively
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Type Inspection',
      description: `Use reflection to inspect a type's properties and methods.

**Your task:**
1. Create a \`Product\` class with Name (string) and Price (decimal) properties
2. Use \`typeof()\` to get the Type
3. Loop through all public properties and print their names and types
4. Count the total number of public methods

**Remember:** GetProperties() returns PropertyInfo[], each with Name and PropertyType`,
      starterCode: `using System;
using System.Reflection;

// Step 1: Create Product class


// Step 2: Get the Type using typeof()


// Step 3: Print all property names and types


// Step 4: Count and print total public methods

`,
      solution: `using System;
using System.Reflection;

public class Product
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
}

Type productType = typeof(Product);

PropertyInfo[] properties = productType.GetProperties();
foreach (PropertyInfo prop in properties)
{
    Console.WriteLine($"{prop.Name}: {prop.PropertyType.Name}");
}

MethodInfo[] methods = productType.GetMethods();
Console.WriteLine($"Total methods: {methods.Length}");`,
      expectedOutput: [
        'Name: String',
        'Price: Decimal',
        'Total methods: 12'
      ],
      hints: [
        'Use typeof(Product) to get the Type at compile time',
        'GetProperties() returns an array of PropertyInfo',
        'Each PropertyInfo has Name and PropertyType properties',
        'GetMethods() includes inherited methods from Object'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Dynamic Instance Creation',
      description: `Use Activator to create instances and invoke methods dynamically.

**Your task:**
1. Create a \`Greeter\` class with a \`SayHello(string name)\` method that returns a greeting
2. Use Activator.CreateInstance to create a Greeter instance
3. Use reflection to get the SayHello method
4. Invoke the method with "World" and print the result

**Key APIs:** Activator.CreateInstance(), GetMethod(), Invoke()`,
      starterCode: `using System;
using System.Reflection;

// Step 1: Create Greeter class with SayHello method


// Step 2: Create instance using Activator


// Step 3: Get the SayHello method using reflection


// Step 4: Invoke the method and print result

`,
      solution: `using System;
using System.Reflection;

public class Greeter
{
    public string SayHello(string name)
    {
        return $"Hello, {name}!";
    }
}

Type greeterType = typeof(Greeter);
object greeter = Activator.CreateInstance(greeterType)!;

MethodInfo? sayHelloMethod = greeterType.GetMethod("SayHello");
object? result = sayHelloMethod?.Invoke(greeter, new object[] { "World" });

Console.WriteLine(result);`,
      expectedOutput: ['Hello, World!'],
      hints: [
        'Activator.CreateInstance returns object?, use ! to assert non-null',
        'GetMethod("SayHello") returns the MethodInfo',
        'Invoke takes the instance and an object[] of parameters',
        'The result is returned as object?, cast or print directly'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Property Manipulation',
      description: `Use reflection to get and set property values dynamically.

**Your task:**
1. Create a \`Settings\` class with Theme (string) and FontSize (int) properties
2. Create an instance with Theme = "Light" and FontSize = 12
3. Use reflection to read and print both property values
4. Use reflection to change Theme to "Dark" and print it again

**Key APIs:** GetProperty(), GetValue(), SetValue()`,
      starterCode: `using System;
using System.Reflection;

// Step 1: Create Settings class


// Step 2: Create instance with initial values


// Step 3: Read properties using reflection


// Step 4: Change Theme to "Dark" using reflection

`,
      solution: `using System;
using System.Reflection;

public class Settings
{
    public string Theme { get; set; } = "";
    public int FontSize { get; set; }
}

Settings settings = new Settings { Theme = "Light", FontSize = 12 };
Type type = settings.GetType();

PropertyInfo? themeProp = type.GetProperty("Theme");
PropertyInfo? fontProp = type.GetProperty("FontSize");

Console.WriteLine($"Theme: {themeProp?.GetValue(settings)}");
Console.WriteLine($"FontSize: {fontProp?.GetValue(settings)}");

themeProp?.SetValue(settings, "Dark");
Console.WriteLine($"New Theme: {settings.Theme}");`,
      expectedOutput: [
        'Theme: Light',
        'FontSize: 12',
        'New Theme: Dark'
      ],
      hints: [
        'GetProperty("Theme") returns a PropertyInfo for that property',
        'GetValue(instance) reads the current value',
        'SetValue(instance, newValue) changes the property',
        'You can verify the change by accessing settings.Theme directly'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the difference between typeof(T) and obj.GetType()?',
      options: [
        'typeof is for classes, GetType is for interfaces',
        'typeof works at compile-time, GetType works at runtime',
        'typeof returns string, GetType returns Type',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'typeof(T) is resolved at compile-time and requires a known type name. GetType() is called on an instance at runtime and returns the actual runtime type, which may be a derived type.'
    },
    {
      question: 'What does Activator.CreateInstance() do?',
      options: [
        'Creates a copy of an existing instance',
        'Creates a new instance of a type dynamically at runtime',
        'Validates that a type can be instantiated',
        'Returns the Type of an object'
      ],
      correctIndex: 1,
      explanation: 'Activator.CreateInstance() creates a new instance of a type at runtime, calling its constructor. It is useful when the type is not known at compile time.'
    },
    {
      question: 'What BindingFlags would you use to get private instance fields?',
      options: [
        'BindingFlags.Public | BindingFlags.Instance',
        'BindingFlags.NonPublic | BindingFlags.Instance',
        'BindingFlags.Private | BindingFlags.Field',
        'BindingFlags.NonPublic | BindingFlags.Static'
      ],
      correctIndex: 1,
      explanation: 'BindingFlags.NonPublic retrieves non-public members (private, protected, internal), and BindingFlags.Instance specifies instance members rather than static ones.'
    },
    {
      question: 'Why is reflection slower than direct code?',
      options: [
        'It uses more memory',
        'It requires runtime type lookup and bypasses compile-time optimizations',
        'It is always synchronous',
        'It cannot be cached'
      ],
      correctIndex: 1,
      explanation: 'Reflection requires runtime metadata lookup and method dispatch, bypassing the compile-time optimizations and JIT inlining that direct calls benefit from.'
    }
  ],
  buildNote: {
    title: 'Reflection in Modern .NET',
    explanation: `Reflection is foundational for frameworks like ASP.NET Core (controller discovery, model binding), Entity Framework (entity mapping), and serializers like System.Text.Json. While powerful, it should be used judiciously due to performance costs. Source generators in modern .NET can sometimes replace reflection with compile-time code generation for better performance.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/codeRunner.ts'
    ],
    inTheRealWorld: `Dependency injection containers use reflection to discover and instantiate services. ORMs like Entity Framework use it to map database columns to properties. Serializers inspect types to know how to convert objects to JSON/XML. Test frameworks use reflection to discover and run test methods. Many modern frameworks now also support source generators as a faster alternative.`
  }
};
