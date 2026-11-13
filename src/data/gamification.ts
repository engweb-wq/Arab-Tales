import { Story, UserProgress, VirtualBadge } from '../types/story';

export interface ReaderLevel {
  levelNumber: number;
  title: string;
  minPoints: number;
  maxPoints: number | null;
  tagline: string;
}

export const READER_LEVELS: ReaderLevel[] = [
  {
    levelNumber: 1,
    title: 'مستكشف مبتدئ',
    minPoints: 0,
    maxPoints: 59,
    tagline: 'بداية مشرقة في عالم الحكايات التعليمية',
  },
  {
    levelNumber: 2,
    title: 'قارئ مثابر',
    minPoints: 60,
    maxPoints: 149,
    tagline: 'خطوات واثقة نحو القيم والعلم النافع',
  },
  {
    levelNumber: 3,
    title: 'صديق الحكمة',
    minPoints: 150,
    maxPoints: 299,
    tagline: 'يجمع بين متعة القراءة وفهم الدروس',
  },
  {
    levelNumber: 4,
    title: 'حكيم الجلسات',
    minPoints: 300,
    maxPoints: 499,
    tagline: 'قدوة جميلة في الفهم والسلوك الطيب',
  },
  {
    levelNumber: 5,
    title: 'سفير القيم',
    minPoints: 500,
    maxPoints: null,
    tagline: 'أعلى وسام للقراءة والتفوق في الاختبارات',
  },
];

export interface GamificationSummary {
  totalPoints: number;
  basePoints: number;
  badgeBonusPoints: number;
  totalStars: number;
  completedCount: number;
  quizCorrectAnswers: number;
  highScoreQuizCount: number;
  perfectQuizCount: number;
  challengesCount: number;
  heroesMetCount: number;
  level: ReaderLevel;
  nextLevel: ReaderLevel | null;
  levelProgressPercent: number;
  pointsToNextLevel: number;
  badges: VirtualBadge[];
  earnedBadges: VirtualBadge[];
  upcomingBadges: VirtualBadge[];
}

