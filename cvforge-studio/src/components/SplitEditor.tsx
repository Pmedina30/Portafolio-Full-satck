import React, { useState } from 'react';
import { ResumeData, TemplateType, WorkExperience } from '../types';
import { TemplateCupertino } from './TemplateCupertino';
import { TemplateZurich } from './TemplateZurich';
import { TemplateGeneva } from './TemplateGeneva';
import {
  FileDown,
  ExternalLink,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Check,
  Copy,
  Save
} from 'lucide-react';

interface SplitEditorProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;
  isPro: boolean;
  onOpenCheckout: () => void;
  onViewPublicProfile: () => void;
}

export const SplitEditor: React.FC<SplitEditorProps> = ({
  resumeData,
  setResumeData,
  template,
  setTemplate,
  isPro,
  onOpenCheckout,
  onViewPublicProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePersonalChange = (field: keyof typeof resumeData.personalDetails, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [field]: value },
    }));
  };

  const handleExperienceChange = (id: string, field: keyof WorkExperience, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: 'Empresa Tecnológica',
      role: 'Cargo Ejecutivo / Lead',
      location: 'Madrid / Remoto',
      startDate: '2023-01',
      endDate: 'Presente',
      isCurrent: true,
      description: 'Liderazgo de proyectos estratégicos de alta escala y coordinación de equipos.',
      highlights: ['Optimización de flujos y procesos clave.'],
    };
    setResumeData((prev) => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  const handleCopyPublicLink = () => {
    const usernameSlug = resumeData.personalDetails.fullName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const url = `https://cvforge.app/u/${usernameSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    if (!isPro) {
      const confirmDownload = window.confirm(
        'El plan Gratuito incluye una discreta marca de agua "Creado con CVForge Studio". ¿Deseas continuar o desbloquear el Plan Pro sin marca de agua?'
      );
      if (!confirmDownload) {
        onOpenCheckout();
        return;
      }
    }
    window.print();
  };

  return (
    // Padding superior corregido a pt-36 para garantizar separación absoluta de la Navbar
    <div className="pt-36 pb-20 px-4 sm:px-6 max-w-[1780px] mx-auto min-h-screen">
      {/* Barra de Controles Superiores del Editor */}
      <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-3.5 mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 pl-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[13px] font-semibold text-[#1d1d1f]">Estudio de Edición en Vivo</span>
          </div>
          <span className="text-[11px] text-[#86868b] border-l border-[#d6d6d6] pl-3 hidden sm:inline-block">
            Renderizado A4 instantáneo a 60 FPS
          </span>
        </div>

        {/* Plantillas y Acciones */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Plantilla Estricto */}
          <div className="flex items-center bg-[#f5f5f7] border border-[#d6d6d6] rounded-full p-0.5">
            <button
              onClick={() => setTemplate('cupertino_minimal')}
              className={`px-3.5 py-1 text-[11.5px] font-medium rounded-full transition-all ${
                template === 'cupertino_minimal' ? 'bg-white text-[#1d1d1f]' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Cupertino Minimal
            </button>
            <button
              onClick={() => setTemplate('zurich_executive')}
              className={`px-3.5 py-1 text-[11.5px] font-medium rounded-full transition-all ${
                template === 'zurich_executive' ? 'bg-white text-[#1d1d1f]' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Zurich Executive
            </button>
            <button
              onClick={() => setTemplate('geneva_classic')}
              className={`px-3.5 py-1 text-[11.5px] font-medium rounded-full transition-all ${
                template === 'geneva_classic' ? 'bg-white text-[#1d1d1f]' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Geneva Classic
            </button>
          </div>

          {/* Ver Perfil Público */}
          <button
            onClick={onViewPublicProfile}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#86868b]" />
            <span>Ver Web Pública</span>
          </button>

          {/* Exportar PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 h-9 px-4.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[12px] font-medium transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-white/90" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Grid Split-Screen Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* PANEL IZQUIERDO: Formulario de Control Modular (5 Columnas) */}
        <section className="lg:col-span-5 space-y-5 no-print">
          {/* Navegación Modular de Pestañas (Radio 28px) */}
          <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-2 flex gap-1">
            {(['personal', 'experience', 'education', 'skills'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[12px] font-medium rounded-full transition-all ${
                  activeTab === tab ? 'bg-[#1d1d1f] text-white' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {tab === 'personal'
                  ? 'Datos'
                  : tab === 'experience'
                  ? 'Experiencia'
                  : tab === 'education'
                  ? 'Estudios'
                  : 'Skills'}
              </button>
            ))}
          </div>

          {/* Formulario con tarjeta de radio 28px sin sombras */}
          <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-6 sm:p-7 space-y-4">
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d6d6d6] pb-2">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Información Personal</h3>
                  <span className="text-[11px] font-mono text-[#86868b]">Paso 01/04</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={resumeData.personalDetails.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                    Titular Ejecutivo
                  </label>
                  <input
                    type="text"
                    value={resumeData.personalDetails.headline}
                    onChange={(e) => handlePersonalChange('headline', e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                      Email Profesional
                    </label>
                    <input
                      type="email"
                      value={resumeData.personalDetails.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalDetails.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalDetails.location}
                      onChange={(e) => handlePersonalChange('location', e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                      Sitio Web / Portfolio
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalDetails.website}
                      onChange={(e) => handlePersonalChange('website', e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                    Resumen Ejecutivo (Perfil Profesional)
                  </label>
                  <textarea
                    rows={4}
                    value={resumeData.personalDetails.summary}
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d6d6d6] pb-2">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Historial de Experiencia</h3>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0071e3] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Posición</span>
                  </button>
                </div>

                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 rounded-2xl border border-[#d6d6d6] bg-[#f5f5f7]/30 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-mono text-[#86868b]">Posición 0{index + 1}</span>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Eliminar</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Cargo / Rol"
                        value={exp.role}
                        onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                        className="h-9 px-3 rounded-lg border border-[#d6d6d6] bg-white text-[12.5px]"
                      />
                      <input
                        placeholder="Empresa"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                        className="h-9 px-3 rounded-lg border border-[#d6d6d6] bg-white text-[12.5px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Fecha Inicio (ej: 2022-01)"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                        className="h-9 px-3 rounded-lg border border-[#d6d6d6] bg-white text-[12px]"
                      />
                      <input
                        placeholder="Fecha Fin (ej: Presente)"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                        className="h-9 px-3 rounded-lg border border-[#d6d6d6] bg-white text-[12px]"
                      />
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Descripción de logros e impacto"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#d6d6d6] bg-white text-[12px] resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d6d6d6] pb-2">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Educación y Certificaciones</h3>
                  <span className="text-[11px] font-mono text-[#86868b]">Paso 03/04</span>
                </div>

                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-2xl border border-[#d6d6d6] bg-white space-y-2">
                    <p className="text-[13.5px] font-semibold text-[#1d1d1f]">{edu.degree}</p>
                    <p className="text-[12px] text-[#86868b]">{edu.institution}</p>
                    <div className="flex justify-between text-[11px] text-[#86868b]">
                      <span>{edu.startDate} — {edu.endDate}</span>
                      {edu.gpaOrHonors && <span className="text-[#0071e3] font-medium">{edu.gpaOrHonors}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d6d6d6] pb-2">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Competencias y Lenguajes</h3>
                  <span className="text-[11px] font-mono text-[#86868b]">Paso 04/04</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-2">
                    Competencias Técnicas (Separadas por comas)
                  </label>
                  <textarea
                    rows={3}
                    value={resumeData.skills.join(', ')}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      }))
                    }
                    className="w-full p-3 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-2">
                    Idiomas
                  </label>
                  <textarea
                    rows={2}
                    value={resumeData.languages.join(', ')}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        languages: e.target.value.split(',').map((l) => l.trim()).filter(Boolean),
                      }))
                    }
                    className="w-full p-3 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PANEL DERECHO: Previsualización A4 en Tiempo Real (7 Columnas) */}
        <section className="lg:col-span-7 flex flex-col items-center">
          {/* Micro-interacciones de Cabecera A4 */}
          <div className="w-full flex flex-wrap items-center justify-between pb-3.5 px-2 gap-3 no-print">
            {/* Indicador Sutil: Guardado automático local */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#d6d6d6] text-[11.5px] font-medium text-[#1d1d1f]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Guardado automático local</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] text-[#86868b]">
                {template.replace('_', ' ')}
              </span>
            </div>

            {/* Controles Compactos Flotantes: Zoom rápido (75% / 100%) y Copiar Enlace Público */}
            <div className="flex items-center gap-2">
              {/* Selector de Zoom Rápido */}
              <div className="flex items-center bg-white border border-[#d6d6d6] rounded-full p-0.5 text-[11px] font-mono">
                <button
                  onClick={() => setZoomLevel(75)}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    zoomLevel === 75 ? 'bg-[#1d1d1f] text-white font-bold' : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  75%
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    zoomLevel === 100 ? 'bg-[#1d1d1f] text-white font-bold' : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  100%
                </button>
              </div>

              {/* Botón Directo: Copiar Enlace Público */}
              <button
                onClick={handleCopyPublicLink}
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[11.5px] font-medium text-[#1d1d1f] transition-all"
                title="Copiar URL pública del currículum"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#86868b]" />
                    <span>Copiar enlace</span>
                  </>
                )}
              </button>

              {/* Estado Watermark */}
              {isPro ? (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  PDF sin marca
                </span>
              ) : (
                <button
                  onClick={onOpenCheckout}
                  className="text-[11px] font-medium text-[#0071e3] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Remover marca
                </button>
              )}
            </div>
          </div>

          {/* Lienzo A4 con borde Hairline Silver, Gallery White, Cero Sombras */}
          <div
            className="w-full flex justify-center overflow-x-auto py-2 transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
          >
            <div
              className="print-only-canvas relative w-full max-w-[760px] aspect-[1/1.414] bg-white border border-[#d6d6d6] p-10 sm:p-12 flex flex-col justify-between select-text"
              style={{
                boxShadow: 'none',
              }}
            >
              {/* Contenido renderizado según la plantilla activa */}
              <div className="flex-1">
                {template === 'cupertino_minimal' && <TemplateCupertino data={resumeData} />}
                {template === 'zurich_executive' && <TemplateZurich data={resumeData} />}
                {template === 'geneva_classic' && <TemplateGeneva data={resumeData} />}
              </div>

              {/* Watermark Discreta para Plan Gratuito */}
              {!isPro && (
                <div className="pt-6 mt-6 border-t border-[#d6d6d6]/60 flex items-center justify-between text-[10px] text-[#86868b] select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-sm bg-white" />
                    </div>
                    <span>
                      Creado con <strong className="text-[#1d1d1f]">CVForge Studio</strong> — Galería Gratuita
                    </span>
                  </div>
                  <button
                    onClick={onOpenCheckout}
                    className="font-medium text-[#0071e3] hover:underline no-print"
                  >
                    Desbloquear versión oficial con Pro →
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
