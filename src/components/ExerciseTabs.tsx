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
      className="inline-flex gap-1 p-1 bg-slate-200 rounded-lg"
    >
      {exercises.map((exercise, index) => {
        const isActive = index === currentIndex;
        const isCompleted = completedIndices.includes(index);

        return (
          <button
            key={exercise.id}
            onClick={() => onSelect(index)}
            className={`
              relative flex items-center justify-center w-9 h-9 text-sm font-semibold rounded-md transition-all
              ${isActive
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }
            `}
          >
            {index + 1}
            {isCompleted && (
              <span
                data-testid="checkmark"
                className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
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
