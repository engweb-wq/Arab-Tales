import React from 'react';
import { BookOpen, Moon, Sun, Award, Compass } from 'lucide-react';
import { Story, UserProgress } from '../types/story';
import { CARTOON_CHARACTERS } from '../data/characters';
import { evaluateGamification } from '../data/gamification';
import { STORIES } from '../data/stories';
import { StoryIllustration } from './StoryIllustration';
import { CharacterAvatar } from './CharacterAvatar';

interface HeroSectionProps {
  featuredStory: Story;
  totalStories: number;
  progress: UserProgress;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenStory: (storyId: string) => void;
  onScrollToLibrary: () => void;
  onOpenValues: () => void;
  onOpenProfile: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredStory,
  totalStories,
  progress,
  isDark,
  onToggleDark,
  onOpenStory,
  onScrollToLibrary,
  onOpenValues,
  onOpenProfile,
}) => {
  const gamification = evaluateGamification(progress, STORIES);
  const featuredGuide = CARTOON_CHARACTERS[featuredStory.featuredCharacter];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
      {/* Utility Strip above Hero */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E6E0D4] dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm text-[#4B5853] dark:text-slate-400">
          <span>موسوعة القصص التعليمية للبنين والبنات</span>
          <span aria-hidden="true">·</span>
          <span>بصحبة تاليا ولين ومعاذ وفق الفئات العمرية</span>
        </div>

        <button
          type="button"
          onClick={onToggleDark}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1C2421] dark:text-slate-200 hover:bg-[#F3EFE6] dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>وضع القراءة النهاري</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#0D7A5F]" />
              <span>وضع قراءة ما قبل النوم</span>
            </>
          )}
        </button>
      </div>

      {/* Balanced 2-Column Editorial Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-8">
        {/* Right Column (RTL Primary Prose): Headline & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-6 sm:p-8">
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400">
              معطر الجلسات بأجمل الحكايات للبنين والبنات
            </p>
            <h1 className="font-serif-arabic text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-snug text-[#1C2421] dark:text-slate-100 [text-wrap:balance]">
              قصص هادفة تبني القيم، وتزرع الحكمة في قلوب الصغار
            </h1>
            <p className="text-base text-[#4B5853] dark:text-slate-300 leading-relaxed max-w-2xl">
              مكتبة تعليمية متكاملة مصنّفة حسب العمر (٣–٥، ٦–٨، ٩–١١ سنة) بقيادة الشخصيات الكرتونية
              تاليا ولين ومعاذ، مع دروس واضحة، وقراءة صوتية، و٣ إلى ٥ أسئلة تفاعلية بعد كل قصة.
            </p>

            {/* Cartoon Trio Companion Preview */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center -space-x-2 space-x-reverse">
                <CharacterAvatar id="talia" size="sm" className="ring-2 ring-white dark:ring-slate-900" />
                <CharacterAvatar id="leen" size="sm" className="ring-2 ring-white dark:ring-slate-900" />
                <CharacterAvatar id="muadh" size="sm" className="ring-2 ring-white dark:ring-slate-900" />
              </div>
              <span className="text-xs text-[#4B5853] dark:text-slate-400">
                أبطال الحكايات: <strong className="text-[#1C2421] dark:text-slate-200">تاليا</strong> (الاستكشاف) · <strong className="text-[#1C2421] dark:text-slate-200">لين</strong> (اللطف) · <strong className="text-[#1C2421] dark:text-slate-200">معاذ</strong> (النظام والقيم)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-[#F0EBE0] dark:border-slate-800">
            <button
              type="button"
              onClick={onScrollToLibrary}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>استكشف مكتبة القصص</span>
            </button>
            <button
              type="button"
              onClick={onOpenValues}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#1C2421] dark:text-slate-200 bg-[#F3EFE6] hover:bg-[#E8E2D5] dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Compass className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400" />
              <span>تصفح حسب القيمة التربوية</span>
            </button>
          </div>
        </div>

        {/* Left Column (RTL Secondary Feature): Featured Story of the Session */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="relative h-48 sm:h-52 w-full bg-[#F3EFE6] dark:bg-slate-800 overflow-hidden">
            <StoryIllustration id={featuredStory.illustrationId} />
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#64706B] dark:text-slate-400 mb-2">
                <span className="font-medium text-[#C88A1E] dark:text-amber-400">حكاية الجلسة المختارة</span>
                <span aria-hidden="true">·</span>
                <span>{featuredStory.ageGroup}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{featuredStory.readingMinutes} دقائق</span>
              </div>
              <h2 className="font-serif-arabic text-xl font-bold text-[#1C2421] dark:text-slate-100 mb-2">
                {featuredStory.title}
              </h2>
              <p className="text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed line-clamp-2">
                {featuredStory.excerpt}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F0EBE0] dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <CharacterAvatar id={featuredGuide.id} size="sm" />
                <span className="text-xs text-[#4B5853] dark:text-slate-400 truncate">
                  بصحبة {featuredGuide.name} · {featuredStory.quiz.length} أسئلة
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenStory(featuredStory.id)}
                className="text-sm font-medium text-[#0D7A5F] dark:text-emerald-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                اقرأ القصة والدرس ←
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width 4-Column Summary Strip below Hero Split */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl px-5 py-4">
          <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">إجمالي الحكايات التعليمية</p>
          <p className="text-2xl font-bold text-[#1C2421] dark:text-slate-100 tabular-nums">
            {totalStories} قصة
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl px-5 py-4">
          <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">القصص المكتملة</p>
          <p className="text-2xl font-bold text-[#0D7A5F] dark:text-emerald-400 tabular-nums">
            {progress.completedStoryIds.length} / {totalStories}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl px-5 py-4">
          <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">تحديات السلوك اليومي</p>
          <p className="text-2xl font-bold text-[#1C2421] dark:text-slate-100 tabular-nums">
            {progress.completedChallenges.length} تحدي
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenProfile}
          className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 hover:border-[#C88A1E] dark:hover:border-amber-500 rounded-xl px-5 py-4 flex items-center justify-between text-right transition-colors cursor-pointer"
        >
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">
              النقاط والأوسمة المكتسبة
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[#C88A1E] dark:text-amber-400 tabular-nums">
              {gamification.totalPoints} نقطة · {gamification.earnedBadges.length} وسام
            </p>
          </div>
          <Award className="w-7 h-7 text-[#C88A1E] dark:text-amber-400 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
