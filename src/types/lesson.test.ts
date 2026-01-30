import type { Exercise, Lesson, LessonProgress, ProgressState, QuizQuestion } from './lesson';

describe('QuizQuestion interface', () => {
  it('should have required question field of type string', () => {
    const question: QuizQuestion = {
      question: 'What is TypeScript?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
    };
    expect(typeof question.question).toBe('string');
  });

  it('should have required options field as array of strings', () => {
    const question: QuizQuestion = {
      question: 'What is TypeScript?',
      options: ['A typed superset of JS', 'A database', 'A styling library', 'A build tool'],
      correctIndex: 0,
    };
    expect(Array.isArray(question.options)).toBe(true);
    expect(question.options.every(opt => typeof opt === 'string')).toBe(true);
  });

  it('should have exactly 4 options', () => {
    const question: QuizQuestion = {
      question: 'What is TypeScript?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
    };
    expect(question.options.length).toBe(4);
  });

  it('should have required correctIndex field of type number', () => {
    const question: QuizQuestion = {
      question: 'What is TypeScript?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 2,
    };
    expect(typeof question.correctIndex).toBe('number');
  });

  it('should have correctIndex between 0 and 3', () => {
    const validIndices = [0, 1, 2, 3];
    validIndices.forEach(index => {
      const question: QuizQuestion = {
        question: 'What is TypeScript?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: index,
      };
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThanOrEqual(3);
    });
  });

  it('should have optional explanation field of type string', () => {
    const questionWithExplanation: QuizQuestion = {
      question: 'What is TypeScript?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'TypeScript is a typed superset of JavaScript.',
    };
    expect(typeof questionWithExplanation.explanation).toBe('string');
  });

  it('should not require explanation field', () => {
    const questionWithoutExplanation: QuizQuestion = {
      question: 'What is TypeScript?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
    };
    expect(questionWithoutExplanation.explanation).toBeUndefined();
  });

  it('should allow explanation to be undefined', () => {
    const questionWithUndefinedExplanation: QuizQuestion = {
      question: 'What is TypeScript?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: undefined,
    };
    expect(questionWithUndefinedExplanation.explanation).toBeUndefined();
  });

  it('should create a valid question with all fields', () => {
    const completeQuestion: QuizQuestion = {
      question: 'What is the correct way to declare a string variable?',
      options: [
        "let name: string = 'Alice';",
        "let name = string('Alice');",
        "string name = 'Alice';",
        "var name: String = 'Alice';",
      ],
      correctIndex: 0,
      explanation: 'TypeScript uses a colon followed by the type name after the variable.',
    };
    expect(completeQuestion).toEqual({
      question: 'What is the correct way to declare a string variable?',
      options: [
        "let name: string = 'Alice';",
        "let name = string('Alice');",
        "string name = 'Alice';",
        "var name: String = 'Alice';",
      ],
      correctIndex: 0,
      explanation: 'TypeScript uses a colon followed by the type name after the variable.',
    });
  });
});

