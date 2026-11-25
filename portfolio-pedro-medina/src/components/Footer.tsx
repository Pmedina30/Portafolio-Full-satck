import React from 'react';
import { ArrowUp, Command } from 'lucide-react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import { Language } from '../types/portfolio';

interface FooterProps {
  lang: Language;
  onOpenCommandPalette: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenCommandPalette }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#DFDDD4] dark:border-[#242421] bg-[#EEECE5]/60 dark:bg-[#0D0D0B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#DFDDD4] dark:border-[#242421]">
          {/* Col 1: Brand & Statement (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#111110] dark:bg-[#F4F3EF] text-white dark:text-[#0A0A09] flex items-center justify-center font-display font-bold text-xs">
                PM
              </div>
              <span className="font-display font-bold text-base text-[#111110] dark:text-[#F4F3EF]">
                Pedro Medina
              </span>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {PERSONAL_INFO.monogram}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
              {PERSONAL_INFO.heroSubtitle[lang]}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#262623] font-mono text-xs text-[#111110] dark:text-neutral-300 hover:border-[#FF4F18]"
              >
                <Command className="w-3.5 h-3.5 text-[#FF4F18]" />
                <span>
                  {lang === 'en' ? 'Open Command Palette (⌘K)' : 'Abrir Paleta de Comandos (⌘K)'}
                </span>
              </button>
            </div>
          </div>

          {/* Col 2: Directory Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-bold">
              {lang === 'en' ? 'Navigation' : 'Navegación'}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <li>
                <a href="#home" className="hover:text-[#FF4F18] transition-colors">
                  00 // {lang === 'en' ? 'Overview' : 'Inicio'}
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#FF4F18] transition-colors">
                  01 // {lang === 'en' ? 'Selected Works (06)' : 'Proyectos Destacados (06)'}
                </a>
              </li>
              <li>
                <a href="#registry" className="hover:text-[#FF4F18] transition-colors">
                  02 // {lang === 'en' ? '12-App Archive' : 'Archivo de 12 Sistemas'}
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-[#FF4F18] transition-colors">
                  03 // {lang === 'en' ? 'Capabilities' : 'Arquitectura'}
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[#FF4F18] transition-colors">
                  04 // {lang === 'en' ? 'Trajectory' : 'Trayectoria'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: External Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-bold">
              {lang === 'en' ? 'External Nodes' : 'Enlaces Externos'}
            </h4>
            <ul className="space-y-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF4F18] transition-colors flex items-center justify-between"
                  >
                    <span>{s.name}</span>
                    <span className="text-neutral-400">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} {PERSONAL_INFO.name} — {PERSONAL_INFO.city}
          </div>

          <div className="flex items-center gap-4">
            <span>{PERSONAL_INFO.coordinates}</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#262623] text-[#111110] dark:text-[#F4F3EF] hover:border-[#FF4F18] transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
