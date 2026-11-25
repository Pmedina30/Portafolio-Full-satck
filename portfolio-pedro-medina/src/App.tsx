import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InfiniteMarquee } from './components/InfiniteMarquee';
import { ProjectsBentoGrid } from './components/ProjectsBentoGrid';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SkillsMatrix } from './components/SkillsMatrix';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { Language } from './types/portfolio';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pm_portfolio_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'dark';
  });

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pm_portfolio_lang');
      if (stored === 'en' || stored === 'es') return stored;
    }
    return 'en';
  });

  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pm_portfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pm_portfolio_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  return (
    <div className="min-h-screen bg-[#F6F5F0] dark:bg-[#0A0A09] text-[#111110] dark:text-[#F4F3EF] transition-colors duration-300 font-sans relative overflow-x-hidden">
      {/* Subtle Swiss Architectural Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-architectural-grid" />

      {/* Top Architectural Navigation */}
      <Navbar
        darkMode={theme === 'dark'}
        onToggleDarkMode={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col">
        <Hero
          lang={lang}
          onOpenCommandPalette={() => setIsCommandOpen(true)}
        />

        <InfiniteMarquee />

        <ProjectsBentoGrid lang={lang} />

        <SkillsMatrix lang={lang} />

        <ExperienceTimeline lang={lang} />

        <ContactSection lang={lang} />
      </main>

      {/* Editorial Footer */}
      <Footer
        lang={lang}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      {/* Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        lang={lang}
        onToggleLang={toggleLang}
        darkMode={theme === 'dark'}
        onToggleDarkMode={toggleTheme}
      />
    </div>
  );
};

export default App;
