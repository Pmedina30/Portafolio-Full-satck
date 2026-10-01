import React from 'react';
import { ResumeData } from '../types';
import { Terminal, Code2, Globe, Mail, Phone, MapPin, Cpu, Award } from 'lucide-react';
import { maskPII } from '../lib/validation';

interface TemplateProps {
  data: ResumeData;
}

export const TemplateTerminal: React.FC<TemplateProps> = ({ data }) => {
  const { experience, education, skills, languages, certifications, hasWatermark } = data;
  const personalDetails = maskPII(data.personalDetails, data.privacySettings);

  return (
    <div className="bg-[#0d0f12] text-[#d4d4d8] p-3 sm:p-5 rounded-xl min-h-full flex flex-col justify-between font-mono selection:bg-[#9281f7] selection:text-black">
      <div>
        {/* Terminal Header Bar */}
        <header className="border-b border-[#292d30] pb-5 mb-6">
          <div className="flex items-center justify-between text-[11px] text-[#71717a] mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80" />
              <span className="ml-1 text-[10px] text-zinc-500">profile.sh --release-2026</span>
            </div>
            <span className="text-[#9281f7] text-[10.5px]">status: VERIFIED_DEV</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#9281f7]">$</span>
              {personalDetails.fullName}
            </h1>
            <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
              ● ACTIVE_PROFILE
            </span>
          </div>

          <p className="text-[12.5px] text-[#9281f7] mt-1 font-semibold">
            {'>'} {personalDetails.headline}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[11px] text-[#a1a1aa]">
            {personalDetails.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#9281f7]" />
                {personalDetails.email}
              </span>
            )}
            {personalDetails.phone && (
              <>
                <span className="text-[#292d30]">|</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#9281f7]" />
                  {personalDetails.phone}
                </span>
              </>
            )}
            {personalDetails.location && (
              <>
                <span className="text-[#292d30]">|</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9281f7]" />
                  {personalDetails.location}
                </span>
              </>
            )}
            {personalDetails.website && (
              <>
                <span className="text-[#292d30]">|</span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#9281f7]" />
                  {personalDetails.website.replace(/^https?:\/\//, '')}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Resumen Tipo Manifest */}
        {personalDetails.summary && (
          <section className="mb-6 p-3.5 rounded-lg bg-[#14171c] border border-[#292d30]">
            <div className="text-[10px] text-[#71717a] mb-1">// SUMMARY_MANIFEST.md</div>
            <p className="text-[12px] leading-relaxed text-[#e4e4e7]">
              {personalDetails.summary}
            </p>
          </section>
        )}

        {/* Experiencia Laboral */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#292d30]">
            <Terminal className="w-3.5 h-3.5 text-[#9281f7]" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#9281f7]">
              git log --work-history
            </h2>
          </div>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="p-3 rounded-lg bg-[#14171c]/60 border border-[#292d30]">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-[13px] font-bold text-white flex items-center gap-1.5">
                    <span className="text-[#10b981]">commit</span> {exp.role}
                  </h3>
                  <span className="text-[10px] text-[#71717a]">
                    [{exp.startDate} - {exp.isCurrent ? 'HEAD' : exp.endDate}]
                  </span>
                </div>
                <div className="text-[11.5px] text-[#a1a1aa] mb-2">
                  <span className="text-white font-medium">@{exp.company}</span>
                  <span className="mx-2 text-[#292d30]">•</span>
                  <span className="text-[#71717a]">{exp.location}</span>
                </div>
                <p className="text-[11.5px] text-[#d4d4d8] leading-relaxed mb-2">
                  {exp.description}
                </p>
                {exp.metrics && (
                  <div className="mb-2 px-2.5 py-1.5 rounded bg-[#9281f7]/10 border border-[#9281f7]/30 text-[11px] text-[#9281f7] flex items-center gap-2">
                    <span className="text-[#10b981] font-bold">✓</span>
                    <span>metrics: {exp.metrics}</span>
                  </div>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-[#a1a1aa] pl-2 border-l border-[#292d30]">
                    {exp.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-[#9281f7]">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack & Tools */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#292d30]">
            <Cpu className="w-3.5 h-3.5 text-[#10b981]" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#10b981]">
              dependencies.lock // TECH_STACK
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] rounded bg-[#181b20] border border-[#292d30] text-[#e4e4e7] hover:border-[#9281f7] transition-colors"
              >
                <span className="text-[#71717a] mr-1">#</span>{skill}
              </span>
            ))}
          </div>
        </section>

        {/* Educación & Certificaciones */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#292d30]">
            <Code2 className="w-3.5 h-3.5 text-[#f59e0b]" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#f59e0b]">
              education.json
            </h2>
          </div>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline p-2.5 rounded bg-[#14171c]/40 border border-[#292d30]">
                <div>
                  <span className="text-[12px] font-semibold text-white">{edu.degree}</span>
                  <span className="text-[11px] text-[#71717a] ml-2">@ {edu.institution}</span>
                </div>
                <span className="text-[10px] text-[#71717a] font-mono">
                  {edu.startDate} : {edu.endDate}
                </span>
              </div>
            ))}
            {certifications && certifications.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {certifications.map((c) => (
                  <div key={c.id} className="p-2 rounded bg-[#14171c] border border-[#292d30] flex items-center justify-between text-[10.5px]">
                    <span className="text-white flex items-center gap-1.5">
                      <Award className="w-3 h-3 text-[#9281f7]" />
                      {c.name}
                    </span>
                    <span className="text-[#71717a]">{c.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Idiomas */}
        {languages && languages.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#292d30]">
              <span className="text-[#9281f7] text-xs">🌐</span>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#9281f7]">
                locales[]
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 text-[11.5px] text-[#a1a1aa]">
              {languages.map((l, idx) => {
                const langName = typeof l === 'string' ? l : l.language;
                const langLevel = typeof l === 'string' ? '' : ` (${l.level})`;
                return (
                  <span key={idx}>
                    <span className="text-[#10b981]">{langName}</span>
                    <span className="text-[#71717a]">{langLevel}</span>
                  </span>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Marca de agua condicional */}
      {hasWatermark !== false && (
        <footer className="mt-8 pt-3 border-t border-[#292d30] flex justify-between items-center text-[10px] text-[#71717a]">
          <span>$ echo "Built with Terminal Pro on CVForge Studio"</span>
          <span className="text-[#9281f7]">https://cvforge.studio</span>
        </footer>
      )}
    </div>
  );
};
