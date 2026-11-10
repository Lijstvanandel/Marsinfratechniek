import React from 'react';

export type ActiveTab = 'home' | 'vacatures' | 'beheer';

interface NavbarProps {
  activeTab: ActiveTab;
  openVacanciesCount: number;
  onNavigate: (tab: ActiveTab, sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  openVacanciesCount,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark styled directly after the Mars Infratechniek B.V. logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="font-display text-xl md:text-2xl font-bold tracking-tight text-neutral-950 border-y-2 border-[#EA580C] py-0.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#EA580C]"
        >
          Mars Infratechniek B.V.
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Hoofdnavigatie"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-neutral-700"
        >
          <a
            href="#diensten"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home', 'diensten');
            }}
            className="hover:text-[#EA580C] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Diensten
          </a>
          <a
            href="#projecten"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home', 'projecten');
            }}
            className="hover:text-[#EA580C] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Projecten
          </a>
          <a
            href="#over-ons"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home', 'over-ons');
            }}
            className="hover:text-[#EA580C] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Over Ons
          </a>
          <a
            href="#vacatures"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('vacatures');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'vacatures'
                ? 'text-[#EA580C] underline underline-offset-8 decoration-2'
                : 'hover:text-[#EA580C]'
            }`}
          >
            Vacatures ({openVacanciesCount})
          </a>
          <a
            href="#beheer"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('beheer');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'beheer'
                ? 'text-[#EA580C] underline underline-offset-8 decoration-2'
                : 'hover:text-[#EA580C]'
            }`}
          >
            Login
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('home', 'contact')}
            className="px-5 py-2.5 text-xs md:text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
          >
            Contact & Offerte
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Bar */}
      <nav
        aria-label="Mobiele navigatie"
        className="flex md:hidden items-center justify-between gap-2 px-4 py-2.5 bg-neutral-50 border-t border-neutral-200 overflow-x-auto text-xs font-semibold text-neutral-700"
      >
        <button
          type="button"
          onClick={() => onNavigate('home', 'diensten')}
          className="px-2.5 py-1.5 whitespace-nowrap shrink-0 hover:text-[#EA580C]"
        >
          Diensten
        </button>
        <button
          type="button"
          onClick={() => onNavigate('home', 'projecten')}
          className="px-2.5 py-1.5 whitespace-nowrap shrink-0 hover:text-[#EA580C]"
        >
          Projecten
        </button>
        <button
          type="button"
          onClick={() => onNavigate('home', 'over-ons')}
          className="px-2.5 py-1.5 whitespace-nowrap shrink-0 hover:text-[#EA580C]"
        >
          Over Ons
        </button>
        <button
          type="button"
          onClick={() => onNavigate('vacatures')}
          className={`px-2.5 py-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'vacatures' ? 'text-[#EA580C] font-bold' : ''
          }`}
        >
          Vacatures ({openVacanciesCount})
        </button>
        <button
          type="button"
          onClick={() => onNavigate('beheer')}
          className={`px-2.5 py-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'beheer' ? 'text-[#EA580C] font-bold' : ''
          }`}
        >
          Login
        </button>
      </nav>
    </header>
  );
};
