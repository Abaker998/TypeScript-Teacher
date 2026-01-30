'use client';

import React from 'react';
import { Exercise } from '@/types/lesson';

export interface ExerciseTabsProps {
  exercises: Exercise[];
  currentIndex: number;
  onSelect: (index: number) => void;
  completedIndices: number[];
}

export default function ExerciseTabs({
  exercises,
  currentIndex,
  onSelect,
  completedIndices,
}: ExerciseTabsProps): JSX.Element {
  return (
    <div
      data-testid="exercise-tabs"
      className="inline-flex gap-2 p-1.5 bg-slate-200 dark:bg-slate-700 rounded-xl shadow-inner"
    >
      {exercises.map((exercise, index) => {
        const isActive = index === currentIndex;
        const isCompleted = completedIndices.includes(index);

        return (
          <button
            key={exercise.id}
            onClick={() => onSelect(index)}
            className={`
              relative flex items-center justify-center w-11 h-11 text-base font-bold rounded-lg transition-all duration-200
              ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                : isCompleted
                ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-md'
                : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-slate-500 shadow-sm hover:shadow-md'
              }
            `}
          >
            {isCompleted && !isActive ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              index + 1
            )}
            {isCompleted && isActive && (
              <span
                data-testid="checkmark"
                className="absolute -top-1 -right-1 w-5 h-5 bg-teal-400 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-slate-800"
                aria-label="Completed"
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
