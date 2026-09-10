import React from 'react';
import { Sparkles, ShoppingBag, RotateCw, Volume2, VolumeX, Cpu, Layers } from 'lucide-react';

export default function Navbar({ 
  scrollPercent, 
  isInspectMode, 
  onToggleInspect, 
  isAudioPlaying, 
  onToggleAudio, 
  onOpenCart, 
  cartCount,
  onOpenSpecs
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Model Tag */}
        <div className="flex items-center gap-3 pointer-events-auto cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition transform">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-black tracking-widest text-white">NEXUS<span className="text-cyan-400">-01</span></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                PRO GEN-2
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Cybernetic Spatial Audio</p>
          </div>
        </div>

        {/* Center Progress Indicator & 3D Interactive Controls */}
        <div className="hidden md:flex items-center gap-2 glass-panel px-4 py-2 rounded-full pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 border-r border-slate-700 pr-3">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D SCENE:</span>
            <span className="text-cyan-400 font-bold">{scrollPercent}%</span>
          </div>

          <button
            onClick={onToggleInspect}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold transition ${
              isInspectMode 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isInspectMode ? 'animate-spin' : ''}`} />
            <span>{isInspectMode ? 'Exit 360°' : 'Inspect 3D'}</span>
          </button>

          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? 'Mute Ambient Audio' : 'Play Cyber Ambient Audio'}
            className="p-1 text-slate-400 hover:text-cyan-400 transition"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Right CTA & Cart */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={onOpenSpecs}
            className="hidden sm:flex text-xs font-mono uppercase font-bold text-slate-300 hover:text-cyan-400 glass-panel px-4 py-2.5 rounded-xl transition"
          >
            Full Specs
          </button>

          <button
            onClick={onOpenCart}
            className="relative glass-panel p-2.5 rounded-xl text-white hover:border-cyan-500/60 transition group"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-lg shadow-cyan-500/40">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="text-xs sm:text-sm font-bold tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
          >
            Pre-Order • $499
          </button>
        </div>

      </div>
    </header>
  );
}

