import React, { useState } from 'react';
import { TIMELINE_ITEMS } from '../data/portfolioData';
import { Briefcase, GraduationCap, Calendar, MapPin, Sparkles } from 'lucide-react';
import { ExperienceItem } from '../types/portfolio';

export const ExperienceTimeline: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'experience' | 'education'>('all');

  const filteredItems = filter === 'all'
    ? TIMELINE_ITEMS
    : TIMELINE_ITEMS.filter(item => item.type === filter);

  return (
    <section id="experience" className="py-24 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Career Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Experience & Academic Rigor
          </h2>
          <p className="text-sm text-neutral-400 max-w-lg mt-2">
            Professional trajectory combining quality data analytics in healthcare with production software development.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-900/80 border border-neutral-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'all' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('experience')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'experience' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Experience
          </button>
          <button
            type="button"
            onClick={() => setFilter('education')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'education' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Education
          </button>
        </div>
      </div>

      {/* Luminous Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-neutral-800 space-y-12">
        {filteredItems.map((item, idx) => {
          const isEdu = item.type === 'education';

          return (
            <div key={item.id} className="relative group">
              {/* Luminous Beacon Node */}
              <div 
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-[#080808] transition-transform duration-300 group-hover:scale-125 ${
                  isEdu ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-purple-500 shadow-lg shadow-purple-500/50'
                }`}
              />

              {/* Content Card */}
              <div className="p-6 rounded-2xl bg-[#0D0D11]/90 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`p-1.5 rounded-lg text-xs ${isEdu ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                      {isEdu ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {item.role}
                    </h3>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10 self-start sm:self-auto">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Company & Period */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-medium mb-4">
                  <span className="text-neutral-200 font-semibold">{item.company}</span>
                  <span className="flex items-center gap-1 text-neutral-400 font-mono">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    {item.period}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-400">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    {item.location}
                  </span>
                </div>

                {/* Description bullet points */}
                <ul className="space-y-1.5 mb-5 text-xs sm:text-sm text-neutral-300">
                  {item.description.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Technologies used chips */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-800/60">
                  {item.keyTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono font-medium text-neutral-400 bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

