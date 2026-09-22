'use client';

import React, { useState } from 'react';
import { TimeSeriesPoint, ActiveMetricTab } from '../types/pulseops';
import { Activity, Layers, Zap } from 'lucide-react';

interface PulseTimeSeriesChartProps {
  data: TimeSeriesPoint[];
}

export const PulseTimeSeriesChart: React.FC<PulseTimeSeriesChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<ActiveMetricTab>('SLA');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const metricConfig = {
    SLA: {
      label: 'SLA Compliance Rate (%)',
      key: 'sla' as const,
      unit: '%',
      strokeColor: '#10b981', // Emerald
      gradientId: 'pulseSlaGradient',
      minY: 97.0,
      maxY: 100.0,
      referenceValue: 99.0,
      referenceLabel: 'Target SLA: 99.0%',
    },
    VOLUME: {
      label: 'Ticket Volume Inflow',
      key: 'volume' as const,
      unit: ' tickets',
      strokeColor: '#3b82f6', // Blue
      gradientId: 'pulseVolumeGradient',
      minY: 0,
      maxY: 60,
      referenceValue: 40.0,
      referenceLabel: 'Shift Peak Threshold',
    },
    MTTR: {
      label: 'Mean Time to Resolve (MTTR)',
      key: 'mttr' as const,
      unit: ' min',
      strokeColor: '#a855f7', // Purple
      gradientId: 'pulseMttrGradient',
      minY: 10,
      maxY: 30,
      referenceValue: 20.0,
      referenceLabel: 'SLA Limit: 20m',
    },
  };

  const current = metricConfig[activeTab];

  // Chart Geometry Coordinates (ViewBox: 800 x 260)
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getY = (val: number) => {
    const clamped = Math.max(current.minY, Math.min(current.maxY, val));
    const ratio = (clamped - current.minY) / (current.maxY - current.minY);
    return paddingTop + (1 - ratio) * chartHeight;
  };

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  // Build SVG Path with smooth cubic curves
  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d[current.key]),
  }));

  const buildPath = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const linePath = buildPath();
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0},${
    paddingTop + chartHeight
  } L ${points[0]?.x || 0},${paddingTop + chartHeight} Z`;

  const referenceY = getY(current.referenceValue);
  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md relative overflow-hidden">
      {/* Chart Header & Metric Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Operational Velocity & SLA Telemetry
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Resolución horaria continua con detección automática de anomalías y límites de turno
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('SLA')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              activeTab === 'SLA'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            SLA Rate
          </button>
          <button
            onClick={() => setActiveTab('VOLUME')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              activeTab === 'VOLUME'
                ? 'bg-zinc-800 text-blue-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            Ticket Volume
          </button>
          <button
            onClick={() => setActiveTab('MTTR')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              activeTab === 'MTTR'
                ? 'bg-zinc-800 text-purple-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            MTTR Velocity
          </button>
        </div>
      </div>

      {/* SVG Interactive Area Chart Container */}
      <div className="relative w-full h-72">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={current.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={current.strokeColor} stopOpacity={0.35} />
              <stop offset="90%" stopColor={current.strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((step, idx) => {
            const y = paddingTop + step * chartHeight;
            const val = current.maxY - step * (current.maxY - current.minY);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#27272a"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val.toFixed(current.unit === '%' ? 1 : 0)}
                  {current.unit === '%' ? '%' : ''}
                </text>
              </g>
            );
          })}

          {/* Reference Threshold Line */}
          <line
            x1={paddingLeft}
            y1={referenceY}
            x2={svgWidth - paddingRight}
            y2={referenceY}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={svgWidth - paddingRight - 4}
            y={referenceY - 6}
            textAnchor="end"
            fill="#f59e0b"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {current.referenceLabel}
          </text>

          {/* Filled Gradient Area */}
          <path d={areaPath} fill={`url(#${current.gradientId})`} />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke={current.strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X Axis Time Labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                <text
                  x={x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : '#71717a'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {d.time}
                </text>
              </g>
            );
          })}

          {/* Interactive Hover Vertical Crosshair & Detection zones */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d[current.key]);
            const isHovered = hoveredIndex === i;
            const colWidth = chartWidth / data.length;

            return (
              <g key={i}>
                {/* Invisible hover trigger rectangle */}
                <rect
                  x={x - colWidth / 2}
                  y={paddingTop}
                  width={colWidth}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoveredIndex(i)}
                />

                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + chartHeight}
                      stroke="#52525b"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill={current.strokeColor}
                      stroke="#09090b"
                      strokeWidth="2"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Rich Dark Floating Tooltip */}
        {activeItem && hoveredIndex !== null && (
          <div
            className="pointer-events-none absolute top-4 rounded-xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-md min-w-[190px] transition-all"
            style={{
              left: `${Math.min(
                Math.max(10, (getX(hoveredIndex) / svgWidth) * 100 - 15),
                70
              )}%`,
            }}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
              <span className="font-mono text-xs font-semibold text-zinc-200">
                {activeItem.time} hrs
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {activeItem.shift} Shift
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">SLA Compliance:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {activeItem.sla}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Tickets Inflow:</span>
                <span className="font-mono font-bold text-blue-400">
                  {activeItem.volume}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">MTTR:</span>
                <span className="font-mono font-bold text-purple-400">
                  {activeItem.mttr} min
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
