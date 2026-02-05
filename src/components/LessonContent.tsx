'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Lesson } from '@/types/lesson';
import { useTheme } from '@/hooks/useTheme';

interface LessonContentProps {
  lesson: Lesson;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const { isDark } = useTheme();

  return (
    <article>
      <ReactMarkdown
        components={{
          code({ children, className, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children);

            // Inline code - no language class AND no newlines (single line)
            if (!match && !codeString.includes('\n')) {
              return (
                <code className="text-indigo-600 dark:text-indigo-400 font-semibold" {...props}>
                  {children}
                </code>
              );
            }

            // Code block - either has language class OR has multiple lines
            return (
              <div className={`rounded-lg overflow-hidden my-4 ${isDark ? '' : 'border-2 border-indigo-300 shadow-sm'}`}>
                <SyntaxHighlighter
                  language={match?.[1] || 'typescript'}
                  style={isDark ? oneDark : oneLight}
                  customStyle={{
                    padding: '1rem',
                    borderRadius: isDark ? '0.5rem' : '0',
                    fontSize: '0.875rem',
                    margin: 0,
                  }}
                >
                  {codeString.replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          },
          h1: ({ children }) => <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-5">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 mt-10 pb-2 border-b border-slate-200 dark:border-slate-700">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 mt-8">{children}</h3>,
          p: ({ children }) => <p className="text-base text-slate-800 dark:text-slate-300 leading-relaxed mb-5 font-medium">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-outside ml-6 mb-5 space-y-2 text-slate-800 dark:text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-5 space-y-2 text-slate-800 dark:text-slate-300">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed text-base text-slate-800 dark:text-slate-300 font-medium">{children}</li>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 pl-4 py-3 my-5 rounded-r text-slate-800 dark:text-slate-300 font-medium">{children}</blockquote>,
          a: ({ href, children }) => <a href={href} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-semibold">{children}</a>,
          strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-slate-100">{children}</strong>,
        }}
      >
        {lesson.content}
      </ReactMarkdown>
    </article>
  );
};

export default LessonContent;
