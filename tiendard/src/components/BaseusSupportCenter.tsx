"use client";

// ==============================================================================
// TIENDARD - BASEUS SUPPORT CENTER COMPONENT
// Directly replicates the Support Center section shown in Linda Bridges' Dribbble design
// Features: Search bar with yellow submit button, quick help cards for DR logistics,
// official 12-month warranty, and DGA Customs support.
// ==============================================================================

import React, { useState } from "react";
import {
  Search,
  HelpCircle,
  ShieldCheck,
  FileText,
  Truck,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

export const BaseusSupportCenter: React.FC = () => {
  const [supportQuery, setSupportQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSupportSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (supportQuery.trim()) {
      setSearched(true);
    }
  };

  const SUPPORT_TOPICS = [
    {
      icon: ShieldCheck,
      title: "Garantía Oficial 12 Meses",
      desc: "Reemplazo inmediato por defectos de fábrica directamente en Santo Domingo y Santiago.",
      badge: "Garantía RD",
    },
    {
      icon: Truck,
      title: "Guía Aduanal DGA (402-05)",
      desc: "Todo lo que necesitas saber para importar hasta US$ 200.00 libres de arancel e ITBIS.",
      badge: "Aduana 0%",
    },
    {
      icon: FileText,
      title: "Manuales y Firmware",
      desc: "Descarga manuales en español, especificaciones de carga rápida GaN y compatibilidad.",
      badge: "PDF / Drivers",
    },
    {
      icon: MessageCircle,
      title: "Atención por WhatsApp",
      desc: "Especialistas en logística y tecnología disponibles para responder tus preguntas en vivo.",
      badge: "Soporte 24/7",
    },
  ];

  return (
    <section className="relative rounded-3xl bg-gradient-to-br from-[#121418] via-[#181A20] to-[#0F1115] text-white border border-zinc-800 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden font-sans">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-[#FFDD00]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        {/* Yellow Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDD00] text-black text-xs font-black uppercase tracking-wider shadow-md">
          <HelpCircle className="w-3.5 h-3.5 fill-black text-black" />
          BASEUS SUPPORT CENTER • REPÚBLICA DOMINICANA
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight">
          ¿Cómo podemos ayudarte hoy?
        </h2>

        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
          Encuentra asistencia técnica, valida el estatus de tu paquete en Aduanas DGA o consulta la garantía de tus dispositivos Baseus traídos desde Estados Unidos.
        </p>

        {/* Support Search Bar with Cyber Yellow Button */}
        <form onSubmit={handleSupportSearch} className="pt-2 max-w-2xl mx-auto">
          <div className="relative flex items-center bg-zinc-900/90 border border-zinc-700/80 rounded-2xl p-1.5 focus-within:border-[#FFDD00] focus-within:ring-2 focus-within:ring-[#FFDD00]/20 shadow-xl transition-all">
            <Search className="w-5 h-5 text-zinc-400 ml-3.5 flex-shrink-0" />
            <input
              type="text"
              value={supportQuery}
              onChange={(e) => {
                setSupportQuery(e.target.value);
                setSearched(false);
              }}
              placeholder="Buscar soporte de producto, manuales, garantía, tracking..."
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FFDD00] hover:bg-[#FACC15] text-black font-black text-xs sm:text-sm uppercase tracking-tight flex items-center gap-2 transition-all cursor-pointer shadow-md flex-shrink-0"
            >
              <span>Buscar</span>
            </button>
          </div>

          {searched && (
            <div className="mt-3 text-xs text-[#FFDD00] font-mono flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Mostrando resultados para: &quot;{supportQuery}&quot; (Soporte prioritario activo)
              </span>
            </div>
          )}
        </form>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 text-left">
          {SUPPORT_TOPICS.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-[#FFDD00] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFDD00]/10 border border-[#FFDD00]/30 flex items-center justify-center text-[#FFDD00] group-hover:bg-[#FFDD00] group-hover:text-black transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {topic.badge}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-[#FFDD00] transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono text-[#FFDD00] flex items-center gap-1 group-hover:underline cursor-pointer">
                  <span>Conocer más</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
