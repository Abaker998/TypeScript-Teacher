'use client';

import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '@/types/lesson';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: () => void;
  onSkip: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onSkip }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>(
    Array(questions.length).fill(false)
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect'>('correct');

  const question = questions[currentQuestion];
  const isAnswerCorrect = selectedAnswer === question.correctIndex;
  const hasAnsweredThisQuestion = answeredCorrectly[currentQuestion];
  const allQuestionsAnswered = answeredCorrectly.every((val) => val === true);

  const handleSelectAnswer = (index: number) => {
    if (!hasAnsweredThisQuestion) {
      setSelectedAnswer(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    if (isAnswerCorrect) {
      const updated = [...answeredCorrectly];
      updated[currentQuestion] = true;
      setAnsweredCorrectly(updated);
      setFeedbackType('correct');
      setShowFeedback(true);
    } else {
      setFeedbackType('incorrect');
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    if (allQuestionsAnswered && currentQuestion === questions.length - 1 && showFeedback) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allQuestionsAnswered, currentQuestion, questions.length, showFeedback, onComplete]);

  // Celebration screen
  if (allQuestionsAnswered && currentQuestion === questions.length - 1 && showFeedback) {
    return (
      <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl animate-bounce">✓</span>
        </div>
        <h2 className="text-xl font-bold text-teal-900 dark:text-teal-300 mb-2">Quiz Complete!</h2>
        <p className="text-teal-700 dark:text-teal-400">Moving to practice exercises...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">Quick Check</span>
          </div>
          <div className="flex items-center gap-1.5">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentQuestion
                    ? 'bg-indigo-500'
                    : answeredCorrectly[idx]
                    ? 'bg-teal-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Question */}
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">{question.question}</h4>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctIndex;
            const showCorrect = hasAnsweredThisQuestion && feedbackType === 'correct' && isCorrectAnswer;
            const showWrong = feedbackType === 'incorrect' && isSelected && showFeedback;

            return (
              <label
                key={index}
                className={`
                  flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all text-sm
                  ${showCorrect ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : ''}
                  ${showWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : ''}
                  ${!showCorrect && !showWrong && isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : ''}
                  ${!showCorrect && !showWrong && !isSelected ? 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700' : ''}
                  ${hasAnsweredThisQuestion && feedbackType === 'correct' ? 'cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={isSelected}
                  onChange={() => handleSelectAnswer(index)}
                  disabled={hasAnsweredThisQuestion && feedbackType === 'correct'}
                  className="sr-only"
                />
                <div className={`
                  w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0
                  ${showCorrect ? 'border-teal-500 bg-teal-500' : ''}
                  ${showWrong ? 'border-red-500 bg-red-500' : ''}
                  ${!showCorrect && !showWrong && isSelected ? 'border-indigo-500 bg-indigo-500' : ''}
                  ${!showCorrect && !showWrong && !isSelected ? 'border-slate-300' : ''}
                `}>
                  {(isSelected || showCorrect) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                </div>
                <span className={`
                  ${showCorrect ? 'text-teal-900 dark:text-teal-300' : ''}
                  ${showWrong ? 'text-red-900 dark:text-red-300' : ''}
                  ${!showCorrect && !showWrong ? 'text-slate-700 dark:text-slate-300' : ''}
                `}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`p-3 rounded-lg mb-4 text-sm ${
              feedbackType === 'correct'
                ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700'
                : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 animate-shake'
            }`}
          >
            {feedbackType === 'correct' ? (
              <div>
                <p className="font-semibold text-teal-800 dark:text-teal-300">Correct!</p>
                {question.explanation && (
                  <p className="text-teal-700 dark:text-teal-400 mt-1 text-xs">{question.explanation}</p>
                )}
              </div>
            ) : (
              <p className="font-semibold text-red-800 dark:text-red-300">Not quite. Try again!</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleCheckAnswer}
            disabled={selectedAnswer === null || (hasAnsweredThisQuestion && feedbackType === 'correct')}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${selectedAnswer === null || (hasAnsweredThisQuestion && feedbackType === 'correct')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }
            `}
          >
            {showFeedback && feedbackType === 'incorrect' ? 'Try Again' : 'Check'}
          </button>

          <div className="flex items-center gap-3">
            {hasAnsweredThisQuestion && feedbackType === 'correct' && (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all text-sm"
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            )}
            <button
              onClick={onSkip}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-xs"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
