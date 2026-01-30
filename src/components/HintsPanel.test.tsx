import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HintsPanel } from './HintsPanel';

describe('HintsPanel', () => {
  const mockHints = [
    'Start by declaring a variable with `let` and specify its type after a colon.',
    'For a string, use `let variableName: string = "value";`',
    'Don\'t forget to use `console.log()` to print the values.',
    'The solution uses `let greeting: string = "Hello, TypeScript!";`',
  ];

  const mockExerciseTitle = 'Exercise 1: Declare Variables';

  describe('State Initialization', () => {
    it('initializes revealedCount to 0', () => {
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      // Component shows (0/4) format
      expect(screen.getByText('(0/4)')).toBeInTheDocument();
    });

    it('renders heading with hint counter', () => {
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      expect(screen.getByText(/Need help\?/)).toBeInTheDocument();
      expect(screen.getByText('(0/4)')).toBeInTheDocument();
    });

    it('renders Show Hint button', () => {
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      const button = screen.getByRole('button', { name: /Show Hint 1/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('does not render any hint cards initially', () => {
      const { container } = render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      const hintCards = container.querySelectorAll('.hint-card');
      expect(hintCards).toHaveLength(0);
    });
  });

  describe('Reveal Logic', () => {
    it('increments revealedCount when Show Hint button is clicked', async () => {
      const user = userEvent.setup();
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      const button = screen.getByRole('button', { name: /Show Hint 1/i });
      await user.click(button);

      expect(screen.getByText('(1/4)')).toBeInTheDocument();
    });

    it('reveals hints one at a time', async () => {
      const user = userEvent.setup();
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      let button = screen.getByRole('button', { name: /Show Hint/i });

      // Click once
      await user.click(button);
      expect(screen.getByText('(1/4)')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText(mockHints[0])).toBeInTheDocument();

      // Click twice - button now says "Show Hint 2"
      button = screen.getByRole('button', { name: /Show Hint 2/i });
      await user.click(button);
      expect(screen.getByText('(2/4)')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText(mockHints[1])).toBeInTheDocument();
    });

    it('reveals all hints progressively', async () => {
      const user = userEvent.setup();
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      // Click 4 times to reveal all hints
      for (let i = 1; i <= 4; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`Show Hint ${i}`, 'i') });
        await user.click(button);
      }

      expect(screen.getByText('(4/4)')).toBeInTheDocument();
      mockHints.forEach((hint) => {
        expect(screen.getByText(hint)).toBeInTheDocument();
      });
    });
  });

  describe('Reset on Exercise Change', () => {
    it('resets revealedCount when exerciseTitle changes', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />
      );

      // Reveal some hints
      let button = screen.getByRole('button', { name: /Show Hint 1/i });
      await user.click(button);
      button = screen.getByRole('button', { name: /Show Hint 2/i });
      await user.click(button);
      expect(screen.getByText('(2/4)')).toBeInTheDocument();

      // Change exercise title
      rerender(<HintsPanel hints={mockHints} exerciseTitle="Exercise 2: Different Title" />);

      // Should reset to 0
      expect(screen.getByText('(0/4)')).toBeInTheDocument();
    });

    it('keeps hints visible when exerciseTitle remains the same', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />
      );

      const button = screen.getByRole('button', { name: /Show Hint 1/i });

      // Reveal a hint
      await user.click(button);
      expect(screen.getByText('(1/4)')).toBeInTheDocument();

      // Rerender with same exerciseTitle
      rerender(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      // Should still be visible
      expect(screen.getByText('(1/4)')).toBeInTheDocument();
      expect(screen.getByText(mockHints[0])).toBeInTheDocument();
    });
  });

  describe('Button Disabled State', () => {
    it('disables Show Hint button when all hints are revealed', async () => {
      const user = userEvent.setup();
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      // Click to reveal all hints
      for (let i = 1; i <= 4; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`Show Hint ${i}`, 'i') });
        await user.click(button);
      }

      const button = screen.getByRole('button', { name: /All hints shown/i });
      expect(button).toBeDisabled();
    });

    it('button is enabled when not all hints are revealed', () => {
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      const button = screen.getByRole('button', { name: /Show Hint 1/i });
      expect(button).not.toBeDisabled();
    });

    it('changes button text to "All hints shown" when disabled', async () => {
      const user = userEvent.setup();
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      // Reveal all hints
      for (let i = 1; i <= 4; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`Show Hint ${i}`, 'i') });
        await user.click(button);
      }

      expect(screen.getByRole('button', { name: /All hints shown/i })).toBeInTheDocument();
    });
  });

  describe('Rendering Hints with Styling', () => {
    it('renders hint cards with correct styling', async () => {
      const user = userEvent.setup();
      const { container } = render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      const button = screen.getByRole('button', { name: /Show Hint 1/i });
      await user.click(button);

      const hintCard = container.querySelector('.hint-card');
      expect(hintCard).toBeInTheDocument();
      expect(hintCard).toHaveClass('bg-white/80');
      expect(hintCard).toHaveClass('border');
      expect(hintCard).toHaveClass('border-amber-300');
      expect(hintCard).toHaveClass('rounded-xl');
    });

    it('displays hint with numbered label', async () => {
      const user = userEvent.setup();
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      const button = screen.getByRole('button', { name: /Show Hint 1/i });
      await user.click(button);

      expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('renders multiple numbered hint labels when multiple hints revealed', async () => {
      const user = userEvent.setup();
      render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      for (let i = 1; i <= 3; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`Show Hint ${i}`, 'i') });
        await user.click(button);
      }

      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
    });
  });

  describe('Fade-in Animation', () => {
    it('applies fade-in animation to hint cards', async () => {
      const user = userEvent.setup();
      const { container } = render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      const button = screen.getByRole('button', { name: /Show Hint 1/i });
      await user.click(button);

      const hintCard = container.querySelector('.hint-card');
      expect(hintCard).toHaveClass('animate-fade-in');
    });

    it('applies fade-in animation to newly revealed hints', async () => {
      const user = userEvent.setup();
      const { container } = render(<HintsPanel hints={mockHints} exerciseTitle={mockExerciseTitle} />);

      // Reveal first hint
      let button = screen.getByRole('button', { name: /Show Hint 1/i });
      await user.click(button);
      const hintCards = container.querySelectorAll('.hint-card');
      expect(hintCards[0]).toHaveClass('animate-fade-in');

      // Reveal second hint
      button = screen.getByRole('button', { name: /Show Hint 2/i });
      await user.click(button);
      const updatedHintCards = container.querySelectorAll('.hint-card');
      expect(updatedHintCards[1]).toHaveClass('animate-fade-in');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty hints array gracefully', () => {
      const { container } = render(<HintsPanel hints={[]} exerciseTitle={mockExerciseTitle} />);

      expect(container.firstChild).toBeNull();
    });

    it('handles undefined hints gracefully', () => {
      const { container } = render(
        <HintsPanel hints={undefined as any} exerciseTitle={mockExerciseTitle} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles single hint', async () => {
      const user = userEvent.setup();
      const singleHint = ['This is the only hint'];

      render(<HintsPanel hints={singleHint} exerciseTitle={mockExerciseTitle} />);

      expect(screen.getByText('(0/1)')).toBeInTheDocument();

      const button = screen.getByRole('button', { name: /Show Hint 1/i });
      await user.click(button);

      expect(screen.getByText('(1/1)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /All hints shown/i })).toBeDisabled();
    });

    it('handles two hints', async () => {
      const user = userEvent.setup();
      const twoHints = ['First hint', 'Second hint'];

      render(<HintsPanel hints={twoHints} exerciseTitle={mockExerciseTitle} />);

      expect(screen.getByText('(0/2)')).toBeInTheDocument();

      let button = screen.getByRole('button', { name: /Show Hint 1/i });
      await user.click(button);
      expect(screen.getByText('(1/2)')).toBeInTheDocument();

      button = screen.getByRole('button', { name: /Show Hint 2/i });
      await user.click(button);
      expect(screen.getByText('(2/2)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /All hints shown/i })).toBeDisabled();
    });

    it('handles three hints', async () => {
      const user = userEvent.setup();
      const threeHints = ['First', 'Second', 'Third'];

      render(<HintsPanel hints={threeHints} exerciseTitle={mockExerciseTitle} />);

      expect(screen.getByText('(0/3)')).toBeInTheDocument();

      for (let i = 1; i <= 3; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`Show Hint ${i}`, 'i') });
        await user.click(button);
        expect(screen.getByText(`(${i}/3)`)).toBeInTheDocument();
      }

      expect(screen.getByRole('button', { name: /All hints shown/i })).toBeDisabled();
    });
  });
});
