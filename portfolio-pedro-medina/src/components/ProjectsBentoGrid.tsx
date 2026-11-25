import React, { useState } from 'react';
import { FEATURED_PROJECTS, WORKSPACE_APPS_INDEX } from '../data/portfolioData';
import { Language, ProjectCategory } from '../types/portfolio';
import { InteractiveProjectSimulation } from './InteractiveProjectSimulation';
import {
  ExternalLink,
  Github,
  CheckCircle2,
  Layers,
  Code2,
  Play,
  Terminal,
  Copy,
  Check,
  Search
} from 'lucide-react';

interface ProjectsSectionProps {
  lang: Language;
}

type CardInspectorTab = 'simulation' | 'architecture' | 'code';

export const ProjectsBentoGrid: React.FC<ProjectsSectionProps> = ({ lang }) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [cardTabs, setCardTabs] = useState<Record<string, CardInspectorTab>>({});
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [archiveSearch, setArchiveSearch] = useState('');

  const categories: { id: ProjectCategory; label: { en: string; es: string } }[] = [
    { id: 'All', label: { en: 'All Systems (06)', es: 'Todos (06)' } },
    { id: 'Data & Telemetry', label: { en: 'Data & Telemetry', es: 'Datos y Telemetría' } },
    { id: 'Full Stack & Cloud', label: { en: 'Full-Stack & Cloud', es: 'Full-Stack y Nube' } },
    { id: '3D & Spatial UI', label: { en: '3D & Spatial UI', es: '3D y UI Espacial' } },
    { id: 'QA & FinTech', label: { en: 'QA & FinTech', es: 'QA y FinTech' } }
  ];

  const filteredProjects =
    activeCategory === 'All'
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.category === activeCategory);

  const getCardTab = (id: string): CardInspectorTab => cardTabs[id] || 'simulation';

  const setCardTab = (id: string, tab: CardInspectorTab) => {
    setCardTabs((prev) => ({ ...prev, [id]: tab }));
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredArchive = WORKSPACE_APPS_INDEX.filter((app) => {
    if (!archiveSearch.trim()) return true;
    const q = archiveSearch.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.domain[lang].toLowerCase().includes(q) ||
      app.stack.some((s) => s.toLowerCase().includes(q)) ||
      app.port.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* SECTION 01: FLAGSHIP INTERACTIVE CASE STUDIES */}
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-12 border-b border-[#DFDDD4] dark:border-[#242421]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#FF4F18] font-semibold mb-2">
              {lang === 'en'
                ? '01 // SELECTED PRODUCTION SYSTEMS & LIVE SIMULATIONS'
                : '01 // SISTEMAS DESTACADOS EN PRODUCCIÓN Y SIMULACIÓN EN VIVO'}
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#111110] dark:text-[#F4F3EF]">
              {lang === 'en' ? (
                <>
                  Engineered for{' '}
                  <span className="font-serif italic font-normal text-[#FF4F18]">
                    real-world
                  </span>{' '}
                  throughput.
                </>
              ) : (
                <>
                  Construidos para operaciones{' '}
                  <span className="font-serif italic font-normal text-[#FF4F18]">
                    reales
                  </span>
                  .
                </>
              )}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mt-2">
              {lang === 'en'
                ? 'Every project card below embeds an interactive live simulation, full 3-tier system architecture blueprint, and production code kernel.'
                : 'Cada proyecto incluye una simulación interactiva en vivo, plano de arquitectura de 3 capas y núcleo de código de producción.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap bg-[#EEECE5] dark:bg-[#141412] p-1.5 rounded-xl border border-[#DFDDD4] dark:border-[#242421] self-start lg:self-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-[#111110] dark:hover:text-white'
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Architectural Case Study Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => {
            const activeTab = getCardTab(project.id);

            return (
              <article
                key={project.id}
                className="rounded-2xl bg-white dark:bg-[#111110] border border-[#DFDDD4] dark:border-[#242421] hover:border-[#111110] dark:hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm"
              >
                {/* Top Card Header */}
                <div className="p-6 sm:p-7 pb-5">
                  <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#DFDDD4]/70 dark:border-[#242421]">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09]">
                        {project.index}
                      </span>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#FF4F18]">
                        {project.category}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#EEECE5] dark:bg-[#181815] text-neutral-700 dark:text-neutral-300 border border-[#DFDDD4] dark:border-[#262623]">
                      {project.statusBadge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#111110] dark:text-[#F4F3EF] mb-1">
                    {project.title}
                  </h3>
                  <p className="font-mono text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-4">
                    {project.subtitle[lang]}
                  </p>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
                    {project.summary[lang]}
                  </p>

                  {/* 3-Mode Interactive Card Switcher */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EEECE5] dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#242421] mb-4">
                    <button
                      type="button"
                      onClick={() => setCardTab(project.id, 'simulation')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                        activeTab === 'simulation'
                          ? 'bg-white dark:bg-[#0A0A09] text-[#111110] dark:text-[#F4F3EF] shadow-xs'
                          : 'text-neutral-500 hover:text-[#111110] dark:hover:text-white'
                      }`}
                    >
                      <Play className="w-3 h-3 text-[#FF4F18]" />
                      <span>{lang === 'en' ? 'Live Simulator' : 'Simulador Vivo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCardTab(project.id, 'architecture')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                        activeTab === 'architecture'
                          ? 'bg-white dark:bg-[#0A0A09] text-[#111110] dark:text-[#F4F3EF] shadow-xs'
                          : 'text-neutral-500 hover:text-[#111110] dark:hover:text-white'
                      }`}
                    >
                      <Layers className="w-3 h-3 text-[#FF4F18]" />
                      <span>{lang === 'en' ? 'Architecture (3)' : 'Arquitectura (3)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCardTab(project.id, 'code')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                        activeTab === 'code'
                          ? 'bg-white dark:bg-[#0A0A09] text-[#111110] dark:text-[#F4F3EF] shadow-xs'
                          : 'text-neutral-500 hover:text-[#111110] dark:hover:text-white'
                      }`}
                    >
                      <Code2 className="w-3 h-3 text-[#FF4F18]" />
                      <span>{lang === 'en' ? 'Kernel & CLI' : 'Código y CLI'}</span>
                    </button>
                  </div>

                  {/* Tab 1: Interactive Simulation + Impact Metrics */}
                  {activeTab === 'simulation' && (
                    <div className="space-y-4">
                      <InteractiveProjectSimulation type={project.simulationType} lang={lang} />

                      <div className="space-y-1.5 pt-1">
                        {project.impactMetrics[lang].map((metric, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: 3-Tier System Architecture */}
                  {activeTab === 'architecture' && (
                    <div className="space-y-2.5">
                      {project.architecture.map((layer, idx) => (
                        <div
                          key={layer.layer}
                          className="p-3 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421]"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono text-[11px] font-bold text-[#FF4F18]">
                              0{idx + 1} // {layer.layer}
                            </span>
                            <span className="font-mono text-[10px] font-semibold text-[#111110] dark:text-neutral-300 bg-white dark:bg-[#161614] px-2 py-0.5 rounded border border-[#DFDDD4] dark:border-[#262623]">
                              {layer.tech}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {layer.detail[lang]}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 3: Production Code Snippet & Local Launcher */}
                  {activeTab === 'code' && (
                    <div className="space-y-3">
                      {project.keyCodeSnippet && (
                        <div className="rounded-xl overflow-hidden border border-[#DFDDD4] dark:border-[#242421] bg-[#F6F5F0] dark:bg-[#0A0A09]">
                          <div className="px-3 py-1.5 bg-[#EEECE5] dark:bg-[#161614] border-b border-[#DFDDD4] dark:border-[#242421] flex items-center justify-between font-mono text-[10px] text-neutral-500">
                            <span>{project.keyCodeSnippet.filename}</span>
                            <span className="uppercase">{project.keyCodeSnippet.language}</span>
                          </div>
                          <pre className="p-3 font-mono text-[11px] leading-relaxed text-[#111110] dark:text-neutral-200 overflow-x-auto">
                            {project.keyCodeSnippet.code}
                          </pre>
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-[#EEECE5]/60 dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#242421] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] uppercase text-neutral-500 block">
                            {lang === 'en' ? 'Problem Solved' : 'Problema Resuelto'}
                          </span>
                          <p className="text-xs text-[#111110] dark:text-neutral-200 mt-0.5">
                            {project.problemSolved[lang]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Stack Chips & Action Links */}
                <div className="px-6 sm:px-7 py-4 bg-[#F6F5F0]/70 dark:bg-[#141412] border-t border-[#DFDDD4] dark:border-[#242421] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] font-medium px-2 py-0.5 rounded bg-white dark:bg-[#0A0A09] text-neutral-600 dark:text-neutral-400 border border-[#DFDDD4] dark:border-[#242421]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.launcherCmd && (
                      <button
                        type="button"
                        onClick={() => handleCopyCommand(project.launcherCmd!)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold bg-white dark:bg-[#0A0A09] text-[#111110] dark:text-neutral-300 border border-[#DFDDD4] dark:border-[#262623] hover:border-[#FF4F18]"
                        title="Copy Local Launcher Command"
                      >
                        {copiedCmd === project.launcherCmd ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Terminal className="w-3 h-3 text-[#FF4F18]" />
                            <span>{project.launcherCmd.split(' ')[0]}</span>
                          </>
                        )}
                      </button>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] hover:bg-[#FF4F18] dark:hover:bg-[#FF4F18] dark:hover:text-white transition-colors"
                      >
                        <span>{lang === 'en' ? 'Open Port' : 'Abrir App'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white dark:bg-[#0A0A09] text-neutral-600 dark:text-neutral-400 hover:text-[#111110] dark:hover:text-white border border-[#DFDDD4] dark:border-[#262623]"
                        title="GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 02: COMPLETE 12-SYSTEM WORKSPACE ARCHIVE */}
      <section id="registry" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-white dark:bg-[#111110] border border-[#DFDDD4] dark:border-[#242421] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-6 border-b border-[#DFDDD4] dark:border-[#242421]">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#FF4F18] font-semibold mb-1">
                {lang === 'en'
                  ? '02 // COMPLETE REPOSITORY SYSTEM INDEX (12 APPLICATIONS)'
                  : '02 // ÍNDICE COMPLETO DE SISTEMAS EN REPOSITORIO (12 APLICACIONES)'}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#111110] dark:text-[#F4F3EF]">
                {lang === 'en'
                  ? 'Production Monorepo Directory'
                  : 'Directorio de Sistemas Full-Stack en Monorepo'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {lang === 'en'
                  ? 'Every application below resides in this repository with an autonomous 1-click launcher and dedicated port.'
                  : 'Cada aplicación reside en este repositorio con su propio lanzador autónomo de 1 clic y puerto dedicado.'}
              </p>
            </div>

            {/* Search Filter Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Filter by stack, port, or name...'
                    : 'Filtrar por stack, puerto o nombre...'
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] font-mono text-xs text-[#111110] dark:text-[#F4F3EF] placeholder:text-neutral-400 focus:outline-none focus:border-[#FF4F18]"
              />
            </div>
          </div>

          {/* Editorial Table / Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DFDDD4] dark:border-[#242421] font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="py-3 pr-4">#</th>
                  <th className="py-3 px-4">{lang === 'en' ? 'System' : 'Sistema'}</th>
                  <th className="py-3 px-4">{lang === 'en' ? 'Domain & Architecture Highlight' : 'Dominio y Aspecto Clave'}</th>
                  <th className="py-3 px-4">{lang === 'en' ? 'Core Stack' : 'Stack Principal'}</th>
                  <th className="py-3 px-4">{lang === 'en' ? 'Port' : 'Puerto'}</th>
                  <th className="py-3 pl-4 text-right">{lang === 'en' ? 'Launcher' : 'Lanzador'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDDD4]/70 dark:divide-[#242421] text-xs">
                {filteredArchive.map((app, i) => (
                  <tr
                    key={app.id}
                    className="hover:bg-[#F6F5F0]/80 dark:hover:bg-[#161614] transition-colors group"
                  >
                    <td className="py-3.5 pr-4 font-mono text-neutral-400 font-semibold">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-display font-bold text-sm text-[#111110] dark:text-[#F4F3EF] group-hover:text-[#FF4F18] transition-colors">
                        {app.name}
                      </div>
                      <div className="font-mono text-[11px] text-neutral-500">
                        {app.domain[lang]}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 max-w-xs">
                      {app.highlight[lang]}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {app.stack.map((s) => (
                          <span
                            key={s}
                            className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F6F5F0] dark:bg-[#0A0A09] text-neutral-600 dark:text-neutral-400 border border-[#DFDDD4] dark:border-[#242421]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      :{app.port}
                    </td>
                    <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyCommand(app.launcher)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[11px] bg-[#F6F5F0] dark:bg-[#0A0A09] text-[#111110] dark:text-neutral-300 border border-[#DFDDD4] dark:border-[#262623] hover:border-[#FF4F18]"
                          title="Copy .bat launcher"
                        >
                          {copiedCmd === app.launcher ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-neutral-400" />
                              <span>{app.launcher}</span>
                            </>
                          )}
                        </button>
                        {app.liveUrl && (
                          <a
                            href={app.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] hover:bg-[#FF4F18] dark:hover:bg-[#FF4F18] dark:hover:text-white transition-colors"
                            title={`Open ${app.liveUrl}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};
