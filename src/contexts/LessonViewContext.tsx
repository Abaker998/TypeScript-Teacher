/**
 * LessonViewContext provides state management for the sidebar view mode,
 * learning paths, and user-created lesson sets across the application.
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { SidebarViewMode, LearningPath, UserLessonSet, Lesson, Language } from '@/types/lesson';
import { useSidebarView, UseSidebarViewReturn } from '@/hooks/useSidebarView';
import { useUserSets, UseUserSetsReturn } from '@/hooks/useUserSets';
import { getLearningPathsByLanguage, getLearningPathById } from '@/data/learning-paths';
import { getLessonsBySlugs } from '@/lessons';
import { useLanguageSafe } from '@/contexts/LanguageContext';

/**
 * Combined context type for lesson view management
 */
interface LessonViewContextType {
  // Current language
  language: Language;

  // View mode state and actions
  viewMode: SidebarViewMode;
  showAllLessons: () => void;
  showPath: (pathId: string) => void;
  showSet: (setId: string) => void;
  isViewingAll: boolean;
  isViewingPath: boolean;
  isViewingSet: boolean;
  currentPathId: string | null;
  currentSetId: string | null;

  // Learning paths
  learningPaths: LearningPath[];
  currentPath: LearningPath | null;

  // User sets CRUD
  userSets: UserLessonSet[];
  createSet: (name: string, lessonSlugs: string[]) => UserLessonSet;
  updateSet: (id: string, updates: { name?: string; lessonSlugs?: string[] }) => void;
  deleteSet: (id: string) => void;
  getSetById: (id: string) => UserLessonSet | undefined;
  addLessonToSet: (setId: string, lessonSlug: string) => void;
  removeLessonFromSet: (setId: string, lessonSlug: string) => void;
  currentSet: UserLessonSet | null;

  // Computed lessons based on current view
  getFilteredLessons: () => Lesson[];
  getCurrentViewTitle: () => string;
}

const LessonViewContext = createContext<LessonViewContextType | undefined>(undefined);

interface LessonViewProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app to provide lesson view state
 */
export function LessonViewProvider({ children }: LessonViewProviderProps) {
  // Get current language (safe version that works outside LanguageProvider)
  const { language } = useLanguageSafe();

  // Use our custom hooks with language
  const sidebarView: UseSidebarViewReturn = useSidebarView();
  const userSetsHook: UseUserSetsReturn = useUserSets(language);

  // Get learning paths for the current language
  const learningPaths = getLearningPathsByLanguage(language);

  // Get the current path if viewing one
  const currentPath = sidebarView.currentPathId
    ? getLearningPathById(sidebarView.currentPathId) || null
    : null;

  // Get the current set if viewing one
  const currentSet = sidebarView.currentSetId
    ? userSetsHook.getSetById(sidebarView.currentSetId) || null
    : null;

  /**
   * Get lessons filtered by the current view mode
   */
  const getFilteredLessons = (): Lesson[] => {
    if (sidebarView.isViewingPath && currentPath) {
      return getLessonsBySlugs(language, currentPath.lessonSlugs);
    }

    if (sidebarView.isViewingSet && currentSet) {
      return getLessonsBySlugs(language, currentSet.lessonSlugs);
    }

    // Return empty - caller should use normal lesson groups for 'all' view
    return [];
  };

  /**
   * Get a title for the current view
   */
  const getCurrentViewTitle = (): string => {
    if (sidebarView.isViewingPath && currentPath) {
      return currentPath.name;
    }

    if (sidebarView.isViewingSet && currentSet) {
      return currentSet.name;
    }

    return 'All Lessons';
  };

  const value: LessonViewContextType = {
    // Language
    language,

    // View mode
    viewMode: sidebarView.viewMode,
    showAllLessons: sidebarView.showAllLessons,
    showPath: sidebarView.showPath,
    showSet: sidebarView.showSet,
    isViewingAll: sidebarView.isViewingAll,
    isViewingPath: sidebarView.isViewingPath,
    isViewingSet: sidebarView.isViewingSet,
    currentPathId: sidebarView.currentPathId,
    currentSetId: sidebarView.currentSetId,

    // Learning paths
    learningPaths,
    currentPath,

    // User sets
    userSets: userSetsHook.sets,
    createSet: userSetsHook.createSet,
    updateSet: userSetsHook.updateSet,
    deleteSet: userSetsHook.deleteSet,
    getSetById: userSetsHook.getSetById,
    addLessonToSet: userSetsHook.addLessonToSet,
    removeLessonFromSet: userSetsHook.removeLessonFromSet,
    currentSet,

    // Computed
    getFilteredLessons,
    getCurrentViewTitle,
  };

  return (
    <LessonViewContext.Provider value={value}>
      {children}
    </LessonViewContext.Provider>
  );
}

/**
 * Hook to access the lesson view context
 */
export function useLessonView() {
  const context = useContext(LessonViewContext);
  if (context === undefined) {
    throw new Error('useLessonView must be used within a LessonViewProvider');
  }
  return context;
}
