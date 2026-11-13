import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckSquare,
  Compass,
  MessageCircle,
  Sparkles,
  Square,
  Users,
} from 'lucide-react';
import { AgeGroup, Story } from '../types/story';
import { AGE_GROUP_PROFILES, CHARACTER_LIST } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';

interface EducatorGuideProps {
  stories: Story[];
  onOpenStory: (storyId: string) => void;
}

const METHODOLOGY_PRINCIPLES = [
  {
    number: '01',
    title: 'الموازنة بين التشويق والهدف التربوي',
    detail:
      'القصة الناجحة ليست وعظاً مباشراً يملّ منه الطفل، ولا خيالاً خالياً من الفائدة؛ بل أحداث مشوقة تقود بنفسها إلى قيمة جميلة يكتشفها الطفل.',
  },
  {
    number: '02',
    title: 'تجنب التخويف والمبالغة غير المناسبة',
    detail:
      'احرص على انتقاء الحكايات التي تبث الأمل والشجاعة والرفق، والابتعاد عن القصص المرعبة أو المواقف القاسية التي تترك أثراً نفسياً سلبياً في الصغار.',
  },
  {
    number: '03',
    title: 'توظيف الشخصيات المحببة: تاليا ولين ومعاذ',
    detail:
      'تمثّل تاليا فضول الاكتشاف، ولين اللطف والمشاعر، ومعاذ التنظيم والقيم، مما يساعد الطفل على التفاعل وطرح الأسئلة وفهم الدرس بسهولة.',
  },
  {
    number: '04',
    title: 'تحويل القيمة إلى أسئلة تفاعلية وعمل يومي',
    detail:
      'بعد كل قصة، تترسخ المعلومات من خلال ٣ إلى ٥ أسئلة بسيطة ثم خطوة عملية صغيرة يطبقها الطفل في اليوم نفسه.',
  },
];

const SESSION_CHECKLIST = [
  'اختر القصة من الفئة العمرية المناسبة لقدرات الطفل اللغوية (٣–٥، ٦–٨، أو ٩–١١ سنة).',
  'فعّل وضع القراءة الليلية عند القراءة قبل النوم لتخفيف إجهاد العين.',
  'توقف عند نصيحة تاليا أو لين أو معاذ واسأل الطفل عن رأيه قبل الانتقال للفقرة التالية.',
  'أجب مع الطفل عن الأسئلة التفاعلية (٣–٥ أسئلة) لتثبيت الدرس، ثم طبقا تحدي اليوم.',
];

