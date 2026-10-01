import React, { useState } from 'react';
import { ResumeData, TemplateType } from '../types';
import { TemplateCupertino } from './TemplateCupertino';
import { TemplateNordic } from './TemplateNordic';
import { TemplateTerminal } from './TemplateTerminal';
import { TemplateZurich } from './TemplateZurich';
import { TemplateGeneva } from './TemplateGeneva';
import { InteractiveIdBadge } from './3d/InteractiveIdBadge';
import {
  FileDown,
  Mail,
  Copy,
  Check,
  QrCode,
  Share2,
  ExternalLink,
  Eye,
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';

interface PublicResumeViewProps {
  resumeData: ResumeData;
  template: TemplateType;
  isPro: boolean;
  onOpenCheckout: () => void;
  onBackToEditor: () => void;
}

export const PublicResumeView: React.FC<PublicResumeViewProps> = ({
  resumeData,
  template,
  isPro,
  onOpenCheckout,
  onBackToEditor,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [viewsCount] = useState(1483);

  const usernameSlug = resumeData.personalDetails.fullName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'perfil';

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5180';
  const publicUrl = `${origin}/#profile`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    publicUrl
  )}`;

  const isPrivacyActive = Boolean(
    resumeData.privacySettings?.hide_phone ||
    resumeData.privacySettings?.hide_email ||
    resumeData.privacySettings?.hide_address
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!isPro) {
      const confirmDownload = window.confirm(
        'El perfil gratuito exporta con marca de agua discreta. ¿Deseas exportar o desbloquear la versión ejecutiva sin marca de agua?'
      );
      if (!confirmDownload) {
        onOpenCheckout();
        return;
      }
    }
    window.print();
  };

  return (
    <div className="pt-36 pb-20 px-4 min-h-screen bg-[#f5f5f7] selection:bg-[#1d1d1f] selection:text-white">
      {/* Barra de Acciones del Perfil Público */}
      <div className="max-w-[820px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEditor}
            className="text-[12.5px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
          >
            ← Volver al Editor
          </button>
          <span className="text-[#d6d6d6]">•</span>
          <div className="flex items-center gap-1.5 text-[12px] text-[#86868b] bg-white border border-[#d6d6d6] px-3 py-1 rounded-full">
            <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>{viewsCount.toLocaleString()} visualizaciones</span>
          </div>

          {isPrivacyActive && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>PII Masking Activo</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Credencial 3D */}
          <button
            onClick={() => setShowBadgeModal(true)}
            className="h-8 px-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 shadow-sm shadow-blue-500/25 transition-all"
            title="Ver Credencial 3D Holográfica"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Credencial 3D</span>
          </button>

          {/* Botón QR */}
          <button
            onClick={() => setShowQrModal(true)}
            className="h-8 px-3 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] inline-flex items-center gap-1.5 transition-colors"
            title="Generar Código QR del CV"
          >
            <QrCode className="w-3.5 h-3.5 text-[#86868b]" />
            <span>Código QR</span>
          </button>

          {/* Botón Copiar URL */}
          <button
            onClick={handleCopyLink}
            className="h-8 px-3.5 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] inline-flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#86868b]" />
                <span>Compartir</span>
              </>
            )}
          </button>

          {/* Contactar vía Email */}
          <a
            href={`mailto:${resumeData.personalDetails.email}?subject=Contacto%20Profesional%20vía%20CVForge`}
            className="h-8 px-3.5 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] inline-flex items-center gap-1.5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#86868b]" />
            <span>Contactar</span>
          </a>

          {/* Descargar PDF */}
          <button
            onClick={handleDownloadPdf}
            className="h-8 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Tarjeta Hoja de CV con Radio Estricto de 28px sin sombras */}
      <div className="max-w-[820px] mx-auto bg-white border border-[#d6d6d6] rounded-[28px] p-6 sm:p-12 select-text overflow-hidden">
        {template === 'cupertino_minimal' && <TemplateCupertino data={resumeData} />}
        {template === 'nordic_editorial' && <TemplateNordic data={resumeData} />}
        {template === 'terminal_pro' && <TemplateTerminal data={resumeData} />}
        {(template === 'zurich_grid' || template === 'zurich_executive') && <TemplateZurich data={resumeData} />}
        {template === 'geneva_classic' && <TemplateGeneva data={resumeData} />}

        {/* Footer del Perfil: Verificación Digital y QR */}
        <div className="mt-12 pt-8 border-t border-[#d6d6d6] flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
          <div className="flex items-center gap-4">
            <img
              src={qrApiUrl}
              alt="Código QR del Perfil"
              className="w-16 h-16 rounded-xl border border-[#d6d6d6] p-1 bg-white"
            />
            <div>
              <div className="flex items-center gap-1 text-[12px] font-semibold text-[#1d1d1f]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Perfil Digital Verificado</span>
              </div>
              <p className="text-[11px] text-[#86868b] leading-relaxed max-w-sm">
                Escanea con la cámara de tu smartphone para acceder al currículum interactivo y credenciales en tiempo real.
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-[#86868b]">
            <p>Alojado en <span className="font-semibold text-[#1d1d1f]">CVForge Studio</span></p>
            <p className="text-[10px] font-mono mt-0.5">Hash SHA256 criptográficamente seguro</p>
          </div>
        </div>

        {/* Watermark si es Free */}
        {!isPro && (
          <div className="mt-6 pt-4 border-t border-[#d6d6d6]/40 text-center text-[11px] text-[#86868b] no-print">
            ¿Deseas tu propio currículum profesional con diseño Gallery?{' '}
            <button onClick={onOpenCheckout} className="text-[#0071e3] font-medium hover:underline">
              Crea tu perfil gratis en CVForge →
            </button>
          </div>
        )}
      </div>

      {/* Modal de Código QR Ampliado */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm no-print">
          <div className="bg-white border border-[#d6d6d6] rounded-[28px] p-8 max-w-sm w-full text-center space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Código QR Ejecutivo</h3>
            <p className="text-[12px] text-[#86868b]">
              Listo para imprimir en tarjetas de presentación, dossiers o compartir en presentaciones ejecutivas.
            </p>

            <div className="flex justify-center p-4 bg-[#f5f5f7] rounded-2xl border border-[#d6d6d6]">
              <img src={qrApiUrl} alt="QR Grande" className="w-48 h-48 rounded-lg bg-white p-2" />
            </div>

            <p className="text-[11px] font-mono text-[#86868b] break-all">{publicUrl}</p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 text-[12px] font-medium rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] text-[#1d1d1f] border border-[#d6d6d6]"
              >
                {copied ? '¡Copiado!' : 'Copiar URL'}
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 text-[12px] font-medium rounded-full bg-[#1d1d1f] hover:bg-black text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Credencial 3D Holográfica Interactiva */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md no-print">
          <div className="relative flex flex-col items-center max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            {/* Botón flotante para cerrar */}
            <div className="w-full flex justify-end mb-2">
              <button
                onClick={() => setShowBadgeModal(false)}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[12px] font-medium backdrop-blur-lg border border-white/20 transition-colors"
              >
                ✕ Cerrar Credencial
              </button>
            </div>

            {/* Componente 3D Holographic ID Badge */}
            <InteractiveIdBadge
              personalDetails={resumeData.personalDetails}
              username={usernameSlug}
              onViewProfile={() => setShowBadgeModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
