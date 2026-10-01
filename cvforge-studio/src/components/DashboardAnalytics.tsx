import React from 'react';
import { MOCK_ANALYTICS } from '../data/mockData';
import { Eye, Users, QrCode, FileDown, TrendingUp } from 'lucide-react';

interface DashboardAnalyticsProps {
  isPro: boolean;
  onOpenCheckout: () => void;
  onNavigateToEditor: () => void;
  onNavigateToPublic: () => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  isPro,
  onOpenCheckout,
  onNavigateToEditor,
  onNavigateToPublic,
}) => {
  return (
    // Padding superior corregido a pt-36 para garantizar separación total con la Navbar flotante
    <div className="pt-36 pb-20 px-6 max-w-[1240px] mx-auto min-h-screen">
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] text-[11px] font-mono text-[#86868b] mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            TELEMETRÍA Y AUDIENCIA EN TIEMPO REAL
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-semibold text-[#1d1d1f] tracking-[-0.8px]">
            Panel de Impacto Profesional
          </h1>
          <p className="text-[14px] text-[#86868b] mt-1">
            Analítica de visualizaciones, procedencia de reclutadores e interacciones de tu CV.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToPublic}
            className="h-9 px-4 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] transition-colors"
          >
            Ver CV Público ↗
          </button>
          <button
            onClick={onNavigateToEditor}
            className="h-9 px-4.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-[12px] font-medium transition-colors"
          >
            Editar Currículum
          </button>
        </div>
      </div>

      {/* Banner Pro si es Free */}
      {!isPro && (
        <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#0071e3]" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[#1d1d1f]">
                Desbloquea Analíticas Avanzadas con CVForge Pro
              </h2>
              <p className="text-[12.5px] text-[#86868b]">
                Descubre qué empresas están visitando tu CV, países de procedencia y tiempo de lectura.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenCheckout}
            className="h-9 px-5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[12px] font-medium whitespace-nowrap transition-colors"
          >
            Activar Pro ($9.99/mes)
          </button>
        </div>
      )}

      {/* Grid de Métricas Principales (Tarjetas de 28px sin sombras) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-6">
          <div className="flex justify-between items-center text-[#86868b] mb-3">
            <span className="text-[12px] font-medium uppercase tracking-wider">Visitas Totales</span>
            <Eye className="w-4 h-4 text-[#1d1d1f]" />
          </div>
          <div className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight font-mono">
            {MOCK_ANALYTICS.totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ +24% respecto al mes anterior</p>
        </div>

        <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-6">
          <div className="flex justify-between items-center text-[#86868b] mb-3">
            <span className="text-[12px] font-medium uppercase tracking-wider">Visitantes Únicos</span>
            <Users className="w-4 h-4 text-[#1d1d1f]" />
          </div>
          <div className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight font-mono">
            {MOCK_ANALYTICS.uniqueVisitors.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#86868b] mt-1">Reclutadores y líderes de equipo</p>
        </div>

        <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-6">
          <div className="flex justify-between items-center text-[#86868b] mb-3">
            <span className="text-[12px] font-medium uppercase tracking-wider">Escaneos QR</span>
            <QrCode className="w-4 h-4 text-[#1d1d1f]" />
          </div>
          <div className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight font-mono">
            {MOCK_ANALYTICS.qrScans}
          </div>
          <p className="text-[11px] text-[#86868b] mt-1">Desde tarjetas o eventos presenciales</p>
        </div>

        <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-6">
          <div className="flex justify-between items-center text-[#86868b] mb-3">
            <span className="text-[12px] font-medium uppercase tracking-wider">Descargas PDF</span>
            <FileDown className="w-4 h-4 text-[#1d1d1f]" />
          </div>
          <div className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight font-mono">
            {MOCK_ANALYTICS.pdfDownloads}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Ratio de conversión: {MOCK_ANALYTICS.conversionRate}</p>
        </div>
      </div>

      {/* Tabla de Visitas Recientes */}
      <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-8">
        <div className="flex justify-between items-center mb-6 border-b border-[#d6d6d6] pb-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1d1d1f] tracking-tight">
              Actividad Reciente de Empresas y Organizaciones
            </h2>
            <p className="text-[12px] text-[#86868b] mt-0.5">
              Registro anonimizado de visitas e interacciones profesionales.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#86868b]">EN VIVO</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#d6d6d6] text-[#86868b] text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Organización / Origen</th>
                <th className="pb-3 font-semibold">Ubicación</th>
                <th className="pb-3 font-semibold">Dispositivo</th>
                <th className="pb-3 font-semibold text-right">Tiempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d6d6d6]/60">
              {MOCK_ANALYTICS.recentVisitors.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f5f5f7]/40 transition-colors">
                  <td className="py-3.5 font-medium text-[#1d1d1f] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
                    {row.company}
                  </td>
                  <td className="py-3.5 text-[#86868b]">{row.location}</td>
                  <td className="py-3.5 font-mono text-[11.5px] text-[#86868b]">{row.device}</td>
                  <td className="py-3.5 text-right font-mono text-[11.5px] text-[#86868b]">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
