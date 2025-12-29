import { useState, useEffect } from "react";

export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

interface CvResult {
    score: number;
    summary: string;
    details: string;
}

export function useCvPolling (cvId: string) {
    const [status, setStatus] = useState<AnalysisStatus>('PENDING');
    const [data, setData] = useState<CvResult | null>(null);

    useEffect(() => {
        if (!cvId) return;

        const poll = setInterval(async () => {
            try {
        // Replace with your actual API endpoint
        // const res = await fetch(\`/api/cv/\${cvId}\`);
        // const json = await res.json();
        
        // MOCKING THE RESPONSE FOR DEMO
        const mockStatus = Math.random() > 0.7 ? 'COMPLETED' : 'PROCESSING';
        
        setStatus(mockStatus);
        
        if (mockStatus === 'COMPLETED') {
          setData({
            score: 85,
            summary: "Strong executive presence but lacks specific metric-driven achievements in the 'Experience' section.",
            details: "Detailed feedback regarding soft skills, keywords, and ATS parsing results..."
          });
          clearInterval(poll);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [cvId]);

  return { status, data };
}