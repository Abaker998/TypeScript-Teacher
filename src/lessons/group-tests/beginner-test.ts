import { Lesson } from '@/types/lesson';

export const beginnerTest: Lesson = {
  slug: 'beginner-test',
  title: 'Beginner Test',
  description: 'Test your understanding of TypeScript fundamentals: variables, types, functions, arrays, and more.',
  difficulty: 'beginner',
  order: 9,
  content: `
# Beginner Test

Congratulations on completing the Beginner section! This test will assess your understanding of the fundamental TypeScript concepts you've learned.

## What This Test Covers

- **Variables & Types** — Declaring variables with type annotations
- **Type Inference** — Understanding when TypeScript figures out types automatically
- **Functions** — Writing typed functions with parameters and return types
- **Arrays & Objects** — Working with collections and structured data
- **Control Flow** — Conditionals, loops, and switches
- **Error Handling** — try/catch blocks and error types
- **Web Fundamentals** — DOM, Events, and Fetch API basics
- **Developer Tooling** — TypeScript compiler and configuration

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** — reading code and predicting what it prints
- **Coding exercises** — writing code to solve problems

Take your time and think through each question carefully. You can use the hints if you get stuck on coding exercises.

## Ready?

Complete the quiz and exercises below to demonstrate your TypeScript fundamentals knowledge!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Type-Safe User Profile',
      description: `Create a properly typed user profile object and a function to display it.

**Your task:**
1. Create a \`user\` object with:
   - \`name\`: string (your name or "Alice")
   - \`age\`: number (any age)
   - \`isActive\`: boolean (true)
   - \`hobbies\`: string array with at least 2 hobbies
2. Create a function \`greetUser\` that takes a name (string) and returns a greeting string
3. Print the result of calling \`greetUser\` with the user's name
4. Print the number of hobbies the user has

**Expected output should match the format shown.**`,
      starterCode: `// Create the user object with proper types


// Create the greetUser function


// Call greetUser and print the result


// Print the number of hobbies

`,
      solution: `const user: { name: string; age: number; isActive: boolean; hobbies: string[] } = {
  name: "Alice",
  age: 25,
  isActive: true,
  hobbies: ["reading", "coding"]
};

function greetUser(name: string): string {
  return "Hello, " + name + "!";
}

console.log(greetUser(user.name));
console.log(user.hobbies.length);`,
      expectedOutput: [
        'Hello, Alice!',
        '2'
      ],
      hints: [
        'Object type syntax: { name: string; age: number; ... }',
        'Function syntax: function name(param: type): returnType { }',
        'Access array length with .length property',
        'Use string concatenation or template literals for the greeting'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Array Processing with Types',
      description: `Use array methods with proper typing to process a list of numbers.

**Your task:**
1. Create a \`numbers\` array of type \`number[]\` containing: [10, 25, 30, 45, 50]
2. Use \`filter\` to get only numbers greater than 20, store in \`filtered\`
3. Use \`map\` on filtered to double each number, store in \`doubled\`
4. Use \`reduce\` to sum all doubled numbers, store in \`sum\`
5. Print the sum

**Hint:** filter, map, and reduce are array methods that take callback functions.`,
      starterCode: `// Create the numbers array


// Filter to keep only numbers > 20


// Double each filtered number


// Sum all the doubled numbers


// Print the sum

`,
      solution: `const numbers: number[] = [10, 25, 30, 45, 50];
const filtered: number[] = numbers.filter((n: number) => n > 20);
const doubled: number[] = filtered.map((n: number) => n * 2);
const sum: number = doubled.reduce((acc: number, n: number) => acc + n, 0);

console.log(sum);`,
      expectedOutput: [
        '300'
      ],
      hints: [
        'filter syntax: array.filter((item) => condition)',
        'map syntax: array.map((item) => transformedItem)',
        'reduce syntax: array.reduce((acc, item) => newAcc, initialValue)',
        '25+30+45+50 = 150, doubled = 300'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Error Handling Function',
      description: `Create a function that safely parses numbers with proper error handling.

**Your task:**
1. Create a function \`safeDivide\` that takes two numbers (a, b) and returns a number
2. Inside the function, use try/catch to handle division
3. If b is 0, throw a new Error with message "Cannot divide by zero"
4. In the catch block, return -1 to indicate an error
5. Test by calling safeDivide(10, 2) and safeDivide(10, 0)
6. Print both results

**Expected behavior:** 10/2 = 5, 10/0 should return -1 (error case)`,
      starterCode: `// Create the safeDivide function with error handling


// Test with valid division


// Test with division by zero


// Print both results

`,
      solution: `function safeDivide(a: number, b: number): number {
  try {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return a / b;
  } catch (error) {
    return -1;
  }
}

const result1: number = safeDivide(10, 2);
const result2: number = safeDivide(10, 0);

console.log(result1);
console.log(result2);`,
      expectedOutput: [
        '5',
        '-1'
      ],
      hints: [
        'Check if b === 0 before dividing',
        'throw new Error("message") creates an error',
        'The catch block handles any thrown errors',
        'Return -1 in the catch block to signal an error occurred'
      ]
    }
  ],
  buildNote: {
    title: 'Testing Knowledge in the App',
    explanation: `This test combines concepts from all beginner lessons. In the actual app, these foundational concepts appear everywhere: the Lesson interface uses typed objects, the sidebar uses arrays with filter/map operations, and error handling protects against invalid lesson slugs in the URL. The getLessonBySlug function returns \`Lesson | undefined\` and the page component handles the undefined case gracefully. Every component in the app demonstrates these fundamentals working together.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/index.ts',
      'src/app/lessons/[slug]/page.tsx'
    ],
    inTheRealWorld: `Entry-level TypeScript interviews often test these exact concepts. Companies like Google, Microsoft, and startups alike expect developers to understand variable declarations, basic types, function signatures, array methods, and error handling. These fundamentals form the foundation for everything else in TypeScript development.`
  },
  quiz: [
    // Definition questions
    {
      question: 'What is a "type annotation" in TypeScript?',
      options: [
        'A comment that describes a variable',
        'A way to explicitly declare what type a variable can hold',
        'An error message from the compiler',
        'A function that converts types'
      ],
      correctIndex: 1,
      explanation: 'A type annotation is syntax like `: string` or `: number` that explicitly tells TypeScript what type a variable, parameter, or return value should be.'
    },
    {
      question: 'What is "type inference"?',
      options: [
        'When you must write types for every variable',
        'When TypeScript automatically determines types from context',
        'When types are converted at runtime',
        'When you import types from another file'
      ],
      correctIndex: 1,
      explanation: 'Type inference is TypeScript\'s ability to automatically determine types based on assigned values or context, so you don\'t always need explicit annotations.'
    },
    {
      question: 'What is the purpose of a "return type" in a function?',
      options: [
        'To name the function',
        'To specify what type of value the function will return',
        'To define the function\'s parameters',
        'To make the function run faster'
      ],
      correctIndex: 1,
      explanation: 'A return type (like `: string` after the parentheses) declares what type of value a function will return, helping catch errors when the wrong type is returned.'
    },
    {
      question: 'What does the `void` type represent?',
      options: [
        'An empty string',
        'The number zero',
        'A function that doesn\'t return a value',
        'An undefined variable'
      ],
      correctIndex: 2,
      explanation: 'void is used as a return type for functions that don\'t return anything (or return undefined implicitly). It signals that the caller shouldn\'t expect a return value.'
    },
    {
      question: 'What is an "array" in TypeScript?',
      options: [
        'A single value that can change',
        'An ordered collection of values of the same type',
        'A function that takes multiple parameters',
        'A way to store key-value pairs'
      ],
      correctIndex: 1,
      explanation: 'An array is an ordered list of values. In TypeScript, arrays are typically typed to hold elements of the same type, like `number[]` or `string[]`.'
    },
    // Concept questions
    {
      question: 'Which keyword creates a constant that cannot be reassigned?',
      options: ['var', 'let', 'const', 'static'],
      correctIndex: 2,
      explanation: 'const declares a variable that cannot be reassigned after initialization. var and let allow reassignment, and static is used in classes for class-level members.'
    },
    {
      question: 'What is the difference between `let` and `const`?',
      options: [
        'let is for strings, const is for numbers',
        'let allows reassignment, const does not',
        'const is faster than let',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'let declares a variable that can be reassigned later. const declares a variable that cannot be reassigned after its initial value is set.'
    },
    {
      question: 'Which statement about type inference is TRUE?',
      options: [
        'TypeScript never infers types automatically',
        'Type inference only works with numbers',
        'TypeScript infers types from assigned values when no annotation is provided',
        'Type inference is deprecated in TypeScript 5'
      ],
      correctIndex: 2,
      explanation: 'TypeScript uses type inference to automatically determine types based on the value assigned. For example, let x = 5 infers x as number without needing : number.'
    },
    {
      question: 'What happens when you try to compile this code?\n\n```typescript\nlet age: number = "twenty";\n```',
      options: [
        'It compiles and runs normally',
        'It throws a runtime error',
        'It shows a compile-time type error',
        'It converts "twenty" to a number'
      ],
      correctIndex: 2,
      explanation: 'TypeScript catches type mismatches at compile time. Assigning a string to a number variable produces an error before the code can run.'
    },
    {
      question: 'Which array method would you use to find a single item that matches a condition?',
      options: ['map', 'filter', 'find', 'reduce'],
      correctIndex: 2,
      explanation: 'find() returns the first element that matches the condition, or undefined if none match. filter() returns all matches as an array, map() transforms elements, and reduce() aggregates to a single value.'
    },
    // Code output questions
    {
      question: 'What does this code output?\n\n```typescript\nconst arr = [1, 2, 3];\nconsole.log(arr.map(x => x * 2));\n```',
      options: ['[1, 2, 3]', '[2, 4, 6]', '6', 'undefined'],
      correctIndex: 1,
      explanation: 'The map method creates a new array by applying the callback function to each element. Each element is doubled: 1*2=2, 2*2=4, 3*2=6.'
    },
    {
      question: 'What is the return type of this function?\n\n```typescript\nfunction getMessage(): string {\n  return "Hello";\n}\n```',
      options: ['void', 'any', 'string', 'undefined'],
      correctIndex: 2,
      explanation: 'The function explicitly declares its return type as string after the parentheses. It returns the string "Hello" which matches this type.'
    },
    {
      question: 'What does this code output?\n\n```typescript\nconst nums: number[] = [5, 10, 15];\nconsole.log(nums.filter(n => n > 7).length);\n```',
      options: ['1', '2', '3', '[10, 15]'],
      correctIndex: 1,
      explanation: 'filter(n => n > 7) keeps only numbers greater than 7, resulting in [10, 15]. The .length property then returns 2.'
    },
    {
      question: 'What does this code output?\n\n```typescript\ntry {\n  throw new Error("Oops");\n  console.log("After throw");\n} catch (e) {\n  console.log("Caught");\n}\n```',
      options: ['Oops', 'After throw', 'Caught', 'After throw\\nCaught'],
      correctIndex: 2,
      explanation: 'When an error is thrown, execution jumps immediately to the catch block. The console.log("After throw") line is never reached.'
    },
    {
      question: 'What does this code output?\n\n```typescript\nlet x = 10;\nif (x > 5) {\n  console.log("big");\n} else {\n  console.log("small");\n}\n```',
      options: ['big', 'small', '10', 'true'],
      correctIndex: 0,
      explanation: 'Since x (10) is greater than 5, the condition is true, so "big" is logged. The else branch is not executed.'
    },
    {
      question: 'What does this code output?\n\n```typescript\nconst person = { name: "Alice", age: 30 };\nconsole.log(person.name);\n```',
      options: ['{ name: "Alice", age: 30 }', 'Alice', 'name', 'undefined'],
      correctIndex: 1,
      explanation: 'Dot notation (person.name) accesses the value of the "name" property, which is the string "Alice".'
    }
  ]
};
