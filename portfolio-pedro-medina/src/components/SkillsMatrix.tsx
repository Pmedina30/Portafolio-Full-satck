import React, { useState } from 'react';
import { CAPABILITY_DOMAINS } from '../data/portfolioData';
import { Language } from '../types/portfolio';
import { Cpu, BarChart3, Layers, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface SkillsMatrixProps {
  lang: Language;
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({ lang }) => {
  const [activeDomainIdx, setActiveDomainIdx] = useState<number>(0);

  const getDomainIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Cpu className="w-4 h-4 text-[#FF4F18]" />;
      case 1:
        return <BarChart3 className="w-4 h-4 text-[#FF4F18]" />;
      default:
        return <Layers className="w-4 h-4 text-[#FF4F18]" />;
    }
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-12 border-b border-[#DFDDD4] dark:border-[#242421]">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#FF4F18] font-semibold mb-2">
            {lang === 'en'
              ? '03 // ARCHITECTURAL CAPABILITIES & PRODUCTION PROOF'
              : '03 // CAPACIDADES ARQUITECTÓNICAS Y EVIDENCIA EN PRODUCCIÓN'}
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#111110] dark:text-[#F4F3EF]">
            {lang === 'en' ? (
              <>
                No arbitrary percentages—only{' '}
                <span className="font-serif italic font-normal text-[#FF4F18]">
                  shipped
                </span>{' '}
                proof.
              </>
            ) : (
              <>
                Sin porcentajes arbitrarios—solo{' '}
                <span className="font-serif italic font-normal text-[#FF4F18]">
                  sistemas
                </span>{' '}
                en producción.
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mt-2">
            {lang === 'en'
              ? 'Every engineering discipline below is mapped directly to the production platforms and operational datasets where it runs.'
              : 'Cada disciplina técnica está vinculada directamente con las plataformas en producción y flujos de datos donde opera.'}
          </p>
        </div>

        {/* Domain Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap bg-[#EEECE5] dark:bg-[#141412] p-1.5 rounded-xl border border-[#DFDDD4] dark:border-[#242421] self-start lg:self-auto">
          {CAPABILITY_DOMAINS.map((domain, idx) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => setActiveDomainIdx(idx)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                activeDomainIdx === idx
                  ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#111110] dark:hover:text-white'
              }`}
            >
              <span>{domain.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Architectural Pillar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {CAPABILITY_DOMAINS.map((domain, idx) => {
          const isFocused = activeDomainIdx === idx;
          return (
            <div
              key={domain.id}
              onClick={() => setActiveDomainIdx(idx)}
              className={`rounded-2xl p-6 sm:p-7 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                isFocused
                  ? 'bg-white dark:bg-[#141412] border-[#111110] dark:border-[#F4F3EF] shadow-md'
                  : 'bg-[#F6F5F0]/70 dark:bg-[#111110] border-[#DFDDD4] dark:border-[#242421] hover:border-neutral-400 dark:hover:border-neutral-700'
              }`}
            >
              <div>
                {/* Top Code & Icon */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#DFDDD4] dark:border-[#242421]">
                  <span className="font-mono text-xs font-bold text-[#FF4F18]">
                    {domain.code}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#EEECE5] dark:bg-[#1A1A17] border border-[#DFDDD4] dark:border-[#262623] flex items-center justify-center">
                    {getDomainIcon(idx)}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#111110] dark:text-[#F4F3EF] mb-1.5">
                  {domain.title[lang]}
                </h3>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-4">
                  {domain.subtitle[lang]}
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                  {domain.description[lang]}
                </p>

                {/* Verified Deliverables */}
                <div className="space-y-2 mb-6 p-3.5 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                    {lang === 'en' ? 'Production Deliverables' : 'Entregables de Producción'}
                  </span>
                  {domain.deliverables[lang].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-[#111110] dark:text-neutral-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tool-to-System Proof Map */}
                <div className="space-y-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">
                    {lang === 'en' ? 'Technology → Verified System' : 'Tecnología → Sistema Verificado'}
                  </span>
                  {domain.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="p-3 rounded-xl bg-[#EEECE5]/60 dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-bold text-xs text-[#111110] dark:text-[#F4F3EF]">
                          {tool.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#FF4F18] font-semibold flex items-center gap-0.5">
                          <span>{tool.productionSystem.split('/')[0].trim()}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                        {tool.role[lang]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-[#DFDDD4] dark:border-[#242421] flex items-center justify-between font-mono text-[10px] text-neutral-500">
                <span>STATUS: PRODUCTION-VERIFIED</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">● ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
