"use client";

import { motion } from "framer-motion";
import { FileEdit, Wand2, Layout, Type, Palette, Sparkles } from "lucide-react";

export default function EditorLoading() {
    const features = [
        { icon: Wand2, label: "AI Suggestions", delay: 0 },
        { icon: Layout, label: "Smart Layout", delay: 0.2 },
        { icon: Type, label: "Typography", delay: 0.4 },
        { icon: Palette, label: "Color Themes", delay: 0.6 },
    ];

    return (
        <div className="fixed inset-0 bg-stone-50 dark:bg-slate-950 z-[100] flex flex-col items-center justify-center overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-conic from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-amber-500/20 dark:via-orange-500/10 dark:to-amber-500/20 rounded-full blur-[100px]"
                />

                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[80px]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    animate={{ rotateY: [-15, 15, -15], rotateX: [10, -5, 10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative mb-10"
                    style={{ perspective: 1000 }}
                >
                    <div className="absolute inset-0 w-36 h-44 bg-gradient-to-br from-amber-500/30 to-orange-600/30 dark:from-amber-500/40 dark:to-orange-600/40 rounded-2xl blur-2xl" />

                    <div className="relative w-36 h-44 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center px-3 gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                        </div>

                        <div className="mt-6 space-y-2 w-full px-4">
                            <motion.div animate={{ width: ["60%", "80%", "60%"] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 bg-slate-200 dark:bg-white/20 rounded" />
                            <motion.div animate={{ width: ["80%", "50%", "80%"] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }} className="h-2 bg-slate-150 dark:bg-white/15 rounded" />
                            <motion.div animate={{ width: ["50%", "70%", "50%"] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }} className="h-2 bg-slate-100 dark:bg-white/10 rounded" />
                            <motion.div animate={{ width: ["70%", "40%", "70%"] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.9 }} className="h-2 bg-slate-100 dark:bg-white/10 rounded" />
                        </div>

                        <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="absolute bottom-4 right-4">
                            <Sparkles size={20} className="text-amber-500" />
                        </motion.div>
                    </div>

                    <motion.div
                        animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
                    >
                        <FileEdit size={24} className="text-white" />
                    </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                        Preparing Your Editor
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
                        Setting up your professional workspace with AI-powered tools
                    </p>
                </motion.div>

                <div className="flex items-center gap-6 mb-8">
                    {features.map((feature) => (
                        <motion.div
                            key={feature.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + feature.delay }}
                            className="flex flex-col items-center gap-2"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0 rgba(245,158,11,0)", "0 0 20px rgba(245,158,11,0.3)", "0 0 0 rgba(245,158,11,0)"] }}
                                transition={{ duration: 2, repeat: Infinity, delay: feature.delay }}
                                className="w-12 h-12 bg-slate-100 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center"
                            >
                                <feature.icon size={20} className="text-amber-600 dark:text-amber-400" />
                            </motion.div>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{feature.label}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="w-64 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                    />
                </div>
            </div>
        </div>
    );
}
