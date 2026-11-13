import React from 'react';
import { CharacterId } from '../types/story';

interface CharacterAvatarProps {
  id: CharacterId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Custom cartoon SVG portraits for Talia, Leen, and Muadh.
 * Designed with friendly, expressive cartoon features and distinct visual signatures.
 */
export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  id,
  size = 'md',
  className = '',
}) => {
  const sizeClass =
    size === 'sm'
      ? 'w-9 h-9'
      : size === 'lg'
        ? 'w-20 h-20'
        : 'w-14 h-14';

  const renderCharacter = () => {
    switch (id) {
      case 'talia':
        return (
          <g>
            {/* Emerald Backdrop */}
            <circle cx="60" cy="60" r="58" fill="#D1FAE5" />
            <circle cx="60" cy="60" r="54" fill="#ECFDF5" />
            {/* Shoulders / Adventure Vest */}
            <path d="M24 114 C28 88, 92 88, 96 114 Z" fill="#0D7A5F" />
            <path d="M44 92 L60 108 L76 92 Z" fill="#FDE68A" />
            {/* Hair Back */}
            <circle cx="34" cy="54" r="14" fill="#451A03" />
            <circle cx="86" cy="54" r="14" fill="#451A03" />
            <path d="M28 52 C28 24, 92 24, 92 52 L92 78 C85 72, 35 72, 28 78 Z" fill="#5C280B" />
            {/* Neck & Face */}
            <rect x="52" y="76" width="16" height="16" rx="6" fill="#FCD5B5" />
            <circle cx="60" cy="56" r="24" fill="#FDE0C8" />
            {/* Hair Bangs & Emerald Headband */}
            <path d="M36 52 C40 30, 80 30, 84 52 C74 42, 46 42, 36 52 Z" fill="#5C280B" />
            <path d="M36 44 Q60 30 84 44" fill="none" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
            <circle cx="80" cy="40" r="5" fill="#F59E0B" />
            {/* Expressive Cartoon Eyes & Cheerful Smile */}
            <circle cx="50" cy="57" r="4" fill="#1E293B" />
            <circle cx="70" cy="57" r="4" fill="#1E293B" />
            <circle cx="51.3" cy="55.5" r="1.4" fill="#FFFFFF" />
            <circle cx="71.3" cy="55.5" r="1.4" fill="#FFFFFF" />
            <circle cx="44" cy="64" r="3.5" fill="#FDA4AF" opacity="0.6" />
            <circle cx="76" cy="64" r="3.5" fill="#FDA4AF" opacity="0.6" />
            <path d="M53 67 Q60 74 67 67" fill="none" stroke="#9A3412" strokeWidth="2.6" strokeLinecap="round" />
            {/* Little Magnifying Glass Prop */}
            <circle cx="91" cy="91" r="10" fill="#E0F2FE" stroke="#0D7A5F" strokeWidth="3" />
            <line x1="98" y1="98" x2="106" y2="106" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          </g>
        );

      case 'leen':
        return (
          <g>
            {/* Warm Amber Backdrop */}
            <circle cx="60" cy="60" r="58" fill="#FDE68A" />
            <circle cx="60" cy="60" r="54" fill="#FFFBEB" />
            {/* Cozy Collar / Dress */}
            <path d="M24 114 C28 88, 92 88, 96 114 Z" fill="#D97706" />
            <path d="M46 92 Q60 104 74 92" fill="#FFFFFF" />
            {/* Twin Puffs / Braids */}
            <circle cx="30" cy="42" r="11" fill="#3B2314" />
            <circle cx="90" cy="42" r="11" fill="#3B2314" />
            <circle cx="34" cy="46" r="4" fill="#F43F5E" />
            <circle cx="86" cy="46" r="4" fill="#F43F5E" />
            {/* Neck & Face */}
            <rect x="52" y="76" width="16" height="16" rx="6" fill="#FCD5B5" />
            <circle cx="60" cy="56" r="24" fill="#FDE4CE" />
            {/* Hair Bangs */}
            <path d="M36 53 C38 28, 82 28, 84 53 C72 40, 60 46, 36 53 Z" fill="#3B2314" />
            {/* Cute Eyes & Gentle Smile */}
            <circle cx="50" cy="57" r="4" fill="#1E293B" />
            <circle cx="70" cy="57" r="4" fill="#1E293B" />
            <circle cx="51.4" cy="55.5" r="1.4" fill="#FFFFFF" />
            <circle cx="71.4" cy="55.5" r="1.4" fill="#FFFFFF" />
            <circle cx="44" cy="64" r="3.8" fill="#FB7185" opacity="0.55" />
            <circle cx="76" cy="64" r="3.8" fill="#FB7185" opacity="0.55" />
            <path d="M54 67 Q60 72 66 67" fill="none" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
            {/* Little Flower Prop */}
            <g transform="translate(86, 84)">
              <circle cx="8" cy="3" r="4" fill="#F43F5E" />
              <circle cx="13" cy="8" r="4" fill="#F43F5E" />
              <circle cx="8" cy="13" r="4" fill="#F43F5E" />
              <circle cx="3" cy="8" r="4" fill="#F43F5E" />
              <circle cx="8" cy="8" r="3.5" fill="#FBBF24" />
            </g>
          </g>
        );

      case 'muadh':
        return (
          <g>
            {/* Sky Slate Backdrop */}
            <circle cx="60" cy="60" r="58" fill="#BAE6FD" />
            <circle cx="60" cy="60" r="54" fill="#F0F9FF" />
            {/* Organized Vest & Collar */}
            <path d="M24 114 C28 88, 92 88, 96 114 Z" fill="#0369A1" />
            <path d="M47 91 L60 105 L73 91 Z" fill="#FFFFFF" />
            {/* Neck & Face */}
            <rect x="52" y="76" width="16" height="16" rx="6" fill="#F7C9A4" />
            <circle cx="60" cy="57" r="24" fill="#FAD7BA" />
            {/* Neat Short Hair & Friendly Cap */}
            <path d="M36 52 C36 28, 84 28, 84 52 C74 44, 46 44, 36 52 Z" fill="#1E293B" />
            <path d="M35 44 C38 26, 82 26, 85 44 Z" fill="#0284C7" />
            <path d="M32 44 Q60 39 89 45" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
            {/* Glasses & Bright Eyes */}
            <circle cx="49" cy="58" r="7.5" fill="none" stroke="#0F172A" strokeWidth="2.2" />
            <circle cx="71" cy="58" r="7.5" fill="none" stroke="#0F172A" strokeWidth="2.2" />
            <line x1="56.5" y1="58" x2="63.5" y2="58" stroke="#0F172A" strokeWidth="2.2" />
            <circle cx="49" cy="58" r="3.2" fill="#1E293B" />
            <circle cx="71" cy="58" r="3.2" fill="#1E293B" />
            <circle cx="50.2" cy="56.8" r="1.1" fill="#FFFFFF" />
            <circle cx="72.2" cy="56.8" r="1.1" fill="#FFFFFF" />
            <path d="M53 69 Q60 74 67 69" fill="none" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
            {/* Little Golden Book / Compass Badge */}
            <rect x="80" y="84" width="18" height="22" rx="3" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
            <line x1="85" y1="91" x2="93" y2="91" stroke="#FFFBEB" strokeWidth="2" strokeLinecap="round" />
            <line x1="85" y1="97" x2="93" y2="97" stroke="#FFFBEB" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${sizeClass} rounded-full shrink-0 ${className}`}
      aria-hidden="true"
    >
      {renderCharacter()}
    </svg>
  );
};
