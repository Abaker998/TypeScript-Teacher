/**
 * useProgress hook for tracking user progress through lessons.
 * Persists progress to localStorage and provides functions to mark
 * quizzes and exercises as complete.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Difficulty, Language, Lesson, LessonProgress, ProgressState } from '@/types/lesson';

/** localStorage key prefix for persisting progress */
const STORAGE_KEY_PREFIX = 'code-tutor-progress';

/** Old storage key for migration */
const OLD_STORAGE_KEY = 'code-tutor-progress';

/** Default empty progress state */
const EMPTY_PROGRESS: ProgressState = { lessons: {} };

/**
 * Get the storage key for a specific language.
 */
function getStorageKey(language: Language): string {
  return `${STORAGE_KEY_PREFIX}-${language}`;
}

/**
 * Return type for the useProgress hook.
 * Provides progress state and functions to track lesson completion.
 */
export interface UseProgressReturn {
  /** Current progress state containing all lesson progress */
  progress: ProgressState;

  /** Mark a lesson's quiz as completed */
  markQuizComplete: (slug: string) => void;

  /** Mark an exercise as completed within a lesson */
  markExerciseComplete: (slug: string, exerciseId: number) => void;

  /** Check if a lesson is fully complete (all exercises, and quiz if present) */
  isLessonComplete: (slug: string, exerciseCount: number, hasQuiz?: boolean) => boolean;

  /** Get completion progress for a difficulty group */
  getGroupProgress: (difficulty: Difficulty, lessons: Lesson[]) => {
    completed: number;
    total: number;
  };

  /** Get completion progress for a learning path or user set */
  getPathProgress: (lessonSlugs: string[], allLessons: Lesson[]) => {
    completed: number;
    total: number;
    percentage: number;
  };

  /** Reset all progress to empty state */
  resetProgress: () => void;
}

/**
 * Check if we're running in the browser (not SSR)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Migrate progress from old storage key to new language-specific key.
 * Only migrates to TypeScript as that was the only language before.
 */
function migrateOldProgress(): void {
  if (!isBrowser()) return;

  try {
    const oldData = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldData) {
      const newKey = getStorageKey('typescript');
      // Only migrate if new key doesn't exist
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldData);
      }
      // Remove old key after migration
      localStorage.removeItem(OLD_STORAGE_KEY);
    }
  } catch {
    // Silently fail on any errors
  }
}

/**
 * Safely read progress from localStorage for a specific language.
 * Returns empty progress if localStorage is unavailable, corrupted, or invalid.
 */
function loadProgressFromStorage(language: Language): ProgressState {
  // Return empty progress during SSR
  if (!isBrowser()) {
    return EMPTY_PROGRESS;
  }

  // Migrate old data on first access
  migrateOldProgress();

  try {
    const stored = localStorage.getItem(getStorageKey(language));
    if (!stored) {
      return EMPTY_PROGRESS;
    }

    const parsed = JSON.parse(stored);

    // Validate structure has 'lessons' object
    if (!parsed || typeof parsed !== 'object' || !parsed.lessons || typeof parsed.lessons !== 'object') {
      return EMPTY_PROGRESS;
    }

    return parsed as ProgressState;
  } catch {
    // Handle JSON parse errors or localStorage access errors (private browsing)
    return EMPTY_PROGRESS;
  }
}

/**
 * Safely write progress to localStorage for a specific language.
 * Silently fails if localStorage is unavailable (private browsing, quota exceeded).
 */
function saveProgressToStorage(language: Language, progress: ProgressState): void {
  // Skip during SSR
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(getStorageKey(language), JSON.stringify(progress));
  } catch {
    // Silently fail - private browsing mode or quota exceeded
    // State will still work in memory, just won't persist
  }
}

/**
 * Hook for tracking user progress through lessons for a specific language.
 * Persists to localStorage and provides functions for marking progress.
 */
