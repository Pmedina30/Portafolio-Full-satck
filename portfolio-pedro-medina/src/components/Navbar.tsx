import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Command, ArrowUpRight, Globe } from 'lucide-react';
import { Language } from '../types/portfolio';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  lang,
  onToggleLang,
  onOpenCommandPalette
}) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sdqTime, setSdqTime] = useState('');

  const navLinks = [
    { id: 'home', label: lang === 'en' ? 'Index' : 'Inicio', href: '#home' },
    { id: 'projects', label: lang === 'en' ? 'Selected Works' : 'Proyectos', href: '#projects' },
    { id: 'registry', label: lang === 'en' ? '12-App Archive' : 'Archivo 12-Apps', href: '#registry' },
    { id: 'skills', label: lang === 'en' ? 'Architecture' : 'Arquitectura', href: '#skills' },
    { id: 'experience', label: lang === 'en' ? 'Trajectory' : 'Trayectoria', href: '#experience' },
    { id: 'contact', label: lang === 'en' ? 'Contact' : 'Contacto', href: '#contact' }
  ];

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Santo_Domingo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        setSdqTime(formatter.format(now));
      } catch {
        setSdqTime('AST UTC-4');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const sections = ['home', 'projects', 'registry', 'skills', 'experience', 'contact'];
      const scrollPos = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Architectural Telemetry Strip */}
      <div className="hidden lg:flex items-center justify-between px-8 py-1.5 text-[11px] font-mono tracking-wider uppercase border-b border-[#DFDDD4] dark:border-[#1E1E1B] bg-[#F6F5F0]/90 dark:bg-[#0A0A09]/90 backdrop-blur-md text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#111110] dark:text-[#F4F3EF] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#FF4F18] animate-pulse" />
            {PERSONAL_INFO.monogram}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span>{PERSONAL_INFO.coordinates}</span>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span>SANTO DOMINGO, DO ({sdqTime} AST)</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {lang === 'en' ? 'ALL 12 WORKSPACE SYSTEMS VERIFIED' : '12 SISTEMAS EN PRODUCCIÓN VERIFICADOS'}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hover:text-[#FF4F18] transition-colors flex items-center gap-1"
          >
            <span>{lang === 'en' ? 'QUICK COMMAND' : 'COMANDO RÁPIDO'}</span>
            <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-neutral-200/80 dark:bg-neutral-800 text-[#111110] dark:text-neutral-200">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`mx-auto transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F6F5F0]/92 dark:bg-[#0A0A09]/92 backdrop-blur-xl border-b border-[#DFDDD4] dark:border-[#242421] shadow-sm'
            : 'bg-[#F6F5F0]/75 dark:bg-[#0A0A09]/75 backdrop-blur-md border-b border-[#DFDDD4]/60 dark:border-[#242421]/60'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Signature */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#111110] dark:bg-[#F4F3EF] text-[#F6F5F0] dark:text-[#0A0A09] flex items-center justify-center font-display font-bold text-sm tracking-tighter relative overflow-hidden">
              <span>PM</span>
              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF4F18]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm sm:text-base tracking-tight text-[#111110] dark:text-[#F4F3EF] leading-none group-hover:text-[#FF4F18] transition-colors">
                Pedro Medina
              </span>
              <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 tracking-wider uppercase mt-0.5">
                {lang === 'en' ? 'Full-Stack & Data Architect' : 'Ing. Full-Stack & Datos'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#EEECE5]/80 dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#111110] text-[#F6F5F0] dark:bg-[#F4F3EF] dark:text-[#0A0A09] font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-[#111110] dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right Controls: Command Palette, Language, Theme, Direct Contact */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              title={lang === 'en' ? 'Open Command Palette (Ctrl+K)' : 'Abrir Paleta de Comandos (Ctrl+K)'}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-[#EEECE5] dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] text-neutral-700 dark:text-neutral-300 hover:border-[#FF4F18] dark:hover:border-[#FF4F18] transition-colors"
            >
              <Command className="w-3.5 h-3.5 text-[#FF4F18]" />
              <span className="text-[11px]">⌘K</span>
            </button>

            {/* Language Switcher (EN / ES) */}
            <button
              type="button"
              onClick={onToggleLang}
              title={lang === 'en' ? 'Switch to Español' : 'Cambiar a Inglés'}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#EEECE5] dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] text-[#111110] dark:text-[#F4F3EF] hover:border-[#FF4F18] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF4F18]" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label="Toggle theme"
              title={darkMode ? (lang === 'en' ? 'Switch to Light Paper Mode' : 'Modo Papel Claro') : (lang === 'en' ? 'Switch to Obsidian Dark Mode' : 'Modo Obsidiana Oscuro')}
              className="p-2 rounded-lg bg-[#EEECE5] dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] text-neutral-700 dark:text-neutral-300 hover:border-[#FF4F18] hover:text-[#FF4F18] transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-800" />}
            </button>

            {/* Primary Contact CTA */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-display font-bold bg-[#FF4F18] hover:bg-[#E03E0B] text-white transition-all shadow-xs"
            >
              <span>{lang === 'en' ? 'Hire / Connect' : 'Contactar'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#EEECE5] dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] text-[#111110] dark:text-[#F4F3EF]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#F6F5F0] dark:bg-[#111110] border-b border-[#DFDDD4] dark:border-[#242421] px-4 pt-3 pb-6 shadow-2xl">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-4 py-2.5 rounded-lg text-sm font-display font-semibold text-[#111110] dark:text-[#F4F3EF] hover:bg-[#EEECE5] dark:hover:bg-[#1C1C19] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs text-[#FF4F18]">→</span>
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="mt-2 w-full py-2.5 px-4 rounded-lg bg-[#EEECE5] dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] text-xs font-mono flex items-center justify-between text-[#111110] dark:text-[#F4F3EF]"
            >
              <span>{lang === 'en' ? 'Search Projects & Commands' : 'Buscar Proyectos y Comandos'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">⌘K</kbd>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
