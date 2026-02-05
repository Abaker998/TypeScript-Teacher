/**
 * Type definitions for the Community Project Board feature.
 * Allows users to submit and browse TypeScript project proposals.
 */

/**
 * Difficulty level for project proposals.
 */
export type ProjectDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * A community project proposal submitted by a user.
 * Contains project details, difficulty, and required TypeScript skills.
 */
export interface ProjectProposal {
  /** Unique identifier for the project */
  id: string;

  /** Project title (e.g., "Todo App with TypeScript") */
  title: string;

  /** Detailed description of the project (supports markdown) */
  description: string;

  /** Difficulty level: beginner, intermediate, or advanced */
  difficulty: ProjectDifficulty;

  /** TypeScript concepts/skills used in this project (e.g., ["interfaces", "generics"]) */
  skills: string[];

  /** Display name of the author */
  authorName: string;

  /** Optional author ID if the user is logged in */
  authorId?: string;

  /** ISO timestamp when the project was submitted */
  createdAt: string;

  /** Optional URL to a screenshot or mockup image */
  imageUrl?: string;
}

/**
 * Form data for submitting a new project proposal.
 */
export interface ProjectSubmission {
  title: string;
  description: string;
  difficulty: ProjectDifficulty;
  skills: string[];
  authorName: string;
  imageUrl?: string;
}

/**
 * Storage format for the projects JSON file.
 */
export interface ProjectsStore {
  projects: ProjectProposal[];
}
