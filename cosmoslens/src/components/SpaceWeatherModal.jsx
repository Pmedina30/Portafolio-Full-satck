import React, { useState } from 'react';
import { 
  X, Sun, Zap, ShieldAlert, Activity, Wind, Flame, 
  TrendingUp, Radio, AlertTriangle, RefreshCw 
} from 'lucide-react';
import { SPACE_WEATHER_INITIAL } from '../data/orbitalData';
import { soundFx } from '../utils/audioAmbiance';

export default function SpaceWeatherModal({ isOpen, onClose }) {
  const [weatherData, setWeatherData] = useState(SPACE_WEATHER_INITIAL);
  const [selectedMetric, setSelectedMetric] = useState('wind'); // wind | kp | bz | flux
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    soundFx.playGlassPing(1.4);
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate live NOAA/DONKI telemetry update
      setWeatherData(prev => ({
        ...prev,
        solarWindSpeedKmS: +(450 + Math.random() * 60).toFixed(1),
        kpIndex: +(3.2 + Math.random() * 1.2).toFixed(2),
        interplanetaryMagneticFieldBz: +(-1.5 - Math.random() * 2.5).toFixed(1),
      }));
      setIsRefreshing(false);
    }, 800);
  };

  // Helper for generating smooth SVG curve
  const points = weatherData.telemetryHistory.map((item, i) => {
    let val = item.wind;
    if (selectedMetric === 'kp') val = item.kp * 100;
    if (selectedMetric === 'bz') val = (item.bz + 10) * 25;
    if (selectedMetric === 'flux') val = item.flux * 80;

    const x = 30 + i * (520 / (weatherData.telemetryHistory.length - 1));
    // Normalize into SVG height [20, 160]
    const minVal = selectedMetric === 'wind' ? 380 : selectedMetric === 'kp' ? 100 : 0;
    const maxVal = selectedMetric === 'wind' ? 520 : selectedMetric === 'kp' ? 600 : 500;
    const y = 160 - ((val - minVal) / (maxVal - minVal)) * 130;
    return { x, y, raw: item[selectedMetric], time: item.time };
  });

  const pathD = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="space-weather-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl vision-glass-panel rounded-3xl overflow-hidden shadow-vision-glass-lg border border-white/20">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg">
              <Sun className="w-5 h-5 animate-spin duration-1000" />
            </div>
            <div>
              <h2 id="space-weather-title" className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Solar Climate & Space Radiation Observatory
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-vision-cyan/20 text-vision-cyan border border-vision-cyan/30">
                  NOAA SWPC LIVE
                </span>
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Heliospheric Telemetry • Van Allen Belts • Geomagnetic Storm Forecaster
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFx.playVisionClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Key Metrics Pill Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Planetary Kp</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {weatherData.kpIndex} <span className="text-xs font-normal text-slate-400">/ 9.0</span>
              </div>
              <div className="text-[11px] text-amber-300/80 font-mono mt-0.5">
                G1-Minor Storm Alert
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Solar Wind</span>
                <Wind className="w-4 h-4 text-vision-cyan" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {weatherData.solarWindSpeedKmS} <span className="text-xs font-normal text-slate-400">km/s</span>
              </div>
              <div className="text-[11px] text-vision-cyan/80 font-mono mt-0.5">
                Density: {weatherData.solarWindDensityPcm3} p/cm³
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>IMF Bz Vector</span>
                <Activity className="w-4 h-4 text-vision-violet" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {weatherData.interplanetaryMagneticFieldBz} <span className="text-xs font-normal text-slate-400">nT</span>
              </div>
              <div className="text-[11px] text-vision-violet/80 font-mono mt-0.5">
                Southward Reconnection
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>GOES X-Ray Flare</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {weatherData.xrayFlareClass} <span className="text-xs font-normal text-slate-400">Flare</span>
              </div>
              <div className="text-[11px] text-rose-400/80 font-mono mt-0.5">
                Active Region AR3590
              </div>
            </div>
          </div>

          {/* Interactive Timeline Graph Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-black/30 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-vision-cyan" />
                  Chronological Telemetry Stream (Last 24 Hours)
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Continuous sensor readings from ACE & DSCOVR deep space probes
                </p>
              </div>

              {/* Metric Selector Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
                {[
                  { id: 'wind', label: 'Solar Wind' },
                  { id: 'kp', label: 'Kp Index' },
                  { id: 'bz', label: 'IMF Bz' },
                  { id: 'flux', label: 'Radiation' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      soundFx.playVisionClick();
                      setSelectedMetric(btn.id);
                    }}
                    className={`px-3 py-1 text-[11px] font-mono rounded-lg transition-all ${
                      selectedMetric === btn.id
                        ? 'bg-vision-cyan/20 text-vision-cyan border border-vision-cyan/40 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Visualizer Curve */}
            <div className="relative w-full h-48 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 580 180">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#8A2BE2" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8A2BE2" />
                    <stop offset="50%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#00E676" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="30" y1="40" x2="550" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="30" y1="90" x2="550" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="30" y1="140" x2="550" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                {/* Filled Area */}
                <path d={areaD} fill="url(#curveGradient)" />

                {/* Smooth Glowing Curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#strokeGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
                />

                {/* Data Points */}
                {points.map((p, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#02040a"
                      stroke="#00E5FF"
                      strokeWidth="2.5"
                      className="group-hover:r-6 transition-all"
                    />
                    <text
                      x={p.x}
                      y="175"
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {p.time}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Advisory & Aurora Forecast Alert Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-white block mb-0.5">Aurora Borealis / Australis Window:</strong>
              Auroral oval expanded towards 55° geomagnetic latitude. Spacecraft in LEO orbits may experience slight atmospheric drag amplification; GPS single-frequency receiver ionospheric jitter within acceptable parameters.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>DSCOVR Lagrangian L1 Sentinel</span>
          <span className="text-vision-cyan">Solar Cycle 25 Phase: Maximum Approaching</span>
        </div>
      </div>
    </div>
  );
}
