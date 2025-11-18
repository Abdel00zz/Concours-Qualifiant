
import React from 'react';
import { quizData } from '../constants';

interface IntroScreenProps {
  onStartQuiz: () => void;
}

const INFOBOX_COLORS = {
  accent: '#2563eb',
  warning: '#f59e0b',
} as const;

type InfoBoxTone = keyof typeof INFOBOX_COLORS;

const StatCard: React.FC<{ label: string; count: number }> = ({ label, count }) => (
  <div className="bg-surface border border-border p-6 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
    <div className="font-semibold text-primary">{label}</div>
    <div className="text-4xl font-bold my-2 text-accent">{count}</div>
    <div className="text-sm text-primary">سؤال</div>
  </div>
);

const InfoBox: React.FC<{ title: string; tone: InfoBoxTone; children: React.ReactNode }> = ({ title, tone, children }) => {
  const highlight = INFOBOX_COLORS[tone];
  return (
    <div className="bg-background border-r-4 p-5 rounded-md my-6" style={{ borderColor: highlight }}>
      <h3 className="font-bold text-xl mb-3" style={{ color: highlight }}>
        {title}
      </h3>
      <ul className="space-y-2 pr-5 list-disc list-inside text-primary">{children}</ul>
    </div>
  );
};

const IntroScreen: React.FC<IntroScreenProps> = ({ onStartQuiz }) => {
  const categoryCounts = {
    education: quizData.education.length,
    didactic: quizData.didactic.length,
    admin: quizData.admin.length,
    math: quizData.math.length,
    skills: quizData.skills.length,
  };

  const totalQuestions = Object.values(categoryCounts).reduce((acc, value) => acc + value, 0);

  return (
    <div className="p-6 sm:p-10">
      <div className="bg-surface p-6 rounded-lg border border-border">
        <h2 className="text-3xl font-bold text-primary mb-4">مرحباً بك في الاختبار التفاعلي!</h2>

        <InfoBox title="معلومات هامة" tone="accent">
          <li>
            الاختبار يتكون من <strong>{totalQuestions} سؤال</strong> موزعة على 5 محاور
          </li>
          <li>
            كل سؤال يساوي <strong>نقطة واحدة</strong>
          </li>
          <li>
            المدة المقترحة: <strong>3 ساعات</strong> (اختياري)
          </li>
          <li>يمكنك مراجعة إجاباتك في أي وقت</li>
          <li>ستحصل على تقرير مفصل عند الانتهاء</li>
        </InfoBox>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-8">
          <StatCard label="علوم التربية" count={categoryCounts.education} />
          <StatCard label="ديداكتيك الرياضيات" count={categoryCounts.didactic} />
          <StatCard label="التنظيم الإداري" count={categoryCounts.admin} />
          <StatCard label="الرياضيات التطبيقية" count={categoryCounts.math} />
          <StatCard label="الكفايات المهنية" count={categoryCounts.skills} />
        </div>

        <InfoBox title="نصائح مهمة" tone="warning">
          <li>اقرأ كل سؤال بعناية قبل الإجابة</li>
          <li>لا تقضِ وقتاً طويلاً على سؤال واحد</li>
          <li>يمكنك العودة لأي سؤال لاحقاً</li>
          <li>راجع إجاباتك قبل إرسال الاختبار</li>
        </InfoBox>

        <div className="text-center mt-10">
          <button
            onClick={onStartQuiz}
            className="bg-accent text-accent-text font-bold py-3 px-10 rounded-lg shadow-sm hover:bg-accent-hover transform transition-all text-lg"
          >
            ابدأ الاختبار الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
