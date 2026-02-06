"use client";

import { RefObject, Dispatch, SetStateAction } from "react";
import { useEditorStore } from "../stores/useEditorStore";
import type { DesignSettings, TemplateType } from "../types/editor.types";
import {
  Type, LayoutTemplate, ChevronDown, CheckCircle2,
  Ruler, AlignJustify, Palette, Eye, Pencil, FileDown, Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";


interface RibbonBarProps {
  printRef: RefObject<HTMLDivElement | null>;
  isPreviewMode: boolean;
  setIsPreviewMode: Dispatch<SetStateAction<boolean>>;
}

export function RibbonBar({ printRef, isPreviewMode, setIsPreviewMode }: RibbonBarProps) {
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

  const [showPrintHelp, setShowPrintHelp] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Detect mobile device
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      // Check for mobile using user agent and screen width
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Print styles for clean PDF output - enhanced for mobile
  const pageStyle = `
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    @media print {
      html, body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        background: white !important;
        color: black !important;
      }
      /* Reset all transforms - CRITICAL for mobile blank PDF fix */
      * {
        transform: none !important;
        -webkit-transform: none !important;
      }
      /* Hide mobile navigation */
      .mobile-tab-bar,
      .md\\:hidden.fixed.bottom-0 {
        display: none !important;
      }
      /* Reset scaled containers */
      .origin-top-left {
        transform: none !important;
        -webkit-transform: none !important;
      }
      /* Ensure print content is full size */
      [data-print-content] {
        width: 210mm !important;
        min-height: 297mm !important;
        transform: none !important;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "My_CV",
    pageStyle: pageStyle,
    onBeforePrint: async () => {
      // Force the print ref to be visible at full size before printing
      if (printRef.current) {
        printRef.current.setAttribute('data-print-content', 'true');
      }
      return Promise.resolve();
    },
    onAfterPrint: () => {
      // Clean up after printing
      if (printRef.current) {
        printRef.current.removeAttribute('data-print-content');
      }
    },
  });

  // Mobile PDF generation using html2canvas + jsPDF directly
  // Uses an iframe with desktop viewport to force desktop CSS media queries
  const generateMobilePdf = async () => {
    if (!printRef.current) return;

    setIsGeneratingPdf(true);
    setShowPrintHelp(false);

    try {
      // Dynamically import html2canvas and jsPDF
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = printRef.current;

      // Create a hidden iframe with desktop-sized viewport
      // This forces CSS media queries to evaluate as desktop
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 794px;
        height: 1123px;
        border: none;
        visibility: hidden;
      `;
      document.body.appendChild(iframe);

      // Wait for iframe to be ready
      await new Promise(resolve => {
        iframe.onload = resolve;
        // Set a blank src to trigger load
        iframe.srcdoc = '<!DOCTYPE html><html><head></head><body></body></html>';
      });

      const iframeDoc = iframe.contentDocument;
      const iframeWin = iframe.contentWindow;

      if (!iframeDoc || !iframeWin) {
        throw new Error('Failed to create iframe');
      }

      // Copy all stylesheets to iframe
      const styleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
      styleSheets.forEach(sheet => {
        const clonedSheet = sheet.cloneNode(true);
        iframeDoc.head.appendChild(clonedSheet);
      });

      // Also copy any inline styles from the main document head
      const mainStyles = document.querySelectorAll('head style');
      mainStyles.forEach(style => {
        const clonedStyle = style.cloneNode(true);
        iframeDoc.head.appendChild(clonedStyle);
      });

      // Clone the CV element into the iframe body
      const clone = element.cloneNode(true) as HTMLElement;

      // Set proper dimensions on the clone
      clone.style.cssText = `
        width: 794px !important;
        min-height: auto !important;
        transform: none !important;
        position: relative !important;
        background: white !important;
      `;

      // Remove UI elements from clone
      clone.querySelectorAll('button').forEach(btn => btn.remove());
      clone.querySelectorAll('[class*="opacity-0"]').forEach(el => el.remove());
      clone.querySelectorAll('[class*="group-hover"]').forEach(el => el.remove());
      clone.querySelectorAll('[draggable="true"]').forEach(el => {
        (el as HTMLElement).removeAttribute('draggable');
      });

      // Set body styles
      iframeDoc.body.style.cssText = `
        margin: 0;
        padding: 0;
        width: 794px;
        background: white;
      `;

      iframeDoc.body.appendChild(clone);

      // Force a reflow to apply styles
      void clone.offsetHeight;

      // Wait for styles to fully apply and fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get dimensions
      const captureWidth = clone.scrollWidth;
      const captureHeight = clone.scrollHeight;

      // Capture the clone from within the iframe
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: captureWidth,
        height: captureHeight,
        windowWidth: 794,
        windowHeight: 1123,
      });

      // Remove the iframe
      document.body.removeChild(iframe);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      // Calculate the scale ratio to fit the canvas width to A4
      const ratio = pdfWidth / canvas.width;
      const scaledCanvasHeight = canvas.height * ratio;

      // If content fits on one page
      if (scaledCanvasHeight <= pdfHeight) {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledCanvasHeight);
      } else {
        // Smart multi-page: find section boundaries to avoid orphaned headers
        // Find all section headers in the clone to detect good break points
        const sectionHeaders = clone.querySelectorAll('h2');
        const sectionPositions: number[] = [];

        sectionHeaders.forEach((header) => {
          const rect = header.getBoundingClientRect();
          const cloneRect = clone.getBoundingClientRect();
          // Get position relative to clone, then multiply by scale (2)
          const relativeTop = (rect.top - cloneRect.top) * 2;
          sectionPositions.push(relativeTop);
        });

        const pixelsPerPage = pdfHeight / ratio;
        const pageBreaks: number[] = [0]; // Start positions for each page

        let currentPos = pixelsPerPage;
        while (currentPos < canvas.height) {
          // Look for a section header that starts near the page break
          // If a header is in the last 15% of the page, move break to before the header
          const breakZoneStart = currentPos - (pixelsPerPage * 0.15);

          let adjustedBreak = currentPos;

          for (const headerPos of sectionPositions) {
            // If a header would appear in the "danger zone" at bottom of page
            if (headerPos > breakZoneStart && headerPos < currentPos) {
              // Move page break to just before this header (with small margin)
              adjustedBreak = headerPos - 20; // 20px margin above header
              break;
            }
          }

          pageBreaks.push(adjustedBreak);
          currentPos = adjustedBreak + pixelsPerPage;
        }

        // Add final position
        pageBreaks.push(canvas.height);

        // Generate pages based on calculated break points
        for (let page = 0; page < pageBreaks.length - 1; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          const sourceY = pageBreaks[page];
          const sourceHeight = pageBreaks[page + 1] - sourceY;

          // Create temporary canvas for this page
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.ceil(sourceHeight);
          const ctx = pageCanvas.getContext('2d');

          if (ctx) {
            // Fill with white background first
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

            ctx.drawImage(
              canvas,
              0, sourceY, canvas.width, sourceHeight,
              0, 0, canvas.width, sourceHeight
            );

            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            const thisPageHeight = sourceHeight * ratio;
            pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, thisPageHeight);
          }
        }
      }

      // Save the PDF
      pdf.save('My_CV.pdf');

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const onSavePdfClick = () => {
    if (isMobile) {
      // On mobile, show a simpler modal and generate PDF directly
      generateMobilePdf();
    } else {
      // On desktop, show print dialog instructions
      setShowPrintHelp(true);
    }
  };

  const onConfirmPrint = () => {
    setShowPrintHelp(false);
    if (isMobile) {
      generateMobilePdf();
    } else {
      handlePrint && handlePrint();
    }
  };

  const colors = ["#000000", "#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed", "#db2777", "#0891b2"];
  const fonts = [{ key: "font-sans", label: "Sans Serif" }, { key: "font-serif", label: "Serif" }, { key: "font-mono", label: "Mono" }];
  const fontSizes = [{ key: "text-xs", label: "S" }, { key: "text-sm", label: "M" }, { key: "text-base", label: "L" }];
  const lineHeights = [{ key: "leading-tight", label: "Tight" }, { key: "leading-snug", label: "Normal" }, { key: "leading-relaxed", label: "Loose" }];
  const margins = [{ key: "p-6", label: "Compact" }, { key: "p-10", label: "Standard" }, { key: "p-14", label: "Wide" }];
  const spacings = [{ key: "gap-1", label: "Tight" }, { key: "gap-2", label: "Normal" }, { key: "gap-4", label: "Relaxed" }, { key: "gap-6", label: "Loose" }];
  const templates: { key: TemplateType; label: string; description: string; icon: string; defaults: Partial<DesignSettings> }[] = [
    { key: "modern", label: "Modern", description: "Clean & contemporary", icon: "✨", defaults: { fontFamily: "font-sans", pageMargin: "p-10", accentColor: "#2563eb" } },
    { key: "classic", label: "Classic ATS", description: "ATS-optimized format", icon: "📄", defaults: { fontFamily: "font-serif", pageMargin: "p-12", accentColor: "#000000" } },
    { key: "minimal", label: "Minimal", description: "Simple & elegant", icon: "🎯", defaults: { fontFamily: "font-sans", pageMargin: "p-8", accentColor: "#1e293b" } },
  ];

  const handleTemplateChange = (t: (typeof templates)[0]) => {
    setTemplate(t.key);
    setDesign(t.defaults);
    setActiveDropdown(null);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.95 }
  };

  return (
    <>
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={barRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-2 z-50 w-[95%] max-w-5xl mx-auto print:hidden ribbon-bar"
      >
        <div className="relative glass-panel rounded-2xl p-2 flex flex-wrap items-center justify-center md:justify-between gap-2 shadow-xl">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#2F6BFF]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-indigo-400/10 rounded-full blur-3xl" />
          </div>

          <div className="flex items-center gap-1 relative z-10">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDropdown("font")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeDropdown === "font"
                    ? "bg-[#2F6BFF]/20 text-[#2F6BFF] dark:text-[#3CE0B1] ring-1 ring-[#2F6BFF]/30"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                )}
              >
                <Type size={16} />
                <span className="hidden md:inline">{fonts.find((f) => f.key === design.fontFamily)?.label}</span>
                <ChevronDown size={12} className={cn("transition-transform", activeDropdown === "font" && "rotate-180")} />
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "font" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-black/30 p-3 z-[100] w-56 backdrop-blur-none"
                  >
                    <div className="mb-3">
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Font Family</div>
                      <div className="space-y-1">
                        {fonts.map((f) => (
                          <button
                            key={f.key}
                            onClick={() => setDesign({ fontFamily: f.key as DesignSettings["fontFamily"] })}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors",
                              design.fontFamily === f.key
                                ? "bg-[#2F6BFF]/20 text-[#2F6BFF] dark:text-[#3CE0B1] font-semibold"
                                : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                            )}
                          >
                            {f.label}
                            {design.fontFamily === f.key && <CheckCircle2 size={14} className="text-[#2F6BFF]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Size</div>
                      <div className="flex gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-lg">
                        {fontSizes.map((s) => (
                          <button
                            key={s.key}
                            onClick={() => setDesign({ fontSize: s.key })}
                            className={cn(
                              "flex-1 py-1.5 text-xs rounded-md font-medium transition-all",
                              design.fontSize === s.key
                                ? "bg-white dark:bg-slate-800 shadow text-[#2F6BFF] dark:text-[#3CE0B1]"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block" />

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleDropdown("color")}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full shadow-md ring-2 ring-white dark:ring-slate-800 transition-transform hover:scale-110"
                  style={{ backgroundColor: design.accentColor }}
                />
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "color" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-black/30 p-4 z-[100] w-48"
                  >
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-2">
                      <Palette size={12} /> Accent Color
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map((c) => (
                        <motion.button
                          key={c}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setDesign({ accentColor: c }); setActiveDropdown(null); }}
                          className={cn(
                            "w-8 h-8 rounded-full shadow-md transition-all",
                            design.accentColor === c && "ring-2 ring-[#2F6BFF] ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDropdown("layout")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeDropdown === "layout"
                    ? "bg-[#2F6BFF]/20 text-[#2F6BFF] dark:text-[#3CE0B1] ring-1 ring-[#2F6BFF]/30"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                )}
              >
                <Ruler size={16} />
                <span className="hidden md:inline">Layout</span>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "layout" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-black/30 p-3 z-[100] w-[220px]"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Margin</label>
                        <div className="grid grid-cols-3 gap-1">
                          {margins.map((m) => (
                            <button key={m.key} onClick={() => setDesign({ pageMargin: m.key })} className={cn("py-1.5 text-[10px] rounded-md font-medium transition-all", design.pageMargin === m.key ? "bg-[#2F6BFF] text-white shadow" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200")}>
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Spacing</label>
                        <div className="grid grid-cols-4 gap-1">
                          {spacings.map((s) => (
                            <button key={s.key} onClick={() => setDesign({ sectionSpacing: s.key })} className={cn("py-1.5 text-[10px] rounded-md font-medium transition-all", design.sectionSpacing === s.key ? "bg-[#2F6BFF] text-white shadow" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200")}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Line Height</label>
                        <div className="grid grid-cols-3 gap-1">
                          {lineHeights.map((l) => (
                            <button key={l.key} onClick={() => setDesign({ lineHeight: l.key })} className={cn("py-1.5 text-[10px] rounded-md font-medium transition-all", design.lineHeight === l.key ? "bg-[#2F6BFF] text-white shadow" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200")}>
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1 relative z-10">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDropdown("template")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeDropdown === "template"
                    ? "bg-[#2F6BFF]/20 text-[#2F6BFF] dark:text-[#3CE0B1] ring-1 ring-[#2F6BFF]/30"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                )}
              >
                <LayoutTemplate size={16} />
                <span className="hidden md:inline">Templates</span>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "template" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-black/30 p-3 z-[100] w-64"
                  >
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-2">
                      <LayoutTemplate size={12} />
                      Choose Template
                    </div>
                    <div className="space-y-2">
                      {templates.map((t) => (
                        <motion.button
                          key={t.key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTemplateChange(t)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all border-2",
                            template === t.key
                              ? "bg-[#2F6BFF]/10 dark:bg-[#2F6BFF]/10 border-[#2F6BFF] dark:border-[#2F6BFF]/50"
                              : "border-transparent hover:bg-slate-50 dark:hover:bg-white/5"
                          )}
                        >
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-lg">
                            {t.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              {t.label}
                              {template === t.key && <CheckCircle2 size={12} className="text-[#2F6BFF]" />}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{t.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Edit/Preview Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ml-2",
                isPreviewMode
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
              )}
              title={isPreviewMode ? "Switch to Edit mode" : "Switch to Preview mode"}
            >
              {isPreviewMode ? <Pencil size={16} /> : <Eye size={16} />}
              <span className="hidden md:inline">{isPreviewMode ? "Edit" : "Preview"}</span>
            </motion.button>

            {/* Save PDF Button */}
            <motion.button
              whileHover={{ scale: isGeneratingPdf ? 1 : 1.03, y: isGeneratingPdf ? 0 : -1 }}
              whileTap={{ scale: isGeneratingPdf ? 1 : 0.97 }}
              onClick={onSavePdfClick}
              disabled={isGeneratingPdf}
              className={cn(
                "bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] hover:from-[#1E55F0] hover:to-[#3CE0B1] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#2F6BFF]/25 transition-all ml-2",
                isGeneratingPdf && "opacity-75 cursor-not-allowed"
              )}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="hidden md:inline">Generating...</span>
                </>
              ) : (
                <>
                  <FileDown size={16} />
                  <span className="hidden md:inline">Save PDF</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Print Instructions Modal */}
      <AnimatePresence>
        {showPrintHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowPrintHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                📄 Save as PDF
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-6">
                <p className="font-medium text-slate-800 dark:text-slate-100">For best results, configure these settings:</p>
                <div className="bg-[#2F6BFF]/10 dark:bg-[#2F6BFF]/20 border border-[#2F6BFF]/20 dark:border-[#2F6BFF]/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[#2F6BFF] font-bold">1.</span>
                    <span>Destination: <strong>&quot;Save as PDF&quot;</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#2F6BFF] font-bold">2.</span>
                    <span>Margins: <strong>&quot;None&quot;</strong> or <strong>&quot;Minimum&quot;</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#2F6BFF] font-bold">3.</span>
                    <span>Headers & Footers: <strong>Uncheck ☐</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#2F6BFF] font-bold">4.</span>
                    <span>Background graphics: <strong>Check ☑</strong></span>
                  </div>
                </div>
                {/* Mobile Safari specific tip */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 md:hidden">
                  <p className="text-amber-800 dark:text-amber-200 text-xs">
                    <strong>📱 Mobile Safari:</strong> If you see &quot;blocked from automatically printing&quot;, tap <strong>&quot;Allow&quot;</strong> to enable PDF saving.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPrintHelp(false)}
                  className="flex-1 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirmPrint}
                  className="flex-1 py-2 px-4 rounded-xl bg-[#2F6BFF] hover:bg-[#1E55F0] text-white font-bold transition-colors"
                >
                  Continue to Print
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}