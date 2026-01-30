'use client';

import React from 'react';
import Link from 'next/link';
import { LessonGroup } from '@/types/lesson';
import { useProgress } from '@/hooks/useProgress';
import { ProgressBar } from '@/components/ProgressBar';
import { getAllLessons } from '@/lessons';

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

  const { getGroupProgress, resetProgress } = useProgress();
  const allLessons = getAllLessons();

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
        className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-900 to-gray-900 text-white transform transition-transform duration-300 z-50 flex flex-col"
        role="navigation"
        aria-label="Lesson navigation"
      >
        {/* Header with title and close button */}
        <div className="flex items-center justify-between border-b border-purple-700 p-4">
          <h1 className="text-xl font-bold">TypeScript Teacher</h1>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:text-white"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Lesson groups navigation */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-4 dark-scrollbar">
          {lessonGroups.map((group) => {
            const progress = getGroupProgress(group.difficulty, allLessons);
            const isGroupComplete = progress.completed === progress.total && progress.total > 0;

            return (
              <div key={group.difficulty}>
                {/* Group header - collapsible */}
                <button
                  onClick={() => toggleGroup(group.difficulty)}
                  className="flex w-full items-center gap-2 text-left transition-colors hover:text-white"
                >
                  {/* Chevron icon - rotates when expanded */}
                  <span
                    className={`transition-transform ${
                      expandedGroups.has(group.difficulty) ? 'rotate-90' : ''
                    }`}
                  >
                    ▶
                  </span>
                  <span className={`font-semibold ${isGroupComplete ? 'text-yellow-400' : 'text-gray-200'}`}>
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
                            href={`/lessons/${lesson.slug}`}
                            onClick={onClose}
                            className={`block rounded px-3 py-2 text-sm transition-colors ${
                              currentSlug === lesson.slug
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-300 hover:bg-purple-900'
                            }`}
                          >
                            {lesson.title}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 px-3 py-2 text-sm">No lessons yet</li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* Settings section at bottom */}
        <div className="border-t border-purple-700/50 p-4">
          <button
            onClick={handleResetProgress}
            className="flex items-center gap-2 text-xs text-purple-300 hover:text-white transition-colors opacity-70 hover:opacity-100"
          >
            <span>↺</span>
            <span>Reset all progress</span>
          </button>
        </div>
      </aside>
    </>
  );
}
