import React from 'react';
import { VirtualBadge } from '../types/story';

interface BadgeEmblemProps {
  badge: VirtualBadge;
  size?: 'sm' | 'md' | 'lg';
}

export const BadgeEmblem: React.FC<BadgeEmblemProps> = ({ badge, size = 'md' }) => {
  const sizeClass =
    size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';

  const palettes: Record<
    VirtualBadge['accentColor'],
    { rim: string; bg: string; ribbon: string; star: string }
  > = {
    emerald: {
      rim: '#0D7A5F',
      bg: '#D1FAE5',
      ribbon: '#059669',
      star: '#F59E0B',
    },
    amber: {
      rim: '#C88A1E',
      bg: '#FEF3C7',
      ribbon: '#D97706',
      star: '#0D7A5F',
    },
    sky: {
      rim: '#0284C7',
      bg: '#E0F2FE',
      ribbon: '#0EA5E9',
      star: '#F59E0B',
    },
    rose: {
      rim: '#E11D48',
      bg: '#FFE4E6',
      ribbon: '#F43F5E',
      star: '#F59E0B',
    },
  };

  const colors = badge.isEarned
    ? palettes[badge.accentColor]
    : {
        rim: '#94A3B8',
        bg: '#F1F5F9',
        ribbon: '#CBD5E1',
        star: '#94A3B8',
      };

  return (
    <svg
      viewBox="0 0 80 80"
      className={`${sizeClass} shrink-0 ${badge.isEarned ? '' : 'opacity-65'}`}
      aria-hidden="true"
    >
      {/* Medal Ribbons */}
      <path d="M26 52 L20 74 L32 68 L36 74 L38 54 Z" fill={colors.ribbon} />
      <path d="M54 52 L60 74 L48 68 L44 74 L42 54 Z" fill={colors.ribbon} opacity="0.88" />

      {/* Outer Scalloped Medal Rim */}
      <circle cx="40" cy="34" r="26" fill={colors.rim} />
      <circle cx="40" cy="34" r="21" fill={colors.bg} />
      <circle
        cx="40"
        cy="34"
        r="17"
        fill="none"
        stroke={colors.rim}
        strokeWidth="1.5"
        strokeDasharray="3 2.5"
      />

      {/* Category Symbol Inside Medal */}
      {badge.category === 'reading' && (
        <g>
          <path
            d="M28 28 Q34 25 40 28 Q46 25 52 28 L52 42 Q46 39 40 42 Q34 39 28 42 Z"
            fill="#FFFFFF"
            stroke={colors.rim}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <line x1="40" y1="28" x2="40" y2="42" stroke={colors.rim} strokeWidth="2" />
          <circle cx="40" cy="20" r="2.5" fill={colors.star} />
        </g>
      )}

      {badge.category === 'quiz' && (
        <path
          d="M40 20 L43.7 28.2 L52.6 29.2 L46 35.3 L47.8 44.1 L40 39.6 L32.2 44.1 L34 35.3 L27.4 29.2 L36.3 28.2 Z"
          fill={colors.star}
          stroke={colors.rim}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}

      {badge.category === 'mastery' && (
        <g>
          <path
            d="M40 44 C31 38 27 32 27 27 C27 23.5 30 21 33.5 21 C36.2 21 38.5 22.6 40 24.8 C41.5 22.6 43.8 21 46.5 21 C50 21 53 23.5 53 27 C53 32 49 38 40 44 Z"
            fill={colors.star}
            stroke={colors.rim}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Lock Indicator if not earned */}
      {!badge.isEarned && (
        <g transform="translate(51, 43)">
          <circle cx="9" cy="9" r="9" fill="#475569" />
          <rect x="5" y="8" width="8" height="6" rx="1.5" fill="#FFFFFF" />
          <path
            d="M6.8 8 V6.2 C6.8 5 7.8 4 9 4 C10.2 4 11.2 5 11.2 6.2 V8"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </g>
      )}
    </svg>
  );
};
