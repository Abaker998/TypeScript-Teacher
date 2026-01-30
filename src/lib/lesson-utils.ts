import { Difficulty } from '@/types/lesson';

const starMapping: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

/**
 * Returns the star count (1-3) based on lesson difficulty.
 * beginner = 1 star, intermediate = 2 stars, advanced = 3 stars
 */
export function getStarRating(difficulty: Difficulty): number {
  return starMapping[difficulty];
}

/**
 * Returns a string of star emoji for display.
 * E.g., getStarDisplay("intermediate") returns "⭐⭐"
 */
export function getStarDisplay(difficulty: Difficulty): string {
  const count = getStarRating(difficulty);
  return Array(count).fill('⭐').join('');
}
