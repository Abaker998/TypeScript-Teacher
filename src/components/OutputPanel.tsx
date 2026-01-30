'use client';

import React from 'react';
import { RunResult } from '@/types/lesson';
import { explainErrors, ErrorExplanation } from '@/lib/errorExplainer';

interface OutputPanelProps {
  result: RunResult | null;
  isLoading?: boolean;
  expectedOutput?: string[];
  solution?: string;
  onSuccess?: () => void;
}

interface GradeResult {
  grade: 'perfect' | 'partial' | 'incorrect' | 'error';
  score: number;
  feedback: string;
  details: string[];
}

function gradeOutput(actual: string[], expected: string[]): GradeResult {
  if (expected.length === 0) {
    return {
      grade: 'perfect',
      score: 100,
      feedback: 'Code executed successfully!',
      details: [],
    };
  }

  const details: string[] = [];
  let matchCount = 0;
  const maxLines = Math.max(actual.length, expected.length);

  for (let i = 0; i < maxLines; i++) {
    const actualLine = actual[i]?.trim() || '';
    const expectedLine = expected[i]?.trim() || '';

    if (i >= actual.length) {
      details.push(`Line ${i + 1}: Missing - expected "${expectedLine}"`);
    } else if (i >= expected.length) {
      details.push(`Line ${i + 1}: Extra output - "${actualLine}"`);
    } else if (actualLine === expectedLine) {
      matchCount++;
      details.push(`Line ${i + 1}: ✓ Correct`);
    } else {
      details.push(`Line ${i + 1}: ✗ Expected "${expectedLine}" but got "${actualLine}"`);
    }
  }

  const score = expected.length > 0 ? Math.round((matchCount / expected.length) * 100) : 100;

  if (score === 100) {
    return { grade: 'perfect', score: 100, feedback: 'Perfect! Your output matches exactly!', details };
  } else if (score >= 50) {
    return { grade: 'partial', score, feedback: `Getting there! ${matchCount}/${expected.length} lines correct.`, details };
  } else {
    return { grade: 'incorrect', score, feedback: `Not quite right. Review your code and try again.`, details };
  }
}

type TabType = 'output' | 'explain';

