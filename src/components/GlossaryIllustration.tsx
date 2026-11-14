import React from 'react';
import { GlossaryIllustrationKind } from '../data/glossary';

interface GlossaryIllustrationProps {
  kind: GlossaryIllustrationKind;
}

export const GlossaryIllustration: React.FC<GlossaryIllustrationProps> = ({
  kind,
}) => {
  return (
    <svg
      viewBox="0 0 180 120"
      className="w-44 h-28 rounded-xl border border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800 shrink-0"
      aria-hidden="true"
    >
      {kind === 'scales' && (
        <g>
          <rect width="180" height="120" fill="#ECFDF5" />
          <line x1="90" y1="22" x2="90" y2="96" stroke="#0D7A5F" strokeWidth="4" strokeLinecap="round" />
          <rect x="64" y="94" width="52" height="8" rx="4" fill="#0D7A5F" />
          <line x1="46" y1="36" x2="134" y2="36" stroke="#C88A1E" strokeWidth="4" strokeLinecap="round" />
          <circle cx="90" cy="36" r="6" fill="#F59E0B" />
          <line x1="46" y1="36" x2="34" y2="66" stroke="#64748B" strokeWidth="2" />
          <line x1="46" y1="36" x2="58" y2="66" stroke="#64748B" strokeWidth="2" />
          <path d="M30 66 Q46 78 62 66 Z" fill="#F59E0B" />
          <line x1="134" y1="36" x2="122" y2="66" stroke="#64748B" strokeWidth="2" />
          <line x1="134" y1="36" x2="146" y2="66" stroke="#64748B" strokeWidth="2" />
          <path d="M118 66 Q134 78 150 66 Z" fill="#F59E0B" />
        </g>
      )}

      {kind === 'heart-sun' && (
        <g>
          <rect width="180" height="120" fill="#FFFBEB" />
          <circle cx="90" cy="58" r="36" fill="#FEF3C7" />
          <path
            d="M90 86 C64 70 54 56 54 43 C54 33 62 26 71 26 C79 26 86 31 90 38 C94 31 101 26 109 26 C118 26 126 33 126 43 C126 56 116 70 90 86 Z"
            fill="#F43F5E"
          />
          <circle cx="42" cy="30" r="4" fill="#F59E0B" />
          <circle cx="142" cy="32" r="5" fill="#10B981" />
          <circle cx="136" cy="86" r="3.5" fill="#F59E0B" />
        </g>
      )}

      {kind === 'owl-book' && (
        <g>
          <rect width="180" height="120" fill="#F0F9FF" />
          <path d="M38 78 Q64 68 90 78 Q116 68 142 78 L142 98 Q116 88 90 98 Q64 88 38 98 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
          <line x1="90" y1="78" x2="90" y2="98" stroke="#0284C7" strokeWidth="2.5" />
          <circle cx="90" cy="48" r="22" fill="#0D7A5F" />
          <circle cx="82" cy="44" r="7" fill="#FFFFFF" />
          <circle cx="98" cy="44" r="7" fill="#FFFFFF" />
          <circle cx="82" cy="44" r="3" fill="#1E293B" />
          <circle cx="98" cy="44" r="3" fill="#1E293B" />
          <polygon points="86,51 94,51 90,57" fill="#F59E0B" />
        </g>
      )}

      {kind === 'lamp-light' && (
        <g>
          <rect width="180" height="120" fill="#FFFBEB" />
          <circle cx="90" cy="46" r="24" fill="#FDE68A" />
          <circle cx="90" cy="46" r="14" fill="#F59E0B" />
          <rect x="82" y="64" width="16" height="12" rx="3" fill="#64748B" />
          <rect x="78" y="76" width="24" height="6" rx="3" fill="#475569" />
          <line x1="54" y1="46" x2="40" y2="46" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="126" y1="46" x2="140" y2="46" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="14" x2="90" y2="6" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="64" y1="22" x2="54" y2="14" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="116" y1="22" x2="126" y2="14" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {kind === 'seed-sprout' && (
        <g>
          <rect width="180" height="120" fill="#ECFDF5" />
          <path d="M25 94 Q90 84 155 94 L155 120 L25 120 Z" fill="#D97706" opacity="0.28" />
          <path d="M90 92 Q90 60 90 48" stroke="#0D7A5F" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M90 64 Q60 58 62 38 Q82 38 90 64 Z" fill="#10B981" />
          <path d="M90 56 Q120 48 118 28 Q98 28 90 56 Z" fill="#059669" />
          <circle cx="90" cy="34" r="7" fill="#F59E0B" />
        </g>
      )}

      {kind === 'handshake' && (
        <g>
          <rect width="180" height="120" fill="#FEF3C7" />
          <circle cx="66" cy="58" r="24" fill="#10B981" opacity="0.9" />
          <circle cx="114" cy="58" r="24" fill="#0EA5E9" opacity="0.9" />
          <circle cx="90" cy="58" r="14" fill="#F59E0B" />
          <path d="M84 58 L89 63 L98 53" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {kind === 'gift-coins' && (
        <g>
          <rect width="180" height="120" fill="#FFFBEB" />
          <rect x="54" y="48" width="72" height="48" rx="8" fill="#0D7A5F" />
          <rect x="48" y="38" width="84" height="16" rx="5" fill="#10B981" />
          <rect x="84" y="38" width="12" height="58" fill="#F59E0B" />
          <circle cx="80" cy="28" r="8" fill="none" stroke="#F59E0B" strokeWidth="4" />
          <circle cx="100" cy="28" r="8" fill="none" stroke="#F59E0B" strokeWidth="4" />
        </g>
      )}

      {kind === 'tools-craft' && (
        <g>
          <rect width="180" height="120" fill="#FEF3C7" />
          <path d="M40 88 L90 42 L140 88 Z" fill="#D97706" />
          <rect x="56" y="68" width="68" height="32" fill="#FFFFFF" stroke="#B45309" strokeWidth="3" />
          <rect x="82" y="76" width="16" height="24" fill="#B45309" />
          <circle cx="144" cy="30" r="10" fill="#F59E0B" />
        </g>
      )}

      {kind === 'mountain-step' && (
        <g>
          <rect width="180" height="120" fill="#E0F2FE" />
          <polygon points="22,102 74,34 126,102" fill="#0D7A5F" />
          <polygon points="82,102 124,48 164,102" fill="#10B981" />
          <polygon points="62,50 74,34 86,50 78,47 74,52 70,47" fill="#FFFFFF" />
          <circle cx="140" cy="28" r="10" fill="#F59E0B" />
        </g>
      )}

      {kind === 'cloud-garden' && (
        <g>
          <rect width="180" height="120" fill="#E0F2FE" />
          <path d="M54 44 C54 32 70 26 82 32 C90 22 110 24 114 36 C126 36 132 48 122 54 L58 54 C50 54 48 44 54 44 Z" fill="#FFFFFF" />
          <line x1="72" y1="60" x2="68" y2="70" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="60" x2="86" y2="70" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <line x1="108" y1="60" x2="104" y2="70" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 96 Q90 80 160 96 L160 120 L20 120 Z" fill="#10B981" />
          <circle cx="56" cy="88" r="6" fill="#F43F5E" />
          <circle cx="122" cy="86" r="6" fill="#F59E0B" />
        </g>
      )}

      {kind === 'ship-sea' && (
        <g>
          <rect width="180" height="120" fill="#E0F2FE" />
          <path d="M46 72 L134 72 L120 92 L60 92 Z" fill="#92400E" />
          <line x1="90" y1="24" x2="90" y2="72" stroke="#78350F" strokeWidth="3.5" />
          <polygon points="90,26 128,64 90,64" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <path d="M10 92 Q35 84 60 92 T110 92 T170 92 L170 120 L10 120 Z" fill="#0EA5E9" />
        </g>
      )}

      {kind === 'cave-light' && (
        <g>
          <rect width="180" height="120" fill="#1E293B" />
          <path d="M30 108 Q90 12 150 108 Z" fill="#475569" />
          <path d="M58 108 Q90 44 122 108 Z" fill="#0F172A" />
          <circle cx="90" cy="78" r="14" fill="#FDE68A" opacity="0.85" />
          <circle cx="144" cy="26" r="6" fill="#FEF08A" />
        </g>
      )}

      {kind === 'kaaba-star' && (
        <g>
          <rect width="180" height="120" fill="#FEF3C7" />
          <rect x="60" y="34" width="60" height="62" rx="4" fill="#1E293B" />
          <rect x="60" y="48" width="60" height="8" fill="#F59E0B" />
          <rect x="84" y="64" width="12" height="20" fill="#F59E0B" />
          <circle cx="34" cy="28" r="5" fill="#F59E0B" />
          <circle cx="146" cy="30" r="4" fill="#F59E0B" />
        </g>
      )}

      {kind === 'desert-palm' && (
        <g>
          <rect width="180" height="120" fill="#FEF3C7" />
          <circle cx="136" cy="30" r="14" fill="#F59E0B" />
          <path d="M0 90 Q55 70 110 88 T180 84 L180 120 L0 120 Z" fill="#FBBF24" />
          <path d="M52 90 Q58 64 56 46" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          <path d="M56 46 Q34 40 28 54" stroke="#059669" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M56 46 Q78 38 86 52" stroke="#059669" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M56 46 Q56 26 70 30" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      )}

      {kind === 'cat-bowl' && (
        <g>
          <rect width="180" height="120" fill="#FFFBEB" />
          <circle cx="72" cy="64" r="20" fill="#FB923C" />
          <polygon points="56,52 60,34 72,46" fill="#FB923C" />
          <polygon points="88,52 84,34 72,46" fill="#FB923C" />
          <circle cx="65" cy="61" r="2.5" fill="#1E293B" />
          <circle cx="79" cy="61" r="2.5" fill="#1E293B" />
          <path d="M108 78 L146 78 L140 94 L114 94 Z" fill="#0EA5E9" />
          <ellipse cx="127" cy="78" rx="19" ry="4" fill="#FFFFFF" />
        </g>
      )}

      {kind === 'bee-flower' && (
        <g>
          <rect width="180" height="120" fill="#FFFBEB" />
          <circle cx="62" cy="74" r="10" fill="#F43F5E" />
          <circle cx="82" cy="74" r="10" fill="#F43F5E" />
          <circle cx="72" cy="64" r="10" fill="#F43F5E" />
          <circle cx="72" cy="84" r="10" fill="#F43F5E" />
          <circle cx="72" cy="74" r="8" fill="#F59E0B" />
          <ellipse cx="118" cy="46" rx="16" ry="11" fill="#F59E0B" />
          <line x1="114" y1="36" x2="114" y2="56" stroke="#1E293B" strokeWidth="3.5" />
          <line x1="124" y1="36" x2="124" y2="56" stroke="#1E293B" strokeWidth="3.5" />
          <ellipse cx="114" cy="32" rx="8" ry="5" fill="#E0F2FE" />
        </g>
      )}

      {kind === 'ant-grain' && (
        <g>
          <rect width="180" height="120" fill="#ECFDF5" />
          <path d="M0 94 L180 94 L180 120 L0 120 Z" fill="#10B981" opacity="0.3" />
          <circle cx="68" cy="74" r="8" fill="#78350F" />
          <circle cx="84" cy="74" r="7" fill="#78350F" />
          <circle cx="100" cy="71" r="8" fill="#78350F" />
          <ellipse cx="106" cy="56" rx="9" ry="5" fill="#F59E0B" />
        </g>
      )}

      {kind === 'turtle-shell' && (
        <g>
          <rect width="180" height="120" fill="#ECFDF5" />
          <path d="M52 78 C52 44 120 44 120 78 Z" fill="#0D7A5F" />
          <circle cx="132" cy="70" r="10" fill="#10B981" />
          <circle cx="135" cy="68" r="2" fill="#1E293B" />
          <rect x="62" y="78" width="12" height="12" rx="4" fill="#10B981" />
          <rect x="98" y="78" width="12" height="12" rx="4" fill="#10B981" />
        </g>
      )}

      {kind === 'clay-jar' && (
        <g>
          <rect width="180" height="120" fill="#FEF3C7" />
          <ellipse cx="90" cy="68" rx="26" ry="30" fill="#D97706" />
          <rect x="76" y="28" width="28" height="14" rx="4" fill="#B45309" />
          <path d="M84 52 L92 64 L86 74" fill="none" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="122" cy="84" r="6" fill="#0EA5E9" />
        </g>
      )}

      {kind === 'eraser-pencil' && (
        <g>
          <rect width="180" height="120" fill="#F8FAFC" />
          <rect x="44" y="42" width="68" height="16" rx="3" fill="#F59E0B" />
          <polygon points="112,42 132,50 112,58" fill="#FDE68A" />
          <polygon points="124,47 132,50 124,53" fill="#1E293B" />
          <rect x="52" y="70" width="48" height="22" rx="5" fill="#F43F5E" />
          <rect x="84" y="70" width="16" height="22" rx="4" fill="#E2E8F0" />
        </g>
      )}

      {kind === 'clock-time' && (
        <g>
          <rect width="180" height="120" fill="#E0F2FE" />
          <circle cx="90" cy="60" r="34" fill="#FFFFFF" stroke="#0284C7" strokeWidth="5" />
          <line x1="90" y1="60" x2="90" y2="38" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="90" y1="60" x2="108" y2="68" stroke="#C88A1E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="90" cy="60" r="4" fill="#0284C7" />
        </g>
      )}

      {kind === 'bookshelf' && (
        <g>
          <rect width="180" height="120" fill="#FEF3C7" />
          <rect x="34" y="84" width="112" height="8" rx="2" fill="#92400E" />
          <rect x="48" y="36" width="16" height="48" rx="2" fill="#0D7A5F" />
          <rect x="68" y="42" width="16" height="42" rx="2" fill="#0EA5E9" />
          <rect x="88" y="32" width="18" height="52" rx="2" fill="#F59E0B" />
          <rect x="110" y="40" width="16" height="44" rx="2" fill="#F43F5E" />
        </g>
      )}

      {kind === 'wall-shield' && (
        <g>
          <rect width="180" height="120" fill="#F1F5F9" />
          <rect x="34" y="44" width="112" height="52" rx="4" fill="#64748B" />
          <line x1="34" y1="62" x2="146" y2="62" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="34" y1="80" x2="146" y2="80" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="70" y1="44" x2="70" y2="62" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="110" y1="62" x2="110" y2="80" stroke="#CBD5E1" strokeWidth="2" />
        </g>
      )}

      {kind === 'water-well' && (
        <g>
          <rect width="180" height="120" fill="#E0F2FE" />
          <rect x="58" y="64" width="64" height="36" rx="4" fill="#94A3B8" />
          <ellipse cx="90" cy="64" rx="32" ry="8" fill="#0EA5E9" />
          <line x1="66" y1="30" x2="66" y2="64" stroke="#78350F" strokeWidth="3.5" />
          <line x1="114" y1="30" x2="114" y2="64" stroke="#78350F" strokeWidth="3.5" />
          <path d="M54 32 L90 16 L126 32 Z" fill="#B45309" />
        </g>
      )}
    </svg>
  );
};
