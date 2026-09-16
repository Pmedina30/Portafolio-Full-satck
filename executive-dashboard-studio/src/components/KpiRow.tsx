import React from 'react';
import {
  PlaneTakeoff,
  Clock,
  AlertTriangle,
  Hourglass,
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { CalculatedKpis, BrandingTheme } from '../types/dashboard';

interface KpiRowProps {
  kpis: CalculatedKpis;
  brand?: BrandingTheme;
  theme?: BrandingTheme;
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

export const KpiRow: React.FC<KpiRowProps> = ({ kpis, brand, theme }) => {
  const currentBrand = brand || theme || DEFAULT_THEME;
  const isPositiveDelta = (kpis?.otpRateDelta ?? 0) >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 print-card">
      {/* KPI 1: Volumen Total Operado */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Vuelos Operados
          </span>
          <div 
            style={{ backgroundColor: `${currentBrand.primaryColor}15`, color: currentBrand.primaryColor }}
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
          >
            <PlaneTakeoff className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight font-mono">
              {(kpis?.totalVolume ?? 0).toLocaleString()}
            </h3>
            <span className="text-xs font-semibold text-slate-400">operaciones</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <span>Red Comercial Regular</span>
            <span className="text-slate-300">•</span>
            <span className="text-corporate-emerald font-semibold">100% Monitoreado</span>
          </p>
        </div>
      </div>

      {/* KPI 2: On-Time Performance (OTP) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Puntualidad (OTP D15)
          </span>
          <div className="w-8 h-8 rounded-xl bg-corporate-emerald/10 text-corporate-emerald flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-corporate-emerald tracking-tight font-mono">
              {kpis?.otpRate ?? 0}%
            </h3>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                isPositiveDelta
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {isPositiveDelta ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositiveDelta ? `+${kpis?.otpRateDelta ?? 0}%` : `${kpis?.otpRateDelta ?? 0}%`}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <span>Meta Corporativa:</span>
            <span className="font-bold text-slate-700">85.0%</span>
            <span className="text-slate-300">•</span>
            <span className={kpis?.otpRate >= 85 ? 'text-corporate-emerald font-bold' : 'text-amber-600 font-bold'}>
              {kpis?.otpRate >= 85 ? 'En Objetivo' : 'Bajo Meta'}
            </span>
          </p>
        </div>
      </div>

      {/* KPI 3: Vuelos con Desvío / Delay */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Desvíos / Delays
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-mono">
              {(kpis?.delayedCount ?? 0).toLocaleString()}
            </h3>
            <span className="text-xs font-bold text-amber-600">
              ({kpis?.delayedRate ?? 0}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Minutos acumulados:{' '}
            <strong className="text-slate-800 font-mono font-bold">
              {kpis?.totalDelayHoursFormatted ?? '0h'}
            </strong>
          </p>
        </div>
      </div>

      {/* KPI 4: Demora Promedio Formateada */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Demora Promedio
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
            <Hourglass className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight font-mono">
              {kpis?.formattedAvgDuration || '0min'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <span>Promedio por vuelo atrasado:</span>
            <strong className="text-slate-700 font-mono">{kpis?.avgDelayMinutes ?? 0}m</strong>
          </p>
        </div>
      </div>

      {/* KPI 5: Cancelaciones Críticas */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Cancelaciones
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight font-mono">
              {(kpis?.criticalFailuresCount ?? 0).toLocaleString()}
            </h3>
            <span className="text-xs font-bold text-rose-500">
              ({kpis?.criticalFailuresRate ?? 0}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Tasa de Cumplimiento:{' '}
            <strong className="text-emerald-600 font-bold">
              {(100 - (kpis?.criticalFailuresRate ?? 0)).toFixed(1)}%
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};
