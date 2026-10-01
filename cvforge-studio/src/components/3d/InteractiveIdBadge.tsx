import React, { useState, useRef, useCallback } from 'react';
import { PersonalDetails } from '../../types';
import { Sparkles, ShieldCheck, QrCode, ExternalLink, RefreshCw, CheckCircle2, MapPin } from 'lucide-react';

interface InteractiveIdBadgeProps {
  personalDetails?: Partial<PersonalDetails>;
  username?: string;
  onViewProfile?: () => void;
  className?: string;
}

export const InteractiveIdBadge: React.FC<InteractiveIdBadgeProps> = ({
  personalDetails,
  username = 'pedro-medina',
  onViewProfile,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Datos representativos con fallback robusto
  const fullName = personalDetails?.fullName || 'Javier Arboleda';
  const headline = personalDetails?.headline || 'Principal Design Technologist & Systems Architect';
  const location = personalDetails?.location || 'San Francisco, CA / Remoto';
  const talentId = `#CVF-${new Date().getFullYear()}-EXEC`;

  // Cálculo de rotación 3D realista con perspectiva
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX; // -1 to 1
    const normY = (y - centerY) / centerY; // -1 to 1

    // Multiplicador de inclinación 3D (hasta ±18 grados)
    const newRotateY = normX * 16;
    const newRotateX = -normY * 16;

    setRotateX(newRotateX);
    setRotateY(newRotateY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.85,
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Efecto resorte suave de retorno a posición neutral
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`relative flex flex-col items-center select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* 1. Lanyard & Clip Metálico Simulado (Header de Credencial) */}
      <div className="flex flex-col items-center z-20 -mb-3 pointer-events-none">
        {/* Correa / Lanyard textil tejido */}
        <div className="w-12 h-14 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-800 rounded-t-sm border-x border-slate-700/60 shadow-md flex items-center justify-center">
          <div className="w-2.5 h-full bg-indigo-500/20" />
        </div>

        {/* Mosquetón / Clip de aleación metálica cepillada */}
        <div className="w-10 h-6 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-md border border-slate-400/80 shadow-md flex items-center justify-center -mt-1">
          <div className="w-4 h-1.5 bg-slate-500/40 rounded-full" />
        </div>

        {/* Argolla de acero conectora */}
        <div className="w-6 h-5 border-2 border-slate-400 rounded-full -mt-2 bg-transparent shadow-sm" />
      </div>

      {/* 2. Cuerpo de la Credencial Interactiva 3D */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        className="relative w-[340px] sm:w-[360px] h-[510px] cursor-pointer rounded-[28px] transition-transform duration-150 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 30px 60px -15px rgba(37, 99, 235, 0.25), 0 10px 25px -5px rgba(139, 92, 246, 0.2)'
            : '0 20px 40px -15px rgba(15, 23, 42, 0.12)',
        }}
      >
        {/* CARA FRONTAL: Credencial Ejecutiva Holográfica */}
        <div
          className="absolute inset-0 rounded-[28px] p-6 flex flex-col justify-between overflow-hidden bg-white/90 backdrop-blur-2xl border border-slate-200/90 shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Capa de Destello Holográfico Multiespectral */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[28px] mix-blend-overlay"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.9) 0%, rgba(147, 197, 253, 0.4) 35%, rgba(196, 181, 253, 0.35) 55%, transparent 75%)`,
            }}
          />

          {/* Ranura superior recortada para la correa */}
          <div className="flex justify-center -mt-2 mb-3">
            <div className="w-14 h-2.5 rounded-full bg-slate-200/90 border border-slate-300/80 shadow-inner flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-400/40 rounded-full" />
            </div>
          </div>

          {/* Encabezado: Marca CVForge + Holographic ID */}
          <div className="flex justify-between items-start pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="text-[13px] font-bold tracking-tight text-slate-900 block leading-none">
                  CVForge Studio
                </span>
                <span className="text-[9.5px] uppercase tracking-wider text-slate-400 font-mono">
                  Verified Executive Pass
                </span>
              </div>
            </div>

            {/* Talent ID Monospace con acabado iridiscente */}
            <div className="px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-[10px] font-mono font-semibold text-slate-700 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{talentId}</span>
            </div>
          </div>

          {/* Sección Central: Avatar con Chip 'OPEN TO WORK' */}
          <div className="flex flex-col items-center my-auto py-2 text-center">
            <div className="relative mb-3">
              {/* Anillo de gradiente holográfico alrededor del avatar */}
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-400 to-cyan-400 shadow-lg">
                <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-bold text-2xl font-sans">
                    {fullName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                </div>
              </div>

              {/* Chip Dinámico OPEN TO WORK */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open to Work</span>
              </div>
            </div>

            {/* Datos del Profesional */}
            <h3 className="text-[19px] font-bold text-slate-900 tracking-tight leading-tight mt-1">
              {fullName}
            </h3>
            <p className="text-[12px] font-medium text-blue-600 mt-1 max-w-[260px] line-clamp-2">
              {headline}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{location}</span>
            </div>

            {/* Habilidades Clave en Chips */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-[280px]">
              {['Systems Architecture', 'Next.js', 'AI Workflows', 'FinTech'].map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-[10px] font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Footer de la Credencial: Código QR Dinámico + Sello de Seguridad */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Código QR Miniatura SVG */}
              <div className="w-12 h-12 rounded-xl bg-slate-900 p-1 flex items-center justify-center shadow-sm">
                <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 2h2v4h-2v-4zm2 2h2v2h-2v-2zm-4 2h2v2h-2v-2zm4-6h2v2h-2v-2z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-400 block leading-tight">
                  ESCANEAR CV VÍA WEB
                </span>
                <span className="text-[11px] font-semibold text-slate-800 tracking-tight block">
                  /u/{username}
                </span>
              </div>
            </div>

            {/* Botón Girar Credencial */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Girar credencial para ver sello criptográfico"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARA TRASERA: Certificación Criptográfica y Seguridad */}
        <div
          className="absolute inset-0 rounded-[28px] p-6 flex flex-col justify-between overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Header Reverso */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[12px] font-bold text-white tracking-tight">
                Certificación Criptográfica
              </span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              SHA-256 VERIFIED
            </span>
          </div>

          {/* Cuerpo Reverso */}
          <div className="space-y-3.5 my-auto text-[11px] text-slate-300">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>RLS MULTI-TENANT</span>
                <span className="text-emerald-400 font-mono">SUPABASE V2</span>
              </div>
              <p className="text-[11.5px] text-white font-medium">
                Aislamiento estricto por usuario y sanitización anti-XSS activa.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>COMPATIBILIDAD ATS</span>
                <span className="text-blue-400 font-mono">SCORE: 98%</span>
              </div>
              <p className="text-[11.5px] text-white font-medium">
                Estructura parseable por Workday, Greenhouse, Taleo y Lever.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] font-mono block">FINGERPRINT PRIVADO</span>
              <p className="font-mono text-[9px] text-slate-300 truncate">
                0x7F4C8E9B2A10D3F6A90145C89E23B1578F4A6C90
              </p>
            </div>
          </div>

          {/* Botones Reverso */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            {onViewProfile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile();
                }}
                className="w-full h-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-[12px] font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <span>Ver Portafolio Web Completo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="w-full py-1 text-slate-400 hover:text-white text-[11px] transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Volver al frente de la credencial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sombra de suelo interactiva */}
      <div
        className="w-56 h-4 bg-slate-900/10 rounded-full blur-md mt-4 transition-all duration-300"
        style={{
          transform: `scale(${isHovered ? 1.08 : 1})`,
          opacity: isHovered ? 0.6 : 0.3,
        }}
      />

      <p className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-1">
        <span>Gira y mueve el cursor para probar la física 3D</span>
      </p>
    </div>
  );
};
