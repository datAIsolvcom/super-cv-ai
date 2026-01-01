"use client";

import { useState } from "react";
import { CvProvider, useCv } from "@/lib/cv-context";
import { UploadSection } from "@/components/core/UploadSection";
import { AnalysisView } from "@/components/core/AnalysisView";
import { EditorLayout } from "@/components/core/EditorLayout";
import { AnimatePresence, motion } from "framer-motion";


function DashboardContent() {
  const { view, setFile } = useCv() as any; 
  
  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col">

       <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px]" />
       </div>

       <div className="relative z-10 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
             
             {view === "UPLOAD" && (
                <motion.div key="upload" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex-1 flex items-center justify-center p-4">
                   <UploadSection />
                </motion.div>
             )}

             {view === "ANALYSIS" && (
                <motion.div key="analysis" initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-50}} className="flex-1 p-4 md:p-10">
                   <AnalysisView />
                </motion.div>
             )}

             {view === "EDITOR" && (
                <motion.div key="editor" initial={{opacity:0}} animate={{opacity:1}} className="flex-1">
                   <EditorLayout />
                </motion.div>
             )}

          </AnimatePresence>
       </div>
    </main>
  );
}

export default function Page() {
    return (

        <CvProvider>
            <DashboardContent />
        </CvProvider>
    )
}