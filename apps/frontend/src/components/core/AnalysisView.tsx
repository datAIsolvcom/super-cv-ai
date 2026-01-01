"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCv, CriticalGap } from "@/lib/cv-context"; 
import { useSession } from "next-auth/react"; 
import { 
  ArrowRight, Sparkles, AlertTriangle, ChevronLeft, Loader2, Info, X, 
  ChevronRight, Zap, Check, ChevronDown, Lightbulb, Lock, Unlock, Crown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- ANIMASI ---
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
             headers: { 
                'userId': session.user.id as string 
             }
         });

         if (!res.ok) {
             const err = await res.json();
             if (res.status === 400 || res.status === 403) {
                setShowUpgradeModal(true);
             } else {
                alert(err.message || "Gagal membuka laporan.");
             }
             setIsUnlocking(false);
             return;
         }
         setIsUnlocked(true);
     } catch (e) {
         console.error(e);
         alert("Terjadi kesalahan jaringan.");
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
        alert("Gagal memproses permintaan AI.");
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
    <div className="max-w-6xl mx-auto w-full relative pb-20">
       
 
       <AnimatePresence>
         {showUpgradeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                             <Crown size={40} className="text-white" fill="currentColor"/>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Credits Exhausted</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            You have used all your free credits. Upgrade to <span className="text-amber-400 font-bold">Pro</span> to unlock unlimited AI analysis and rewriting.
                        </p>
                        <div className="space-y-3">
                            <button onClick={() => alert("Fitur Payment Gateway akan segera hadir!")} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg">
                                Upgrade Now ($9/mo)
                            </button>
                            <button onClick={() => setShowUpgradeModal(false)} className="w-full py-3.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
         )}
       </AnimatePresence>

 
       <AnimatePresence>
         {selectedMetric && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedMetric(null)}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                        <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg bg-white/5 ${getScoreBgColor(selectedMetric.score)}`}>
                                <Info size={20}/>
                             </div>
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
                             <div className="flex items-baseline gap-1">
                                <span className={`text-3xl font-black ${getScoreBgColor(selectedMetric.score)}`}>{selectedMetric.score}</span>
                                <span className="text-sm text-slate-500 font-medium">/100</span>
                             </div>
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Analysis Insights</h4>
                            <div className="text-sm text-slate-300 leading-relaxed bg-slate-800/30 p-5 rounded-xl border border-white/5 shadow-inner">
                                {selectedMetric.detail || "No detailed analysis available."}
                            </div>
                         </div>
                         <button onClick={() => setSelectedMetric(null)} className="w-full mt-8 bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.01]">
                            Close Analysis
                         </button>
                    </div>
                </motion.div>
            </div>
         )}
       </AnimatePresence>

       
       {!isUnlocked ? (
    
        <div className="max-w-4xl mx-auto py-20 px-4 text-center relative min-h-[600px]">
            <div className="blur-sm opacity-30 pointer-events-none select-none absolute inset-0 overflow-hidden">
                <h1 className="text-4xl font-bold text-white mb-10">Your CV Report</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-slate-800 h-40 rounded-2xl w-full"/>
                     <div className="bg-slate-800 h-40 rounded-2xl w-full"/>
                     <div className="bg-slate-800 h-60 rounded-2xl w-full col-span-2"/>
                </div>
            </div>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900/90 backdrop-blur-xl p-8 md:p-12 rounded-[32px] shadow-2xl border border-indigo-500/30 max-w-lg w-full"
                 >
                     <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                         <Lock size={40} />
                     </div>
                     <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete!</h2>
                     <p className="text-slate-400 mb-8 leading-relaxed">
                         Your CV achieved an overall score of <span className="text-emerald-400 font-bold text-xl">{analysisResult.overall_score}/100</span>.
                         <br/>
                         {session 
                            ? "Unlock the full report to see critical gaps & AI fixes." 
                            : "Sign in to reveal detailed insights and fix your gaps."}
                     </p>
                     <button 
                        onClick={handleUnlock} 
                        disabled={isUnlocking}
                        className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-xl"
                     >
                         {isUnlocking ? <Loader2 className="animate-spin"/> : <Unlock size={20}/>}
                         {session ? "Unlock Report (1 Credit)" : "Sign In to Unlock"}
                     </button>
                     <p className="text-xs text-slate-500 mt-4">
                        {session 
                           ? "This will deduct 1 credit from your account." 
                           : "Free account includes 3 complimentary credits."}
                     </p>
                 </motion.div>
            </div>
        </div>
       ) : (
    
         <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
         >
            <motion.button 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => router.push('/')} 
                className="flex items-center gap-2 text-slate-400 mb-6 hover:text-white transition-colors group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Home
            </motion.button>
            
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"/>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"/>

                <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-12 items-center justify-between border-b border-white/5 pb-10 mb-10">
                    <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={12}/> AI Analysis Complete
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Your CV Report</h2>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                            {analysisResult.overall_summary}
                        </p>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-amber-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"/>
                        <div className="relative w-40 h-40 rounded-full border-4 border-slate-800 bg-slate-900 flex flex-col items-center justify-center shadow-2xl">
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                                {analysisResult.overall_score}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Overall</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
                        {metrics.map((m, i) => (
                            <motion.div variants={itemVariants} key={i}>
                                <ScoreBox 
                                    label={m.label} score={m.score} detail={m.detail}
                                    onClick={() => setSelectedMetric({title: m.label, score: m.score, detail: m.detail})}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={itemVariants} className="bg-slate-950/30 border border-white/5 rounded-2xl p-1 flex flex-col h-full hover:border-red-500/20 transition-colors group">
                        <div className="p-5 pb-2">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-400 group-hover:bg-red-500/20 transition-colors"><AlertTriangle size={20}/></div>
                                <h3 className="font-bold text-slate-200">Gap Analysis</h3>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">AI-Recommended actions.</p>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-2 space-y-2 max-h-[400px]">
                            {gapsDisplay.length > 0 ? (
                                gapsDisplay.map((item, i) => (
                                    <GapActionCard key={i} gapName={item.gap} action={item.action} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm gap-2 opacity-60">
                                    <Check size={24}/><p>No critical gaps!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-900/40 to-slate-900 rounded-2xl p-1 border border-indigo-500/20">
                    <div className="bg-slate-900/80 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <Zap size={24} fill="currentColor"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Ready to Optimize?</h3>
                                <p className="text-sm text-slate-400">Let AI rewrite and format your CV based on these insights.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleCustomize('analysis')} 
                            disabled={isGenerating}
                            className="w-full md:w-auto bg-white text-slate-950 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 group"
                        >
                            {isGenerating ? <Loader2 className="animate-spin"/> : <Sparkles size={20} className="text-indigo-600 group-hover:text-indigo-700"/>}
                            {isGenerating ? "Queuing Job..." : "Fix with AI & Edit"}
                        </button>
                    </div>
                </motion.div>
            </div>
         </motion.div>
       )}
    </div>
  );
}


function GapActionCard({ gapName, action }: { gapName: string, action: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOpen ? 'bg-amber-400' : 'bg-red-400'}`}/>
                    <span className="text-sm font-bold text-slate-200">{gapName}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-950/30">
                        <div className="p-4 pt-0 border-t border-white/5">
                            <div className="flex gap-3 mt-3">
                                <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5"/>
                                <div>
                                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Recommended Action</div>
                                    <p className="text-xs text-slate-300 leading-relaxed">{action}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function getScoreTextColor(score: number) { if (score >= 80) return "text-emerald-400"; if (score >= 60) return "text-amber-400"; return "text-red-400"; }
