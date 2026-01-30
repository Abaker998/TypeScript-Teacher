import { Lesson } from '@/types/lesson';

export const intermediateTest: Lesson = {
  slug: 'intermediate-test',
  title: 'Intermediate Test',
  description: 'Test your understanding of interfaces, generics, classes, type guards, and async programming.',
  difficulty: 'intermediate',
  order: 20,
  content: `
# Intermediate Test

Excellent work completing the Intermediate section! This test will assess your understanding of the core TypeScript patterns that professional developers use daily.

## What This Test Covers

- **Interfaces** — Defining contracts for object shapes
- **Type Aliases** — Creating reusable type definitions
- **Union & Literal Types** — Multiple types and specific values
- **Classes** — Object-oriented programming with TypeScript
- **Generics** — Parameterized types for reusable code
- **Type Guards** — Narrowing types safely at runtime
- **Enums & Modules** — Enumerations and code organization
- **Modern Operators** — Optional chaining and nullish coalescing
- **Functional Programming** — map, filter, reduce patterns
- **Async Programming** — Promises and async/await

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** — reading code and predicting what it prints
- **Coding exercises** — writing code to solve problems

These concepts form the backbone of professional TypeScript development. Take your time!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Generic Data Container',
      description: `Create a generic container class that can hold any type of data.

**Your task:**
1. Create a generic class \`Container<T>\` with:
   - A private \`value\` property of type T
   - A constructor that takes the initial value
   - A \`getValue()\` method that returns the value
   - A \`setValue(newValue: T)\` method to update the value
2. Create a Container holding a number with initial value 10
3. Print the initial value
4. Set a new value of 20
5. Print the updated value

**Expected output:** 10, then 20`,
      starterCode: `// Create the generic Container class


// Create a Container<number> with initial value 10


// Print the initial value


// Set new value to 20


// Print the updated value

`,
      solution: `class Container<T> {
  private value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
  }
}

const numContainer = new Container<number>(10);
console.log(numContainer.getValue());
numContainer.setValue(20);
console.log(numContainer.getValue());`,
      expectedOutput: [
        '10',
        '20'
      ],
      hints: [
        'Generic class syntax: class ClassName<T> { }',
        'Private property: private value: T;',
        'Constructor receives and stores the initial value',
        'Methods use T as the type for parameters and return values'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Type Guards with Union Types',
      description: `Create type guards to safely handle different data shapes.

**Your task:**
1. Define an interface \`Dog\` with: name (string), bark() method returning string
2. Define an interface \`Cat\` with: name (string), meow() method returning string
3. Create a type \`Pet\` that is Dog | Cat
4. Create a type guard function \`isDog(pet: Pet): pet is Dog\` that checks if the pet has a bark method
5. Create a function \`makeSound(pet: Pet)\` that uses the type guard to call the correct method
6. Test with a dog object and print the result

**Note:** Use "in" operator to check for method existence.`,
      starterCode: `// Define Dog interface


// Define Cat interface


// Create Pet union type


// Create isDog type guard


// Create makeSound function


// Test with a dog object

`,
      solution: `interface Dog {
  name: string;
  bark(): string;
}

interface Cat {
  name: string;
  meow(): string;
}

type Pet = Dog | Cat;

function isDog(pet: Pet): pet is Dog {
  return "bark" in pet;
}

function makeSound(pet: Pet): string {
  if (isDog(pet)) {
    return pet.bark();
  } else {
    return pet.meow();
  }
}

const myDog: Dog = {
  name: "Buddy",
  bark() { return "Woof!"; }
};

console.log(makeSound(myDog));`,
      expectedOutput: [
        'Woof!'
      ],
      hints: [
        'Type guard syntax: function isX(val): val is Type { return check; }',
        'Use "property" in object to check if property exists',
        'After the type guard, TypeScript knows the narrowed type',
        'Create the dog object with both name and bark method'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Async Data Fetching',
      description: `Simulate async data fetching with proper typing.

**Your task:**
1. Create an interface \`User\` with: id (number), name (string), email (string)
2. Create an async function \`fetchUser\` that:
   - Takes an id parameter (number)
   - Returns Promise<User>
   - Uses setTimeout to simulate a 100ms delay (wrap in a Promise)
   - Returns a user object with the given id
3. Create an async function \`main\` that:
   - Awaits fetchUser(1)
   - Prints the user's name
4. Call main()

**Note:** Use \`new Promise(resolve => setTimeout(() => resolve(value), 100))\` for the delay.`,
      starterCode: `// Define User interface


// Create async fetchUser function


// Create async main function


// Call main()

`,
      solution: `interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        name: "Alice",
        email: "alice@example.com"
      });
    }, 100);
  });
}

async function main(): Promise<void> {
  const user = await fetchUser(1);
  console.log(user.name);
}

main();`,
      expectedOutput: [
        'Alice'
      ],
      hints: [
        'Async function syntax: async function name(): Promise<ReturnType> { }',
        'Wrap setTimeout in new Promise() to make it awaitable',
        'resolve() is called with the value to return from the Promise',
        'Use await to get the resolved value from a Promise'
      ]
    }
  ],
  buildNote: {
    title: 'Intermediate Patterns in the App',
    explanation: `The TypeScript teaching app uses all these intermediate patterns extensively. The Lesson interface defines contracts that all lesson objects must follow. Generic types appear in React components like useState<Lesson | null>. Type guards check if a lesson exists before rendering. The getLessonsByDifficulty function uses array methods to filter and group lessons. Async patterns appear in any data fetching or API calls. These patterns work together to create type-safe, maintainable code.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/index.ts',
      'src/components/Sidebar.tsx',
      'src/app/lessons/[slug]/page.tsx'
    ],
    inTheRealWorld: `Mid-level TypeScript positions require fluency in these patterns. Companies expect developers to write generic utility functions, use type guards for safe runtime checks, and handle async operations properly. React applications heavily use generics for hooks (useState<T>, useReducer<S, A>) and type guards for conditional rendering.`
  },
  quiz: [
    {
      question: 'What is the main difference between an interface and a type alias?',
      options: [
        'Interfaces are faster at compile time',
        'Type aliases cannot define object shapes',
        'Interfaces can be extended and merged, type aliases use intersections',
        'There is no difference, they are interchangeable'
      ],
      correctIndex: 2,
      explanation: 'Interfaces support declaration merging and extends keyword. Type aliases use intersections (&) for combining types. Both can define object shapes, but they have different extension mechanisms.'
    },
    {
      question: 'What does this code output?\n\n```typescript\ntype Status = "pending" | "approved" | "rejected";\nconst s: Status = "pending";\nconsole.log(s.toUpperCase());\n```',
      options: ['pending', 'PENDING', 'Error: toUpperCase not found', 'Compile error'],
      correctIndex: 1,
      explanation: 'Status is a union of string literal types, which are still strings. String methods like toUpperCase() work normally, outputting "PENDING".'
    },
    {
      question: 'What does the generic constraint `<T extends object>` mean?',
      options: [
        'T must be exactly the object type',
        'T must be any type that is an object (not primitive)',
        'T must extend a class called object',
        'T can be any type including primitives'
      ],
      correctIndex: 1,
      explanation: 'The extends constraint limits T to types that are objects (arrays, objects, functions) and excludes primitives like string, number, and boolean.'
    },
    {
      question: 'What does this code output?\n\n```typescript\nconst obj = { a: 1, b: 2, c: 3 };\nconst { a, ...rest } = obj;\nconsole.log(Object.keys(rest).length);\n```',
      options: ['1', '2', '3', 'undefined'],
      correctIndex: 1,
      explanation: 'Destructuring with rest (...rest) collects the remaining properties. After extracting a, rest contains { b: 2, c: 3 }, which has 2 keys.'
    },
    {
      question: 'What is the purpose of a type guard function?',
      options: [
        'To prevent any type errors at compile time',
        'To narrow a union type to a specific type at runtime',
        'To guard against null values only',
        'To convert types automatically'
      ],
      correctIndex: 1,
      explanation: 'Type guards narrow union types at runtime. They use runtime checks (like typeof or "in") to tell TypeScript which specific type is being used in a code block.'
    },
    {
      question: 'What does this code output?\n\n```typescript\nconst user = { name: "Alice", address: { city: "NYC" } };\nconsole.log(user?.address?.city ?? "Unknown");\n```',
      options: ['undefined', 'null', 'NYC', 'Unknown'],
      correctIndex: 2,
      explanation: 'Optional chaining (?.) safely accesses nested properties. Since user.address.city exists and is "NYC", that value is returned. The nullish coalescing (??) only kicks in for null/undefined.'
    },
    {
      question: 'What is the return type of an async function that returns a number?',
      options: ['number', 'Promise<number>', 'async number', 'Awaited<number>'],
      correctIndex: 1,
      explanation: 'Async functions always wrap their return value in a Promise. An async function returning a number has the type Promise<number>.'
    },
    {
      question: 'What does this code output?\n\n```typescript\nenum Color { Red = 1, Green, Blue }\nconsole.log(Color.Blue);\n```',
      options: ['2', '3', '"Blue"', 'undefined'],
      correctIndex: 1,
      explanation: 'In numeric enums, values auto-increment from the first specified value. Red = 1, Green = 2, Blue = 3. Accessing Color.Blue returns 3.'
    },
    {
      question: 'Which operator safely handles potentially null/undefined values?',
      options: ['&&', '||', '?.', '!'],
      correctIndex: 2,
      explanation: 'Optional chaining (?.) short-circuits and returns undefined if the left side is null/undefined, preventing runtime errors when accessing properties on nullish values.'
    },
    {
      question: 'What does `readonly` do when applied to a property?',
      options: [
        'Makes the property invisible',
        'Prevents the property from being changed after initialization',
        'Makes the property optional',
        'Converts the property to a constant'
      ],
      correctIndex: 1,
      explanation: 'readonly properties can only be assigned during initialization (in the constructor or at declaration). Attempts to reassign them later cause compile errors.'
    }
  ]
};
