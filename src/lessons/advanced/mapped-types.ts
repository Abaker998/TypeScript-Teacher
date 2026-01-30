import { Lesson } from '@/types/lesson';

export const mappedTypes: Lesson = {
  slug: 'mapped-types',
  title: 'Mapped Types',
  description: 'Transform object types by iterating over their keys and creating new types programmatically.',
  difficulty: 'advanced',
  order: 19,
  content: `
# Mapped Types

Mapped types transform an existing type into a new one by iterating over its keys. They let you programmatically create new types based on existing ones.

## The Pattern: in keyof

The basic syntax uses a loop through keys:

\`\`\`typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// Result: { readonly name: string; readonly age: number; }
\`\`\`

The \`keyof T\` extracts all property names from type T. The \`in\` keyword iterates over them. \`T[K]\` accesses the property type.

## Built-in Mapped Types

TypeScript includes useful mapped types in its standard library:

- **Partial<T>** — makes all properties optional
- **Required<T>** — makes all properties required
- **Readonly<T>** — makes all properties readonly
- **Record<K, V>** — creates an object with keys K and values V
- **Pick<T, K>** — selects specific properties from T
- **Omit<T, K>** — removes specific properties from T

\`\`\`typescript
interface User {
  name: string;
  email: string;
  age?: number;
}

type PartialUser = Partial<User>;
// All properties become optional

type NameAndEmail = Pick<User, "name" | "email">;
// Only name and email

type NoEmail = Omit<User, "email">;
// Everything except email
\`\`\`

## Custom Mapped Types

You can write your own for custom transformations:

\`\`\`typescript
type Getters<T> = {
  [K in keyof T]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// Result: { name: () => string; age: () => number; }
\`\`\`

This transforms object properties into getter functions.

## Practical Example

\`\`\`typescript
type BooleanFlags<T> = {
  [K in keyof T]: boolean;
};

interface Settings {
  darkMode: string;
  notifications: string;
  autoSave: string;
}

type SettingsFlags = BooleanFlags<Settings>;
// Result: { darkMode: boolean; notifications: boolean; autoSave: boolean; }
\`\`\`

Perfect when you need the same keys but different value types.

## Learning Objectives

By the end of this lesson, you'll be able to:
- Understand mapped type syntax with in keyof
- Use built-in mapped types like Partial and Required
- Transform property types across an object
- Write custom mapped types for domain-specific logic
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Using Built-in Mapped Types',
      description: `Transform object properties into getter functions using a mapped type.

**Your task:**
1. Define a mapped type \`Getters<T>\` that converts each property to a function returning that type
2. Create the \`Config\` interface with \`timeout: number\` and \`url: string\`
3. Apply \`Getters\` to create \`ConfigGetters\`
4. Create a \`config\` object with getter functions and log their return values`,
      starterCode: `// Step 1: Define the Getters<T> mapped type


// Step 2: Create the Config interface


// Step 3: Apply Getters to Config


// Step 4: Create config object and log values
`,
      solution: `type Getters<T> = {
  [K in keyof T]: () => T[K];
};

interface Config {
  timeout: number;
  url: string;
}

type ConfigGetters = Getters<Config>;
// Result: { timeout: () => number; url: () => string; }

const config: ConfigGetters = {
  timeout: () => 5000,
  url: () => "http://api.example.com"
};

console.log(config.timeout());
console.log(config.url());`,
      expectedOutput: ['5000', 'http://api.example.com'],
      hints: [
        'Mapped type syntax: { [K in keyof T]: NewType }',
        'For getters, use () => T[K] as the value type',
        'Call the functions when logging: config.timeout()'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Creating Custom Mapped Type',
      description: `Create a mapped type that adds null as a possible value for every property.

**Your task:**
1. Define a \`Nullable<T>\` mapped type using union with \`null\`
2. Create a \`User\` interface with \`id\`, \`name\`, and \`email\`
3. Apply \`Nullable\` to create \`NullableUser\`
4. Create a user object with \`email: null\` and log all three properties`,
      starterCode: `// Step 1: Define the Nullable<T> mapped type


// Step 2: Create the User interface


// Step 3: Apply Nullable to User


// Step 4: Create object with null email and log values
`,
      solution: `type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  id: number;
  name: string;
  email: string;
}

type NullableUser = Nullable<User>;

const partialUser: NullableUser = {
  id: 1,
  name: "Alice",
  email: null  // Can be null now
};

console.log(partialUser.id);
console.log(partialUser.name);
console.log(partialUser.email);`,
      expectedOutput: ['1', 'Alice', 'null'],
      hints: [
        'Use T[K] | null to allow null for each property',
        'keyof T extracts all property names as a union',
        'T[K] accesses the type of property K'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Combining Mapped Types',
      description: `Create setter methods from properties, then make them optional using Partial.

**Your task:**
1. Define a \`Methods<T>\` type where each property becomes \`(value: T[K]) => void\`
2. Define \`OptionalMethods<T>\` as \`Partial<Methods<T>>\`
3. Create a \`Settings\` interface with \`theme: string\` and \`volume: number\`
4. Create a handlers object with only the \`theme\` setter and test it`,
      starterCode: `// Step 1: Define the Methods<T> mapped type


// Step 2: Define OptionalMethods using Partial


// Step 3: Create the Settings interface


// Step 4: Create handlers with only theme setter
`,
      solution: `type Methods<T> = {
  [K in keyof T]: (value: T[K]) => void;
};

type OptionalMethods<T> = Partial<Methods<T>>;

interface Settings {
  theme: string;
  volume: number;
}

type SettingsMethods = Methods<Settings>;
type OptionalSettingsMethods = OptionalMethods<Settings>;

const handlers: OptionalSettingsMethods = {
  theme: (value) => console.log("Theme set to: " + value)
  // volume is optional, so we can omit it
};

handlers.theme?.("dark");
console.log("Volume handler exists: " + (handlers.volume !== undefined));`,
      expectedOutput: ['Theme set to: dark', 'Volume handler exists: false'],
      hints: [
        'Setter type: (value: T[K]) => void',
        'Compose types: Partial<Methods<T>>',
        'Use optional chaining (?.) for possibly undefined methods'
      ],
    },
  ],
  buildNote: {
    title: 'Mapped Types in the App',
    explanation: `The app uses \`Record<Difficulty, number>\` extensively throughout \`src/lessons/index.ts\` — this is a mapped type that creates an object with keys from the \`Difficulty\` union and values of type \`number\`. The helper function \`getLessonsByDifficulty()\` uses \`Record<Difficulty, string>\` to map each difficulty level to its display label ("Beginner", "Intermediate", "Advanced"). When you define \`const labels: Record<Difficulty, string> = { beginner: '...', ... }\`, TypeScript verifies you've provided all three keys — if you forget "advanced", you get a compile error. Another example: the app could compute \`lessonCounts: Record<Difficulty, number>\` to track how many lessons are in each category. Mapped types are powerful because they enforce consistency — if the Difficulty type changes to include "expert", all your Record types would immediately show errors, forcing you to update them. This prevents the subtle bugs where you forget to handle a new difficulty level in some utility function. Pick, Omit, and Partial are also mapped types that transform existing types into new variants by modifying their properties.`,
    relatedFiles: [
      'src/lessons/index.ts',
      'src/components/Sidebar.tsx',
      'src/lib/lesson-utils.ts'
    ],
    inTheRealWorld: `Mapped types are powerful in large codebases. GraphQL clients use \`type FieldMap<T> = { [K in keyof T]: T[K] | null }\` to add nullable variants of fields. Component libraries use \`type Disabled<T> = { [K in keyof T]: boolean }\` to control which props are disabled. Form validation libraries use mapped types to create error objects matching form shapes. CSS-in-JS libraries use them to ensure style objects match component prop types. Testing libraries use mapped types to create test suites that mirror interface properties, ensuring comprehensive test coverage.`
  }
};
