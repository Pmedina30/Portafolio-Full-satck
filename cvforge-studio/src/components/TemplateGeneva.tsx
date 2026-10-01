import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  data: ResumeData;
}

export const TemplateGeneva: React.FC<TemplateProps> = ({ data }) => {
  const { personalDetails, experience, education, skills, languages } = data;

  return (
    <div className="text-[#1d1d1f] font-sans h-full flex flex-col justify-between selection:bg-[#1d1d1f] selection:text-white">
      <div>
        {/* Encabezado Clásico Centrado de Alta Autoridad */}
        <header className="text-center border-b border-[#d6d6d6] pb-5 mb-6 space-y-1.5">
          <h1 className="text-[26px] font-serif tracking-[-0.2px] text-[#1d1d1f] font-normal">
            {personalDetails.fullName}
          </h1>
          <p className="text-[12px] italic text-[#86868b] font-serif tracking-wide">
            {personalDetails.headline}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] text-[#86868b] pt-1">
            <span>{personalDetails.location}</span>
            <span>•</span>
            <span>{personalDetails.email}</span>
            <span>•</span>
            <span>{personalDetails.phone}</span>
            {personalDetails.website && (
              <>
                <span>•</span>
                <span className="text-[#0071e3]">{personalDetails.website.replace(/^https?:\/\//, '')}</span>
              </>
            )}
          </div>
        </header>

        {/* Resumen */}
        <section className="mb-6 text-center max-w-xl mx-auto">
          <h2 className="text-[11px] font-serif uppercase tracking-[2px] text-[#86868b] mb-2">
            Perfil Profesional
          </h2>
          <p className="text-[12px] leading-relaxed text-[#1d1d1f]/90 italic font-serif">
            "{personalDetails.summary}"
          </p>
        </section>

        {/* Experiencia Laboral */}
        <section className="mb-6 space-y-4">
          <h2 className="text-[11px] font-serif uppercase tracking-[2px] text-[#86868b] border-b border-[#d6d6d6] pb-1">
            Experiencia y Liderazgo
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline text-[12.5px]">
                  <span className="font-semibold text-[#1d1d1f] font-serif">{exp.role}</span>
                  <span className="text-[10px] font-mono text-[#86868b]">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-[11px] text-[#86868b]">{exp.company} — {exp.location}</div>
                <p className="text-[11.5px] leading-relaxed text-[#1d1d1f]/85 pt-0.5">{exp.description}</p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] text-[#1d1d1f]/80 pl-1 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Educación y Competencias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
          <section className="space-y-2.5">
            <h2 className="text-[11px] font-serif uppercase tracking-[2px] text-[#86868b] border-b border-[#d6d6d6] pb-1">
              Formación Académica
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="text-[11.5px]">
                <p className="font-serif font-semibold text-[#1d1d1f]">{edu.degree}</p>
                <p className="text-[#86868b]">{edu.institution}</p>
                <p className="text-[10px] font-mono text-[#86868b]">{edu.startDate} – {edu.endDate}</p>
              </div>
            ))}
          </section>

          <section className="space-y-2.5">
            <h2 className="text-[11px] font-serif uppercase tracking-[2px] text-[#86868b] border-b border-[#d6d6d6] pb-1">
              Capacidades & Idiomas
            </h2>
            <div className="flex flex-wrap gap-1 text-[11px] text-[#1d1d1f]">
              {skills.map((s, idx) => (
                <span key={idx} className="border border-[#d6d6d6] px-2 py-0.5 rounded text-[10.5px]">
                  {s}
                </span>
              ))}
            </div>
            {languages && languages.length > 0 && (
              <p className="text-[11px] text-[#86868b] italic pt-1 font-serif">
                {languages.join(' • ')}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
