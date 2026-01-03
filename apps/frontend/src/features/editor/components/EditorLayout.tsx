"use client";

import { useState, useRef } from "react";
import { useEditorStore } from "../stores/useEditorStore";
import { CvEditor } from "./CvEditor";
import { RibbonBar } from "./RibbonBar";
import { SuggestionCard } from "./SuggestionCard";
import EditorLoading from "@/app/cv/[id]/editor/loading";
import { Check, Sparkles, ArrowLeft, Cpu, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { CvData, SectionType } from "../types/editor.types";


export function EditorLayout() {
    const aiDraft = useEditorStore((s) => s.aiDraft);
    const cvData = useEditorStore((s) => s.cvData);
    const applySuggestion = useEditorStore((s) => s.applySuggestion);

    const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
    const [mobileTab, setMobileTab] = useState<"ai" | "preview">("preview");

    const printRef = useRef<HTMLDivElement>(null);

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
    };

    const missingSkills = (aiDraft.hard_skills || []).filter((s: string) => !(cvData.hard_skills || []).includes(s));

    return (
        <div className="fixed inset-0 h-[100dvh] z-[100] bg-stone-100 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden transition-colors">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 pointer-events-none z-0"></div>


            <aside
                className={cn(
                    "w-full md:w-[400px] lg:w-[450px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 flex flex-col z-30 shadow-2xl transition-all duration-300 absolute inset-0 md:relative",
                    mobileTab === "ai" ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="p-4 md:p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/30">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-serif font-bold text-lg">
                        <Cpu size={18} className="text-indigo-500 dark:text-indigo-400" /> AI Review
                    </div>
                    <Link href="/" className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full text-slate-500 dark:text-slate-400">
                        <ArrowLeft size={18} />
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 custom-scrollbar pb-32 md:pb-5">
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
                        {missingSkills.length > 0 && (
                            <SuggestionCard
                                title="Missing Keywords"
                                badge="Skills"
                                content={
                                    <div className="flex flex-wrap gap-2">
                                        {missingSkills.map((s: string, i: number) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-300">
                                                + {s}
                                            </span>
                                        ))}
                                    </div>
                                }
                                onApply={() => applySuggestion("hard_skills", aiDraft.hard_skills || [])}
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
                    {missingSkills.length === 0 &&
                        (aiDraft.work_experience || []).every((aiExp, idx) => {
                            const match = findBestMatchIndex(aiExp, (cvData.work_experience || []), idx);
                            return appliedIds.has(`work_experience-${idx}`) || match === -1;
                        }) && (
                            <div className="text-center py-10 opacity-50 text-slate-500 dark:text-slate-400">
                                <Check size={32} className="mx-auto mb-2 text-emerald-500" />
                                All suggestions applied!
                            </div>
                        )}
                </div>
            </aside>


            <main
                className={cn(
                    "flex-1 bg-slate-200 dark:bg-slate-950 relative flex flex-col h-full overflow-hidden transition-all duration-300 z-10",
                    mobileTab === "ai" ? "translate-x-full md:translate-x-0 hidden md:flex" : "translate-x-0 flex"
                )}
            >
                <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] pb-40 md:pb-16">
                    <div className="w-full sticky top-0 z-40 p-4">
                        <RibbonBar printRef={printRef} />
                    </div>

                    <div
                        className="relative shrink-0 w-[210mm] min-h-[297mm] h-fit bg-white text-slate-900 shadow-[0_0_60px_rgba(0,0,0,0.3)] dark:shadow-[0_0_60px_rgba(0,0,0,0.6)] 
              transform-gpu origin-top 
              scale-[0.42] sm:scale-[0.6] md:scale-100
              mt-4
              transition-transform duration-300"
                    >
                        <CvEditor printRef={printRef} />
                    </div>
                </div>
            </main>


            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 p-4 z-50 flex gap-4 pb-8 safe-area-pb">
                <button
                    onClick={() => setMobileTab("ai")}
                    className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2",
                        mobileTab === "ai" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    )}
                >
                    <Cpu size={16} /> Suggestions
                </button>
                <button
                    onClick={() => setMobileTab("preview")}
                    className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2",
                        mobileTab === "preview" ? "bg-amber-500 text-slate-950" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    )}
                >
                    <FileText size={16} /> Preview
                </button>
            </div>
        </div>
    );
}