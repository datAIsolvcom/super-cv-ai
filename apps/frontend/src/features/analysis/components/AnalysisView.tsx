"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Sparkles, Loader2, Info, X,
    Zap, Check, Lock, Unlock, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UpgradeModal } from "@/components/design-system/UpgradeModal";
import { AnimatedCounter } from "@/components/design-system/AnimatedCounter";
import { LazyConfetti } from "@/lib/dynamic-loading";
import { useClaimMutation, useCustomizeMutation } from "@/features/analysis/api/useAnalysis";
import { ScoreCard, getScoreBgColor, getScoreTextColor } from "./ScoreCard";
import { GapCard } from "./GapCard";
import type { AnalysisData } from "@/features/analysis/types/analysis.types";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

interface AnalysisViewProps {
    analysisResult: AnalysisData | null;
}

export function AnalysisView({ analysisResult }: AnalysisViewProps) {
    const [selectedMetric, setSelectedMetric] = useState<{ title: string; score: number; detail: string } | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [stickyMessage, setStickyMessage] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const cvId = params.id as string;
    const { data: session } = useSession();

    const claimMutation = useClaimMutation(cvId);
    const customizeMutation = useCustomizeMutation();


    useEffect(() => {
        if (analysisResult?.overall_score && analysisResult.overall_score >= 80) {
            const timer = setTimeout(() => setShowConfetti(true), 500);
            return () => clearTimeout(timer);
        }
    }, [analysisResult?.overall_score]);

    const handleUnlock = async () => {
        if (!session?.user?.id) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }

        claimMutation.mutate(session.user.id, {
            onSuccess: () => setIsUnlocked(true),
            onError: (error) => {
                if (error.message.includes("credit") || error.message.includes("Credit")) {
                    setShowUpgradeModal(true);
                } else {
                    console.error("Unlock error:", error.message);
                }
            },
        });
    };

    const handleCustomize = async (mode: "analysis" | "job_desc") => {
        setStickyMessage("Polishing your resume with AI magic...");
        customizeMutation.mutate(
            { cvId, mode },
            {
                onSuccess: () => router.push(`/cv/${cvId}/editor`),
                onError: (error) => {
                    console.error("AI Customization error:", error);
                    setStickyMessage(null);
                },
            }
        );
    };


    if (stickyMessage || customizeMutation.isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-slate-950 transition-colors">
                <div className="flex flex-col items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(245,158,11,0.4)]"
                    >
                        <Loader2 size={40} className="text-white animate-spin" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-slate-900 dark:text-white text-xl font-serif font-bold tracking-wide"
                    >
                        {stickyMessage || "Processing..."}
                    </motion.p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">This may take a few seconds...</p>
                </div>
            </div>
        );
    }

    if (!analysisResult) return null;

    const metrics = [
        { label: "ATS Friendly", score: analysisResult.ats_score, detail: analysisResult.ats_detail },
        { label: "Writing Impact", score: analysisResult.writing_score, detail: analysisResult.writing_detail },
        { label: "Skill Match", score: analysisResult.skill_score, detail: analysisResult.skill_detail },
        { label: "Experience", score: analysisResult.experience_score, detail: analysisResult.experience_detail },
    ];

    const gapsDisplay = analysisResult.critical_gaps || [];

    return (
        <div className="max-w-7xl mx-auto w-full relative pb-20">
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
            <LazyConfetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />


            <AnimatePresence>
                {stickyMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-xl"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(245,158,11,0.4)]"
                        >
                            <Loader2 size={40} className="text-white animate-spin" />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-slate-900 dark:text-white text-xl font-serif font-bold tracking-wide"
                        >
                            {stickyMessage}
                        </motion.p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">This may take a few seconds...</p>
                    </motion.div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {selectedMetric && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md" onClick={() => setSelectedMetric(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${getScoreBgColor(selectedMetric.score)}`}><Info size={20} /></div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedMetric.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Detailed Analysis Breakdown</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedMetric(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6 bg-slate-100 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score Achieved</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl font-black ${getScoreTextColor(selectedMetric.score)}`}>{selectedMetric.score}</span>
                                        <span className="text-sm text-slate-400 font-medium">/100</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Analysis Insights</h4>
                                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">{selectedMetric.detail || "No detailed analysis available."}</div>
                                </div>
                                <button onClick={() => setSelectedMetric(null)} className="w-full mt-8 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.01]">Close Analysis</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {!isUnlocked ? (
                <div className="max-w-4xl mx-auto py-20 px-4 text-center relative min-h-[600px] flex flex-col items-center justify-center">

                    <div className="absolute inset-0 opacity-20 pointer-events-none select-none overflow-hidden blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                            <div className="bg-slate-200 dark:bg-slate-800 h-40 rounded-2xl w-full" />
                            <div className="bg-slate-200 dark:bg-slate-800 h-40 rounded-2xl w-full" />
                            <div className="bg-slate-200 dark:bg-slate-800 h-60 rounded-2xl w-full col-span-2" />
                        </div>
                    </div>

                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-10 md:p-14 rounded-[40px] shadow-2xl border border-amber-500/20 max-w-lg w-full relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                            <Lock size={40} />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-3">Analysis Complete</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
                            Your CV scored <span className="text-amber-600 dark:text-amber-400 font-bold text-xl">{analysisResult.overall_score}/100</span>.
                            <br /> Unlock to reveal the strategy to improve it.
                        </p>
                        <button
                            onClick={handleUnlock}
                            disabled={claimMutation.isPending}
                            className="w-full py-4 sm:py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-base sm:text-lg rounded-2xl hover:bg-slate-800 dark:hover:bg-amber-50 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-50"
                        >
                            <span className="flex items-center justify-center gap-2 sm:gap-3">
                                {claimMutation.isPending ? (
                                    <Loader2 className="animate-spin text-amber-500 w-5 h-5 sm:w-6 sm:h-6" />
                                ) : (
                                    <Unlock className="text-amber-500 w-5 h-5 sm:w-6 sm:h-6" />
                                )}
                                <span>{session ? "Unlock Report (1 Credit)" : "Sign In to Unlock"}</span>
                            </span>
                        </button>
                        <p className="text-xs text-slate-400 mt-5 font-medium uppercase tracking-wider text-center">{session ? "Instant Access • 1 Credit Deducted" : "Free Plan includes 3 Credits"}</p>
                    </motion.div>
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 px-4">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">
                                        <Sparkles size={12} /> Analysis Report
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                                        Your CV Strength
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
                                        {analysisResult.overall_summary}
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                        <button onClick={() => handleCustomize("analysis")} disabled={customizeMutation.isPending} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-amber-50 transition-colors shadow-lg flex items-center gap-2">
                                            {customizeMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className="text-amber-500" />}
                                            Fix Issues with AI
                                        </button>
                                        <button onClick={() => router.push("/")} className="px-6 py-3 bg-transparent border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                            Back Home
                                        </button>
                                    </div>
                                </div>

                                <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-800" />
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
                                        <span className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">
                                            <AnimatedCounter value={analysisResult.overall_score} />
                                        </span>
                                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mt-1">Overall</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel rounded-[32px] p-6 flex flex-col h-full min-h-[400px]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500 dark:text-red-400"><Target size={20} /></div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Critical Missions</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                                {gapsDisplay.length > 0 ? (
                                    gapsDisplay.map((item, i) => <GapCard key={i} gapName={item.gap} action={item.action} />)
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-3 opacity-60">
                                        <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500"><Check size={32} /></div>
                                        <p>All Systems Operational!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((m, i) => (
                            <motion.div variants={itemVariants} key={i}>
                                <ScoreCard label={m.label} score={m.score} detail={m.detail} onClick={() => setSelectedMetric({ title: m.label, score: m.score, detail: m.detail })} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}