export type Language = 'en' | 'es';

export type ProjectCategory =
  | 'All'
  | 'Full Stack & Cloud'
  | 'Data & Telemetry'
  | '3D & Spatial UI'
  | 'QA & FinTech';

export interface BilingualText {
  en: string;
  es: string;
}

export interface ProjectSimulationMetric {
  label: BilingualText;
  value: string;
  delta?: string;
  status?: 'optimal' | 'warning' | 'active';
}

export interface ProjectArchitectureLayer {
  layer: string;
  tech: string;
  detail: BilingualText;
}

export interface ProjectItem {
  id: string;
  index: string; // e.g., "01", "02"
  title: string;
  subtitle: BilingualText;
  category: Exclude<ProjectCategory, 'All'>;
  summary: BilingualText;
  problemSolved: BilingualText;
  impactMetrics: {
    en: string[];
    es: string[];
  };
  tags: string[];
  localPort?: string;
  launcherCmd?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  accentColor: 'vermilion' | 'emerald' | 'amber' | 'cyan';
  statusBadge: string;
  simulationType: 'aviation' | 'taxi' | 'pos' | 'qa' | 'spatial3d' | 'fintech';
  architecture: ProjectArchitectureLayer[];
  keyCodeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
}

export interface WorkspaceAppEntry {
  id: string;
  name: string;
  domain: BilingualText;
  stack: string[];
  port: string;
  launcher: string;
  liveUrl?: string;
  highlight: BilingualText;
}

export interface ExperienceItem {
  id: string;
  index: string;
  role: BilingualText;
  company: string;
  period: BilingualText;
  location: string;
  summary: BilingualText;
  achievements: {
    en: string[];
    es: string[];
  };
  metrics: {
    value: string;
    label: BilingualText;
  }[];
  keyTechnologies: string[];
  badge: BilingualText;
  type: 'experience' | 'education';
}

export interface CapabilityDomain {
  id: string;
  code: string;
  title: BilingualText;
  subtitle: BilingualText;
  description: BilingualText;
  deliverables: {
    en: string[];
    es: string[];
  };
  tools: {
    name: string;
    role: BilingualText;
    productionSystem: string;
  }[];
}

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  iconName: 'Github' | 'Linkedin' | 'Layers' | 'Mail';
}
