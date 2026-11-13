import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Download,
  Eraser,
  Palette,
  RotateCcw,
  Share2,
  Sparkles,
  Undo2,
} from 'lucide-react';
import { CharacterId } from '../types/story';
import { CARTOON_CHARACTERS } from '../data/characters';

interface CharacterColoringStudioProps {
  initialCharacterId: CharacterId;
  storyTitle: string;
}

type ColorMap = Record<string, string>;
type AllColorings = Record<CharacterId, ColorMap>;

const COLORING_STORAGE_KEY = 'matar_aljalasat_colorings_v1';

const COLOR_PALETTE: { hex: string; name: string; bgClass: string; isLight?: boolean }[] = [
  { hex: '#10B981', name: 'أخضر زمردي', bgClass: 'bg-[#10B981]' },
  { hex: '#F59E0B', name: 'أصفر شمس', bgClass: 'bg-[#F59E0B]', isLight: true },
  { hex: '#0EA5E9', name: 'أزرق سماوي', bgClass: 'bg-[#0EA5E9]' },
  { hex: '#F43F5E', name: 'وردي زهور', bgClass: 'bg-[#F43F5E]' },
  { hex: '#FB923C', name: 'برتقالي دافئ', bgClass: 'bg-[#FB923C]' },
  { hex: '#8B5CF6', name: 'بنفسجي خزامى', bgClass: 'bg-[#8B5CF6]' },
  { hex: '#EF4444', name: 'أحمر توتي', bgClass: 'bg-[#EF4444]' },
  { hex: '#5C280B', name: 'بني كستنائي', bgClass: 'bg-[#5C280B]' },
  { hex: '#1E293B', name: 'كحلي غامق', bgClass: 'bg-[#1E293B]' },
  { hex: '#FDE0C8', name: 'بشرة دافئة', bgClass: 'bg-[#FDE0C8]', isLight: true },
  { hex: '#ECFDF5', name: 'نعناعي فاتح', bgClass: 'bg-[#ECFDF5]', isLight: true },
  { hex: '#FFFBEB', name: 'كريمي هادئ', bgClass: 'bg-[#FFFBEB]', isLight: true },
];

const DEFAULT_SUGGESTED_COLORS: AllColorings = {
  talia: {
    background: '#ECFDF5',
    outfit: '#0D7A5F',
    collar: '#FDE68A',
    hair: '#5C280B',
    headband: '#10B981',
    pin: '#F59E0B',
    skin: '#FDE0C8',
    propFrame: '#0D7A5F',
    propGlass: '#BAE6FD',
    propHandle: '#78350F',
  },
  leen: {
    background: '#FFFBEB',
    outfit: '#D97706',
    collar: '#FFFFFF',
    hair: '#3B2314',
    ribbons: '#F43F5E',
    skin: '#FDE4CE',
    flowerPetals: '#F43F5E',
    flowerCenter: '#FBBF24',
  },
  muadh: {
    background: '#F0F9FF',
    outfit: '#0369A1',
    shirt: '#FFFFFF',
    cap: '#0284C7',
    capBand: '#F59E0B',
    hair: '#1E293B',
    skin: '#FAD7BA',
    glasses: '#E0F2FE',
    book: '#F59E0B',
  },
};

const EMPTY_COLORINGS: AllColorings = {
  talia: {},
  leen: {},
  muadh: {},
};

function loadSavedColorings(): AllColorings {
  try {
    const raw = localStorage.getItem(COLORING_STORAGE_KEY);
    if (!raw) return EMPTY_COLORINGS;
    const parsed = JSON.parse(raw) as Partial<AllColorings>;
    return {
      talia: parsed.talia && typeof parsed.talia === 'object' ? parsed.talia : {},
      leen: parsed.leen && typeof parsed.leen === 'object' ? parsed.leen : {},
      muadh: parsed.muadh && typeof parsed.muadh === 'object' ? parsed.muadh : {},
    };
  } catch {
    return EMPTY_COLORINGS;
  }
}

