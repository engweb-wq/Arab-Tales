import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppView } from '../types/story';

interface TopBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onStartFeatured: () => void;
  hasLastRead: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onNavigate,
  onStartFeatured,
  hasLastRead,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppView; label: string }[] = [
    { id: 'library', label: 'مكتبة القصص' },
    { id: 'values', label: 'القيم والتقدم' },
    { id: 'profile', label: 'ملفي والأوسمة' },
    { id: 'guide', label: 'دليل المربي' },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 dark:bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#E6E0D4] dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('library')}
          className="font-serif-arabic text-2xl font-bold tracking-tight text-[#1C2421] dark:text-slate-100 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D7A5F]"
        >
          مَعطَر الجَلَسات
        </button>

        {/* Zone 2: Clean single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="التنقل الرئيسي">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D7A5F] ${
                  isActive
                    ? 'text-[#0D7A5F] dark:text-emerald-400 border-b-2 border-[#0D7A5F] dark:border-emerald-400'
                    : 'text-[#4B5853] dark:text-slate-300 hover:text-[#1C2421] dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onStartFeatured}
            className={`text-sm font-medium whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D7A5F] ${
              currentView === 'reader'
                ? 'text-[#0D7A5F] dark:text-emerald-400 border-b-2 border-[#0D7A5F] dark:border-emerald-400'
                : 'text-[#4B5853] dark:text-slate-300 hover:text-[#1C2421] dark:hover:text-white'
            }`}
          >
            قاعة القراءة
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartFeatured}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#0D7A5F] hover:bg-[#09604B] dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A5F]"
          >
            {hasLastRead ? 'متابعة القراءة' : 'ابدأ القراءة'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2.5 text-[#1C2421] dark:text-slate-200 rounded-lg hover:bg-[#EFECE4] dark:hover:bg-slate-800 cursor-pointer"
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E0D4] dark:border-slate-800 bg-[#FAF8F4] dark:bg-[#0F172A] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-right px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                currentView === item.id
                  ? 'bg-[#0D7A5F]/10 text-[#0D7A5F] dark:text-emerald-400'
                  : 'text-[#4B5853] dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              onStartFeatured();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-center mt-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#0D7A5F] cursor-pointer"
          >
            {hasLastRead ? 'متابعة القراءة' : 'ابدأ القراءة الآن'}
          </button>
        </div>
      )}
    </header>
  );
};
