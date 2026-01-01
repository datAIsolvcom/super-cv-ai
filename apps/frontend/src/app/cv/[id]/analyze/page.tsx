"use client";

import { useParams, useRouter } from "next/navigation";
import { useCvPolling } from "@/hooks/useCvPolling";
import { AnalysisView } from "@/components/core/AnalysisView";
import { LoadingView } from "@/components/core/LoadingView"; 
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AnalyzePage() {
  const params = useParams();
  const cvId = params.id as string;
  const router = useRouter();

  const { pollingStatus, error } = useCvPolling(cvId);

  
  if (pollingStatus === 'PENDING' || pollingStatus === 'PROCESSING') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
             
             <LoadingView />
          </div>
      );
  }


  if (pollingStatus === 'FAILED' || error) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
              
              <div className="absolute w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none"/>
              
              <div className="glass-panel p-10 rounded-3xl border-red-500/20 text-center max-w-md w-full relative z-10">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                      <AlertCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-2">Analysis Failed</h2>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                      {error || "We encountered an unexpected error while processing your document. Please try again."}
                  </p>
                  <button 
                    onClick={() => router.push('/')} 
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                      <ArrowLeft size={16}/> Return Home
                  </button>
              </div>
          </div>
      );
  }

  
  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-10 px-4 md:px-8">
       <AnalysisView />
    </div>
  );
}