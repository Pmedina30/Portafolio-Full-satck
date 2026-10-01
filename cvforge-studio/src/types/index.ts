export type TemplateType =
  | 'cupertino_minimal' // Cupertino Executive (Apple White Gallery)
  | 'nordic_editorial'  // Nordic Editorial (Warm linen, editorial serif, terracotta/sage)
  | 'terminal_pro'       // Terminal Pro (Resend Tech style, dark monospace)
  | 'zurich_grid'        // Zurich Grid (Swiss Neo-Brutalist modular)
  | 'zurich_executive'   // Alias compatibilidad
  | 'geneva_classic';    // Alias compatibilidad

export type IndustryType =
  | 'tech_software'        // Tecnología / Software
  | 'customer_support_ops' // Servicio al Cliente / Operaciones
  | 'finance_management';  // Finanzas / Gestión

export interface PrivacySettings {
  hide_phone: boolean;
  hide_email: boolean;
  hide_address: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  metrics?: string; // Métrica de alto impacto tipo XYZ o KPI cuantificable
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  gpaOrHonors?: string;
}

export interface Project {
  id: string;
  name: string;
  url?: string;
  description: string;
  technologies: string[];
}

export interface PersonalDetails {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github?: string;
  linkedin?: string;
  summary: string;
}

export interface LanguageItem {
  language: string;
  level: string; // ej. Nativo, C2 - Bilingüe, C1 - Profesional, B2 - Intermedio
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  languages: (LanguageItem | string)[];
  certifications?: CertificationItem[];
  industry?: IndustryType;
  privacySettings?: PrivacySettings;
  hasWatermark?: boolean;
}

export type ViewMode = 'landing' | 'editor' | 'public_profile' | 'dashboard';
