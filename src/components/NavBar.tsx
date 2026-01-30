'use client';

import Link from 'next/link';
import { getLessonsByDifficulty } from '@/lessons';
import GlobalSidebar from './GlobalSidebar';

export default function NavBar() {
  const lessonGroups = getLessonsByDifficulty();

  return (
    <>
      {/* Mobile header - only visible on small screens */}
      <nav className="lg:hidden bg-white border-b border-purple-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3 flex justify-center items-center">
          <Link href="/" className="text-xl font-bold text-gradient-purple hover:opacity-80">
            TypeScript Teacher
          </Link>
        </div>
      </nav>

      {/* Desktop sidebar - always visible on large screens */}
      <GlobalSidebar lessonGroups={lessonGroups} />
    </>
  );
}
