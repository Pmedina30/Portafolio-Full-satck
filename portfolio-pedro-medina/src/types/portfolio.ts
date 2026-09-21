export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Data & Analytics' | 'Full Stack' | 'QA & Automation' | 'UI/UX Design';
  description: string;
  impactMetrics: string[];
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  accentGlow: 'purple' | 'blue' | 'emerald' | 'amber';
  statsBadge?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  keyTechnologies: string[];
  badge?: string;
  type: 'experience' | 'education';
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level: string; // 'Expert' | 'Advanced' | 'Proficient'
    percentage: number;
    icon?: string;
  }[];
}

export interface SocialLink {
  name: string;
  url: string;
  label: string;
  iconName: string;
}

