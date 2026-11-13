import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  Edit3,
  Heart,
  HelpCircle,
  Lock,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import {
  BadgeCategory,
  CharacterId,
  Story,
  UserProgress,
  VirtualBadge,
} from '../types/story';
import { CARTOON_CHARACTERS, CHARACTER_LIST } from '../data/characters';
import { evaluateGamification } from '../data/gamification';
import { CharacterAvatar } from './CharacterAvatar';
import { BadgeEmblem } from './BadgeEmblem';

interface UserProfileProps {
  stories: Story[];
  progress: UserProgress;
  onUpdateProfile: (updates: {
    childName?: string;
    avatarCharacter?: CharacterId;
  }) => void;
  onOpenStory: (storyId: string) => void;
  onBackToLibrary: () => void;
}

const CATEGORY_LABELS: Record<BadgeCategory, string> = {
  reading: 'أوسمة القراءة',
  quiz: 'أوسمة الاختبارات',
  mastery: 'أوسمة التميز والتحدي',
};

function SegmentedBar({
  ratio,
  accent = 'emerald',
}: {
  ratio: number;
  accent?: 'emerald' | 'amber';
}) {
  const filledSegments = Math.max(
    0,
    Math.min(10, Math.round(ratio * 10))
  );
  const fillClass =
    accent === 'amber'
      ? 'bg-[#C88A1E] dark:bg-amber-400'
      : 'bg-[#0D7A5F] dark:bg-emerald-500';

  return (
    <div
      className="grid grid-cols-10 gap-1 w-full"
      role="progressbar"
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          key={idx}
          className={`h-2 rounded-sm transition-colors ${
            idx < filledSegments
              ? fillClass
              : 'bg-[#EBE5D8] dark:bg-slate-800'
          }`}
        />
      ))}
    </div>
  );
}

