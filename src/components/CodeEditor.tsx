'use client';

import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  initialCode: string;
  onChange: (code: string) => void;
  onRun: () => void;
  isRunning?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  onChange,
  onRun,
  isRunning = false,
}) => {
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <div className="code-editor-container">
      {/* Editor Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="font-medium">Editor</span>
        </div>
        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="rounded-lg overflow-hidden border border-slate-300 bg-[#1e1e1e]">
        <Editor
          height="280px"
          defaultLanguage="typescript"
          defaultValue={initialCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
