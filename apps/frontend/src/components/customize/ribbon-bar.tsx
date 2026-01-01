"use client";

import { useCv, TemplateType, DesignSettings } from "@/lib/cv-context"; 
import { 
  Type, ZoomIn, ZoomOut, 
  LayoutTemplate, ChevronDown, CheckCircle2,
  Printer, Ruler, AlignJustify 
} from "lucide-react";
import { useState } from "react";
import { useReactToPrint } from "react-to-print";

export function RibbonBar() {
  const { design, setDesign, printRef, template, setTemplate } = useCv();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);


  const pageStyle = `
    @page {
      size: auto;
      /* Margin Fisik: 20mm di semua sisi (Atas, Kanan, Bawah, Kiri) */
      margin: 10mm !important;
    }

    @media print {
      body {
        /* Pastikan body tidak punya margin tambahan */
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Pastikan elemen editor tidak menambah padding ganda */
      .cv-paper {
        padding: 0 !important;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    contentRef: printRef, 
    documentTitle: "My_CV_Optimized",
    pageStyle: pageStyle,
    onAfterPrint: () => console.log("Printed successfully"),
  });

  
  
  const colors = ['#000000', '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#db2777'];
  const fonts = [
      { key: 'font-sans', label: 'Sans Serif' },
      { key: 'font-serif', label: 'Serif' },
      { key: 'font-mono', label: 'Monospace' }
  ];
  const fontSizes = [
      { key: 'text-xs', label: 'Small' },
      { key: 'text-sm', label: 'Medium' },
      { key: 'text-base', label: 'Large' },
  ];
  const lineHeights = [
      { key: 'leading-tight', label: 'Tight' },
      { key: 'leading-snug', label: 'Normal' },
      { key: 'leading-relaxed', label: 'Loose' },
  ];
  const margins = [
      { key: 'p-6', label: 'Compact' },
      { key: 'p-10', label: 'Standard' },
      { key: 'p-14', label: 'Wide' },
  ];
  const spacings = [
      { key: 'gap-1', label: 'Very Tight' },
      { key: 'gap-2', label: 'Tight' },
      { key: 'gap-4', label: 'Normal' },
      { key: 'gap-6', label: 'Loose' },
  ];
  const templates: {key: TemplateType, label: string, defaults: Partial<DesignSettings>}[] = [
      { key: 'modern', label: 'Modern Clean', defaults: { fontFamily: 'font-sans', pageMargin: 'p-10' } },
      { key: 'classic', label: 'Classic Serif', defaults: { fontFamily: 'font-serif', pageMargin: 'p-12' } },
      { key: 'minimal', label: 'Minimalist', defaults: { fontFamily: 'font-mono', pageMargin: 'p-8' } }
  ];
  const handleTemplateChange = (t: any) => {
      setTemplate(t.key);
      setDesign({ ...design, ...t.defaults }); 
      setShowTemplatePicker(false);
  };

  return (
    <div className="sticky top-4 z-40 w-[900px] mx-auto bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-white/20 p-2 mb-6 flex items-center justify-between gap-2 transition-all">
      <div className="flex items-center gap-1 px-2 border-r border-slate-200">
        <div className="relative">
            <button onClick={() => setShowFontPicker(!showFontPicker)} className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded-lg text-slate-700 text-sm font-medium transition-colors w-40 justify-between">
                <div className="flex items-center gap-2"><Type size={16}/> <span className="capitalize truncate max-w-[80px]">{fonts.find(f => f.key === design.fontFamily)?.label}</span></div>
                <ChevronDown size={12} className="opacity-50"/>
            </button>
            {showFontPicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-64 z-50 grid gap-4">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2">Font Family</div>
                        {fonts.map(f => (
                            <button key={f.key} onClick={() => { setDesign({...design, fontFamily: f.key as any}); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center text-slate-900 ${design.fontFamily === f.key ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'}`}>
                                {f.label} {design.fontFamily === f.key && <CheckCircle2 size={14} className="text-green-500"/>}
                            </button>
                        ))}
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2">Base Size</div>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                             {fontSizes.map(s => (
                                 <button key={s.key} onClick={() => setDesign({...design, fontSize: s.key})} className={`flex-1 py-1 text-xs rounded-md ${design.fontSize === s.key ? 'bg-white shadow text-black font-bold' : 'text-slate-500 hover:text-black'}`}>
                                     {s.label}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={() => setDesign({...design, scale: Math.max(0.5, design.scale - 0.1)})} className="p-1.5 hover:bg-white rounded-md text-slate-500"><ZoomOut size={14}/></button>
            <span className="text-xs w-10 text-center font-mono text-slate-600">{Math.round(design.scale * 100)}%</span>
            <button onClick={() => setDesign({...design, scale: Math.min(1.5, design.scale + 0.1)})} className="p-1.5 hover:bg-white rounded-md text-slate-500"><ZoomIn size={14}/></button>
        </div>
      </div>
      <div className="flex items-center gap-1 px-2 border-r border-slate-200 relative">
         <button onClick={() => setShowColorPicker(!showColorPicker)} className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded-lg text-slate-700 text-sm font-medium">
            <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: design.accentColor }} />
         </button>
         <div className="relative">
             <button onClick={() => setShowLayoutPicker(!showLayoutPicker)} className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded-lg text-slate-700 text-sm font-medium">
                <Ruler size={16}/> Layout
             </button>
             {showLayoutPicker && (
                 <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-64 z-50 space-y-4">
                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Page Margin</label>
                         <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                             {margins.map(m => (
                                 <button key={m.key} onClick={() => setDesign({...design, pageMargin: m.key})} className={`flex-1 py-1 text-xs rounded-md ${design.pageMargin === m.key ? 'bg-white shadow text-black font-bold' : 'text-slate-500 hover:text-black'}`}>
                                     {m.label}
                                 </button>
                             ))}
                         </div>
                     </div>
                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Section Spacing</label>
                         <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                             {spacings.map(s => (
                                 <button key={s.key} onClick={() => setDesign({...design, sectionSpacing: s.key})} className={`flex-1 py-1 text-xs rounded-md ${design.sectionSpacing === s.key ? 'bg-white shadow text-black font-bold' : 'text-slate-500 hover:text-black'}`}>
                                     {s.label}
                                 </button>
                             ))}
                         </div>
                     </div>
                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><AlignJustify size={12}/> Line Spacing</label>
                         <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                             {lineHeights.map(l => (
                                 <button key={l.key} onClick={() => setDesign({...design, lineHeight: l.key})} className={`flex-1 py-1 text-xs rounded-md ${design.lineHeight === l.key ? 'bg-white shadow text-black font-bold' : 'text-slate-500 hover:text-black'}`}>
                                     {l.label}
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
             )}
         </div>
         {showColorPicker && (
             <div className="absolute top-full left-0 mt-2 bg-white p-3 rounded-xl shadow-xl border border-slate-100 grid grid-cols-4 gap-2 z-50">
                 {colors.map(c => (
                     <button key={c} onClick={() => { setDesign({...design, accentColor: c}); setShowColorPicker(false); }} className="w-6 h-6 rounded-full border border-slate-200 hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                 ))}
             </div>
         )}
      </div>
      <div className="flex items-center gap-2 px-2 relative">
         <button onClick={() => setShowTemplatePicker(!showTemplatePicker)} className="hidden md:flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded-lg text-slate-700 text-sm font-medium">
            <LayoutTemplate size={16}/> Templates
         </button>
         {showTemplatePicker && (
             <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-1 w-48 z-50">
                 <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Select Layout</div>
                 {templates.map(t => (
                     <button key={t.key} onClick={() => handleTemplateChange(t)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center text-slate-900 ${template === t.key ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'}`}>
                         {t.label} {template === t.key && <CheckCircle2 size={14} className="text-green-500"/>}
                     </button>
                 ))}
             </div>
         )}
      </div>
      <button onClick={() => handlePrint && handlePrint()} className="ml-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95">
         <Printer size={16}/> Save PDF
      </button>
    </div>
  );
}