import { Lesson } from '@/types/lesson';

export const functionalProgramming: Lesson = {
  slug: 'functional-programming',
  title: 'Functional Programming',
  description: 'Learn closures, higher-order functions, pure functions, and recursion.',
  difficulty: 'intermediate',
  order: 18,
  content: `
# Functional Programming Basics

Functional programming is a style that treats computation as evaluating functions. These concepts make your code more predictable and easier to test.

## Closures

A closure is a function that "remembers" variables from its outer scope, even after the outer function has finished:

\`\`\`typescript
function createCounter() {
  let count = 0;  // This variable is "closed over"

  return function() {
    count++;
    return count;
  };
}

let counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3
\`\`\`

The inner function "closes over" the \`count\` variable and remembers it between calls.

### Practical Closure Example

\`\`\`typescript
function createMultiplier(factor: number) {
  return function(num: number) {
    return num * factor;  // factor is remembered
  };
}

let double = createMultiplier(2);
let triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
\`\`\`

## Higher-Order Functions

A higher-order function either:
- Takes a function as an argument, OR
- Returns a function

\`\`\`typescript
// Takes a function as argument
function applyOperation(x: number, y: number, operation: (a: number, b: number) => number) {
  return operation(x, y);
}

console.log(applyOperation(5, 3, (a, b) => a + b));  // 8
console.log(applyOperation(5, 3, (a, b) => a * b));  // 15
\`\`\`

### Built-in Higher-Order Functions

Arrays have many higher-order methods:

\`\`\`typescript
let numbers = [1, 2, 3, 4, 5];

// map - transform each element
let doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter - keep elements that pass test
let evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce - combine into single value
let sum = numbers.reduce((acc, n) => acc + n, 0);
// 15
\`\`\`

## Pure Functions

A pure function:
1. Always returns the same output for the same input
2. Has no side effects (doesn't modify external state)

\`\`\`typescript
// PURE - same input = same output, no side effects
function add(a: number, b: number): number {
  return a + b;
}

// IMPURE - modifies external state
let total = 0;
function addToTotal(n: number): number {
  total += n;  // Side effect!
  return total;
}

// IMPURE - depends on external state
function getRandomGreeting(name: string): string {
  let greetings = ["Hi", "Hello", "Hey"];
  let random = Math.floor(Math.random() * 3);  // Not predictable!
  return greetings[random] + ", " + name;
}
\`\`\`

### Why Pure Functions Matter

\`\`\`typescript
// Pure functions are:
// - Predictable (easy to test)
// - Cacheable (same input = same output)
// - Parallelizable (no shared state)

function calculateTax(amount: number, rate: number): number {
  return amount * rate;
}

// Always returns 10 for these inputs
console.log(calculateTax(100, 0.1));  // 10
console.log(calculateTax(100, 0.1));  // 10
\`\`\`

## Recursion

Recursion is when a function calls itself. Every recursive function needs:
1. A base case (when to stop)
2. A recursive case (calling itself with smaller input)

\`\`\`typescript
function factorial(n: number): number {
  // Base case
  if (n <= 1) return 1;

  // Recursive case
  return n * factorial(n - 1);
}

console.log(factorial(5));  // 120 (5 * 4 * 3 * 2 * 1)
\`\`\`

### Recursion with Arrays

\`\`\`typescript
function sum(numbers: number[]): number {
  // Base case - empty array
  if (numbers.length === 0) return 0;

  // Recursive case - first + sum of rest
  let [first, ...rest] = numbers;
  return first + sum(rest);
}

console.log(sum([1, 2, 3, 4]));  // 10
\`\`\`

### When to Use Recursion

- Tree structures (file systems, DOM)
- Nested data (JSON parsing)
- Mathematical sequences (factorial, fibonacci)
- Problems that naturally divide into smaller versions

## Function Composition

Combine small functions into larger ones:

\`\`\`typescript
let addOne = (x: number) => x + 1;
let double = (x: number) => x * 2;
let square = (x: number) => x * x;

// Compose: apply right to left
function compose<T>(...fns: ((x: T) => T)[]) {
  return (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);
}

let transform = compose(square, double, addOne);
console.log(transform(3));  // ((3 + 1) * 2)² = 64
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create and use closures for data encapsulation
- Write and use higher-order functions
- Understand what makes a function pure
- Implement recursive solutions for appropriate problems
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create a Closure',
      description: `A closure is a function that "remembers" variables from its outer scope.

**Your task:**
1. Complete the createGreeter function to return an inner function
2. The inner function should return "Hello, " + name + "!"
3. Uncomment the test code to verify it works`,
      starterCode: `function createGreeter(name: string) {
  // Step 1: Return a function that uses 'name'

}

// Step 2: Uncomment to test
`,
      solution: `function createGreeter(name: string) {
  return function() {
    return "Hello, " + name + "!";
  };
}

let greetAlice = createGreeter("Alice");
console.log(greetAlice());`,
      expectedOutput: ['Hello, Alice!'],
      hints: [
        'Uncomment the return statement inside createGreeter',
        'The inner function "closes over" the name parameter',
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Higher-Order Function',
      description: `A higher-order function takes a function as an argument or returns one.

**Scenario:** You're building a currency converter. You have prices in cents [1, 2, 3] and need to convert them to dollars by multiplying by 10. Instead of hardcoding the multiplier, create a flexible function that applies ANY transformation.

**Your task:**
1. Create an empty result array
2. Loop through arr and apply fn to each element
3. Push each result to the array and return it
4. Test by converting cents [1, 2, 3] to dollars (multiply by 10)`,
      starterCode: `function applyToAll(arr: number[], fn: (n: number) => number): number[] {
  // Step 1: Create empty result array


  // Step 2: Loop and apply fn to each element


  // Step 3: Return the result

}

// Step 4: Convert cents to dollars - multiply [1, 2, 3] by 10
`,
      solution: `function applyToAll(arr: number[], fn: (n: number) => number): number[] {
  let result: number[] = [];
  for (let item of arr) {
    result.push(fn(item));
  }
  return result;
}

let dollars = applyToAll([1, 2, 3], n => n * 10);
console.log(dollars);`,
      expectedOutput: ['[10, 20, 30]'],
      hints: [
        'Create an empty array: let result: number[] = [];',
        'Loop with for...of: for (let item of arr) { ... }',
        'Apply the function and push: result.push(fn(item))',
        'Call applyToAll with an arrow function: n => n * 10',
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Simple Recursion',
      description: `Recursion is when a function calls itself. It needs a base case (when to stop) and a recursive case.

**Scenario:** You're building a rocket launch sequence. The countdown must go from 5 to 1, then launch! Use recursion to print each number in the sequence.

**Your task:**
1. Add a base case: return if n <= 0 (countdown complete)
2. Print the current countdown number
3. Recursively call countdown with n - 1
4. Start the launch sequence from 5`,
      starterCode: `function countdown(n: number): void {
  // Step 1: Base case - stop when n <= 0


  // Step 2: Print the current countdown number


  // Step 3: Recursive call with n - 1

}

// Step 4: Start the launch sequence from 5
`,
      solution: `function countdown(n: number): void {
  if (n <= 0) return;
  console.log(n);
  countdown(n - 1);
}

countdown(5);`,
      expectedOutput: ['5', '4', '3', '2', '1'],
      hints: [
        'Base case: if (n <= 0) return;',
        'Print with console.log(n)',
        'Recursive call: countdown(n - 1)',
        'Each call brings n closer to 0',
      ]
    }
  ],
  buildNote: {
    title: 'Functional Programming in Practice',
    explanation: `Functional programming concepts appear throughout modern JavaScript and TypeScript. Closures power React hooks (useState "remembers" state between renders). Higher-order functions like map and filter are used everywhere for data transformation. Pure functions make testing easy because they're predictable. Understanding these concepts is essential for reading and writing modern code.`,
    relatedFiles: [
      'src/hooks/useProgress.ts',
      'src/components/Quiz.tsx'
    ],
    inTheRealWorld: `React is heavily influenced by functional programming. Redux reducers must be pure functions. RxJS uses higher-order functions for reactive programming. Recursion is used for tree traversal, parsing, and algorithms. Libraries like Ramda and Lodash/fp provide functional utilities. Even if you don't write "pure functional" code, understanding these concepts makes you a better developer.`
  }
};
