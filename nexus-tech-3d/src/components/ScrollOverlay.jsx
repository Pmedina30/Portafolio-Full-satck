import React from 'react';
import { 
  ChevronDown, Sparkles, Cpu, Zap, Activity, Check, 
  Shield, Volume2, ArrowRight, Star, ShoppingBag, Radio 
} from 'lucide-react';

export default function ScrollOverlay({ 
  selectedColor, 
  onSelectColor, 
  onAddToCart, 
  onOpenSpecs,
  scrollProgress 
}) {
  const colorways = [
    { id: 'obsidian', name: 'Obsidian Cyber', hex: '#111827', accent: '#06b6d4' },
    { id: 'cyan', name: 'Neon Cyberpunk', hex: '#0e7490', accent: '#22d3ee' },
    { id: 'silver', name: 'Titanium Silver', hex: '#d1d5db', accent: '#38bdf8' },
    { id: 'violet', name: 'Cosmic Nebula', hex: '#581c87', accent: '#c084fc' }
  ];

  return (
    <div className="relative z-10 pointer-events-none">

      {/* STAGE 1: HERO OVERLAY (0% -> 25%) */}
      <section className="min-h-screen flex flex-col justify-between items-center text-center px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto space-y-6 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-cyan-300 text-xs font-mono font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>GEN-2 NEURAL ACOUSTIC ENGINE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-none">
            Hear Beyond <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent glow-text-cyan">
              Perception.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            The world’s first cybernetic planar headphones powered by real-time neural beamforming and aerospace titanium drivers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onAddToCart(selectedColor)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pre-Order • $499</span>
            </button>

            <button
              onClick={onOpenSpecs}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel text-slate-300 hover:text-white font-mono text-xs uppercase font-bold tracking-wider transition hover:border-cyan-500/50"
            >
              System Specs
            </button>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-slate-500 font-mono text-[11px] tracking-widest uppercase animate-bounce pt-8">
          <span>Scroll to Explode 3D Architecture</span>
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        </div>
      </section>

      {/* STAGE 2: EXPLODED ENGINEERING (25% -> 55%) */}
      <section className="min-h-screen flex items-center justify-start px-4 sm:px-12 lg:px-20 py-24">
        <div className="max-w-md space-y-6 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>INTERNAL KINEMATICS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Exploded Modular Architecture.
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed">
            Every layer meticulously deconstructed. Engineered with precision CNC milled aircraft aluminum and ultra-low resonance acoustic dampening cavities.
          </p>

          <div className="space-y-3 pt-2">
            <div className="glass-panel p-4 rounded-2xl border-l-2 border-l-cyan-400 space-y-1">
              <div className="text-xs font-mono font-bold text-cyan-300">01 / NEURAL-16 DSP CORE</div>
              <div className="text-sm font-bold text-white">Quantum Spatial Beamforming</div>
              <p className="text-xs text-slate-400">Processes 32-bit floating audio streams in under 0.8ms latency.</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-l-2 border-l-violet-400 space-y-1">
              <div className="text-xs font-mono font-bold text-violet-300">02 / 50MM BERYLLIUM DRIVERS</div>
              <div className="text-sm font-bold text-white">Planar Magnetic Diaphragm</div>
              <p className="text-xs text-slate-400">Delivering surgical bass depth down to 4Hz without harmonic distortion.</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-l-2 border-l-sky-400 space-y-1">
              <div className="text-xs font-mono font-bold text-sky-300">03 / CRYO-GEL CUSHIONS</div>
              <div className="text-sm font-bold text-white">Zero-Fatigue Memory Foam</div>
              <p className="text-xs text-slate-400">Custom tailored acoustic seal maintaining passive isolation up to 28dB.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 3: DRIVER & SPATIAL AUDIO (55% -> 75%) */}
      <section className="min-h-screen flex items-center justify-end px-4 sm:px-12 lg:px-20 py-24">
        <div className="max-w-md space-y-6 text-right pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-800 text-violet-300 text-xs font-mono ml-auto">
            <Activity className="w-3.5 h-3.5" />
            <span>ACOUSTIC PURITY</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Immersion In Macro Detail.
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed">
            Direct acoustic coupling aligns soundwaves directly into your ear canal, creating an expansive three-dimensional holographic soundstage.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-left">
            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">Frequency Range</span>
              <span className="text-2xl font-black text-white">4Hz – 52kHz</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Studio Master Class</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">Harmonic Distortion</span>
              <span className="text-2xl font-black text-white">&lt; 0.002%</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">True Audio Fidelity</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">Active ANC</span>
              <span className="text-2xl font-black text-white">-45 dB</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Adaptive Neural Null</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">Battery Life</span>
              <span className="text-2xl font-black text-white">48 Hours</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Continuous Playback</span>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 4: LIVE 3D COLORWAY CUSTOMIZER (75% -> 90%) */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-24">
        <div className="max-w-xl mx-auto space-y-6 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE 3D FINISH</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Choose Your Aesthetic
          </h2>

          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Click any colorway below to watch the 3D model's aerospace alloy, anodized finish, and LED pulse rings update dynamically in real time.
          </p>

          {/* Colorway Swatches */}
          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
            {colorways.map((cw) => (
              <button
                key={cw.id}
                onClick={() => onSelectColor(cw.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel transition duration-200 ${
                  selectedColor === cw.id 
                    ? 'border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-500/20 scale-105' 
                    : 'hover:border-slate-600 opacity-75 hover:opacity-100'
                }`}
              >
                <span 
                  className="w-5 h-5 rounded-full border border-white/20 shadow-inner flex items-center justify-center"
                  style={{ backgroundColor: cw.hex }}
                >
                  {selectedColor === cw.id && <Check className="w-3 h-3 text-white" />}
                </span>
                <span className="text-xs font-mono font-bold text-white">{cw.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STAGE 5: FINAL HERO & PRE-ORDER (90% -> 100%) */}
      <section className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="max-w-3xl w-full glass-panel p-8 sm:p-12 rounded-3xl border border-slate-700/60 shadow-2xl space-y-8 pointer-events-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">NEXUS-01</span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  FLAGSHIP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Selected Edition: <span className="text-white capitalize font-bold">{selectedColor}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-white font-mono">$499</span>
              <span className="text-xs text-slate-500 block">Free Global Insured Delivery</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <strong className="block text-white mb-1">What's In The Box</strong>
              <p className="text-slate-400 leading-relaxed">
                NEXUS-01 Headset, Magnetic Armor Case, 4.4mm Silver Cable, USB-C 96kHz DAC.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <strong className="block text-white mb-1">Warranty & Trial</strong>
              <p className="text-slate-400 leading-relaxed">
                3-Year Comprehensive Hardware Warranty & 60-Day Risk-Free Audio Trial.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <strong className="block text-white mb-1">Audiophile Verified</strong>
              <div className="flex items-center gap-1 text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-white text-[11px] ml-1 font-mono">4.9/5 (820+)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => onAddToCart(selectedColor)}
              className="flex-1 py-4 px-8 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • $499</span>
            </button>

            <button
              onClick={onOpenSpecs}
              className="px-6 py-4 rounded-2xl glass-panel text-slate-300 hover:text-white font-mono text-xs uppercase font-bold tracking-wider transition"
            >
              Compare Specifications
            </button>
          </div>

          <div className="text-center text-[11px] font-mono text-slate-500 pt-4 border-t border-slate-800">
            &copy; 2026 NEXUS AUDIO LABS. Real-time Three.js WebGL rendering.
          </div>

        </div>
      </section>

    </div>
  );
}

