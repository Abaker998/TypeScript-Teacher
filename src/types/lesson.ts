/**
 * Core type definitions for the Code Tutor multi-language learning platform.
 * These types define the structure of lessons, difficulty levels,
 * build notes, code execution results, and language support.
 */

/**
 * Supported programming languages in Code Tutor.
 */
export type Language = 'typescript' | 'csharp' | 'sql';

/**
 * Information about a supported programming language.
 * Used for language selection and display throughout the app.
 */
export interface LanguageInfo {
  /** Unique identifier for the language */
  id: Language;
  /** Human-readable name (e.g., "TypeScript", "C#") */
  name: string;
  /** Emoji icon for the language */
  icon: string;
  /** Description of the language */
  description: string;
  /** Brand color for the language (hex) */
  color: string;
  /** Monaco editor language identifier */
  editorLanguage: string;
}

/**
 * Difficulty levels for lessons.
 * Used to organize lessons and indicate their complexity level.
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'master';

/**
 * Information about a pro or con for a particular approach.
 * Used in comparison and decision documentation.
 */
export interface ProCon {
  /** The pro or con item being described */
  item: string;
  /** Detailed explanation of this pro/con */
  description: string;
}

/**
 * Build note section that explains how a lesson's concept is used in the app.
 * Provides learners insight into real-world application and production patterns.
 */
export interface BuildNote {
  /** Title of this build note section */
  title: string;

  /** Markdown-formatted explanation of how this concept is used in the app */
  explanation: string;

  /** File paths related to this concept (e.g., 'src/types/lesson.ts', 'src/components/Sidebar.tsx') */
  relatedFiles: string[];

  /** Optional markdown about how this concept appears in production codebases */
  inTheRealWorld?: string;
}

/**
 * A single multiple-choice quiz question for assessing lesson comprehension.
 * Tests conceptual understanding of the lesson's key concepts.
 */
export interface QuizQuestion {
  /** The question text to display to the learner */
  question: string;

  /** Array of 4 answer choices */
  options: string[];

  /** Index of the correct answer (0-3) */
  correctIndex: number;

  /** Optional explanation shown after the correct answer is selected */
  explanation?: string;
}

/**
 * A single exercise within a lesson for hands-on practice.
 * Contains starter code, solution, and progressive hints to guide learners.
 */
export interface Exercise {
  /** Exercise number (1, 2, 3, etc.) - identifies the exercise within the lesson */
  id: number;

  /** Human-readable title for the exercise (e.g., "Exercise 1: Declare Variables") */
  title: string;

  /** Instructions describing what the learner needs to accomplish */
  description: string;

  /** Pre-filled starter code shown in the editor for this exercise */
  starterCode: string;

  /** Correct solution code for validation and reference */
  solution: string;

  /** Expected console output lines when the solution is run correctly */
  expectedOutput: string[];

  /** Progressive hints (3-4 hints, increasingly specific) to guide learners without giving away the solution */
  hints: string[];
}

/**
 * A single lesson in the TypeScript teaching curriculum.
 * Contains all content, code examples, and metadata needed to teach a TypeScript concept.
 */
export interface Lesson {
  /** URL-friendly identifier for the lesson (e.g., 'variables-and-types') */
  slug: string;

  /** Human-readable title of the lesson (e.g., 'Variables & Types') */
  title: string;

  /** Short summary displayed in the sidebar lesson list */
  description: string;

  /** Complexity level: 'beginner', 'intermediate', or 'advanced' */
  difficulty: Difficulty;

  /** Sort order within the lesson's difficulty group (0-based or 1-based) */
  order: number;

  /** Full markdown content of the lesson with explanations and code examples */
  content: string;

  /** Array of 2-3 exercises for hands-on practice within this lesson */
  exercises: Exercise[];

  /** Explanation of how this lesson's concept is used in the app itself */
  buildNote: BuildNote;

  /** Optional quiz with 4-5 multiple-choice questions to test comprehension */
  quiz?: QuizQuestion[];
}

/**
 * A group of lessons organized by difficulty level.
 * Used by the sidebar to display lessons in categorized sections.
 */
export interface LessonGroup {
  /** The difficulty level of all lessons in this group */
  difficulty: Difficulty;

  /** Display label for the difficulty group (e.g., 'Beginner', 'Intermediate', 'Advanced') */
  label: string;

  /** All lessons belonging to this difficulty group, sorted by order */
  lessons: Lesson[];
}

/**
 * A compilation error from TypeScript compiler.
 * Includes location and message for display in the output panel.
 */
export interface CompileError {
  /** Line number where the error occurred (1-based) */
  line: number;

  /** Column number where the error occurred (1-based) */
  column: number;

  /** Error message from the TypeScript compiler */
  message: string;
}

/**
 * Result of running TypeScript code in the browser.
 * Contains console output and any compilation or runtime errors.
 */
export interface RunResult {
  /** Whether the code executed successfully without errors */
  success: boolean;

  /** Array of lines printed to console.log during execution */
  output: string[];

  /** Compilation errors encountered (empty if success is true) */
  errors: CompileError[];

  /** Time taken to compile and execute the code in milliseconds */
  duration: number;
}

/**
 * Tracks a learner's progress through a single lesson.
 * Records quiz completion status and which exercises have been completed.
 */
export interface LessonProgress {
  /** The slug of the lesson this progress belongs to */
  lessonSlug: string;

  /** Whether the learner has completed the quiz for this lesson */
  quizCompleted: boolean;

  /** Array of completed exercise IDs (corresponds to Exercise.id values) */
  exercisesCompleted: number[];
}

/**
 * Global progress state tracking a learner's progress across all lessons.
 * Stores progress for each lesson keyed by the lesson's slug.
 */
export interface ProgressState {
  /** Record of lesson progress, keyed by lesson slug */
  lessons: Record<string, LessonProgress>;
}

/**
 * A predefined learning path containing a curated sequence of lessons.
 * Paths like "Quick Start" or "Frontend Focus" help guide learners through the curriculum.
 */
export interface LearningPath {
  /** Unique identifier for the learning path */
  id: string;

  /** Display name of the learning path (e.g., "Quick Start") */
  name: string;

  /** Description explaining what the path covers and who it's for */
  description: string;

  /** Optional icon/emoji for the path */
  icon?: string;

  /** Ordered array of lesson slugs in this path */
  lessonSlugs: string[];

  /** Estimated hours to complete the path */
  estimatedHours?: number;

  /** Language this path is for */
  language: Language;
}

/**
 * A user-created custom lesson set.
 * Users can create their own collections of lessons for review or study.
 */
export interface UserLessonSet {
  /** Unique identifier for the set */
  id: string;

  /** User-defined name for the set */
  name: string;

  /** Array of lesson slugs in this set */
  lessonSlugs: string[];

  /** ISO timestamp when the set was created */
  createdAt: string;

  /** ISO timestamp when the set was last updated */
  updatedAt: string;
}

/**
 * Represents the current view mode for the lesson sidebar.
 * Determines which lessons are displayed: all, a learning path, or a user set.
 */
export type SidebarViewMode =
  | { type: 'all' }
  | { type: 'path'; pathId: string }
  | { type: 'set'; setId: string };
