import React from 'react';
import { COMPANY_INFO } from '../data/initialData';
import type { ActiveTab } from './Navbar';

interface FooterProps {
  openVacanciesCount: number;
  showProjects?: boolean;
  onNavigate: (tab: ActiveTab, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  openVacanciesCount,
  showProjects = false,
  onNavigate,
}) => {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t-2 border-[#EA580C]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-10 sm:pb-12 border-b border-neutral-800">
          {/* Col 1: Brand lockup & direct contact */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-block border-y-2 border-[#EA580C] py-1">
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                Mars Infratechniek B.V.
              </span>
            </div>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              No-nonsense partner voor grondwerk, wegenbouw, kabels &amp; leidingen en
              riolering. Vakkundige uitvoering met modern materieel en korte lijnen.
            </p>
            <div className="pt-2 space-y-1 font-mono-tabular text-sm">
              <div className="flex items-center gap-1.5 min-h-[36px]">
                <span className="text-neutral-500">Tel: </span>
                <a
                  href={COMPANY_INFO.phoneHref}
                  className="text-white font-semibold hover:text-[#EA580C] transition-colors"
                >
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-1.5 min-h-[36px]">
                <span className="text-neutral-500">E-mail: </span>
                <a
                  href={COMPANY_INFO.emailHref}
                  className="text-white font-semibold hover:text-[#EA580C] transition-colors break-all"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Diensten */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-display text-base font-bold text-white">
              Specialismen & Diensten
            </h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'diensten')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  01. Aanleg netwerken
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'diensten')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  02. Boor en perswerk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'diensten')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  03. Verhuur werkmateriaal inclusief bediening
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigatie & Beheer */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-display text-base font-bold text-white">
              Direct Naar
            </h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              {showProjects && (
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('home', 'projecten')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Projecten
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'over-ons')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Over Mars Infratechniek
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('vacatures')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Vacatures & CV Upload ({openVacanciesCount})
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contactformulier
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('beheer')}
                  className="hover:text-[#EA580C] transition-colors cursor-pointer"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Mars Infratechniek B.V. · {COMPANY_INFO.address} ·{' '}
            {COMPANY_INFO.kvk}
          </div>
          <div>{COMPANY_INFO.certification}</div>
        </div>
      </div>
    </footer>
  );
};
