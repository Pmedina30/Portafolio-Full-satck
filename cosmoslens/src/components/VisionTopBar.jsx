import React, { useState, useEffect } from 'react';
import { 
  Compass, Clock, Sun, Volume2, VolumeX, Eye, 
  Orbit, Play, Pause, FastForward, Info 
} from 'lucide-react';
import { soundFx } from '../utils/audioAmbiance';

export default function VisionTopBar({
  timeMultiplier,
  setTimeMultiplier,
  isPaused,
  setIsPaused,
  onOpenSpaceWeather,
  isAudioEnabled,
  onToggleAudio,
  use2DFallback,
  onToggle2DMode,
  onOpenAbout
}) {
  const [utcTime, setUtcTime] = useState('');
  const [julianDate, setJulianDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
      // Julian Date approximation
      const jd = (now.getTime() / 86400000 + 2440587.5).toFixed(3);
      setJulianDate(`JD ${jd}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      aria-label="Top Controls Bar"
      className="absolute top-4 left-6 right-6 z-30 flex items-center justify-between pointer-events-none"
    >
      {/* Brand & Mission Status Pill */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full vision-pill shadow-vision-glass group cursor-default">
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-vision-cyan to-vision-violet p-[1px] shadow-glow-cyan">
            <div className="w-full h-full rounded-full bg-space-950 flex items-center justify-center">
              <Orbit className="w-4 h-4 text-vision-cyan animate-spin duration-3000" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wider font-sans text-white glow-cyan-text">
                COSMOSLENS
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-vision-cyan/20 text-vision-cyan border border-vision-cyan/30">
                visionOS v2.4
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Orbital Telemetry & Deep Space Data
            </p>
          </div>
        </div>

        {/* Space Weather Status Pill */}
        <button
          onClick={() => {
            soundFx.playGlassPing(1.2);
            onOpenSpaceWeather();
          }}
          className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-full vision-pill text-xs font-mono text-slate-300 hover:text-white transition-all pointer-events-auto"
          title="Open Space Climate & Radiation Observatory"
        >
          <Sun className="w-4 h-4 text-amber-400 animate-spin duration-3000" />
          <span>Kp 3.7 • SW 472 km/s</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        </button>
      </div>

      {/* Center Time Warp Controls */}
      <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full vision-pill pointer-events-auto shadow-vision-glass">
        <button
          onClick={() => {
            soundFx.playVisionClick();
            setIsPaused(!isPaused);
          }}
          className={`p-2 rounded-full transition-all ${
            isPaused
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title={isPaused ? 'Resume Simulation (Space)' : 'Pause Simulation (Space)'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {[
          { label: '1x', val: 1 },
          { label: '5x', val: 5 },
          { label: '60x', val: 60 }
        ].map((speed) => (
          <button
            key={speed.val}
            onClick={() => {
              soundFx.playVisionClick();
              setTimeMultiplier(speed.val);
              setIsPaused(false);
            }}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-full transition-all ${
              timeMultiplier === speed.val && !isPaused
                ? 'bg-vision-cyan/20 text-vision-cyan font-bold border border-vision-cyan/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {speed.label}
          </button>
        ))}
      </div>

      {/* Right Controls Pill: UTC Clock, Audio, 2D/3D Toggle */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full vision-pill font-mono text-[11px] text-slate-300">
          <Clock className="w-3.5 h-3.5 text-vision-cyan" />
          <span>{utcTime}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{julianDate}</span>
        </div>

        {/* Spatial Audio Synthesizer Toggle */}
        <button
          onClick={onToggleAudio}
          className={`w-9 h-9 rounded-full flex items-center justify-center vision-pill transition-all ${
            isAudioEnabled
              ? 'text-vision-cyan border-vision-cyan/50 shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
          title={isAudioEnabled ? 'Mute Deep Space Synthesizer' : 'Enable Space Audio Ambiance'}
        >
          {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* 2D / 3D Mode Toggle */}
        <button
          onClick={onToggle2DMode}
          className={`px-3 py-1.5 rounded-full vision-pill font-mono text-xs flex items-center gap-1.5 transition-all ${
            use2DFallback
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'text-vision-cyan hover:text-white'
          }`}
          title="Switch between WebGL 3D Globe and 2D Orbital Radar"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{use2DFallback ? '2D Radar' : '3D Orbit'}</span>
        </button>

        {/* About Dialog Trigger */}
        <button
          onClick={() => {
            soundFx.playVisionClick();
            onOpenAbout();
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center vision-pill text-slate-400 hover:text-white"
          title="About CosmosLens & NASA APIs"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
