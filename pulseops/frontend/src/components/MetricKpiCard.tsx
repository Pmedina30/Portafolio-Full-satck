'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { KpiMetric } from '../types/pulseops';

interface MetricKpiCardProps {
  metric: KpiMetric;
}

export const MetricKpiCard: React.FC<MetricKpiCardProps> = ({ metric }) => {
  // Generate lightweight SVG path for sparkline
  const min = Math.min(...metric.sparkline);
  const max = Math.max(...metric.sparkline);
  const range = max - min || 1;
  const width = 100;
  const height = 30;

  const points = metric.sparkline
    .map((val, idx) => {
      const x = (idx / (metric.sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor =
    metric.status === 'critical'
      ? '#f43f5e' // Rose
      : metric.status === 'warning'
      ? '#f59e0b' // Amber
      : '#10b981'; // Emerald

  return (
    <div className="relative group overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/70 shadow-sm">
      {/* Subtle top border illumination */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent group-hover:via-zinc-500/50 transition-colors" />

      {/* Header & Status Indicator */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase font-mono">
          {metric.title}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              metric.status === 'healthy'
                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                : metric.status === 'warning'
                ? 'bg-amber-500'
                : 'bg-rose-500 animate-pulse'
            }`}
          />
        </div>
      </div>

      {/* Main Metric Value & Sparkline */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100 font-mono">
            {metric.value}
          </div>
          {/* Trend & Comparison */}
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`inline-flex items-center text-xs font-medium font-mono px-1.5 py-0.5 rounded-md ${
                metric.isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {metric.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {metric.trend}
            </span>
            <span className="text-[11px] text-zinc-500 truncate">{metric.comparisonText}</span>
          </div>
        </div>

        {/* Inline Micro-Sparkline */}
        <div className="w-24 h-10 flex-shrink-0 self-end">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
