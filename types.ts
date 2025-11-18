
export interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  // Optional fields for rich math exercises
  scenario?: string;
  studentWork?: string;
  didacticQuestions?: string;
}

export type QuizCategory = 'education' | 'didactic' | 'admin' | 'math' | 'skills';

export type QuizData = {
  [key in QuizCategory]: Question[];
};

export interface UserAnswers {
  [questionId: number]: number;
}

export interface CategoryResult {
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  percentage: string;
}

// FIX: Changed QuizResults from an interface to a mapped type. This helps TypeScript to correctly infer value types when using Object.values(), which resolves type errors in ResultsScreen.tsx.
export type QuizResults = {
  [key in QuizCategory]: CategoryResult;
};
