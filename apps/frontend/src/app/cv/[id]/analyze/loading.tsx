"use client";

import { motion } from "framer-motion";
import { Loader2, ScanSearch, Brain, Target, Sparkles } from "lucide-react";

export default function AnalyzeLoading() {
    return (
        <div className="fixed inset-0 bg-stone-50 dark:bg-slate-950 z-[100] flex flex-col items-center justify-center overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[100px]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-32 h-32"
                    >
                        <div className="absolute top-0 left-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-transparent -translate-x-1/2" />
                        <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-gradient-to-t from-purple-500 to-transparent -translate-x-1/2" />
                    </motion.div>

                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 w-32 h-32 border-2 border-indigo-500/30 rounded-full"
                    />

                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.4)]"
                    >
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-3 border-2 border-white/20 rounded-full border-t-white/60 border-r-white/40"
                        />
                        <Brain size={44} className="text-white relative z-10" />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                        Analyzing Your CV
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-base max-w-md mx-auto leading-relaxed">
                        Our AI is scanning your document for optimization opportunities
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 flex flex-col items-center gap-3"
                >
                    {[
                        { icon: ScanSearch, text: "Scanning structure" },
                        { icon: Target, text: "Matching keywords" },
                        { icon: Sparkles, text: "Generating insights" },
                    ].map((step, i) => (
                        <motion.div
                            key={step.text}
                            initial={{ opacity: 0.4, x: -10 }}
                            animate={{ opacity: [0.4, 1, 0.4], x: 0 }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
                            className="flex items-center gap-3 px-5 py-2.5 bg-slate-100 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/10"
                        >
                            <step.icon size={18} className="text-indigo-500 dark:text-indigo-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{step.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
