"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCv, CriticalGap } from "@/lib/cv-context"; 
import { useSession } from "next-auth/react"; 
import { 
  ArrowRight, Sparkles, ChevronLeft, Loader2, Info, X, 
  Zap, Check, ChevronDown, Lock, Unlock, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter"; 
import { UpgradeModal } from "@/components/UpgradeModal"; 


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function AnalysisView() {
  const { analysisResult } = useCv(); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{title: string, score: number, detail: string} | null>(null);

  const [isUnlocked, setIsUnlocked] = useState(false); 
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false); 

  const params = useParams();
  const router = useRouter();
  const cvId = params.id as string; 
  const { data: session } = useSession();

  const handleUnlock = async () => {
     if (!session?.user?.id) {
         const currentUrl = encodeURIComponent(window.location.href);
         router.push(`/login?callbackUrl=${currentUrl}`);
         return;
     }

     setIsUnlocking(true);
     try {
         const res = await fetch(`http://localhost:3001/cv/${cvId}/claim`, {
             method: 'POST',
             headers: { 'userId': session.user.id as string }
         });

         const data = await res.json();

         if (!res.ok) {
           
             if (res.status === 400 || res.status === 403) {
                setShowUpgradeModal(true);
             } else {
                console.error("Unlock error:", data.message);
               
             }
             setIsUnlocking(false);
             return;
         }
         setIsUnlocked(true);
     } catch (e) {
         console.error("Network error:", e);
        
     } finally {
         setIsUnlocking(false);
     }
  };

  const handleCustomize = async (mode: 'analysis' | 'job_desc') => {
    setIsGenerating(true);
    try {
        const res = await fetch(`http://localhost:3001/cv/${cvId}/customize`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode }) 
        });

        if (!res.ok) throw new Error("Failed");
        router.push(`/cv/${cvId}/editor`);
    } catch (e) {
        console.error("AI Customization error:", e);
        
        setIsGenerating(false);
    }
  };

  if (!analysisResult) return null;

  const metrics = [
      { label: "ATS Friendly", score: analysisResult.ats_score, detail: analysisResult.ats_detail },
      { label: "Writing Impact", score: analysisResult.writing_score, detail: analysisResult.writing_detail },
      { label: "Skill Match", score: analysisResult.skill_score, detail: analysisResult.skill_detail },
      { label: "Experience", score: analysisResult.experience_score, detail: analysisResult.experience_detail },
  ];

  const gapsDisplay: CriticalGap[] = analysisResult.critical_gaps || [];

  return (
    <div className="max-w-7xl mx-auto w-full relative pb-20">
        
      
        <UpgradeModal 
           isOpen={showUpgradeModal} 
           onClose={() => setShowUpgradeModal(false)} 
        />

     
        <AnimatePresence>
          {selectedMetric && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedMetric(null)}>
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                        <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${getScoreBgColor(selectedMetric.score)}`}><Info size={20}/></div>
                             <div>
                                <h3 className="font-bold text-white text-lg">{selectedMetric.title}</h3>
                                <p className="text-xs text-slate-400">Detailed Analysis Breakdown</p>
                             </div>
                        </div>
                        <button onClick={() => setSelectedMetric(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
                    </div>
                    <div className="p-8">
                         <div className="flex items-center justify-between mb-6 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score Achieved</span>
                             <div className="flex items-baseline gap-1"><span className={`text-3xl font-black ${getScoreTextColor(selectedMetric.score)}`}>{selectedMetric.score}</span><span className="text-sm text-slate-500 font-medium">/100</span></div>
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Analysis Insights</h4>
                            <div className="text-sm text-slate-300 leading-relaxed bg-slate-800/30 p-5 rounded-xl border border-white/5 shadow-inner">{selectedMetric.detail || "No detailed analysis available."}</div>
                         </div>
                         <button onClick={() => setSelectedMetric(null)} className="w-full mt-8 bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.01]">Close Analysis</button>
                    </div>
                </motion.div>
            </div>
          )}
        </AnimatePresence>

        {!isUnlocked ? (
          <div className="max-w-4xl mx-auto py-20 px-4 text-center relative min-h-[600px] flex flex-col items-center justify-center">
             <div className="absolute inset-0 opacity-20 pointer-events-none select-none overflow-hidden blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                      <div className="bg-slate-800 h-40 rounded-2xl w-full"/>
                      <div className="bg-slate-800 h-40 rounded-2xl w-full"/>
                      <div className="bg-slate-800 h-60 rounded-2xl w-full col-span-2"/>
                  </div>
             </div>

             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900/80 backdrop-blur-2xl p-10 md:p-14 rounded-[40px] shadow-2xl border border-champagne-500/20 max-w-lg w-full relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-champagne-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                      <Lock size={40} />
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-white mb-3">Analysis Complete</h2>
                  <p className="text-slate-400 mb-10 text-lg">
                      Your CV scored <span className="text-champagne-400 font-bold text-xl">{analysisResult.overall_score}/100</span>.
                      <br/> Unlock to reveal the strategy to improve it.
                  </p>
                  <button onClick={handleUnlock} disabled={isUnlocking} className="w-full py-5 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-champagne-100 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl">
                      {isUnlocking ? <Loader2 className="animate-spin text-orange-600"/> : <Unlock size={24} className="text-orange-600"/>}
                      {session ? "Unlock Report (1 Credit)" : "Sign In to Unlock"}
                  </button>
                  <p className="text-xs text-slate-500 mt-5 font-medium uppercase tracking-wider">{session ? "Instant Access • 1 Credit Deducted" : "Free Plan includes 3 Credits"}</p>
             </motion.div>
          </div>
        ) : (
         
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 px-4">
            
            <div className="grid lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-champagne-500/10 rounded-full blur-[100px] pointer-events-none"/>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-500/10 border border-champagne-500/20 text-champagne-400 text-xs font-bold uppercase tracking-widest">
                                <Sparkles size={12}/> Analysis Report
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                                Your CV Strength
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                                {analysisResult.overall_summary}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                <button onClick={() => handleCustomize('analysis')} disabled={isGenerating} className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-champagne-100 transition-colors shadow-lg shadow-white/10 flex items-center gap-2">
                                    {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Zap size={18} className="text-orange-600"/>} 
                                    Fix Issues with AI
                                </button>
                                <button onClick={() => router.push('/')} className="px-6 py-3 bg-transparent border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/5 transition-colors">
                                    Back Home
                                </button>
                            </div>
                        </div>

                        <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                <motion.circle 
                                    initial={{ strokeDasharray: "283 283", strokeDashoffset: 283 }} 
                                    animate={{ strokeDashoffset: 283 - (analysisResult.overall_score / 100) * 283 }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                    cx="50%" cy="50%" r="45%" 
                                    stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" fill="transparent" 
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FCD34D" />
                                        <stop offset="100%" stopColor="#F59E0B" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-bold text-white tracking-tighter">
                                    <AnimatedCounter value={analysisResult.overall_score} />
                                </span>
                                <span className="text-xs font-bold text-champagne-400 uppercase tracking-widest mt-1">Overall</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-panel rounded-[32px] p-6 flex flex-col h-full min-h-[400px] border-l-4 border-l-champagne-500/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400"><Target size={20}/></div>
                        <h3 className="font-bold text-white text-lg">Critical Missions</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {gapsDisplay.length > 0 ? (
                            gapsDisplay.map((item, i) => (
                                <GapActionCard key={i} gapName={item.gap} action={item.action} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm gap-3 opacity-60">
                                <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400"><Check size={32}/></div>
                                <p>All Systems Operational!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <motion.div variants={itemVariants} key={i}>
                        <ScoreBox 
                            label={m.label} score={m.score} detail={m.detail}
                            onClick={() => setSelectedMetric({title: m.label, score: m.score, detail: m.detail})}
                        />
                    </motion.div>
                ))}
            </div>

          </motion.div>
        )}
    </div>
  );
}


function GapActionCard({ gapName, action }: { gapName: string, action: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex items-start justify-between gap-3 text-left">
                <div className="flex gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isOpen ? 'bg-champagne-400' : 'bg-slate-600 group-hover:bg-champagne-500/50'}`}/>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-snug">{gapName}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-950/50">
                        <div className="p-4 pt-0 pl-9">
                            <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-champagne-500/20 pl-3 py-1">
                                <strong className="text-champagne-400 block mb-1 text-[10px] uppercase tracking-wider">Recommended Action</strong>
                                {action}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function getScoreTextColor(score: number) { if (score >= 80) return "text-emerald-400"; if (score >= 60) return "text-champagne-400"; return "text-red-400"; }
