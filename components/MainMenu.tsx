

import React from 'react';
import { Button } from './Button';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from './Card'; 
// ShuffleIcon removed as the toggle is no longer here

interface MainMenuProps {
  onSelectFlashcard: () => void;
  onSelectMultipleChoice: () => void;
  isLatexEnabled: boolean;
  onToggleLatex: (enabled: boolean) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  onSelectFlashcard, 
  onSelectMultipleChoice,
  isLatexEnabled,
  onToggleLatex
}) => {
  const { t } = useLocalization();

  return (
    <div className="w-full max-w-md p-4 flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        {t('mainMenu_title')}
      </h2>
      
      <div className="w-full space-y-6"> {/* Adjusted spacing */}
        
        <div className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-slate-50 dark:bg-gray-750">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('mainMenu_latexSupport')}
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={() => onToggleLatex(true)}
              variant={isLatexEnabled ? 'primary' : 'secondary'}
              size="sm"
              aria-pressed={isLatexEnabled}
              className="flex-1"
            >
              {t('common_enabled')}
            </Button>
            <Button
              onClick={() => onToggleLatex(false)}
              variant={!isLatexEnabled ? 'primary' : 'secondary'}
              size="sm"
              aria-pressed={!isLatexEnabled}
              className="flex-1"
            >
              {t('common_disabled')}
            </Button>
          </div>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
          {t('mainMenu_selectMode')}
        </p>
        <Card className="hover:shadow-xl transition-shadow duration-200">
          <div className="p-2">
            <h3 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">{t('mainMenu_flashcardButton')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('mainMenu_flashcardDescription')}</p>
            <Button onClick={onSelectFlashcard} variant="primary" size="lg" className="w-full">
              {t('mainMenu_flashcardButton')}
            </Button>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-200">
          <div className="p-2">
            <h3 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">{t('mainMenu_mcqButton')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('mainMenu_mcqDescription')}</p>
            <Button 
              onClick={onSelectMultipleChoice} 
              variant="primary"
              size="lg" 
              className="w-full"
            >
              {t('mainMenu_mcqButton')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};