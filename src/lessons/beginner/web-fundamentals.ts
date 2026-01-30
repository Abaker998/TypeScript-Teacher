import { Lesson } from '@/types/lesson';

export const webFundamentals: Lesson = {
  slug: 'web-fundamentals',
  title: 'Web Fundamentals',
  description: 'Understand APIs, JSON, the DOM, and browser events.',
  difficulty: 'beginner',
  order: 7,  // Seventh lesson in curriculum
  content: `
# Web Development Fundamentals

Before diving deep into TypeScript, it helps to understand the core concepts of web development.

## What is an API?

API stands for **Application Programming Interface**. It's a set of rules for how software components communicate.

Think of an API like a restaurant menu:
- The menu tells you what you can order (available operations)
- You don't need to know how the kitchen works (implementation hidden)
- You just make a request and get a response

### Types of APIs

\`\`\`typescript
// Browser APIs - built into the browser
console.log("Console API");           // Logging
Math.random();                         // Math API
localStorage.setItem("key", "value"); // Storage API

// Web APIs - communicate over the internet
fetch("https://api.example.com/users"); // REST API call

// Library APIs - how you use a library
// React's useState, Express's app.get, etc.
\`\`\`

### REST APIs

Most web APIs follow REST patterns:

\`\`\`typescript
// GET - retrieve data
fetch("/api/users")

// POST - create new data
fetch("/api/users", {
  method: "POST",
  body: JSON.stringify({ name: "Alice" })
})

// PUT - update existing data
fetch("/api/users/1", {
  method: "PUT",
  body: JSON.stringify({ name: "Alice Updated" })
})

// DELETE - remove data
fetch("/api/users/1", { method: "DELETE" })
\`\`\`

## What is JSON?

JSON (**JavaScript Object Notation**) is a text format for storing and exchanging data. It looks almost like JavaScript objects:

\`\`\`json
{
  "name": "Alice",
  "age": 28,
  "isStudent": false,
  "courses": ["Math", "Science"],
  "address": {
    "city": "NYC",
    "zip": "10001"
  }
}
\`\`\`

### JSON Rules

- Keys must be in double quotes: \`"name"\` not \`name\`
- Strings use double quotes: \`"hello"\` not \`'hello'\`
- No trailing commas
- No comments
- No functions

### Working with JSON in TypeScript

\`\`\`typescript
// Object to JSON string
let user = { name: "Alice", age: 28 };
let jsonString = JSON.stringify(user);
console.log(jsonString);  // '{"name":"Alice","age":28}'

// JSON string to object
let parsed = JSON.parse(jsonString);
console.log(parsed.name);  // "Alice"

// Pretty print (with indentation)
console.log(JSON.stringify(user, null, 2));
\`\`\`

## What is the DOM?

The **DOM (Document Object Model)** is how JavaScript sees an HTML page. The browser turns HTML into a tree of objects that JavaScript can manipulate.

\`\`\`html
<html>
  <body>
    <h1>Hello</h1>
    <p>World</p>
  </body>
</html>
\`\`\`

Becomes a tree:
\`\`\`
document
  └── html
       └── body
            ├── h1 ("Hello")
            └── p ("World")
\`\`\`

### DOM Methods

\`\`\`typescript
// Find elements
document.getElementById("myId");           // By ID
document.querySelector(".myClass");        // CSS selector (first match)
document.querySelectorAll("p");            // All matches

// Read content
element.textContent;   // Text inside
element.innerHTML;     // HTML inside
element.value;         // For inputs

// Modify content
element.textContent = "New text";
element.innerHTML = "<strong>Bold</strong>";

// Modify styles
element.style.color = "red";
element.style.display = "none";

// Modify classes
element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("dark-mode");
\`\`\`

## What are Events?

Events are things that happen in the browser: clicks, key presses, form submissions, page loads. JavaScript can respond to these events.

### Common Events

\`\`\`typescript
// Mouse events
"click"       // User clicks
"dblclick"    // Double click
"mouseover"   // Mouse enters element
"mouseout"    // Mouse leaves element

// Keyboard events
"keydown"     // Key pressed
"keyup"       // Key released

// Form events
"submit"      // Form submitted
"change"      // Input value changed
"focus"       // Input focused
"blur"        // Input lost focus

// Page events
"load"        // Page finished loading
"scroll"      // User scrolled
\`\`\`

### Adding Event Listeners

\`\`\`typescript
// Method 1: addEventListener (preferred)
button.addEventListener("click", () => {
  console.log("Button clicked!");
});

// Method 2: onclick property
button.onclick = () => {
  console.log("Button clicked!");
};

// With event object
input.addEventListener("keydown", (event) => {
  console.log("Key pressed:", event.key);
});
\`\`\`

### Preventing Default Behavior

\`\`\`typescript
// Stop form from submitting normally
form.addEventListener("submit", (event) => {
  event.preventDefault();
  // Handle submission with JavaScript instead
});

// Stop link from navigating
link.addEventListener("click", (event) => {
  event.preventDefault();
  // Do something else instead
});
\`\`\`

## Putting It Together

Here's how these concepts work together in a real app:

\`\`\`typescript
// 1. User clicks button (Event)
button.addEventListener("click", async () => {

  // 2. Make API request
  let response = await fetch("/api/users/1");

  // 3. Parse JSON response
  let user = await response.json();

  // 4. Update the DOM
  document.getElementById("username").textContent = user.name;
});
\`\`\`

## Learning Objectives

By the end of this lesson, you'll understand:
- What APIs are and how REST APIs work
- How to convert between JSON and JavaScript objects
- How the DOM represents web pages
- How to listen and respond to browser events
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: JSON Parse and Stringify',
      description: `Learn to convert between JavaScript objects and JSON strings.

**Your task:**
1. Convert the \`person\` object to a JSON string using \`JSON.stringify()\`
2. Print the JSON string
3. Convert it back to an object using \`JSON.parse()\`
4. Print the parsed object's name

**Key functions:**
- \`JSON.stringify(obj)\` → converts object to string
- \`JSON.parse(str)\` → converts string to object`,
      starterCode: `// This object is provided for you
let person = {
  name: "Bob",
  age: 30
};

// Convert person to a JSON string and print it


// Parse the JSON string back to an object and print the name

`,
      solution: `let person = {
  name: "Bob",
  age: 30
};

let jsonString = JSON.stringify(person);
console.log(jsonString);

let parsed = JSON.parse(jsonString);
console.log(parsed.name);`,
      expectedOutput: ['{"name":"Bob","age":30}', 'Bob'],
      hints: [
        'JSON.stringify(person) converts the object to a string',
        'The string looks like: {"name":"Bob","age":30}',
        'JSON.parse(jsonString) converts it back to an object',
        'Then access parsed.name like any normal object'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Parsing JSON Arrays',
      description: `JSON can contain arrays of objects - a common API response format.

**Your task:**
1. Parse the JSON string (it contains an array of people)
2. Print the SECOND person's name (remember: arrays start at index 0!)

**Hint:** Index 0 = Alice, Index 1 = Bob, Index 2 = Charlie`,
      starterCode: `// This JSON string is provided for you
let jsonArray = '[{"name":"Alice"},{"name":"Bob"},{"name":"Charlie"}]';

// Parse the JSON string and print the SECOND person's name

`,
      solution: `let jsonArray = '[{"name":"Alice"},{"name":"Bob"},{"name":"Charlie"}]';

let people = JSON.parse(jsonArray);
console.log(people[1].name);`,
      expectedOutput: ['Bob'],
      hints: [
        'JSON.parse works on arrays too, not just objects',
        'people[0] is Alice, people[1] is Bob, people[2] is Charlie',
        'Chain the access: people[1].name',
        'The second person (index 1) is Bob'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Simulating an API Call',
      description: `APIs return data using Promises. Let's simulate one!

**Your task:**
1. Complete the \`fakeApiCall\` function to return a Promise
2. The Promise should resolve with: \`{ id: 1, name: "Alice" }\`
3. Call the function and print the user's name

**Promise syntax:** \`Promise.resolve(value)\` creates a Promise that immediately resolves`,
      starterCode: `// Complete this function - return Promise.resolve() with { id: 1, name: "Alice" }
function fakeApiCall(): Promise<{ id: number; name: string }> {
  // Your code here
}

// Call the function and print the user's name using .then()

`,
      solution: `function fakeApiCall(): Promise<{ id: number; name: string }> {
  return Promise.resolve({
    id: 1,
    name: "Alice"
  });
}

fakeApiCall().then(user => console.log(user.name));`,
      expectedOutput: ['Alice'],
      hints: [
        'Return Promise.resolve({ id: 1, name: "Alice" })',
        'The object inside must match the Promise type',
        '.then(user => ...) receives the resolved value',
        'user.name gives you "Alice"'
      ]
    }
  ],
  buildNote: {
    title: 'Web Fundamentals in Practice',
    explanation: `This app demonstrates all these concepts. The Monaco code editor uses DOM APIs to render the text editor. When you run code, an API-like pattern sends code to be evaluated and returns results as JSON. Event listeners handle button clicks and keyboard shortcuts. Understanding these fundamentals helps you grasp how the entire web works.`,
    relatedFiles: [
      'src/components/CodeEditor.tsx',
      'src/components/OutputPanel.tsx'
    ],
    inTheRealWorld: `Every web application uses these concepts. React abstracts the DOM but still uses it internally. APIs power everything from social media feeds to payment processing. JSON is the universal language of web data exchange. Events drive all user interactions. These aren't just TypeScript concepts—they're the foundation of all web development.`
  }
};
