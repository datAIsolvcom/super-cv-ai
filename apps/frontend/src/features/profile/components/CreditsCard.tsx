"use client";

import { motion } from "framer-motion";
import { Coins, Sparkles } from "lucide-react";

interface CreditsCardProps {
    credits: number;
}

export function CreditsCard({ credits }: CreditsCardProps) {
    const getCreditsColor = () => {
        if (credits >= 3) return "from-emerald-500 to-teal-500";
        if (credits >= 1) return "from-[#2F6BFF] to-[#3CE0B1]";
        return "from-red-500 to-pink-500";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Coins size={18} className="text-[#2F6BFF] shrink-0" />
                    <span>Credits</span>
                </h3>
                <div className={`self-start xs:self-auto px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${getCreditsColor()} text-white text-xs sm:text-sm font-bold`}>
                    {credits} left
                </div>
            </div>

            {/* Credits visual */}
            <div className="flex gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-3 rounded-full transition-all ${i < credits
                            ? `bg-gradient-to-r ${getCreditsColor()}`
                            : "bg-slate-200 dark:bg-slate-700"
                            }`}
                    />
                ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {credits > 0 ? (
                    <span className="flex items-start gap-1">
                        <Sparkles size={14} className="text-[#2F6BFF] shrink-0 mt-0.5" />
                        <span>Each credit = 1 CV analysis</span>
                    </span>
                ) : (
                    "No credits left. Contact support."
                )}
            </p>
        </motion.div>
    );
}
