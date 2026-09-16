import React, { useState } from 'react';
import { TimeSeriesPoint, BrandingTheme } from '../../types/dashboard';
import { TrendingUp, Target, Calendar } from 'lucide-react';

interface PunctualityTrendChartProps {
  data: TimeSeriesPoint[];
  brand: BrandingTheme;
}

export const PunctualityTrendChart: React.FC<PunctualityTrendChartProps> = ({ data, brand }) => {
  const [hoveredPoint, setHoveredPoint] = useState<TimeSeriesPoint | null>(null);
  const [hoveredPos, setHoveredPos] = useState<{ x: number; y: number } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center h-72 text-xs text-slate-400">
        No hay datos temporales disponibles
      </div>
    );
  }

  const width = 600;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const minVal = 50;
  const maxVal = 100;

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const normalized = (clamped - minVal) / (maxVal - minVal);
    return padding.top + graphHeight - normalized * graphHeight;
  };

  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (data.length - 1)) * graphWidth;
  };

  // Build curved SVG path (Monotone / Catmull-Rom like cubic beziers)
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.otpPercentage), raw: d }));
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  // Area path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1]?.x || 0} ${padding.top + graphHeight} L ${points[0]?.x || 0} ${padding.top + graphHeight} Z`;

  // Target benchmark line Y (e.g. 85%)
  const targetY = getY(85);

  const avgOtp = Number((data.reduce((acc, d) => acc + d.otpPercentage, 0) / data.length).toFixed(1));

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between print-card relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-navy-950 tracking-tight">
              Tendencia de Puntualidad Diaria (OTP)
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-corporate-emerald border border-emerald-200">
              Promedio: {avgOtp}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Desempeño diario vs. meta corporativa (85.0%)
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-corporate-cyan rounded-full inline-block" />
            <span>OTP %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-rose-400 inline-block" />
            <span>Meta 85%</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-56">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={brand.highlightColor || '#00C3DE'} stopOpacity="0.35" />
              <stop offset="100%" stopColor={brand.highlightColor || '#00C3DE'} stopOpacity="0.0" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0B1340" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[60, 70, 80, 90, 100].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray={level === 85 ? '4 4' : undefined}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Target benchmark dashed line */}
          <line
            x1={padding.left}
            y1={targetY}
            x2={width - padding.right}
            y2={targetY}
            stroke="#F43F5E"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.75"
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Curved Line */}
          <path
            d={pathD}
            fill="none"
            stroke={brand.highlightColor || '#00C3DE'}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          {/* Markers & Interaction Targets */}
          {points.map((pt, idx) => {
            const isHovered = hoveredPoint?.period === pt.raw.period;
            return (
              <g
                key={idx}
                onMouseEnter={() => {
                  setHoveredPoint(pt.raw);
                  setHoveredPos({ x: pt.x, y: pt.y });
                }}
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setHoveredPos(null);
                }}
                className="cursor-pointer group"
              >
                {/* Outer halo on hover */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8"
                    fill={brand.highlightColor || '#00C3DE'}
                    opacity="0.3"
                  />
                )}
                {/* Marker Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#FFFFFF"
                  stroke={pt.raw.otpPercentage >= 85 ? '#10B981' : '#F43F5E'}
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* X Axis labels */}
          {data.map((d, i) => {
            if (data.length > 10 && i % 2 !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={d.period}
                x={getX(i)}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-400 font-medium"
              >
                {d.period}
              </text>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && hoveredPos && (
          <div
            style={{
              left: `${(hoveredPos.x / width) * 100}%`,
              top: `${(hoveredPos.y / height) * 100}%`
            }}
            className="absolute transform -translate-x-1/2 -translate-y-full -mt-3 bg-navy-950 text-white p-2.5 rounded-xl shadow-2xl border border-white/10 text-xs pointer-events-none z-30 whitespace-nowrap"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-1 mb-1 font-bold text-slate-300">
              <span>{hoveredPoint.period}</span>
              <span className={`px-1.5 py-0.2 rounded font-black ${
                hoveredPoint.otpPercentage >= 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {hoveredPoint.otpPercentage}% OTP
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 text-[11px] text-slate-300">
              <span>Total Vuelos: <strong>{hoveredPoint.total}</strong></span>
              <span>A Tiempo: <strong className="text-emerald-400">{hoveredPoint.onTime}</strong></span>
              <span>Demorados: <strong className="text-amber-400">{hoveredPoint.delayed}</strong></span>
              <span>Cancelados: <strong className="text-rose-400">{hoveredPoint.cancelled}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
