"use client";

import { UploadSection } from "@/features/dashboard/components/UploadSection";
import { motion } from "framer-motion";
import {
    Sparkles,
    Upload,
    Brain,
    Rocket,
    FileText,
    Clock,
    TrendingUp,
    ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUserCvsQuery } from "@/features/profile/api/useProfile";

// Process steps data
const processSteps = [
    {
        step: 1,
        icon: Upload,
        title: "Upload",
        description: "Drop your CV",
        color: "#2F6BFF",
    },
    {
        step: 2,
        icon: Brain,
        title: "Analyze",
        description: "AI scans 50+ points",
        color: "#8B5CF6",
    },
    {
        step: 3,
        icon: Rocket,
        title: "Improve",
        description: "Get actionable fixes",
        color: "#3CE0B1",
    },
];

// Get time-based greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

// Animated Score Ring component
function ScoreRing({ score }: { score: number }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 100);
        return () => clearTimeout(timer);
    }, [score]);

    const getColor = (s: number) => {
        if (s >= 80) return "#3CE0B1";
        if (s >= 60) return "#F59E0B";
        return "#EF4444";
    };

    return (
        <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90">
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                />
                <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke={getColor(score)}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 126" }}
                    animate={{ strokeDasharray: `${(animatedScore / 100) * 126} 126` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700"
            >
                {animatedScore}
            </motion.span>
        </div>
    );
}

// Loading skeleton for recent analyses
function AnalysisSkeleton() {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}

// Format relative time
function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

export default function AppHome() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const userName = session?.user?.name?.split(" ")[0];

    // Fetch real CV data
    const { data: cvs, isLoading } = useUserCvsQuery(userId || null);

    // Get only completed CVs with real analysis scores
    const recentAnalyses = cvs
        ?.filter(cv => cv.status === "COMPLETED")
        .slice(0, 3)
        .map(cv => ({
            id: cv.id,
            name: cv.analysisResult?.candidate_name || cv.fileUrl.split(/[/\\]/).pop()?.replace(/\.pdf$/i, '') || `CV - ${new Date(cv.createdAt).toLocaleDateString()}`,
            score: cv.analysisResult?.overall_score ?? 0,
            date: formatRelativeTime(cv.createdAt),
            status: cv.status,
        })) || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Animated Background decoration */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Decorative corner shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
                    <svg viewBox="0 0 400 400" fill="none">
                        <circle cx="300" cy="100" r="200" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="4 4" />
                        <circle cx="350" cy="50" r="100" stroke="#3CE0B1" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 w-96 h-96 opacity-20">
                    <svg viewBox="0 0 400 400" fill="none">
                        <circle cx="100" cy="300" r="200" stroke="#3CE0B1" strokeWidth="1" strokeDasharray="4 4" />
                        <circle cx="50" cy="350" r="100" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                </div>

                {/* Floating orbs */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2F6BFF]/[0.05] rounded-full blur-[200px]"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, -60, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#3CE0B1]/[0.05] rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -80, 0],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[180px]"
                />
            </div>

            <div className="container mx-auto px-6 pt-28 pb-16">
                <div className="max-w-5xl mx-auto">

                    {/* Welcome Header */}
                    {session && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 text-center"
                        >
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1]">{userName || "there"}</span>! 👋
                            </h1>
                            <p className="text-slate-500 mt-2">Ready to optimize your CV for your dream job?</p>
                        </motion.div>
                    )}

                    {/* Process Steps - Compact on mobile, expanded on desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        {/* Mobile: Compact horizontal steps */}
                        <div className="flex md:hidden justify-center items-center gap-2">
                            {processSteps.map((step, index) => (
                                <div key={step.step} className="flex items-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                                            style={{ backgroundColor: `${step.color}15` }}
                                        >
                                            <step.icon size={22} style={{ color: step.color }} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500">
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < processSteps.length - 1 && (
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-slate-200 to-slate-100 mx-1" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop: Full cards */}
                        <div className="hidden md:flex items-center justify-center gap-0">
                            {processSteps.map((step, index) => (
                                <div key={step.step} className="flex items-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -4 }}
                                        className="relative group"
                                    >
                                        <div
                                            className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"
                                            style={{ background: `linear-gradient(135deg, ${step.color}40, ${step.color}15)` }}
                                        />
                                        <div className="relative flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border-2 border-slate-200/80 shadow-md group-hover:shadow-xl group-hover:border-transparent transition-all overflow-hidden">
                                            <div
                                                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                                                style={{ backgroundColor: step.color }}
                                            />
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                                                style={{ backgroundColor: `${step.color}20` }}
                                            >
                                                <step.icon size={22} style={{ color: step.color }} />
                                            </motion.div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: step.color }}>Step {step.step}</p>
                                                <h3 className="font-bold text-slate-900">{step.title}</h3>
                                                <p className="text-xs text-slate-500">{step.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                    {index < processSteps.length - 1 && (
                                        <div className="flex items-center px-3">
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: 0.5 + index * 0.2, duration: 0.4 }}
                                                className="w-12 h-1 rounded-full bg-gradient-to-r from-slate-200 via-[#2F6BFF]/30 to-slate-200 origin-left"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <UploadSection />
                    </motion.div>

                    {/* Recent Analyses Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Clock size={18} className="text-slate-400" />
                                Recent Analyses
                            </h2>
                            {recentAnalyses.length > 0 && (
                                <Link href="/profile" className="text-sm text-[#2F6BFF] hover:underline flex items-center gap-1">
                                    View all
                                    <ChevronRight size={14} />
                                </Link>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <AnalysisSkeleton />
                                <AnalysisSkeleton />
                                <AnalysisSkeleton />
                            </div>
                        ) : recentAnalyses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {recentAnalyses.map((analysis, index) => (
                                    <motion.div
                                        key={analysis.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        whileHover={{ y: -4 }}
                                        className="group"
                                    >
                                        <Link href={`/cv/${analysis.id}/analyze`}>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-[#2F6BFF]/30 hover:shadow-lg transition-all cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    {/* Score ring */}
                                                    <ScoreRing score={analysis.score} />

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <FileText size={14} className="text-slate-400 shrink-0" />
                                                            <p className="font-medium text-slate-900 truncate text-sm">
                                                                {analysis.name}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-slate-500">{analysis.date}</p>
                                                    </div>

                                                    {/* Arrow */}
                                                    <ChevronRight
                                                        size={18}
                                                        className="text-slate-300 group-hover:text-[#2F6BFF] group-hover:translate-x-1 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center"
                            >
                                <FileText size={32} className="text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 mb-2">No analyses yet</p>
                                <p className="text-sm text-slate-400">Upload your first CV to get started!</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Quick Stats - Now more compact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-8 text-sm text-slate-500"
                    >
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#3CE0B1]" />
                            <span>95% ATS pass rate</span>
                        </div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[#2F6BFF]" />
                            <span>Results in 30 seconds</span>
                        </div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-purple-500" />
                            <span>AI-powered insights</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
