"use client";

import { UploadSection } from "@/components/core/UploadSection";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      
  
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-champagne-500/5 rounded-full blur-[100px] -z-10" />

      
      <main className="w-full max-w-5xl z-10 flex flex-col items-center gap-10">
        
       
        <div className="text-center space-y-6 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-white mb-4">
              Architect Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-200 to-champagne-500">
                Career Legacy.
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 leading-relaxed"
          >
            Stop guessing. Start dominating. <br className="hidden md:block"/>
            The world's most advanced AI resume strategist, calibrated for ambitious professionals.
          </motion.p>
        </div>

      
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full"
        >
          <UploadSection />
        </motion.div>

        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-4 text-xs text-slate-500 uppercase tracking-widest font-semibold mt-8"
        >
          <span>ATS Optimized</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"/>
          <span>Recruiter Approved</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"/>
          <span>AI Powered</span>
        </motion.div>

      </main>
    </div>
  );
}