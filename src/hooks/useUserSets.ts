/**
 * useUserSets hook for managing user-created lesson sets.
 * Provides CRUD operations with localStorage persistence.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Language, UserLessonSet } from '@/types/lesson';

/** localStorage key prefix for persisting user lesson sets */
const STORAGE_KEY_PREFIX = 'code-tutor-user-sets';

/** Old storage key for migration */
const OLD_STORAGE_KEY = 'code-tutor-user-sets';

/** Default empty sets array */
const EMPTY_SETS: UserLessonSet[] = [];

/**
 * Get the storage key for a specific language.
 */
function getStorageKey(language: Language): string {
  return `${STORAGE_KEY_PREFIX}-${language}`;
}

/**
 * Return type for the useUserSets hook.
 */
export interface UseUserSetsReturn {
  /** Array of user-created lesson sets */
  sets: UserLessonSet[];

  /** Create a new lesson set */
  createSet: (name: string, lessonSlugs: string[]) => UserLessonSet;

  /** Update an existing set */
  updateSet: (id: string, updates: { name?: string; lessonSlugs?: string[] }) => void;

  /** Delete a set by ID */
  deleteSet: (id: string) => void;

  /** Get a specific set by ID */
  getSetById: (id: string) => UserLessonSet | undefined;

  /** Add a lesson to a set */
  addLessonToSet: (setId: string, lessonSlug: string) => void;

  /** Remove a lesson from a set */
  removeLessonFromSet: (setId: string, lessonSlug: string) => void;
}

/**
 * Check if we're running in the browser (not SSR)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Generate a unique ID for a new set
 */
function generateId(): string {
  return `set-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Migrate user sets from old storage key to new language-specific key.
 * Only migrates to TypeScript as that was the only language before.
 */
function migrateOldSets(): void {
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
 * Safely read sets from localStorage for a specific language.
 */
function loadSetsFromStorage(language: Language): UserLessonSet[] {
  if (!isBrowser()) {
    return EMPTY_SETS;
  }

  // Migrate old data on first access
  migrateOldSets();

  try {
    const stored = localStorage.getItem(getStorageKey(language));
    if (!stored) {
      return EMPTY_SETS;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return EMPTY_SETS;
    }

    return parsed as UserLessonSet[];
  } catch {
    return EMPTY_SETS;
  }
}

/**
 * Safely write sets to localStorage for a specific language.
 */
function saveSetsToStorage(language: Language, sets: UserLessonSet[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(getStorageKey(language), JSON.stringify(sets));
  } catch {
    // Silently fail - private browsing mode or quota exceeded
  }
}

/**
 * Hook for managing user-created lesson sets for a specific language.
 */
export function useUserSets(language: Language = 'typescript'): UseUserSetsReturn {
  const [sets, setSets] = useState<UserLessonSet[]>(EMPTY_SETS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = loadSetsFromStorage(language);
    setSets(stored);
    setIsHydrated(true);
  }, [language]);

  // Persist to localStorage whenever sets change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveSetsToStorage(language, sets);
    }
  }, [sets, isHydrated, language]);

  /**
   * Create a new lesson set.
   */
  const createSet = useCallback((name: string, lessonSlugs: string[]): UserLessonSet => {
    const now = new Date().toISOString();
    const newSet: UserLessonSet = {
      id: generateId(),
      name,
      lessonSlugs,
      createdAt: now,
      updatedAt: now,
    };

    setSets((prev) => [...prev, newSet]);
    return newSet;
  }, []);

  /**
   * Update an existing set.
   */
  const updateSet = useCallback(
    (id: string, updates: { name?: string; lessonSlugs?: string[] }): void => {
      setSets((prev) =>
        prev.map((set) =>
          set.id === id
            ? {
                ...set,
                ...(updates.name !== undefined && { name: updates.name }),
                ...(updates.lessonSlugs !== undefined && { lessonSlugs: updates.lessonSlugs }),
                updatedAt: new Date().toISOString(),
              }
            : set
        )
      );
    },
    []
  );

  /**
   * Delete a set by ID.
   */
  const deleteSet = useCallback((id: string): void => {
    setSets((prev) => prev.filter((set) => set.id !== id));
  }, []);

  /**
   * Get a specific set by ID.
   */
  const getSetById = useCallback(
    (id: string): UserLessonSet | undefined => {
      return sets.find((set) => set.id === id);
    },
    [sets]
  );

  /**
   * Add a lesson to a set.
   */
  const addLessonToSet = useCallback((setId: string, lessonSlug: string): void => {
    setSets((prev) =>
      prev.map((set) =>
        set.id === setId && !set.lessonSlugs.includes(lessonSlug)
          ? {
              ...set,
              lessonSlugs: [...set.lessonSlugs, lessonSlug],
              updatedAt: new Date().toISOString(),
            }
          : set
      )
    );
  }, []);

  /**
   * Remove a lesson from a set.
   */
  const removeLessonFromSet = useCallback((setId: string, lessonSlug: string): void => {
    setSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              lessonSlugs: set.lessonSlugs.filter((slug) => slug !== lessonSlug),
              updatedAt: new Date().toISOString(),
            }
          : set
      )
    );
  }, []);

  return {
    sets,
    createSet,
    updateSet,
    deleteSet,
    getSetById,
    addLessonToSet,
    removeLessonFromSet,
  };
}
