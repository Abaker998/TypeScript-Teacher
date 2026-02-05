import Fuse from 'fuse.js';
import { Lesson, Language } from '@/types/lesson';
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

// Cache per language
const fuseInstances: Map<Language, Fuse<SearchableItem>> = new Map();
const searchableItemsCache: Map<Language, SearchableItem[]> = new Map();
const lessonMaps: Map<Language, Map<string, Lesson>> = new Map();

/**
 * Initialize the search index for a specific language
 */
function initializeSearch(language: Language): void {
  const lessons = getAllLessons(language);

  const searchableItems = lessons.map((lesson) => ({
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    content: lesson.content,
    exerciseDescriptions: lesson.exercises.map(e => `${e.title} ${e.description}`).join(' '),
    difficulty: lesson.difficulty,
  }));

  const lessonMap = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

  const fuseInstance = new Fuse(searchableItems, {
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

  fuseInstances.set(language, fuseInstance);
  searchableItemsCache.set(language, searchableItems);
  lessonMaps.set(language, lessonMap);
}

/**
 * Search for lessons matching the query in a specific language
 */
export function searchLessons(query: string, language: Language = 'typescript', limit: number = 10): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  if (!fuseInstances.has(language)) {
    initializeSearch(language);
  }

  const fuseInstance = fuseInstances.get(language)!;
  const lessonMap = lessonMaps.get(language)!;

  const results = fuseInstance.search(query, { limit });

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
 * Get search suggestions based on language
 */
export function getSearchSuggestions(language: Language = 'typescript'): string[] {
  if (language === 'csharp') {
    return [
      'variables',
      'methods',
      'collections',
      'interfaces',
      'generics',
      'async await',
      'LINQ',
      'classes',
      'reflection',
      'error handling',
    ];
  }

  // TypeScript suggestions
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
 * Reset the search index for a language (useful if lessons change)
 */
export function resetSearchIndex(language?: Language): void {
  if (language) {
    fuseInstances.delete(language);
    searchableItemsCache.delete(language);
    lessonMaps.get(language)?.clear();
    lessonMaps.delete(language);
  } else {
    // Reset all
    fuseInstances.clear();
    searchableItemsCache.clear();
    lessonMaps.forEach(map => map.clear());
    lessonMaps.clear();
  }
}
