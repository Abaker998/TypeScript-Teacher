'use client';

import React from 'react';

export interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, label }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const isComplete = completed === total && total > 0;

  return (
    <div className="space-y-1">
      <div className={`rounded-full h-1.5 overflow-hidden ${isComplete ? 'bg-yellow-900/50' : 'bg-slate-700'}`}>
        <div
          className={`h-full transition-all duration-300 ${isComplete ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-teal-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && (
        <div className={`text-xs ${isComplete ? 'text-yellow-400 font-semibold' : 'text-slate-400'}`}>
          {isComplete ? (
            <span className="flex items-center gap-1">
              <span>Complete!</span>
              <span className="inline-block animate-bounce">🎉</span>
            </span>
          ) : (
            <span>{completed}/{total}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
