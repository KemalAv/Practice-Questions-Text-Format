import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { HomeIcon, NextIcon, PrevIcon } from '../constants'; // ShuffleIcon removed
import { useLocalization } from '../hooks/useLocalization';
import { MultipleChoiceQuestion } from '../types';
import { ContentRenderer } from './ContentRenderer';

interface MultipleChoiceReviewAreaProps {
  mcqs: MultipleChoiceQuestion[];
  currentMCQIndex: number;
  score: number;
  onAnswerSubmit: (questionId: string, selectedOptionIndex: number) => boolean; // Returns true if correct
  onNextMCQ: () => void;
  onGoToMainMenu: () => void;
  onStartNewMCQSet: () => void; // To go back to MCQ input
  isQuizComplete: boolean;
  onRestartQuiz: () => void;
  isOrderRandom: boolean;
  userAnswers: Record<string, number>;
  isLatexEnabled: boolean;
}

export const MultipleChoiceReviewArea: React.FC<MultipleChoiceReviewAreaProps> = ({
  mcqs,
  currentMCQIndex,
  score,
  onAnswerSubmit,
  onNextMCQ,
  onGoToMainMenu,
  onStartNewMCQSet,
  isQuizComplete,
  onRestartQuiz,
  isOrderRandom,
  userAnswers,
  isLatexEnabled,
}) => {
  const { t, language } = useLocalization(); 
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState<boolean | null>(null);

  const currentMCQ = mcqs[currentMCQIndex];

  useEffect(() => {
    setSelectedOptionIndex(null);
    setShowFeedback(false);
    setIsCurrentAnswerCorrect(null);
  }, [currentMCQIndex, mcqs]); 

  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="text-center p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md">
        <h2 className="text-2xl font-semibold mb-3 text-red-600 dark:text-red-400">{t('mcqReviewArea_oopsNoMCQs')}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{t('mcqReviewArea_oopsProblemMCQ')}</p>
        <div className="mt-6 space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row justify-center">
            <Button onClick={onStartNewMCQSet} variant="primary">
                {t('mcqReviewArea_createNewMCQSetButton')}
            </Button>
            <Button onClick={onGoToMainMenu} variant="secondary" leftIcon={<HomeIcon />}>
                {t('common_backToMainMenuButton')}
            </Button>
        </div>
      </div>
    );
  }


  const handleOptionSelect = (index: number) => {
    if (!showFeedback) { 
      setSelectedOptionIndex(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOptionIndex === null || !currentMCQ) return;
    const correct = onAnswerSubmit(currentMCQ.id, selectedOptionIndex);
    setIsCurrentAnswerCorrect(correct);
    setShowFeedback(true);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  if (isQuizComplete) {
    const percentage = mcqs.length > 0 ? Math.round((score / mcqs.length) * 100) : 0;

    return (
      <div className="w-full max-w-3xl p-4 md:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-indigo-600 dark:text-indigo-400">{t('mcqReviewArea_quizCompleteTitle')}</h2>
        <p className="text-xl mb-4 text-center font-semibold text-gray-700 dark:text-gray-300">
          {t('mcqReviewArea_finalScore', score, mcqs.length)} ({percentage}%)
        </p>
        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
          {mcqs.map((mcq, index) => {
            const userAnswerIndex = userAnswers[mcq.id];
            const correctAnswerIndex = mcq.correctAnswerIndex;
            const isCorrect = userAnswerIndex === correctAnswerIndex;

            return (
              <div key={mcq.id} className="p-4 bg-slate-50 dark:bg-gray-900/50 rounded-lg">
                <div className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200 break-words flex items-start" lang={language === 'id' ? 'id' : 'en'}>
                  <span className="font-bold mr-2">{index + 1}.</span>
                  <ContentRenderer
                    content={mcq.question}
                    isLatexEnabled={isLatexEnabled}
                    className="flex-1"
                  />
                </div>
                <div className="space-y-2">
                  {mcq.options.map((option, optionIndex) => {
                    let styles = "p-3 rounded-md text-left w-full text-sm flex items-start border-2";
                    const isUserAnswer = optionIndex === userAnswerIndex;
                    const isCorrectAnswer = optionIndex === correctAnswerIndex;

                    if (isCorrectAnswer) {
                      styles += " bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 font-semibold border-green-500/80";
                    } else if (isUserAnswer && !isCorrect) {
                      styles += " bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 font-semibold border-red-500/80";
                    } else {
                      styles += " bg-slate-200/60 dark:bg-gray-700/60 border-transparent";
                    }
                    
                    return (
                      <div key={optionIndex} className={styles} lang={language === 'id' ? 'id' : 'en'}>
                        <span className="font-bold mr-2">{optionLetters[optionIndex]}.</span>
                        <ContentRenderer
                          content={option}
                          isLatexEnabled={isLatexEnabled}
                          className="flex-1"
                        />
                      </div>
                    );
                  })}
                </div>
                {mcq.explanation && (
                  <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-md border-l-4 border-indigo-400">
                    <h4 className="font-semibold text-sm text-indigo-800 dark:text-indigo-200 mb-1">{t('mcqReviewArea_explanationLabel')}</h4>
                    <ContentRenderer
                      content={mcq.explanation}
                      isLatexEnabled={isLatexEnabled}
                      className="text-sm text-indigo-700 dark:text-indigo-300"
                      lang={language === 'id' ? 'id' : 'en'}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row justify-center items-center">
          <Button onClick={onRestartQuiz} variant="primary" size="lg" leftIcon={<PrevIcon />}>
            {t('mcqReviewArea_restartQuizButton')}
          </Button>
          <Button onClick={onStartNewMCQSet} variant="secondary" size="lg">
            {t('mcqReviewArea_createNewMCQSetButton')}
          </Button>
          <Button onClick={onGoToMainMenu} variant="ghost" size="lg" leftIcon={<HomeIcon />}>
            {t('common_backToMainMenuButton')}
          </Button>
        </div>
      </div>
    );
  }
  
  if (!currentMCQ) {
     return <div className="text-center p-6"><p>{t('mcqReviewArea_noMCQsMessage')}</p></div>;
  }


  return (
    <div className="w-full max-w-2xl p-4 flex flex-col items-center space-y-6">
      <div className="w-full flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('mcqReviewArea_questionLabel', currentMCQIndex + 1, mcqs.length)}</span>
        <div className="flex space-x-2 items-center">
            {/* Shuffle toggle button removed from here */}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('mcqReviewArea_scoreLabel', score, currentMCQIndex)}</span>
        </div>
      </div>

      <Card className="w-full p-6">
        <ContentRenderer
          content={currentMCQ.question}
          isLatexEnabled={isLatexEnabled}
          className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 break-words"
          lang={language === 'id' ? 'id' : 'en'}
        />
        <div className="space-y-3">
          {currentMCQ.options.map((option, index) => {
            let buttonStyle = "w-full text-left justify-start py-3 h-auto"; // Set height to auto
            let variant: 'primary' | 'secondary' | 'danger' = 'secondary'; 

            if (showFeedback) {
              if (index === currentMCQ.correctAnswerIndex) {
                buttonStyle += " bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold";
                variant = 'primary'; 
              } else if (index === selectedOptionIndex && !isCurrentAnswerCorrect) {
                buttonStyle += " bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold";
                variant = 'danger';
              } else {
                 buttonStyle += " opacity-60 cursor-not-allowed bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400";
              }
            } else if (index === selectedOptionIndex) {
              buttonStyle += " ring-2 ring-indigo-500 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-gray-800 bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100";
              variant = 'primary';
            } else {
              buttonStyle += " bg-white dark:bg-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200";
            }


            return (
              <Button
                key={index}
                variant={variant} 
                className={buttonStyle}
                onClick={() => handleOptionSelect(index)}
                disabled={showFeedback}
                aria-pressed={selectedOptionIndex === index}
              >
                <span className="font-semibold mr-2 self-start pt-1">{optionLetters[index]}.</span> 
                <ContentRenderer
                  content={option}
                  isLatexEnabled={isLatexEnabled}
                  className="inline-block text-left flex-1"
                  lang={language === 'id' ? 'id' : 'en'}
                />
              </Button>
            );
          })}
        </div>
      </Card>

      {showFeedback && (
        <div className={`p-3 rounded-md w-full text-center font-semibold ${isCurrentAnswerCorrect ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'}`}>
          {isCurrentAnswerCorrect ? t('mcqReviewArea_feedbackCorrect') : t('mcqReviewArea_feedbackIncorrect', optionLetters[currentMCQ.correctAnswerIndex] + ". " + currentMCQ.options[currentMCQ.correctAnswerIndex])}
        </div>
      )}

      {showFeedback && currentMCQ.explanation && (
        <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg w-full shadow">
          <h4 className="font-semibold text-md text-gray-700 dark:text-gray-200 mb-1.5">{t('mcqReviewArea_explanationLabel')}</h4>
          <ContentRenderer
            content={currentMCQ.explanation}
            isLatexEnabled={isLatexEnabled}
            className="text-sm text-gray-600 dark:text-gray-300"
            lang={language === 'id' ? 'id' : 'en'}
          />
        </div>
      )}


      <div className="w-full flex flex-col sm:flex-row gap-4 mt-2">
        {!showFeedback ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedOptionIndex === null}
            className="w-full sm:flex-1"
            size="lg"
          >
            {t('mcqReviewArea_submitAnswerButton')}
          </Button>
        ) : (
          <Button
            onClick={onNextMCQ}
            className="w-full sm:flex-1"
            rightIcon={<NextIcon />}
            size="lg"
          >
            {t('mcqReviewArea_nextQuestionButton')}
          </Button>
        )}
      </div>
       <div className="w-full pt-4">
        <Button
            onClick={onGoToMainMenu}
            variant="secondary"
            className="w-full"
            leftIcon={<HomeIcon />}
            >
            {t('common_backToMainMenuButton')}
        </Button>
      </div>
    </div>
  );
};