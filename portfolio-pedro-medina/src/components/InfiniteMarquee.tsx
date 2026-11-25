import React from 'react';
import { TECH_STACK_TICKER } from '../data/portfolioData';

export const InfiniteMarquee: React.FC = () => {
  const items = [...TECH_STACK_TICKER, ...TECH_STACK_TICKER];

  return (
    <div className="relative w-full overflow-hidden border-y border-[#DFDDD4] dark:border-[#242421] bg-[#EEECE5]/60 dark:bg-[#111110]/80 py-3.5 select-none">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F6F5F0] dark:from-[#0A0A09] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F6F5F0] dark:from-[#0A0A09] to-transparent z-10" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-6">
        {items.map((tech, idx) => (
          <div
            key={`${tech.name}-${idx}`}
            className="flex items-center gap-3 px-3 py-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F18]" />
            <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-[#111110] dark:text-[#F4F3EF]">
              {tech.name}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 dark:bg-[#1A1A17] text-neutral-500 dark:text-neutral-400 border border-[#DFDDD4] dark:border-[#262623]">
              {tech.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
