'use client';

import Link from 'next/link';
import { getLessonsByDifficulty } from '@/lessons';

export default function Home() {
  const lessonGroups = getLessonsByDifficulty();
  const totalLessons = lessonGroups.reduce((sum, group) => sum + group.lessons.length, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gradient-purple mb-6">
            Learn TypeScript
          </h1>
          <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Master TypeScript through interactive lessons with hands-on coding exercises.
            Write real code, get instant feedback, and level up your skills.
          </p>
          <Link
            href="/lessons/variables-and-types"
            className="inline-block px-8 py-4 bg-gradient-purple text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Learning
          </Link>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">What You'll Learn</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {lessonGroups.map((group) => (
              <div key={group.difficulty} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold dark:text-white">{group.label}</h3>
                  <span className="text-yellow-500">
                    {group.difficulty === 'beginner' && '⭐'}
                    {group.difficulty === 'intermediate' && '⭐⭐'}
                    {group.difficulty === 'advanced' && '⭐⭐⭐'}
                  </span>
                </div>
                <ul className="space-y-2">
                  {group.lessons.map((lesson) => (
                    <li key={lesson.slug} className="text-gray-600 dark:text-slate-300">
                      • {lesson.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Features</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Interactive Code Editor</h3>
              <p className="text-gray-600 dark:text-slate-300">
                Write TypeScript in a real Monaco editor with IntelliSense, autocomplete, and error highlighting.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Instant Feedback</h3>
              <p className="text-gray-600 dark:text-slate-300">
                Run your code and see results immediately. Errors are displayed with helpful messages.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Progressive Difficulty</h3>
              <p className="text-gray-600 dark:text-slate-300">
                Start with basics and advance to complex topics like generics and mapped types.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Real-World Examples</h3>
              <p className="text-gray-600 dark:text-slate-300">
                Learn how each concept is used in production code through "How This Was Built" sections.
              </p>
            </div>
          </div>

          {/* Beginner Callout */}
          <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-300 mb-2">New to Programming?</h3>
            <p className="text-purple-700 dark:text-purple-400 mb-4">
              Check out our Coding Dictionary to learn essential terms explained in plain English.
            </p>
            <Link
              href="/glossary"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              View Dictionary
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-purple">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start?
          </h2>
          <p className="text-purple-200 mb-8">
            {totalLessons} lessons covering everything from variables to advanced type patterns.
          </p>
          <Link
            href="/lessons/variables-and-types"
            className="inline-block px-8 py-4 bg-white text-purple-700 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Begin Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
