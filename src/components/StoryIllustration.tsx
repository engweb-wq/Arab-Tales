import React from 'react';
import { IllustrationId } from '../types/story';

interface StoryIllustrationProps {
  id: IllustrationId;
  className?: string;
}

/**
 * Custom storybook SVG illustrations crafted for children's educational tales.
 * Uses restrained, warm editorial palettes (emerald, saffron amber, sky slate, terracotta sand)
 * with clean geometric shapes so every story card and reader header is vivid and reliable.
 */
export const StoryIllustration: React.FC<StoryIllustrationProps> = ({ id, className = '' }) => {
  const renderScene = () => {
    switch (id) {
      case 'luqman-wisdom':
      case 'kaab-truth':
      case 'paradise-dust':
        return (
          <g>
            {/* Warm sage night/evening sky & crescent + open scroll/book */}
            <rect width="400" height="240" fill="#EFF6F3" className="dark:fill-[#132522]" />
            <circle cx="315" cy="64" r="34" fill="#FDE68A" opacity="0.45" />
            <path d="M322 44a24 24 0 1 0 18 39 20 20 0 1 1-18-39Z" fill="#D97706" />
            {/* Rolling hills */}
            <path d="M0 190 Q110 150 220 185 T400 175 L400 240 L0 240 Z" fill="#A7F3D0" opacity="0.55" />
            <path d="M0 208 Q150 178 290 205 T400 198 L400 240 L0 240 Z" fill="#0D7A5F" opacity="0.85" />
            {/* Open Wisdom Book */}
            <g transform="translate(115, 78)">
              <path d="M85 18 C65 6, 25 8, 5 18 L5 102 C25 92, 65 92, 85 104 Z" fill="#FFFFFF" stroke="#0D7A5F" strokeWidth="3" />
              <path d="M85 18 C105 6, 145 8, 165 18 L165 102 C145 92, 105 92, 85 104 Z" fill="#FFFBEB" stroke="#0D7A5F" strokeWidth="3" />
              <line x1="25" y1="40" x2="68" y2="40" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
              <line x1="25" y1="56" x2="68" y2="56" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
              <line x1="25" y1="72" x2="55" y2="72" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
              <line x1="102" y1="40" x2="145" y2="40" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
              <line x1="102" y1="56" x2="145" y2="56" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
              <circle cx="125" cy="74" r="8" fill="#F59E0B" opacity="0.8" />
            </g>
          </g>
        );

      case 'cave-sleepers':
      case 'cave-rock':
        return (
          <g>
            <rect width="400" height="240" fill="#F1F5F9" className="dark:fill-[#162032]" />
            {/* Stars */}
            <circle cx="70" cy="48" r="3" fill="#D97706" />
            <circle cx="120" cy="32" r="2" fill="#D97706" />
            <circle cx="330" cy="45" r="3" fill="#D97706" />
            {/* Mountain & Cave Arch */}
            <path d="M30 240 L145 62 Q200 28 255 62 L370 240 Z" fill="#475569" />
            <path d="M90 240 L175 110 Q200 85 225 110 L310 240 Z" fill="#334155" />
            <path d="M145 240 L145 162 Q200 112 255 162 L255 240 Z" fill="#0F172A" />
            {/* Warm Golden Ray / Lantern Light inside Cave */}
            <ellipse cx="200" cy="200" rx="38" ry="20" fill="#F59E0B" opacity="0.28" />
            <path d="M192 168 L208 168 L212 192 L188 192 Z" fill="#FBBF24" />
            <circle cx="200" cy="164" r="5" fill="#D97706" />
            {/* Sunbeams outside */}
            <line x1="340" y1="25" x2="275" y2="120" stroke="#FBBF24" strokeWidth="3" strokeDasharray="6 6" opacity="0.65" />
            <circle cx="345" cy="30" r="18" fill="#F59E0B" opacity="0.85" />
          </g>
        );

      case 'khidr-sea':
      case 'wooden-plank':
        return (
          <g>
            <rect width="400" height="240" fill="#ECFEFF" className="dark:fill-[#0F242C]" />
            <circle cx="95" cy="65" r="28" fill="#F59E0B" opacity="0.85" />
            {/* Sailboat / Wooden Plank */}
            <g transform="translate(135, 85)">
              <path d="M20 75 L125 75 L105 98 L40 98 Z" fill="#92400E" />
              <line x1="72" y1="12" x2="72" y2="75" stroke="#78350F" strokeWidth="4" />
              <path d="M74 14 L118 65 L74 65 Z" fill="#FFFFFF" stroke="#0D7A5F" strokeWidth="2" />
              <path d="M70 24 L35 65 L70 65 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            </g>
            {/* Sea waves */}
            <path d="M0 175 Q50 158 100 175 T200 175 T300 175 T400 175 L400 240 L0 240 Z" fill="#0284C7" opacity="0.75" />
            <path d="M0 195 Q60 180 120 195 T240 195 T360 195 L400 195 L400 240 L0 240 Z" fill="#0369A1" />
          </g>
        );

      case 'elephant-kaaba':
      case 'ismail-zamzam':
        return (
          <g>
            <rect width="400" height="240" fill="#FEF9EE" className="dark:fill-[#1E1B16]" />
            {/* Desert Dunes */}
            <path d="M0 188 Q100 155 200 188 T400 178 L400 240 L0 240 Z" fill="#FDE68A" opacity="0.7" />
            <path d="M0 208 Q140 185 280 210 T400 200 L400 240 L0 240 Z" fill="#D97706" opacity="0.35" />
            {/* Sacred Cube / Kaaba Silhouette */}
            <g transform="translate(152, 72)">
              <rect x="0" y="20" width="96" height="96" rx="4" fill="#1E293B" />
              <rect x="0" y="38" width="96" height="14" fill="#D97706" />
              <rect x="38" y="68" width="20" height="34" rx="2" fill="#F59E0B" opacity="0.9" />
            </g>
            {/* Flying birds (Ababil) */}
            <path d="M70 58 Q82 48 94 58 Q106 48 118 58" fill="none" stroke="#0D7A5F" strokeWidth="3" strokeLinecap="round" />
            <path d="M275 48 Q285 38 295 48 Q305 38 315 48" fill="none" stroke="#0D7A5F" strokeWidth="3" strokeLinecap="round" />
            <path d="M105 88 Q114 80 123 88 Q132 80 141 88" fill="none" stroke="#0D7A5F" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'donkey-village':
      case 'dhul-qarnayn':
      case 'talut-jalut':
        return (
          <g>
            <rect width="400" height="240" fill="#F5F3EC" className="dark:fill-[#1A202C]" />
            <circle cx="200" cy="95" r="46" fill="#FCD34D" opacity="0.5" />
            {/* Twin Mountains & Built Iron Wall / Valley */}
            <path d="M0 210 L95 75 L195 210 Z" fill="#64748B" />
            <path d="M205 210 L305 75 L400 210 Z" fill="#475569" />
            {/* Strong Gate / Wall */}
            <rect x="135" y="128" width="130" height="82" fill="#92400E" rx="4" />
            <line x1="135" y1="154" x2="265" y2="154" stroke="#F59E0B" strokeWidth="4" />
            <line x1="135" y1="180" x2="265" y2="180" stroke="#F59E0B" strokeWidth="4" />
            <rect x="0" y="205" width="400" height="35" fill="#0D7A5F" opacity="0.85" />
          </g>
        );

      case 'garden-owners':
      case 'cloud-garden':
      case 'three-tested':
        return (
          <g>
            <rect width="400" height="240" fill="#F0FDF4" className="dark:fill-[#122620]" />
            {/* Rain Cloud */}
            <g transform="translate(135, 32)">
              <circle cx="40" cy="36" r="24" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="72" cy="28" r="28" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="104" cy="38" r="22" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
              <rect x="38" y="38" width="66" height="22" fill="#FFFFFF" />
              <line x1="50" y1="72" x2="45" y2="90" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
              <line x1="72" y1="74" x2="67" y2="92" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
              <line x1="94" y1="72" x2="89" y2="90" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Lush Orchard Trees */}
            <path d="M0 192 Q120 165 250 192 T400 188 L400 240 L0 240 Z" fill="#10B981" opacity="0.85" />
            <rect x="92" y="145" width="12" height="52" fill="#78350F" rx="3" />
            <circle cx="98" cy="134" r="30" fill="#059669" />
            <circle cx="88" cy="128" r="5" fill="#F59E0B" />
            <circle cx="108" cy="140" r="5" fill="#F59E0B" />
            <rect x="292" y="140" width="14" height="58" fill="#78350F" rx="3" />
            <circle cx="299" cy="126" r="34" fill="#047857" />
            <circle cx="290" cy="120" r="5" fill="#F59E0B" />
            <circle cx="312" cy="132" r="5" fill="#F59E0B" />
          </g>
        );

      case 'pen-eraser':
        return (
          <g>
            <rect width="400" height="240" fill="#FAF6EE" className="dark:fill-[#1E2430]" />
            {/* Notebook Paper */}
            <rect x="75" y="34" width="250" height="172" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            <line x1="105" y1="78" x2="295" y2="78" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="105" y1="112" x2="295" y2="112" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="105" y1="146" x2="245" y2="146" stroke="#E2E8F0" strokeWidth="2" />
            {/* Pencil */}
            <g transform="translate(125, 92) rotate(-25)">
              <rect x="0" y="0" width="115" height="22" rx="3" fill="#F59E0B" />
              <polygon points="115,0 142,11 115,22" fill="#FDE68A" />
              <polygon points="133,7 142,11 133,15" fill="#1E293B" />
              <rect x="-14" y="0" width="14" height="22" rx="3" fill="#FDA4AF" />
            </g>
            {/* Friendly Eraser */}
            <g transform="translate(228, 125) rotate(12)">
              <rect x="0" y="0" width="54" height="34" rx="6" fill="#0D7A5F" />
              <rect x="0" y="0" width="22" height="34" rx="6" fill="#E2E8F0" />
            </g>
          </g>
        );

      case 'hare-tortoise':
      case 'turtle-fireplace':
        return (
          <g>
            <rect width="400" height="240" fill="#F0FDF4" className="dark:fill-[#13251F]" />
            <path d="M0 185 Q180 155 400 182 L400 240 L0 240 Z" fill="#34D399" opacity="0.45" />
            <path d="M0 202 Q200 182 400 202 L400 240 L0 240 Z" fill="#0D7A5F" opacity="0.85" />
            {/* Finish Apple Tree */}
            <rect x="322" y="102" width="14" height="90" fill="#78350F" />
            <circle cx="329" cy="92" r="38" fill="#059669" />
            <circle cx="315" cy="84" r="5" fill="#EF4444" />
            <circle cx="340" cy="96" r="5" fill="#EF4444" />
            {/* Tortoise */}
            <g transform="translate(155, 146)">
              <path d="M12 36 A36 32 0 0 1 84 36 Z" fill="#047857" stroke="#064E3B" strokeWidth="3" />
              <circle cx="94" cy="28" r="11" fill="#A7F3D0" stroke="#065F46" strokeWidth="2.5" />
              <circle cx="98" cy="25" r="2" fill="#0F172A" />
              <rect x="22" y="34" width="10" height="12" rx="4" fill="#6EE7B7" />
              <rect x="62" y="34" width="10" height="12" rx="4" fill="#6EE7B7" />
            </g>
            {/* Friendly Sun */}
            <circle cx="72" cy="56" r="24" fill="#FBBF24" opacity="0.85" />
          </g>
        );

      case 'bee-garden':
        return (
          <g>
            <rect width="400" height="240" fill="#FEFCE8" className="dark:fill-[#1D2016]" />
            {/* Flower Garden */}
            <path d="M0 190 Q200 165 400 190 L400 240 L0 240 Z" fill="#10B981" opacity="0.7" />
            <g transform="translate(95, 120)">
              <line x1="25" y1="25" x2="25" y2="85" stroke="#047857" strokeWidth="4" />
              <circle cx="25" cy="12" r="10" fill="#F43F5E" />
              <circle cx="12" cy="24" r="10" fill="#F43F5E" />
              <circle cx="38" cy="24" r="10" fill="#F43F5E" />
              <circle cx="25" cy="36" r="10" fill="#F43F5E" />
              <circle cx="25" cy="24" r="8" fill="#FBBF24" />
            </g>
            <g transform="translate(265, 130)">
              <line x1="22" y1="22" x2="22" y2="75" stroke="#047857" strokeWidth="4" />
              <circle cx="22" cy="10" r="9" fill="#0EA5E9" />
              <circle cx="10" cy="22" r="9" fill="#0EA5E9" />
              <circle cx="34" cy="22" r="9" fill="#0EA5E9" />
              <circle cx="22" cy="34" r="9" fill="#0EA5E9" />
              <circle cx="22" cy="22" r="7" fill="#FDE047" />
            </g>
            {/* Happy Bee */}
            <g transform="translate(172, 66)">
              <ellipse cx="22" cy="10" rx="12" ry="16" fill="#E0F2FE" opacity="0.85" />
              <ellipse cx="38" cy="10" rx="12" ry="16" fill="#E0F2FE" opacity="0.85" />
              <ellipse cx="30" cy="28" rx="24" ry="16" fill="#F59E0B" />
              <rect x="20" y="14" width="6" height="28" fill="#1E293B" />
              <rect x="33" y="13" width="6" height="30" fill="#1E293B" />
              <circle cx="13" cy="24" r="2.5" fill="#1E293B" />
            </g>
          </g>
        );

      case 'ant-solomon':
        return (
          <g>
            <rect width="400" height="240" fill="#FFFBEB" className="dark:fill-[#221D15]" />
            <path d="M0 185 Q200 165 400 185 L400 240 L0 240 Z" fill="#D97706" opacity="0.35" />
            {/* Wheat Grains */}
            <g transform="translate(145, 115)">
              <ellipse cx="30" cy="45" rx="22" ry="12" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
              <ellipse cx="75" cy="48" rx="22" ry="12" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
              <ellipse cx="52" cy="26" rx="22" ry="12" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            </g>
            {/* Little Ant */}
            <g transform="translate(230, 148)">
              <circle cx="12" cy="20" r="8" fill="#451A03" />
              <circle cx="28" cy="18" r="6" fill="#451A03" />
              <circle cx="42" cy="15" r="7" fill="#451A03" />
              <line x1="46" y1="10" x2="54" y2="3" stroke="#451A03" strokeWidth="2" />
              <line x1="43" y1="8" x2="48" y2="2" stroke="#451A03" strokeWidth="2" />
            </g>
          </g>
        );

      case 'elephant-nelson':
        return (
          <g>
            <rect width="400" height="240" fill="#F1F5F9" className="dark:fill-[#1A2234]" />
            <path d="M0 192 L400 192 L400 240 L0 240 Z" fill="#10B981" opacity="0.4" />
            {/* Elephant Silhouette */}
            <g transform="translate(125, 70)">
              <rect x="26" y="74" width="18" height="48" rx="6" fill="#64748B" />
              <rect x="78" y="74" width="18" height="48" rx="6" fill="#64748B" />
              <ellipse cx="62" cy="54" rx="48" ry="38" fill="#94A3B8" />
              <circle cx="105" cy="45" r="24" fill="#94A3B8" />
              <ellipse cx="86" cy="48" rx="14" ry="20" fill="#64748B" />
              <path d="M126 48 Q145 55 135 82 Q130 92 122 86" fill="none" stroke="#94A3B8" strokeWidth="11" strokeLinecap="round" />
              <circle cx="114" cy="39" r="3" fill="#0F172A" />
            </g>
          </g>
        );

      case 'frogs-tower':
        return (
          <g>
            <rect width="400" height="240" fill="#ECFDF5" className="dark:fill-[#10241E]" />
            {/* Tall Stone Tower */}
            <rect x="165" y="42" width="70" height="198" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
            <rect x="155" y="34" width="90" height="16" rx="4" fill="#0D7A5F" />
            <rect x="188" y="78" width="24" height="32" rx="12" fill="#475569" />
            <rect x="188" y="138" width="24" height="32" rx="12" fill="#475569" />
            {/* Champion Frog at the Top */}
            <g transform="translate(182, 12)">
              <ellipse cx="18" cy="14" rx="14" ry="10" fill="#10B981" />
              <circle cx="11" cy="6" r="4" fill="#10B981" />
              <circle cx="25" cy="6" r="4" fill="#10B981" />
              <circle cx="11" cy="6" r="1.5" fill="#0F172A" />
              <circle cx="25" cy="6" r="1.5" fill="#0F172A" />
            </g>
          </g>
        );

      case 'child-nails':
      case 'carpenter-house':
        return (
          <g>
            <rect width="400" height="240" fill="#FEF7EC" className="dark:fill-[#1F1C18]" />
            {/* Cozy House / Wooden Garden Fence */}
            <path d="M0 195 L400 195 L400 240 L0 240 Z" fill="#10B981" opacity="0.6" />
            <g transform="translate(115, 62)">
              <polygon points="85,0 0,62 170,62" fill="#D97706" />
              <rect x="20" y="62" width="130" height="82" fill="#FFFFFF" stroke="#92400E" strokeWidth="3" />
              <rect x="68" y="92" width="34" height="52" fill="#92400E" rx="3" />
              <rect x="34" y="78" width="24" height="24" fill="#BAE6FD" stroke="#92400E" strokeWidth="2" />
              <rect x="112" y="78" width="24" height="24" fill="#BAE6FD" stroke="#92400E" strokeWidth="2" />
            </g>
          </g>
        );

      case 'two-jars':
        return (
          <g>
            <rect width="400" height="240" fill="#F0F9FF" className="dark:fill-[#12202E]" />
            <path d="M0 185 Q200 170 400 185 L400 240 L0 240 Z" fill="#34D399" opacity="0.55" />
            {/* Whole Jar */}
            <g transform="translate(105, 82)">
              <ellipse cx="32" cy="64" rx="28" ry="38" fill="#D97706" />
              <rect x="20" y="14" width="24" height="16" rx="4" fill="#B45309" />
            </g>
            {/* Cracked Jar watering flowers */}
            <g transform="translate(225, 82)">
              <ellipse cx="32" cy="64" rx="28" ry="38" fill="#0D7A5F" />
              <rect x="20" y="14" width="24" height="16" rx="4" fill="#065F46" />
              <path d="M44 45 L36 58 L46 70" fill="none" stroke="#FEF3C7" strokeWidth="2.5" />
              {/* Flowers growing beneath */}
              <circle cx="74" cy="96" r="6" fill="#F43F5E" />
              <circle cx="88" cy="102" r="5" fill="#FBBF24" />
            </g>
          </g>
        );

      case 'school-poem':
        return (
          <g>
            <rect width="400" height="240" fill="#EEF7F4" className="dark:fill-[#122220]" />
            <circle cx="200" cy="68" r="32" fill="#FBBF24" opacity="0.35" />
            {/* School Lantern & Archway */}
            <g transform="translate(105, 58)">
              <rect x="0" y="45" width="190" height="115" rx="6" fill="#FFFFFF" stroke="#0D7A5F" strokeWidth="3" />
              <path d="M65 160 L65 105 Q95 75 125 105 L125 160 Z" fill="#0D7A5F" />
              <polygon points="95,0 35,45 155,45" fill="#D97706" />
              <circle cx="95" cy="26" r="8" fill="#FEF3C7" />
            </g>
          </g>
        );

      default:
        return (
          <g>
            <rect width="400" height="240" fill="#F5F3EC" className="dark:fill-[#182230]" />
            <circle cx="310" cy="58" r="28" fill="#FBBF24" opacity="0.6" />
            <path d="M0 185 Q120 155 240 182 T400 172 L400 240 L0 240 Z" fill="#A7F3D0" opacity="0.6" />
            <path d="M0 205 Q150 180 300 205 T400 198 L400 240 L0 240 Z" fill="#0D7A5F" opacity="0.85" />
            {/* Glowing Story Lantern */}
            <g transform="translate(168, 65)">
              <rect x="14" y="24" width="36" height="58" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
              <polygon points="32,6 10,24 54,24" fill="#0D7A5F" />
              <circle cx="32" cy="52" r="10" fill="#F59E0B" />
            </g>
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 400 240"
      className={`w-full h-full object-cover ${className}`}
      aria-hidden="true"
    >
      {renderScene()}
    </svg>
  );
};
