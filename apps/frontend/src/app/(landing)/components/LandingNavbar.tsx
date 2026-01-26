'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const { data: session } = useSession();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 50);
    });

    const navLinks = [
        { href: '#demo', label: 'How It Works' },
        { href: '#features', label: 'What You Get' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={cn(
                        'max-w-5xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl border transition-all duration-500',
                        'bg-white/70 backdrop-blur-2xl backdrop-saturate-150',
                        isScrolled
                            ? 'border-white/40 shadow-xl shadow-slate-900/10'
                            : 'border-white/30 shadow-lg shadow-slate-900/5'
                    )}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-800">
                            Super<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1]">CV</span>
                        </span>
                    </Link>

                    {/* Center Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#2F6BFF] transition-colors rounded-xl hover:bg-white/50 link-underline-animated"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right Side - Conditional buttons based on session */}
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <Link
                                href="/app"
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity btn-hover-lift"
                            >
                                <LayoutDashboard size={14} />
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/app"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity btn-hover-lift btn-arrow-slide"
                                >
                                    Analyze My CV
                                    <ArrowRight size={14} className="arrow-icon" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-xl transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </motion.nav>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-white/90 backdrop-blur-2xl md:hidden"
                    >
                        <div className="container mx-auto px-6 pt-28 pb-8">
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-4 py-4 text-xl font-medium text-slate-800 hover:text-[#2F6BFF] hover:bg-slate-50 rounded-xl transition-all"
                                    >
                                        {link.label}
                                    </a>
                                ))}

                                <div className="h-px bg-slate-100 my-4" />

                                {session ? (
                                    <Link
                                        href="/app"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-semibold rounded-xl mt-2"
                                    >
                                        <LayoutDashboard size={18} />
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-4 text-xl font-medium text-slate-600">
                                            Sign In
                                        </Link>

                                        <Link
                                            href="/app"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-semibold rounded-xl mt-2"
                                        >
                                            Analyze My CV
                                            <ArrowRight size={18} />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
