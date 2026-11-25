"use client";

// ==============================================================================
// TIENDARD — HERO BENTO GRID
// Modern Asymmetric Bento Layout:
// - 1 Large Promotional Banner featuring high-impact lifestyle tech photography
//   and clear value proposition (USA to Dominican Republic).
// - 2 Side Stacked Quick-Deal Cards:
//   1. "Envío Aéreo Express 72h a RD" (Miami Doral Hub -> Caucedo / AILA).
//   2. "0% Impuestos Aduanales bajo $200 USD" (Decreto DGA 402-05 Categoría B).
// ==============================================================================

import React from "react";
import Image from "next/image";
import {
  Plane,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Clock,
  Warehouse,
  CheckCircle2,
  Package,
} from "lucide-react";

interface HeroBentoGridProps {
  onExploreCatalog: () => void;
  onFilterDGAExempt: () => void;
}

export const HeroBentoGrid: React.FC<HeroBentoGridProps> = ({
  onExploreCatalog,
  onFilterDGAExempt,
}) => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ------------------------------------------------------------------- */}
        {/* 1. LARGE PROMOTIONAL BANNER (8 cols on desktop)                    */}
        {/* ------------------------------------------------------------------- */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl group min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-10">
          
          {/* Background Photography with Depth Gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-lifestyle.jpg"
              alt="Productos de tecnología premium para República Dominicana"
              fill
              priority
              className="object-cover object-center group-hover:scale-102 transition-transform duration-700 brightness-[0.78] contrast-[1.05]"
            />
            {/* Multi-stage readability overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-xl space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold tracking-wide shadow-md backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MARKETPLACE TRANSFRONTERIZO USA &rarr; RD</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Tecnología de USA <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                Directa a Tu Puerta en RD
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Compra en tiendas oficiales de Estados Unidos con flete por libra transparente,
              cero sorpresas aduanales y entrega garantizada en Santo Domingo, Santiago y todo el país.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm tracking-tight flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={onFilterDGAExempt}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ver Exentos &lt; $200</span>
              </button>
            </div>
          </div>

          {/* Subtle Bottom Highlights Strip */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 grid grid-cols-3 gap-3 text-xs text-slate-300">
            <div>
              <div className="font-black text-white text-sm sm:text-base">Terminal Miami</div>
              <div className="text-[11px] text-slate-400">Doral FL 33172</div>
            </div>
            <div>
              <div className="font-black text-emerald-400 text-sm sm:text-base">0% Impuestos</div>
              <div className="text-[11px] text-slate-400">Bajo $200 USD DGA</div>
            </div>
            <div>
              <div className="font-black text-sky-400 text-sm sm:text-base">Tracking 24/7</div>
              <div className="text-[11px] text-slate-400">AILA &amp; Couriers RD</div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* 2. SIDE STACKED QUICK-DEAL CARDS (4 cols on desktop)               */}
        {/* ------------------------------------------------------------------- */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Card A: Envío Aéreo Express 72h a RD */}
          <div className="flex-1 rounded-3xl p-6 bg-gradient-to-br from-blue-900/90 via-slate-900 to-slate-950 border border-blue-500/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/60 transition-all">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
                  <Plane className="w-5 h-5 stroke-[2.5]" />
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  Vuelos Diarios
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Envío Aéreo Express 72h a RD
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Consolidación directa en Doral Miami y salida aérea nocturna directa hacia el Aeropuerto Las Américas (SDQ) o Santiago (STI).
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Tarifa transparente por peso real (libras)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Compatible con EPS, BM Cargo, Aeropaq o Domex</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-blue-900/40 flex items-center justify-between text-xs font-bold text-blue-300 group-hover:text-blue-200 transition-colors">
              <span>Tarifas desde $3.25 / lb</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Subtle glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
          </div>

          {/* Card B: 0% Impuestos Aduanales bajo $200 USD */}
          <div className="flex-1 rounded-3xl p-6 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-500/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/60 transition-all">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                  Decreto 402-05
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  0% Impuestos Aduanales
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Artículos con valor FOB menor a <strong>$200 USD</strong> ingresan a República Dominicana exonerados de aranceles y de 18% ITBIS según normativa DGA Categoría B.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Inspección no intrusiva de rayos X en aduana</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Despacho express sin retención innecesaria</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors">
              <button
                onClick={onFilterDGAExempt}
                className="w-full text-left flex items-center justify-between cursor-pointer"
              >
                <span>Filtrar artículos exentos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Subtle glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          </div>

        </div>

      </div>
    </section>
  );
};
