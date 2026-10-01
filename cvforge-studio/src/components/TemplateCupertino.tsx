import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Globe, Award, TrendingUp } from 'lucide-react';
import { maskPII } from '../lib/validation';

interface TemplateProps {
  data: ResumeData;
}

export const TemplateCupertino: React.FC<TemplateProps> = ({ data }) => {
  const { experience, education, skills, languages, certifications, hasWatermark } = data;
  const personalDetails = maskPII(data.personalDetails, data.privacySettings);

  return (
    <div className="text-[#1d1d1f] font-sans h-full flex flex-col justify-between selection:bg-[#1d1d1f] selection:text-white">
      <div>
        {/* Header con tipografía SF Pro Display estricta y Hairline Silver */}
        <header className="border-b border-[#d6d6d6] pb-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.8px] leading-tight text-[#1d1d1f]">
              {personalDetails.fullName}
            </h1>
            <span className="text-[11px] font-mono text-[#86868b] tracking-wider uppercase">
              Curriculum Vitae
            </span>
          </div>

          <p className="text-[13px] font-medium text-[#0071e3] mt-1 tracking-[-0.2px]">
            {personalDetails.headline}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[11px] text-[#86868b]">
            {personalDetails.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#1d1d1f]" />
                {personalDetails.email}
              </span>
            )}
            {personalDetails.phone && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#1d1d1f]" />
                  {personalDetails.phone}
                </span>
              </>
            )}
            {personalDetails.location && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#1d1d1f]" />
                  {personalDetails.location}
                </span>
              </>
            )}
            {personalDetails.website && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#1d1d1f]" />
                  {personalDetails.website.replace(/^https?:\/\//, '')}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Resumen Ejecutivo */}
        {personalDetails.summary && (
          <section className="mb-6">
            <p className="text-[12.5px] leading-relaxed text-[#1d1d1f]/90 text-justify">
              {personalDetails.summary}
            </p>
          </section>
        )}

        {/* Experiencia Laboral */}
        <section className="mb-6">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#86868b] mb-3 pb-1 border-b border-[#d6d6d6]">
            Experiencia Profesional
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-[13px] font-semibold text-[#1d1d1f] tracking-[-0.2px]">
                    {exp.role}
                  </h3>
                  <span className="text-[11px] font-mono text-[#86868b]">
                    {exp.startDate} – {exp.isCurrent ? 'Presente' : exp.endDate}
                  </span>
                </div>
                <div className="text-[12px] text-[#86868b] mb-1.5 flex items-center justify-between">
                  <span className="font-medium text-[#1d1d1f]/80">{exp.company}</span>
                  <span className="text-[11px]">{exp.location}</span>
                </div>
                <p className="text-[12px] text-[#1d1d1f]/80 leading-relaxed mb-2">
                  {exp.description}
                </p>
                {exp.metrics && (
                  <div className="mb-2 p-2 rounded-lg bg-[#0071e3]/5 border border-[#0071e3]/20 text-[11px] text-[#0071e3] font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>KPI / Impacto: {exp.metrics}</span>
                  </div>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-1 text-[11.5px] text-[#1d1d1f]/75">
                    {exp.highlights.map((item, idx) => (
                      <li key={idx} className="leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Educación */}
        <section className="mb-6">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#86868b] mb-3 pb-1 border-b border-[#d6d6d6]">
            Educación y Certificaciones
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-[12.5px] font-semibold text-[#1d1d1f]">{edu.degree}</h3>
                  <p className="text-[11.5px] text-[#86868b]">{edu.institution}</p>
                </div>
                <span className="text-[11px] font-mono text-[#86868b]">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
            {certifications && certifications.length > 0 && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {certifications.map((c) => (
                  <div key={c.id} className="p-2 rounded-lg border border-[#d6d6d6] bg-[#f5f5f7] flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#1d1d1f] flex items-center gap-1.5">
                      <Award className="w-3 h-3 text-[#0071e3]" />
                      {c.name}
                    </span>
                    <span className="text-[#86868b] font-mono">{c.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Competencias y Tecnologías */}
        <section className="mb-6">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#86868b] mb-3 pb-1 border-b border-[#d6d6d6]">
            Competencias Clave
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#d6d6d6]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Idiomas */}
        {languages && languages.length > 0 && (
          <section>
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#86868b] mb-2 pb-1 border-b border-[#d6d6d6]">
              Idiomas
            </h2>
            <div className="flex flex-wrap gap-4 text-[11.5px] text-[#1d1d1f]/80">
              {languages.map((l, idx) => {
                const langName = typeof l === 'string' ? l : l.language;
                const langLevel = typeof l === 'string' ? '' : ` (${l.level})`;
                return (
                  <span key={idx}>
                    <strong className="font-semibold text-[#1d1d1f]">{langName}</strong>
                    {langLevel}
                  </span>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Marca de agua condicional para plan gratuito */}
      {hasWatermark !== false && (
        <footer className="mt-8 pt-3 border-t border-[#d6d6d6]/60 flex justify-between items-center text-[10px] text-[#86868b] font-mono">
          <span>● Creado con CVForge Studio (Plan Gratuito)</span>
          <span className="text-[#0071e3]">cvforge.studio</span>
        </footer>
      )}
    </div>
  );
};
