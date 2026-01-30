'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ContextExample {
  code: string;
  explanation: string;
}

interface Term {
  term: string;
  definition: string;
  example?: string;
  category: string;
  contextExamples: ContextExample[];
  relatedLesson?: string;
}

// Term to lesson mappings - null means "Definition Only" (no relevant lesson)
const termToLesson: Record<string, { slug: string; title: string } | null> = {
  // ===== BASICS =====
  'Variable': { slug: 'variables-and-types', title: 'Variables & Types' },
  'Constant': { slug: 'variables-and-types', title: 'Variables & Types' },
  'String': { slug: 'variables-and-types', title: 'Variables & Types' },
  'Number': { slug: 'variables-and-types', title: 'Variables & Types' },
  'Boolean': { slug: 'variables-and-types', title: 'Variables & Types' },
  'Null': { slug: 'variables-and-types', title: 'Variables & Types' },
  'Undefined': { slug: 'variables-and-types', title: 'Variables & Types' },

  // ===== TYPES =====
  'Array': { slug: 'arrays-and-objects', title: 'Arrays & Objects' },
  'Object': { slug: 'arrays-and-objects', title: 'Arrays & Objects' },
  'Tuple': { slug: 'arrays-and-objects', title: 'Arrays & Objects' },

  // ===== OPERATORS =====
  'Spread Operator': { slug: 'arrays-and-objects', title: 'Arrays & Objects' },
  'Destructuring': { slug: 'arrays-and-objects', title: 'Arrays & Objects' },
  'Ternary Operator': { slug: 'control-flow', title: 'Control Flow' },
  'Optional Chaining': { slug: 'modern-operators', title: 'Modern Operators' },
  'Nullish Coalescing': { slug: 'modern-operators', title: 'Modern Operators' },

  // ===== FUNCTIONS =====
  'Function': { slug: 'functions', title: 'Functions' },
  'Parameter': { slug: 'functions', title: 'Functions' },
  'Return': { slug: 'functions', title: 'Functions' },
  'Arrow Function': { slug: 'functions', title: 'Functions' },
  'Default Parameters': { slug: 'functions', title: 'Functions' },
  'Callback': { slug: 'functional-programming', title: 'Functional Programming' },
  'Closure': { slug: 'functional-programming', title: 'Functional Programming' },
  'Higher-Order Function': { slug: 'functional-programming', title: 'Functional Programming' },
  'Pure Function': { slug: 'functional-programming', title: 'Functional Programming' },
  'Recursion': { slug: 'functional-programming', title: 'Functional Programming' },

  // ===== CONTROL FLOW =====
  'If/Else': { slug: 'control-flow', title: 'Control Flow' },
  'Switch': { slug: 'control-flow', title: 'Control Flow' },
  'For Loop': { slug: 'control-flow', title: 'Control Flow' },
  'For...of Loop': { slug: 'control-flow', title: 'Control Flow' },
  'While Loop': { slug: 'control-flow', title: 'Control Flow' },
  'Break': { slug: 'control-flow', title: 'Control Flow' },
  'Continue': { slug: 'control-flow', title: 'Control Flow' },
  'Try/Catch': { slug: 'error-handling', title: 'Error Handling' },

  // ===== OBJECTS & OOP =====
  'Property': { slug: 'arrays-and-objects', title: 'Arrays & Objects' },
  'Method': { slug: 'classes', title: 'Classes & OOP' },
  'This': { slug: 'classes', title: 'Classes & OOP' },
  'Class': { slug: 'classes', title: 'Classes & OOP' },
  'Constructor': { slug: 'classes', title: 'Classes & OOP' },
  'Instance': { slug: 'classes', title: 'Classes & OOP' },
  'Inheritance': { slug: 'classes', title: 'Classes & OOP' },
  'Static': { slug: 'classes', title: 'Classes & OOP' },
  'Getter': { slug: 'classes', title: 'Classes & OOP' },
  'Setter': { slug: 'classes', title: 'Classes & OOP' },

  // ===== TYPESCRIPT SPECIFIC =====
  'Type Annotation': { slug: 'variables-and-types', title: 'Variables & Types' },
  'Type Inference': { slug: 'type-inference', title: 'Type Inference' },
  'Interface': { slug: 'interfaces', title: 'Interfaces' },
  'Type Alias': { slug: 'type-aliases', title: 'Type Aliases' },
  'Union Type': { slug: 'union-and-literal-types', title: 'Union & Literal Types' },
  'Literal Type': { slug: 'union-and-literal-types', title: 'Union & Literal Types' },
  'Generic': { slug: 'generics', title: 'Generics' },
  'Type Guard': { slug: 'type-guards', title: 'Type Guards' },
  'Optional Property': { slug: 'interfaces', title: 'Interfaces' },
  'Readonly': { slug: 'utility-types', title: 'Utility Types' },
  'Any Type': { slug: 'variables-and-types', title: 'Variables & Types' },
  'Void': { slug: 'functions', title: 'Functions' },
  'Never Type': { slug: 'advanced-patterns', title: 'Advanced Patterns' },

  // ===== ASYNC =====
  'Promise': { slug: 'async-programming', title: 'Async Programming' },
  'Async/Await': { slug: 'async-programming', title: 'Async Programming' },
  'Asynchronous': { slug: 'async-programming', title: 'Async Programming' },

  // ===== MODULES =====
  'Import': { slug: 'enums-and-modules', title: 'Enums & Modules' },
  'Export': { slug: 'enums-and-modules', title: 'Enums & Modules' },
  'Module': { slug: 'enums-and-modules', title: 'Enums & Modules' },

  // ===== MISC =====
  'API': { slug: 'web-fundamentals', title: 'Web Fundamentals' },
  'JSON': { slug: 'web-fundamentals', title: 'Web Fundamentals' },
  'DOM': { slug: 'web-fundamentals', title: 'Web Fundamentals' },
  'Event': { slug: 'web-fundamentals', title: 'Web Fundamentals' },
  'Debugging': { slug: 'developer-tooling', title: 'Developer Tooling' },
  'Runtime': { slug: 'developer-tooling', title: 'Developer Tooling' },
  'Compile Time': { slug: 'developer-tooling', title: 'Developer Tooling' },
  'Linting': { slug: 'developer-tooling', title: 'Developer Tooling' },
  'Transpiling': { slug: 'developer-tooling', title: 'Developer Tooling' },
};

