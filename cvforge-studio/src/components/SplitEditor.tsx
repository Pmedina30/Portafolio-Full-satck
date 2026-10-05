import React, { useState } from 'react';
import { ResumeData, TemplateType, WorkExperience, IndustryType } from '../types';
import { TemplateCupertino } from './TemplateCupertino';
import { TemplateNordic } from './TemplateNordic';
import { TemplateTerminal } from './TemplateTerminal';
import { TemplateZurich } from './TemplateZurich';
import { TemplateGeneva } from './TemplateGeneva';
import { INDUSTRY_PRESETS } from '../data/mockData';
import { saveResumeSecurely } from '../lib/resumeService';
import { AIAssistantDrawer } from './editor/AIAssistantDrawer';
import { AssistantMode } from '../app/api/ai/assistant/route';
import {
  FileDown,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Copy,
  Save,
  Shield,
  Briefcase,
  Layers,
  Code2,
  Headphones,
  TrendingUp,
  Award,
  Lock,
  Eye,
  EyeOff,
  Zap,
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
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'privacy'>('personal');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedLink, setCopiedLink] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estados para el Copilot de IA Exclusivo Pro
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [drawerInitialContent, setDrawerInitialContent] = useState('');
  const [drawerInitialMode, setDrawerInitialMode] = useState<AssistantMode>('bullet_improve');

  const handleApplyAIChange = (
    target: 'summary' | 'experience_highlight' | 'full_text',
    newContent: string,
    expId?: string,
    highlightIndex?: number
  ) => {
    if (target === 'summary') {
      setResumeData((prev) => ({
        ...prev,
        personalDetails: { ...prev.personalDetails, summary: newContent },
      }));
    } else if (target === 'experience_highlight' && expId) {
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp) => {
          if (exp.id !== expId) return exp;
          const newHighlights = [...(exp.highlights || [])];
          if (typeof highlightIndex === 'number' && highlightIndex >= 0 && highlightIndex < newHighlights.length) {
            newHighlights[highlightIndex] = newContent;
          } else {
            newHighlights.push(newContent);
          }
          return {
            ...exp,
            highlights: newHighlights,
            metrics: exp.metrics || newContent,
          };
        }),
      }));
    }
  };

  const currentIndustry = resumeData.industry || 'tech_software';

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
    const isTech = currentIndustry === 'tech_software';
    const isCx = currentIndustry === 'customer_support_ops';
    
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: isTech ? 'Tech Core Labs' : isCx ? 'Global Helpdesk Solutions' : 'Iberia Partners Corp',
      role: isTech ? 'Senior Software Engineer' : isCx ? 'CX Operations Lead' : 'Senior Financial Analyst',
      location: 'Madrid / Remoto',
      startDate: '2023-01',
      endDate: 'Presente',
      isCurrent: true,
      description: isTech
        ? 'Liderazgo en arquitectura de microservicios y despliegue continuo.'
        : isCx
        ? 'Supervisión de KPIs de satisfacción y soporte multicanal.'
        : 'Modelización de proyecciones financieras y optimización de costes.',
      metrics: isTech
        ? 'Reducción del 35% en tiempo de respuesta de API'
        : isCx
        ? 'CSAT 98.2% y resolución en primer contacto del 84%'
        : 'Optimización del 12% en OPEX anual',
      highlights: ['Cumplimiento de objetivos trimestrales por encima del 110%.'],
    };
    setResumeData((prev) => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  const handleApplyIndustryPreset = (ind: IndustryType) => {
    const preset = INDUSTRY_PRESETS[ind];
    if (preset) {
      setResumeData((prev) => ({
        ...prev,
        ...preset,
        industry: ind,
        personalDetails: {
          ...prev.personalDetails,
          ...preset.personalDetails,
          fullName: prev.personalDetails.fullName || preset.personalDetails?.fullName || '',
        },
      }));
    }
  };

  const handleTogglePrivacy = (field: 'hide_phone' | 'hide_email' | 'hide_address') => {
    setResumeData((prev) => ({
      ...prev,
      privacySettings: {
        hide_phone: Boolean(prev.privacySettings?.hide_phone),
        hide_email: Boolean(prev.privacySettings?.hide_email),
        hide_address: Boolean(prev.privacySettings?.hide_address),
        [field]: !prev.privacySettings?.[field],
      },
    }));
  };

  const handleManualSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    const usernameSlug = resumeData.personalDetails.fullName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || 'mi-cv';

    const result = await saveResumeSecurely(
      resumeData,
      usernameSlug,
      resumeData.personalDetails.headline || 'Mi CV Profesional',
      template
    );

    setSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(`Error al guardar: ${result.error}`);
    }
  };

  const handleCopyPublicLink = () => {
    const usernameSlug = resumeData.personalDetails.fullName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || 'mi-cv';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5180';
    const url = `${origin}/#profile`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    if (!isPro) {
      const confirmDownload = window.confirm(
        'El plan Gratuito incluye una discreta marca de agua. ¿Deseas descargar el PDF ahora o desbloquear Pro sin marca?'
      );
      if (!confirmDownload) {
        onOpenCheckout();
        return;
      }
    }
    window.print();
  };

  return (
    <div className="pt-36 pb-20 px-4 sm:px-6 max-w-[1780px] mx-auto min-h-screen">
      {/* Barra de Controles Superiores del Editor */}
      <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-3.5 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 pl-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[13px] font-semibold text-[#1d1d1f]">Estudio de Edición en Vivo</span>
          </div>
          <span className="text-[11px] text-[#86868b] border-l border-[#d6d6d6] pl-3 hidden sm:inline-block">
            Renderizado A4 dinámico a 60 FPS
          </span>
        </div>

        {/* Selector de Plantillas Visuales Expandido */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#f5f5f7] border border-[#d6d6d6] rounded-full p-0.5">
            <button
              onClick={() => setTemplate('cupertino_minimal')}
              className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all ${
                template === 'cupertino_minimal' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
              title="Estilo Apple White Gallery — Blanco puro y líneas hairline"
            >
              Cupertino Executive
            </button>
            <button
              onClick={() => setTemplate('nordic_editorial')}
              className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all ${
                template === 'nordic_editorial' ? 'bg-white text-[#c05c46] shadow-sm font-serif' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
              title="Nordic Editorial — Lino cálido y titulares serif contemporáneos"
            >
              Nordic Editorial
            </button>
            <button
              onClick={() => setTemplate('terminal_pro')}
              className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all ${
                template === 'terminal_pro' ? 'bg-[#0d0f12] text-[#9281f7] shadow-sm font-mono' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
              title="Terminal Pro — Negro mate, fuente monospaciada y tags Resend style"
            >
              Terminal Pro
            </button>
            <button
              onClick={() => setTemplate('zurich_grid')}
              className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all ${
                template === 'zurich_grid' || template === 'zurich_executive' ? 'bg-black text-white shadow-sm font-bold' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
              title="Zurich Grid — Neo-Brutalist suizo modular con KPIs cuantificables"
            >
              Zurich Grid
            </button>
          </div>

          {/* Botón Copilot de IA Exclusivo Pro */}
          <button
            onClick={() => {
              setDrawerInitialMode('bullet_improve');
              setIsAIDrawerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-[12px] font-medium shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>AI Copilot Pro</span>
          </button>

          {/* Guardar Seguro */}
          <button
            onClick={handleManualSave}
            disabled={saving}
            className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-[12px] font-medium transition-all ${
              saveSuccess
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-white hover:bg-[#f5f5f7] border-[#d6d6d6] text-[#1d1d1f]'
            }`}
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#0071e3]" />
            )}
            <span>{saveSuccess ? 'Guardado en Supabase' : 'Guardar'}</span>
          </button>

          {/* Ver Perfil Público */}
          <button
            onClick={onViewPublicProfile}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#86868b]" />
            <span className="hidden sm:inline">Ver Web Pública</span>
          </button>

          {/* Exportar PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[12px] font-medium transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-white/90" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Asistente Inteligente de Industria & Onboarding */}
      <div className="bg-white border border-[#d6d6d6] rounded-[24px] p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-[#1d1d1f]">
              Asistente de Industria & Sugerencias de Secciones
            </h4>
            <p className="text-[11.5px] text-[#86868b]">
              Adapta el orden de secciones, métricas cuantificables y campos según tu disciplina:
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleApplyIndustryPreset('tech_software')}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium border flex items-center gap-1.5 transition-all ${
              currentIndustry === 'tech_software'
                ? 'bg-[#0071e3] text-white border-[#0071e3]'
                : 'bg-[#f5f5f7] text-[#1d1d1f] border-[#d6d6d6] hover:bg-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Tecnología / Software</span>
          </button>

          <button
            onClick={() => handleApplyIndustryPreset('customer_support_ops')}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium border flex items-center gap-1.5 transition-all ${
              currentIndustry === 'customer_support_ops'
                ? 'bg-[#0071e3] text-white border-[#0071e3]'
                : 'bg-[#f5f5f7] text-[#1d1d1f] border-[#d6d6d6] hover:bg-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Operaciones / CX</span>
          </button>

          <button
            onClick={() => handleApplyIndustryPreset('finance_management')}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium border flex items-center gap-1.5 transition-all ${
              currentIndustry === 'finance_management'
                ? 'bg-[#0071e3] text-white border-[#0071e3]'
                : 'bg-[#f5f5f7] text-[#1d1d1f] border-[#d6d6d6] hover:bg-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Finanzas / Gestión</span>
          </button>
        </div>
      </div>

      {/* Grid Split-Screen Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* PANEL IZQUIERDO: Formulario de Control Modular (5 Columnas) */}
        <section className="lg:col-span-5 space-y-5 no-print">
          {/* Navegación Modular de Pestañas */}
          <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-2 flex gap-1">
            {(['personal', 'experience', 'education', 'skills', 'privacy'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[11.5px] font-medium rounded-full transition-all flex items-center justify-center gap-1 ${
                  activeTab === tab ? 'bg-[#1d1d1f] text-white' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {tab === 'privacy' && <Shield className="w-3 h-3" />}
                <span>
                  {tab === 'personal'
                    ? 'Datos'
                    : tab === 'experience'
                    ? 'Experiencia'
                    : tab === 'education'
                    ? 'Estudios'
                    : tab === 'skills'
                    ? 'Skills'
                    : 'Privacidad'}
                </span>
              </button>
            ))}
          </div>

          {/* Formulario con tarjeta de radio 28px sin sombras */}
          <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-6 sm:p-7 space-y-4">
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d6d6d6] pb-2">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Información Personal</h3>
                  <span className="text-[11px] font-mono text-[#86868b]">Paso 01/05</span>
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
                      Sitio Web / Enlace
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalDetails.website}
                      onChange={(e) => handlePersonalChange('website', e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {currentIndustry === 'tech_software' && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                      Perfil de GitHub (Recomendado para Tech)
                    </label>
                    <input
                      type="text"
                      placeholder="github.com/tu-usuario"
                      value={resumeData.personalDetails.github || ''}
                      onChange={(e) => handlePersonalChange('github' as any, e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b]">
                      Resumen Ejecutivo (Perfil Profesional)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerInitialMode('bullet_improve');
                        setDrawerInitialContent(resumeData.personalDetails.summary);
                        setIsAIDrawerOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-[#0071e3] hover:underline font-medium"
                    >
                      <Sparkles className="w-3 h-3 text-[#0071e3]" />
                      <span>Optimizar con IA</span>
                    </button>
                  </div>
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

                    {/* Métrica de Alto Impacto (Fórmula XYZ) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10.5px] uppercase tracking-[0.5px] font-bold text-[#0071e3]">
                          KPI / Métrica de Alto Impacto (Fórmula XYZ)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setDrawerInitialMode('bullet_improve');
                            setDrawerInitialContent(exp.metrics || exp.description);
                            setIsAIDrawerOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-[10.5px] text-[#0071e3] hover:underline font-semibold"
                        >
                          <Sparkles className="w-3 h-3 text-[#0071e3]" />
                          <span>Pulir con IA</span>
                        </button>
                      </div>
                      <input
                        placeholder={
                          currentIndustry === 'tech_software'
                            ? 'Ej: Reduje latencia en un 42% mediante optimización SQL y Redis'
                            : currentIndustry === 'customer_support_ops'
                            ? 'Ej: CSAT 98.4% sostenido y resolución en primer contacto (FCR) al 86%'
                            : 'Ej: Supervisión de presupuesto de $9.5M con 14% de ahorro en OPEX'
                        }
                        value={exp.metrics || ''}
                        onChange={(e) => handleExperienceChange(exp.id, 'metrics', e.target.value)}
                        className="w-full h-8 px-3 rounded-lg border border-[#0071e3]/40 bg-[#0071e3]/5 text-[12px] text-[#0071e3] font-medium"
                      />
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Descripción de responsabilidades y liderazgo"
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
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Educación & Certificaciones</h3>
                </div>

                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="p-3.5 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/30 space-y-2">
                    <input
                      placeholder="Título / Grado Académico"
                      value={edu.degree}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResumeData((prev) => ({
                          ...prev,
                          education: prev.education.map((item) => (item.id === edu.id ? { ...item, degree: val } : item)),
                        }));
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-[#d6d6d6] bg-white text-[12.5px]"
                    />
                    <input
                      placeholder="Institución Educativa"
                      value={edu.institution}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResumeData((prev) => ({
                          ...prev,
                          education: prev.education.map((item) => (item.id === edu.id ? { ...item, institution: val } : item)),
                        }));
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-[#d6d6d6] bg-white text-[12.5px]"
                    />
                  </div>
                ))}

                {/* Bloque Certificaciones Relevantes */}
                {resumeData.certifications && resumeData.certifications.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Certificaciones Profesionales Validadas</span>
                    </h4>
                    <div className="space-y-2">
                      {resumeData.certifications.map((cert) => (
                        <div key={cert.id} className="p-2.5 rounded-lg border border-[#d6d6d6] bg-white flex justify-between items-center text-[12px]">
                          <div>
                            <span className="font-medium text-[#1d1d1f] block">{cert.name}</span>
                            <span className="text-[11px] text-[#86868b]">{cert.issuer}</span>
                          </div>
                          <span className="font-mono text-[11px] text-[#86868b]">{cert.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d6d6d6] pb-2">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Competencias & Idiomas</h3>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                    Habilidades y Tecnologías (separadas por comas)
                  </label>
                  <textarea
                    rows={4}
                    value={resumeData.skills.join(', ')}
                    onChange={(e) => {
                      const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setResumeData((prev) => ({ ...prev, skills: list }));
                    }}
                    className="w-full p-3 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 text-[12.5px] leading-relaxed resize-none"
                  />
                </div>

                {/* Idiomas */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.5px] font-semibold text-[#86868b] mb-1">
                    Idiomas y Nivel de Competencia
                  </label>
                  <div className="space-y-2">
                    {resumeData.languages.map((lang, idx) => {
                      const name = typeof lang === 'string' ? lang : lang.language;
                      const level = typeof lang === 'string' ? '' : lang.level;
                      return (
                        <div key={idx} className="flex gap-2">
                          <input
                            value={name}
                            placeholder="Idioma"
                            readOnly
                            className="h-8 px-2.5 rounded-lg border border-[#d6d6d6] bg-white text-[12px] flex-1"
                          />
                          <input
                            value={level || 'Nivel profesional'}
                            placeholder="Nivel (ej: Nativo, C2)"
                            readOnly
                            className="h-8 px-2.5 rounded-lg border border-[#d6d6d6] bg-[#f5f5f7] text-[12px] w-40 text-[#86868b]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña de Privacidad y PII Masking */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d6d6d6] pb-2">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#0071e3]" />
                    <span>Seguridad & Privacidad de Datos</span>
                  </h3>
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Security by Design
                  </span>
                </div>

                <p className="text-[12px] text-[#86868b] leading-relaxed">
                  Configura qué información sensible debe ser enmascarada automáticamente al compartir tu enlace público para evitar indexación no deseada y recolección de bots:
                </p>

                <div className="space-y-3 pt-1">
                  {/* Toggle Teléfono */}
                  <div className="p-3 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 flex items-center justify-between">
                    <div>
                      <span className="text-[12.5px] font-medium text-[#1d1d1f] block">
                        Ocultar Teléfono en la URL Pública
                      </span>
                      <span className="text-[11px] text-[#86868b]">
                        Enmascara tu número (ej: +34 ••• ••••) ante visitantes externos.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePrivacy('hide_phone')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        resumeData.privacySettings?.hide_phone ? 'bg-[#0071e3]' : 'bg-[#d6d6d6]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          resumeData.privacySettings?.hide_phone ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle Correo */}
                  <div className="p-3 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 flex items-center justify-between">
                    <div>
                      <span className="text-[12.5px] font-medium text-[#1d1d1f] block">
                        Ocultar Correo Electrónico
                      </span>
                      <span className="text-[11px] text-[#86868b]">
                        Muestra sólo iniciales (ej: ja•••@dominio.com) para prevenir spam.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePrivacy('hide_email')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        resumeData.privacySettings?.hide_email ? 'bg-[#0071e3]' : 'bg-[#d6d6d6]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          resumeData.privacySettings?.hide_email ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle Dirección */}
                  <div className="p-3 rounded-xl border border-[#d6d6d6] bg-[#f5f5f7]/40 flex items-center justify-between">
                    <div>
                      <span className="text-[12.5px] font-medium text-[#1d1d1f] block">
                        Ocultar Dirección Exacta
                      </span>
                      <span className="text-[11px] text-[#86868b]">
                        Conserva únicamente país o provincia general en la vista compartida.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePrivacy('hide_address')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        resumeData.privacySettings?.hide_address ? 'bg-[#0071e3]' : 'bg-[#d6d6d6]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          resumeData.privacySettings?.hide_address ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0071e3]/5 border border-[#0071e3]/20 flex items-start gap-2.5 text-[11.5px] text-[#0071e3]">
                  <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    El servidor de Supabase aplica Row Level Security (RLS) impidiendo que usuarios no autorizados puedan acceder a tus registros en modo edición.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PANEL DERECHO: Previsualización en Vivo de Hoja A4 */}
        <section className="lg:col-span-7 flex flex-col items-center">
          {/* Barra de Herramientas de la Hoja A4 */}
          <div className="w-full max-w-[760px] flex items-center justify-between mb-3 px-2 no-print">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#86868b] uppercase tracking-wider">
                Previsualización Documento A4
              </span>
              <span className="text-[10px] text-zinc-400">•</span>
              <span className="text-[11px] font-medium text-[#1d1d1f] capitalize">
                {template.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Selector de Zoom */}
              <div className="flex items-center bg-white border border-[#d6d6d6] rounded-full p-0.5 text-[11px]">
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
              className="print-only-canvas relative w-full max-w-[760px] aspect-[1/1.414] bg-white border border-[#d6d6d6] p-8 sm:p-12 flex flex-col justify-between select-text rounded-2xl overflow-hidden"
              style={{
                boxShadow: 'none',
              }}
            >
              {/* Contenido renderizado según la plantilla activa */}
              <div className="flex-1">
                {template === 'cupertino_minimal' && <TemplateCupertino data={resumeData} />}
                {template === 'nordic_editorial' && <TemplateNordic data={resumeData} />}
                {template === 'terminal_pro' && <TemplateTerminal data={resumeData} />}
                {(template === 'zurich_grid' || template === 'zurich_executive') && <TemplateZurich data={resumeData} />}
                {template === 'geneva_classic' && <TemplateGeneva data={resumeData} />}
              </div>

              {/* Watermark Discreta para Plan Gratuito */}
              {!isPro && (
                <div className="pt-6 mt-6 border-t border-[#d6d6d6]/60 flex items-center justify-between text-[10px] text-[#86868b] select-none no-print">
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

      {/* Drawer del Copilot de IA Exclusivo Pro */}
      <AIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        isPro={isPro}
        onOpenProModal={onOpenCheckout}
        resumeData={resumeData}
        onApplyChange={handleApplyAIChange}
        initialMode={drawerInitialMode}
        initialContent={drawerInitialContent}
      />
    </div>
  );
};