export const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  isLoading = false,
  expectedOutput = [],
  solution,
  onSuccess,
}) => {
  const [showDetails, setShowDetails] = React.useState(true);
  const [showSolution, setShowSolution] = React.useState(false);
  const [hasCalledSuccess, setHasCalledSuccess] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabType>('output');

  React.useEffect(() => {
    setHasCalledSuccess(false);
  }, [result]);

  React.useEffect(() => {
    if (result && result.errors.length > 0) {
      setActiveTab('explain');
    } else if (result) {
      setActiveTab('output');
    }
  }, [result]);

  React.useEffect(() => {
    if (result?.success && onSuccess && !hasCalledSuccess) {
      const gradeResult = gradeOutput(result.output, expectedOutput);
      if (gradeResult.grade === 'perfect') {
        setHasCalledSuccess(true);
        onSuccess();
      }
    }
  }, [result, expectedOutput, onSuccess, hasCalledSuccess]);

  if (isLoading) {
    return (
      <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-sm">
        <div className="text-amber-400 flex items-center gap-3">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Executing code...
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-sm">
        <div className="text-slate-500 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Click "Run Code" to see output
        </div>
      </div>
    );
  }

  const gradeResult = result.success
    ? gradeOutput(result.output, expectedOutput)
    : { grade: 'error' as const, score: 0, feedback: 'Fix the errors below and try again.', details: [] };

  const gradeStyles = {
    perfect: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', icon: '✓' },
    partial: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: '◐' },
    incorrect: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '✗' },
    error: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '!' },
  };

  const styles = gradeStyles[gradeResult.grade];
  const hasErrors = result.errors.length > 0;
  const errorExplanations = hasErrors ? explainErrors(result.errors) : [];

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl font-mono text-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab('output')}
          className={`px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'output'
              ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Output
        </button>
        <button
          onClick={() => setActiveTab('explain')}
          className={`px-5 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'explain'
              ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Debug Help
          {hasErrors && (
            <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {result.errors.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 space-y-4">
        {activeTab === 'output' && (
          <>
            {/* Grade Card */}
            <div className={`${styles.bg} ${styles.border} border rounded-xl p-4`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${styles.bg} ${styles.border} border flex items-center justify-center ${styles.text} text-xl font-bold`}>
                    {styles.icon}
                  </div>
                  <div>
                    <div className={`${styles.text} font-semibold`}>
                      {gradeResult.grade === 'perfect' && 'Perfect!'}
                      {gradeResult.grade === 'partial' && 'Partial Credit'}
                      {gradeResult.grade === 'incorrect' && 'Not Quite'}
                      {gradeResult.grade === 'error' && 'Error'}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">{gradeResult.feedback}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${styles.text} text-3xl font-bold`}>{gradeResult.score}%</div>
                  <div className="text-slate-500 text-xs">{result.duration}ms</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    gradeResult.score === 100 ? 'bg-teal-500' :
                    gradeResult.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${gradeResult.score}%` }}
                />
              </div>
            </div>

            {/* Output Display */}
            {result.success && result.output.length > 0 && (
              <div>
                <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-medium">Your Output</div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  {result.output.map((line, i) => (
                    <div key={i} className="text-slate-200 flex">
                      <span className="text-slate-600 w-6 text-right mr-3 select-none">{i + 1}</span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Output */}
            {result.success && expectedOutput.length > 0 && gradeResult.grade !== 'perfect' && (
              <div>
                <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-medium">Expected Output</div>
                <div className="bg-slate-950 p-4 rounded-lg border border-teal-900/30">
                  {expectedOutput.map((line, i) => (
                    <div key={i} className="text-teal-400 flex">
                      <span className="text-slate-600 w-6 text-right mr-3 select-none">{i + 1}</span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Comparison */}
            {result.success && expectedOutput.length > 0 && gradeResult.details.length > 0 && (
              <div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2"
                >
                  <span className={`transition-transform ${showDetails ? 'rotate-90' : ''}`}>▶</span>
                  {showDetails ? 'Hide' : 'Show'} comparison
                </button>
                {showDetails && (
                  <div className="mt-3 bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                    {gradeResult.details.map((detail, i) => (
                      <div
                        key={i}
                        className={`text-sm ${
                          detail.includes('✓') ? 'text-teal-400' :
                          detail.includes('✗') ? 'text-red-400' : 'text-amber-400'
                        }`}
                      >
                        {detail}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Solution */}
            {solution && gradeResult.grade !== 'perfect' && (
              <div>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2"
                >
                  <span className={`transition-transform ${showSolution ? 'rotate-90' : ''}`}>▶</span>
                  {showSolution ? 'Hide' : 'Show'} solution
                </button>
                {showSolution && (
                  <div className="mt-3 bg-slate-950 p-4 rounded-lg border border-indigo-900/30">
                    <pre className="text-indigo-300 whitespace-pre-wrap text-xs">{solution}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Error Link */}
            {hasErrors && (
              <button
                onClick={() => setActiveTab('explain')}
                className="w-full bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-left hover:bg-red-500/20 transition-colors"
              >
                <div className="text-red-400 font-medium flex items-center justify-between">
                  <span>{result.errors.length} error{result.errors.length > 1 ? 's' : ''} found</span>
                  <span className="text-red-500 text-sm">View details →</span>
                </div>
              </button>
            )}
          </>
        )}

        {activeTab === 'explain' && (
          <>
            {hasErrors ? (
              <div className="space-y-4">
                {errorExplanations.map((item, index) => (
                  <ErrorExplanationCard
                    key={index}
                    error={item.original}
                    explanation={item.explanation}
                    index={index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <div className="text-teal-400 font-semibold text-lg">No Errors</div>
                <div className="text-slate-500 mt-2">
                  Your code compiled successfully.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface ErrorExplanationCardProps {
  error: { message: string; line: number; column: number };
  explanation: ErrorExplanation;
  index: number;
}

const ErrorExplanationCard: React.FC<ErrorExplanationCardProps> = ({ error, explanation, index }) => {
  const [showExample, setShowExample] = React.useState(false);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="bg-red-500/10 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {index}
            </span>
            <span className="text-red-300 font-medium">{explanation.title}</span>
          </div>
          <span className="text-slate-500 text-xs">
            Line {error.line}:{error.column}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Explanation */}
        <p className="text-slate-300 leading-relaxed">{explanation.explanation}</p>

        {/* Technical Message */}
        <details className="text-xs">
          <summary className="text-slate-500 cursor-pointer hover:text-slate-400">
            Technical error message
          </summary>
          <div className="mt-2 bg-slate-900 p-3 rounded-lg text-red-400 font-mono">
            {error.message}
          </div>
        </details>

        {/* Example */}
        {explanation.example && (
          <div>
            <button
              onClick={() => setShowExample(!showExample)}
              className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2"
            >
              <span className={`transition-transform ${showExample ? 'rotate-90' : ''}`}>▶</span>
              {showExample ? 'Hide' : 'Show'} example
            </button>
            {showExample && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-red-900/20 rounded-lg p-3 border border-red-900/30">
                  <div className="text-red-400 text-xs mb-2 font-medium">Wrong</div>
                  <pre className="text-red-300 text-xs whitespace-pre-wrap">{explanation.example.wrong}</pre>
                </div>
                <div className="bg-teal-900/20 rounded-lg p-3 border border-teal-900/30">
                  <div className="text-teal-400 text-xs mb-2 font-medium">Correct</div>
                  <pre className="text-teal-300 text-xs whitespace-pre-wrap">{explanation.example.right}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
          <div className="text-indigo-300 font-medium text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            How to fix
          </div>
          <ul className="space-y-1.5">
            {explanation.tips.map((tip, i) => (
              <li key={i} className="text-indigo-200 text-sm flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
