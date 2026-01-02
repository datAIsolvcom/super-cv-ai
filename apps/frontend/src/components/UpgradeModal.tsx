import { motion, AnimatePresence } from "framer-motion";
import { Crown, X } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-slate-900 border border-champagne-500/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-champagne-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-champagne-500/20">
                <Crown size={40} className="text-white" fill="currentColor"/>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Credits Exhausted</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Upgrade to <span className="text-champagne-400 font-bold">Pro</span> to unlock unlimited AI analysis.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/pricing'} 
                  className="w-full py-3.5 bg-gradient-to-r from-champagne-500 to-orange-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
                >
                  Upgrade Now ($9/mo)
                </button>
                <button 
                  onClick={onClose} 
                  className="w-full py-3.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}