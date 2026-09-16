import React, { useState, useEffect } from 'react';
import { Moon, Sun, FileText, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      const scrollPos = window.scrollY + 120;

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

    window.addEventListener('scroll', handleScroll);
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
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D0D11]/85 backdrop-blur-xl border border-neutral-800/80 shadow-2xl shadow-black/50'
            : 'bg-[#0D0D11]/70 backdrop-blur-lg border border-white/10 shadow-lg shadow-black/20'
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, '#home')}
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-white hover:text-purple-400 transition"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
            PM
          </div>
          <span className="hidden sm:inline font-mono font-bold tracking-tighter">
            pedro<span className="text-purple-400">.medina</span>
          </span>
        </a>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'text-white font-semibold bg-white/10 shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400" />
                )}
              </a>
            );
          })}
        </div>

        {/* Actions: Theme Toggle & Resume CTA */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>

          {/* Resume CTA */}
          <a
            href="mailto:pedromedina1508@icloud.com?subject=Solicitud%20de%20CV%20-%20Pedro%20Medina"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-950 bg-white hover:bg-neutral-200 transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-800" />
            <span>CV</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-600 hidden sm:inline" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Modal Capsule */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto md:hidden absolute top-20 left-4 right-4 bg-[#0D0D11]/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
