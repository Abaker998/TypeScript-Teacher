import Fuse from 'fuse.js';
import { Lesson } from '@/types/lesson';
import { getAllLessons } from '@/lessons';

export interface SearchResult {
  lesson: Lesson;
  matchedField: 'title' | 'description' | 'content' | 'exercise';
  matchedText: string;
  score: number;
}

interface SearchableItem {
  slug: string;
  title: string;
  description: string;
  content: string;
  exerciseDescriptions: string;
  difficulty: string;
}

let fuseInstance: Fuse<SearchableItem> | null = null;
let searchableItems: SearchableItem[] = [];
let lessonMap: Map<string, Lesson> = new Map();

/**
 * Initialize the search index with all lessons
 */
function initializeSearch(): void {
  const lessons = getAllLessons();

  searchableItems = lessons.map((lesson) => ({
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    content: lesson.content,
    exerciseDescriptions: lesson.exercises.map(e => `${e.title} ${e.description}`).join(' '),
    difficulty: lesson.difficulty,
  }));

  lessonMap = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

  fuseInstance = new Fuse(searchableItems, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'description', weight: 2 },
      { name: 'content', weight: 1 },
      { name: 'exerciseDescriptions', weight: 1.5 },
    ],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });
}

/**
 * Search for lessons matching the query
 */
export function searchLessons(query: string, limit: number = 10): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  if (!fuseInstance) {
    initializeSearch();
  }

  const results = fuseInstance!.search(query, { limit });

  return results.map((result) => {
    const lesson = lessonMap.get(result.item.slug)!;
    const match = result.matches?.[0];

    let matchedField: SearchResult['matchedField'] = 'title';
    let matchedText = lesson.title;

    if (match) {
      switch (match.key) {
        case 'title':
          matchedField = 'title';
          matchedText = lesson.title;
          break;
        case 'description':
          matchedField = 'description';
          matchedText = lesson.description;
          break;
        case 'content':
          matchedField = 'content';
          matchedText = extractMatchContext(lesson.content, match.value || '', query);
          break;
        case 'exerciseDescriptions':
          matchedField = 'exercise';
          matchedText = extractMatchContext(result.item.exerciseDescriptions, match.value || '', query);
          break;
      }
    }

    return {
      lesson,
      matchedField,
      matchedText,
      score: result.score || 0,
    };
  });
}

/**
 * Extract a snippet of text around the matched query
 */
function extractMatchContext(text: string, _matchedValue: string, query: string): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    // If exact match not found, just return first 100 chars
    return text.slice(0, 100).trim() + (text.length > 100 ? '...' : '');
  }

  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + query.length + 60);

  let snippet = text.slice(start, end).trim();

  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < text.length) {
    snippet = snippet + '...';
  }

  return snippet;
}

/**
 * Get search suggestions based on popular topics
 */
export function getSearchSuggestions(): string[] {
  return [
    'variables',
    'functions',
    'arrays',
    'interfaces',
    'generics',
    'async await',
    'types',
    'classes',
    'map filter',
    'error handling',
  ];
}

/**
 * Reset the search index (useful if lessons change)
 */
export function resetSearchIndex(): void {
  fuseInstance = null;
  searchableItems = [];
  lessonMap.clear();
}
