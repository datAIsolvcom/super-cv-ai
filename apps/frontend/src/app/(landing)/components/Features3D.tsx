'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Brain, FileCheck, Target, Zap, Shield, TrendingUp, Sparkles, ArrowRight, type LucideIcon } from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
    gradient: string;
}

const features: Feature[] = [
    {
        icon: Brain,
        title: 'AI-Powered Analysis',
        description: 'Deep learning algorithms scan your CV for optimization opportunities.',
        color: '#2F6BFF',
        gradient: 'from-[#2F6BFF] to-blue-600',
    },
    {
        icon: FileCheck,
        title: 'ATS Optimization',
        description: 'Beat applicant tracking systems with keyword-optimized content.',
        color: '#3CE0B1',
        gradient: 'from-[#3CE0B1] to-emerald-500',
    },
    {
        icon: Target,
        title: 'Job Matching',
        description: 'Tailor your CV to specific job descriptions for maximum impact.',
        color: '#8B5CF6',
        gradient: 'from-purple-500 to-purple-600',
    },
    {
        icon: Zap,
        title: 'Instant Results',
        description: 'Get comprehensive feedback in seconds, not hours.',
        color: '#F97316',
        gradient: 'from-orange-500 to-orange-600',
    },
    {
        icon: Shield,
        title: 'Privacy First',
        description: 'Your data is encrypted and never shared with third parties.',
        color: '#3CE0B1',
        gradient: 'from-[#3CE0B1] to-teal-500',
    },
    {
        icon: TrendingUp,
        title: 'Score Tracking',
        description: 'Monitor your CV score improvements over time.',
        color: '#2F6BFF',
        gradient: 'from-[#2F6BFF] to-indigo-600',
    },
];

/**
 * Features3D Component
 * 
 * Premium features section with hover animations.
 */
export function Features3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section
            id="features"
            ref={containerRef}
            className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
        >
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-[#2F6BFF]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#3CE0B1]/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F6BFF]/10 text-[#2F6BFF] rounded-full text-sm font-medium mb-4">
                        <Sparkles size={14} />
                        What You Get
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Everything you need to{' '}
                        <span className="text-gradient-primary">land your dream job</span>
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        Our AI-powered platform provides comprehensive tools to optimize your resume
                        and boost your chances of getting hired.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="group relative"
                        >
                            {/* Hover glow */}
                            <motion.div
                                className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 blur-xl transition-opacity duration-300`}
                                animate={{ opacity: hoveredIndex === index ? 0.2 : 0 }}
                            />

                            {/* Card */}
                            <motion.div
                                className="relative bg-white rounded-2xl p-8 border border-slate-100 h-full transition-all duration-300 group-hover:border-transparent group-hover:shadow-xl"
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {/* Icon */}
                                <motion.div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                                    style={{ boxShadow: `0 10px 30px -10px ${feature.color}50` }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring' }}
                                >
                                    <feature.icon size={26} className="text-white" />
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#2F6BFF] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover arrow */}
                                <motion.div
                                    className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    animate={{ x: hoveredIndex === index ? 0 : -10 }}
                                >
                                    <ArrowRight size={20} style={{ color: feature.color }} />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-slate-100"
                >
                    {[
                        { value: '50+', label: 'Optimization Points' },
                        { value: '<30s', label: 'Analysis Time' },
                        { value: '99.9%', label: 'Uptime' },
                        { value: '24/7', label: 'AI Support' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.9 + i * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-gradient-primary">{stat.value}</div>
                            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
