import React, { useState } from 'react';
import { HOURLY_DEMAND_DATA } from '../data/mockData';
import { HourlyDemand } from '../types';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

interface DemandChartProps {
  data?: HourlyDemand[];
  cityName?: string;
}

export const DemandChart: React.FC<DemandChartProps> = ({
  data = HOURLY_DEMAND_DATA,
  cityName = 'Santo Domingo',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'today' | 'compare'>('today');

  const maxTrips = Math.max(...data.map((d) => d.trips), 1);
  const peakTrips = data.filter((d) => d.isPeak);

  return (
    <div
      id="hourly-demand-chart-card"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between"
    >
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Viajes por hora
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {cityName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curva de demanda horaria y picos de tráfico operacional para {cityName}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setViewMode('today')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'today'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hoy (24h)
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'compare'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vs. Ayer
          </button>
        </div>
      </div>

      {/* Peak Badges Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
              {peakTrips[0]?.hour ? `Pico: ${peakTrips[0].hour}` : 'Pico Matutino'}
            </p>
            <p className="text-sm font-black text-emerald-950 mt-0.5">
              {peakTrips[0]?.trips || 142} viajes
            </p>
          </div>
          <span className="text-xs bg-emerald-200/80 text-emerald-900 font-mono px-1.5 py-0.5 rounded font-bold">
            Pico 1
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
              {peakTrips[1]?.hour ? `Pico: ${peakTrips[1].hour}` : 'Pico Almuerzo'}
            </p>
            <p className="text-sm font-black text-slate-900 mt-0.5">
              {peakTrips[1]?.trips || 118} viajes
            </p>
          </div>
          <span className="text-xs bg-slate-200 text-slate-800 font-mono px-1.5 py-0.5 rounded font-bold">
            Pico 2
          </span>
        </div>

        <div className="bg-emerald-600 text-white rounded-xl p-2.5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
              Pico Máximo Diario
            </p>
            <p className="text-sm font-black text-white mt-0.5">
              {peakTrips[2]?.hour || '06:30 PM'} · {peakTrips[2]?.trips || maxTrips} viajes
            </p>
          </div>
          <span className="text-xs bg-emerald-700 text-white font-mono px-1.5 py-0.5 rounded font-bold">
            🔥 Top
          </span>
        </div>
      </div>

      {/* Stylized Modern CSS/SVG Bar Chart */}
      <div className="relative pt-6 pb-2">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
        </div>

        {/* Hover Tooltip Floating Card */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="absolute top-0 right-4 z-20 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-xs border border-slate-700 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <span>{data[hoveredIndex].hour}</span>
              {data[hoveredIndex].isPeak && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-[10px]">
                  Pico de Demanda
                </span>
              )}
            </div>
            <div className="space-y-0.5 text-slate-300">
              <p>
                Viajes:{' '}
                <span className="font-bold text-white">
                  {data[hoveredIndex].trips} viajes
                </span>
              </p>
              <p>
                Facturación:{' '}
                <span className="font-bold text-emerald-400 font-mono">
                  RD$ {data[hoveredIndex].revenueDOP.toLocaleString('es-DO')}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Bars Container */}
        <div className="relative h-44 flex items-end justify-between gap-1.5 z-10 px-1">
          {data.map((item, index) => {
            const heightPercent = (item.trips / maxTrips) * 100;
            const isHovered = hoveredIndex === index;
            const isPeak = item.isPeak;

            return (
              <div
                key={item.hour}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Bar Value on top if peak or hovered */}
                {(isPeak || isHovered) && (
                  <span
                    className={`text-[10px] font-mono font-bold mb-1 transition-all ${
                      isPeak ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {item.trips}
                  </span>
                )}

                {/* Animated Bar with Tailwind Emerald Palette */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 relative ${
                    isPeak
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/30 ring-2 ring-emerald-500/20'
                      : isHovered
                      ? 'bg-emerald-500'
                      : 'bg-emerald-500/80 hover:bg-emerald-500'
                  }`}
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/40 rounded-t-lg" />
                </div>

                {/* Hour Label */}
                <span
                  className={`text-[10px] font-medium mt-2 transition-colors truncate max-w-[38px] text-center ${
                    isPeak
                      ? 'text-emerald-700 font-bold'
                      : isHovered
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {item.hour.replace(':00', '').replace(' ', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Insights Note */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Multiplicador dinámico activo en cuadrantes con alta demanda ({cityName})</span>
        </div>
        <span className="font-semibold text-emerald-600 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Tasa de cumplimiento: 98.1%
        </span>
      </div>
    </div>
  );
};
