/**
 * Tests for the lesson registry and helper functions.
 *
 * The lesson registry provides:
 * - getAllLessons() - returns all 25 lessons in order
 * - getLessonBySlug() - retrieves a lesson by its URL slug
 * - getLessonsByDifficulty() - returns lessons grouped and sorted by difficulty
 * - getAdjacentLessons() - returns previous/next lessons for navigation
 * - getLessonOrder() - returns the lesson order number (1-25)
 */

import {
  getAllLessons,
  getLessonBySlug,
  getLessonsByDifficulty,
  getAdjacentLessons,
  getLessonOrder,
} from './index';

// Total lesson count in the curriculum
const TOTAL_LESSONS = 25;
// Beginner lessons (1-8)
const BEGINNER_COUNT = 8;
// Intermediate lessons (9-18)
const INTERMEDIATE_COUNT = 10;
// Advanced lessons (19-25)
const ADVANCED_COUNT = 7;

describe('Lesson Registry', () => {
  describe('getAllLessons()', () => {
    it('should return all lessons', () => {
      const lessons = getAllLessons();
      expect(lessons).toHaveLength(TOTAL_LESSONS);
    });

    it('should return lessons in correct order (1-N)', () => {
      const lessons = getAllLessons();
      for (let i = 0; i < lessons.length; i++) {
        expect(lessons[i].order).toBe(i + 1);
      }
    });

    it('should return lessons with correct difficulty distribution', () => {
      const lessons = getAllLessons();
      const beginnerLessons = lessons.filter((l) => l.difficulty === 'beginner');
      const intermediateLessons = lessons.filter((l) => l.difficulty === 'intermediate');
      const advancedLessons = lessons.filter((l) => l.difficulty === 'advanced');

      expect(beginnerLessons).toHaveLength(BEGINNER_COUNT);
      expect(intermediateLessons).toHaveLength(INTERMEDIATE_COUNT);
      expect(advancedLessons).toHaveLength(ADVANCED_COUNT);
    });

    it('should start with beginner lessons', () => {
      const lessons = getAllLessons();
      expect(lessons[0].slug).toBe('variables-and-types');
      expect(lessons[0].difficulty).toBe('beginner');
    });

    it('should return all lessons with required properties', () => {
      const lessons = getAllLessons();
      lessons.forEach((lesson) => {
        expect(lesson).toHaveProperty('slug');
        expect(lesson).toHaveProperty('title');
        expect(lesson).toHaveProperty('description');
        expect(lesson).toHaveProperty('difficulty');
        expect(lesson).toHaveProperty('order');
        expect(lesson).toHaveProperty('content');
        expect(lesson).toHaveProperty('exercises');
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
        expect(lesson).toHaveProperty('buildNote');
      });
    });

    it('should have unique slugs for all lessons', () => {
      const lessons = getAllLessons();
      const slugs = lessons.map((l) => l.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(TOTAL_LESSONS);
    });

    it('should have non-empty content for all lessons', () => {
      const lessons = getAllLessons();
      lessons.forEach((lesson) => {
        expect(lesson.content).toBeTruthy();
        expect(lesson.content.length).toBeGreaterThan(0);
      });
    });

    it('should return the same array reference each time (memoization not required)', () => {
      const first = getAllLessons();
      const second = getAllLessons();
      // Should be separate arrays but with same content
      expect(first).toEqual(second);
    });
  });

  describe('getLessonBySlug()', () => {
    it('should retrieve a lesson by valid slug', () => {
      const lesson = getLessonBySlug('variables-and-types');
      expect(lesson).toBeDefined();
      expect(lesson?.slug).toBe('variables-and-types');
      expect(lesson?.title).toBe('Variables & Types');
    });

    it('should retrieve each lesson by its slug', () => {
      const allLessons = getAllLessons();
      allLessons.forEach((lesson) => {
        const retrieved = getLessonBySlug(lesson.slug);
        expect(retrieved).toBeDefined();
        expect(retrieved?.slug).toBe(lesson.slug);
      });
    });

    it('should return undefined for non-existent slug', () => {
      const lesson = getLessonBySlug('non-existent-lesson');
      expect(lesson).toBeUndefined();
    });

    it('should return undefined for empty slug', () => {
      const lesson = getLessonBySlug('');
      expect(lesson).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const lesson = getLessonBySlug('Variables-And-Types');
      expect(lesson).toBeUndefined();
    });

    it('should return correct lesson objects with all properties', () => {
      const lesson = getLessonBySlug('functions');
      expect(lesson).toHaveProperty('slug', 'functions');
      expect(lesson).toHaveProperty('title');
      expect(lesson).toHaveProperty('description');
      expect(lesson).toHaveProperty('difficulty');
      expect(lesson).toHaveProperty('order');
      expect(lesson).toHaveProperty('content');
      expect(lesson).toHaveProperty('exercises');
      expect(lesson!.exercises.length).toBeGreaterThanOrEqual(2);
      expect(lesson).toHaveProperty('buildNote');
    });

    it('should handle special characters gracefully', () => {
      const lesson = getLessonBySlug('variables-and-types!@#');
      expect(lesson).toBeUndefined();
    });

    it('should not retrieve lesson with partial slug match', () => {
      const lesson = getLessonBySlug('variables');
      expect(lesson).toBeUndefined();
    });
  });

  describe('getLessonsByDifficulty()', () => {
    it('should return 3 difficulty groups', () => {
      const groups = getLessonsByDifficulty();
      expect(groups).toHaveLength(3);
    });

    it('should return groups in correct order (beginner, intermediate, advanced)', () => {
      const groups = getLessonsByDifficulty();
      expect(groups[0].difficulty).toBe('beginner');
      expect(groups[1].difficulty).toBe('intermediate');
      expect(groups[2].difficulty).toBe('advanced');
    });

    it('should have correct labels for each group', () => {
      const groups = getLessonsByDifficulty();
      expect(groups[0].label).toBe('Beginner');
      expect(groups[1].label).toBe('Intermediate');
      expect(groups[2].label).toBe('Advanced');
    });

    it('should have correct lesson counts in each difficulty group', () => {
      const groups = getLessonsByDifficulty();
      expect(groups[0].lessons).toHaveLength(BEGINNER_COUNT);
      expect(groups[1].lessons).toHaveLength(INTERMEDIATE_COUNT);
      expect(groups[2].lessons).toHaveLength(ADVANCED_COUNT);
    });

    it('should sort lessons by order within each group', () => {
      const groups = getLessonsByDifficulty();
      groups.forEach((group) => {
        for (let i = 0; i < group.lessons.length - 1; i++) {
          expect(group.lessons[i].order).toBeLessThan(group.lessons[i + 1].order);
        }
      });
    });

    it('should group beginner lessons correctly', () => {
      const groups = getLessonsByDifficulty();
      const beginnerGroup = groups[0];
      expect(beginnerGroup.lessons[0].slug).toBe('variables-and-types');
      beginnerGroup.lessons.forEach((lesson) => {
        expect(lesson.difficulty).toBe('beginner');
      });
    });

    it('should group intermediate lessons correctly', () => {
      const groups = getLessonsByDifficulty();
      const intermediateGroup = groups[1];
      expect(intermediateGroup.lessons[0].slug).toBe('interfaces');
      intermediateGroup.lessons.forEach((lesson) => {
        expect(lesson.difficulty).toBe('intermediate');
      });
    });

    it('should group advanced lessons correctly', () => {
      const groups = getLessonsByDifficulty();
      const advancedGroup = groups[2];
      expect(advancedGroup.lessons[0].slug).toBe('mapped-types');
      advancedGroup.lessons.forEach((lesson) => {
        expect(lesson.difficulty).toBe('advanced');
      });
    });

    it('should return lesson groups with all properties', () => {
      const groups = getLessonsByDifficulty();
      groups.forEach((group) => {
        expect(group).toHaveProperty('difficulty');
        expect(group).toHaveProperty('label');
        expect(group).toHaveProperty('lessons');
        expect(Array.isArray(group.lessons)).toBe(true);
      });
    });

    it('should include all lessons across all groups', () => {
      const groups = getLessonsByDifficulty();
      const totalLessons = groups.reduce((sum, group) => sum + group.lessons.length, 0);
      expect(totalLessons).toBe(TOTAL_LESSONS);
    });
  });

  describe('getAdjacentLessons()', () => {
    it('should return first lesson as null previous when at start', () => {
      const { previous, next } = getAdjacentLessons('variables-and-types');
      expect(previous).toBeNull();
      expect(next).toBeDefined();
      expect(next?.slug).toBe('type-inference');
    });

    it('should return last lesson as null next when at end', () => {
      const { previous, next } = getAdjacentLessons('advanced-patterns');
      expect(previous).toBeDefined();
      expect(previous?.slug).toBe('decorators-and-patterns');
      expect(next).toBeNull();
    });

    it('should return both previous and next for middle lessons', () => {
      const { previous, next } = getAdjacentLessons('type-inference');
      expect(previous).toBeDefined();
      expect(previous?.slug).toBe('variables-and-types');
      expect(next).toBeDefined();
      expect(next?.slug).toBe('functions');
    });

    it('should handle intermediate lesson (interfaces)', () => {
      const { previous, next } = getAdjacentLessons('interfaces');
      expect(previous?.slug).toBe('developer-tooling');
      expect(next?.slug).toBe('type-aliases');
    });

    it('should return null for both when slug not found', () => {
      const { previous, next } = getAdjacentLessons('non-existent');
      expect(previous).toBeNull();
      expect(next).toBeNull();
    });

    it('should return null for empty slug', () => {
      const { previous, next } = getAdjacentLessons('');
      expect(previous).toBeNull();
      expect(next).toBeNull();
    });

    it('should return correct adjacent lessons for all middle lessons', () => {
      const allLessons = getAllLessons();
      for (let i = 1; i < allLessons.length - 1; i++) {
        const { previous, next } = getAdjacentLessons(allLessons[i].slug);
        expect(previous?.slug).toBe(allLessons[i - 1].slug);
        expect(next?.slug).toBe(allLessons[i + 1].slug);
      }
    });

    it('should preserve lesson data in adjacent lessons', () => {
      const { next } = getAdjacentLessons('variables-and-types');
      expect(next).toHaveProperty('slug');
      expect(next).toHaveProperty('title');
      expect(next).toHaveProperty('content');
    });
  });

  describe('getLessonOrder()', () => {
    it('should return order for valid slug', () => {
      const order = getLessonOrder('variables-and-types');
      expect(order).toBe(1);
    });

    it('should return correct orders for all lessons', () => {
      const lessons = getAllLessons();
      lessons.forEach((lesson) => {
        const order = getLessonOrder(lesson.slug);
        expect(order).toBe(lesson.order);
      });
    });

    it('should return undefined for non-existent slug', () => {
      const order = getLessonOrder('non-existent');
      expect(order).toBeUndefined();
    });

    it('should return orders 1-N for the lessons', () => {
      const lessons = getAllLessons();
      lessons.forEach((lesson, index) => {
        const order = getLessonOrder(lesson.slug);
        expect(order).toBe(index + 1);
      });
    });

    it('should return the same order as the lesson object order property', () => {
      const lesson = getLessonBySlug('interfaces');
      const order = getLessonOrder('interfaces');
      expect(order).toBe(lesson?.order);
    });

    it('should be useful for progress tracking', () => {
      const order = getLessonOrder('advanced-patterns');
      expect(order).toBe(TOTAL_LESSONS);
      const progress = (order! / TOTAL_LESSONS) * 100;
      expect(progress).toBe(100);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency across all functions', () => {
      const allLessons = getAllLessons();
      const grouped = getLessonsByDifficulty();

      // Count total lessons in grouped view
      const groupedCount = grouped.reduce((sum, g) => sum + g.lessons.length, 0);
      expect(groupedCount).toBe(allLessons.length);

      // Verify each lesson can be retrieved by slug
      allLessons.forEach((lesson) => {
        const retrieved = getLessonBySlug(lesson.slug);
        expect(retrieved).toEqual(lesson);
      });
    });

    it('should allow navigation through all lessons using getAdjacentLessons', () => {
      let current = getAllLessons()[0];
      const visited = [current.slug];

      while (true) {
        const { next } = getAdjacentLessons(current.slug);
        if (!next) break;
        visited.push(next.slug);
        current = next;
      }

      expect(visited).toHaveLength(TOTAL_LESSONS);
      expect(visited[0]).toBe('variables-and-types');
      expect(visited[visited.length - 1]).toBe('advanced-patterns');
    });

    it('should work correctly for lesson page navigation flow', () => {
      // Simulate user navigating to a lesson page
      const currentSlug = 'arrays-and-objects';
      const lesson = getLessonBySlug(currentSlug);
      expect(lesson).toBeDefined();

      const order = getLessonOrder(currentSlug);
      expect(order).toBe(4);

      const { previous, next } = getAdjacentLessons(currentSlug);
      expect(previous?.slug).toBe('functions');
      expect(next?.slug).toBe('control-flow');
    });

    it('should work correctly for sidebar lesson grouping', () => {
      const groups = getLessonsByDifficulty();
      const sidebar = groups.map((group) => ({
        difficulty: group.difficulty,
        label: group.label,
        lessonCount: group.lessons.length,
        lessons: group.lessons.map((l) => ({ slug: l.slug, title: l.title })),
      }));

      expect(sidebar).toHaveLength(3);
      expect(sidebar[0].lessonCount).toBe(BEGINNER_COUNT);
      expect(sidebar[0].lessons[0].slug).toBe('variables-and-types');
    });
  });
});
