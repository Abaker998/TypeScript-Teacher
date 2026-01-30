'use client';

import Link from 'next/link';
import { getLessonsByDifficulty } from '@/lessons';
import GlobalSidebar from './GlobalSidebar';
import ThemeToggle from './ThemeToggle';

export default function NavBar() {
  const lessonGroups = getLessonsByDifficulty();

  return (
    <>
      {/* Mobile header - only visible on small screens */}
      <nav className="lg:hidden bg-white dark:bg-slate-800 border-b border-purple-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gradient-purple hover:opacity-80">
            TypeScript Teacher
          </Link>
          <ThemeToggle className="text-slate-600 dark:text-slate-300" />
        </div>
      </nav>

      {/* Desktop sidebar - always visible on large screens */}
      <GlobalSidebar lessonGroups={lessonGroups} />
    </>
  );
}