export const EducatorGuide: React.FC<EducatorGuideProps> = ({
  stories,
  onOpenStory,
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('٣–٥ سنوات');
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({
    0: true,
  });

  const recommendedForAge = useMemo(
    () => stories.filter((s) => s.ageGroup === selectedAge).slice(0, 4),
    [stories, selectedAge]
  );

  const ageKeys: AgeGroup[] = ['٣–٥ سنوات', '٦–٨ سنوات', '٩–١١ سنة'];
  const currentAgeProfile = AGE_GROUP_PROFILES[selectedAge];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <header className="pb-6 border-b border-[#E6E0D4] dark:border-slate-800 space-y-2">
        <p className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400">
          منهجية «معطر الجلسات» للآباء والأمهات والمعلمين
        </p>
        <h1 className="font-serif-arabic text-3xl font-bold text-[#1C2421] dark:text-slate-100">
          دليل المربي: تدرج اللغة والشخصيات الكرتونية
        </h1>
        <p className="text-sm text-[#4B5853] dark:text-slate-400 max-w-3xl leading-relaxed">
          إرشادات تربوية توضح كيفية تكييف لغة القصة ومفرداتها ومستوى الدرس التعليمي وفق عمر الطفل،
          وكيفية الاستفادة من أدوار الشخصيات (تاليا ولين ومعاذ) والأسئلة التفاعلية.
        </p>
      </header>

      {/* 4 Core Principles Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#0D7A5F] dark:text-emerald-400" />
          <h2 className="font-serif-arabic text-2xl font-bold text-[#1C2421] dark:text-slate-100">
            ركائز القصّ التربوي الناجح
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {METHODOLOGY_PRINCIPLES.map((item) => (
            <article
              key={item.number}
              className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-6 space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-[#C88A1E] dark:text-amber-400 tabular-nums">
                  {item.number}.
                </span>
                <h3 className="font-serif-arabic text-lg font-bold text-[#1C2421] dark:text-slate-100">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Cartoon Trio Educational Matrix */}
      <section className="space-y-4">
        <h2 className="font-serif-arabic text-2xl font-bold text-[#1C2421] dark:text-slate-100">
          كيف توظّف شخصيات «تاليا ولين ومعاذ» في الجلسة؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CHARACTER_LIST.map((char) => (
            <div
              key={char.id}
              className="bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <CharacterAvatar id={char.id} size="md" />
                <div>
                  <h3 className="font-serif-arabic text-lg font-bold text-[#1C2421] dark:text-slate-100">
                    {char.name}
                  </h3>
                  <p className="text-xs text-[#0D7A5F] dark:text-emerald-400">{char.tagline}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
                {char.educationalRole}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Age-Group Guide + Session Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Age-Group Recommendations */}
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F0EBE0] dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0D7A5F] dark:text-emerald-400" />
              <h2 className="font-serif-arabic text-xl font-bold text-[#1C2421] dark:text-slate-100">
                تكييف اللغة والمفردات حسب العمر
              </h2>
            </div>

            <div className="flex items-center gap-1 bg-[#F3EFE6] dark:bg-slate-800 p-1 rounded-lg">
              {ageKeys.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    selectedAge === age
                      ? 'bg-white dark:bg-slate-700 text-[#1C2421] dark:text-white shadow-xs'
                      : 'text-[#4B5853] dark:text-slate-400'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/60 p-4 space-y-2.5">
            <h3 className="text-sm font-bold text-[#0D7A5F] dark:text-emerald-400">
              {currentAgeProfile.stageName} ({currentAgeProfile.label})
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
              <strong className="text-[#1C2421] dark:text-slate-100">أسلوب اللغة: </strong>
              {currentAgeProfile.languageStyle}
            </p>
            <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
              <strong className="text-[#1C2421] dark:text-slate-100">المفردات: </strong>
              {currentAgeProfile.vocabularyLevel}
            </p>
            <p className="text-xs sm:text-sm text-[#4B5853] dark:text-slate-300 leading-relaxed">
              <strong className="text-[#1C2421] dark:text-slate-100">تعقيد الدرس: </strong>
              {currentAgeProfile.lessonComplexity}
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[#64706B] dark:text-slate-400">
              قصص مناسبة لهذه الفئة العمرية (اضغط للقراءة):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedForAge.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => onOpenStory(story.id)}
                  className="text-right rounded-lg border border-[#E6E0D4] dark:border-slate-700 hover:border-[#0D7A5F] dark:hover:border-emerald-400 p-3.5 transition-colors cursor-pointer space-y-1"
                >
                  <p className="text-sm font-bold text-[#1C2421] dark:text-slate-100 line-clamp-1">
                    {story.title}
                  </p>
                  <p className="text-xs text-[#0D7A5F] dark:text-emerald-400">
                    {story.coreValue} · {story.quiz.length} أسئلة
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Storytelling Session Checklist */}
        <aside className="lg:col-span-5 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE0] dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-[#C88A1E] dark:text-amber-400" />
            <h2 className="font-serif-arabic text-xl font-bold text-[#1C2421] dark:text-slate-100">
              قائمة تحضير جلسة القصة
            </h2>
          </div>

          <ul className="space-y-3">
            {SESSION_CHECKLIST.map((item, idx) => {
              const checked = !!checkedSteps[idx];
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() =>
                      setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className={`w-full text-right rounded-lg border p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                      checked
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30'
                        : 'border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/50'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-[#64706B] dark:text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className="text-xs sm:text-sm text-[#1C2421] dark:text-slate-200 leading-relaxed">
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#9A6712] dark:text-amber-400">
              <MessageCircle className="w-4 h-4" />
              <span>نصيحة تربوية للمربي</span>
            </div>
            <p className="text-xs text-[#4B5853] dark:text-slate-300 leading-relaxed">
              لا تجعل القصة مجرد سباق لإنهاء السطور؛ بل توقف عند المواقف الجميلة واسأل طفلك:
              «لو كنت مكان تاليا أو لين أو معاذ، ماذا كنت ستفعل؟»
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenStory('talia-leen-muadh-time')}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 text-white cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>اقرأ قصة تاليا ولين ومعاذ الآن</span>
          </button>
        </aside>
      </div>
    </div>
  );
};
