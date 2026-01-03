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

    const { data, isLoading, error } = useCvQuery(cvId);

    const showInitialLoader = (isLoading && !data) ||
        (!data?.analysisResult && (data?.status === "PENDING" || data?.status === "PROCESSING"));

    if (showInitialLoader) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-slate-950 p-4 transition-colors">
                <AnalyzeLoading />
            </div>
        );
    }


    if (error || data?.status === "FAILED") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-colors">
                <div className="absolute w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

                <Card variant="panel" className="p-10 rounded-3xl border-red-500/20 text-center max-w-md w-full relative z-10">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 dark:text-red-400">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">Analysis Failed</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                        {error?.message || "We encountered an unexpected error while processing your document. Please try again."}
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Return Home
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-slate-950 pt-20 pb-10 px-4 md:px-8 transition-colors">
            <AnalysisView analysisResult={data?.analysisResult ?? null} />
        </div>
    );
}