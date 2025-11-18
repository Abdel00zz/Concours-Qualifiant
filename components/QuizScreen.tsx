
import React, { useState, useMemo, useEffect } from 'react';
import { quizData } from '../constants';
import type { QuizCategory, UserAnswers } from '../types';
import ResultsScreen from './ResultsScreen';
import QuestionCard from './QuestionCard'; // Import the refactored QuestionCard

const categoryNames: { [key in QuizCategory]: string } = {
  education: '👨‍🏫 علوم التربية',
  didactic: '📐 الديداكتيك',
  admin: '🏛️ التنظيم الإداري',
  math: '➗ الرياضيات',
  skills: '💼 الكفايات',
};

interface QuizScreenProps {
  quizStatus: 'active' | 'finished';
  userAnswers: UserAnswers;
  onAnswerSelect: (questionId: number, choiceIndex: number) => void;
  onSubmitQuiz: () => void;
  onRestartQuiz: () => void;
  onReviewAnswers: () => void;
  elapsedTime: string;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ quizStatus, userAnswers, onAnswerSelect, onSubmitQuiz, onRestartQuiz, onReviewAnswers, elapsedTime }) => {
  const [activeTab, setActiveTab] = useState<QuizCategory | 'results'>('education');

  const categories = useMemo(() => Object.keys(quizData) as QuizCategory[], []);
  let questionCounter = 0;

  const progress = useMemo(() => {
    return categories.reduce((acc, category) => {
      const categoryQuestions = quizData[category];
      const answeredCount = categoryQuestions.filter(q => userAnswers[q.id] !== undefined).length;
      acc[category] = (answeredCount / categoryQuestions.length) * 100;
      return acc;
    }, {} as { [key in QuizCategory]: number });
  }, [userAnswers, categories]);

  useEffect(() => {
    if (quizStatus === 'finished') {
      setActiveTab('results');
    }
  }, [quizStatus]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar / Tabs */}
      <aside className="w-full md:w-1/4 lg:w-1/5 p-4 border-b md:border-b-0 md:border-l border-border">
        <div className="sticky top-4">
            <div className="bg-surface p-4 rounded-lg border border-border mb-4 text-center">
                <div className="text-3xl font-bold text-accent" id="timerDisplay">{elapsedTime}</div>
                <div className="text-sm text-primary">الوقت المنقضي</div>
            </div>
            <nav className="space-y-2">
            {(Object.keys(categoryNames) as QuizCategory[]).map(cat => (
                <button
                    key={cat}
                    onClick={() => quizStatus === 'active' && setActiveTab(cat)}
                    className={`w-full text-right p-3 rounded-md font-semibold transition-all duration-200 ${activeTab === cat ? 'bg-accent text-accent-text' : 'bg-background hover:bg-border/60 text-primary'}`}
                >
                    {categoryNames[cat]}
                </button>
            ))}
             <button
                onClick={() => setActiveTab('results')}
                disabled={quizStatus !== 'finished'}
                className={`w-full text-right p-3 rounded-md font-semibold transition-all duration-200 ${activeTab === 'results' ? 'bg-success text-white' : 'bg-background text-primary'} ${quizStatus !== 'finished' ? 'cursor-not-allowed opacity-50' : 'hover:bg-border/60'}`}
            >
                📊 النتائج
            </button>
            </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-full md:w-3/4 lg:w-4/5 p-6">
        {activeTab !== 'results' ? (
          <div>
            <div className="bg-surface p-4 rounded-lg border border-border mb-6 sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-primary mb-2">{categoryNames[activeTab as QuizCategory]}</h2>
              <div className="w-full bg-border rounded-full h-2.5">
                <div 
                  className="bg-accent h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress[activeTab as QuizCategory]}%` }}
                >
                </div>
              </div>
            </div>
            <div>
              {(quizData[activeTab as QuizCategory] || []).map((q, index) => {
                questionCounter++;
                return(
                <QuestionCard
                  key={q.id}
                  question={q}
                  category={activeTab as QuizCategory}
                  questionNumber={questionCounter}
                  userAnswer={userAnswers[q.id]}
                  onAnswerSelect={onAnswerSelect}
                  isFinished={quizStatus === 'finished'}
                />
              )})}
            </div>
            {quizStatus === 'active' && activeTab !== 'math' &&
            <div className="text-center mt-8">
                <button 
                onClick={onSubmitQuiz} 
                className="bg-danger text-white font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-danger/80 transition-all text-lg"
                >
                إرسال الاختبار
                </button>
            </div>
            }
             {quizStatus === 'active' && activeTab === 'math' && (
              <div className="mt-8 p-4 bg-background rounded-lg text-center">
                  <p className="text-secondary">تم تصميم هذه التمارين للتدريب والتحليل. لا يوجد نظام نقاط هنا. يمكنك إرسال الاختبار من أي فئة أخرى.</p>
              </div>
            )}
          </div>
        ) : (
          <ResultsScreen 
            userAnswers={userAnswers} 
            durationInSeconds={parseInt(elapsedTime.split(':').reduce((acc, time) => (60 * acc) + +time, 0).toString())}
            onRestartQuiz={onRestartQuiz}
            onReviewAnswers={() => {
              setActiveTab('education')
              onReviewAnswers();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
