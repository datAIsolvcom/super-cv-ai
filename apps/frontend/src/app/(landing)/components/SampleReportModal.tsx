'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, FileText, Briefcase, Loader2, CheckCircle, Sparkles, ArrowRight, Download, MapPin, Mail, Zap, Target, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import Link from 'next/link';

interface SampleReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Sample CV data
const sampleCV = {
    name: "Sarah Mitchell",
    role: "Marketing Manager",
    email: "sarah.m@email.com",
    location: "San Francisco, CA",
    summary: "Results-driven marketing professional with 5+ years experience in digital marketing, SEO, and content strategy.",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "Social Media"],
    experience: [
        { company: "TechStart Inc.", role: "Marketing Manager", duration: "2021 - Present" },
        { company: "Digital Agency Co.", role: "Marketing Specialist", duration: "2019 - 2021" },
    ],
};

// Sample job description
const sampleJob = {
    title: "Senior Marketing Manager",
    company: "TechCorp Inc.",
    requirements: ["5+ years experience", "SEO expertise", "Team leadership", "Analytics tools"],
};

// Sample results
const sampleResults = {
    score: 78,
    atsScore: 72,
    improvements: [
        { text: "Add quantifiable achievements", priority: "high", impact: "+12 pts" },
        { text: "Include 'team leadership' keyword", priority: "high", impact: "+8 pts" },
        { text: "Optimize summary section", priority: "medium", impact: "+5 pts" },
        { text: "Add Google Analytics cert", priority: "medium", impact: "+3 pts" },
        { text: "Use stronger action verbs", priority: "low", impact: "+2 pts" },
    ],
    keywords: {
        matched: ["SEO", "Digital Marketing", "Analytics", "Content Strategy"],
        missing: ["Team Leadership", "SEM", "Budget Management"],
    },
};

