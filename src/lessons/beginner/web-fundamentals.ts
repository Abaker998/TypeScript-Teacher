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

## The Big Picture: Web Fundamentals in Real Applications

These concepts power every website and web app you use. Here's how they work in production:

### Social Media Feed
\`\`\`typescript
// Loading a social media feed - API + JSON + DOM
async function loadFeed(): Promise<void> {
  // 1. Call API to get posts
  const response = await fetch("/api/feed?limit=20");
  const posts = await response.json();  // JSON array of posts

  // 2. Update DOM with posts
  const feedContainer = document.getElementById("feed");
  if (!feedContainer) return;

  for (const post of posts) {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = \`
      <div class="post-header">
        <img src="\${post.author.avatar}" alt="\${post.author.name}">
        <span class="author-name">\${post.author.name}</span>
        <span class="post-time">\${formatTimeAgo(post.createdAt)}</span>
      </div>
      <div class="post-content">\${post.content}</div>
      <div class="post-actions">
        <button class="like-btn" data-post-id="\${post.id}">
          Like (\${post.likes})
        </button>
        <button class="comment-btn" data-post-id="\${post.id}">
          Comment (\${post.comments.length})
        </button>
      </div>
    \`;
    feedContainer.appendChild(postElement);
  }
}

// 3. Add event listeners for interactions
document.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("like-btn")) {
    const postId = target.dataset.postId;
    await fetch(\`/api/posts/\${postId}/like\`, { method: "POST" });
    // Update like count in DOM
  }
});
\`\`\`

### E-commerce Product Page
\`\`\`typescript
// Product page with cart functionality
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  variants: { size: string; color: string; inStock: boolean }[];
}

async function loadProductPage(productId: string): Promise<void> {
  // Fetch product data from API
  const response = await fetch(\`/api/products/\${productId}\`);
  const product: Product = await response.json();

  // Update page title
  document.title = \`\${product.name} | Our Store\`;

  // Update product info in DOM
  const nameEl = document.querySelector(".product-name");
  const priceEl = document.querySelector(".product-price");

  if (nameEl) nameEl.textContent = product.name;
  if (priceEl) priceEl.textContent = \`$\${product.price.toFixed(2)}\`;

  // Build variant selector
  const variantSelector = document.querySelector(".variant-selector");
  if (variantSelector) {
    variantSelector.innerHTML = product.variants
      .filter(v => v.inStock)
      .map(v => \`
        <option value="\${v.size}-\${v.color}">
          \${v.size} / \${v.color}
        </option>
      \`)
      .join("");
  }
}

// Add to cart event
document.querySelector(".add-to-cart-btn")?.addEventListener("click", async () => {
  const variant = (document.querySelector(".variant-selector") as HTMLSelectElement)?.value;
  const quantity = parseInt((document.querySelector(".quantity-input") as HTMLInputElement)?.value || "1");

  const response = await fetch("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, variant, quantity })
  });

  if (response.ok) {
    const cart = await response.json();
    updateCartBadge(cart.itemCount);
    showNotification("Added to cart!");
  }
});
\`\`\`

### Real-Time Chat Application
\`\`\`typescript
// Chat app using WebSocket events and DOM updates
const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input") as HTMLInputElement;
const sendButton = document.getElementById("send-btn");

// Connect to WebSocket for real-time messages
const ws = new WebSocket("wss://chat.example.com");

// Listen for incoming messages (WebSocket event)
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);

  // Update DOM with new message
  const messageElement = document.createElement("div");
  messageElement.className = \`message \${message.isOwn ? "own" : "other"}\`;
  messageElement.innerHTML = \`
    <span class="sender">\${message.sender}</span>
    <span class="text">\${message.text}</span>
    <span class="time">\${formatTime(message.timestamp)}</span>
  \`;

  chatMessages?.appendChild(messageElement);
  chatMessages?.scrollTo(0, chatMessages.scrollHeight);
});

// Send message on button click (DOM event)
sendButton?.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text) return;

  // Send via WebSocket
  ws.send(JSON.stringify({
    type: "message",
    text: text
  }));

  messageInput.value = "";
});

// Send on Enter key (keyboard event)
messageInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendButton?.click();
  }
});
\`\`\`

### Search with Autocomplete
\`\`\`typescript
// Search autocomplete - API calls + DOM updates + events
const searchInput = document.getElementById("search") as HTMLInputElement;
const resultsDropdown = document.getElementById("search-results");
let debounceTimer: number;

searchInput?.addEventListener("input", (event) => {
  const query = (event.target as HTMLInputElement).value;

  // Debounce - wait 300ms after typing stops
  clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(async () => {
    if (query.length < 2) {
      resultsDropdown!.innerHTML = "";
      return;
    }

    // Call search API
    const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
    const results = await response.json();

    // Update DOM with results
    resultsDropdown!.innerHTML = results
      .slice(0, 5)
      .map((result: { title: string; url: string }) => \`
        <a href="\${result.url}" class="search-result">
          \${result.title}
        </a>
      \`)
      .join("");
  }, 300);
});

// Close dropdown when clicking outside (document event)
document.addEventListener("click", (event) => {
  if (!(event.target as HTMLElement).closest(".search-container")) {
    resultsDropdown!.innerHTML = "";
  }
});

// Keyboard navigation in results
searchInput?.addEventListener("keydown", (event) => {
  const results = resultsDropdown?.querySelectorAll(".search-result");
  const current = resultsDropdown?.querySelector(".search-result.active");

  if (event.key === "ArrowDown") {
    event.preventDefault();
    // Move focus to next result
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    // Move focus to previous result
  } else if (event.key === "Enter" && current) {
    (current as HTMLAnchorElement).click();
  }
});
\`\`\`

### Form with Validation
\`\`\`typescript
// Registration form with real-time validation
const form = document.getElementById("registration-form") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

// Real-time email validation
emailInput?.addEventListener("blur", async () => {
  const email = emailInput.value;
  const errorEl = document.getElementById("email-error");

  if (!email.includes("@")) {
    errorEl!.textContent = "Please enter a valid email";
    emailInput.classList.add("invalid");
    return;
  }

  // Check if email exists via API
  const response = await fetch(\`/api/check-email?email=\${encodeURIComponent(email)}\`);
  const { exists } = await response.json();

  if (exists) {
    errorEl!.textContent = "This email is already registered";
    emailInput.classList.add("invalid");
  } else {
    errorEl!.textContent = "";
    emailInput.classList.remove("invalid");
  }
});

// Password strength indicator
passwordInput?.addEventListener("input", () => {
  const password = passwordInput.value;
  const strengthEl = document.getElementById("password-strength");

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  strengthEl!.className = \`strength-\${strength}\`;
  strengthEl!.textContent = ["Weak", "Fair", "Good", "Strong"][strength] || "";
});

// Form submission
form?.addEventListener("submit", async (event) => {
  event.preventDefault();  // Prevent default form submission

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (result.success) {
    window.location.href = "/welcome";
  } else {
    showErrors(result.errors);
  }
});
\`\`\`

### Image Gallery with Lazy Loading
\`\`\`typescript
// Lazy load images as they scroll into view
const images = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src!;
      img.classList.add("loaded");
      imageObserver.unobserve(img);
    }
  }
});

images.forEach(img => imageObserver.observe(img));

// Lightbox on image click
document.querySelector(".gallery")?.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.tagName === "IMG") {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = lightbox?.querySelector("img");

    if (lightboxImg && lightbox) {
      lightboxImg.src = (target as HTMLImageElement).src;
      lightbox.classList.add("active");
    }
  }
});

// Close lightbox on click or Escape
document.getElementById("lightbox")?.addEventListener("click", (event) => {
  (event.currentTarget as HTMLElement).classList.remove("active");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.getElementById("lightbox")?.classList.remove("active");
  }
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
      title: 'Exercise 3: Working with Objects',
      description: `Practice accessing nested data from an object - like you would with API responses.