function getScoreBgColor(score: number) { if (score >= 80) return "text-emerald-400 bg-emerald-400/10"; if (score >= 60) return "text-champagne-400 bg-champagne-400/10"; return "text-red-400 bg-red-400/10"; }

function ScoreBox({label, score, detail, onClick}: {label: string, score: number, detail: string, onClick: () => void}) {
   const textColor = getScoreTextColor(score);
   
   return (
      <div onClick={onClick} className="glass-panel p-6 rounded-[24px] cursor-pointer hover:bg-slate-800/50 transition-all group flex flex-col justify-between h-full relative overflow-hidden border-b-4 border-b-transparent hover:border-b-champagne-500/30">
         <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</div>
            <div className="w-8 h-8 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center">
                 <ArrowRight size={14} className="text-slate-500 -rotate-45 group-hover:rotate-0 transition-transform"/>
            </div>
         </div>
         
         <div className="mb-2">
             <span className={`text-4xl font-bold tracking-tight ${textColor}`}>
                 <AnimatedCounter value={score} />
             </span>
             <span className="text-sm text-slate-600 font-medium ml-1">/100</span>
         </div>
         
         <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-9 group-hover:text-slate-400 transition-colors">
            {detail || "Click to see detailed analysis."}
         </p>
      </div>
   )
}