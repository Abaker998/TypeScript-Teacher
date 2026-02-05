'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LessonGroup } from '@/types/lesson';
import { useProgress } from '@/hooks/useProgress';
import { ProgressBar } from '@/components/ProgressBar';
import { getAllLessons, getLessonsBySlugs } from '@/lessons';
import ViewModeSelector from '@/components/ViewModeSelector';
import CreateSetModal from '@/components/CreateSetModal';
import { useLessonView } from '@/contexts/LessonViewContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageIcon } from '@/components/icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
  lessonGroups: LessonGroup[];
}

/**
 * Collapsible sidebar overlay with lesson navigation grouped by difficulty.
 *
 * Features:
 * - Overlay with semi-transparent backdrop (clickable to close)
 * - Slide-in animation from left (250px wide)
 * - App title and close button in header
 * - Collapsible difficulty groups with lesson links
 * - Progress bars showing completion per difficulty group
 * - Active lesson highlighting
 * - Closes sidebar on navigation
 * - Reset Progress button with confirmation
 */
export default function Sidebar({
  isOpen,
  onClose,
  currentSlug,
  lessonGroups,
}: SidebarProps): JSX.Element {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(['beginner'])
  );
  const [isCreateSetModalOpen, setIsCreateSetModalOpen] = useState(false);

  const { getGroupProgress, resetProgress } = useProgress();
  const { language, languageInfo } = useLanguage();
  const allLessons = getAllLessons(language);

  // Get lesson view context for filtering
  const {
    isViewingAll,
    isViewingPath,
    isViewingSet,
    currentPath,
    currentSet,
    deleteSet,
    showAllLessons,
  } = useLessonView();

  const toggleGroup = (difficulty: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(difficulty)) {
      newExpanded.delete(difficulty);
    } else {
      newExpanded.add(difficulty);
    }
    setExpandedGroups(newExpanded);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  // If not open, render nothing
  if (!isOpen) {
    return <></>;
  }

  return (
    <>
      {/* Overlay background - clicking it closes the sidebar */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel - 250px wide, slide-in from left */}
      <aside
        className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gradient-to-b dark:from-indigo-900 dark:to-gray-900 text-slate-900 dark:text-white transform transition-transform duration-300 z-50 flex flex-col border-r border-slate-200 dark:border-transparent"
        role="navigation"
        aria-label="Lesson navigation"
      >
        {/* Header with title and close button */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-indigo-700 p-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LanguageIcon language={language} size={24} />
            {languageInfo.name}
          </h1>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-white"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Nav Links */}
        <div className="p-4 space-y-1 border-b border-slate-200/50 dark:border-indigo-700/50">
          <Link
            href={`/${language}/projects`}
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-indigo-900 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>🚀</span> Projects
          </Link>
        </div>

        {/* View Mode Selector */}
        <div className="p-4 border-b border-slate-200/50 dark:border-indigo-700/50">
          <ViewModeSelector onCreateSet={() => setIsCreateSetModalOpen(true)} />
        </div>

        {/* Lesson groups navigation */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-4">
          {/* Show filtered lessons for path/set view */}
          {(isViewingPath || isViewingSet) && (
            <>
              {/* Path/Set info */}
              {isViewingPath && currentPath && (
                <div className="text-xs text-slate-500 dark:text-gray-400 mb-2 flex items-center justify-between">
                  <span>
                    {currentPath.icon} {currentPath.lessonSlugs.length} lessons
                    {currentPath.estimatedHours && ` · ~${currentPath.estimatedHours}h`}
                  </span>
                </div>
              )}
              {isViewingSet && currentSet && (
                <div className="text-xs text-slate-500 dark:text-gray-400 mb-2 flex items-center justify-between">
                  <span>📁 {currentSet.lessonSlugs.length} lessons</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${currentSet.name}"?`)) {
                        deleteSet(currentSet.id);
                        showAllLessons();
                      }
                    }}
                    className="text-slate-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Delete this set"
                  >
                    🗑️
                  </button>
                </div>
              )}

              {/* Flat list of lessons */}
              <ul className="space-y-1">
                {getLessonsBySlugs(
                  language,
                  isViewingPath && currentPath
                    ? currentPath.lessonSlugs
                    : isViewingSet && currentSet
                    ? currentSet.lessonSlugs
                    : []
                ).map((lesson, index) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/${language}/lessons/${lesson.slug}`}
                      onClick={onClose}
                      className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                        currentSlug === lesson.slug
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-indigo-900 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="text-xs text-slate-400 dark:text-gray-500 w-4">{index + 1}.</span>
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Show grouped lessons for "all" view */}
          {isViewingAll &&
            lessonGroups.map((group) => {
              const progress = getGroupProgress(group.difficulty, allLessons);
              const isGroupComplete = progress.completed === progress.total && progress.total > 0;

              return (
                <div key={group.difficulty}>
                  {/* Group header - collapsible */}
                  <button
                    onClick={() => toggleGroup(group.difficulty)}
                    className="flex w-full items-center gap-2 text-left transition-colors hover:text-slate-900 dark:hover:text-white"
                  >
                    {/* Chevron icon - rotates when expanded */}
                    <span
                      className={`transition-transform ${
                        expandedGroups.has(group.difficulty) ? 'rotate-90' : ''
                      }`}
                    >
                      ▶
                    </span>
                    <span className={`font-semibold ${isGroupComplete ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-700 dark:text-gray-200'}`}>
                      {group.label} {isGroupComplete && '⭐'}
                    </span>
                    {isGroupComplete && <span className="ml-auto">🎉</span>}
                  </button>

                  {/* Progress bar for this group */}
                  <div className="mt-2 ml-4">
                    <ProgressBar
                      completed={progress.completed}
                      total={progress.total}
                      label={group.label}
                    />
                  </div>

                  {/* Lessons in this group - shown when expanded */}
                  {expandedGroups.has(group.difficulty) && (
                    <ul className="mt-2 space-y-1 ml-4">
                      {group.lessons.length > 0 ? (
                        group.lessons.map((lesson) => (
                          <li key={lesson.slug}>
                            <Link
                              href={`/${language}/lessons/${lesson.slug}`}
                              onClick={onClose}
                              className={`block rounded px-3 py-2 text-sm transition-colors ${
                                currentSlug === lesson.slug
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-indigo-900 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {lesson.title}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400 dark:text-gray-500 px-3 py-2 text-sm">No lessons yet</li>
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
        </nav>

        {/* Settings section at bottom */}
        <div className="border-t border-slate-200/50 dark:border-indigo-700/50 p-4">
          <button
            onClick={handleResetProgress}
            className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white transition-colors opacity-70 hover:opacity-100"
          >
            <span>↺</span>
            <span>Reset all progress</span>
          </button>
        </div>
      </aside>

      {/* Create Set Modal */}
      <CreateSetModal
        isOpen={isCreateSetModalOpen}
        onClose={() => setIsCreateSetModalOpen(false)}
      />
    </>
  );
}
