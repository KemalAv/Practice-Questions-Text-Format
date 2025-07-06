
import React from 'react';
import { Button } from './Button';
import { PlusIcon, HomeIcon, ShuffleIcon } from '../constants'; // Added ShuffleIcon
import { useLocalization } from '../hooks/useLocalization';

interface MultipleChoiceInputAreaProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onCreateMCQs: () => void;
  onGoToMainMenu: () => void;
  parsingError: string | null;
  isOrderRandom: boolean;
  onSetOrder: (isRandom: boolean) => void;
}

export const MultipleChoiceInputArea: React.FC<MultipleChoiceInputAreaProps> = ({
  inputText,
  onInputChange,
  onCreateMCQs,
  onGoToMainMenu,
  parsingError,
  isOrderRandom,
  onSetOrder,
}) => {
  const { t } = useLocalization();

  const exampleFormat = t('mcqInputArea_exampleMCQ');

  return (
    <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {t('mcqInputArea_title')}
        </h2>
         <Button
            onClick={onGoToMainMenu}
            variant="ghost"
            size="sm"
            leftIcon={<HomeIcon className="w-4 h-4" />}
            title={t('common_backToMainMenuButton')}
          >
           <></>
          </Button>
      </div>

      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-slate-50 dark:bg-gray-750">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('common_setOrderPreference_inputArea')}
        </p>
        <div className="flex space-x-2">
          <Button
            onClick={() => onSetOrder(true)}
            variant={isOrderRandom ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={<ShuffleIcon className="w-4 h-4" />}
            aria-pressed={isOrderRandom}
            className="flex-1"
          >
            {t('common_order_random')}
          </Button>
          <Button
            onClick={() => onSetOrder(false)}
            variant={!isOrderRandom ? 'primary' : 'secondary'}
            size="sm"
            // Optional: Add a sequential icon here if available
            // leftIcon={<SequentialIcon className="w-4 h-4" />}
            aria-pressed={!isOrderRandom}
            className="flex-1"
          >
            {t('common_order_sequential')}
          </Button>
        </div>
      </div>

      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        {t('mcqInputArea_instructionFormat')}
      </p>
      <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-xs text-gray-700 dark:text-gray-300 mb-4 overflow-x-auto" aria-label="Contoh format input MCQ">
        {exampleFormat}
      </pre>
      <textarea
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={t('mcqInputArea_placeholder')}
        rows={12}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 resize-none"
        aria-label={t('mcqInputArea_placeholder')}
      />
      {parsingError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{parsingError}</p>
      )}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
         <Button
          onClick={onGoToMainMenu}
          variant="secondary"
          className="w-full sm:w-auto"
          leftIcon={<HomeIcon className="w-5 h-5" />} 
        >
          {t('common_backToMainMenuButton')}
        </Button>
        <Button
          onClick={onCreateMCQs}
          disabled={!inputText.trim()}
          className="w-full sm:flex-grow"
          leftIcon={<PlusIcon />}
        >
          {t('mcqInputArea_createButton')}
        </Button>
      </div>
    </div>
  );
};
