import React, { useState, useEffect } from 'react';
import { WORKSPACE_APPS_INDEX, PERSONAL_INFO } from '../data/portfolioData';
import { Language } from '../types/portfolio';
import {
  Search,
  X,
  Terminal,
  ExternalLink,
  Sun,
  Moon,
  Globe,
  Mail,
  Check
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  lang,
  onToggleLang,
  darkMode,
  onToggleDarkMode
}) => {
  const [query, setQuery] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredApps = WORKSPACE_APPS_INDEX.filter((app) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.domain[lang].toLowerCase().includes(q) ||
      app.launcher.toLowerCase().includes(q) ||
      app.port.includes(q)
    );
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#F6F5F0] dark:bg-[#121210] border border-[#DFDDD4] dark:border-[#282824] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="px-4 py-3.5 border-b border-[#DFDDD4] dark:border-[#242421] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#FF4F18] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Search all 12 production systems, ports, or quick actions...'
                : 'Buscar en los 12 sistemas, puertos o acciones rápidas...'
            }
            className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#111110] dark:text-[#F4F3EF] placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-[#111110] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick System Controls */}
        <div className="p-3 border-b border-[#DFDDD4] dark:border-[#242421] bg-[#EEECE5]/60 dark:bg-[#171715] flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#262623] font-mono text-xs text-[#111110] dark:text-neutral-200 hover:border-[#FF4F18]"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span>
              {darkMode
                ? lang === 'en'
                  ? 'Switch to Light Paper'
                  : 'Cambiar a Modo Claro'
                : lang === 'en'
                  ? 'Switch to Obsidian Dark'
                  : 'Cambiar a Modo Oscuro'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#262623] font-mono text-xs text-[#111110] dark:text-neutral-200 hover:border-[#FF4F18]"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF4F18]" />
            <span>
              {lang === 'en' ? 'Switch Language to Español' : 'Cambiar Idioma a English'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy(PERSONAL_INFO.email, 'email')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#262623] font-mono text-xs text-[#111110] dark:text-neutral-200 hover:border-[#FF4F18]"
          >
            {copiedItem === 'email' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Email Copied</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-[#FF4F18]" />
                <span>Copy {PERSONAL_INFO.email}</span>
              </>
            )}
          </button>
        </div>

        {/* Filtered Systems List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
            {lang === 'en'
              ? `WORKSPACE SYSTEMS (${filteredApps.length})`
              : `SISTEMAS EN REPOSITORIO (${filteredApps.length})`}
          </div>

          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-2.5 rounded-xl bg-white dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#242421] hover:border-[#FF4F18] flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-xs sm:text-sm text-[#111110] dark:text-[#F4F3EF]">
                    {app.name}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    :{app.port}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-neutral-500 block truncate">
                  {app.domain[lang]}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(app.launcher, app.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#262623] font-mono text-[11px] text-[#111110] dark:text-neutral-300 hover:border-[#FF4F18]"
                >
                  {copiedItem === app.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-3 h-3 text-[#FF4F18]" />
                      <span>{app.launcher}</span>
                    </>
                  )}
                </button>
                {app.liveUrl && (
                  <a
                    href={app.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] hover:bg-[#FF4F18]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
