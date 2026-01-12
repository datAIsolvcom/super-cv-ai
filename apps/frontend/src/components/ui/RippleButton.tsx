"use client";

import { useState, useCallback, ReactNode, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RippleButtonProps {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

interface Ripple {
    id: number;
    x: number;
    y: number;
    size: number;
}


export function RippleButton({
    children,
    className = "",
    variant = "primary",
    size = "md",
    onClick,
    disabled = false,
    type = "button",
}: RippleButtonProps) {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const createRipple = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;


        const size = Math.max(rect.width, rect.height) * 2;

        const newRipple: Ripple = {
            id: Date.now(),
            x,
            y,
            size,
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);
    }, []);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        createRipple(e);
        onClick?.();
    };

    const baseStyles = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] hover:from-[#1E55F0] hover:to-[#3CE0B1] text-white shadow-lg shadow-[#2F6BFF]/25 focus:ring-[#2F6BFF]",
        secondary: "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 focus:ring-slate-500 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900",
        ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base",
    };

    return (
        <motion.button
            type={type}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            onClick={handleClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
        >

            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        initial={{
                            width: 0,
                            height: 0,
                            opacity: 0.5,
                            x: ripple.x,
                            y: ripple.y,
                        }}
                        animate={{
                            width: ripple.size,
                            height: ripple.size,
                            opacity: 0,
                            x: ripple.x - ripple.size / 2,
                            y: ripple.y - ripple.size / 2,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute rounded-full bg-white/30 pointer-events-none"
                        style={{ left: 0, top: 0 }}
                    />
                ))}
            </AnimatePresence>


            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
