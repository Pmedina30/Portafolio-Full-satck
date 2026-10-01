import React from 'react';
import { ViewMode } from '../types';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (view: ViewMode) => void;
  onOpenCheckout: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenCheckout,
}) => {
  return (
    <section className="relative pt-44 pb-20 px-6 max-w-[1240px] mx-auto text-center flex flex-col items-center">
      {/* Propuesta de Valor de Alta Conversión (Reemplazo de texto de depuración) */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] mb-8 select-none transition-transform hover:scale-[1.01]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-[#1d1d1f]">Nuevo: Plantillas ejecutivas ATS-friendly 2026</span>
        <span className="text-[#86868b]">•</span>
        <span className="text-[#86868b]">Más de 10,000 currículums exportados sin fricción</span>
      </div>

      {/* Titular Hero: 80px/600, leading 1.05, tracking -1.2px en color Ink (#1d1d1f) */}
      <h1 className="text-[44px] sm:text-[64px] md:text-[80px] font-semibold text-[#1d1d1f] max-w-[1040px] leading-[1.05] tracking-[-1.2px] font-sans">
        El currículum para quienes dejan que el trabajo hable.
      </h1>

      {/* Subtexto: 17px/400, tracking -0.374px */}
      <p className="mt-7 text-[17px] text-[#86868b] max-w-[660px] font-normal tracking-[-0.374px] leading-relaxed">
        Crea un perfil profesional sin ruido ni plantillas sobrecargadas. Tipografía editorial de alta precisión, hoja A4 impecable y hosting público instantáneo con código QR.
      </p>

      {/* Botones de Acción Hero */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('editor')}
          className="h-12 px-7 rounded-full bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 tracking-[-0.2px] transition-all"
          style={{ boxShadow: 'none' }}
        >
          <span>Abrir Estudio de Edición</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigate('public_profile')}
          className="h-12 px-7 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[#1d1d1f] text-[14px] font-medium inline-flex items-center justify-center gap-2 tracking-[-0.2px] transition-all"
          style={{ boxShadow: 'none' }}
        >
          <span>Ver Ejemplo Público (/u)</span>
        </button>
      </div>

      {/* Mini preview interactiva de la hoja de muestra */}
      <div className="mt-16 w-full max-w-[960px] bg-[#f5f5f7] border border-[#d6d6d6] rounded-[28px] p-6 sm:p-10 flex flex-col items-center">
        <div className="w-full flex justify-between items-center pb-4 text-[12px] text-[#86868b] border-b border-[#d6d6d6]/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Galería Ejecutiva Verificada</span>
          </div>
          <span className="font-mono text-[11px]">Proporción A4 (210 × 297mm) • Cero Sombras</span>
        </div>

        {/* Tarjeta de Hoja A4 Representativa con Radio 28px sin sombras */}
        <div
          onClick={() => onNavigate('editor')}
          className="cursor-pointer group relative w-full max-w-[700px] aspect-[1/1.3] bg-white border border-[#d6d6d6] rounded-2xl p-8 sm:p-12 text-left hover:border-[#1d1d1f] transition-all"
          style={{ boxShadow: 'none' }}
        >
          <div className="border-b border-[#d6d6d6] pb-5 mb-5 flex justify-between items-start">
            <div>
              <h2 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight">
                Javier Arboleda
              </h2>
              <p className="text-[12px] text-[#0071e3] font-medium mt-0.5">
                Principal Design Technologist & Systems Architect
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#86868b] border border-[#d6d6d6] px-2 py-0.5 rounded-full">
              SWISS GRID
            </span>
          </div>

          <div className="space-y-4 text-[11.5px] text-[#86868b]">
            <p className="text-[#1d1d1f] text-[12px] leading-relaxed">
              Líder técnico con más de 10 años definiendo la intersección entre ingeniería de software escalable y dirección de arte digital minimalista.
            </p>
            <div className="border-t border-[#d6d6d6] pt-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
                Experiencia Reciente
              </span>
              <div className="flex justify-between text-[#1d1d1f] font-medium text-[11.5px] mt-1">
                <span>Principal UI/UX Architect — Vanguard Systems</span>
                <span className="font-mono text-[#86868b] text-[10.5px]">2022 – Presente</span>
              </div>
            </div>
          </div>

          {/* Overlay hover sutil */}
          <div className="absolute inset-0 bg-[#1d1d1f]/[0.02] group-hover:bg-[#1d1d1f]/[0.05] rounded-2xl transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md border border-[#d6d6d6] rounded-full px-5 py-2 text-[12px] font-medium text-[#1d1d1f]">
              Click para editar en vivo en el Split-Screen Studio →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
