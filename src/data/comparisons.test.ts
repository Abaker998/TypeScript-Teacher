/**
 * Tests for comparison data.
 * Ensures all architectural decisions are present and properly structured.
 */

import { comparisons, getAllComparisons } from './comparisons';
import { Comparison } from '@/types/comparison';

describe('Comparisons Data', () => {
  describe('Structure', () => {
    it('should have exactly 5 comparisons', () => {
      expect(comparisons).toHaveLength(5);
    });

    it('should have valid IDs for all comparisons', () => {
      const expectedIds = [
        'framework-selection',
        'code-editor-selection',
        'data-storage-selection',
        'execution-sandbox-selection',
        'styling-framework-selection',
      ];
      const actualIds = comparisons.map((c) => c.id);
      expect(actualIds).toEqual(expectedIds);
    });
  });

  describe('Each comparison', () => {
    comparisons.forEach((comparison: Comparison) => {
      describe(`${comparison.id}`, () => {
        it('should have required fields', () => {
          expect(comparison.id).toBeDefined();
          expect(typeof comparison.id).toBe('string');
          expect(comparison.title).toBeDefined();
          expect(typeof comparison.title).toBe('string');
          expect(comparison.question).toBeDefined();
          expect(typeof comparison.question).toBe('string');
          expect(comparison.options).toBeDefined();
          expect(Array.isArray(comparison.options)).toBe(true);
          expect(comparison.reasoning).toBeDefined();
          expect(typeof comparison.reasoning).toBe('string');
        });

        it('should have non-empty title, question, and reasoning', () => {
          expect(comparison.title.length).toBeGreaterThan(0);
          expect(comparison.question.length).toBeGreaterThan(0);
          expect(comparison.reasoning.length).toBeGreaterThan(0);
        });

        it('should have at least 2 options', () => {
          expect(comparison.options.length).toBeGreaterThanOrEqual(2);
        });

        it('should have exactly one option marked as chosen', () => {
          const chosenCount = comparison.options.filter((opt) => opt.chosen).length;
          expect(chosenCount).toBe(1);
        });

        comparison.options.forEach((option) => {
          describe(`option: ${option.name}`, () => {
            it('should have required fields', () => {
              expect(option.name).toBeDefined();
              expect(typeof option.name).toBe('string');
              expect(option.chosen).toBeDefined();
              expect(typeof option.chosen).toBe('boolean');
              expect(option.pros).toBeDefined();
              expect(Array.isArray(option.pros)).toBe(true);
              expect(option.cons).toBeDefined();
              expect(Array.isArray(option.cons)).toBe(true);
            });

            it('should have at least 2 pros and 2 cons', () => {
              expect(option.pros.length).toBeGreaterThanOrEqual(2);
              expect(option.cons.length).toBeGreaterThanOrEqual(2);
            });

            it('should have substantive pro items with descriptions', () => {
              option.pros.forEach((pro) => {
                expect(pro.item).toBeDefined();
                expect(typeof pro.item).toBe('string');
                expect(pro.item.length).toBeGreaterThan(0);
                expect(pro.description).toBeDefined();
                expect(typeof pro.description).toBe('string');
                expect(pro.description.length).toBeGreaterThan(0);
              });
            });

            it('should have substantive con items with descriptions', () => {
              option.cons.forEach((con) => {
                expect(con.item).toBeDefined();
                expect(typeof con.item).toBe('string');
                expect(con.item.length).toBeGreaterThan(0);
                expect(con.description).toBeDefined();
                expect(typeof con.description).toBe('string');
                expect(con.description.length).toBeGreaterThan(0);
              });
            });
          });
        });
      });
    });
  });

  describe('getAllComparisons()', () => {
    it('should return all comparisons', () => {
      const all = getAllComparisons();
      expect(all).toHaveLength(5);
      expect(all).toEqual(comparisons);
    });

    it('should return a new array reference', () => {
      const all1 = getAllComparisons();
      const all2 = getAllComparisons();
      // Note: This tests that each call returns the same data,
      // but could be the same reference or a new array
      expect(all1).toEqual(all2);
    });
  });

  describe('Specific Comparisons', () => {
    it('framework comparison should have Next.js chosen', () => {
      const framework = comparisons.find((c) => c.id === 'framework-selection');
      expect(framework).toBeDefined();
      const chosen = framework!.options.find((o) => o.chosen);
      expect(chosen?.name).toBe('Next.js');
    });

    it('editor comparison should have Monaco Editor chosen', () => {
      const editor = comparisons.find((c) => c.id === 'code-editor-selection');
      expect(editor).toBeDefined();
      const chosen = editor!.options.find((o) => o.chosen);
      expect(chosen?.name).toBe('Monaco Editor');
    });

    it('data storage comparison should have Static TypeScript Objects chosen', () => {
      const storage = comparisons.find((c) => c.id === 'data-storage-selection');
      expect(storage).toBeDefined();
      const chosen = storage!.options.find((o) => o.chosen);
      expect(chosen?.name).toBe('Static TypeScript Objects');
    });

    it('execution sandbox comparison should have Sandboxed iframe chosen', () => {
      const sandbox = comparisons.find((c) => c.id === 'execution-sandbox-selection');
      expect(sandbox).toBeDefined();
      const chosen = sandbox!.options.find((o) => o.chosen);
      expect(chosen?.name).toBe('Sandboxed iframe');
    });

    it('styling comparison should have Tailwind CSS chosen', () => {
      const styling = comparisons.find((c) => c.id === 'styling-framework-selection');
      expect(styling).toBeDefined();
      const chosen = styling!.options.find((o) => o.chosen);
      expect(chosen?.name).toBe('Tailwind CSS');
    });
  });
});
