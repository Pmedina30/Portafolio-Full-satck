import React from 'react';
import { TECH_STACK_TICKER } from '../data/portfolioData';

export const InfiniteMarquee: React.FC = () => {
  // Duplicate list to guarantee uninterrupted 100% infinite loop
  const tickerItems = [...TECH_STACK_TICKER, ...TECH_STACK_TICKER];

  return (
    <section className="relative py-8 bg-[#080808] overflow-hidden border-y border-neutral-800/60 select-none">
      {/* Edge gradient masks for seamless fade out */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10" />

      {/* Infinite scrolling row */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-4">
        {tickerItems.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0D0D11] border border-neutral-800/80 hover:border-neutral-600/80 transition-colors shadow-xs group cursor-default"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-cyan-400 transition-colors" />
            <span className="text-xs font-semibold text-neutral-300 group-hover:text-white font-mono tracking-tight transition-colors">
              {item.name}
            </span>
            <span className="text-[10px] text-neutral-600 uppercase font-bold tracking-wider">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
