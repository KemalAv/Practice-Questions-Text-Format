export interface Flashcard {
  id: string;
  soal: string; // This will store the question text regardless of input language
  jawaban: string; // This will store the answer text regardless of input language
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[]; // Should always be 4 options: [A, B, C, D]
  correctAnswerIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation?: string; // Optional explanation for the correct answer
}

export enum AppView {
  MainMenu = 'MAIN_MENU',
  Input = 'INPUT', // Flashcard Input
  Review = 'REVIEW', // Flashcard Review
  MCQInput = 'MCQ_INPUT',
  MCQReview = 'MCQ_REVIEW',
  MultipleChoice = 'MULTIPLE_CHOICE', // Will be removed or repurposed if MCQInput/MCQReview cover it
}

export type Language = 'id' | 'en';