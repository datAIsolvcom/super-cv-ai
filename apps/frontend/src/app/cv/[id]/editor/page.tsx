"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCvQuery } from "@/features/analysis/api/useAnalysis";
import { useEditorStore } from "@/features/editor/stores/useEditorStore";
import { EditorLayout } from "@/features/editor/components/EditorLayout";
// import { LoadingView } from "@/features/dashboard/components/LoadingView";
import EditorLoading from "./loading";
import { Card } from "@/components/design-system/Card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import type { CvData } from "@/features/editor/types/editor.types";

export default function EditorPage() {
    const params = useParams();
    const cvId = params.id as string;
    const router = useRouter();

    // Use TanStack Query with auto-polling
    const { data, isLoading, error } = useCvQuery(cvId);

    // Zustand store actions
    const setCvData = useEditorStore((s) => s.setCvData);
    const setAiDraft = useEditorStore((s) => s.setAiDraft);

    // Sync CV data to Zustand store when query completes
    useEffect(() => {
        if (data?.originalData) {
            setCvData(data.originalData as unknown as CvData);
        }
        if (data?.aiDraft) {
            setAiDraft(data.aiDraft as unknown as CvData);
        }
    }, [data, setCvData, setAiDraft]);

    // ============================================
    // NON-BLOCKING: Only show generic loader on INITIAL load (no data yet)
    // If data exists but is refetching, let EditorLayout handle its own UI
    // ============================================
    const showInitialLoader = (isLoading && !data) ||
        (!data?.originalData && (data?.status === "PENDING" || data?.status === "PROCESSING"));

    if (showInitialLoader) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <EditorLoading />
                <p className="mt-8 text-slate-400 font-serif animate-pulse tracking-wide">
                    Preparing Executive Workspace...
                </p>
            </div>
        );
    }

    // Error state
    if (error || data?.status === "FAILED") {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

                <Card variant="panel" className="p-10 rounded-3xl border-red-500/20 text-center max-w-md w-full relative z-10">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Editor Error</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        {error?.message || "Unable to load the editor workspace. Please try refreshing or re-uploading your document."}
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Return Dashboard
                    </button>
                </Card>
            </div>
        );
    }

    // Success state
    return <EditorLayout />;
}