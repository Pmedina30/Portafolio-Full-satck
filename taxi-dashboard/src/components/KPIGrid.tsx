import React from 'react';
import { KPIData } from '../types';
import {
  TrendingUp,
  Car,
  Clock,
  CircleDollarSign,
  Percent,
} from 'lucide-react';

interface KPIGridProps {
  data: KPIData;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ data }) => {
  const formatDOP = (amount: number) => {
    return 'RD$ ' + amount.toLocaleString('es-DO');
  };

  return (
    <div
      id="kpi-metrics-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
    >
      {/* 1. Viajes hoy */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Viajes hoy
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-50 transition-colors flex items-center justify-center text-slate-600 group-hover:text-emerald-600">
            <Car className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-1">
          <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            {data.tripsToday.toLocaleString('es-DO')}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            +{data.tripsTrend}% vs ayer
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 truncate">
          Promedio: ~94 viajes / hora
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Facturación total */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Facturación total
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-50 transition-colors flex items-center justify-center text-slate-600 group-hover:text-emerald-600">
            <CircleDollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-1 mt-1">
          <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            {formatDOP(data.totalRevenueDOP)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-slate-500 truncate">
            {data.grossVolumeLabel}
          </p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
            +14.8%
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 3. Comisión Taxi (20%) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Comisión Taxi (20%)
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Percent className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-1 mt-1">
          <span className="text-2xl font-black text-emerald-600 tracking-tight font-sans">
            {formatDOP(data.commissionDOP)}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 truncate font-medium">
          {data.commissionRateLabel}
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 4. Conductores en línea */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Conductores en línea
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors flex items-center justify-center text-slate-600 group-hover:text-blue-600">
            <Car className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-1 mt-1">
          <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            {data.driversOnline}{' '}
            <span className="text-sm font-semibold text-slate-400">
              / {data.driversTotal}
            </span>
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {data.fleetPercentage}% flota
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 truncate">
          194 confort · 116 económico
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 5. Tiempo prom. asignación */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tiempo prom. asignación
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-50 transition-colors flex items-center justify-center text-slate-600 group-hover:text-emerald-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-1 mt-1">
          <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            {data.avgAssignmentTime}
          </span>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {data.assignmentTrendSeconds}s vs obj.
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 truncate">
          Meta operacional: &lt; 2m 30s
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
