'use client';

import { motion } from 'framer-motion';

/**
 * FloatingCV Component
 * 
 * Animated CV mockup using CSS and Framer Motion.
 * Features gentle floating animation, stacked effect, and hover effects.
 */
export function FloatingCV() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
        >
            {/* Floating animation wrapper */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotateZ: [0, 1, 0, -1, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative"
            >
                {/* Background CV 2 - furthest back */}
                <div
                    className="absolute bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-[320px] h-[380px] border border-slate-200 opacity-40"
                    style={{
                        transform: 'rotate(-6deg) translateX(-30px) translateY(20px)',
                        zIndex: 1
                    }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-300" />
                        <div className="space-y-1">
                            <div className="h-3 w-24 bg-slate-300 rounded" />
                            <div className="h-2 w-16 bg-slate-300 rounded" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 bg-slate-300 rounded w-full" />
                        <div className="h-2 bg-slate-300 rounded w-3/4" />
                        <div className="h-2 bg-slate-300 rounded w-5/6" />
                    </div>
                </div>

                {/* Background CV 1 - middle */}
                <div
                    className="absolute bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 w-[320px] h-[380px] border border-blue-200 opacity-60"
                    style={{
                        transform: 'rotate(-3deg) translateX(-15px) translateY(10px)',
                        zIndex: 2
                    }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-200" />
                        <div className="space-y-1">
                            <div className="h-3 w-24 bg-blue-200 rounded" />
                            <div className="h-2 w-16 bg-blue-200 rounded" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 bg-blue-200 rounded w-full" />
                        <div className="h-2 bg-blue-200 rounded w-4/5" />
                        <div className="h-2 bg-blue-200 rounded w-2/3" />
                    </div>
                </div>

                {/* Main CV Card - front */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[320px] border border-slate-100 overflow-hidden" style={{ zIndex: 3 }}>
                    {/* Score Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="absolute -top-2 -right-2 w-14 h-14 bg-gradient-to-br from-[#3CE0B1] to-[#2F6BFF] rounded-full flex items-center justify-center shadow-lg"
                    >
                        <span className="text-white font-bold text-lg">95</span>
                    </motion.div>

                    {/* Header Section */}
                    <div className="mb-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center text-white font-bold text-lg">
                                JD
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 text-lg">John Doe</div>
                                <div className="text-sm text-slate-500">Software Engineer</div>
                            </div>
                        </div>
                        <div className="flex gap-2 text-xs text-slate-400">
                            <span>📧 john@example.com</span>
                            <span>📍 San Francisco</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />

                    {/* Summary Section */}
                    <div className="mb-4">
                        <div className="text-xs font-semibold text-[#2F6BFF] uppercase tracking-wide mb-2">Summary</div>
                        <div className="space-y-1">
                            <div className="h-2 bg-slate-100 rounded-full w-full" />
                            <div className="h-2 bg-slate-100 rounded-full w-4/5" />
                            <div className="h-2 bg-slate-100 rounded-full w-3/5" />
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="mb-4">
                        <div className="text-xs font-semibold text-[#2F6BFF] uppercase tracking-wide mb-2">Experience</div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">🏢</div>
                                <div className="flex-1">
                                    <div className="h-2 bg-slate-200 rounded-full w-3/4" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">💼</div>
                                <div className="flex-1">
                                    <div className="h-2 bg-slate-100 rounded-full w-2/3" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <div className="text-xs font-semibold text-[#2F6BFF] uppercase tracking-wide mb-2">Skills</div>
                        <div className="flex flex-wrap gap-1.5">
                            {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill) => (
                                <span
                                    key={skill}
                                    className="px-2 py-1 bg-gradient-to-r from-[#2F6BFF]/10 to-[#3CE0B1]/10 text-[#2F6BFF] rounded-md text-xs font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#2F6BFF]/5 to-transparent" />
                </div>
            </motion.div>
        </motion.div>
    );
}

