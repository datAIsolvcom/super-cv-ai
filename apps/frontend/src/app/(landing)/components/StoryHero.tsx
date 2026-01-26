'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { Typewriter } from './effects/Typewriter';
import { FloatingCV } from './FloatingCV';
import { SampleReportModal } from './SampleReportModal';
import { AnimatedGradient, FloatingParticles, GlowOrbs, GridPattern, AnimatedCounter } from './effects';

/**
 * StoryHero Component
 * 
 * Premium scroll-driven hero with creative buttons.
 */
export function StoryHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

    // Intro Sequence Logic - lock scroll during intro animation
    useEffect(() => {
        // Lock scroll for intro animation
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleIntroComplete = () => {
        document.body.style.overflow = '';
    };

    return (
        <>
            <AnimatedGradient className="relative min-h-screen flex items-center bg-gradient-to-b from-white via-slate-50 to-white">
                <section ref={containerRef} className="w-full py-20 lg:py-0">
                    {/* Background Effects */}
                    <GlowOrbs />
                    <GridPattern />
                    <FloatingParticles />

                    <motion.div
                        style={{ opacity, y, scale }}
                        className="container mx-auto px-6"
                    >
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Left: Content */}
                            <div className="max-w-xl mx-auto lg:mx-0 flex flex-col items-center lg:items-start text-center lg:text-left">
                                {/* Badge with pulse animation */}
                                {/* Badge with pulse animation */}
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F6BFF]/10 rounded-full text-[#2F6BFF] text-sm font-medium mb-6 badge-glow animate-fade-in-up"
                                >
                                    <Sparkles size={14} className="icon-hover-rotate" />
                                    <span>AI-Powered CV Improvement</span>
                                </div>

                                {/* Headline - Updated */}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight min-h-[160px] lg:min-h-[200px]">
                                    <Typewriter
                                        text="Make Your CV"
                                        speed={50}
                                        delay={2000}
                                        hideCursorOnComplete={true}
                                    />
                                    <br />
                                    <span className="text-gradient-primary inline-block py-2">
                                        <Typewriter
                                            text="Getting You Hired."
                                            speed={50}
                                            delay={3200}
                                            hideCursorOnComplete={true}
                                            onComplete={handleIntroComplete}
                                        />
                                    </span>
                                </h1>

                                {/* Description - Updated */}
                                <p
                                    className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed animate-fade-in-up opacity-0"
                                    style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
                                >
                                    Upload your CV → Get your score + <span className="font-semibold text-[#2F6BFF]">Top 5 instant fixes</span>.
                                    Our AI analyzes your CV in seconds, beats ATS systems, and helps you land 3× more interviews.
                                </p>

                                {/* Creative CTA Buttons - Updated */}
                                <div
                                    className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto justify-center lg:justify-start animate-fade-in-up opacity-0"
                                    style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
                                >
                                    {/* Primary CTA - Glowing button */}
                                    <Link href="/app" className="group relative">
                                        {/* Glow effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Button */}
                                        <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-semibold rounded-xl overflow-hidden">
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                            <span className="relative text-lg">Analyze My CV for Free</span>
                                            <motion.div
                                                className="relative"
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                <ArrowRight size={20} />
                                            </motion.div>
                                        </div>
                                    </Link>

                                    {/* Secondary CTA - See a Sample Report */}
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 hover:border-[#2F6BFF] text-slate-700 hover:text-[#2F6BFF] font-semibold rounded-xl transition-all duration-300 btn-hover-lift"
                                    >
                                        <Play size={18} className="fill-current" />
                                        <span className="text-lg">See a Sample Report</span>
                                    </button>
                                </div>

                                {/* Trust indicators */}
                                <div
                                    className="flex flex-wrap gap-6 justify-center lg:justify-start animate-fade-in-up opacity-0"
                                    style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
                                >
                                    {/* Animated Stats */}
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[#2F6BFF]">
                                            <AnimatedCounter end={10000} suffix="+" duration={2000} />
                                        </div>
                                        <div className="text-xs text-slate-500">CVs Optimized</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[#2F6BFF]">
                                            <AnimatedCounter end={95} suffix="%" duration={1500} />
                                        </div>
                                        <div className="text-xs text-slate-500">ATS Pass Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[#2F6BFF]">3×</div>
                                        <div className="text-xs text-slate-500">More Interviews</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Floating CV */}
                            <div className="hidden lg:flex justify-center lg:justify-end">
                                <FloatingCV />
                            </div>
                        </div>
                    </motion.div>
                </section>
            </AnimatedGradient>

            {/* Sample Report Modal */}
            <SampleReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

