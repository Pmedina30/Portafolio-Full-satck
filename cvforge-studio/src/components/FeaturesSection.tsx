import React from 'react';
import { ViewMode } from '../types';
import { Layers, QrCode, Sparkles, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

interface FeaturesSectionProps {
  onNavigate: (view: ViewMode) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onNavigate }) => {
  return (
    <section className="bg-[#f5f5f7] py-28 px-6 border-t border-[#d6d6d6]">
      <div className="max-w-[1240px] mx-auto">
        {/* Encabezado de Sección */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#d6d6d6] text-[11px] font-mono text-[#86868b]">
            ARQUITECTURA DE PRODUCTO
          </div>
          <h2 className="text-[34px] sm:text-[40px] font-semibold tracking-[-0.9px] text-[#1d1d1f]">
            Claridad visual absoluta. Cero artificios.
          </h2>
          <p className="text-[17px] text-[#86868b] tracking-[-0.374px] leading-relaxed">
            Eliminamos las sombras paralelas, barras de nivel de habilidades arbitrarias y saturación visual. Solo tipografía ejecutiva y espacios en blanco calibrados.
          </p>
        </div>

        {/* Grid de 3 Tarjetas con Geometría Estricta 28px sin sombras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Tarjeta 1 */}
          <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-8 flex flex-col justify-between h-[380px] hover:border-[#1d1d1f] transition-colors">
            <div>
              <span className="text-[11px] font-mono text-[#86868b]">01 / TIPOGRAFÍA SUIZA</span>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f] mt-3 tracking-tight">
                3 Plantillas Ejecutivas
              </h3>
              <p className="text-[14px] text-[#86868b] mt-3 leading-relaxed tracking-[-0.2px]">
                Cupertino Minimal (neo-grotesca pura), Zurich Executive (jerarquía editorial asimétrica) y Geneva Classic (acentos serif con autoridad).
              </p>
            </div>
            <button
              onClick={() => onNavigate('editor')}
              className="pt-4 border-t border-[#d6d6d6]/60 flex items-center justify-between text-[13px] text-[#1d1d1f] font-medium group"
            >
              <span>Probar plantillas en vivo</span>
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:text-[#1d1d1f] group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-8 flex flex-col justify-between h-[380px] hover:border-[#1d1d1f] transition-colors">
            <div>
              <span className="text-[11px] font-mono text-[#86868b]">02 / DISTRIBUCIÓN WEB</span>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f] mt-3 tracking-tight">
                Hosting Público y Código QR
              </h3>
              <p className="text-[14px] text-[#86868b] mt-3 leading-relaxed tracking-[-0.2px]">
                Genera tu URL personal amigable (<code className="text-[#1d1d1f] font-mono">cvforge.app/u/tu-nombre</code>) con código QR instantáneo para imprimir en tarjetas de visita o proyectar.
              </p>
            </div>
            <button
              onClick={() => onNavigate('public_profile')}
              className="pt-4 border-t border-[#d6d6d6]/60 flex items-center justify-between text-[13px] text-[#1d1d1f] font-medium group"
            >
              <span>Explorar perfil público</span>
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:text-[#1d1d1f] group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-8 flex flex-col justify-between h-[380px] hover:border-[#1d1d1f] transition-colors">
            <div>
              <span className="text-[11px] font-mono text-[#86868b]">03 / MONETIZACIÓN STRIPE</span>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f] mt-3 tracking-tight">
                Pase Pro & Analíticas
              </h3>
              <p className="text-[14px] text-[#86868b] mt-3 leading-relaxed tracking-[-0.2px]">
                Plan gratuito con marca de agua discreta. Desbloqueo mediante Stripe de descarga en PDF vectorial a 300 DPI y métricas de visitantes de empresas Fortune 500.
              </p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="pt-4 border-t border-[#d6d6d6]/60 flex items-center justify-between text-[13px] text-[#1d1d1f] font-medium group"
            >
              <span>Ver panel de analíticas</span>
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:text-[#1d1d1f] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Banner Inferior de Adopción */}
        <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
              ¿Listo para crear tu currículum White Gallery?
            </h3>
            <p className="text-[14px] text-[#86868b] mt-1">
              Sin registros forzados para comenzar a editar. Edita en tiempo real ahora mismo.
            </p>
          </div>

          <button
            onClick={() => onNavigate('editor')}
            className="h-11 px-7 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-[13px] font-medium inline-flex items-center gap-2 whitespace-nowrap transition-colors"
            style={{ boxShadow: 'none' }}
          >
            <span>Iniciar Edición en Vivo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
