import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';
import { LessonGroup, Lesson } from '@/types/lesson';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock useProgress hook
const mockGetGroupProgress = jest.fn();
const mockResetProgress = jest.fn();

jest.mock('@/hooks/useProgress', () => ({
  useProgress: () => ({
    getGroupProgress: mockGetGroupProgress,
    resetProgress: mockResetProgress,
  }),
}));

// Mock getAllLessons
const mockAllLessons: Lesson[] = [
  {
    slug: 'variables-and-types',
    title: 'Variables & Types',
    description: 'Learn basic TypeScript types',
    difficulty: 'beginner',
    order: 1,
    content: 'Content here',
    exercises: [{ id: 1, title: 'Exercise 1', description: '', starterCode: '', solution: '', expectedOutput: [], hints: [] }],
    buildNote: {
      title: 'Build Note',
      explanation: 'Explanation',
      relatedFiles: [],
    },
  },
  {
    slug: 'functions',
    title: 'Functions',
    description: 'Learn function types',
    difficulty: 'beginner',
    order: 2,
    content: 'Content here',
    exercises: [{ id: 1, title: 'Exercise 1', description: '', starterCode: '', solution: '', expectedOutput: [], hints: [] }],
    buildNote: {
      title: 'Build Note',
      explanation: 'Explanation',
      relatedFiles: [],
    },
  },
  {
    slug: 'interfaces',
    title: 'Interfaces',
    description: 'Learn interface types',
    difficulty: 'intermediate',
    order: 1,
    content: 'Content here',
    exercises: [{ id: 1, title: 'Exercise 1', description: '', starterCode: '', solution: '', expectedOutput: [], hints: [] }],
    buildNote: {
      title: 'Build Note',
      explanation: 'Explanation',
      relatedFiles: [],
    },
  },
];

jest.mock('@/lessons', () => ({
  getAllLessons: () => mockAllLessons,
}));

