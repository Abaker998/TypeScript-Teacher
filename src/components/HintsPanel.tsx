'use client';

import React, { useState, useEffect } from 'react';

interface HintsPanelProps {
  hints: string[];
  exerciseTitle: string;
}

export const HintsPanel: React.FC<HintsPanelProps> = ({ hints, exerciseTitle }) => {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    setRevealedCount(0);
  }, [exerciseTitle]);

  const handleShowHint = () => {
    if (revealedCount < hints.length) {
      setRevealedCount(revealedCount + 1);
    }
  };

  if (!hints || hints.length === 0) {
    return null;
  }

  const totalHints = hints.length;
  const allRevealed = revealedCount >= totalHints;

  return (
    <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">Need a hint?</span>
        <span className="text-slate-500 dark:text-slate-400 text-xs">
          {revealedCount}/{totalHints}
        </span>
      </div>

      {/* Revealed hints */}
      {revealedCount > 0 && (
        <div className="space-y-2 mb-3">
          {Array.from({ length: revealedCount }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 animate-fade-in"
            >
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{hints[index]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show hint button */}
      <button
        onClick={handleShowHint}
        disabled={allRevealed}
        className={`
          py-2 px-4 rounded-lg font-medium text-sm transition-all
          ${allRevealed
            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }
        `}
      >
        {allRevealed ? 'All hints revealed' : `Reveal Hint ${revealedCount + 1}`}
      </button>
    </div>
  );
};

export default HintsPanel;
