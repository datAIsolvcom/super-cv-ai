import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CvRecord, CvStatus } from "../types/analysis.types";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


async function fetchCvStatus(cvId: string): Promise<CvRecord> {
    const response = await fetch(`${API_BASE_URL}/cv/${cvId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch CV status: ${response.statusText}`);
    }
    return response.json();
}

interface AnalyzePayload {
    file: File;
    jobDescriptionText?: string;
    jobDescriptionUrl?: string;
    userId?: string;
}

interface AnalyzeResponse {
    cvId: string;
    status: CvStatus;
}

async function analyzeCv(payload: AnalyzePayload): Promise<AnalyzeResponse> {
    const formData = new FormData();
    formData.append("file", payload.file);

    if (payload.jobDescriptionText) {
        formData.append("jobDescriptionText", payload.jobDescriptionText);
    }
    if (payload.jobDescriptionUrl) {
        formData.append("jobDescriptionUrl", payload.jobDescriptionUrl);
    }

    const headers: HeadersInit = {};
    if (payload.userId) {
        headers["userId"] = payload.userId;
    }

    const response = await fetch(`${API_BASE_URL}/cv/analyze`, {
        method: "POST",
        headers,
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(error.message || "Failed to analyze CV");
    }

    return response.json();
}

interface ClaimResponse {
    status: string;
    remainingCredits?: number;
    message?: string;
}

async function claimCv(cvId: string, userId: string): Promise<ClaimResponse> {
    const response = await fetch(`${API_BASE_URL}/cv/${cvId}/claim`, {
        method: "POST",
        headers: {
            userId,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Claim failed" }));
        throw new Error(error.message || "Failed to claim CV");
    }

    return response.json();
}

interface CustomizePayload {
    cvId: string;
    mode: "analysis" | "job_desc";
}

async function customizeCv(payload: CustomizePayload): Promise<{ message: string; status: string }> {
    const response = await fetch(`${API_BASE_URL}/cv/${payload.cvId}/customize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: payload.mode }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Customize failed" }));
        throw new Error(error.message || "Failed to customize CV");
    }

    return response.json();
}


export const analysisKeys = {
    all: ["analysis"] as const,
    cv: (id: string) => [...analysisKeys.all, "cv", id] as const,
};


export function useCvQuery(cvId: string | null) {
    return useQuery({
        queryKey: analysisKeys.cv(cvId || ""),
        queryFn: () => fetchCvStatus(cvId!),
        enabled: !!cvId,

        refetchInterval: (query) => {
            const status = query.state.data?.status;
            if (status === "COMPLETED" || status === "FAILED") {
                return false;
            }
            return 2000;
        },

        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

        staleTime: 1000,
    });
}


export function useAnalyzeMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: analyzeCv,
        onSuccess: (data) => {

            queryClient.prefetchQuery({
                queryKey: analysisKeys.cv(data.cvId),
                queryFn: () => fetchCvStatus(data.cvId),
            });
        },
    });
}


export function useClaimMutation(cvId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => claimCv(cvId, userId),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: analysisKeys.cv(cvId) });
        },
    });
}


export function useCustomizeMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: customizeCv,
        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({ queryKey: analysisKeys.cv(variables.cvId) });
        },
    });
}
