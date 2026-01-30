/**
 * Error Explainer - Maps TypeScript/JavaScript errors to beginner-friendly explanations
 */

export interface ErrorExplanation {
  title: string;
  explanation: string;
  whatThisMeans: string;
  howToFix: string;
  example?: {
    wrong: string;
    right: string;
  };
  tips: string[];
  commonCauses?: string[];
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
      whatThisMeans: `TypeScript found a value of type "${match[1]}" but the code expects "${match[2]}". These types are incompatible.`,
      howToFix: match[1] === 'string' && match[2] === 'number'
        ? `Remove the quotes around your number, or use Number("value") to convert a string to a number.`
        : match[1] === 'number' && match[2] === 'string'
        ? `Add quotes around your value to make it a string, or use String(value) to convert.`
        : `Make sure the value you're assigning matches the expected type "${match[2]}".`,
      example: {
        wrong: `let age: number = "25"; // Can't assign string to number`,
        right: `let age: number = 25;   // Numbers don't have quotes`
      },
      commonCauses: [
        'Forgot to remove quotes around a number',
        'Wrong variable type declaration',
        'Function returns a different type than expected',
        'Array or object property has wrong type'
      ],
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
      whatThisMeans: `You're trying to use "${match[1]}" but TypeScript doesn't know what it is. The variable either doesn't exist or isn't visible in this scope.`,
      howToFix: `Declare the variable with let, const, or var before using it, or fix the spelling if it's a typo.`,
      example: {
        wrong: `console.log(mesage);  // Typo: 'mesage' instead of 'message'`,
        right: `let message = "Hello";\nconsole.log(message); // Correct spelling`
      },
      commonCauses: [
        'Typo in the variable name',
        'Variable declared in a different scope (inside a function/block)',
        'Forgot to declare the variable',
        'Using a variable before it\'s defined'
      ],
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
      whatThisMeans: `The type "${match[2]}" doesn't have a property called "${match[1]}". Either it's a typo, or you need to add this property to the type.`,
      howToFix: `Check the spelling of "${match[1]}" or verify that the object/type actually has this property.`,
      example: {
        wrong: `let name = "Alice";\nconsole.log(name.length);  // Works!\nconsole.log(name.len);     // Error: 'len' doesn't exist`,
        right: `let name = "Alice";\nconsole.log(name.length);  // Use the correct property name`
      },
      commonCauses: [
        'Typo in the property name',
        'Using an array method on an object or vice versa',
        'Property exists but with different casing',
        'Object doesn\'t have the expected shape'
      ],
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
      whatThisMeans: `Did you forget a semicolon? TypeScript found an unexpected token where it expected a statement to end.`,
      howToFix: `Add a semicolon (;) at the end of the line, or check if you have unclosed brackets or parentheses.`,
      example: {
        wrong: `let x = 5\nlet y = 10`,
        right: `let x = 5;\nlet y = 10;`
      },
      commonCauses: [
        'Missing semicolon at end of statement',
        'Unclosed parentheses or brackets on previous line',
        'Missing comma in object or array',
        'Forgot closing quote on a string'
      ],
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
    getExplanation: (match) => {
      const bracketName = match[1] === ')' ? 'parenthesis' : match[1] === '}' ? 'curly brace' : 'square bracket';
      return {
        title: "Missing Bracket",
        explanation: `You opened a bracket but forgot to close it. Every opening bracket needs a matching closing one.`,
        whatThisMeans: `TypeScript expected a closing ${bracketName} but didn't find one. You have an unmatched bracket somewhere.`,
        howToFix: `Find the opening bracket that's missing its pair and add the closing ${bracketName}.`,
        example: {
          wrong: `function greet(name: string {\n  console.log(name);\n}`,
          right: `function greet(name: string) {\n  console.log(name);\n}`
        },
        commonCauses: [
          'Forgot to close a function parameter list',
          'Missing closing brace for if/for/function',
          'Unclosed array or object literal',
          'Nested brackets with missing pair'
        ],
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
      whatThisMeans: `You called a function with the wrong number of values. It needs ${match[1]} but you provided ${match[2]}.`,
      howToFix: parseInt(match[2]) < parseInt(match[1])
        ? `Add the missing argument${parseInt(match[1]) - parseInt(match[2]) > 1 ? 's' : ''} to your function call.`
        : `Remove the extra argument${parseInt(match[2]) - parseInt(match[1]) > 1 ? 's' : ''} from your function call.`,
      example: {
        wrong: `function greet(name: string) { }\ngreet();          // Error: Expected 1, got 0\ngreet("A", "B");  // Error: Expected 1, got 2`,
        right: `function greet(name: string) { }\ngreet("Alice");   // Correct: exactly 1 argument`
      },
      commonCauses: [
        'Forgot to pass a required argument',
        'Passed extra arguments by mistake',
        'Calling the wrong function',
        'Function signature changed but call wasn\'t updated'
      ],
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
      whatThisMeans: `The type definition doesn't include a property called "${match[1]}". TypeScript is preventing you from adding unknown properties.`,
      howToFix: `Either add "${match[1]}" to your type definition, or remove it from the object if it's not needed.`,
      example: {
        wrong: `type User = { name: string };\nlet user: User = { name: "Alice", age: 25 };  // 'age' not in type`,
        right: `type User = { name: string; age: number };\nlet user: User = { name: "Alice", age: 25 };  // Now 'age' is allowed`
      },
      commonCauses: [
        'Typo in property name',
        'Property not defined in interface/type',
        'Using an old type definition',
        'Copy-pasted object with extra properties'
      ],
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
      whatThisMeans: `TypeScript can't figure out what type "${match[1]}" should be. Without a type, it becomes "any" which defeats the purpose of TypeScript.`,
      howToFix: `Add a type annotation after the parameter name, like: ${match[1]}: string`,
      example: {
        wrong: `function greet(name) {       // Error: what type is 'name'?\n  console.log(name);\n}`,
        right: `function greet(name: string) {  // Now TypeScript knows!\n  console.log(name);\n}`
      },
      commonCauses: [
        'Forgot to add type annotation to function parameter',
        'TypeScript strict mode is enabled',
        'Arrow function without parameter types'
      ],
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
      whatThisMeans: `The variable "${match[1]}" exists but is never referenced anywhere in your code. This could indicate a bug or unnecessary code.`,
      howToFix: `Either use the variable somewhere, remove it if unneeded, or prefix with underscore (_${match[1]}) to mark it as intentionally unused.`,
      example: {
        wrong: `let greeting = "Hello";  // Created but never used\nconsole.log("Hi");`,
        right: `let greeting = "Hello";\nconsole.log(greeting);   // Now it's used!`
      },
      commonCauses: [
        'Typo when trying to use the variable',
        'Code was refactored but variable wasn\'t removed',
        'Variable created for future use but not yet used'
      ],
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
      whatThisMeans: `A variable named "${match[1]}" was already declared. You can't declare it again with let or const.`,
      howToFix: `To update the value, just use ${match[1]} = newValue without the let/const keyword. Or use a different variable name.`,
      example: {
        wrong: `let score = 10;\nlet score = 20;  // Error: already declared`,
        right: `let score = 10;\nscore = 20;      // Just reassign (no 'let')`
      },
      commonCauses: [
        'Accidentally wrote let/const twice',
        'Copy-pasted code that declares the same variable',
        'Variable declared in global scope conflicts with local'
      ],
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
      whatThisMeans: `You're trying to reassign "${match[1]}", but it was declared with const. Constants cannot be changed after creation.`,
      howToFix: `Change const to let if you need to reassign the variable, or create a new variable with a different name.`,
      example: {
        wrong: `const PI = 3.14;\nPI = 3.14159;  // Error: can't change a const`,
        right: `let PI = 3.14;   // Use 'let' if you need to change it\nPI = 3.14159;    // Now this works`
      },
      commonCauses: [
        'Variable should have been declared with let',
        'Trying to update a value that should stay constant',
        'Loop variable declared with const instead of let'
      ],
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
      whatThisMeans: `The function says it returns "${match[2]}" but you're actually returning "${match[1]}". These types don't match.`,
      howToFix: `Either change your return value to match type "${match[2]}", or update the function's return type.`,
      example: {
        wrong: `function getAge(): number {\n  return "25";  // Error: returning string, not number\n}`,
        right: `function getAge(): number {\n  return 25;    // Correct: returning a number\n}`
      },
      commonCauses: [
        'Returning a string instead of a number (or vice versa)',
        'Forgot to return anything in some code paths',
        'Return type annotation doesn\'t match implementation'
      ],
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
      whatThisMeans: `The type "${match[2]}" doesn't include ${match[1]} as a valid value. TypeScript is protecting you from null/undefined errors.`,
      howToFix: `Either provide a real value instead of ${match[1]}, or change the type to: ${match[2]} | ${match[1]}`,
      example: {
        wrong: `let name: string = null;  // Error: string doesn't allow null`,
        right: `let name: string | null = null;  // Now null is allowed`
      },
      commonCauses: [
        'Strict null checks are enabled',
        'Variable might not have a value yet',
        'Function might return null/undefined'
      ],
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
      whatThisMeans: `You used parentheses () to call "${match[1]}", but it's not something you can call. It might be a variable, property, or the wrong name.`,
      howToFix: `Remove the () to access the value directly, or check if you're using the right variable name.`,
      example: {
        wrong: `let count = 5;\ncount();  // Error: 5 is not a function`,
        right: `let count = 5;\nconsole.log(count);  // Just use the value`
      },
      commonCauses: [
        'Added () to a non-function value',
        'Variable has same name as a function you wanted',
        'Object property is not a method',
        'Function was overwritten with a different value'
      ],
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
    getExplanation: (match) => ({
      title: "Accessing Undefined",
      explanation: `You're trying to access a property on something that's undefined or null. It's like trying to open a door that doesn't exist.`,
      whatThisMeans: `The value you're trying to access properties on is ${match[2]}. You can't read properties from nothing!`,
      howToFix: `Make sure the value exists before accessing properties. Use optional chaining (?.property) or check with if statements.`,
      example: {
        wrong: `let user = undefined;\nconsole.log(user.name);  // Error: user is undefined`,
        right: `let user = { name: "Alice" };\nconsole.log(user.name);  // Works: user exists`
      },
      commonCauses: [
        'Variable not initialized before use',
        'Array element doesn\'t exist at that index',
        'API response doesn\'t have expected data',
        'Object property returns undefined'
      ],
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
    getExplanation: (match) => ({
      title: "Invalid Index Access",
      explanation: `You're trying to access this object with square brackets [], but TypeScript doesn't know what type that would return.`,
      whatThisMeans: `The type "${match[1]}" doesn't allow accessing properties with bracket notation like obj["key"].`,
      howToFix: `Use dot notation (obj.property) for known properties, or add an index signature to your type.`,
      example: {
        wrong: `type User = { name: string };\nlet user: User = { name: "Alice" };\nlet value = user["unknown"];  // TypeScript doesn't know this`,
        right: `type User = { name: string; [key: string]: string };\nlet user: User = { name: "Alice" };\nlet value = user["unknown"];  // Now index access is allowed`
      },
      commonCauses: [
        'Using bracket notation on a typed object',
        'Dynamic property access without index signature',
        'Object doesn\'t allow arbitrary keys'
      ],
      tips: [
        `Use dot notation if you know the property name: object.property`,
        `Add an index signature to your type if dynamic access is needed`,
        `Check if you meant to use an array instead of an object`
      ]
    })
  },

  // Missing return statement
  {
    pattern: /A function whose declared type is neither 'void' nor 'any' must return a value/,
    getExplanation: () => ({
      title: "Missing Return Statement",
      explanation: `This function is supposed to return a value, but not all code paths have a return statement.`,
      whatThisMeans: `Your function declares a return type but there's a way to reach the end without returning anything.`,
      howToFix: `Add a return statement at the end of every code path, or add one as a final fallback.`,
      example: {
        wrong: `function getGreeting(name: string): string {\n  if (name) {\n    return "Hello " + name;\n  }\n  // Missing return when name is falsy!\n}`,
        right: `function getGreeting(name: string): string {\n  if (name) {\n    return "Hello " + name;\n  }\n  return "Hello stranger";\n}`
      },
      commonCauses: [
        'Forgot return statement in else branch',
        'Not all if/else branches return',
        'Early return without handling all cases'
      ],
      tips: [
        `Make sure every if/else branch has a return`,
        `Add a default return at the end of the function`,
        `If you don't want to return anything, use void as return type`
      ]
    })
  },

  // Cannot use 'new' with expression
  {
    pattern: /Cannot use 'new' with an expression whose type lacks a call or construct signature/,
    getExplanation: () => ({
      title: "Can't Use 'new' Here",
      explanation: `You're using 'new' with something that isn't a class or constructor function.`,
      whatThisMeans: `The 'new' keyword creates instances of classes, but what you're calling isn't a constructor.`,
      howToFix: `Remove 'new' if calling a regular function, or make sure you're using a class or constructor.`,
      example: {
        wrong: `const add = (a: number, b: number) => a + b;\nconst result = new add(1, 2);  // Error: add is not a constructor`,
        right: `const add = (a: number, b: number) => a + b;\nconst result = add(1, 2);  // Just call it normally`
      },
      commonCauses: [
        'Using new with an arrow function',
        'Calling a regular function with new',
        'Variable doesn\'t hold a class'
      ],
      tips: [
        `Only use 'new' with classes or constructor functions`,
        `Arrow functions cannot be used with 'new'`,
        `Check if you're calling the right variable`
      ]
    })
  },

  // Duplicate identifier
  {
    pattern: /Duplicate identifier '(.+)'/,
    getExplanation: (match) => ({
      title: "Duplicate Name",
      explanation: `The name "${match[1]}" is already used. Each identifier must be unique in its scope.`,
      whatThisMeans: `You have two things (variables, functions, types) with the same name "${match[1]}" in the same scope.`,
      howToFix: `Rename one of them to avoid the conflict, or remove the duplicate declaration.`,
      example: {
        wrong: `function greet() { }\nfunction greet() { }  // Error: greet already exists`,
        right: `function greet() { }\nfunction greetUser() { }  // Different names`
      },
      commonCauses: [
        'Copy-pasted code with same names',
        'Imported something with same name as local variable',
        'Function and variable with same name'
      ],
      tips: [
        `Use unique names for each function, variable, and type`,
        `If importing, use: import { something as alias }`,
        `Check if you accidentally declared something twice`
      ]
    })
  },

  // Object is possibly undefined
  {
    pattern: /Object is possibly '(undefined|null)'/,
    getExplanation: (match) => ({
      title: `Might Be ${match[1] === 'undefined' ? 'Undefined' : 'Null'}`,
      explanation: `This value might be ${match[1]}, and you need to handle that case before using it.`,
      whatThisMeans: `TypeScript detected that this value could be ${match[1]}. Using it directly could cause a runtime error.`,
      howToFix: `Check if the value exists first with an if statement, or use optional chaining (?.) for safe access.`,
      example: {
        wrong: `const users: string[] | undefined = getUsers();\nconsole.log(users.length);  // Error: users might be undefined`,
        right: `const users: string[] | undefined = getUsers();\nif (users) {\n  console.log(users.length);  // Safe: we checked first\n}`
      },
      commonCauses: [
        'Optional parameter or property',
        'Array find() might not find anything',
        'Object property marked as optional (?)'
      ],
      tips: [
        `Use if (value) to check before accessing`,
        `Use optional chaining: value?.property`,
        `Use nullish coalescing: value ?? defaultValue`
      ]
    })
  },

  // Expression expected
  {
    pattern: /Expression expected/,
    getExplanation: () => ({
      title: "Expression Expected",
      explanation: `TypeScript expected a value or expression here, but found something else (like a keyword or nothing).`,
      whatThisMeans: `There's a syntax error where TypeScript expected to find a value, variable, or expression.`,
      howToFix: `Check for missing values, incomplete statements, or misplaced syntax.`,
      example: {
        wrong: `let x = ;  // Nothing after the equals sign\nif () { }  // Nothing in the condition`,
        right: `let x = 5;  // Value provided\nif (true) { }  // Condition provided`
      },
      commonCauses: [
        'Missing value after = sign',
        'Empty parentheses in if/while/for',
        'Incomplete ternary operator',
        'Missing argument in function call'
      ],
      tips: [
        `Check for missing values after = signs`,
        `Make sure if/while conditions aren't empty`,
        `Look for incomplete code on the previous line`
      ]
    })
  },

  // Spread types may only be created from object types
  {
    pattern: /Spread types may only be created from object types/,
    getExplanation: () => ({
      title: "Can't Spread This",
      explanation: `You're trying to use the spread operator (...) on something that isn't an object or array.`,
      whatThisMeans: `The spread operator works with objects and arrays, but you're using it on a different type.`,
      howToFix: `Make sure you're spreading an object or array, not a primitive like string or number.`,
      example: {
        wrong: `const x = 5;\nconst obj = { ...x };  // Error: can't spread a number`,
        right: `const original = { a: 1 };\nconst copy = { ...original };  // Spreading an object works`
      },
      commonCauses: [
        'Trying to spread a primitive value',
        'Variable might be null or undefined',
        'Type isn\'t narrowed to object yet'
      ],
      tips: [
        `Only spread objects: { ...obj } or arrays: [...arr]`,
        `Check that the value is definitely an object`,
        `Use type guards to narrow the type first`
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
    whatThisMeans: "TypeScript found an issue with your code. The error message above describes what went wrong.",
    howToFix: "Read the error message carefully and check the line number mentioned. Look for typos, missing characters, or type mismatches.",
    commonCauses: [
      "Typo in variable or function name",
      "Missing or extra brackets/parentheses",
      "Type mismatch between values",
      "Syntax error in the code"
    ],
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
