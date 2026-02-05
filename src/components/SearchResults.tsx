'use client';

import React from 'react';
import Link from 'next/link';
import { SearchResult } from '@/lib/search';
import { Language } from '@/types/lesson';

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onResultClick: () => void;
  language: Language;
}

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-amber-500/20 text-amber-400',
  advanced: 'bg-red-500/20 text-red-400',
  master: 'bg-purple-500/20 text-purple-400',
};

const matchFieldLabels = {
  title: 'Title',
  description: 'Description',
  content: 'Lesson content',
  exercise: 'Exercise',
};

export default function SearchResults({ results, selectedIndex, onResultClick, language }: SearchResultsProps) {
  return (
    <div className="py-2">
      {results.map((result, index) => (
        <Link
          key={result.lesson.slug}
          href={`/${language}/lessons/${result.lesson.slug}`}
          onClick={onResultClick}
          className={`block px-4 py-3 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${
            index === selectedIndex ? 'bg-slate-200/50 dark:bg-slate-700/50' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Difficulty Badge */}
            <span
              className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                difficultyColors[result.lesson.difficulty]
              }`}
            >
              {result.lesson.difficulty.charAt(0).toUpperCase()}
            </span>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <div className="font-medium text-slate-900 dark:text-white truncate">
                {result.lesson.title}
              </div>

              {/* Matched Text */}
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {result.matchedField !== 'title' && (
                  <span className="text-slate-600 dark:text-slate-500 text-xs mr-1">
                    [{matchFieldLabels[result.matchedField]}]
                  </span>
                )}
                {result.matchedText}
              </div>
            </div>

            {/* Arrow */}
            <svg
              className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      ))}

      {/* Keyboard Hint */}
      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-4">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">↓</kbd>
          to navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">↵</kbd>
          to select
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">esc</kbd>
          to close
        </span>
      </div>
    </div>
  );
}
