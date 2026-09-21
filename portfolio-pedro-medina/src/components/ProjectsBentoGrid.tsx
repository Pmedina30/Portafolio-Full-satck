import React, { useState } from 'react';
import { SpotlightCard } from './SpotlightCard';
import { FEATURED_PROJECTS } from '../data/portfolioData';
import { ExternalLink, Github, Sparkles, CheckCircle2, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { ProjectItem } from '../types/portfolio';

export const ProjectsBentoGrid: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Data & Analytics', 'Full Stack', 'QA & Automation', 'UI/UX Design'];

  const filteredProjects = activeFilter === 'All'
    ? FEATURED_PROJECTS
    : FEATURED_PROJECTS.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Engineering & Analytics Showcase
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mt-2">
            Production-grade web platforms, real-time DAX operational intelligence, and automated quality auditing engines.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-900/80 border border-neutral-800 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === cat
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <SpotlightCard
            key={project.id}
            glowColor={project.accentGlow}
            className="flex flex-col justify-between h-full group"
          >
            <div>
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                  {project.category}
                </span>

                {project.statsBadge && (
                  <span className="text-[10px] font-mono font-bold text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-md border border-neutral-700/60">
                    {project.statsBadge}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors tracking-tight mb-1">
                {project.title}
              </h3>
              <p className="text-xs font-semibold text-neutral-400 mb-3">
                {project.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300/90 leading-relaxed mb-5">
                {project.description}
              </p>

              {/* Key Impact Metrics */}
              <div className="space-y-1.5 mb-6 p-3 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Key Technical Achievements
                </span>
                {project.impactMetrics.map((metric, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions & Tags */}
            <div className="pt-4 border-t border-neutral-800/70 space-y-4">
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono font-medium text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Interactive Links */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white hover:text-neutral-950 px-3 py-1.5 rounded-lg transition-all shadow-xs"
                    >
                      <span>Live App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>

                <span className="text-[11px] font-semibold text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Explore <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};

