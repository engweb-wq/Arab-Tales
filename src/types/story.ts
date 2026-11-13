export type StoryCategory =
  | 'quran'
  | 'seerah'
  | 'morals'
  | 'wisdom'
  | 'poetry';

export type AgeGroup = '٣–٥ سنوات' | '٦–٨ سنوات' | '٩–١١ سنة';

export type CharacterId = 'talia' | 'leen' | 'muadh';

export interface CartoonCharacter {
  id: CharacterId;
  name: string;
  tagline: string;
  accentColor: 'emerald' | 'amber' | 'sky';
  traits: string[];
  educationalRole: string;
  catchphrase: string;
  companionItem: string;
}

export interface AgeGroupProfile {
  id: AgeGroup;
  label: string;
  stageName: string;
  languageStyle: string;
  vocabularyLevel: string;
  lessonComplexity: string;
}

export type IllustrationId =
  | 'donkey-village'
  | 'luqman-wisdom'
  | 'talut-jalut'
  | 'cave-sleepers'
  | 'khidr-sea'
  | 'dhul-qarnayn'
  | 'elephant-kaaba'
  | 'garden-owners'
  | 'kaab-truth'
  | 'wooden-plank'
  | 'cave-rock'
  | 'three-tested'
  | 'ismail-zamzam'
  | 'cloud-garden'
  | 'pen-eraser'
  | 'child-nails'
  | 'candy-bag'
  | 'carpenter-house'
  | 'desert-friends'
  | 'turtle-fireplace'
  | 'two-jars'
  | 'hare-tortoise'
  | 'bee-garden'
  | 'ant-solomon'
  | 'paradise-dust'
  | 'elephant-nelson'
  | 'frogs-tower'
  | 'tamer-cat'
  | 'school-poem';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StoryLesson {
  title: string;
  detail: string;
}

export interface Story {
  id: string;
  title: string;
  category: StoryCategory;
  ageGroup: AgeGroup;
  readingMinutes: number;
  coreValue: string;
  sourceRef: string;
  illustrationId: IllustrationId;
  featuredCharacter: CharacterId;
  characterRoleInStory: string;
  characterTip: string;
  excerpt: string;
  quranOrHadithQuote?: {
    text: string;
    reference: string;
  };
  paragraphs: string[];
  lessons: StoryLesson[];
  quiz: QuizQuestion[];
  dailyChallenge: string;
  discussionPrompt: string;
}

export interface UserProgress {
  completedStoryIds: string[];
  favoriteStoryIds: string[];
  quizScores: Record<string, { score: number; total: number }>;
  completedChallenges: string[];
  lastReadStoryId: string | null;
  childName: string;
  avatarCharacter: CharacterId;
  badgeUnlockedAt: Record<string, string>;
}

export type AppView = 'library' | 'reader' | 'values' | 'profile' | 'guide';

export type BadgeCategory = 'reading' | 'quiz' | 'mastery';

export interface VirtualBadge {
  id: string;
  title: string;
  description: string;
  requirementLabel: string;
  category: BadgeCategory;
  accentColor: 'emerald' | 'amber' | 'sky' | 'rose';
  pointsReward: number;
  currentProgress: number;
  targetProgress: number;
  isEarned: boolean;
  unlockedAt?: string;
}

export interface CategoryMeta {
  id: StoryCategory | 'all';
  label: string;
  description: string;
}