export function evaluateGamification(
  progress: UserProgress,
  stories: Story[]
): GamificationSummary {
  const completedCount = progress.completedStoryIds.length;
  const quizEntries = Object.values(progress.quizScores);

  const quizCorrectAnswers = quizEntries.reduce((sum, q) => sum + q.score, 0);

  const highScoreQuizCount = quizEntries.filter(
    (q) => q.total > 0 && q.score / q.total >= 0.8
  ).length;

  const perfectQuizCount = quizEntries.filter(
    (q) => q.total > 0 && q.score === q.total
  ).length;

  const challengesCount = progress.completedChallenges.length;

  // Check how many distinct cartoon heroes (تاليا، لين، معاذ) the child finished stories with
  const completedStorySet = new Set(progress.completedStoryIds);
  const heroesCompleted = new Set(
    stories
      .filter((s) => completedStorySet.has(s.id))
      .map((s) => s.featuredCharacter)
  );
  const heroesMetCount = heroesCompleted.size;

  const rawBadges: Omit<VirtualBadge, 'isEarned' | 'unlockedAt'>[] = [
    // Reading Count Badges
    {
      id: 'first-story',
      title: 'خطوة القارئ الأولى',
      description: 'أتممت قراءة أول قصة تعليمية لك بنجاح.',
      requirementLabel: 'إتمام قراءة قصة واحدة',
      category: 'reading',
      accentColor: 'emerald',
      pointsReward: 20,
      currentProgress: Math.min(completedCount, 1),
      targetProgress: 1,
    },
    {
      id: 'three-stories',
      title: 'صديق الحكايات',
      description: 'واصلت القراءة وأكملت ٣ قصص ملهمة.',
      requirementLabel: 'إتمام قراءة ٣ قصص',
      category: 'reading',
      accentColor: 'emerald',
      pointsReward: 35,
      currentProgress: Math.min(completedCount, 3),
      targetProgress: 3,
    },
    {
      id: 'five-stories',
      title: 'قارئ نَهِم',
      description: 'قرأت ٥ قصص كاملة واكتسبت دروسها القيمة.',
      requirementLabel: 'إتمام قراءة ٥ قصص',
      category: 'reading',
      accentColor: 'sky',
      pointsReward: 50,
      currentProgress: Math.min(completedCount, 5),
      targetProgress: 5,
    },
    {
      id: 'ten-stories',
      title: 'فارس المعرفة',
      description: 'إنجاز رائع بإتمام ١٠ قصص من مكتبة معطر الجلسات.',
      requirementLabel: 'إتمام قراءة ١٠ قصص',
      category: 'reading',
      accentColor: 'amber',
      pointsReward: 80,
      currentProgress: Math.min(completedCount, 10),
      targetProgress: 10,
    },
    // High Quiz Score Badges
    {
      id: 'quiz-ace-first',
      title: 'ذكيّ القصة',
      description: 'أجبت إجابات صحيحة وحققت العلامة الكاملة (١٠٠٪) في اختبار.',
      requirementLabel: 'درجة كاملة في اختبار قصة واحدة',
      category: 'quiz',
      accentColor: 'amber',
      pointsReward: 25,
      currentProgress: Math.min(perfectQuizCount, 1),
      targetProgress: 1,
    },
    {
      id: 'quiz-high-3',
      title: 'عقلٌ متّقد',
      description: 'حققت درجة عالية (٨٠٪ فأعلى) في ٣ اختبارات تفاعلية.',
      requirementLabel: 'درجة ٨٠٪ فأعلى في ٣ اختبارات',
      category: 'quiz',
      accentColor: 'sky',
      pointsReward: 45,
      currentProgress: Math.min(highScoreQuizCount, 3),
      targetProgress: 3,
    },
    {
      id: 'quiz-perfect-5',
      title: 'نجم الاختبارات',
      description: 'تفوق مستمر بتحقيق الدرجة الكاملة في ٥ اختبارات.',
      requirementLabel: 'درجة كاملة (١٠٠٪) في ٥ اختبارات',
      category: 'quiz',
      accentColor: 'amber',
      pointsReward: 75,
      currentProgress: Math.min(perfectQuizCount, 5),
      targetProgress: 5,
    },
    {
      id: 'quiz-points-25',
      title: 'حاصد النقاط',
      description: 'جمعت ٢٥ إجابة صحيحة في اختبارات الفهم التفاعلية.',
      requirementLabel: '٢٥ إجابة صحيحة في الاختبارات',
      category: 'quiz',
      accentColor: 'emerald',
      pointsReward: 60,
      currentProgress: Math.min(quizCorrectAnswers, 25),
      targetProgress: 25,
    },
    // Character & Behavior Mastery Badges
    {
      id: 'all-heroes',
      title: 'رفيق الأبطال الثلاثة',
      description: 'أتممت قصة مع تاليا، وقصة مع لين، وقصة مع معاذ.',
      requirementLabel: 'إتمام قصة مع كل شخصية (٣/٣)',
      category: 'mastery',
      accentColor: 'rose',
      pointsReward: 40,
      currentProgress: Math.min(heroesMetCount, 3),
      targetProgress: 3,
    },
    {
      id: 'challenge-keeper',
      title: 'بطل السلوك الحسن',
      description: 'طبّقت الدروس عملياً وأنجزت ٣ تحديات سلوكية يومية.',
      requirementLabel: 'إنجاز ٣ تحديات سلوكية يومية',
      category: 'mastery',
      accentColor: 'rose',
      pointsReward: 40,
      currentProgress: Math.min(challengesCount, 3),
      targetProgress: 3,
    },
  ];

  const badges: VirtualBadge[] = rawBadges.map((b) => {
    const isEarned = b.currentProgress >= b.targetProgress;
    return {
      ...b,
      isEarned,
      unlockedAt: isEarned ? progress.badgeUnlockedAt?.[b.id] : undefined,
    };
  });

  const earnedBadges = badges.filter((b) => b.isEarned);
  const upcomingBadges = badges.filter((b) => !b.isEarned);

  const basePoints =
    completedCount * 20 +
    quizCorrectAnswers * 10 +
    highScoreQuizCount * 15 +
    challengesCount * 10;

  const badgeBonusPoints = earnedBadges.reduce((sum, b) => sum + b.pointsReward, 0);
  const totalPoints = basePoints + badgeBonusPoints;

  const totalStars = completedCount * 2 + quizCorrectAnswers + challengesCount;

  const level =
    [...READER_LEVELS]
      .reverse()
      .find((lvl) => totalPoints >= lvl.minPoints) ?? READER_LEVELS[0];

  const nextLevel =
    READER_LEVELS.find((lvl) => lvl.levelNumber === level.levelNumber + 1) ?? null;

  let levelProgressPercent = 100;
  let pointsToNextLevel = 0;

  if (nextLevel) {
    const span = nextLevel.minPoints - level.minPoints;
    const gainedInLevel = totalPoints - level.minPoints;
    levelProgressPercent = Math.min(
      100,
      Math.max(0, Math.round((gainedInLevel / span) * 100))
    );
    pointsToNextLevel = Math.max(0, nextLevel.minPoints - totalPoints);
  }

  return {
    totalPoints,
    basePoints,
    badgeBonusPoints,
    totalStars,
    completedCount,
    quizCorrectAnswers,
    highScoreQuizCount,
    perfectQuizCount,
    challengesCount,
    heroesMetCount,
    level,
    nextLevel,
    levelProgressPercent,
    pointsToNextLevel,
    badges,
    earnedBadges,
    upcomingBadges,
  };
}
