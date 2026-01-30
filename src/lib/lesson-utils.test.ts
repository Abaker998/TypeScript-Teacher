import { getStarRating, getStarDisplay } from './lesson-utils';
import type { Difficulty } from '@/types/lesson';

describe('getStarRating', () => {
  it('returns 1 for beginner difficulty', () => {
    expect(getStarRating('beginner')).toBe(1);
  });

  it('returns 2 for intermediate difficulty', () => {
    expect(getStarRating('intermediate')).toBe(2);
  });

  it('returns 3 for advanced difficulty', () => {
    expect(getStarRating('advanced')).toBe(3);
  });

  it('returns correct values for all difficulty levels', () => {
    const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
    const expectedRatings = [1, 2, 3];

    difficulties.forEach((difficulty, index) => {
      expect(getStarRating(difficulty)).toBe(expectedRatings[index]);
    });
  });
});

describe('getStarDisplay', () => {
  it('returns single star emoji for beginner', () => {
    expect(getStarDisplay('beginner')).toBe('⭐');
  });

  it('returns two star emojis for intermediate', () => {
    expect(getStarDisplay('intermediate')).toBe('⭐⭐');
  });

  it('returns three star emojis for advanced', () => {
    expect(getStarDisplay('advanced')).toBe('⭐⭐⭐');
  });

  it('returns correct emoji strings for all difficulty levels', () => {
    const testCases: Array<[Difficulty, string]> = [
      ['beginner', '⭐'],
      ['intermediate', '⭐⭐'],
      ['advanced', '⭐⭐⭐'],
    ];

    testCases.forEach(([difficulty, expected]) => {
      expect(getStarDisplay(difficulty)).toBe(expected);
    });
  });

  it('returns strings with correct number of emojis', () => {
    expect(getStarDisplay('beginner').split('⭐').length - 1).toBe(1);
    expect(getStarDisplay('intermediate').split('⭐').length - 1).toBe(2);
    expect(getStarDisplay('advanced').split('⭐').length - 1).toBe(3);
  });

  it('returns strings without separators between emojis', () => {
    expect(getStarDisplay('beginner')).not.toContain(' ');
    expect(getStarDisplay('intermediate')).not.toContain(' ');
    expect(getStarDisplay('advanced')).not.toContain(' ');
  });

  it('uses exactly the star emoji character', () => {
    const star = '⭐';
    expect(getStarDisplay('beginner')).toBe(star);
    expect(getStarDisplay('intermediate')).toBe(star + star);
    expect(getStarDisplay('advanced')).toBe(star + star + star);
  });
});