**Your task:**
1. Create a \`user\` object with \`id: 1\` and \`name: "Alice"\`
2. Print the user's id
3. Print the user's name

**This is the same structure you'd get from a real API!**`,
      starterCode: `// Create a user object with id: 1 and name: "Alice"


// Print the user's id


// Print the user's name

`,
      solution: `let user = {
  id: 1,
  name: "Alice"
};

console.log(user.id);
console.log(user.name);`,
      expectedOutput: ['1', 'Alice'],
      hints: [
        'Create an object: let user = { id: 1, name: "Alice" }',
        'Access properties with dot notation: user.id',
        'console.log(user.id) prints the id',
        'console.log(user.name) prints the name'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Transform API Response Data',
      description: `Process JSON data like you would from an API response.

**Scenario:** You received user data from an API. Extract and display formatted information.

**Your task:**
1. Parse the provided JSON string
2. Print "User: [name]" for each user
3. Count and print "Total users: [count]"

**The JSON contains:** Three users with name and email fields.`,
      starterCode: `// API response data (JSON string)
let apiResponse = '[{"name":"Alice","email":"alice@test.com"},{"name":"Bob","email":"bob@test.com"},{"name":"Charlie","email":"charlie@test.com"}]';

// Parse the JSON


// Print "User: [name]" for each user


// Print the total count

`,
      solution: `let apiResponse = '[{"name":"Alice","email":"alice@test.com"},{"name":"Bob","email":"bob@test.com"},{"name":"Charlie","email":"charlie@test.com"}]';

let users = JSON.parse(apiResponse);

for (let user of users) {
  console.log("User: " + user.name);
}

console.log("Total users: " + users.length);`,
      expectedOutput: ['User: Alice', 'User: Bob', 'User: Charlie', 'Total users: 3'],
      hints: [
        'JSON.parse(apiResponse) converts the string to an array',
        'Use for...of to loop through the users array',
        'Each user has a name property: user.name',
        'Use users.length to get the count'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does JSON.stringify() do?',
      options: [
        'Parses a JSON string into an object',
        'Converts an object into a JSON string',
        'Validates if a string is valid JSON',
        'Formats JSON with indentation'
      ],
      correctIndex: 1,
      explanation: 'JSON.stringify() converts a JavaScript object into a JSON string. JSON.parse() does the opposite - converting a string back to an object.'
    },
    {
      question: 'What does "API" stand for?',
      options: [
        'Advanced Programming Interface',
        'Application Programming Interface',
        'Automated Program Interaction',
        'Application Protocol Integration'
      ],
      correctIndex: 1,
      explanation: 'API stands for Application Programming Interface - a set of rules that allow different software applications to communicate with each other.'
    },
    {
      question: 'What does "DOM" stand for?',
      options: [
        'Document Object Model',
        'Data Output Method',
        'Dynamic Object Manager',
        'Document Oriented Markup'
      ],
      correctIndex: 0,
      explanation: 'DOM stands for Document Object Model - a programming interface that represents HTML as a tree of objects that JavaScript can manipulate.'
    },
    {
      question: 'What does event.preventDefault() do?',
      options: [
        'Removes the event listener',
        'Stops the event from bubbling up',
        'Stops the browser\'s default action for that event',
        'Prevents future events from firing'
      ],
      correctIndex: 2,
      explanation: 'preventDefault() stops the browser\'s default behavior, like preventing a form from submitting or a link from navigating. Use stopPropagation() to stop bubbling.'
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
