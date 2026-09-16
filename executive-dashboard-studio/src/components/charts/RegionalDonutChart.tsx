import React, { useState } from 'react';
import { RegionDistribution, BrandingTheme } from '../../types/dashboard';
import { Globe2 } from 'lucide-react';

interface RegionalDonutChartProps {
  data: RegionDistribution[];
  totalVolume: number;
  brand?: BrandingTheme;
  theme?: BrandingTheme;
  title?: string;
  subtitle?: string;
}

const DEFAULT_THEME: BrandingTheme = {
  companyName: 'Arajet Airlines',
  logoUrl: '',
  primaryColor: '#0B1340',
  accentColor: '#6B21A8',
  highlightColor: '#00C3DE',
  dashboardTitle: 'DASHBOARD OPERATIVO EJECUTIVO',
  dashboardSubtitle: 'Centro de Control de Operaciones (IOCC) · Puntualidad & Desvíos',
  periodLabel: '1 - 15 Septiembre 2026'
};

export const RegionalDonutChart: React.FC<RegionalDonutChartProps> = ({
  data,
  totalVolume,
  brand,
  theme,
  title = 'Distribución Geográfica / Red',
  subtitle = 'Participación operativa por mercado'
}) => {
  const currentBrand = brand || theme || DEFAULT_THEME;
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // SVG Geometry Constants
  const size = 200;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate segment stroke dashes
  let cumulativePercentage = 0;
  const segments = data.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
    cumulativePercentage += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const activeItem = hoveredRegion 
    ? data.find(d => d.region === hoveredRegion) 
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {data.length} Regiones
        </span>
      </div>

      {/* Main Chart Body: Donut + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto py-2">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90 origin-center"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
            />

            {/* Colored Segment Rings */}
            {segments.map((seg) => {
              const isHovered = hoveredRegion === seg.region;
              return (
                <circle
                  key={seg.region}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredRegion(seg.region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
              );
            })}
          </svg>

          {/* Center Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {activeItem ? activeItem.region : 'Volumen Total'}
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">
              {activeItem ? `${activeItem.percentage}%` : totalVolume.toLocaleString()}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {activeItem ? `${activeItem.count} ops` : 'Operaciones'}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2.5">
          {data.map((item) => {
            const isHovered = hoveredRegion === item.region;
            return (
              <div
                key={item.region}
                className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  isHovered 
                    ? 'border-slate-300 bg-slate-50 shadow-sm' 
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50/60'
                }`}
                onMouseEnter={() => setHoveredRegion(item.region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.region}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.count} ops · OTP: <span className="font-semibold text-slate-700">{item.otpRate}%</span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-slate-900">{item.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] font-medium text-slate-400">Distribución de red en tiempo real</span>
        <span className="font-semibold text-slate-700">Hub Principal: SDQ</span>
      </div>
    </div>
  );
};

