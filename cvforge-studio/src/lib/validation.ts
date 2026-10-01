// src/lib/validation.ts
// Arquitectura de validación estricta (Zod-compatible) y sanitización anti-XSS
import { ResumeData, PrivacySettings, PersonalDetails, IndustryType } from '../types';

/**
 * Sanitiza una cadena eliminando etiquetas HTML peligrosas, inyecciones de scripts
 * y manejadores de eventos (onload, onerror, javascript: protocols).
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/\bon\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:[^"'\s]*/gi, '')
    .replace(/<[^>]*>?/gm, '') // Remover etiquetas HTML arbitrarias
    .trim();
}

/**
 * Enmascara datos personales sensibles para rutas públicas si la privacidad está activada.
 */
export function maskPII(personal: PersonalDetails, privacy?: PrivacySettings): PersonalDetails {
  if (!privacy) return { ...personal };

  const masked = { ...personal };

  if (privacy.hide_phone && masked.phone) {
    masked.phone = masked.phone.replace(/(\+?\d{1,3})?[\s-]?(\d{2,4})[\s-]?(\d{3,})/g, '$1 ••• ••••');
    if (!masked.phone.includes('•••')) {
      masked.phone = '••••••••••';
    }
  }

  if (privacy.hide_email && masked.email) {
    const parts = masked.email.split('@');
    if (parts.length === 2) {
      const name = parts[0];
      const visiblePart = name.slice(0, 2);
      masked.email = `${visiblePart}•••@${parts[1]}`;
    } else {
      masked.email = '••••@••••.com';
    }
  }

  if (privacy.hide_address && masked.location) {
    // Si oculta dirección exacta, conserva solo el país o región general
    const parts = masked.location.split(',');
    masked.location = parts.length > 1 ? parts[parts.length - 1].trim() : 'Ubicación Reservada';
  }

  return masked;
}

/**
 * Validador y sanitizador de objetos ResumeData completo.
 */
export function sanitizeResumeData(data: ResumeData): ResumeData {
  return {
    personalDetails: {
      fullName: sanitizeText(data.personalDetails?.fullName),
      headline: sanitizeText(data.personalDetails?.headline),
      email: sanitizeText(data.personalDetails?.email),
      phone: sanitizeText(data.personalDetails?.phone),
      location: sanitizeText(data.personalDetails?.location),
      website: sanitizeText(data.personalDetails?.website),
      github: data.personalDetails?.github ? sanitizeText(data.personalDetails.github) : undefined,
      linkedin: data.personalDetails?.linkedin ? sanitizeText(data.personalDetails.linkedin) : undefined,
      summary: sanitizeText(data.personalDetails?.summary),
    },
    experience: (data.experience || []).map((exp) => ({
      id: exp.id || `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      company: sanitizeText(exp.company),
      role: sanitizeText(exp.role),
      location: sanitizeText(exp.location),
      startDate: sanitizeText(exp.startDate),
      endDate: sanitizeText(exp.endDate),
      isCurrent: Boolean(exp.isCurrent),
      description: sanitizeText(exp.description),
      highlights: (exp.highlights || []).map(sanitizeText).filter(Boolean),
      metrics: exp.metrics ? sanitizeText(exp.metrics) : undefined,
    })),
    education: (data.education || []).map((edu) => ({
      id: edu.id || `edu_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      institution: sanitizeText(edu.institution),
      degree: sanitizeText(edu.degree),
      fieldOfStudy: edu.fieldOfStudy ? sanitizeText(edu.fieldOfStudy) : undefined,
      startDate: sanitizeText(edu.startDate),
      endDate: sanitizeText(edu.endDate),
      gpaOrHonors: edu.gpaOrHonors ? sanitizeText(edu.gpaOrHonors) : undefined,
    })),
    projects: (data.projects || []).map((p) => ({
      id: p.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: sanitizeText(p.name),
      url: p.url ? sanitizeText(p.url) : undefined,
      description: sanitizeText(p.description),
      technologies: (p.technologies || []).map(sanitizeText).filter(Boolean),
    })),
    skills: (data.skills || []).map(sanitizeText).filter(Boolean),
    languages: (data.languages || []).map((lang) => {
      if (typeof lang === 'string') return sanitizeText(lang);
      return {
        language: sanitizeText(lang.language),
        level: sanitizeText(lang.level),
      };
    }),
    certifications: (data.certifications || []).map((c) => ({
      id: c.id || `cert_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: sanitizeText(c.name),
      issuer: sanitizeText(c.issuer),
      year: sanitizeText(c.year),
    })),
    industry: (data.industry || 'tech_software') as IndustryType,
    privacySettings: {
      hide_phone: Boolean(data.privacySettings?.hide_phone),
      hide_email: Boolean(data.privacySettings?.hide_email),
      hide_address: Boolean(data.privacySettings?.hide_address),
    },
    hasWatermark: data.hasWatermark !== undefined ? Boolean(data.hasWatermark) : true,
  };
}

/**
 * Esquema de validación compatible con Zod (.safeParse() y .parse())
 */
export const ResumeDataSchema = {
  safeParse: (input: unknown): { success: boolean; data?: ResumeData; error?: { issues: { message: string }[] } } => {
    if (!input || typeof input !== 'object') {
      return {
        success: false,
        error: { issues: [{ message: 'El payload del CV debe ser un objeto válido.' }] },
      };
    }

    const raw = input as any;

    if (!raw.personalDetails || typeof raw.personalDetails !== 'object') {
      return {
        success: false,
        error: { issues: [{ message: 'Faltan los datos personales (personalDetails).' }] },
      };
    }

    if (!raw.personalDetails.fullName || raw.personalDetails.fullName.trim().length === 0) {
      return {
        success: false,
        error: { issues: [{ message: 'El nombre completo es obligatorio.' }] },
      };
    }

    if (raw.personalDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.personalDetails.email)) {
      return {
        success: false,
        error: { issues: [{ message: 'El formato de correo electrónico es inválido.' }] },
      };
    }

    const sanitized = sanitizeResumeData(raw as ResumeData);
    return { success: true, data: sanitized };
  },

  parse: (input: unknown): ResumeData => {
    const res = ResumeDataSchema.safeParse(input);
    if (!res.success) {
      throw new Error(res.error?.issues.map((i) => i.message).join(', '));
    }
    return res.data!;
  },
};