describe('Lesson interface with exercises and quiz fields', () => {
  it('should have required exercises field as array of Exercise', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
    };
    expect(Array.isArray(lesson.exercises)).toBe(true);
    expect(lesson.exercises.length).toBeGreaterThan(0);
  });

  it('should have exercises as a required field (not optional)', () => {
    // TypeScript will enforce this at compile time, so this test verifies the type structure
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1: Declare Variables',
          description: 'Declare a string variable using TypeScript type annotation',
          starterCode: 'let name = "Alice";',
          solution: 'let name: string = "Alice";',
          expectedOutput: ['Alice'],
          hints: ['Use the colon syntax for type annotation'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
    };
    expect(lesson.exercises).toBeDefined();
    expect(Array.isArray(lesson.exercises)).toBe(true);
  });

  it('should allow multiple exercises', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
        {
          id: 2,
          title: 'Exercise 2',
          description: 'Second exercise',
          starterCode: 'let y = 10;',
          solution: 'let y: number = 10;',
          expectedOutput: ['10'],
          hints: ['Hint 1', 'Hint 2'],
        },
        {
          id: 3,
          title: 'Exercise 3',
          description: 'Third exercise',
          starterCode: 'let z = 15;',
          solution: 'let z: number = 15;',
          expectedOutput: ['15'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
    };
    expect(lesson.exercises.length).toBe(3);
  });

  it('should not have starterCode field at lesson level', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
    };
    // This checks that starterCode is not accessible at the lesson level
    expect((lesson as any).starterCode).toBeUndefined();
  });

  it('should not have solution field at lesson level', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
    };
    // This checks that solution is not accessible at the lesson level
    expect((lesson as any).solution).toBeUndefined();
  });

  it('should not have expectedOutput field at lesson level', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
    };
    // This checks that expectedOutput is not accessible at the lesson level
    expect((lesson as any).expectedOutput).toBeUndefined();
  });

  it('should allow optional quiz field as array of QuizQuestion', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
      quiz: [
        {
          question: 'What is TypeScript?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
        },
      ],
    };
    expect(Array.isArray(lesson.quiz)).toBe(true);
  });

  it('should allow multiple quiz questions', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
      quiz: [
        {
          question: 'Question 1?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
        },
        {
          question: 'Question 2?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 1,
        },
        {
          question: 'Question 3?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 2,
        },
        {
          question: 'Question 4?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 3,
        },
        {
          question: 'Question 5?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
        },
      ],
    };
    expect(lesson.quiz.length).toBe(5);
  });

  it('should not require quiz field', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
    };
    expect(lesson.quiz).toBeUndefined();
  });

  it('should allow quiz to be undefined', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
      quiz: undefined,
    };
    expect(lesson.quiz).toBeUndefined();
  });

  it('should contain valid QuizQuestion objects in quiz array', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1',
          description: 'First exercise',
          starterCode: 'let x = 5;',
          solution: 'let x: number = 5;',
          expectedOutput: ['5'],
          hints: ['Hint 1', 'Hint 2'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
      quiz: [
        {
          question: 'What is TypeScript?',
          options: ['A typed superset of JS', 'A database', 'A styling library', 'A build tool'],
          correctIndex: 0,
          explanation: 'TypeScript is a typed superset of JavaScript.',
        },
      ],
    };
    const quizQuestion = lesson.quiz[0];
    expect(typeof quizQuestion.question).toBe('string');
    expect(Array.isArray(quizQuestion.options)).toBe(true);
    expect(typeof quizQuestion.correctIndex).toBe('number');
  });

  it('should create a valid lesson with exercises and optional quiz', () => {
    const lesson: Lesson = {
      slug: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Learn about TypeScript variables and types',
      difficulty: 'beginner',
      order: 1,
      content: 'Content here',
      exercises: [
        {
          id: 1,
          title: 'Exercise 1: Declare Variables',
          description: 'Declare a string variable using TypeScript type annotation',
          starterCode: 'let name = "Alice";',
          solution: 'let name: string = "Alice";',
          expectedOutput: ['Alice'],
          hints: [
            'Use the colon syntax for type annotation',
            'The syntax is: let variableName: type = value;',
            'For strings, the type annotation is: string',
          ],
        },
        {
          id: 2,
          title: 'Exercise 2: Declare Multiple Types',
          description: 'Declare variables with different types',
          starterCode: 'let count = 42;',
          solution: 'let count: number = 42;',
          expectedOutput: ['42'],
          hints: ['Use the number type', 'Syntax is the same as for string'],
        },
      ],
      buildNote: {
        title: 'Build Note',
        explanation: 'Explanation',
        relatedFiles: ['src/types/lesson.ts'],
      },
      quiz: [
        {
          question: 'What is TypeScript?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
        },
      ],
    };
    expect(lesson.exercises.length).toBe(2);
    expect(lesson.quiz?.length).toBe(1);
    expect(lesson.exercises[0].title).toBe('Exercise 1: Declare Variables');
    expect(lesson.exercises[1].id).toBe(2);
  });
});

describe('Exercise interface', () => {
  it('should have required id field of type number', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: ['Use the colon syntax for type annotation', 'The syntax is: let variableName: type = value;', 'For strings, the type annotation is: string'],
    };
    expect(typeof exercise.id).toBe('number');
  });

  it('should have required title field of type string', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: ['Use the colon syntax for type annotation'],
    };
    expect(typeof exercise.title).toBe('string');
  });

  it('should have required description field of type string', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: ['Use the colon syntax for type annotation'],
    };
    expect(typeof exercise.description).toBe('string');
  });

  it('should have required starterCode field of type string', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: ['Use the colon syntax for type annotation'],
    };
    expect(typeof exercise.starterCode).toBe('string');
  });

  it('should have required solution field of type string', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: ['Use the colon syntax for type annotation'],
    };
    expect(typeof exercise.solution).toBe('string');
  });

  it('should have required expectedOutput field as array of strings', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: ['Use the colon syntax for type annotation'],
    };
    expect(Array.isArray(exercise.expectedOutput)).toBe(true);
    expect(exercise.expectedOutput.every(item => typeof item === 'string')).toBe(true);
  });

  it('should have required hints field as array of strings', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: ['Use the colon syntax for type annotation'],
    };
    expect(Array.isArray(exercise.hints)).toBe(true);
    expect(exercise.hints.every(hint => typeof hint === 'string')).toBe(true);
  });

  it('should have multiple progressive hints', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: [
        'Use the colon syntax for type annotation',
        'The syntax is: let variableName: type = value;',
        'For strings, the type annotation is: string',
        'The complete solution: let name: string = "Alice";',
      ],
    };
    expect(exercise.hints.length).toBeGreaterThanOrEqual(3);
  });

  it('should create a valid exercise with all required fields', () => {
    const exercise: Exercise = {
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: [
        'Use the colon syntax for type annotation',
        'The syntax is: let variableName: type = value;',
        'For strings, the type annotation is: string',
      ],
    };
    expect(exercise).toEqual({
      id: 1,
      title: 'Exercise 1: Declare Variables',
      description: 'Declare a string variable using TypeScript type annotation',
      starterCode: 'let name = "Alice";',
      solution: 'let name: string = "Alice";',
      expectedOutput: ['Alice'],
      hints: [
        'Use the colon syntax for type annotation',
        'The syntax is: let variableName: type = value;',
        'For strings, the type annotation is: string',
      ],
    });
  });
});

