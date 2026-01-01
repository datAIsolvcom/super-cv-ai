"use client";

import { useState } from "react";
import { useCv } from "@/lib/cv-context";
import { UploadCloud, FileText, Link as LinkIcon, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react"; 

export function UploadSection() {
  const { setFile, file, setIsLoading, isLoading } = useCv();
  const [activeTab, setActiveTab] = useState<"text" | "link" | "general">("general");
  const [jobContext, setJobContext] = useState(""); 
  
  const router = useRouter();
 
  const { data: session } = useSession(); 

  const handleAnalyze = async () => {

    if (!file) return alert("Please upload a CV PDF first.");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    if (activeTab === "text") {
        formData.append("jobDescriptionText", jobContext);
    }
    if (activeTab === "link") {
        formData.append("jobDescriptionUrl", jobContext);
    }

    try {
      const res = await fetch("http://localhost:3001/cv/analyze", { 
        method: "POST", 
        body: formData,
        headers: {
            
            ...(session?.user?.id ? { 'userId': session.user.id } : {})
        }
      });
      
      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Upload failed");
      }
      
      const data = await res.json(); 
      
      router.push(`/cv/${data.cvId}/analyze`);
      
    } catch (e: any) {
      console.error(e);
      alert(`Error: ${e.message}`);
      setIsLoading(false); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full glass-panel p-8 rounded-[30px] border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-2xl">
      <div className="text-center mb-10">
         <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4">
           Optimize Your CV with AI
         </h1>
         <p className="text-slate-400 text-lg">Upload your resume and get a ruthless 6-point analysis.</p>
      </div>


      <div className="flex gap-2 bg-slate-950/50 p-1.5 rounded-xl mb-8 border border-white/5">
         {['general', 'text', 'link'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} 
              className={`flex-1 py-3 rounded-lg capitalize font-medium transition-all flex items-center justify-center gap-2 ${activeTab === t ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {t === 'text' && <FileText size={16}/>}
              {t === 'link' && <LinkIcon size={16}/>}
              {t === 'general' && <Sparkles size={16}/>}
              {t === 'text' ? 'Job Description' : t}
            </button>
         ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-[320px]">
  
        <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/20 rounded-2xl flex flex-col items-center justify-center transition-all group overflow-hidden h-full">
           <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-20"/>
           
           {file ? (
             <motion.div initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}} className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 mx-auto border border-emerald-500/20">
                  <FileText size={32}/>
                </div>
                <p className="font-bold text-emerald-100">{file.name}</p>
                <p className="text-emerald-500/60 text-sm">Ready to analyze</p>
             </motion.div>
           ) : (
             <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-xl">
                  <UploadCloud className="text-amber-500" size={32}/>
                </div>
                <p className="text-slate-300 font-medium">Drop PDF / DOCX here</p>
                <p className="text-slate-600 text-xs mt-2">Max 10MB</p>
             </div>
           )}
        </div>

        <div className="flex flex-col h-full gap-4">
           <div className="flex-1 bg-slate-950/30 rounded-2xl p-4 border border-white/5 relative">
              {activeTab === 'general' ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-sm text-center p-6">
                    <Sparkles className="mb-3 text-amber-500/30" size={40}/> 
                    <p>We will check for general format, ATS readability, and impact verbs.</p>
                 </div>
              ) : (
                 <textarea 
                   className="w-full h-full bg-transparent border-none outline-none text-slate-200 text-sm resize-none placeholder:text-slate-600"
                   placeholder={activeTab === 'link' ? "Paste LinkedIn Job URL..." : "Paste the Job Description text here..."}
                   onChange={(e) => setJobContext(e.target.value)}
                 />
              )}
           </div>
           
           <button onClick={handleAnalyze} disabled={isLoading || !file} 
             className="h-16 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:-translate-y-1">
              {isLoading ? <Loader2 className="animate-spin"/> : <Sparkles size={20}/>}
              {isLoading ? "Starting Analysis..." : "Analyze CV Strategy"}
           </button>
        </div>
      </div>
    </div>
  );
}