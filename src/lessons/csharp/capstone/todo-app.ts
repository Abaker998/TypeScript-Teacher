import { Lesson } from '@/types/lesson';

export const todoAppCapstone: Lesson = {
  slug: 'csharp-capstone-todo-app',
  title: 'Capstone: Build a Todo App',
  description: 'Apply everything you\'ve learned by building a complete Todo application with C#.',
  difficulty: 'master',
  order: 29,
  content: `
# Capstone Project: Build a Todo App in C#

Congratulations on making it this far! In this capstone project, you'll apply everything you've learned to build a fully-typed console Todo application from scratch.

## What You'll Build

A complete Todo manager that demonstrates:
- **Classes and Records** for defining data structures
- **Interfaces** for abstraction and testability
- **LINQ** for powerful data queries
- **File I/O** for persistence
- **Async/Await** for non-blocking operations
- **Exception Handling** for robust error management

## Project Overview

You'll build your Todo app in 6 steps, each focusing on different C# concepts:

| Step | Focus | Concepts Used |
|------|-------|---------------|
| 1 | Define Types | Records, enums, classes |
| 2 | Create Core Methods | Methods, return types, parameters |
| 3 | LINQ Operations | Where, Select, OrderBy, GroupBy |
| 4 | Error Handling | Try/catch, custom exceptions, validation |
| 5 | File Persistence | File I/O, JSON serialization, async |
| 6 | Put It Together | TodoManager class with all features |

## Tips for Success

- **Read carefully**: Each exercise builds on the previous one
- **Use hints**: If stuck, reveal hints one at a time
- **Check types**: Make sure your method signatures are correct
- **Test as you go**: Run your code to verify it works

Let's start building!
`,
  exercises: [
    {
      id: 1,
      title: 'Step 1: Define Types',
      description: `Let's start by defining the types for our Todo application.

**Your task:**
1. Create an enum called \`Priority\` with values: Low, Medium, High
2. Create a record called \`Todo\` with these properties:
   - \`Id\`: int
   - \`Title\`: string
   - \`IsCompleted\`: bool
   - \`Priority\`: Priority
   - \`CreatedAt\`: DateTime
   - \`DueDate\`: DateTime? (nullable)
3. Create a sample todo and print its title.

**Expected output:** The title of your todo`,
      starterCode: `using System;

// Define the Priority enum


// Define the Todo record


// Create a sample todo
var myTodo = new Todo(
    1,
    "Learn C#",
    false,
    Priority.High,
    DateTime.Now,
    null
);

// Print the todo's title
Console.WriteLine(myTodo.Title);`,
      solution: `using System;

public enum Priority
{
    Low,
    Medium,
    High
}

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

var myTodo = new Todo(
    1,
    "Learn C#",
    false,
    Priority.High,
    DateTime.Now,
    null
);

Console.WriteLine(myTodo.Title);`,
      expectedOutput: ['Learn C#'],
      hints: [
        'Enum syntax: public enum Name { Value1, Value2, Value3 }',
        'Record syntax: public record Name(Type Prop1, Type Prop2, ...);',
        'Use DateTime? for nullable DateTime',
        'Records provide automatic immutability and value equality'
      ]
    },
    {
      id: 2,
      title: 'Step 2: Create Core Methods',
      description: `Now let's create the core methods for managing todos.

**Your task:**
1. Create a method \`CreateTodo\` that:
   - Takes \`title\` (string), \`id\` (int), and \`priority\` (Priority) as parameters
   - Returns a new Todo with IsCompleted = false, CreatedAt = DateTime.Now, DueDate = null

2. Create a method \`ToggleTodo\` that:
   - Takes a \`todo\` (Todo) as parameter
   - Returns a new Todo with IsCompleted toggled (using "with" expression)

3. Test your methods by creating and toggling a todo.

**Expected output:**
- false (initial completed state)
- true (after toggle)`,
      starterCode: `using System;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

// Create the CreateTodo method


// Create the ToggleTodo method


// Test your methods
var todo = CreateTodo("Build a todo app", 1, Priority.Medium);
Console.WriteLine(todo.IsCompleted);

var toggledTodo = ToggleTodo(todo);
Console.WriteLine(toggledTodo.IsCompleted);`,
      solution: `using System;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

public static Todo CreateTodo(string title, int id, Priority priority)
{
    return new Todo(
        id,
        title,
        false,
        priority,
        DateTime.Now,
        null
    );
}

public static Todo ToggleTodo(Todo todo)
{
    return todo with { IsCompleted = !todo.IsCompleted };
}

var todo = CreateTodo("Build a todo app", 1, Priority.Medium);
Console.WriteLine(todo.IsCompleted);

var toggledTodo = ToggleTodo(todo);
Console.WriteLine(toggledTodo.IsCompleted);`,
      expectedOutput: ['False', 'True'],
      hints: [
        'Method syntax: public static ReturnType Name(params) { }',
        'Use "with" expression for non-destructive mutation: record with { Prop = value }',
        'Toggle a boolean with the ! operator: !todo.IsCompleted',
        'Records are immutable, so return a new instance'
      ]
    },
    {
      id: 3,
      title: 'Step 3: LINQ Operations',
      description: `Let's work with collections of todos using LINQ.

**Your task:**
1. Create a method \`FilterByStatus\` that:
   - Takes \`todos\` (List<Todo>) and \`completed\` (bool)
   - Returns todos matching the completion status

2. Create a method \`GetByPriority\` that:
   - Takes \`todos\` (List<Todo>) and \`priority\` (Priority)
   - Returns todos with that priority, ordered by CreatedAt descending

3. Create a method \`GetTodoTitles\` that:
   - Takes \`todos\` (List<Todo>)
   - Returns a list of just the titles (List<string>)

4. Test with the provided todos array.

**Expected output:**
- 2 (number of incomplete todos)
- Titles joined by comma`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

// Create the FilterByStatus method


// Create the GetByPriority method


// Create the GetTodoTitles method


// Test data
var todos = new List<Todo>
{
    new Todo(1, "Learn C#", true, Priority.High, DateTime.Now.AddDays(-2), null),
    new Todo(2, "Build todo app", false, Priority.High, DateTime.Now.AddDays(-1), null),
    new Todo(3, "Write tests", false, Priority.Medium, DateTime.Now, null)
};

// Test FilterByStatus
var incompleteTodos = FilterByStatus(todos, false);
Console.WriteLine(incompleteTodos.Count);

// Test GetTodoTitles
var titles = GetTodoTitles(todos);
Console.WriteLine(string.Join(", ", titles));`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

public static List<Todo> FilterByStatus(List<Todo> todos, bool completed)
{
    return todos.Where(t => t.IsCompleted == completed).ToList();
}

public static List<Todo> GetByPriority(List<Todo> todos, Priority priority)
{
    return todos
        .Where(t => t.Priority == priority)
        .OrderByDescending(t => t.CreatedAt)
        .ToList();
}

public static List<string> GetTodoTitles(List<Todo> todos)
{
    return todos.Select(t => t.Title).ToList();
}

var todos = new List<Todo>
{
    new Todo(1, "Learn C#", true, Priority.High, DateTime.Now.AddDays(-2), null),
    new Todo(2, "Build todo app", false, Priority.High, DateTime.Now.AddDays(-1), null),
    new Todo(3, "Write tests", false, Priority.Medium, DateTime.Now, null)
};

var incompleteTodos = FilterByStatus(todos, false);
Console.WriteLine(incompleteTodos.Count);

var titles = GetTodoTitles(todos);
Console.WriteLine(string.Join(", ", titles));`,
      expectedOutput: ['2', 'Learn C#, Build todo app, Write tests'],
      hints: [
        'Use Where() to filter: todos.Where(t => condition)',
        'Use Select() to transform: todos.Select(t => t.Property)',
        'Use OrderByDescending() for reverse sorting',
        'Don\'t forget .ToList() to materialize the query'
      ]
    },
    {
      id: 4,
      title: 'Step 4: Error Handling',
      description: `Let's add validation and error handling to make our app robust.

**Your task:**
1. Create a method \`FindTodoById\` that:
   - Takes \`todos\` (List<Todo>) and \`id\` (int)
   - Returns the Todo if found, or \`null\` if not found

2. Create a method \`ValidateTodoTitle\` that:
   - Takes \`title\` (string)
   - Returns \`true\` if title is at least 3 characters (after trimming)
   - Returns \`false\` otherwise

3. Create a method \`SafeUpdateTitle\` that:
   - Takes \`todos\` (List<Todo>), \`id\` (int), and \`newTitle\` (string)
   - Finds the todo by id
   - Validates the new title
   - Returns the updated todo if valid, or \`null\` if todo not found or title invalid

**Expected output:**
- Found todo title
- true/false for validation
- Updated title or "null"`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

// Create FindTodoById method


// Create ValidateTodoTitle method


// Create SafeUpdateTitle method


// Test data
var todos = new List<Todo>
{
    new Todo(1, "Learn C#", false, Priority.High, DateTime.Now, null),
    new Todo(2, "Build app", false, Priority.Medium, DateTime.Now, null)
};

// Test FindTodoById
var found = FindTodoById(todos, 1);
Console.WriteLine(found != null ? found.Title : "Not found");

// Test ValidateTodoTitle
Console.WriteLine(ValidateTodoTitle("Hi"));
Console.WriteLine(ValidateTodoTitle("Hello World"));

// Test SafeUpdateTitle
var updated = SafeUpdateTitle(todos, 1, "Master C#");
Console.WriteLine(updated != null ? updated.Title : "null");

var invalid = SafeUpdateTitle(todos, 1, "Hi");
Console.WriteLine(invalid != null ? invalid.Title : "null");`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

public static Todo? FindTodoById(List<Todo> todos, int id)
{
    return todos.FirstOrDefault(t => t.Id == id);
}

public static bool ValidateTodoTitle(string title)
{
    return title.Trim().Length >= 3;
}

public static Todo? SafeUpdateTitle(List<Todo> todos, int id, string newTitle)
{
    var todo = FindTodoById(todos, id);
    if (todo == null)
    {
        return null;
    }
    if (!ValidateTodoTitle(newTitle))
    {
        return null;
    }
    return todo with { Title = newTitle };
}

var todos = new List<Todo>
{
    new Todo(1, "Learn C#", false, Priority.High, DateTime.Now, null),
    new Todo(2, "Build app", false, Priority.Medium, DateTime.Now, null)
};

var found = FindTodoById(todos, 1);
Console.WriteLine(found != null ? found.Title : "Not found");

Console.WriteLine(ValidateTodoTitle("Hi"));
Console.WriteLine(ValidateTodoTitle("Hello World"));

var updated = SafeUpdateTitle(todos, 1, "Master C#");
Console.WriteLine(updated != null ? updated.Title : "null");

var invalid = SafeUpdateTitle(todos, 1, "Hi");
Console.WriteLine(invalid != null ? invalid.Title : "null");`,
      expectedOutput: ['Learn C#', 'False', 'True', 'Master C#', 'null'],
      hints: [
        'Use FirstOrDefault() to find or return null',
        'Return type Todo? indicates it can be null',
        'Use string.Trim() to remove whitespace before checking length',
        'Return null early if validation fails (early return pattern)'
      ]
    },
    {
      id: 5,
      title: 'Step 5: Async File Operations',
      description: `Let's add persistence using async file operations.

**Your task:**
1. Create an async method \`SaveTodosAsync\` that:
   - Takes \`todos\` (List<Todo>) and \`filename\` (string)
   - Serializes todos to JSON and writes to file asynchronously
   - Returns Task

2. Create an async method \`LoadTodosAsync\` that:
   - Takes \`filename\` (string)
   - Reads and deserializes todos from file
   - Returns Task<List<Todo>>
   - Returns empty list if file doesn't exist

3. Create an async \`MainAsync\` that saves and loads todos

**Note:** Use System.Text.Json for serialization.`,
      starterCode: `using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

// Create async SaveTodosAsync method


// Create async LoadTodosAsync method


// Create async MainAsync method that tests save/load
public static async Task MainAsync()
{
    var todos = new List<Todo>
    {
        new Todo(1, "Learn C#", false, Priority.High, DateTime.Now, null),
        new Todo(2, "Build app", true, Priority.Medium, DateTime.Now, null)
    };

    // Save todos
    await SaveTodosAsync(todos, "todos.json");
    Console.WriteLine($"Saved {todos.Count} todos");

    // Load todos
    var loaded = await LoadTodosAsync("todos.json");
    Console.WriteLine($"Loaded {loaded.Count} todos");
}

// Run the async main
MainAsync().Wait();`,
      solution: `using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

public static async Task SaveTodosAsync(List<Todo> todos, string filename)
{
    var options = new JsonSerializerOptions { WriteIndented = true };
    var json = JsonSerializer.Serialize(todos, options);
    await File.WriteAllTextAsync(filename, json);
}

public static async Task<List<Todo>> LoadTodosAsync(string filename)
{
    if (!File.Exists(filename))
    {
        return new List<Todo>();
    }
    var json = await File.ReadAllTextAsync(filename);
    return JsonSerializer.Deserialize<List<Todo>>(json) ?? new List<Todo>();
}

public static async Task MainAsync()
{
    var todos = new List<Todo>
    {
        new Todo(1, "Learn C#", false, Priority.High, DateTime.Now, null),
        new Todo(2, "Build app", true, Priority.Medium, DateTime.Now, null)
    };

    await SaveTodosAsync(todos, "todos.json");
    Console.WriteLine($"Saved {todos.Count} todos");

    var loaded = await LoadTodosAsync("todos.json");
    Console.WriteLine($"Loaded {loaded.Count} todos");
}

MainAsync().Wait();`,
      expectedOutput: ['Saved 2 todos', 'Loaded 2 todos'],
      hints: [
        'Use JsonSerializer.Serialize and JsonSerializer.Deserialize',
        'File.WriteAllTextAsync and File.ReadAllTextAsync are async',
        'Check File.Exists before reading to handle missing files',
        'Use null-coalescing (??) to return empty list if deserialization returns null'
      ]
    },
    {
      id: 6,
      title: 'Step 6: Put It Together',
      description: `Now let's combine everything into a complete TodoManager class!

**Your task:**
Create a \`TodoManager\` class that:
1. Has a private \`_todos\` list and \`_nextId\` counter
2. Implements these methods:
   - \`Add(string title, Priority priority)\` - Creates and adds a todo, returns it
   - \`Toggle(int id)\` - Toggles completion, returns updated todo or null
   - \`Remove(int id)\` - Removes a todo, returns true if found
   - \`GetAll()\` - Returns all todos
   - \`GetIncomplete()\` - Returns only incomplete todos
   - \`GetByPriority(Priority priority)\` - Returns todos with that priority

Test your TodoManager with the provided code.

**Expected output:**
- "Added: Learn C# (id: 1)"
- "Added: Build todo app (id: 2)"
- "Total: 2"
- "Toggled: Learn C# is now completed"
- "Incomplete: 1"
- "Removed: True"
- "Total: 1"`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

// Create the TodoManager class here


// Test the TodoManager
var manager = new TodoManager();

var todo1 = manager.Add("Learn C#", Priority.High);
Console.WriteLine($"Added: {todo1.Title} (id: {todo1.Id})");

var todo2 = manager.Add("Build todo app", Priority.Medium);
Console.WriteLine($"Added: {todo2.Title} (id: {todo2.Id})");

Console.WriteLine($"Total: {manager.GetAll().Count}");

var toggled = manager.Toggle(1);
if (toggled != null)
{
    Console.WriteLine($"Toggled: {toggled.Title} is now {(toggled.IsCompleted ? "completed" : "incomplete")}");
}

Console.WriteLine($"Incomplete: {manager.GetIncomplete().Count}");

var removed = manager.Remove(2);
Console.WriteLine($"Removed: {removed}");

Console.WriteLine($"Total: {manager.GetAll().Count}");`,
      solution: `using System;
using System.Collections.Generic;
using System.Linq;

public enum Priority { Low, Medium, High }

public record Todo(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime CreatedAt,
    DateTime? DueDate
);

public class TodoManager
{
    private readonly List<Todo> _todos = new();
    private int _nextId = 1;

    public Todo Add(string title, Priority priority)
    {
        var todo = new Todo(
            _nextId++,
            title,
            false,
            priority,
            DateTime.Now,
            null
        );
        _todos.Add(todo);
        return todo;
    }

    public Todo? Toggle(int id)
    {
        var index = _todos.FindIndex(t => t.Id == id);
        if (index == -1)
        {
            return null;
        }
        var todo = _todos[index];
        var toggled = todo with { IsCompleted = !todo.IsCompleted };
        _todos[index] = toggled;
        return toggled;
    }

    public bool Remove(int id)
    {
        var index = _todos.FindIndex(t => t.Id == id);
        if (index == -1)
        {
            return false;
        }
        _todos.RemoveAt(index);
        return true;
    }

    public List<Todo> GetAll()
    {
        return _todos.ToList();
    }

    public List<Todo> GetIncomplete()
    {
        return _todos.Where(t => !t.IsCompleted).ToList();
    }

    public List<Todo> GetByPriority(Priority priority)
    {
        return _todos.Where(t => t.Priority == priority).ToList();
    }
}

var manager = new TodoManager();

var todo1 = manager.Add("Learn C#", Priority.High);
Console.WriteLine($"Added: {todo1.Title} (id: {todo1.Id})");

var todo2 = manager.Add("Build todo app", Priority.Medium);
Console.WriteLine($"Added: {todo2.Title} (id: {todo2.Id})");

Console.WriteLine($"Total: {manager.GetAll().Count}");

var toggled = manager.Toggle(1);
if (toggled != null)
{
    Console.WriteLine($"Toggled: {toggled.Title} is now {(toggled.IsCompleted ? "completed" : "incomplete")}");
}

Console.WriteLine($"Incomplete: {manager.GetIncomplete().Count}");

var removed = manager.Remove(2);
Console.WriteLine($"Removed: {removed}");

Console.WriteLine($"Total: {manager.GetAll().Count}");`,
      expectedOutput: [
        'Added: Learn C# (id: 1)',
        'Added: Build todo app (id: 2)',
        'Total: 2',
        'Toggled: Learn C# is now completed',
        'Incomplete: 1',
        'Removed: True',
        'Total: 1'
      ],
      hints: [
        'Use List<Todo>.FindIndex() to find by id and get the index',
        'Update the list at the index with the toggled todo',
        'Use _nextId++ to get current value and increment',
        'Return ToList() to create a copy of the internal list'
      ]
    }
  ],
  buildNote: {
    title: 'Real-World Todo Applications',
    explanation: `This capstone project mirrors how real-world C# applications are built. The TodoManager class follows the repository pattern commonly used with Entity Framework. In production ASP.NET Core apps, you'd expose these operations through API controllers, use a database instead of in-memory storage, and add authentication. The record types provide immutability that's valuable in concurrent scenarios. The async file operations demonstrate patterns used with databases and external APIs.`,
    relatedFiles: [
      'src/lessons/csharp/capstone/todo-app.ts',
      'src/lessons/csharp/intermediate/classes.ts',
      'src/lessons/csharp/intermediate/async-programming.ts',
      'src/lessons/csharp/intermediate/linq.ts'
    ],
    inTheRealWorld: `Popular task management apps like Microsoft To-Do, Todoist, and Asana all use similar patterns. The separation of data (Todo record), operations (TodoManager methods), and persistence (file I/O) is fundamental to clean architecture. In production, you'd add: database persistence (EF Core), REST API endpoints (ASP.NET Core), authentication (Identity), real-time updates (SignalR), and cloud deployment (Azure). C#'s type system helps prevent bugs as these features grow more complex.`
  },
  quiz: [
    {
      question: 'What is the advantage of using records for the Todo type?',
      options: [
        'Records are faster than classes',
        'Records provide immutability, value equality, and concise syntax',
        'Records are required for LINQ',
        'Records automatically save to a database'
      ],
      correctIndex: 1,
      explanation: 'Records provide immutable data types with value-based equality, automatic ToString(), and the "with" expression for non-destructive updates.'
    },
    {
      question: 'Why do we return a new Todo in ToggleTodo instead of modifying the original?',
      options: [
        'C# doesn\'t allow modifying records',
        'It\'s faster to create new objects',
        'Immutability prevents unexpected side effects and works better with state management',
        'The original object is read-only'
      ],
      correctIndex: 2,
      explanation: 'Immutability makes code more predictable and is especially important in concurrent scenarios and state management patterns like Redux.'
    },
    {
      question: 'What does the return type "Todo?" mean?',
      options: [
        'The method always returns a Todo',
        'The method can return either a Todo object or null',
        'The method returns an array',
        'The method throws an exception if not found'
      ],
      correctIndex: 1,
      explanation: 'The ? makes the type nullable, indicating the method can return null (e.g., when a todo is not found) - explicit nullable helps prevent null reference exceptions.'
    },
    {
      question: 'Why use async/await for file operations?',
      options: [
        'Async makes files load faster',
        'It allows the application to remain responsive while waiting for I/O',
        'C# requires async for all file operations',
        'Async automatically handles errors'
      ],
      correctIndex: 1,
      explanation: 'Async I/O releases the thread while waiting, allowing the application to handle other work. This is crucial for server scalability and UI responsiveness.'
    }
  ]
};
