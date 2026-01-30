import { Lesson } from '@/types/lesson';

export const todoAppCapstone: Lesson = {
  slug: 'capstone-todo-app',
  title: 'Capstone: Build a Todo App',
  description: 'Apply everything you\'ve learned by building a complete Todo application with TypeScript.',
  difficulty: 'advanced',
  order: 29,
  content: `
# Capstone Project: Build a Todo App

Congratulations on making it this far! In this capstone project, you'll apply everything you've learned to build a fully-typed Todo application from scratch.

## What You'll Build

A complete Todo manager that demonstrates:
- **Interfaces** for defining data structures
- **Functions** with proper type annotations
- **Array methods** like map, filter, and find
- **Type guards** for safe operations
- **Async/await** for simulating API calls

## Project Overview

You'll build your Todo app in 6 steps, each focusing on different TypeScript concepts:

| Step | Focus | Concepts Used |
|------|-------|---------------|
| 1 | Define Types | Interfaces, type annotations |
| 2 | Create Functions | Functions, parameters, return types |
| 3 | Array Operations | map, filter, find, generics |
| 4 | Error Handling | Type guards, validation |
| 5 | Async Operations | Promises, async/await |
| 6 | Put It Together | All concepts combined |

## Tips for Success

- **Read carefully**: Each exercise builds on the previous one
- **Use hints**: If stuck, reveal hints one at a time
- **Check types**: Make sure your function signatures are correct
- **Test as you go**: Run your code to verify it works

Let's start building!
`,
  exercises: [
    {
      id: 1,
      title: 'Step 1: Define Types',
      description: `Let's start by defining the types for our Todo application.

**Your task:**
1. Create an interface called \`Todo\` with these properties:
   - \`id\`: number
   - \`title\`: string
   - \`completed\`: boolean
   - \`createdAt\`: Date

2. Create a type alias called \`TodoFilter\` that can be: \`"all"\` | \`"active"\` | \`"completed"\`

3. Create a sample todo and print its title.

**Expected output:** The title of your todo`,
      starterCode: `// Define the Todo interface here


// Define the TodoFilter type alias here


// Create a sample todo
const myTodo = {
  id: 1,
  title: "Learn TypeScript",
  completed: false,
  createdAt: new Date()
};

// Print the todo's title
console.log(myTodo.title);`,
      solution: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

type TodoFilter = "all" | "active" | "completed";

const myTodo: Todo = {
  id: 1,
  title: "Learn TypeScript",
  completed: false,
  createdAt: new Date()
};

console.log(myTodo.title);`,
      expectedOutput: ['Learn TypeScript'],
      hints: [
        'An interface uses the keyword "interface" followed by the name and curly braces',
        'Inside the interface, list each property with its type: propertyName: type;',
        'A type alias uses: type Name = "value1" | "value2";',
        'Add : Todo after myTodo to give it the explicit type'
      ]
    },
    {
      id: 2,
      title: 'Step 2: Create Functions',
      description: `Now let's create the core functions for managing todos.

**Your task:**
1. Create a function \`createTodo\` that:
   - Takes \`title\` (string) and \`id\` (number) as parameters
   - Returns a \`Todo\` object with \`completed: false\` and \`createdAt: new Date()\`

2. Create a function \`toggleTodo\` that:
   - Takes a \`todo\` (Todo) as parameter
   - Returns a new Todo with \`completed\` toggled (true becomes false, false becomes true)

3. Test your functions by creating and toggling a todo.

**Expected output:**
- false (initial completed state)
- true (after toggle)`,
      starterCode: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Create the createTodo function


// Create the toggleTodo function


// Test your functions
const todo = createTodo("Build a todo app", 1);
console.log(todo.completed);

const toggledTodo = toggleTodo(todo);
console.log(toggledTodo.completed);`,
      solution: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

function createTodo(title: string, id: number): Todo {
  return {
    id,
    title,
    completed: false,
    createdAt: new Date()
  };
}

function toggleTodo(todo: Todo): Todo {
  return {
    ...todo,
    completed: !todo.completed
  };
}

const todo = createTodo("Build a todo app", 1);
console.log(todo.completed);

const toggledTodo = toggleTodo(todo);
console.log(toggledTodo.completed);`,
      expectedOutput: ['false', 'true'],
      hints: [
        'Function syntax: function name(param: type): ReturnType { }',
        'Use the spread operator {...todo} to copy all properties',
        'Toggle a boolean with the ! operator: !todo.completed',
        'Remember to specify the return type as : Todo'
      ]
    },
    {
      id: 3,
      title: 'Step 3: Array Operations',
      description: `Let's work with arrays of todos using TypeScript's powerful array methods.

**Your task:**
1. Create a function \`filterTodos\` that:
   - Takes \`todos\` (Todo[]) and \`filter\` (string: "all" | "active" | "completed")
   - Returns filtered todos based on the filter type
   - "all" returns all todos
   - "active" returns todos where completed is false
   - "completed" returns todos where completed is true

2. Create a function \`getTodoTitles\` that:
   - Takes \`todos\` (Todo[])
   - Returns an array of just the titles (string[])

3. Test with the provided todos array.

**Expected output:**
- 2 (number of active todos)
- Array of all titles`,
      starterCode: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

type TodoFilter = "all" | "active" | "completed";

// Create the filterTodos function


// Create the getTodoTitles function


// Test data
const todos: Todo[] = [
  { id: 1, title: "Learn TypeScript", completed: true, createdAt: new Date() },
  { id: 2, title: "Build todo app", completed: false, createdAt: new Date() },
  { id: 3, title: "Write tests", completed: false, createdAt: new Date() }
];

// Test filterTodos
const activeTodos = filterTodos(todos, "active");
console.log(activeTodos.length);

// Test getTodoTitles
const titles = getTodoTitles(todos);
console.log(titles.join(", "));`,
      solution: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

type TodoFilter = "all" | "active" | "completed";

function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case "all":
      return todos;
    case "active":
      return todos.filter(todo => !todo.completed);
    case "completed":
      return todos.filter(todo => todo.completed);
  }
}

function getTodoTitles(todos: Todo[]): string[] {
  return todos.map(todo => todo.title);
}

const todos: Todo[] = [
  { id: 1, title: "Learn TypeScript", completed: true, createdAt: new Date() },
  { id: 2, title: "Build todo app", completed: false, createdAt: new Date() },
  { id: 3, title: "Write tests", completed: false, createdAt: new Date() }
];

const activeTodos = filterTodos(todos, "active");
console.log(activeTodos.length);

const titles = getTodoTitles(todos);
console.log(titles.join(", "));`,
      expectedOutput: ['2', 'Learn TypeScript, Build todo app, Write tests'],
      hints: [
        'Use array.filter() to keep only items matching a condition',
        'Use array.map() to transform each item into something else',
        'A switch statement works well for handling the different filter types',
        'Arrow function syntax: todo => todo.title'
      ]
    },
    {
      id: 4,
      title: 'Step 4: Error Handling',
      description: `Let's add validation and error handling to make our app more robust.

**Your task:**
1. Create a function \`findTodoById\` that:
   - Takes \`todos\` (Todo[]) and \`id\` (number)
   - Returns the Todo if found, or \`undefined\` if not found
   - Return type should be \`Todo | undefined\`

2. Create a function \`validateTodoTitle\` that:
   - Takes \`title\` (string)
   - Returns \`true\` if title is at least 3 characters (after trimming)
   - Returns \`false\` otherwise

3. Create a function \`safeTodoUpdate\` that:
   - Takes \`todos\` (Todo[]), \`id\` (number), and \`newTitle\` (string)
   - Finds the todo by id
   - Validates the new title
   - Returns the updated todo if valid, or \`null\` if todo not found or title invalid

**Expected output:**
- Found todo title
- true/false for validation
- Updated title or "null"`,
      starterCode: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Create findTodoById function


// Create validateTodoTitle function


// Create safeTodoUpdate function


// Test data
const todos: Todo[] = [
  { id: 1, title: "Learn TypeScript", completed: false, createdAt: new Date() },
  { id: 2, title: "Build app", completed: false, createdAt: new Date() }
];

// Test findTodoById
const found = findTodoById(todos, 1);
console.log(found ? found.title : "Not found");

// Test validateTodoTitle
console.log(validateTodoTitle("Hi"));
console.log(validateTodoTitle("Hello World"));

// Test safeTodoUpdate
const updated = safeTodoUpdate(todos, 1, "Master TypeScript");
console.log(updated ? updated.title : "null");

const invalid = safeTodoUpdate(todos, 1, "Hi");
console.log(invalid ? invalid.title : "null");`,
      solution: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

function findTodoById(todos: Todo[], id: number): Todo | undefined {
  return todos.find(todo => todo.id === id);
}

function validateTodoTitle(title: string): boolean {
  return title.trim().length >= 3;
}

function safeTodoUpdate(todos: Todo[], id: number, newTitle: string): Todo | null {
  const todo = findTodoById(todos, id);
  if (!todo) {
    return null;
  }
  if (!validateTodoTitle(newTitle)) {
    return null;
  }
  return { ...todo, title: newTitle };
}

const todos: Todo[] = [
  { id: 1, title: "Learn TypeScript", completed: false, createdAt: new Date() },
  { id: 2, title: "Build app", completed: false, createdAt: new Date() }
];

const found = findTodoById(todos, 1);
console.log(found ? found.title : "Not found");

console.log(validateTodoTitle("Hi"));
console.log(validateTodoTitle("Hello World"));

const updated = safeTodoUpdate(todos, 1, "Master TypeScript");
console.log(updated ? updated.title : "null");

const invalid = safeTodoUpdate(todos, 1, "Hi");
console.log(invalid ? invalid.title : "null");`,
      expectedOutput: ['Learn TypeScript', 'false', 'true', 'Master TypeScript', 'null'],
      hints: [
        'Use array.find() to search for an item - it returns undefined if not found',
        'Return type Todo | undefined means it can return either a Todo or undefined',
        'Use string.trim() to remove whitespace before checking length',
        'Return null early if validation fails (early return pattern)'
      ]
    },
    {
      id: 5,
      title: 'Step 5: Async Operations',
      description: `Let's simulate API calls using Promises and async/await.

**Your task:**
1. Create an async function \`fetchTodos\` that:
   - Returns a Promise<Todo[]>
   - Simulates a network delay with the provided \`delay\` function
   - Returns a hardcoded array of todos

2. Create an async function \`saveTodo\` that:
   - Takes a \`todo\` (Todo) parameter
   - Returns Promise<Todo>
   - Simulates saving with a delay
   - Returns the same todo (as if saved successfully)

3. Create an async function \`main\` that:
   - Fetches todos
   - Prints how many were fetched
   - Saves a new todo
   - Prints the saved todo's title

**Expected output:**
- "Fetched X todos"
- "Saved: [title]"`,
      starterCode: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Helper function to simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create async fetchTodos function


// Create async saveTodo function


// Create async main function and call it


`,
      solution: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchTodos(): Promise<Todo[]> {
  await delay(100);
  return [
    { id: 1, title: "Learn TypeScript", completed: true, createdAt: new Date() },
    { id: 2, title: "Build todo app", completed: false, createdAt: new Date() }
  ];
}

async function saveTodo(todo: Todo): Promise<Todo> {
  await delay(100);
  return todo;
}

async function main(): Promise<void> {
  const todos = await fetchTodos();
  console.log(\`Fetched \${todos.length} todos\`);

  const newTodo: Todo = {
    id: 3,
    title: "Master async/await",
    completed: false,
    createdAt: new Date()
  };

  const saved = await saveTodo(newTodo);
  console.log(\`Saved: \${saved.title}\`);
}

main();`,
      expectedOutput: ['Fetched 2 todos', 'Saved: Master async/await'],
      hints: [
        'async function name(): Promise<ReturnType> { }',
        'Use await before calling other async functions',
        'await delay(100) pauses execution for 100ms',
        'Template literals use backticks: `Fetched ${count} todos`'
      ]
    },
    {
      id: 6,
      title: 'Step 6: Put It Together',
      description: `Now let's combine everything into a complete Todo manager!

**Your task:**
Create a \`TodoManager\` class that:
1. Has a private \`todos\` array property
2. Has a private \`nextId\` counter starting at 1
3. Implements these methods:
   - \`add(title: string): Todo\` - Creates and adds a todo, returns it
   - \`toggle(id: number): Todo | null\` - Toggles completion, returns updated todo or null
   - \`remove(id: number): boolean\` - Removes a todo, returns true if found
   - \`getAll(): Todo[]\` - Returns all todos
   - \`getActive(): Todo[]\` - Returns only incomplete todos

Test your TodoManager with the provided code.

**Expected output:**
- "Added: Learn TypeScript (id: 1)"
- "Added: Build todo app (id: 2)"
- "Total: 2"
- "Toggled: Learn TypeScript is now completed"
- "Active: 1"
- "Removed: true"
- "Total: 1"`,
      starterCode: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Create the TodoManager class here


// Test the TodoManager
const manager = new TodoManager();

const todo1 = manager.add("Learn TypeScript");
console.log(\`Added: \${todo1.title} (id: \${todo1.id})\`);

const todo2 = manager.add("Build todo app");
console.log(\`Added: \${todo2.title} (id: \${todo2.id})\`);

console.log(\`Total: \${manager.getAll().length}\`);

const toggled = manager.toggle(1);
if (toggled) {
  console.log(\`Toggled: \${toggled.title} is now \${toggled.completed ? 'completed' : 'active'}\`);
}

console.log(\`Active: \${manager.getActive().length}\`);

const removed = manager.remove(2);
console.log(\`Removed: \${removed}\`);

console.log(\`Total: \${manager.getAll().length}\`);`,
      solution: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

class TodoManager {
  private todos: Todo[] = [];
  private nextId: number = 1;

  add(title: string): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title,
      completed: false,
      createdAt: new Date()
    };
    this.todos.push(todo);
    return todo;
  }

  toggle(id: number): Todo | null {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      return null;
    }
    todo.completed = !todo.completed;
    return todo;
  }

  remove(id: number): boolean {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      return false;
    }
    this.todos.splice(index, 1);
    return true;
  }

  getAll(): Todo[] {
    return this.todos;
  }

  getActive(): Todo[] {
    return this.todos.filter(t => !t.completed);
  }
}

