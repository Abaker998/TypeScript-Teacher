/**
 * Static comparison data for architectural decisions made in the app.
 * These comparisons are displayed on the "Why We Built It This Way" page
 * to teach learners about real-world architecture trade-offs.
 */

import { Comparison } from '@/types/comparison';

export const comparisons: Comparison[] = [
  {
    id: 'framework-selection',
    title: 'Framework: Next.js vs Vite vs Create React App',
    question: 'What frontend framework should we use?',
    options: [
      {
        name: 'Next.js',
        chosen: true,
        pros: [
          { item: 'File-based routing', description: 'Built-in file-based routing with /app directory' },
          { item: 'Built-in TypeScript', description: 'Full TypeScript support out of the box' },
          { item: 'Server/Client components', description: 'Hybrid rendering with Server Components' },
          { item: 'SSR capability', description: 'Server-side rendering for better SEO' },
        ],
        cons: [
          { item: 'Heavier bundle', description: 'Larger initial bundle size than Vite' },
          { item: 'More opinionated', description: 'Fewer architectural choices' },
        ],
      },
      {
        name: 'Vite',
        chosen: false,
        pros: [
          { item: 'Fast dev server', description: 'Instant HMR and faster builds' },
          { item: 'Minimal framework', description: 'Lightweight and flexible' },
          { item: 'Low overhead', description: 'Less build complexity' },
        ],
        cons: [
          { item: 'No routing', description: 'Need to add routing library separately' },
          { item: 'Fewer conventions', description: 'More decisions to make' },
          { item: 'Less TypeScript integration', description: 'Requires more setup' },
        ],
      },
      {
        name: 'Create React App',
        chosen: false,
        pros: [
          { item: 'Beginner-friendly', description: 'Simple setup for new developers' },
          { item: 'Well-documented', description: 'Lots of tutorials and guides' },
        ],
        cons: [
          { item: 'Deprecated', description: 'No longer recommended by React team' },
          { item: 'Slow builds', description: 'Uses Webpack with slower compilation' },
          { item: 'Less flexible', description: 'Hard to customize build config' },
        ],
      },
    ],
    reasoning: 'We chose **Next.js** for its file-based routing, built-in TypeScript support, and hybrid Server/Client component architecture. The file-based routing makes it easy to add new lessons as new routes, and the Server Components let us pre-render static lesson data efficiently. While it\'s heavier than Vite, the built-in conventions reduce decision fatigue when teaching.',
  },

  {
    id: 'code-editor-selection',
    title: 'Code Editor: Monaco vs CodeMirror vs textarea',
    question: 'What code editor should we use for the practice exercises?',
    options: [
      {
        name: 'Monaco Editor',
        chosen: true,
        pros: [
          { item: 'Full VS Code engine', description: 'Exact same editor as VS Code' },
          { item: 'TypeScript IntelliSense', description: 'Built-in autocomplete and type checking' },
          { item: 'Real-time error squiggles', description: 'Shows errors as you type' },
          { item: 'Professional experience', description: 'Feels like a real IDE' },
        ],
        cons: [
          { item: 'Large bundle size', description: 'Adds ~5MB to production' },
          { item: 'Complex API', description: 'More configuration required' },
        ],
      },
      {
        name: 'CodeMirror',
        chosen: false,
        pros: [
          { item: 'Lightweight', description: 'Smaller bundle than Monaco' },
          { item: 'Good syntax highlighting', description: 'Nice color themes available' },
          { item: 'Extensible', description: 'Good plugin ecosystem' },
        ],
        cons: [
          { item: 'No TypeScript IntelliSense', description: 'Needs plugins for TS support' },
          { item: 'Limited error detection', description: 'Doesn\'t catch errors in real-time' },
          { item: 'Less familiar to students', description: 'Not what professionals use' },
        ],
      },
      {
        name: 'Plain textarea',
        chosen: false,
        pros: [
          { item: 'Minimal bundle', description: 'No external dependencies' },
          { item: 'Simple to implement', description: 'Just an HTML element' },
        ],
        cons: [
          { item: 'No syntax highlighting', description: 'Code looks plain' },
          { item: 'No error checking', description: 'No real-time feedback' },
          { item: 'Poor UX', description: 'Frustrating for students' },
        ],
      },
    ],
    reasoning: 'We chose **Monaco Editor** because it provides the full VS Code experience with IntelliSense and real-time error detection. Since the app teaches TypeScript, students should experience professional-grade tooling. The bundle size is a trade-off we accept for teaching quality.',
  },

  {
    id: 'data-storage-selection',
    title: 'Data Storage: Static vs Database',
    question: 'How should we store lesson content?',
    options: [
      {
        name: 'Static TypeScript Objects',
        chosen: true,
        pros: [
          { item: 'Type-safe', description: 'Full TypeScript typing of all lesson data' },
          { item: 'Version-controlled', description: 'Lessons are in git alongside code' },
          { item: 'Zero infrastructure', description: 'No database to manage or scale' },
          { item: 'Fast deployments', description: 'Just static files, no schema migrations' },
          { item: 'Easy to understand', description: 'New developers can see all content immediately' },
        ],
        cons: [
          { item: 'Not scalable to thousands of lessons', description: 'Tree will become unwieldy' },
          { item: 'Hard to add metadata', description: 'Every lesson file is duplicated' },
        ],
      },
      {
        name: 'Database (PostgreSQL)',
        chosen: false,
        pros: [
          { item: 'Scalable', description: 'Can handle thousands of lessons' },
          { item: 'Dynamic content', description: 'Can add lessons without code deploy' },
          { item: 'Queryable', description: 'Search and filter lessons' },
        ],
        cons: [
          { item: 'Loses type safety', description: 'Data comes back as untyped JSON' },
          { item: 'Infrastructure overhead', description: 'Need to manage database and backups' },
          { item: 'Deployment complexity', description: 'Schema migrations on every deploy' },
          { item: 'Unnecessary for static content', description: 'Overkill for 9 lessons' },
        ],
      },
    ],
    reasoning: 'We chose **static TypeScript objects** because we\'re building a teaching app with curated lessons, not a content platform. The lessons are part of the app itself—they should be type-safe, version-controlled, and shipped with the code. A database would add complexity without benefits for our use case.',
  },

  {
    id: 'execution-sandbox-selection',
    title: 'Sandbox: iframe vs Web Worker',
    question: 'How should we safely execute student code?',
    options: [
      {
        name: 'Sandboxed iframe',
        chosen: true,
        pros: [
          { item: 'Simple isolation', description: 'iframe sandbox attribute provides DOM isolation' },
          { item: 'Easy console capture', description: 'Can intercept console.log via message passing' },
          { item: 'Better error messages', description: 'Errors are clear and easy to display' },
          { item: 'Familiar browser API', description: 'Works with existing web APIs' },
        ],
        cons: [
          { item: 'Slight overhead', description: 'Cross-frame communication adds latency' },
          { item: 'Separate global scope', description: 'Browser APIs and polyfills must be available in the sandbox' },
        ],
      },
      {
        name: 'Web Worker',
        chosen: false,
        pros: [
          { item: 'True thread isolation', description: 'Runs in separate thread' },
          { item: 'No DOM access possible', description: 'Can\'t touch parent page at all' },
          { item: 'Better performance', description: 'Lighter weight than iframe' },
        ],
        cons: [
          { item: 'No DOM access', description: 'Can\'t demonstrate DOM manipulation' },
          { item: 'Harder console capture', description: 'More complex message handling' },
          { item: 'More complex setup', description: 'Requires worker script files' },
          { item: 'Poor error handling', description: 'Error stack traces are harder to parse' },
        ],
      },
    ],
    reasoning: 'We chose **sandboxed iframe** for its simplicity and good error reporting. The browser\'s sandbox attribute provides sufficient isolation for untrusted code, and message passing makes it easy to capture console output. Web Workers would be overkill for teaching basic TypeScript without DOM interaction.',
  },

  {
    id: 'styling-framework-selection',
    title: 'Styling: Tailwind vs CSS Modules vs Styled Components',
    question: 'What CSS approach should we use?',
    options: [
      {
        name: 'Tailwind CSS',
        chosen: true,
        pros: [
          { item: 'Utility-first', description: 'Fast iteration with pre-built classes' },
          { item: 'Small bundle', description: 'Unused styles are tree-shaken' },
          { item: 'Great Next.js integration', description: 'Built-in support and guides' },
          { item: 'Consistent design', description: 'Enforces design system constraints' },
          { item: 'Easy customization', description: 'Simple config changes affect entire app' },
        ],
        cons: [
          { item: 'Learning curve', description: 'Need to learn class names' },
          { item: 'HTML cluttered', description: 'Long class attribute lists' },
        ],
      },
      {
        name: 'CSS Modules',
        chosen: false,
        pros: [
          { item: 'Scoped styles', description: 'Avoid naming conflicts' },
          { item: 'Familiar syntax', description: 'Write regular CSS' },
          { item: 'Component-based', description: 'Styles stay close to component' },
        ],
        cons: [
          { item: 'More verbose', description: 'Need import/export for each style' },
          { item: 'Harder to share styles', description: 'Style reuse requires abstraction' },
          { item: 'Build complexity', description: 'Extra webpack config' },
        ],
      },
      {
        name: 'Styled Components',
        chosen: false,
        pros: [
          { item: 'JS-in-CSS', description: 'Styles are JavaScript' },
          { item: 'Dynamic styling', description: 'Conditional styles with props' },
          { item: 'No naming conflicts', description: 'Automatic unique class names' },
        ],
        cons: [
          { item: 'Runtime overhead', description: 'Styles processed at runtime' },
          { item: 'SSR complexity', description: 'Requires careful server setup' },
          { item: 'Larger bundle', description: 'Runtime CSS-in-JS library' },
          { item: 'Overkill for learning app', description: 'Adding complexity for no benefit' },
        ],
      },
    ],
    reasoning: 'We chose **Tailwind CSS** for rapid iteration and consistent design. The utility-first approach lets us quickly prototype the UI, and Tailwind\'s constraints actually help—they prevent inconsistent spacing, colors, and typography. The small bundle size (tree-shaking removes unused styles) and great Next.js integration make it ideal for a teaching app.',
  },
];

/**
 * Get all comparison data.
 * @returns Array of all architectural decision comparisons
 */
export function getAllComparisons(): Comparison[] {
  return comparisons;
}
