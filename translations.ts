

import { Language } from './types';

// Helper function for string formatting (e.g., "Card {0} of {1}")
export const formatString = (str: string, ...args: (string | number)[]): string => {
  if (typeof str !== 'string') return String(str); // Ensure str is a string
  return str.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== 'undefined' ? String(args[number]) : match;
  });
};

export const translations = {
  id: {
    appTitle: "Format Teks Latihan Soal",
    appSubtitle: "Belajar lebih cepat, ingat lebih lama.",
    languageSwitcherID: "ID",
    languageSwitcherEN: "EN",

    common_etc: "dst.",
    common_backToMainMenuButton: "Kembali ke Menu Utama",
    common_question_singular: "Soal",
    common_answer_singular: "Jawaban",
    common_order_label: "Urutan", // Kept for general use if needed, but not for the specific button label
    common_order_random: "Acak",
    common_order_sequential: "Berurutan",
    common_setOrderPreference_inputArea: "Atur Urutan:", // New key for input areas
    common_enabled: "Aktif",
    common_disabled: "Nonaktif",
    // common_shuffleToggle_tooltip_setSequential: "Atur urutan menjadi berurutan (sesuai input)", // Removed
    // common_shuffleToggle_tooltip_setRandom: "Atur urutan menjadi acak", // Removed


    // Main Menu
    mainMenu_title: "Menu Utama",
    mainMenu_selectMode: "Pilih Mode Belajar:",
    mainMenu_flashcardButton: "Mode Flashcard",
    mainMenu_mcqButton: "Mode Pilihan Ganda",
    mainMenu_flashcardDescription: "Buat dan ulas kartu flash kustom.",
    mainMenu_mcqDescription: "Uji pengetahuan Anda dengan soal pilihan ganda.",
    mainMenu_latexSupport: "Dukungan Matematika (LaTeX):",
    // mainMenu_setOrderPreference: "Atur Preferensi Urutan Soal:", // Removed from main menu context

    // FlashcardInputArea
    inputArea_title: "Buat Flashcard Baru",
    inputArea_instructionFormat: "Paste teks Anda di bawah. Pastikan setiap soal dan jawaban ada di baris terpisah dengan format:",
    inputArea_parser_questionKeyword: "Soal",
    inputArea_parser_answerKeyword: "Jawaban",
    inputArea_exampleQuestion1: "1. Teks Soal Pertama",
    inputArea_exampleAnswer1: "Teks Jawaban Pertama",
    inputArea_exampleQuestion2: "2. Teks Soal Kedua",
    inputArea_exampleAnswer2: "Teks Jawaban Kedua",
    inputArea_placeholder: "Tempelkan teks soal dan jawaban Anda di sini...",
    inputArea_createButton: "Buat Flashcards",
    inputArea_parsingError_generic: "Terjadi kesalahan parsing.",
    inputArea_parsingError_someCreated: "Beberapa kartu mungkin berhasil dibuat.",
    
    // FlashcardReviewArea
    reviewArea_cardLabel: "Kartu {0} dari {1}",
    reviewArea_startNewSetButton: "Buat Set Baru",
    reviewArea_toggleAnswerShow: "Lihat Jawaban",
    reviewArea_toggleAnswerHide: "Sembunyikan Jawaban",
    reviewArea_previousButton: "Sebelumnya",
    reviewArea_nextButton: "Berikutnya",
    reviewArea_noCardsMessage: "Tidak ada flashcard untuk ditampilkan.",
    reviewArea_oopsNoCards: "Oops! Tidak Ada Kartu",
    reviewArea_oopsProblem: "Sepertinya ada masalah saat membuat flashcard atau tidak ada data yang valid.",
    reviewArea_tryAgainButton: "Coba Lagi / Buat Set Baru",

    // MCQ Input Area
    mcqInputArea_title: "Buat Soal Pilihan Ganda",
    mcqInputArea_instructionFormat: "Tempel teks Anda di bawah. Gunakan format berikut untuk setiap soal:",
    mcqInputArea_parser_questionKeyword: "Soal", 
    mcqInputArea_parser_optionAKeyword: "A",
    mcqInputArea_parser_optionBKeyword: "B",
    mcqInputArea_parser_optionCKeyword: "C",
    mcqInputArea_parser_optionDKeyword: "D",
    mcqInputArea_parser_correctAnswerKeyword: "Jawaban Benar",
    mcqInputArea_parser_explanationKeyword: "Penjelasan",
    mcqInputArea_exampleMCQ: "Soal: 1. Teks Soal Pertama\nA: Jawaban Pertama\nB: Jawaban Kedua\nC: Jawaban Ketiga\nD: Jawaban Keempat\nJawaban Benar: A\nPenjelasan: Teks Penjelasan Opsional\n\nSoal: 2. Teks Soal Kedua\nA: Jawaban Pertama\nB: Jawaban Kedua\nC: Jawaban Ketiga\nD: Jawaban Keempat\nJawaban Benar: B\nPenjelasan: Teks Penjelasan Opsional\n\n...dst.",
    mcqInputArea_placeholder: "Tempelkan soal pilihan ganda Anda di sini",
    mcqInputArea_createButton: "Buat Soal Pilihan Ganda",
    mcqInputArea_parsingError_noMCQsCreated: "Tidak ada soal pilihan ganda yang berhasil dibuat dari teks yang diberikan.",

    // MCQ Review Area
    mcqReviewArea_questionLabel: "Soal {0} dari {1}",
    mcqReviewArea_scoreLabel: "Skor: {0}/{1}",
    mcqReviewArea_submitAnswerButton: "Kirim Jawaban",
    mcqReviewArea_nextQuestionButton: "Soal Berikutnya",
    mcqReviewArea_submitQuizButton: "Kumpulkan Kuis",
    mcqReviewArea_feedbackCorrect: "Jawaban Benar!",
    mcqReviewArea_feedbackIncorrect: "Jawaban Salah. Jawaban yang benar adalah: {0}",
    mcqReviewArea_explanationLabel: "Penjelasan:",
    mcqReviewArea_quizCompleteTitle: "Kuis Selesai!",
    mcqReviewArea_finalScore: "Skor Akhir Anda: {0} dari {1}",
    mcqReviewArea_restartQuizButton: "Ulangi Kuis",
    mcqReviewArea_createNewMCQSetButton: "Buat Set Soal Baru",
    mcqReviewArea_noMCQsMessage: "Tidak ada soal pilihan ganda untuk ditampilkan.",
    mcqReviewArea_oopsNoMCQs: "Oops! Tidak Ada Soal",
    mcqReviewArea_oopsProblemMCQ: "Sepertinya ada masalah saat membuat soal atau tidak ada data yang valid.",

    // Parser Errors (Flashcard)
    parser_error_lineX_missingAnswerForPreviousQuestion: "Kesalahan Baris {0}: Jawaban hilang untuk {1} sebelumnya '{2}'.",
    parser_error_lineX_questionMissingText: "Kesalahan Baris {0}: Teks {2} hilang setelah '{1}:'.",
    parser_error_lineX_answerMissingPreviousQuestion: "Kesalahan Baris {0}: {1} '{2}:' tanpa {3} sebelumnya.",
    parser_error_lineX_answerMissingText: "Kesalahan Baris {0}: Teks {2} hilang setelah '{1}:' untuk {3} '{4}'.",
    parser_error_lineX_unrecognizedFormat: "Kesalahan Baris {0}: Format tidak dikenal '{2}...'. Harap gunakan '{3}:' atau '{4}:'.",
    parser_error_lineX_firstLineMustBeQuestion: "Kesalahan Baris {0}: Baris pertama harus dimulai dengan '{1}:', bukan '{2}...'.",
    parser_error_lineX_mustBeQuestion: "Kesalahan Baris {0}: Harus dimulai dengan '{1}:', bukan '{2}...'.",
    parser_error_lastQuestionMissingAnswer: "{0} terakhir '{1}' tidak memiliki {2}.",
    parser_error_noValidPairs: "Tidak ada pasangan {0}/{1} yang valid ditemukan. Harap periksa format {2}: [teks] lalu {3}: [teks].",
    parser_error_noCardsCreated: "Tidak ada kartu flash yang dibuat. Periksa format input Anda.",

    // Parser Errors (MCQ)
    mcq_parser_error_incompleteBlock: "Kesalahan Baris ~{0}: Blok soal pilihan ganda tidak lengkap.",
    mcq_parser_error_missingQuestion: "Kesalahan Baris {0}: Teks hilang setelah '{1}:'.",
    mcq_parser_error_missingOption: "Kesalahan Baris {0}: Teks opsi hilang setelah '{1}:' untuk soal '{2}'.",
    mcq_parser_error_invalidCorrectAnswer: "Kesalahan Baris {0}: Jawaban benar '{1}' tidak valid (harus A, B, C, atau D) untuk soal '{2}'.",
    mcq_parser_error_missingCorrectAnswer: "Kesalahan Baris {0}: Definisi jawaban benar hilang (misalnya, '{1}: A') untuk soal '{2}'.",
    mcq_parser_error_missingExplanationText: "Kesalahan Baris {0}: Teks penjelasan hilang setelah '{1}:' untuk soal '{2}'.",
    mcq_parser_error_noMCQsFound: "Tidak ada soal pilihan ganda yang valid ditemukan. Periksa format input Anda.",
    footer_ai: "Aplikasi ini dibuat sepenuhnya dengan AI.",
    footer_kofi: "Minta duit lu dong: "
  },
  en: {
    appTitle: "Practice Questions Text Format",
    appSubtitle: "Learn faster, remember longer.",
    languageSwitcherID: "ID",
    languageSwitcherEN: "EN",

    common_etc: "etc.",
    common_backToMainMenuButton: "Back to Main Menu",
    common_question_singular: "Question",
    common_answer_singular: "Answer",
    common_order_label: "Order", // Kept for general use if needed
    common_order_random: "Random",
    common_order_sequential: "Sequential",
    common_setOrderPreference_inputArea: "Set Order:", // New key for input areas
    common_enabled: "Enabled",
    common_disabled: "Disabled",
    // common_shuffleToggle_tooltip_setSequential: "Set order to sequential (as per input)", // Removed
    // common_shuffleToggle_tooltip_setRandom: "Set order to random", // Removed
    
    // Main Menu
    mainMenu_title: "Main Menu",
    mainMenu_selectMode: "Select Learning Mode:",
    mainMenu_flashcardButton: "Flashcard Mode",
    mainMenu_mcqButton: "Multiple Choice Mode",
    mainMenu_flashcardDescription: "Create and review custom flashcards.",
    mainMenu_mcqDescription: "Test your knowledge with multiple choice questions.",
    mainMenu_latexSupport: "Math Support (LaTeX):",
    // mainMenu_setOrderPreference: "Set Question Order Preference:", // Removed


    // FlashcardInputArea
    inputArea_title: "Create New Flashcards",
    inputArea_instructionFormat: "Paste your text below. Ensure each question and answer is on a new line with the format:",
    inputArea_parser_questionKeyword: "Question",
    inputArea_parser_answerKeyword: "Answer",
    inputArea_exampleQuestion1: "1. First Question Text",
    inputArea_exampleAnswer1: "First Answer Text",
    inputArea_exampleQuestion2: "Second Question Text",
    inputArea_exampleAnswer2: "2. Second Answer Text",
    inputArea_placeholder: "Paste your questions and answers here...",
    inputArea_createButton: "Create Flashcards",
    inputArea_parsingError_generic: "A parsing error occurred.",
    inputArea_parsingError_someCreated: "Some cards may have been created successfully.",

    // FlashcardReviewArea
    reviewArea_cardLabel: "Card {0} of {1}",
    reviewArea_startNewSetButton: "Create New Set",
    reviewArea_toggleAnswerShow: "Show Answer",
    reviewArea_toggleAnswerHide: "Hide Answer",
    reviewArea_previousButton: "Previous",
    reviewArea_nextButton: "Next",
    reviewArea_noCardsMessage: "No flashcards to display.",
    reviewArea_oopsNoCards: "Oops! No Cards",
    reviewArea_oopsProblem: "It seems there was an issue creating flashcards or there's no valid data.",
    reviewArea_tryAgainButton: "Try Again / Create New Set",

    // MCQ Input Area
    mcqInputArea_title: "Create Multiple Choice Questions",
    mcqInputArea_instructionFormat: "Paste your text below. Use the following format for each question:",
    mcqInputArea_parser_questionKeyword: "Question",
    mcqInputArea_parser_optionAKeyword: "A",
    mcqInputArea_parser_optionBKeyword: "B",
    mcqInputArea_parser_optionCKeyword: "C",
    mcqInputArea_parser_optionDKeyword: "D",
    mcqInputArea_parser_correctAnswerKeyword: "Correct Answer",
    mcqInputArea_parser_explanationKeyword: "Explanation",
    mcqInputArea_exampleMCQ: "Question: 1. First Question Text\nA: First Answer\nB: Second Answer\nC: Third Answer\nD: Fourth Answer\nCorrect Answer: A\nExplanation: Optional Explanation Text\n\nQuestion: 2. Second Question Text\nA: First Answer\nB: Second Answer\nC: Third Answer\nD: Fourth Answer\nCorrect Answer: B\nExplanation: Optional Explanation Text\n\n...etc.",
    mcqInputArea_placeholder: "Paste your multiple choice questions here",
    mcqInputArea_createButton: "Create MCQs",
    mcqInputArea_parsingError_noMCQsCreated: "No multiple choice questions were created from the provided text.",

    // MCQ Review Area
    mcqReviewArea_questionLabel: "Question {0} of {1}",
    mcqReviewArea_scoreLabel: "Score: {0}/{1}",
    mcqReviewArea_submitAnswerButton: "Submit Answer",
    mcqReviewArea_nextQuestionButton: "Next Question",
    mcqReviewArea_submitQuizButton: "Submit Quiz",
    mcqReviewArea_feedbackCorrect: "Correct!",
    mcqReviewArea_feedbackIncorrect: "Incorrect. The correct answer is: {0}",
    mcqReviewArea_explanationLabel: "Explanation:",
    mcqReviewArea_quizCompleteTitle: "Quiz Complete!",
    mcqReviewArea_finalScore: "Your Final Score: {0} out of {1}",
    mcqReviewArea_restartQuizButton: "Restart Quiz",
    mcqReviewArea_createNewMCQSetButton: "Create New MCQ Set",
    mcqReviewArea_noMCQsMessage: "No multiple choice questions to display.",
    mcqReviewArea_oopsNoMCQs: "Oops! No MCQs",
    mcqReviewArea_oopsProblemMCQ: "It seems there was an issue creating MCQs or there's no valid data.",
    
    // Parser Errors (Flashcard)
    parser_error_lineX_missingAnswerForPreviousQuestion: "Error Line {0}: Missing answer for previous {1} '{2}'.",
    parser_error_lineX_questionMissingText: "Error Line {0}: Missing {2} text after '{1}:'.",
    parser_error_lineX_answerMissingPreviousQuestion: "Error Line {0}: {1} '{2}:' without a preceding {3}.",
    parser_error_lineX_answerMissingText: "Error Line {0}: Missing {2} text after '{1}:' for {3} '{4}'.",
    parser_error_lineX_unrecognizedFormat: "Error Line {0}: Unrecognized format '{2}...'. Please use '{3}:' or '{4}:'.",
    parser_error_lineX_firstLineMustBeQuestion: "Error Line {0}: First line must start with '{1}:', not '{2}...'.",
    parser_error_lineX_mustBeQuestion: "Error Line {0}: Must start with '{1}:', not '{2}...'.",
    parser_error_lastQuestionMissingAnswer: "Last {0} '{1}' is missing an {2}.",
    parser_error_noValidPairs: "No valid {0}/{1} pairs found. Please check format: {2}: [text] then {3}: [text].",
    parser_error_noCardsCreated: "No flashcards were created. Check your input format.",

    // Parser Errors (MCQ)
    mcq_parser_error_incompleteBlock: "Error Line ~{0}: Incomplete MCQ block.",
    mcq_parser_error_missingQuestion: "Error Line {0}: Missing text after '{1}:'.",
    mcq_parser_error_missingOption: "Error Line {0}: Missing option text after '{1}:' for question '{2}'.",
    mcq_parser_error_invalidCorrectAnswer: "Error Line {0}: Invalid correct answer '{1}' (must be A, B, C, or D) for question '{2}'.",
    mcq_parser_error_missingCorrectAnswer: "Error Line {0}: Missing correct answer definition (e.g., '{1}: A') for question '{2}'.",
    mcq_parser_error_missingExplanationText: "Error Line {0}: Missing explanation text after '{1}:' for question '{2}'.",
    mcq_parser_error_noMCQsFound: "No valid MCQs found. Check your input format.",
    footer_ai: "This app was made entirely with AI.",
    footer_kofi: "Gimmie your money please: "
  }
};

export type TranslationSet = typeof translations['id']; // Or 'en', structure should be the same
export type TranslationKeys = keyof TranslationSet;
