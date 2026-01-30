/**
 * Error Explainer - Maps TypeScript/JavaScript errors to beginner-friendly explanations
 */

export interface ErrorExplanation {
  title: string;
  explanation: string;
  example?: {
    wrong: string;
    right: string;
  };
  tips: string[];
}

interface ErrorPattern {
  pattern: RegExp;
  getExplanation: (match: RegExpMatchArray, originalMessage: string) => ErrorExplanation;
}

const errorPatterns: ErrorPattern[] = [
  // Type mismatch errors
  {
    pattern: /Type '(.+)' is not assignable to type '(.+)'/,
    getExplanation: (match) => ({
      title: "Type Mismatch",
      explanation: `You're trying to use a ${match[1]} where a ${match[2]} is expected. TypeScript is strict about types - they must match exactly.`,
      example: {
        wrong: `let age: number = "25"; // Can't assign string to number`,
        right: `let age: number = 25;   // Numbers don't have quotes`
      },
      tips: [
        `Check if you accidentally used quotes around a number`,
        `Make sure your variable type matches what you're assigning`,
        match[1] === 'string' && match[2] === 'number'
          ? `To convert a string to number, use: Number("25") or parseInt("25")`
          : `Double-check what type your value actually is`
      ].filter(Boolean) as string[]
    })
  },

  // Cannot find name (undefined variable)
  {
    pattern: /Cannot find name '(.+)'/,
    getExplanation: (match) => ({
      title: "Variable Not Found",
      explanation: `TypeScript can't find a variable called "${match[1]}". This usually means it wasn't declared, or there's a typo.`,
      example: {
        wrong: `console.log(mesage);  // Typo: 'mesage' instead of 'message'`,
        right: `let message = "Hello";\nconsole.log(message); // Correct spelling`
      },
      tips: [
        `Check the spelling - did you type "${match[1]}" correctly?`,
        `Make sure you declared the variable with let, const, or var before using it`,
        `Remember: JavaScript is case-sensitive (myVar ≠ myvar)`
      ]
    })
  },

  // Property does not exist
  {
    pattern: /Property '(.+)' does not exist on type '(.+)'/,
    getExplanation: (match) => ({
      title: "Property Doesn't Exist",
      explanation: `You're trying to access ".${match[1]}" but that property doesn't exist on ${match[2]}.`,
      example: {
        wrong: `let name = "Alice";\nconsole.log(name.length);  // Works!\nconsole.log(name.len);     // Error: 'len' doesn't exist`,
        right: `let name = "Alice";\nconsole.log(name.length);  // Use the correct property name`
      },
      tips: [
        `Check for typos in the property name`,
        `Make sure the object actually has this property`,
        `Use autocomplete (Ctrl+Space) to see available properties`
      ]
    })
  },

  // Missing semicolon or syntax error
  {
    pattern: /';' expected/,
    getExplanation: () => ({
      title: "Missing Semicolon",
      explanation: `TypeScript expected a semicolon (;) at the end of a statement. While JavaScript often allows you to skip them, TypeScript is stricter.`,
      example: {
        wrong: `let x = 5\nlet y = 10`,
        right: `let x = 5;\nlet y = 10;`
      },
      tips: [
        `Add a semicolon at the end of each statement`,
        `Check the line above the error - the problem is often there`,
        `Make sure you closed all parentheses and brackets`
      ]
    })
  },

  // Missing closing bracket/parenthesis
  {
    pattern: /'(\)|\}|\])' expected/,
    getExplanation: (_match) => {
      return {
        title: "Missing Bracket",
        explanation: `You opened a bracket but forgot to close it. Every opening bracket needs a matching closing one.`,
        example: {
          wrong: `function greet(name: string {\n  console.log(name);\n}`,
          right: `function greet(name: string) {\n  console.log(name);\n}`
        },
        tips: [
          `Count your brackets: every ( needs a ), every { needs a }, every [ needs a ]`,
          `The error is often on a line BEFORE where TypeScript reports it`,
          `Use your editor's bracket matching feature (click on a bracket to find its pair)`
        ]
      };
    }
  },

  // Argument count mismatch
  {
    pattern: /Expected (\d+) arguments?, but got (\d+)/,
    getExplanation: (match) => ({
      title: "Wrong Number of Arguments",
      explanation: `This function expects ${match[1]} argument${match[1] === '1' ? '' : 's'}, but you gave it ${match[2]}.`,
      example: {
        wrong: `function greet(name: string) { }\ngreet();          // Error: Expected 1, got 0\ngreet("A", "B");  // Error: Expected 1, got 2`,
        right: `function greet(name: string) { }\ngreet("Alice");   // Correct: exactly 1 argument`
      },
      tips: [
        `Check the function definition to see what arguments it needs`,
        `If an argument is optional, it should have a ? like: name?: string`,
        `Make sure you're not accidentally adding extra commas`
      ]
    })
  },

  // Object literal may only specify known properties
  {
    pattern: /Object literal may only specify known properties, and '(.+)' does not exist/,
    getExplanation: (match) => ({
      title: "Unknown Property",
      explanation: `You added a property "${match[1]}" that isn't defined in the type. TypeScript only allows properties that are explicitly declared.`,
      example: {
        wrong: `type User = { name: string };\nlet user: User = { name: "Alice", age: 25 };  // 'age' not in type`,
        right: `type User = { name: string; age: number };\nlet user: User = { name: "Alice", age: 25 };  // Now 'age' is allowed`
      },
      tips: [
        `Check if you spelled the property name correctly`,
        `Add the missing property to your type definition`,
        `If the property is optional, add it with ?: like age?: number`
      ]
    })
  },

  // Implicit any type
  {
    pattern: /Parameter '(.+)' implicitly has an '?any'? type/,
    getExplanation: (match) => ({
      title: "Missing Type Annotation",
      explanation: `The parameter "${match[1]}" needs a type. TypeScript doesn't know what type of value to expect.`,
      example: {
        wrong: `function greet(name) {       // Error: what type is 'name'?\n  console.log(name);\n}`,
        right: `function greet(name: string) {  // Now TypeScript knows!\n  console.log(name);\n}`
      },
      tips: [
        `Add a type after the parameter: (name: string)`,
        `Common types: string, number, boolean, string[], object`,
        `If it can be multiple types: (value: string | number)`
      ]
    })
  },

  // Unused variable
  {
    pattern: /'(.+)' is declared but its value is never read/,
    getExplanation: (match) => ({
      title: "Unused Variable",
      explanation: `You created "${match[1]}" but never used it. This isn't a critical error, but it might mean you forgot something.`,
      example: {
        wrong: `let greeting = "Hello";  // Created but never used\nconsole.log("Hi");`,
        right: `let greeting = "Hello";\nconsole.log(greeting);   // Now it's used!`
      },
      tips: [
        `Did you mean to use this variable somewhere?`,
        `If you don't need it, you can remove it`,
        `Prefix with underscore to mark as intentionally unused: _unused`
      ]
    })
  },

  // Cannot redeclare variable
  {
    pattern: /Cannot redeclare block-scoped variable '(.+)'/,
    getExplanation: (match) => ({
      title: "Variable Already Exists",
      explanation: `You already have a variable called "${match[1]}". You can't create two variables with the same name in the same scope.`,
      example: {
        wrong: `let score = 10;\nlet score = 20;  // Error: already declared`,
        right: `let score = 10;\nscore = 20;      // Just reassign (no 'let')`
      },
      tips: [
        `To change a variable's value, just use the name without let/const`,
        `If you need both values, use different names`,
        `Check if you accidentally copied and pasted code`
      ]
    })
  },

  // Assignment to constant
  {
    pattern: /Cannot assign to '(.+)' because it is a constant/,
    getExplanation: (match) => ({
      title: "Can't Change a Constant",
      explanation: `"${match[1]}" was declared with const, which means it can never be changed. That's the whole point of constants!`,
      example: {
        wrong: `const PI = 3.14;\nPI = 3.14159;  // Error: can't change a const`,
        right: `let PI = 3.14;   // Use 'let' if you need to change it\nPI = 3.14159;    // Now this works`
      },
      tips: [
        `Use let instead of const if the value needs to change`,
        `Use const for values that should never change (like PI, URLs, config)`,
        `const objects CAN have their properties changed, just not be reassigned`
      ]
    })
  },

  // Return type mismatch
  {
    pattern: /Type '(.+)' is not assignable to type '(.+)'.*return/i,
    getExplanation: (match) => ({
      title: "Wrong Return Type",
      explanation: `This function should return a ${match[2]}, but you're returning a ${match[1]} instead.`,
      example: {
        wrong: `function getAge(): number {\n  return "25";  // Error: returning string, not number\n}`,
        right: `function getAge(): number {\n  return 25;    // Correct: returning a number\n}`
      },
      tips: [
        `Check the function's return type (after the colon)`,
        `Make sure your return value matches that type`,
        `If you return different types, the return type should use | (union)`
      ]
    })
  },

  // Null/undefined not assignable
  {
    pattern: /Type '(null|undefined)' is not assignable to type '(.+)'/,
    getExplanation: (match) => ({
      title: `Can't Use ${match[1]}`,
      explanation: `You're trying to use ${match[1]}, but this variable/parameter doesn't allow ${match[1]} values.`,
      example: {
        wrong: `let name: string = null;  // Error: string doesn't allow null`,
        right: `let name: string | null = null;  // Now null is allowed`
      },
      tips: [
        `Add | null or | undefined to the type if ${match[1]} is valid`,
        `Check if you should provide a default value instead`,
        `Use optional chaining (?.) to safely handle potentially ${match[1]} values`
      ]
    })
  },

  // Generic catch-all for is not a function
  {
    pattern: /(.+) is not a function/,
    getExplanation: (match) => ({
      title: "Not a Function",
      explanation: `You're trying to call "${match[1]}" like a function, but it's not a function.`,
      example: {
        wrong: `let count = 5;\ncount();  // Error: 5 is not a function`,
        right: `let count = 5;\nconsole.log(count);  // Just use the value`
      },
      tips: [
        `Remove the () if you just want the value`,
        `Check if you meant to use a different variable that IS a function`,
        `Make sure you didn't accidentally overwrite a function with a regular value`
      ]
    })
  },

  // Undefined is not an object / Cannot read property
  {
    pattern: /Cannot read propert(y|ies) of (undefined|null)/,
    getExplanation: () => ({
      title: "Accessing Undefined",
      explanation: `You're trying to access a property on something that's undefined or null. It's like trying to open a door that doesn't exist.`,
      example: {
        wrong: `let user = undefined;\nconsole.log(user.name);  // Error: user is undefined`,
        right: `let user = { name: "Alice" };\nconsole.log(user.name);  // Works: user exists`
      },
      tips: [
        `Check that the variable has a value before accessing properties`,
        `Use optional chaining: user?.name (returns undefined safely)`,
        `Initialize your variables: let user = { } instead of let user`
      ]
    })
  },

  // Array element access
  {
    pattern: /Type '(.+)' has no matching index signature/,
    getExplanation: () => ({
      title: "Invalid Index Access",
      explanation: `You're trying to access this object with square brackets [], but TypeScript doesn't know what type that would return.`,
      example: {
        wrong: `type User = { name: string };\nlet user: User = { name: "Alice" };\nlet value = user["unknown"];  // TypeScript doesn't know this`,
        right: `type User = { name: string; [key: string]: string };\nlet user: User = { name: "Alice" };\nlet value = user["unknown"];  // Now index access is allowed`
      },
      tips: [
        `Use dot notation if you know the property name: object.property`,
        `Add an index signature to your type if dynamic access is needed`,
        `Check if you meant to use an array instead of an object`
      ]
    })
  }
];

/**
 * Get a beginner-friendly explanation for an error message
 */
export function explainError(errorMessage: string): ErrorExplanation {
  // Try to match against known patterns
  for (const { pattern, getExplanation } of errorPatterns) {
    const match = errorMessage.match(pattern);
    if (match) {
      return getExplanation(match, errorMessage);
    }
  }

  // Default explanation for unknown errors
  return {
    title: "TypeScript Error",
    explanation: errorMessage,
    tips: [
      "Read the error message carefully - it usually tells you exactly what's wrong",
      "Check the line number mentioned in the error",
      "Look for typos, missing brackets, or incorrect types",
      "Try breaking your code into smaller parts to find the issue"
    ]
  };
}

/**
 * Get explanations for multiple errors
 */
export function explainErrors(errors: Array<{ message: string; line: number; column: number }>): Array<{
  original: { message: string; line: number; column: number };
  explanation: ErrorExplanation;
}> {
  return errors.map(error => ({
    original: error,
    explanation: explainError(error.message)
  }));
}
