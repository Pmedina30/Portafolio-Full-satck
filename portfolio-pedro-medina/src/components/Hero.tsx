import React from 'react';
import { ArrowRight, Sparkles, MapPin, Download, CheckCircle2, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-center items-center text-center pt-28 pb-16 px-4 overflow-hidden">
      {/* 1. Subtle Radial Background Halos (Violet & Deep Blue Lightswind Ambiance) */}
      <div 
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] rounded-full blur-[130px] opacity-25 animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, #492B69 0%, #3B82F6 50%, transparent 80%)'
        }}
      />
      <div 
        className="pointer-events-none absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full blur-[100px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #00C3DE 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 backdrop-blur-md mb-8 shadow-inner hover:border-neutral-700 transition cursor-default group">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-medium tracking-wide">
            {PERSONAL_INFO.availability}
          </span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400 text-[11px] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-500" />
            Santo Domingo Este
          </span>
        </div>

        {/* Main Metallic Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-gradient-metallic mb-6 text-balance">
          Engineering robust web applications & translating complex operational data into executive intelligence.
        </h1>

        {/* Bio Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-400 font-normal max-w-2xl leading-relaxed mb-10 text-balance">
          Hi, I'm <strong className="text-white font-semibold">{PERSONAL_INFO.name}</strong>. A dual-profile{' '}
          <span className="text-purple-400 font-medium">Quality & Data Analyst</span> and{' '}
          <span className="text-blue-400 font-medium">Full Stack Software Engineer</span> bridging high-performance web systems with rigorous business analytics.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-14">
          <a
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-neutral-950 font-bold text-sm hover:bg-neutral-200 transition-all duration-200 shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-95"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4 text-neutral-800" />
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-neutral-900/90 text-neutral-200 font-semibold text-sm border border-neutral-700/80 hover:border-neutral-500 hover:text-white hover:bg-neutral-800/80 transition-all duration-200 active:scale-95 backdrop-blur-md"
          >
            <span>Get in Touch</span>
          </a>
        </div>

        {/* Metric Highlight Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl pt-6 border-t border-neutral-800/60">
          {PERSONAL_INFO.stats.map((stat) => (
            <div
              key={stat.label}
              className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center hover:border-neutral-700/80 transition"
            >
              <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-purple-400 mt-0.5">
                {stat.label}
              </div>
              <div className="text-[10px] text-neutral-500 truncate">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

