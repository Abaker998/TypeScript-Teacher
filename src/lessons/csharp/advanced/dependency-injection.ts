import { Lesson } from '@/types/lesson';

export const dependencyInjection: Lesson = {
  slug: 'csharp-dependency-injection',
  title: 'Dependency Injection',
  description: 'Learn dependency injection patterns and the built-in .NET DI container with IServiceCollection.',
  difficulty: 'advanced',
  order: 26,
  content: `
# C# Dependency Injection

Dependency Injection (DI) is a design pattern where objects receive their dependencies from an external source rather than creating them internally. It promotes loose coupling, testability, and maintainability.

## The Problem DI Solves

\`\`\`csharp
// Without DI - tightly coupled
public class OrderService
{
    private readonly SqlDatabase _database = new SqlDatabase();  // Hard dependency!
    private readonly EmailSender _emailSender = new EmailSender();  // Hard dependency!

    public void PlaceOrder(Order order)
    {
        _database.Save(order);
        _emailSender.SendConfirmation(order);
    }
}

// Problems:
// 1. Can't test without real database and email server
// 2. Can't swap implementations (e.g., NoSQL, SMS instead of email)
// 3. OrderService controls lifetime of dependencies
\`\`\`

## DI via Constructor Injection

\`\`\`csharp
// With DI - loosely coupled
public interface IDatabase
{
    void Save<T>(T entity);
}

public interface INotificationService
{
    void SendConfirmation(Order order);
}

public class OrderService
{
    private readonly IDatabase _database;
    private readonly INotificationService _notificationService;

    // Dependencies are injected through constructor
    public OrderService(IDatabase database, INotificationService notificationService)
    {
        _database = database;
        _notificationService = notificationService;
    }

    public void PlaceOrder(Order order)
    {
        _database.Save(order);
        _notificationService.SendConfirmation(order);
    }
}

// Now we can:
// 1. Test with mock implementations
// 2. Swap implementations without changing OrderService
// 3. Let the container manage lifetimes
\`\`\`

## Microsoft.Extensions.DependencyInjection

.NET provides a built-in DI container:

\`\`\`csharp
using Microsoft.Extensions.DependencyInjection;

// Create service collection
var services = new ServiceCollection();

// Register services
services.AddTransient<IDatabase, SqlDatabase>();
services.AddTransient<INotificationService, EmailNotificationService>();
services.AddTransient<OrderService>();

// Build provider
IServiceProvider provider = services.BuildServiceProvider();

// Resolve services
OrderService orderService = provider.GetRequiredService<OrderService>();
// Dependencies are automatically injected!
\`\`\`

## Service Lifetimes

\`\`\`csharp
var services = new ServiceCollection();

// TRANSIENT - New instance every time requested
services.AddTransient<ITransientService, TransientService>();
// Use for: Lightweight, stateless services

// SCOPED - Same instance within a scope (e.g., HTTP request)
services.AddScoped<IScopedService, ScopedService>();
// Use for: Database contexts, unit of work, per-request data

// SINGLETON - Same instance for application lifetime
services.AddSingleton<ISingletonService, SingletonService>();
// Use for: Configuration, caches, logging

// Demonstration
var provider = services.BuildServiceProvider();

// Transient: Different instances
var t1 = provider.GetRequiredService<ITransientService>();
var t2 = provider.GetRequiredService<ITransientService>();
Console.WriteLine(t1 == t2);  // False

// Singleton: Same instance
var s1 = provider.GetRequiredService<ISingletonService>();
var s2 = provider.GetRequiredService<ISingletonService>();
Console.WriteLine(s1 == s2);  // True

// Scoped: Same within scope
using (var scope = provider.CreateScope())
{
    var sc1 = scope.ServiceProvider.GetRequiredService<IScopedService>();
    var sc2 = scope.ServiceProvider.GetRequiredService<IScopedService>();
    Console.WriteLine(sc1 == sc2);  // True
}
\`\`\`

## Registration Patterns

\`\`\`csharp
var services = new ServiceCollection();

// Register concrete type (when interface matches implementation)
services.AddTransient<ConcreteService>();

// Register interface to implementation
services.AddTransient<IService, ConcreteService>();

// Register with factory (custom instantiation)
services.AddTransient<IService>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    return new ConcreteService(config["ConnectionString"]);
});

// Register existing instance
var existingService = new SingletonService();
services.AddSingleton<ISingletonService>(existingService);

// Register open generics
services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
// IRepository<User> resolves to Repository<User>
// IRepository<Order> resolves to Repository<Order>

// Try-add (only if not already registered)
services.TryAddTransient<IService, ServiceA>();
services.TryAddTransient<IService, ServiceB>();  // Ignored, IService already registered

// Register multiple implementations
services.AddTransient<IPlugin, PluginA>();
services.AddTransient<IPlugin, PluginB>();
services.AddTransient<IPlugin, PluginC>();
// Inject IEnumerable<IPlugin> to get all three
\`\`\`

## Resolving Services

\`\`\`csharp
IServiceProvider provider = services.BuildServiceProvider();

// GetRequiredService - throws if not found
IService service = provider.GetRequiredService<IService>();

// GetService - returns null if not found
IService? maybeService = provider.GetService<IService>();

// Get multiple implementations
IEnumerable<IPlugin> allPlugins = provider.GetServices<IPlugin>();

// Create scope for scoped services
using (IServiceScope scope = provider.CreateScope())
{
    var scopedService = scope.ServiceProvider.GetRequiredService<IScopedService>();
    // Service disposed when scope is disposed
}
\`\`\`

## ASP.NET Core DI Integration

\`\`\`csharp
// In Program.cs
var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();

// Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// Configure options
builder.Services.Configure<SmtpSettings>(
    builder.Configuration.GetSection("Smtp"));

var app = builder.Build();

// Controller automatically receives injected services
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    // Constructor injection
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        return user == null ? NotFound() : Ok(user);
    }
}
\`\`\`

## Options Pattern

\`\`\`csharp
// Configuration class
public class EmailSettings
{
    public string SmtpHost { get; set; } = "";
    public int SmtpPort { get; set; }
    public string FromAddress { get; set; } = "";
}

// Register options
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("Email"));

// Inject into service
public class EmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public void Send(string to, string subject, string body)
    {
        Console.WriteLine($"Sending from {_settings.FromAddress} via {_settings.SmtpHost}");
    }
}

// appsettings.json
// {
//   "Email": {
//     "SmtpHost": "smtp.example.com",
//     "SmtpPort": 587,
//     "FromAddress": "noreply@example.com"
//   }
// }
\`\`\`

## Testing with DI

\`\`\`csharp
// Production implementation
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context) => _context = context;

    public async Task<User?> GetByIdAsync(int id)
        => await _context.Users.FindAsync(id);
}

// Test with mock
public class UserServiceTests
{
    [Fact]
    public async Task GetUser_ReturnsUser_WhenExists()
    {
        // Arrange - create mock
        var mockRepo = new Mock<IUserRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(new User { Id = 1, Name = "Test" });

        var service = new UserService(mockRepo.Object);

        // Act
        var result = await service.GetUserAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test", result.Name);
    }
}

// Integration test with test services
public class OrderServiceIntegrationTests
{
    [Fact]
    public void PlaceOrder_SendsNotification()
    {
        // Arrange
        var services = new ServiceCollection();
        services.AddTransient<IDatabase, InMemoryDatabase>();
        services.AddTransient<INotificationService, FakeNotificationService>();
        services.AddTransient<OrderService>();

        var provider = services.BuildServiceProvider();
        var orderService = provider.GetRequiredService<OrderService>();

        // Act
        orderService.PlaceOrder(new Order { Id = 1 });

        // Assert
        var fakeNotifier = provider.GetRequiredService<INotificationService>()
            as FakeNotificationService;
        Assert.True(fakeNotifier!.WasCalled);
    }
}
\`\`\`

## Common DI Patterns

\`\`\`csharp
// Factory pattern for runtime decisions
public interface IPaymentProcessorFactory
{
    IPaymentProcessor Create(string processorType);
}

public class PaymentProcessorFactory : IPaymentProcessorFactory
{
    private readonly IServiceProvider _serviceProvider;

    public PaymentProcessorFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IPaymentProcessor Create(string processorType)
    {
        return processorType switch
        {
            "stripe" => _serviceProvider.GetRequiredService<StripeProcessor>(),
            "paypal" => _serviceProvider.GetRequiredService<PayPalProcessor>(),
            _ => throw new ArgumentException($"Unknown processor: {processorType}")
        };
    }
}

// Decorator pattern
services.AddTransient<IUserService, UserService>();
services.Decorate<IUserService, CachingUserServiceDecorator>();
services.Decorate<IUserService, LoggingUserServiceDecorator>();
// Resolving IUserService gives: LoggingDecorator(CachingDecorator(UserService))

// Lazy initialization
public class ExpensiveService
{
    private readonly Lazy<IExpensiveResource> _resource;

    public ExpensiveService(Lazy<IExpensiveResource> resource)
    {
        _resource = resource;  // Not created yet
    }

    public void DoWork()
    {
        _resource.Value.Use();  // Created on first access
    }
}
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Understand why dependency injection improves code quality
- Use constructor injection to receive dependencies
- Register services with appropriate lifetimes
- Configure ASP.NET Core applications with DI
- Write testable code using DI patterns
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic DI Setup',
      description: `Set up a basic DI container and resolve a service.

**Your task:**
1. Create an IGreeter interface with a Greet(string name) method
2. Create a ConsoleGreeter implementation
3. Register it with ServiceCollection
4. Resolve and use the service

**Remember:** Use AddTransient for registration and GetRequiredService for resolution.`,
      starterCode: `using System;
using Microsoft.Extensions.DependencyInjection;

// Step 1: Create IGreeter interface


// Step 2: Create ConsoleGreeter implementation


// Step 3: Create ServiceCollection and register


// Step 4: Build provider and resolve service

`,
      solution: `using System;
using Microsoft.Extensions.DependencyInjection;

public interface IGreeter
{
    void Greet(string name);
}

public class ConsoleGreeter : IGreeter
{
    public void Greet(string name)
    {
        Console.WriteLine($"Hello, {name}!");
    }
}

var services = new ServiceCollection();
services.AddTransient<IGreeter, ConsoleGreeter>();

IServiceProvider provider = services.BuildServiceProvider();
IGreeter greeter = provider.GetRequiredService<IGreeter>();

greeter.Greet("World");`,
      expectedOutput: [
        'Hello, World!'
      ],
      hints: [
        'Interface defines the contract, class implements it',
        'ServiceCollection is the registration container',
        'AddTransient<IGreeter, ConsoleGreeter>() maps interface to implementation',
        'BuildServiceProvider() creates the resolver'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Constructor Injection',
      description: `Create a service that depends on another service.

**Your task:**
1. Create ILogger interface with Log(string message) method
2. Create ConsoleLogger implementation
3. Create UserService that depends on ILogger (via constructor)
4. Register both services and resolve UserService

**Key:** When resolving UserService, the container automatically injects ILogger.`,
      starterCode: `using System;
using Microsoft.Extensions.DependencyInjection;

// Step 1: Create ILogger interface


// Step 2: Create ConsoleLogger


// Step 3: Create UserService with ILogger dependency


// Step 4: Register and resolve

`,
      solution: `using System;
using Microsoft.Extensions.DependencyInjection;

public interface ILogger
{
    void Log(string message);
}

public class ConsoleLogger : ILogger
{
    public void Log(string message)
    {
        Console.WriteLine($"[LOG] {message}");
    }
}

public class UserService
{
    private readonly ILogger _logger;

    public UserService(ILogger logger)
    {
        _logger = logger;
    }

    public void CreateUser(string name)
    {
        _logger.Log($"Creating user: {name}");
        Console.WriteLine($"User {name} created!");
    }
}

var services = new ServiceCollection();
services.AddTransient<ILogger, ConsoleLogger>();
services.AddTransient<UserService>();

var provider = services.BuildServiceProvider();
var userService = provider.GetRequiredService<UserService>();

userService.CreateUser("Alice");`,
      expectedOutput: [
        '[LOG] Creating user: Alice',
        'User Alice created!'
      ],
      hints: [
        'UserService constructor takes ILogger parameter',
        'Store the dependency in a private readonly field',
        'Register both ILogger and UserService',
        'Container automatically resolves the dependency chain'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Service Lifetimes',
      description: `Demonstrate the difference between transient and singleton lifetimes.

**Your task:**
1. Create a Counter class with an Id (Guid) and Count property
2. Register two instances: one as Transient, one as Singleton
3. Resolve each twice and compare their Ids
4. Print whether each pair is the same instance

**Key:** Transient creates new instances; Singleton reuses the same instance.`,
      starterCode: `using System;
using Microsoft.Extensions.DependencyInjection;

// Step 1: Create Counter class


// Step 2: Create separate interfaces for demonstration


// Step 3: Register with different lifetimes


// Step 4: Resolve and compare

`,
      solution: `using System;
using Microsoft.Extensions.DependencyInjection;

public class Counter
{
    public Guid Id { get; } = Guid.NewGuid();
    public int Count { get; set; }
}

public interface ITransientCounter { Guid Id { get; } }
public interface ISingletonCounter { Guid Id { get; } }

public class TransientCounter : Counter, ITransientCounter { }
public class SingletonCounter : Counter, ISingletonCounter { }

var services = new ServiceCollection();
services.AddTransient<ITransientCounter, TransientCounter>();
services.AddSingleton<ISingletonCounter, SingletonCounter>();

var provider = services.BuildServiceProvider();

var transient1 = provider.GetRequiredService<ITransientCounter>();
var transient2 = provider.GetRequiredService<ITransientCounter>();
Console.WriteLine($"Transient same instance: {transient1.Id == transient2.Id}");

var singleton1 = provider.GetRequiredService<ISingletonCounter>();
var singleton2 = provider.GetRequiredService<ISingletonCounter>();
Console.WriteLine($"Singleton same instance: {singleton1.Id == singleton2.Id}");`,
      expectedOutput: [
        'Transient same instance: False',
        'Singleton same instance: True'
      ],
      hints: [
        'Use Guid.NewGuid() in constructor for unique identity',
        'AddTransient creates new instance per resolution',
        'AddSingleton reuses the same instance',
        'Compare Ids to check if same instance'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the main benefit of dependency injection?',
      options: [
        'Faster code execution',
        'Loose coupling, making code more testable and maintainable',
        'Smaller binary size',
        'Automatic error handling'
      ],
      correctIndex: 1,
      explanation: 'Dependency injection decouples classes from their dependencies, making it easy to swap implementations, test with mocks, and maintain code over time.'
    },
    {
      question: 'What is the difference between AddScoped and AddSingleton?',
      options: [
        'AddScoped is faster',
        'AddScoped creates one instance per scope (e.g., HTTP request), AddSingleton creates one instance for the entire application',
        'AddSingleton is for interfaces, AddScoped is for classes',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'AddScoped creates a new instance for each scope (in ASP.NET Core, a scope is typically an HTTP request). AddSingleton creates a single instance shared across the entire application lifetime.'
    },
    {
      question: 'How do you resolve a service that might not be registered?',
      options: [
        'GetRequiredService<T>() - throws if not found',
        'GetService<T>() - returns null if not found',
        'TryGetService<T>() - returns bool',
        'ResolveOrDefault<T>()'
      ],
      correctIndex: 1,
      explanation: 'GetService<T>() returns null if the service is not registered, while GetRequiredService<T>() throws an InvalidOperationException.'
    },
    {
      question: 'What happens when you register the same interface multiple times?',
      options: [
        'Compilation error',
        'Runtime error',
        'Last registration wins for single resolution; all are returned for GetServices<T>()',
        'First registration wins'
      ],
      correctIndex: 2,
      explanation: 'When resolving a single service, the last registration is used. When using GetServices<T>() (plural), all registered implementations are returned.'
    }
  ],
  buildNote: {
    title: 'DI is the Backbone of Modern .NET',
    explanation: `ASP.NET Core is built around dependency injection. Controllers, middleware, and virtually every service receives dependencies through constructor injection. Understanding DI is essential for building maintainable .NET applications. The built-in container handles most scenarios; for advanced features, third-party containers like Autofac or Simple Injector can be used.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/codeRunner.ts'
    ],
    inTheRealWorld: `Every production ASP.NET Core application uses dependency injection. It enables: unit testing with mocks, swapping database providers, feature flags (injecting different implementations), multi-tenancy (scoped services per tenant), and clean architecture. Libraries like MediatR, AutoMapper, and FluentValidation all integrate via DI.`
  }
};
