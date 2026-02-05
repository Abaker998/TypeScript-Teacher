/**
 * useSidebarView hook for tracking the current sidebar view mode.
 * Manages whether we're showing all lessons, a learning path, or a user set.
 */

'use client';

import { useState, useCallback } from 'react';
import type { SidebarViewMode } from '@/types/lesson';

/**
 * Return type for the useSidebarView hook.
 */
export interface UseSidebarViewReturn {
  /** Current view mode */
  viewMode: SidebarViewMode;

  /** Switch to showing all lessons */
  showAllLessons: () => void;

  /** Switch to showing a specific learning path */
  showPath: (pathId: string) => void;

  /** Switch to showing a specific user set */
  showSet: (setId: string) => void;

  /** Check if currently viewing all lessons */
  isViewingAll: boolean;

  /** Check if currently viewing a path */
  isViewingPath: boolean;

  /** Check if currently viewing a user set */
  isViewingSet: boolean;

  /** Get the current path ID (if viewing a path) */
  currentPathId: string | null;

  /** Get the current set ID (if viewing a set) */
  currentSetId: string | null;
}

/**
 * Hook for managing the sidebar view mode.
 */
export function useSidebarView(): UseSidebarViewReturn {
  const [viewMode, setViewMode] = useState<SidebarViewMode>({ type: 'all' });

  /**
   * Switch to showing all lessons.
   */
  const showAllLessons = useCallback((): void => {
    setViewMode({ type: 'all' });
  }, []);

  /**
   * Switch to showing a specific learning path.
   */
  const showPath = useCallback((pathId: string): void => {
    setViewMode({ type: 'path', pathId });
  }, []);

  /**
   * Switch to showing a specific user set.
   */
  const showSet = useCallback((setId: string): void => {
    setViewMode({ type: 'set', setId });
  }, []);

  // Computed properties
  const isViewingAll = viewMode.type === 'all';
  const isViewingPath = viewMode.type === 'path';
  const isViewingSet = viewMode.type === 'set';
  const currentPathId = viewMode.type === 'path' ? viewMode.pathId : null;
  const currentSetId = viewMode.type === 'set' ? viewMode.setId : null;

  return {
    viewMode,
    showAllLessons,
    showPath,
    showSet,
    isViewingAll,
    isViewingPath,
    isViewingSet,
    currentPathId,
    currentSetId,
  };
}
