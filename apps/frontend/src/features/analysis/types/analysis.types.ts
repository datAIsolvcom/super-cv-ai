export interface CriticalGap {
    gap: string;
    action: string;
}

export interface AnalysisData {
    candidate_name: string;
    overall_score: number;
    overall_summary: string;
    writing_score: number;
    writing_detail: string;
    ats_score: number;
    ats_detail: string;
    skill_score: number;
    skill_detail: string;
    experience_score: number;
    experience_detail: string;
    keyword_score: number;
    key_strengths: string[];
    critical_gaps: CriticalGap[];
    missing_skills?: string[];
}

export type CvStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";


export interface CvRecord {
    id: string;
    userId?: string | null;
    fileUrl: string;
    status: CvStatus;
    jobContext?: {
        text?: string;
        url?: string;
    };
    analysisResult?: AnalysisData;
    originalData?: Record<string, unknown>;
    aiDraft?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
