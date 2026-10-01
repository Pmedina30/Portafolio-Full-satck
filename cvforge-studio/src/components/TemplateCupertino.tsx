import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export const TemplateCupertino: React.FC<TemplateProps> = ({ data }) => {
  const { personalDetails, experience, education, skills, languages } = data;

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
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#1d1d1f]" />
              {personalDetails.email}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#1d1d1f]" />
              {personalDetails.phone}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1d1d1f]" />
              {personalDetails.location}
            </span>
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
        <section className="mb-6">
          <p className="text-[12.5px] leading-relaxed text-[#1d1d1f]/90 text-justify">
            {personalDetails.summary}
          </p>
        </section>

        {/* Experiencia Laboral */}
        <section className="mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#d6d6d6] pb-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#86868b]">
              Experiencia Profesional
            </h2>
            <span className="text-[10px] font-mono text-[#86868b]">01</span>
          </div>

          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="text-[13px] font-semibold tracking-[-0.2px] text-[#1d1d1f]">
                    {exp.role}
                  </span>
                  <span className="text-[10.5px] font-mono text-[#86868b]">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <div className="text-[11.5px] text-[#86868b] font-medium">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                <p className="text-[11.5px] leading-relaxed text-[#1d1d1f]/85 pt-0.5">
                  {exp.description}
                </p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 text-[#1d1d1f]/80 pl-1 pt-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Educación y Competencias en 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Formación */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#d6d6d6] pb-1">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#86868b]">
                Formación Académica
              </h2>
              <span className="text-[10px] font-mono text-[#86868b]">02</span>
            </div>

            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="text-[11.5px]">
                  <p className="font-semibold text-[#1d1d1f]">{edu.degree}</p>
                  <p className="text-[#86868b]">{edu.institution}</p>
                  <div className="flex justify-between text-[10.5px] text-[#86868b] font-mono mt-0.5">
                    <span>{edu.startDate} — {edu.endDate}</span>
                    {edu.gpaOrHonors && (
                      <span className="text-[#0071e3] font-sans font-medium">{edu.gpaOrHonors}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Competencias Clave */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#d6d6d6] pb-1">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#86868b]">
                Competencias & Lenguajes
              </h2>
              <span className="text-[10px] font-mono text-[#86868b]">03</span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] text-[10.5px] text-[#1d1d1f]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {languages && languages.length > 0 && (
                <div className="pt-2 text-[11px] text-[#86868b] space-y-0.5">
                  <span className="font-semibold text-[#1d1d1f] block text-[10.5px] uppercase tracking-wider">Idiomas</span>
                  <p>{languages.join(' • ')}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
