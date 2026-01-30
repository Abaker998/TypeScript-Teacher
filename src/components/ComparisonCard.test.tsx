import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComparisonCard } from './ComparisonCard';
import { Comparison } from '@/types/comparison';

// Mock react-markdown to avoid ESM loading issues in Jest
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => {
    // Simple mock that renders the content as-is
    return <div dangerouslySetInnerHTML={{ __html: children }} />;
  },
}));

describe('ComparisonCard', () => {
  const mockComparison: Comparison = {
    id: 'test-comparison',
    title: 'Framework Choice',
    question: 'What framework should we use?',
    options: [
      {
        name: 'Next.js',
        chosen: true,
        pros: [
          { item: 'Built-in routing', description: 'File-based routing out of the box' },
          { item: 'TypeScript support', description: 'First-class TypeScript integration' },
        ],
        cons: [
          { item: 'Heavier bundle', description: 'Larger initial bundle size' },
        ],
      },
      {
        name: 'Vite',
        chosen: false,
        pros: [
          { item: 'Fast dev server', description: 'Instant HMR' },
        ],
        cons: [
          { item: 'No routing', description: 'Need external routing library' },
          { item: 'Fewer conventions', description: 'More decisions to make' },
        ],
      },
    ],
    reasoning: 'We chose **Next.js** for its built-in routing and TypeScript support.',
  };

  describe('Rendering', () => {
    it('renders the component without crashing', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the comparison card div with correct class', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const cardDiv = container.querySelector('.comparison-card');
      expect(cardDiv).toBeInTheDocument();
      expect(cardDiv).toHaveClass('bg-white', 'border-2', 'border-purple-200', 'rounded-lg', 'p-6', 'mb-6');
    });

    it('renders the title', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText('Framework Choice')).toBeInTheDocument();
    });

    it('renders the question', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText('What framework should we use?')).toBeInTheDocument();
    });

    it('renders the table with correct headers', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText('Option')).toBeInTheDocument();
      expect(screen.getByText('Pros')).toBeInTheDocument();
      expect(screen.getByText('Cons')).toBeInTheDocument();

      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('bg-gray-100', 'border-b');
    });

    it('renders the "Why We Chose This" section', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText('Why We Chose This')).toBeInTheDocument();
    });
  });

  describe('Title and Question', () => {
    it('renders title with correct styling', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      const title = screen.getByText('Framework Choice');
      expect(title).toHaveClass('text-2xl', 'font-bold');
      expect(title.tagName).toBe('H3');
    });

    it('renders question with correct styling', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      const question = screen.getByText('What framework should we use?');
      expect(question).toHaveClass('text-gray-600', 'text-lg');
    });

    it('displays custom title and question', () => {
      const customComparison: Comparison = {
        ...mockComparison,
        title: 'Custom Title',
        question: 'Custom question here?',
      };

      render(<ComparisonCard comparison={customComparison} />);
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom question here?')).toBeInTheDocument();
    });
  });

  describe('Options Table', () => {
    it('renders all options in the table', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('Vite')).toBeInTheDocument();
    });

    it('renders option name as bold text', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const optionSpans = container.querySelectorAll('td .font-semibold');
      expect(optionSpans.length).toBeGreaterThan(0);
    });

    it('renders table rows for each option', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(2); // Next.js and Vite
    });
  });

  describe('Chosen Option Highlighting', () => {
    it('highlights chosen option with purple background', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const rows = container.querySelectorAll('tbody tr');
      const firstRow = rows[0];
      expect(firstRow).toHaveClass('bg-purple-50');
    });

    it('does not highlight non-chosen options', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const rows = container.querySelectorAll('tbody tr');
      const secondRow = rows[1];
      expect(secondRow).toHaveClass('bg-white');
    });

    it('displays "✓ Chosen" badge on chosen option', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText('✓ Chosen')).toBeInTheDocument();
    });

    it('shows badge with purple background', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const badge = container.querySelector('.bg-purple-600');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('text-white', 'text-xs', 'px-2', 'py-1', 'rounded');
    });

    it('does not show badge on non-chosen options', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const badges = container.querySelectorAll('.bg-purple-600');
      expect(badges).toHaveLength(1); // Only one for Next.js
    });

    it('displays badge inline after option name', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const nextJsCell = container.querySelector('td');
      const badge = nextJsCell?.querySelector('.bg-purple-600');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Pros Display', () => {
    it('renders all pros for each option', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const proLis = container.querySelectorAll('li.text-green-700');
      expect(proLis.length).toBeGreaterThanOrEqual(3);
      expect(Array.from(proLis).some(li => li.textContent?.includes('Built-in routing'))).toBe(true);
      expect(Array.from(proLis).some(li => li.textContent?.includes('TypeScript support'))).toBe(true);
      expect(Array.from(proLis).some(li => li.textContent?.includes('Fast dev server'))).toBe(true);
    });

    it('renders pro item with plus sign', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      const proItems = screen.getAllByText(/Built-in routing/);
      expect(proItems.length).toBeGreaterThan(0);
      const proSpan = proItems[0].closest('span');
      expect(proSpan?.textContent).toContain('+ Built-in routing');
    });

    it('renders pro description', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText('File-based routing out of the box')).toBeInTheDocument();
    });

    it('renders pros with green text color', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const proLis = container.querySelectorAll('li.text-green-700');
      expect(proLis.length).toBeGreaterThan(0);
    });

    it('renders pro item as bold', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const proItems = container.querySelectorAll('li.text-green-700 .font-semibold');
      expect(proItems.length).toBeGreaterThan(0);
    });

    it('renders pro description with gray text', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const descriptions = container.querySelectorAll('li.text-green-700 .text-gray-600');
      expect(descriptions.length).toBeGreaterThan(0);
    });

    it('renders empty pro list gracefully', () => {
      const noProsComparison: Comparison = {
        ...mockComparison,
        options: [
          {
            name: 'Option without pros',
            chosen: false,
            pros: [],
            cons: [{ item: 'Some con', description: 'Con desc' }],
          },
        ],
      };

      const { container } = render(<ComparisonCard comparison={noProsComparison} />);
      const conLists = container.querySelectorAll('td.px-4.py-4 ul');
      // Should still render cons list
      expect(conLists.length).toBeGreaterThan(0);
    });
  });

  describe('Cons Display', () => {
    it('renders all cons for each option', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText(/Heavier bundle/)).toBeInTheDocument();
      expect(screen.getByText(/No routing/)).toBeInTheDocument();
      expect(screen.getByText(/Fewer conventions/)).toBeInTheDocument();
    });

    it('renders con item with minus sign', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      const conItems = screen.getAllByText(/Heavier bundle/);
      expect(conItems.length).toBeGreaterThan(0);
      const conSpan = conItems[0].closest('span');
      expect(conSpan?.textContent).toContain('- Heavier bundle');
    });

    it('renders con description', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText('Larger initial bundle size')).toBeInTheDocument();
    });

    it('renders cons with red text color', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const conLis = container.querySelectorAll('li.text-red-700');
      expect(conLis.length).toBeGreaterThan(0);
    });

    it('renders con item as bold', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const conItems = container.querySelectorAll('li.text-red-700 .font-semibold');
      expect(conItems.length).toBeGreaterThan(0);
    });

    it('renders con description with gray text', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const descriptions = container.querySelectorAll('li.text-red-700 .text-gray-600');
      expect(descriptions.length).toBeGreaterThan(0);
    });

    it('renders empty con list gracefully', () => {
      const noConsComparison: Comparison = {
        ...mockComparison,
        options: [
          {
            name: 'Option without cons',
            chosen: false,
            pros: [{ item: 'Some pro', description: 'Pro desc' }],
            cons: [],
          },
        ],
      };

      const { container } = render(<ComparisonCard comparison={noConsComparison} />);
      const proLists = container.querySelectorAll('td.px-4.py-4 ul');
      // Should still render pros list
      expect(proLists.length).toBeGreaterThan(0);
    });
  });

  describe('Reasoning Section', () => {
    it('renders the reasoning section', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      const reasoningSection = screen.getByText('Why We Chose This').closest('div');
      expect(reasoningSection).toBeInTheDocument();
    });

    it('renders reasoning heading with correct styling', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      const heading = screen.getByText('Why We Chose This');
      expect(heading).toHaveClass('font-semibold', 'text-purple-900');
      expect(heading.tagName).toBe('H4');
    });

    it('renders reasoning text with markdown', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      expect(screen.getByText(/We chose/)).toBeInTheDocument();
    });

    it('renders reasoning section with purple background', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      // Get the reasoning section specifically (has border-l-4)
      const reasoningDiv = container.querySelector('.bg-purple-50.border-l-4');
      expect(reasoningDiv).toBeInTheDocument();
      expect(reasoningDiv).toHaveClass('border-purple-500', 'p-4', 'rounded');
    });

    it('renders reasoning with prose styling', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const proseDiv = container.querySelector('.prose');
      expect(proseDiv).toBeInTheDocument();
      expect(proseDiv).toHaveClass('prose-sm', 'max-w-none');
    });

    it('displays markdown-formatted reasoning', () => {
      const markdownComparison: Comparison = {
        ...mockComparison,
        reasoning: 'We chose **Next.js** because it offers _excellent_ integration.',
      };

      render(<ComparisonCard comparison={markdownComparison} />);
      expect(screen.getByText(/We chose/)).toBeInTheDocument();
    });

    it('handles long reasoning text', () => {
      const longReasoning = 'This is a very long explanation about why we made this choice. '.repeat(10);
      const longComparison: Comparison = {
        ...mockComparison,
        reasoning: longReasoning,
      };

      const { container } = render(<ComparisonCard comparison={longComparison} />);
      const reasoningDiv = container.querySelector('.bg-purple-50');
      expect(reasoningDiv).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('renders table with overflow-x-auto for responsiveness', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const tableWrapper = container.querySelector('.overflow-x-auto');
      expect(tableWrapper).toBeInTheDocument();
    });

    it('renders table with full width', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const table = container.querySelector('table');
      expect(table).toHaveClass('w-full', 'text-left', 'text-sm');
    });

    it('renders card with proper spacing', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const card = container.querySelector('.comparison-card');
      expect(card).toHaveClass('p-6', 'mb-6');
    });

    it('renders sections with proper margin between them', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      const tableWrapper = container.querySelector('.overflow-x-auto');
      expect(tableWrapper).toHaveClass('mb-6');
    });
  });

  describe('Type Handling', () => {
    it('accepts Comparison interface with all fields', () => {
      const { container } = render(<ComparisonCard comparison={mockComparison} />);
      expect(container).toBeInTheDocument();
    });

    it('handles comparison with multiple options', () => {
      const multiOptionComparison: Comparison = {
        id: 'multi-option',
        title: 'Title',
        question: 'Question?',
        options: [
          { name: 'Option 1', chosen: false, pros: [], cons: [] },
          { name: 'Option 2', chosen: true, pros: [], cons: [] },
          { name: 'Option 3', chosen: false, pros: [], cons: [] },
        ],
        reasoning: 'Reasoning',
      };

      const { container } = render(<ComparisonCard comparison={multiOptionComparison} />);
      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(3);
    });

    it('handles comparison with no options', () => {
      const noOptionsComparison: Comparison = {
        id: 'no-options',
        title: 'Title',
        question: 'Question?',
        options: [],
        reasoning: 'Reasoning',
      };

      const { container } = render(<ComparisonCard comparison={noOptionsComparison} />);
      expect(container).toBeInTheDocument();
    });

    it('handles comparison with many pros and cons', () => {
      const manyProConsComparison: Comparison = {
        ...mockComparison,
        options: [
          {
            name: 'Option with many pros/cons',
            chosen: true,
            pros: Array.from({ length: 5 }, (_, i) => ({
              item: `Pro ${i + 1}`,
              description: `Description for pro ${i + 1}`,
            })),
            cons: Array.from({ length: 5 }, (_, i) => ({
              item: `Con ${i + 1}`,
              description: `Description for con ${i + 1}`,
            })),
          },
        ],
      };

      const { container } = render(<ComparisonCard comparison={manyProConsComparison} />);
      const proLis = container.querySelectorAll('li.text-green-700');
      const conLis = container.querySelectorAll('li.text-red-700');
      expect(proLis.length).toBe(5);
      expect(conLis.length).toBe(5);
    });
  });

  describe('Full Page Rendering', () => {
    it('renders complete comparison card with all sections', () => {
      render(<ComparisonCard comparison={mockComparison} />);
      // Title and question
      expect(screen.getByText('Framework Choice')).toBeInTheDocument();
      expect(screen.getByText('What framework should we use?')).toBeInTheDocument();
      // Table
      expect(screen.getByText('Option')).toBeInTheDocument();
      expect(screen.getByText('Pros')).toBeInTheDocument();
      expect(screen.getByText('Cons')).toBeInTheDocument();
      // Options
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('Vite')).toBeInTheDocument();
      // Reasoning
      expect(screen.getByText('Why We Chose This')).toBeInTheDocument();
    });

    it('renders multiple cards without interference', () => {
      const { container } = render(
        <>
          <ComparisonCard comparison={mockComparison} />
          <ComparisonCard
            comparison={{
              ...mockComparison,
              id: 'second',
              title: 'Second Comparison',
            }}
          />
        </>
      );

      const cards = container.querySelectorAll('.comparison-card');
      expect(cards).toHaveLength(2);
    });
  });
});
