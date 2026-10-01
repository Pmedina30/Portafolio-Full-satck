import React from 'react';
import { ViewMode } from '../types';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Zap, QrCode } from 'lucide-react';
import { InteractiveIdBadge } from './3d/InteractiveIdBadge';

interface HeroSectionProps {
  onNavigate: (view: ViewMode) => void;
  onOpenCheckout: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenCheckout,
}) => {
  return (
    <section className="relative pt-36 sm:pt-44 pb-20 px-6 max-w-[1240px] mx-auto">
      {/* Malla de Fondo Aurora Mesh */}
      <div className="aurora-mesh-wrapper">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
        <div className="aurora-blob-4" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Columna Izquierda: Mensaje y Conversión */}
        <div className="lg:col-span-7 text-left space-y-6">
          {/* Badge de Novedad con Brillo Aurora */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm text-[12px] font-medium text-slate-800 select-none transition-transform hover:scale-[1.01]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">Nuevo: Plantillas Ejecutivas ATS 2026</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-600 font-medium">Credencial 3D Interactiva</span>
          </div>

          {/* Titular Principal de Alto Impacto */}
          <h1 className="text-[44px] sm:text-[60px] md:text-[72px] font-bold text-slate-950 leading-[1.05] tracking-[-1.5px] font-sans">
            El currículum para quienes dejan que el{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              trabajo hable.
            </span>
          </h1>

          {/* Subtítulo Descriptivo */}
          <p className="text-[17px] sm:text-[18px] text-slate-600 max-w-[620px] font-normal tracking-[-0.3px] leading-relaxed">
            Crea un perfil profesional sin ruido ni plantillas sobrecargadas. Tipografía editorial de alta precisión, hoja A4 impecable, física 3D en tu credencial de talento y hosting público con código QR.
          </p>

          {/* Botones de Acción de Alta Conversión */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('editor')}
              className="h-12 px-7 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 active:scale-95 text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2.5 tracking-[-0.2px] shadow-xl shadow-blue-500/25 transition-all"
            >
              <span>Abrir Estudio de Edición</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('public_profile')}
              className="h-12 px-7 rounded-full bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200 text-slate-800 text-[14px] font-semibold inline-flex items-center justify-center gap-2 tracking-[-0.2px] shadow-sm hover:shadow-md transition-all"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Ver Ejemplo Público (/u)</span>
            </button>
          </div>

          {/* Métricas de Confianza y Compatibilidad ATS */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-[12px] text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Compatibilidad ATS 98%</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Privacidad & Enmascaramiento PII</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Exportación A4 Vectorial</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Protagónico "3D Holographic ID Badge" */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <InteractiveIdBadge
            username="javier-arboleda"
            personalDetails={{
              fullName: 'Javier Arboleda',
              headline: 'Principal Design Technologist & Systems Architect',
              location: 'San Francisco, CA / Remoto',
            }}
            onViewProfile={() => onNavigate('public_profile')}
          />
        </div>
      </div>
    </section>
  );
};
