/**
 * Tests for useProgress hook.
 * Tests localStorage persistence, progress tracking functions, and error handling.
 */

import { renderHook, act } from '@testing-library/react';
import { useProgress } from './useProgress';
import type { Lesson, ProgressState } from '@/types/lesson';

// Storage key constant
const STORAGE_KEY = 'typescript-teacher-progress';

// Mock lesson factory for testing
const createMockLesson = (slug: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): Lesson => ({
  slug,
  title: `Lesson ${slug}`,
  description: 'Test lesson',
  difficulty,
  order: 1,
  content: '# Test',
  exercises: [
    { id: 1, title: 'Exercise 1', description: 'Test', starterCode: '', solution: '', expectedOutput: [], hints: [] },
    { id: 2, title: 'Exercise 2', description: 'Test', starterCode: '', solution: '', expectedOutput: [], hints: [] },
  ],
  buildNote: { title: 'Test', explanation: 'Test', relatedFiles: [] },
  quiz: [{ question: 'Test?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 }],
});

describe('useProgress', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with empty progress when localStorage is empty', () => {
      const { result } = renderHook(() => useProgress());

      expect(result.current.progress).toEqual({ lessons: {} });
    });

    it('should load existing progress from localStorage', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: true,
            exercisesCompleted: [1, 2],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      expect(result.current.progress).toEqual(existingProgress);
    });

    it('should reset to empty progress when localStorage contains corrupted data', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json {{{');

      const { result } = renderHook(() => useProgress());

      expect(result.current.progress).toEqual({ lessons: {} });
    });

    it('should reset to empty progress when localStorage contains invalid structure', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: 'structure' }));

      const { result } = renderHook(() => useProgress());

      expect(result.current.progress).toEqual({ lessons: {} });
    });
  });

  describe('markQuizComplete', () => {
    it('should mark quiz as complete for a lesson', () => {
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markQuizComplete('variables');
      });

      expect(result.current.progress.lessons['variables']).toEqual({
        lessonSlug: 'variables',
        quizCompleted: true,
        exercisesCompleted: [],
      });
    });

    it('should preserve existing exercises when marking quiz complete', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: false,
            exercisesCompleted: [1, 2],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markQuizComplete('variables');
      });

      expect(result.current.progress.lessons['variables']).toEqual({
        lessonSlug: 'variables',
        quizCompleted: true,
        exercisesCompleted: [1, 2],
      });
    });

    it('should not change state if quiz is already complete', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: true,
            exercisesCompleted: [],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());
      const initialProgress = result.current.progress;

      act(() => {
        result.current.markQuizComplete('variables');
      });

      // Should be same reference since no change needed
      expect(result.current.progress.lessons['variables'].quizCompleted).toBe(true);
    });
  });

  describe('markExerciseComplete', () => {
    it('should add exercise to completed list', () => {
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markExerciseComplete('variables', 1);
      });

      expect(result.current.progress.lessons['variables']).toEqual({
        lessonSlug: 'variables',
        quizCompleted: false,
        exercisesCompleted: [1],
      });
    });

    it('should add multiple exercises', () => {
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markExerciseComplete('variables', 1);
      });
      act(() => {
        result.current.markExerciseComplete('variables', 2);
      });

      expect(result.current.progress.lessons['variables'].exercisesCompleted).toEqual([1, 2]);
    });

    it('should not add duplicate exercise IDs', () => {
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markExerciseComplete('variables', 1);
      });
      act(() => {
        result.current.markExerciseComplete('variables', 1);
      });

      expect(result.current.progress.lessons['variables'].exercisesCompleted).toEqual([1]);
    });

    it('should preserve quiz completion when adding exercise', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: true,
            exercisesCompleted: [],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markExerciseComplete('variables', 1);
      });

      expect(result.current.progress.lessons['variables']).toEqual({
        lessonSlug: 'variables',
        quizCompleted: true,
        exercisesCompleted: [1],
      });
    });
  });

  describe('isLessonComplete', () => {
    it('should return false when lesson has no progress', () => {
      const { result } = renderHook(() => useProgress());

      expect(result.current.isLessonComplete('variables', 2)).toBe(false);
    });

    it('should return false when only quiz is completed', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: true,
            exercisesCompleted: [],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      expect(result.current.isLessonComplete('variables', 2)).toBe(false);
    });

    it('should return false when only exercises are completed', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: false,
            exercisesCompleted: [1, 2],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      expect(result.current.isLessonComplete('variables', 2)).toBe(false);
    });

    it('should return false when not all exercises are completed', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: true,
            exercisesCompleted: [1],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      expect(result.current.isLessonComplete('variables', 2)).toBe(false);
    });

    it('should return true when quiz and all exercises are completed', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: true,
            exercisesCompleted: [1, 2],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      expect(result.current.isLessonComplete('variables', 2)).toBe(true);
    });

    it('should return true when more exercises completed than required', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: true,
            exercisesCompleted: [1, 2, 3],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      expect(result.current.isLessonComplete('variables', 2)).toBe(true);
    });

    it('should return true when lesson has zero exercises and quiz is completed', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'variables': {
            lessonSlug: 'variables',
            quizCompleted: true,
            exercisesCompleted: [],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      expect(result.current.isLessonComplete('variables', 0)).toBe(true);
    });
  });

  describe('getGroupProgress', () => {
    it('should return 0/0 for empty lessons array', () => {
      const { result } = renderHook(() => useProgress());

      const progress = result.current.getGroupProgress('beginner', []);

      expect(progress).toEqual({ completed: 0, total: 0 });
    });

    it('should return correct total with no completed lessons', () => {
      const { result } = renderHook(() => useProgress());
      const lessons = [
        createMockLesson('lesson-1', 'beginner'),
        createMockLesson('lesson-2', 'beginner'),
      ];

      const progress = result.current.getGroupProgress('beginner', lessons);

      expect(progress).toEqual({ completed: 0, total: 2 });
    });

    it('should count only lessons in the specified difficulty', () => {
      const { result } = renderHook(() => useProgress());
      const lessons = [
        createMockLesson('beginner-1', 'beginner'),
        createMockLesson('intermediate-1', 'intermediate'),
        createMockLesson('beginner-2', 'beginner'),
      ];

      const progress = result.current.getGroupProgress('beginner', lessons);

      expect(progress).toEqual({ completed: 0, total: 2 });
    });

    it('should count completed lessons correctly', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'lesson-1': {
            lessonSlug: 'lesson-1',
            quizCompleted: true,
            exercisesCompleted: [1, 2],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());
      const lessons = [
        createMockLesson('lesson-1', 'beginner'),
        createMockLesson('lesson-2', 'beginner'),
      ];

      const progress = result.current.getGroupProgress('beginner', lessons);

      expect(progress).toEqual({ completed: 1, total: 2 });
    });

    it('should count multiple completed lessons', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'lesson-1': {
            lessonSlug: 'lesson-1',
            quizCompleted: true,
            exercisesCompleted: [1, 2],
          },
          'lesson-2': {
            lessonSlug: 'lesson-2',
            quizCompleted: true,
            exercisesCompleted: [1, 2],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());
      const lessons = [
        createMockLesson('lesson-1', 'beginner'),
        createMockLesson('lesson-2', 'beginner'),
        createMockLesson('lesson-3', 'beginner'),
      ];

      const progress = result.current.getGroupProgress('beginner', lessons);

      expect(progress).toEqual({ completed: 2, total: 3 });
    });

    it('should not count partially completed lessons', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'lesson-1': {
            lessonSlug: 'lesson-1',
            quizCompleted: true,
            exercisesCompleted: [1], // Only 1 of 2 exercises
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());
      const lessons = [createMockLesson('lesson-1', 'beginner')];

      const progress = result.current.getGroupProgress('beginner', lessons);

      expect(progress).toEqual({ completed: 0, total: 1 });
    });
  });

  describe('resetProgress', () => {
    it('should clear all progress', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'lesson-1': {
            lessonSlug: 'lesson-1',
            quizCompleted: true,
            exercisesCompleted: [1, 2],
          },
          'lesson-2': {
            lessonSlug: 'lesson-2',
            quizCompleted: true,
            exercisesCompleted: [1],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      // Verify progress loaded
      expect(Object.keys(result.current.progress.lessons).length).toBe(2);

      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.progress).toEqual({ lessons: {} });
    });

    it('should clear localStorage when resetting', () => {
      const existingProgress: ProgressState = {
        lessons: {
          'lesson-1': {
            lessonSlug: 'lesson-1',
            quizCompleted: true,
            exercisesCompleted: [1, 2],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));

      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.resetProgress();
      });

      // Verify localStorage is cleared
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBe(JSON.stringify({ lessons: {} }));
    });
  });

  describe('localStorage persistence', () => {
    it('should persist progress changes to localStorage', () => {
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markQuizComplete('variables');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(stored.lessons['variables'].quizCompleted).toBe(true);
    });

    it('should persist exercise completion to localStorage', () => {
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markExerciseComplete('variables', 1);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(stored.lessons['variables'].exercisesCompleted).toContain(1);
    });

    it('should persist multiple changes to localStorage', () => {
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markQuizComplete('lesson-1');
      });
      act(() => {
        result.current.markExerciseComplete('lesson-1', 1);
      });
      act(() => {
        result.current.markExerciseComplete('lesson-2', 1);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as ProgressState;
      expect(stored.lessons['lesson-1'].quizCompleted).toBe(true);
      expect(stored.lessons['lesson-1'].exercisesCompleted).toContain(1);
      expect(stored.lessons['lesson-2'].exercisesCompleted).toContain(1);
    });
  });

  describe('error handling', () => {
    it('should handle localStorage.getItem throwing error', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('Private browsing');
      });

      const { result } = renderHook(() => useProgress());

      expect(result.current.progress).toEqual({ lessons: {} });

      Storage.prototype.getItem = originalGetItem;
    });

    it('should handle localStorage.setItem throwing error gracefully', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useProgress());

      // Should not throw when marking progress
      act(() => {
        result.current.markQuizComplete('variables');
      });

      // State should still update even if persistence fails
      expect(result.current.progress.lessons['variables'].quizCompleted).toBe(true);

      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle localStorage.removeItem throwing error gracefully', () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error('Access denied');
      });

      const { result } = renderHook(() => useProgress());

      // resetProgress should still work (state-wise) even if localStorage fails
      act(() => {
        result.current.markQuizComplete('test');
      });
      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.progress).toEqual({ lessons: {} });

      Storage.prototype.removeItem = originalRemoveItem;
    });
  });
});
