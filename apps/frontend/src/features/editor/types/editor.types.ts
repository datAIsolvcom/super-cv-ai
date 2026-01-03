export interface CvContactInfo {
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
}

export interface CvExperience {
    title: string;
    company: string;
    dates: string;
    achievements: string[];
    location?: string;
}

export interface CvEducation {
    institution: string;
    degree: string;
    year: string;
    location?: string;
}

export interface CvProject {
    name: string;
    description: string;
    highlights: string[];
    technologies?: string[];
}

export interface CvData {
    full_name: string;
    professional_summary: string;
    contact_info: CvContactInfo;
    hard_skills: string[];
    soft_skills: string[];
    work_experience: CvExperience[];
    education: CvEducation[];
    projects: CvProject[];
    certifications?: string[];
}

export interface DesignSettings {
    fontFamily: "font-sans" | "font-serif" | "font-mono";
    fontSize: string;
    accentColor: string;
    lineHeight: string;
    scale: number;
    pageMargin: string;
    sectionSpacing: string;
}

export type SectionType =
    | "summary"
    | "experience"
    | "projects"
    | "skills"
    | "education";

export type TemplateType = "modern" | "classic" | "minimal";
