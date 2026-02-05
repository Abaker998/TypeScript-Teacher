import { Lesson } from '@/types/lesson';

export const developerTooling: Lesson = {
  slug: 'csharp-developer-tooling',
  title: 'Developer Tooling',
  description: 'Learn about Visual Studio, the dotnet CLI, NuGet packages, and debugging in C#.',
  difficulty: 'beginner',
  order: 8,
  content: `
# Developer Tooling for C#

Understanding the tools available for C# development helps you write, debug, and deploy code effectively.

## Development Environments

### Visual Studio (Full IDE)

The premier IDE for C# development:
- **IntelliSense** - Smart code completion
- **Debugger** - Powerful debugging tools
- **Designer** - Visual design tools
- **Profiler** - Performance analysis
- **Test Runner** - Built-in testing

Available in:
- **Community** - Free for individuals and small teams
- **Professional** - Paid, for teams
- **Enterprise** - Full features for large organizations

### Visual Studio Code

Lightweight editor with C# extension:
- Cross-platform (Windows, Mac, Linux)
- Free and open-source
- C# Dev Kit extension for best experience
- Great for web development and microservices

### JetBrains Rider

Cross-platform IDE alternative:
- Based on ReSharper technology
- Powerful refactoring tools
- Cross-platform consistency

## The dotnet CLI

The command-line interface for .NET development:

\`\`\`bash
# Create new projects
dotnet new console          # Console application
dotnet new webapi           # Web API
dotnet new mvc              # MVC web application
dotnet new classlib         # Class library
dotnet new sln              # Solution file

# Build and run
dotnet build                # Compile the project
dotnet run                  # Build and run
dotnet watch run            # Run with hot reload

# Testing
dotnet test                 # Run unit tests

# Package management
dotnet add package Newtonsoft.Json    # Add NuGet package
dotnet remove package Newtonsoft.Json # Remove package
dotnet restore              # Restore all packages

# Publishing
dotnet publish -c Release   # Publish for deployment
\`\`\`

## Project Structure

A typical C# project structure:

\`\`\`
MyProject/
  MyProject.sln             # Solution file
  src/
    MyProject.Api/
      MyProject.Api.csproj  # Project file
      Program.cs            # Entry point
      Controllers/          # API controllers
      Models/               # Data models
      Services/             # Business logic
      appsettings.json      # Configuration
  tests/
    MyProject.Tests/
      MyProject.Tests.csproj
      UnitTests/
      IntegrationTests/
\`\`\`

## The .csproj File

Project configuration in XML:

\`\`\`xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
    <PackageReference Include="Serilog" Version="3.1.1" />
  </ItemGroup>
</Project>
\`\`\`

## NuGet Package Manager

NuGet is the package manager for .NET:

\`\`\`bash
# CLI commands
dotnet add package EntityFrameworkCore
dotnet add package Serilog.AspNetCore

# Or use Package Manager Console in Visual Studio
Install-Package EntityFrameworkCore
Update-Package EntityFrameworkCore
\`\`\`

Popular packages:
- **Entity Framework Core** - Database ORM
- **Serilog** - Structured logging
- **AutoMapper** - Object mapping
- **FluentValidation** - Validation library
- **Polly** - Resilience and fault handling
- **MediatR** - Mediator pattern implementation

## Debugging

### Visual Studio Debugging

\`\`\`csharp
// Set breakpoints by clicking in the margin
// Or use the debugger keyword
System.Diagnostics.Debugger.Break();

// Conditional breakpoints - right-click breakpoint
// Example: count > 100

// Tracepoints - log without stopping
// Prints to Output window
\`\`\`

### Debug Output

\`\`\`csharp
// Console output
Console.WriteLine("Value: " + x);

// Debug output (only in Debug builds)
System.Diagnostics.Debug.WriteLine("Debug: " + x);

// Trace output
System.Diagnostics.Trace.WriteLine("Trace: " + x);
\`\`\`

### Debugging Tips

\`\`\`csharp
// Use the Watch window to evaluate expressions
// Use the Immediate window to run code during debugging
// Use the Call Stack to see how you got here

// Add debug visualization
[DebuggerDisplay("Name = {Name}, Age = {Age}")]
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}
\`\`\`

## Compile Time vs Runtime

### Compile Time

When C# checks and compiles your code:

\`\`\`csharp
// Caught at compile time
int age = "twenty";  // Error: Cannot convert string to int

// Caught at compile time
string name;
Console.WriteLine(name);  // Error: Use of unassigned variable
\`\`\`

### Runtime

When your code actually executes:

\`\`\`csharp
// Runtime error - compiles fine but crashes when run
string name = null;
int length = name.Length;  // NullReferenceException!

// Runtime error - index out of bounds
int[] arr = { 1, 2, 3 };
int x = arr[10];  // IndexOutOfRangeException!
\`\`\`

### Goal: Catch Errors at Compile Time

\`\`\`csharp
// Enable nullable reference types to catch null errors
#nullable enable
string name = null;  // Warning: Converting null literal

// Use strict types instead of dynamic
dynamic value = GetValue();  // No compile-time checking
object value = GetValue();   // Some compile-time checking
\`\`\`

## Code Analysis

### Nullable Reference Types (C# 8+)

\`\`\`csharp
// In .csproj
// <Nullable>enable</Nullable>

// Now the compiler warns about null
string name = null;  // Warning!

// Use ? for nullable
string? possibleNull = null;  // OK

// Compiler ensures you check
if (possibleNull != null)
{
    int length = possibleNull.Length;  // Safe
}
\`\`\`

### Analyzers

\`\`\`xml
<!-- Add analyzers to .csproj -->
<ItemGroup>
  <PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="8.0.0" />
  <PackageReference Include="StyleCop.Analyzers" Version="1.1.118" />
</ItemGroup>
\`\`\`

## Configuration

### appsettings.json

\`\`\`json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyApp;..."
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "AppSettings": {
    "ApiKey": "your-api-key",
    "MaxRetries": 3
  }
}
\`\`\`

### Reading Configuration

\`\`\`csharp
// Bind to a class
public class AppSettings
{
    public string ApiKey { get; set; }
    public int MaxRetries { get; set; }
}

// In Program.cs
builder.Services.Configure<AppSettings>(
    builder.Configuration.GetSection("AppSettings"));

// Use in a service
public class MyService
{
    private readonly AppSettings _settings;

    public MyService(IOptions<AppSettings> options)
    {
        _settings = options.Value;
    }
}
\`\`\`

## Environment Variables

\`\`\`csharp
// Read environment variable
string dbConnection = Environment.GetEnvironmentVariable("DB_CONNECTION");

// In launchSettings.json for development
{
  "profiles": {
    "Development": {
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "DB_CONNECTION": "localhost"
      }
    }
  }
}
\`\`\`

## Logging

### Built-in Logging

\`\`\`csharp
public class UserService
{
    private readonly ILogger<UserService> _logger;

    public UserService(ILogger<UserService> logger)
    {
        _logger = logger;
    }

    public void CreateUser(string name)
    {
        _logger.LogInformation("Creating user: {Name}", name);

        try
        {
            // ... create user
            _logger.LogInformation("User created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create user: {Name}", name);
            throw;
        }
    }
}
\`\`\`

### Log Levels

\`\`\`csharp
_logger.LogTrace("Most detailed");
_logger.LogDebug("Debug information");
_logger.LogInformation("General information");
_logger.LogWarning("Something unexpected");
_logger.LogError("An error occurred");
_logger.LogCritical("System is down!");
\`\`\`

## Quick Reference

| Tool | Purpose |
|------|---------|
| Visual Studio | Full-featured IDE |
| VS Code | Lightweight editor |
| dotnet CLI | Command-line operations |
| NuGet | Package management |
| MSBuild | Build system |
| Roslyn | C# compiler |

## Learning Objectives

By the end of this lesson, you'll understand:
- Development environment options
- Using the dotnet CLI
- Managing packages with NuGet
- Debugging techniques
- Compile time vs runtime errors
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Compile Time vs Runtime',
      description: `Understand when errors are caught by C# vs when they crash at runtime.

**Your task:**
Print these three statements explaining when each error type is caught:

1. Type mismatch (string to int) - **Compile time**
2. Null reference access - **Runtime** (unless nullable enabled)
3. Array index out of bounds - **Runtime**

**Key insight:** C#'s type system catches many errors at compile time!`,
      starterCode: `// Print three explanations about when errors are caught:
// 1. Type mismatch errors
// 2. Null reference errors
// 3. Array index out of bounds errors

`,
      solution: `Console.WriteLine("Example 1: Compile time - C# catches type mismatch");

Console.WriteLine("Example 2: Runtime - Null reference not caught by default");

Console.WriteLine("Example 3: Runtime - Array bounds checked at runtime");`,
      expectedOutput: [
        'Example 1: Compile time - C# catches type mismatch',
        'Example 2: Runtime - Null reference not caught by default',
        'Example 3: Runtime - Array bounds checked at runtime'
      ],
      hints: [
        'C# catches type errors before code runs',
        'Null references can be caught with nullable reference types enabled',
        'Array bounds are checked at runtime, causing IndexOutOfRangeException',
        'Just print the three Console.WriteLine statements!'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Debugging with Console Output',
      description: `Use Console.WriteLine to trace through code and understand what's happening.

**Your task:**
1. Create an array \`numbers\` with values [1, 2, 3]
2. Loop through and print each value
3. Calculate and print the sum (should be 6)

**Debugging tip:** Print values at each step to see what's happening!`,
      starterCode: `// Create an array with [1, 2, 3]


// Loop through and print each number


// Calculate the sum and print "Sum: 6"

`,
      solution: `int[] numbers = { 1, 2, 3 };

foreach (int num in numbers)
{
    Console.WriteLine(num);
}

int sum = 1 + 2 + 3;
Console.WriteLine("Sum: " + sum);`,
      expectedOutput: [
        '1',
        '2',
        '3',
        'Sum: 6'
      ],
      hints: [
        'Create the array: int[] numbers = { 1, 2, 3 };',
        'Loop with foreach: foreach (int num in numbers)',
        'Print each value: Console.WriteLine(num);',
        'Print the sum with string concatenation: "Sum: " + sum'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: dotnet CLI Commands',
      description: `Learn the essential dotnet CLI commands.

**Your task:**
Print the dotnet command for each operation:
1. Create a new console application
2. Build the project
3. Run the project
4. Add a NuGet package called "Newtonsoft.Json"

**Print format:** "[operation]: dotnet [command]"`,
      starterCode: `// Print the dotnet command for each operation:

// 1. Create a new console application


// 2. Build the project


// 3. Run the project


// 4. Add a NuGet package called "Newtonsoft.Json"

`,
      solution: `Console.WriteLine("Create console app: dotnet new console");
Console.WriteLine("Build project: dotnet build");
Console.WriteLine("Run project: dotnet run");
Console.WriteLine("Add package: dotnet add package Newtonsoft.Json");`,
      expectedOutput: [
        'Create console app: dotnet new console',
        'Build project: dotnet build',
        'Run project: dotnet run',
        'Add package: dotnet add package Newtonsoft.Json'
      ],
      hints: [
        'dotnet new console creates a console application',
        'dotnet build compiles the project',
        'dotnet run builds and runs',
        'dotnet add package [name] adds NuGet packages'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Log Levels',
      description: `Understand logging levels and when to use them.

**Your task:**
Print descriptions for each log level from least to most severe:
1. Trace - Most detailed diagnostic info
2. Debug - Development debugging info
3. Information - General operational info
4. Warning - Unexpected but handled events
5. Error - Errors that need attention
6. Critical - System failures

**Print format:** "[Level]: [Description]"`,
      starterCode: `// Print each log level with its purpose:

// 1. Trace


// 2. Debug


// 3. Information


// 4. Warning


// 5. Error


// 6. Critical

`,
      solution: `Console.WriteLine("Trace: Most detailed diagnostic information");
Console.WriteLine("Debug: Development debugging information");
Console.WriteLine("Information: General operational events");
Console.WriteLine("Warning: Unexpected but handled events");
Console.WriteLine("Error: Errors that need attention");
Console.WriteLine("Critical: System failures requiring action");`,
      expectedOutput: [
        'Trace: Most detailed diagnostic information',
        'Debug: Development debugging information',
        'Information: General operational events',
        'Warning: Unexpected but handled events',
        'Error: Errors that need attention',
        'Critical: System failures requiring action'
      ],
      hints: [
        'Trace is the most verbose level',
        'Debug is useful during development',
        'Information is for normal operations',
        'Warning through Critical indicate problems of increasing severity'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the dotnet CLI command to create a new web API project?',
      options: [
        'dotnet create webapi',
        'dotnet new webapi',
        'dotnet init api',
        'dotnet make webapi'
      ],
      correctIndex: 1,
      explanation: 'dotnet new webapi creates a new Web API project. The "new" command creates projects from templates.'
    },
    {
      question: 'What is NuGet?',
      options: [
        'A testing framework',
        'The C# compiler',
        'The package manager for .NET',
        'A web framework'
      ],
      correctIndex: 2,
      explanation: 'NuGet is the package manager for .NET, similar to npm for Node.js. It manages third-party libraries and dependencies.'
    },
    {
      question: 'What does "dotnet watch run" do?',
      options: [
        'Runs the project once',
        'Runs tests and watches for changes',
        'Runs the project and restarts when files change',
        'Watches the project without running'
      ],
      correctIndex: 2,
      explanation: 'dotnet watch run monitors for file changes and automatically rebuilds and restarts the application, enabling hot reload during development.'
    },
    {
      question: 'What happens when nullable reference types are enabled and you assign null to a non-nullable string?',
      options: [
        'The code runs normally',
        'A runtime exception is thrown',
        'The compiler shows a warning',
        'The value becomes empty string'
      ],
      correctIndex: 2,
      explanation: 'With nullable reference types enabled, assigning null to a non-nullable reference type generates a compiler warning, helping catch potential null reference errors before runtime.'
    }
  ],
  buildNote: {
    title: 'Developer Tooling in Practice',
    explanation: `Professional C# development relies heavily on these tools. Visual Studio provides debugging, profiling, and code analysis out of the box. The dotnet CLI enables automation in CI/CD pipelines - every push can run dotnet build, dotnet test, and dotnet publish automatically. NuGet packages accelerate development by providing tested, maintained libraries. Nullable reference types, introduced in C# 8, help catch null reference exceptions at compile time. Modern .NET projects use analyzers to enforce code quality standards and catch common mistakes.`,
    relatedFiles: [
      'MyProject.csproj',
      'appsettings.json',
      '.editorconfig'
    ],
    inTheRealWorld: `Enterprise C# development uses sophisticated tooling. CI/CD pipelines on Azure DevOps or GitHub Actions run builds, tests, and deployments. Code analysis tools like SonarQube scan for security vulnerabilities and code smells. Application Insights and Serilog provide production monitoring and structured logging. Docker containers package applications for consistent deployment. Understanding the tooling ecosystem is as important as understanding the language itself for professional development.`
  }
};
