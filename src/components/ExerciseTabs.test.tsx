import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseTabs from './ExerciseTabs';
import { Exercise } from '@/types/lesson';

// Helper to create mock exercises
const createMockExercise = (id: number): Exercise => ({
  id,
  title: `Exercise ${id}: Test Exercise`,
  description: `Description for exercise ${id}`,
  starterCode: `// Exercise ${id} starter code`,
  solution: `// Exercise ${id} solution`,
  expectedOutput: [`Output ${id}`],
  hints: [`Hint for exercise ${id}`],
});

describe('ExerciseTabs', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe('Rendering Tabs', () => {
    it('renders correct number of tabs for exercises array', () => {
      const exercises = [createMockExercise(1), createMockExercise(2), createMockExercise(3)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders tab labels as numbers (1, 2, etc.)', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders a single tab when only one exercise exists', () => {
      const exercises = [createMockExercise(1)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const tabs = screen.getAllByRole('button');
      expect(tabs).toHaveLength(1);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('renders no tabs when exercises array is empty', () => {
      render(
        <ExerciseTabs
          exercises={[]}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      // Should not render any tabs
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
  });

  describe('Active Tab Styling', () => {
    it('highlights active tab with white background and purple text', () => {
      const exercises = [createMockExercise(1), createMockExercise(2), createMockExercise(3)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={1}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      const activeTab = buttons[1];
      expect(activeTab).toHaveClass('bg-white');
      expect(activeTab).toHaveClass('text-purple-700');
      expect(activeTab).toHaveClass('shadow-md');
    });

    it('does not highlight inactive tabs with active styling', () => {
      const exercises = [createMockExercise(1), createMockExercise(2), createMockExercise(3)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={1}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      const inactiveTab1 = buttons[0];
      const inactiveTab3 = buttons[2];
      expect(inactiveTab1).not.toHaveClass('bg-white');
      expect(inactiveTab3).not.toHaveClass('bg-white');
      expect(inactiveTab1).toHaveClass('text-slate-600');
      expect(inactiveTab3).toHaveClass('text-slate-600');
    });

    it('updates active styling when currentIndex changes', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      const { rerender } = render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      // Initially first tab is active
      let buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('bg-white');
      expect(buttons[0]).toHaveClass('text-purple-700');
      expect(buttons[1]).not.toHaveClass('bg-white');

      // Rerender with different currentIndex
      rerender(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={1}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      // Now second tab should be active
      buttons = screen.getAllByRole('button');
      expect(buttons[0]).not.toHaveClass('bg-white');
      expect(buttons[1]).toHaveClass('bg-white');
      expect(buttons[1]).toHaveClass('text-purple-700');
    });

    it('applies text color styling to active tab', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('text-purple-700');
    });
  });

  describe('Checkmark Display', () => {
    it('shows green checkmark on completed exercises', () => {
      const exercises = [createMockExercise(1), createMockExercise(2), createMockExercise(3)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[0, 2]}
        />
      );

      // Checkmarks should be present for completed exercises
      const checkmarks = screen.getAllByTestId('checkmark');
      expect(checkmarks).toHaveLength(2);
    });

    it('does not show checkmark on incomplete exercises', () => {
      const exercises = [createMockExercise(1), createMockExercise(2), createMockExercise(3)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[0]}
        />
      );

      // Only one checkmark for completed exercise
      const checkmarks = screen.getAllByTestId('checkmark');
      expect(checkmarks).toHaveLength(1);
    });

    it('checkmark has green color styling', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[0]}
        />
      );

      const checkmark = screen.getByTestId('checkmark');
      expect(checkmark).toHaveClass('text-green-500');
    });

    it('shows checkmark when all exercises are completed', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[0, 1]}
        />
      );

      const checkmarks = screen.getAllByTestId('checkmark');
      expect(checkmarks).toHaveLength(2);
    });

    it('shows no checkmarks when no exercises are completed', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      expect(screen.queryAllByTestId('checkmark')).toHaveLength(0);
    });
  });

  describe('Click Handling', () => {
    it('calls onSelect with correct index when tab is clicked', () => {
      const exercises = [createMockExercise(1), createMockExercise(2), createMockExercise(3)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[1]);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(1);
    });

    it('calls onSelect with index 0 when first tab is clicked', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={1}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(mockOnSelect).toHaveBeenCalledWith(0);
    });

    it('calls onSelect when clicking on already active tab', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(mockOnSelect).toHaveBeenCalledWith(0);
    });

    it('calls onSelect multiple times for multiple clicks', () => {
      const exercises = [createMockExercise(1), createMockExercise(2), createMockExercise(3)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[1]);
      fireEvent.click(buttons[2]);

      expect(mockOnSelect).toHaveBeenCalledTimes(2);
      expect(mockOnSelect).toHaveBeenNthCalledWith(1, 1);
      expect(mockOnSelect).toHaveBeenNthCalledWith(2, 2);
    });
  });

  describe('Edge Cases', () => {
    it('handles single exercise correctly', () => {
      const exercises = [createMockExercise(1)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toBeInTheDocument();
      expect(buttons[0]).toHaveClass('bg-white');
      expect(buttons[0]).toHaveClass('text-purple-700');
    });

    it('handles empty exercises array gracefully', () => {
      const { container } = render(
        <ExerciseTabs
          exercises={[]}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      // Should render without crashing
      expect(container).toBeInTheDocument();
    });

    it('handles completedIndices that exceed exercise count', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[0, 1, 5, 10]} // Indices 5 and 10 don't exist
        />
      );

      // Should only show checkmarks for valid indices
      const checkmarks = screen.getAllByTestId('checkmark');
      expect(checkmarks).toHaveLength(2);
    });

    it('handles currentIndex at last position', () => {
      const exercises = [createMockExercise(1), createMockExercise(2), createMockExercise(3)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={2}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[2]).toHaveClass('bg-white');
      expect(buttons[2]).toHaveClass('text-purple-700');
    });
  });

  describe('Layout and Structure', () => {
    it('renders tabs in a horizontal flex container', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      const { container } = render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const tabContainer = container.querySelector('[data-testid="exercise-tabs"]');
      expect(tabContainer).toHaveClass('flex');
    });

    it('renders with proper spacing between tabs', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      const { container } = render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const tabContainer = container.querySelector('[data-testid="exercise-tabs"]');
      expect(tabContainer).toHaveClass('gap-1');
    });

    it('renders tabs as buttons for accessibility', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('has slate background on container', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      const { container } = render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const tabContainer = container.querySelector('[data-testid="exercise-tabs"]');
      expect(tabContainer).toHaveClass('bg-slate-100');
      expect(tabContainer).toHaveClass('rounded-xl');
    });
  });

  describe('Styling', () => {
    it('applies rounded styling to tabs', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('rounded-lg');
    });

    it('applies slate text color to inactive tabs', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[1]).toHaveClass('text-slate-600');
    });

    it('applies hover styling to inactive tabs', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[1]).toHaveClass('hover:text-purple-600');
      expect(buttons[1]).toHaveClass('hover:bg-white/50');
    });

    it('applies transition styling to all tabs', () => {
      const exercises = [createMockExercise(1), createMockExercise(2)];
      render(
        <ExerciseTabs
          exercises={exercises}
          currentIndex={0}
          onSelect={mockOnSelect}
          completedIndices={[]}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('transition-all');
      expect(buttons[1]).toHaveClass('transition-all');
    });
  });
});
