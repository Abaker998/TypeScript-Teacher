/**
 * useProgress hook for tracking user progress through lessons.
 * Persists progress to localStorage and provides functions to mark
 * quizzes and exercises as complete.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Difficulty, Lesson, LessonProgress, ProgressState } from '@/types/lesson';

/** localStorage key for persisting progress */
const STORAGE_KEY = 'typescript-teacher-progress';

/** Default empty progress state */
const EMPTY_PROGRESS: ProgressState = { lessons: {} };

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
 * Safely read progress from localStorage.
 * Returns empty progress if localStorage is unavailable, corrupted, or invalid.
 */
function loadProgressFromStorage(): ProgressState {
  // Return empty progress during SSR
  if (!isBrowser()) {
    return EMPTY_PROGRESS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
 * Safely write progress to localStorage.
 * Silently fails if localStorage is unavailable (private browsing, quota exceeded).
 */
function saveProgressToStorage(progress: ProgressState): void {
  // Skip during SSR
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Silently fail - private browsing mode or quota exceeded
    // State will still work in memory, just won't persist
  }
}

/**
 * Hook for tracking user progress through lessons.
 * Persists to localStorage and provides functions for marking progress.
 */
export function useProgress(): UseProgressReturn {
  // Initialize with empty state (safe for SSR)
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount (client-side only)
  useEffect(() => {
    const stored = loadProgressFromStorage();
    setProgress(stored);
    setIsHydrated(true);
  }, []);

  // Persist progress to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveProgressToStorage(progress);
    }
  }, [progress, isHydrated]);

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
    resetProgress,
  };
}
