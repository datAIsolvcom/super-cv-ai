"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    scale: number;
    velocity: { x: number; y: number };
}

const COLORS = [
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#10b981", // emerald
    "#3b82f6", // blue
    "#ec4899", // pink
    "#f97316", // orange
    "#06b6d4", // cyan
];

interface ConfettiProps {
    trigger: boolean;
    particleCount?: number;
    duration?: number;
    onComplete?: () => void;
}


export function Confetti({
    trigger,
    particleCount = 50,
    duration = 2000,
    onComplete,
}: ConfettiProps) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isActive, setIsActive] = useState(false);

    const createParticles = useCallback(() => {
        const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
        const centerY = typeof window !== 'undefined' ? window.innerHeight / 3 : 300;

        const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
            id: Date.now() + i,
            x: centerX,
            y: centerY,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            velocity: {
                x: (Math.random() - 0.5) * 30,
                y: -10 - Math.random() * 20,
            },
        }));

        setParticles(newParticles);
        setIsActive(true);


        setTimeout(() => {
            setParticles([]);
            setIsActive(false);
            onComplete?.();
        }, duration);
    }, [particleCount, duration, onComplete]);

    useEffect(() => {
        if (trigger && !isActive) {
            createParticles();
        }
    }, [trigger, isActive, createParticles]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{
                            x: particle.x,
                            y: particle.y,
                            scale: 0,
                            rotate: 0,
                            opacity: 1,
                        }}
                        animate={{
                            x: particle.x + particle.velocity.x * 20,
                            y: particle.y + particle.velocity.y * -15 + 400, // gravity effect
                            scale: particle.scale,
                            rotate: particle.rotation + 360,
                            opacity: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: duration / 1000,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        style={{
                            position: "absolute",
                            width: 10,
                            height: 10,
                            backgroundColor: particle.color,
                            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}


export function useConfetti() {
    const [shouldTrigger, setShouldTrigger] = useState(false);

    const fire = useCallback(() => {
        setShouldTrigger(true);
    }, []);

    const reset = useCallback(() => {
        setShouldTrigger(false);
    }, []);

    return { shouldTrigger, fire, reset };
}
