import React from 'react';
import { AlertTriangle, DollarSign, ShieldAlert, TrendingUp, CheckCircle, Lock } from 'lucide-react';
import { OperationalMetrics } from '../types/finpulse';
import { formatFintechAmount } from '../utils/cryptoSecurity';

interface TopMetricsBarProps {
  metrics: OperationalMetrics;
  isMasked: boolean;
}

export const TopMetricsBar: React.FC<TopMetricsBarProps> = ({ metrics, isMasked }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Capital en Riesgo */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#181216] to-[#0f1422] border border-rose-900/40 p-4 shadow-lg">
        <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rose-300/80 uppercase tracking-wider">
            Capital en Riesgo
          </span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold font-mono text-rose-200 tracking-tight">
            {formatFintechAmount(metrics.capitalAtRisk, isMasked)}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Retenido en transacciones críticas no aprobadas</span>
          </div>
        </div>
      </div>

      {/* 2. Total Gastos Auditados */}
      <div className="relative overflow-hidden rounded-xl bg-[#0f1422] border border-[#1c2438] p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Gastos Auditados
          </span>
          <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formatFintechAmount(metrics.totalAudited, isMasked)}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
            <span>{metrics.transactionCount} transacciones en libro mayor</span>
            <span className="text-emerald-400 font-mono">100% verificado</span>
          </div>
        </div>
      </div>

      {/* 3. Anomalías Críticas (|Z| > 2.2) */}
      <div className="relative overflow-hidden rounded-xl bg-[#0f1422] border border-amber-900/30 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-300/80 uppercase tracking-wider">
            Anomalías (|Z| &gt; 2.2)
          </span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight flex items-baseline gap-2">
            <span>{metrics.criticalCount}</span>
            <span className="text-xs font-normal text-slate-400 font-sans">
              ({metrics.transactionCount > 0 ? ((metrics.criticalCount / metrics.transactionCount) * 100).toFixed(1) : 0}% de total)
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-amber-400 font-mono">{metrics.warningCount} sospechas</span>
            <span>•</span>
            <span className="text-rose-400 font-mono">{metrics.frozenCount} congeladas</span>
          </div>
        </div>
      </div>

      {/* 4. Desvío Estadístico Z Promedio */}
      <div className="relative overflow-hidden rounded-xl bg-[#0f1422] border border-[#1c2438] p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-indigo-300/80 uppercase tracking-wider">
            Desvío Z Crítico
          </span>
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold font-mono text-indigo-300 tracking-tight">
            +{metrics.avgCriticalZScore.toFixed(2)}σ
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
            <span>Umbral seguro: ±1.5σ</span>
            <span className="text-rose-400 font-mono font-medium">Alerta: &gt;2.2σ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

