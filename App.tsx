
import React, { useState, useCallback, useEffect } from 'react';
import { FlashcardInputArea } from './components/FlashcardInputArea';
import { FlashcardReviewArea } from './components/FlashcardReviewArea';
import { MainMenu } from './components/MainMenu';
// import { MultipleChoiceArea } from './components/MultipleChoiceArea'; // To be replaced
import { MultipleChoiceInputArea } from './components/MultipleChoiceInputArea';
import { MultipleChoiceReviewArea } from './components/MultipleChoiceArea'; // Corrected import path
import { Flashcard, AppView, Language, MultipleChoiceQuestion } from './types';
import { useLocalization, TranslationSet } from './hooks/useLocalization'; // TranslationSet import is fine from here
import { translations, formatString } from './translations'; // Import formatString from translations.ts & direct translations
import { Button } from './components/Button';
import { HomeIcon } from './constants';

const parseFlashcardsInternal = (
  text: string, 
  currentLangTranslations: TranslationSet
): { cards: Flashcard[]; error: string | null } => {
  const lines = text.split('\n');
  const cards: Flashcard[] = [];
  let currentSoalText: string | null = null;
  let parsingError: string | null = null;
  let lineNumber = 0;

  const QUESTION_KEYWORD = currentLangTranslations.inputArea_parser_questionKeyword;
  const ANSWER_KEYWORD = currentLangTranslations.inputArea_parser_answerKeyword;
  const COMMON_QUESTION_S = currentLangTranslations.common_question_singular;
  const COMMON_ANSWER_S = currentLangTranslations.common_answer_singular;

  const questionPrefix = `${QUESTION_KEYWORD}:`;
  const answerPrefix = `${ANSWER_KEYWORD}:`;

  for (const line of lines) {
    lineNumber++;
    const trimmedLine = line.trim();
    if (trimmedLine === '') continue;

    if (trimmedLine.startsWith(questionPrefix)) {
      if (currentSoalText !== null) {
        parsingError = formatString(currentLangTranslations.parser_error_lineX_missingAnswerForPreviousQuestion, lineNumber, COMMON_QUESTION_S, currentSoalText);
      }
      currentSoalText = trimmedLine.substring(questionPrefix.length).trim();
      if (!currentSoalText) {
        parsingError = formatString(currentLangTranslations.parser_error_lineX_questionMissingText,lineNumber, QUESTION_KEYWORD, COMMON_QUESTION_S.toLowerCase());
        currentSoalText = null;
      }
    } else if (trimmedLine.startsWith(answerPrefix)) {
      if (currentSoalText === null) {
        parsingError = formatString(currentLangTranslations.parser_error_lineX_answerMissingPreviousQuestion, lineNumber, ANSWER_KEYWORD, QUESTION_KEYWORD);
        continue;
      }
      const currentJawabanText = trimmedLine.substring(answerPrefix.length).trim();
      if (!currentJawabanText) {
        parsingError = formatString(currentLangTranslations.parser_error_lineX_answerMissingText, lineNumber, ANSWER_KEYWORD, COMMON_ANSWER_S.toLowerCase(), COMMON_QUESTION_S, currentSoalText);
        currentSoalText = null; 
        continue;
      }
      cards.push({
        id: crypto.randomUUID(),
        soal: currentSoalText,
        jawaban: currentJawabanText,
      });
      currentSoalText = null;
    } else {
      if (currentSoalText !== null) { // Expecting an answer, but got something else
        parsingError = formatString(currentLangTranslations.parser_error_lineX_unrecognizedFormat, lineNumber, trimmedLine.substring(0, 20), QUESTION_KEYWORD, ANSWER_KEYWORD);
      } else { // Expecting a question
         if (cards.length === 0 && lineNumber === 1 && (trimmedLine.includes(':') && !trimmedLine.startsWith(QUESTION_KEYWORD))) {
             parsingError = formatString(currentLangTranslations.parser_error_lineX_firstLineMustBeQuestion, lineNumber, QUESTION_KEYWORD, trimmedLine.substring(0,20));
         } else if (!trimmedLine.startsWith(QUESTION_KEYWORD)) {
            parsingError = formatString(currentLangTranslations.parser_error_lineX_mustBeQuestion, lineNumber, QUESTION_KEYWORD, trimmedLine.substring(0,20));
         }
      }
    }
  }

  if (currentSoalText !== null) {
    parsingError = formatString(currentLangTranslations.parser_error_lastQuestionMissingAnswer, COMMON_QUESTION_S, currentSoalText, COMMON_ANSWER_S.toLowerCase());
  }

  if (cards.length === 0 && !parsingError && text.trim() !== "") {
    parsingError = formatString(currentLangTranslations.parser_error_noValidPairs, COMMON_QUESTION_S, COMMON_ANSWER_S, QUESTION_KEYWORD, ANSWER_KEYWORD);
  }
  
  return { cards, error: parsingError };
};


