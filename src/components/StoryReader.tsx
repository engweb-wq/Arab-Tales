import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Heart,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Moon,
  Music,
  Palette,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Square,
  Sun,
  Trees,
  Volume2,
  VolumeX,
  Waves,
  X,
} from 'lucide-react';
import { Story, UserProgress } from '../types/story';
import { STORY_CATEGORIES } from '../data/stories';
import { AGE_GROUP_PROFILES, CARTOON_CHARACTERS } from '../data/characters';
import {
  GlossaryTerm,
  extractStoryGlossaryTerms,
  tokenizeParagraphWithGlossary,
} from '../data/glossary';
import {
  AMBIENT_SCENES,
  AmbientAudioEngine,
  AmbientSceneId,
  getAmbientSceneForStory,
} from '../utils/ambientAudio';
import { getQuizQuestionHint, playHintUnlockChime } from '../utils/quizHints';
import { StoryIllustration } from './StoryIllustration';
import { CharacterAvatar } from './CharacterAvatar';
import { CharacterColoringStudio } from './CharacterColoringStudio';
import { GlossaryIllustration } from './GlossaryIllustration';

interface StoryReaderProps {
  story: Story;
  allStories: Story[];
  progress: UserProgress;
  isDark: boolean;
  onToggleDark: () => void;
  onBackToLibrary: () => void;
  onOpenProfile: () => void;
  onOpenStory: (storyId: string) => void;
  onToggleFavorite: (storyId: string) => void;
  onToggleCompleted: (storyId: string) => void;
  onRecordQuizScore: (storyId: string, score: number, total: number) => void;
  onToggleChallenge: (storyId: string) => void;
}

type FontSizeLevel = 'sm' | 'md' | 'lg';
type ReadingMode = 'continuous' | 'step';
type DeckTab = 'lessons' | 'quiz' | 'practice';

interface AudioQueueItem {
  queueIndex: number;
  paragraphIndex: number;
  sentenceIndex: number;
  text: string;
}

