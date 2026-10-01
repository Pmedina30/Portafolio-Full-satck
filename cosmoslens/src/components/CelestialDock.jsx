import React from 'react';
import { Globe2, Moon, Sparkles, Orbit, Telescope } from 'lucide-react';
import { CELESTIAL_BODIES } from '../data/orbitalData';
import { soundFx } from '../utils/audioAmbiance';

const ICONS = {
  earth: Globe2,
  moon: Moon,
  mars: Orbit,
  jupiter: Sparkles,
  jwst: Telescope,
};

export default function CelestialDock({ currentBody, onSelectBody }) {
  return (
    <nav 
      aria-label="Celestial Body Dock"
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 p-2 rounded-full vision-pill shadow-vision-glass-lg max-w-[95vw] overflow-x-auto"
    >
      {CELESTIAL_BODIES.map((body) => {
        const isSelected = currentBody?.id === body.id;
        const Icon = ICONS[body.id] || Globe2;

        return (
          <button
            key={body.id}
            onClick={() => {
              soundFx.playGlassPing(1.1);
              onSelectBody(body);
            }}
            className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 ${
              isSelected
                ? 'vision-pill-active scale-105'
                : 'hover:bg-white/10 opacity-75 hover:opacity-100 hover:scale-102'
            }`}
            title={`Select ${body.name}`}
          >
            {/* 3D-styled Glowing Celestial Sphere Icon */}
            <div 
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${body.color}, #050a18)`,
                boxShadow: isSelected ? `0 0 18px ${body.color}` : 'none'
              }}
            >
              <Icon className="w-4 h-4 text-white drop-shadow" />
              {isSelected && (
                <span 
                  className="absolute -inset-1 rounded-full border border-vision-cyan animate-pulse pointer-events-none" 
                  style={{ borderColor: body.color }}
                />
              )}
            </div>

            {/* Label and Subtitle */}
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold font-sans tracking-wide text-white group-hover:text-vision-cyan transition-colors">
                {body.name.split(' ')[0]}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {body.subtitle.split(' ')[0]}
              </div>
            </div>

            {/* Active Indicator Pip */}
            {isSelected && (
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: body.color, boxShadow: `0 0 8px ${body.color}` }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
