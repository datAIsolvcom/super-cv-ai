import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 border border-[#2F6BFF]/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#2F6BFF]/20">
                                <Lock size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Authentication Required</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                You must be logged in to analyze your CV. Sign in or create an account to unlock full analysis features.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/login?callbackUrl=/app"
                                    className="w-full py-3.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg flex items-center justify-center gap-2"
                                >
                                    <LogIn size={20} />
                                    Sign In
                                </Link>
                                <Link
                                    href="/register?callbackUrl=/app"
                                    className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={20} />
                                    Create Account
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="w-full py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium transition-colors mt-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
