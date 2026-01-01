"use client";

import { useParams } from "next/navigation";
import { useCvPolling } from "@/hooks/useCvPolling";
import { useCv } from "@/lib/cv-context";
import { Loader2 } from "lucide-react";
import { EditorLayout } from "@/components/core/EditorLayout";


export default function EditorPage() {
  const params = useParams();
  const cvId = params.id as string;
  const { pollingStatus } = useCvPolling(cvId);
  const { aiDraft, cvData } = useCv();

  
  const isReady = pollingStatus === 'COMPLETED' && (aiDraft || cvData);

  if (!isReady && pollingStatus !== 'COMPLETED') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={48} />
              <h2 className="text-xl font-bold">AI is Rewriting Your CV...</h2>
              <p className="text-slate-400">Applying professional standards & fixing gaps.</p>
          </div>
      );
  }

  return (
    <div className="h-screen bg-slate-900 text-white">  
            <EditorLayout />
    </div>
  );
}