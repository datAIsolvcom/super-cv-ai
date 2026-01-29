'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';

const faqs = [
    {
        question: 'How does the AI CV analysis work?',
        answer: 'Our AI analyzes your CV against 50+ criteria including ATS compatibility, keyword optimization, formatting, and content quality. It uses the same technology that powers leading ATS systems to ensure your CV gets past automated screening.',
        category: 'Product',
    },
    {
        question: 'Is my data secure?',
        answer: 'Absolutely. We use bank-level encryption (AES-256) for all data. Your CV is processed securely and never shared with third parties. You can delete your data anytime from your account settings.',
        category: 'Security',
    },
    {
        question: 'What file formats are supported?',
        answer: 'We support PDF, DOCX, DOC, and plain text. For best results, we recommend uploading a PDF as it preserves formatting exactly.',
        category: 'Product',
    },
    {
        question: 'How accurate is the ATS score?',
        answer: 'Our ATS scoring is calibrated against real applicant tracking systems used by Fortune 500 companies. We achieve 95%+ accuracy in predicting whether a CV will pass initial ATS screening.',
        category: 'Product',
    },
    {
        question: 'Can I try it for free?',
        answer: 'Yes! You get 1 free credit every day (when you have 0 credits). Each credit lets you analyze one CV with full insights. No credit card required to sign up.',
        category: 'Pricing',
    },
    {
        question: 'How is this different from other CV tools?',
        answer: 'Unlike basic keyword scanners, we use advanced AI that understands context, industry standards, and recruiter preferences. We don\'t just find problems - we provide actionable fixes you can apply instantly.',
        category: 'Product',
    },
];

/**
 * FAQ Component
 * 
 * Premium accordion-style FAQ section.
 */
export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    return (
        <section
            id="faq"
            ref={containerRef}
            className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2F6BFF]/5 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#3CE0B1]/5 rounded-full blur-3xl -translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F6BFF]/10 text-[#2F6BFF] rounded-full text-sm font-medium mb-4">
                        <HelpCircle size={14} />
                        FAQ
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Frequently Asked <span className="text-gradient-primary">Questions</span>
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-xl mx-auto">
                        Everything you need to know about Super CV.
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.08 }}
                            className="group"
                        >
                            <div className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden card-hover-lift ${openIndex === index
                                ? 'border-[#2F6BFF]/30 shadow-lg shadow-[#2F6BFF]/5'
                                : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                                }`}>
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <div className="flex items-center gap-4 pr-4">
                                        {/* Number */}
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${openIndex === index
                                            ? 'bg-[#2F6BFF] text-white'
                                            : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <span className={`font-semibold transition-colors ${openIndex === index ? 'text-[#2F6BFF]' : 'text-slate-900'
                                            }`}>
                                            {faq.question}
                                        </span>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${openIndex === index
                                            ? 'bg-[#2F6BFF] text-white'
                                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                            }`}
                                    >
                                        {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pl-[4.5rem]">
                                                <p className="text-slate-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="max-w-xl mx-auto mt-12"
                >
                    <div className="bg-gradient-to-r from-[#2F6BFF]/10 to-[#3CE0B1]/10 rounded-2xl p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <MessageCircle size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
                        <p className="text-slate-600 mb-4">
                            Our support team is here to help you 24/7.
                        </p>
                        <a
                            href="https://wa.me/6285121313040"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2F6BFF] font-semibold rounded-xl border border-[#2F6BFF]/20 hover:border-[#2F6BFF] hover:shadow-lg transition-all"
                        >
                            Contact Support
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