const manager = new TodoManager();

const todo1 = manager.add("Learn TypeScript");
console.log(\`Added: \${todo1.title} (id: \${todo1.id})\`);

const todo2 = manager.add("Build todo app");
console.log(\`Added: \${todo2.title} (id: \${todo2.id})\`);

console.log(\`Total: \${manager.getAll().length}\`);

const toggled = manager.toggle(1);
if (toggled) {
  console.log(\`Toggled: \${toggled.title} is now \${toggled.completed ? 'completed' : 'active'}\`);
}

console.log(\`Active: \${manager.getActive().length}\`);

const removed = manager.remove(2);
console.log(\`Removed: \${removed}\`);

console.log(\`Total: \${manager.getAll().length}\`);`,
      expectedOutput: [
        'Added: Learn TypeScript (id: 1)',
        'Added: Build todo app (id: 2)',
        'Total: 2',
        'Toggled: Learn TypeScript is now completed',
        'Active: 1',
        'Removed: true',
        'Total: 1'
      ],
      hints: [
        'Class syntax: class Name { private prop: Type = value; }',
        'Methods are functions inside the class without the "function" keyword',
        'this.nextId++ returns the current value then increments',
        'Use array.findIndex() to get the position for removal with splice()'
      ]
    }
  ],
  buildNote: {
    title: 'Real-World Todo Applications',
    explanation: `This capstone project mirrors how real-world applications are built with TypeScript. The TodoManager class is similar to what you'd find in production apps, often called a "store" or "repository" pattern. In frameworks like React, you'd connect this to state management (Redux, Zustand) where actions dispatch changes and the UI re-renders. The interface-first approach (defining Todo before implementation) is called "interface-driven design" and is widely used in enterprise TypeScript projects. The async operations simulate how you'd interact with a real backend API - in production, fetchTodos would make an HTTP request to your server.`,
    relatedFiles: [
      'src/lessons/capstone/todo-app.ts',
      'src/lessons/intermediate/classes.ts',
      'src/lessons/intermediate/async-programming.ts',
      'src/lessons/beginner/interfaces.ts'
    ],
    inTheRealWorld: `Popular todo apps like Todoist, Things, and Microsoft To-Do all use similar patterns. The separation of data (Todo interface), operations (functions/methods), and async handling (API calls) is fundamental to clean architecture. In production, you'd add features like: persistence (localStorage or database), authentication (user-specific todos), optimistic updates (UI changes before server confirms), and offline support (queue operations when disconnected). TypeScript's type system helps prevent bugs as these features grow more complex - catching issues at compile time rather than in production.`
  },
  quiz: [
    {
      question: 'What is the advantage of defining interfaces before implementing functions?',
      options: [
        'It makes the code run faster',
        'It documents the expected data shape and enables better autocomplete',
        'It\'s required by TypeScript',
        'It reduces the file size'
      ],
      correctIndex: 1,
      explanation: 'Interfaces serve as documentation and enable IDE features like autocomplete, making code more maintainable.'
    },
    {
      question: 'Why do we return a new object in toggleTodo instead of modifying the original?',
      options: [
        'TypeScript doesn\'t allow modifying objects',
        'It\'s faster to create new objects',
        'It enables immutability, which prevents unexpected side effects',
        'The original object is read-only'
      ],
      correctIndex: 2,
      explanation: 'Immutability (not changing existing data) makes code more predictable and is especially important with state management in React.'
    },
    {
      question: 'What does the return type `Todo | undefined` mean?',
      options: [
        'The function always returns a Todo',
        'The function can return either a Todo object or undefined',
        'The function returns an array',
        'The function throws an error if not found'
      ],
      correctIndex: 1,
      explanation: 'Union types (|) indicate a value can be one of multiple types. This is useful for functions that might not find what they\'re looking for.'
    },
    {
      question: 'Why use `private` for the todos array in TodoManager?',
      options: [
        'Private makes the code run faster',
        'It prevents external code from directly modifying the array, enforcing use of methods',
        'TypeScript requires all properties to be private',
        'Private properties use less memory'
      ],
      correctIndex: 1,
      explanation: 'Encapsulation (private properties) ensures data can only be modified through controlled methods, preventing bugs from direct array manipulation.'
    }
  ]
};