export function SampleReportModal({ isOpen, onClose }: SampleReportModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(1);
            setIsLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (currentStep === 3 && isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
                setCurrentStep(4);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [currentStep, isLoading]);

    const handleNext = () => {
        if (currentStep === 2) {
            setCurrentStep(3);
            setIsLoading(true);
        } else if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleClose = () => {
        setCurrentStep(1);
        setIsLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Dark gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

                    {/* Animated gradient orbs */}
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2F6BFF]/30 rounded-full blur-[100px]"
                        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3CE0B1]/20 rounded-full blur-[100px]"
                        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Glass card effect */}
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" />

                        {/* Content wrapper */}
                        <div className="relative">
                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                                <div className="flex items-center gap-4">
                                    {/* Step pills */}
                                    <div className="flex items-center gap-2">
                                        {['CV', 'Job', 'AI', 'Results', 'Done'].map((label, i) => (
                                            <motion.div
                                                key={i}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${i + 1 === currentStep
                                                    ? 'bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white shadow-lg shadow-[#2F6BFF]/25'
                                                    : i + 1 < currentStep
                                                        ? 'bg-[#3CE0B1]/10 text-[#059669]'
                                                        : 'bg-slate-100 text-slate-400'
                                                    }`}
                                                animate={{ scale: i + 1 === currentStep ? 1.05 : 1 }}
                                            >
                                                {i + 1 < currentStep && <CheckCircle size={12} />}
                                                {label}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Main Content */}
                            <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
                                <AnimatePresence mode="wait">
                                    {/* Step 1: CV Preview */}
                                    {currentStep === 1 && (
                                        <StepContent key="step1">
                                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                                {/* Left: Info */}
                                                <div>
                                                    <motion.div
                                                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#2F6BFF]/10 rounded-full text-[#2F6BFF] text-sm font-medium mb-4"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        <FileText size={14} />
                                                        Step 1 of 5
                                                    </motion.div>
                                                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Sample CV Selected</h2>
                                                    <p className="text-slate-500 mb-6">We'll analyze this CV to show you how SuperCV works. Click continue to match it against a job.</p>

                                                    <div className="space-y-3 mb-8">
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <div className="w-8 h-8 rounded-lg bg-[#3CE0B1]/10 flex items-center justify-center">
                                                                <Zap size={16} className="text-[#3CE0B1]" />
                                                            </div>
                                                            <span className="text-slate-600">Instant AI-powered analysis</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <div className="w-8 h-8 rounded-lg bg-[#2F6BFF]/10 flex items-center justify-center">
                                                                <Target size={16} className="text-[#2F6BFF]" />
                                                            </div>
                                                            <span className="text-slate-600">Job-specific keyword matching</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                                                                <TrendingUp size={16} className="text-[#F59E0B]" />
                                                            </div>
                                                            <span className="text-slate-600">Actionable improvement tips</span>
                                                        </div>
                                                    </div>

                                                    <CTAButton onClick={handleNext} text="Continue with this CV" />
                                                </div>

                                                {/* Right: Document Preview */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: 30, rotateY: -10 }}
                                                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="relative"
                                                >
                                                    <DocumentPreview type="cv" />
                                                </motion.div>
                                            </div>
                                        </StepContent>
                                    )}

                                    {/* Step 2: Job Preview */}
                                    {currentStep === 2 && (
                                        <StepContent key="step2">
                                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                                {/* Left: Job Document */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    <DocumentPreview type="job" />
                                                </motion.div>

                                                {/* Right: Info */}
                                                <div>
                                                    <motion.div
                                                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#2F6BFF]/10 rounded-full text-[#2F6BFF] text-sm font-medium mb-4"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        <Briefcase size={14} />
                                                        Step 2 of 5
                                                    </motion.div>
                                                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Target Job Selected</h2>
                                                    <p className="text-slate-500 mb-6">Our AI will analyze how well the CV matches this job's requirements and keywords.</p>

                                                    {/* Match preview */}
                                                    <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Potential Match Preview</div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1]"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: '75%' }}
                                                                    transition={{ delay: 0.5, duration: 1 }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-bold text-[#2F6BFF]">~75%</span>
                                                        </div>
                                                    </div>

                                                    <CTAButton onClick={handleNext} text="Start AI Analysis" icon={<Sparkles size={18} />} />
                                                </div>
                                            </div>
                                        </StepContent>
                                    )}

                                    {/* Step 3: Loading */}
                                    {currentStep === 3 && (
                                        <StepContent key="step3">
                                            <div className="flex flex-col items-center justify-center py-16">
                                                {/* Animated analysis visualization */}
                                                <div className="relative w-64 h-64 mb-8">
                                                    {/* Orbiting dots */}
                                                    <motion.div
                                                        className="absolute inset-0"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2F6BFF]" />
                                                    </motion.div>
                                                    <motion.div
                                                        className="absolute inset-4"
                                                        animate={{ rotate: -360 }}
                                                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#3CE0B1]" />
                                                    </motion.div>

                                                    {/* Center icon */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <motion.div
                                                            animate={{ scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                            className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center shadow-2xl shadow-[#2F6BFF]/40"
                                                        >
                                                            <Sparkles size={48} className="text-white" />
                                                        </motion.div>
                                                    </div>

                                                    {/* Rings */}
                                                    <motion.div
                                                        className="absolute inset-8 border-2 border-[#2F6BFF]/20 rounded-full"
                                                        animate={{ scale: [1, 1.05, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                    <motion.div
                                                        className="absolute inset-4 border-2 border-[#3CE0B1]/10 rounded-full"
                                                        animate={{ scale: [1.05, 1, 1.05] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                </div>

                                                <motion.h2
                                                    className="text-2xl font-bold text-slate-900 mb-2"
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    AI is analyzing...
                                                </motion.h2>
                                                <p className="text-slate-500 text-center max-w-md">
                                                    Comparing keywords, checking ATS compatibility, and generating personalized suggestions
                                                </p>

                                                {/* Progress steps */}
                                                <div className="mt-8 flex gap-6">
                                                    <LoadingStep text="Parsing" delay={0} />
                                                    <LoadingStep text="Matching" delay={0.8} />
                                                    <LoadingStep text="Scoring" delay={1.6} />
                                                </div>
                                            </div>
                                        </StepContent>
                                    )}

                                    {/* Step 4: Results */}
                                    {currentStep === 4 && (
                                        <StepContent key="step4">
                                            <div className="grid md:grid-cols-3 gap-6">
                                                {/* Left: Score */}
                                                <div className="md:col-span-1">
                                                    <motion.div
                                                        className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 text-center border border-slate-200 shadow-xl h-full"
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                    >
                                                        {/* Circular Score */}
                                                        <div className="relative w-36 h-36 mx-auto mb-4">
                                                            {/* Background ring */}
                                                            <svg className="w-full h-full transform -rotate-90">
                                                                <circle
                                                                    cx="72"
                                                                    cy="72"
                                                                    r="64"
                                                                    stroke="#e2e8f0"
                                                                    strokeWidth="12"
                                                                    fill="none"
                                                                />
                                                                <motion.circle
                                                                    cx="72"
                                                                    cy="72"
                                                                    r="64"
                                                                    stroke="url(#scoreGradient)"
                                                                    strokeWidth="12"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    initial={{ strokeDasharray: "0 402" }}
                                                                    animate={{ strokeDasharray: `${(sampleResults.score / 100) * 402} 402` }}
                                                                    transition={{ duration: 1, delay: 0.3 }}
                                                                />
                                                                <defs>
                                                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                        <stop offset="0%" stopColor="#F59E0B" />
                                                                        <stop offset="100%" stopColor="#EF4444" />
                                                                    </linearGradient>
                                                                </defs>
                                                            </svg>
                                                            {/* Score number */}
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                <motion.span
                                                                    className="text-5xl font-black text-slate-900"
                                                                    initial={{ opacity: 0, scale: 0 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: 0.5, type: "spring" }}
                                                                >
                                                                    {sampleResults.score}
                                                                </motion.span>
                                                                <span className="text-xs text-slate-400 font-medium">out of 100</span>
                                                            </div>
                                                        </div>

                                                        {/* Stats */}
                                                        <div className="space-y-3 text-left bg-slate-50 rounded-xl p-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-slate-500">ATS Ready</span>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            className="h-full bg-[#F59E0B]"
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${sampleResults.atsScore}%` }}
                                                                            transition={{ delay: 0.6, duration: 0.8 }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm font-bold text-[#F59E0B]">{sampleResults.atsScore}%</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-slate-500">Keywords</span>
                                                                <span className="text-sm font-bold text-[#3CE0B1]">4/7 matched</span>
                                                            </div>
                                                        </div>

                                                        {/* Potential */}
                                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                                            <div className="text-xs text-slate-400 mb-1">Potential after fixes</div>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <span className="text-3xl font-black bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] bg-clip-text text-transparent">+30</span>
                                                                <span className="text-sm text-slate-500">pts</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>

                                                {/* Right: Improvements */}
                                                <div className="md:col-span-2">
                                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                                                            <AlertTriangle size={16} className="text-[#F59E0B]" />
                                                        </div>
                                                        Top 5 Quick Wins
                                                    </h3>
                                                    <div className="space-y-3 mb-6">
                                                        {sampleResults.improvements.map((item, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, x: 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.1 + i * 0.1 }}
                                                                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group"
                                                            >
                                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm ${item.priority === 'high' ? 'bg-gradient-to-br from-[#EF4444] to-[#DC2626]' :
                                                                        item.priority === 'medium' ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]' :
                                                                            'bg-gradient-to-br from-[#3CE0B1] to-[#059669]'
                                                                    }`}>
                                                                    {i + 1}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{item.text}</div>
                                                                </div>
                                                                <div className="text-xs font-bold text-[#059669] bg-[#3CE0B1]/15 px-3 py-1.5 rounded-lg">
                                                                    {item.impact}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    <CTAButton onClick={handleNext} text="See Full Report" />
                                                </div>
                                            </div>
                                        </StepContent>
                                    )}

                                    {/* Step 5: Final CTA */}
                                    {currentStep === 5 && (
                                        <StepContent key="step5">
                                            <div className="text-center py-8">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring" }}
                                                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#2F6BFF]/30"
                                                >
                                                    <Star size={40} className="text-white" />
                                                </motion.div>

                                                <h2 className="text-3xl font-bold text-slate-900 mb-3">Demo Complete!</h2>
                                                <p className="text-slate-500 max-w-md mx-auto mb-8">
                                                    This was just a sample. Imagine what SuperCV can do for YOUR CV. Get your personalized analysis now!
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                                                    <Link
                                                        href="/register"
                                                        onClick={handleClose}
                                                        className="flex-1 py-4 px-8 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#2F6BFF]/25 flex items-center justify-center gap-2"
                                                    >
                                                        <Sparkles size={18} />
                                                        Analyze My CV
                                                    </Link>
                                                    <button
                                                        onClick={handleClose}
                                                        className="py-4 px-6 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </StepContent>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Document Preview Component
function DocumentPreview({ type }: { type: 'cv' | 'job' }) {
    return (
        <div className="relative">
            {/* Shadow layers for depth */}
            <div className="absolute inset-4 bg-slate-200 rounded-2xl transform rotate-2" />
            <div className="absolute inset-2 bg-slate-100 rounded-2xl transform rotate-1" />

            {/* Main document */}
            <motion.div
                className="relative bg-white rounded-2xl p-6 shadow-2xl border border-slate-200"
                whileHover={{ y: -5, rotate: 0.5 }}
            >
                {type === 'cv' ? (
                    <>
                        {/* CV Header */}
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center text-white font-bold text-lg">
                                SM
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 text-lg">{sampleCV.name}</div>
                                <div className="text-sm text-[#2F6BFF]">{sampleCV.role}</div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                    <MapPin size={10} /> {sampleCV.location}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Summary</div>
                            <p className="text-sm text-slate-600 leading-relaxed">{sampleCV.summary}</p>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Skills</div>
                            <div className="flex flex-wrap gap-1">
                                {sampleCV.skills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-[#2F6BFF]/5 text-[#2F6BFF] text-xs rounded font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Experience</div>
                            <div className="space-y-2">
                                {sampleCV.experience.map((exp, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-slate-700">{exp.role} @ {exp.company}</span>
                                        <span className="text-xs text-slate-400">{exp.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Job Header */}
                        <div className="mb-4 pb-4 border-b border-slate-100">
                            <div className="inline-block px-2 py-0.5 bg-[#3CE0B1]/10 text-[#059669] text-xs font-semibold rounded mb-2">
                                Full-time
                            </div>
                            <div className="font-bold text-slate-900 text-xl">{sampleJob.title}</div>
                            <div className="text-sm text-[#2F6BFF] font-medium">{sampleJob.company}</div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Requirements</div>
                            <div className="space-y-2">
                                {sampleJob.requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle size={14} className="text-[#3CE0B1]" />
                                        {req}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

function StepContent({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}

function CTAButton({ onClick, text, icon }: { onClick: () => void; text: string; icon?: React.ReactNode }) {
    return (
        <motion.button
            onClick={onClick}
            className="w-full py-4 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-bold rounded-xl shadow-lg shadow-[#2F6BFF]/25 flex items-center justify-center gap-2 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            {icon}
            {text}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
    );
}

function LoadingStep({ text, delay }: { text: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ delay }}
            className="flex flex-col items-center gap-2"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: "spring" }}
                className="w-8 h-8 rounded-full bg-[#3CE0B1] flex items-center justify-center"
            >
                <CheckCircle size={16} className="text-white" />
            </motion.div>
            <span className="text-xs text-slate-500">{text}</span>
        </motion.div>
    );
}
