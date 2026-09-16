import React from 'react';
import { ParetoCauseItem, BrandingTheme } from '../../types/dashboard';
import { AlertCircle, Clock } from 'lucide-react';
import { formatMinutesToHours } from '../../services/daxEngine';

interface DelayCausesBarChartProps {
  data: ParetoCauseItem[];
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

export const DelayCausesBarChart: React.FC<DelayCausesBarChartProps> = ({ 
  data, 
  brand, 
  theme,
  title = 'Distribución de Causas de Delay',
  subtitle = 'Ranking Pareto de mayor a menor impacto operacional'
}) => {
  const currentBrand = brand || theme || DEFAULT_THEME;

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center h-72 text-xs text-slate-400">
        No se registraron demoras en el periodo
      </div>
    );
  }

  const maxPercent = Math.max(...data.map((d) => d.percentage), 1);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between print-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-extrabold text-navy-950 tracking-tight flex items-center gap-1.5">
            <span>{title}</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            {subtitle}
          </p>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Top {data.length}
        </span>
      </div>

      {/* Ranked Horizontal Bars */}
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {data.map((item, idx) => {
          const barWidth = Math.max(8, (item.percentage / maxPercent) * 100);
          const isTopCause = idx === 0;

          return (
            <div key={item.cause} className="group cursor-default">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 truncate max-w-[220px]" title={item.cause}>
                  {item.cause}
                </span>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatMinutesToHours(item.totalMinutes)}
                  </span>
                  <span
                    className={`text-[11px] font-black font-mono px-1.5 py-0.2 rounded ${
                      isTopCause
                        ? 'bg-rose-50 text-corporate-rose border border-rose-200'
                        : 'bg-slate-100 text-navy-950'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                <div
                  style={{
                    width: `${barWidth}%`,
                    background: isTopCause
                      ? `linear-gradient(90deg, ${currentBrand.accentColor || '#6B21A8'}, #F43F5E)`
                      : `linear-gradient(90deg, ${currentBrand.primaryColor || '#0B1340'}, ${currentBrand.highlightColor || '#00C3DE'})`
                  }}
                  className="h-full rounded-full transition-all duration-500 ease-out group-hover:brightness-110"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-corporate-amber" />
          Foco crítico: {data[0]?.cause} ({data[0]?.percentage}%)
        </span>
        <span className="font-mono">
          Acumulado: {data[data.length - 1]?.cumulativePercentage || 100}%
        </span>
      </div>
    </div>
  );
};
