"use client";

import { useState, useRef } from "react";
import { useCv } from "@/lib/cv-context";
import { UploadCloud, FileText, Link as LinkIcon, Sparkles, Loader2, X, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react"; 
import { cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/UpgradeModal";

export function UploadSection() {
  const { setFile, file, setIsLoading, isLoading } = useCv();
  const [activeTab, setActiveTab] = useState<"general" | "text" | "link">("general");
  const [jobContext, setJobContext] = useState(""); 
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const router = useRouter();
  const { data: session } = useSession(); 

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    if (activeTab === "text") formData.append("jobDescriptionText", jobContext);
    if (activeTab === "link") formData.append("jobDescriptionUrl", jobContext);

    try {
      const res = await fetch("http://localhost:3001/cv/analyze", { 
        method: "POST", 
        body: formData,
        headers: { ...(session?.user?.id ? { 'userId': session.user.id } : {}) }
      });
      
      const data = await res.json(); 

      if (!res.ok) {
          
          if (res.status === 400 || res.status === 403) {
            setShowUpgradeModal(true); 
          }
          
          throw new Error(data.message || "Upload failed");
      }
      
      router.push(`/cv/${data.cvId}/analyze`);
      
    } catch (e: any) {
      console.error("Analysis Error:", e.message);
      setIsLoading(false); 
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />

      <div className="glass-panel rounded-[32px] p-2 md:p-3 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"/>

        <div className="bg-slate-950/80 rounded-[24px] p-6 md:p-10 border border-white/5 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-slate-900/80 p-1.5 rounded-full border border-white/10 shadow-inner">
               {[
                 { id: 'general', icon: Sparkles, label: 'General Audit' },
                 { id: 'text', icon: FileText, label: 'Job Desc' },
                 { id: 'link', icon: LinkIcon, label: 'LinkedIn URL' }
               ].map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={cn(
                     "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                     activeTab === tab.id 
                       ? "bg-white text-slate-950 shadow-lg scale-105" 
                       : "text-slate-400 hover:text-white hover:bg-white/5"
                   )}
                 >
                   <tab.icon size={16} className={activeTab === tab.id ? "text-indigo-600" : ""}/>
                   <span className="hidden md:inline">{tab.label}</span>
                 </button>
               ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 h-auto md:h-[340px]">
            <div 
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center overflow-hidden group/zone",
                isDragging 
                  ? "border-champagne-400 bg-champagne-500/10 scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.2)]" 
                  : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/30",
                file ? "border-emerald-500/50 bg-emerald-500/5 border-solid" : ""
              )}
            >
               <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden"/>
               
               <AnimatePresence mode="wait">
                 {file ? (
                   <motion.div 
                     key="file-uploaded"
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
                     className="text-center p-6"
                   >
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl mb-4 relative">
                        <FileCheck className="text-white" size={40}/>
                        <button onClick={(e) => {e.stopPropagation(); setFile(null)}} className="absolute -top-2 -right-2 bg-slate-900 text-slate-400 p-1.5 rounded-full border border-white/10 hover:text-red-400 hover:border-red-500/50 transition-colors">
                          <X size={14}/>
                        </button>
                      </div>
                      <h3 className="text-white font-bold text-lg truncate max-w-[200px] mx-auto">{file.name}</h3>
                      <p className="text-emerald-400 text-sm mt-1 font-medium">Ready for Analysis</p>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="upload-prompt"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="text-center p-6"
                   >
                      <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-6 group-hover/zone:scale-110 transition-transform duration-300 border border-white/5">
                        <UploadCloud className={cn("transition-colors duration-300", isDragging ? "text-champagne-400" : "text-slate-400 group-hover/zone:text-white")} size={32}/>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">Drop Resume Here</h3>
                      <p className="text-slate-400 text-sm px-4">Support PDF & DOCX. Max 10MB.</p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4">
               <div className="flex-1 bg-slate-900/50 border border-white/5 rounded-2xl p-1 relative overflow-hidden group/input focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                  {activeTab === 'general' ? (
                     <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                        <Sparkles className="text-indigo-400 mb-4" size={48} strokeWidth={1}/>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          We will perform a <strong className="text-white">Full Spectrum Audit</strong> based on 2025 Industry Standards.
                        </p>
                     </div>
                  ) : (
                     <textarea 
                       className="w-full h-full bg-transparent border-none outline-none text-slate-200 p-5 text-sm resize-none placeholder:text-slate-600 custom-scrollbar"
                       placeholder={activeTab === 'link' ? "Paste LinkedIn Job Post URL here..." : "Paste the full Job Description text here..."}
                       onChange={(e) => setJobContext(e.target.value)}
                       autoFocus
                     />
                  )}
               </div>

               <button 
                 onClick={handleAnalyze} 
                 disabled={isLoading || !file} 
                 className="h-16 relative overflow-hidden rounded-xl bg-gradient-to-r from-white to-slate-200 text-slate-950 font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group/btn"
               >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin"/> : <Sparkles size={20} className="text-indigo-600"/>}
                    {isLoading ? "Analyzing..." : "Initialize Analysis"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"/>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}