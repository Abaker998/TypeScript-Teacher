'use client';

import Link from 'next/link';
import { getAllLanguages } from '@/data/languages';
import { LanguageIcon } from '@/components/icons';

export default function CodeTutorLanding() {
  const languages = getAllLanguages();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gradient-purple mb-6">
            Code Tutor
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-200 mb-8 max-w-2xl mx-auto font-medium">
            Master programming through interactive lessons with hands-on coding exercises.
            Write real code, get instant feedback, and level up your skills.
          </p>
          <p className="text-lg text-gray-700 dark:text-slate-200 font-medium">
            Choose a language to begin your journey
          </p>
        </div>
      </section>

      {/* Language Selection */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Select Your Language</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {languages.map((lang) => (
              <Link
                key={lang.id}
                href={`/${lang.id}`}
                className="group block bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-700 p-8 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all hover:shadow-lg"
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center"><LanguageIcon language={lang.id} size={64} /></div>
                  <h3
                    className="text-2xl font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                    style={{ color: lang.color }}
                  >
                    {lang.name}
                  </h3>
                  <p className="text-gray-700 dark:text-slate-200 mb-4 font-medium">
                    {lang.description}
                  </p>
                  <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                    Start Learning →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why Code Tutor?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 dark:text-white">Interactive Code Editor</h3>
              <p className="text-gray-700 dark:text-slate-200 font-medium">
                Write code in a real editor with IntelliSense, autocomplete, and error highlighting.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 dark:text-white">Instant Feedback</h3>
              <p className="text-gray-700 dark:text-slate-200 font-medium">
                Run your code and see results immediately. Errors are displayed with helpful messages.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 dark:text-white">Progressive Difficulty</h3>
              <p className="text-gray-700 dark:text-slate-200 font-medium">
                Start with basics and advance to complex topics at your own pace.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 dark:text-white">Real-World Examples</h3>
              <p className="text-gray-700 dark:text-slate-200 font-medium">
                Learn how each concept is used in production code through practical examples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-purple">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start coding?
          </h2>
          <p className="text-indigo-200 mb-8">
            30+ lessons per language covering everything from basics to advanced patterns.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {languages.map((lang) => (
              <Link
                key={lang.id}
                href={`/${lang.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LanguageIcon language={lang.id} size={24} />
                <span>Learn {lang.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
