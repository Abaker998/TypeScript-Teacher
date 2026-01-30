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
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-amber-900 text-sm">Need a hint?</span>
        <span className="text-amber-600 text-xs bg-amber-100 px-2 py-0.5 rounded">
          {revealedCount}/{totalHints}
        </span>
      </div>

      {/* Revealed hints */}
      {revealedCount > 0 && (
        <div className="space-y-2 mb-3">
          {Array.from({ length: revealedCount }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-amber-200 rounded-lg p-3 animate-fade-in"
            >
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-amber-900 text-sm leading-relaxed">{hints[index]}</p>
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
          w-full py-2 px-3 rounded-lg font-medium text-sm transition-all
          ${allRevealed
            ? 'bg-amber-100 text-amber-400 cursor-not-allowed'
            : 'bg-amber-500 text-white hover:bg-amber-600'
          }
        `}
      >
        {allRevealed ? 'All hints shown' : `Show hint ${revealedCount + 1}`}
      </button>
    </div>
  );
};

export default HintsPanel;
