'use client';

import AuthButton from './AuthButton';
import { useLessonView } from '@/contexts/LessonViewContext';
import { languages } from '@/data/languages';
import { LanguageIcon } from '@/components/icons';

export default function Header() {
  const { language } = useLessonView();
  const languageInfo = languages[language];

  return (
    <header className="hidden lg:flex flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 items-center justify-between">
      <div className="flex items-center gap-3">
        <LanguageIcon language={language} size={28} />
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Learn {languageInfo.name}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500 dark:text-slate-400 hidden xl:block">
          Interactive lessons with hands-on practice
        </span>
        <AuthButton />
      </div>
    </header>
  );
}
