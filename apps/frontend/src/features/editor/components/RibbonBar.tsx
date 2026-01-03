"use client";

import { RefObject } from "react";
import { useEditorStore } from "../stores/useEditorStore";
import type { DesignSettings, TemplateType } from "../types/editor.types";
import {
  Type,
  LayoutTemplate, ChevronDown, CheckCircle2,
  Printer, Ruler, AlignJustify
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { cn } from "@/lib/utils";

interface RibbonBarProps {
  printRef: RefObject<HTMLDivElement | null>;
}

export function RibbonBar({ printRef }: RibbonBarProps) {
  const design = useEditorStore((s) => s.design);
  const setDesign = useEditorStore((s) => s.setDesign);
  const template = useEditorStore((s) => s.template);
  const setTemplate = useEditorStore((s) => s.setTemplate);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const toggleDropdown = (name: string) => setActiveDropdown(activeDropdown === name ? null : name);

  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageStyle = `
    @page {
      size: auto;
      margin: 10mm !important;
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
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

  const colors = ["#000000", "#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed", "#db2777"];
  const fonts = [{ key: "font-sans", label: "Sans Serif" }, { key: "font-serif", label: "Serif" }, { key: "font-mono", label: "Monospace" }];
  const fontSizes = [{ key: "text-xs", label: "Small" }, { key: "text-sm", label: "Medium" }, { key: "text-base", label: "Large" }];
  const lineHeights = [{ key: "leading-tight", label: "Tight" }, { key: "leading-snug", label: "Normal" }, { key: "leading-relaxed", label: "Loose" }];
  const margins = [{ key: "p-6", label: "Compact" }, { key: "p-10", label: "Standard" }, { key: "p-14", label: "Wide" }];
  const spacings = [{ key: "gap-1", label: "Very Tight" }, { key: "gap-2", label: "Tight" }, { key: "gap-4", label: "Normal" }, { key: "gap-6", label: "Loose" }];
  const templates: { key: TemplateType; label: string; defaults: Partial<DesignSettings> }[] = [
    { key: "modern", label: "Modern", defaults: { fontFamily: "font-sans", pageMargin: "p-10" } },
    { key: "classic", label: "Classic", defaults: { fontFamily: "font-serif", pageMargin: "p-12" } },
    { key: "minimal", label: "Minimal", defaults: { fontFamily: "font-mono", pageMargin: "p-8" } },
  ];

  const handleTemplateChange = (t: (typeof templates)[0]) => {
    setTemplate(t.key);
    setDesign(t.defaults);
    setActiveDropdown(null);
  };

  const dropdownBase = "absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-[100] grid gap-3 animate-in fade-in zoom-in-95 duration-200 w-56";

  return (
    <>
      {activeDropdown && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setActiveDropdown(null)} />}

      <div ref={barRef} className="sticky top-2 z-50 w-[95%] max-w-5xl mx-auto bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl border border-white/20 p-2 mb-6 flex flex-wrap items-center justify-center md:justify-between gap-3 transition-all">

        <div className="flex items-center gap-1 px-1 md:px-2 border-r border-slate-200 shrink-0 relative">
          <button onClick={() => toggleDropdown("font")} className={`flex items-center gap-2 px-2 py-2 rounded-lg text-slate-700 text-sm font-medium transition-colors ${activeDropdown === "font" ? "bg-slate-100" : "hover:bg-slate-100"}`}>
            <Type size={18} />
            <span className="hidden md:inline truncate max-w-[60px]">{fonts.find((f) => f.key === design.fontFamily)?.label}</span>
            <ChevronDown size={12} className="opacity-50" />
          </button>

          {activeDropdown === "font" && (
            <div className={cn(dropdownBase, "left-0")}>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Font Family</div>
                {fonts.map((f) => (
                  <button key={f.key} onClick={() => setDesign({ fontFamily: f.key as DesignSettings["fontFamily"] })} className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex justify-between items-center text-slate-900 ${design.fontFamily === f.key ? "bg-slate-100 font-bold" : "hover:bg-slate-50"}`}>
                    {f.label} {design.fontFamily === f.key && <CheckCircle2 size={12} className="text-green-500" />}
                  </button>
                ))}
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Size</div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  {fontSizes.map((s) => (
                    <button key={s.key} onClick={() => setDesign({ fontSize: s.key })} className={`flex-1 py-1 text-xs rounded-md ${design.fontSize === s.key ? "bg-white shadow text-black font-bold" : "text-slate-500 hover:text-black"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>


        <div className="flex items-center gap-1 px-1 md:px-2 border-r border-slate-200 relative shrink-0">
          <div className="relative">
            <button onClick={() => toggleDropdown("color")} className="flex items-center gap-2 hover:bg-slate-100 px-2 py-2 rounded-lg text-slate-700 text-sm font-medium">
              <div className="w-5 h-5 rounded-full border border-slate-300 shadow-sm ring-2 ring-white" style={{ backgroundColor: design.accentColor }} />
            </button>

            {activeDropdown === "color" && (
              <div className={cn(dropdownBase, "left-1/2 -translate-x-1/2 w-48 grid-cols-4")}>
                {colors.map((c) => (
                  <button key={c} onClick={() => { setDesign({ accentColor: c }); setActiveDropdown(null); }} className="w-8 h-8 rounded-full border border-slate-200 hover:scale-110 transition-transform shadow-sm mx-auto" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => toggleDropdown("layout")} className={`flex items-center gap-2 px-2 py-2 rounded-lg text-slate-700 text-sm font-medium transition-colors ${activeDropdown === "layout" ? "bg-slate-100" : "hover:bg-slate-100"}`}>
              <Ruler size={18} /> <span className="hidden md:inline">Layout</span>
            </button>

            {activeDropdown === "layout" && (
              <div className={cn(dropdownBase, "left-1/2 -translate-x-1/2 w-64")}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Margin</label>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    {margins.map((m) => (
                      <button key={m.key} onClick={() => setDesign({ pageMargin: m.key })} className={`flex-1 py-1.5 text-xs rounded-md transition-all ${design.pageMargin === m.key ? "bg-white shadow text-black font-bold" : "text-slate-500 hover:text-black"}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Spacing</label>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    {spacings.map((s) => (
                      <button key={s.key} onClick={() => setDesign({ sectionSpacing: s.key })} className={`flex-1 py-1.5 text-xs rounded-md transition-all ${design.sectionSpacing === s.key ? "bg-white shadow text-black font-bold" : "text-slate-500 hover:text-black"}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block flex items-center gap-2">
                    <AlignJustify size={10} /> Line Height
                  </label>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    {lineHeights.map((l) => (
                      <button key={l.key} onClick={() => setDesign({ lineHeight: l.key })} className={`flex-1 py-1.5 text-xs rounded-md transition-all ${design.lineHeight === l.key ? "bg-white shadow text-black font-bold" : "text-slate-500 hover:text-black"}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        <div className="relative shrink-0">
          <button onClick={() => toggleDropdown("template")} className={`flex items-center gap-2 px-2 py-2 rounded-lg text-slate-700 text-sm font-medium transition-colors ${activeDropdown === "template" ? "bg-slate-100" : "hover:bg-slate-100"}`}>
            <LayoutTemplate size={18} /> <span className="hidden md:inline">Templates</span>
          </button>

          {activeDropdown === "template" && (
            <div className={cn(dropdownBase, "right-0 w-48")}>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Select Template</div>
              {templates.map((t) => (
                <button key={t.key} onClick={() => handleTemplateChange(t)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center text-slate-900 ${template === t.key ? "bg-slate-100 font-bold" : "hover:bg-slate-50"}`}>
                  {t.label} {template === t.key && <CheckCircle2 size={12} className="text-green-500" />}
                </button>
              ))}
            </div>
          )}
        </div>


        <button onClick={() => handlePrint && handlePrint()} className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-95 shrink-0 md:ml-auto">
          <Printer size={18} /> <span className="hidden md:inline">Save PDF</span>
        </button>
      </div>
    </>
  );
}