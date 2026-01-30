import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  describe('Percentage Calculation', () => {
    it('calculates 0% when completed is 0', () => {
      const { container } = render(<ProgressBar completed={0} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveStyle({ width: '0%' });
    });

    it('calculates 50% when completed is half of total', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveStyle({ width: '50%' });
    });

    it('calculates 100% when completed equals total', () => {
      const { container } = render(<ProgressBar completed={10} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveStyle({ width: '100%' });
    });

    it('calculates percentage correctly with different values', () => {
      const { container } = render(<ProgressBar completed={3} total={4} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveStyle({ width: '75%' });
    });

    it('calculates 0% when total is 0', () => {
      const { container } = render(<ProgressBar completed={0} total={0} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveStyle({ width: '0%' });
    });
  });

  describe('Rendering with Label', () => {
    it('renders label when provided', () => {
      render(<ProgressBar completed={2} total={3} label="Beginner" />);
      expect(screen.getByText(/Beginner/)).toBeInTheDocument();
    });

    it('renders label with completed and total counts', () => {
      render(<ProgressBar completed={2} total={3} label="Beginner" />);
      expect(screen.getByText('Beginner (2/3)')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      render(<ProgressBar completed={2} total={3} />);
      expect(screen.queryByText(/\(\d+\/\d+\)/)).not.toBeInTheDocument();
    });

    it('renders label with different counts', () => {
      render(<ProgressBar completed={5} total={9} label="Intermediate" />);
      expect(screen.getByText('Intermediate (5/9)')).toBeInTheDocument();
    });
  });

  describe('Rendering Structure', () => {
    it('renders container div', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const progressBar = container.querySelector('[data-testid="progress-container"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('renders fill div inside container', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toBeInTheDocument();
    });

    it('container has gray background styling', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const progressBar = container.querySelector('[data-testid="progress-container"]');
      expect(progressBar).toHaveClass('bg-gray-300');
    });

    it('fill has green background styling', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveClass('bg-green-500');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero total with zero completed', () => {
      const { container } = render(<ProgressBar completed={0} total={0} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveStyle({ width: '0%' });
    });

    it('handles completed greater than total gracefully', () => {
      const { container } = render(<ProgressBar completed={15} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      // Should still calculate (15/10)*100 = 150%, but CSS will cap it at 100%
      expect(fill).toHaveStyle({ width: '150%' });
    });

    it('handles decimal calculations correctly', () => {
      const { container } = render(<ProgressBar completed={1} total={3} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      // (1/3)*100 = 33.33...%
      expect(fill).toHaveStyle({ width: '33.33333333333333%' });
    });

    it('renders with empty string label', () => {
      const { container } = render(<ProgressBar completed={2} total={3} label="" />);
      // Empty label should render without errors
      const labelDiv = container.querySelector('.text-gray-600');
      expect(labelDiv).toBeInTheDocument();
      // Should contain the (2/3) text
      expect(labelDiv?.textContent).toContain('(2/3)');
    });
  });

  describe('Props Validation', () => {
    it('renders with valid props', () => {
      const { container } = render(
        <ProgressBar completed={2} total={5} label="Test" />
      );
      expect(container.querySelector('[data-testid="progress-container"]')).toBeInTheDocument();
    });

    it('renders without optional label prop', () => {
      const { container } = render(<ProgressBar completed={2} total={5} />);
      expect(container.querySelector('[data-testid="progress-container"]')).toBeInTheDocument();
    });

    it('accepts numeric props', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveStyle({ width: '50%' });
    });
  });

  describe('Styling', () => {
    it('applies correct Tailwind classes to container', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const progressBar = container.querySelector('[data-testid="progress-container"]');
      expect(progressBar).toHaveClass('bg-gray-300');
      expect(progressBar).toHaveClass('rounded-full');
      expect(progressBar).toHaveClass('h-2');
      expect(progressBar).toHaveClass('overflow-hidden');
    });

    it('applies correct Tailwind classes to fill', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveClass('bg-green-500');
      expect(fill).toHaveClass('h-full');
      expect(fill).toHaveClass('transition-all');
      expect(fill).toHaveClass('duration-500');
    });

    it('renders with rounded corners', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const progressBar = container.querySelector('[data-testid="progress-container"]');
      expect(progressBar).toHaveClass('rounded-full');
    });

    it('applies smooth transition animation', () => {
      const { container } = render(<ProgressBar completed={5} total={10} />);
      const fill = container.querySelector('[data-testid="progress-fill"]');
      expect(fill).toHaveClass('transition-all');
      expect(fill).toHaveClass('duration-500');
    });
  });

  describe('Label Formatting', () => {
    it('formats label with correct text when completed and total are same', () => {
      render(<ProgressBar completed={5} total={5} label="Advanced" />);
      expect(screen.getByText('Advanced (5/5)')).toBeInTheDocument();
    });

    it('formats label with correct text when completed is zero', () => {
      render(<ProgressBar completed={0} total={7} label="Intermediate" />);
      expect(screen.getByText('Intermediate (0/7)')).toBeInTheDocument();
    });

    it('renders label as text node in document', () => {
      render(<ProgressBar completed={2} total={4} label="Test Label" />);
      const text = screen.getByText('Test Label (2/4)');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides semantic structure', () => {
      const { container } = render(<ProgressBar completed={5} total={10} label="Progress" />);
      const progressBar = container.querySelector('[data-testid="progress-container"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('renders label text that is readable', () => {
      render(<ProgressBar completed={3} total={10} label="Beginner" />);
      const labelText = screen.getByText('Beginner (3/10)');
      expect(labelText).toBeVisible();
    });
  });
});
