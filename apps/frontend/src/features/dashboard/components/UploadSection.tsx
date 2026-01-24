"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Link as LinkIcon, Sparkles, Loader2, X, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/design-system/UpgradeModal";
import { AuthRequiredModal } from "@/components/design-system/AuthRequiredModal";
import { useAnalyzeMutation } from "@/features/analysis/api/useAnalysis";

// File validation constants
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates file type using magic number detection
 * PDF: %PDF (25 50 44 46)
 * DOCX: ZIP header (50 4B 03 04)
 */
const validateFileType = async (file: File): Promise<boolean> => {
  const arrayBuffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // PDF magic number: 25 50 44 46 (%PDF)
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return file.name.toLowerCase().endsWith('.pdf');
  }

  // DOCX magic number: 50 4B 03 04 (ZIP header)
  if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return file.name.toLowerCase().endsWith('.docx');
  }

  return false;
};

/**
 * Validates file for allowed extensions, size, and content type
 */
const validateFile = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  const fileName = file.name.toLowerCase();

  // Check extension
  if (!ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
    return { valid: false, error: "Only PDF and DOCX files are allowed" };
  }

  // Check size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }

  // Validate magic number
  const isValidType = await validateFileType(file);
  if (!isValidType) {
    return { valid: false, error: "Invalid file format. The file content doesn't match its extension." };
  }

  return { valid: true };
};

export function UploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "text" | "link">("general");
  const [jobContext, setJobContext] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const { data: session } = useSession();

  const analyzeMutation = useAnalyzeMutation();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validation = await validateFile(droppedFile);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid file");
        return;
      }
      setFile(droppedFile);
    }
  };

  const startAnalysis = () => {
    analyzeMutation.mutate(
      {
        file: file!,
        jobDescriptionText: activeTab === "text" ? jobContext : undefined,
        jobDescriptionUrl: activeTab === "link" ? jobContext : undefined,
        userId: session?.user?.id,
      },
      {
        onSuccess: (data) => {
          router.push(`/cv/${data.cvId}/analyze?origin=new`);
        },
        onError: (error) => {
          toast.error(error.message || "Analysis failed. Please try again.");
          if (error.message.includes("credit") || error.message.includes("Credit")) {
            setShowUpgradeModal(true);
          }
        },
      }
    );
  };

  const handleAnalyze = () => {
    if (!file || analyzeMutation.isPending) return;

    // Enforce authentication
    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    // Start 3-second countdown before consuming tokens
    setCountdown(3);
    let currentCount = 3;

    const tick = () => {
      currentCount -= 1;

      if (currentCount <= 0) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        setCountdown(null);
        startAnalysis();
      } else {
        setCountdown(currentCount);
      }
    };

    countdownRef.current = setInterval(tick, 1000);
  };

  const cancelAnalysis = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);
    toast.info("Analysis cancelled");
  };

  const isLoading = analyzeMutation.isPending;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Countdown Cancel Overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 text-center shadow-2xl max-w-sm mx-4 border border-slate-100 dark:border-slate-800"
            >
              {/* Animated countdown circle */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                {/* Outer ring animation */}
                <svg className="w-28 h-28 -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "314 314" }}
                    animate={{ strokeDasharray: "0 314" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2F6BFF" />
                      <stop offset="100%" stopColor="#3CE0B1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center number */}
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1]">
                    {countdown}
                  </span>
                </motion.div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Starting Analysis...
              </h3>

              {/* File info */}
              {file && (
                <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <FileText size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                    {file.name}
                  </span>
                </div>
              )}

              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Analysis will begin in {countdown} second{countdown !== 1 ? 's' : ''}
              </p>

              <button
                onClick={cancelAnalysis}
                className="w-full px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 group"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform" />
                Cancel
              </button>

              <p className="text-xs text-slate-400 mt-4">
                Cancel now - no credits will be used
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-[32px] p-2 md:p-3 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />


        <div className="bg-slate-100 dark:bg-slate-950/80 rounded-[24px] p-6 md:p-10 border border-slate-200 dark:border-white/5 relative z-10 transition-colors duration-300">


          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-inner">
              {[
                { id: 'general', icon: Sparkles, label: 'General Audit' },
                { id: 'text', icon: FileText, label: 'Job Desc' },
                { id: 'link', icon: LinkIcon, label: 'LinkedIn URL' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "general" | "text" | "link")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg scale-105"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? "text-indigo-400 dark:text-indigo-600" : ""} />
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
                  ? "border-[#2F6BFF] bg-[#2F6BFF]/10 scale-[1.02] shadow-[0_0_30px_rgba(47,107,255,0.2)]"
                  : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30",
                file ? "border-emerald-500/50 bg-emerald-500/5 border-solid" : ""
              )}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={async (e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  const validation = await validateFile(selectedFile);
                  if (!validation.valid) {
                    toast.error(validation.error || "Invalid file");
                    e.target.value = ''; // Reset input
                    return;
                  }
                  setFile(selectedFile);
                }
              }} className="hidden" />

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div key="file-uploaded" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="text-center p-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl mb-4 relative">
                      <FileCheck className="text-white" size={40} />
                      <button onClick={(e) => { e.stopPropagation(); setFile(null) }} className="absolute -top-2 -right-2 bg-white dark:bg-slate-900 text-slate-400 p-1.5 rounded-full border border-slate-200 dark:border-white/10 hover:text-red-400 hover:border-red-500/50 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg truncate max-w-[200px] mx-auto">{file.name}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1 font-medium">Ready for Analysis</p>
                  </motion.div>
                ) : (
                  <motion.div key="upload-prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-6">
                    <div className="w-20 h-20 mx-auto bg-slate-200 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 group-hover/zone:scale-110 transition-transform duration-300 border border-slate-300 dark:border-white/5">
                      <UploadCloud className={cn("transition-colors duration-300", isDragging ? "text-[#2F6BFF]" : "text-slate-400 group-hover/zone:text-slate-600 dark:group-hover/zone:text-white")} size={32} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Drop Resume Here</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm px-4">Support PDF & DOCX. Max 10MB.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            <div className="flex flex-col gap-4">
              <div className="flex-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-1 relative overflow-hidden group/input focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                {activeTab === 'general' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                    <Sparkles className="text-indigo-500 dark:text-indigo-400 mb-4" size={48} strokeWidth={1} />
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      We will perform a <strong className="text-slate-900 dark:text-white">Full Spectrum Audit</strong> based on 2025 Industry Standards.
                    </p>
                  </div>
                ) : (
                  <textarea
                    className="w-full h-full bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 p-5 text-sm resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 custom-scrollbar"
                    placeholder={activeTab === 'link' ? "Paste LinkedIn Job Post URL here..." : "Paste the full Job Description text here..."}
                    onChange={(e) => setJobContext(e.target.value)}
                    autoFocus
                  />
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !file}
                className="h-16 relative overflow-hidden rounded-xl font-bold text-lg transition-all duration-500
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group/btn
                           bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white
                           hover:shadow-[0_0_60px_rgba(47,107,255,0.4)] hover:translate-y-[-2px] active:scale-[0.98]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  {isLoading ? "Analyzing..." : "Initialize Analysis"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}