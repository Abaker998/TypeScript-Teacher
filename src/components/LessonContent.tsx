'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Lesson } from '@/types/lesson';

interface LessonContentProps {
  lesson: Lesson;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
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
              <SyntaxHighlighter
                language={match?.[1] || 'typescript'}
                style={oneDark}
                customStyle={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  margin: '1rem 0',
                }}
              >
                {codeString.replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
          h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-8 pb-2 border-b border-slate-200 dark:border-slate-700">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-6">{children}</h3>,
          p: ({ children }) => <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-outside ml-5 mb-4 space-y-1 text-slate-600 dark:text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-1 text-slate-600 dark:text-slate-300">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 pl-4 py-2 my-4 rounded-r text-slate-700 dark:text-slate-300">{children}</blockquote>,
          a: ({ href, children }) => <a href={href} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline">{children}</a>,
          strong: ({ children }) => <strong className="font-semibold text-slate-800 dark:text-slate-200">{children}</strong>,
        }}
      >
        {lesson.content}
      </ReactMarkdown>
    </article>
  );
};

export default LessonContent;