describe('LessonProgress interface', () => {
  it('should have required lessonSlug field of type string', () => {
    const progress: LessonProgress = {
      lessonSlug: 'variables-and-types',
      quizCompleted: false,
      exercisesCompleted: [],
    };
    expect(typeof progress.lessonSlug).toBe('string');
  });

  it('should have required quizCompleted field of type boolean', () => {
    const progress: LessonProgress = {
      lessonSlug: 'variables-and-types',
      quizCompleted: true,
      exercisesCompleted: [],
    };
    expect(typeof progress.quizCompleted).toBe('boolean');
  });

  it('should have required exercisesCompleted field as array of numbers', () => {
    const progress: LessonProgress = {
      lessonSlug: 'variables-and-types',
      quizCompleted: false,
      exercisesCompleted: [1, 2, 3],
    };
    expect(Array.isArray(progress.exercisesCompleted)).toBe(true);
    expect(progress.exercisesCompleted.every(id => typeof id === 'number')).toBe(true);
  });

  it('should allow empty exercisesCompleted array', () => {
    const progress: LessonProgress = {
      lessonSlug: 'variables-and-types',
      quizCompleted: false,
      exercisesCompleted: [],
    };
    expect(progress.exercisesCompleted.length).toBe(0);
  });

  it('should track multiple completed exercise IDs', () => {
    const progress: LessonProgress = {
      lessonSlug: 'variables-and-types',
      quizCompleted: true,
      exercisesCompleted: [1, 2, 3],
    };
    expect(progress.exercisesCompleted).toEqual([1, 2, 3]);
  });

  it('should create a valid LessonProgress with all fields', () => {
    const progress: LessonProgress = {
      lessonSlug: 'functions-and-types',
      quizCompleted: true,
      exercisesCompleted: [1, 2],
    };
    expect(progress).toEqual({
      lessonSlug: 'functions-and-types',
      quizCompleted: true,
      exercisesCompleted: [1, 2],
    });
  });
});

describe('ProgressState interface', () => {
  it('should have required lessons field as Record type', () => {
    const state: ProgressState = {
      lessons: {},
    };
    expect(typeof state.lessons).toBe('object');
    expect(state.lessons).not.toBeNull();
  });

  it('should allow empty lessons record', () => {
    const state: ProgressState = {
      lessons: {},
    };
    expect(Object.keys(state.lessons).length).toBe(0);
  });

  it('should store LessonProgress keyed by slug', () => {
    const state: ProgressState = {
      lessons: {
        'variables-and-types': {
          lessonSlug: 'variables-and-types',
          quizCompleted: false,
          exercisesCompleted: [],
        },
      },
    };
    expect(state.lessons['variables-and-types']).toBeDefined();
    expect(state.lessons['variables-and-types'].lessonSlug).toBe('variables-and-types');
  });

  it('should store multiple lessons in ProgressState', () => {
    const state: ProgressState = {
      lessons: {
        'variables-and-types': {
          lessonSlug: 'variables-and-types',
          quizCompleted: true,
          exercisesCompleted: [1, 2],
        },
        'functions-and-types': {
          lessonSlug: 'functions-and-types',
          quizCompleted: false,
          exercisesCompleted: [1],
        },
        'interfaces': {
          lessonSlug: 'interfaces',
          quizCompleted: false,
          exercisesCompleted: [],
        },
      },
    };
    expect(Object.keys(state.lessons).length).toBe(3);
    expect(state.lessons['variables-and-types'].quizCompleted).toBe(true);
    expect(state.lessons['functions-and-types'].exercisesCompleted).toEqual([1]);
    expect(state.lessons['interfaces'].exercisesCompleted).toEqual([]);
  });

  it('should create a valid ProgressState with multiple lessons', () => {
    const state: ProgressState = {
      lessons: {
        'variables-and-types': {
          lessonSlug: 'variables-and-types',
          quizCompleted: true,
          exercisesCompleted: [1, 2, 3],
        },
        'functions-and-types': {
          lessonSlug: 'functions-and-types',
          quizCompleted: false,
          exercisesCompleted: [],
        },
      },
    };
    expect(state).toEqual({
      lessons: {
        'variables-and-types': {
          lessonSlug: 'variables-and-types',
          quizCompleted: true,
          exercisesCompleted: [1, 2, 3],
        },
        'functions-and-types': {
          lessonSlug: 'functions-and-types',
          quizCompleted: false,
          exercisesCompleted: [],
        },
      },
    });
  });
});
