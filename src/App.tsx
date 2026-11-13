import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  AgeGroup,
  AppView,
  CharacterId,
  StoryCategory,
  UserProgress,
  VirtualBadge,
} from './types/story';
import { STORIES } from './data/stories';
import { evaluateGamification } from './data/gamification';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { CharactersSection } from './components/CharactersSection';
import { StoryLibrary } from './components/StoryLibrary';
import { StoryReader } from './components/StoryReader';
import { ValuesAndProgress } from './components/ValuesAndProgress';
import { UserProfile } from './components/UserProfile';
import { EducatorGuide } from './components/EducatorGuide';
import { BadgeEmblem } from './components/BadgeEmblem';

const PROGRESS_STORAGE_KEY = 'matar_aljalasat_progress_v1';
const THEME_STORAGE_KEY = 'matar_aljalasat_theme_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedStoryIds: [],
  favoriteStoryIds: [],
  quizScores: {},
  completedChallenges: [],
  lastReadStoryId: null,
  childName: 'القارئ الصغير',
  avatarCharacter: 'talia',
  badgeUnlockedAt: {},
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const validChar: CharacterId =
      parsed.avatarCharacter === 'talia' ||
      parsed.avatarCharacter === 'leen' ||
      parsed.avatarCharacter === 'muadh'
        ? parsed.avatarCharacter
        : 'talia';

    const base: UserProgress = {
      completedStoryIds: Array.isArray(parsed.completedStoryIds)
        ? parsed.completedStoryIds
        : [],
      favoriteStoryIds: Array.isArray(parsed.favoriteStoryIds)
        ? parsed.favoriteStoryIds
        : [],
      quizScores:
        parsed.quizScores && typeof parsed.quizScores === 'object'
          ? parsed.quizScores
          : {},
      completedChallenges: Array.isArray(parsed.completedChallenges)
        ? parsed.completedChallenges
        : [],
      lastReadStoryId:
        typeof parsed.lastReadStoryId === 'string' ? parsed.lastReadStoryId : null,
      childName:
        typeof parsed.childName === 'string' && parsed.childName.trim().length > 0
          ? parsed.childName
          : 'القارئ الصغير',
      avatarCharacter: validChar,
      badgeUnlockedAt:
        parsed.badgeUnlockedAt && typeof parsed.badgeUnlockedAt === 'object'
          ? parsed.badgeUnlockedAt
          : {},
    };

    // Silently backfill unlock timestamps for any already-earned badges
    const evaluated = evaluateGamification(base, STORIES);
    const syncedDates = { ...base.badgeUnlockedAt };
    const nowIso = new Date().toISOString();
    evaluated.earnedBadges.forEach((b) => {
      if (!syncedDates[b.id]) {
        syncedDates[b.id] = nowIso;
      }
    });

    return {
      ...base,
      badgeUnlockedAt: syncedDates,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function loadTheme(): boolean {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('library');
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [isDark, setIsDark] = useState<boolean>(loadTheme);
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | 'all'>('all');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'all'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | 'all'>('all');
  const [activeStoryId, setActiveStoryId] = useState<string>(
    () => progress.lastReadStoryId ?? STORIES[0].id
  );
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<VirtualBadge[]>([]);
  const toastTimerRef = useRef<number | null>(null);
  const prevEarnedIdsRef = useRef<Set<string>>(
    new Set(
      evaluateGamification(progress, STORIES).earnedBadges.map((b) => b.id)
    )
  );

  // Persist progress to localStorage and celebrate newly unlocked badges
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors cleanly
    }

    const currentEarned = evaluateGamification(progress, STORIES).earnedBadges;
    const newlyEarned = currentEarned.filter(
      (b) => !prevEarnedIdsRef.current.has(b.id)
    );
    prevEarnedIdsRef.current = new Set(currentEarned.map((b) => b.id));

    if (newlyEarned.length > 0) {
      setNewlyUnlockedBadges(newlyEarned);
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      toastTimerRef.current = window.setTimeout(() => {
        setNewlyUnlockedBadges([]);
      }, 9000);
    }
  }, [progress]);

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors cleanly
    }
  }, [isDark]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const characterStoryCounts = useMemo<Record<CharacterId, number>>(() => {
    return STORIES.reduce(
      (acc, story) => {
        acc[story.featuredCharacter] += 1;
        return acc;
      },
      { talia: 0, leen: 0, muadh: 0 }
    );
  }, []);

  const featuredStory =
    STORIES.find((s) => s.id === 'talia-leen-muadh-time') ?? STORIES[0];
  const activeStory =
    STORIES.find((s) => s.id === activeStoryId) ?? featuredStory;

  const updateProgressWithBadges = (
    updater: (prev: UserProgress) => UserProgress
  ) => {
    setProgress((prev) => {
      const nextBase = updater(prev);
      const nextSummary = evaluateGamification(nextBase, STORIES);
      const nowIso = new Date().toISOString();
      const updatedDates = { ...nextBase.badgeUnlockedAt };
      let changed = false;

      nextSummary.earnedBadges.forEach((b) => {
        if (!updatedDates[b.id]) {
          updatedDates[b.id] = nowIso;
          changed = true;
        }
      });

      return changed
        ? { ...nextBase, badgeUnlockedAt: updatedDates }
        : nextBase;
    });
  };

  const handleOpenStory = (storyId: string) => {
    setActiveStoryId(storyId);
    setProgress((prev) => ({
      ...prev,
      lastReadStoryId: storyId,
    }));
    setCurrentView('reader');
  };

  const handleStartFeatured = () => {
    const targetId = progress.lastReadStoryId ?? featuredStory.id;
    handleOpenStory(targetId);
  };

  const handleOpenProfile = () => {
    setNewlyUnlockedBadges([]);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (storyId: string) => {
    setProgress((prev) => {
      const exists = prev.favoriteStoryIds.includes(storyId);
      return {
        ...prev,
        favoriteStoryIds: exists
          ? prev.favoriteStoryIds.filter((id) => id !== storyId)
          : [...prev.favoriteStoryIds, storyId],
      };
    });
  };

  const handleToggleCompleted = (storyId: string) => {
    updateProgressWithBadges((prev) => {
      const exists = prev.completedStoryIds.includes(storyId);
      return {
        ...prev,
        completedStoryIds: exists
          ? prev.completedStoryIds.filter((id) => id !== storyId)
          : [...prev.completedStoryIds, storyId],
      };
    });
  };

  const handleRecordQuizScore = (storyId: string, score: number, total: number) => {
    updateProgressWithBadges((prev) => {
      const existing = prev.quizScores[storyId];
      const bestScore = existing ? Math.max(existing.score, score) : score;
      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [storyId]: { score: bestScore, total },
        },
      };
    });
  };

  const handleToggleChallenge = (storyId: string) => {
    updateProgressWithBadges((prev) => {
      const exists = prev.completedChallenges.includes(storyId);
      return {
        ...prev,
        completedChallenges: exists
          ? prev.completedChallenges.filter((id) => id !== storyId)
          : [...prev.completedChallenges, storyId],
      };
    });
  };

  const handleUpdateProfile = (updates: {
    childName?: string;
    avatarCharacter?: CharacterId;
  }) => {
    setProgress((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleResetProgress = () => {
    setNewlyUnlockedBadges([]);
    setProgress((prev) => ({
      ...DEFAULT_PROGRESS,
      childName: prev.childName,
      avatarCharacter: prev.avatarCharacter,
    }));
  };

  const handleScrollToLibrary = () => {
    setCurrentView('library');
    requestAnimationFrame(() => {
      const el = document.getElementById('story-library');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const handleSelectCharacterFromShowcase = (charId: CharacterId | 'all') => {
    setSelectedCharacter(charId);
    if (charId !== 'all') {
      requestAnimationFrame(() => {
        const el = document.getElementById('story-library');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#0F172A] text-[#1C2421] dark:text-slate-100 transition-colors">
      <TopBar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartFeatured={handleStartFeatured}
        hasLastRead={!!progress.lastReadStoryId}
      />

      <main className="flex-1">
        {currentView === 'library' && (
          <>
            <HeroSection
              featuredStory={featuredStory}
              totalStories={STORIES.length}
              progress={progress}
              isDark={isDark}
              onToggleDark={() => setIsDark((prev) => !prev)}
              onOpenStory={handleOpenStory}
              onScrollToLibrary={handleScrollToLibrary}
              onOpenValues={() => {
                setCurrentView('values');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenProfile={handleOpenProfile}
            />
            <CharactersSection
              selectedCharacter={selectedCharacter}
              onSelectCharacter={handleSelectCharacterFromShowcase}
              storyCounts={characterStoryCounts}
            />
            <StoryLibrary
              stories={STORIES}
              progress={progress}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedAge={selectedAge}
              onSelectAge={setSelectedAge}
              selectedCharacter={selectedCharacter}
              onSelectCharacter={setSelectedCharacter}
              onOpenStory={handleOpenStory}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        )}

        {currentView === 'reader' && (
          <StoryReader
            story={activeStory}
            allStories={STORIES}
            progress={progress}
            isDark={isDark}
            onToggleDark={() => setIsDark((prev) => !prev)}
            onBackToLibrary={() => {
              setCurrentView('library');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenProfile={handleOpenProfile}
            onOpenStory={handleOpenStory}
            onToggleFavorite={handleToggleFavorite}
            onToggleCompleted={handleToggleCompleted}
            onRecordQuizScore={handleRecordQuizScore}
            onToggleChallenge={handleToggleChallenge}
          />
        )}

        {currentView === 'values' && (
          <ValuesAndProgress
            stories={STORIES}
            progress={progress}
            onOpenStory={handleOpenStory}
            onOpenProfile={handleOpenProfile}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentView === 'profile' && (
          <UserProfile
            stories={STORIES}
            progress={progress}
            onUpdateProfile={handleUpdateProfile}
            onOpenStory={handleOpenStory}
            onBackToLibrary={() => {
              setCurrentView('library');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'guide' && (
          <EducatorGuide stories={STORIES} onOpenStory={handleOpenStory} />
        )}
      </main>

      {/* Newly Earned Virtual Badge Celebration Banner */}
      {newlyUnlockedBadges.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-50 bg-white dark:bg-slate-900 border-2 border-[#C88A1E] dark:border-amber-500 rounded-2xl p-4 shadow-xl space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <BadgeEmblem badge={newlyUnlockedBadges[0]} size="sm" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#C88A1E] dark:text-amber-400">
                  مبارك! وسام افتراضي جديد
                </p>
                <h3 className="font-serif-arabic text-base font-bold text-[#1C2421] dark:text-slate-100 truncate">
                  {newlyUnlockedBadges[0].title}
                </h3>
                <p className="text-xs text-[#4B5853] dark:text-slate-300">
                  +{newlyUnlockedBadges[0].pointsReward} نقطة إضافية في ملفك
                  {newlyUnlockedBadges.length > 1
                    ? ` (و+${newlyUnlockedBadges.length - 1} أوسمة أخرى)`
                    : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNewlyUnlockedBadges([])}
              className="p-1 text-[#64706B] hover:text-[#1C2421] dark:hover:text-white cursor-pointer"
              aria-label="إغلاق الإشعار"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenProfile}
            className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white cursor-pointer"
          >
            عرض الأوسمة المكتسبة في ملفي
          </button>
        </div>
      )}

      <footer className="border-t border-[#E6E0D4] dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64706B] dark:text-slate-400">
          <p className="font-serif-arabic text-sm font-bold text-[#1C2421] dark:text-slate-200">
            مَعطَر الجَلَسات بأجمل الحكايات للبنين والبنات
          </p>
          <p>
            قصص تعليمية للأطفال بصحبة تاليا ولين ومعاذ · مقتبسة من كتاب عمر سليم
          </p>
        </div>
      </footer>
    </div>
  );
}
