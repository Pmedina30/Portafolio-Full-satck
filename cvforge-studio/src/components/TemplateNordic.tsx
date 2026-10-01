import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Globe, Award, Sparkles } from 'lucide-react';
import { maskPII } from '../lib/validation';

interface TemplateProps {
  data: ResumeData;
}

export const TemplateNordic: React.FC<TemplateProps> = ({ data }) => {
  const { experience, education, skills, languages, certifications, hasWatermark } = data;
  const personalDetails = maskPII(data.personalDetails, data.privacySettings);

  return (
    <div className="bg-[#f7f5f0] text-[#2c2925] p-2 sm:p-4 rounded-xl min-h-full flex flex-col justify-between selection:bg-[#c05c46] selection:text-white font-sans">
      <div>
        {/* Header Editorial con Tipografía Serif Clásica y Acento Terracota */}
        <header className="border-b-2 border-[#2d5a43]/20 pb-6 mb-7">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#2d5a43] uppercase font-semibold">
                ● Dossier Profesional
              </span>
              <h1 className="text-[28px] sm:text-[34px] font-serif font-normal tracking-tight text-[#1e1c19] mt-1 leading-none">
                {personalDetails.fullName}
              </h1>
            </div>
            <span className="text-[11px] font-serif italic text-[#c05c46]">
              Edición 2026
            </span>
          </div>

          <p className="text-[14px] font-serif italic text-[#c05c46] mt-2 font-medium">
            {personalDetails.headline}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-[11.5px] text-[#5c564f]">
            {personalDetails.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2d5a43]" />
                {personalDetails.email}
              </span>
            )}
            {personalDetails.phone && (
              <>
                <span className="text-[#c05c46]/40">•</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2d5a43]" />
                  {personalDetails.phone}
                </span>
              </>
            )}
            {personalDetails.location && (
              <>
                <span className="text-[#c05c46]/40">•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2d5a43]" />
                  {personalDetails.location}
                </span>
              </>
            )}
            {personalDetails.website && (
              <>
                <span className="text-[#c05c46]/40">•</span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#2d5a43]" />
                  {personalDetails.website.replace(/^https?:\/\//, '')}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Resumen Editorial */}
        {personalDetails.summary && (
          <section className="mb-7 bg-white/70 p-4 rounded-xl border border-[#e5e0d8]">
            <p className="text-[12.5px] font-serif leading-relaxed text-[#3d3832] italic">
              "{personalDetails.summary}"
            </p>
          </section>
        )}

        {/* Experiencia Profesional */}
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-4 pb-1 border-b border-[#2d5a43]/20">
            <span className="w-2 h-2 rounded-full bg-[#c05c46]" />
            <h2 className="text-[12px] font-serif font-bold uppercase tracking-wider text-[#2d5a43]">
              Trayectoria y Liderazgo
            </h2>
          </div>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-3 border-l-2 border-[#e5e0d8] hover:border-[#2d5a43] transition-colors">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-[13.5px] font-serif font-bold text-[#1e1c19]">
                    {exp.role}
                  </h3>
                  <span className="text-[10.5px] font-mono text-[#5c564f]">
                    {exp.startDate} – {exp.isCurrent ? 'Actualidad' : exp.endDate}
                  </span>
                </div>
                <div className="text-[12px] text-[#2d5a43] font-medium mb-2 flex items-center justify-between">
                  <span>{exp.company}</span>
                  <span className="text-[11px] text-[#5c564f] font-normal">{exp.location}</span>
                </div>
                <p className="text-[12px] text-[#3d3832] leading-relaxed mb-2">
                  {exp.description}
                </p>
                {exp.metrics && (
                  <div className="mb-2 p-2 rounded-lg bg-[#2d5a43]/10 border border-[#2d5a43]/20 text-[11px] text-[#2d5a43] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c05c46] flex-shrink-0" />
                    <span>Impacto: {exp.metrics}</span>
                  </div>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-1 text-[11.5px] text-[#4d4740]">
                    {exp.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-[#c05c46] font-bold">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Formación y Certificaciones */}
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#2d5a43]/20">
            <span className="w-2 h-2 rounded-full bg-[#2d5a43]" />
            <h2 className="text-[12px] font-serif font-bold uppercase tracking-wider text-[#2d5a43]">
              Formación Académica
            </h2>
          </div>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline bg-white/50 p-2.5 rounded-lg border border-[#e5e0d8]">
                <div>
                  <h3 className="text-[13px] font-serif font-bold text-[#1e1c19]">{edu.degree}</h3>
                  <p className="text-[11.5px] text-[#5c564f]">{edu.institution}</p>
                </div>
                <span className="text-[11px] font-mono text-[#5c564f]">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
            {certifications && certifications.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {certifications.map((c) => (
                  <div key={c.id} className="p-2 rounded-lg bg-white/70 border border-[#e5e0d8] flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#1e1c19] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#c05c46]" />
                      {c.name}
                    </span>
                    <span className="text-[#5c564f] font-mono text-[10px]">{c.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Competencias */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#2d5a43]/20">
            <span className="w-2 h-2 rounded-full bg-[#c05c46]" />
            <h2 className="text-[12px] font-serif font-bold uppercase tracking-wider text-[#2d5a43]">
              Especialidades y Destrezas
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-[11px] font-serif font-medium rounded-full bg-white border border-[#d6cfc5] text-[#2c2925] shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Idiomas */}
        {languages && languages.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#2d5a43]/20">
              <span className="w-2 h-2 rounded-full bg-[#2d5a43]" />
              <h2 className="text-[12px] font-serif font-bold uppercase tracking-wider text-[#2d5a43]">
                Idiomas
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 text-[12px] text-[#4d4740]">
              {languages.map((l, idx) => {
                const langName = typeof l === 'string' ? l : l.language;
                const langLevel = typeof l === 'string' ? '' : ` (${l.level})`;
                return (
                  <span key={idx}>
                    <strong className="font-serif font-bold text-[#1e1c19]">{langName}</strong>
                    <span className="text-[#c05c46] italic">{langLevel}</span>
                  </span>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Marca de agua condicional */}
      {hasWatermark !== false && (
        <footer className="mt-8 pt-3 border-t border-[#2d5a43]/20 flex justify-between items-center text-[10.5px] text-[#5c564f] font-serif italic">
          <span>● Creado con estilo Nordic Editorial en CVForge</span>
          <span className="text-[#c05c46] font-mono not-italic text-[10px]">cvforge.studio</span>
        </footer>
      )}
    </div>
  );
};
