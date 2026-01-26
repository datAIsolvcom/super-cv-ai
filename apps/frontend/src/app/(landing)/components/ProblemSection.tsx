'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { AlertTriangle, Clock, XCircle, Users, Zap, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * Animated counter hook
 */
function useCounter(end: number, duration: number = 2000, start: number = 0, decimals: boolean = false) {
    const [count, setCount] = useState(start);
    const ref = useRef<HTMLAnchorElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = progress * (end - start) + start;
            setCount(decimals ? Math.round(value * 10) / 10 : Math.floor(value));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, end, duration, start, decimals]);

    return { count, ref };
}

const problems = [
    {
        icon: XCircle,
        stat: 75,
        suffix: '%',
        title: 'Rejected by ATS',
        description: 'Never reach HR eyes',
        color: '#EF4444',
        bgGradient: 'from-red-500/10 to-red-500/5',
        source: 'https://www.forbes.com/sites/robinryan/2021/02/09/resume-keywords-and-the-applicant-tracking-system-atswhat-you-need-to-know/',
        sourceLabel: 'Forbes',
    },
    {
        icon: Zap,
        stat: 99,
        suffix: '%',
        title: "Keywords don't match",
        description: 'Instant rejection',
        color: '#F97316',
        bgGradient: 'from-orange-500/10 to-orange-500/5',
        source: 'https://www.jobscan.co/applicant-tracking-systems',
        sourceLabel: 'Jobscan',
    },
    {
        icon: Users,
        stat: 1000,
        suffix: '+',
        title: 'Rivals per job everyday',
        description: 'In some jobs, you need to be Super',
        color: '#8B5CF6',
        bgGradient: 'from-purple-500/10 to-purple-500/5',
        source: 'https://www.businessinsider.com/remote-companies-say-getting-flooded-with-applications-2025-10',
        sourceLabel: 'Business Insider',
    },
    {
        icon: Clock,
        stat: 7.4,
        suffix: 's',
        title: 'Recruiter looks at resume',
        description: "HR's don't have much time",
        color: '#EAB308',
        bgGradient: 'from-yellow-500/10 to-yellow-500/5',
        source: 'https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/',
        sourceLabel: 'HR Dive',
        decimals: true,
    },
];

/**
 * ProblemSection Component
 * 
 * Dramatic problem showcase with animated stats and source links.
 */
export function ProblemSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    return (
        <section ref={containerRef} className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Header - No badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Why Your CV Isn't Working
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        The job market is brutal. Here's what you're up against.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {problems.map((problem, index) => (
                        <ProblemCard
                            key={problem.title}
                            problem={problem}
                            index={index}
                            isInView={isInView}
                        />
                    ))}
                </div>

                {/* Transition CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                        <p className="text-xl text-slate-700">
                            But what if there was a <span className="font-bold text-[#2F6BFF]">better way</span>?
                        </p>
                        <motion.a
                            href="#demo"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 text-[#2F6BFF] font-semibold hover:gap-3 transition-all"
                        >
                            See how it works
                            <ArrowRight size={18} />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Separate component for each card to properly use hooks
function ProblemCard({ problem, index, isInView }: {
    problem: typeof problems[0];
    index: number;
    isInView: boolean;
}) {
    const { count, ref } = useCounter(problem.stat, 2000, 0, problem.decimals);

    return (
        <motion.a
            href={problem.source}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative block cursor-pointer"
        >
            <div className={`relative bg-gradient-to-br ${problem.bgGradient} rounded-2xl p-6 border border-white/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden h-full`}>
                {/* Hover glow */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{ backgroundColor: `${problem.color}10` }}
                />

                {/* Icon */}
                <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${problem.color}15` }}
                >
                    <problem.icon size={24} style={{ color: problem.color }} />
                </div>

                {/* Stat */}
                <div className="relative">
                    <div
                        className="text-5xl font-bold mb-2"
                        style={{ color: problem.color }}
                    >
                        {problem.decimals ? count.toFixed(1) : count}{problem.suffix}
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-1">{problem.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{problem.description}</p>

                    {/* Source link */}
                    <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                        <span>Source: {problem.sourceLabel}</span>
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>
        </motion.a>
    );
}