function splitIntoSentences(paragraph: string): string[] {
  const raw = paragraph.match(/[^.!؟؛]+(?:[.!؟؛]+[»"”)]*\s*|\s*$)/g);
  if (!raw || raw.length === 0) return [paragraph];
  const filtered = raw.filter((s) => s.trim().length > 0);
  return filtered.length > 0 ? filtered : [paragraph];
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  allStories,
  progress,
  isDark,
  onToggleDark,
  onBackToLibrary,
  onOpenProfile,
  onOpenStory,
  onToggleFavorite,
  onToggleCompleted,
  onRecordQuizScore,
  onToggleChallenge,
}) => {
  const [fontSize, setFontSize] = useState<FontSizeLevel>('md');
  const [readingMode, setReadingMode] = useState<ReadingMode>('continuous');
  const [stepIndex, setStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<DeckTab>('lessons');
  const [showColoringStudio, setShowColoringStudio] = useState(false);

  // Interactive Glossary state
  const [highlightGlossary, setHighlightGlossary] = useState(true);
  const [activeGlossaryTerm, setActiveGlossaryTerm] =
    useState<GlossaryTerm | null>(null);
  const [revealedPromptHints, setRevealedPromptHints] = useState<
    Record<number, boolean>
  >({});

  // Quiz state with 2-wrong-attempts interactive hints
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [wrongAttemptsByQuestion, setWrongAttemptsByQuestion] = useState<
    Record<number, number>
  >({});
  const [solvedQuestions, setSolvedQuestions] = useState<Record<number, boolean>>(
    {}
  );
  const [autoSpeakHints, setAutoSpeakHints] = useState(true);
  const [speakingHintQuestionIdx, setSpeakingHintQuestionIdx] = useState<
    number | null
  >(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Audio / Speech Synthesis state
  const [speechSupported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<0.85 | 1 | 1.15>(0.85);
  const [activeQueueIndex, setActiveQueueIndex] = useState<number | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speakingCancelledRef = useRef(false);
  const speechRateRef = useRef(speechRate);
  speechRateRef.current = speechRate;
  const readingModeRef = useRef(readingMode);
  readingModeRef.current = readingMode;
  const activeSentenceElRef = useRef<HTMLSpanElement | null>(null);

  // Category-aware Ambient Soundscape state
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [ambientOverride, setAmbientOverride] = useState<'auto' | AmbientSceneId>(
    'auto'
  );
  const [ambientVolume, setAmbientVolume] = useState<0.2 | 0.4 | 0.65>(0.4);
  const ambientEngineRef = useRef<AmbientAudioEngine | null>(null);

  const isCompleted = progress.completedStoryIds.includes(story.id);
  const isFavorite = progress.favoriteStoryIds.includes(story.id);
  const isChallengeDone = progress.completedChallenges.includes(story.id);
  const savedQuiz = progress.quizScores[story.id];

  const categoryLabel =
    STORY_CATEGORIES.find((c) => c.id === story.category)?.label ?? '';
  const guideCharacter = CARTOON_CHARACTERS[story.featuredCharacter];
  const ageProfile = AGE_GROUP_PROFILES[story.ageGroup];

  const currentStoryIndex = useMemo(
    () => allStories.findIndex((s) => s.id === story.id),
    [allStories, story.id]
  );
  const prevStory = currentStoryIndex > 0 ? allStories[currentStoryIndex - 1] : null;
  const nextStory =
    currentStoryIndex >= 0 && currentStoryIndex < allStories.length - 1
      ? allStories[currentStoryIndex + 1]
      : null;

  const storySentencesByParagraph = useMemo(
    () => story.paragraphs.map(splitIntoSentences),
    [story.paragraphs]
  );

  const audioQueue = useMemo<AudioQueueItem[]>(() => {
    const items: AudioQueueItem[] = [];
    storySentencesByParagraph.forEach((sentences, pIdx) => {
      sentences.forEach((sentence, sIdx) => {
        items.push({
          queueIndex: items.length,
          paragraphIndex: pIdx,
          sentenceIndex: sIdx,
          text: sentence,
        });
      });
    });
    return items;
  }, [storySentencesByParagraph]);

  const activeAudioItem =
    activeQueueIndex !== null && activeQueueIndex >= 0
      ? audioQueue[activeQueueIndex] ?? null
      : null;

  const stopSpeech = () => {
    speakingCancelledRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveQueueIndex(null);
    setSpeakingHintQuestionIdx(null);
  };

  // Load available browser TTS voices (including async voiceschanged)
  useEffect(() => {
    if (!speechSupported) return;
    const updateVoices = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length > 0) {
        setVoices(list);
      }
    };
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, [speechSupported]);

  const autoAmbientScene = useMemo(
    () => getAmbientSceneForStory(story),
    [story]
  );
  const effectiveAmbientScene: AmbientSceneId =
    ambientOverride === 'auto' ? autoAmbientScene : ambientOverride;

  // Sync procedural Ambient Audio Engine with story category and user toggle
  useEffect(() => {
    if (!ambientEnabled) {
      ambientEngineRef.current?.stop();
      return;
    }
    if (!ambientEngineRef.current) {
      ambientEngineRef.current = new AmbientAudioEngine();
    }
    ambientEngineRef.current.setVolume(ambientVolume);
    ambientEngineRef.current.start(effectiveAmbientScene);
  }, [ambientEnabled, effectiveAmbientScene]);

  useEffect(() => {
    ambientEngineRef.current?.setVolume(ambientVolume);
  }, [ambientVolume]);

  useEffect(() => {
    return () => {
      ambientEngineRef.current?.dispose();
      ambientEngineRef.current = null;
    };
  }, []);

  const storyGlossaryTerms = useMemo(
    () => extractStoryGlossaryTerms(story.paragraphs),
    [story.paragraphs]
  );

  // Reset per-story local state and stop speech when switching stories or unmounting
  useEffect(() => {
    stopSpeech();
    setSpeechError(null);
    setStepIndex(0);
    setSelectedAnswers({});
    setWrongAttemptsByQuestion({});
    setSolvedQuestions({});
    setSpeakingHintQuestionIdx(null);
    setQuizSubmitted(false);
    setActiveTab('lessons');
    setShowColoringStudio(false);
    setActiveGlossaryTerm(null);
    setRevealedPromptHints({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      stopSpeech();
    };
  }, [story.id]);

  // Close glossary modal cleanly with Escape key
  useEffect(() => {
    if (!activeGlossaryTerm) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveGlossaryTerm(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeGlossaryTerm]);

  const openAndScrollToColoring = () => {
    setShowColoringStudio(true);
    setTimeout(() => {
      document
        .getElementById('character-coloring-studio')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const preferredArabicVoice = useMemo(() => {
    const arVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('ar'));
    if (arVoices.length === 0) return undefined;
    return (
      arVoices.find((v) => v.lang.toLowerCase() === 'ar-sa') ??
      arVoices.find((v) => v.lang.toLowerCase() === 'ar-eg') ??
      arVoices[0]
    );
  }, [voices]);

  // Auto-scroll highlighted sentence gently into view during continuous Audiobook playback
  useEffect(() => {
    if (
      isSpeaking &&
      activeQueueIndex !== null &&
      activeQueueIndex >= 0 &&
      readingMode === 'continuous'
    ) {
      activeSentenceElRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isSpeaking, activeQueueIndex, readingMode]);

  const speakFromQueueIndex = (startQueueIdx: number, includeTitle = false) => {
    if (!speechSupported || audioQueue.length === 0) return;
    window.speechSynthesis.cancel();
    speakingCancelledRef.current = false;
    setSpeechError(null);

    const activeList =
      voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const arabicVoice =
      preferredArabicVoice ??
      activeList.find((v) => v.lang.toLowerCase().startsWith('ar'));

    const speakSegment = (qIdx: number, speakingTitleFirst: boolean) => {
      if (speakingCancelledRef.current) return;
      if (!speakingTitleFirst && qIdx >= audioQueue.length) {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveQueueIndex(null);
        return;
      }

      const queueItem = audioQueue[qIdx];
      const textToRead = speakingTitleFirst ? story.title : queueItem.text;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = arabicVoice?.lang ?? 'ar-SA';
      utterance.rate = speechRateRef.current;
      utterance.pitch = 1.03;
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        if (speakingTitleFirst) {
          setActiveQueueIndex(-1);
        } else {
          setActiveQueueIndex(qIdx);
          if (readingModeRef.current === 'step') {
            setStepIndex(queueItem.paragraphIndex);
          }
        }
      };

      utterance.onend = () => {
        if (speakingCancelledRef.current) return;
        if (speakingTitleFirst) {
          speakSegment(qIdx, false);
        } else {
          speakSegment(qIdx + 1, false);
        }
      };

      utterance.onerror = (event) => {
        if (
          speakingCancelledRef.current ||
          event.error === 'interrupted' ||
          event.error === 'canceled'
        ) {
          return;
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveQueueIndex(null);
        setSpeechError('تعذّر تشغيل الصوت في هذا المتصفح، يمكنك متابعة القراءة نصياً.');
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsSpeaking(true);
    setIsPaused(false);
    speakSegment(startQueueIdx, includeTitle && startQueueIdx === 0);
  };

  const speakParagraphFrom = (paragraphIdx: number, includeTitle = false) => {
    const firstSentenceIdx = audioQueue.findIndex(
      (item) => item.paragraphIndex === paragraphIdx
    );
    speakFromQueueIndex(firstSentenceIdx >= 0 ? firstSentenceIdx : 0, includeTitle);
  };

  const handleStepAudio = (delta: -1 | 1) => {
    if (!speechSupported || audioQueue.length === 0) return;
    const baseIdx =
      activeQueueIndex !== null && activeQueueIndex >= 0 ? activeQueueIndex : 0;
    const targetIdx = Math.max(
      0,
      Math.min(audioQueue.length - 1, baseIdx + delta)
    );
    speakFromQueueIndex(targetIdx, false);
  };

  const handleTogglePlayPause = () => {
    if (!speechSupported) return;

    if (!isSpeaking) {
      const startParagraph = readingMode === 'step' ? stepIndex : 0;
      speakParagraphFrom(startParagraph, startParagraph === 0);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleRateChange = (newRate: 0.85 | 1 | 1.15) => {
    setSpeechRate(newRate);
    speechRateRef.current = newRate;
    if (isSpeaking && !isPaused) {
      const resumeQueueIdx =
        activeQueueIndex !== null && activeQueueIndex >= 0 ? activeQueueIndex : 0;
      speakFromQueueIndex(resumeQueueIdx, false);
    }
  };

  const fontSizeClasses: Record<FontSizeLevel, string> = {
    sm: 'text-base leading-[1.9]',
    md: 'text-lg sm:text-[1.18rem] leading-[1.95]',
    lg: 'text-xl sm:text-[1.32rem] leading-[2]',
  };

  const allQuestionsSolved =
    story.quiz.length > 0 &&
    story.quiz.every((_, idx) => Boolean(solvedQuestions[idx]));

  const solvedCount = story.quiz.reduce(
    (acc, _, idx) => (solvedQuestions[idx] ? acc + 1 : acc),
    0
  );

  const firstTryQuizScore = story.quiz.reduce(
    (acc, q, idx) =>
      solvedQuestions[idx] &&
      selectedAnswers[idx] === q.correctIndex &&
      (wrongAttemptsByQuestion[idx] ?? 0) === 0
        ? acc + 1
        : acc,
    0
  );

  const hintsUsedCount = story.quiz.reduce(
    (acc, _, idx) => ((wrongAttemptsByQuestion[idx] ?? 0) >= 2 ? acc + 1 : acc),
    0
  );

  const stopQuizHintVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingHintQuestionIdx(null);
  };

  const speakQuizHint = (qIndex: number, hintText: string) => {
    if (!speechSupported) return;
    if (speakingHintQuestionIdx === qIndex) {
      stopQuizHintVoice();
      return;
    }

    if (isSpeaking) {
      stopSpeech();
    } else {
      window.speechSynthesis.cancel();
    }

    const activeList =
      voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const arabicVoice =
      preferredArabicVoice ??
      activeList.find((v) => v.lang.toLowerCase().startsWith('ar'));

    const utterance = new SpeechSynthesisUtterance(hintText);
    utterance.lang = arabicVoice?.lang ?? 'ar-SA';
    utterance.rate = speechRateRef.current;
    utterance.pitch = 1.04;
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      setSpeakingHintQuestionIdx(qIndex);
    };
    utterance.onend = () => {
      setSpeakingHintQuestionIdx((prev) => (prev === qIndex ? null : prev));
    };
    utterance.onerror = () => {
      setSpeakingHintQuestionIdx((prev) => (prev === qIndex ? null : prev));
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSelectQuizOption = (qIndex: number, optIdx: number) => {
    if (quizSubmitted || solvedQuestions[qIndex]) return;
    const q = story.quiz[qIndex];
    if (!q) return;

    // Avoid counting the exact same highlighted wrong choice twice consecutively
    if (selectedAnswers[qIndex] === optIdx && optIdx !== q.correctIndex) {
      return;
    }

    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIdx }));

    if (optIdx === q.correctIndex) {
      setSolvedQuestions((prev) => ({ ...prev, [qIndex]: true }));
      if (speakingHintQuestionIdx === qIndex) {
        stopQuizHintVoice();
      }
      return;
    }

    const nextWrongCount = (wrongAttemptsByQuestion[qIndex] ?? 0) + 1;
    setWrongAttemptsByQuestion((prev) => ({
      ...prev,
      [qIndex]: nextWrongCount,
    }));

    if (nextWrongCount === 2) {
      playHintUnlockChime();
      if (autoSpeakHints && speechSupported && !isSpeaking) {
        const hintText = getQuizQuestionHint(story, q, qIndex);
        speakQuizHint(qIndex, hintText);
      }
    }
  };

  const handleSubmitQuiz = () => {
    if (!allQuestionsSolved) return;
    stopQuizHintVoice();
    setQuizSubmitted(true);
    onRecordQuizScore(story.id, firstTryQuizScore, story.quiz.length);
    if (!isCompleted) {
      onToggleCompleted(story.id);
    }
  };

  const handleResetQuiz = () => {
    stopQuizHintVoice();
    setSelectedAnswers({});
    setWrongAttemptsByQuestion({});
    setSolvedQuestions({});
    setQuizSubmitted(false);
  };

  const speakGlossaryDefinition = (term: GlossaryTerm) => {
    if (!speechSupported) return;
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(
      `${term.word}. ${term.simpleMeaning}`
    );
    utterance.lang = preferredArabicVoice?.lang ?? 'ar-SA';
    if (preferredArabicVoice) {
      utterance.voice = preferredArabicVoice;
    }
    utterance.rate = speechRateRef.current;
    window.speechSynthesis.speak(utterance);
  };

  const renderGlossarySegments = (text: string) => {
    if (!highlightGlossary) {
      return text;
    }
    const segments = tokenizeParagraphWithGlossary(text);
    return segments.map((seg, i) => {
      if (!seg.term) {
        return <React.Fragment key={i}>{seg.text}</React.Fragment>;
      }
      const term = seg.term;
      const isSelected = activeGlossaryTerm?.id === term.id;
      return (
        <button
          key={i}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveGlossaryTerm(term);
          }}
          title={`اضغط لمعرفة معنى: ${term.word}`}
          className={`inline underline decoration-dotted decoration-2 underline-offset-4 rounded px-0.5 transition-colors cursor-pointer font-medium ${
            isSelected
              ? 'bg-amber-100 dark:bg-amber-900/60 decoration-[#0D7A5F] dark:decoration-emerald-400 text-[#1C2421] dark:text-white'
              : 'decoration-[#C88A1E] dark:decoration-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50'
          }`}
        >
          {seg.text}
        </button>
      );
    });
  };

  const renderInteractiveParagraph = (paragraphIdx: number) => {
    const sentences =
      storySentencesByParagraph[paragraphIdx] ?? [story.paragraphs[paragraphIdx]];

    return sentences.map((sentenceText, sIdx) => {
      const isCurrentSentence =
        isSpeaking &&
        activeAudioItem?.paragraphIndex === paragraphIdx &&
        activeAudioItem?.sentenceIndex === sIdx;

      return (
        <span
          key={sIdx}
          ref={isCurrentSentence ? activeSentenceElRef : undefined}
          className={`transition-colors duration-200 ${
            isCurrentSentence
              ? 'bg-amber-100/95 dark:bg-amber-900/55 text-[#1C2421] dark:text-amber-50 rounded-md px-1.5 py-0.5 ring-1 ring-amber-300 dark:ring-amber-600'
              : ''
          }`}
        >
          {renderGlossarySegments(sentenceText)}
        </span>
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Reader Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToLibrary}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1C2421] dark:text-slate-200 hover:bg-[#F3EFE6] dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowRight className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400" />
          <span>العودة إلى المكتبة</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Reading Mode Toggle */}
          <div className="inline-flex items-center bg-[#F3EFE6] dark:bg-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setReadingMode('continuous')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                readingMode === 'continuous'
                  ? 'bg-white dark:bg-slate-700 text-[#1C2421] dark:text-white shadow-xs'
                  : 'text-[#4B5853] dark:text-slate-400'
              }`}
            >
              قراءة متصلة
            </button>
            <button
              type="button"
              onClick={() => setReadingMode('step')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                readingMode === 'step'
                  ? 'bg-white dark:bg-slate-700 text-[#1C2421] dark:text-white shadow-xs'
                  : 'text-[#4B5853] dark:text-slate-400'
              }`}
            >
              فقرة بفقرة
            </button>
          </div>

          {/* Font Size Selector */}
          <div
            className="inline-flex items-center bg-[#F3EFE6] dark:bg-slate-800 p-1 rounded-lg"
            aria-label="حجم الخط"
          >
            {(['sm', 'md', 'lg'] as FontSizeLevel[]).map((level, i) => {
              const labels = ['صغير', 'متوسط', 'كبير'];
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFontSize(level)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    fontSize === level
                      ? 'bg-white dark:bg-slate-700 text-[#1C2421] dark:text-white shadow-xs'
                      : 'text-[#4B5853] dark:text-slate-400'
                  }`}
                >
                  {labels[i]}
                </button>
              );
            })}
          </div>

          {/* Audio Narration Controls */}
          {speechSupported && (
            <div className="inline-flex items-center gap-1 bg-[#F3EFE6] dark:bg-slate-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={handleTogglePlayPause}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {isSpeaking && !isPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    {isSpeaking && isPaused ? (
                      <Play className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>{isPaused ? 'متابعة الاستماع' : 'استماع للقصة'}</span>
                  </>
                )}
              </button>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeech}
                  aria-label="إيقاف القراءة الصوتية"
                  className="p-1.5 text-[#4B5853] dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-md cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}

              <select
                value={speechRate}
                onChange={(e) => handleRateChange(Number(e.target.value) as 0.85 | 1 | 1.15)}
                aria-label="سرعة القراءة الصوتية"
                className="text-xs bg-transparent text-[#4B5853] dark:text-slate-300 px-1.5 py-1 focus:outline-none cursor-pointer"
              >
                <option value={0.85} className="dark:bg-slate-800">بطيء ومريح</option>
                <option value={1} className="dark:bg-slate-800">عادي</option>
                <option value={1.15} className="dark:bg-slate-800">سريع</option>
              </select>
            </div>
          )}

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => onToggleFavorite(story.id)}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                : 'bg-white dark:bg-slate-900 border-[#E6E0D4] dark:border-slate-700 text-[#4B5853] dark:text-slate-300 hover:bg-[#F3EFE6] dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Bedtime / Dark Toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'الوضع النهاري' : 'وضع ما قبل النوم'}
            className="p-2 rounded-lg border border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#4B5853] dark:text-slate-300 hover:bg-[#F3EFE6] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#0D7A5F]" />
            )}
          </button>
        </div>
      </div>

      {/* Two-Zone Reader Workspace: 60-65% Reading Stage + 35-40% Educational Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Zone A: Primary Reading Stage */}
        <article className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="h-52 sm:h-60 w-full bg-[#F3EFE6] dark:bg-slate-800 overflow-hidden">
            <StoryIllustration id={story.illustrationId} />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Story Header & Typographic Metadata */}
            <header className="space-y-3 pb-5 border-b border-[#F0EBE0] dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64706B] dark:text-slate-400">
                <span className="font-medium text-[#0D7A5F] dark:text-emerald-400">
                  {categoryLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span>{story.ageGroup}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{story.readingMinutes} دقائق للقراءة</span>
                <span aria-hidden="true">·</span>
                <span>{story.sourceRef}</span>
              </div>

              <h1 className="font-serif-arabic text-2xl sm:text-3xl font-bold text-[#1C2421] dark:text-slate-100 leading-snug">
                {story.title}
              </h1>

              <p className="text-sm text-[#4B5853] dark:text-slate-400">
                القيمة الأساسية: <strong className="font-semibold text-[#1C2421] dark:text-slate-200">{story.coreValue}</strong>
                <span aria-hidden="true"> · </span>
                <span>{ageProfile.stageName}</span>
              </p>
            </header>

            {/* Cartoon Character Guide Companion Card */}
            <div className="rounded-xl border border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
              <CharacterAvatar id={guideCharacter.id} size="md" />
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <strong className="text-sm font-bold text-[#1C2421] dark:text-slate-100">
                    دور {guideCharacter.name} في هذه القصة
                  </strong>
                  <span aria-hidden="true" className="text-[#64706B]">·</span>
                  <span className="text-[#0D7A5F] dark:text-emerald-400 font-medium">
                    {guideCharacter.tagline}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
                  {story.characterRoleInStory}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#1C2421] dark:text-slate-100 pt-1">
                  «{story.characterTip}»
                </p>
              </div>
            </div>

            {/* Optional Quran / Hadith / Poetry Callout */}
            {story.quranOrHadithQuote && (
              <blockquote className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 p-5 space-y-2">
                <p className="font-serif-arabic text-lg sm:text-xl leading-loose text-[#1C2421] dark:text-amber-100">
                  {story.quranOrHadithQuote.text}
                </p>
                <footer className="text-xs font-medium text-[#9A6712] dark:text-amber-400">
                  — {story.quranOrHadithQuote.reference}
                </footer>
              </blockquote>
            )}

            {/* Dedicated Child-Friendly Audiobook Player with Sentence Highlighting */}
            <div className="rounded-xl border border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E6E0D4]/80 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1C2421] dark:text-slate-100">
                  <Headphones className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
                  <span>مشغل القصة الصوتي (Audiobook)</span>
                </div>
                <span className="text-[11px] text-[#64706B] dark:text-slate-400 tabular-nums">
                  {speechSupported
                    ? isSpeaking
                      ? activeAudioItem
                        ? `الجملة ${activeAudioItem.queueIndex + 1} من ${audioQueue.length}`
                        : 'جاري قراءة عنوان القصة...'
                      : `${audioQueue.length} جملة جاهزة للاستماع`
                    : 'المتصفح لا يدعم القراءة الصوتية'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <button
                    type="button"
                    disabled={!speechSupported}
                    onClick={handleTogglePlayPause}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                  >
                    {isSpeaking && !isPaused ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>إيقاف مؤقت</span>
                      </>
                    ) : (
                      <>
                        {isSpeaking && isPaused ? (
                          <Play className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                        <span>{isPaused ? 'استئناف الصوت' : 'استمع للقصة'}</span>
                      </>
                    )}
                  </button>

                  {isSpeaking && (
                    <>
                      <button
                        type="button"
                        disabled={!activeAudioItem || activeAudioItem.queueIndex <= 0}
                        onClick={() => handleStepAudio(-1)}
                        aria-label="الجملة السابقة"
                        title="الجملة السابقة"
                        className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#1C2421] dark:text-slate-200 disabled:opacity-40 cursor-pointer shrink-0"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">السابقة</span>
                      </button>

                      <button
                        type="button"
                        disabled={
                          !activeAudioItem ||
                          activeAudioItem.queueIndex >= audioQueue.length - 1
                        }
                        onClick={() => handleStepAudio(1)}
                        aria-label="الجملة التالية"
                        title="الجملة التالية"
                        className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#1C2421] dark:text-slate-200 disabled:opacity-40 cursor-pointer shrink-0"
                      >
                        <span className="hidden sm:inline">التالية</span>
                        <SkipBack className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={stopSpeech}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#4B5853] dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>إيقاف</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Speed Selector */}
                {speechSupported && (
                  <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-700 p-1 rounded-lg">
                    {([
                      { rate: 0.85, label: 'هادئ' },
                      { rate: 1, label: 'عادي' },
                      { rate: 1.15, label: 'سريع' },
                    ] as const).map((opt) => (
                      <button
                        key={opt.rate}
                        type="button"
                        onClick={() => handleRateChange(opt.rate)}
                        className={`px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                          speechRate === opt.rate
                            ? 'bg-[#0D7A5F] text-white dark:bg-emerald-600'
                            : 'text-[#64706B] dark:text-slate-400 hover:text-[#1C2421] dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Sentence Progress Bar & Live Highlight Preview */}
              {isSpeaking && activeAudioItem && (
                <div className="space-y-2 pt-1">
                  <div
                    className="flex items-center gap-1"
                    aria-label="تقدم الجمل في الكتاب الصوتي"
                  >
                    {audioQueue.map((item) => (
                      <button
                        key={item.queueIndex}
                        type="button"
                        onClick={() => speakFromQueueIndex(item.queueIndex, false)}
                        aria-label={`تشغيل الجملة ${item.queueIndex + 1}`}
                        className={`h-1.5 flex-1 rounded-full transition-colors cursor-pointer ${
                          item.queueIndex <= activeAudioItem.queueIndex
                            ? 'bg-[#0D7A5F] dark:bg-emerald-400'
                            : 'bg-[#E6E0D4] dark:bg-slate-700 hover:bg-[#D5CDBA]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#1C2421] dark:text-amber-100 bg-amber-50/80 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-800/60 rounded-lg px-3 py-2 leading-relaxed">
                    <span className="font-bold text-[#9A670E] dark:text-amber-300 ml-1.5">
                      يُقرأ الآن:
                    </span>
                    {activeAudioItem.text}
                  </p>
                </div>
              )}

              {speechError && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{speechError}</p>
              )}

              {/* Category-Aware Ambient Soundscape Controls */}
              <div className="pt-3 mt-1 border-t border-[#E6E0D4]/80 dark:border-slate-700 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {effectiveAmbientScene === 'forest' && (
                      <Trees className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
                    )}
                    {effectiveAmbientScene === 'library' && (
                      <BookOpen className="w-4 h-4 text-[#C88A1E] dark:text-amber-400 shrink-0" />
                    )}
                    {effectiveAmbientScene === 'sea' && (
                      <Waves className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    )}
                    {effectiveAmbientScene === 'desert-night' && (
                      <Moon className="w-4 h-4 text-amber-500 dark:text-amber-300 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1C2421] dark:text-slate-100 truncate">
                        أجواء الخلفية: {AMBIENT_SCENES[effectiveAmbientScene].label}
                      </p>
                      <p className="text-[11px] text-[#64706B] dark:text-slate-400 truncate">
                        {ambientOverride === 'auto'
                          ? `تلقائي لتصنيف «${categoryLabel}» · ${AMBIENT_SCENES[effectiveAmbientScene].description}`
                          : AMBIENT_SCENES[effectiveAmbientScene].description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAmbientEnabled((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer shrink-0 ${
                      ambientEnabled
                        ? 'border-[#0D7A5F] bg-[#0D7A5F] text-white dark:border-emerald-500 dark:bg-emerald-600'
                        : 'border-[#E6E0D4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#1C2421] dark:text-slate-200 hover:border-[#0D7A5F]'
                    }`}
                  >
                    {ambientEnabled ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>إيقاف الخلفية</span>
                      </>
                    ) : (
                      <>
                        <Music className="w-3.5 h-3.5 text-[#0D7A5F] dark:text-emerald-400" />
                        <span>تشغيل أجواء القصة</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Auto or Manual Scene Selector */}
                  <div className="flex flex-wrap items-center gap-1">
                    {(
                      [
                        { id: 'auto', label: 'تلقائي حسب القصة' },
                        { id: 'forest', label: 'غابة' },
                        { id: 'library', label: 'مكتبة' },
                        { id: 'sea', label: 'بحر' },
                        { id: 'desert-night', label: 'سكينة الليل' },
                      ] as const
                    ).map((opt) => {
                      const active = ambientOverride === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAmbientOverride(opt.id)}
                          className={`px-2 py-1 text-[11px] font-medium rounded-md border transition-colors cursor-pointer ${
                            active
                              ? 'border-[#0D7A5F] bg-emerald-50 dark:bg-emerald-950/50 text-[#0D7A5F] dark:text-emerald-400'
                              : 'border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#64706B] dark:text-slate-400 hover:text-[#1C2421]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Ambient Volume Control */}
                  <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-700 p-0.5 rounded-lg">
                    {(
                      [
                        { vol: 0.2, label: 'خافت' },
                        { vol: 0.4, label: 'متوسط' },
                        { vol: 0.65, label: 'واضح' },
                      ] as const
                    ).map((v) => (
                      <button
                        key={v.vol}
                        type="button"
                        onClick={() => setAmbientVolume(v.vol)}
                        className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                          ambientVolume === v.vol
                            ? 'bg-[#C88A1E] text-white dark:bg-amber-600'
                            : 'text-[#64706B] dark:text-slate-400'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Glossary Quick Strip */}
            {storyGlossaryTerms.length > 0 && (
              <div className="rounded-xl border border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900/70 p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1C2421] dark:text-slate-100">
                    <BookMarked className="w-4 h-4 text-[#C88A1E] dark:text-amber-400 shrink-0" />
                    <span>
                      قاموس القصة التفاعلي ({storyGlossaryTerms.length} كلمات)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHighlightGlossary((prev) => !prev)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors cursor-pointer ${
                      highlightGlossary
                        ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-[#9A670E] dark:text-amber-300'
                        : 'border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800 text-[#64706B] dark:text-slate-400'
                    }`}
                  >
                    {highlightGlossary ? 'تمييز الكلمات: مفعّل' : 'تمييز الكلمات: متوقف'}
                  </button>
                </div>

                <p className="text-[11px] text-[#64706B] dark:text-slate-400">
                  اضغط على أي كلمة مسطّرة داخل القصة أو اختر كلمة من القائمة لرؤية معناها وصورتها التوضيحية:
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {storyGlossaryTerms.map((term) => {
                    const isOpen = activeGlossaryTerm?.id === term.id;
                    return (
                      <button
                        key={term.id}
                        type="button"
                        onClick={() => setActiveGlossaryTerm(term)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          isOpen
                            ? 'border-[#0D7A5F] bg-[#0D7A5F] text-white dark:border-emerald-500 dark:bg-emerald-600'
                            : 'border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800 text-[#1C2421] dark:text-slate-200 hover:border-[#C88A1E]'
                        }`}
                      >
                        {term.word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Story Body: Continuous vs Step-by-step */}
            {readingMode === 'continuous' ? (
              <div className="space-y-4">
                {story.paragraphs.map((_, idx) => {
                  const isCurrentlySpoken =
                    isSpeaking && activeAudioItem?.paragraphIndex === idx;
                  const inlinePrompt = story.inStoryPrompts?.[idx];
                  const isHintShown = !!revealedPromptHints[idx];

                  return (
                    <div key={idx} className="space-y-3">
                      <div
                        className={`group flex items-start gap-2.5 rounded-lg transition-colors ${
                          isCurrentlySpoken
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 px-3 py-2.5 -mx-3'
                            : ''
                        }`}
                      >
                        {speechSupported && (
                          <button
                            type="button"
                            onClick={() => speakParagraphFrom(idx, false)}
                            aria-label={`استمع للفقرة ${idx + 1}`}
                            title="استمع من هذه الفقرة"
                            className={`mt-1.5 p-1.5 rounded-md transition-opacity cursor-pointer shrink-0 ${
                              isCurrentlySpoken
                                ? 'text-[#0D7A5F] dark:text-emerald-400 opacity-100'
                                : 'text-[#64706B] dark:text-slate-400 opacity-50 group-hover:opacity-100 hover:bg-[#F3EFE6] dark:hover:bg-slate-800'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                        <p className={`${fontSizeClasses[fontSize]} text-[#1C2421] dark:text-slate-200 flex-1`}>
                          {renderInteractiveParagraph(idx)}
                        </p>
                      </div>

                      {inlinePrompt && (
                        <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/25 p-4 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A670E] dark:text-amber-300">
                              <HelpCircle className="w-4 h-4 shrink-0" />
                              <span>سؤال تفكير للقارئ الصغير أثناء السرد</span>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedPromptHints((prev) => ({
                                  ...prev,
                                  [idx]: !prev[idx],
                                }))
                              }
                              className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
                            >
                              {isHintShown ? 'إخفاء الفكرة' : 'فكّر ثم اعرض الفكرة'}
                            </button>
                          </div>
                          <p className="text-sm font-medium text-[#1C2421] dark:text-slate-100 leading-relaxed">
                            {inlinePrompt.question}
                          </p>
                          {isHintShown && (
                            <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 bg-white/80 dark:bg-slate-900/70 rounded-lg border border-amber-200/80 dark:border-amber-800/50 p-3 leading-relaxed">
                              {inlinePrompt.hint}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-[#64706B] dark:text-slate-400">
                  <span className="tabular-nums font-medium">
                    الفقرة {stepIndex + 1} من {story.paragraphs.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {story.paragraphs.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setStepIndex(idx)}
                        aria-label={`الانتقال إلى الفقرة ${idx + 1}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === stepIndex
                            ? 'w-6 bg-[#0D7A5F] dark:bg-emerald-400'
                            : 'w-2 bg-[#E6E0D4] dark:bg-slate-700 hover:bg-[#C7BFB0]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="min-h-[180px] flex flex-col justify-between gap-4 bg-[#FAF8F4] dark:bg-slate-800/60 border border-[#E6E0D4] dark:border-slate-700 rounded-xl p-6">
                  <p className={`${fontSizeClasses[fontSize]} text-[#1C2421] dark:text-slate-100`}>
                    {renderInteractiveParagraph(stepIndex)}
                  </p>
                  {story.inStoryPrompts?.[stepIndex] && (
                    <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A670E] dark:text-amber-300">
                          <HelpCircle className="w-4 h-4 shrink-0" />
                          <span>سؤال تفكير للقارئ الصغير</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedPromptHints((prev) => ({
                              ...prev,
                              [stepIndex]: !prev[stepIndex],
                            }))
                          }
                          className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
                        >
                          {revealedPromptHints[stepIndex]
                            ? 'إخفاء الفكرة'
                            : 'اعرض الفكرة'}
                        </button>
                      </div>
                      <p className="text-sm font-medium text-[#1C2421] dark:text-slate-100 leading-relaxed">
                        {story.inStoryPrompts[stepIndex].question}
                      </p>
                      {revealedPromptHints[stepIndex] && (
                        <p className="text-xs text-[#4B5853] dark:text-slate-300 bg-white/80 dark:bg-slate-900/70 rounded-lg p-2.5 leading-relaxed">
                          {story.inStoryPrompts[stepIndex].hint}
                        </p>
                      )}
                    </div>
                  )}
                  {speechSupported && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => speakParagraphFrom(stepIndex, false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0D7A5F] dark:text-emerald-400 hover:bg-[#F3EFE6] dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استمع لهذه الفقرة</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={stepIndex === 0}
                    onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 text-[#1C2421] dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3EFE6] dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>الفقرة السابقة</span>
                  </button>

                  {stepIndex < story.paragraphs.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setStepIndex((prev) => Math.min(story.paragraphs.length - 1, prev + 1))
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white cursor-pointer"
                    >
                      <span>الفقرة التالية</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('quiz')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-[#C88A1E] hover:bg-[#B07817] text-white cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>انتقل لاختبار الفهم</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Completion, Coloring Studio & Next/Prev Story Footer */}
            <footer className="pt-6 mt-6 border-t border-[#F0EBE0] dark:border-slate-800 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAF8F4] dark:bg-slate-800/70 border border-[#E6E0D4] dark:border-slate-700 rounded-xl p-4">
                <div>
                  <p className="text-sm font-bold text-[#1C2421] dark:text-slate-100">
                    {isCompleted ? 'أحسنت! أتممت قراءة هذه الحكاية' : 'هل أنهيت قراءة القصة؟'}
                  </p>
                  <p className="text-xs text-[#4B5853] dark:text-slate-400 mt-0.5">
                    {isCompleted
                      ? 'حصلت على نجمتي القراءة، ويمكنك الآن تلوين شخصيات القصة أو اختبار فهمك.'
                      : 'سجّل إتمام القصة لإضافة نجمتين إلى رصيدك وفتح مرسم تلوين الشخصيات.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCompleted) {
                        onToggleCompleted(story.id);
                        openAndScrollToColoring();
                      } else {
                        onToggleCompleted(story.id);
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#0D7A5F] dark:text-emerald-400'
                        : 'bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCompleted ? 'قصة مكتملة' : 'أتممت قراءة القصة'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (showColoringStudio) {
                        setShowColoringStudio(false);
                      } else {
                        openAndScrollToColoring();
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      showColoringStudio
                        ? 'border-[#C88A1E] bg-amber-50 dark:bg-amber-950/40 text-[#9A670E] dark:text-amber-300'
                        : 'border-[#E6E0D4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#1C2421] dark:text-slate-200 hover:border-[#C88A1E]'
                    }`}
                  >
                    <Palette className="w-4 h-4 text-[#C88A1E] dark:text-amber-400" />
                    <span>{showColoringStudio ? 'إخفاء المرسم' : 'لوّن شخصيات القصة'}</span>
                  </button>
                </div>
              </div>

              {showColoringStudio && (
                <CharacterColoringStudio
                  initialCharacterId={story.featuredCharacter}
                  storyTitle={story.title}
                />
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                {prevStory ? (
                  <button
                    type="button"
                    onClick={() => onOpenStory(prevStory.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#4B5853] dark:text-slate-300 hover:text-[#0D7A5F] dark:hover:text-emerald-400 cursor-pointer truncate"
                  >
                    <ChevronRight className="w-4 h-4 shrink-0" />
                    <span className="truncate">السابقة: {prevStory.title}</span>
                  </button>
                ) : (
                  <span />
                )}

                {nextStory && (
                  <button
                    type="button"
                    onClick={() => onOpenStory(nextStory.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#0D7A5F] dark:text-emerald-400 hover:underline cursor-pointer truncate"
                  >
                    <span className="truncate">التالية: {nextStory.title}</span>
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>
            </footer>
          </div>
        </article>

        {/* Zone B: Interactive Lessons, Quiz & Practice Deck */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl overflow-hidden">
          {/* Deck Tab Switcher */}
          <div className="grid grid-cols-3 border-b border-[#E6E0D4] dark:border-slate-800 bg-[#FAF8F4] dark:bg-slate-800/50">
            <button
              type="button"
              onClick={() => setActiveTab('lessons')}
              className={`flex items-center justify-center gap-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'lessons'
                  ? 'border-[#0D7A5F] dark:border-emerald-400 text-[#0D7A5F] dark:text-emerald-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-[#4B5853] dark:text-slate-400 hover:text-[#1C2421] dark:hover:text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>الدروس المستفادة</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center justify-center gap-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'border-[#0D7A5F] dark:border-emerald-400 text-[#0D7A5F] dark:text-emerald-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-[#4B5853] dark:text-slate-400 hover:text-[#1C2421] dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>اختبر فهمك ({story.quiz.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className={`flex items-center justify-center gap-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'practice'
                  ? 'border-[#0D7A5F] dark:border-emerald-400 text-[#0D7A5F] dark:text-emerald-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-[#4B5853] dark:text-slate-400 hover:text-[#1C2421] dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>تطبيق وحوار</span>
            </button>
          </div>

          <div className="p-5 sm:p-6">
            {/* Tab 1: Numbered Educational Lessons */}
            {activeTab === 'lessons' && (
              <div className="space-y-5">
                <div className="rounded-xl border border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/60 p-4">
                  <p className="text-xs text-[#64706B] dark:text-slate-400 mb-1">الرسالة التربوية الرئيسية</p>
                  <p className="font-serif-arabic text-lg font-bold text-[#0D7A5F] dark:text-emerald-400">
                    {story.coreValue}
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-[#1C2421] dark:text-slate-100">
                    ماذا نتعلم من هذه القصة؟
                  </h2>
                  <ol className="space-y-3">
                    {story.lessons.map((lesson, idx) => (
                      <li
                        key={idx}
                        className="rounded-xl border border-[#E6E0D4] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1.5"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="font-bold text-sm text-[#C88A1E] dark:text-amber-400 tabular-nums shrink-0 mt-0.5">
                            0{idx + 1}.
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-[#1C2421] dark:text-slate-100">
                              {lesson.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed mt-1">
                              {lesson.detail}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quiz')}
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white transition-colors cursor-pointer"
                  >
                    اختبر فهمك الآن ({story.quiz.length} أسئلة)
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Interactive Comprehension Quiz with 2-Wrong-Attempts Hints */}
            {activeTab === 'quiz' && (
              <div className="space-y-5">
                {savedQuiz && !quizSubmitted && (
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 px-4 py-3 text-xs text-[#0D7A5F] dark:text-emerald-300 flex items-center justify-between">
                    <span>أعلى نتيجة مسجلة لك في هذه القصة:</span>
                    <strong className="tabular-nums">
                      {savedQuiz.score} من {savedQuiz.total}
                    </strong>
                  </div>
                )}

                {/* Quiz Progress & Voice Hint Toggle */}
                <div className="rounded-xl border border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/60 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#4B5853] dark:text-slate-300 tabular-nums">
                    الأسئلة المكتملة:{' '}
                    <strong className="text-[#0D7A5F] dark:text-emerald-400">
                      {solvedCount} / {story.quiz.length}
                    </strong>
                    {' · '}
                    تلميح بعد محاولتين
                  </span>

                  {speechSupported && (
                    <button
                      type="button"
                      onClick={() => setAutoSpeakHints((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors cursor-pointer ${
                        autoSpeakHints
                          ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-[#9A670E] dark:text-amber-300'
                          : 'border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#64706B] dark:text-slate-400'
                      }`}
                    >
                      {autoSpeakHints ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {autoSpeakHints ? 'نطق التلميح تلقائياً' : 'التلميح نصي فقط'}
                      </span>
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  {story.quiz.map((q, qIndex) => {
                    const chosen = selectedAnswers[qIndex];
                    const wrongAttempts = wrongAttemptsByQuestion[qIndex] ?? 0;
                    const isSolved = Boolean(solvedQuestions[qIndex]);
                    const showHintBox = !isSolved && wrongAttempts >= 2;
                    const hintText = showHintBox
                      ? getQuizQuestionHint(story, q, qIndex)
                      : '';
                    const isSpeakingThisHint = speakingHintQuestionIdx === qIndex;

                    return (
                      <div
                        key={qIndex}
                        className={`rounded-xl border p-4 space-y-3 transition-colors ${
                          isSolved
                            ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/25 dark:bg-emerald-950/15'
                            : 'border-[#E6E0D4] dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-[#1C2421] dark:text-slate-100 leading-relaxed">
                            <span className="text-[#0D7A5F] dark:text-emerald-400 ml-1.5 tabular-nums">
                              {qIndex + 1}.
                            </span>
                            {q.question}
                          </p>
                          {isSolved && (
                            <CheckCircle2 className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0 mt-1" />
                          )}
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = chosen === optIdx;
                            const isCorrect = optIdx === q.correctIndex;

                            let optionClass =
                              'border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/60 text-[#1C2421] dark:text-slate-200 hover:border-[#0D7A5F]';

                            if (isSolved || quizSubmitted) {
                              if (isCorrect) {
                                optionClass =
                                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-medium';
                              } else {
                                optionClass =
                                  'border-[#E6E0D4] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#64706B] dark:text-slate-500 opacity-75';
                              }
                            } else if (isSelected && !isCorrect) {
                              optionClass =
                                'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={quizSubmitted || isSolved}
                                onClick={() => handleSelectQuizOption(qIndex, optIdx)}
                                className={`w-full text-right px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border transition-colors cursor-pointer disabled:cursor-default ${optionClass}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Gentle nudge after 1st wrong attempt */}
                        {!isSolved && wrongAttempts === 1 && (
                          <div className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/25 px-3 py-2 text-xs text-rose-800 dark:text-rose-200">
                            إجابة غير دقيقة (المحاولة ١ من ٢) — فكّر قليلاً وجرّب اختياراً آخر، وسيظهر لك تلميح ذكي بعد المحاولة الثانية!
                          </div>
                        )}

                        {/* Interactive Text & Voice Hint Card after 2 wrong attempts */}
                        {showHintBox && (
                          <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/85 dark:bg-amber-950/35 p-3.5 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <CharacterAvatar id={guideCharacter.id} size="sm" />
                                <div>
                                  <p className="text-xs font-bold text-[#9A670E] dark:text-amber-300 flex items-center gap-1">
                                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                                    <span>تلميح ذكي من {guideCharacter.name}</span>
                                  </p>
                                  <p className="text-[11px] text-[#64706B] dark:text-slate-400">
                                    ظهر بعد محاولتين لمساعدتك دون كشف الحل مباشرة
                                  </p>
                                </div>
                              </div>

                              {speechSupported && (
                                <button
                                  type="button"
                                  onClick={() => speakQuizHint(qIndex, hintText)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer shrink-0 ${
                                    isSpeakingThisHint
                                      ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-200'
                                      : 'border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-[#9A670E] dark:text-amber-300 hover:bg-amber-100/70'
                                  }`}
                                >
                                  {isSpeakingThisHint ? (
                                    <>
                                      <Square className="w-3 h-3 fill-current" />
                                      <span>إيقاف الصوت</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-3.5 h-3.5" />
                                      <span>استمع للتلميح</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-[#1C2421] dark:text-slate-100 bg-white/85 dark:bg-slate-900/70 border border-amber-200/80 dark:border-amber-800/50 rounded-lg p-2.5 leading-relaxed">
                              {hintText}
                            </p>
                          </div>
                        )}

                        {/* Immediate positive explanation when answered correctly */}
                        {(isSolved || quizSubmitted) && (
                          <div className="rounded-lg bg-[#FAF8F4] dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 p-3 text-xs text-[#4B5853] dark:text-slate-300 leading-relaxed space-y-1">
                            <p className="font-bold text-[#0D7A5F] dark:text-emerald-400">
                              {wrongAttempts === 0
                                ? 'أحسنت! إجابة صحيحة من المحاولة الأولى!'
                                : 'رائع! وصلت إلى الإجابة الصحيحة بذكاء!'}
                            </p>
                            <p>
                              <strong className="text-[#1C2421] dark:text-slate-100">التوضيح: </strong>
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={!allQuestionsSolved}
                    onClick={handleSubmitQuiz}
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {allQuestionsSolved
                      ? 'احفظ النتيجة واحصل على النجوم'
                      : `أكمل حل جميع الأسئلة أولاً (${solvedCount}/${story.quiz.length})`}
                  </button>
                ) : (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 p-4 space-y-3 text-center">
                    <p className="text-base font-bold text-[#1C2421] dark:text-slate-100 tabular-nums">
                      نتيجتك من المحاولة الأولى: {firstTryQuizScore} من {story.quiz.length}
                    </p>
                    <p className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400 tabular-nums">
                      {story.quiz.length > 0 && firstTryQuizScore / story.quiz.length >= 0.8
                        ? `درجة عالية مميزة! كسبت +${firstTryQuizScore * 10 + 15} نقطة (بمكافأة التفوق)`
                        : `كسبت +${firstTryQuizScore * 10} نقطة`}
                    </p>
                    <p className="text-xs text-[#4B5853] dark:text-slate-300">
                      {firstTryQuizScore === story.quiz.length
                        ? 'ممتاز! فهمت القصة ودروسها بالكامل دون أخطاء.'
                        : hintsUsedCount > 0
                        ? `أحسنت إتمام جميع الأسئلة! استخدمت التلميحات الذكية في ${hintsUsedCount} سؤال، ويمكنك إعادة الاختبار الآن لتحقيق العلامة الكاملة.`
                        : 'أحسنت المحاولة! راجع التوضيحات ويمكنك المحاولة مرة أخرى.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleResetQuiz}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1C2421] dark:text-slate-200 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>إعادة الاختبار</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('practice')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#0D7A5F] text-white cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>تحدي اليوم</span>
                      </button>
                      <button
                        type="button"
                        onClick={onOpenProfile}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-[#9A670E] dark:text-amber-300 cursor-pointer"
                      >
                        <span>أوسمتي في ملفي</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Daily Behavior Challenge & Family Discussion */}
            {activeTab === 'practice' && (
              <div className="space-y-5">
                {/* Daily Challenge Card */}
                <div className="rounded-xl border border-[#E6E0D4] dark:border-slate-800 bg-[#FAF8F4] dark:bg-slate-800/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#C88A1E] dark:text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>تحدي السلوك اليومي</span>
                  </div>
                  <p className="text-sm text-[#1C2421] dark:text-slate-100 leading-relaxed">
                    {story.dailyChallenge}
                  </p>
                  <button
                    type="button"
                    onClick={() => onToggleChallenge(story.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                      isChallengeDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-[#0D7A5F] dark:text-emerald-400'
                        : 'bg-white dark:bg-slate-900 border-[#E6E0D4] dark:border-slate-700 text-[#1C2421] dark:text-slate-200 hover:border-[#0D7A5F]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isChallengeDone
                        ? 'تم إنجاز التحدي! (+١ نجمة)'
                        : 'أنجزت هذا التحدي اليوم'}
                    </span>
                  </button>
                </div>

                {/* Family / Educator Discussion Prompt */}
                <div className="rounded-xl border border-[#E6E0D4] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#0D7A5F] dark:text-emerald-400">
                    <MessageCircle className="w-4 h-4" />
                    <span>سؤال للحوار مع الأسرة أو المعلم</span>
                  </div>
                  <p className="text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
                    {story.discussionPrompt}
                  </p>
                </div>

                {/* Reward Coloring Shortcut */}
                <button
                  type="button"
                  onClick={openAndScrollToColoring}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-medium rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 text-[#9A670E] dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  <span>افتح مرسم التلوين (تاليا، لين، معاذ)</span>
                </button>

                <div className="rounded-xl border border-[#F0EBE0] dark:border-slate-800 p-4 flex items-center gap-3 text-xs text-[#64706B] dark:text-slate-400">
                  <BookOpen className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
                  <span>المصدر المرجعي: {story.sourceRef}</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Interactive Glossary Word Definition Dialog */}
      {activeGlossaryTerm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={() => setActiveGlossaryTerm(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="glossary-modal-word"
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0EBE0] dark:border-slate-800">
              <div>
                <span className="text-[11px] font-medium text-[#C88A1E] dark:text-amber-400">
                  قاموس المصطلحات التفاعلي · {activeGlossaryTerm.category}
                </span>
                <h3
                  id="glossary-modal-word"
                  className="font-serif-arabic text-2xl font-bold text-[#1C2421] dark:text-slate-100 mt-0.5"
                >
                  {activeGlossaryTerm.word}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveGlossaryTerm(null)}
                aria-label="إغلاق بطاقة القاموس"
                className="p-1.5 rounded-lg text-[#64706B] hover:bg-[#FAF8F4] dark:hover:bg-slate-800 hover:text-[#1C2421] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <GlossaryIllustration kind={activeGlossaryTerm.illustration} />

              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs font-bold text-[#0D7A5F] dark:text-emerald-400 mb-1">
                    المعنى المبسط:
                  </p>
                  <p className="text-sm text-[#1C2421] dark:text-slate-200 leading-relaxed">
                    {activeGlossaryTerm.simpleMeaning}
                  </p>
                </div>

                <div className="rounded-lg bg-[#FAF8F4] dark:bg-slate-800/70 border border-[#E6E0D4] dark:border-slate-700 p-3">
                  <p className="text-[11px] font-bold text-[#64706B] dark:text-slate-400 mb-0.5">
                    مثال توضيحي:
                  </p>
                  <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
                    «{activeGlossaryTerm.exampleSentence}»
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EBE0] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              {speechSupported ? (
                <button
                  type="button"
                  onClick={() => speakGlossaryDefinition(activeGlossaryTerm)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استمع للشرح</span>
                </button>
              ) : (
                <span />
              )}

              {storyGlossaryTerms.length > 1 && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const currentIdx = storyGlossaryTerms.findIndex(
                      (t) => t.id === activeGlossaryTerm.id
                    );
                    const prevTerm =
                      currentIdx > 0
                        ? storyGlossaryTerms[currentIdx - 1]
                        : storyGlossaryTerms[storyGlossaryTerms.length - 1];
                    const nextTerm =
                      currentIdx >= 0 &&
                      currentIdx < storyGlossaryTerms.length - 1
                        ? storyGlossaryTerms[currentIdx + 1]
                        : storyGlossaryTerms[0];
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveGlossaryTerm(prevTerm)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 text-[#1C2421] dark:text-slate-200 hover:bg-[#FAF8F4] dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          <span>كلمة سابقة</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveGlossaryTerm(nextTerm)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 text-[#1C2421] dark:text-slate-200 hover:bg-[#FAF8F4] dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <span>كلمة تالية</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
