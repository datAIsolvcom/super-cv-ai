"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SuggestionCardProps {
    title: string;
    badge?: string;
    content: ReactNode;
    onApply: () => void;
}

export function SuggestionCard({ title, badge, content, onApply }: SuggestionCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-4 rounded-xl mb-4"
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    {badge && (
                        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase">
                            {badge}
                        </span>
                    )}
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h4>
                </div>
                <button
                    onClick={onApply}
                    className="text-xs bg-indigo-600 px-3 py-1.5 rounded-lg text-white font-bold flex items-center gap-1 hover:bg-indigo-500 transition-colors"
                >
                    <Check size={12} /> Apply
                </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-slate-200 dark:border-white/10">
                {content}
            </div>
        </motion.div>
    );
}
