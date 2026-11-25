import React, { useState } from 'react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import { Language } from '../types/portfolio';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  Copy,
  Github,
  Linkedin,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const [formData, setFormData] = useState({ name: '', email: '', scope: 'Full-Stack Engineering', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    const subject = `[Portfolio Inquiry: ${formData.scope}] — ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nScope: ${formData.scope}\n\nMessage:\n${formData.message}`;
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const getSocialIcon = (name: string) => {
    switch (name) {
      case 'GitHub':
        return <Github className="w-4 h-4" />;
      case 'LinkedIn':
        return <Linkedin className="w-4 h-4" />;
      case 'Behance':
        return <Layers className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="pb-8 mb-12 border-b border-[#DFDDD4] dark:border-[#242421]">
        <div className="font-mono text-xs uppercase tracking-widest text-[#FF4F18] font-semibold mb-2">
          {lang === 'en'
            ? '05 // INITIATE ENGINEERING DIALOGUE'
            : '05 // INICIAR CONVERSACIÓN TÉCNICA'}
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#111110] dark:text-[#F4F3EF]">
          {lang === 'en' ? (
            <>
              Ready to ship your next{' '}
              <span className="font-serif italic font-normal text-[#FF4F18]">
                critical
              </span>{' '}
              system.
            </>
          ) : (
            <>
              Listo para construir tu próximo{' '}
              <span className="font-serif italic font-normal text-[#FF4F18]">
                sistema
              </span>{' '}
              crítico.
            </>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Direct Dispatch Channels */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111110] border border-[#DFDDD4] dark:border-[#242421] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                ● {lang === 'en' ? 'DIRECT CHANNELS OPEN' : 'CANALES DIRECTOS ABIERTOS'}
              </span>
              <h3 className="font-display text-xl font-bold text-[#111110] dark:text-[#F4F3EF]">
                {lang === 'en' ? 'Direct Engineering Dispatch' : 'Contacto Directo'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {lang === 'en'
                  ? 'Available for full-time software engineering, data architecture, and high-impact technical consulting.'
                  : 'Disponible para posiciones de ingeniería de software, arquitectura de datos y consultoría técnica.'}
              </p>
            </div>

            <div className="space-y-3">
              {/* Email Card */}
              <div className="p-3.5 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#EEECE5] dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] flex items-center justify-center text-[#FF4F18] flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="font-mono text-[10px] uppercase text-neutral-500 block">
                      Email
                    </span>
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="font-mono text-xs font-semibold text-[#111110] dark:text-[#F4F3EF] hover:text-[#FF4F18] truncate block"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-white dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] text-neutral-500 hover:text-[#FF4F18]"
                  title="Copy Email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone / WhatsApp Card */}
              <div className="p-3.5 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#EEECE5] dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] flex items-center justify-center text-[#FF4F18] flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-neutral-500 block">
                      {lang === 'en' ? 'Phone / WhatsApp' : 'Teléfono / WhatsApp'}
                    </span>
                    <a
                      href="tel:+18292760195"
                      className="font-mono text-xs font-semibold text-[#111110] dark:text-[#F4F3EF] hover:text-[#FF4F18]"
                    >
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="p-2 rounded-lg bg-white dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] text-neutral-500 hover:text-[#FF4F18]"
                  title="Copy Phone"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Base Location */}
              <div className="p-3.5 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEECE5] dark:bg-[#171715] border border-[#DFDDD4] dark:border-[#262623] flex items-center justify-center text-[#FF4F18] flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-neutral-500 block">
                    {lang === 'en' ? 'Base Coordinates' : 'Ubicación Base'}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#111110] dark:text-[#F4F3EF]">
                    {PERSONAL_INFO.city} ({PERSONAL_INFO.coordinates})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Profiles */}
          <div className="pt-6 border-t border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-3">
              {lang === 'en' ? 'VERIFIED REPOSITORIES & NETWORKS' : 'REPOSITORIOS Y REDES VERIFICADAS'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] hover:border-[#FF4F18] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-neutral-600 dark:text-neutral-300 group-hover:text-[#FF4F18]">
                      {getSocialIcon(link.name)}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#111110] dark:text-[#F4F3EF] truncate">
                      {link.name}
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FF4F18] flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Structured Dispatch Form */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#111110] border border-[#DFDDD4] dark:border-[#242421] p-6 sm:p-8 shadow-sm">
          <h3 className="font-display text-xl font-bold text-[#111110] dark:text-[#F4F3EF] mb-1">
            {lang === 'en' ? 'Send Project or Role Brief' : 'Enviar Propuesta o Vacante'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
            {lang === 'en'
              ? 'Select your scope and dispatch a direct message. Typical response time is under 12 hours.'
              : 'Selecciona el alcance y envía un mensaje directo. Tiempo de respuesta promedio menor a 12 horas.'}
          </p>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-display text-lg font-bold text-[#111110] dark:text-[#F4F3EF]">
                {lang === 'en' ? 'Dispatch Prepared' : 'Mensaje Preparado'}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
                {lang === 'en'
                  ? `Your email client has opened with your message addressed to ${PERSONAL_INFO.email}.`
                  : `Tu cliente de correo se ha abierto con el mensaje dirigido a ${PERSONAL_INFO.email}.`}
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="font-mono text-xs font-bold text-[#FF4F18] underline pt-2"
              >
                {lang === 'en' ? 'Compose another message' : 'Redactar otro mensaje'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Scope Selector Pills */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                  {lang === 'en' ? '01 // Engagement Scope' : '01 // Tipo de Oportunidad'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Full-Stack Engineering',
                    'Data & Power BI / DAX',
                    '3D WebGL / Spatial UI'
                  ].map((scopeOption) => (
                    <button
                      key={scopeOption}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, scope: scopeOption }))}
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-semibold border transition-all text-left truncate ${
                        formData.scope === scopeOption
                          ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] border-[#111110] dark:border-[#F4F3EF]'
                          : 'bg-[#F6F5F0] dark:bg-[#0A0A09] text-neutral-600 dark:text-neutral-400 border-[#DFDDD4] dark:border-[#242421]'
                      }`}
                    >
                      {scopeOption}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
                    {lang === 'en' ? '02 // Your Name' : '02 // Tu Nombre'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={lang === 'en' ? 'Alex Rivera' : 'Nombre y Apellido'}
                    className="w-full text-xs bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] rounded-xl px-4 py-3 text-[#111110] dark:text-[#F4F3EF] placeholder:text-neutral-400 focus:outline-none focus:border-[#FF4F18]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
                    {lang === 'en' ? '03 // Your Email' : '03 // Tu Correo'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="alex@company.com"
                    className="w-full text-xs bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] rounded-xl px-4 py-3 text-[#111110] dark:text-[#F4F3EF] placeholder:text-neutral-400 focus:outline-none focus:border-[#FF4F18]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
                  {lang === 'en' ? '04 // Context & Objectives' : '04 // Mensaje o Detalles'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder={
                    lang === 'en'
                      ? 'Share role details, architecture goals, or timeline...'
                      : 'Comparte detalles de la posición, objetivos de arquitectura o tiempos...'
                  }
                  className="w-full text-xs bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] rounded-xl px-4 py-3 text-[#111110] dark:text-[#F4F3EF] placeholder:text-neutral-400 focus:outline-none focus:border-[#FF4F18] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF4F18] hover:bg-[#E03E0B] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {lang === 'en' ? 'Dispatch Direct Email' : 'Enviar Correo Directo'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
