import React from 'react';
import { X, Sparkles, Orbit, ShieldCheck, Database, Keyboard, Cpu, Layers } from 'lucide-react';
import { soundFx } from '../utils/audioAmbiance';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl vision-glass-panel rounded-3xl overflow-hidden shadow-vision-glass-lg border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-vision-cyan to-vision-violet p-[1px] shadow-glow-cyan">
              <div className="w-full h-full rounded-2xl bg-space-950 flex items-center justify-center">
                <Orbit className="w-5 h-5 text-vision-cyan" />
              </div>
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-white tracking-wide">
                CosmosLens Architecture & visionOS Design
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Spatial Computing Telemetry & Deep Space Exploration Platform
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playVisionClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm text-slate-300 leading-relaxed font-sans">
          
          {/* Spatial Computing Pillar */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Layers className="w-4 h-4 text-vision-cyan" />
              <span>visionOS Spatial Computing Aesthetic</span>
            </div>
            <p className="text-xs text-slate-400">
              Engineered with subpixel specular border highlights, optical frosted glass refraction (<code className="text-vision-cyan">backdrop-filter: blur(28px) saturate(190%)</code>), dynamic Z-depth layering, and floating capsule navigation bars inspired by the Apple Vision Pro operating system.
            </p>
          </div>

          {/* 3D WebGL Engine Pillar */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Cpu className="w-4 h-4 text-vision-violet" />
              <span>Interactive Three.js 3D Orbital Mechanics</span>
            </div>
            <p className="text-xs text-slate-400">
              High-performance WebGL pipeline featuring custom procedural Earth shaders, dynamic atmospheric Fresnel rim lighting, independent rotational cloud layers, and real-time Keplerian orbital propagation for the ISS, Hubble, Starlink fleet, Tiangong, and GOES-16.
            </p>
          </div>

          {/* Resiliency & Fallback */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Resilient GPU Fallback & NASA Open APIs</span>
            </div>
            <p className="text-xs text-slate-400">
              Automatic GPU capability detection with graceful degradation to an interactive 2D Canvas Orbital Radar. Connected with resilient client fallbacks for NASA Open Data APIs (Near-Earth Asteroid Tracking NeoWs, Space Weather DONKI, and NOAA SWPC).
            </p>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-white font-semibold text-xs mb-3 font-mono">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>TACTICAL KEYBOARD SHORTCUTS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Pause / Resume:</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">Space</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Reset View / Earth:</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">1</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Moon / Mars / Jove / JWST:</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">2 - 5</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Close Panels:</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">Esc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/50 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Pedro Medina • Full Stack Portfolio</span>
          <span className="text-vision-cyan">CosmosLens Spatial Engine</span>
        </div>
      </div>
    </div>
  );
}
