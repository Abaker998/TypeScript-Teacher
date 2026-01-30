import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OutputPanel } from './OutputPanel';
import { RunResult, CompileError } from '@/types/lesson';

describe('OutputPanel', () => {
  describe('Loading State', () => {
    it('displays loading message when isLoading is true', () => {
      render(<OutputPanel result={null} isLoading={true} />);
      expect(screen.getByText('Executing...')).toBeInTheDocument();
    });

    it('applies correct styling to loading state', () => {
      const { container } = render(<OutputPanel result={null} isLoading={true} />);
      const loadingDiv = container.querySelector('.text-yellow-400');
      expect(loadingDiv).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays placeholder when result is null and not loading', () => {
      render(<OutputPanel result={null} isLoading={false} />);
      expect(screen.getByText('Click "Run Code" to see output and get feedback')).toBeInTheDocument();
    });

    it('applies placeholder styling correctly', () => {
      const { container } = render(<OutputPanel result={null} isLoading={false} />);
      const placeholderDiv = container.querySelector('.text-gray-400');
      expect(placeholderDiv).toBeInTheDocument();
    });
  });

  describe('Successful Execution - Perfect Score', () => {
    it('displays perfect grade when output matches expected', () => {
      const result: RunResult = {
        success: true,
        output: ['Hello, World!'],
        errors: [],
        duration: 42,
      };

      render(<OutputPanel result={result} expectedOutput={['Hello, World!']} />);

      expect(screen.getByText('Perfect!')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('displays output lines correctly', () => {
      const result: RunResult = {
        success: true,
        output: ['Hello, World!', 'Second line'],
        errors: [],
        duration: 42,
      };

      render(<OutputPanel result={result} expectedOutput={['Hello, World!', 'Second line']} />);

      expect(screen.getByText('Hello, World!')).toBeInTheDocument();
      expect(screen.getByText('Second line')).toBeInTheDocument();
    });

    it('displays execution time in milliseconds', () => {
      const result: RunResult = {
        success: true,
        output: ['Output'],
        errors: [],
        duration: 42,
      };

      render(<OutputPanel result={result} />);
      expect(screen.getByText('42ms')).toBeInTheDocument();
    });

    it('calls onSuccess callback when grade is perfect', () => {
      const onSuccess = jest.fn();
      const result: RunResult = {
        success: true,
        output: ['Expected output'],
        errors: [],
        duration: 10,
      };

      render(<OutputPanel result={result} expectedOutput={['Expected output']} onSuccess={onSuccess} />);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('Partial Credit', () => {
    it('displays partial grade when some output matches', () => {
      const result: RunResult = {
        success: true,
        output: ['Correct line', 'Wrong line'],
        errors: [],
        duration: 42,
      };

      render(<OutputPanel result={result} expectedOutput={['Correct line', 'Expected line']} />);

      expect(screen.getByText('Partial Credit')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('shows expected output when grade is not perfect', () => {
      const result: RunResult = {
        success: true,
        output: ['Wrong output'],
        errors: [],
        duration: 42,
      };

      render(<OutputPanel result={result} expectedOutput={['Expected output']} />);

      expect(screen.getByText('Expected Output')).toBeInTheDocument();
      expect(screen.getByText('Expected output')).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('displays error grade when execution fails', () => {
      const result: RunResult = {
        success: false,
        output: [],
        errors: [{ line: 5, column: 10, message: 'Property does not exist' }],
        duration: 25,
      };

      render(<OutputPanel result={result} />);

      // When there are errors, it auto-switches to explain tab
      // Click Output tab to see grade info
      fireEvent.click(screen.getByText('Output'));

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('displays error count correctly', () => {
      const errors: CompileError[] = [
        { line: 1, column: 5, message: 'Error 1' },
        { line: 2, column: 10, message: 'Error 2' },
        { line: 3, column: 15, message: 'Error 3' },
      ];

      const result: RunResult = {
        success: false,
        output: [],
        errors,
        duration: 30,
      };

      render(<OutputPanel result={result} />);
      // When there are errors, it auto-switches to explain tab
      // Click Output tab to see the error count banner
      fireEvent.click(screen.getByText('Output'));
      // Text is split across elements, use regex matcher
      expect(screen.getByText(/3 Errors? Found/i)).toBeInTheDocument();
    });

    it('displays single error count correctly', () => {
      const result: RunResult = {
        success: false,
        output: [],
        errors: [{ line: 1, column: 5, message: 'Single error' }],
        duration: 30,
      };

      render(<OutputPanel result={result} />);
      // When there are errors, it auto-switches to explain tab
      // Click Output tab to see the error count banner
      fireEvent.click(screen.getByText('Output'));
      // Text is split across elements, use regex matcher
      expect(screen.getByText(/1 Error Found/i)).toBeInTheDocument();
    });

    it('displays error messages in the explain tab', () => {
      const errors: CompileError[] = [
        { line: 1, column: 5, message: 'Type mismatch' },
        { line: 2, column: 10, message: 'Unexpected token' },
      ];

      const result: RunResult = {
        success: false,
        output: [],
        errors,
        duration: 35,
      };

      render(<OutputPanel result={result} />);

      // Error messages appear in multiple places (explanation and technical error)
      // For unknown errors, message is shown as the explanation
      const typeMismatchElements = screen.getAllByText('Type mismatch');
      const unexpectedTokenElements = screen.getAllByText('Unexpected token');

      expect(typeMismatchElements.length).toBeGreaterThan(0);
      expect(unexpectedTokenElements.length).toBeGreaterThan(0);
    });

    it('displays line and column information', () => {
      const result: RunResult = {
        success: false,
        output: [],
        errors: [{ line: 5, column: 10, message: 'Error message' }],
        duration: 20,
      };

      render(<OutputPanel result={result} />);
      expect(screen.getByText('Line 5:10')).toBeInTheDocument();
    });

    it('shows tips section for errors', () => {
      const result: RunResult = {
        success: false,
        output: [],
        errors: [{ line: 1, column: 1, message: 'Test error' }],
        duration: 20,
      };

      render(<OutputPanel result={result} />);
      // New tip section title
      expect(screen.getByText('💡 How to fix it')).toBeInTheDocument();
    });
  });

  describe('Detailed Comparison', () => {
    it('shows detailed comparison toggle when expected output exists', () => {
      const result: RunResult = {
        success: true,
        output: ['Output line'],
        errors: [],
        duration: 10,
      };

      render(<OutputPanel result={result} expectedOutput={['Output line']} />);
      expect(screen.getByText(/detailed comparison/i)).toBeInTheDocument();
    });

    it('toggles detailed comparison visibility', () => {
      const result: RunResult = {
        success: true,
        output: ['Wrong output'],
        errors: [],
        duration: 10,
      };

      render(<OutputPanel result={result} expectedOutput={['Expected output']} />);

      // Details should be visible by default
      expect(screen.getByText(/Line 1:/)).toBeInTheDocument();

      // Click to hide
      fireEvent.click(screen.getByText(/Hide detailed comparison/i));
      expect(screen.queryByText(/Line 1:/)).not.toBeInTheDocument();
    });
  });

  describe('Solution Display', () => {
    it('shows solution toggle when solution is provided and grade is not perfect', () => {
      const result: RunResult = {
        success: true,
        output: ['Wrong output'],
        errors: [],
        duration: 10,
      };

      render(<OutputPanel result={result} expectedOutput={['Expected output']} solution="console.log('Expected output');" />);
      expect(screen.getByText(/Show solution/i)).toBeInTheDocument();
    });

    it('does not show solution toggle when grade is perfect', () => {
      const result: RunResult = {
        success: true,
        output: ['Expected output'],
        errors: [],
        duration: 10,
      };

      render(<OutputPanel result={result} expectedOutput={['Expected output']} solution="console.log('Expected output');" />);
      expect(screen.queryByText(/Show solution/i)).not.toBeInTheDocument();
    });

    it('toggles solution visibility', () => {
      const result: RunResult = {
        success: true,
        output: ['Wrong output'],
        errors: [],
        duration: 10,
      };

      render(<OutputPanel result={result} expectedOutput={['Expected output']} solution="const x = 1;" />);

      // Solution should be hidden by default
      expect(screen.queryByText('const x = 1;')).not.toBeInTheDocument();

      // Click to show
      fireEvent.click(screen.getByText(/Show solution/i));
      expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });
  });

  describe('Styling and Themes', () => {
    it('uses dark theme background', () => {
      const result: RunResult = {
        success: true,
        output: ['Output'],
        errors: [],
        duration: 10,
      };

      const { container } = render(<OutputPanel result={result} />);
      const outputPanel = container.querySelector('.bg-gray-900');
      expect(outputPanel).toBeInTheDocument();
    });

    it('applies correct text color for light text on dark background', () => {
      const result: RunResult = {
        success: true,
        output: ['Output'],
        errors: [],
        duration: 10,
      };

      const { container } = render(<OutputPanel result={result} />);
      const outputPanel = container.querySelector('.text-gray-100');
      expect(outputPanel).toBeInTheDocument();
    });

    it('renders in monospace font', () => {
      const result: RunResult = {
        success: true,
        output: ['Output'],
        errors: [],
        duration: 10,
      };

      const { container } = render(<OutputPanel result={result} />);
      const outputPanel = container.querySelector('.font-mono');
      expect(outputPanel).toBeInTheDocument();
    });

    it('renders rounded corners on main container', () => {
      const result: RunResult = {
        success: true,
        output: ['Output'],
        errors: [],
        duration: 10,
      };

      const { container } = render(<OutputPanel result={result} />);
      const outputPanel = container.querySelector('.rounded');
      expect(outputPanel).toBeInTheDocument();
    });
  });

  describe('Grade Colors', () => {
    it('applies green styling for perfect grade', () => {
      const result: RunResult = {
        success: true,
        output: ['Match'],
        errors: [],
        duration: 10,
      };

      const { container } = render(<OutputPanel result={result} expectedOutput={['Match']} />);
      expect(container.querySelector('.border-green-400')).toBeInTheDocument();
    });

    it('applies yellow styling for partial grade', () => {
      const result: RunResult = {
        success: true,
        output: ['Match', 'No match'],
        errors: [],
        duration: 10,
      };

      const { container } = render(<OutputPanel result={result} expectedOutput={['Match', 'Different']} />);
      expect(container.querySelector('.border-yellow-500')).toBeInTheDocument();
    });

    it('applies red styling for error grade', () => {
      const result: RunResult = {
        success: false,
        output: [],
        errors: [{ line: 1, column: 1, message: 'Error' }],
        duration: 10,
      };

      const { container } = render(<OutputPanel result={result} />);
      // When there are errors, it auto-switches to explain tab
      // Click Output tab to see the grade styling
      fireEvent.click(screen.getByText('Output'));
      expect(container.querySelector('.border-red-500')).toBeInTheDocument();
    });
  });

  describe('Props and Defaults', () => {
    it('has default isLoading value of false', () => {
      render(<OutputPanel result={null} />);
      expect(screen.getByText('Click "Run Code" to see output and get feedback')).toBeInTheDocument();
    });

    it('accepts isLoading prop and displays loading state', () => {
      render(<OutputPanel result={null} isLoading={true} />);
      expect(screen.getByText('Executing...')).toBeInTheDocument();
    });

    it('displays result when provided', () => {
      const result: RunResult = {
        success: true,
        output: ['Test output'],
        errors: [],
        duration: 5,
      };

      render(<OutputPanel result={result} />);
      expect(screen.getByText('Test output')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty output array with no expected output', () => {
      const result: RunResult = {
        success: true,
        output: [],
        errors: [],
        duration: 0,
      };

      render(<OutputPanel result={result} />);
      expect(screen.getByText('Perfect!')).toBeInTheDocument();
      expect(screen.getByText('Code executed successfully!')).toBeInTheDocument();
    });

    it('handles zero duration', () => {
      const result: RunResult = {
        success: true,
        output: ['Output'],
        errors: [],
        duration: 0,
      };

      render(<OutputPanel result={result} />);
      expect(screen.getByText('0ms')).toBeInTheDocument();
    });

    it('handles large duration values', () => {
      const result: RunResult = {
        success: true,
        output: ['Output'],
        errors: [],
        duration: 5000,
      };

      render(<OutputPanel result={result} />);
      expect(screen.getByText('5000ms')).toBeInTheDocument();
    });

    it('handles output lines with special characters', () => {
      const result: RunResult = {
        success: true,
        output: ['Line with <special> & "characters"'],
        errors: [],
        duration: 10,
      };

      render(<OutputPanel result={result} />);
      expect(screen.getByText('Line with <special> & "characters"')).toBeInTheDocument();
    });

    it('handles very long error messages', () => {
      const longMessage = 'A'.repeat(500);
      const error: CompileError = {
        line: 1,
        column: 1,
        message: longMessage,
      };

      const result: RunResult = {
        success: false,
        output: [],
        errors: [error],
        duration: 10,
      };

      render(<OutputPanel result={result} />);
      // For unknown errors, the message is shown in the explanation
      // Using getAllByText since it appears in both explanation and details
      const elements = screen.getAllByText(longMessage);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