function getScoreBgColor(score: number) { if (score >= 80) return "bg-emerald-500"; if (score >= 60) return "bg-amber-500"; return "bg-red-500"; }
function getBorderColor(score: number) { if (score >= 80) return "group-hover:border-emerald-500/30"; if (score >= 60) return "group-hover:border-amber-500/30"; return "group-hover:border-red-500/30"; }

function ScoreBox({label, score, detail, onClick}: {label: string, score: number, detail: string, onClick: () => void}) {
   const textColor = getScoreTextColor(score);
   const barColor = getScoreBgColor(score);
   const borderColor = getBorderColor(score);
   return (
      <div onClick={onClick} className={`bg-slate-950/40 p-5 rounded-2xl border border-white/5 cursor-pointer ${borderColor} hover:bg-slate-900/60 transition-all group flex flex-col justify-between h-full relative overflow-hidden`}>
         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>
         <div className="relative z-10">
             <div className="flex justify-between items-center mb-3">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 ${textColor}`}>{score}/100</div>
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full mb-4 overflow-hidden">
                <div className={`h-full rounded-full ${barColor} transition-all duration-1000`} style={{ width: `${score}%` }}/>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-9">{detail || "No analysis details available."}</p>
         </div>
         <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between relative z-10">
            <span className="text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors">Click for details</span>
            <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-bold opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Read More <ChevronRight size={12}/></div>
         </div>
      </div>
   )
}