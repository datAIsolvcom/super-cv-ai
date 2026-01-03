"use client";

import { ArrowRight } from "lucide-react";
import { AnimatedCounter } from "@/components/design-system/AnimatedCounter";

/**
 * Score color utilities
 */
export function getScoreTextColor(score: number) {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-champagne-400";
    return "text-red-400";
}

export function getScoreBgColor(score: number) {
    if (score >= 80) return "text-emerald-400 bg-emerald-400/10";
    if (score >= 60) return "text-champagne-400 bg-champagne-400/10";
    return "text-red-400 bg-red-400/10";
}

interface ScoreCardProps {
    label: string;
    score: number;
    detail: string;
    onClick: () => void;
}

/**
 * ScoreCard - Displays a metric score with animated counter
 * Used in the analysis results grid
 */
export function ScoreCard({ label, score, detail, onClick }: ScoreCardProps) {
    const textColor = getScoreTextColor(score);

    return (
        <div
            onClick={onClick}
            className="glass-panel p-6 rounded-[24px] cursor-pointer hover:bg-slate-800/50 transition-all group flex flex-col justify-between h-full relative overflow-hidden border-b-4 border-b-transparent hover:border-b-champagne-500/30"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    {label}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center">
                    <ArrowRight size={14} className="text-slate-500 -rotate-45 group-hover:rotate-0 transition-transform" />
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
    );
}
