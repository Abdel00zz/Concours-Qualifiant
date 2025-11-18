import React, { useState } from 'react';
import type { Question, QuizCategory } from '../types';
import KaTeXContent from './KaTeXContent';
import 'katex/dist/katex.min.css';

const DifficultyBadge: React.FC<{ difficulty: 'easy' | 'medium' | 'hard' }> = ({ difficulty }) => {
  const styles = {
    easy: 'bg-green-50 text-success border border-success/40',
    medium: 'bg-amber-50 text-warning border border-warning/40',
    hard: 'bg-red-50 text-danger border border-danger/40',
  };
  const text = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
  };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[difficulty]}`}>{text[difficulty]}</span>;
};

const Section: React.FC<{ title: string; borderClass: string; titleClass: string; bgClass: string; children: React.ReactNode; icon: string }> = ({ title, borderClass, titleClass, bgClass, children, icon }) => (
  <div className={`mb-6 p-5 rounded-lg border-r-4 ${borderClass} ${bgClass}`}>
    <h4 className={`font-bold text-lg ${titleClass} mb-4 flex items-center`}>
            <span className="w-6 h-6 ml-3 text-xl">{icon}</span>
            {title}
        </h4>
    <div className="text-primary text-base leading-relaxed space-y-4 text-right">
            {children}
        </div>
    </div>
);


const MathExerciseCard: React.FC<{ question: Question, questionNumber: number }> = ({ question, questionNumber }) => {
    const [showSolution, setShowSolution] = useState(false);

    return (
      <div id={`q-${question.id}`} className="bg-surface p-6 my-4 rounded-lg border border-border transition-all duration-300">
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-border/60">
          <h3 className="font-bold text-lg text-primary">
                    {question.question}
                </h3>
                <div className="flex-shrink-0">
                    <DifficultyBadge difficulty={question.difficulty} />
                </div>
            </div>
            
            {question.scenario && (
                <Section title="نص التمرين" borderClass="border-accent/40" titleClass="text-primary" bgClass="bg-background" icon="📝">
                    <KaTeXContent content={question.scenario} className="whitespace-pre-wrap" />
                </Section>
            )}

            {question.studentWork && (
                <Section title="نماذج من إجابات التلاميذ" borderClass="border-accent/40" titleClass="text-primary" bgClass="bg-background" icon="🧑‍🎓">
                    <KaTeXContent content={question.studentWork} className="whitespace-pre-wrap" />
                </Section>
            )}

            {question.didacticQuestions && (
                <Section title="المطلوب منك كأستاذ" borderClass="border-accent/40" titleClass="text-primary" bgClass="bg-background" icon="🎯">
                    <KaTeXContent content={question.didacticQuestions} className="whitespace-pre-wrap" />
                </Section>
            )}

            <div className="text-center my-6">
                <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="bg-success text-white font-semibold py-2 px-6 rounded-md shadow-sm hover:bg-success/80 transition-all"
                >
                    {showSolution ? 'إخفاء الحل' : 'إظهار الحل والتحليل'}
                </button>
            </div>

            {showSolution && (
                <div className="mt-5 p-5 bg-background border-t border-border rounded-lg">
                    <h4 className="font-bold text-lg text-primary mb-4 flex items-center">
                        <span className="w-6 h-6 ml-3 text-xl">📖</span>
                        الحل والتحليل الديداكتيكي المفصل
                    </h4>
                    <KaTeXContent content={question.explanation} className="text-primary mt-2 leading-loose whitespace-pre-wrap" />
                </div>
            )}
        </div>
    );
};

const QCMCard: React.FC<{
  question: Question;
  questionNumber: number;
  userAnswer: number | undefined;
  onAnswerSelect: (questionId: number, choiceIndex: number) => void;
  isFinished: boolean;
}> = ({ question, questionNumber, userAnswer, onAnswerSelect, isFinished }) => {

  return (
    <div id={`q-${question.id}`} className="bg-surface p-6 my-4 rounded-lg border border-border transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-primary">
          السؤال {questionNumber}
        </h3>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>
      <KaTeXContent content={question.question} className="text-primary text-lg leading-relaxed mb-6 text-right" />
      <div className="space-y-3">
        {question.choices.map((choice, index) => {
          const isSelected = userAnswer === index;
          const isCorrect = question.correct === index;

          let choiceClasses = "flex flex-row-reverse items-center p-4 rounded-md border cursor-pointer transition-all duration-200 gap-3 text-right";
          if (isFinished) {
            if (isCorrect) choiceClasses += " bg-green-50 border-success text-success font-semibold";
            else if (isSelected && !isCorrect) choiceClasses += " bg-red-50 border-danger text-danger";
            else choiceClasses += " bg-background border-border text-primary";
          } else {
            if (isSelected) choiceClasses += " bg-blue-50 border-accent font-semibold";
            else choiceClasses += " bg-background border-border hover:bg-border/40 hover:border-accent/40";
          }

          return (
            <div key={index} className={choiceClasses} onClick={() => !isFinished && onAnswerSelect(question.id, index)}>
              <input 
                type="radio" 
                name={`q${question.id}`} 
                checked={isSelected}
                readOnly
                className="w-4 h-4 accent-accent"
              />
              <label className="flex-1 cursor-pointer">
                <KaTeXContent content={choice} />
              </label>
            </div>
          );
        })}
      </div>
      {isFinished && (
        <div className="mt-5 p-4 bg-blue-50 border-r-4 border-accent rounded-md">
          <strong className="text-accent">الشرح:</strong>
          <KaTeXContent content={question.explanation} className="text-primary mt-1 text-right" />
        </div>
      )}
    </div>
  );
};

interface QuestionCardProps {
    question: Question;
    category: QuizCategory;
    questionNumber: number;
    userAnswer: number | undefined;
    onAnswerSelect: (questionId: number, choiceIndex: number) => void;
    isFinished: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = (props) => {
    if (props.category === 'math') {
        return <MathExerciseCard question={props.question} questionNumber={props.questionNumber} />;
    }
    return <QCMCard {...props} />;
}

export default QuestionCard;