import React from 'react';
import { Phone } from 'lucide-react';
import { COMPANY_INFO } from '../data/initialData';

export type ActiveTab = 'home' | 'vacatures' | 'beheer';

interface NavbarProps {
  activeTab: ActiveTab;
  openVacanciesCount: number;
  showProjects?: boolean;
  onNavigate: (tab: ActiveTab, sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  openVacanciesCount,
  showProjects = false,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-3 md:py-4">
        {/* Zone 1: Single text element wordmark styled directly after the Mars Infratechniek B.V. logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="font-display text-base sm:text-xl md:text-2xl font-bold tracking-tight text-neutral-950 border-y-2 border-[#EA580C] py-0.5 whitespace-nowrap shrink min-w-0 truncate focus-visible:outline-2 focus-visible:outline-[#EA580C]"
          title="Mars Infratechniek B.V."
        >
          Mars Infratechniek B.V.
        </a>

        {/* Zone 2: Concise single-line navigation links */}
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
          {showProjects && (
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
          )}
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

        {/* Zone 3: Direct Phone Call (Mobile) + Primary Contact Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={COMPANY_INFO.phoneHref}
            aria-label="Direct telefonisch bellen: 0529 - 401540"
            className="flex md:hidden items-center justify-center w-10 h-10 bg-neutral-900 border border-neutral-800 text-[#EA580C] hover:bg-[#EA580C] hover:text-white transition-colors cursor-pointer"
            title="Direct bellen: 0529 - 401540"
          >
            <Phone className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => onNavigate('home', 'contact')}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
          >
            <span className="hidden sm:inline">Contact &amp; </span>Offerte
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Bar (Touch Target Height >= 44px) */}
      <nav
        aria-label="Mobiele navigatie"
        className="flex md:hidden items-center gap-1.5 px-3 py-1 bg-neutral-50 border-t border-neutral-200 overflow-x-auto text-xs font-semibold text-neutral-700"
      >
        <button
          type="button"
          onClick={() => onNavigate('home', 'diensten')}
          className="min-h-[44px] px-3 py-2 whitespace-nowrap shrink-0 hover:text-[#EA580C] active:text-[#EA580C] flex items-center cursor-pointer"
        >
          Diensten
        </button>
        {showProjects && (
          <button
            type="button"
            onClick={() => onNavigate('home', 'projecten')}
            className="min-h-[44px] px-3 py-2 whitespace-nowrap shrink-0 hover:text-[#EA580C] active:text-[#EA580C] flex items-center cursor-pointer"
          >
            Projecten
          </button>
        )}
        <button
          type="button"
          onClick={() => onNavigate('home', 'over-ons')}
          className="min-h-[44px] px-3 py-2 whitespace-nowrap shrink-0 hover:text-[#EA580C] active:text-[#EA580C] flex items-center cursor-pointer"
        >
          Over Ons
        </button>
        <button
          type="button"
          onClick={() => onNavigate('vacatures')}
          className={`min-h-[44px] px-3 py-2 whitespace-nowrap shrink-0 flex items-center cursor-pointer ${
            activeTab === 'vacatures'
              ? 'text-[#EA580C] font-bold border-b-2 border-[#EA580C]'
              : 'hover:text-[#EA580C]'
          }`}
        >
          Vacatures ({openVacanciesCount})
        </button>
        <button
          type="button"
          onClick={() => onNavigate('beheer')}
          className={`min-h-[44px] px-3 py-2 whitespace-nowrap shrink-0 flex items-center cursor-pointer ${
            activeTab === 'beheer'
              ? 'text-[#EA580C] font-bold border-b-2 border-[#EA580C]'
              : 'hover:text-[#EA580C]'
          }`}
        >
          Login
        </button>
      </nav>
    </header>
  );
};
