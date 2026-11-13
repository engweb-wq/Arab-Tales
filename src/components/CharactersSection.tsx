import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { CharacterId } from '../types/story';
import { CHARACTER_LIST } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';

interface CharactersSectionProps {
  selectedCharacter: CharacterId | 'all';
  onSelectCharacter: (charId: CharacterId | 'all') => void;
  storyCounts: Record<CharacterId, number>;
}

export const CharactersSection: React.FC<CharactersSectionProps> = ({
  selectedCharacter,
  onSelectCharacter,
  storyCounts,
}) => {
  const accentTextMap: Record<'emerald' | 'amber' | 'sky', string> = {
    emerald: 'text-[#0D7A5F] dark:text-emerald-400',
    amber: 'text-[#C88A1E] dark:text-amber-400',
    sky: 'text-sky-700 dark:text-sky-400',
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="font-serif-arabic text-2xl font-bold text-[#1C2421] dark:text-slate-100">
            تعرّف على أصدقاء الحكايات: تاليا ولين ومعاذ
          </h2>
          <p className="text-sm text-[#4B5853] dark:text-slate-400 mt-1">
            لكل شخصية صفاتها المميزة ودورها التعليمي الخاص في مساعدة الطفل على فهم الدرس وتطبيقه
          </p>
        </div>

        {selectedCharacter !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCharacter('all')}
            className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400 hover:underline self-start sm:self-auto cursor-pointer"
          >
            عرض قصص جميع الشخصيات ←
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CHARACTER_LIST.map((character) => {
          const isSelected = selectedCharacter === character.id;
          return (
            <article
              key={character.id}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-5 flex flex-col justify-between transition-colors ${
                isSelected
                  ? 'border-[#0D7A5F] dark:border-emerald-400 ring-1 ring-[#0D7A5F]/20 dark:ring-emerald-400/20'
                  : 'border-[#E6E0D4] dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                {/* Avatar & Identity */}
                <div className="flex items-center gap-3.5">
                  <CharacterAvatar id={character.id} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-arabic text-xl font-bold text-[#1C2421] dark:text-slate-100">
                        {character.name}
                      </h3>
                      <span className="text-xs text-[#64706B] dark:text-slate-400 tabular-nums">
                        · {storyCounts[character.id]} قصص
                      </span>
                    </div>
                    <p className={`text-xs font-medium mt-0.5 ${accentTextMap[character.accentColor]}`}>
                      {character.tagline}
                    </p>
                  </div>
                </div>

                {/* Unique Traits */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#1C2421] dark:text-slate-200">
                    الصفات الفريدة:
                  </p>
                  <ul className="space-y-1 text-xs text-[#4B5853] dark:text-slate-300">
                    {character.traits.map((trait, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className={accentTextMap[character.accentColor]} aria-hidden="true">•</span>
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Educational Role */}
                <div className="rounded-lg border border-[#F0EBE0] dark:border-slate-800 bg-[#FAF8F4] dark:bg-slate-800/50 p-3 space-y-1">
                  <p className="text-[11px] font-bold text-[#64706B] dark:text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C88A1E] dark:text-amber-400" />
                    <span>الدور التعليمي في القصة:</span>
                  </p>
                  <p className="text-xs text-[#1C2421] dark:text-slate-200 leading-relaxed">
                    {character.educationalRole}
                  </p>
                </div>

                <p className="font-serif-arabic text-sm text-[#4B5853] dark:text-slate-300">
                  {character.catchphrase}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F0EBE0] dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#64706B] dark:text-slate-400 truncate">
                  الأداة: {character.companionItem}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onSelectCharacter(isSelected ? 'all' : character.id)
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#0D7A5F] text-white dark:bg-emerald-600'
                      : 'bg-[#F3EFE6] hover:bg-[#E7E0D2] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1C2421] dark:text-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{isSelected ? 'معروضة الآن' : `قصص ${character.name}`}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
