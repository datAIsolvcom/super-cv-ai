"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Link as LinkIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadCard() {
  const [activeTab, setActiveTab] = useState<"text" | "link" | "general">("text");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full glass rounded-3xl p-1"
    >
      <div className="bg-slate-950/50 rounded-[22px] p-6 md:p-8 border border-white/5">
        
   
        <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl mb-8">
          {(["text", "link", "general"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all relative",
                activeTab === tab ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg shadow-sm"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className="relative z-10 capitalize flex items-center gap-2">
                {tab === "text" && <FileText size={16} />}
                {tab === "link" && <LinkIcon size={16} />}
                {tab === "general" && <Sparkles size={16} />}
                {tab}
              </span>
            </button>
          ))}
        </div>


        <div className="grid md:grid-cols-2 gap-8">

          <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/30 rounded-2xl h-64 flex flex-col items-center justify-center transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-black/50">
              <UploadCloud className="text-amber-500 w-8 h-8" />
            </div>
            <p className="text-slate-300 font-medium">Upload Resume (PDF)</p>
            <p className="text-slate-500 text-xs mt-2">Max 5MB</p>
          </div>

          <div className="flex flex-col h-64">
            <label className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">
              Target Job Context
            </label>
            
            <AnimatePresence mode="wait">
              {activeTab === "text" && (
                <motion.textarea
                  key="text"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-amber-500/50 focus:ring-0 resize-none transition-colors"
                  placeholder="Paste the full job description here..."
                />
              )}
              
              {activeTab === "link" && (
                <motion.div
                  key="link"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <input 
                    type="url"
                    placeholder="Paste LinkedIn/Job URL..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-amber-500/50 focus:outline-none transition-colors"
                  />
                  <div className="mt-4 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 text-xs text-amber-200/70">
                    <Sparkles size={12} className="inline mr-1" />
                    Our AI will scrape and parse requirements automatically.
                  </div>
                </motion.div>
              )}

              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-white/5 rounded-xl bg-slate-900/30"
                >
                  <Sparkles size={32} className="text-amber-500 mb-2 opacity-50" />
                  <p className="text-slate-300 text-sm font-medium">General Excellence Audit</p>
                  <p className="text-slate-500 text-xs mt-1">We'll benchmark your CV against Fortune 500 hiring standards.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
              <Sparkles size={18} />
              Analyze Strategy
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}