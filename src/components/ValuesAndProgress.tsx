import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Heart,
  HelpCircle,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { QuizQuestion, Story, UserProgress } from '../types/story';
import { STORY_CATEGORIES } from '../data/stories';
import { evaluateGamification } from '../data/gamification';

interface ValuesAndProgressProps {
  stories: Story[];
  progress: UserProgress;
  onOpenStory: (storyId: string) => void;
  onOpenProfile: () => void;
  onResetProgress: () => void;
}

interface MixedQuestionItem {
  storyId: string;
  storyTitle: string;
  quiz: QuizQuestion;
}

interface ValueCluster {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}

const VALUE_CLUSTERS: ValueCluster[] = [
  {
    id: 'truth',
    title: 'الصدق والأمانة',
    description: 'قصص ترسخ أن الصدق منجاة في الدنيا والآخرة مهما بدت المواقف صعبة.',
    keywords: ['الصدق', 'الأمانة'],
  },
  {
    id: 'parents',
    title: 'الحكمة وبر الوالدين',
    description: 'وصايا قرآنية ونبوية في طاعة الوالدين وتقدير تعبهما وحسن الأدب.',
    keywords: ['بر الوالدين', 'الحكمة', 'رضا الوالدين'],
  },
  {
    id: 'teamwork',
    title: 'التعاون والمثابرة والحزم',
    description: 'حكايات تعلم العمل الجماعي والاستعداد المبكر وعدم الاستسلام حتى بلوغ الهدف.',
    keywords: ['التعاون', 'المثابرة', 'عدم الاستسلام', 'القناعة', 'الاعتماد على النفس', 'الحزم', 'الاستعداد', 'التسويف'],
  },
  {
    id: 'gratitude',
    title: 'شكر النعم والصدقة والرفق والوفاء',
    description: 'دروس في العطاء ومساعدة المحتاجين والرفق بالحيوان والوفاء للأصدقاء.',
    keywords: ['شكر', 'الصدقة', 'الإحسان', 'الرفق', 'عفة النفس', 'معروف', 'التسامح', 'الوفاء'],
  },
  {
    id: 'faith',
    title: 'الثقة بالله والثبات والتواضع',
    description: 'مواقف إيمانية تعمق حسن الظن بالله، واليقين بقدرته، والتواضع عند العلم.',
    keywords: ['الإيمان', 'التوكل', 'اليقين', 'التواضع', 'قدرة الله', 'حسن الظن', 'عظمة', 'الآخرة'],
  },
  {
    id: 'learning',
    title: 'حب العلم والتفكير وإتقان العمل',
    description: 'قصائد وحكايات تشجع على محبة المدرسة، والتفكير السليم، وإتقان كل عمل.',
    keywords: ['العلم', 'المدرسة', 'إتقان', 'الغضب', 'حفظ اللسان', 'التفكير', 'الذكاء'],
  },
];

function buildMixedQuestions(stories: Story[]): MixedQuestionItem[] {
  const pool: MixedQuestionItem[] = [];
  stories.forEach((story) => {
    story.quiz.forEach((q) => {
      pool.push({
        storyId: story.id,
        storyTitle: story.title,
        quiz: q,
      });
    });
  });

  // Deterministic-friendly shuffle on demand
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 5);
}

