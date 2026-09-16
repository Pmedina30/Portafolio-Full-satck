import React, { useState } from 'react';
import { RouteMetric, FleetStatusItem, BrandingTheme } from '../types/dashboard';
import { Plane, AlertTriangle, ShieldCheck, MapPin, ArrowRight, Wrench, Clock } from 'lucide-react';

interface OperationalTablesProps {
  routes: RouteMetric[];
  fleet: FleetStatusItem[];
  theme: BrandingTheme;
}

export const OperationalTables: React.FC<OperationalTablesProps> = ({
  routes,
  fleet,
  theme
}) => {
  const [routeSort, setRouteSort] = useState<'delays' | 'volume' | 'otp'>('delays');

  // Sort routes based on state
  const sortedRoutes = [...routes].sort((a, b) => {
    if (routeSort === 'delays') return b.avgDelayMinutes - a.avgDelayMinutes;
    if (routeSort === 'volume') return b.volume - a.volume;
    return a.otpRate - b.otpRate; // lowest OTP first (most critical)
  });

  // Calculate max delay for proportional bar width
  const maxDelay = Math.max(...routes.map(r => r.avgDelayMinutes), 60);

  const getStatusBadge = (status: FleetStatusItem['status']) => {
    switch (status) {
      case 'On-Schedule':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            En Horario
          </span>
        );
      case 'In-Flight':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            En Vuelo
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Demorada
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Wrench className="w-3 h-3 text-amber-600" />
            Mantenimiento
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Widget 1: Top Critical Routes with Proportional Delay Bars */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Rutas Críticas & Retraso Promedio</h3>
                <p className="text-xs text-slate-500">Monitoreo de desvíos con barras proporcionales</p>
              </div>
            </div>

            {/* Sort Toggles */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setRouteSort('delays')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  routeSort === 'delays' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mayor Demora
              </button>
              <button
                type="button"
                onClick={() => setRouteSort('otp')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  routeSort === 'otp' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Menor OTP
              </button>
              <button
                type="button"
                onClick={() => setRouteSort('volume')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  routeSort === 'volume' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Volumen
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5 pl-2 font-semibold">Ruta (Sector)</th>
                  <th className="pb-2.5 px-3 text-center font-semibold">Operaciones</th>
                  <th className="pb-2.5 px-3 text-center font-semibold">OTP %</th>
                  <th className="pb-2.5 pr-2 font-semibold w-5/12">Demora Promedio & Desvío</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedRoutes.slice(0, 8).map((route) => {
                  const barWidth = Math.min(100, (route.avgDelayMinutes / maxDelay) * 100);
                  const isHighDelay = route.avgDelayMinutes >= 45;
                  const isModerateDelay = route.avgDelayMinutes >= 25 && route.avgDelayMinutes < 45;

                  return (
                    <tr key={route.route} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-2.5 pl-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {route.route}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-xs font-semibold text-slate-700">{route.volume}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">{route.delayedCount} dem.</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          route.otpRate >= 85 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : route.otpRate >= 70 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-rose-50 text-rose-700'
                        }`}>
                          {route.otpRate}%
                        </span>
                      </td>
                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isHighDelay 
                                  ? 'bg-rose-500' 
                                  : isModerateDelay 
                                    ? 'bg-amber-500' 
                                    : 'bg-indigo-500'
                              }`}
                              style={{ width: `${Math.max(5, barWidth)}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-xs text-slate-800 w-16 text-right">
                            {route.avgDelayMinutes} min
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px]">Mostrando las 8 rutas más determinantes en puntualidad</span>
          <span className="font-semibold text-slate-700">Umbral Alerta: 45+ min</span>
        </div>
      </div>

      {/* Widget 2: Aircraft Fleet Status Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Estatus de Flota (B737 MAX 8)</h3>
                <p className="text-xs text-slate-500">Disponibilidad de aeronaves activas</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {fleet.length} Activas
            </span>
          </div>

          <div className="space-y-3">
            {fleet.map((aircraft) => (
              <div 
                key={aircraft.tailNumber}
                className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-mono font-bold text-xs">
                    {aircraft.tailNumber.replace('HI-', '')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 font-mono">{aircraft.tailNumber}</span>
                      <span className="text-[10px] text-slate-400">{aircraft.model.replace('Boeing ', '')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{aircraft.flightsCount} vuelos</span>
                      <span>·</span>
                      <span>OTP: <strong className="text-slate-800">{aircraft.otpRate}%</strong></span>
                    </div>
                  </div>
                </div>

                <div>
                  {getStatusBadge(aircraft.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px]">Fleet Readiness Rate</span>
          <span className="font-bold text-emerald-600">98.6%</span>
        </div>
      </div>
    </div>
  );
};
