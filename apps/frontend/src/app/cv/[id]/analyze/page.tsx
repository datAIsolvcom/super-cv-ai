"use client";

import { useParams, useRouter } from "next/navigation";
import { useCvPolling } from "@/hooks/useCvPolling";
import { AnalysisView } from "@/components/core/AnalysisView";
import { Loader2, AlertCircle } from "lucide-react";

export default function AnalyzePage() {
  const params = useParams();
  const cvId = params.id as string;
  const router = useRouter();

  const { pollingStatus, error } = useCvPolling(cvId);

  if (pollingStatus === 'PENDING' || pollingStatus === 'PROCESSING') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
              <Loader2 className="animate-spin text-indigo-500" size={48} />
              <div className="text-center">
                  <h2 className="text-xl font-bold">AI is Analyzing Your CV...</h2>
                  <p className="text-slate-400 text-sm mt-1">This usually takes 10-20 seconds.</p>
                  <p className="text-slate-600 text-xs mt-4">ID: {cvId}</p>
              </div>
          </div>
      );
  }

  if (pollingStatus === 'FAILED' || error) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-red-400 gap-4">
              <AlertCircle size={48} />
              <p className="font-bold">Analysis Failed</p>
              <p className="text-sm">{error || "Something went wrong with the AI Engine."}</p>
              <button onClick={() => router.push('/')} className="text-white underline mt-4">Go Home</button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
       <AnalysisView />
    </div>
  );
}