export function useProgress(language: Language = 'typescript'): UseProgressReturn {
  // Initialize with empty state (safe for SSR)
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount (client-side only)
  useEffect(() => {
    const stored = loadProgressFromStorage(language);
    setProgress(stored);
    setIsHydrated(true);
  }, [language]);

  // Persist progress to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveProgressToStorage(language, progress);
    }
  }, [progress, isHydrated, language]);

  /**
   * Mark a lesson's quiz as completed.
   */
  const markQuizComplete = useCallback((slug: string): void => {
    setProgress((prev) => {
      const existing = prev.lessons[slug];

      // If already completed, no change needed
      if (existing?.quizCompleted) {
        return prev;
      }

      const updatedLesson: LessonProgress = {
        lessonSlug: slug,
        quizCompleted: true,
        exercisesCompleted: existing?.exercisesCompleted ?? [],
      };

      return {
        ...prev,
        lessons: {
          ...prev.lessons,
          [slug]: updatedLesson,
        },
      };
    });
  }, []);

  /**
   * Mark an exercise as completed within a lesson.
   */
  const markExerciseComplete = useCallback((slug: string, exerciseId: number): void => {
    setProgress((prev) => {
      const existing = prev.lessons[slug];
      const exercisesCompleted = existing?.exercisesCompleted ?? [];

      // If already completed, no change needed
      if (exercisesCompleted.includes(exerciseId)) {
        return prev;
      }

      const updatedLesson: LessonProgress = {
        lessonSlug: slug,
        quizCompleted: existing?.quizCompleted ?? false,
        exercisesCompleted: [...exercisesCompleted, exerciseId],
      };

      return {
        ...prev,
        lessons: {
          ...prev.lessons,
          [slug]: updatedLesson,
        },
      };
    });
  }, []);

  /**
   * Check if a lesson is fully complete.
   * A lesson is complete when all exercises are done.
   * If the lesson has a quiz, the quiz must also be completed.
   */
  const isLessonComplete = useCallback(
    (slug: string, exerciseCount: number, hasQuiz: boolean = false): boolean => {
      const lessonProgress = progress.lessons[slug];

      if (!lessonProgress) {
        return false;
      }

      // If the lesson has a quiz, it must be completed
      if (hasQuiz && !lessonProgress.quizCompleted) {
        return false;
      }

      // All exercises must be completed
      return lessonProgress.exercisesCompleted.length >= exerciseCount;
    },
    [progress]
  );

  /**
   * Get completion progress for a difficulty group.
   * Returns count of completed lessons and total lessons in the group.
   */
  const getGroupProgress = useCallback(
    (difficulty: Difficulty, lessons: Lesson[]): { completed: number; total: number } => {
      // Filter lessons by difficulty
      const groupLessons = lessons.filter((lesson) => lesson.difficulty === difficulty);

      // Count completed lessons
      const completed = groupLessons.filter((lesson) =>
        isLessonComplete(lesson.slug, lesson.exercises.length, !!(lesson.quiz && lesson.quiz.length > 0))
      ).length;

      return {
        completed,
        total: groupLessons.length,
      };
    },
    [isLessonComplete]
  );

  /**
   * Get completion progress for a learning path or user set.
   * Takes an array of lesson slugs and returns completion stats.
   */
  const getPathProgress = useCallback(
    (
      lessonSlugs: string[],
      allLessons: Lesson[]
    ): { completed: number; total: number; percentage: number } => {
      // Get the actual lesson objects for these slugs
      const pathLessons = lessonSlugs
        .map((slug) => allLessons.find((l) => l.slug === slug))
        .filter((lesson): lesson is Lesson => lesson !== undefined);

      // Count completed lessons
      const completed = pathLessons.filter((lesson) =>
        isLessonComplete(lesson.slug, lesson.exercises.length, !!(lesson.quiz && lesson.quiz.length > 0))
      ).length;

      const total = pathLessons.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, total, percentage };
    },
    [isLessonComplete]
  );

  /**
   * Reset all progress to empty state.
   */
  const resetProgress = useCallback((): void => {
    setProgress(EMPTY_PROGRESS);
  }, []);

  return {
    progress,
    markQuizComplete,
    markExerciseComplete,
    isLessonComplete,
    getGroupProgress,
    getPathProgress,
    resetProgress,
  };
}
