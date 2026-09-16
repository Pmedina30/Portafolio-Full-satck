import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InfiniteMarquee } from './components/InfiniteMarquee';
import { ProjectsBentoGrid } from './components/ProjectsBentoGrid';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SkillsMatrix } from './components/SkillsMatrix';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pm_portfolio_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pm_portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 selection:bg-violet-500/30 selection:text-violet-200 transition-colors duration-300 font-sans relative overflow-x-hidden">
      {/* Dynamic Ambient Mesh Glows (Lightswind UI Atmosphere) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Violet Nebula glow top center */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-700/15 rounded-full blur-[140px] mix-blend-screen" />
        
        {/* Deep Indigo/Blue glow right center */}
        <div className="absolute top-[35%] -right-48 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[160px] mix-blend-screen" />

        {/* Emerald accent glow left center */}
        <div className="absolute top-[65%] -left-48 w-[500px] h-[500px] bg-emerald-700/8 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Floating Capsule Navigation */}
      <Navbar darkMode={theme === 'dark'} onToggleDarkMode={toggleTheme} />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col gap-0">
        <Hero />
        
        {/* Infinite Tech Marquee */}
        <div className="relative z-20 py-4 -mt-6">
          <InfiniteMarquee />
        </div>

        {/* Featured Projects Bento Grid */}
        <ProjectsBentoGrid />

        {/* Experience & Education Timeline */}
        <ExperienceTimeline />

        {/* Core Competencies & Skills Matrix */}
        <SkillsMatrix />

        {/* Contact & Inquiry Section */}
        <ContactSection />
      </main>

      {/* Global Minimalist Footer */}
      <Footer />
    </div>
  );
};

export default App;
