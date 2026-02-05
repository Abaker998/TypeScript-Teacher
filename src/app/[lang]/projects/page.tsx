/**
 * Community Projects page - browse and submit project ideas for the current language.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { ProjectProposal, ProjectDifficulty } from '@/types/project';
import ProjectGrid from '@/components/ProjectGrid';
import SubmitProjectModal from '@/components/SubmitProjectModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageIcon } from '@/components/icons';

type FilterOption = 'all' | ProjectDifficulty;

export default function ProjectsPage(): JSX.Element {
  const { language, languageInfo } = useLanguage();
  const [projects, setProjects] = useState<ProjectProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const url =
        filter === 'all' ? '/api/projects' : `/api/projects?difficulty=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle successful project submission
  const handleProjectSubmitted = () => {
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <LanguageIcon language={language} size={32} />
            {languageInfo.name} Projects
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {languageInfo.name} project ideas from learners like you. Get inspired or share your own!
          </p>
        </div>

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Submit button */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
          >
            <span>+</span>
            Submit Project
          </button>

          {/* Filter dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="difficulty-filter" className="text-sm text-slate-600 dark:text-slate-400">
              Filter:
            </label>
            <select
              id="difficulty-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterOption)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Project grid */}
        <ProjectGrid projects={projects} isLoading={isLoading} />

        {/* Submit modal */}
        <SubmitProjectModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={handleProjectSubmitted}
        />
      </div>
    </div>
  );
}
