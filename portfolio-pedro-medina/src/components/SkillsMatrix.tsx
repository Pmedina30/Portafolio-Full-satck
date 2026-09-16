import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { Cpu, BarChart3, Layout, Database, CheckCircle, Sparkles } from 'lucide-react';

export const SkillsMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <BarChart3 className="w-5 h-5 text-purple-400" />;
      case 1:
        return <Layout className="w-5 h-5 text-blue-400" />;
      case 2:
      default:
        return <Database className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Expert':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Expert
          </span>
        );
      case 'Advanced':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Advanced
          </span>
        );
      case 'Proficient':
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Proficient
          </span>
        );
    }
  };

  return (
    <section id="skills" className="py-24 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Technical Stack</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          Skills & Core Competencies
        </h2>
        <p className="text-sm sm:text-base text-neutral-400">
          A balanced synthesis of analytical decision-making, statistical metrics, and modern software engineering.
        </p>
      </div>

      {/* Category Tabs (Desktop & Mobile) */}
      <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.title}
            type="button"
            onClick={() => setSelectedCategory(idx)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === idx
                ? 'bg-white text-neutral-950 shadow-lg shadow-white/10'
                : 'bg-[#0D0D11] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {getCategoryIcon(idx)}
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Selected Category Spotlight Detail Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map((cat, catIdx) => {
          const isSelected = selectedCategory === catIdx;

          return (
            <SpotlightCard
              key={cat.title}
              glowColor={catIdx === 0 ? 'purple' : catIdx === 1 ? 'blue' : 'emerald'}
              className={`flex flex-col justify-between transition-all duration-300 ${
                isSelected 
                  ? 'ring-1 ring-purple-500/50 bg-[#0D0D11]' 
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    {getCategoryIcon(catIdx)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{cat.title}</h3>
                    <span className="text-[10px] text-neutral-400">5 Key Competencies</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                  {cat.description}
                </p>

                {/* Skill List with Progress Gauges */}
                <div className="space-y-4">
                  {cat.skills.map((s) => (
                    <div key={s.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-200">{s.name}</span>
                        {getLevelBadge(s.level)}
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            catIdx === 0 
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-500' 
                              : catIdx === 1 
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-400' 
                                : 'bg-gradient-to-r from-emerald-600 to-teal-400'
                          }`}
                          style={{ width: `${s.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Verified in Production</span>
                <span className="font-mono text-neutral-400">Industry Standard</span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};
