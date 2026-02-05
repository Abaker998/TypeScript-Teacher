/**
 * ProjectGrid component - displays a grid of community project cards.
 */

'use client';

import React from 'react';
import type { ProjectProposal } from '@/types/project';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: ProjectProposal[];
  isLoading?: boolean;
}

export default function ProjectGrid({ projects, isLoading }: ProjectGridProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-slate-100 dark:bg-slate-800 rounded-xl h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
          No projects yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Be the first to submit a project idea!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