const glossaryTerms: Term[] = [
  // ===== BASICS =====
  {
    term: 'Variable',
    definition: 'A container that stores a value. Think of it like a labeled box where you can put something and retrieve it later using the label.',
    example: 'let age = 25;',
    category: 'basics',
    contextExamples: [
      {
        code: `let userName = "Alice";
let userAge = 28;
let isLoggedIn = true;

console.log(userName);
console.log(userAge);
console.log(isLoggedIn);`,
        explanation: 'We create three variables storing different types of data. Each variable acts like a labeled container. We then print each value.',
      },
      {
        code: `// Variables can change (when using let)
let score = 0;
console.log("Starting score:", score);

score = 10;
console.log("After bonus:", score);

score = score + 5;
console.log("Final score:", score);`,
        explanation: 'Variables declared with "let" can be updated. We start with 0, change to 10, then add 5. The variable forgets old values and keeps the new one.',
      },
      {
        code: `// Naming variables clearly
let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName;

console.log("Full name:", fullName);

// Bad names (avoid these):
// let x = "John";  // unclear
// let fn = "John"; // too short`,
        explanation: 'Good variable names describe what they hold. Use camelCase (firstName not first_name). Clear names make code easier to understand.',
      },
    ],
  },
  {
    term: 'Constant',
    definition: "A variable that cannot be changed after it's set. Once you put something in, it stays that way forever.",
    example: 'const PI = 3.14159;',
    category: 'basics',
    contextExamples: [
      {
        code: `const TAX_RATE = 0.08;
const APP_NAME = "TypeScript Teacher";

let price = 50;
let tax = price * TAX_RATE;

console.log(APP_NAME);
console.log("Tax: $" + tax);`,
        explanation: 'Constants are perfect for values that should never change. TAX_RATE stays 0.08 throughout the program.',
      },
      {
        code: `// Constants for configuration
const MAX_USERS = 100;
const API_URL = "https://api.example.com";
const DEBUG_MODE = false;

console.log("Max users:", MAX_USERS);
console.log("API:", API_URL);
console.log("Debug:", DEBUG_MODE);`,
        explanation: 'Use constants for configuration values. UPPER_SNAKE_CASE is the convention for constants that are truly fixed values.',
      },
      {
        code: `// const with objects - the reference is constant, not the contents!
const user = { name: "Alice", age: 25 };

user.age = 26;  // This works! We're changing a property
console.log(user.age);

// user = { name: "Bob" };  // This would ERROR - can't reassign the variable

console.log(user.name);`,
        explanation: 'With objects, const prevents reassigning the variable, but you can still modify properties inside. The reference is constant, not the contents.',
      },
    ],
  },
  {
    term: 'Expression',
    definition: 'Any piece of code that produces a value. It could be a simple number, a calculation, or a function call.',
    example: '5 + 3, myFunction(), x > 10',
    category: 'basics',
    contextExamples: [
      {
        code: `// These are all expressions - they produce values
let a = 5 + 3;          // 8
let b = Math.max(10, 5); // 10
let c = "Hello".length;  // 5
let d = true && false;   // false

console.log(a, b, c, d);`,
        explanation: 'Each expression evaluates to a value. 5+3 becomes 8, Math.max picks the larger number, .length counts characters, && combines booleans.',
      },
      {
        code: `// Expressions can be used anywhere a value is expected
let age = 25;

// Expression in console.log
console.log(age > 18 ? "Adult" : "Minor");

// Expression in array
let nums = [1 + 1, 2 + 2, 3 + 3];
console.log(nums);

// Expression as function argument
console.log(Math.sqrt(16));`,
        explanation: 'Expressions can appear wherever a value is needed: in assignments, function arguments, array elements, or template literals.',
      },
      {
        code: `// Combining expressions
let x = 5;
let y = 10;

// Complex expression
let result = (x + y) * 2 > 25 && x !== 0;
console.log(result);

// Expression in template literal
console.log(\`Sum: \${x + y}, Product: \${x * y}\`);`,
        explanation: 'Expressions can be nested and combined. Each part evaluates to a value, and those values combine into the final result.',
      },
    ],
  },
  {
    term: 'Statement',
    definition: 'A complete instruction that tells the computer to do something. Statements perform actions.',
    example: 'if (x > 5) { doSomething(); }',
    category: 'basics',
    contextExamples: [
      {
        code: `// Statements are instructions
let x = 10;              // declaration statement
x = x + 5;               // assignment statement
console.log(x);          // expression statement

if (x > 10) {            // if statement
  console.log("Big!");
}`,
        explanation: 'Statements tell the computer what to do. Unlike expressions which produce values, statements perform actions like declaring variables or making decisions.',
      },
      {
        code: `// Different types of statements
for (let i = 0; i < 3; i++) {  // for statement
  console.log(i);
}

function greet() {              // function declaration statement
  return "Hello";
}

console.log(greet());`,
        explanation: 'Statements include loops (for, while), conditionals (if, switch), function declarations, and more. Each performs a specific action.',
      },
      {
        code: `// Statements vs expressions
let a = 5;       // This is a statement
let b = (a = 10); // a = 10 is an expression (returns 10)

console.log(a);  // 10
console.log(b);  // 10

// if is a statement, not an expression
// let c = if (true) { 5 };  // ERROR! Can't do this`,
        explanation: 'Assignment (=) is actually an expression that returns a value, but declaration (let a = 5) is a statement. if/for/while are statements, not expressions.',
      },
    ],
  },
  {
    term: 'Declaration',
    definition: 'Creating a new variable, function, or other identifier. Telling the computer "this thing exists."',
    example: 'let myVariable;',
    category: 'basics',
    contextExamples: [
      {
        code: `// Variable declarations
let name;           // declared but undefined
let age = 25;       // declared and initialized

// Function declaration
function greet() {
  console.log("Hello!");
}

name = "Alice";     // now assigned
console.log(name, age);
greet();`,
        explanation: 'Declaration creates the variable or function. You can declare without a value (undefined) or declare and initialize at once.',
      },
      {
        code: `// Different ways to declare
let changeable = 1;      // can be reassigned
const fixed = 2;         // cannot be reassigned
var oldStyle = 3;        // avoid - old way

// TypeScript type declarations
let score: number = 100;
let username: string;
username = "Bob";

console.log(score, username);`,
        explanation: 'Use let for variables that change, const for constants. TypeScript adds type declarations for extra safety.',
      },
      {
        code: `// Declarations must come before use
console.log(message);  // Error! Used before declaration

let message = "Hello";

// Function declarations are "hoisted"
sayHi();  // This works!

function sayHi() {
  console.log("Hi!");
}`,
        explanation: 'Variables must be declared before use. Function declarations are special - they\'re "hoisted" and can be called before they appear in code.',
      },
    ],
  },
  {
    term: 'Assignment',
    definition: 'Giving a value to a variable using the = sign. Putting something into the container.',
    example: 'myVariable = 42;',
    category: 'basics',
    contextExamples: [
      {
        code: `let score;          // declaration (no value yet)
score = 0;          // assignment
console.log(score);

score = 100;        // reassignment
console.log(score);

score = score + 50; // using current value
console.log(score);`,
        explanation: 'Assignment uses = to store a value. You can assign when declaring, reassign later, or even use the current value to calculate a new one.',
      },
      {
        code: `// Compound assignment operators
let x = 10;

x += 5;   // same as x = x + 5
console.log(x);  // 15

x -= 3;   // same as x = x - 3
console.log(x);  // 12

x *= 2;   // same as x = x * 2
console.log(x);  // 24`,
        explanation: 'Compound operators (+=, -=, *=, /=) combine arithmetic with assignment. They\'re shortcuts for common operations.',
      },
      {
        code: `// Destructuring assignment
let [a, b] = [1, 2];
console.log(a, b);  // 1 2

let { name, age } = { name: "Alice", age: 25 };
console.log(name, age);  // Alice 25

// Swapping with destructuring
[a, b] = [b, a];
console.log(a, b);  // 2 1`,
        explanation: 'Destructuring assignment extracts values from arrays or objects into separate variables. It\'s a powerful pattern for unpacking data.',
      },
    ],
  },
  {
    term: 'Identifier',
    definition: 'The name you give to a variable, function, or other element. Must start with a letter, underscore, or dollar sign.',
    example: 'myVariable, _private, $element',
    category: 'basics',
    contextExamples: [
      {
        code: `// Valid identifiers
let userName = "Alice";
let _privateData = "secret";
let $price = 29.99;
let camelCaseExample = true;

// Convention: camelCase for variables
let firstName = "John";
let lastName = "Doe";

console.log(firstName, lastName);`,
        explanation: 'Identifiers are names we choose. They cannot start with numbers or contain spaces. camelCase is the standard convention in JavaScript/TypeScript.',
      },
      {
        code: `// Invalid identifiers (would cause errors)
// let 2fast = "no";     // can't start with number
// let my-var = "no";    // no hyphens allowed
// let my var = "no";    // no spaces allowed
// let class = "no";     // can't use keywords

// Valid alternatives
let twoFast = "yes";
let myVar = "yes";
let myClass = "yes";

console.log(twoFast, myVar, myClass);`,
        explanation: 'Identifiers have rules: start with letter/underscore/$, no hyphens or spaces, no reserved keywords. Choose clear, descriptive names.',
      },
      {
        code: `// Naming conventions
let userName = "Alice";         // camelCase for variables
const MAX_SIZE = 100;           // UPPER_SNAKE_CASE for constants
function getUserById() {}       // camelCase for functions
class UserAccount {}            // PascalCase for classes
interface UserData {}           // PascalCase for interfaces/types

console.log(userName, MAX_SIZE);`,
        explanation: 'Different naming conventions help identify what something is. Follow these conventions to write readable, professional code.',
      },
    ],
  },
  {
    term: 'Keyword',
    definition: 'A reserved word that has special meaning in the language. You cannot use keywords as variable names.',
    example: 'let, const, if, function, return',
    category: 'basics',
    contextExamples: [
      {
        code: `// Keywords have special meanings
let myVar = 5;        // 'let' declares a variable
const PI = 3.14;      // 'const' declares a constant

if (myVar > 3) {      // 'if' starts a condition
  console.log("Yes");
}

function add(a, b) {  // 'function' declares a function
  return a + b;       // 'return' sends back a value
}

console.log(add(2, 3));`,
        explanation: 'Keywords like let, const, if, function, and return are built into the language. They trigger specific behaviors.',
      },
      {
        code: `// Loop keywords
for (let i = 0; i < 3; i++) {
  if (i === 1) continue;  // skip this iteration
  console.log(i);
}

let j = 0;
while (j < 2) {
  console.log("while:", j);
  j++;
  if (j === 2) break;  // exit the loop
}`,
        explanation: 'Loop keywords: for, while create loops. continue skips to next iteration. break exits the loop entirely.',
      },
      {
        code: `// TypeScript-specific keywords
type ID = string | number;      // 'type' creates a type alias
interface User { name: string } // 'interface' defines a shape

class Animal {                  // 'class' defines a class
  private name: string;         // 'private' hides a property
  constructor(name: string) {   // 'constructor' initializes
    this.name = name;
  }
}

console.log(typeof "hello");    // 'typeof' gets the type`,
        explanation: 'TypeScript adds keywords like type, interface, private, public. These help define types and control access to class members.',
      },
    ],
  },
  {
    term: 'Block',
    definition: 'Code grouped together inside curly braces {}. Creates a scope for variables.',
    example: '{ let x = 5; console.log(x); }',
    category: 'basics',
    contextExamples: [
      {
        code: `// Blocks group code together
if (true) {
  let blockVar = "I'm inside";
  console.log(blockVar);
}

// blockVar doesn't exist out here

for (let i = 0; i < 3; i++) {
  console.log("Loop:", i);
}`,
        explanation: 'Curly braces {} create blocks. Variables declared inside a block (with let/const) only exist inside that block.',
      },
      {
        code: `// Block scope with let vs var
{
  let blockScoped = "only here";
  var functionScoped = "everywhere";
}

// console.log(blockScoped);  // Error! Not accessible
console.log(functionScoped);   // Works (var ignores blocks)

// This is why we prefer let over var
let x = 1;
{
  let x = 2;  // Different x, only in this block
  console.log("Inside:", x);
}
console.log("Outside:", x);`,
        explanation: 'let respects block scope, var does not. This is why modern code uses let/const instead of var.',
      },
      {
        code: `// Blocks in control structures
let score = 85;

if (score >= 70) {
  let grade = "Pass";
  let message = "Congratulations!";
  console.log(grade, message);
}
// grade and message don't exist here

// Each loop iteration gets its own block
for (let i = 0; i < 3; i++) {
  let squared = i * i;
  console.log(i, "squared is", squared);
}`,
        explanation: 'Every if, for, while creates a block. Variables declared inside are private to that block.',
      },
    ],
  },
  {
    term: 'Scope',
    definition: 'The area of code where a variable exists and can be accessed. Variables have different levels of visibility.',
    example: 'Global scope, function scope, block scope',
    category: 'basics',
    contextExamples: [
      {
        code: `let globalVar = "Everywhere"; // global scope

function myFunction() {
  let functionVar = "In function"; // function scope

  if (true) {
    let blockVar = "In block"; // block scope
    console.log(globalVar);    // accessible
    console.log(functionVar);  // accessible
    console.log(blockVar);     // accessible
  }
  // blockVar not accessible here
}

myFunction();`,
        explanation: 'Scope controls where variables can be used. Inner scopes can access outer variables, but not vice versa.',
      },
      {
        code: `// Scope chain - looking up variables
let color = "red";

function outer() {
  let color = "blue";

  function inner() {
    let color = "green";
    console.log(color);  // green (found locally)
  }

  inner();
  console.log(color);    // blue (outer's variable)
}

outer();
console.log(color);      // red (global)`,
        explanation: 'JavaScript looks for variables in the current scope first, then moves outward through parent scopes until found.',
      },
      {
        code: `// Common scope mistake
for (var i = 0; i < 3; i++) {
  // var is function-scoped, not block-scoped
}
console.log("After loop, i is:", i);  // 3 (leaked!)

// Fix with let
for (let j = 0; j < 3; j++) {
  // j is block-scoped
}
// console.log(j);  // Error! j doesn't exist here

console.log("let prevents scope leaks");`,
        explanation: 'var leaks out of loops because it\'s function-scoped. let is block-scoped and stays contained.',
      },
    ],
  },
  {
    term: 'Console',
    definition: "A tool that displays messages from your code. Used for testing and debugging. Like a window where your program can talk to you.",
    example: 'console.log("Hello");',
    category: 'basics',
    contextExamples: [
      {
        code: `console.log("Regular message");
console.log("Multiple", "values", 123);

let user = { name: "Alice", age: 28 };
console.log("User:", user);

// Useful for debugging
let x = 5;
console.log("x is:", x);`,
        explanation: 'console.log() prints messages to help you see what your code is doing. Essential for debugging.',
      },
      {
        code: `// Different console methods
console.log("Normal log");
console.warn("Warning message");  // Yellow in browser
console.error("Error message");   // Red in browser

// Formatted output
let items = [
  { name: "Apple", price: 1.20 },
  { name: "Banana", price: 0.50 }
];
console.table(items);  // Shows as a table

// Timing code
console.time("loop");
for (let i = 0; i < 1000; i++) {}
console.timeEnd("loop");  // Shows elapsed time`,
        explanation: 'Console has methods beyond log: warn for warnings, error for errors, table for data, time/timeEnd for measuring.',
      },
      {
        code: `// Grouping related logs
console.group("User Details");
console.log("Name: Alice");
console.log("Age: 28");
console.log("Role: Admin");
console.groupEnd();

// Conditional logging
let debugMode = true;
if (debugMode) {
  console.log("Debug: Starting process...");
}

// Counting occurrences
console.count("Click");  // Click: 1
console.count("Click");  // Click: 2
console.count("Click");  // Click: 3`,
        explanation: 'Use console.group for organized output, count for tracking occurrences, and conditional logging for debug mode.',
      },
    ],
  },
  {
    term: 'Comment',
    definition: 'Notes in your code that the computer ignores. Used to explain what code does.',
    example: '// This is a comment',
    category: 'basics',
    contextExamples: [
      {
        code: `// Single line comment

/*
  Multi-line comment
  for longer explanations
*/

let price = 29.99; // inline comment
let taxRate = 0.08; // 8% sales tax

// TODO: Add discount logic later
console.log(price * (1 + taxRate));`,
        explanation: 'Comments help humans understand code. Use // for single lines, /* */ for multiple lines.',
      },
      {
        code: `// Comments explain WHY, not WHAT
// Bad: Increment i by 1
// Good: Move to next customer in queue
let i = 0;
i++;

// Document complex logic
function calculateDiscount(price: number, member: boolean) {
  // Members get 20% off, but max discount is $50
  // to prevent abuse on high-value items
  let discount = member ? price * 0.2 : 0;
  return Math.min(discount, 50);
}

console.log(calculateDiscount(100, true));`,
        explanation: 'Good comments explain reasoning and intent, not obvious code. They answer "why" rather than "what".',
      },
      {
        code: `// Temporarily disable code
function processOrder(order: any) {
  console.log("Processing:", order);

  // Temporarily disabled for testing
  // sendEmailConfirmation(order);
  // updateInventory(order);

  console.log("Order processed");
}

// Documentation comments (JSDoc style)
/**
 * Calculates the area of a rectangle
 * @param width - The width in pixels
 * @param height - The height in pixels
 * @returns The area in square pixels
 */
function area(width: number, height: number) {
  return width * height;
}

processOrder({ id: 1 });
console.log(area(5, 3));`,
        explanation: 'Comments can disable code temporarily. JSDoc comments document functions for editors and documentation tools.',
      },
    ],
  },
  {
    term: 'Semicolon',
    definition: 'The ; character that ends a statement. Optional in JavaScript but recommended for clarity.',
    example: 'let x = 5;',
    category: 'basics',
    contextExamples: [
      {
        code: `// Semicolons end statements
let name = "Alice";
let age = 25;
console.log(name);

// JavaScript adds them automatically
// but being explicit is clearer
let a = 1
let b = 2
console.log(a + b)`,
        explanation: 'Semicolons mark the end of statements. JavaScript can infer them, but using them explicitly prevents surprises.',
      },
      {
        code: `// Multiple statements on one line
let x = 1; let y = 2; let z = 3;
console.log(x, y, z);

// Semicolons in for loops are required
for (let i = 0; i < 3; i++) {
  console.log(i);
}

// Object properties don't use semicolons
let user = {
  name: "Alice",  // comma, not semicolon
  age: 25         // no punctuation on last
};
console.log(user);`,
        explanation: 'For loops require semicolons. Object properties use commas. Multiple statements on one line need semicolons.',
      },
      {
        code: `// When missing semicolons cause problems
let getValue = function() { return 1 }
// Without semicolon, next line could be misinterpreted

// Safe patterns - always add semicolons before
// lines starting with ( [ or \`
let arr = [1, 2, 3];
[1, 2].forEach(n => console.log(n));

// Most style guides recommend always using semicolons
// for consistency and to avoid subtle bugs
console.log("Be consistent with semicolons!");`,
        explanation: 'Some edge cases require semicolons. Most teams choose always or never - consistency matters most.',
      },
    ],
  },

  // ===== DATA TYPES =====
  {
    term: 'String',
    definition: 'Text data. Any characters wrapped in quotes. Called "string" because it\'s a string of characters.',
    example: '"Hello", \'World\'',
    category: 'types',
    contextExamples: [
      {
        code: `let greeting = "Hello";
let name = 'TypeScript';
let message = greeting + ", " + name;

console.log(message);
console.log(message.length);
console.log(message.toUpperCase());`,
        explanation: 'Strings are text in quotes. Combine with +, get length with .length, transform with methods like .toUpperCase().',
      },
      {
        code: `// Template literals (backticks)
let product = "Coffee";
let price = 4.50;
let quantity = 2;

let receipt = \`You ordered \${quantity} \${product}(s)
Total: $\${price * quantity}\`;

console.log(receipt);`,
        explanation: 'Template literals use backticks (\`) and ${} for variables. Cleaner than + for building strings. Supports multiple lines.',
      },
      {
        code: `// Common string methods
let text = "  Hello, World!  ";

console.log(text.trim());         // Remove whitespace
console.log(text.toLowerCase());  // lowercase
console.log(text.includes("World")); // true
console.log(text.replace("World", "TypeScript"));
console.log(text.split(", "));    // ["  Hello", "World!  "]`,
        explanation: 'Strings have many useful methods. trim() removes spaces, includes() checks content, replace() swaps text, split() creates an array.',
      },
    ],
  },
  {
    term: 'Number',
    definition: "Numeric data. Can be whole numbers or decimals. JavaScript doesn't distinguish between them.",
    example: '42, 3.14, -7',
    category: 'types',
    contextExamples: [
      {
        code: `let whole = 42;
let decimal = 3.14;
let negative = -7;

console.log(whole + decimal);
console.log(whole * 2);
console.log(10 / 3);
console.log(10 % 3); // remainder`,
        explanation: 'Numbers support math operations: + - * / and % (remainder). Both integers and decimals are the same "number" type.',
      },
      {
        code: `// Math object for advanced operations
console.log(Math.round(4.7));   // 5
console.log(Math.floor(4.7));   // 4 (round down)
console.log(Math.ceil(4.2));    // 5 (round up)
console.log(Math.abs(-5));      // 5 (absolute value)
console.log(Math.max(1, 5, 3)); // 5
console.log(Math.min(1, 5, 3)); // 1
console.log(Math.random());     // 0 to 0.999...
console.log(Math.pow(2, 3));    // 8 (2³)`,
        explanation: 'The Math object provides advanced operations like rounding, absolute value, min/max, random numbers, and powers.',
      },
      {
        code: `// Number formatting
let price = 29.995;
console.log(price.toFixed(2));  // "29.99" (2 decimals)

let big = 1234567;
console.log(big.toLocaleString()); // "1,234,567"

// Parsing strings to numbers
let strNum = "42";
console.log(parseInt(strNum));     // 42
console.log(parseFloat("3.14"));   // 3.14
console.log(Number("99"));         // 99

// Check if valid number
console.log(Number.isInteger(5));     // true
console.log(Number.isFinite(1/0));    // false`,
        explanation: 'Format numbers with toFixed and toLocaleString. Parse strings with parseInt, parseFloat, or Number().',
      },
    ],
  },
  {
    term: 'Boolean',
    definition: 'A true or false value. Used for yes/no decisions in code.',
    example: 'true, false',
    category: 'types',
    contextExamples: [
      {
        code: `let isLoggedIn = true;
let hasPermission = false;
let isAdult = 20 >= 18; // true

console.log("Logged in:", isLoggedIn);
console.log("Is adult:", isAdult);

if (isLoggedIn && isAdult) {
  console.log("Full access");
}`,
        explanation: 'Booleans are true or false. Created directly or from comparisons. Used with && (and), || (or) for decisions.',
      },
      {
        code: `// Truthy and falsy values
// These are "falsy" (treated as false):
console.log(Boolean(false));     // false
console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false

// Everything else is "truthy"
console.log(Boolean("hello"));   // true
console.log(Boolean(42));        // true
console.log(Boolean([]));        // true (empty array!)
console.log(Boolean({}));        // true (empty object!)`,
        explanation: 'JavaScript treats some values as false-ish (falsy) in conditions. Be careful: empty arrays and objects are truthy!',
      },
      {
        code: `// Boolean in conditionals
let username = "Alice";
let items: string[] = [];

// Truthy check
if (username) {
  console.log("Has username");
}

// Common pattern: check array has items
if (items.length) {
  console.log("Has items");
} else {
  console.log("Empty cart");
}

// Toggle boolean
let isVisible = true;
isVisible = !isVisible;  // now false
console.log("Visible:", isVisible);`,
        explanation: 'Use truthy checks for quick validation. Toggle booleans with ! operator. Check array.length for emptiness.',
      },
    ],
  },
  {
    term: 'Array',
    definition: 'A list of values stored in order. Access items by their position (index) starting from 0.',
    example: '[1, 2, 3]',
    category: 'types',
    contextExamples: [
      {
        code: `let fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]);  // first
console.log(fruits[2]);  // third
console.log(fruits.length);

fruits.push("date");
console.log(fruits);`,
        explanation: 'Arrays store lists. Access by index (0-based), get count with .length, add items with .push().',
      },
      {
        code: `// Looping through an array
let colors = ["red", "green", "blue"];

for (let color of colors) {
  console.log("Color:", color);
}

// With index
colors.forEach((color, index) => {
  console.log(index + ": " + color);
});`,
        explanation: 'Use for...of to loop through values. forEach gives you both the item and its index. Both are common patterns.',
      },
      {
        code: `// Array methods that create new arrays
let numbers = [1, 2, 3, 4, 5];

let doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

let evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

let sum = numbers.reduce((total, n) => total + n, 0);
console.log("Sum:", sum);`,
        explanation: 'map() transforms each element, filter() keeps matching elements, reduce() combines all elements into one value. These don\'t change the original array.',
      },
    ],
  },
  {
    term: 'Object',
    definition: 'A collection of related data stored as key-value pairs. Like a form with labeled fields.',
    example: '{ name: "Alice", age: 25 }',
    category: 'types',
    contextExamples: [
      {
        code: `let user = {
  name: "Alice",
  age: 28,
  isActive: true
};

console.log(user.name);
console.log(user.age);

user.age = 29;
console.log("Updated:", user.age);`,
        explanation: 'Objects group related data with labels (keys). Access with dot notation: object.property.',
      },
      {
        code: `// Objects with methods
let calculator = {
  value: 0,

  add(n: number) {
    this.value += n;
    return this;
  },

  subtract(n: number) {
    this.value -= n;
    return this;
  },

  show() {
    console.log("Value:", this.value);
  }
};

calculator.add(10).subtract(3).show();`,
        explanation: 'Objects can have methods (functions). "this" refers to the object itself. Returning "this" allows method chaining.',
      },
      {
        code: `// Nested objects
let company = {
  name: "TechCorp",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    zip: "94102"
  },
  employees: [
    { name: "Alice", role: "Engineer" },
    { name: "Bob", role: "Designer" }
  ]
};

console.log(company.address.city);
console.log(company.employees[0].name);`,
        explanation: 'Objects can contain other objects and arrays. Access nested properties with multiple dots: company.address.city.',
      },
    ],
  },
  {
    term: 'Null',
    definition: 'An intentional absence of value. Means "nothing" or "empty" on purpose.',
    example: 'let empty = null;',
    category: 'types',
    contextExamples: [
      {
        code: `let user = null; // intentionally empty

console.log("User:", user);

// Later, we assign a value
user = { name: "Alice" };
console.log("User now:", user);

// Check if null
if (user === null) {
  console.log("No user");
} else {
  console.log("Has user");
}`,
        explanation: 'Null means "deliberately nothing." Use it to indicate an empty or unknown value that will be filled later.',
      },
      {
        code: `// Null in function returns
function findUser(id: number): { name: string } | null {
  let users = [{ id: 1, name: "Alice" }];
  let found = users.find(u => u.id === id);
  return found ? { name: found.name } : null;
}

let user1 = findUser(1);
let user2 = findUser(999);

console.log(user1);  // { name: "Alice" }
console.log(user2);  // null

if (user2 === null) {
  console.log("User not found");
}`,
        explanation: 'Functions often return null when they can\'t find what they\'re looking for. Always check before using.',
      },
      {
        code: `// Null vs undefined
let a = null;       // intentional "nothing"
let b;              // forgot to assign = undefined
let c = undefined;  // explicit undefined (less common)

console.log(a === null);       // true
console.log(b === undefined);  // true

// Both are "nullish" - use ?? to provide defaults
console.log(a ?? "default");   // "default"
console.log(b ?? "default");   // "default"

// typeof quirk
console.log(typeof null);      // "object" (JavaScript bug!)
console.log(typeof undefined); // "undefined"`,
        explanation: 'Null is intentional emptiness, undefined is unintentional. Both are "nullish" and can use ?? for defaults.',
      },
    ],
  },
  {
    term: 'Undefined',
    definition: 'A variable that has been declared but not assigned a value yet.',
    example: 'let x; console.log(x); // undefined',
    category: 'types',
    contextExamples: [
      {
        code: `let declared;
console.log(declared); // undefined

let obj = { name: "Alice" };
console.log(obj.age);  // undefined (doesn't exist)

function noReturn() {
  console.log("Hello");
}
let result = noReturn();
console.log(result);   // undefined`,
        explanation: 'Undefined appears when: a variable has no value, a property doesn\'t exist, or a function doesn\'t return anything.',
      },
      {
        code: `// Optional parameters are undefined if not provided
function greet(name: string, title?: string) {
  if (title === undefined) {
    console.log("Hello, " + name);
  } else {
    console.log("Hello, " + title + " " + name);
  }
}

greet("Alice");           // title is undefined
greet("Alice", "Dr.");    // title is "Dr."

// Array access out of bounds
let arr = [1, 2, 3];
console.log(arr[0]);   // 1
console.log(arr[10]);  // undefined (no error!)`,
        explanation: 'Optional parameters are undefined when not passed. Accessing non-existent array indices returns undefined.',
      },
      {
        code: `// Checking for undefined
let value;

// Method 1: strict equality
if (value === undefined) {
  console.log("Is undefined");
}

// Method 2: typeof (safer for undeclared variables)
if (typeof value === "undefined") {
  console.log("Is undefined");
}

// Method 3: nullish check (null OR undefined)
if (value == null) {
  console.log("Is null or undefined");
}

// Setting default values
let name = value ?? "Anonymous";
console.log(name);`,
        explanation: 'Check for undefined with === or typeof. Use ?? to provide default values for undefined (and null).',
      },
    ],
  },
  {
    term: 'NaN',
    definition: 'Not a Number. A special value indicating an invalid number operation.',
    example: '0 / 0, parseInt("hello")',
    category: 'types',
    contextExamples: [
      {
        code: `let invalid = 0 / 0;
console.log(invalid); // NaN

let notNum = parseInt("hello");
console.log(notNum);  // NaN

// Check with isNaN()
console.log(isNaN(invalid));    // true
console.log(isNaN(42));         // false
console.log(isNaN("hello"));    // true`,
        explanation: 'NaN results from invalid math. Use isNaN() to check - even NaN !== NaN is true!',
      },
      {
        code: `// NaN is strange - it's not equal to itself!
let bad = NaN;
console.log(bad === NaN);           // false!
console.log(bad !== bad);           // true (only NaN does this)

// Use Number.isNaN for accurate checking
console.log(Number.isNaN(bad));     // true
console.log(Number.isNaN("hello")); // false (string, not NaN)
console.log(isNaN("hello"));        // true (converts first - confusing!)

// Number.isNaN is more reliable
let x = Number("abc");
console.log(Number.isNaN(x));       // true`,
        explanation: 'NaN !== NaN is true! Use Number.isNaN() for reliable checks. It doesn\'t convert strings first like isNaN().',
      },
      {
        code: `// Common causes of NaN
console.log(Math.sqrt(-1));      // NaN (no real square root)
console.log(parseInt("abc"));    // NaN
console.log(0 / 0);              // NaN
console.log(Infinity - Infinity); // NaN

// NaN spreads through calculations
let result = NaN + 5;
console.log(result);  // NaN

// Validate before calculating
function safeDivide(a: number, b: number) {
  if (b === 0) return "Cannot divide by zero";
  let result = a / b;
  if (Number.isNaN(result)) return "Invalid result";
  return result;
}

console.log(safeDivide(10, 2));
console.log(safeDivide(10, 0));`,
        explanation: 'NaN spreads - once you have it, every calculation becomes NaN. Validate inputs to prevent NaN from appearing.',
      },
    ],
  },
  {
    term: 'Tuple',
    definition: 'A TypeScript-specific array with a fixed number of elements where each element has a specific type.',
    example: 'let pair: [string, number] = ["age", 25];',
    category: 'types',
    contextExamples: [
      {
        code: `// Tuple: fixed length, specific types per position
let person: [string, number] = ["Alice", 28];

console.log(person[0]); // string: "Alice"
console.log(person[1]); // number: 28

// Useful for returning multiple values
function getNameAndAge(): [string, number] {
  return ["Bob", 35];
}

let [name, age] = getNameAndAge();
console.log(name, age);`,
        explanation: 'Tuples are arrays where each position has a specific type. Great for functions returning multiple values.',
      },
      {
        code: `// Tuples with optional elements
type NameWithOptionalAge = [string, number?];

let withAge: NameWithOptionalAge = ["Alice", 28];
let withoutAge: NameWithOptionalAge = ["Bob"];

console.log(withAge);
console.log(withoutAge);

// Rest elements in tuples
type StringAndNumbers = [string, ...number[]];

let data: StringAndNumbers = ["scores", 90, 85, 88];
let [label, ...scores] = data;

console.log(label);   // "scores"
console.log(scores);  // [90, 85, 88]`,
        explanation: 'Tuples can have optional elements with ? and rest elements with ... for variable-length typed arrays.',
      },
      {
        code: `// Real-world tuple use cases
// Coordinates
type Point = [number, number];
let position: Point = [10, 20];
console.log("x:", position[0], "y:", position[1]);

// RGB Color
type RGB = [number, number, number];
let red: RGB = [255, 0, 0];
console.log("RGB:", red);

// Key-value pair
type Entry = [string, any];
let entries: Entry[] = [
  ["name", "Alice"],
  ["age", 28],
  ["active", true]
];
console.log(entries);`,
        explanation: 'Tuples are perfect for fixed structures: coordinates, colors, key-value pairs, or any data with known positions.',
      },
    ],
  },
  {
    term: 'Enum',
    definition: 'A way to define a set of named constants. Useful for representing a fixed set of options.',
    example: 'enum Color { Red, Green, Blue }',
    category: 'types',
    contextExamples: [
      {
        code: `enum Direction {
  Up,
  Down,
  Left,
  Right
}

let move: Direction = Direction.Up;
console.log(move);        // 0
console.log(Direction[0]); // "Up"

enum Status {
  Pending = "PENDING",
  Active = "ACTIVE",
  Done = "DONE"
}

console.log(Status.Active); // "ACTIVE"`,
        explanation: 'Enums create named constants. By default, values are numbers starting at 0, but you can assign custom values.',
      },
      {
        code: `// Enums in functions and conditions
enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED"
}

function getStatusMessage(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return "Order received";
    case OrderStatus.Shipped:
      return "On the way!";
    case OrderStatus.Delivered:
      return "Delivered!";
    default:
      return "Processing...";
  }
}

console.log(getStatusMessage(OrderStatus.Shipped));`,
        explanation: 'Enums make switch statements cleaner and safer. TypeScript ensures you handle all cases.',
      },
      {
        code: `// Numeric enums with custom values
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}

function isSuccess(code: HttpStatus): boolean {
  return code === HttpStatus.OK;
}

console.log(isSuccess(HttpStatus.OK));       // true
console.log(isSuccess(HttpStatus.NotFound)); // false

// const enum - fully inlined at compile time
const enum Size {
  Small = "S",
  Medium = "M",
  Large = "L"
}

let tshirt = Size.Medium;
console.log(tshirt);  // "M"`,
        explanation: 'Numeric enums can have custom values like HTTP codes. const enums are inlined for better performance.',
      },
    ],
  },

  // ===== OPERATORS =====
  {
    term: 'Operator',
    definition: 'Symbols that perform operations on values. Math (+, -), comparison (===), logical (&&).',
    example: '5 + 3, age >= 18',
    category: 'operators',
    contextExamples: [
      {
        code: `let a = 10, b = 3;

// Math operators
console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.33...
console.log(a % b);  // 1 (remainder)

// Comparison
console.log(a > b);  // true
console.log(a === 10); // true`,
        explanation: 'Operators perform operations: math (+,-,*,/,%), comparison (>,<,===), and more.',
      },
      {
        code: `// Increment and decrement
let count = 5;
count++;         // count is now 6
console.log(count);
count--;         // count is now 5
console.log(count);

// Pre vs post increment
let x = 5;
console.log(x++);  // 5 (returns then increments)
console.log(x);    // 6
console.log(++x);  // 7 (increments then returns)

// Exponentiation
console.log(2 ** 3);  // 8 (2 to the power of 3)
console.log(10 ** 2); // 100`,
        explanation: '++ and -- increment/decrement by 1. Pre-increment (++x) increments first, post-increment (x++) returns first.',
      },
      {
        code: `// String operators
let firstName = "Alice";
let lastName = "Smith";
let fullName = firstName + " " + lastName;
console.log(fullName);

// typeof operator
console.log(typeof "hello");   // "string"
console.log(typeof 42);        // "number"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"

// in operator (check property exists)
let user = { name: "Alice", age: 28 };
console.log("name" in user);   // true
console.log("email" in user);  // false`,
        explanation: '+ concatenates strings. typeof returns type as string. in checks if property exists in object.',
      },
    ],
  },
  {
    term: 'Comparison Operators',
    definition: 'Operators that compare values and return true or false. === for equality, !== for inequality.',
    example: '===, !==, >, <, >=, <=',
    category: 'operators',
    contextExamples: [
      {
        code: `let age = 25;

console.log(age === 25);  // true (equal)
console.log(age !== 30);  // true (not equal)
console.log(age > 20);    // true
console.log(age < 30);    // true
console.log(age >= 25);   // true (greater or equal)
console.log(age <= 25);   // true (less or equal)

// Always use === instead of ==
console.log(5 === "5");   // false (different types)
console.log(5 == "5");    // true (type coercion - avoid!)`,
        explanation: 'Comparison operators return true/false. Always use === (strict equality) to avoid unexpected type conversions.',
      },
      {
        code: `// Comparing strings
console.log("apple" < "banana");  // true (alphabetical)
console.log("A" < "a");           // true (uppercase < lowercase)
console.log("10" < "9");          // true (string comparison!)

// Correct number comparison
console.log(10 < 9);              // false
console.log(Number("10") < Number("9")); // false

// Comparing objects
let obj1 = { x: 1 };
let obj2 = { x: 1 };
let obj3 = obj1;

console.log(obj1 === obj2);  // false (different objects)
console.log(obj1 === obj3);  // true (same reference)`,
        explanation: 'Strings compare alphabetically/by character code. Objects compare by reference, not content.',
      },
      {
        code: `// Combining comparisons
let score = 75;
let passed = score >= 60;
let excellent = score >= 90;

console.log("Passed:", passed);
console.log("Excellent:", excellent);

// Range checking
let age = 25;
let isWorkingAge = age >= 18 && age <= 65;
console.log("Working age:", isWorkingAge);

// Multiple equality checks
let day = "Saturday";
let isWeekend = day === "Saturday" || day === "Sunday";
console.log("Is weekend:", isWeekend);`,
        explanation: 'Store comparison results in variables for clarity. Combine with && for ranges, || for alternatives.',
      },
    ],
  },
  {
    term: 'Logical Operators',
    definition: 'Operators that combine or modify boolean values. && (and), || (or), ! (not).',
    example: 'true && false, !true',
    category: 'operators',
    contextExamples: [
      {
        code: `let isAdult = true;
let hasTicket = true;
let isBanned = false;

// && (AND) - both must be true
console.log(isAdult && hasTicket); // true

// || (OR) - at least one must be true
console.log(isAdult || hasTicket); // true

// ! (NOT) - flips the value
console.log(!isBanned);            // true

// Combined
let canEnter = isAdult && hasTicket && !isBanned;
console.log("Can enter:", canEnter);`,
        explanation: '&& requires both sides true, || requires at least one true, ! flips true to false and vice versa.',
      },
      {
        code: `// Short-circuit evaluation
let user = null;

// && stops at first false - returns that value
let name = user && user.name;
console.log(name);  // null (user is falsy)

// || stops at first true - returns that value
let displayName = name || "Guest";
console.log(displayName);  // "Guest"

// Practical use: default values
function greet(name?: string) {
  let safeName = name || "Friend";
  console.log("Hello, " + safeName);
}

greet("Alice");  // "Hello, Alice"
greet();         // "Hello, Friend"`,
        explanation: '&& returns first falsy or last value. || returns first truthy or last value. Use for defaults and safety.',
      },
      {
        code: `// Complex conditions
let age = 20;
let hasID = true;
let withParent = false;

// Multiple AND conditions
let canBuyAlcohol = age >= 21 && hasID;
console.log("Can buy alcohol:", canBuyAlcohol);

// OR with grouped ANDs
let canEnterClub = (age >= 21 && hasID) || (age >= 18 && withParent);
console.log("Can enter club:", canEnterClub);

// Double negation (truthy check)
let value = "hello";
console.log(!!value);  // true (converts to boolean)
console.log(!!"");     // false`,
        explanation: 'Use parentheses to group conditions. !! converts any value to its boolean equivalent.',
      },
    ],
  },
  {
    term: 'Ternary Operator',
    definition: 'A shortcut for if/else that returns one of two values based on a condition.',
    example: 'condition ? valueIfTrue : valueIfFalse',
    category: 'operators',
    contextExamples: [
      {
        code: `let age = 20;

// Instead of if/else
let status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Can be used in strings
let message = \`You are \${age >= 21 ? "allowed" : "not allowed"} to drink\`;
console.log(message);

// Nested (use sparingly)
let grade = 85;
let letter = grade >= 90 ? "A" : grade >= 80 ? "B" : "C";
console.log(letter); // "B"`,
        explanation: 'Ternary operator is condition ? trueValue : falseValue. Great for simple choices, but avoid complex nesting.',
      },
      {
        code: `// Assigning based on condition
let isLoggedIn = true;
let greeting = isLoggedIn ? "Welcome back!" : "Please log in";
console.log(greeting);

// In function returns
function formatPrice(price: number, showCents: boolean) {
  return showCents ? price.toFixed(2) : Math.floor(price).toString();
}

console.log(formatPrice(9.99, true));   // "9.99"
console.log(formatPrice(9.99, false));  // "9"

// In JSX/React (common use case)
let count = 5;
let text = count === 1 ? "item" : "items";
console.log(count + " " + text);`,
        explanation: 'Ternary is great for inline conditionals in strings, returns, and assignments.',
      },
      {
        code: `// When NOT to use ternary
let score = 75;

// Too complex - use if/else instead
// let result = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";

// Better as if/else
function getGrade(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  return "F";
}

console.log(getGrade(score));

// Ternary for simple yes/no decisions
let hasItems = true;
let buttonText = hasItems ? "Checkout" : "Continue Shopping";
console.log(buttonText);`,
        explanation: 'Use ternary for simple yes/no decisions. For multiple conditions, if/else is more readable.',
      },
    ],
  },
  {
    term: 'Spread Operator',
    definition: 'Three dots (...) that expand an array or object into individual elements.',
    example: '...array, ...object',
    category: 'operators',
    contextExamples: [
      {
        code: `// Spread arrays
let nums = [1, 2, 3];
let more = [...nums, 4, 5];
console.log(more); // [1, 2, 3, 4, 5]

// Copy array
let copy = [...nums];

// Spread objects
let user = { name: "Alice", age: 28 };
let updated = { ...user, age: 29 };
console.log(updated); // { name: "Alice", age: 29 }

// Combine objects
let extra = { ...user, city: "NYC" };
console.log(extra);`,
        explanation: 'Spread (...) unpacks arrays/objects. Great for copying, combining, or adding elements without modifying the original.',
      },
      {
        code: `// Merging arrays
let front = [1, 2];
let back = [4, 5];
let middle = 3;

let all = [...front, middle, ...back];
console.log(all);  // [1, 2, 3, 4, 5]

// Spreading into function calls
let numbers = [5, 2, 8, 1, 9];
console.log(Math.max(...numbers));  // 9
console.log(Math.min(...numbers));  // 1

// Converting string to array of characters
let word = "hello";
let letters = [...word];
console.log(letters);  // ["h", "e", "l", "l", "o"]`,
        explanation: 'Spread works in arrays, function arguments, and even strings. It expands any iterable into individual elements.',
      },
      {
        code: `// Object spread order matters
let defaults = { theme: "light", lang: "en" };
let userPrefs = { theme: "dark" };

// Later spreads override earlier ones
let settings = { ...defaults, ...userPrefs };
console.log(settings);  // { theme: "dark", lang: "en" }

// Removing properties (with destructuring)
let full = { a: 1, b: 2, c: 3 };
let { a, ...rest } = full;
console.log(rest);  // { b: 2, c: 3 }

// Shallow copy warning
let original = { arr: [1, 2, 3] };
let copied = { ...original };
copied.arr.push(4);
console.log(original.arr);  // [1, 2, 3, 4] - both affected!`,
        explanation: 'Later spreads override earlier ones. Spread makes shallow copies - nested objects/arrays are still shared.',
      },
    ],
  },
  {
    term: 'Rest Operator',
    definition: 'Three dots (...) that collect multiple elements into an array. Used in function parameters.',
    example: 'function sum(...numbers) {}',
    category: 'operators',
    contextExamples: [
      {
        code: `// Rest in functions - collect all arguments
function sum(...numbers: number[]) {
  let total = 0;
  for (let n of numbers) {
    total += n;
  }
  return total;
}

console.log(sum(1, 2));        // 3
console.log(sum(1, 2, 3, 4));  // 10

// Rest in destructuring
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // 1
console.log(rest);  // [2, 3, 4]`,
        explanation: 'Rest (...) gathers remaining elements into an array. Opposite of spread - it collects instead of expanding.',
      },
      {
        code: `// Rest with required parameters
function greet(greeting: string, ...names: string[]) {
  for (let name of names) {
    console.log(greeting + ", " + name + "!");
  }
}

greet("Hello", "Alice", "Bob", "Charlie");

// Rest must be last parameter
function log(level: string, message: string, ...tags: string[]) {
  console.log("[" + level + "]", message, tags);
}

log("INFO", "User logged in", "auth", "session");`,
        explanation: 'Rest parameters must come last. Earlier parameters are matched first, rest collects the remainder.',
      },
      {
        code: `// Rest in object destructuring
let person = {
  name: "Alice",
  age: 28,
  city: "NYC",
  job: "Engineer"
};

// Extract some, collect rest
let { name, age, ...others } = person;
console.log(name);    // "Alice"
console.log(age);     // 28
console.log(others);  // { city: "NYC", job: "Engineer" }

// Useful for removing properties
let { job, ...personWithoutJob } = person;
console.log(personWithoutJob);`,
        explanation: 'Object rest destructuring collects remaining properties. Great for extracting specific fields or removing properties.',
      },
    ],
  },
  {
    term: 'Optional Chaining',
    definition: 'The ?. operator that safely accesses properties that might not exist, returning undefined instead of an error.',
    example: 'user?.address?.city',
    category: 'operators',
    contextExamples: [
      {
        code: `let user = {
  name: "Alice",
  address: {
    city: "NYC"
  }
};

// Safe access
console.log(user?.address?.city);    // "NYC"
console.log(user?.phone?.number);    // undefined (no error)

let guest = null;
console.log(guest?.name);            // undefined (no error)

// Without optional chaining, this would crash:
// console.log(guest.name); // ERROR!`,
        explanation: 'Optional chaining ?. returns undefined if a property doesn\'t exist, instead of throwing an error. Great for nested data.',
      },
      {
        code: `// Optional chaining with method calls
let user = {
  name: "Alice",
  greet() {
    return "Hello!";
  }
};

console.log(user.greet?.());        // "Hello!"
console.log(user.goodbye?.());      // undefined (method doesn't exist)

// With arrays
let users = [{ name: "Alice" }, { name: "Bob" }];
console.log(users?.[0]?.name);      // "Alice"
console.log(users?.[10]?.name);     // undefined

let emptyList: any[] | null = null;
console.log(emptyList?.[0]);        // undefined`,
        explanation: 'Optional chaining works with method calls ?.() and array access ?.[]. Always returns undefined if the chain breaks.',
      },
      {
        code: `// Combining with nullish coalescing
let response = {
  data: {
    user: null
  }
};

let userName = response?.data?.user?.name ?? "Anonymous";
console.log(userName);  // "Anonymous"

// Real-world API response handling
function displayUser(response: any) {
  let name = response?.data?.user?.name ?? "Unknown";
  let email = response?.data?.user?.email ?? "No email";
  let avatar = response?.data?.user?.avatar?.url ?? "/default.png";

  console.log(name, email, avatar);
}

displayUser({ data: { user: { name: "Alice" } } });
displayUser(null);`,
        explanation: 'Combine ?. with ?? for safe access with defaults. Perfect for handling API responses that might be incomplete.',
      },
    ],
  },
  {
    term: 'Nullish Coalescing',
    definition: 'The ?? operator that provides a default value only when the left side is null or undefined.',
    example: 'value ?? "default"',
    category: 'operators',
    contextExamples: [
      {
        code: `let name = null;
let defaultName = name ?? "Guest";
console.log(defaultName); // "Guest"

let count = 0;
// ?? only replaces null/undefined, not 0
console.log(count ?? 10);  // 0

// Compare with || which replaces all falsy values
console.log(count || 10);  // 10

let user = { name: "Alice" };
let city = user.city ?? "Unknown";
console.log(city); // "Unknown"`,
        explanation: '?? provides a fallback only for null/undefined. Unlike ||, it keeps other falsy values like 0 or empty string.',
      },
      {
        code: `// ?? vs || comparison
let zero = 0;
let empty = "";
let nothing = null;

console.log("|| with 0:", zero || "default");      // "default" (wrong!)
console.log("?? with 0:", zero ?? "default");      // 0 (correct!)

console.log("|| with '':", empty || "default");    // "default" (wrong!)
console.log("?? with '':", empty ?? "default");    // "" (correct!)

console.log("|| with null:", nothing || "default"); // "default"
console.log("?? with null:", nothing ?? "default"); // "default"`,
        explanation: '|| treats 0, "", false as falsy and replaces them. ?? only replaces null/undefined. Use ?? for defaults.',
      },
      {
        code: `// Practical examples
interface Settings {
  volume?: number;
  darkMode?: boolean;
  username?: string | null;
}

function applySettings(settings: Settings) {
  // Use ?? to respect 0 and false as valid values
  let volume = settings.volume ?? 50;      // 0 is valid
  let darkMode = settings.darkMode ?? false; // false is valid
  let username = settings.username ?? "Guest";

  console.log("Volume:", volume);
  console.log("Dark mode:", darkMode);
  console.log("Username:", username);
}

applySettings({ volume: 0, darkMode: false });
applySettings({});`,
        explanation: 'Use ?? for settings where 0, false, or "" might be intentional values that shouldn\'t be replaced with defaults.',
      },
    ],
  },

  // ===== FUNCTIONS =====
  {
    term: 'Function',
    definition: 'A reusable block of code that performs a specific task. Like a recipe you can use over and over.',
    example: 'function greet() { }',
    category: 'functions',
    contextExamples: [
      {
        code: `function greet(name: string) {
  console.log("Hello, " + name + "!");
}

greet("Alice");
greet("Bob");

function add(a: number, b: number): number {
  return a + b;
}

console.log(add(5, 3));`,
        explanation: 'Functions are reusable code blocks. Define once, call many times with different inputs.',
      },
      {
        code: `// Functions that return values
function calculateArea(width: number, height: number) {
  return width * height;
}

function isEven(num: number) {
  return num % 2 === 0;
}

let area = calculateArea(5, 3);
console.log("Area:", area);

console.log("Is 4 even?", isEven(4));
console.log("Is 7 even?", isEven(7));`,
        explanation: 'Functions can calculate and return results. The returned value can be stored in a variable or used directly.',
      },
      {
        code: `// Functions with default values
function greet(name: string, greeting: string = "Hello") {
  console.log(greeting + ", " + name + "!");
}

greet("Alice");              // Uses default
greet("Bob", "Hi");          // Custom greeting
greet("Charlie", "Welcome"); // Custom greeting`,
        explanation: 'Default parameters provide fallback values when arguments aren\'t provided. Required parameters come first.',
      },
    ],
  },
  {
    term: 'Parameter',
    definition: "A variable listed in a function's definition. It's a placeholder for values you'll pass in.",
    example: 'function greet(name) { }',
    category: 'functions',
    contextExamples: [
      {
        code: `// name, age, city are parameters
function introduce(name: string, age: number, city: string) {
  console.log(\`I'm \${name}, \${age}, from \${city}\`);
}

// "Alice", 28, "NYC" are arguments
introduce("Alice", 28, "NYC");
introduce("Bob", 35, "LA");`,
        explanation: 'Parameters are placeholders in the function definition. Arguments are the actual values you pass when calling.',
      },
      {
        code: `// Optional parameters (marked with ?)
function greet(name: string, greeting?: string) {
  if (greeting) {
    console.log(greeting + ", " + name);
  } else {
    console.log("Hello, " + name);
  }
}

greet("Alice");           // "Hello, Alice"
greet("Bob", "Welcome");  // "Welcome, Bob"

// Default parameters
function createUser(name: string, role: string = "user") {
  console.log(name, "is a", role);
}

createUser("Alice");         // "Alice is a user"
createUser("Bob", "admin");  // "Bob is a admin"`,
        explanation: 'Optional parameters use ?. Default parameters use = value. Both allow calling with fewer arguments.',
      },
      {
        code: `// Parameter order matters
function divide(dividend: number, divisor: number) {
  return dividend / divisor;
}

console.log(divide(10, 2));  // 5 (10 / 2)
console.log(divide(2, 10));  // 0.2 (2 / 10)

// Destructured parameters
function printUser({ name, age }: { name: string; age: number }) {
  console.log(name + " is " + age);
}

printUser({ name: "Alice", age: 28 });
printUser({ age: 30, name: "Bob" });  // order doesn't matter here`,
        explanation: 'Parameter order is critical for regular functions. Object destructuring lets you pass properties in any order.',
      },
    ],
  },
  {
    term: 'Return',
    definition: 'Sending a value back from a function. The function does its work and gives you the result.',
    example: 'return x + y;',
    category: 'functions',
    contextExamples: [
      {
        code: `function calculateTax(price: number): number {
  return price * 0.08;
}

function formatPrice(amount: number): string {
  return "$" + amount.toFixed(2);
}

let tax = calculateTax(100);
console.log(formatPrice(tax)); // "$8.00"

// Functions without return give undefined
function sayHi() {
  console.log("Hi!");
}
console.log(sayHi()); // undefined`,
        explanation: 'Return sends a value back to the caller. Without return, functions return undefined.',
      },
      {
        code: `// Early return pattern
function getDiscount(customer: { isPremium: boolean; years: number }) {
  if (!customer.isPremium) {
    return 0;  // Early exit
  }

  if (customer.years >= 5) {
    return 20;  // 20% discount
  }

  return 10;  // 10% discount
}

console.log(getDiscount({ isPremium: false, years: 10 })); // 0
console.log(getDiscount({ isPremium: true, years: 3 }));   // 10
console.log(getDiscount({ isPremium: true, years: 7 }));   // 20`,
        explanation: 'Early return exits the function immediately. It avoids deep nesting and makes code clearer.',
      },
      {
        code: `// Returning multiple values (as object or array)
function getMinMax(numbers: number[]): { min: number; max: number } {
  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers)
  };
}

let { min, max } = getMinMax([3, 1, 4, 1, 5]);
console.log("Min:", min, "Max:", max);

// As tuple
function divideWithRemainder(a: number, b: number): [number, number] {
  return [Math.floor(a / b), a % b];
}

let [quotient, remainder] = divideWithRemainder(10, 3);
console.log("10 / 3 =", quotient, "remainder", remainder);`,
        explanation: 'Return objects or arrays to send back multiple values. Use destructuring to unpack them easily.',
      },
    ],
  },
  {
    term: 'Arrow Function',
    definition: 'A shorter way to write functions using the => arrow. Popular in modern JavaScript.',
    example: 'const add = (a, b) => a + b;',
    category: 'functions',
    contextExamples: [
      {
        code: `// Short form - implicit return
const add = (a: number, b: number) => a + b;
const square = (n: number) => n * n;

console.log(add(3, 4));   // 7
console.log(square(5));   // 25

// Long form with body
const greet = (name: string) => {
  let message = "Hello, " + name;
  return message + "!";
};

console.log(greet("World"));`,
        explanation: 'Arrow functions are concise. One-liners auto-return. Use {} and return for multiple statements.',
      },
      {
        code: `// Arrow functions in callbacks
let numbers = [1, 2, 3, 4, 5];

// Clean array methods
let doubled = numbers.map(n => n * 2);
let evens = numbers.filter(n => n % 2 === 0);
let sum = numbers.reduce((acc, n) => acc + n, 0);

console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);

// Sorting
let words = ["banana", "apple", "cherry"];
words.sort((a, b) => a.localeCompare(b));
console.log(words);`,
        explanation: 'Arrow functions shine in callbacks - map, filter, reduce, sort. They\'re more concise than regular functions.',
      },
      {
        code: `// Arrow functions don't have their own 'this'
const counter = {
  count: 0,

  // Regular function - 'this' is counter
  incrementRegular: function() {
    setTimeout(function() {
      // 'this' is undefined here!
      // this.count++;  // Would fail
      console.log("Regular function 'this' issue");
    }, 100);
  },

  // Arrow function - 'this' inherited from parent
  incrementArrow: function() {
    setTimeout(() => {
      this.count++;
      console.log("Arrow count:", this.count);
    }, 100);
  }
};

counter.incrementArrow();`,
        explanation: 'Arrow functions inherit "this" from their surrounding scope. This makes them perfect for callbacks inside methods.',
      },
    ],
  },
  {
    term: 'Callback',
    definition: 'A function passed as an argument to another function, to be called later.',
    example: 'array.forEach(item => console.log(item))',
    category: 'functions',
    contextExamples: [
      {
        code: `let numbers = [1, 2, 3, 4, 5];

// forEach takes a callback function
numbers.forEach(num => {
  console.log("Number:", num);
});

// map transforms each element using a callback
let doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter keeps elements that pass the callback test
let evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4]`,
        explanation: 'Callbacks are functions passed to other functions. Array methods like forEach, map, filter all use callbacks.',
      },
      {
        code: `// Callbacks for async operations
function fetchData(callback: (data: string) => void) {
  // Simulate async operation
  setTimeout(() => {
    callback("Data loaded!");
  }, 1000);
}

console.log("Starting...");
fetchData((data) => {
  console.log("Received:", data);
});
console.log("Waiting...");

// Output order: Starting..., Waiting..., Received: Data loaded!`,
        explanation: 'Callbacks handle async operations. The callback runs when the operation completes, not immediately.',
      },
      {
        code: `// Custom functions that take callbacks
function processItems(items: number[], callback: (item: number) => number) {
  let results: number[] = [];
  for (let item of items) {
    results.push(callback(item));
  }
  return results;
}

// Different callbacks, same function
let nums = [1, 2, 3, 4, 5];

let squares = processItems(nums, n => n * n);
console.log("Squares:", squares);

let addTen = processItems(nums, n => n + 10);
console.log("Plus ten:", addTen);

let negatives = processItems(nums, n => -n);
console.log("Negatives:", negatives);`,
        explanation: 'Callbacks make functions flexible. The same function can do different things by passing different callbacks.',
      },
    ],
  },
  {
    term: 'Closure',
    definition: 'A function that remembers variables from its outer scope even after the outer function has finished.',
    example: 'Inner function accessing outer variables',
    category: 'functions',
    contextExamples: [
      {
        code: `function createCounter() {
  let count = 0; // private variable

  return function() {
    count++;
    return count;
  };
}

let counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Each counter is independent
let counter2 = createCounter();
console.log(counter2()); // 1`,
        explanation: 'Closures "close over" variables from their outer scope. The inner function remembers count even after createCounter returns.',
      },
      {
        code: `// Closures for private state
function createWallet(initial: number) {
  let balance = initial;  // Private - can't access directly

  return {
    deposit(amount: number) {
      balance += amount;
      console.log("Deposited:", amount, "Balance:", balance);
    },
    withdraw(amount: number) {
      if (amount <= balance) {
        balance -= amount;
        console.log("Withdrew:", amount, "Balance:", balance);
      } else {
        console.log("Insufficient funds");
      }
    },
    getBalance() {
      return balance;
    }
  };
}

let wallet = createWallet(100);
wallet.deposit(50);
wallet.withdraw(30);
console.log("Final:", wallet.getBalance());`,
        explanation: 'Closures create private variables. balance can only be changed through the returned methods, not directly.',
      },
      {
        code: `// Closure in event handlers and callbacks
function createLogger(prefix: string) {
  return function(message: string) {
    console.log("[" + prefix + "]", message);
  };
}

let infoLog = createLogger("INFO");
let errorLog = createLogger("ERROR");

infoLog("Application started");
infoLog("User logged in");
errorLog("Connection failed");

// Closures remember their creation context
function makeMultiplier(multiplier: number) {
  return (n: number) => n * multiplier;
}

let double = makeMultiplier(2);
let triple = makeMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15`,
        explanation: 'Closures remember their creation context. Each logger/multiplier keeps its own copy of the closed-over variable.',
      },
    ],
  },
  {
    term: 'Higher-Order Function',
    definition: 'A function that takes another function as a parameter or returns a function.',
    example: 'array.map(), array.filter()',
    category: 'functions',
    contextExamples: [
      {
        code: `// map, filter, reduce are higher-order functions
let numbers = [1, 2, 3, 4, 5];

// Takes a function as argument
let squares = numbers.map(n => n * n);
console.log(squares); // [1, 4, 9, 16, 25]

// Custom higher-order function
function repeat(n: number, action: (i: number) => void) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, i => console.log("Iteration:", i));`,
        explanation: 'Higher-order functions work with other functions. They either accept functions as arguments or return new functions.',
      },
      {
        code: `// Functions that return functions
function createAdder(x: number) {
  return function(y: number) {
    return x + y;
  };
}

let add5 = createAdder(5);
let add10 = createAdder(10);

console.log(add5(3));   // 8
console.log(add10(3));  // 13

// Function composition
function compose<T>(f: (x: T) => T, g: (x: T) => T) {
  return function(x: T) {
    return f(g(x));
  };
}

let double = (n: number) => n * 2;
let addOne = (n: number) => n + 1;
let doubleThenAdd = compose(addOne, double);

console.log(doubleThenAdd(5));  // 11 (5*2 + 1)`,
        explanation: 'Higher-order functions can return new functions. This enables powerful patterns like function composition.',
      },
      {
        code: `// Array higher-order methods chained
let users = [
  { name: "Alice", age: 28, active: true },
  { name: "Bob", age: 35, active: false },
  { name: "Charlie", age: 22, active: true }
];

// Chain filter, map, sort
let result = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();

console.log(result);  // ["Alice", "Charlie"]

// find and some are also higher-order
let hasMinor = users.some(u => u.age < 18);
let firstActive = users.find(u => u.active);

console.log("Has minor:", hasMinor);
console.log("First active:", firstActive?.name);`,
        explanation: 'Higher-order methods chain beautifully. Each returns a new array/value that the next method processes.',
      },
    ],
  },
  {
    term: 'Pure Function',
    definition: 'A function that always returns the same output for the same input and has no side effects.',
    example: 'const add = (a, b) => a + b;',
    category: 'functions',
    contextExamples: [
      {
        code: `// Pure function - same input = same output
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(2, 3)); // always 5
console.log(add(2, 3)); // always 5

// Impure - depends on external state
let multiplier = 2;
function impureMultiply(n: number): number {
  return n * multiplier; // depends on outside variable
}

console.log(impureMultiply(5)); // 10
multiplier = 3;
console.log(impureMultiply(5)); // 15 - different!`,
        explanation: 'Pure functions are predictable - no surprises. They don\'t modify external state or depend on things that might change.',
      },
      {
        code: `// Pure: no side effects
function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}

let prices = [10, 20, 30];
console.log(calculateTotal(prices));  // 60
console.log(prices);  // [10, 20, 30] - unchanged!

// Impure: modifies input
function addTax(prices: number[]) {
  for (let i = 0; i < prices.length; i++) {
    prices[i] *= 1.08;  // Mutates original!
  }
  return prices;
}

// This would change the original array - impure!`,
        explanation: 'Pure functions don\'t modify their inputs. They return new values instead of changing existing ones.',
      },
      {
        code: `// Benefits of pure functions
// 1. Easy to test
function greet(name: string): string {
  return "Hello, " + name;
}
// Test: greet("Alice") always returns "Hello, Alice"

// 2. Easy to cache (memoization)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// Same input = same output, so we can cache results

// 3. Safe to run in parallel
function processItem(item: number): number {
  return item * 2 + 1;
}

let items = [1, 2, 3, 4, 5];
let results = items.map(processItem);
console.log(results);`,
        explanation: 'Pure functions are testable, cacheable, and parallelizable. They\'re the foundation of functional programming.',
      },
    ],
  },
  {
    term: 'Recursion',
    definition: 'A function that calls itself. Used to solve problems that can be broken into smaller identical problems.',
    example: 'factorial(n) calls factorial(n-1)',
    category: 'functions',
    contextExamples: [
      {
        code: `function factorial(n: number): number {
  // Base case - when to stop
  if (n <= 1) return 1;

  // Recursive case - call itself
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120 (5*4*3*2*1)

function countdown(n: number) {
  if (n <= 0) {
    console.log("Done!");
    return;
  }
  console.log(n);
  countdown(n - 1);
}

countdown(3);`,
        explanation: 'Recursive functions call themselves with smaller input until reaching a base case. Always need a stopping condition!',
      },
      {
        code: `// Recursion for nested structures
interface TreeNode {
  value: number;
  children: TreeNode[];
}

function sumTree(node: TreeNode): number {
  let total = node.value;

  for (let child of node.children) {
    total += sumTree(child);  // Recursive call
  }

  return total;
}

let tree: TreeNode = {
  value: 1,
  children: [
    { value: 2, children: [] },
    { value: 3, children: [
      { value: 4, children: [] }
    ]}
  ]
};

console.log(sumTree(tree));  // 1 + 2 + 3 + 4 = 10`,
        explanation: 'Recursion naturally handles tree structures. Each call processes one node and recurses into children.',
      },
      {
        code: `// Recursion vs iteration
// Recursive sum
function sumRecursive(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr[0] + sumRecursive(arr.slice(1));
}

// Iterative sum (usually preferred for simple cases)
function sumIterative(arr: number[]): number {
  let total = 0;
  for (let n of arr) {
    total += n;
  }
  return total;
}

let nums = [1, 2, 3, 4, 5];
console.log("Recursive:", sumRecursive(nums));
console.log("Iterative:", sumIterative(nums));

// Use recursion when the problem is naturally recursive
// (trees, nested structures, divide-and-conquer)`,
        explanation: 'Recursion is elegant but can be slower than loops. Use it when the problem structure is naturally recursive.',
      },
    ],
  },
  {
    term: 'Default Parameters',
    definition: 'Parameters with default values that are used if no argument is provided.',
    example: 'function greet(name = "Guest") {}',
    category: 'functions',
    contextExamples: [
      {
        code: `function greet(name: string = "Guest") {
  console.log("Hello, " + name + "!");
}

greet("Alice");  // "Hello, Alice!"
greet();         // "Hello, Guest!"

function createUser(
  name: string,
  role: string = "user",
  active: boolean = true
) {
  return { name, role, active };
}

console.log(createUser("Alice"));
console.log(createUser("Bob", "admin"));`,
        explanation: 'Default parameters provide fallback values. Put them after required parameters.',
      },
      {
        code: `// Defaults can use expressions
function logWithTimestamp(
  message: string,
  timestamp: Date = new Date()
) {
  console.log("[" + timestamp.toISOString() + "]", message);
}

logWithTimestamp("Hello");  // Uses current time
logWithTimestamp("Custom", new Date("2024-01-01"));

// Defaults can reference earlier parameters
function createRange(start: number, end: number = start + 10) {
  let result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

console.log(createRange(5));      // [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
console.log(createRange(5, 8));   // [5, 6, 7, 8]`,
        explanation: 'Default values are evaluated at call time. They can be expressions or reference earlier parameters.',
      },
      {
        code: `// Default with destructured objects
interface Options {
  color?: string;
  size?: number;
  visible?: boolean;
}

function createWidget({
  color = "blue",
  size = 100,
  visible = true
}: Options = {}) {
  console.log(color, size, visible);
}

createWidget();                        // "blue" 100 true
createWidget({ color: "red" });        // "red" 100 true
createWidget({ size: 50, visible: false });  // "blue" 50 false

// The = {} at the end allows calling with no arguments`,
        explanation: 'Combine destructuring with defaults for flexible configuration objects. The = {} allows omitting the argument entirely.',
      },
    ],
  },

  // ===== CONTROL FLOW =====
  {
    term: 'If/Else',
    definition: 'A way to make decisions in code. Runs different code based on whether a condition is true or false.',
    example: 'if (condition) { } else { }',
    category: 'control-flow',
    contextExamples: [
      {
        code: `let age = 20;

if (age >= 18) {
  console.log("You're an adult");
} else {
  console.log("You're a minor");
}

// Multiple conditions
let score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}`,
        explanation: 'If/else makes decisions. The first true condition runs its block. Use else if for multiple options.',
      },
      {
        code: `// Combining conditions with && and ||
let isLoggedIn = true;
let isAdmin = false;
let isPremium = true;

if (isLoggedIn && isAdmin) {
  console.log("Admin dashboard");
} else if (isLoggedIn && isPremium) {
  console.log("Premium content");
} else if (isLoggedIn) {
  console.log("Basic content");
} else {
  console.log("Please log in");
}`,
        explanation: '&& (and) requires both conditions true. || (or) requires at least one true. Combine them for complex logic.',
      },
      {
        code: `// Checking for specific values
let day = "Saturday";

if (day === "Saturday" || day === "Sunday") {
  console.log("Weekend! Time to relax.");
} else {
  console.log("Weekday. Time to work.");
}

// Nested if statements
let weather = "sunny";
let temperature = 75;

if (weather === "sunny") {
  if (temperature > 80) {
    console.log("Hot and sunny - go swimming!");
  } else {
    console.log("Nice day for a walk!");
  }
}`,
        explanation: 'Use === to check exact values. You can nest if statements inside each other for more complex decisions.',
      },
    ],
  },
  {
    term: 'Switch',
    definition: 'A cleaner way to handle multiple specific value comparisons. Alternative to many if/else if statements.',
    example: 'switch(value) { case 1: ... }',
    category: 'control-flow',
    contextExamples: [
      {
        code: `let day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Invalid day");
}`,
        explanation: 'Switch compares a value against multiple cases. Don\'t forget break! Default handles unmatched values.',
      },
      {
        code: `// Switch with return (no break needed)
function getStatusText(code: number): string {
  switch (code) {
    case 200:
      return "OK";
    case 404:
      return "Not Found";
    case 500:
      return "Server Error";
    default:
      return "Unknown";
  }
}

console.log(getStatusText(200));  // "OK"
console.log(getStatusText(404));  // "Not Found"
console.log(getStatusText(999));  // "Unknown"`,
        explanation: 'When using return, you don\'t need break - return exits the function immediately.',
      },
      {
        code: `// Switch vs if/else - when to use which
let fruit = "apple";

// Switch: good for exact value matching
switch (fruit) {
  case "apple":
    console.log("Red or green");
    break;
  case "banana":
    console.log("Yellow");
    break;
}

// If/else: better for ranges and complex conditions
let score = 85;
// Can't do this with switch easily:
// if (score >= 90) ...
// else if (score >= 80) ...

console.log("Use switch for exact matches");`,
        explanation: 'Use switch for many exact value comparisons. Use if/else for ranges, complex conditions, or few cases.',
      },
    ],
  },
  {
    term: 'For Loop',
    definition: 'Repeats code a specific number of times. Has initialization, condition, and increment.',
    example: 'for (let i = 0; i < 5; i++) { }',
    category: 'control-flow',
    contextExamples: [
      {
        code: `// Classic for loop
for (let i = 0; i < 5; i++) {
  console.log("Count:", i);
}

// Loop through array by index
let fruits = ["apple", "banana", "cherry"];
for (let i = 0; i < fruits.length; i++) {
  console.log(i + ": " + fruits[i]);
}

// Counting backwards
for (let i = 3; i > 0; i--) {
  console.log("Countdown:", i);
}`,
        explanation: 'For loops have three parts: initialization (let i = 0), condition (i < 5), and increment (i++). Runs while condition is true.',
      },
      {
        code: `// Different step sizes
console.log("Every 2nd:");
for (let i = 0; i < 10; i += 2) {
  console.log(i);  // 0, 2, 4, 6, 8
}

console.log("Every 3rd:");
for (let i = 0; i < 10; i += 3) {
  console.log(i);  // 0, 3, 6, 9
}

// Nested loops (multiplication table)
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(i + " x " + j + " = " + (i * j));
  }
}`,
        explanation: 'Change the increment (i += 2) for different step sizes. Nest loops for 2D operations like tables or grids.',
      },
      {
        code: `// Building results with for loop
let numbers = [1, 2, 3, 4, 5];

// Sum
let sum = 0;
for (let i = 0; i < numbers.length; i++) {
  sum += numbers[i];
}
console.log("Sum:", sum);

// Find maximum
let max = numbers[0];
for (let i = 1; i < numbers.length; i++) {
  if (numbers[i] > max) {
    max = numbers[i];
  }
}
console.log("Max:", max);

// Build new array
let doubled: number[] = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}
console.log("Doubled:", doubled);`,
        explanation: 'For loops are great for accumulating results - sums, max/min, or building new arrays element by element.',
      },
    ],
  },
  {
    term: 'For...of Loop',
    definition: 'A simpler way to loop through arrays and other iterable objects.',
    example: 'for (let item of array) { }',
    category: 'control-flow',
    contextExamples: [
      {
        code: `let fruits = ["apple", "banana", "cherry"];

// for...of gives you the values directly
for (let fruit of fruits) {
  console.log(fruit);
}

// Works with strings too
let word = "Hello";
for (let char of word) {
  console.log(char);
}

// Sum numbers
let numbers = [10, 20, 30];
let sum = 0;
for (let num of numbers) {
  sum += num;
}
console.log("Sum:", sum);`,
        explanation: 'For...of iterates over values directly - cleaner than traditional for loops when you don\'t need the index.',
      },
      {
        code: `// for...of vs for...in
let arr = ["a", "b", "c"];

console.log("for...of (values):");
for (let value of arr) {
  console.log(value);  // "a", "b", "c"
}

console.log("for...in (keys/indices):");
for (let index in arr) {
  console.log(index);  // "0", "1", "2" (strings!)
}

// for...in is for object keys
let person = { name: "Alice", age: 28 };
for (let key in person) {
  console.log(key + ":", person[key]);
}`,
        explanation: 'for...of iterates values (arrays, strings). for...in iterates keys (object properties). Don\'t mix them up!',
      },
      {
        code: `// When you need the index with for...of
let colors = ["red", "green", "blue"];

// Method 1: entries() gives [index, value] pairs
for (let [index, color] of colors.entries()) {
  console.log(index + ": " + color);
}

// Method 2: forEach (alternative)
colors.forEach((color, index) => {
  console.log(index + ": " + color);
});

// for...of with Map
let scores = new Map([["Alice", 90], ["Bob", 85]]);
for (let [name, score] of scores) {
  console.log(name + " scored " + score);
}`,
        explanation: 'Use .entries() to get both index and value. for...of also works with Maps, Sets, and other iterables.',
      },
    ],
  },
  {
    term: 'While Loop',
    definition: 'Repeats code as long as a condition is true. Useful when you don\'t know how many iterations you need.',
    example: 'while (condition) { }',
    category: 'control-flow',
    contextExamples: [
      {
        code: `// Basic while loop
let count = 0;
while (count < 5) {
  console.log("Count:", count);
  count++;
}

// Unknown number of iterations
let num = 12345;
let digits = 0;
while (num > 0) {
  digits++;
  num = Math.floor(num / 10);
}
console.log("Digits:", digits);`,
        explanation: 'While loops repeat until the condition becomes false. Make sure the condition eventually becomes false to avoid infinite loops!',
      },
      {
        code: `// do...while - runs at least once
let input = "";

// This always runs at least once
do {
  input = "valid"; // Simulating user input
  console.log("Processing:", input);
} while (input === "");

// Compare to while
let count = 0;
while (count > 0) {
  console.log("This never runs");
}

count = 0;
do {
  console.log("This runs once!");
} while (count > 0);`,
        explanation: 'do...while always runs the body at least once, then checks the condition. Regular while checks first.',
      },
      {
        code: `// While for reading/processing until done
let queue = ["task1", "task2", "task3"];

while (queue.length > 0) {
  let task = queue.shift();  // Remove first item
  console.log("Processing:", task);
}
console.log("Queue empty!");

// While with complex conditions
let attempts = 0;
let success = false;

while (!success && attempts < 3) {
  attempts++;
  console.log("Attempt", attempts);
  success = attempts === 2;  // Simulate success on 2nd try
}

console.log(success ? "Succeeded!" : "Failed after 3 attempts");`,
        explanation: 'While loops are ideal when you don\'t know the number of iterations upfront - processing queues, retrying operations.',
      },
    ],
  },
  {
    term: 'Break',
    definition: 'Immediately exits a loop, skipping any remaining iterations.',
    example: 'if (found) break;',
    category: 'control-flow',
    contextExamples: [
      {
        code: `// Exit loop when target found
let numbers = [1, 3, 7, 9, 12, 15];
let target = 9;

for (let num of numbers) {
  console.log("Checking:", num);
  if (num === target) {
    console.log("Found it!");
    break; // exit immediately
  }
}
console.log("Search complete");`,
        explanation: 'Break stops the loop immediately. Useful for searching - no need to continue once you\'ve found what you\'re looking for.',
      },
      {
        code: `// Break from while loop
let attempts = 0;
let maxAttempts = 10;

while (true) {  // Infinite loop - must break!
  attempts++;
  console.log("Attempt", attempts);

  let success = attempts === 3;  // Simulate success

  if (success) {
    console.log("Success!");
    break;
  }

  if (attempts >= maxAttempts) {
    console.log("Max attempts reached");
    break;
  }
}

console.log("Finished after", attempts, "attempts");`,
        explanation: 'Break is essential with while(true) loops. Always ensure there\'s a break condition to avoid infinite loops.',
      },
      {
        code: `// Break only exits the innermost loop
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    console.log(i, j);
    if (j === 1) {
      break;  // Only breaks inner loop
    }
  }
}

console.log("---");

// Labeled break to exit outer loop
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    console.log(i, j);
    if (i === 1 && j === 1) {
      break outer;  // Breaks outer loop!
    }
  }
}`,
        explanation: 'Break exits only the current loop. Use labeled breaks (break labelName) to exit outer loops from nested loops.',
      },
    ],
  },
  {
    term: 'Continue',
    definition: 'Skips the rest of the current iteration and moves to the next one.',
    example: 'if (skip) continue;',
    category: 'control-flow',
    contextExamples: [
      {
        code: `// Skip even numbers
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    continue; // skip to next iteration
  }
  console.log(i); // only odd numbers
}

// Skip invalid entries
let data = [1, -2, 3, -4, 5];
let sum = 0;
for (let num of data) {
  if (num < 0) continue; // skip negatives
  sum += num;
}
console.log("Sum of positives:", sum);`,
        explanation: 'Continue skips the rest of the current loop iteration and jumps to the next one. Loop continues running.',
      },
      {
        code: `// Continue for filtering during processing
interface User {
  name: string;
  active: boolean;
  email?: string;
}

let users: User[] = [
  { name: "Alice", active: true, email: "alice@test.com" },
  { name: "Bob", active: false },
  { name: "Charlie", active: true, email: "charlie@test.com" },
];

console.log("Active users with email:");
for (let user of users) {
  if (!user.active) continue;
  if (!user.email) continue;
  console.log(user.name, user.email);
}`,
        explanation: 'Multiple continues can filter data step by step. Each continue skips to the next item.',
      },
      {
        code: `// Continue vs filtering with array methods
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// With continue
console.log("With continue:");
for (let n of numbers) {
  if (n % 2 === 0) continue;
  if (n > 7) continue;
  console.log(n);  // 1, 3, 5, 7
}

// Same result with filter (often preferred)
console.log("With filter:");
let result = numbers.filter(n => n % 2 !== 0 && n <= 7);
console.log(result);

// Use continue when you need side effects
// Use filter when building a new array`,
        explanation: 'Continue is useful for imperative loops. For pure data transformation, filter() is often cleaner.',
      },
    ],
  },
  {
    term: 'Try/Catch',
    definition: 'A way to handle errors gracefully. Try runs code that might fail, catch handles any errors.',
    example: 'try { } catch (error) { }',
    category: 'control-flow',
    contextExamples: [
      {
        code: `function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 2));  // 5
  console.log(divide(10, 0));  // throws error
  console.log("This won't run");
} catch (error) {
  console.log("Error caught:", error.message);
}

console.log("Program continues");`,
        explanation: 'Try/catch prevents errors from crashing your program. Code in try runs until an error, then catch handles it.',
      },
      {
        code: `// finally always runs
function riskyOperation() {
  console.log("Starting operation...");

  try {
    console.log("Trying risky thing...");
    throw new Error("Something went wrong!");
    console.log("This never runs");
  } catch (error) {
    console.log("Caught:", error.message);
  } finally {
    console.log("Cleanup - this ALWAYS runs");
  }

  console.log("After try/catch/finally");
}

riskyOperation();`,
        explanation: 'finally runs whether there was an error or not. Perfect for cleanup like closing files or connections.',
      },
      {
        code: `// Different error types
function processData(data: string) {
  try {
    if (!data) {
      throw new Error("Data is required");
    }

    let parsed = JSON.parse(data);
    console.log("Parsed:", parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("Invalid JSON format");
    } else if (error instanceof Error) {
      console.log("Error:", error.message);
    } else {
      console.log("Unknown error");
    }
  }
}

processData("");
processData("{invalid json}");
processData('{"valid": true}');`,
        explanation: 'Use instanceof to handle different error types. You can catch specific errors and respond appropriately.',
      },
    ],
  },

  // ===== OBJECTS & OOP =====
  {
    term: 'Property',
    definition: 'A key-value pair that belongs to an object. The data stored inside an object.',
    example: 'user.name, user["age"]',
    category: 'objects',
    contextExamples: [
      {
        code: `let user = {
  name: "Alice",   // 'name' is a property
  age: 28,         // 'age' is a property
  city: "NYC"      // 'city' is a property
};

// Access properties
console.log(user.name);      // dot notation
console.log(user["age"]);    // bracket notation

// Modify properties
user.age = 29;
user["city"] = "LA";

// Add new properties
user.email = "alice@example.com";
console.log(user);`,
        explanation: 'Properties are the data inside objects. Access with dot notation (user.name) or brackets (user["name"]).',
      },
      {
        code: `// Dynamic property access
let person = { name: "Alice", age: 28, job: "Developer" };

// Access property using variable
let field = "name";
console.log(person[field]);  // "Alice"

// Loop through all properties
for (let key in person) {
  console.log(key + ": " + person[key]);
}

// Get property names as array
let keys = Object.keys(person);
console.log(keys);  // ["name", "age", "job"]

// Get property values as array
let values = Object.values(person);
console.log(values);  // ["Alice", 28, "Developer"]`,
        explanation: 'Use bracket notation for dynamic property access. Object.keys/values give arrays of properties.',
      },
      {
        code: `// Checking if properties exist
let user = { name: "Alice", email: null };

// Check with 'in' operator
console.log("name" in user);    // true
console.log("age" in user);     // false

// Check with hasOwnProperty
console.log(user.hasOwnProperty("name"));  // true

// Optional chaining for nested properties
let data = { user: { profile: { name: "Alice" } } };
console.log(data?.user?.profile?.name);    // "Alice"
console.log(data?.user?.settings?.theme);  // undefined

// Delete a property
delete user.email;
console.log(user);`,
        explanation: 'Check property existence with "in" or hasOwnProperty. Use optional chaining for safe nested access.',
      },
    ],
  },
  {
    term: 'Method',
    definition: "A function that belongs to an object. Something the object can do.",
    example: '"hello".toUpperCase()',
    category: 'objects',
    contextExamples: [
      {
        code: `// Built-in methods
let message = "hello";
console.log(message.toUpperCase()); // "HELLO"

let numbers = [3, 1, 4];
console.log(numbers.join("-")); // "3-1-4"

// Object with custom method
let calculator = {
  add: function(a: number, b: number) {
    return a + b;
  },
  multiply(a: number, b: number) { // shorthand
    return a * b;
  }
};

console.log(calculator.add(5, 3));
console.log(calculator.multiply(4, 2));`,
        explanation: 'Methods are functions attached to objects. Call them with object.method(). Strings and arrays have many built-in methods.',
      },
      {
        code: `// Method chaining
let result = "  Hello World  "
  .trim()           // Remove whitespace
  .toLowerCase()    // Make lowercase
  .replace("world", "TypeScript")
  .split(" ");      // Split into array

console.log(result);  // ["hello", "typescript"]

// Custom chainable methods
let counter = {
  value: 0,
  add(n: number) {
    this.value += n;
    return this;  // Return 'this' for chaining
  },
  subtract(n: number) {
    this.value -= n;
    return this;
  }
};

counter.add(10).subtract(3).add(5);
console.log(counter.value);  // 12`,
        explanation: 'Methods can return "this" to enable chaining. Many built-in methods are chainable.',
      },
      {
        code: `// Methods that modify vs return new values
let arr = [3, 1, 4, 1, 5];

// Methods that modify the original
arr.sort();
console.log(arr);  // [1, 1, 3, 4, 5] (original changed)

arr.reverse();
console.log(arr);  // [5, 4, 3, 1, 1] (original changed)

// Methods that return new values
let arr2 = [1, 2, 3];
let mapped = arr2.map(n => n * 2);
console.log(arr2);    // [1, 2, 3] (unchanged)
console.log(mapped);  // [2, 4, 6] (new array)

let filtered = arr2.filter(n => n > 1);
console.log(arr2);      // [1, 2, 3] (unchanged)
console.log(filtered);  // [2, 3] (new array)`,
        explanation: 'Some methods mutate the original (sort, reverse). Others return new values (map, filter). Know the difference!',
      },
    ],
  },
  {
    term: 'This',
    definition: 'A keyword that refers to the current object. Inside a method, "this" is the object that owns the method.',
    example: 'this.name, this.calculate()',
    category: 'objects',
    contextExamples: [
      {
        code: `let person = {
  name: "Alice",
  age: 28,
  introduce() {
    // 'this' refers to 'person'
    console.log("I'm " + this.name);
    console.log("I'm " + this.age + " years old");
  },
  birthday() {
    this.age++;
    console.log("Now I'm " + this.age);
  }
};

person.introduce();
person.birthday();`,
        explanation: '"this" refers to the object the method is called on. It lets methods access other properties and methods of the same object.',
      },
      {
        code: `// 'this' changes based on how function is called
let user = {
  name: "Alice",
  greet() {
    console.log("Hi, I'm " + this.name);
  }
};

user.greet();  // "Hi, I'm Alice"

// Problem: 'this' is lost when passing method as callback
let greetFn = user.greet;
// greetFn();  // Error! 'this' is undefined

// Solution 1: bind
let boundGreet = user.greet.bind(user);
boundGreet();  // "Hi, I'm Alice"

// Solution 2: arrow function wrapper
let arrowGreet = () => user.greet();
arrowGreet();  // "Hi, I'm Alice"`,
        explanation: '"this" depends on how the function is called, not where it\'s defined. Use bind or arrow functions to preserve it.',
      },
      {
        code: `// 'this' in classes
class Counter {
  count: number = 0;

  // Regular method - 'this' works correctly
  increment() {
    this.count++;
    console.log(this.count);
  }

  // Arrow function preserves 'this'
  incrementArrow = () => {
    this.count++;
    console.log(this.count);
  }
}

let counter = new Counter();
counter.increment();  // 1

// Safe to pass as callback
setTimeout(counter.incrementArrow, 100);

// Arrow methods are bound to the instance
let inc = counter.incrementArrow;
inc();  // Works! 'this' is preserved`,
        explanation: 'In classes, arrow function properties automatically bind "this". Regular methods might lose "this" when passed as callbacks.',
      },
    ],
  },
  {
    term: 'Class',
    definition: 'A blueprint for creating objects with the same structure and behavior. Template for making multiple similar things.',
    example: 'class Person { }',
    category: 'objects',
    contextExamples: [
      {
        code: `class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(\`Hi, I'm \${this.name}\`);
  }
}

let alice = new Person("Alice", 28);
let bob = new Person("Bob", 35);

alice.greet();
bob.greet();
console.log(alice.age);`,
        explanation: 'Classes are templates. The constructor initializes new objects. Methods are shared by all instances.',
      },
      {
        code: `// TypeScript parameter properties shorthand
class User {
  // Shorthand: declare and initialize in constructor params
  constructor(
    public name: string,
    public email: string,
    private password: string
  ) {}

  checkPassword(input: string): boolean {
    return this.password === input;
  }
}

let user = new User("Alice", "alice@test.com", "secret");
console.log(user.name);   // "Alice"
console.log(user.email);  // "alice@test.com"
// console.log(user.password);  // Error! Private

console.log(user.checkPassword("secret"));  // true`,
        explanation: 'TypeScript\'s parameter properties (public/private in constructor) create and initialize properties in one step.',
      },
      {
        code: `// Access modifiers
class BankAccount {
  public owner: string;        // Anyone can access
  private balance: number;     // Only this class
  protected accountId: string; // This class + subclasses

  constructor(owner: string) {
    this.owner = owner;
    this.balance = 0;
    this.accountId = Math.random().toString();
  }

  deposit(amount: number) {
    if (amount > 0) this.balance += amount;
  }

  getBalance() {
    return this.balance;
  }
}

let account = new BankAccount("Alice");
console.log(account.owner);      // "Alice"
account.deposit(100);
console.log(account.getBalance()); // 100
// account.balance = 1000000;  // Error! Private`,
        explanation: 'public = accessible anywhere. private = only inside class. protected = class and subclasses.',
      },
    ],
  },
  {
    term: 'Constructor',
    definition: 'A special method that runs when creating a new instance of a class. Sets up the initial state.',
    example: 'constructor(name) { this.name = name; }',
    category: 'objects',
    contextExamples: [
      {
        code: `class BankAccount {
  owner: string;
  balance: number;

  constructor(owner: string, initialDeposit: number = 0) {
    this.owner = owner;
    this.balance = initialDeposit;
    console.log(\`Account created for \${owner}\`);
  }

  deposit(amount: number) {
    this.balance += amount;
  }
}

let account1 = new BankAccount("Alice", 100);
let account2 = new BankAccount("Bob");

console.log(account1.balance); // 100
console.log(account2.balance); // 0`,
        explanation: 'Constructor runs automatically when you use "new". It initializes the object\'s properties.',
      },
      {
        code: `// Validation in constructor
class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    if (!name || name.length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }

    this.name = name;
    this.email = email;
    console.log("User created:", name);
  }
}

try {
  let user1 = new User("Alice", "alice@test.com");  // OK
  let user2 = new User("A", "invalid");             // Error!
} catch (e) {
  console.log("Failed:", e.message);
}`,
        explanation: 'Constructors can validate input and throw errors for invalid data. Objects with bad data never get created.',
      },
      {
        code: `// Constructor with complex initialization
class TodoList {
  items: string[];
  createdAt: Date;
  id: string;

  constructor(initialItems: string[] = []) {
    this.items = [...initialItems];  // Copy array
    this.createdAt = new Date();
    this.id = Math.random().toString(36).slice(2);
    console.log("List created at:", this.createdAt);
  }

  add(item: string) {
    this.items.push(item);
  }
}

let list1 = new TodoList();
let list2 = new TodoList(["Buy milk", "Walk dog"]);

console.log(list1.items);  // []
console.log(list2.items);  // ["Buy milk", "Walk dog"]
console.log(list1.id !== list2.id);  // true (unique IDs)`,
        explanation: 'Constructors can generate IDs, copy arrays (to avoid sharing), and set up any initial state needed.',
      },
    ],
  },
  {
    term: 'Instance',
    definition: 'A specific object created from a class. Each instance has its own data but shares the class methods.',
    example: 'let user = new User("Alice");',
    category: 'objects',
    contextExamples: [
      {
        code: `class Dog {
  name: string;
  breed: string;

  constructor(name: string, breed: string) {
    this.name = name;
    this.breed = breed;
  }

  bark() {
    console.log(this.name + " says woof!");
  }
}

// Each 'new' creates a separate instance
let dog1 = new Dog("Max", "Labrador");
let dog2 = new Dog("Bella", "Poodle");

// Same class, different data
dog1.bark(); // "Max says woof!"
dog2.bark(); // "Bella says woof!"`,
        explanation: 'Instances are individual objects created from a class. Each has its own property values but shares methods.',
      },
      {
        code: `// Checking instance type
class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

let dog = new Dog();
let cat = new Cat();

console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true (Dog extends Animal)
console.log(dog instanceof Cat);    // false

// Useful for type checking
function makeSound(animal: Animal) {
  if (animal instanceof Dog) {
    console.log("Woof!");
  } else if (animal instanceof Cat) {
    console.log("Meow!");
  }
}

makeSound(dog);
makeSound(cat);`,
        explanation: 'instanceof checks if an object is an instance of a class (or its parent classes). Useful for type narrowing.',
      },
      {
        code: `// Instances are independent
class Counter {
  count: number = 0;

  increment() {
    this.count++;
  }
}

let counter1 = new Counter();
let counter2 = new Counter();

counter1.increment();
counter1.increment();
counter1.increment();
counter2.increment();

console.log(counter1.count);  // 3
console.log(counter2.count);  // 1 (separate)

// Instances share method references
console.log(counter1.increment === counter2.increment);  // true`,
        explanation: 'Each instance has its own properties, but methods are shared (same function in memory). Changes to one instance don\'t affect others.',
      },
    ],
  },
  {
    term: 'Inheritance',
    definition: 'A class can inherit properties and methods from another class. Child class extends parent class.',
    example: 'class Dog extends Animal { }',
    category: 'objects',
    contextExamples: [
      {
        code: `class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak() {
    console.log(this.name + " makes a sound");
  }
}

class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name); // call parent constructor
    this.breed = breed;
  }

  speak() { // override parent method
    console.log(this.name + " barks!");
  }
}

let dog = new Dog("Max", "Labrador");
dog.speak(); // "Max barks!"`,
        explanation: 'Inheritance lets classes share code. Child class gets parent\'s properties/methods and can add or override them.',
      },
      {
        code: `// Using super to call parent methods
class Vehicle {
  brand: string;

  constructor(brand: string) {
    this.brand = brand;
  }

  describe() {
    return "A vehicle by " + this.brand;
  }
}

class Car extends Vehicle {
  model: string;

  constructor(brand: string, model: string) {
    super(brand);  // MUST call super first
    this.model = model;
  }

  describe() {
    // Call parent method and extend it
    return super.describe() + ", model: " + this.model;
  }
}

let car = new Car("Toyota", "Camry");
console.log(car.describe());
console.log(car.brand);  // Inherited property`,
        explanation: 'super calls the parent\'s constructor or methods. Always call super() first in child constructor.',
      },
      {
        code: `// Multi-level inheritance
class LivingThing {
  alive: boolean = true;
}

class Animal extends LivingThing {
  move() {
    console.log("Moving...");
  }
}

class Bird extends Animal {
  fly() {
    console.log("Flying!");
  }
}

let bird = new Bird();
console.log(bird.alive);  // From LivingThing
bird.move();              // From Animal
bird.fly();               // From Bird

// Bird has everything from its entire ancestry`,
        explanation: 'Classes can extend classes that extend other classes. Each level inherits from all ancestors above it.',
      },
    ],
  },
  {
    term: 'Static',
    definition: 'A property or method that belongs to the class itself, not to instances. Shared by all instances.',
    example: 'static count = 0;',
    category: 'objects',
    contextExamples: [
      {
        code: `class User {
  static count = 0; // shared by all instances

  name: string;

  constructor(name: string) {
    this.name = name;
    User.count++; // access via class name
  }

  static getCount() {
    return User.count;
  }
}

let user1 = new User("Alice");
let user2 = new User("Bob");
let user3 = new User("Charlie");

console.log(User.count);      // 3
console.log(User.getCount()); // 3`,
        explanation: 'Static members belong to the class, not instances. Access them on the class itself (User.count, not user.count).',
      },
      {
        code: `// Static methods as utilities
class MathHelper {
  static PI = 3.14159;

  static square(n: number): number {
    return n * n;
  }

  static cube(n: number): number {
    return n * n * n;
  }

  static circleArea(radius: number): number {
    return MathHelper.PI * radius * radius;
  }
}

// Use without creating instance
console.log(MathHelper.PI);
console.log(MathHelper.square(5));
console.log(MathHelper.circleArea(3));

// No 'new' needed - static methods are on the class`,
        explanation: 'Static methods work like utility functions. No instance needed - call directly on the class name.',
      },
      {
        code: `// Factory pattern with static methods
class User {
  constructor(
    public name: string,
    public role: string
  ) {}

  static createAdmin(name: string) {
    return new User(name, "admin");
  }

  static createGuest() {
    return new User("Guest", "guest");
  }
}

let admin = User.createAdmin("Alice");
let guest = User.createGuest();

console.log(admin.name, admin.role);  // "Alice" "admin"
console.log(guest.name, guest.role);  // "Guest" "guest"

// Static factory methods create pre-configured instances`,
        explanation: 'Static factory methods create instances with preset configurations. Cleaner than many constructor parameters.',
      },
    ],
  },
  {
    term: 'Getter',
    definition: 'A method that gets a property value. Looks like a property but can have logic behind it.',
    example: 'get fullName() { return this.first + " " + this.last; }',
    category: 'objects',
    contextExamples: [
      {
        code: `class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // Getter - accessed like a property
  get area() {
    return this.width * this.height;
  }

  get perimeter() {
    return 2 * (this.width + this.height);
  }
}

let rect = new Rectangle(5, 3);
console.log(rect.area);      // 15 (no parentheses!)
console.log(rect.perimeter); // 16`,
        explanation: 'Getters are accessed like properties but can compute values. No parentheses needed when accessing.',
      },
      {
        code: `// Getters for derived/computed values
class Person {
  firstName: string;
  lastName: string;
  birthYear: number;

  constructor(firstName: string, lastName: string, birthYear: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthYear = birthYear;
  }

  get fullName() {
    return this.firstName + " " + this.lastName;
  }

  get age() {
    return new Date().getFullYear() - this.birthYear;
  }
}

let person = new Person("Alice", "Smith", 1995);
console.log(person.fullName);  // "Alice Smith"
console.log(person.age);       // Calculated from current year`,
        explanation: 'Getters are perfect for values derived from other properties. They compute fresh values each time accessed.',
      },
      {
        code: `// Getters for formatted output
class Product {
  name: string;
  priceInCents: number;

  constructor(name: string, priceInCents: number) {
    this.name = name;
    this.priceInCents = priceInCents;
  }

  get priceInDollars() {
    return this.priceInCents / 100;
  }

  get formattedPrice() {
    return "$" + this.priceInDollars.toFixed(2);
  }

  get summary() {
    return this.name + " - " + this.formattedPrice;
  }
}

let product = new Product("Widget", 1999);
console.log(product.priceInDollars);  // 19.99
console.log(product.formattedPrice);  // "$19.99"
console.log(product.summary);         // "Widget - $19.99"`,
        explanation: 'Getters can chain - one getter can use another. Great for formatting and summarizing data.',
      },
    ],
  },
  {
    term: 'Setter',
    definition: 'A method that sets a property value. Can include validation or trigger side effects.',
    example: 'set age(value) { this._age = value; }',
    category: 'objects',
    contextExamples: [
      {
        code: `class Person {
  private _age: number = 0;

  get age() {
    return this._age;
  }

  set age(value: number) {
    if (value < 0) {
      console.log("Age cannot be negative!");
      return;
    }
    this._age = value;
  }
}

let person = new Person();
person.age = 25;     // uses setter
console.log(person.age); // uses getter

person.age = -5;     // "Age cannot be negative!"
console.log(person.age); // still 25`,
        explanation: 'Setters let you control how properties are assigned. Great for validation. Uses = like a property, not ().',
      },
      {
        code: `// Setter with transformation
class Temperature {
  private _celsius: number = 0;

  get celsius() {
    return this._celsius;
  }

  set celsius(value: number) {
    this._celsius = value;
  }

  get fahrenheit() {
    return this._celsius * 9/5 + 32;
  }

  set fahrenheit(value: number) {
    // Convert and store as celsius
    this._celsius = (value - 32) * 5/9;
  }
}

let temp = new Temperature();
temp.celsius = 100;
console.log(temp.fahrenheit);  // 212

temp.fahrenheit = 32;
console.log(temp.celsius);     // 0`,
        explanation: 'Setters can transform values before storing. Store one value internally, expose multiple views.',
      },
      {
        code: `// Setter with logging/tracking
class User {
  private _name: string;
  private _changeLog: string[] = [];

  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._changeLog.push(\`Changed from "\${this._name}" to "\${value}"\`);
    this._name = value;
  }

  get history() {
    return this._changeLog;
  }
}

let user = new User("Alice");
user.name = "Bob";
user.name = "Charlie";

console.log(user.name);     // "Charlie"
console.log(user.history);  // Shows all changes`,
        explanation: 'Setters can trigger side effects like logging. Useful for tracking changes or triggering updates.',
      },
    ],
  },

  // ===== TYPESCRIPT SPECIFIC =====
  {
    term: 'Type Annotation',
    definition: 'Explicitly telling TypeScript what type a variable should be. Written with a colon after the name.',
    example: 'let name: string = "Alice";',
    category: 'typescript',
    contextExamples: [
      {
        code: `let username: string = "alice";
let age: number = 25;
let isActive: boolean = true;
let scores: number[] = [85, 90, 78];

function greet(name: string): string {
  return "Hello, " + name;
}

console.log(greet(username));`,
        explanation: 'Type annotations tell TypeScript what to expect. TypeScript warns if you use the wrong type.',
      },
      {
        code: `// When to use annotations vs let TypeScript infer

// No annotation needed - TypeScript infers from value
let name = "Alice";       // TypeScript knows: string
let count = 42;           // TypeScript knows: number
let items = [1, 2, 3];    // TypeScript knows: number[]

// Annotation needed - no initial value
let score: number;
score = 100;

// Annotation needed - complex types
let user: { name: string; age: number };
user = { name: "Bob", age: 30 };

// Annotation needed - function parameters
function double(x: number): number {
  return x * 2;
}

console.log(double(5));`,
        explanation: 'Use annotations when TypeScript can\'t infer the type - no initial value, complex types, or function parameters.',
      },
      {
        code: `// Type annotations for different scenarios
// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Objects
let point: { x: number; y: number } = { x: 10, y: 20 };

// Functions as variables
let multiply: (a: number, b: number) => number;
multiply = (a, b) => a * b;

// Union types
let id: string | number = "ABC123";
id = 456;

// Optional with default undefined
let maybeValue: string | undefined;

console.log(multiply(3, 4));
console.log(id);`,
        explanation: 'Annotations work with arrays, objects, function types, unions, and more. Syntax varies by type.',
      },
    ],
  },
  {
    term: 'Interface',
    definition: 'A blueprint that defines the shape of an object. Describes what properties an object must have.',
    example: 'interface Person { name: string; }',
    category: 'typescript',
    contextExamples: [
      {
        code: `interface User {
  name: string;
  email: string;
  age: number;
}

function printUser(user: User) {
  console.log(user.name + " (" + user.email + ")");
}

let alice: User = {
  name: "Alice",
  email: "alice@example.com",
  age: 28
};

printUser(alice);`,
        explanation: 'Interfaces define object shapes. Any object must have all required properties with correct types.',
      },
      {
        code: `// Interfaces with optional and readonly
interface Product {
  readonly id: number;    // Cannot be changed
  name: string;
  price: number;
  description?: string;   // Optional
}

let laptop: Product = {
  id: 1,
  name: "Laptop",
  price: 999
  // description is optional
};

laptop.name = "Gaming Laptop";  // OK
// laptop.id = 2;               // Error! readonly

console.log(laptop);`,
        explanation: 'Use readonly for immutable properties, ? for optional ones. Objects must match the interface shape.',
      },
      {
        code: `// Extending interfaces
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

let myDog: Dog = {
  name: "Max",
  age: 3,
  breed: "Labrador",
  bark() {
    console.log("Woof!");
  }
};

myDog.bark();
console.log(myDog.name, myDog.breed);`,
        explanation: 'Interfaces can extend other interfaces. The child interface inherits all properties and can add more.',
      },
    ],
  },
  {
    term: 'Type Alias',
    definition: 'A custom name for a type. Can represent primitives, unions, objects, or complex types.',
    example: 'type ID = string | number;',
    category: 'typescript',
    contextExamples: [
      {
        code: `// Simple type alias
type ID = string | number;
type Status = "pending" | "active" | "done";

let orderId: ID = "ABC123";
let userId: ID = 42;
let status: Status = "active";

// Object type alias
type Point = {
  x: number;
  y: number;
};

let location: Point = { x: 10, y: 20 };
console.log(location);`,
        explanation: 'Type aliases create reusable type names. Great for unions, complex types, or making code clearer.',
      },
      {
        code: `// Type alias vs Interface
// Type alias - for unions, primitives, tuples
type ID = string | number;
type Coordinates = [number, number];
type StringOrNull = string | null;

// Interface - for objects (can extend, merge)
interface User {
  name: string;
}

// Type alias for objects also works
type Product = {
  name: string;
  price: number;
};

let coords: Coordinates = [10, 20];
let product: Product = { name: "Widget", price: 9.99 };

console.log(coords);
console.log(product);`,
        explanation: 'Type aliases work with any type. Interfaces are better for objects that might be extended. Both work!',
      },
      {
        code: `// Combining type aliases
type Name = string;
type Age = number;

type Person = {
  name: Name;
  age: Age;
};

type Employee = Person & {
  employeeId: string;
  department: string;
};

let employee: Employee = {
  name: "Alice",
  age: 30,
  employeeId: "E001",
  department: "Engineering"
};

console.log(employee.name, employee.department);`,
        explanation: 'Type aliases can reference other type aliases. Use & to combine (intersection) types.',
      },
    ],
  },
  {
    term: 'Union Type',
    definition: 'A type that can be one of several types. Written with | (pipe) symbol.',
    example: 'let id: string | number;',
    category: 'typescript',
    contextExamples: [
      {
        code: `function printId(id: string | number) {
  if (typeof id === "string") {
    console.log("String ID:", id.toUpperCase());
  } else {
    console.log("Number ID:", id * 2);
  }
}

printId("abc");  // "String ID: ABC"
printId(123);    // "Number ID: 246"`,
        explanation: 'Union types use | for "either/or". Use typeof to check which type you have before using type-specific methods.',
      },
      {
        code: `// Union with literal types
type Status = "loading" | "success" | "error";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function handleStatus(status: Status) {
  switch (status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log("Done!");
      break;
    case "error":
      console.log("Failed!");
      break;
  }
}

handleStatus("success");
// handleStatus("pending");  // Error! Not in union`,
        explanation: 'Union with literals creates a set of allowed values. TypeScript ensures you only use valid options.',
      },
      {
        code: `// Union in return types and arrays
function parse(input: string): number | null {
  let result = parseInt(input);
  return isNaN(result) ? null : result;
}

console.log(parse("42"));     // 42
console.log(parse("hello"));  // null

// Array of union type
let mixed: (string | number)[] = [1, "two", 3, "four"];
console.log(mixed);

// Object with union property
interface Response {
  data: string | string[] | null;
}

let r1: Response = { data: "hello" };
let r2: Response = { data: ["a", "b"] };
let r3: Response = { data: null };`,
        explanation: 'Unions work in return types, arrays, and object properties. Wrap array unions in parentheses.',
      },
    ],
  },
  {
    term: 'Generic',
    definition: 'A way to create reusable code that works with multiple types. Type is specified when used.',
    example: 'function identity<T>(value: T): T { return value; }',
    category: 'typescript',
    contextExamples: [
      {
        code: `// Generic function
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

let nums = [1, 2, 3];
let strs = ["a", "b", "c"];

console.log(firstElement(nums)); // 1 (type: number)
console.log(firstElement(strs)); // "a" (type: string)

// Generic interface
interface Box<T> {
  value: T;
}

let numBox: Box<number> = { value: 42 };
let strBox: Box<string> = { value: "hello" };`,
        explanation: 'Generics let you write flexible, reusable code. T is a placeholder for a type that\'s determined when you use it.',
      },
      {
        code: `// Multiple generic types
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

let result = pair("hello", 42);
console.log(result);  // ["hello", 42]

// Generic with constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log("Length:", item.length);
}

logLength("hello");     // Length: 5
logLength([1, 2, 3]);   // Length: 3
// logLength(42);       // Error! number has no length`,
        explanation: 'Use multiple type parameters for functions with different types. Constraints (extends) limit what types are accepted.',
      },
      {
        code: `// Generic classes
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

let numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop());  // 2

let stringStack = new Stack<string>();
stringStack.push("a");
stringStack.push("b");
console.log(stringStack.peek()); // "b"`,
        explanation: 'Generic classes work with any type you specify. Same class, different data types, full type safety.',
      },
    ],
  },
  {
    term: 'Type Guard',
    definition: 'A way to narrow down the type of a variable within a conditional block.',
    example: 'if (typeof x === "string") { }',
    category: 'typescript',
    contextExamples: [
      {
        code: `function process(value: string | number | boolean) {
  // typeof type guard
  if (typeof value === "string") {
    console.log("String length:", value.length);
  } else if (typeof value === "number") {
    console.log("Doubled:", value * 2);
  } else {
    console.log("Boolean:", value ? "yes" : "no");
  }
}

process("hello");
process(42);
process(true);`,
        explanation: 'Type guards narrow types inside conditions. TypeScript knows the exact type after the check.',
      },
      {
        code: `// instanceof type guard (for classes)
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();  // TypeScript knows it's Dog
  } else {
    animal.meow();  // TypeScript knows it's Cat
  }
}

speak(new Dog());
speak(new Cat());`,
        explanation: 'Use instanceof for class-based types. TypeScript narrows the type inside each branch.',
      },
      {
        code: `// 'in' type guard and custom type guards
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function move(animal: Fish | Bird) {
  // 'in' checks if property exists
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// Custom type guard function
function isFish(animal: Fish | Bird): animal is Fish {
  return "swim" in animal;
}

let creature: Fish | Bird = { swim: () => console.log("Swimming") };
if (isFish(creature)) {
  creature.swim();
}`,
        explanation: 'Use "in" to check for properties. Custom type guard functions use "value is Type" syntax.',
      },
    ],
  },
  {
    term: 'Type Inference',
    definition: 'TypeScript automatically figures out the type based on the value. You don\'t always need to write types.',
    example: 'let name = "Alice"; // inferred as string',
    category: 'typescript',
    contextExamples: [
      {
        code: `// TypeScript infers types automatically
let name = "Alice";     // inferred as string
let age = 25;           // inferred as number
let active = true;      // inferred as boolean

let numbers = [1, 2, 3]; // inferred as number[]

// Function return type inferred
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}

console.log(typeof name);  // "string"
console.log(add(5, 3));    // 8`,
        explanation: 'TypeScript often infers types from values, so you don\'t need to write them explicitly. It\'s still type-safe!',
      },
      {
        code: `// Inference from context
let nums = [1, 2, 3];

// Callback parameter types inferred
nums.forEach(n => {
  console.log(n.toFixed(2));  // TypeScript knows n is number
});

// Map return type inferred
let doubled = nums.map(n => n * 2);  // number[]

// Object inference
let user = {
  name: "Alice",
  age: 30,
  active: true
};
// TypeScript infers: { name: string; age: number; active: boolean }

console.log(user.name.toUpperCase());`,
        explanation: 'TypeScript infers callback types and object shapes from context. Less typing, same safety.',
      },
      {
        code: `// When inference needs help
// Array with mixed types - inferred as (string | number)[]
let mixed = [1, "two", 3];

// Empty array - inferred as any[] (not helpful)
let empty = [];  // any[]
let items: number[] = [];  // Better! Annotate empty arrays

// const vs let affects inference
let changeable = "hello";   // type: string
const fixed = "hello";      // type: "hello" (literal)

// as const for literal inference
let colors = ["red", "blue"] as const;
// type: readonly ["red", "blue"]

console.log(mixed);
console.log(fixed);`,
        explanation: 'Empty arrays and const values have special inference. Use annotations or "as const" when needed.',
      },
    ],
  },
  {
    term: 'Literal Type',
    definition: 'A type that is a specific exact value, not just a general type like string or number.',
    example: 'type Direction = "up" | "down";',
    category: 'typescript',
    contextExamples: [
      {
        code: `// Literal types restrict to specific values
type Direction = "north" | "south" | "east" | "west";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function move(direction: Direction) {
  console.log("Moving " + direction);
}

move("north"); // OK
// move("up"); // Error! "up" is not in Direction

let roll: DiceRoll = 4; // OK
// roll = 7; // Error! 7 is not a valid dice roll`,
        explanation: 'Literal types are specific values, not just types. Great for finite sets of options.',
      },
      {
        code: `// Boolean literals and combinations
type TrueOnly = true;
type Answer = "yes" | "no" | "maybe";

function respond(answer: Answer) {
  console.log("You said:", answer);
}

respond("yes");
respond("no");
// respond("sure");  // Error!

// Object with literal types
interface Config {
  mode: "development" | "production" | "test";
  logLevel: 0 | 1 | 2;
}

let config: Config = {
  mode: "development",
  logLevel: 1
};

console.log(config);`,
        explanation: 'Literal types work with strings, numbers, and booleans. Combine with objects for strict configs.',
      },
      {
        code: `// as const for literal inference
const colors = ["red", "green", "blue"] as const;
// type: readonly ["red", "green", "blue"]

// Each element is its literal type
type Color = typeof colors[number];  // "red" | "green" | "blue"

function setColor(color: Color) {
  console.log("Setting color to", color);
}

setColor("red");      // OK
// setColor("purple"); // Error!

// Object literals with as const
const settings = {
  theme: "dark",
  version: 2
} as const;

// settings.theme is "dark", not string`,
        explanation: '"as const" makes values readonly with literal types. Great for deriving union types from arrays.',
      },
    ],
  },
  {
    term: 'Optional Property',
    definition: 'A property that may or may not exist on an object. Marked with a question mark.',
    example: 'interface User { email?: string; }',
    category: 'typescript',
    contextExamples: [
      {
        code: `interface User {
  name: string;       // required
  email?: string;     // optional
  age?: number;       // optional
}

let user1: User = { name: "Alice" };
let user2: User = { name: "Bob", email: "bob@example.com" };
let user3: User = { name: "Charlie", age: 30 };

console.log(user1.email); // undefined
console.log(user2.email); // "bob@example.com"

// Optional chaining is useful here
console.log(user1.email?.toUpperCase()); // undefined`,
        explanation: 'Optional properties (?) can be omitted when creating objects. Access them safely with optional chaining (?.).',
      },
      {
        code: `// Optional in function parameters
function createUser(
  name: string,
  email?: string,
  role?: string
) {
  return {
    name,
    email: email ?? "no email",
    role: role ?? "user"
  };
}

console.log(createUser("Alice"));
console.log(createUser("Bob", "bob@test.com"));
console.log(createUser("Charlie", "c@test.com", "admin"));`,
        explanation: 'Optional parameters must come after required ones. Use ?? to provide defaults for omitted values.',
      },
      {
        code: `// Optional vs undefined vs null
interface Profile {
  name: string;
  bio?: string;           // Optional - may not exist
  avatar: string | null;  // Required but can be null
}

let p1: Profile = {
  name: "Alice",
  avatar: null
  // bio is just missing - that's OK
};

let p2: Profile = {
  name: "Bob",
  bio: undefined,  // Explicitly undefined
  avatar: "pic.jpg"
};

console.log("bio" in p1);  // false (not present)
console.log("bio" in p2);  // true (present but undefined)`,
        explanation: 'Optional properties may not exist at all. undefined means "exists but no value". null means "intentionally empty".',
      },
    ],
  },
  {
    term: 'Readonly',
    definition: 'A modifier that prevents a property from being changed after initialization.',
    example: 'readonly id: number;',
    category: 'typescript',
    contextExamples: [
      {
        code: `interface User {
  readonly id: number;
  name: string;
}

let user: User = { id: 1, name: "Alice" };

user.name = "Bob";   // OK - name is not readonly
// user.id = 2;      // Error! id is readonly

// Readonly array
let numbers: readonly number[] = [1, 2, 3];
console.log(numbers[0]); // OK - reading
// numbers.push(4);      // Error! Cannot modify`,
        explanation: 'Readonly prevents modifications. Use for IDs, configs, or any data that shouldn\'t change.',
      },
      {
        code: `// Readonly utility type for entire objects
interface User {
  name: string;
  email: string;
}

// Make all properties readonly
type ReadonlyUser = Readonly<User>;

let user: ReadonlyUser = {
  name: "Alice",
  email: "alice@test.com"
};

// user.name = "Bob";  // Error! All properties are readonly

// Readonly in function parameters (prevents mutation)
function logUser(user: Readonly<User>) {
  console.log(user.name, user.email);
  // user.name = "X";  // Error! Can't modify
}

logUser({ name: "Bob", email: "bob@test.com" });`,
        explanation: 'Readonly<T> makes all properties of T readonly. Use in function parameters to prevent accidental mutations.',
      },
      {
        code: `// ReadonlyArray for immutable arrays
function processNumbers(nums: ReadonlyArray<number>) {
  // Can read and iterate
  console.log("First:", nums[0]);
  console.log("Length:", nums.length);
  nums.forEach(n => console.log(n));

  // Cannot modify
  // nums.push(4);      // Error!
  // nums[0] = 999;     // Error!
  // nums.sort();       // Error!
}

let numbers = [1, 2, 3];
processNumbers(numbers);

// Object.freeze at runtime (different from readonly)
const config = Object.freeze({
  apiUrl: "https://api.example.com",
  timeout: 5000
});

console.log(config.apiUrl);
// config.timeout = 10000;  // Fails silently or throws in strict mode`,
        explanation: 'ReadonlyArray prevents array mutations. Object.freeze is the runtime equivalent but less type-safe.',
      },
    ],
  },
  {
    term: 'Any Type',
    definition: 'A type that allows any value. Disables type checking. Use sparingly!',
    example: 'let value: any = "anything";',
    category: 'typescript',
    contextExamples: [
      {
        code: `// 'any' opts out of type checking
let flexible: any = "hello";
flexible = 42;       // OK
flexible = true;     // OK
flexible = [1, 2];   // OK

// No type errors, but also no help
console.log(flexible.toUpperCase()); // Runtime error!

// Better: use 'unknown' for truly unknown types
let safe: unknown = getData();
if (typeof safe === "string") {
  console.log(safe.toUpperCase()); // Type-safe
}

function getData(): unknown {
  return "hello";
}`,
        explanation: 'Any disables type checking - avoid when possible. Unknown is safer because it requires type checking before use.',
      },
      {
        code: `// When 'any' might be needed (migration, 3rd party)
// Migrating JavaScript to TypeScript gradually
function legacyFunction(data: any) {
  // Temporarily using any during migration
  return data.someProperty;
}

// Working with dynamic JSON data
let apiResponse: any = JSON.parse('{"name": "Alice"}');
console.log(apiResponse.name);

// Better approach: define a type
interface ApiResponse {
  name: string;
}

let typedResponse: ApiResponse = JSON.parse('{"name": "Bob"}');
console.log(typedResponse.name);

// Type assertion as alternative to any
let value = (apiResponse as ApiResponse).name;
console.log(value);`,
        explanation: 'Any is sometimes needed for migrations or dynamic data. Prefer defining types or using type assertions instead.',
      },
      {
        code: `// Dangers of 'any' - type errors at runtime
function dangerousAdd(a: any, b: any) {
  return a + b;  // No type safety!
}

console.log(dangerousAdd(5, 3));         // 8 (OK)
console.log(dangerousAdd("5", "3"));     // "53" (string concat!)
console.log(dangerousAdd("hello", 123)); // "hello123" (oops!)

// Safe alternative with generics or union types
function safeAdd(a: number, b: number): number {
  return a + b;
}

console.log(safeAdd(5, 3));  // 8
// safeAdd("5", "3");        // Error! Caught at compile time

// Using noImplicitAny in tsconfig helps avoid accidental any
// "compilerOptions": { "noImplicitAny": true }`,
        explanation: 'Any bypasses all type checks, causing runtime errors. Use strict mode and noImplicitAny to avoid unintentional any types.',
      },
    ],
  },
  {
    term: 'Void',
    definition: 'A type representing "no return value". Used for functions that don\'t return anything.',
    example: 'function log(msg: string): void { }',
    category: 'typescript',
    contextExamples: [
      {
        code: `// Function that doesn't return anything
function logMessage(message: string): void {
  console.log(message);
  // no return statement
}

logMessage("Hello!");

// Arrow function with void
const greet = (name: string): void => {
  console.log("Hi, " + name);
};

greet("World");

// Void is different from undefined
let result = logMessage("Test");
console.log(result); // undefined`,
        explanation: 'Void means "no return value." Functions with void can have return; but not return someValue;',
      },
      {
        code: `// Void in callback type definitions
type Logger = (message: string) => void;
type EventHandler = () => void;

// Callbacks often return void
let logger: Logger = (msg) => {
  console.log("[LOG]", msg);
};

let onClick: EventHandler = () => {
  console.log("Button clicked!");
};

logger("Application started");
onClick();

// Array methods expect void callbacks
let numbers = [1, 2, 3];
numbers.forEach((n): void => {
  console.log("Number:", n);
  // No return needed
});`,
        explanation: 'Void is common in callback types. It tells TypeScript the return value is intentionally ignored.',
      },
      {
        code: `// Void vs undefined vs never
// void: function doesn't return a value
function logInfo(msg: string): void {
  console.log(msg);
}

// undefined: explicitly returns undefined
function getNothing(): undefined {
  return undefined;
}

// never: function never returns (throws or infinite loop)
// function crash(): never { throw new Error("!"); }

// Void allows empty return
function process(data: string): void {
  if (!data) {
    return;  // OK - early exit
  }
  console.log("Processing:", data);
}

process("");
process("test");

// Void ignores any returned value
let nums = [1, 2, 3];
nums.forEach(n => n * 2);  // return value ignored
console.log(nums);  // Still [1, 2, 3]`,
        explanation: 'Void means "ignore return value." undefined is an actual value. never means the function cannot return normally.',
      },
    ],
  },
  {
    term: 'Never Type',
    definition: 'A type representing values that never occur. For functions that never return or always throw.',
    example: 'function fail(msg: string): never { throw new Error(msg); }',
    category: 'typescript',
    contextExamples: [
      {
        code: `// Function that never returns (throws)
function throwError(message: string): never {
  throw new Error(message);
}

// Function that never returns (infinite loop)
function infiniteLoop(): never {
  while (true) {
    console.log("Running...");
  }
}

// Useful for exhaustive checks
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI;
    case "square":
      return 1;
    default:
      // TypeScript knows this is unreachable
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}`,
        explanation: 'Never represents impossible situations. Functions that throw or loop forever return never.',
      },
      {
        code: `// Never in type narrowing
function processValue(value: string | number) {
  if (typeof value === "string") {
    console.log("String:", value.toUpperCase());
  } else if (typeof value === "number") {
    console.log("Number:", value.toFixed(2));
  } else {
    // value is 'never' here - all cases handled
    const impossible: never = value;
    console.log(impossible);
  }
}

processValue("hello");
processValue(42);

// Helper function for exhaustive checks
function assertNever(x: never): never {
  throw new Error("Unexpected value: " + x);
}

type Status = "pending" | "success" | "error";

function handleStatus(status: Status) {
  switch (status) {
    case "pending": return "Loading...";
    case "success": return "Done!";
    case "error": return "Failed!";
    default: return assertNever(status);
  }
}

console.log(handleStatus("success"));`,
        explanation: 'Never helps ensure all cases are handled. If you add a new value to the union, TypeScript will error.',
      },
      {
        code: `// Never in conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

type Example = NonNullable<string | null | undefined>;
// Result: string (null and undefined become never, then disappear)

let value: Example = "hello";  // Only string allowed
// let bad: Example = null;    // Error!

console.log(value);

// Never in intersection (impossible type)
type Impossible = string & number;  // never

// Never is the empty set - no values exist
// let x: never = ???  // Nothing can be assigned to never

// Practical use: filter out types
type ExtractStrings<T> = T extends string ? T : never;

type Mixed = ExtractStrings<string | number | boolean>;
// Result: string

let s: Mixed = "hello";
console.log(s);`,
        explanation: 'Never represents the empty type - no values. In conditional types, never acts as a filter, removing unwanted types.',
      },
    ],
  },

  // ===== ASYNC =====
  {
    term: 'Promise',
    definition: 'An object representing a future value. The result of an asynchronous operation.',
    example: 'fetch(url).then(response => ...)',
    category: 'async',
    contextExamples: [
      {
        code: `// Creating a promise
function delay(ms: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Done waiting!");
    }, ms);
  });
}

// Using promises with .then()
delay(1000).then(message => {
  console.log(message);
});

console.log("This runs first!");`,
        explanation: 'Promises represent future values. They start pending, then become resolved (success) or rejected (error).',
      },
      {
        code: `// Promise chaining with .then()
function fetchUser(id: number): Promise<{ name: string }> {
  return Promise.resolve({ name: "User " + id });
}

function fetchPosts(name: string): Promise<string[]> {
  return Promise.resolve(["Post 1 by " + name, "Post 2 by " + name]);
}

// Chain promises - each .then returns a new promise
fetchUser(1)
  .then(user => {
    console.log("Got user:", user.name);
    return fetchPosts(user.name);
  })
  .then(posts => {
    console.log("Posts:", posts);
  })
  .catch(error => {
    console.log("Error:", error);
  });

console.log("Fetching...");`,
        explanation: 'Promises chain with .then(). Each .then() returns a new promise. .catch() handles errors anywhere in the chain.',
      },
      {
        code: `// Promise.all and Promise.race
let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = Promise.resolve(3);

// Promise.all - wait for all, get array of results
Promise.all([p1, p2, p3]).then(results => {
  console.log("All results:", results);  // [1, 2, 3]
});

// Promise.race - first one to complete wins
let slow = new Promise(r => setTimeout(() => r("slow"), 100));
let fast = new Promise(r => setTimeout(() => r("fast"), 10));

Promise.race([slow, fast]).then(winner => {
  console.log("Winner:", winner);  // "fast"
});

// Creating rejected promise
let failed = Promise.reject(new Error("Something went wrong"));
failed.catch(err => console.log("Caught:", err.message));

// Promise.allSettled - get all results even if some fail
Promise.allSettled([p1, Promise.reject("error"), p3])
  .then(results => console.log("Settled:", results));`,
        explanation: 'Promise.all waits for all promises. Promise.race returns the first to complete. Promise.allSettled waits for all, regardless of success or failure.',
      },
    ],
  },
  {
    term: 'Async/Await',
    definition: 'A cleaner way to work with promises. Makes asynchronous code look like synchronous code.',
    example: 'async function getData() { await fetch(...) }',
    category: 'async',
    contextExamples: [
      {
        code: `function delay(ms: number): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => resolve("Complete!"), ms);
  });
}

async function runTasks() {
  console.log("Starting...");

  let result = await delay(1000);
  console.log(result);

  result = await delay(500);
  console.log(result);

  console.log("All done!");
}

runTasks();
console.log("This runs while waiting");`,
        explanation: 'async marks a function as asynchronous. await pauses until a promise resolves. Code reads top-to-bottom.',
      },
      {
        code: `// Error handling with try/catch
async function fetchData(shouldFail: boolean) {
  if (shouldFail) {
    throw new Error("Failed to fetch!");
  }
  return { data: "Success!" };
}

async function loadData() {
  try {
    let result = await fetchData(false);
    console.log("Got:", result.data);

    // This will throw
    result = await fetchData(true);
    console.log("This won't run");
  } catch (error) {
    console.log("Error caught:", (error as Error).message);
  } finally {
    console.log("Cleanup - always runs");
  }
}

loadData();
console.log("loadData called");`,
        explanation: 'Use try/catch with async/await for error handling. finally runs whether the try succeeded or failed.',
      },
      {
        code: `// Parallel execution with Promise.all
async function fetchUserData(id: number) {
  return { id, name: "User " + id };
}

async function fetchUserPosts(id: number) {
  return ["Post 1", "Post 2"];
}

// Sequential (slower)
async function loadSequential() {
  console.log("Sequential start");
  let user = await fetchUserData(1);      // Wait...
  let posts = await fetchUserPosts(1);    // Then wait...
  console.log("Sequential done:", user.name, posts.length);
}

// Parallel (faster)
async function loadParallel() {
  console.log("Parallel start");
  let [user, posts] = await Promise.all([
    fetchUserData(1),
    fetchUserPosts(1)
  ]);
  console.log("Parallel done:", user.name, posts.length);
}

loadSequential();
loadParallel();`,
        explanation: 'Sequential awaits run one after another. Use Promise.all for parallel execution when operations are independent.',
      },
    ],
  },
  {
    term: 'Asynchronous',
    definition: 'Code that doesn\'t block - other code runs while waiting. Used for network requests, timers, etc.',
    example: 'setTimeout, fetch, file reading',
    category: 'async',
    contextExamples: [
      {
        code: `console.log("1. Start");

// Asynchronous - doesn't block
setTimeout(() => {
  console.log("3. Timeout done");
}, 1000);

console.log("2. End");

// Output order:
// 1. Start
// 2. End
// 3. Timeout done (after 1 second)`,
        explanation: 'Asynchronous code doesn\'t wait. The program continues immediately, and the callback runs later when ready.',
      },
      {
        code: `// Synchronous vs asynchronous comparison
// Synchronous: blocks until complete
function syncOperation(): string {
  // Imagine this takes 2 seconds
  let result = "done";
  console.log("Sync operation complete");
  return result;
}

// Asynchronous: returns immediately, completes later
function asyncOperation(): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Async operation complete");
      resolve("done");
    }, 100);
  });
}

console.log("Before sync");
syncOperation();
console.log("After sync");

console.log("Before async");
asyncOperation().then(r => console.log("Result:", r));
console.log("After async (runs before operation completes!)");`,
        explanation: 'Synchronous code blocks execution. Asynchronous code returns immediately, letting the program continue while work happens in the background.',
      },
      {
        code: `// Common async patterns in JavaScript
// 1. setTimeout - delayed execution
setTimeout(() => console.log("After 100ms"), 100);

// 2. setInterval - repeated execution
let count = 0;
let intervalId = setInterval(() => {
  console.log("Tick:", ++count);
  if (count >= 3) {
    clearInterval(intervalId);
    console.log("Interval stopped");
  }
}, 50);

// 3. Event-driven (conceptual - browser only)
// button.addEventListener("click", () => { ... });

// 4. Async operations are everywhere
// - Network requests (fetch)
// - File reading (Node.js fs)
// - Database queries
// - User input

console.log("All async operations scheduled!");`,
        explanation: 'JavaScript uses async for timers, events, network calls, and I/O. The event loop manages when callbacks execute.',
      },
    ],
  },

  // ===== MODULES =====
  {
    term: 'Import',
    definition: 'Bringing code from another file into the current file. Access functions, classes, or values defined elsewhere.',
    example: 'import { something } from "./file";',
    category: 'modules',
    contextExamples: [
      {
        code: `// Different import styles:

// Named import
// import { add, subtract } from "./math";

// Default import
// import Calculator from "./calculator";

// Import all as namespace
// import * as utils from "./utils";

// Import for side effects only
// import "./setup";

// Example usage (conceptual)
let add = (a: number, b: number) => a + b;
let subtract = (a: number, b: number) => a - b;

console.log(add(5, 3));
console.log(subtract(10, 4));`,
        explanation: 'Import brings in code from other files. Named imports use {}, default imports don\'t need {}.',
      },
      {
        code: `// Renaming imports to avoid conflicts
// import { Button as MaterialButton } from "@mui/material";
// import { Button as AntButton } from "antd";

// Simulating the concept
let MaterialButton = "MaterialUI Button";
let AntButton = "Ant Design Button";

console.log("Using:", MaterialButton);
console.log("Using:", AntButton);

// Type-only imports (TypeScript)
// import type { User } from "./types";
// Type imports are removed at compile time

interface User {
  name: string;
}

let user: User = { name: "Alice" };
console.log(user.name);

// Dynamic imports (code splitting)
// const module = await import("./heavyModule");`,
        explanation: 'Use "as" to rename imports. Type-only imports use "import type" and are erased at compile time.',
      },
      {
        code: `// Import organization best practices
// 1. External packages first
// import React from "react";
// import { useState } from "react";

// 2. Internal modules second
// import { Button } from "@/components/Button";
// import { formatDate } from "@/utils/date";

// 3. Relative imports last
// import { helper } from "./helper";
// import styles from "./styles.css";

// Demonstrating import patterns
const utils = {
  formatName: (name: string) => name.toUpperCase(),
  formatDate: (date: Date) => date.toISOString()
};

// Destructured usage (like named imports)
const { formatName, formatDate } = utils;

console.log(formatName("alice"));
console.log(formatDate(new Date()));`,
        explanation: 'Organize imports: external packages first, then internal modules, then relative imports. Keep imports at the top of the file.',
      },
    ],
  },
  {
    term: 'Export',
    definition: 'Making code available to other files. Allows importing in different parts of your app.',
    example: 'export function add() { }',
    category: 'modules',
    contextExamples: [
      {
        code: `// Named exports
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

// Default export (one per file)
// export default class Calculator { }

// Using the exports locally
console.log("PI:", PI);
console.log("2 + 3 =", add(2, 3));
console.log("4 x 5 =", multiply(4, 5));`,
        explanation: 'Export makes code available to other files. Named exports allow multiple per file, default export is one main thing.',
      },
      {
        code: `// Re-exporting from other modules
// Barrel file pattern (index.ts)
// export { Button } from "./Button";
// export { Input } from "./Input";
// export { Modal } from "./Modal";

// Re-export everything
// export * from "./utils";

// Re-export with rename
// export { helper as utilHelper } from "./helper";

// Simulating the concept
const components = {
  Button: "Button Component",
  Input: "Input Component",
  Modal: "Modal Component"
};

// Destructure and re-export concept
const { Button, Input, Modal } = components;
console.log("Available:", Button, Input, Modal);`,
        explanation: 'Barrel files (index.ts) re-export from multiple files, giving one clean import point for a folder.',
      },
      {
        code: `// Export patterns comparison
// 1. Named exports (multiple per file, explicit)
export const VERSION = "1.0.0";
export interface Config {
  debug: boolean;
}

export function setup(config: Config) {
  console.log("Setup with debug:", config.debug);
}

// 2. Default export (one per file, flexible naming)
// export default class App { }

// 3. Mixed (common pattern)
// export default function main() { }
// export { helper, utils };

// 4. Type exports (TypeScript only)
// export type { User, Post };

// Using our exports
let config: Config = { debug: true };
setup(config);
console.log("Version:", VERSION);`,
        explanation: 'Named exports are explicit and support multiple items. Default exports are for the main item. You can mix both in one file.',
      },
    ],
  },
  {
    term: 'Module',
    definition: 'A file that contains related code. Keeps code organized and prevents naming conflicts.',
    example: 'Each .ts or .js file is a module',
    category: 'modules',
    contextExamples: [
      {
        code: `// Modules help organize code
// math.ts module might contain:
const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;
const multiply = (a: number, b: number) => a * b;

// Variables are scoped to the module
const privateHelper = () => "internal";

// Only exported items are accessible outside
console.log(add(1, 2));
console.log(multiply(3, 4));`,
        explanation: 'Modules are files with related code. They keep things organized and isolated - internal variables don\'t leak out.',
      },
      {
        code: `// Module scope vs global scope
// In a module, variables are private by default
const SECRET_KEY = "abc123";  // Only accessible in this file

// Without export, this stays private
function internalHelper() {
  return "internal only";
}

// With export, this becomes public
export function publicFunction() {
  // Can use private items internally
  console.log(internalHelper());
  return SECRET_KEY.length;
}

// Each module has its own scope
// No name collisions between files
const helper = () => "File A helper";
// Another file can also have 'helper' - no conflict!

console.log(publicFunction());`,
        explanation: 'Module scope means variables are private unless exported. This prevents naming conflicts and keeps internals hidden.',
      },
      {
        code: `// CommonJS vs ES Modules
// CommonJS (Node.js traditional style)
// const fs = require("fs");
// module.exports = { myFunction };

// ES Modules (modern standard)
// import fs from "fs";
// export { myFunction };

// TypeScript uses ES Module syntax
// The compiler can output CommonJS if needed

// Module resolution
// Absolute: from node_modules
// import React from "react";

// Relative: from project files
// import { Button } from "./Button";

// Path aliases: configured in tsconfig
// import { utils } from "@/lib/utils";

// Simulating module pattern
const myModule = (() => {
  const privateVar = "secret";
  const publicVar = "visible";

  return { publicVar };
})();

console.log(myModule.publicVar);
// console.log(myModule.privateVar); // undefined`,
        explanation: 'ES Modules are the modern standard. CommonJS is Node.js traditional style. TypeScript supports both via configuration.',
      },
    ],
  },

  // ===== MISC =====
  {
    term: 'API',
    definition: 'Application Programming Interface. A set of rules for how software components communicate.',
    example: 'REST API, DOM API, fetch API',
    category: 'misc',
    contextExamples: [
      {
        code: `// APIs define how to interact with systems

// DOM API - interact with web pages
// document.getElementById("myId")

// Console API
console.log("Using console API");

// Math API (built into JavaScript)
console.log(Math.max(1, 5, 3));  // 5
console.log(Math.random());      // random 0-1
console.log(Math.floor(4.7));    // 4

// Date API
let now = new Date();
console.log(now.getFullYear());
console.log(now.getMonth() + 1); // months are 0-indexed`,
        explanation: 'APIs are contracts for interacting with systems. JavaScript has many built-in APIs like Math, Date, and console.',
      },
      {
        code: `// Web APIs (REST API patterns)
// Common HTTP methods:
// GET    - Retrieve data
// POST   - Create new data
// PUT    - Update existing data
// DELETE - Remove data

// Simulating API responses
interface User {
  id: number;
  name: string;
}

// Mock API functions
function getUsers(): User[] {
  return [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
}

function createUser(name: string): User {
  return { id: Date.now(), name };
}

function deleteUser(id: number): boolean {
  console.log("Deleted user:", id);
  return true;
}

console.log("Users:", getUsers());
console.log("New user:", createUser("Charlie"));
deleteUser(1);`,
        explanation: 'REST APIs use HTTP methods (GET, POST, PUT, DELETE) to perform operations. Each endpoint handles a specific resource.',
      },
      {
        code: `// Creating your own API (public interface)
class Calculator {
  // Public API - what users can call
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  // Private implementation detail
  private validate(n: number): boolean {
    return !isNaN(n) && isFinite(n);
  }
}

// Using the API
const calc = new Calculator();
console.log(calc.add(5, 3));      // 8
console.log(calc.subtract(10, 4)); // 6
// calc.validate(5);               // Error! Private

// API documentation describes:
// - What functions/methods are available
// - What parameters they accept
// - What they return
// - Any side effects`,
        explanation: 'Your code has an API too - its public methods and functions. Good APIs are simple, consistent, and well-documented.',
      },
    ],
  },
  {
    term: 'JSON',
    definition: 'JavaScript Object Notation. A text format for storing and exchanging data.',
    example: '{"name": "Alice", "age": 25}',
    category: 'misc',
    contextExamples: [
      {
        code: `// JSON is text format for data
let jsonString = '{"name": "Alice", "age": 28}';

// Parse JSON string to object
let user = JSON.parse(jsonString);
console.log(user.name);  // "Alice"
console.log(user.age);   // 28

// Convert object to JSON string
let data = {
  product: "Coffee",
  price: 4.99,
  inStock: true
};

let json = JSON.stringify(data);
console.log(json);

// Pretty print with indentation
console.log(JSON.stringify(data, null, 2));`,
        explanation: 'JSON is the standard format for data exchange. JSON.parse() converts text to objects, JSON.stringify() converts objects to text.',
      },
      {
        code: `// JSON rules and gotchas
// Valid JSON:
let validJson = '{"name": "Alice", "age": 30, "active": true}';
console.log(JSON.parse(validJson));

// JSON vs JavaScript objects
let jsObject = {
  name: "Bob",           // No quotes needed on keys
  greet() {              // Methods allowed
    return "Hi!";
  },
  // trailing comma OK
};

// JSON requirements:
// - Keys MUST be in double quotes
// - Strings MUST use double quotes (not single)
// - No trailing commas
// - No functions, undefined, or comments

// Handling undefined
let withUndefined = { a: 1, b: undefined, c: 3 };
console.log(JSON.stringify(withUndefined));  // {"a":1,"c":3}
// undefined is omitted!

// Handling dates
let withDate = { created: new Date() };
console.log(JSON.stringify(withDate));  // Date becomes string`,
        explanation: 'JSON is stricter than JavaScript objects. Keys must be quoted, no functions or undefined, and dates become strings.',
      },
      {
        code: `// Advanced JSON usage
// Custom serialization with replacer
let user = {
  name: "Alice",
  password: "secret123",
  email: "alice@test.com"
};

// Exclude sensitive fields
let safeJson = JSON.stringify(user, (key, value) => {
  if (key === "password") return undefined;
  return value;
});
console.log(safeJson);

// Only include specific fields
let filtered = JSON.stringify(user, ["name", "email"]);
console.log(filtered);

// Custom parsing with reviver
let jsonWithDate = '{"name": "Event", "date": "2024-01-15"}';
let parsed = JSON.parse(jsonWithDate, (key, value) => {
  if (key === "date") return new Date(value);
  return value;
});
console.log(parsed.date.getFullYear());

// Deep clone objects with JSON (simple approach)
let original = { a: { b: 1 } };
let clone = JSON.parse(JSON.stringify(original));
clone.a.b = 2;
console.log(original.a.b, clone.a.b);  // 1, 2`,
        explanation: 'JSON.stringify can filter fields with a replacer. JSON.parse can transform values with a reviver. Both are powerful for data manipulation.',
      },
    ],
  },
  {
    term: 'DOM',
    definition: 'Document Object Model. The programming interface for web pages. JavaScript uses it to interact with HTML.',
    example: 'document.getElementById("myDiv")',
    category: 'misc',
    contextExamples: [
      {
        code: `// DOM lets JavaScript interact with HTML
// (These only work in a browser environment)

// Conceptual examples:
// Get element by ID
// let button = document.getElementById("myButton");

// Get elements by class
// let items = document.getElementsByClassName("item");

// Query selector (CSS-style)
// let header = document.querySelector("h1");
// let allLinks = document.querySelectorAll("a");

// Modify content
// element.textContent = "New text";
// element.innerHTML = "<strong>Bold</strong>";

// Modify styles
// element.style.color = "red";

console.log("DOM is the browser's API for HTML");`,
        explanation: 'DOM is how JavaScript interacts with HTML. Select elements, read/modify content, add event listeners.',
      },
      {
        code: `// DOM manipulation concepts
// Creating elements (browser only)
// let div = document.createElement("div");
// div.textContent = "Hello!";
// div.className = "greeting";
// document.body.appendChild(div);

// Simulating DOM-like structure
interface DOMElement {
  tagName: string;
  textContent: string;
  children: DOMElement[];
  className: string;
}

function createElement(tag: string): DOMElement {
  return {
    tagName: tag,
    textContent: "",
    children: [],
    className: ""
  };
}

let myDiv = createElement("div");
myDiv.textContent = "Hello World";
myDiv.className = "container";

console.log(myDiv);

// DOM tree structure
let parent = createElement("ul");
let child1 = createElement("li");
let child2 = createElement("li");
parent.children.push(child1, child2);
console.log("Children:", parent.children.length);`,
        explanation: 'DOM methods create, modify, and arrange HTML elements. Elements have properties like textContent, className, and children.',
      },
      {
        code: `// DOM traversal and querying
// Navigation (browser concepts)
// element.parentElement    - Go up
// element.children         - Go down
// element.nextElementSibling   - Go sideways
// element.previousElementSibling

// Query methods
// document.getElementById("id")           - Single element
// document.querySelector(".class")        - First match
// document.querySelectorAll("div")        - All matches

// Simulating traversal
interface TreeNode {
  id: string;
  children: TreeNode[];
  parent?: TreeNode;
}

function findById(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  for (let child of root.children) {
    let found = findById(child, id);
    if (found) return found;
  }
  return null;
}

let tree: TreeNode = {
  id: "root",
  children: [
    { id: "child1", children: [] },
    { id: "child2", children: [{ id: "grandchild", children: [] }] }
  ]
};

console.log(findById(tree, "grandchild")?.id);`,
        explanation: 'DOM traversal navigates between elements. Query methods find elements by ID, class, or CSS selectors.',
      },
    ],
  },
  {
    term: 'Event',
    definition: 'Something that happens in the browser - clicks, key presses, page loads. Code can respond to events.',
    example: 'click, keydown, submit, load',
    category: 'misc',
    contextExamples: [
      {
        code: `// Events are actions users take
// (Browser-only examples conceptually)

// Click event
// button.addEventListener("click", () => {
//   console.log("Button clicked!");
// });

// Keyboard event
// document.addEventListener("keydown", (event) => {
//   console.log("Key pressed:", event.key);
// });

// Form submit
// form.addEventListener("submit", (event) => {
//   event.preventDefault(); // Stop page refresh
//   console.log("Form submitted!");
// });

// Simulating event concepts
function simulateClick(callback: () => void) {
  console.log("Click detected!");
  callback();
}

simulateClick(() => {
  console.log("Handling the click...");
});`,
        explanation: 'Events are things that happen (clicks, typing, etc.). Add listeners to respond when events occur.',
      },
      {
        code: `// Event patterns in code
// Custom event system (like EventEmitter)
type EventHandler = (data: any) => void;

class EventEmitter {
  private listeners: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  emit(event: string, data?: any) {
    let handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(h => h(data));
    }
  }
}

let emitter = new EventEmitter();

emitter.on("userLogin", (user) => {
  console.log("User logged in:", user.name);
});

emitter.on("userLogin", (user) => {
  console.log("Send welcome email to:", user.email);
});

emitter.emit("userLogin", { name: "Alice", email: "alice@test.com" });`,
        explanation: 'Event emitters let parts of your code communicate without direct coupling. Subscribe with on(), broadcast with emit().',
      },
      {
        code: `// Event delegation and propagation
// Browser event flow (conceptual):
// 1. Capture phase: document -> target
// 2. Target phase: event fires on target
// 3. Bubble phase: target -> document

// Event delegation pattern
// Instead of many listeners:
// items.forEach(item => item.addEventListener("click", ...));

// One listener on parent:
// list.addEventListener("click", (e) => {
//   if (e.target.matches("li")) handleItem(e.target);
// });

// Simulating event bubbling
function handleClick(element: string, stopPropagation: boolean) {
  console.log("Clicked:", element);
  if (!stopPropagation) {
    console.log("Event bubbles up...");
  } else {
    console.log("Propagation stopped");
  }
}

// Normal click - bubbles up
handleClick("button", false);

// With stopPropagation
handleClick("button", true);

// Common event methods:
// event.preventDefault()    - Stop default action
// event.stopPropagation()   - Stop bubbling`,
        explanation: 'Events bubble up from target to ancestors. Event delegation uses one parent listener instead of many child listeners.',
      },
    ],
  },
  {
    term: 'Debugging',
    definition: 'The process of finding and fixing errors (bugs) in your code.',
    example: 'console.log(), breakpoints, debugger',
    category: 'misc',
    contextExamples: [
      {
        code: `// Debugging techniques

// 1. Console.log - print values to see what's happening
let x = 5;
let y = 10;
console.log("x:", x, "y:", y);

// 2. Check types
console.log("Type of x:", typeof x);

// 3. Trace function calls
function calculate(a: number, b: number) {
  console.log("calculate called with:", a, b);
  let result = a + b;
  console.log("result:", result);
  return result;
}

// 4. Validate assumptions
let data = [1, 2, 3];
console.log("Array length:", data.length);
console.log("First element:", data[0]);

calculate(x, y);`,
        explanation: 'Debugging is detective work. Use console.log to see values, check types, and trace through your code step by step.',
      },
      {
        code: `// Advanced console methods
// console.table - display data in a table
let users = [
  { name: "Alice", age: 28 },
  { name: "Bob", age: 35 }
];
console.table(users);

// console.group - organize related logs
console.group("User Details");
console.log("Name: Alice");
console.log("Age: 28");
console.groupEnd();

// console.time - measure performance
console.time("loop");
let sum = 0;
for (let i = 0; i < 1000000; i++) {
  sum += i;
}
console.timeEnd("loop");

// console.assert - only logs if condition is false
let value = 5;
console.assert(value > 0, "Value should be positive");
console.assert(value > 10, "Value should be > 10");  // Logs!

// console.trace - show call stack
function outer() { inner(); }
function inner() { console.trace("Trace"); }
outer();`,
        explanation: 'Console has many methods: table for data, group for organization, time for performance, assert for conditions, trace for call stacks.',
      },
      {
        code: `// Debugging strategies
// 1. Binary search - narrow down the problem
function findBug(data: number[]) {
  console.log("Step 1 - Input:", data);  // Is input correct?

  let filtered = data.filter(n => n > 0);
  console.log("Step 2 - Filtered:", filtered);  // Is filter working?

  let total = filtered.reduce((a, b) => a + b, 0);
  console.log("Step 3 - Total:", total);  // Is sum correct?

  return total / filtered.length;
}

// 2. Isolate the issue
function isolateTest() {
  // Comment out parts to find the problem
  let a = 5;
  let b = 10;
  // let c = someComplexFunction(); // Comment this out
  let c = 15;  // Use a known value instead
  return a + b + c;
}

// 3. Reproduce with minimal case
let simpleCase = [1, 2, 3];  // Start simple
let result = findBug(simpleCase);
console.log("Result:", result);

// 4. Check assumptions
let arr = [1, 2, 3];
console.log("Is array?", Array.isArray(arr));
console.log("Length?", arr.length);`,
        explanation: 'Debug systematically: add logs at checkpoints, isolate parts, reproduce with simple cases, verify assumptions.',
      },
    ],
  },
  {
    term: 'Runtime',
    definition: 'When your code is actually running. Errors that happen during runtime are "runtime errors."',
    example: 'Accessing undefined property at runtime',
    category: 'misc',
    contextExamples: [
      {
        code: `// Runtime = when code executes
// Compile time = when TypeScript checks your code

// TypeScript catches this at COMPILE time:
// let name: string = 42; // Error before running

// This error happens at RUNTIME:
let data: any = null;
try {
  // TypeScript can't know this will fail
  console.log(data.toString());
} catch (error) {
  console.log("Runtime error:", error.message);
}

console.log("Program continues after catching error");`,
        explanation: 'Runtime is when code runs. TypeScript catches many errors before runtime, but some errors only appear when executing.',
      },
      {
        code: `// Common runtime errors
// 1. TypeError - wrong type operations
let obj: any = null;
try {
  // obj.property;  // Cannot read property of null
  throw new TypeError("Cannot read property of null");
} catch (e) {
  console.log("TypeError caught");
}

// 2. ReferenceError - undefined variable
try {
  // undefinedVar;  // not defined
  throw new ReferenceError("undefinedVar is not defined");
} catch (e) {
  console.log("ReferenceError caught");
}

// 3. RangeError - invalid range
try {
  let arr = new Array(-1);  // Invalid array length
} catch (e) {
  console.log("RangeError caught");
}

// 4. Custom errors
function divide(a: number, b: number) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

try {
  divide(10, 0);
} catch (e) {
  console.log("Custom error:", (e as Error).message);
}`,
        explanation: 'Runtime errors include TypeError, ReferenceError, and RangeError. Use try/catch to handle them gracefully.',
      },
      {
        code: `// Runtime vs compile time checks
// TypeScript (compile time) - can't catch everything
function processUser(user: { name: string }) {
  console.log(user.name.toUpperCase());
}

// This passes TypeScript but might fail at runtime
let apiData: any = { name: null };  // Bad data from API
try {
  processUser(apiData);  // Runtime error!
} catch (e) {
  console.log("Caught:", (e as Error).message);
}

// Runtime validation (defensive programming)
function safeProcessUser(user: unknown) {
  // Validate at runtime
  if (typeof user !== "object" || user === null) {
    console.log("Invalid user object");
    return;
  }

  if (!("name" in user) || typeof (user as any).name !== "string") {
    console.log("Missing or invalid name");
    return;
  }

  console.log("Valid:", (user as { name: string }).name.toUpperCase());
}

safeProcessUser({ name: "Alice" });  // Valid
safeProcessUser({ name: null });     // Invalid
safeProcessUser(null);               // Invalid`,
        explanation: 'TypeScript checks types at compile time, but data from APIs or user input needs runtime validation too.',
      },
    ],
  },
  {
    term: 'Compile Time',
    definition: 'When TypeScript checks and transforms your code before running. TypeScript errors are compile-time errors.',
    example: 'TypeScript type checking',
    category: 'misc',
    contextExamples: [
      {
        code: `// Compile time = before code runs
// TypeScript checks types at compile time

// These would be compile-time errors:
// let age: number = "twenty"; // Type error
// unknownVariable;            // Not defined
// someFunction();             // Function doesn't exist

// This passes compile time, runs at runtime:
let validCode: number = 42;
console.log("Value:", validCode);

function add(a: number, b: number): number {
  return a + b;
}

// TypeScript ensures correct types at compile time
console.log(add(5, 3));
// add("5", "3"); // Compile error! Strings not allowed`,
        explanation: 'Compile time is when TypeScript analyzes your code. It catches type errors before you even run the program.',
      },
      {
        code: `// Types of compile-time errors
// 1. Type mismatch
let age: number = 25;
// age = "twenty-five";  // Error: string not assignable to number

// 2. Missing properties
interface User {
  name: string;
  email: string;
}

// let user: User = { name: "Alice" };  // Error: missing email

// 3. Wrong number of arguments
function greet(name: string, greeting: string) {
  return greeting + ", " + name;
}

// greet("Alice");  // Error: expected 2 arguments

// 4. Property doesn't exist
let person = { name: "Bob", age: 30 };
// console.log(person.email);  // Error: email doesn't exist

// These all fail BEFORE code runs - that's the power of TypeScript!
console.log("If you see this, code compiled successfully!");`,
        explanation: 'Compile-time errors stop you before running. TypeScript catches type mismatches, missing properties, and wrong arguments.',
      },
      {
        code: `// Compile time constructs (erased at runtime)
// These exist ONLY at compile time:

// 1. Interfaces (no runtime presence)
interface Product {
  id: number;
  name: string;
}

// 2. Type aliases (no runtime presence)
type ID = string | number;

// 3. Generic type parameters
function identity<T>(value: T): T {
  return value;
}

// 4. Type assertions
let input: unknown = "hello";
let str = input as string;

// After compilation, all above become:
// function identity(value) { return value; }
// let str = input;

// At runtime, you can't check: if (typeof x === "Product")
// Because Product doesn't exist at runtime!

// Use class if you need runtime type checking
class ProductClass {
  constructor(public id: number, public name: string) {}
}

let p = new ProductClass(1, "Widget");
console.log(p instanceof ProductClass);  // true - class exists at runtime`,
        explanation: 'Types, interfaces, and generics are erased at runtime. Only classes exist at runtime for instanceof checks.',
      },
    ],
  },
  {
    term: 'Linting',
    definition: 'Automatically checking code for style issues, potential bugs, and best practices.',
    example: 'ESLint rules',
    category: 'misc',
    contextExamples: [
      {
        code: `// Linters check for common issues

// Examples of what linters catch:
// - Unused variables
let unused = 5; // Linter: "unused is defined but never used"
console.log("Using unused:", unused); // Now it's used!

// - Consistent formatting
let properly = {
  formatted: true,
  indentation: "correct"
};

// - Potential bugs
let value = null;
// if (value = 5) // Linter: "Did you mean === ?"
if (value === null) {
  console.log("Value is null");
}

console.log(properly);`,
        explanation: 'Linters like ESLint enforce code quality rules. They catch mistakes, enforce style, and suggest best practices.',
      },
      {
        code: `// Common linting rules
// 1. No unused variables
let usedVar = "I'm used";
console.log(usedVar);
// let unusedVar = "I'm not used";  // Linter warning!

// 2. Prefer const over let
const immutable = "won't change";
let mightChange = "could change";
mightChange = "changed!";
console.log(immutable, mightChange);

// 3. No console in production
// console.log("debug");  // Linter warning in prod builds

// 4. Consistent spacing and formatting
const obj = {
  name: "Alice",   // Consistent comma placement
  age: 30          // Consistent indentation
};

// 5. Require explicit return types
function add(a: number, b: number): number {
  return a + b;  // Explicit return type
}

console.log(add(1, 2));
console.log(obj);`,
        explanation: 'Linters enforce consistency: unused variables, const vs let, formatting, and return types. Configure rules per project.',
      },
      {
        code: `// TypeScript as a "linter" for types
// TypeScript's strict mode catches more issues

// strictNullChecks - catch null/undefined errors
function getLength(str: string | null): number {
  // Without strict: str.length might crash
  // With strict: must check first
  if (str === null) return 0;
  return str.length;  // Safe!
}

// noImplicitAny - no accidental 'any' types
function process(data: unknown) {  // Explicit type required
  console.log(data);
}

// strictPropertyInitialization - initialize class properties
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;  // Must initialize
    this.age = age;    // Must initialize
  }
}

console.log(getLength("hello"));
console.log(getLength(null));
process({ test: true });

// Turn on strict mode in tsconfig.json:
// "strict": true`,
        explanation: 'TypeScript\'s strict mode acts like a linter for types. It catches null errors, implicit any, and uninitialized properties.',
      },
    ],
  },
  {
    term: 'Transpiling',
    definition: 'Converting code from one language to another. TypeScript transpiles to JavaScript.',
    example: 'tsc compiles .ts to .js',
    category: 'misc',
    contextExamples: [
      {
        code: `// TypeScript code gets transpiled to JavaScript

// TypeScript (what you write):
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return "Hello, " + user.name;
}

// JavaScript output (what runs):
// function greet(user) {
//   return "Hello, " + user.name;
// }
// (interfaces and types are removed!)

let alice: User = { name: "Alice", age: 28 };
console.log(greet(alice));`,
        explanation: 'Transpiling converts TypeScript to JavaScript. Types are removed - they\'re only used for checking, not at runtime.',
      },
      {
        code: `// What gets removed during transpilation
// TypeScript:
type Status = "active" | "inactive";
interface Config {
  debug: boolean;
  timeout: number;
}

function configure<T extends Config>(config: T): void {
  console.log("Debug:", config.debug);
}

const settings: Config = { debug: true, timeout: 5000 };
configure(settings);

// Transpiled JavaScript (types removed):
// function configure(config) {
//   console.log("Debug:", config.debug);
// }
//
// const settings = { debug: true, timeout: 5000 };
// configure(settings);

// Type annotations, interfaces, generics - all gone at runtime!
console.log("Types exist at compile time only");`,
        explanation: 'Type aliases, interfaces, generics, and annotations are all removed. Only the logic remains in the output JavaScript.',
      },
      {
        code: `// Transpilation targets (ES5, ES6, ESNext)
// Modern TypeScript can output different JavaScript versions

// ES6+ (modern browsers)
class Person {
  constructor(public name: string) {}
  greet = () => console.log("Hi, I'm " + this.name);
}

// If targeting ES5 (older browsers), class becomes:
// function Person(name) {
//   this.name = name;
//   this.greet = function() { ... };
// }

// Configure in tsconfig.json:
// "target": "ES2020"  // Output ES2020 JavaScript
// "target": "ES5"     // Output ES5 (older compatibility)

let person = new Person("Alice");
person.greet();

// Babel also transpiles modern JS to older JS
// Webpack/Vite often combine TypeScript + Babel
console.log("Transpilation enables using modern features everywhere");`,
        explanation: 'TypeScript can target different JavaScript versions. Newer targets keep modern syntax, older targets convert to compatible code.',
      },
    ],
  },
];

