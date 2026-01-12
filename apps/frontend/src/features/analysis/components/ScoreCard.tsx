"use client";

import { ArrowRight } from "lucide-react";
import { OdometerCounter } from "@/components/design-system/OdometerCounter";
import { TiltCard } from "@/components/design-system/TiltCard";
import { motion } from "framer-motion";
import { luxuryEasing } from "@/lib/animations";

export function getScoreTextColor(score: number) {
    if (score >= 80) return "text-[#3CE0B1] dark:text-[#3CE0B1]";
    if (score >= 60) return "text-[#FFD84D] dark:text-[#FFD84D]";
    return "text-red-500 dark:text-red-400";
}

export function getScoreBgColor(score: number) {
    if (score >= 80) return "text-[#3CE0B1] dark:text-[#3CE0B1] bg-[#3CE0B1]/10";
    if (score >= 60) return "text-[#FFD84D] dark:text-[#FFD84D] bg-[#FFD84D]/10";
    return "text-red-500 dark:text-red-400 bg-red-400/10";
}

interface ScoreCardProps {
    label: string;
    score: number;
    detail: string;
    onClick: () => void;
}

export function ScoreCard({ label, score, detail, onClick }: ScoreCardProps) {
    const textColor = getScoreTextColor(score);

    return (
        <TiltCard className="h-full" tiltStrength={25} glareEnabled={true}>
            <motion.div
                onClick={onClick}
                whileHover={{ y: -4, transition: { duration: 0.5, ease: luxuryEasing.power4 } }}
                whileTap={{ scale: 0.98 }}
                className="glass-panel p-[clamp(1.25rem,3vw,1.75rem)] rounded-[clamp(1.25rem,3vw,2rem)] cursor-pointer h-full
                           flex flex-col justify-between relative overflow-hidden
                           border-b-2 border-b-transparent hover:border-b-[#2F6BFF]/40
                           transition-[border-color] duration-500"
            >
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2F6BFF]/5 to-transparent" />
                </div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        {label}
                    </div>
                    <motion.div
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center"
                        whileHover={{ scale: 1.1, backgroundColor: "hsla(222,100%,59%,0.1)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <ArrowRight size={14} className="text-slate-400 -rotate-45" />
                    </motion.div>
                </div>

                <div className="mb-2 relative z-10">
                    <span className={`text-4xl font-bold tracking-tight ${textColor}`}>
                        <OdometerCounter value={score} />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-500 font-medium ml-1">/100</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 h-9 relative z-10">
                    {detail || "Click to see detailed analysis."}
                </p>
            </motion.div>
        </TiltCard>
    );
}
