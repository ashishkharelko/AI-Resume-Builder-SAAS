
export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface ResumeData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
    location: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
}

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'professional' | 'creative' | 'polished' | 'elegant' | 'executive';

export interface ATSAnalysis {
  score: number;
  breakdown: {
    keywords: number;
    impact: number;
    formatting: number;
  };
  suggestions: string[];
  missingKeywords: string[];
  rewrittenSummary?: string;
}