const categories = [
  { id: 'all', label: 'All Terms' },
  { id: 'basics', label: 'Basics' },
  { id: 'types', label: 'Data Types' },
  { id: 'operators', label: 'Operators' },
  { id: 'functions', label: 'Functions' },
  { id: 'control-flow', label: 'Control Flow' },
  { id: 'objects', label: 'Objects & OOP' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'async', label: 'Async' },
  { id: 'modules', label: 'Modules' },
  { id: 'misc', label: 'Miscellaneous' },
];

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [consoleCode, setConsoleCode] = useState<string | null>(null);
  const [consoleExplanation, setConsoleExplanation] = useState<string | null>(null);
  const [consoleTerm, setConsoleTerm] = useState<string | null>(null);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentTermData, setCurrentTermData] = useState<Term | null>(null);

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTerms = [...filteredTerms].sort((a, b) => a.term.localeCompare(b.term));

  const handleUseInContext = (term: Term) => {
    // If clicking on the same term, go to next example
    if (currentTermData?.term === term.term) {
      handleNextExample();
      return;
    }
    // New term - start at first example
    const example = term.contextExamples[0];
    setConsoleCode(example.code);
    setConsoleExplanation(example.explanation);
    setConsoleTerm(term.term);
    setCurrentExampleIndex(0);
    setCurrentTermData(term);
  };

  const handleNextExample = () => {
    if (!currentTermData) return;
    const nextIndex = (currentExampleIndex + 1) % currentTermData.contextExamples.length;
    const example = currentTermData.contextExamples[nextIndex];
    setConsoleCode(example.code);
    setConsoleExplanation(example.explanation);
    setCurrentExampleIndex(nextIndex);
  };

  const handlePrevExample = () => {
    if (!currentTermData) return;
    const prevIndex = currentExampleIndex === 0
      ? currentTermData.contextExamples.length - 1
      : currentExampleIndex - 1;
    const example = currentTermData.contextExamples[prevIndex];
    setConsoleCode(example.code);
    setConsoleExplanation(example.explanation);
    setCurrentExampleIndex(prevIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-purple-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gradient-purple mb-1">Coding Dictionary</h1>
          <p className="text-gray-600">
            {glossaryTerms.length} terms - Click "Use in Context" to see examples
          </p>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Side - Terms List */}
          <div className="flex-1 min-w-0">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
              <input
                type="text"
                placeholder="Search for a term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors mb-3"
              />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-gradient-purple text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-500 mb-3">
              Showing {sortedTerms.length} of {glossaryTerms.length} terms
            </div>

            {/* Terms */}
            <div className="space-y-3">
              {sortedTerms.map((term, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{term.term}</h3>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium capitalize">
                          {term.category.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{term.definition}</p>
                      {term.example && (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-purple-700">
                          {term.example}
                        </code>
                      )}
                    </div>
                    <button
                      onClick={() => handleUseInContext(term)}
                      className="px-3 py-2 bg-gradient-purple text-white text-sm font-medium rounded hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                      Use in Context
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sortedTerms.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No terms found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-2 text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Console */}
          <div className="w-96 flex-shrink-0">
            <div className="sticky top-20">
              <div className="bg-gray-900 rounded-lg overflow-hidden border-2 border-purple-600">
                {/* Console Header */}
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm font-mono">
                    {consoleTerm ? `${consoleTerm} in context` : 'Code Console'}
                  </span>
                </div>

                {/* Console Content */}
                <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                  {consoleCode ? (
                    <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap overflow-x-auto">
                      {consoleCode}
                    </pre>
                  ) : (
                    <div className="text-gray-500 text-center py-12">
                      <div className="text-4xl mb-3">👈</div>
                      <p>Click "Use in Context" on any term to see example code here</p>
                    </div>
                  )}
                </div>

                {/* Example Navigation */}
                {currentTermData && currentTermData.contextExamples.length > 1 && (
                  <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700">
                    <button
                      onClick={handlePrevExample}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                      title="Previous example"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-gray-400 text-sm">
                      Example {currentExampleIndex + 1} of {currentTermData.contextExamples.length}
                    </span>
                    <button
                      onClick={handleNextExample}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                      title="Next example"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Explanation Box */}
              {consoleExplanation && (
                <div className="mt-4 bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <span>💡</span> What's happening here?
                  </h4>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    {consoleExplanation}
                  </p>
                </div>
              )}

              {/* Dynamic Lesson Link */}
              {currentTermData && (
                <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                  {(() => {
                    const lesson = termToLesson[currentTermData.term];
                    if (lesson === null || lesson === undefined) {
                      // Definition only - no relevant lesson
                      return (
                        <>
                          <h4 className="font-semibold text-gray-900 mb-2">{currentTermData.term}</h4>
                          <div className="text-center px-4 py-2 bg-gray-100 text-gray-600 rounded font-medium">
                            📖 Definition Only
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            This is a general programming concept not covered in a specific lesson.
                          </p>
                        </>
                      );
                    }
                    return (
                      <>
                        <h4 className="font-semibold text-gray-900 mb-2">Learn more about {currentTermData.term}</h4>
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className="block w-full text-center px-4 py-2 bg-gradient-purple text-white rounded hover:opacity-90 transition-opacity font-medium"
                        >
                          Go to {lesson.title} →
                        </Link>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
