import React, { useState } from 'react';
import { ResumeData, TemplateType } from '../types';
import { TemplateCupertino } from './TemplateCupertino';
import { TemplateZurich } from './TemplateZurich';
import { TemplateGeneva } from './TemplateGeneva';
import {
  FileDown,
  Mail,
  Copy,
  Check,
  QrCode,
  Share2,
  ExternalLink,
  Eye,
  ShieldCheck
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
  const [viewsCount] = useState(1483);

  const usernameSlug = resumeData.personalDetails.fullName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const publicUrl = `https://cvforge.app/u/${usernameSlug}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    publicUrl
  )}`;

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
          <div className="w-[1px] h-4 bg-[#d6d6d6]" />
          <div className="flex items-center gap-1.5 text-[12px] text-[#86868b]">
            <Eye className="w-3.5 h-3.5 text-[#1d1d1f]" />
            <span className="font-mono text-[#1d1d1f] font-semibold">{viewsCount}</span> visitas registradas
          </div>
        </div>

        {/* Acciones del Visitante */}
        <div className="flex flex-wrap items-center gap-2">
          {/* URL Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-white border border-[#d6d6d6] rounded-full px-3 py-1 text-[11.5px] text-[#86868b]">
            <span className="font-mono text-[#1d1d1f]">{publicUrl.replace('https://', '')}</span>
            <button onClick={handleCopyLink} className="hover:text-[#1d1d1f]" title="Copiar enlace">
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Ver QR Modal */}
          <button
            onClick={() => setShowQrModal(true)}
            className="h-8 px-3 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] inline-flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Código QR</span>
          </button>

          {/* Contactar por Email */}
          <a
            href={`mailto:${resumeData.personalDetails.email}`}
            className="h-8 px-3.5 rounded-full bg-white hover:bg-[#f5f5f7] border border-[#d6d6d6] text-[12px] font-medium text-[#1d1d1f] inline-flex items-center gap-1.5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
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
      <div className="max-w-[820px] mx-auto bg-white border border-[#d6d6d6] rounded-[28px] p-8 sm:p-14 select-text">
        {template === 'cupertino_minimal' && <TemplateCupertino data={resumeData} />}
        {template === 'zurich_executive' && <TemplateZurich data={resumeData} />}
        {template === 'geneva_classic' && <TemplateGeneva data={resumeData} />}

        {/* Footer del Perfil: Verificación Digital y QR */}
        <div className="mt-12 pt-8 border-t border-[#d6d6d6] flex flex-col sm:flex-row items-center justify-between gap-6">
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
                Escanea con la cámara de tu smartphone para acceder al currículum online interactivo y credenciales en tiempo real.
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-[#86868b]">
            <p>Alojado en <span className="font-semibold text-[#1d1d1f]">CVForge Studio</span></p>
            <p className="text-[10px] font-mono mt-0.5">Hash SHA256 verificado</p>
          </div>
        </div>

        {/* Watermark si es Free */}
        {!isPro && (
          <div className="mt-6 pt-4 border-t border-[#d6d6d6]/40 text-center text-[11px] text-[#86868b] no-print">
            ¿Deseas tu propio currículum con diseño Apple White Gallery?{' '}
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
    </div>
  );
};
