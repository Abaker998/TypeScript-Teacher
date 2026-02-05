/**
 * ProjectCard component - displays a single community project proposal.
 */

'use client';

import React from 'react';
import type { ProjectProposal } from '@/types/project';

interface ProjectCardProps {
  project: ProjectProposal;
}

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const difficultyLabels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default function ProjectCard({ project }: ProjectCardProps): JSX.Element {
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image header (if available) */}
      {project.imageUrl && (
        <div className="aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken images
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title and difficulty badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
            {project.title}
          </h3>
          <span
            className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full border ${difficultyColors[project.difficulty]}`}
          >
            {difficultyLabels[project.difficulty]}
          </span>
        </div>

        {/* Description (truncated) */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
          {project.description}
        </p>

        {/* Skills tags */}
        {project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 dark:text-indigo-300 rounded-full"
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
                +{project.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer: author and date */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
          <span>by @{project.authorName}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
