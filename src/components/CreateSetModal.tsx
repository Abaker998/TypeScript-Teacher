/**
 * CreateSetModal component - modal dialog for creating a new user lesson set.
 * Uses a Portal to render at document body level for proper z-index stacking.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLessonView } from '@/contexts/LessonViewContext';
import { getAllLessons } from '@/lessons';
import type { Lesson } from '@/types/lesson';

interface CreateSetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSetModal({ isOpen, onClose }: CreateSetModalProps): JSX.Element | null {
  const [name, setName] = useState('');
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { createSet, showSet } = useLessonView();
  const allLessons = getAllLessons();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSelectedSlugs(new Set());
      setError(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleLesson = (slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!name.trim()) {
      setError('Please enter a name for your set');
      return;
    }

    if (selectedSlugs.size === 0) {
      setError('Please select at least one lesson');
      return;
    }

    // Create the set
    const newSet = createSet(name.trim(), Array.from(selectedSlugs));

    // Switch to viewing the new set
    showSet(newSet.id);

    // Close modal
    onClose();
  };

  // Don't render on server or when closed
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  // Group lessons by difficulty for display
  const lessonsByDifficulty = allLessons.reduce<Record<string, Lesson[]>>(
    (acc, lesson) => {
      const key = lesson.difficulty;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(lesson);
      return acc;
    },
    {}
  );

  const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'master'];

  // Use Portal to render at document body level for proper stacking
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[100]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-set-title"
      >
        <div
          className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 id="create-set-title" className="text-lg font-semibold text-slate-900 dark:text-white">
              Create Lesson Set
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            {/* Name input */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <label htmlFor="set-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Set Name
              </label>
              <input
                ref={inputRef}
                id="set-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Weekend Review, Interview Prep"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                maxLength={50}
              />
            </div>

            {/* Lesson selection */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select lessons to include ({selectedSlugs.size} selected)
              </p>

              {difficultyOrder.map((difficulty) => {
                const lessons = lessonsByDifficulty[difficulty];
                if (!lessons || lessons.length === 0) return null;

                return (
                  <div key={difficulty}>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {difficulty}
                    </h3>
                    <div className="space-y-1">
                      {lessons.map((lesson) => (
                        <label
                          key={lesson.slug}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSlugs.has(lesson.slug)}
                            onChange={() => toggleLesson(lesson.slug)}
                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-200">{lesson.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error message */}
            {error && (
              <div className="px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
                {error}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                Create Set
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}
