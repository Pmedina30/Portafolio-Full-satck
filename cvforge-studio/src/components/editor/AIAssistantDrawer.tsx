// src/components/editor/AIAssistantDrawer.tsx
// Panel lateral deslizable (Framer Motion) con estética Vibrant Aurora Glass
// Copilot de IA exclusivo para usuarios Pro

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Lock,
  Zap,
  Target,
  Languages,
  Mic,
  ArrowRight,
  Check,
  Copy,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  FileCheck2,
} from 'lucide-react';
import { ResumeData } from '../../types';
import { AssistantMode } from '../../app/api/ai/assistant/route';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onOpenProModal: () => void;
  resumeData: ResumeData;
  onApplyChange: (target: 'summary' | 'experience_highlight' | 'full_text', newContent: string, expId?: string, highlightIndex?: number) => void;
  initialMode?: AssistantMode;
  initialContent?: string;
  userId?: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  isPro,
  onOpenProModal,
  resumeData,
  onApplyChange,
  initialMode = 'bullet_improve',
  initialContent = '',
  userId = 'usr_verified_executive',
}) => {
  const [activeTab, setActiveTab] = useState<AssistantMode>(initialMode);
  const [contentToOptimize, setContentToOptimize] = useState(initialContent);
  const [jobDescription, setJobDescription] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<'en' | 'es'>('en');
  const [selectedExpId, setSelectedExpId] = useState<string>('');
  const [selectedHighlightIdx, setSelectedHighlightIdx] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any | null>(null);
  const [appliedNotification, setAppliedNotification] = useState(false);

  // Cargar contenido por defecto según experiencia o resumen si el usuario no pasó initialContent
  useEffect(() => {
    if (initialContent) {
      setContentToOptimize(initialContent);
    } else if (resumeData.experience.length > 0) {
      const firstExp = resumeData.experience[0];
      setSelectedExpId(firstExp.id);
      setSelectedHighlightIdx(0);
      setContentToOptimize(firstExp.highlights?.[0] || firstExp.description || '');
    } else {
      setContentToOptimize(resumeData.personalDetails.summary || '');
    }
  }, [isOpen, initialContent, resumeData]);

  const handleSelectExperienceBullet = (expId: string, hIdx: number) => {
    const exp = resumeData.experience.find((e) => e.id === expId);
    if (exp) {
      setSelectedExpId(expId);
      setSelectedHighlightIdx(hIdx);
      setContentToOptimize(exp.highlights?.[hIdx] || exp.description);
      setResultData(null);
      setErrorMsg(null);
    }
  };

  const handleRunAI = async () => {
    if (!contentToOptimize.trim()) {
      setErrorMsg('Por favor ingresa o selecciona un texto para analizar.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setAppliedNotification(false);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          mode: activeTab,
          currentContent: contentToOptimize,
          jobDescription: activeTab === 'ats_audit' ? jobDescription : undefined,
          targetLanguage: activeTab === 'translate' ? targetLanguage : undefined,
          userId,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403 || json.error === 'SUBSCRIPTION_REQUIRED') {
          onOpenProModal();
          return;
        }
        throw new Error(json.message || json.error || 'Error al procesar la solicitud.');
      }

      setResultData(json.data);
    } catch (err: any) {
      console.error('[AI_DRAWER_ERROR]:', err);
      setErrorMsg(err.message || 'Error de conexión con el Asistente de IA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!resultData) return;

    let textToApply = '';
    if (activeTab === 'bullet_improve') {
      textToApply = resultData.improved;
    } else if (activeTab === 'translate') {
      textToApply = resultData.translatedContent;
    } else {
      return;
    }

    if (selectedExpId) {
      onApplyChange('experience_highlight', textToApply, selectedExpId, selectedHighlightIdx);
    } else {
      onApplyChange('summary', textToApply);
    }

    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end no-print">
          {/* Telón de fondo con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Panel Lateral Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl shadow-2xl border-l border-[#d6d6d6] flex flex-col h-full z-10 overflow-hidden"
          >
            {/* Header: Vibrant Aurora Glass */}
            <div className="relative p-6 border-b border-[#d6d6d6]/60 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white overflow-hidden shrink-0">
              {/* Resplandor Aurora */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 opacity-30 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr from-blue-600 via-emerald-400 to-teal-300 opacity-20 blur-2xl pointer-events-none" />

              <div className="relative flex items-center justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold tracking-wide text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                    CVForge AI Copilot • Pro Exclusive
                  </div>
                  <h3 className="text-[20px] font-semibold text-white tracking-tight">
                    Asistente de Carrera Ejecutivo
                  </h3>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pestañas de Acceso Rápido */}
              <div className="relative flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 text-[12px] font-medium">
                <button
                  onClick={() => {
                    setActiveTab('bullet_improve');
                    setResultData(null);
                  }}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shrink-0 ${
                    activeTab === 'bullet_improve'
                      ? 'bg-white text-zinc-900 font-semibold shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ Pulir Viñetas</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('ats_audit');
                    setResultData(null);
                  }}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shrink-0 ${
                    activeTab === 'ats_audit'
                      ? 'bg-white text-zinc-900 font-semibold shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🎯 Match con Vacante</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('translate');
                    setResultData(null);
                  }}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shrink-0 ${
                    activeTab === 'translate'
                      ? 'bg-white text-zinc-900 font-semibold shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  <span>🌐 Traducir</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('interview_prep');
                    setResultData(null);
                  }}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shrink-0 ${
                    activeTab === 'interview_prep'
                      ? 'bg-white text-zinc-900 font-semibold shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>🎙️ Entrevista</span>
                </button>
              </div>
            </div>

            {/* Contenido / Área de Trabajo */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!isPro ? (
                /* Pantalla de Bloqueo Pro con PayPal CTA */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl p-8 text-center space-y-6 bg-gradient-to-br from-[#0071e3]/5 via-purple-500/5 to-pink-500/5 border border-[#0071e3]/20 shadow-xl relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-purple-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Lock className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
                      Acceso Exclusivo CVForge Pro
                    </h4>
                    <p className="text-[13.5px] text-[#86868b] max-w-sm mx-auto leading-relaxed">
                      El asistente de IA utiliza la fórmula Google XYZ, análisis ATS de concordancia y optimización de palabras clave para posicionarte en el 1% de candidatos.
                    </p>
                  </div>

                  <div className="space-y-3 text-left bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-[#d6d6d6]/60 text-[12.5px] text-[#1d1d1f]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Fórmula Google XYZ: "Logré X, medido por Y, haciendo Z"</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Auditoría ATS con puntuación y detección de keywords faltantes</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Traducción profesional con verbos asertivos ejecutivos</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Simulador STAR de preguntas clave para entrevistas</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenProModal}
                    className="w-full h-12 rounded-full bg-gradient-to-r from-[#0071e3] via-indigo-600 to-purple-600 hover:opacity-95 text-white text-[13.5px] font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Desbloquear con PayPal Pro ($9.99/mes o $4.99 único)</span>
                  </motion.button>
                </motion.div>
              ) : (
                /* Área de Trabajo Activa para Usuarios Pro */
                <div className="space-y-5">
                  {/* Selector Rápido de Experiencias del CV */}
                  {resumeData.experience.length > 0 && activeTab === 'bullet_improve' && (
                    <div>
                      <label className="block text-[11px] uppercase font-semibold text-[#86868b] mb-2 tracking-wider">
                        Seleccionar Logro de tu Experiencia
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {resumeData.experience.map((exp) => (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() => handleSelectExperienceBullet(exp.id, 0)}
                            className={`px-3 py-1.5 rounded-xl border text-[11.5px] whitespace-nowrap transition-all ${
                              selectedExpId === exp.id
                                ? 'border-[#0071e3] bg-[#0071e3]/10 font-semibold text-[#0071e3]'
                                : 'border-[#d6d6d6] bg-white hover:bg-[#f5f5f7] text-[#1d1d1f]'
                            }`}
                          >
                            {exp.company}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input de Contenido a Optimizar */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] uppercase font-semibold text-[#86868b] tracking-wider">
                        {activeTab === 'bullet_improve'
                          ? 'Viñeta o Logro Actual'
                          : activeTab === 'ats_audit'
                          ? 'Texto de tu Currículum / Logros'
                          : activeTab === 'translate'
                          ? 'Texto a Traducir'
                          : 'Experiencia para Preguntas de Entrevista'}
                      </label>
                      {activeTab === 'translate' && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setTargetLanguage('en')}
                            className={`px-2 py-0.5 rounded ${
                              targetLanguage === 'en' ? 'bg-[#0071e3] text-white font-medium' : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            Inglés
                          </button>
                          <button
                            type="button"
                            onClick={() => setTargetLanguage('es')}
                            className={`px-2 py-0.5 rounded ${
                              targetLanguage === 'es' ? 'bg-[#0071e3] text-white font-medium' : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            Español
                          </button>
                        </div>
                      )}
                    </div>
                    <textarea
                      rows={4}
                      value={contentToOptimize}
                      onChange={(e) => setContentToOptimize(e.target.value)}
                      placeholder="Ej: Desarrollé una API para el sistema de pagos que redujo las quejas de los clientes..."
                      className="w-full p-3.5 rounded-2xl border border-[#d6d6d6] bg-[#f5f5f7]/60 focus:bg-white focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] text-[13px] text-[#1d1d1f] leading-relaxed transition-all resize-none"
                    />
                  </div>

                  {/* Campo Adicional para ATS Audit: Descripción de Vacante */}
                  {activeTab === 'ats_audit' && (
                    <div>
                      <label className="block text-[11px] uppercase font-semibold text-[#86868b] mb-1.5 tracking-wider">
                        Pegar Descripción de la Oferta Laboral (Job Posting)
                      </label>
                      <textarea
                        rows={4}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Pega aquí los requisitos, stack y responsabilidades de la vacante (ej: LinkedIn, Indeed, InfoJobs)..."
                        className="w-full p-3.5 rounded-2xl border border-[#d6d6d6] bg-[#f5f5f7]/60 focus:bg-white focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] text-[13px] text-[#1d1d1f] leading-relaxed transition-all resize-none"
                      />
                    </div>
                  )}

                  {/* Botón de Ejecución */}
                  <button
                    onClick={handleRunAI}
                    disabled={isLoading || !contentToOptimize.trim()}
                    className="w-full h-11 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-[13px] font-medium flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analizando con Modelo de IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-cyan-200" />
                        <span>
                          {activeTab === 'bullet_improve'
                            ? 'Optimizar con Fórmula Google XYZ'
                            : activeTab === 'ats_audit'
                            ? 'Realizar Auditoría ATS'
                            : activeTab === 'translate'
                            ? `Traducir al ${targetLanguage === 'en' ? 'Inglés' : 'Español'}`
                            : 'Generar Preguntas de Entrevista'}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Mensajes de Error */}
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Notificación de Cambio Aplicado */}
                  {appliedNotification && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">¡Cambio aplicado con éxito a tu currículum!</span>
                    </div>
                  )}

                  {/* Resultados: Diff Visual Antes y Después */}
                  {resultData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-2"
                    >
                      {activeTab === 'bullet_improve' && (
                        <div className="space-y-3">
                          <h4 className="text-[12px] font-semibold text-[#1d1d1f] uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            Diff Visual: Fórmula Google XYZ
                          </h4>

                          {/* Comparativa Antes */}
                          <div className="p-3.5 rounded-2xl bg-zinc-100 border border-zinc-200 text-[12.5px] text-zinc-600">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                              Antes (Texto Original):
                            </span>
                            <p className="line-through opacity-80">{resultData.original}</p>
                          </div>

                          {/* Comparativa Después */}
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 border border-purple-200 text-[13px] text-purple-950 font-medium relative">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-bold uppercase text-purple-600 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Después (Google XYZ):
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                                Alto Impacto
                              </span>
                            </div>
                            <p className="leading-relaxed">{resultData.improved}</p>

                            {resultData.formulaBreakdown && (
                              <div className="mt-3 pt-3 border-t border-purple-200/60 grid grid-cols-3 gap-2 text-[10.5px]">
                                <div>
                                  <span className="font-bold text-indigo-700 block">X (Logro):</span>
                                  <span className="text-zinc-600">{resultData.formulaBreakdown.x_accomplished}</span>
                                </div>
                                <div>
                                  <span className="font-bold text-purple-700 block">Y (Métrica):</span>
                                  <span className="text-zinc-600">{resultData.formulaBreakdown.y_measured}</span>
                                </div>
                                <div>
                                  <span className="font-bold text-pink-700 block">Z (Acción):</span>
                                  <span className="text-zinc-600">{resultData.formulaBreakdown.z_action}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Botón Aplicar al CV */}
                          <button
                            onClick={handleApply}
                            className="w-full h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-medium flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                          >
                            <Check className="w-4 h-4" />
                            <span>Aplicar cambio al CV sin recargar</span>
                          </button>
                        </div>
                      )}

                      {/* Resultado ATS Audit */}
                      {activeTab === 'ats_audit' && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#d6d6d6] flex items-center justify-between">
                            <div>
                              <span className="text-[11px] uppercase font-bold text-[#86868b] block">Score ATS de Coincidencia</span>
                              <span className="text-[28px] font-bold text-[#1d1d1f] font-mono">
                                {resultData.matchScore}%
                              </span>
                            </div>
                            <div className="w-24 h-3 bg-zinc-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-700"
                                style={{ width: `${resultData.matchScore}%` }}
                              />
                            </div>
                          </div>

                          {/* Keywords Faltantes */}
                          {resultData.missingKeywords?.length > 0 && (
                            <div>
                              <span className="text-[11px] uppercase font-bold text-red-600 block mb-2">
                                Palabras Clave Faltantes en tu Perfil:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {resultData.missingKeywords.map((kw: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11.5px] font-mono"
                                  >
                                    + {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Sugerencias de Edición */}
                          {resultData.suggestedEdits?.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[11px] uppercase font-bold text-[#1d1d1f] block">
                                Acciones Recomendadas:
                              </span>
                              <ul className="space-y-1.5 text-[12px] text-[#86868b]">
                                {resultData.suggestedEdits.map((edit: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <ArrowRight className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                                    <span>{edit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Resultado Traducción */}
                      {activeTab === 'translate' && (
                        <div className="space-y-3">
                          <h4 className="text-[12px] font-semibold text-[#1d1d1f] uppercase tracking-wider">
                            Traducción Ejecutiva ({resultData.targetLanguage === 'en' ? 'Inglés' : 'Español'})
                          </h4>
                          <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-[13px] text-cyan-950 leading-relaxed font-medium">
                            <p>{resultData.translatedContent}</p>
                          </div>
                          <button
                            onClick={handleApply}
                            className="w-full h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-medium flex items-center justify-center gap-1.5 shadow-md transition-all"
                          >
                            <Check className="w-4 h-4" />
                            <span>Reemplazar texto en el CV con la traducción</span>
                          </button>
                        </div>
                      )}

                      {/* Resultado Preguntas de Entrevista */}
                      {activeTab === 'interview_prep' && (
                        <div className="space-y-3">
                          <h4 className="text-[12px] font-semibold text-[#1d1d1f] uppercase tracking-wider">
                            Preguntas Clave Simuladas (Método STAR)
                          </h4>
                          <div className="space-y-3">
                            {resultData.questions?.map((q: any, i: number) => (
                              <div key={i} className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#d6d6d6] space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="text-[13px] font-semibold text-[#1d1d1f] leading-snug">
                                    {i + 1}. {q.question}
                                  </span>
                                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-700">
                                    {q.category}
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-[11.5px] text-[#86868b] leading-relaxed">
                                  <span className="font-semibold text-zinc-800 block mb-0.5">Consejo STAR:</span>
                                  {q.starTip}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
