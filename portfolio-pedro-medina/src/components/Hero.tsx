import React, { useState } from 'react';
import {
  ArrowRight,
  Terminal,
  Activity,
  Cpu,
  Copy,
  Check,
  Play,
  Sliders,
  Layers,
  MapPin
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Language } from '../types/portfolio';
import { ArchitecturalCanvas3D, SpatialMode } from './ArchitecturalCanvas3D';

interface HeroProps {
  lang: Language;
  onOpenCommandPalette: () => void;
}

type ConsoleTab = 'spatial' | 'telemetry' | 'simulator' | 'spec';

export const Hero: React.FC<HeroProps> = ({ lang, onOpenCommandPalette }) => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>('spatial');
  const [spatialMode, setSpatialMode] = useState<SpatialMode>('monolith');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Interactive KPI Sandbox state
  const [loadScenario, setLoadScenario] = useState<'nominal' | 'peak' | 'audit'>('nominal');

  const scenarioMetrics = {
    nominal: {
      label: { en: 'Nominal Fleet & IOCC Ops', es: 'Operación Nominal Flota e IOCC' },
      daxLatency: '6.8 ms',
      activeUnits: '310 / 310',
      qaCompliance: '99.2%',
      otpRate: '94.6%',
      grossRD: 'RD$ 488,428',
      bars: [78, 84, 92, 88, 95, 91, 96, 94]
    },
    peak: {
      label: { en: 'SDQ Rush Hour Surge (6:30 PM)', es: 'Hora Pico Santo Domingo (6:30 PM)' },
      daxLatency: '9.4 ms',
      activeUnits: '342 / 350',
      qaCompliance: '98.9%',
      otpRate: '89.2%',
      grossRD: 'RD$ 612,940',
      bars: [88, 94, 98, 100, 96, 92, 99, 97]
    },
    audit: {
      label: { en: 'Monthly Healthcare QA Batch', es: 'Lote Mensual de Auditoría QA Salud' },
      daxLatency: '4.2 ms',
      activeUnits: '1,420 Audits',
      qaCompliance: '99.6%',
      otpRate: '100% SLA',
      grossRD: '-65% Manual Time',
      bars: [96, 98, 99, 99, 100, 99, 100, 99]
    }
  };

  const currentScenario = scenarioMetrics[loadScenario];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id="home"
      className="relative pt-28 lg:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Top Editorial Index Line */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#DFDDD4] dark:border-[#242421]">
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#EEECE5] dark:bg-[#151513] border border-[#DFDDD4] dark:border-[#262623]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4F18] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4F18]" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#111110] dark:text-[#F4F3EF]">
            {PERSONAL_INFO.roleBadge[lang]}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF4F18]" />
            {PERSONAL_INFO.city}
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">
            ● {PERSONAL_INFO.availability[lang]}
          </span>
        </div>
      </div>

      {/* Main 12-Column Asymmetric Architectural Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column (7 cols): Editorial Statement & Verifiable Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#FF4F18] font-semibold">
              {lang === 'en'
                ? '00 // MONOGRAPH & PRODUCTION WORKBENCH'
                : '00 // MONOGRAFÍA Y BANCO DE SISTEMAS EN PRODUCCIÓN'}
            </div>

            <h1 className="font-display text-4xl sm:text-6xl xl:text-[68px] font-bold tracking-[-0.035em] leading-[0.98] text-[#111110] dark:text-[#F4F3EF]">
              {lang === 'en' ? (
                <>
                  Systems that compute with{' '}
                  <span className="font-serif italic font-normal text-[#FF4F18]">
                    rigor
                  </span>{' '}
                  and move with precision.
                </>
              ) : (
                <>
                  Sistemas que calculan con{' '}
                  <span className="font-serif italic font-normal text-[#FF4F18]">
                    rigor
                  </span>{' '}
                  y responden con precisión.
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl font-normal">
              {PERSONAL_INFO.heroSubtitle[lang]}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#111110] dark:bg-[#F4F3EF] text-[#F6F5F0] dark:text-[#0A0A09] font-display font-bold text-sm hover:bg-[#FF4F18] dark:hover:bg-[#FF4F18] dark:hover:text-white transition-all duration-200 shadow-sm group"
            >
              <span>
                {lang === 'en' ? 'Inspect Interactive Works (06)' : 'Explorar Casos Interactivos (06)'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#registry"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#EEECE5] dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#262623] text-[#111110] dark:text-[#F4F3EF] font-mono text-xs font-semibold hover:border-[#FF4F18] transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#FF4F18]" />
              <span>{lang === 'en' ? 'Full 12-App Index' : 'Índice de 12 Apps'}</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent border border-[#DFDDD4] dark:border-[#262623] text-neutral-600 dark:text-neutral-300 hover:text-[#111110] dark:hover:text-white hover:border-neutral-400 font-mono text-xs transition-all"
              title="Copy Email"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {lang === 'en' ? 'Copied!' : '¡Copiado!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{PERSONAL_INFO.email}</span>
                </>
              )}
            </button>
          </div>

          {/* 4 Architectural Metric Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#DFDDD4] dark:bg-[#242421] border border-[#DFDDD4] dark:border-[#242421] rounded-2xl overflow-hidden">
            {PERSONAL_INFO.stats.map((stat) => (
              <div
                key={stat.label.en}
                className="p-4 sm:p-5 bg-[#F6F5F0] dark:bg-[#111110] hover:bg-white dark:hover:bg-[#161614] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#111110] dark:text-[#F4F3EF]">
                    {stat.value}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#FF4F18]">
                    {stat.unit}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-semibold text-[#111110] dark:text-neutral-200">
                    {stat.label[lang]}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                    {stat.detail[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Engineering & Telemetry Deck */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-white dark:bg-[#111110] border border-[#DFDDD4] dark:border-[#262623] shadow-xl overflow-hidden">
            {/* Console Header Bar */}
            <div className="px-4 py-3 bg-[#EEECE5]/70 dark:bg-[#161614] border-b border-[#DFDDD4] dark:border-[#242421] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4F18]" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-1 font-mono text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                  WORKBENCH // {activeTab === 'spatial' ? 'WEBGL 3D' : 'LIVE TELEMETRY'}
                </span>
              </div>

              {/* Console Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#F6F5F0] dark:bg-[#0A0A09] p-0.5 rounded-lg border border-[#DFDDD4] dark:border-[#242421]">
                <button
                  type="button"
                  onClick={() => setActiveTab('spatial')}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition-all ${
                    activeTab === 'spatial'
                      ? 'bg-[#FF4F18] text-white'
                      : 'text-neutral-500 hover:text-[#111110] dark:hover:text-white'
                  }`}
                >
                  3D
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition-all ${
                    activeTab === 'telemetry'
                      ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09]'
                      : 'text-neutral-500 hover:text-[#111110] dark:hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'PULSE' : 'PULSO'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('simulator')}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition-all ${
                    activeTab === 'simulator'
                      ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09]'
                      : 'text-neutral-500 hover:text-[#111110] dark:hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'SANDBOX' : 'SIMULADOR'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('spec')}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition-all ${
                    activeTab === 'spec'
                      ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09]'
                      : 'text-neutral-500 hover:text-[#111110] dark:hover:text-white'
                  }`}
                >
                  SPEC
                </button>
              </div>
            </div>

            {/* Console Body */}
            <div className="p-5 space-y-5">
              {activeTab === 'spatial' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                        {lang === 'en' ? 'THREE.JS SPATIAL ENGINE' : 'MOTOR ESPACIAL THREE.JS'}
                      </span>
                      <h3 className="font-display font-bold text-sm text-[#111110] dark:text-[#F4F3EF]">
                        {lang === 'en'
                          ? 'Interactive Architectural Monolith'
                          : 'Monolito Arquitectónico Interactivo'}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF4F18]/10 text-[#FF4F18] border border-[#FF4F18]/20">
                      DRAG TO ORBIT
                    </span>
                  </div>

                  {/* 3D WebGL Viewport */}
                  <div className="relative h-[270px] w-full rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] overflow-hidden">
                    <ArchitecturalCanvas3D mode={spatialMode} />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                        {PERSONAL_INFO.coordinates}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                        ACES FILMIC // 60FPS
                      </span>
                    </div>
                  </div>

                  {/* Geometry Mode Selector */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'monolith', label: 'MONOLITH' },
                        { id: 'lattice', label: 'LATTICE' },
                        { id: 'orbital', label: 'ORBITAL' }
                      ] as const
                    ).map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setSpatialMode(btn.id)}
                        className={`py-2 px-2.5 rounded-lg font-mono text-[10px] font-semibold border transition-all ${
                          spatialMode === btn.id
                            ? 'bg-[#111110] dark:bg-[#F4F3EF] text-white dark:text-[#0A0A09] border-[#111110] dark:border-[#F4F3EF]'
                            : 'bg-[#F6F5F0] dark:bg-[#161614] text-neutral-600 dark:text-neutral-300 border-[#DFDDD4] dark:border-[#262623] hover:border-[#FF4F18]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'telemetry' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                        {lang === 'en' ? 'ACTIVE PRODUCTION NODES' : 'NODOS ACTIVOS EN PRODUCCIÓN'}
                      </span>
                      <h3 className="font-display font-bold text-sm text-[#111110] dark:text-[#F4F3EF]">
                        {lang === 'en'
                          ? 'Real-Time System Architecture Status'
                          : 'Estado de Arquitectura en Tiempo Real'}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ONLINE // 60FPS
                    </span>
                  </div>

                  {/* Node List */}
                  <div className="space-y-2.5">
                    {[
                      {
                        code: 'SYS-01',
                        name: 'taxi. Operations SDQ',
                        tech: 'Google Maps + PostGIS',
                        metric: '310 Units // RD$ 488K',
                        href: '#projects'
                      },
                      {
                        code: 'SYS-02',
                        name: 'IOCC Aviation Executive Studio',
                        tech: 'Client DAX Kernel',
                        metric: 'OTP 94.6% // <12ms',
                        href: '#projects'
                      },
                      {
                        code: 'SYS-03',
                        name: 'CenterWell Healthcare QA Engine',
                        tech: 'Power BI + Python/VBA',
                        metric: '99.2% SLA // -65% Time',
                        href: '#projects'
                      },
                      {
                        code: 'SYS-04',
                        name: 'OmniPOS & ColmadoPro Suite',
                        tech: 'Firestore Dual-Sync',
                        metric: 'Zero-Downtime POS',
                        href: '#projects'
                      },
                      {
                        code: 'SYS-05',
                        name: 'NEXUS-01 & CosmosLens 3D',
                        tech: 'Three.js + WebGL Shaders',
                        metric: 'PBR 60fps + WebAudio',
                        href: '#projects'
                      }
                    ].map((node) => (
                      <a
                        key={node.code}
                        href={node.href}
                        className="p-3 rounded-xl bg-[#F6F5F0] dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#242421] hover:border-[#FF4F18] dark:hover:border-[#FF4F18] transition-all flex items-center justify-between gap-2 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-[#FF4F18]">
                              {node.code}
                            </span>
                            <span className="font-display font-bold text-xs text-[#111110] dark:text-[#F4F3EF] truncate group-hover:text-[#FF4F18] transition-colors">
                              {node.name}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                            {node.tech}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-mono text-[11px] font-semibold text-[#111110] dark:text-neutral-200 bg-white dark:bg-[#0A0A09] px-2 py-1 rounded border border-[#DFDDD4] dark:border-[#262623]">
                            {node.metric}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Interactive Prompt */}
                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                    <span>
                      {lang === 'en'
                        ? 'Try testing live scenarios in SANDBOX tab →'
                        : 'Prueba escenarios en vivo en la pestaña SIMULADOR →'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('simulator')}
                      className="text-[#FF4F18] font-bold hover:underline flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{lang === 'en' ? 'Open Sandbox' : 'Abrir Simulador'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'simulator' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF4F18] font-semibold block">
                        {lang === 'en' ? 'INTERACTIVE ENGINE STRESS TEST' : 'PRUEBA INTERACTIVA DE MOTOR'}
                      </span>
                      <h3 className="font-display font-bold text-sm text-[#111110] dark:text-[#F4F3EF]">
                        {currentScenario.label[lang]}
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {currentScenario.daxLatency}
                    </span>
                  </div>

                  {/* Scenario Selector Buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'nominal', label: lang === 'en' ? 'Nominal Ops' : 'Nominal' },
                        { id: 'peak', label: lang === 'en' ? 'SDQ Rush Hour' : 'Hora Pico SDQ' },
                        { id: 'audit', label: lang === 'en' ? 'QA Batch Run' : 'Lote QA Salud' }
                      ] as const
                    ).map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setLoadScenario(btn.id)}
                        className={`py-2 px-2.5 rounded-lg font-mono text-[11px] font-semibold border transition-all ${
                          loadScenario === btn.id
                            ? 'bg-[#FF4F18] text-white border-[#FF4F18]'
                            : 'bg-[#F6F5F0] dark:bg-[#161614] text-neutral-600 dark:text-neutral-300 border-[#DFDDD4] dark:border-[#262623] hover:border-[#FF4F18]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Computed Telemetry Readouts */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-[#F6F5F0] dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#242421]">
                      <span className="font-mono text-[10px] text-neutral-500 uppercase block">
                        {lang === 'en' ? 'Active Throughput' : 'Volumen Activo'}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#111110] dark:text-[#F4F3EF]">
                        {currentScenario.activeUnits}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F6F5F0] dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#242421]">
                      <span className="font-mono text-[10px] text-neutral-500 uppercase block">
                        {lang === 'en' ? 'QA / SLA Precision' : 'Precisión QA / SLA'}
                      </span>
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {currentScenario.qaCompliance}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F6F5F0] dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#242421]">
                      <span className="font-mono text-[10px] text-neutral-500 uppercase block">
                        {lang === 'en' ? 'IOCC On-Time / Target' : 'Puntualidad OTP'}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#111110] dark:text-[#F4F3EF]">
                        {currentScenario.otpRate}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F6F5F0] dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#242421]">
                      <span className="font-mono text-[10px] text-neutral-500 uppercase block">
                        {lang === 'en' ? 'Financial / Time Delta' : 'Impacto Operativo'}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#FF4F18]">
                        {currentScenario.grossRD}
                      </span>
                    </div>
                  </div>

                  {/* Live Bar Telemetry Sparkline */}
                  <div className="p-3.5 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-2">
                      <span>{lang === 'en' ? 'REAL-TIME TELEMETRY DISTRIBUTION' : 'DISTRIBUCIÓN DE TELEMETRÍA EN VIVO'}</span>
                      <span className="text-[#FF4F18]">DAX KERNEL READY</span>
                    </div>
                    <div className="h-14 flex items-end gap-1.5">
                      {currentScenario.bars.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t bg-[#111110] dark:bg-[#F4F3EF] transition-all duration-300"
                            style={{
                              height: `${Math.max(16, (val / 100) * 48)}px`,
                              backgroundColor: i === currentScenario.bars.length - 1 ? '#FF4F18' : undefined
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'spec' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>pedro.architecture.json</span>
                    <span className="text-emerald-500">VALIDATED</span>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] font-mono text-[11px] leading-relaxed text-[#111110] dark:text-neutral-300 overflow-x-auto">
{`{
  "engineer": "Pedro Medina",
  "base": "Santo Domingo, DO",
  "education": "ITLA Software Eng (GPA 3.6/4.0)",
  "currentRole": "Data & QA Analyst @ Trueshore",
  "corePillars": [
    "Full-Stack React 18 / TypeScript / Node / Python",
    "Executive Power BI / DAX & Automated VBA/Python",
    "Real-Time Geospatial & 3D WebGL Telemetry"
  ],
  "contact": "pedromedina1508@icloud.com"
}`}
                  </pre>
                  <button
                    type="button"
                    onClick={onOpenCommandPalette}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#111110] dark:bg-[#F4F3EF] text-white dark:text-[#0A0A09] font-mono text-xs font-semibold hover:bg-[#FF4F18] dark:hover:bg-[#FF4F18] dark:hover:text-white transition-colors"
                  >
                    {lang === 'en'
                      ? 'Press ⌘K to launch any system or copy commands'
                      : 'Presiona ⌘K para lanzar sistemas o copiar comandos'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
