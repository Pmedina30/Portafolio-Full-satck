'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  RefreshCw,
  SlidersHorizontal,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { MetricKpiCard } from './MetricKpiCard';
import { InteractiveViewFilters } from './InteractiveViewFilters';
import { PulseTimeSeriesChart } from './PulseTimeSeriesChart';
import {
  KpiMetric,
  TimeSeriesPoint,
  TeamFilter,
  ShiftFilter,
  DateRangePreset,
  LivePulseEvent,
} from '../types/pulseops';

export const PulseOpsDashboard: React.FC = () => {
  // Filters State
  const [selectedTeam, setSelectedTeam] = useState<TeamFilter>('ALL');
  const [selectedShift, setSelectedShift] = useState<ShiftFilter>('ALL');
  const [selectedRange, setSelectedRange] = useState<DateRangePreset>('LIVE');
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // KPI Metrics State
  const [kpis, setKpis] = useState<KpiMetric[]>([
    {
      id: 'sla_compliance',
      title: 'SLA Compliance Rate',
      value: '99.4%',
      rawValue: 99.4,
      trend: '+1.8%',
      isPositive: true,
      comparisonText: 'vs semana previa',
      status: 'healthy',
      sparkline: [97.2, 97.8, 98.4, 98.1, 98.9, 99.1, 99.4],
    },
    {
      id: 'active_tickets',
      title: 'Active Incident Volume',
      value: '42',
      rawValue: 42,
      trend: '-14.2%',
      isPositive: true,
      comparisonText: 'vs semana previa',
      status: 'healthy',
      sparkline: [64, 58, 52, 49, 45, 43, 42],
    },
    {
      id: 'mttr_minutes',
      title: 'Mean Time to Resolve',
      value: '18.4m',
      rawValue: 18.4,
      trend: '-22.5%',
      isPositive: true,
      comparisonText: 'objetivo SLA: 60m',
      status: 'healthy',
      sparkline: [26.2, 24.0, 22.5, 21.0, 19.8, 19.0, 18.4],
    },
    {
      id: 'shift_concurrency',
      title: 'Shift Performance Load',
      value: '94.2%',
      rawValue: 94.2,
      trend: '+5.1%',
      isPositive: true,
      comparisonText: 'capacidad en turno',
      status: 'healthy',
      sparkline: [88.0, 89.5, 91.0, 92.4, 93.1, 93.8, 94.2],
    },
  ]);

  // Time-Series Analytical Data
  const timeSeriesData: TimeSeriesPoint[] = [
    { time: '08:00', sla: 99.8, volume: 18, mttr: 14.2, shift: 'Morning' },
    { time: '09:00', sla: 99.4, volume: 32, mttr: 16.5, shift: 'Morning' },
    { time: '10:00', sla: 98.9, volume: 45, mttr: 18.1, shift: 'Morning' },
    { time: '11:00', sla: 99.1, volume: 38, mttr: 17.0, shift: 'Morning' },
    { time: '12:00', sla: 98.7, volume: 29, mttr: 19.2, shift: 'Morning' },
    { time: '13:00', sla: 99.5, volume: 22, mttr: 15.4, shift: 'Morning' },
    { time: '14:00', sla: 99.2, volume: 34, mttr: 16.8, shift: 'Evening' },
    { time: '15:00', sla: 99.6, volume: 41, mttr: 17.5, shift: 'Evening' },
    { time: '16:00', sla: 98.5, volume: 48, mttr: 21.0, shift: 'Evening' },
    { time: '17:00', sla: 99.0, volume: 39, mttr: 18.4, shift: 'Evening' },
    { time: '18:00', sla: 99.7, volume: 26, mttr: 14.9, shift: 'Evening' },
    { time: '19:00', sla: 99.9, volume: 21, mttr: 13.8, shift: 'Evening' },
  ];

  // Live Escalation Queue
  const [incidents, setIncidents] = useState([
    {
      id: 'INC-2026-9041',
      title: 'Database connection pool saturation on Payment Gateway',
      priority: 'P1_CRITICAL',
      status: 'INVESTIGATING',
      team: 'Platform SRE',
      slaRemaining: '14m',
      slaBreached: false,
      assignee: 'Pedro M.',
    },
    {
      id: 'INC-2026-9038',
      title: 'Delayed webhook callbacks for B2B partner invoice syncing',
      priority: 'P2_HIGH',
      status: 'MITIGATING',
      team: 'Billing IOCC',
      slaRemaining: '38m',
      slaBreached: false,
      assignee: 'Sarah C.',
    },
    {
      id: 'INC-2026-9022',
      title: 'Intermittent 502 Bad Gateway during automated shift handoff',
      priority: 'P3_MEDIUM',
      status: 'RESOLVED',
      team: 'L2 Support',
      slaRemaining: 'Resolved',
      slaBreached: false,
      assignee: 'Alex R.',
    },
  ]);

  // Simulated WebSocket Live Telemetry Stream
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated('Just now');
      // Subtle pulse oscillation on live tickets & SLA
      setKpis((prev) =>
        prev.map((kpi) => {
          if (kpi.id === 'active_tickets') {
            const jitter = Math.floor(40 + Math.random() * 5);
            return {
              ...kpi,
              value: String(jitter),
              rawValue: jitter,
            };
          }
          if (kpi.id === 'sla_compliance') {
            const jitterSLA = (99.2 + Math.random() * 0.5).toFixed(1);
            return {
              ...kpi,
              value: `${jitterSLA}%`,
              rawValue: Number(jitterSLA),
            };
          }
          return kpi;
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300 font-sans">
      {/* 1. Header Bar (Linear / Vercel style) */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand & Organization */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 font-black text-sm shadow-sm">
                P
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-100">
                PulseOps <span className="text-zinc-500 font-mono text-xs font-normal">/ B2B Intelligence</span>
              </span>
            </div>

            <span className="text-zinc-700">|</span>

            {/* Live Telemetry WebSocket Status Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>WS Live Pulse</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500 text-[10px]">{lastUpdated}</span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>⌘K Quick search</span>
            </div>

            <button className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 border border-zinc-700 flex items-center justify-center text-[11px] font-bold text-white">
              PM
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Title & View Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Live Operational Performance
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Monitoreo predictivo de SLAs en tiempo real, velocidad de resolución y carga de turnos operativos
            </p>
          </div>

          {/* Interactive Popover Filters */}
          <InteractiveViewFilters
            selectedTeam={selectedTeam}
            onSelectTeam={setSelectedTeam}
            selectedShift={selectedShift}
            onSelectShift={setSelectedShift}
            selectedRange={selectedRange}
            onSelectRange={setSelectedRange}
          />
        </div>

        {/* 3. Top Row: 4 Metric KPI Cards with Sparklines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <MetricKpiCard key={kpi.id} metric={kpi} />
          ))}
        </div>

        {/* 4. Interactive Time-Series Telemetry Chart */}
        <PulseTimeSeriesChart data={timeSeriesData} />

        {/* 5. Live Incidents & Shift Escalations Table */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md overflow-hidden">
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 tracking-tight flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Active Incident Triage & SLA Runway
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Cola priorizada según criticidad P1-P4 y margen de tolerancia SLA
              </p>
            </div>
            <button className="text-xs text-zinc-400 hover:text-zinc-200 font-medium flex items-center gap-1">
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/60 text-zinc-500 font-mono uppercase text-[10px] tracking-wider border-b border-zinc-800/60">
                <tr>
                  <th className="px-5 py-3">Incident ID</th>
                  <th className="px-5 py-3">Summary</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Squad</th>
                  <th className="px-5 py-3">SLA Runway</th>
                  <th className="px-5 py-3">Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-zinc-300 font-semibold">{inc.id}</td>
                    <td className="px-5 py-3.5 text-zinc-200 max-w-xs truncate font-medium">
                      {inc.title}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          inc.priority === 'P1_CRITICAL'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : inc.priority === 'P2_HIGH'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {inc.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 font-mono">{inc.team}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-zinc-200">
                      {inc.slaRemaining}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400">{inc.assignee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
