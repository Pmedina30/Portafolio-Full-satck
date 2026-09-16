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
  brand: BrandingTheme;
}

export const KpiRow: React.FC<KpiRowProps> = ({ kpis, brand }) => {
  const isPositiveDelta = kpis.otpRateDelta >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 print-card">
      {/* KPI 1: Volumen Total Operado */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Vuelos Operados
          </span>
          <div 
            style={{ backgroundColor: `${brand.primaryColor}15`, color: brand.primaryColor }}
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
          >
            <PlaneTakeoff className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight font-mono">
              {kpis.totalVolume.toLocaleString()}
            </h3>
            <span className="text-xs font-semibold text-slate-400">legs</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-corporate-emerald inline-block" />
            100% de la red monitoreada
          </p>
        </div>
      </div>

      {/* KPI 2: Tasa de Puntualidad (OTP %) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Puntualidad (OTP D15)
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-corporate-emerald flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight font-mono">
              {kpis.otpRate}%
            </h3>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                isPositiveDelta
                  ? 'bg-emerald-50 text-corporate-emerald border border-emerald-200'
                  : 'bg-rose-50 text-corporate-rose border border-rose-200'
              }`}
            >
              {isPositiveDelta ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isPositiveDelta ? `+${kpis.otpRateDelta}%` : `${kpis.otpRateDelta}%`}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            Objetivo corporativo: <span className="font-bold text-slate-700">85.0%</span>
          </p>
        </div>
      </div>

      {/* KPI 3: Vuelos con Delay */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Vuelos Demorados
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-corporate-amber flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight font-mono">
              {kpis.delayedCount.toLocaleString()}
            </h3>
            <span className="text-xs font-bold text-corporate-amber">
              {kpis.delayedRate}%
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            Desviaciones &gt; {15} min
          </p>
        </div>
      </div>

      {/* KPI 4: Tiempo Medio de Demora */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Demora Promedio
          </span>
          <div 
            style={{ backgroundColor: `${brand.accentColor}15`, color: brand.accentColor }}
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
          >
            <Hourglass className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight font-mono">
              {kpis.formattedAvgDuration}
            </h3>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            Total acumulado: <span className="font-bold text-slate-700">{kpis.totalDelayHoursFormatted}</span>
          </p>
        </div>
      </div>

      {/* KPI 5: Pérdidas / Fallas Críticas (Cancelaciones) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Cancelaciones
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-corporate-rose flex items-center justify-center font-bold">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-corporate-rose tracking-tight font-mono">
              {kpis.criticalFailuresCount}
            </h3>
            <span className="text-xs font-bold text-corporate-rose">
              {kpis.criticalFailuresRate}%
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-slate-400" />
            Afectación a red operativa
          </p>
        </div>
      </div>
    </div>
  );
};

