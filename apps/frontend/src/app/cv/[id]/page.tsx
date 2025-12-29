"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Loader2, 
  ChevronLeft, 
  Award, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Briefcase,
  Cpu,
  Layout,
  PenTool,
  Target
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


interface AnalysisResult {
  candidate_name: string;
  overall_score: number;
  overall_detail: string;
  
  skill_score: number;
  skill_detail: string;
  
  format_score: number;
  format_detail: string;
  
  writing_score: number;
  writing_detail: string;
  
  experience_score: number;
  experience_detail: string;
  
  keyword_relevance_score: number;
  keyword_relevance: string[];
}

export default function CvResultPage() {
  const { id } = useParams();
  const [status, setStatus] = useState<"PENDING" | "PROCESSING" | "COMPLETED" | "FAILED">("PENDING");
  const [data, setData] = useState<AnalysisResult | null>(null);

  
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${backendUrl}/cv/${id}`);
        
        if (!res.ok) return; 

        const cv = await res.json();

        if (cv.status === "COMPLETED") {
          setStatus("COMPLETED");
          setData(cv.analysisResult);
          clearInterval(interval);
        } else if (cv.status === "FAILED") {
          setStatus("FAILED");
          clearInterval(interval);
        } else {
            setStatus("PROCESSING");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 2000); 

    return () => clearInterval(interval);
  }, [id]);

  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/50 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/50 bg-amber-500/10";
    return "text-rose-400 border-rose-500/50 bg-rose-500/10";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  
  if (status === "PROCESSING" || status === "PENDING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950" />
        <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6 relative z-10" />
        <h2 className="text-3xl font-serif font-bold relative z-10">Analyzing Profile</h2>
        <p className="text-slate-400 mt-2 relative z-10 animate-pulse">Benchmarking against job requirements...</p>
      </div>
    );
  }

  
  if (status === "FAILED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="p-8 border border-rose-500/30 bg-rose-500/10 rounded-3xl text-center max-w-md">
           <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-rose-400 mb-2">Analysis Failed</h2>
           <p className="text-slate-400 mb-6">Something went wrong with the AI Engine. Please check if the file is a valid PDF.</p>
           <Link href="/" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors">
             Try Again
           </Link>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 pt-24">
        <div className="max-w-6xl mx-auto px-6">
            
            
            <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
                <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform"/> 
                Back to Dashboard
            </Link>

            {data && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
              
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Score Card */}
                    <div className="col-span-1 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className={`absolute inset-0 opacity-10 ${getScoreColor(data.overall_score).replace('text-', 'bg-')}`} />
                        
                        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                            
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                                <circle 
                                    cx="80" cy="80" r="70" 
                                    stroke="currentColor" 
                                    strokeWidth="12" 
                                    fill="transparent" 
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * data.overall_score) / 100}
                                    className={`${getProgressColor(data.overall_score).replace('bg-', 'text-')} transition-all duration-1000 ease-out`} 
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-white">{data.overall_score}</span>
                                <span className="text-xs uppercase tracking-wider text-slate-400 mt-1">Score</span>
                            </div>
                        </div>
                        
                        <h1 className="text-2xl font-serif font-bold text-white mb-1">{data.candidate_name}</h1>
                        <p className="text-sm text-slate-400">Analysis Result</p>
                    </div>

                    
                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                            <Award className="text-amber-400" />
                            Executive Summary
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg">
                            {data.overall_detail}
                        </p>
                    </div>
                </div>

                
                <div className="grid md:grid-cols-2 gap-6">
                    
                   
                    <ScoreCard 
                        icon={<PenTool size={20} />}
                        title="Writing Style"
                        score={data.writing_score}
                        detail={data.writing_detail}
                    />

                    
                    <ScoreCard 
                        icon={<Layout size={20} />}
                        title="ATS Compatibility"
                        score={data.format_score}
                        detail={data.format_detail}
                    />

                    
                    <ScoreCard 
                        icon={<Cpu size={20} />}
                        title="Technical Skills"
                        score={data.skill_score}
                        detail={data.skill_detail}
                    />

                   
                    <ScoreCard 
                        icon={<Briefcase size={20} />}
                        title="Experience Relevance"
                        score={data.experience_score}
                        detail={data.experience_detail}
                    />
                </div>

                
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <Target className="text-emerald-400" />
                            Keyword Match
                        </h3>
                        <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(data.keyword_relevance_score)}`}>
                            {data.keyword_relevance_score}/100 Match
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {data.keyword_relevance.map((keyword, i) => (
                            <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm font-medium hover:border-amber-500/50 hover:text-amber-400 transition-colors cursor-default">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>

            </motion.div>
            )}
        </div>
    </div>
  );

  
  function ScoreCard({ icon, title, score, detail }: { icon: any, title: string, score: number, detail: string }) {
      return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-800 rounded-xl text-slate-300 group-hover:text-white transition-colors">
                        {icon}
                    </div>
                    <h3 className="font-bold text-slate-200">{title}</h3>
                </div>
                <div className={`text-xl font-bold ${getScoreColor(score).split(" ")[0]}`}>
                    {score}
                </div>
            </div>
            
        
            <div className="w-full h-2 bg-slate-800 rounded-full mb-4 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${getProgressColor(score)}`} 
                    style={{ width: `${score}%` }}
                />
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
                {detail}
            </p>
        </div>
      );
  }
}