'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LessonGroup, Language } from '@/types/lesson';
import { useProgress } from '@/hooks/useProgress';
import { ProgressBar } from '@/components/ProgressBar';
import { getAllLessons, getLessonsBySlugs } from '@/lessons';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from '@/components/SearchBar';
import AuthButton from '@/components/AuthButton';
import ViewModeSelector from '@/components/ViewModeSelector';
import CreateSetModal from '@/components/CreateSetModal';
import { useLessonView } from '@/contexts/LessonViewContext';
import { languages } from '@/data/languages';
import { LanguageIcon } from '@/components/icons';

interface GlobalSidebarProps {
  lessonGroups: LessonGroup[];
}

export default function GlobalSidebar({ lessonGroups }: GlobalSidebarProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  // Get lesson view context for filtering
  const {
    language,
    isViewingAll,
    isViewingPath,
    isViewingSet,
    currentPath,
    currentSet,
    deleteSet,
    showAllLessons,
  } = useLessonView();

  // Extract current slug from pathname (handle both old and new routes)
  const lessonMatch = pathname?.match(/\/(?:typescript|csharp|lessons)\/(?:lessons\/)?([^/]+)/);
  const currentSlug = lessonMatch ? lessonMatch[1] : '';

  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(['beginner']));
  const [isCreateSetModalOpen, setIsCreateSetModalOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Handle language switch
  const handleLanguageSwitch = (newLanguage: Language) => {
    setIsLanguageDropdownOpen(false);
    router.push(`/${newLanguage}`);
  };
  const { getGroupProgress, resetProgress } = useProgress(language);
  const allLessons = getAllLessons(language);

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

  // Helper to generate lesson link
  const getLessonLink = (slug: string) => `/${language}/lessons/${slug}`;

  // Helper to check current page for nav highlighting
  const isGlossary = pathname === `/${language}/glossary`;
  const isProjects = pathname === `/${language}/projects`;

  return (
    <aside className="hidden lg:flex w-80 flex-shrink-0 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white flex-col h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <Link href={`/${language}`} className="text-2xl font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
          Code Tutor
        </Link>
        <ThemeToggle />
      </div>

      {/* Auth */}
      <div className="px-6 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
        <AuthButton variant="sidebar" />
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <SearchBar />
      </div>

      {/* Nav Links */}
      <div className="p-5 space-y-2 border-b border-slate-200/50 dark:border-slate-700/50">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
            pathname === '/' ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🏠</span> Home
        </Link>
        <Link
          href={`/${language}/glossary`}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
            isGlossary ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>📖</span> Dictionary
        </Link>
        <Link
          href={`/${language}/projects`}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
            isProjects ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🚀</span> Projects
        </Link>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>🔄</span>
            <span className="flex-1 text-left">Switch Language</span>
            <span className={`transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {isLanguageDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
              {(Object.keys(languages) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSwitch(lang)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left text-base transition-colors ${
                    lang === language
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <LanguageIcon language={lang} size={20} />
                  <span>{languages[lang].name}</span>
                  {lang === language && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="px-5 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
        <ViewModeSelector onCreateSet={() => setIsCreateSetModalOpen(true)} />
      </div>

      {/* Lessons */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {isViewingPath && currentPath ? currentPath.name : isViewingSet && currentSet ? currentSet.name : 'Lessons'}
        </span>
        {/* Delete set button (only for user sets) */}
        {isViewingSet && currentSet && (
          <button
            onClick={() => {
              if (window.confirm(`Delete "${currentSet.name}"?`)) {
                deleteSet(currentSet.id);
                showAllLessons();
              }
            }}
            className="text-xs text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Delete this set"
          >
            🗑️
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
        {/* Show filtered lessons for path/set view */}
        {(isViewingPath || isViewingSet) && (
          <>
            {/* Path/Set info */}
            {isViewingPath && currentPath && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {currentPath.icon} {currentPath.lessonSlugs.length} lessons
                {currentPath.estimatedHours && ` · ~${currentPath.estimatedHours}h`}
              </div>
            )}
            {isViewingSet && currentSet && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                📁 {currentSet.lessonSlugs.length} lessons
              </div>
            )}

            {/* Flat list of lessons */}
            <ul className="space-y-1">
              {getLessonsBySlugs(
                language,
                isViewingPath && currentPath
                  ? currentPath.lessonSlugs
                  : isViewingSet && currentSet
                  ? currentSet.lessonSlugs
                  : []
              ).map((lesson, index) => {
                const isTest = lesson.slug.includes('-test');
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={getLessonLink(lesson.slug)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                        isTest ? 'text-base font-bold' : 'text-base font-medium'
                      } ${
                        currentSlug === lesson.slug
                          ? 'bg-indigo-600 text-white'
                          : isTest
                          ? 'text-yellow-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-yellow-700 dark:hover:text-yellow-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="text-xs text-slate-600 dark:text-slate-400 w-5">{index + 1}.</span>
                      {isTest ? `📝 ${lesson.title}` : lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Show grouped lessons for "all" view */}
        {isViewingAll &&
          lessonGroups.map((group) => {
            const progress = getGroupProgress(group.difficulty, allLessons);
            const isGroupComplete = progress.completed === progress.total && progress.total > 0;
            return (
              <div key={group.difficulty}>
                <button
                  onClick={() => toggleGroup(group.difficulty)}
                  className="flex w-full items-center gap-2 py-2 text-left hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span className={`text-sm transition-transform ${expandedGroups.has(group.difficulty) ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                  <span className={`font-bold text-base ${isGroupComplete ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {group.label} {isGroupComplete && '⭐'}
                  </span>
                  <span className={`text-sm ml-auto ${isGroupComplete ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-500'}`}>
                    {isGroupComplete ? '🎉' : `${progress.completed}/${progress.total}`}
                  </span>
                </button>

                <div className="ml-5 mb-3">
                  <ProgressBar completed={progress.completed} total={progress.total} label={group.label} />
                </div>

                {expandedGroups.has(group.difficulty) && (
                  <ul className="ml-5 space-y-1">
                    {group.lessons.map((lesson) => {
                      const isTest = lesson.slug.includes('-test');
                      return (
                        <li key={lesson.slug}>
                          <Link
                            href={getLessonLink(lesson.slug)}
                            className={`block px-4 py-2.5 rounded-lg transition-colors ${
                              isTest ? 'text-base font-bold' : 'text-base font-medium'
                            } ${
                              currentSlug === lesson.slug
                                ? 'bg-indigo-600 text-white'
                                : isTest
                                ? 'text-yellow-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-yellow-700 dark:hover:text-yellow-300'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {isTest ? `📝 ${lesson.title}` : lesson.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
      </nav>

      {/* Reset */}
      <div className="p-5 border-t border-slate-200/50 dark:border-slate-700/50">
        <button
          onClick={handleResetProgress}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          ↺ Reset progress
        </button>
      </div>

      {/* Create Set Modal */}
      <CreateSetModal
        isOpen={isCreateSetModalOpen}
        onClose={() => setIsCreateSetModalOpen(false)}
      />
    </aside>
  );
}
