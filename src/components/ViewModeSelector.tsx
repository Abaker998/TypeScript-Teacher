/**
 * ViewModeSelector component - dropdown to switch between lesson views.
 * Allows switching between All Lessons, Learning Paths, and User Sets.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLessonView } from '@/contexts/LessonViewContext';

interface ViewModeSelectorProps {
  onCreateSet?: () => void;
}

export default function ViewModeSelector({ onCreateSet }: ViewModeSelectorProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    viewMode,
    showAllLessons,
    showPath,
    showSet,
    learningPaths,
    userSets,
    getCurrentViewTitle,
  } = useLessonView();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    showAllLessons();
    setIsOpen(false);
  };

  const handleSelectPath = (pathId: string) => {
    showPath(pathId);
    setIsOpen(false);
  };

  const handleSelectSet = (setId: string) => {
    showSet(setId);
    setIsOpen(false);
  };

  const handleCreateSet = () => {
    setIsOpen(false);
    onCreateSet?.();
  };

  // Get icon for current view
  const getCurrentIcon = () => {
    if (viewMode.type === 'path') {
      const path = learningPaths.find((p) => p.id === viewMode.pathId);
      return path?.icon || '📚';
    }
    if (viewMode.type === 'set') {
      return '📁';
    }
    return '📖';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
      >
        <span>{getCurrentIcon()}</span>
        <span className="flex-1 text-left truncate">{getCurrentViewTitle()}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* All Lessons option */}
          <button
            onClick={handleSelectAll}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
              viewMode.type === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span>📖</span>
            <span>All Lessons</span>
          </button>

          {/* Learning Paths section */}
          {learningPaths.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-900/50">
                Learning Paths
              </div>
              {learningPaths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => handleSelectPath(path.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
                    viewMode.type === 'path' && viewMode.pathId === path.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{path.icon || '📚'}</span>
                  <span className="flex-1">{path.name}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{path.lessonSlugs.length}</span>
                </button>
              ))}
            </>
          )}

          {/* User Sets section */}
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-900/50">
            My Sets
          </div>
          {userSets.length > 0 ? (
            userSets.map((set) => (
              <button
                key={set.id}
                onClick={() => handleSelectSet(set.id)}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
                  viewMode.type === 'set' && viewMode.setId === set.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>📁</span>
                <span className="flex-1 truncate">{set.name}</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">{set.lessonSlugs.length}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">
              No custom sets yet
            </div>
          )}

          {/* Create new set button */}
          <button
            onClick={handleCreateSet}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-t border-slate-200 dark:border-slate-700"
          >
            <span>+</span>
            <span>Create New Set</span>
          </button>
        </div>
      )}
    </div>
  );
}
