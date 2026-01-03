"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GapCardProps {
    gapName: string;
    action: string;
}

/**
 * GapCard - Expandable card showing critical gaps with recommended actions
 * Features collapsible accordion behavior
 */
export function GapCard({ gapName, action }: GapCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-start justify-between gap-3 text-left"
            >
                <div className="flex gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isOpen ? "bg-champagne-400" : "bg-slate-600 group-hover:bg-champagne-500/50"}`} />
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-snug">
                        {gapName}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-950/50"
                    >
                        <div className="p-4 pt-0 pl-9">
                            <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-champagne-500/20 pl-3 py-1">
                                <strong className="text-champagne-400 block mb-1 text-[10px] uppercase tracking-wider">
                                    Recommended Action
                                </strong>
                                {action}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
