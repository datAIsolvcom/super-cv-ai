'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Check, Sparkles, Zap, Crown, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const creditPackages = [
    {
        id: 1,
        name: '1 Credit',
        credits: 1,
        price: 'Rp 10.000',
        priceValue: 10000,
        description: 'Try it out',
        icon: Zap,
        popular: false,
        gradient: 'from-slate-500 to-slate-600',
    },
    {
        id: 3,
        name: '3 Credits',
        credits: 3,
        price: 'Rp 25.000',
        priceValue: 25000,
        description: 'Best for job seekers',
        savings: '17% off',
        icon: Crown,
        popular: true,
        gradient: 'from-[#2F6BFF] to-[#3CE0B1]',
    },
    {
        id: 5,
        name: '5 Credits',
        credits: 5,
        price: 'Rp 35.000',
        priceValue: 35000,
        description: 'Maximum value',
        savings: '30% off',
        icon: Shield,
        popular: false,
        gradient: 'from-purple-500 to-purple-600',
    },
];

export function Pricing() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
    const [loadingPackage, setLoadingPackage] = useState<number | null>(null);
    const { data: session } = useSession();
    const router = useRouter();

    const handlePurchase = async (packageId: number) => {
        if (!session?.user?.id) {
            router.push('/login?redirect=/pricing');
            return;
        }

        setLoadingPackage(packageId);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': session.user.id,
                },
                body: JSON.stringify({ packageId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Payment API error:', response.status, errorText);
                alert(`Payment failed: ${response.statusText || 'Server error'}`);
                return;
            }

            const data = await response.json();

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                console.error('Payment error - no URL:', data);
                alert(data.message || 'Failed to create payment. Please try again.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to create payment. Please try again.');
        } finally {
            setLoadingPackage(null);
        }
    };

    return (
        <section
            id="pricing"
            ref={containerRef}
            className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2F6BFF]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3CE0B1]/5 rounded-full blur-3xl" />
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
                        Pricing
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Simple, <span className="text-gradient-primary">Credit-Based</span> Pricing
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-xl mx-auto">
                        Get 1 free credit daily. Buy more when you need them. No subscriptions.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
                    {creditPackages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredPlan(pkg.name)}
                            onMouseLeave={() => setHoveredPlan(null)}
                            className={`relative ${pkg.popular ? 'md:-mt-4' : ''}`}
                        >
                            {/* Popular glow */}
                            {pkg.popular && (
                                <div className="absolute -inset-2 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-3xl opacity-20 blur-xl" />
                            )}

                            {/* Card */}
                            <motion.div
                                whileHover={{ y: -8 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className={`relative bg-white rounded-2xl p-8 h-full transition-all duration-300 ${pkg.popular
                                    ? 'border-2 border-[#2F6BFF] shadow-2xl'
                                    : 'border border-slate-200 hover:border-slate-300 hover:shadow-xl'
                                    }`}
                            >
                                {/* Popular badge */}
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <motion.div
                                            animate={{ y: [0, -3, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="px-4 py-1.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-semibold rounded-full flex items-center gap-1.5 shadow-lg"
                                        >
                                            <Sparkles size={14} />
                                            Best Value
                                        </motion.div>
                                    </div>
                                )}

                                {/* Savings badge */}
                                {pkg.savings && (
                                    <div className="absolute top-4 right-4">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                            {pkg.savings}
                                        </span>
                                    </div>
                                )}

                                {/* Plan icon */}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                    <pkg.icon size={22} className="text-white" />
                                </div>

                                {/* Plan header */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-slate-900">{pkg.price}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">{pkg.description}</p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    <motion.li
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.popular ? 'bg-[#3CE0B1]/20' : 'bg-slate-100'
                                            }`}>
                                            <Check size={12} className={pkg.popular ? 'text-[#3CE0B1]' : 'text-slate-400'} />
                                        </div>
                                        <span className="text-slate-600">{pkg.credits} CV analysis credit{pkg.credits > 1 ? 's' : ''}</span>
                                    </motion.li>
                                    <motion.li
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.25 + index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.popular ? 'bg-[#3CE0B1]/20' : 'bg-slate-100'
                                            }`}>
                                            <Check size={12} className={pkg.popular ? 'text-[#3CE0B1]' : 'text-slate-400'} />
                                        </div>
                                        <span className="text-slate-600">Full ATS scoring & suggestions</span>
                                    </motion.li>
                                    <motion.li
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.popular ? 'bg-[#3CE0B1]/20' : 'bg-slate-100'
                                            }`}>
                                            <Check size={12} className={pkg.popular ? 'text-[#3CE0B1]' : 'text-slate-400'} />
                                        </div>
                                        <span className="text-slate-600">AI-powered improvements</span>
                                    </motion.li>
                                    <motion.li
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.35 + index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.popular ? 'bg-[#3CE0B1]/20' : 'bg-slate-100'
                                            }`}>
                                            <Check size={12} className={pkg.popular ? 'text-[#3CE0B1]' : 'text-slate-400'} />
                                        </div>
                                        <span className="text-slate-600">Never expires</span>
                                    </motion.li>
                                </ul>

                                {/* CTA */}
                                <button
                                    onClick={() => handlePurchase(pkg.id)}
                                    disabled={loadingPackage !== null}
                                    className={`group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed ${pkg.popular
                                        ? 'bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white hover:shadow-lg hover:shadow-[#2F6BFF]/25'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {loadingPackage === pkg.id ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Buy {pkg.name}
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Free credit info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-6 mt-12"
                >
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Zap size={16} className="text-[#2F6BFF]" />
                        1 free credit daily (if you have 0 credits)
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Check size={16} className="text-[#3CE0B1]" />
                        Credits never expire
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Shield size={16} className="text-[#3CE0B1]" />
                        Secure payment via Mayar
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
