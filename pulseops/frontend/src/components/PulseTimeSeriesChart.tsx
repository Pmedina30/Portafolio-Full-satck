'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { TimeSeriesPoint, ActiveMetricTab } from '../types/pulseops';
import { Activity, Layers, Zap } from 'lucide-react';

interface PulseTimeSeriesChartProps {
  data: TimeSeriesPoint[];
}

export const PulseTimeSeriesChart: React.FC<PulseTimeSeriesChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<ActiveMetricTab>('SLA');

  const metricConfig = {
    SLA: {
      label: 'SLA Compliance Rate (%)',
      dataKey: 'sla',
      unit: '%',
      stroke: '#10b981', // Emerald
      fillGradient: 'slaGradient',
      domain: [97, 100],
      referenceValue: 99.0,
      referenceLabel: 'Target SLA: 99.0%',
    },
    VOLUME: {
      label: 'Ticket Volume Inflow',
      dataKey: 'volume',
      unit: ' tickets',
      stroke: '#3b82f6', // Blue
      fillGradient: 'volumeGradient',
      domain: [0, 60],
      referenceValue: 40.0,
      referenceLabel: 'Shift Peak Threshold',
    },
    MTTR: {
      label: 'Mean Time to Resolve (MTTR)',
      dataKey: 'mttr',
      unit: ' min',
      stroke: '#a855f7', // Purple
      fillGradient: 'mttrGradient',
      domain: [10, 30],
      referenceValue: 20.0,
      referenceLabel: 'SLA Limit: 20m',
    },
  };

  const current = metricConfig[activeTab];

  // Custom Rich Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as TimeSeriesPoint;
      return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-md min-w-[190px]">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
            <span className="font-mono text-xs font-semibold text-zinc-200">{label} hrs</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {item.shift} Shift
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">SLA Compliance:</span>
              <span className="font-mono font-bold text-emerald-400">{item.sla}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Tickets Inflow:</span>
              <span className="font-mono font-bold text-blue-400">{item.volume}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">MTTR:</span>
              <span className="font-mono font-bold text-purple-400">{item.mttr} min</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md">
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

      {/* Recharts Area Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="slaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="mttrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              domain={current.domain as [number, number]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}${current.unit === '%' ? '%' : ''}`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Reference Line for SLA Target */}
            <ReferenceLine
              y={current.referenceValue}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: current.referenceLabel,
                fill: '#f59e0b',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Area
              type="monotone"
              dataKey={current.dataKey}
              stroke={current.stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${current.fillGradient})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
