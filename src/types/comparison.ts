/**
 * Type definitions for architectural decision comparisons.
 * These types define the structure of comparison cards displayed on the
 * "Why We Built It This Way" page, allowing learners to understand the
 * reasoning behind the app's architectural choices.
 */

/**
 * A single pro or con for an option in a comparison.
 * Used to build detailed pros/cons lists for each compared option.
 */
export interface ProCon {
  /** The pro or con item being described (brief statement) */
  item: string;

  /** Detailed explanation of this pro/con */
  description: string;
}

/**
 * A single option in an architectural comparison (e.g., "Next.js", "Vite", "Create React App").
 * Contains the option's name, whether it was chosen, and its pros/cons.
 */
export interface ComparisonOption {
  /** Name of the option (e.g., "Next.js", "Vite", "Create React App") */
  name: string;

  /** Whether this option is the one we chose for the app */
  chosen: boolean;

  /** Array of advantages for this option */
  pros: ProCon[];

  /** Array of disadvantages for this option */
  cons: ProCon[];
}

/**
 * A single architectural decision comparison.
 * Compares multiple options for a decision and explains which was chosen and why.
 */
export interface Comparison {
  /** Unique identifier for this comparison (e.g., 'framework-selection', 'editor-choice') */
  id: string;

  /** Display title for this comparison (e.g., "Framework: Next.js vs Vite vs Create React App") */
  title: string;

  /** The decision question being explored (e.g., "What frontend framework should we use?") */
  question: string;

  /** Array of options that were considered for this decision */
  options: ComparisonOption[];

  /** Markdown-formatted explanation of why the chosen option was selected */
  reasoning: string;
}
