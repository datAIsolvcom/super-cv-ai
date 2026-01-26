'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Play, Users, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { FloatingCV } from './FloatingCV';
import { SampleReportModal } from './SampleReportModal';
import { AnimatedCounter } from './effects';

const heroStats = [
    { icon: Users, value: '10,000+', label: 'CVs Optimized', color: '#2F6BFF' },
    { icon: TrendingUp, value: '95%', label: 'ATS Pass Rate', color: '#3CE0B1' },
    { icon: Award, value: '3×', label: 'More Interviews', color: '#8B5CF6' },
];

/**
 * HeroClean Component
 * 
 * Clean split-layout hero with content on left, floating CV on right.
 */
export function HeroClean() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);
    const statsInView = useInView(statsRef, { once: true });

    return (
        <>
            <section className="relative min-h-screen flex items-center">
                {/* Background gradient */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2F6BFF]/5 to-transparent" />
                </div>

                <div className="container mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left: Content */}
                        <div className="order-2 lg:order-1">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F6BFF]/10 rounded-full text-[#2F6BFF] text-sm font-medium mb-6"
                            >
                                <Sparkles size={14} />
                                <span>AI-Powered CV Optimization</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
                            >
                                Make Your CV <br />
                                <span className="text-gradient-primary">Get You Hired</span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed"
                            >
                                Upload your CV → Get your score + <span className="font-semibold text-[#2F6BFF]">Top 5 instant fixes</span>.
                                Our AI analyzes your CV in seconds, beats ATS systems, and helps you land more interviews.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 mb-10"
                            >
                                <Link
                                    href="/register"
                                    className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
                                >
                                    Analyze My CV for Free
                                    <ArrowRight size={18} />
                                </Link>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="btn-ghost flex items-center justify-center gap-2 text-lg px-8 py-4"
                                >
                                    <Play size={18} className="fill-current" />
                                    See a Sample Report
                                </button>
                            </motion.div>

                            {/* Benefits */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-wrap gap-4 mb-10"
                            >
                                {['No credit card required', 'Instant results', 'Free tier available'].map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-2 text-sm text-slate-500">
                                        <CheckCircle size={16} className="text-[#3CE0B1]" />
                                        {benefit}
                                    </div>
                                ))}
                            </motion.div>

                            {/* Stats Bar */}
                            <motion.div
                                ref={statsRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="flex flex-wrap gap-6 lg:gap-8"
                            >
                                {heroStats.map((stat, i) => (
                                    <div key={stat.label} className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${stat.color}15` }}
                                        >
                                            <stat.icon size={20} style={{ color: stat.color }} />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                                            <div className="text-xs text-slate-500">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right: Floating CV */}
                        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                            <FloatingCV />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sample Report Modal */}
            <SampleReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
