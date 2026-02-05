/**
 * Server-side file storage for community project proposals.
 * Stores projects in .data/projects.json following the same pattern as user storage.
 */

import fs from 'fs';
import path from 'path';
import type { ProjectProposal, ProjectsStore } from '@/types/project';

const DATA_DIR = path.join(process.cwd(), '.data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

/**
 * Ensure the data directory exists
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Generate a unique ID for a new project
 */
function generateProjectId(): string {
  return `proj-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Load all projects from storage
 */
export function getProjects(): ProjectProposal[] {
  ensureDataDir();
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const store: ProjectsStore = JSON.parse(data);
      return store.projects || [];
    }
  } catch (error) {
    console.error('Error reading projects file:', error);
  }
  return [];
}

/**
 * Save projects to storage
 */
function saveProjects(projects: ProjectProposal[]): void {
  ensureDataDir();
  try {
    const store: ProjectsStore = { projects };
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(store, null, 2));
  } catch (error) {
    console.error('Error saving projects file:', error);
  }
}

/**
 * Get a single project by ID
 */
export function getProjectById(id: string): ProjectProposal | null {
  const projects = getProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * Create a new project proposal
 */
export function createProject(
  data: Omit<ProjectProposal, 'id' | 'createdAt'>
): ProjectProposal {
  const projects = getProjects();

  const newProject: ProjectProposal = {
    ...data,
    id: generateProjectId(),
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  saveProjects(projects);

  return newProject;
}

/**
 * Get projects filtered by difficulty
 */
export function getProjectsByDifficulty(
  difficulty: ProjectProposal['difficulty']
): ProjectProposal[] {
  const projects = getProjects();
  return projects.filter((p) => p.difficulty === difficulty);
}

/**
 * Get projects sorted by creation date (newest first)
 */
export function getProjectsSorted(): ProjectProposal[] {
  const projects = getProjects();
  return projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Delete a project by ID (for moderation purposes)
 */
export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return false;
  }

  projects.splice(index, 1);
  saveProjects(projects);
  return true;
}
