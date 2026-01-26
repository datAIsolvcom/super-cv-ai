'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Upload, Cpu, CheckCircle, Sparkles, ArrowRight, FileText, TrendingUp } from 'lucide-react';

const steps = [
    {
        id: 1,
        icon: Upload,
        title: 'Upload Your CV',
        description: 'Upload your PDF or DOCX CV file. Our secure system processes it instantly.',
        color: '#2F6BFF',
    },
    {
        id: 2,
        icon: Cpu,
        title: 'AI Analyzes Your CV',
        description: 'We analyze your CV through our SuperCV AI Model for deep insights.',
        color: '#8B5CF6',
    },
    {
        id: 3,
        icon: Sparkles,
        title: 'Get Your Score & Fixes',
        description: 'You get your CV score and personalized CV improvement recommendations.',
        color: '#3CE0B1',
    },
    {
        id: 4,
        icon: CheckCircle,
        title: 'Apply with Super CV',
        description: 'Apply with your new improvised Super CV and land your dream job!',
        color: '#10B981',
    },
];

/**
 * ProductDemo Component
 * 
 * Premium "How It Works" section with interactive steps.
 */
export function ProductDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });
    const [activeStep, setActiveStep] = useState(1);

    return (
        <section
            id="demo"
            ref={containerRef}
            className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#2F6BFF]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3CE0B1]/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-20"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F6BFF]/10 rounded-full text-[#2F6BFF] text-sm font-medium mb-4">
                        <Sparkles size={14} />
                        How It Works
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        From Upload to <span className="text-gradient-primary">Hired</span>
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        Our AI-powered platform transforms your CV in minutes, not hours.
                    </p>
                </motion.div>

                {/* Steps with Timeline */}
                <div className="grid lg:grid-cols-4 gap-8 mb-20">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.15 }}
                            onMouseEnter={() => setActiveStep(step.id)}
                            className="relative group"
                        >
                            {/* Connector line (not on last) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-slate-200">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1]"
                                        initial={{ width: '0%' }}
                                        animate={isInView && activeStep > step.id ? { width: '100%' } : { width: '0%' }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}

                            {/* Card */}
                            <div className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 ${activeStep === step.id
                                ? 'border-[#2F6BFF] shadow-xl shadow-[#2F6BFF]/10 scale-105'
                                : 'border-slate-100 hover:border-slate-200 hover:shadow-lg'
                                }`}>
                                {/* Step number badge */}
                                <div
                                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                                    style={{ backgroundColor: step.color }}
                                >
                                    {step.id}
                                </div>

                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `${step.color}15` }}
                                >
                                    <step.icon size={26} style={{ color: step.color }} />
                                </div>

                                {/* Content */}
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Interactive Demo Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="relative max-w-4xl mx-auto"
                >
                    {/* Glow effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#2F6BFF]/20 via-[#3CE0B1]/20 to-[#8B5CF6]/20 rounded-3xl blur-2xl" />

                    {/* Browser frame */}
                    <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Browser header */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="bg-slate-700 rounded-lg px-4 py-1.5 text-sm text-slate-300 text-center max-w-xs mx-auto">
                                    supercv.ai/analyze
                                </div>
                            </div>
                        </div>

                        {/* App content */}
                        <div className="bg-gradient-to-br from-slate-50 to-white p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left: Upload */}
                                <div className="space-y-4">
                                    <motion.div
                                        animate={{ scale: [1, 1.02, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="border-2 border-dashed border-[#2F6BFF]/40 hover:border-[#2F6BFF] rounded-2xl p-8 text-center bg-white transition-colors cursor-pointer"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#2F6BFF]/25">
                                            <Upload size={28} className="text-white" />
                                        </div>
                                        <p className="font-semibold text-slate-900">Drop your CV here</p>
                                        <p className="text-sm text-slate-500 mt-1">PDF, DOCX up to 10MB</p>
                                    </motion.div>

                                    {/* File preview */}
                                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                            <FileText size={20} className="text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">resume_john_doe.pdf</p>
                                            <p className="text-xs text-slate-500">2.4 MB</p>
                                        </div>
                                        <div className="w-5 h-5 rounded-full bg-[#3CE0B1] flex items-center justify-center">
                                            <CheckCircle size={12} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Results */}
                                <div className="space-y-4">
                                    {/* Score card */}
                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium text-slate-600">Overall Score</span>
                                            <span className="text-xs text-[#3CE0B1] font-medium">+23 points</span>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <span className="text-5xl font-bold text-gradient-primary">95</span>
                                            <span className="text-slate-400 mb-2">/100</span>
                                        </div>
                                        <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={isInView ? { width: '95%' } : {}}
                                                transition={{ duration: 1, delay: 0.8 }}
                                                className="h-full bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'Keywords', value: '18/20', icon: TrendingUp, color: '#2F6BFF' },
                                            { label: 'ATS Ready', value: '✓', icon: CheckCircle, color: '#3CE0B1' },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <stat.icon size={14} style={{ color: stat.color }} />
                                                    <span className="text-xs text-slate-500">{stat.label}</span>
                                                </div>
                                                <span className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating badge */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#3CE0B1]/20 flex items-center justify-center">
                            <CheckCircle size={20} className="text-[#3CE0B1]" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">ATS Optimized!</p>
                            <p className="text-xs text-slate-500">Ready to apply</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
