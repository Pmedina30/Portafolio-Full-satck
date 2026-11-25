import React, { useState } from 'react';
import { TIMELINE_ITEMS } from '../data/portfolioData';
import { Language } from '../types/portfolio';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface ExperienceTimelineProps {
  lang: Language;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ lang }) => {
  const [filter, setFilter] = useState<'all' | 'experience' | 'education'>('all');

  const filteredItems =
    filter === 'all'
      ? TIMELINE_ITEMS
      : TIMELINE_ITEMS.filter((item) => item.type === filter);

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-12 border-b border-[#DFDDD4] dark:border-[#242421]">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#FF4F18] font-semibold mb-2">
            {lang === 'en'
              ? '04 // PROFESSIONAL TRAJECTORY & ACADEMIC RIGOR'
              : '04 // TRAYECTORIA PROFESIONAL Y FORMACIÓN ACADÉMICA'}
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#111110] dark:text-[#F4F3EF]">
            {lang === 'en' ? (
              <>
                Operations, engineering &{' '}
                <span className="font-serif italic font-normal text-[#FF4F18]">
                  honors
                </span>{' '}
                pedigree.
              </>
            ) : (
              <>
                Operaciones, ingeniería y{' '}
                <span className="font-serif italic font-normal text-[#FF4F18]">
                  excelencia
                </span>{' '}
                académica.
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mt-2">
            {lang === 'en'
              ? 'From honors software engineering at ITLA (GPA 3.6/4.0) to full-stack development at Talendig and healthcare data analytics at Trueshore.'
              : 'Desde Ingeniería de Software con honores en ITLA (3.6/4.0) hasta desarrollo full-stack en Talendig y analítica de calidad en salud en Trueshore.'}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#EEECE5] dark:bg-[#141412] p-1.5 rounded-xl border border-[#DFDDD4] dark:border-[#242421] self-start lg:self-auto">
          {(
            [
              { id: 'all', label: { en: 'All Ledger (05)', es: 'Todo (05)' } },
              { id: 'experience', label: { en: 'Engineering & Data', es: 'Experiencia' } },
              { id: 'education', label: { en: 'Education & Honors', es: 'Educación' } }
            ] as const
          ).map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setFilter(btn.id)}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                filter === btn.id
                  ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#111110] dark:hover:text-white'
              }`}
            >
              {btn.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Ledger Rows */}
      <div className="space-y-6">
        {filteredItems.map((item) => {
          const isEdu = item.type === 'education';

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white dark:bg-[#111110] border border-[#DFDDD4] dark:border-[#242421] hover:border-[#111110] dark:hover:border-neutral-600 transition-all p-6 sm:p-8 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Meta Column (4 cols) */}
                <div className="lg:col-span-4 space-y-3 lg:border-r lg:border-[#DFDDD4] dark:lg:border-[#242421] lg:pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09]">
                      {item.index}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#EEECE5] dark:bg-[#1A1A17] text-[#FF4F18] border border-[#DFDDD4] dark:border-[#262623]">
                      {item.badge[lang]}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-[#111110] dark:text-[#F4F3EF]">
                      {item.role[lang]}
                    </h3>
                    <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5 flex items-center gap-1.5">
                      {isEdu ? (
                        <GraduationCap className="w-4 h-4 text-[#FF4F18] flex-shrink-0" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-[#FF4F18] flex-shrink-0" />
                      )}
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {item.period[lang]}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {item.location}
                    </span>
                  </div>

                  {/* Verified Metrics Callouts */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {item.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421]"
                      >
                        <div className="font-display text-base font-bold text-[#FF4F18]">
                          {m.value}
                        </div>
                        <div className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                          {m.label[lang]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Achievements & Tech Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
                  <p className="text-sm sm:text-base font-medium text-[#111110] dark:text-neutral-200 leading-relaxed">
                    {item.summary[lang]}
                  </p>

                  <ul className="space-y-2.5">
                    {item.achievements[lang].map((bullet, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#DFDDD4] dark:border-[#242421]">
                    {item.keyTechnologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#F6F5F0] dark:bg-[#0A0A09] text-neutral-700 dark:text-neutral-300 border border-[#DFDDD4] dark:border-[#242421]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
