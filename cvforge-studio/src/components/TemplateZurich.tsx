import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  data: ResumeData;
}

export const TemplateZurich: React.FC<TemplateProps> = ({ data }) => {
  const { personalDetails, experience, education, skills, languages } = data;

  return (
    <div className="text-[#1d1d1f] font-sans h-full grid grid-cols-12 gap-8 selection:bg-[#1d1d1f] selection:text-white">
      {/* Columna Izquierda Asimétrica: 4 Columnas */}
      <aside className="col-span-4 border-r border-[#d6d6d6] pr-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.6px] leading-[1.1] text-[#1d1d1f]">
              {personalDetails.fullName}
            </h1>
            <p className="text-[12px] font-medium text-[#86868b] mt-1.5 leading-snug">
              {personalDetails.headline}
            </p>
          </div>

          <div className="space-y-2 text-[11px] text-[#86868b]">
            <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[10px]">
              Contacto Directo
            </p>
            <p className="break-all">{personalDetails.email}</p>
            <p>{personalDetails.phone}</p>
            <p>{personalDetails.location}</p>
            {personalDetails.website && (
              <p className="text-[#0071e3] break-all">{personalDetails.website.replace(/^https?:\/\//, '')}</p>
            )}
          </div>

          <div className="space-y-2.5">
            <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[10px]">
              Competencias Clave
            </p>
            <div className="flex flex-col gap-1 text-[11px] text-[#1d1d1f]/85">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between border-b border-[#d6d6d6]/40 pb-0.5">
                  <span>{skill}</span>
                  <span className="text-[9px] font-mono text-[#86868b]">•</span>
                </div>
              ))}
            </div>
          </div>

          {languages && languages.length > 0 && (
            <div className="space-y-1 text-[11px] text-[#86868b]">
              <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[10px]">
                Idiomas
              </p>
              {languages.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-[#d6d6d6]/40 text-[9.5px] font-mono text-[#86868b]">
          EDICIÓN ZÚRICH SWISS 2026
        </div>
      </aside>

      {/* Columna Derecha Principal: 8 Columnas */}
      <main className="col-span-8 space-y-6">
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-[1px] text-[#1d1d1f] border-b border-[#1d1d1f] pb-1 mb-2.5">
            Perfil de Autoridad
          </h2>
          <p className="text-[12.5px] leading-relaxed text-[#1d1d1f]/90">
            {personalDetails.summary}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[1px] text-[#1d1d1f] border-b border-[#1d1d1f] pb-1">
            Trayectoria Profesional
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-bold tracking-[-0.2px]">{exp.role}</span>
                  <span className="text-[10px] font-mono text-[#86868b]">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-[11.5px] text-[#86868b] font-medium">{exp.company} — {exp.location}</div>
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

        <section className="space-y-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[1px] text-[#1d1d1f] border-b border-[#1d1d1f] pb-1">
            Formación y Reconocimientos
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-[11.5px]">
                <div>
                  <span className="font-bold text-[#1d1d1f]">{edu.degree}</span>
                  <p className="text-[11px] text-[#86868b]">{edu.institution}</p>
                  {edu.gpaOrHonors && (
                    <p className="text-[10.5px] text-[#0071e3] font-medium">{edu.gpaOrHonors}</p>
                  )}
                </div>
                <span className="text-[10px] font-mono text-[#86868b]">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
