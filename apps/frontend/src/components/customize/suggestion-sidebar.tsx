"use client";

import { useCv, CvData } from "@/lib/cv-context";
import { Sparkles, Check, X } from "lucide-react";
import { useState } from "react"; 

interface SuggestionSidebarProps {
  optimizedData: any;
  analysisData: any;
  onClose: () => void;
}

export function SuggestionSidebar({ optimizedData, analysisData, onClose }: SuggestionSidebarProps) {
  const { applySuggestion, cvData } = useCv();


  const handleApply = (section: keyof CvData, content: any) => {
    applySuggestion(section, content);
  };

  return (
    <div className="bg-slate-900 border-r border-white/10 w-full h-full p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Sparkles className="text-amber-500" size={18} /> AI Suggestions
        </h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18}/></button>
      </div>

      <div className="space-y-4">
        
  
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs text-amber-200/80 mb-4">
          AI has rewritten your CV based on the analysis. Review and click <b>Apply</b> to update your editor.
        </div>

        {optimizedData.professional_summary !== cvData?.professional_summary && (
          <SuggestionCard 
            title="Professional Summary"
            oldVal={cvData?.professional_summary}
            newVal={optimizedData.professional_summary}
            
            onApply={() => handleApply('professional_summary', optimizedData.professional_summary)}
          />
        )}

  
        <div className="bg-slate-950 border border-white/5 rounded-xl p-4">
             <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-200 text-sm">Skills Enhancement</h4>
                <button 
                   
                    onClick={() => handleApply('hard_skills', optimizedData.hard_skills)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1 transition-all"
                >
                    <Check size={12}/> Apply All
                </button>
             </div>
             <p className="text-xs text-slate-400 mb-3">AI suggests adding these missing skills found in your analysis:</p>
             <div className="flex flex-wrap gap-2">
                 {optimizedData.hard_skills
                    .filter((s: string) => !cvData?.hard_skills.includes(s))
                    .map((skill: string, i: number) => (
                     <span key={i} className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-1 rounded border border-amber-500/30">
                        + {skill}
                     </span>
                 ))}
             </div>
        </div>


        <div className="bg-slate-950 border border-white/5 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-200 text-sm">Work Experience</h4>
                 <button 
                    
                    onClick={() => handleApply('work_experience', optimizedData.work_experience)}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1 transition-all"
                >
                    <Check size={12}/> Update All Bullets
                </button>
            </div>
            <p className="text-xs text-slate-400">
                Rewritten with Google XYZ formula & quantified metrics.
            </p>
        </div>

      </div>
    </div>
  );
}


function SuggestionCard({ title, oldVal, newVal, onApply }: any) {
    const [applied, setApplied] = useState(false);

    return (
        <div className="bg-slate-950 border border-white/5 rounded-xl p-4 group">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-200 text-sm">{title}</h4>
                <button 
                    onClick={() => { onApply(); setApplied(true); }}
                    disabled={applied}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
                        applied ? "bg-slate-800 text-slate-500" : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                >
                    {applied ? "Applied" : <><Check size={12}/> Apply</>}
                </button>
            </div>

            <div className="mb-2">
                <div className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold mb-1">AI Suggestion</div>
                <div className="text-xs text-slate-300 bg-emerald-950/20 p-2 rounded border border-emerald-500/20 line-clamp-4">
                    {newVal}
                </div>
            </div>

            <div className="opacity-60">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Original</div>
                 <div className="text-xs text-slate-500 line-clamp-2">
                    {oldVal}
                </div>
            </div>
        </div>
    )
}