export const ValuesAndProgress: React.FC<ValuesAndProgressProps> = ({
  stories,
  progress,
  onOpenStory,
  onOpenProfile,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [mixedQuestions, setMixedQuestions] = useState<MixedQuestionItem[]>(() =>
    buildMixedQuestions(stories)
  );
  const [mixedAnswers, setMixedAnswers] = useState<Record<number, number>>({});
  const [mixedSubmitted, setMixedSubmitted] = useState(false);

  const totalQuizPoints = Object.values(progress.quizScores).reduce(
    (sum, item) => sum + item.score,
    0
  );
  const totalQuizPossible = Object.values(progress.quizScores).reduce(
    (sum, item) => sum + item.total,
    0
  );
  const gamification = useMemo(
    () => evaluateGamification(progress, stories),
    [progress, stories]
  );

  const groupedByValue = useMemo(() => {
    return VALUE_CLUSTERS.map((cluster) => {
      const matched = stories.filter((story) =>
        cluster.keywords.some((kw) => story.coreValue.includes(kw))
      );
      return {
        ...cluster,
        stories: matched,
      };
    });
  }, [stories]);

  const mixedAnsweredCount = Object.keys(mixedAnswers).length;
  const mixedScore = mixedQuestions.reduce(
    (acc, item, idx) =>
      mixedAnswers[idx] === item.quiz.correctIndex ? acc + 1 : acc,
    0
  );

  const handleNewMixedRound = () => {
    setMixedQuestions(buildMixedQuestions(stories));
    setMixedAnswers({});
    setMixedSubmitted(false);
  };

  const completedStoriesList = stories.filter((s) =>
    progress.completedStoryIds.includes(s.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header + Progress Reset */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6E0D4] dark:border-slate-800">
        <div>
          <h1 className="font-serif-arabic text-3xl font-bold text-[#1C2421] dark:text-slate-100">
            خريطة القيم وتقدم التعلّم
          </h1>
          <p className="text-sm text-[#4B5853] dark:text-slate-400 mt-1">
            تابع إنجاز طفلك في القراءة والاختبارات والتحديات، واستكشف القصص مرتبة حسب القيمة التربوية
          </p>
        </div>

        <div className="shrink-0">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#4B5853] dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تصفير سجل التقدم</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-1.5">
              <span className="text-xs text-rose-800 dark:text-rose-200">تأكيد المسح؟</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 text-xs font-medium bg-rose-600 text-white rounded-md cursor-pointer"
              >
                نعم، امسح
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 text-xs font-medium text-[#4B5853] dark:text-slate-300 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4-Card Mastery Summary */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={onOpenProfile}
          className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 hover:border-[#C88A1E] rounded-xl p-5 flex items-center justify-between text-right transition-colors cursor-pointer"
        >
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">النقاط والأوسمة</p>
            <p className="text-xl sm:text-2xl font-bold text-[#C88A1E] dark:text-amber-400 tabular-nums">
              {gamification.totalPoints} نقطة
            </p>
            <p className="text-[11px] text-[#0D7A5F] dark:text-emerald-400 mt-0.5">
              {gamification.earnedBadges.length} وسام مكتسب ←
            </p>
          </div>
          <Award className="w-7 h-7 text-[#C88A1E] dark:text-amber-400 shrink-0" />
        </button>

        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">القصص المقروءة</p>
            <p className="text-2xl font-bold text-[#0D7A5F] dark:text-emerald-400 tabular-nums">
              {progress.completedStoryIds.length} / {stories.length}
            </p>
          </div>
          <BookOpen className="w-7 h-7 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">نقاط الاختبارات</p>
            <p className="text-2xl font-bold text-[#1C2421] dark:text-slate-100 tabular-nums">
              {totalQuizPoints}
              {totalQuizPossible > 0 ? ` / ${totalQuizPossible}` : ''}
            </p>
          </div>
          <HelpCircle className="w-7 h-7 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">تحديات منجزة</p>
            <p className="text-2xl font-bold text-[#1C2421] dark:text-slate-100 tabular-nums">
              {progress.completedChallenges.length} تحدي
            </p>
          </div>
          <Sparkles className="w-7 h-7 text-[#C88A1E] dark:text-amber-400 shrink-0" />
        </div>
      </section>

      {/* Two-Column: Values Explorer + Mixed Stories Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Educational Values Explorer */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0D7A5F] dark:text-emerald-400" />
            <h2 className="font-serif-arabic text-2xl font-bold text-[#1C2421] dark:text-slate-100">
              استكشف القصص حسب القيمة التربوية
            </h2>
          </div>

          <div className="space-y-4">
            {groupedByValue.map((group) => (
              <div
                key={group.id}
                className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif-arabic text-lg font-bold text-[#1C2421] dark:text-slate-100">
                    {group.title}
                  </h3>
                  <span className="text-xs text-[#64706B] dark:text-slate-400 tabular-nums shrink-0">
                    {group.stories.length} قصص
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300">
                  {group.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {group.stories.map((story) => {
                    const done = progress.completedStoryIds.includes(story.id);
                    const catLabel =
                      STORY_CATEGORIES.find((c) => c.id === story.category)?.label ?? '';
                    return (
                      <button
                        key={story.id}
                        type="button"
                        onClick={() => onOpenStory(story.id)}
                        className="text-right rounded-lg border border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/60 hover:border-[#0D7A5F] dark:hover:border-emerald-400 p-3 transition-colors cursor-pointer flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1C2421] dark:text-slate-100 truncate">
                            {story.title}
                          </p>
                          <p className="text-xs text-[#64706B] dark:text-slate-400 mt-0.5 truncate">
                            {catLabel} · {story.coreValue}
                          </p>
                        </div>
                        {done && (
                          <CheckCircle2 className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mixed Stories Challenge + Completed Log */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Mixed Quiz */}
          <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EBE0] dark:border-slate-800">
              <div>
                <h2 className="font-serif-arabic text-xl font-bold text-[#1C2421] dark:text-slate-100">
                  تحدي الحكايات الشامل
                </h2>
                <p className="text-xs text-[#4B5853] dark:text-slate-400 mt-0.5">
                  ٥ أسئلة عشوائية من مختلف قصص المكتبة
                </p>
              </div>
              <button
                type="button"
                onClick={handleNewMixedRound}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 hover:bg-[#F3EFE6] dark:hover:bg-slate-800 text-[#1C2421] dark:text-slate-200 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تحدٍ جديد</span>
              </button>
            </div>

            <div className="space-y-4">
              {mixedQuestions.map((item, idx) => {
                const chosen = mixedAnswers[idx];
                return (
                  <div
                    key={`${item.storyId}-${idx}`}
                    className="rounded-lg border border-[#E6E0D4] dark:border-slate-800 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#0D7A5F] dark:text-emerald-400">
                      <button
                        type="button"
                        onClick={() => onOpenStory(item.storyId)}
                        className="hover:underline truncate cursor-pointer"
                      >
                        من قصة: {item.storyTitle}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#1C2421] dark:text-slate-100">
                      {idx + 1}. {item.quiz.question}
                    </p>
                    <div className="space-y-1.5">
                      {item.quiz.options.map((opt, optIdx) => {
                        const isSelected = chosen === optIdx;
                        const isCorrect = optIdx === item.quiz.correctIndex;
                        let cls =
                          'border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/60 text-[#1C2421] dark:text-slate-200';
                        if (mixedSubmitted) {
                          if (isCorrect) {
                            cls =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-medium';
                          } else if (isSelected && !isCorrect) {
                            cls =
                              'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                          }
                        } else if (isSelected) {
                          cls =
                            'border-[#0D7A5F] dark:border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0D7A5F] dark:text-emerald-300 font-medium';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={mixedSubmitted}
                            onClick={() =>
                              setMixedAnswers((prev) => ({ ...prev, [idx]: optIdx }))
                            }
                            className={`w-full text-right px-3 py-2 text-xs rounded-lg border transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {mixedSubmitted && (
                      <p className="text-xs text-[#4B5853] dark:text-slate-300 pt-1">
                        {item.quiz.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!mixedSubmitted ? (
              <button
                type="button"
                disabled={mixedAnsweredCount < mixedQuestions.length}
                onClick={() => setMixedSubmitted(true)}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                {mixedAnsweredCount < mixedQuestions.length
                  ? `أجب عن جميع الأسئلة (${mixedAnsweredCount}/${mixedQuestions.length})`
                  : 'اعرض نتيجتي في التحدي'}
              </button>
            ) : (
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 p-4 text-center space-y-2">
                <p className="text-base font-bold text-[#1C2421] dark:text-slate-100 tabular-nums">
                  نتيجتك: {mixedScore} من {mixedQuestions.length}
                </p>
                <button
                  type="button"
                  onClick={handleNewMixedRound}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#0D7A5F] text-white cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>جرّب ٥ أسئلة جديدة</span>
                </button>
              </div>
            )}
          </div>

          {/* Completed & Favorite Quick Access */}
          <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#1C2421] dark:text-slate-100 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>سجل القصص المكتملة ({completedStoriesList.length})</span>
            </h3>
            {completedStoriesList.length === 0 ? (
              <p className="text-xs text-[#64706B] dark:text-slate-400 leading-relaxed">
                لم تسجّل إتمام أي قصة بعد. افتح أي قصة واضغط «أتممت قراءة القصة» بعد الانتهاء منها.
              </p>
            ) : (
              <ul className="space-y-2">
                {completedStoriesList.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => onOpenStory(s.id)}
                      className="w-full text-right text-xs sm:text-sm text-[#0D7A5F] dark:text-emerald-400 hover:underline cursor-pointer flex items-center justify-between gap-2"
                    >
                      <span className="truncate">{s.title}</span>
                      {progress.quizScores[s.id] && (
                        <span className="text-xs text-[#64706B] dark:text-slate-400 tabular-nums shrink-0">
                          ({progress.quizScores[s.id].score}/{progress.quizScores[s.id].total})
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
