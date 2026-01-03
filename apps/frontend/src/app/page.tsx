"use client";

import { UploadSection } from "@/features/dashboard/components/UploadSection";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Target, TrendingUp, Users } from "lucide-react";
import { OdometerCounter } from "@/components/design-system/OdometerCounter";
import { TiltCard } from "@/components/design-system/TiltCard";

const features = [
  { icon: Target, label: "ATS Score", value: 95, suffix: "%", desc: "Average pass rate" },
  { icon: TrendingUp, label: "Interview Rate", value: 3, suffix: "x", desc: "More callbacks" },
  { icon: Users, label: "Users", value: 10, suffix: "K+", desc: "Professionals helped" },
];

const capabilities = [
  { icon: Sparkles, title: "AI Analysis", desc: "Deep learning powered insights" },
  { icon: Shield, title: "ATS Optimized", desc: "Beat the algorithms" },
  { icon: Zap, title: "Instant Results", desc: "Analysis in seconds" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen p-[clamp(1rem,4vw,2rem)] md:p-[clamp(1.5rem,5vw,3rem)] overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-[clamp(2rem,6vh,4rem)] pt-[clamp(1rem,4vh,2rem)]"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-panel rounded-full text-amber-600 dark:text-amber-400 text-sm font-medium mb-8">
            <Sparkles size={14} />
            AI-Powered Resume Intelligence
          </div>

          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-serif font-bold heading-editorial mb-6">
            Architect Your{" "}
            <span className="text-gradient-gold">Career Legacy</span>
          </h1>

          <p className="text-[clamp(1rem,2vw,1.25rem)] text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Start dominating. The world's most advanced AI resume strategist,
            calibrated for ambitious professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[clamp(1rem,3vw,1.5rem)]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <UploadSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-[clamp(0.75rem,2vw,1rem)]"
          >
            {features.map((feature) => (
              <TiltCard
                key={feature.label}
                tiltStrength={30}
                glareEnabled={true}
                className="rounded-[clamp(1rem,2vw,1.5rem)]"
              >
                <div className="glass-panel rounded-[clamp(1rem,2vw,1.5rem)] p-[clamp(1rem,2.5vw,1.5rem)] h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                      <feature.icon size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <OdometerCounter
                          value={feature.value}
                          suffix={feature.suffix}
                          className="text-2xl font-bold text-slate-900 dark:text-white"
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">{feature.label}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-[clamp(1rem,3vw,1.5rem)]"
          >
            {capabilities.map((c) => (
              <TiltCard
                key={c.title}
                tiltStrength={25}
                glareEnabled={true}
                className="rounded-[clamp(1.25rem,3vw,2rem)]"
              >
                <div className="glass-panel rounded-[clamp(1.25rem,3vw,2rem)] p-[clamp(1.25rem,3vw,1.75rem)] h-full group">
                  <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/10 transition-all duration-300 border border-slate-200 dark:border-slate-700">
                    <c.icon size={18} className="text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{c.desc}</p>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center justify-center gap-[clamp(1rem,4vw,2rem)] mt-[clamp(2rem,6vh,4rem)] flex-wrap"
        >
          {["ATS Optimized", "Recruiter Approved", "AI Powered", "GDPR Compliant"].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-medium"
            >
              <div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full" />
              {badge}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}