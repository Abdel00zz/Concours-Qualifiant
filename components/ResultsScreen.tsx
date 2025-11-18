import React, { useMemo } from 'react';
// FIX: Added CategoryResult to the import to correctly type the result objects.
import type { UserAnswers, QuizResults, QuizCategory, CategoryResult } from '../types';
import { quizData } from '../constants';

interface ResultsScreenProps {
  userAnswers: UserAnswers;
  durationInSeconds: number;
  onRestartQuiz: () => void;
  onReviewAnswers: () => void;
}

const categoryNames: { [key in QuizCategory]: string } = {
  education: 'علوم التربية',
  didactic: 'ديداكتيك الرياضيات',
  admin: 'التنظيم الإداري',
  math: 'الرياضيات التطبيقية',
  skills: 'الكفايات المهنية',
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ userAnswers, durationInSeconds, onRestartQuiz, onReviewAnswers }) => {
  
  const results = useMemo<QuizResults>(() => {
    const calculatedResults: any = {};
    (Object.keys(quizData) as QuizCategory[]).forEach(category => {
      const questions = quizData[category];
      let correct = 0;
      let incorrect = 0;
      
      questions.forEach(q => {
        if (userAnswers[q.id] !== undefined) {
          if (userAnswers[q.id] === q.correct) {
            correct++;
          } else {
            incorrect++;
          }
        }
      });
      
      const unanswered = questions.length - (correct + incorrect);
      calculatedResults[category] = {
        correct,
        incorrect,
        unanswered,
        total: questions.length,
        percentage: ((correct / questions.length) * 100).toFixed(2),
      };
    });
    return calculatedResults;
  }, [userAnswers]);

  // FIX: Cast Object.values(results) to CategoryResult[] as TypeScript was not correctly inferring the type from the useMemo hook, which caused follow-on errors.
  const totalCorrect = (Object.values(results) as CategoryResult[]).reduce((acc, res) => acc + res.correct, 0);
  const totalQuestions = Object.values(quizData).reduce((acc, cat) => acc + cat.length, 0);
  const totalPercentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'ممتاز - أنت مستعد بشكل ممتاز!';
    if (percentage >= 80) return 'جيد جداً - أداء رائع!';
    if (percentage >= 70) return 'جيد - أنت على الطريق الصحيح';
    if (percentage >= 60) return 'مقبول - بحاجة لمزيد من المراجعة';
    return 'ضعيف - يحتاج إلى تحضير إضافي';
  };

  const getRecommendation = (res: QuizResults): string => {
    const weakAreas = (Object.keys(res) as QuizCategory[]).filter(cat => parseFloat(res[cat].percentage) < 60);
    if (weakAreas.length === 0) {
      return 'أداء ممتاز في جميع المحاور! استمر في المراجعة للحفاظ على هذا المستوى.';
    }
    return `ينصح بالتركيز على المحاور التالية: ${weakAreas.map(cat => categoryNames[cat]).join('، ')}. راجع المفاهيم الأساسية في هذه المحاور.`;
  };

  const formatDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
  };

  const grade = getGrade(totalPercentage);
  const recommendation = getRecommendation(results);
  const duration = formatDuration(durationInSeconds);

  return (
    <div className="p-6">
      <div className="bg-accent text-white p-8 rounded-lg text-center shadow-sm mb-8">
        <h3 className="text-3xl font-bold mb-3">النتيجة النهائية</h3>
        <div className="text-6xl font-bold my-4">{totalCorrect} / {totalQuestions}</div>
        <p className="text-2xl">النسبة المئوية: {totalPercentage.toFixed(2)}%</p>
        <p className="text-xl mt-3">{grade}</p>
        <p className="mt-4 text-lg opacity-90">الوقت المستغرق: {duration}</p>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-8">
        <h3 className="text-2xl font-bold text-primary mb-6">تحليل مفصل حسب المحاور</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Object.keys(results) as QuizCategory[]).map(cat => (
            <div key={cat} className="bg-background p-5 rounded-lg border border-border text-center">
              <div className="font-semibold text-primary">{categoryNames[cat]}</div>
              <div className="text-4xl font-extrabold my-2 text-accent">{results[cat].correct}/{results[cat].total}</div>
              <div className="text-lg font-semibold text-primary">{results[cat].percentage}%</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`p-6 rounded-lg mb-8 ${totalPercentage >= 60 ? 'bg-green-50 border-success' : 'bg-orange-50 border-warning'} border-r-4`}>
        <h3 className={`text-2xl font-bold mb-3 ${totalPercentage >= 60 ? 'text-success' : 'text-warning'}`}>
          {totalPercentage >= 60 ? 'تهانينا!' : 'يمكنك تحسين أدائك'}
        </h3>
        <p className="text-primary">{recommendation}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button 
          onClick={onReviewAnswers} 
          className="bg-accent text-accent-text font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-accent-hover transition-all text-lg"
        >
          مراجعة الإجابات
        </button>
        <button 
          onClick={onRestartQuiz} 
          className="bg-secondary text-white font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-secondary/80 transition-all text-lg"
        >
          إعادة الاختبار
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;