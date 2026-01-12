"use client";

import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { UserCv } from "../api/useProfile";

interface CvHistoryListProps {
    cvs: UserCv[];
    isLoading?: boolean;
}

const statusConfig = {
    PENDING: { icon: Clock, color: "text-[#FFD84D]", bg: "bg-[#FFD84D]/10 dark:bg-[#FFD84D]/10", label: "Pending", animate: false },
    PROCESSING: { icon: Loader2, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", label: "Processing", animate: true },
    COMPLETED: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Completed", animate: false },
    FAILED: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", label: "Failed", animate: false },
};

export function CvHistoryList({ cvs, isLoading }: CvHistoryListProps) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <FileText size={18} className="text-indigo-500" />
                CV History
            </h3>

            {cvs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No CVs uploaded yet</p>
                    <Link href="/" className="text-indigo-500 hover:underline text-sm mt-2 inline-block">
                        Upload your first CV →
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {cvs.map((cv, index) => {
                        const status = statusConfig[cv.status];
                        const StatusIcon = status.icon;
                        const uploadDate = new Date(cv.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        });
                        // Extract filename from path (handles both / and \ separators)
                        const rawFileName = cv.fileUrl.split(/[/\\]/).pop() || "";
                        // Clean up filename or show friendly name with date
                        const fileName = rawFileName && !rawFileName.includes(":")
                            ? rawFileName
                            : `CV - ${uploadDate}`;

                        return (
                            <motion.div
                                key={cv.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <Link
                                    href={`/cv/${cv.id}/analyze`}
                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                                            <StatusIcon
                                                size={18}
                                                className={`${status.color} ${status.animate ? "animate-spin" : ""}`}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm truncate max-w-[140px] sm:max-w-[200px]">
                                                {fileName}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {uploadDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                                            {status.label}
                                        </span>
                                        <ExternalLink size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
