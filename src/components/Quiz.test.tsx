import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Quiz } from './Quiz';
import { QuizQuestion } from '@/types/lesson';

describe('Quiz', () => {
  const mockQuestions: QuizQuestion[] = [
    {
      question: 'What is the correct way to declare a string variable?',
      options: [
        "let name: string = 'Alice';",
        "let name = string('Alice');",
        "string name = 'Alice';",
        "var name: String = 'Alice';",
      ],
      correctIndex: 0,
      explanation: 'TypeScript uses a colon followed by the type name after the variable.',
    },
    {
      question: 'Which keyword should be used for constants?',
      options: ['let', 'const', 'var', 'static'],
      correctIndex: 1,
      explanation: 'const is used to declare constants that cannot be reassigned.',
    },
  ];

  const mockOnComplete = jest.fn();
  const mockOnSkip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('State Initialization', () => {
    it('renders the first question on mount', () => {
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(screen.getByText(mockQuestions[0].question)).toBeInTheDocument();
    });

    it('displays question counter', () => {
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    });

    it('renders all answer options as radio buttons', () => {
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      mockQuestions[0].options.forEach((option) => {
        expect(screen.getByLabelText(option)).toBeInTheDocument();
      });
    });
  });

  describe('Answer Selection', () => {
    it('allows selecting an answer option', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const firstOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(firstOption);

      expect(firstOption).toBeChecked();
    });

    it('enables Check Answer button only when an option is selected', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      expect(checkButton).toBeDisabled();

      const firstOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(firstOption);

      expect(checkButton).not.toBeDisabled();
    });

    it('allows changing the selected answer', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const firstOption = screen.getByLabelText(mockQuestions[0].options[0]);
      const secondOption = screen.getByLabelText(mockQuestions[0].options[1]);

      await user.click(firstOption);
      expect(firstOption).toBeChecked();

      await user.click(secondOption);
      expect(secondOption).toBeChecked();
      expect(firstOption).not.toBeChecked();
    });
  });

  describe('Correct Answer Logic', () => {
    it('shows success feedback when correct answer is selected', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText('Correct!')).toBeInTheDocument();
      });
    });

    it('displays explanation after correct answer', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText(mockQuestions[0].explanation!)).toBeInTheDocument();
      });
    });

    it('shows Next button after correct answer', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      });
    });
  });

  describe('Incorrect Answer Logic', () => {
    it('shows error feedback when incorrect answer is selected', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const incorrectOption = screen.getByLabelText(mockQuestions[0].options[1]);
      await user.click(incorrectOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
      });
    });

    it('allows retry on incorrect answer without advancing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const incorrectOption = screen.getByLabelText(mockQuestions[0].options[1]);
      await user.click(incorrectOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
      });

      // Should still show same question counter
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
      expect(screen.getByText(mockQuestions[0].question)).toBeInTheDocument();
    });

    it('allows selecting correct answer after incorrect attempt', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // First try incorrect answer
      const incorrectOption = screen.getByLabelText(mockQuestions[0].options[1]);
      await user.click(incorrectOption);

      let checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText('Try again!')).toBeInTheDocument();
      });

      // Now select correct answer
      const correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      // After selecting a different answer, the button should be available
      checkButton = screen.getByRole('button', { name: /try another/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText('Correct!')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation and Progression', () => {
    it('advances to next question when Next button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Answer first question correctly
      const correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      // Click Next
      const nextButton = await screen.findByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should show second question
      await waitFor(() => {
        expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
        expect(screen.getByText(mockQuestions[1].question)).toBeInTheDocument();
      });
    });

    it('calls onComplete automatically after all questions are answered correctly', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Answer first question
      let correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      let checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText('Correct!')).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Answer second question
      correctOption = screen.getByLabelText(mockQuestions[1].options[1]);
      await user.click(correctOption);

      checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      // Should show Quiz Complete screen
      await waitFor(() => {
        expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
      });

      // The component auto-advances after 1.5 seconds
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(mockOnComplete).toHaveBeenCalled();
    });

    it('displays Quiz Complete message after all questions', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Answer first question
      let correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      let checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      const nextButton = await screen.findByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Answer second question
      await waitFor(() => {
        expect(screen.getByLabelText(mockQuestions[1].options[1])).toBeInTheDocument();
      });

      correctOption = screen.getByLabelText(mockQuestions[1].options[1]);
      await user.click(correctOption);

      checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText(/quiz complete/i)).toBeInTheDocument();
      });
    });
  });

  describe('Skip Functionality', () => {
    it('displays Skip Quiz link', () => {
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(screen.getByRole('button', { name: /skip quiz/i })).toBeInTheDocument();
    });

    it('calls onSkip when skip button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const skipButton = screen.getByRole('button', { name: /skip quiz/i });
      await user.click(skipButton);

      expect(mockOnSkip).toHaveBeenCalled();
    });
  });

  describe('UI Layout', () => {
    it('displays question in bold', () => {
      const { container } = render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const questionText = container.querySelector('[class*="font-bold"]');
      expect(questionText).toBeInTheDocument();
    });

    it('renders options as radio buttons in card-styled containers', () => {
      const { container } = render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const radioButtons = container.querySelectorAll('input[type="radio"]');
      expect(radioButtons.length).toBe(4);
    });

    it('disables radio buttons and Check Answer button after correct answer', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        const radioButtons = screen.getAllByRole('radio');
        radioButtons.forEach((radio) => {
          expect(radio).toBeDisabled();
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles questions without explanations', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const questionsWithoutExplanation: QuizQuestion[] = [
        {
          question: 'Simple question?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
        },
      ];

      render(
        <Quiz
          questions={questionsWithoutExplanation}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      const correctOption = screen.getByLabelText('A');
      await user.click(correctOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      // Should not crash without explanation and show completion screen
      await waitFor(() => {
        expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
      });

      // Auto-advances to call onComplete
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(mockOnComplete).toHaveBeenCalled();
    });

    it('handles single question quiz', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const singleQuestion: QuizQuestion[] = [mockQuestions[0]];

      render(
        <Quiz questions={singleQuestion} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();

      const correctOption = screen.getByLabelText(singleQuestion[0].options[0]);
      await user.click(correctOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
      });

      // Auto-advances to call onComplete
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  describe('Feedback Display', () => {
    it('shows shake animation class on incorrect answer', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const incorrectOption = screen.getByLabelText(mockQuestions[0].options[1]);
      await user.click(incorrectOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        const feedbackElement = screen.getByText(/try again/i).closest('div');
        expect(feedbackElement?.className).toMatch(/animate-shake/);
      });
    });

    it('shows green highlight on correct answer', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { container } = render(
        <Quiz questions={mockQuestions} onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const correctOption = screen.getByLabelText(mockQuestions[0].options[0]);
      await user.click(correctOption);

      const checkButton = screen.getByRole('button', { name: /check answer/i });
      await user.click(checkButton);

      await waitFor(() => {
        const feedbackContainer = container.querySelector('.bg-green-50');
        expect(feedbackContainer).toHaveClass('bg-green-50');
      });
    });
  });
});
