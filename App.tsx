
import React, { useState, useEffect, useCallback } from 'react';
import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import type { UserAnswers, QuizCategory } from './types';
import { quizData } from './constants';

type QuizStatus = 'intro' | 'active' | 'finished';

const App: React.FC = () => {
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('intro');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // FIX: Changed NodeJS.Timeout to number, which is the correct return type for setInterval in a browser environment.
    let timer: number;
    if (quizStatus === 'active') {
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStatus]);

  const startQuiz = useCallback(() => {
    setElapsedTime(0);
    setUserAnswers({});
    setQuizStatus('active');
  }, []);

  const handleAnswerSelect = useCallback((questionId: number, choiceIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: choiceIndex }));
  }, []);

  const submitQuiz = useCallback(() => {
    if (window.confirm('هل أنت متأكد من إرسال الاختبار؟ لن تتمكن من تعديل إجاباتك بعد ذلك.')) {
      setQuizStatus('finished');
    }
  }, []);

  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);
  
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
  };

  const totalQuestions = Object.values(quizData).reduce((acc, category) => acc + category.length, 0);

  return (
    <div className="min-h-screen bg-background text-primary p-4 sm:p-6 md:p-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <header className="bg-surface border-b border-border p-6 sm:p-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">الاختبار التفاعلي للامتحان المهني</h1>
          <p className="text-lg text-secondary">الدرجة الأولى - تخصص الرياضيات - التعليم الثانوي التأهيلي</p>
          <p className="mt-2 text-sm text-secondary">{totalQuestions} سؤال شامل | دورة 2024-2025</p>
        </header>

        <main>
          {quizStatus === 'intro' && <IntroScreen onStartQuiz={startQuiz} />}
          
          {(quizStatus === 'active' || quizStatus === 'finished') && (
              <QuizScreen 
                quizStatus={quizStatus}
                userAnswers={userAnswers}
                onAnswerSelect={handleAnswerSelect}
                onSubmitQuiz={submitQuiz}
                onRestartQuiz={restartQuiz}
                onReviewAnswers={() => setQuizStatus('finished')}
                elapsedTime={formatTime(elapsedTime)}
              />
          )}
        </main>
      </div>
      <footer className="text-center text-sm text-secondary py-6">
        تم التطوير بواسطة مهندس React خبير باستخدام Gemini.
      </footer>
    </div>
  );
};

export default App;