export const CharacterColoringStudio: React.FC<CharacterColoringStudioProps> = ({
  initialCharacterId,
  storyTitle,
}) => {
  const [activeCharacter, setActiveCharacter] = useState<CharacterId>(initialCharacterId);
  const [selectedColor, setSelectedColor] = useState<string>('#10B981');
  const [isEraser, setIsEraser] = useState(false);
  const [colorings, setColorings] = useState<AllColorings>(loadSavedColorings);
  const [history, setHistory] = useState<Record<CharacterId, ColorMap[]>>({
    talia: [],
    leen: [],
    muadh: [],
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setActiveCharacter(initialCharacterId);
  }, [initialCharacterId]);

  useEffect(() => {
    try {
      localStorage.setItem(COLORING_STORAGE_KEY, JSON.stringify(colorings));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [colorings]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = window.setTimeout(() => setFeedbackMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [feedbackMessage]);

  const currentColors = colorings[activeCharacter];
  const getRegionColor = (region: string) => currentColors[region] ?? '#FFFFFF';

  const handlePaintRegion = (region: string) => {
    const nextColor = isEraser ? '#FFFFFF' : selectedColor;
    setHistory((prev) => ({
      ...prev,
      [activeCharacter]: [...prev[activeCharacter].slice(-14), { ...currentColors }],
    }));
    setColorings((prev) => ({
      ...prev,
      [activeCharacter]: {
        ...prev[activeCharacter],
        [region]: nextColor,
      },
    }));
  };

  const handleUndo = () => {
    const charHistory = history[activeCharacter];
    if (charHistory.length === 0) return;
    const previous = charHistory[charHistory.length - 1];
    setHistory((prev) => ({
      ...prev,
      [activeCharacter]: charHistory.slice(0, -1),
    }));
    setColorings((prev) => ({
      ...prev,
      [activeCharacter]: previous,
    }));
  };

  const handleClearCharacter = () => {
    setHistory((prev) => ({
      ...prev,
      [activeCharacter]: [...prev[activeCharacter].slice(-14), { ...currentColors }],
    }));
    setColorings((prev) => ({
      ...prev,
      [activeCharacter]: {},
    }));
    setFeedbackMessage('تم مسح الألوان لتبدأ التلوين من جديد.');
  };

  const handleApplySuggested = () => {
    setHistory((prev) => ({
      ...prev,
      [activeCharacter]: [...prev[activeCharacter].slice(-14), { ...currentColors }],
    }));
    setColorings((prev) => ({
      ...prev,
      [activeCharacter]: { ...DEFAULT_SUGGESTED_COLORS[activeCharacter] },
    }));
    setFeedbackMessage(`تم تطبيق ألوان ${CARTOON_CHARACTERS[activeCharacter].name} المقترحة، ويمكنك تعديل أي جزء!`);
  };

  const renderExportPngBlob = async (): Promise<Blob | null> => {
    const svgEl = svgRef.current;
    if (!svgEl) return null;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (err) => reject(err);
        image.src = svgUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1040;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Clean warm card background
      ctx.fillStyle = '#FAF8F4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#E6E0D4';
      ctx.lineWidth = 6;
      ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

      // Draw colored character SVG
      ctx.drawImage(img, 90, 70, 720, 720);

      // Caption footer
      const charName = CARTOON_CHARACTERS[activeCharacter].name;
      ctx.fillStyle = '#1C2421';
      ctx.font = 'bold 34px Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`رسومتي: ${charName}`, canvas.width / 2, 855);

      ctx.fillStyle = '#0D7A5F';
      ctx.font = '24px Tajawal, sans-serif';
      const trimmedTitle =
        storyTitle.length > 48 ? `${storyTitle.slice(0, 48)}...` : storyTitle;
      ctx.fillText(trimmedTitle, canvas.width / 2, 910);

      ctx.fillStyle = '#64706B';
      ctx.font = '20px Tajawal, sans-serif';
      ctx.fillText('مَعطَر الجَلَسات | قصص تعليمية للأطفال', canvas.width / 2, 968);

      return await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((blob) => resolve(blob), 'image/png')
      );
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleSaveDrawing = async () => {
    setIsExporting(true);
    try {
      const pngBlob = await renderExportPngBlob();
      const filename = `drawing-${activeCharacter}.png`;
      if (pngBlob) {
        triggerDownload(pngBlob, filename);
        setFeedbackMessage('تم حفظ رسمتك كصورة بنجاح!');
      } else if (svgRef.current) {
        const svgStr = new XMLSerializer().serializeToString(svgRef.current);
        triggerDownload(
          new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }),
          `drawing-${activeCharacter}.svg`
        );
        setFeedbackMessage('تم حفظ رسمتك بنجاح!');
      }
    } catch {
      setFeedbackMessage('تعذّر تصدير الصورة في هذا المتصفح، حاول مرة أخرى.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareDrawing = async () => {
    setIsExporting(true);
    const charName = CARTOON_CHARACTERS[activeCharacter].name;
    const shareText = `لوّنت شخصية ${charName} بعد قراءة قصة «${storyTitle}» في مكتبة مَعطَر الجَلَسات!`;

    try {
      const pngBlob = await renderExportPngBlob();
      if (pngBlob) {
        const file = new File([pngBlob], `drawing-${activeCharacter}.png`, {
          type: 'image/png',
        });

        if (
          typeof navigator !== 'undefined' &&
          typeof navigator.share === 'function' &&
          (!navigator.canShare || navigator.canShare({ files: [file] }))
        ) {
          await navigator.share({
            title: `رسمة ${charName}`,
            text: shareText,
            files: [file],
          });
          setFeedbackMessage('تمت مشاركة الرسمة بنجاح!');
          return;
        }

        if (
          typeof navigator !== 'undefined' &&
          navigator.clipboard &&
          typeof ClipboardItem !== 'undefined'
        ) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob }),
            ]);
            setFeedbackMessage('تم نسخ رسمتك إلى الحافظة! يمكنك لصقها ومشاركتها مع أسرتك.');
            return;
          } catch {
            // Fall through to text + download fallback
          }
        }

        triggerDownload(pngBlob, `drawing-${activeCharacter}.png`);
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareText).catch(() => {});
        }
        setFeedbackMessage('تم تنزيل الرسمة ونسخ رسالة المشاركة لتسعد بها أسرتك ومعلمك!');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setFeedbackMessage('يمكنك حفظ الرسمة ومشاركتها مباشرة من جهازك.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderColoringSvg = () => {
    const stroke = '#1E293B';

    if (activeCharacter === 'talia') {
      return (
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 240 240"
          className="w-full max-w-[300px] aspect-square mx-auto select-none"
          role="img"
          aria-label="لوحة تلوين شخصية تاليا"
        >
          {/* Background Circle */}
          <circle
            cx="120"
            cy="120"
            r="112"
            fill={getRegionColor('background')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('background')}
            className="cursor-pointer hover:opacity-90"
          />
          {/* Decorative Stars in Background */}
          <path d="M36 62 L39 68 L45 69 L40 73 L41 79 L36 76 L31 79 L32 73 L27 69 L33 68 Z" fill="none" stroke={stroke} strokeWidth="2" className="pointer-events-none" />
          <path d="M202 58 L205 64 L211 65 L206 69 L207 75 L202 72 L197 75 L198 69 L193 65 L199 64 Z" fill="none" stroke={stroke} strokeWidth="2" className="pointer-events-none" />

          {/* Adventure Vest / Outfit */}
          <path
            d="M46 218 C54 166, 186 166, 194 218 Q120 232 46 218 Z"
            fill={getRegionColor('outfit')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('outfit')}
            className="cursor-pointer hover:opacity-90"
          />
          {/* Collar */}
          <path
            d="M88 176 L120 208 L152 176 Q120 186 88 176 Z"
            fill={getRegionColor('collar')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('collar')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Hair Back & Puffs */}
          <circle
            cx="68"
            cy="108"
            r="26"
            fill={getRegionColor('hair')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('hair')}
            className="cursor-pointer hover:opacity-90"
          />
          <circle
            cx="172"
            cy="108"
            r="26"
            fill={getRegionColor('hair')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('hair')}
            className="cursor-pointer hover:opacity-90"
          />
          <path
            d="M58 104 C58 46, 182 46, 182 104 L182 152 C164 142, 76 142, 58 152 Z"
            fill={getRegionColor('hair')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('hair')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Neck & Face */}
          <rect
            x="104"
            y="148"
            width="32"
            height="30"
            rx="10"
            fill={getRegionColor('skin')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('skin')}
            className="cursor-pointer hover:opacity-90"
          />
          <circle
            cx="120"
            cy="112"
            r="46"
            fill={getRegionColor('skin')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('skin')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Front Hair Bangs */}
          <path
            d="M74 102 C82 62, 158 62, 166 102 C146 84, 94 84, 74 102 Z"
            fill={getRegionColor('hair')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('hair')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Headband */}
          <path
            d="M73 88 Q120 56 167 88 Q165 76 160 72 Q120 46 80 72 Q75 76 73 88 Z"
            fill={getRegionColor('headband')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('headband')}
            className="cursor-pointer hover:opacity-90"
          />
          {/* Headband Pin Star */}
          <circle
            cx="158"
            cy="78"
            r="10"
            fill={getRegionColor('pin')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('pin')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Face Details (non-interactive outlines) */}
          <circle cx="101" cy="114" r="6" fill="#1E293B" className="pointer-events-none" />
          <circle cx="139" cy="114" r="6" fill="#1E293B" className="pointer-events-none" />
          <circle cx="103" cy="112" r="2" fill="#FFFFFF" className="pointer-events-none" />
          <circle cx="141" cy="112" r="2" fill="#FFFFFF" className="pointer-events-none" />
          <path d="M107 132 Q120 144 133 132" fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" className="pointer-events-none" />

          {/* Magnifying Glass */}
          <rect
            x="189"
            y="186"
            width="12"
            height="32"
            rx="5"
            transform="rotate(-40 195 202)"
            fill={getRegionColor('propHandle')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('propHandle')}
            className="cursor-pointer hover:opacity-90"
          />
          <circle
            cx="176"
            cy="176"
            r="22"
            fill={getRegionColor('propFrame')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('propFrame')}
            className="cursor-pointer hover:opacity-90"
          />
          <circle
            cx="176"
            cy="176"
            r="14"
            fill={getRegionColor('propGlass')}
            stroke={stroke}
            strokeWidth="2.5"
            onClick={() => handlePaintRegion('propGlass')}
            className="cursor-pointer hover:opacity-90"
          />
        </svg>
      );
    }

    if (activeCharacter === 'leen') {
      return (
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 240 240"
          className="w-full max-w-[300px] aspect-square mx-auto select-none"
          role="img"
          aria-label="لوحة تلوين شخصية لين"
        >
          {/* Background Circle */}
          <circle
            cx="120"
            cy="120"
            r="112"
            fill={getRegionColor('background')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('background')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Dress / Outfit */}
          <path
            d="M46 218 C54 166, 186 166, 194 218 Q120 232 46 218 Z"
            fill={getRegionColor('outfit')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('outfit')}
            className="cursor-pointer hover:opacity-90"
          />
          {/* Collar */}
          <path
            d="M88 176 Q120 202 152 176 Q120 184 88 176 Z"
            fill={getRegionColor('collar')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('collar')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Twin Puffs */}
          <circle
            cx="62"
            cy="84"
            r="22"
            fill={getRegionColor('hair')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('hair')}
            className="cursor-pointer hover:opacity-90"
          />
          <circle
            cx="178"
            cy="84"
            r="22"
            fill={getRegionColor('hair')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('hair')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Hair Ribbons */}
          <circle
            cx="72"
            cy="92"
            r="8"
            fill={getRegionColor('ribbons')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('ribbons')}
            className="cursor-pointer hover:opacity-90"
          />
          <circle
            cx="168"
            cy="92"
            r="8"
            fill={getRegionColor('ribbons')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('ribbons')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Neck & Face */}
          <rect
            x="104"
            y="148"
            width="32"
            height="30"
            rx="10"
            fill={getRegionColor('skin')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('skin')}
            className="cursor-pointer hover:opacity-90"
          />
          <circle
            cx="120"
            cy="112"
            r="46"
            fill={getRegionColor('skin')}
            stroke={stroke}
            strokeWidth="3.5"
            onClick={() => handlePaintRegion('skin')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Hair Bangs */}
          <path
            d="M74 104 C78 56, 162 56, 166 104 C142 82, 120 92, 74 104 Z"
            fill={getRegionColor('hair')}
            stroke={stroke}
            strokeWidth="3"
            onClick={() => handlePaintRegion('hair')}
            className="cursor-pointer hover:opacity-90"
          />

          {/* Face Details */}
          <circle cx="101" cy="114" r="6" fill="#1E293B" className="pointer-events-none" />
          <circle cx="139" cy="114" r="6" fill="#1E293B" className="pointer-events-none" />
          <circle cx="103" cy="112" r="2" fill="#FFFFFF" className="pointer-events-none" />
          <circle cx="141" cy="112" r="2" fill="#FFFFFF" className="pointer-events-none" />
          <path d="M108 132 Q120 142 132 132" fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" className="pointer-events-none" />

          {/* Flower Prop */}
          <g transform="translate(158, 152)">
            <circle cx="20" cy="6" r="9" fill={getRegionColor('flowerPetals')} stroke={stroke} strokeWidth="2.8" onClick={() => handlePaintRegion('flowerPetals')} className="cursor-pointer hover:opacity-90" />
            <circle cx="34" cy="20" r="9" fill={getRegionColor('flowerPetals')} stroke={stroke} strokeWidth="2.8" onClick={() => handlePaintRegion('flowerPetals')} className="cursor-pointer hover:opacity-90" />
            <circle cx="20" cy="34" r="9" fill={getRegionColor('flowerPetals')} stroke={stroke} strokeWidth="2.8" onClick={() => handlePaintRegion('flowerPetals')} className="cursor-pointer hover:opacity-90" />
            <circle cx="6" cy="20" r="9" fill={getRegionColor('flowerPetals')} stroke={stroke} strokeWidth="2.8" onClick={() => handlePaintRegion('flowerPetals')} className="cursor-pointer hover:opacity-90" />
            <circle cx="20" cy="20" r="8" fill={getRegionColor('flowerCenter')} stroke={stroke} strokeWidth="2.8" onClick={() => handlePaintRegion('flowerCenter')} className="cursor-pointer hover:opacity-90" />
          </g>
        </svg>
      );
    }

    // Muadh Coloring Canvas
    return (
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
        className="w-full max-w-[300px] aspect-square mx-auto select-none"
        role="img"
        aria-label="لوحة تلوين شخصية معاذ"
      >
        {/* Background Circle */}
        <circle
          cx="120"
          cy="120"
          r="112"
          fill={getRegionColor('background')}
          stroke={stroke}
          strokeWidth="3.5"
          onClick={() => handlePaintRegion('background')}
          className="cursor-pointer hover:opacity-90"
        />

        {/* Organized Vest */}
        <path
          d="M46 218 C54 166, 186 166, 194 218 Q120 232 46 218 Z"
          fill={getRegionColor('outfit')}
          stroke={stroke}
          strokeWidth="3.5"
          onClick={() => handlePaintRegion('outfit')}
          className="cursor-pointer hover:opacity-90"
        />
        {/* Shirt Collar */}
        <path
          d="M92 175 L120 206 L148 175 Q120 184 92 175 Z"
          fill={getRegionColor('shirt')}
          stroke={stroke}
          strokeWidth="3"
          onClick={() => handlePaintRegion('shirt')}
          className="cursor-pointer hover:opacity-90"
        />

        {/* Neck & Face */}
        <rect
          x="104"
          y="148"
          width="32"
          height="30"
          rx="10"
          fill={getRegionColor('skin')}
          stroke={stroke}
          strokeWidth="3"
          onClick={() => handlePaintRegion('skin')}
          className="cursor-pointer hover:opacity-90"
        />
        <circle
          cx="120"
          cy="114"
          r="46"
          fill={getRegionColor('skin')}
          stroke={stroke}
          strokeWidth="3.5"
          onClick={() => handlePaintRegion('skin')}
          className="cursor-pointer hover:opacity-90"
        />

        {/* Hair */}
        <path
          d="M74 102 C74 62, 166 62, 166 102 C146 88, 94 88, 74 102 Z"
          fill={getRegionColor('hair')}
          stroke={stroke}
          strokeWidth="3"
          onClick={() => handlePaintRegion('hair')}
          className="cursor-pointer hover:opacity-90"
        />

        {/* Cap */}
        <path
          d="M72 88 C78 48, 162 48, 168 88 Z"
          fill={getRegionColor('cap')}
          stroke={stroke}
          strokeWidth="3.5"
          onClick={() => handlePaintRegion('cap')}
          className="cursor-pointer hover:opacity-90"
        />
        {/* Cap Band / Visor */}
        <path
          d="M66 88 Q120 77 176 90 Q176 96 172 97 Q120 86 68 95 Z"
          fill={getRegionColor('capBand')}
          stroke={stroke}
          strokeWidth="3"
          onClick={() => handlePaintRegion('capBand')}
          className="cursor-pointer hover:opacity-90"
        />

        {/* Glasses Lenses */}
        <circle
          cx="100"
          cy="116"
          r="15"
          fill={getRegionColor('glasses')}
          stroke={stroke}
          strokeWidth="3.2"
          onClick={() => handlePaintRegion('glasses')}
          className="cursor-pointer hover:opacity-90"
        />
        <circle
          cx="140"
          cy="116"
          r="15"
          fill={getRegionColor('glasses')}
          stroke={stroke}
          strokeWidth="3.2"
          onClick={() => handlePaintRegion('glasses')}
          className="cursor-pointer hover:opacity-90"
        />
        <line x1="115" y1="116" x2="125" y2="116" stroke={stroke} strokeWidth="3.2" className="pointer-events-none" />
        {/* Eyes & Smile */}
        <circle cx="100" cy="116" r="5" fill="#1E293B" className="pointer-events-none" />
        <circle cx="140" cy="116" r="5" fill="#1E293B" className="pointer-events-none" />
        <circle cx="102" cy="114" r="1.8" fill="#FFFFFF" className="pointer-events-none" />
        <circle cx="142" cy="114" r="1.8" fill="#FFFFFF" className="pointer-events-none" />
        <path d="M107 137 Q120 147 133 137" fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" className="pointer-events-none" />

        {/* Values Book Prop */}
        <rect
          x="162"
          y="162"
          width="36"
          height="44"
          rx="5"
          fill={getRegionColor('book')}
          stroke={stroke}
          strokeWidth="3.2"
          onClick={() => handlePaintRegion('book')}
          className="cursor-pointer hover:opacity-90"
        />
        <line x1="171" y1="176" x2="189" y2="176" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" className="pointer-events-none" />
        <line x1="171" y1="186" x2="189" y2="186" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" className="pointer-events-none" />
      </svg>
    );
  };

  return (
    <section
      id="character-coloring-studio"
      className="rounded-xl border border-[#E6E0D4] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-800/60 p-5 sm:p-6 space-y-5"
    >
      {/* Header + Character Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E0D4] dark:border-slate-700">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#C88A1E] dark:text-amber-400" />
            <h2 className="font-serif-arabic text-xl font-bold text-[#1C2421] dark:text-slate-100">
              مرسم تلوين أبطال الحكايات
            </h2>
          </div>
          <p className="text-xs text-[#4B5853] dark:text-slate-400">
            اختر اللون ثم اضغط على أي جزء من رسمة تاليا أو لين أو معاذ لتلوينه، ثم احفظ لوحتك أو شاركها!
          </p>
        </div>

        {/* Character Selector */}
        <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-700 p-1 rounded-lg self-start sm:self-auto">
          {(['talia', 'leen', 'muadh'] as CharacterId[]).map((charId) => {
            const isActive = activeCharacter === charId;
            return (
              <button
                key={charId}
                type="button"
                onClick={() => setActiveCharacter(charId)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0D7A5F] text-white dark:bg-emerald-600'
                    : 'text-[#4B5853] dark:text-slate-300 hover:bg-[#F3EFE6] dark:hover:bg-slate-800'
                }`}
              >
                {CARTOON_CHARACTERS[charId].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: Interactive SVG Canvas + Color Palette */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Coloring Canvas */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-[#E6E0D4] dark:border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center">
          {renderColoringSvg()}
          <p className="text-[11px] text-[#64706B] dark:text-slate-400 mt-3 text-center">
            تلوين شخصية <strong className="text-[#1C2421] dark:text-slate-200">{CARTOON_CHARACTERS[activeCharacter].name}</strong> — اضغط على الوجه أو الشعر أو الملابس أو الخلفية
          </p>
        </div>

        {/* Palette & Action Controls */}
        <div className="md:col-span-6 space-y-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1C2421] dark:text-slate-100">
                اختر لون التلوين:
              </span>
              <button
                type="button"
                onClick={() => setIsEraser((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                  isEraser
                    ? 'border-[#0D7A5F] bg-emerald-50 dark:bg-emerald-950/50 text-[#0D7A5F] dark:text-emerald-400'
                    : 'border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#4B5853] dark:text-slate-300'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>ممحاة بيضاء</span>
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2.5">
              {COLOR_PALETTE.map((swatch) => {
                const isSelected = !isEraser && selectedColor === swatch.hex;
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    title={swatch.name}
                    aria-label={swatch.name}
                    onClick={() => {
                      setSelectedColor(swatch.hex);
                      setIsEraser(false);
                    }}
                    className={`h-10 rounded-lg border transition-transform cursor-pointer flex items-center justify-center ${swatch.bgClass} ${
                      isSelected
                        ? 'scale-105 ring-2 ring-[#0D7A5F] dark:ring-emerald-400 border-white dark:border-slate-900'
                        : 'border-[#D8D0C1] dark:border-slate-600 hover:scale-105'
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 ${
                          swatch.isLight ? 'text-[#1E293B]' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editing Helpers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={history[activeCharacter].length === 0}
              onClick={handleUndo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1C2421] dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>تراجع</span>
            </button>

            <button
              type="button"
              onClick={handleApplySuggested}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#C88A1E] dark:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ألوان مقترحة</span>
            </button>

            <button
              type="button"
              onClick={handleClearCharacter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#4B5853] dark:text-slate-300 hover:text-rose-600 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مسح الكل</span>
            </button>
          </div>

          {/* Save & Share Primary Actions */}
          <div className="pt-3 border-t border-[#E6E0D4] dark:border-slate-700 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleSaveDrawing}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>حفظ الرسمة</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleShareDrawing}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg border border-[#E6E0D4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#1C2421] dark:text-slate-100 hover:bg-[#F3EFE6] dark:hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400" />
              <span>مشاركة الرسمة</span>
            </button>
          </div>

          {feedbackMessage && (
            <p className="text-xs font-medium text-[#0D7A5F] dark:text-emerald-400">
              {feedbackMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
