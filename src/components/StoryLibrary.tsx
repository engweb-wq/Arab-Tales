import React, { useMemo, useState } from 'react';
import { Search, Heart, CheckCircle2, BookOpen } from 'lucide-react';
import { AgeGroup, CharacterId, Story, StoryCategory, UserProgress } from '../types/story';
import { STORY_CATEGORIES } from '../data/stories';
import { AGE_GROUP_PROFILES, CARTOON_CHARACTERS } from '../data/characters';
import { StoryIllustration } from './StoryIllustration';
import { CharacterAvatar } from './CharacterAvatar';

interface StoryLibraryProps {
  stories: Story[];
  progress: UserProgress;
  selectedCategory: StoryCategory | 'all';
  onSelectCategory: (cat: StoryCategory | 'all') => void;
  selectedAge: AgeGroup | 'all';
  onSelectAge: (age: AgeGroup | 'all') => void;
  selectedCharacter: CharacterId | 'all';
  onSelectCharacter: (charId: CharacterId | 'all') => void;
  onOpenStory: (storyId: string) => void;
  onToggleFavorite: (storyId: string) => void;
}

export const StoryLibrary: React.FC<StoryLibraryProps> = ({
  stories,
  progress,
  selectedCategory,
  onSelectCategory,
  selectedAge,
  onSelectAge,
  selectedCharacter,
  onSelectCharacter,
  onOpenStory,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredStories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return stories.filter((story) => {
      if (selectedCategory !== 'all' && story.category !== selectedCategory) return false;
      if (selectedAge !== 'all' && story.ageGroup !== selectedAge) return false;
      if (selectedCharacter !== 'all' && story.featuredCharacter !== selectedCharacter) return false;
      if (onlyFavorites && !progress.favoriteStoryIds.includes(story.id)) return false;
      if (!q) return true;
      return (
        story.title.toLowerCase().includes(q) ||
        story.coreValue.toLowerCase().includes(q) ||
        story.excerpt.toLowerCase().includes(q) ||
        CARTOON_CHARACTERS[story.featuredCharacter].name.toLowerCase().includes(q) ||
        story.lessons.some((l) => l.title.toLowerCase().includes(q))
      );
    });
  }, [
    stories,
    selectedCategory,
    selectedAge,
    selectedCharacter,
    onlyFavorites,
    searchQuery,
    progress.favoriteStoryIds,
  ]);

  const ageOptions: (AgeGroup | 'all')[] = ['all', '٣–٥ سنوات', '٦–٨ سنوات', '٩–١١ سنة'];
  const activeAgeProfile = selectedAge !== 'all' ? AGE_GROUP_PROFILES[selectedAge] : null;

  return (
    <section id="story-library" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Section Heading & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif-arabic text-2xl sm:text-3xl font-bold text-[#1C2421] dark:text-slate-100">
            مكتبة القصص والدروس التعليمية
          </h2>
          <p className="text-sm text-[#4B5853] dark:text-slate-400 mt-1">
            اختر الفئة العمرية أو الشخصية المفضلة، واقرأ القصة مع ٣ إلى ٥ أسئلة تفاعلية بعد كل حكاية
          </p>
        </div>

        {/* Search & Favorites Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#64706B] dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن قصة أو شخصية أو قيمة..."
              aria-label="ابحث عن قصة أو شخصية أو قيمة تربوية"
              className="w-full pr-9 pl-3 py-2 text-sm bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-700 rounded-lg text-[#1C2421] dark:text-slate-100 placeholder:text-[#64706B] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              onlyFavorites
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-white dark:bg-slate-900 border-[#E6E0D4] dark:border-slate-700 text-[#4B5853] dark:text-slate-300 hover:bg-[#F3EFE6] dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
            <span>المفضلة ({progress.favoriteStoryIds.length})</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs & Age Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {STORY_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#0D7A5F] text-white dark:bg-emerald-600'
                    : 'text-[#4B5853] dark:text-slate-300 hover:bg-[#F3EFE6] dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-[#F0EBE0] dark:border-slate-800">
          <span className="text-xs text-[#64706B] dark:text-slate-400 whitespace-nowrap">الفئة العمرية:</span>
          <div className="flex items-center gap-1 bg-[#F3EFE6] dark:bg-slate-800 p-1 rounded-lg">
            {ageOptions.map((age) => {
              const active = selectedAge === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => onSelectAge(age)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-700 text-[#1C2421] dark:text-white shadow-xs'
                      : 'text-[#4B5853] dark:text-slate-400 hover:text-[#1C2421] dark:hover:text-white'
                  }`}
                >
                  {age === 'all' ? 'الكل' : age}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Age-Adaptation Linguistic & Lesson Complexity Card */}
      {activeAgeProfile && (
        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#0D7A5F] dark:text-emerald-400">
              {activeAgeProfile.stageName} ({activeAgeProfile.label})
            </p>
            <p className="text-xs text-[#4B5853] dark:text-slate-300 leading-relaxed">
              <strong className="text-[#1C2421] dark:text-slate-100">أسلوب اللغة: </strong>
              {activeAgeProfile.languageStyle}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#1C2421] dark:text-slate-100">المفردات المختارة</p>
            <p className="text-xs text-[#4B5853] dark:text-slate-300 leading-relaxed">
              {activeAgeProfile.vocabularyLevel}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#C88A1E] dark:text-amber-400">مستوى الدرس التعليمي</p>
            <p className="text-xs text-[#4B5853] dark:text-slate-300 leading-relaxed">
              {activeAgeProfile.lessonComplexity}
            </p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {filteredStories.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#64706B] dark:text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-[#1C2421] dark:text-slate-100">
            لم نجد قصصاً تطابق بحثك الحالي
          </h3>
          <p className="text-sm text-[#4B5853] dark:text-slate-400">
            جرّب اختيار تصنيف آخر أو فئة عمرية أخرى لعرض جميع الحكايات المتاحة.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setOnlyFavorites(false);
              onSelectCategory('all');
              onSelectAge('all');
              onSelectCharacter('all');
            }}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#0D7A5F] rounded-lg hover:bg-[#09604B] cursor-pointer"
          >
            عرض جميع القصص
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const isCompleted = progress.completedStoryIds.includes(story.id);
            const isFavorite = progress.favoriteStoryIds.includes(story.id);
            const quizResult = progress.quizScores[story.id];
            const categoryLabel = STORY_CATEGORIES.find((c) => c.id === story.category)?.label ?? '';
            const guide = CARTOON_CHARACTERS[story.featuredCharacter];

            return (
              <article
                key={story.id}
                className="group bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* Artwork Banner */}
                <button
                  type="button"
                  onClick={() => onOpenStory(story.id)}
                  className="relative h-44 w-full bg-[#F3EFE6] dark:bg-slate-800 overflow-hidden text-right cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0D7A5F]"
                >
                  <StoryIllustration id={story.illustrationId} />
                </button>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Zero-pill typographic metadata line */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#64706B] dark:text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-medium text-[#0D7A5F] dark:text-emerald-400">
                          {categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{story.ageGroup}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{story.quiz.length} أسئلة</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleFavorite(story.id)}
                        aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                        className="p-1.5 -m-1.5 rounded-md hover:bg-[#F3EFE6] dark:hover:bg-slate-800 text-[#64706B] dark:text-slate-400 cursor-pointer shrink-0"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavorite ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="font-serif-arabic text-xl font-bold text-[#1C2421] dark:text-slate-100 leading-snug">
                      <button
                        type="button"
                        onClick={() => onOpenStory(story.id)}
                        className="text-right hover:text-[#0D7A5F] dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {story.title}
                      </button>
                    </h3>

                    <p className="text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed line-clamp-2">
                      {story.excerpt}
                    </p>

                    {/* Character Guide Row */}
                    <div className="flex items-center gap-2 pt-1">
                      <CharacterAvatar id={guide.id} size="sm" />
                      <span className="text-xs text-[#4B5853] dark:text-slate-400 truncate">
                        بصحبة <strong className="text-[#1C2421] dark:text-slate-200">{guide.name}</strong> · {story.coreValue}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Completion + Open CTA */}
                  <div className="pt-3 border-t border-[#F0EBE0] dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs truncate">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 font-medium text-[#0D7A5F] dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            مكتملة
                            {quizResult ? ` (${quizResult.score}/${quizResult.total})` : ''}
                          </span>
                        </span>
                      ) : (
                        <span className="text-[#64706B] dark:text-slate-400 tabular-nums">
                          {story.readingMinutes} دقائق للقراءة
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenStory(story.id)}
                      className="text-sm font-medium text-[#0D7A5F] dark:text-emerald-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      اقرأ القصة ←
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
