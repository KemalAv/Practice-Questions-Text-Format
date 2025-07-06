
import React from 'react';
import { Button } from './Button';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from './Card'; 
// ShuffleIcon removed as the toggle is no longer here

interface MainMenuProps {
  onSelectFlashcard: () => void;
  onSelectMultipleChoice: () => void;
  // isOrderRandom: boolean; // Removed
  // onToggleOrder: () => void; // Removed
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  onSelectFlashcard, 
  onSelectMultipleChoice,
  // isOrderRandom, // Removed
  // onToggleOrder // Removed
}) => {
  const { t } = useLocalization();

  return (
    <div className="w-full max-w-md p-4 flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        {t('mainMenu_title')}
      </h2>
      
      <div className="w-full space-y-6"> {/* Adjusted spacing */}
        {/* Order preference toggle removed from here */}
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
