/**
 * SubmitProjectModal component - form to submit a new community project proposal.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { ProjectDifficulty } from '@/types/project';

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

// Common TypeScript skills/concepts that can be selected
const AVAILABLE_SKILLS = [
  'variables',
  'types',
  'functions',
  'interfaces',
  'type-aliases',
  'unions',
  'generics',
  'classes',
  'modules',
  'async/await',
  'error-handling',
  'mapped-types',
  'conditional-types',
  'utility-types',
  'decorators',
];

export default function SubmitProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: SubmitProjectModalProps): JSX.Element | null {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<ProjectDifficulty>('beginner');
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setDifficulty('beginner');
      setSelectedSkills(new Set());
      setAuthorName('');
      setImageUrl('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!title.trim()) {
      setError('Please enter a project title');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a project description');
      return;
    }

    if (!authorName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          difficulty,
          skills: Array.from(selectedSkills),
          authorName: authorName.trim(),
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit project');
        return;
      }

      // Success - close modal and trigger refresh
      onSubmit();
      onClose();
    } catch (err) {
      setError('Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={isSubmitting ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-project-title"
      >
        <div
          className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 id="submit-project-title" className="text-lg font-semibold text-slate-900 dark:text-white">
              Submit a Project Idea
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 disabled:opacity-50"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="project-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  ref={inputRef}
                  id="project-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Todo App with TypeScript"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  maxLength={100}
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  id="project-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the project, what it does, and what TypeScript concepts it uses..."
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  maxLength={2000}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Markdown is supported</p>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="project-difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty Level *
                </label>
                <select
                  id="project-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as ProjectDifficulty)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  TypeScript Skills Used ({selectedSkills.size} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      disabled={isSubmitting}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedSkills.has(skill)
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-500'
                      } disabled:opacity-50`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author name */}
              <div>
                <label htmlFor="author-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Your Name *
                </label>
                <input
                  id="author-name"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  maxLength={50}
                  disabled={isSubmitting}
                />
              </div>

              {/* Image URL (optional) */}
              <div>
                <label htmlFor="image-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Screenshot/Mockup URL (optional)
                </label>
                <input
                  id="image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/screenshot.png"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  disabled={isSubmitting}
                />
              </div>
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
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Submitting...
                  </>
                ) : (
                  'Submit Project'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
