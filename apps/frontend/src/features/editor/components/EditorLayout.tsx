"use client";

import { useState, useRef, useMemo } from "react";
import { useEditorStore } from "../stores/useEditorStore";
import { CvEditor } from "./CvEditor";
import { RibbonBar } from "./RibbonBar";
import { SuggestionCard } from "./SuggestionCard";
import EditorLoading from "@/app/cv/[id]/editor/loading";
import { Check, Sparkles, ArrowLeft, Cpu, FileText, Wand2, CheckCircle2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { CvData, SectionType } from "../types/editor.types";

export function EditorLayout() {
    const aiDraft = useEditorStore((s) => s.aiDraft);
    const cvData = useEditorStore((s) => s.cvData);
    const applySuggestion = useEditorStore((s) => s.applySuggestion);
    const { id: cvId } = useParams<{ id: string }>();

    const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
    const [mobileTab, setMobileTab] = useState<"ai" | "preview">("preview");
    const [lastAppliedSection, setLastAppliedSection] = useState<string | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const printRef = useRef<HTMLDivElement>(null);
    const initialTotalRef = useRef<number | null>(null);

    if (!aiDraft || !cvData) {
        return <EditorLoading />;
    }

    const findBestMatchIndex = (aiItem: { company?: string; title?: string }, userList: { company?: string; title?: string }[], aiIndex: number) => {
        if (!userList || userList.length === 0) return -1;
        let bestIndex = -1;
        let maxScore = -1;
        userList.forEach((userItem, userIndex) => {
            let score = 0;
            const cleanString = (str: string) => str?.toLowerCase().replace(/\s+/g, " ").trim() || "";
            const aiCo = cleanString(aiItem.company as string);
            const userCo = cleanString(userItem.company as string);
            const aiTitle = cleanString(aiItem.title as string);
            const userTitle = cleanString(userItem.title as string);
            if (aiCo === userCo) {
                score += 10;
                if (aiTitle && userTitle) {
                    if (aiTitle === userTitle) score += 50;
                    else if (userTitle.includes(aiTitle) || aiTitle.includes(userTitle)) score += 30;
                }
                if (userIndex === aiIndex) score += 20;
            }
            if (score > maxScore) {
                maxScore = score;
                bestIndex = userIndex;
            }
        });
        return maxScore > 0 ? bestIndex : -1;
    };

    const handleApply = (type: string, id: string | number, data: unknown, originalIndex: number) => {
        if (type === "hard_skills") applySuggestion("hard_skills", data);
        else if (type === "professional_summary") applySuggestion("professional_summary", data);
        else {
            const currentList = (cvData as unknown as Record<string, { company?: string; title?: string }[]>)[type] || [];
            const targetIndex = findBestMatchIndex(data as { company?: string; title?: string }, currentList, originalIndex);
            if (targetIndex !== -1) applySuggestion(type as keyof CvData, data, targetIndex);
        }
        setAppliedIds((prev) => new Set(prev).add(`${type}-${id}`));
        // Set last applied section for animation feedback
        setLastAppliedSection(type);
        setTimeout(() => setLastAppliedSection(null), 1500);
    };

    // Calculate initial total suggestions count ONCE based on aiDraft
    // This ensures the denominator stays constant as suggestions are applied

    if (initialTotalRef.current === null) {
        const initialMissingSkills = (aiDraft.hard_skills || []).filter(
            (s: string) => !(cvData.hard_skills || []).includes(s)
        );
        const workExpCount = (aiDraft.work_experience || []).filter(
            (aiExp, idx) => findBestMatchIndex(aiExp, cvData.work_experience || [], idx) !== -1
        ).length;

        initialTotalRef.current =
            (aiDraft.professional_summary !== cvData.professional_summary ? 1 : 0) +
            (initialMissingSkills.length > 0 ? 1 : 0) +
            workExpCount;
    }

    const totalSuggestions = initialTotalRef.current;
    const appliedCount = appliedIds.size;
    const progressPercent = totalSuggestions > 0 ? Math.min(100, (appliedCount / totalSuggestions) * 100) : 0;

    // Current missing skills for display (can change as skills are applied)
    const missingSkills = (aiDraft.hard_skills || []).filter(
        (s: string) => !(cvData.hard_skills || []).includes(s)
    );

    return (
        <div className="fixed inset-0 h-[100dvh] z-[100] bg-gradient-to-br from-slate-100 via-stone-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col md:flex-row overflow-hidden transition-colors">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 pointer-events-none z-0" />

            <aside
                className={cn(
                    "w-full md:w-[400px] lg:w-[450px] flex flex-col z-30 transition-all duration-300 absolute inset-0 md:relative overflow-hidden",
                    mobileTab === "ai" ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl" />
                <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#2F6BFF]/20 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-5 border-b border-slate-200/50 dark:border-white/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

                    <div className="relative flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Wand2 size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">AI Review</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Smart suggestions for your CV</p>
                            </div>
                        </div>
                        <Link
                            href={`/cv/${cvId}/analyze`}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 transition-colors"
                            title="Back to Analysis"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                    </div>

                    {totalSuggestions > 0 && (
                        <div className="relative mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {appliedCount} of {totalSuggestions} applied
                                </span>
                                <span className="text-xs font-bold text-[#2F6BFF] dark:text-[#3CE0B1]">
                                    {Math.round(progressPercent)}%
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-full"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>

                <div className="relative flex-1 overflow-y-auto p-4 md:p-5 space-y-4 custom-scrollbar pb-32 md:pb-5">
                    <AnimatePresence mode="popLayout">
                        {!appliedIds.has("professional_summary-0") && aiDraft.professional_summary !== cvData.professional_summary && (
                            <SuggestionCard
                                key="summary-card"
                                title="Professional Summary"
                                badge="High Impact"
                                content={aiDraft.professional_summary}
                                onApply={() => handleApply("professional_summary", 0, aiDraft.professional_summary, 0)}
                            />
                        )}
                        {missingSkills.length > 0 && !appliedIds.has("hard_skills-0") && (
                            <SuggestionCard
                                key="skills-card"
                                title="Missing Keywords"
                                badge="Skills"
                                content={
                                    <div className="flex flex-wrap gap-2">
                                        {missingSkills.map((s: string, i: number) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">
                                                + {s}
                                            </span>
                                        ))}
                                    </div>
                                }
                                onApply={() => { applySuggestion("hard_skills", aiDraft.hard_skills || []); setAppliedIds(prev => new Set(prev).add("hard_skills-0")); }}
                            />
                        )}
                        {(aiDraft.work_experience || []).map((aiExp, idx) => {
                            const cardKey = `work_experience-${idx}`;
                            if (appliedIds.has(cardKey)) return null;
                            const matchIndex = findBestMatchIndex(aiExp, (cvData.work_experience || []), idx);
                            if (matchIndex !== -1)
                                return (
                                    <SuggestionCard
                                        key={cardKey}
                                        title={`Refine: ${aiExp.title}`}
                                        badge="Experience"
                                        content={
                                            <ul className="list-disc ml-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                                {(aiExp.achievements || []).slice(0, 3).map((a: string, i: number) => (
                                                    <li key={i}>{a}</li>
                                                ))}
                                            </ul>
                                        }
                                        onApply={() => handleApply("work_experience", idx, aiExp, idx)}
                                    />
                                );
                            return null;
                        })}
                    </AnimatePresence>

                    {appliedCount >= totalSuggestions && totalSuggestions > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30"
                            >
                                <CheckCircle2 size={32} className="text-white" />
                            </motion.div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">All Done!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">All suggestions have been applied</p>
                        </motion.div>
                    )}

                    {totalSuggestions === 0 && (
                        <div className="text-center py-12 opacity-60">
                            <Zap size={32} className="mx-auto mb-3 text-[#2F6BFF]" />
                            <p className="text-slate-500 dark:text-slate-400">Your CV is looking great!</p>
                        </div>
                    )}
                </div>
            </aside>

            <main
                className={cn(
                    "flex-1 relative flex flex-col h-full overflow-hidden transition-all duration-300 z-10",
                    mobileTab === "ai" ? "translate-x-full md:translate-x-0 hidden md:flex" : "translate-x-0 flex"
                )}
            >
                <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center bg-[radial-gradient(circle_at_center,#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,#334155_1px,transparent_1px)] [background-size:24px_24px] pb-40 md:pb-16">
                    <div className="w-full sticky top-0 z-40 p-4">
                        <RibbonBar printRef={printRef} isPreviewMode={isPreviewMode} setIsPreviewMode={setIsPreviewMode} />
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative shrink-0 mt-4 mb-8 mx-auto w-full max-w-[95w] md:max-w-none md:w-[210mm]"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-b from-black/5 to-black/20 dark:from-black/20 dark:to-black/40 rounded-3xl blur-2xl pointer-events-none" />
                        <div
                            className="relative bg-white shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-sm overflow-hidden
                                       aspect-[210/297] md:aspect-auto md:min-h-[297mm]"
                            style={{ colorScheme: 'light' }}
                        >
                            <div className="absolute inset-0 md:relative md:inset-auto overflow-auto">
                                <div className="w-[210mm] min-h-[297mm] origin-top-left scale-[0.45] sm:scale-[0.55] md:scale-100 
                                               [&_*]:!text-slate-900 [&_h1]:!text-inherit [&_h2]:!text-inherit [&_h3]:!text-inherit 
                                               [&_.text-slate-500]:!text-slate-500 [&_.text-slate-600]:!text-slate-600 [&_.text-slate-700]:!text-slate-700">
                                    <CvEditor printRef={printRef} highlightSection={lastAppliedSection} isPreviewMode={isPreviewMode} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 print:hidden mobile-tab-bar"
            >
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/10" />
                <div className="relative flex gap-3 p-4 pb-8 safe-area-pb">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobileTab("ai")}
                        className={cn(
                            "flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                            mobileTab === "ai"
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        )}
                    >
                        <Wand2 size={18} /> AI Review
                        {appliedCount < totalSuggestions && (
                            <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
                                {totalSuggestions - appliedCount}
                            </span>
                        )}
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobileTab("preview")}
                        className={cn(
                            "flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                            mobileTab === "preview"
                                ? "bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white shadow-lg shadow-[#2F6BFF]/25"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        )}
                    >
                        <FileText size={18} /> Preview
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}