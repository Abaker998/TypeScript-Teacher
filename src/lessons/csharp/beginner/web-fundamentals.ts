import { Lesson } from '@/types/lesson';

export const webFundamentals: Lesson = {
  slug: 'csharp-web-fundamentals',
  title: 'Web Fundamentals with ASP.NET',
  description: 'Understand ASP.NET Core basics, HTTP, REST APIs, and web development concepts.',
  difficulty: 'beginner',
  order: 7,
  content: `
# Web Development Fundamentals with ASP.NET Core

Before diving deep into C# web development, it helps to understand the core concepts of ASP.NET Core and web APIs.

## What is ASP.NET Core?

ASP.NET Core is Microsoft's framework for building web applications and APIs with C#. It's:
- **Cross-platform** - runs on Windows, Linux, and macOS
- **High-performance** - one of the fastest web frameworks
- **Open-source** - developed by Microsoft and the community

## HTTP Basics

Web applications communicate using HTTP (HyperText Transfer Protocol):

\`\`\`csharp
// HTTP Request has:
// - Method (GET, POST, PUT, DELETE)
// - URL (where to send the request)
// - Headers (metadata like Content-Type)
// - Body (data being sent, for POST/PUT)

// HTTP Response has:
// - Status Code (200 OK, 404 Not Found, etc.)
// - Headers
// - Body (the data returned)
\`\`\`

## REST API Concepts

REST APIs use HTTP methods to perform operations:

\`\`\`csharp
// GET - Retrieve data
// GET /api/users -> Get all users
// GET /api/users/1 -> Get user with ID 1

// POST - Create new data
// POST /api/users -> Create a new user

// PUT - Update existing data
// PUT /api/users/1 -> Update user with ID 1

// DELETE - Remove data
// DELETE /api/users/1 -> Delete user with ID 1
\`\`\`

## Creating an ASP.NET Core Web API

A minimal API example:

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Define endpoints
app.MapGet("/", () => "Hello World!");

app.MapGet("/api/users", () =>
{
    return new[] { "Alice", "Bob", "Charlie" };
});

app.MapGet("/api/users/{id}", (int id) =>
{
    return $"User {id}";
});

app.MapPost("/api/users", (User user) =>
{
    return Results.Created($"/api/users/{user.Id}", user);
});

app.Run();

record User(int Id, string Name, string Email);
\`\`\`

## Controllers (Traditional Approach)

For larger applications, use controllers:

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly List<User> _users = new();

    [HttpGet]
    public ActionResult<IEnumerable<User>> GetAll()
    {
        return Ok(_users);
    }

    [HttpGet("{id}")]
    public ActionResult<User> GetById(int id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public ActionResult<User> Create(User user)
    {
        _users.Add(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public ActionResult Update(int id, User user)
    {
        var existing = _users.FirstOrDefault(u => u.Id == id);
        if (existing == null)
            return NotFound();
        // Update logic...
        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return NotFound();
        _users.Remove(user);
        return NoContent();
    }
}
\`\`\`

## JSON in C#

ASP.NET Core automatically serializes/deserializes JSON:

\`\`\`csharp
using System.Text.Json;

// Object to JSON string
var user = new { Name = "Alice", Age = 28 };
string jsonString = JsonSerializer.Serialize(user);
Console.WriteLine(jsonString);  // {"Name":"Alice","Age":28}

// JSON string to object
string json = "{\\"Name\\":\\"Bob\\",\\"Age\\":30}";
var parsed = JsonSerializer.Deserialize<User>(json);
Console.WriteLine(parsed.Name);  // "Bob"

// Pretty print
var options = new JsonSerializerOptions { WriteIndented = true };
string pretty = JsonSerializer.Serialize(user, options);
\`\`\`

## Model Binding

ASP.NET Core automatically binds request data to parameters:

\`\`\`csharp
// From route: /api/users/5
[HttpGet("{id}")]
public ActionResult GetUser(int id) { }  // id = 5

// From query string: /api/users?name=Alice&age=30
[HttpGet]
public ActionResult Search([FromQuery] string name, [FromQuery] int age) { }

// From request body (JSON)
[HttpPost]
public ActionResult Create([FromBody] User user) { }

// From header
[HttpGet]
public ActionResult GetData([FromHeader(Name = "X-API-Key")] string apiKey) { }
\`\`\`

## HTTP Status Codes

Return appropriate status codes:

\`\`\`csharp
[HttpGet("{id}")]
public ActionResult<User> GetUser(int id)
{
    var user = FindUser(id);

    if (user == null)
        return NotFound();           // 404

    return Ok(user);                 // 200
}

[HttpPost]
public ActionResult CreateUser(User user)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);  // 400

    // Create user...
    return Created($"/api/users/{user.Id}", user);  // 201
}

// Other common responses:
// return NoContent();          // 204 - Success, no body
// return Unauthorized();       // 401 - Not authenticated
// return Forbid();             // 403 - Not authorized
// return Conflict();           // 409 - Resource conflict
\`\`\`

## Dependency Injection

ASP.NET Core has built-in dependency injection:

\`\`\`csharp
// Register services in Program.cs
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<ICacheService, CacheService>();

// Use in controllers
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult> GetUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }
}
\`\`\`

## Making HTTP Requests with HttpClient

Call other APIs from your C# code:

\`\`\`csharp
using var client = new HttpClient();

// GET request
var response = await client.GetAsync("https://api.example.com/users");
if (response.IsSuccessStatusCode)
{
    var content = await response.Content.ReadAsStringAsync();
    var users = JsonSerializer.Deserialize<List<User>>(content);
}

// POST request
var newUser = new { Name = "Alice", Email = "alice@example.com" };
var json = JsonSerializer.Serialize(newUser);
var content = new StringContent(json, Encoding.UTF8, "application/json");
var response = await client.PostAsync("https://api.example.com/users", content);
\`\`\`

## Middleware

Middleware processes requests in a pipeline:

\`\`\`csharp
var app = builder.Build();

// Middleware runs in order
app.UseHttpsRedirection();      // Redirect HTTP to HTTPS
app.UseAuthentication();        // Check who you are
app.UseAuthorization();         // Check what you can do
app.MapControllers();           // Route to controller

// Custom middleware
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Path}");
    await next();  // Call next middleware
    Console.WriteLine($"Response: {context.Response.StatusCode}");
});
\`\`\`

## Common Response Patterns

\`\`\`csharp
// Return data
return Ok(data);

// Return data with status
return new ObjectResult(data) { StatusCode = 200 };

// Return problem details (RFC 7807)
return Problem(
    detail: "User with this email already exists",
    statusCode: 409,
    title: "Duplicate Email"
);

// Return validation errors
return ValidationProblem(ModelState);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll understand:
- What ASP.NET Core is and how it works
- HTTP methods and REST API conventions
- How to create API endpoints
- JSON serialization in C#
- Dependency injection basics
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: JSON Serialization',
      description: `Learn to convert between C# objects and JSON strings.

**Your task:**
1. Create an anonymous object with Name "Bob" and Age 30
2. Serialize it to a JSON string using JsonSerializer.Serialize()
3. Print the JSON string

**Key functions:**
- \`JsonSerializer.Serialize(obj)\` - converts object to JSON string`,
      starterCode: `using System.Text.Json;

// Create an object with Name "Bob" and Age 30


// Serialize to JSON string and print it

`,
      solution: `using System.Text.Json;

var person = new { Name = "Bob", Age = 30 };

string json = JsonSerializer.Serialize(person);
Console.WriteLine(json);`,
      expectedOutput: ['{"Name":"Bob","Age":30}'],
      hints: [
        'Create anonymous object: var person = new { Name = "Bob", Age = 30 };',
        'Serialize: JsonSerializer.Serialize(person)',
        'The output is a JSON string with double quotes',
        'Property names are preserved in JSON'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: HTTP Status Codes',
      description: `Understand which HTTP status codes to use.

**Your task:**
Print the correct status code and meaning for each scenario:
1. Success - resource found
2. Resource not found
3. New resource created
4. Bad request (validation failed)

**Print format:** "[code] - [meaning]"`,
      starterCode: `// Print the appropriate status code for each scenario:

// 1. Success - resource found


// 2. Resource not found


// 3. New resource created


// 4. Bad request (validation failed)

`,
      solution: `Console.WriteLine("200 - OK");
Console.WriteLine("404 - Not Found");
Console.WriteLine("201 - Created");
Console.WriteLine("400 - Bad Request");`,
      expectedOutput: ['200 - OK', '404 - Not Found', '201 - Created', '400 - Bad Request'],
      hints: [
        '200 is the standard success code',
        '404 means the resource doesn\'t exist',
        '201 means a new resource was created',
        '400 means the client sent invalid data'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: REST HTTP Methods',
      description: `Match HTTP methods to their operations.

**Your task:**
Print which HTTP method is used for each operation:
1. Retrieve all users
2. Create a new user
3. Update an existing user
4. Delete a user

**Print format:** "[Operation] - [METHOD]"`,
      starterCode: `// Print the HTTP method for each operation:

// 1. Retrieve all users


// 2. Create a new user


// 3. Update an existing user


// 4. Delete a user

`,
      solution: `Console.WriteLine("Retrieve all users - GET");
Console.WriteLine("Create a new user - POST");
Console.WriteLine("Update an existing user - PUT");
Console.WriteLine("Delete a user - DELETE");`,
      expectedOutput: ['Retrieve all users - GET', 'Create a new user - POST', 'Update an existing user - PUT', 'Delete a user - DELETE'],
      hints: [
        'GET retrieves data without modifying',
        'POST creates new resources',
        'PUT updates existing resources',
        'DELETE removes resources'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Parse JSON Data',
      description: `Parse a JSON string into a C# object.

**Your task:**
1. A JSON string is provided representing a user
2. Parse it using JsonSerializer.Deserialize()
3. Print the user's name
4. Print the user's age

**Note:** You need to deserialize to a matching type or dynamic.`,
      starterCode: `using System.Text.Json;

// JSON string representing a user
string json = "{\\"Name\\":\\"Alice\\",\\"Age\\":25}";

// Define a record or class for the data
record Person(string Name, int Age);

// Deserialize the JSON


// Print the name


// Print the age

`,
      solution: `using System.Text.Json;

string json = "{\\"Name\\":\\"Alice\\",\\"Age\\":25}";

record Person(string Name, int Age);

var person = JsonSerializer.Deserialize<Person>(json);

Console.WriteLine(person.Name);
Console.WriteLine(person.Age);`,
      expectedOutput: ['Alice', '25'],
      hints: [
        'Deserialize: JsonSerializer.Deserialize<Person>(json)',
        'The type parameter <Person> tells it what to create',
        'Access properties: person.Name, person.Age',
        'The record Person must have matching property names'
      ]
    }
  ],
  quiz: [
    {
      question: 'What HTTP method is used to create a new resource in a REST API?',
      options: [
        'GET',
        'POST',
        'PUT',
        'PATCH'
      ],
      correctIndex: 1,
      explanation: 'POST is used to create new resources. GET retrieves, PUT updates/replaces, and PATCH partially updates existing resources.'
    },
    {
      question: 'What status code should you return when a resource is not found?',
      options: [
        '200 OK',
        '201 Created',
        '400 Bad Request',
        '404 Not Found'
      ],
      correctIndex: 3,
      explanation: '404 Not Found indicates the requested resource doesn\'t exist. This is a standard HTTP status code for missing resources.'
    },
    {
      question: 'What is dependency injection in ASP.NET Core?',
      options: [
        'A way to include JavaScript files',
        'A pattern where objects receive their dependencies from an external source',
        'A method of database access',
        'A security feature'
      ],
      correctIndex: 1,
      explanation: 'Dependency injection provides objects with their dependencies instead of having them create dependencies themselves. This improves testability and modularity.'
    },
    {
      question: 'What does the [HttpGet] attribute do in a controller?',
      options: [
        'Makes the method return HTML',
        'Specifies the method handles HTTP GET requests',
        'Gets data from the database',
        'Downloads a file'
      ],
      correctIndex: 1,
      explanation: 'The [HttpGet] attribute marks a controller method as handling HTTP GET requests. Other attributes include [HttpPost], [HttpPut], and [HttpDelete].'
    }
  ],
  buildNote: {
    title: 'Web Fundamentals in Practice',
    explanation: `ASP.NET Core is the foundation of modern C# web development. The framework handles HTTP parsing, routing, model binding, and response formatting automatically. Controllers organize endpoints by resource type, while minimal APIs provide a lightweight alternative. JSON serialization with System.Text.Json is the default, though Newtonsoft.Json (Json.NET) is still widely used. Dependency injection is built into the framework, making it easy to write testable, modular code. Understanding these fundamentals is essential for building any web application or API with C#.`,
    relatedFiles: [
      'Program.cs',
      'Controllers/ApiController.cs',
      'Models/ApiResponse.cs'
    ],
    inTheRealWorld: `ASP.NET Core powers many high-traffic websites and APIs. Companies like Stack Overflow, GoDaddy, and UPS use it in production. The framework's performance consistently ranks among the fastest in benchmarks. Modern development often uses minimal APIs for microservices and controllers for larger applications. The combination of strong typing, dependency injection, and middleware makes it excellent for enterprise applications where reliability and maintainability are critical.`
  }
};
