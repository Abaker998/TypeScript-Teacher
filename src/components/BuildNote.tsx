'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BuildNote as BuildNoteType } from '@/types/lesson';

interface BuildNoteProps {
  buildNote: BuildNoteType;
}

export const BuildNote: React.FC<BuildNoteProps> = ({ buildNote }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-slate-200 pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium">How This Was Built</span>
      </button>

      {isOpen && (
        <div className="mt-4 pl-6 space-y-4 animate-fade-in">
          <h3 className="font-semibold text-slate-800">{buildNote.title}</h3>

          <div className="prose prose-sm prose-slate max-w-none text-sm">
            <ReactMarkdown>{buildNote.explanation}</ReactMarkdown>
          </div>

          {buildNote.inTheRealWorld && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <h4 className="font-medium text-indigo-900 text-sm mb-2">In the Real World</h4>
              <div className="prose prose-sm prose-indigo max-w-none text-xs">
                <ReactMarkdown>{buildNote.inTheRealWorld}</ReactMarkdown>
              </div>
            </div>
          )}

          {buildNote.relatedFiles && buildNote.relatedFiles.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <h4 className="font-medium text-slate-800 text-sm mb-2">Related Files</h4>
              <div className="flex flex-wrap gap-1.5">
                {buildNote.relatedFiles.map((file, i) => (
                  <code
                    key={i}
                    className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-mono"
                  >
                    {file}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildNote;
