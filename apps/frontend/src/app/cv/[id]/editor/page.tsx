"use client";

import { useParams, useRouter } from "next/navigation";
import { useCvPolling } from "@/hooks/useCvPolling";
import { EditorLayout } from "@/components/core/EditorLayout"; 
import { LoadingView } from "@/components/core/LoadingView";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const cvId = params.id as string;
  const router = useRouter();

  
  const { pollingStatus, error } = useCvPolling(cvId);

  if (pollingStatus === 'PENDING' || pollingStatus === 'PROCESSING') {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
              <LoadingView /> 
              <p className="mt-8 text-slate-400 font-serif animate-pulse tracking-wide">
                  Preparing Executive Workspace...
              </p>
          </div>
      );
  }

  
  if (pollingStatus === 'FAILED' || error) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
             
              <div className="absolute w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none"/>
              
              <div className="glass-panel p-10 rounded-3xl border-red-500/20 text-center max-w-md w-full relative z-10">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                      <AlertCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-2">Editor Error</h2>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                      {error || "Unable to load the editor workspace. Please try refreshing or re-uploading your document."}
                  </p>
                  <button 
                    onClick={() => router.push('/')} 
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                      <ArrowLeft size={16}/> Return Dashboard
                  </button>
              </div>
          </div>
      );
  }


  return <EditorLayout />;
}