import React from 'react';
import { ArrowUp, Terminal, Sparkles } from 'lucide-react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Proyectos', href: '#projects' },
    { name: 'Trayectoria', href: '#experience' },
    { name: 'Habilidades', href: '#skills' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <footer className="relative border-t border-neutral-800/80 bg-[#080808]/90 dark:bg-[#080808]/95 backdrop-blur-xl pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Persona */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25 border border-white/20">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <span className="font-mono text-base font-bold tracking-tight text-white">
                pm<span className="text-violet-400">.dev</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Portfolio
              </span>
            </div>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              {PERSONAL_INFO.bioHeadline} — Diseñando soluciones full-stack resilientes y motores analíticos de alto impacto para la toma de decisiones basada en datos.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Inspirado en Lightswind UI • Hecho con React, Tailwind & Vite</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-violet-400 transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Connect */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold mb-4">
              Conectar
            </h4>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-neutral-400 hover:text-white transition-colors duration-150 flex items-center gap-2"
                  >
                    <span>{social.name}</span>
                    <span className="text-[10px] font-mono text-neutral-600">↗</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors duration-150"
                >
                  {PERSONAL_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 flex items-center gap-1.5">
            © {new Date().getFullYear()} {PERSONAL_INFO.name}. Construido con rigor analítico y pasión por el código.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500 font-mono">
              Santo Domingo, DO
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5 group"
              title="Volver arriba"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-4 h-4 group-hover:text-violet-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
