import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BuildNote } from './BuildNote';
import { BuildNote as BuildNoteType } from '@/types/lesson';

// Mock react-markdown to avoid ESM loading issues in Jest
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: children }} />;
  },
}));

describe('BuildNote', () => {
  const mockBuildNote: BuildNoteType = {
    title: 'How the Lesson Interface is Typed',
    explanation: 'The `Lesson` interface defines the structure of each lesson object. This shows how TypeScript types are used throughout the app.',
    relatedFiles: ['src/types/lesson.ts', 'src/lessons/index.ts'],
    inTheRealWorld: 'In production, interfaces like this are used to ensure data consistency across microservices and API contracts.',
  };

  describe('Initial State - Collapsed', () => {
    it('renders the button with "How This Was Built" text', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      expect(screen.getByText('How This Was Built')).toBeInTheDocument();
    });

    it('renders button with correct styling', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = container.querySelector('button');
      expect(button).toHaveClass('flex', 'items-center', 'gap-3', 'text-lg', 'font-semibold', 'text-purple-700');
    });

    it('does not display title when collapsed', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const title = screen.queryByText('How the Lesson Interface is Typed');
      expect(title).not.toBeInTheDocument();
    });

    it('does not display explanation when collapsed', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const explanation = screen.queryByText(/The \`Lesson\` interface/);
      expect(explanation).not.toBeInTheDocument();
    });

    it('renders arrow indicator', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      expect(screen.getByText('▶')).toBeInTheDocument();
    });
  });

  describe('Expanded State - Click to Expand', () => {
    it('displays title when expanded', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);
      expect(screen.getByText('How the Lesson Interface is Typed')).toBeInTheDocument();
    });

    it('displays explanation when expanded', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);
      const explanationElement = screen.getByText(/The \`Lesson\` interface defines/);
      expect(explanationElement).toBeInTheDocument();
    });

    it('displays "In the Real World" section when present and expanded', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText('In the Real World')).toBeInTheDocument();
      expect(screen.getByText(/In production, interfaces like this/)).toBeInTheDocument();
    });

    it('displays related files when present and expanded', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText('Related Files')).toBeInTheDocument();
      // Related files are now displayed as code tags
      const codeElements = container.querySelectorAll('code.font-mono');
      expect(codeElements.length).toBe(2);
    });
  });

  describe('Toggle Behavior', () => {
    it('toggles between collapsed and expanded on button click', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');

      // Initially collapsed
      expect(screen.queryByText('How the Lesson Interface is Typed')).not.toBeInTheDocument();

      // Click to expand
      fireEvent.click(button);
      expect(screen.getByText('How the Lesson Interface is Typed')).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(button);
      expect(screen.queryByText('How the Lesson Interface is Typed')).not.toBeInTheDocument();
    });

    it('toggles multiple times correctly', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');

      fireEvent.click(button);
      expect(screen.getByText('How the Lesson Interface is Typed')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByText('How the Lesson Interface is Typed')).not.toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.getByText('How the Lesson Interface is Typed')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByText('How the Lesson Interface is Typed')).not.toBeInTheDocument();
    });
  });

  describe('Markdown Rendering', () => {
    it('passes markdown content to ReactMarkdown component', () => {
      const buildNoteWithMarkdown: BuildNoteType = {
        title: 'Markdown Test',
        explanation: 'This is **bold** and this is *italic* text.',
        relatedFiles: [],
      };

      render(<BuildNote buildNote={buildNoteWithMarkdown} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText(/This is \*\*bold\*\* and this is \*italic\* text\./)).toBeInTheDocument();
    });

    it('renders code in markdown explanation', () => {
      const buildNoteWithCode: BuildNoteType = {
        title: 'Code Block Test',
        explanation: '`const x = 5;` is a constant declaration.',
        relatedFiles: [],
      };

      render(<BuildNote buildNote={buildNoteWithCode} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText(/const x = 5;/)).toBeInTheDocument();
    });

    it('renders inTheRealWorld content via ReactMarkdown', () => {
      const buildNoteWithMarkdown: BuildNoteType = {
        title: 'Test',
        explanation: 'Explanation',
        relatedFiles: [],
        inTheRealWorld: 'Production uses **TypeScript** interfaces for type safety.',
      };

      render(<BuildNote buildNote={buildNoteWithMarkdown} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText(/Production uses.*TypeScript/)).toBeInTheDocument();
    });
  });

  describe('Conditional Sections', () => {
    it('does not display "In the Real World" section when not present', () => {
      const buildNoteWithoutRealWorld: BuildNoteType = {
        title: 'No Real World Section',
        explanation: 'Just the explanation.',
        relatedFiles: ['src/file.ts'],
      };

      render(<BuildNote buildNote={buildNoteWithoutRealWorld} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.queryByText('In the Real World')).not.toBeInTheDocument();
    });

    it('does not display related files section when array is empty', () => {
      const buildNoteWithoutFiles: BuildNoteType = {
        title: 'No Files',
        explanation: 'No related files here.',
        relatedFiles: [],
      };

      render(<BuildNote buildNote={buildNoteWithoutFiles} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.queryByText('Related Files')).not.toBeInTheDocument();
    });

    it('displays both optional sections when present', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText('In the Real World')).toBeInTheDocument();
      expect(screen.getByText('Related Files')).toBeInTheDocument();
    });

    it('displays related files section with multiple files', () => {
      const buildNoteWithFiles: BuildNoteType = {
        title: 'Multiple Files',
        explanation: 'Several files are involved.',
        relatedFiles: ['src/file1.ts', 'src/file2.tsx', 'src/types/index.ts'],
      };

      const { container } = render(<BuildNote buildNote={buildNoteWithFiles} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText('Related Files')).toBeInTheDocument();
      // Files are displayed as code tags now
      const codeElements = container.querySelectorAll('code.font-mono');
      expect(codeElements.length).toBe(3);

      const fileTexts = Array.from(codeElements).map(el => el.textContent);
      expect(fileTexts).toContain('src/file1.ts');
      expect(fileTexts).toContain('src/file2.tsx');
      expect(fileTexts).toContain('src/types/index.ts');
    });
  });

  describe('Styling and Visual Elements', () => {
    it('applies correct styling to title', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const title = screen.getByText('How the Lesson Interface is Typed');
      expect(title).toHaveClass('text-lg', 'font-semibold');
    });

    it('applies correct styling to "In the Real World" section', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const heading = screen.getByText('In the Real World');
      const realWorldContainer = heading.closest('div');
      expect(realWorldContainer).toHaveClass('border-purple-200', 'rounded-xl');
    });

    it('applies correct styling to related files section', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const heading = screen.getByText('Related Files');
      const sectionContainer = heading.closest('div');
      expect(sectionContainer).toHaveClass('bg-slate-50', 'border-slate-200', 'rounded-xl');
    });

    it('applies monospace font to related file paths', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const fileElements = container.querySelectorAll('code.font-mono');
      expect(fileElements.length).toBeGreaterThan(0);
    });

    it('applies hover effect to button', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = container.querySelector('button');
      expect(button).toHaveClass('hover:text-purple-900');
    });

    it('applies transition effect to button', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = container.querySelector('button');
      expect(button).toHaveClass('transition-colors');
    });

    it('applies border-top to main container', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const mainDiv = container.querySelector('.build-note');
      expect(mainDiv).toHaveClass('border-t-2');
    });

    it('applies proper spacing with mt-12 and pt-8', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const mainDiv = container.querySelector('.build-note');
      expect(mainDiv).toHaveClass('mt-12', 'pt-8');
    });
  });

  describe('Component Structure', () => {
    it('renders as a functional component', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the button as the first interactive element', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button?.textContent).toContain('How This Was Built');
    });

    it('renders expanded content in a separate div', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const contentDiv = container.querySelector('.space-y-5');
      expect(contentDiv).toBeInTheDocument();
    });

    it('renders expanded content with proper spacing', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const contentDiv = container.querySelector('.space-y-5');
      expect(contentDiv).toHaveClass('mt-6');
    });
  });

  describe('Props Handling', () => {
    it('accepts buildNote prop of correct type', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      expect(container).toBeInTheDocument();
    });

    it('renders with minimal buildNote prop (required fields only)', () => {
      const minimalBuildNote: BuildNoteType = {
        title: 'Minimal',
        explanation: 'Just explanation.',
        relatedFiles: [],
      };

      render(<BuildNote buildNote={minimalBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText('Minimal')).toBeInTheDocument();
      expect(screen.getByText('Just explanation.')).toBeInTheDocument();
    });

    it('renders with all optional props populated', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText('How the Lesson Interface is Typed')).toBeInTheDocument();
      expect(screen.getByText('In the Real World')).toBeInTheDocument();
      expect(screen.getByText('Related Files')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long titles', () => {
      const longTitle = 'A'.repeat(200);
      const buildNoteWithLongTitle: BuildNoteType = {
        title: longTitle,
        explanation: 'Explanation with long title.',
        relatedFiles: [],
      };

      render(<BuildNote buildNote={buildNoteWithLongTitle} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles very long explanations', () => {
      const longExplanation = 'This is a very detailed explanation. '.repeat(50);
      const buildNoteWithLongExplanation: BuildNoteType = {
        title: 'Long Explanation',
        explanation: longExplanation,
        relatedFiles: [],
      };

      render(<BuildNote buildNote={buildNoteWithLongExplanation} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText(/This is a very detailed explanation/)).toBeInTheDocument();
    });

    it('handles many related files', () => {
      const manyFiles = Array.from({ length: 20 }, (_, i) => `src/file${i}.ts`);
      const buildNoteWithManyFiles: BuildNoteType = {
        title: 'Many Files',
        explanation: 'Many related files.',
        relatedFiles: manyFiles,
      };

      const { container } = render(<BuildNote buildNote={buildNoteWithManyFiles} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const codeElements = container.querySelectorAll('code.font-mono');
      expect(codeElements.length).toBe(20);
    });

    it('handles special characters in content', () => {
      const buildNoteWithSpecialChars: BuildNoteType = {
        title: 'Special & Characters <> "Quotes"',
        explanation: 'Content with <tags> & special "characters".',
        relatedFiles: ['src/file<special>.ts'],
      };

      render(<BuildNote buildNote={buildNoteWithSpecialChars} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.getByText(/Special & Characters/)).toBeInTheDocument();
    });

    it('handles empty relatedFiles array', () => {
      const buildNoteWithEmptyFiles: BuildNoteType = {
        title: 'Empty Files',
        explanation: 'No related files.',
        relatedFiles: [],
      };

      render(<BuildNote buildNote={buildNoteWithEmptyFiles} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.queryByText('Related Files')).not.toBeInTheDocument();
    });

    it('handles null/undefined inTheRealWorld gracefully', () => {
      const buildNoteWithoutRealWorld: BuildNoteType = {
        title: 'No Real World',
        explanation: 'Explanation.',
        relatedFiles: [],
      };

      render(<BuildNote buildNote={buildNoteWithoutRealWorld} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      expect(screen.queryByText('In the Real World')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders button as a clickable element', () => {
      const { container } = render(<BuildNote buildNote={mockBuildNote} />);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button?.tagName).toBe('BUTTON');
    });

    it('has proper heading hierarchy', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const h3 = screen.getByRole('heading', { level: 3 });
      expect(h3).toBeInTheDocument();
    });

    it('has proper heading hierarchy for subsections', () => {
      render(<BuildNote buildNote={mockBuildNote} />);
      const button = screen.getByText('How This Was Built');
      fireEvent.click(button);

      const h4s = screen.getAllByRole('heading', { level: 4 });
      expect(h4s.length).toBeGreaterThan(0);
    });
  });
});
