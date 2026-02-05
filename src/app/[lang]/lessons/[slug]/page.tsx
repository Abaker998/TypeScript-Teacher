'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/useTheme';
import { getLessonBySlug, getAllLessons } from '@/lessons';
import { runTypeScript } from '@/lib/typescript-runner';
import { LessonContent } from '@/components/LessonContent';
import { CodeEditor } from '@/components/CodeEditor';
import { OutputPanel } from '@/components/OutputPanel';
import { BuildNote } from '@/components/BuildNote';
import { Quiz } from '@/components/Quiz';
import ExerciseTabs from '@/components/ExerciseTabs';
import { HintsPanel } from '@/components/HintsPanel';
import { useProgress } from '@/hooks/useProgress';
import { useLanguage } from '@/contexts/LanguageContext';
import { RunResult } from '@/types/lesson';
import AuthGuard from '@/components/AuthGuard';

export default function LessonPage(): JSX.Element {
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const lesson = getLessonBySlug(language, slug);
  const { progress, markQuizComplete, markExerciseComplete } = useProgress(language);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseCode, setExerciseCode] = useState<Record<number, string>>({});
  const [completedExerciseIndices, setCompletedExerciseIndices] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentExercise = lesson?.exercises[currentExerciseIndex];
  const code = exerciseCode[currentExerciseIndex] ?? currentExercise?.starterCode ?? '';
  const isQuizPreviouslyCompleted = progress.lessons[slug]?.quizCompleted ?? false;
  const shouldShowQuiz = lesson?.quiz && lesson.quiz.length > 0 && !quizCompleted && !isQuizPreviouslyCompleted;

  const allLessons = getAllLessons(language);
  const currentLessonIndex = allLessons.findIndex(l => l.slug === slug);
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
    ? allLessons[currentLessonIndex + 1]
    : null;
  const allExercisesCompleted = lesson ? completedExerciseIndices.length >= lesson.exercises.length : false;

  useEffect(() => {
    if (lesson) {
      const lessonProgress = progress.lessons[slug];
      if (lessonProgress) {
        const completedIndices = lesson.exercises
          .map((exercise, index) => ({ id: exercise.id, index }))
          .filter(({ id }) => lessonProgress.exercisesCompleted.includes(id))
          .map(({ index }) => index);
        setCompletedExerciseIndices(completedIndices);
      } else {
        setCompletedExerciseIndices([]);
      }
    }
  }, [slug, lesson, progress.lessons]);

  useEffect(() => {
    if (lesson) {
      setCurrentExerciseIndex(0);
      setExerciseCode({});
      setResult(null);
      setQuizCompleted(false);
    }
  }, [slug, lesson]);

  useEffect(() => {
    setResult(null);
  }, [currentExerciseIndex]);

  const handleCodeChange = useCallback((newCode: string) => {
    setExerciseCode(prev => ({ ...prev, [currentExerciseIndex]: newCode }));
  }, [currentExerciseIndex]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Lesson Not Found</h1>
          <a href={`/${language}/lessons/variables-and-types`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Go to first lesson
          </a>
        </div>
      </div>
    );
  }

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const runResult = await runTypeScript(code);
      setResult(runResult);
    } catch (error) {
      setResult({
        success: false,
        output: [],
        errors: [{ line: 0, column: 0, message: error instanceof Error ? error.message : 'Unknown error' }],
        duration: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleQuizComplete = () => { markQuizComplete(slug); setQuizCompleted(true); };
  const handleQuizSkip = () => { setQuizCompleted(true); };

  const handleExerciseSuccess = () => {
    if (!currentExercise) return;
    markExerciseComplete(slug, currentExercise.id);
    if (!completedExerciseIndices.includes(currentExerciseIndex)) {
      setCompletedExerciseIndices(prev => [...prev, currentExerciseIndex]);
    }
  };

  return (
    <AuthGuard>
    <div className="h-full flex bg-white dark:bg-slate-900">
      {/* Left - Lesson Content */}
      <div className="w-1/2 book-page-left border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="p-6">
            <LessonContent lesson={lesson} />

            {shouldShowQuiz && lesson.quiz && (
              <div className="mt-8">
                <Quiz
                  questions={lesson.quiz}
                  onComplete={handleQuizComplete}
                  onSkip={handleQuizSkip}
                  isTest={slug.includes('-test')}
                  nextLessonSlug={nextLesson?.slug}
                  nextLessonTitle={nextLesson?.title}
                  language={language}
                />
              </div>
            )}

            <div className="mt-8">
              <BuildNote buildNote={lesson.buildNote} />
            </div>
          </div>
        </div>

        {/* Right - Practice */}
        <div className="w-1/2 book-page-right bg-slate-50 dark:bg-slate-800">
          <div className="p-6 space-y-4">
            {/* Exercise Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Practice</span>
              {lesson.exercises.length > 0 && (
                <ExerciseTabs
                  exercises={lesson.exercises}
                  currentIndex={currentExerciseIndex}
                  onSelect={setCurrentExerciseIndex}
                  completedIndices={completedExerciseIndices}
                />
              )}
            </div>

            {/* Exercise Card */}
            {currentExercise && (
              <div className="bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2 py-1 rounded">
                    {currentExercise.id}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {currentExercise.title.replace(/^Exercise \d+:\s*/, '')}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      code({ children, className }) {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!match && !String(children).includes('\n')) {
                          return <code className="text-indigo-600 dark:text-indigo-400 font-semibold">{children}</code>;
                        }
                        return (
                          <SyntaxHighlighter language={match?.[1] || 'typescript'} style={isDark ? oneDark : oneLight} customStyle={{ fontSize: '0.75rem', padding: '0.5rem', borderRadius: '0.375rem', margin: '0.5rem 0' }}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        );
                      },
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                    }}
                  >
                    {currentExercise.description}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Hints */}
            {currentExercise?.hints && currentExercise.hints.length > 0 && (
              <HintsPanel hints={currentExercise.hints} exerciseTitle={currentExercise.title} />
            )}

            {/* Editor */}
            <CodeEditor
              key={`${lesson.slug}-${currentExerciseIndex}`}
              initialCode={code}
              onChange={handleCodeChange}
              onRun={handleRun}
              isRunning={isRunning}
              language={language}
            />

            {/* Output */}
            <OutputPanel
              result={result}
              isLoading={isRunning}
              expectedOutput={currentExercise?.expectedOutput || []}
              solution={currentExercise?.solution || ''}
              onSuccess={handleExerciseSuccess}
            />

            {/* Next Lesson */}
            {allExercisesCompleted && nextLesson && (
              <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-teal-900 dark:text-teal-300">Lesson Complete!</p>
                  <p className="text-sm text-teal-700 dark:text-teal-400">Ready for the next one?</p>
                </div>
                <a href={`/${language}/lessons/${nextLesson.slug}`} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700">
                  Next →
                </a>
              </div>
            )}

            {allExercisesCompleted && !nextLesson && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6 text-center">
                <p className="font-semibold text-indigo-900 dark:text-indigo-300">Course Complete! 🎓</p>
                <a href={`/${language}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Back to Home</a>
              </div>
            )}
          </div>
        </div>
    </div>
    </AuthGuard>
  );
}
