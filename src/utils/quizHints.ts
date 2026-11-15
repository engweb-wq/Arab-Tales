import { CARTOON_CHARACTERS } from '../data/characters';
import { QuizQuestion, Story } from '../types/story';

const DIACRITICS_RE = /[\u064B-\u065F\u0670\u0640]/g;

const STOP_WORDS = new Set([
  'من',
  'في',
  'على',
  'الى',
  'إلى',
  'عن',
  'مع',
  'هذا',
  'هذه',
  'ذلك',
  'تلك',
  'التي',
  'الذي',
  'الذين',
  'كان',
  'كانت',
  'يكون',
  'أن',
  'ان',
  'إن',
  'ما',
  'ماذا',
  'لماذا',
  'كيف',
  'متى',
  'أين',
  'هل',
  'بم',
  'أي',
  'كل',
  'بعد',
  'قبل',
  'عند',
  'عندما',
  'بين',
  'حتى',
  'فقط',
  'غير',
  'دون',
  'لأن',
  'لانه',
  'لأنها',
  'بسبب',
  'فيها',
  'منها',
  'عليه',
  'عليها',
  'إليه',
  'إليها',
  'القصة',
  'قصة',
  'الدرس',
  'السؤال',
]);

function normalizeArabic(text: string): string {
  return text
    .replace(DIACRITICS_RE, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\u0621-\u064A0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeywords(text: string): string[] {
  return normalizeArabic(text)
    .split(' ')
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

function getParagraphHintSnippet(
  paragraph: string,
  correctOptionNormalized: string
): string | null {
  const sentences = paragraph
    .split(/[.!؟؛]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 12);

  if (sentences.length === 0) return null;

  const optionKeywords = extractKeywords(correctOptionNormalized);

  for (const sentence of sentences) {
    const normSentence = normalizeArabic(sentence);
    if (
      correctOptionNormalized.length >= 4 &&
      normSentence.includes(correctOptionNormalized)
    ) {
      continue;
    }
    const overlapCount = optionKeywords.filter((kw) =>
      normSentence.includes(kw)
    ).length;
    if (optionKeywords.length >= 2 && overlapCount >= Math.ceil(optionKeywords.length * 0.7)) {
      continue;
    }
    const words = sentence.split(/\s+/);
    const trimmed =
      words.length > 12 ? `${words.slice(0, 12).join(' ')}...` : sentence;
    return trimmed;
  }

  return null;
}

/**
 * Generates an encouraging, child-friendly Arabic hint for a comprehension quiz question
 * WITHOUT revealing the correct answer text directly.
 */
export function getQuizQuestionHint(
  story: Story,
  question: QuizQuestion,
  qIndex: number
): string {
  if (question.hint && question.hint.trim().length > 0) {
    return question.hint.trim();
  }

  const guideName =
    CARTOON_CHARACTERS[story.featuredCharacter]?.name ?? 'رفيق القصة';

  const correctOption = question.options[question.correctIndex] ?? '';
  const normCorrect = normalizeArabic(correctOption);

  // Match story paragraph closest to question + explanation
  const queryKeywords = Array.from(
    new Set([
      ...extractKeywords(question.question),
      ...extractKeywords(question.explanation),
    ])
  );

  let bestParaIdx = Math.min(qIndex, Math.max(0, story.paragraphs.length - 1));
  let bestScore = -1;

  story.paragraphs.forEach((para, idx) => {
    const normPara = normalizeArabic(para);
    let score = 0;
    for (const kw of queryKeywords) {
      if (normPara.includes(kw)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestParaIdx = idx;
    }
  });

  // Find a safe matching lesson clue (that doesn't copy the correct option verbatim)
  const matchingLesson =
    story.lessons.find((lesson) => {
      const lessonNorm = normalizeArabic(`${lesson.title} ${lesson.detail}`);
      return (
        normCorrect.length > 0 &&
        !lessonNorm.includes(normCorrect) &&
        queryKeywords.some((kw) => lessonNorm.includes(kw))
      );
    }) ?? story.lessons[qIndex % Math.max(1, story.lessons.length)];

  const bestPara = story.paragraphs[bestParaIdx] ?? '';
  const safeSnippet = getParagraphHintSnippet(bestPara, normCorrect);
  const paraNumber = bestParaIdx + 1;

  const lessonText =
    matchingLesson && !normalizeArabic(matchingLesson.title).includes(normCorrect)
      ? ` وتذكّر درس «${matchingLesson.title}»`
      : '';

  if (safeSnippet) {
    return `تلميح من ${guideName}: راجع الفقرة (${paraNumber}) عند موضع «${safeSnippet}»${lessonText}، ثم اختر الإجابة الأقرب إلى قيمة «${story.coreValue}».`;
  }

  const tipSafe =
    story.characterTip &&
    !normalizeArabic(story.characterTip).includes(normCorrect)
      ? ` — تذكّر نصيحة ${guideName}: «${story.characterTip}».`
      : '';

  return `تلميح من ${guideName}: عد بذاكرتك إلى الفقرة (${paraNumber}) في القصة${lessonText}${tipSafe}`;
}

/**
 * Plays a gentle ascending two-note chime via Web Audio API when a quiz hint unlocks.
 */
export function playHintUnlockChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    [523.25, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.11);
      gain.gain.setValueAtTime(0.001, now + i * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.11 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.11);
      osc.stop(now + i * 0.11 + 0.28);
    });

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Ignore audio context restrictions gracefully
  }
}
