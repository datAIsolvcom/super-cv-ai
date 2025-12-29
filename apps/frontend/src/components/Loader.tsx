"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const loadingStates = [
    "Reading Document Structure...",
    "Extracting Key Competencies...",
    "Matching with Job Context...",
    "Polishing Executive Summary...",
    "Finalizing Your Strategy...",
];

export const Loader = () => {
    const [ currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % loadingStates.length);
        }, 1500);
        return() => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-64 flex flex-col items-center justify-center space-y-8">
      
      <div className="h-8 relative w-full text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-amber-500 font-serif text-lg md:text-xl tracking-wide absolute inset-x-0"
          >
            {loadingStates[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>


      <div className="w-64 md:w-96 h-1 bg-slate-800 rounded-full overflow-hidden relative">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          style={{ width: "50%" }} 
        />
       
        <div className="absolute inset-0 bg-amber-500/20 blur-md" />
      </div>
      
      <p className="text-slate-500 text-xs uppercase tracking-widest">
        AI Processing Engine
      </p>
    </div>
  );
};