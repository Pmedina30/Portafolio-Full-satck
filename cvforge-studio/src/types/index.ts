export type TemplateType = 'cupertino_minimal' | 'zurich_executive' | 'geneva_classic';

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
  summary: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  languages: string[];
}

export type ViewMode = 'landing' | 'editor' | 'public_profile' | 'dashboard';