const parseMCQsInternal = (
  text: string,
  currentTranslations: TranslationSet
): { mcqs: MultipleChoiceQuestion[]; error: string | null } => {
  const mcqs: MultipleChoiceQuestion[] = [];
  let overallParsingError: string | null = null;

  // Define keywords, making them uppercase for case-insensitive comparison
  const Q_PREFIX_ID_UP = (translations.id.mcqInputArea_parser_questionKeyword + ":").toUpperCase();
  const Q_PREFIX_EN_UP = (translations.en.mcqInputArea_parser_questionKeyword + ":").toUpperCase();
  
  const CORRECT_PREFIX_ID_UP = (translations.id.mcqInputArea_parser_correctAnswerKeyword + ":").toUpperCase();
  const CORRECT_PREFIX_EN_UP = (translations.en.mcqInputArea_parser_correctAnswerKeyword + ":").toUpperCase();

  const EXPL_PREFIX_ID_UP = (translations.id.mcqInputArea_parser_explanationKeyword + ":").toUpperCase();
  const EXPL_PREFIX_EN_UP = (translations.en.mcqInputArea_parser_explanationKeyword + ":").toUpperCase();

  // Regex for option lines: e.g., "A.", "b)", "C:", "d." (case-insensitive for A-D)
  const optionLineRegex = /^\s*([a-dA-D])[\.\)\:]\s*(.*)/i;
  const optionLetters = ['A', 'B', 'C', 'D']; // For mapping correct answer string to index

  const lines = text.split('\n');
  let i = 0; // Current line index

  while (i < lines.length) {
    // Skip empty lines at the beginning of an MCQ block or between MCQs
    if (!lines[i].trim()) {
      i++;
      continue;
    }

    let currentMCQ: Partial<MultipleChoiceQuestion> & { startLineNumber?: number } = { options: [], startLineNumber: i + 1 };
    let currentSectionContentLines: string[] = []; // To hold raw lines for the current section

    // --- 1. Expect Question ---
    const questionLineOriginal = lines[i];
    const questionLineTrimmedUpper = questionLineOriginal.trim().toUpperCase();
    let actualQuestionPrefixLength = 0;

    if (questionLineTrimmedUpper.startsWith(Q_PREFIX_ID_UP)) {
      actualQuestionPrefixLength = translations.id.mcqInputArea_parser_questionKeyword.length + 1;
    } else if (questionLineTrimmedUpper.startsWith(Q_PREFIX_EN_UP)) {
      actualQuestionPrefixLength = translations.en.mcqInputArea_parser_questionKeyword.length + 1;
    }

    if (actualQuestionPrefixLength === 0) { // Current line is not a question start
      if (!overallParsingError) { // Report first error of this kind
        overallParsingError = formatString(currentTranslations.mcq_parser_error_missingQuestion, i + 1, currentTranslations.mcqInputArea_parser_questionKeyword);
      }
      i++; // Move to next line to see if a new question starts there
      continue;
    }

    currentSectionContentLines.push(questionLineOriginal.trim().substring(actualQuestionPrefixLength).trim());
    i++;

    // Read multi-line question content
    while (i < lines.length) {
      const nextLineOriginal = lines[i];
      const nextLineTrimmed = nextLineOriginal.trim();
      const nextLineTrimmedUpper = nextLineTrimmed.toUpperCase();

      // Check if the next line starts a new section or a new question
      const isNextOption = optionLineRegex.test(nextLineTrimmed);
      const isNextCorrect = nextLineTrimmedUpper.startsWith(CORRECT_PREFIX_ID_UP) || nextLineTrimmedUpper.startsWith(CORRECT_PREFIX_EN_UP);
      const isNextExplanation = nextLineTrimmedUpper.startsWith(EXPL_PREFIX_ID_UP) || nextLineTrimmedUpper.startsWith(EXPL_PREFIX_EN_UP);
      const isNewQuestion = nextLineTrimmedUpper.startsWith(Q_PREFIX_ID_UP) || nextLineTrimmedUpper.startsWith(Q_PREFIX_EN_UP);
      
      let breakDueToEmptyLineFollowedByKeyword = false;
      if (!nextLineTrimmed && (i + 1 < lines.length)) {
          const afterEmptyLineTrimmed = lines[i+1].trim();
          const afterEmptyLineTrimmedUpper = afterEmptyLineTrimmed.toUpperCase();
          if (optionLineRegex.test(afterEmptyLineTrimmed) ||
              afterEmptyLineTrimmedUpper.startsWith(CORRECT_PREFIX_ID_UP) || afterEmptyLineTrimmedUpper.startsWith(CORRECT_PREFIX_EN_UP) ||
              afterEmptyLineTrimmedUpper.startsWith(EXPL_PREFIX_ID_UP) || afterEmptyLineTrimmedUpper.startsWith(EXPL_PREFIX_EN_UP) ||
              afterEmptyLineTrimmedUpper.startsWith(Q_PREFIX_ID_UP) || afterEmptyLineTrimmedUpper.startsWith(Q_PREFIX_EN_UP)
          ) {
            breakDueToEmptyLineFollowedByKeyword = true;
          }
      }

      if (isNextOption || isNextCorrect || isNextExplanation || isNewQuestion || breakDueToEmptyLineFollowedByKeyword) {
        break; // End of question section
      }
      currentSectionContentLines.push(nextLineOriginal); // Add raw line to preserve internal newlines/spacing
      i++;
    }
    currentMCQ.question = currentSectionContentLines.join('\n').trim();
    currentSectionContentLines = []; // Reset for next section
    currentMCQ.id = crypto.randomUUID();

    if (!currentMCQ.question) {
      if (!overallParsingError) overallParsingError = formatString(currentTranslations.mcq_parser_error_missingQuestion, currentMCQ.startLineNumber!, currentTranslations.mcqInputArea_parser_questionKeyword);
      // If question text is empty, this MCQ block is likely malformed. We might skip to next Question keyword or let subsequent checks fail.
    }

    // --- 2. Expect Options (up to 4) ---
    currentMCQ.options = [];
    while (i < lines.length && currentMCQ.options.length < 4) {
      const optionLineOriginal = lines[i];
      const optionLineTrimmed = optionLineOriginal.trim();
      
      if (!optionLineTrimmed && currentMCQ.options.length < 4) { // Skip empty lines if we are still looking for an option start
          // but if next line is not an option, then this signals end of options
          if (i + 1 < lines.length && !optionLineRegex.test(lines[i+1].trim())) {
              break;
          }
          i++;
          continue;
      }

      const optionMatch = optionLineTrimmed.match(optionLineRegex);
      if (!optionMatch) { // Not an option line, so options section ends or is malformed.
        break;
      }

      currentSectionContentLines.push(optionMatch[2].trim()); // Text after the "A. " marker
      i++;

      // Read multi-line option content
      while (i < lines.length) {
        const nextOptLineOriginal = lines[i];
        const nextOptLineTrimmed = nextOptLineOriginal.trim();
        const nextOptLineTrimmedUpper = nextOptLineTrimmed.toUpperCase();

        const isAnotherOption = optionLineRegex.test(nextOptLineTrimmed);
        const isCorrect = nextOptLineTrimmedUpper.startsWith(CORRECT_PREFIX_ID_UP) || nextOptLineTrimmedUpper.startsWith(CORRECT_PREFIX_EN_UP);
        const isExplanation = nextOptLineTrimmedUpper.startsWith(EXPL_PREFIX_ID_UP) || nextOptLineTrimmedUpper.startsWith(EXPL_PREFIX_EN_UP);
        const isNewQuestion = nextOptLineTrimmedUpper.startsWith(Q_PREFIX_ID_UP) || nextOptLineTrimmedUpper.startsWith(Q_PREFIX_EN_UP);
        
        let breakOptionDueToEmptyLineFollowedByKeyword = false;
        if (!nextOptLineTrimmed && (i + 1 < lines.length)) {
            const afterEmptyOptLineTrimmed = lines[i+1].trim();
            const afterEmptyOptLineTrimmedUpper = afterEmptyOptLineTrimmed.toUpperCase();
            if (optionLineRegex.test(afterEmptyOptLineTrimmed) ||
                afterEmptyOptLineTrimmedUpper.startsWith(CORRECT_PREFIX_ID_UP) || afterEmptyOptLineTrimmedUpper.startsWith(CORRECT_PREFIX_EN_UP) ||
                afterEmptyOptLineTrimmedUpper.startsWith(EXPL_PREFIX_ID_UP) || afterEmptyOptLineTrimmedUpper.startsWith(EXPL_PREFIX_EN_UP) ||
                afterEmptyOptLineTrimmedUpper.startsWith(Q_PREFIX_ID_UP) || afterEmptyOptLineTrimmedUpper.startsWith(Q_PREFIX_EN_UP)
            ) {
              breakOptionDueToEmptyLineFollowedByKeyword = true;
            }
        }

        if (isAnotherOption || isCorrect || isExplanation || isNewQuestion || breakOptionDueToEmptyLineFollowedByKeyword) {
          break; // End of current option's text
        }
        currentSectionContentLines.push(nextOptLineOriginal);
        i++;
      }
      currentMCQ.options.push(currentSectionContentLines.join('\n').trim());
      currentSectionContentLines = [];
    }

    if (currentMCQ.options.length !== 4 && currentMCQ.question) {
      if (!overallParsingError) overallParsingError = formatString(currentTranslations.mcq_parser_error_missingOption, (currentMCQ.startLineNumber || i), `4 options`, currentMCQ.question || "N/A");
    }

    // --- 3. Expect Correct Answer ---
    let foundCorrectAnsKeyword = false;
    if (i < lines.length) {
      const correctAnsLineOriginal = lines[i];
      const correctAnsLineTrimmed = correctAnsLineOriginal.trim();
      const correctAnsLineTrimmedUpper = correctAnsLineTrimmed.toUpperCase();
      let actualCorrectPrefixLength = 0;

      if (correctAnsLineTrimmedUpper.startsWith(CORRECT_PREFIX_ID_UP)) {
        actualCorrectPrefixLength = translations.id.mcqInputArea_parser_correctAnswerKeyword.length + 1;
        foundCorrectAnsKeyword = true;
      } else if (correctAnsLineTrimmedUpper.startsWith(CORRECT_PREFIX_EN_UP)) {
        actualCorrectPrefixLength = translations.en.mcqInputArea_parser_correctAnswerKeyword.length + 1;
        foundCorrectAnsKeyword = true;
      }
      
      if (foundCorrectAnsKeyword) {
        const val = correctAnsLineTrimmed.substring(actualCorrectPrefixLength).trim().toUpperCase();
        currentMCQ.correctAnswerIndex = optionLetters.indexOf(val);
        if (currentMCQ.correctAnswerIndex === -1) {
          if (!overallParsingError) overallParsingError = formatString(currentTranslations.mcq_parser_error_invalidCorrectAnswer, i + 1, val, currentMCQ.question || "N/A");
        }
        i++; // Consume this line
      } else if (currentMCQ.question && currentMCQ.options.length === 4 && correctAnsLineTrimmed) { // If there's content but not the keyword
         if(!overallParsingError) overallParsingError = formatString(currentTranslations.mcq_parser_error_missingCorrectAnswer, i + 1, currentTranslations.mcqInputArea_parser_correctAnswerKeyword, currentMCQ.question || "N/A");
      }
    }
     if (!foundCorrectAnsKeyword && currentMCQ.question && currentMCQ.options.length === 4) { // Keyword not found at all
        // If an error hasn't been set by the block above (e.g. current line was empty)
        if (!overallParsingError) overallParsingError = formatString(currentTranslations.mcq_parser_error_missingCorrectAnswer, i, currentTranslations.mcqInputArea_parser_correctAnswerKeyword, currentMCQ.question || "N/A");
    }


    // --- 4. Expect Explanation (Optional) ---
    if (i < lines.length) {
      const explLineOriginal = lines[i];
      const explLineTrimmed = explLineOriginal.trim();
      const explLineTrimmedUpper = explLineTrimmed.toUpperCase();
      let actualExplPrefixLength = 0;

      if (explLineTrimmedUpper.startsWith(EXPL_PREFIX_ID_UP)) {
        actualExplPrefixLength = translations.id.mcqInputArea_parser_explanationKeyword.length + 1;
      } else if (explLineTrimmedUpper.startsWith(EXPL_PREFIX_EN_UP)) {
        actualExplPrefixLength = translations.en.mcqInputArea_parser_explanationKeyword.length + 1;
      }

      if (actualExplPrefixLength > 0) {
        currentSectionContentLines.push(explLineTrimmed.substring(actualExplPrefixLength).trim());
        i++;
        // Read multi-line explanation
        while (i < lines.length) {
          const nextExplLineOriginal = lines[i];
          const nextExplLineTrimmed = nextExplLineOriginal.trim();
          const nextExplLineTrimmedUpper = nextExplLineTrimmed.toUpperCase();
          
          const isNewQuestionStarting = nextExplLineTrimmedUpper.startsWith(Q_PREFIX_ID_UP) || nextExplLineTrimmedUpper.startsWith(Q_PREFIX_EN_UP);
          let breakExplDueToEmptyLineFollowedByNewQ = false;
          if(!nextExplLineTrimmed && (i+1 < lines.length)) {
              const afterEmptyExplLineTrimmedUpper = lines[i+1].trim().toUpperCase();
              if(afterEmptyExplLineTrimmedUpper.startsWith(Q_PREFIX_ID_UP) || afterEmptyExplLineTrimmedUpper.startsWith(Q_PREFIX_EN_UP)){
                  breakExplDueToEmptyLineFollowedByNewQ = true;
              }
          }

          if (isNewQuestionStarting || breakExplDueToEmptyLineFollowedByNewQ) {
            break; // End of explanation (new question starts)
          }
          currentSectionContentLines.push(nextExplLineOriginal);
          i++;
        }
        const explanationText = currentSectionContentLines.join('\n').trim();
        if (explanationText) { // Only add explanation if it's not empty
            currentMCQ.explanation = explanationText;
        }
        currentSectionContentLines = [];
      }
    }

    // Add valid MCQ to list
    if (currentMCQ.id && currentMCQ.question && currentMCQ.options.length === 4 && currentMCQ.correctAnswerIndex !== undefined) {
      mcqs.push(currentMCQ as MultipleChoiceQuestion);
    } else if (currentMCQ.id && text.trim() && !overallParsingError && currentMCQ.question) { 
      // An attempt was made for an MCQ but it's incomplete
      overallParsingError = overallParsingError || formatString(currentTranslations.mcq_parser_error_incompleteBlock, currentMCQ.startLineNumber!);
    }
  } // End of while loop through lines

  if (mcqs.length === 0 && !overallParsingError && text.trim() !== "") {
    overallParsingError = currentTranslations.mcq_parser_error_noMCQsFound;
  }
  return { mcqs, error: overallParsingError };
};


