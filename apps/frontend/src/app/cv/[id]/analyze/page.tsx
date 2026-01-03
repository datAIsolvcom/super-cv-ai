"use client";

import { useParams, useRouter } from "next/navigation";
import { useCvQuery } from "@/features/analysis/api/useAnalysis";
import { AnalysisView } from "@/features/analysis/components/AnalysisView";
import AnalyzeLoading from "./loading";
import { Card } from "@/components/design-system/Card";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AnalyzePage() {
    const params = useParams();
    const cvId = params.id as string;
    const router = useRouter();

    // Use TanStack Query with auto-polling
    const { data, isLoading, error } = useCvQuery(cvId);

    // ============================================
    // NON-BLOCKING: Only show generic loader on INITIAL load (no data yet)
    // If data exists but is refetching, let AnalysisView handle its own UI
    // ============================================
    const showInitialLoader = (isLoading && !data) ||
        (!data?.analysisResult && (data?.status === "PENDING" || data?.status === "PROCESSING"));

    if (showInitialLoader) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <AnalyzeLoading />
            </div>
        );
    }

    // Error state
    if (error || data?.status === "FAILED") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

                <Card variant="panel" className="p-10 rounded-3xl border-red-500/20 text-center max-w-md w-full relative z-10">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Analysis Failed</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        {error?.message || "We encountered an unexpected error while processing your document. Please try again."}
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Return Home
                    </button>
                </Card>
            </div>
        );
    }

    // Success state - pass analysis result as prop
    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-10 px-4 md:px-8">
            <AnalysisView analysisResult={data?.analysisResult ?? null} />
        </div>
    );
}