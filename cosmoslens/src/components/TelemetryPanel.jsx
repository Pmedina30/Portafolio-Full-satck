import React, { useState, useEffect } from 'react';
import { 
  X, Radio, Compass, Gauge, Zap, Activity, Globe, 
  Satellite, ShieldCheck, Download, ChevronRight, Share2 
} from 'lucide-react';
import { soundFx } from '../utils/audioAmbiance';

export default function TelemetryPanel({ object, onClose, onLockCamera }) {
  const [livePing, setLivePing] = useState(14.8);
  const [liveVelocity, setLiveVelocity] = useState(object?.velocityKmS || 7.66);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('telemetry'); // telemetry | payload | orbit

  // Live dynamic telemetry jitter simulation
  useEffect(() => {
    if (!object) return;
    const interval = setInterval(() => {
      const jitter = (Math.random() - 0.5) * 0.04;
      setLiveVelocity(prev => +(object.velocityKmS + jitter).toFixed(3));
      setLivePing(prev => +(object.signalLatencyMs + (Math.random() - 0.5) * 1.2).toFixed(1));
    }, 1200);
    return () => clearInterval(interval);
  }, [object]);

  if (!object) return null;

  const speedPercentage = Math.min(100, Math.max(10, (liveVelocity / 8.2) * 100));

  const handleCopyTelemetry = () => {
    soundFx.playVisionClick();
    const dataString = JSON.stringify(object, null, 2);
    navigator.clipboard?.writeText(dataString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <aside 
      aria-label="Floating Telemetry Panel"
      className="absolute top-20 right-6 w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-10rem)] z-30 flex flex-col vision-glass-panel rounded-3xl overflow-hidden shadow-vision-glass-lg animate-in fade-in slide-in-from-right-8 duration-300"
    >
      {/* visionOS Top Window Pill Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-vision-cyan/15 border border-vision-cyan/30 text-vision-cyan shadow-glow-cyan">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-white font-sans">
                {object.name}
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              NORAD #{object.noradId} • {object.country}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playVisionClick();
            onClose();
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
          title="Close telemetry card"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Segment Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 bg-black/20 border-b border-white/5">
        {[
          { id: 'telemetry', label: 'Telemetry' },
          { id: 'orbit', label: 'Orbital Ephemeris' },
          { id: 'payload', label: 'Science Payload' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playVisionClick();
              setActiveTab(tab.id);
            }}
            className={`flex-1 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-white/15 text-vision-cyan font-bold border border-white/20 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="p-5 overflow-y-auto space-y-4">
        {activeTab === 'telemetry' && (
          <>
            {/* Speedometer Radial Gauge */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/30 border border-white/10 flex flex-col items-center">
              <div className="relative w-36 h-20 flex items-center justify-center overflow-hidden">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                    strokeDasharray="125 125"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#speedGrad)"
                    strokeWidth="8"
                    strokeDasharray={`${speedPercentage * 1.25} 250`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8A2BE2" />
                      <stop offset="100%" stopColor="#00E5FF" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute bottom-1 text-center">
                  <div className="text-xl font-bold font-mono tracking-tight text-white glow-cyan-text">
                    {liveVelocity}
                  </div>
                  <div className="text-[10px] font-mono text-vision-cyan uppercase tracking-widest">
                    km / sec
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2 px-2 border-t border-white/5 pt-2">
                <span>Equivalent: {(liveVelocity * 3600).toLocaleString()} km/h</span>
                <span className="text-vision-violet">Mach {(liveVelocity / 0.343).toFixed(1)}</span>
              </div>
            </div>

            {/* Real-time Metric Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                  <Gauge className="w-3.5 h-3.5 text-vision-cyan" />
                  <span>Altitude</span>
                </div>
                <div className="mt-1 text-base font-bold font-mono text-white">
                  {object.altitudeKm} <span className="text-xs font-normal text-slate-400">km</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                  <Radio className="w-3.5 h-3.5 text-vision-violet" />
                  <span>Telemetry Latency</span>
                </div>
                <div className="mt-1 text-base font-bold font-mono text-white">
                  {livePing} <span className="text-xs font-normal text-slate-400">ms</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Solar Array</span>
                </div>
                <div className="mt-1 text-base font-bold font-mono text-white">
                  {object.solarArrayOutputKw} <span className="text-xs font-normal text-slate-400">kW</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sub-Satellite Lat</span>
                </div>
                <div className="mt-1 text-base font-bold font-mono text-white">
                  {object.coordinates.lat}°
                </div>
              </div>
            </div>

            {/* Status Description */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
              {object.description}
            </div>
          </>
        )}

        {activeTab === 'orbit' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Orbital Apogee</span>
              <span className="text-white font-bold">{object.apogeeKm} km</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Orbital Perigee</span>
              <span className="text-white font-bold">{object.perigeeKm} km</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Orbital Inclination</span>
              <span className="text-vision-cyan font-bold">{object.inclinationDeg}°</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Orbital Period</span>
              <span className="text-white font-bold">{object.periodMin} minutes</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Downlink Frequency</span>
              <span className="text-amber-400 font-bold">{object.frequencyMhz} MHz</span>
            </div>
          </div>
        )}

        {activeTab === 'payload' && (
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Active Science Experiments & Payloads
            </p>
            {object.experiments?.map((exp, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-slate-200"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-vision-cyan" />
                <span>{exp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar Footer */}
      <div className="p-4 border-t border-white/10 bg-black/40 flex items-center gap-2">
        <button
          onClick={() => {
            soundFx.playGlassPing(1.2);
            onLockCamera(object);
          }}
          className="flex-1 py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-gradient-to-r from-vision-cyan/20 to-vision-violet/20 hover:from-vision-cyan/30 hover:to-vision-violet/30 border border-vision-cyan/40 text-vision-cyan transition-all shadow-glow-cyan"
        >
          <Compass className="w-4 h-4" />
          <span>Lock Camera</span>
        </button>

        <button
          onClick={handleCopyTelemetry}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-colors"
          title="Export Telemetry JSON"
        >
          {isCopied ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