const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper component to handle redirection effect
const RedirectComponent: React.FC<{ onRedirect: () => void; message: string }> = ({ onRedirect, message }) => {
  useEffect(() => {
    onRedirect();
  }, [onRedirect]);
  return <p>{message}</p>;
};


const App: React.FC = () => {
  const { language, setLanguage, t, getCurrentTranslations } = useLocalization();
  // Flashcard state
  const [inputText, setInputText] = useState<string>('');
  const [sourceFlashcards, setSourceFlashcards] = useState<Flashcard[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]); // For display
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [flashcardParsingError, setFlashcardParsingError] = useState<string | null>(null);

  // MCQ state
  const [mcqInputText, setMcqInputText] = useState<string>('');
  const [sourceMCQs, setSourceMCQs] = useState<MultipleChoiceQuestion[]>([]);
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<MultipleChoiceQuestion[]>([]); // For display
  const [currentMCQIndex, setCurrentMCQIndex] = useState<number>(0);
  const [mcqScore, setMcqScore] = useState<number>(0);
  const [mcqParsingError, setMcqParsingError] = useState<string | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  
  const [view, setView] = useState<AppView>(AppView.MainMenu);
  const [isOrderRandom, setIsOrderRandom] = useState<boolean>(true); // Default to random order

  const resetFlashcardState = () => {
    setSourceFlashcards([]);
    setFlashcards([]);
    setInputText('');
    setFlashcardParsingError(null);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const resetMCQState = () => {
    setSourceMCQs([]);
    setMultipleChoiceQuestions([]);
    setMcqInputText('');
    setMcqParsingError(null);
    setCurrentMCQIndex(0);
    setMcqScore(0);
    setIsQuizComplete(false);
  };

  const handleGoToMainMenu = useCallback(() => {
    setView(AppView.MainMenu);
    resetFlashcardState();
    resetMCQState();
    // isOrderRandom persists as a user preference
  }, []);

  // Flashcard Handlers
  const handleSelectFlashcardMode = useCallback(() => {
    resetMCQState(); 
    setView(AppView.Input);
  }, []);

  const handleCreateFlashcards = useCallback(() => {
    setFlashcardParsingError(null);
    const currentTranslations = getCurrentTranslations();
    const { cards, error } = parseFlashcardsInternal(inputText, currentTranslations);
    
    if (error && cards.length === 0) {
      setFlashcardParsingError(error);
      setSourceFlashcards([]);
      setFlashcards([]);
      return;
    }
    if (cards.length > 0) {
      const processedCards = isOrderRandom ? shuffleArray([...cards]) : [...cards];
      setSourceFlashcards([...cards]); // Keep original order in source
      setFlashcards(processedCards);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setView(AppView.Review);
      if (error) { 
        setFlashcardParsingError(error + ` (${t('inputArea_parsingError_someCreated')})`);
      }
    } else { 
      setFlashcardParsingError(error || t('parser_error_noCardsCreated'));
      setSourceFlashcards([]);
      setFlashcards([]);
    }
  }, [inputText, getCurrentTranslations, t, isOrderRandom]);

  const handleNextCard = useCallback(() => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  }, [flashcards.length]);

  const handlePreviousCard = useCallback(() => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  }, [flashcards.length]);

  const handleToggleAnswer = useCallback(() => {
    setShowAnswer((prev) => !prev);
  }, []);

  const handleStartNewSetFlashcards = useCallback(() => {
    setView(AppView.Input);
    // Do not reset inputText here, user might want to edit.
    // resetFlashcardState(); // This clears sourceFlashcards too, which is fine for starting completely new.
    setInputText(''); // Clear input for a new set
    setFlashcards([]);
    setSourceFlashcards([]);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setFlashcardParsingError(null);
  }, []);
  
  useEffect(() => { 
    if (inputText.trim() === '') {
      setFlashcardParsingError(null);
    }
  }, [inputText]);

  // MCQ Handlers
  const handleSelectMultipleChoiceMode = useCallback(() => {
    resetFlashcardState(); 
    setView(AppView.MCQInput);
  }, []);

  const handleCreateMCQs = useCallback(() => {
    setMcqParsingError(null);
    const currentTranslations = getCurrentTranslations();
    const { mcqs, error } = parseMCQsInternal(mcqInputText, currentTranslations);

    if (error && mcqs.length === 0) {
        setMcqParsingError(error);
        setSourceMCQs([]);
        setMultipleChoiceQuestions([]);
        return;
    }
    if (mcqs.length > 0) {
        const processedMCQs = isOrderRandom ? shuffleArray([...mcqs]) : [...mcqs];
        setSourceMCQs([...mcqs]); // Keep original order in source
        setMultipleChoiceQuestions(processedMCQs);
        setCurrentMCQIndex(0);
        setMcqScore(0);
        setIsQuizComplete(false);
        setView(AppView.MCQReview);
        if (error) { 
             setMcqParsingError(error + (mcqs.length > 0 ? ` (${t('inputArea_parsingError_someCreated').toLocaleLowerCase().replace('kartu','soal')})` : ''));
        }
    } else { 
        setMcqParsingError(error || t('mcqInputArea_parsingError_noMCQsCreated'));
        setSourceMCQs([]);
        setMultipleChoiceQuestions([]);
    }
  }, [mcqInputText, getCurrentTranslations, t, isOrderRandom]);

  const handleMCQAnswerSubmit = useCallback((questionId: string, selectedOptionIndex: number): boolean => {
    const currentMCQ = multipleChoiceQuestions[currentMCQIndex];
    if (!currentMCQ || currentMCQ.id !== questionId) return false;

    const isCorrect = selectedOptionIndex === currentMCQ.correctAnswerIndex;
    if (isCorrect) {
      setMcqScore(prevScore => prevScore + 1);
    }
    return isCorrect;
  }, [multipleChoiceQuestions, currentMCQIndex]);

  const handleNextMCQ = useCallback(() => {
    if (currentMCQIndex < multipleChoiceQuestions.length - 1) {
      setCurrentMCQIndex(prevIndex => prevIndex + 1);
    } else {
      setIsQuizComplete(true); 
    }
  }, [currentMCQIndex, multipleChoiceQuestions.length]);
  
  const handleRestartMCQQuiz = useCallback(() => {
    setMultipleChoiceQuestions(isOrderRandom ? shuffleArray([...sourceMCQs]) : [...sourceMCQs]); 
    setCurrentMCQIndex(0);
    setMcqScore(0);
    setIsQuizComplete(false);
  }, [sourceMCQs, isOrderRandom]);

  const handleStartNewMCQSet = useCallback(() => { 
    setView(AppView.MCQInput);
    setMcqInputText(''); 
    resetMCQState(); 
  }, []);

  useEffect(() => { 
    if (mcqInputText.trim() === '') {
      setMcqParsingError(null);
    }
  }, [mcqInputText]);

  const handleSetOrder = useCallback((isRandom: boolean) => {
    setIsOrderRandom(isRandom);
  }, []);


  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);


  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 selection:bg-indigo-100 dark:selection:bg-indigo-800">
      <header className="p-4 w-full max-w-4xl mx-auto">
        <div className="flex justify-end space-x-2 mb-4">
          <Button 
            onClick={() => setLanguage('id')} 
            variant={language === 'id' ? 'primary' : 'secondary'}
            size="sm"
            aria-pressed={language === 'id'}
          >
            {t('languageSwitcherID')}
          </Button>
          <Button 
            onClick={() => setLanguage('en')} 
            variant={language === 'en' ? 'primary' : 'secondary'}
            size="sm"
            aria-pressed={language === 'en'}
          >
            {t('languageSwitcherEN')}
          </Button>
        </div>
        <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{t('appTitle')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">{t('appSubtitle')}</p>
        </div>
      </header>
      
      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4">
        {view === AppView.MainMenu && (
          <MainMenu 
            onSelectFlashcard={handleSelectFlashcardMode} 
            onSelectMultipleChoice={handleSelectMultipleChoiceMode} 
            // isOrderRandom and onToggleOrder removed from MainMenu props
          />
        )}
        {/* Flashcard Views */}
        {view === AppView.Input && (
          <FlashcardInputArea
            inputText={inputText}
            onInputChange={setInputText}
            onCreateFlashcards={handleCreateFlashcards}
            onGoToMainMenu={handleGoToMainMenu}
            parsingError={flashcardParsingError}
            isOrderRandom={isOrderRandom}
            onSetOrder={handleSetOrder}
          />
        )}
        {view === AppView.Review && flashcards.length > 0 && (
          <FlashcardReviewArea
            card={flashcards[currentCardIndex]}
            showAnswer={showAnswer}
            onToggleAnswer={handleToggleAnswer}
            onNextCard={handleNextCard}
            onPreviousCard={handlePreviousCard}
            onStartNewSet={handleStartNewSetFlashcards} 
            onGoToMainMenu={handleGoToMainMenu}
            currentIndex={currentCardIndex}
            totalCards={flashcards.length}
            canGoPrevious={flashcards.length > 1} 
            canGoNext={flashcards.length > 1} 
            isOrderRandom={isOrderRandom} 
          />
        )}
         {view === AppView.Review && flashcards.length === 0 && ( 
            <div className="text-center p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md">
                <h2 className="text-2xl font-semibold mb-3 text-red-600 dark:text-red-400">{t('reviewArea_oopsNoCards')}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-1">{t('reviewArea_oopsProblem')}</p>
                {flashcardParsingError && <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900 p-3 rounded-md">{flashcardParsingError}</p>}
                <div className="mt-6 space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row justify-center">
                    <Button 
                        onClick={handleStartNewSetFlashcards}
                        variant="primary"
                    >
                        {t('reviewArea_tryAgainButton')}
                    </Button>
                    <Button 
                        onClick={handleGoToMainMenu}
                        variant="secondary"
                        leftIcon={<HomeIcon />}
                    >
                        {t('common_backToMainMenuButton')}
                    </Button>
                </div>
            </div>
        )}

        {/* MCQ Views */}
        {view === AppView.MCQInput && (
          <MultipleChoiceInputArea
            inputText={mcqInputText}
            onInputChange={setMcqInputText}
            onCreateMCQs={handleCreateMCQs}
            onGoToMainMenu={handleGoToMainMenu}
            parsingError={mcqParsingError}
            isOrderRandom={isOrderRandom}
            onSetOrder={handleSetOrder}
          />
        )}
        {view === AppView.MCQReview && multipleChoiceQuestions.length > 0 && (
          <MultipleChoiceReviewArea
            mcqs={multipleChoiceQuestions}
            currentMCQIndex={currentMCQIndex}
            score={mcqScore}
            onAnswerSubmit={handleMCQAnswerSubmit}
            onNextMCQ={handleNextMCQ}
            onGoToMainMenu={handleGoToMainMenu}
            onStartNewMCQSet={handleStartNewMCQSet}
            isQuizComplete={isQuizComplete}
            onRestartQuiz={handleRestartMCQQuiz}
            isOrderRandom={isOrderRandom}
          />
        )}
        {view === AppView.MCQReview && multipleChoiceQuestions.length === 0 && ( 
             <div className="text-center p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md">
                <h2 className="text-2xl font-semibold mb-3 text-red-600 dark:text-red-400">{t('mcqReviewArea_oopsNoMCQs')}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-1">{t('mcqReviewArea_oopsProblemMCQ')}</p>
                {mcqParsingError && <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900 p-3 rounded-md">{mcqParsingError}</p>}
                <div className="mt-6 space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row justify-center">
                    <Button 
                        onClick={handleStartNewMCQSet} 
                        variant="primary"
                    >
                        {t('mcqReviewArea_createNewMCQSetButton')}
                    </Button>
                    <Button 
                        onClick={handleGoToMainMenu}
                        variant="secondary"
                        leftIcon={<HomeIcon />}
                    >
                        {t('common_backToMainMenuButton')}
                    </Button>
                </div>
            </div>
        )}

        {/* Fallback for old MultipleChoice view - now uses RedirectComponent */}
        {view === AppView.MultipleChoice && (
          <div className="text-center p-6">
            <RedirectComponent 
              onRedirect={handleSelectMultipleChoiceMode} 
              message="Redirecting to MCQ Input..." 
            />
          </div>
        )}

      </main>
      <footer className="p-4 w-full max-w-4xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
        <p>{t('footer_ai')}</p>
        <p>
            {t('footer_kofi')}
            <a href="https://ko-fi.com/kemalavicennafaza" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline dark:text-indigo-400">
                https://ko-fi.com/kemalavicennafaza
            </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
