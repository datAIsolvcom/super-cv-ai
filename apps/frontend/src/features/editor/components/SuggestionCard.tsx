"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Wand2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionCardProps {
    title: string;
    badge?: string;
    content: ReactNode;
    onApply: () => void;
}

export function SuggestionCard({ title, badge, content, onApply }: SuggestionCardProps) {
    const [isApplied, setIsApplied] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleApply = () => {
        setIsApplied(true);
        onApply();
    };

    const getBadgeStyle = (badge?: string) => {
        switch (badge?.toLowerCase()) {
            case "high impact":
                return "from-[#2F6BFF] to-[#3CE0B1] text-white";
            case "skills":
                return "from-emerald-500 to-teal-500 text-white";
            case "experience":
                return "from-indigo-500 to-purple-500 text-white";
            default:
                return "from-slate-500 to-slate-600 text-white";
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            className="relative group"
        >
            <motion.div
                className={cn(
                    "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md",
                    badge === "High Impact" && "bg-gradient-to-r from-[#2F6BFF]/40 to-[#3CE0B1]/40",
                    badge === "Skills" && "bg-gradient-to-r from-emerald-400/40 to-teal-400/40",
                    badge === "Experience" && "bg-gradient-to-r from-indigo-400/40 to-purple-400/40",
                    !badge && "bg-gradient-to-r from-slate-400/20 to-slate-400/20"
                )}
            />

            <div className="relative glass-panel p-5 rounded-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#2F6BFF]/5 to-transparent rounded-full pointer-events-none" />

                <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                        {badge && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r mb-2",
                                    getBadgeStyle(badge)
                                )}
                            >
                                <Wand2 size={10} />
                                {badge}
                            </motion.span>
                        )}
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{title}</h4>
                    </div>

                    <AnimatePresence mode="wait">
                        {isApplied ? (
                            <motion.div
                                key="applied"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30"
                            >
                                <Check size={16} strokeWidth={3} />
                            </motion.div>
                        ) : (
                            <motion.button
                                key="apply"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleApply}
                                className="relative group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all
                                           bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 
                                           text-white shadow-lg shadow-indigo-500/25"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity"
                                    layoutId="button-glow"
                                />
                                <Sparkles size={12} className="animate-pulse" />
                                <span>Apply</span>
                                <motion.div
                                    animate={{ x: isHovering ? 2 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ArrowRight size={12} />
                                </motion.div>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: isHovering ? 1 : 0.8 }}
                    className="text-xs text-slate-600 dark:text-slate-400 pl-3 border-l-2 border-[#2F6BFF]/30 leading-relaxed"
                >
                    {content}
                </motion.div>

                {isApplied && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 origin-left"
                    />
                )}
            </div>
        </motion.div>
    );
}