describe('Sidebar Component', () => {
  const mockOnClose = jest.fn();

  const mockLessonGroups: LessonGroup[] = [
    {
      difficulty: 'beginner',
      label: 'Beginner',
      lessons: [
        {
          slug: 'variables-and-types',
          title: 'Variables & Types',
          description: 'Learn basic TypeScript types',
          difficulty: 'beginner',
          order: 1,
          content: 'Content here',
          exercises: [{ id: 1, title: 'Exercise 1', description: '', starterCode: '', solution: '', expectedOutput: [], hints: [] }],
          buildNote: {
            title: 'Build Note',
            explanation: 'Explanation',
            relatedFiles: [],
          },
        },
        {
          slug: 'functions',
          title: 'Functions',
          description: 'Learn function types',
          difficulty: 'beginner',
          order: 2,
          content: 'Content here',
          exercises: [{ id: 1, title: 'Exercise 1', description: '', starterCode: '', solution: '', expectedOutput: [], hints: [] }],
          buildNote: {
            title: 'Build Note',
            explanation: 'Explanation',
            relatedFiles: [],
          },
        },
      ],
    },
    {
      difficulty: 'intermediate',
      label: 'Intermediate',
      lessons: [
        {
          slug: 'interfaces',
          title: 'Interfaces',
          description: 'Learn interface types',
          difficulty: 'intermediate',
          order: 1,
          content: 'Content here',
          exercises: [{ id: 1, title: 'Exercise 1', description: '', starterCode: '', solution: '', expectedOutput: [], hints: [] }],
          buildNote: {
            title: 'Build Note',
            explanation: 'Explanation',
            relatedFiles: [],
          },
        },
      ],
    },
    {
      difficulty: 'advanced',
      label: 'Advanced',
      lessons: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for getGroupProgress
    mockGetGroupProgress.mockImplementation((difficulty: string) => {
      if (difficulty === 'beginner') return { completed: 1, total: 2 };
      if (difficulty === 'intermediate') return { completed: 0, total: 1 };
      if (difficulty === 'advanced') return { completed: 0, total: 0 };
      return { completed: 0, total: 0 };
    });
  });

  describe('Visibility', () => {
    it('should not render sidebar elements when isOpen is false', () => {
      render(
        <Sidebar
          isOpen={false}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Should not render sidebar
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
      expect(screen.queryByText('TypeScript Teacher')).not.toBeInTheDocument();
    });

    it('should render sidebar and overlay when isOpen is true', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Check for sidebar
      const sidebar = screen.getByRole('navigation', { name: /lesson navigation/i });
      expect(sidebar).toBeInTheDocument();

      // Check that app title is rendered
      expect(screen.getByText('TypeScript Teacher')).toBeInTheDocument();
    });
  });

  describe('Header and Title', () => {
    it('should display app title', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      expect(screen.getByText('TypeScript Teacher')).toBeInTheDocument();
    });

    it('should have a close button', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close sidebar/i });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('✕');
    });
  });

  describe('Group Toggling', () => {
    it('should render all difficulty groups', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(screen.getByText('Intermediate')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('should have Beginner group expanded by default', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Beginner lessons should be visible by default
      expect(screen.getByText('Variables & Types')).toBeInTheDocument();
      expect(screen.getByText('Functions')).toBeInTheDocument();
    });

    it('should not show Intermediate lessons by default', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Intermediate lessons should not be visible
      expect(screen.queryByText('Interfaces')).not.toBeInTheDocument();
    });

    it('should toggle group visibility when clicking group header', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Intermediate is collapsed initially
      expect(screen.queryByText('Interfaces')).not.toBeInTheDocument();

      // Click Intermediate group
      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });
      await user.click(intermediateButton);

      // Now Interfaces should be visible
      expect(screen.getByText('Interfaces')).toBeInTheDocument();
    });

    it('should collapse Beginner when clicking its header', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Variables & Types is visible initially
      expect(screen.getByText('Variables & Types')).toBeInTheDocument();

      // Click Beginner group to collapse
      const beginnerButton = screen.getByRole('button', { name: /beginner/i });
      await user.click(beginnerButton);

      // Now Beginner lessons should not be visible
      expect(screen.queryByText('Variables & Types')).not.toBeInTheDocument();
      expect(screen.queryByText('Functions')).not.toBeInTheDocument();
    });

    it('should rotate chevron when group is expanded', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });

      // Get the first span in the button (the chevron)
      const chevronSpan = intermediateButton.querySelector('span:first-child');

      // Initially Intermediate is collapsed - no rotation class
      expect(chevronSpan).not.toHaveClass('rotate-90');

      // Expand Intermediate
      await user.click(intermediateButton);
      expect(chevronSpan).toHaveClass('rotate-90');

      // Collapse it
      await user.click(intermediateButton);
      expect(chevronSpan).not.toHaveClass('rotate-90');
    });
  });

  describe('Lesson Links', () => {
    it('should render all lessons in expanded groups', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Beginner lessons (expanded by default)
      expect(screen.getByText('Variables & Types')).toBeInTheDocument();
      expect(screen.getByText('Functions')).toBeInTheDocument();

      // Links should have correct hrefs
      const varLink = screen.getByRole('link', { name: /variables & types/i });
      expect(varLink).toHaveAttribute('href', '/lessons/variables-and-types');

      const funcLink = screen.getByRole('link', { name: /functions/i });
      expect(funcLink).toHaveAttribute('href', '/lessons/functions');
    });

    it('should highlight active lesson', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const activeLink = screen.getByRole('link', { name: /variables & types/i });
      const inactiveLink = screen.getByRole('link', { name: /^Functions$/i });

      // Active link should have the "bg-purple-600" style class
      expect(activeLink.className).toContain('bg-purple-600');

      // Inactive link should NOT have "bg-purple-600"
      expect(inactiveLink.className).not.toContain('bg-purple-600');
    });

    it('should not highlight inactive lessons', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const inactiveLink = screen.getByRole('link', { name: /^Functions$/i });
      expect(inactiveLink.className).not.toContain('bg-purple-600');
    });

    it('should show "No lessons yet" for empty groups', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Expand Advanced group
      const advancedButton = screen.getByRole('button', { name: /advanced/i });
      await user.click(advancedButton);

      // Should show no lessons message
      expect(screen.getByText('No lessons yet')).toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('should call onClose when overlay is clicked', () => {
      const { container } = render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Click overlay (first div with bg-opacity-50)
      const overlay = container.querySelector('.bg-opacity-50');
      expect(overlay).toBeInTheDocument();
      fireEvent.click(overlay!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close sidebar/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when a lesson link is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const lessonLink = screen.getByRole('link', { name: /^Functions$/i });

      // Mock preventing default navigation
      fireEvent.click(lessonLink);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when clicking a lesson in an expanded group', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Expand Intermediate
      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });
      await user.click(intermediateButton);

      // Click Interfaces lesson
      const interfacesLink = screen.getByRole('link', { name: /interfaces/i });
      fireEvent.click(interfacesLink);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Active Lesson Highlighting', () => {
    it('should highlight different active lessons', () => {
      const { rerender } = render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      let activeLink = screen.getByRole('link', { name: /variables & types/i });
      expect(activeLink.className).toContain('bg-purple-600');

      // Re-render with different current lesson
      rerender(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="functions"
          lessonGroups={mockLessonGroups}
        />
      );

      // Now Functions should be highlighted
      activeLink = screen.getByRole('link', { name: /^Functions$/i });
      expect(activeLink.className).toContain('bg-purple-600');

      // Variables should not be highlighted
      const inactiveLink = screen.getByRole('link', { name: /variables & types/i });
      expect(inactiveLink.className).not.toContain('bg-purple-600');
    });

    it('should highlight active lesson across groups', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="interfaces"
          lessonGroups={mockLessonGroups}
        />
      );

      // Expand Intermediate to show Interfaces
      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });
      await user.click(intermediateButton);

      // Interfaces should be highlighted
      const activeLink = screen.getByRole('link', { name: /^Interfaces$/i });
      expect(activeLink.className).toContain('bg-purple-600');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty lesson groups', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={[]}
        />
      );

      // Should still render sidebar
      const sidebar = screen.getByRole('navigation', { name: /lesson navigation/i });
      expect(sidebar).toBeInTheDocument();

      // But no lesson groups
      expect(screen.queryByText('Beginner')).not.toBeInTheDocument();
    });

    it('should handle non-existent current slug', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="non-existent-lesson"
          lessonGroups={mockLessonGroups}
        />
      );

      // No lesson should be highlighted
      const varLink = screen.getByRole('link', { name: /variables & types/i });
      expect(varLink).not.toHaveClass('bg-purple-600');

      const funcLink = screen.getByRole('link', { name: /functions/i });
      expect(funcLink).not.toHaveClass('bg-purple-600');
    });

    it('should maintain group expansion state independently', async () => {
      const user = userEvent.setup();

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Expand Intermediate
      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });
      await user.click(intermediateButton);
      expect(screen.getByText('Interfaces')).toBeInTheDocument();

      // Collapse Beginner
      const beginnerButton = screen.getByRole('button', { name: /beginner/i });
      await user.click(beginnerButton);
      expect(screen.queryByText('Variables & Types')).not.toBeInTheDocument();

      // Intermediate should still be expanded
      expect(screen.getByText('Interfaces')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const sidebar = screen.getByRole('navigation', { name: /lesson navigation/i });
      expect(sidebar).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /close sidebar/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Progress Bar Rendering', () => {
    it('should render progress bars for each difficulty group', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Check that progress bars are rendered with correct labels
      // The ProgressBar component renders labels in format "{label} ({completed}/{total})"
      expect(screen.getByText('Beginner (1/2)')).toBeInTheDocument();
      expect(screen.getByText('Intermediate (0/1)')).toBeInTheDocument();
      expect(screen.getByText('Advanced (0/0)')).toBeInTheDocument();
    });

    it('should call getGroupProgress for each difficulty group', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      expect(mockGetGroupProgress).toHaveBeenCalledWith('beginner', mockAllLessons);
      expect(mockGetGroupProgress).toHaveBeenCalledWith('intermediate', mockAllLessons);
      expect(mockGetGroupProgress).toHaveBeenCalledWith('advanced', mockAllLessons);
    });

    it('should display correct progress counts from getGroupProgress', () => {
      // Set up specific mock return values
      mockGetGroupProgress.mockImplementation((difficulty: string) => {
        if (difficulty === 'beginner') return { completed: 2, total: 3 };
        if (difficulty === 'intermediate') return { completed: 1, total: 2 };
        if (difficulty === 'advanced') return { completed: 0, total: 1 };
        return { completed: 0, total: 0 };
      });

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      expect(screen.getByText('Beginner (2/3)')).toBeInTheDocument();
      expect(screen.getByText('Intermediate (1/2)')).toBeInTheDocument();
      expect(screen.getByText('Advanced (0/1)')).toBeInTheDocument();
    });

    it('should render progress bar containers', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      // Check for progress bar containers (ProgressBar uses data-testid="progress-container")
      const progressContainers = screen.getAllByTestId('progress-container');
      expect(progressContainers).toHaveLength(3); // One for each difficulty group
    });
  });

  describe('Reset Progress Button', () => {
    it('should render Reset Progress button at bottom of sidebar', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset.*progress/i });
      expect(resetButton).toBeInTheDocument();
    });

    it('should show confirmation dialog when Reset Progress is clicked', async () => {
      const user = userEvent.setup();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset.*progress/i });
      await user.click(resetButton);

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to reset all progress? This cannot be undone.'
      );

      confirmSpy.mockRestore();
    });

    it('should call resetProgress when user confirms', async () => {
      const user = userEvent.setup();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset.*progress/i });
      await user.click(resetButton);

      expect(mockResetProgress).toHaveBeenCalledTimes(1);

      confirmSpy.mockRestore();
    });

    it('should NOT call resetProgress when user cancels', async () => {
      const user = userEvent.setup();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset.*progress/i });
      await user.click(resetButton);

      expect(mockResetProgress).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('should have reset button styled with purple text', () => {
      render(
        <Sidebar
          isOpen={true}
          onClose={mockOnClose}
          currentSlug="variables-and-types"
          lessonGroups={mockLessonGroups}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset.*progress/i });
      expect(resetButton.className).toContain('text-purple-300');
    });
  });
});
