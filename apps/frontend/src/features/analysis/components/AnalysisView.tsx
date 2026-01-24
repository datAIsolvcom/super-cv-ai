"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
    cvData: import("@/features/analysis/types/analysis.types").CvRecord | null;
}

export function AnalysisView({ analysisResult, cvData }: AnalysisViewProps) {
    const [selectedMetric, setSelectedMetric] = useState<{ title: string; score: number; detail: string } | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [stickyMessage, setStickyMessage] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isNewAnalysis = searchParams.get("origin") === "new";
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

    // Auto-unlock if the CV is already claimed by the current user
    useEffect(() => {
        if (cvData?.userId && session?.user?.id && cvData.userId === session.user.id) {
            setIsUnlocked(true);
        }
    }, [cvData?.userId, session?.user?.id]);

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
                    toast.error(error.message || "Failed to unlock report");
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
                    toast.error("Customization failed. Please try again.");
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
                        className="w-20 h-20 bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(47,107,255,0.4)]"
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
                            className="w-20 h-20 bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(47,107,255,0.4)]"
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md" onClick={() => setSelectedMetric(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Gradient header */}
                            <div className="bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] p-6 relative">
                                <button
                                    onClick={() => setSelectedMetric(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                                <h3 className="font-bold text-white text-xl">{selectedMetric.title}</h3>
                                <p className="text-white/70 text-sm">Detailed Analysis Breakdown</p>
                            </div>

                            <div className="p-6">
                                {/* Score ring */}
                                <div className="flex items-center justify-center mb-6">
                                    <div className="relative w-32 h-32">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="52"
                                                fill="none"
                                                stroke="#E2E8F0"
                                                strokeWidth="10"
                                            />
                                            <motion.circle
                                                initial={{ strokeDashoffset: 327 }}
                                                animate={{ strokeDashoffset: 327 - (selectedMetric.score / 100) * 327 }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                cx="60"
                                                cy="60"
                                                r="52"
                                                fill="none"
                                                stroke={selectedMetric.score >= 80 ? "#3CE0B1" : selectedMetric.score >= 60 ? "#F59E0B" : "#EF4444"}
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeDasharray="327"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={`text-4xl font-bold ${selectedMetric.score >= 80 ? "text-[#3CE0B1]" :
                                                    selectedMetric.score >= 60 ? "text-amber-500" :
                                                        "text-red-500"
                                                    }`}
                                            >
                                                {selectedMetric.score}
                                            </motion.span>
                                            <span className="text-xs text-slate-400">/100</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Score label */}
                                <div className="text-center mb-6">
                                    {selectedMetric.score >= 80 ? (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#3CE0B1]/10 text-[#3CE0B1] rounded-full text-sm font-bold">
                                            <Check size={16} /> Excellent!
                                        </span>
                                    ) : selectedMetric.score >= 60 ? (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full text-sm font-bold">
                                            Good Progress
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-sm font-bold">
                                            Needs Work
                                        </span>
                                    )}
                                </div>

                                {/* Insights */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Sparkles size={14} className="text-[#2F6BFF]" />
                                        Analysis Insights
                                    </h4>
                                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                        {selectedMetric.detail || "No detailed analysis available."}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <motion.button
                                    onClick={() => setSelectedMetric(null)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-6 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Got it!
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {!isUnlocked ? (
                <div className="max-w-5xl mx-auto py-10 px-4 relative">
                    {/* Background decorations */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2F6BFF]/5 rounded-full blur-[150px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3CE0B1]/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
                        {/* Left side - Score and unlock */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel p-8 md:p-12 rounded-[32px] text-center"
                        >
                            {/* Animated score ring */}
                            <div className="relative w-48 h-48 mx-auto mb-8">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="85"
                                        fill="none"
                                        stroke="#E2E8F0"
                                        strokeWidth="12"
                                    />
                                    <motion.circle
                                        initial={{ strokeDashoffset: 534 }}
                                        animate={{ strokeDashoffset: 534 - (analysisResult.overall_score / 100) * 534 }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                                        cx="100"
                                        cy="100"
                                        r="85"
                                        fill="none"
                                        stroke="url(#lockedScoreGradient)"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                        strokeDasharray="534"
                                    />
                                    <defs>
                                        <linearGradient id="lockedScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#2F6BFF" />
                                            <stop offset="100%" stopColor="#3CE0B1" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Center content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1]"
                                    >
                                        <AnimatedCounter value={analysisResult.overall_score} />
                                    </motion.span>
                                    <span className="text-sm text-slate-400 font-medium mt-1">/100</span>
                                </div>
                            </div>

                            {/* Score label */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {analysisResult.overall_score >= 80 ? (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#3CE0B1]/10 text-[#3CE0B1] rounded-full text-sm font-bold">
                                        <Check size={16} /> Excellent Score!
                                    </span>
                                ) : analysisResult.overall_score >= 60 ? (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full text-sm font-bold">
                                        Good Progress
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-sm font-bold">
                                        Needs Improvement
                                    </span>
                                )}
                            </motion.div>

                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                                Analysis Complete
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">
                                Unlock your full report to discover exactly how to improve your CV
                            </p>

                            {/* CTA Button */}
                            <motion.button
                                onClick={handleUnlock}
                                disabled={claimMutation.isPending}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {claimMutation.isPending ? (
                                    <Loader2 className="animate-spin" size={22} />
                                ) : (
                                    <Unlock size={22} />
                                )}
                                {session ? "Unlock Full Report" : "Sign In to Unlock"}
                            </motion.button>

                            <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-2">
                                {session ? (
                                    <>
                                        <span className="w-2 h-2 bg-[#3CE0B1] rounded-full animate-pulse" />
                                        1 Credit • Instant Access
                                    </>
                                ) : (
                                    "Free plan includes 3 credits"
                                )}
                            </p>
                        </motion.div>

                        {/* Right side - Preview of what's included */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Sparkles size={18} className="text-[#2F6BFF]" />
                                What's Included
                            </h3>

                            {/* Preview cards - blurred teasers */}
                            {[
                                { icon: Target, title: "ATS Compatibility", desc: "See how well ATS systems can parse your CV", score: analysisResult.ats_score },
                                { icon: Zap, title: "Writing Impact", desc: "Analyze the strength of your achievement statements", score: analysisResult.writing_score },
                                { icon: Check, title: "Skill Match", desc: "Compare your skills against industry demands", score: analysisResult.skill_score },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden group hover:border-[#2F6BFF]/30 transition-colors"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.score >= 80 ? "bg-[#3CE0B1]/10 text-[#3CE0B1]" :
                                        item.score >= 60 ? "bg-amber-500/10 text-amber-500" :
                                            "bg-red-500/10 text-red-500"
                                        }`}>
                                        <item.icon size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                                        <p className="text-sm text-slate-500 truncate">{item.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-2xl font-bold ${item.score >= 80 ? "text-[#3CE0B1]" :
                                            item.score >= 60 ? "text-amber-500" :
                                                "text-red-500"
                                            }`}>{item.score}</span>
                                        <span className="text-xs text-slate-400">/100</span>
                                    </div>

                                    {/* Locked overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-white/90 dark:via-slate-900/60 dark:to-slate-900/90 flex items-center justify-end pr-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Lock size={16} className="text-slate-400" />
                                    </div>
                                </motion.div>
                            ))}

                            {/* More features teaser */}
                            <div className="flex items-center gap-3 text-sm text-slate-500 pt-2">
                                <span className="flex items-center gap-1">
                                    <Check size={14} className="text-[#3CE0B1]" />
                                    Detailed breakdowns
                                </span>
                                <span className="flex items-center gap-1">
                                    <Check size={14} className="text-[#3CE0B1]" />
                                    AI-powered fixes
                                </span>
                                <span className="flex items-center gap-1">
                                    <Check size={14} className="text-[#3CE0B1]" />
                                    Priority actions
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 px-4 relative">
                    {/* Background decorations */}
                    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-[0.02]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
                                backgroundSize: '32px 32px',
                            }}
                        />
                        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#2F6BFF]/5 rounded-full blur-[150px]" />
                        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-[#3CE0B1]/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2F6BFF]/10 rounded-full blur-[100px] pointer-events-none" />

                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2F6BFF]/10 to-[#3CE0B1]/10 border border-[#2F6BFF]/20 text-[#2F6BFF] dark:text-[#3CE0B1] text-xs font-bold uppercase tracking-widest">
                                        <Sparkles size={12} /> Analysis Report
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                                        Your CV Strength
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-xl text-justify">
                                        {analysisResult.overall_summary}
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                        {(session?.user as any)?.credits > 0 && isNewAnalysis && (
                                            <motion.button
                                                onClick={() => handleCustomize("analysis")}
                                                disabled={customizeMutation.isPending}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="relative px-8 py-3.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(47,107,255,0.4)] transition-all flex items-center gap-2 overflow-hidden group"
                                            >
                                                {customizeMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                                                Fix Issues with AI
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                            </motion.button>
                                        )}
                                        <motion.button
                                            onClick={() => router.push("/app")}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-6 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:border-[#2F6BFF]/50 hover:text-[#2F6BFF] dark:hover:text-white transition-all"
                                        >
                                            Back to Dashboard
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
                                    {/* Score ring with proper circumference: 2 * π * 90 ≈ 565 */}
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="90"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            className="text-slate-200 dark:text-slate-800"
                                        />
                                        <motion.circle
                                            initial={{ strokeDashoffset: 565 }}
                                            animate={{ strokeDashoffset: 565 - (analysisResult.overall_score / 100) * 565 }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                            cx="100"
                                            cy="100"
                                            r="90"
                                            stroke="url(#scoreGradient)"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                            fill="transparent"
                                            strokeDasharray="565"
                                        />
                                        <defs>
                                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#2F6BFF" />
                                                <stop offset="100%" stopColor="#3CE0B1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">
                                            <AnimatedCounter value={analysisResult.overall_score} />
                                        </span>
                                        <span className="text-xs font-bold text-[#2F6BFF] dark:text-[#3CE0B1] uppercase tracking-widest mt-1">Overall</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel rounded-[32px] p-6 flex flex-col h-full min-h-[400px] relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] pointer-events-none" />

                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl text-red-500 dark:text-red-400 border border-red-500/20">
                                        <Target size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Critical Missions</h3>
                                </div>
                                {gapsDisplay.length > 0 && (
                                    <span className="px-2.5 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full">
                                        {gapsDisplay.length} items
                                    </span>
                                )}
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