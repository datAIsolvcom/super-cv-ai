"use client";

import { useState, useEffect, useRef } from "react";
import { useCv } from "@/lib/cv-context"; 

export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export function useCvPolling(cvId: string | null) {
  
    const { setAnalysisResult, setCvData, setAiDraft } = useCv();
    
    const [pollingStatus, setPollingStatus] = useState<AnalysisStatus>('PENDING');
    const [error, setError] = useState<string | null>(null);
    const stopPolling = useRef(false);

    useEffect(() => {
        if (!cvId) return;

   
        stopPolling.current = false;
        setPollingStatus('PENDING');
        setError(null);

        const poll = async () => {
            if (stopPolling.current) return;

            try {
                
                const res = await fetch(`http://localhost:3001/cv/${cvId}`);
                
                if (!res.ok) {
                    
                    console.warn("Polling retry..."); 
                    return; 
                }
                
                const data = await res.json();
                
                
                setPollingStatus(data.status);

              
                if (data.status === 'COMPLETED') {
                   
                    if (data.analysisResult) setAnalysisResult(data.analysisResult);
                    if (data.originalData) setCvData(data.originalData);
                    if (data.aiDraft) setAiDraft(data.aiDraft);
                    
                    stopPolling.current = true; 
                } 
                else if (data.status === 'FAILED') {
                    
                    setError("Proses AI Gagal. Silakan coba upload ulang.");
                    stopPolling.current = true;
                }
                
            } catch (e) {
                console.error("Polling Network Error", e);
                
            }
        };

        poll();

    
        const intervalId = setInterval(() => {
            if (stopPolling.current) {
                clearInterval(intervalId);
            } else {
                poll();
            }
        }, 2000);

     
        return () => {
            stopPolling.current = true;
            clearInterval(intervalId);
        };

    }, [cvId, setAnalysisResult, setCvData, setAiDraft]);

    return { pollingStatus, error };
}