export const UserProfile: React.FC<UserProfileProps> = ({
  stories,
  progress,
  onUpdateProfile,
  onOpenStory,
  onBackToLibrary,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(progress.childName);
  const [badgeFilter, setBadgeFilter] = useState<BadgeCategory | 'all'>('all');

  const summary = useMemo(
    () => evaluateGamification(progress, stories),
    [progress, stories]
  );

  const filteredEarned = useMemo(() => {
    if (badgeFilter === 'all') return summary.earnedBadges;
    return summary.earnedBadges.filter((b) => b.category === badgeFilter);
  }, [summary.earnedBadges, badgeFilter]);

  const filteredUpcoming = useMemo(() => {
    if (badgeFilter === 'all') return summary.upcomingBadges;
    return summary.upcomingBadges.filter((b) => b.category === badgeFilter);
  }, [summary.upcomingBadges, badgeFilter]);

  const completedStories = useMemo(
    () => stories.filter((s) => progress.completedStoryIds.includes(s.id)),
    [stories, progress.completedStoryIds]
  );

  const favoriteStories = useMemo(
    () => stories.filter((s) => progress.favoriteStoryIds.includes(s.id)),
    [stories, progress.favoriteStoryIds]
  );

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = draftName.trim();
    onUpdateProfile({
      childName: cleaned.length > 0 ? cleaned : 'القارئ الصغير',
    });
    setIsEditingName(false);
  };

  const formatUnlockDate = (iso?: string) => {
    if (!iso) return 'مكتسب';
    try {
      return new Intl.DateTimeFormat('ar-SA', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(iso));
    } catch {
      return 'مكتسب';
    }
  };

  const renderBadgeCard = (badge: VirtualBadge) => {
    const isEarned = badge.isEarned;
    const progressRatio =
      badge.targetProgress > 0
        ? badge.currentProgress / badge.targetProgress
        : 0;

    return (
      <div
        key={badge.id}
        className={`rounded-xl border p-4 sm:p-5 flex items-start gap-4 transition-colors ${
          isEarned
            ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/70'
            : 'bg-[#FAF8F4] dark:bg-slate-900/50 border-[#E6E0D4] dark:border-slate-800'
        }`}
      >
        <BadgeEmblem badge={badge} size="md" />

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif-arabic text-base sm:text-lg font-bold text-[#1C2421] dark:text-slate-100">
              {badge.title}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md tabular-nums ${
                isEarned
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-[#9A670E] dark:text-amber-300'
                  : 'bg-[#EFECE4] dark:bg-slate-800 text-[#64706B] dark:text-slate-400'
              }`}
            >
              +{badge.pointsReward} نقطة
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
            {badge.description}
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#64706B] dark:text-slate-400">
              {CATEGORY_LABELS[badge.category]} · {badge.requirementLabel}
            </span>

            {isEarned ? (
              <span className="inline-flex items-center gap-1 font-medium text-[#0D7A5F] dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>{formatUnlockDate(badge.unlockedAt)}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#64706B] dark:text-slate-400 tabular-nums">
                <Lock className="w-3 h-3" />
                <span>
                  {badge.currentProgress} / {badge.targetProgress}
                </span>
              </span>
            )}
          </div>

          {!isEarned && (
            <div className="pt-1">
              <SegmentedBar ratio={progressRatio} accent="emerald" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* User Profile Hero Card */}
      <section className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar & Editable Reader Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <CharacterAvatar
              id={progress.avatarCharacter}
              size="lg"
              className="ring-4 ring-[#F3EFE6] dark:ring-slate-800 shrink-0"
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[#0D7A5F] dark:text-emerald-400">
                <Trophy className="w-4 h-4 text-[#C88A1E] dark:text-amber-400" />
                <span>
                  ملف تعريف القارئ · المستوى {summary.level.levelNumber}:{' '}
                  {summary.level.title}
                </span>
              </div>

              {!isEditingName ? (
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif-arabic text-2xl sm:text-3xl font-bold text-[#1C2421] dark:text-slate-100">
                    {progress.childName}
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftName(progress.childName);
                      setIsEditingName(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 text-[#4B5853] dark:text-slate-300 hover:bg-[#FAF8F4] dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل الاسم</span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSaveName}
                  className="flex flex-wrap items-center gap-2"
                >
                  <input
                    type="text"
                    value={draftName}
                    maxLength={28}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="اكتب اسم القارئ..."
                    className="px-3 py-1.5 text-sm rounded-lg border border-[#0D7A5F] dark:border-emerald-500 bg-[#FAF8F4] dark:bg-slate-800 text-[#1C2421] dark:text-slate-100 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0D7A5F] text-white hover:bg-[#09604B] cursor-pointer"
                  >
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-2.5 py-1.5 text-xs text-[#64706B] dark:text-slate-400 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </form>
              )}

              <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-400">
                {summary.level.tagline} · الشخصية المفضلة:{' '}
                <strong className="text-[#1C2421] dark:text-slate-200">
                  {CARTOON_CHARACTERS[progress.avatarCharacter].name}
                </strong>
              </p>
            </div>
          </div>

          {/* Points & Stars Highlight Box */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="rounded-xl bg-[#FAF8F4] dark:bg-slate-800/80 border border-[#E6E0D4] dark:border-slate-700 px-4 py-3 text-center">
              <p className="text-[11px] text-[#64706B] dark:text-slate-400">
                مجموع النقاط
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#0D7A5F] dark:text-emerald-400 tabular-nums mt-0.5">
                {summary.totalPoints}
              </p>
            </div>
            <div className="rounded-xl bg-[#FAF8F4] dark:bg-slate-800/80 border border-[#E6E0D4] dark:border-slate-700 px-4 py-3 text-center">
              <p className="text-[11px] text-[#64706B] dark:text-slate-400">
                الأوسمة المكتسبة
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#C88A1E] dark:text-amber-400 tabular-nums mt-0.5">
                {summary.earnedBadges.length}/{summary.badges.length}
              </p>
            </div>
            <div className="rounded-xl bg-[#FAF8F4] dark:bg-slate-800/80 border border-[#E6E0D4] dark:border-slate-700 px-4 py-3 text-center">
              <p className="text-[11px] text-[#64706B] dark:text-slate-400">
                نجوم القراءة
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#1C2421] dark:text-slate-100 tabular-nums mt-0.5">
                {summary.totalStars}
              </p>
            </div>
          </div>
        </div>

        {/* Avatar Character Switcher + Level Progress */}
        <div className="pt-5 border-t border-[#F0EBE0] dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Level Progress Bar */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1C2421] dark:text-slate-200">
                {summary.nextLevel
                  ? `التقدم نحو مستوى «${summary.nextLevel.title}»`
                  : 'وصلت إلى أعلى مستوى: سفير القيم!'}
              </span>
              <span className="text-[#4B5853] dark:text-slate-400 tabular-nums">
                {summary.nextLevel
                  ? `متبقي ${summary.pointsToNextLevel} نقطة (${summary.levelProgressPercent}٪)`
                  : '١٠٠٪ مكتمل'}
              </span>
            </div>
            <SegmentedBar
              ratio={summary.levelProgressPercent / 100}
              accent="amber"
            />
            <p className="text-[11px] text-[#64706B] dark:text-slate-400">
              كيف تكسب النقاط؟ +٢٠ نقطة لكل قصة مقروءة · +١٠ لكل إجابة صحيحة · +١٥
              مكافأة التفوق في الاختبار (٨٠٪+) · +١٠ للتحدي اليومي · ونقاط إضافية
              عند فتح الأوسمة.
            </p>
          </div>

          {/* Choose Avatar Character */}
          <div className="lg:col-span-5 space-y-2">
            <p className="text-xs font-bold text-[#1C2421] dark:text-slate-200">
              اختر شخصية ملفك الشخصي:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {CHARACTER_LIST.map((char) => {
                const selected = progress.avatarCharacter === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() =>
                      onUpdateProfile({ avatarCharacter: char.id })
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg border text-right transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#0D7A5F] bg-emerald-50/70 dark:border-emerald-500 dark:bg-emerald-950/40'
                        : 'border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/50 hover:border-[#0D7A5F]/50'
                    }`}
                  >
                    <CharacterAvatar id={char.id} size="sm" />
                    <span className="text-xs font-bold text-[#1C2421] dark:text-slate-100 truncate">
                      {char.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Activity Breakdown */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400">
              القصص المقروءة
            </p>
            <p className="text-xl font-bold text-[#1C2421] dark:text-slate-100 tabular-nums mt-0.5">
              {summary.completedCount} / {stories.length}
            </p>
          </div>
          <BookOpen className="w-6 h-6 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400">
              اختبارات بدرجة عالية (٨٠٪+)
            </p>
            <p className="text-xl font-bold text-[#1C2421] dark:text-slate-100 tabular-nums mt-0.5">
              {summary.highScoreQuizCount} اختبارات
            </p>
          </div>
          <HelpCircle className="w-6 h-6 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400">
              علامات كاملة (١٠٠٪)
            </p>
            <p className="text-xl font-bold text-[#C88A1E] dark:text-amber-400 tabular-nums mt-0.5">
              {summary.perfectQuizCount} اختبارات
            </p>
          </div>
          <Star className="w-6 h-6 text-[#C88A1E] dark:text-amber-400 shrink-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64706B] dark:text-slate-400">
              تحديات سلوكية منجزة
            </p>
            <p className="text-xl font-bold text-[#1C2421] dark:text-slate-100 tabular-nums mt-0.5">
              {summary.challengesCount} تحدي
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-[#C88A1E] dark:text-amber-400 shrink-0" />
        </div>
      </section>

      {/* Badge Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#C88A1E] dark:text-amber-400" />
          <h2 className="font-serif-arabic text-2xl font-bold text-[#1C2421] dark:text-slate-100">
            خزانة الأوسمة الافتراضية
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'كل الأوسمة' },
              { id: 'reading', label: 'أوسمة القراءة' },
              { id: 'quiz', label: 'أوسمة الاختبارات' },
              { id: 'mastery', label: 'التميز والتحدي' },
            ] as { id: BadgeCategory | 'all'; label: string }[]
          ).map((tab) => {
            const active = badgeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setBadgeFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  active
                    ? 'border-[#0D7A5F] bg-[#0D7A5F] text-white dark:border-emerald-500 dark:bg-emerald-600'
                    : 'border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#4B5853] dark:text-slate-300 hover:bg-[#FAF8F4]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Earned Badges Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1C2421] dark:text-slate-100">
            الأوسمة المكتسبة ({filteredEarned.length})
          </h3>
          {summary.badgeBonusPoints > 0 && (
            <span className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400 tabular-nums">
              مكافآت الأوسمة: +{summary.badgeBonusPoints} نقطة
            </span>
          )}
        </div>

        {filteredEarned.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-6 sm:p-8 text-center space-y-3">
            <p className="font-serif-arabic text-lg font-bold text-[#1C2421] dark:text-slate-100">
              {badgeFilter === 'all'
                ? 'لم تحصل على أوسمة في ملفك بعد'
                : 'لا توجد أوسمة مكتسبة في هذا التصنيف بعد'}
            </p>
            <p className="text-sm text-[#4B5853] dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              اقرأ أول قصة تعليمية واضغط على «أتممت قراءة القصة» أو أجب عن أسئلة الاختبار التفاعلي بدرجة عالية لتحصل على أول وسام ذهبي!
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onBackToLibrary}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>تصفح مكتبة القصص</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEarned.map(renderBadgeCard)}
          </div>
        )}
      </section>

      {/* Upcoming / Locked Badges Section */}
      {filteredUpcoming.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-base font-bold text-[#4B5853] dark:text-slate-300">
            أوسمة تنتظر إنجازك ({filteredUpcoming.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUpcoming.map(renderBadgeCard)}
          </div>
        </section>
      )}

      {/* Completed & Favorite Stories Quick Shelf */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#1C2421] dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400" />
            <span>القصص التي أتممتها ({completedStories.length})</span>
          </h3>
          {completedStories.length === 0 ? (
            <p className="text-xs text-[#64706B] dark:text-slate-400">
              ستظهر هنا قائمة القصص التي أنهيتها مع درجات اختباراتك.
            </p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {completedStories.map((s) => {
                const quiz = progress.quizScores[s.id];
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => onOpenStory(s.id)}
                      className="w-full text-right px-3 py-2 rounded-lg bg-[#FAF8F4] dark:bg-slate-800/60 hover:border-[#0D7A5F] border border-[#E6E0D4] dark:border-slate-700 text-xs sm:text-sm text-[#1C2421] dark:text-slate-200 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="truncate">{s.title}</span>
                      {quiz && (
                        <span className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400 tabular-nums shrink-0">
                          الاختبار: {quiz.score}/{quiz.total}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#1C2421] dark:text-slate-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>قصصي المفضلة ({favoriteStories.length})</span>
          </h3>
          {favoriteStories.length === 0 ? (
            <p className="text-xs text-[#64706B] dark:text-slate-400">
              اضغط على أيقونة القلب في أي قصة لحفظها في قائمتك المفضلة.
            </p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {favoriteStories.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onOpenStory(s.id)}
                    className="w-full text-right px-3 py-2 rounded-lg bg-[#FAF8F4] dark:bg-slate-800/60 hover:border-rose-400 border border-[#E6E0D4] dark:border-slate-700 text-xs sm:text-sm text-[#1C2421] dark:text-slate-200 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="truncate">{s.title}</span>
                    <span className="text-xs text-[#64706B] dark:text-slate-400 shrink-0">
                      {CARTOON_CHARACTERS[s.featuredCharacter].name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};
