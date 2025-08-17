import React from 'react';
import { Flashcard } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { PrevIcon, NextIcon, EyeOpenIcon, EyeSlashIcon, HomeIcon } from '../constants'; // ShuffleIcon removed
import { useLocalization } from '../hooks/useLocalization';
import { ContentRenderer } from './ContentRenderer';

interface FlashcardReviewAreaProps {
  card: Flashcard | null;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  onNextCard: () => void;
  onPreviousCard: () => void;
  onStartNewSet: () => void; 
  onGoToMainMenu: () => void; 
  currentIndex: number;
  totalCards: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isOrderRandom: boolean;
  isLatexEnabled: boolean;
}

export const FlashcardReviewArea: React.FC<FlashcardReviewAreaProps> = ({
  card,
  showAnswer,
  onToggleAnswer,
  onNextCard,
  onPreviousCard,
  onStartNewSet,
  onGoToMainMenu,
  currentIndex,
  totalCards,
  canGoPrevious,
  isOrderRandom,
  isLatexEnabled,
}) => {
  const { t } = useLocalization();

  if (!card) { 
    return (
      <div className="text-center p-8 text-gray-700 dark:text-gray-300">
        <p className="text-xl">{t('reviewArea_noCardsMessage')}</p>
        <div className="mt-4 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center">
            <Button onClick={onStartNewSet} variant="primary">
            {t('reviewArea_startNewSetButton')}
            </Button>
            <Button onClick={onGoToMainMenu} variant="secondary" leftIcon={<HomeIcon />}>
            {t('common_backToMainMenuButton')}
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl flex flex-col items-center space-y-6 p-4">
      <div className="w-full flex justify-between items-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {t('reviewArea_cardLabel', currentIndex + 1, totalCards)}
        </p>
         <div className="flex space-x-2 items-center">
            {/* Shuffle toggle button removed from here */}
            <Button
            onClick={onStartNewSet}
            variant="secondary"
            size="sm"
            >
            {t('reviewArea_startNewSetButton')} 
            </Button>
            <Button
            onClick={onGoToMainMenu}
            variant="ghost"
            size="sm"
            leftIcon={<HomeIcon className="w-4 h-4"/>}
            title={t('common_backToMainMenuButton')}
            >
            <></>
            </Button>
         </div>
      </div>

      <div className="w-full aspect-[3/2] sm:aspect-[2/1]">
        <Card className="w-full h-full">
          <ContentRenderer
            content={card.soal}
            isLatexEnabled={isLatexEnabled}
            className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 break-words"
          />
          {showAnswer && (
            <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900 rounded-md w-full">
               <ContentRenderer
                  content={card.jawaban}
                  isLatexEnabled={isLatexEnabled}
                  className="text-md md:text-lg text-indigo-700 dark:text-indigo-300 break-words"
                />
            </div>
          )}
        </Card>
      </div>

      <Button
        onClick={onToggleAnswer}
        variant="ghost"
        className="w-full sm:w-auto"
        leftIcon={showAnswer ? <EyeSlashIcon /> : <EyeOpenIcon />}
        aria-pressed={showAnswer}
      >
        {showAnswer ? t('reviewArea_toggleAnswerHide') : t('reviewArea_toggleAnswerShow')}
      </Button>

      <div className="w-full grid grid-cols-2 gap-4 pt-4">
        <Button
          onClick={onPreviousCard}
          disabled={!canGoPrevious && totalCards > 1}
          className="w-full"
          leftIcon={<PrevIcon />}
        >
          {t('reviewArea_previousButton')}
        </Button>
        <Button
          onClick={onNextCard}
          disabled={totalCards <= 1} 
          className="w-full"
          rightIcon={<NextIcon />}
        >
          {t('reviewArea_nextButton')}
        </Button>
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