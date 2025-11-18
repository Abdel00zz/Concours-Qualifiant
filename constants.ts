import type { QuizData } from './types';
import { educationQuestions } from './education';
import { didacticQuestions } from './didactic';
import { adminQuestions } from './admin';
import { mathQuestions } from './math';
import { skillsQuestions } from './skills';

export const quizData: QuizData = {
    education: educationQuestions,
    didactic: didacticQuestions,
    admin: adminQuestions,
    math: mathQuestions,
    skills: skillsQuestions,
};
