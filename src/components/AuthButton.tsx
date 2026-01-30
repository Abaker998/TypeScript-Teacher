'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface AuthButtonProps {
  className?: string;
  variant?: 'default' | 'sidebar';
}

export default function AuthButton({ className = '', variant = 'default' }: AuthButtonProps) {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-9 w-20 bg-gray-200 dark:bg-slate-700 rounded-lg" />
      </div>
    );
  }

  if (user) {
    const isSidebar = variant === 'sidebar';
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className={`text-sm truncate max-w-[150px] ${isSidebar ? 'text-slate-300' : 'text-gray-600 dark:text-slate-400'}`}>
          {user.username}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        variant === 'sidebar'
          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      } ${className}`}
    >
      Sign in
    </Link>
  );
}
