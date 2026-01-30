'use client';

import React from 'react';

export interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, label }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-teal-500 h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && (
        <div className="text-xs text-slate-400">{label} ({completed}/{total})</div>
      )}
    </div>
  );
};

export default ProgressBar;
