"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, ScanSearch, BrainCircuit, FileText, Sparkles } from "lucide-react";

const steps = [
  { text: "Initializing secure environment...", icon: Sparkles },
  { text: "Extracting document structure...", icon: FileText },
  { text: "Analyzing ATS readability keywords...", icon: ScanSearch },
  { text: "Comparing against industry standards...", icon: BrainCircuit },
  { text: "Drafting strategic insights...", icon: CheckCircle2 },
];

export function LoadingView() {
  const [currentStep, setCurrentStep] = useState(0);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center relative w-full max-w-4xl mx-auto px-4">
      
     
      <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
       
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 border border-indigo-500/30 rounded-full"
        />
        <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute inset-0 border border-champagne-500/20 rounded-full"
        />
        
       
        <div className="relative z-10 w-16 h-16 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Loader2 className="animate-spin text-indigo-400" size={32}/>
        </div>
      </div>

     
      <div className="h-16 flex flex-col items-center justify-center text-center space-y-2 mb-8">
         <motion.div
            key={currentStep} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3"
         >
            
            {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon size={20} className="text-champagne-400" />;
            })()}
            
            <span className="text-xl font-serif font-medium text-slate-200">
                {steps[currentStep].text}
            </span>
         </motion.div>
         
         <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
            Processing Data Chunks • Step {currentStep + 1}/{steps.length}
         </p>
      </div>

   
      <div className="w-full max-w-md h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
         <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-champagne-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
         />
        
         <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-shimmer" style={{ backgroundSize: "200% 100%" }}/>
      </div>

    </div>
  );
}