'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LessonGroup } from '@/types/lesson';
import { useProgress } from '@/hooks/useProgress';
import { ProgressBar } from '@/components/ProgressBar';
import { getAllLessons } from '@/lessons';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from '@/components/SearchBar';

interface GlobalSidebarProps {
  lessonGroups: LessonGroup[];
}

export default function GlobalSidebar({ lessonGroups }: GlobalSidebarProps): JSX.Element {
  const pathname = usePathname();
  const currentSlug = pathname?.startsWith('/lessons/') ? pathname.replace('/lessons/', '') : '';
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(['beginner']));
  const { getGroupProgress, resetProgress } = useProgress();
  const allLessons = getAllLessons();

  const toggleGroup = (difficulty: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(difficulty)) {
      newExpanded.delete(difficulty);
    } else {
      newExpanded.add(difficulty);
    }
    setExpandedGroups(newExpanded);
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all progress?')) {
      resetProgress();
    }
  };

  return (
    <aside className="hidden lg:flex w-80 flex-shrink-0 bg-slate-900 text-white flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors">
          TypeScript Teacher
        </Link>
        <ThemeToggle />
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-slate-700/50">
        <SearchBar />
      </div>

      {/* Nav Links */}
      <div className="p-5 space-y-2 border-b border-slate-700/50">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
            pathname === '/' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span>🏠</span> Home
        </Link>
        <Link
          href="/glossary"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
            pathname === '/glossary' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span>📖</span> Dictionary
        </Link>
      </div>

      {/* Lessons */}
      <div className="px-5 pt-5 pb-3">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Lessons</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
        {lessonGroups.map((group) => {
          const progress = getGroupProgress(group.difficulty, allLessons);
          const isGroupComplete = progress.completed === progress.total && progress.total > 0;
          return (
            <div key={group.difficulty}>
              <button
                onClick={() => toggleGroup(group.difficulty)}
                className="flex w-full items-center gap-2 py-2 text-left hover:text-white transition-colors"
              >
                <span className={`text-sm transition-transform ${expandedGroups.has(group.difficulty) ? 'rotate-90' : ''}`}>
                  ▶
                </span>
                <span className={`font-semibold text-base ${isGroupComplete ? 'text-yellow-400' : 'text-slate-200'}`}>
                  {group.label} {isGroupComplete && '⭐'}
                </span>
                <span className={`text-sm ml-auto ${isGroupComplete ? 'text-yellow-400' : 'text-slate-500'}`}>
                  {isGroupComplete ? '🎉' : `${progress.completed}/${progress.total}`}
                </span>
              </button>

              <div className="ml-5 mb-3">
                <ProgressBar completed={progress.completed} total={progress.total} label={group.label} />
              </div>

              {expandedGroups.has(group.difficulty) && (
                <ul className="ml-5 space-y-1">
                  {group.lessons.map((lesson) => (
                    <li key={lesson.slug}>
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className={`block px-4 py-2.5 rounded-lg text-base transition-colors ${
                          currentSlug === lesson.slug
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {lesson.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Reset */}
      <div className="p-5 border-t border-slate-700/50">
        <button
          onClick={handleResetProgress}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ↺ Reset progress
        </button>
      </div>
    </aside>
  );
}
