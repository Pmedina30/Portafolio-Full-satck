import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Globe, TrendingUp, Award } from 'lucide-react';
import { maskPII } from '../lib/validation';

interface TemplateProps {
  data: ResumeData;
}

export const TemplateZurich: React.FC<TemplateProps> = ({ data }) => {
  const { experience, education, skills, languages, certifications, hasWatermark } = data;
  const personalDetails = maskPII(data.personalDetails, data.privacySettings);

  return (
    <div className="bg-white text-[#111111] font-sans h-full flex flex-col justify-between selection:bg-[#111111] selection:text-white p-2">
      <div>
        {/* Header Neo-Brutalista Suizo: Cuadrícula de Alto Contraste */}
        <header className="border-2 border-black p-5 mb-5 bg-[#fafafa]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="inline-block px-2.5 py-0.5 bg-black text-white text-[10px] font-mono uppercase tracking-widest font-bold mb-2">
                ZURICH GRID // ATS COMPLIANT
              </div>
              <h1 className="text-[28px] sm:text-[32px] font-black tracking-tight uppercase leading-none text-black">
                {personalDetails.fullName}
              </h1>
              <p className="text-[13px] font-bold text-zinc-700 mt-1 uppercase tracking-wider">
                {personalDetails.headline}
              </p>
            </div>

            <div className="text-[11px] font-mono space-y-1 text-zinc-700 border-l-2 border-black pl-3 sm:text-right sm:border-l-0 sm:border-r-2 sm:pr-3">
              {personalDetails.email && <div className="font-semibold">{personalDetails.email}</div>}
              {personalDetails.phone && <div>{personalDetails.phone}</div>}
              {personalDetails.location && <div>{personalDetails.location}</div>}
              {personalDetails.website && (
                <div className="text-black font-bold underline">
                  {personalDetails.website.replace(/^https?:\/\//, '')}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Resumen Ejecutivo en Bloque Segmentado */}
        {personalDetails.summary && (
          <section className="mb-5 border border-black p-3.5 bg-white">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
              [01] PERFIL EJECUTIVO
            </h2>
            <p className="text-[12px] leading-relaxed text-zinc-800 font-medium">
              {personalDetails.summary}
            </p>
          </section>
        )}

        {/* Experiencia Modular en Tarjetas Segmentadas */}
        <section className="mb-5">
          <div className="flex items-center justify-between border-b-2 border-black pb-1 mb-3">
            <h2 className="text-[12px] font-black uppercase tracking-wider text-black">
              [02] EXPERIENCIA & RESULTADOS CUANTIFICABLES
            </h2>
            <span className="text-[10px] font-mono text-zinc-500">HISTORIAL DE LOGROS</span>
          </div>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="border border-black p-3.5 bg-[#fbfbfb]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                  <h3 className="text-[13px] font-black uppercase text-black">
                    {exp.role}
                  </h3>
                  <span className="text-[10.5px] font-mono font-bold text-black bg-zinc-200 px-2 py-0.5 border border-black">
                    {exp.startDate} – {exp.isCurrent ? 'ACTUAL' : exp.endDate}
                  </span>
                </div>
                <div className="text-[11.5px] font-bold text-zinc-600 mb-2 flex items-center justify-between">
                  <span>{exp.company}</span>
                  <span className="text-zinc-500 font-normal">{exp.location}</span>
                </div>
                <p className="text-[12px] text-zinc-800 leading-relaxed mb-2">
                  {exp.description}
                </p>

                {/* Callout de Métricas Cuantificables */}
                {exp.metrics && (
                  <div className="mb-2 p-2 bg-black text-white rounded-none border border-black flex items-center gap-2 text-[11px] font-mono font-bold">
                    <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>KPI CLAVE: {exp.metrics}</span>
                  </div>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="space-y-1 border-t border-zinc-300 pt-2 mt-2">
                    {exp.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11.5px] text-zinc-700 leading-snug">
                        <span className="font-bold text-black font-mono">▪</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Cuadrícula de 2 Columnas: Educación y Competencias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Educación */}
          <section className="border border-black p-3 bg-white">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              [03] EDUCACIÓN & CERTIFICACIONES
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="text-[11.5px]">
                  <div className="font-bold text-black">{edu.degree}</div>
                  <div className="text-zinc-600 text-[11px] flex justify-between">
                    <span>{edu.institution}</span>
                    <span className="font-mono text-[10px]">{edu.startDate} - {edu.endDate}</span>
                  </div>
                </div>
              ))}
              {certifications && certifications.length > 0 && (
                <div className="pt-2 border-t border-zinc-200 space-y-1">
                  {certifications.map((c) => (
                    <div key={c.id} className="text-[10.5px] flex items-center justify-between font-mono">
                      <span className="font-bold text-black flex items-center gap-1">
                        <Award className="w-3 h-3 text-black" />
                        {c.name}
                      </span>
                      <span className="text-zinc-500">{c.year}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Competencias Clave */}
          <section className="border border-black p-3 bg-white">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              [04] MATRIZ DE COMPETENCIAS
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10.5px] font-mono font-bold uppercase bg-black text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
            {languages && languages.length > 0 && (
              <div className="mt-3 pt-2 border-t border-zinc-200">
                <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block mb-1">
                  IDIOMAS
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {languages.map((l, i) => {
                    const langName = typeof l === 'string' ? l : l.language;
                    const langLevel = typeof l === 'string' ? '' : ` [${l.level}]`;
                    return (
                      <span key={i} className="font-bold text-black font-mono">
                        {langName}<span className="text-zinc-500 font-normal">{langLevel}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Marca de agua condicional */}
      {hasWatermark !== false && (
        <footer className="mt-6 pt-2 border-t-2 border-black flex justify-between items-center text-[10px] font-mono uppercase font-bold text-black">
          <span>● Creado con Zurich Grid en CVForge</span>
          <span>cvforge.studio</span>
        </footer>
      )}
    </div>
  );
};
