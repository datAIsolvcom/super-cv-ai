"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Link as LinkIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/Loader";

type TabType = "text" | "link" | "general";

export default function AnalyzePage () {
    const [activeTab, setActiveTab] = useState<TabType>("text");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => setIsAnalyzing(false), 8000);
    };

    return(
        <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        
        
        <div className="text-center mb-8 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-4"
          >
            Super CV
          </motion.h1>
          <p className="text-slate-400 text-sm md:text-base">
            Upload your resume and let our AI craft your legacy.
          </p>
        </div>

        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {isAnalyzing ? (
            <Loader />
          ) : (
            <div className="p-6 md:p-10">
              
              
              <div className="mb-8">
                <label 
                  htmlFor="cv-upload" 
                  className={cn(
                    "group relative flex flex-col items-center justify-center w-full transition-all duration-300 cursor-pointer",
                    "border-2 border-dashed border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/50 rounded-2xl",
                    "h-32 md:h-48" 
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <div className="p-4 bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
                    </div>
                    {file ? (
                      <p className="text-sm text-emerald-400 font-medium">{file.name}</p>
                    ) : (
                      <>
                        
                        <p className="hidden md:block text-sm text-slate-400">
                          <span className="font-semibold text-slate-200">Click to upload</span> or drag and drop
                        </p>
                        <p className="hidden md:block text-xs text-slate-500 mt-1">PDF only (MAX. 5MB)</p>
                        
                        
                        <p className="md:hidden text-sm font-semibold text-slate-200">Tap to Select Resume</p>
                      </>
                    )}
                  </div>
                  <input 
                    id="cv-upload" 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  />
                </label>
              </div>

              
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950/50 rounded-xl">
                  {(['text', 'link', 'general'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "relative py-2.5 text-xs md:text-sm font-medium rounded-lg transition-colors z-10",
                        activeTab === tab ? "text-slate-950" : "text-slate-400 hover:text-slate-200"
                      )}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-amber-500 rounded-lg -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="flex items-center justify-center gap-2">
                        {tab === 'text' && <FileText className="w-3 h-3 md:w-4 md:h-4" />}
                        {tab === 'link' && <LinkIcon className="w-3 h-3 md:w-4 md:h-4" />}
                        {tab === 'general' && <Sparkles className="w-3 h-3 md:w-4 md:h-4" />}
                        <span className="capitalize hidden md:inline">{tab === 'text' ? 'Paste Text' : tab}</span>
                        <span className="md:hidden capitalize">{tab === 'text' ? 'Text' : tab}</span>
                      </span>
                    </button>
                  ))}
                </div>

                
                <div className="min-h-[120px]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'text' && (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <textarea 
                          className="w-full h-32 bg-slate-950/30 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600 resize-none"
                          placeholder="Paste the job description here..."
                        />
                      </motion.div>
                    )}

                    {activeTab === 'link' && (
                      <motion.div
                        key="link"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <input 
                          type="url"
                          className="w-full h-12 bg-slate-950/30 border border-slate-800 rounded-xl px-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600"
                          placeholder="https://linkedin.com/jobs/..."
                        />
                      </motion.div>
                    )}

                    {activeTab === 'general' && (
                      <motion.div
                        key="general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center justify-center h-32 text-center text-slate-400 space-y-2"
                      >
                        <Sparkles className="w-6 h-6 text-amber-500/50" />
                        <p className="text-sm">We will analyze your CV against general industry standards.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={!file}
                className={cn(
                  "w-full mt-6 py-4 rounded-xl font-bold tracking-wide transition-all duration-300",
                  file 
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20" 
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                )}
              >
                Analyze My Resume
              </motion.button>
              
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
   