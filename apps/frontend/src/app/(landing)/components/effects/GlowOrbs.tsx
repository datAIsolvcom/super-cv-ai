'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * GlowOrbs Component
 * 
 * Large glowing orbs - optimized with GPU hints and reduced effects on mobile.
 */
export function GlowOrbs() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    // Simplified static orbs on mobile for better performance
    if (isMobile) {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#2F6BFF]/20 rounded-full blur-[60px]" />
                <div className="absolute top-1/3 -right-32 w-[250px] h-[250px] bg-[#3CE0B1]/15 rounded-full blur-[50px]" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Main blue orb */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{ willChange: 'transform' }}
                className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#2F6BFF]/20 rounded-full blur-[100px]"
            />

            {/* Green orb */}
            <motion.div
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{ willChange: 'transform' }}
                className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-[#3CE0B1]/15 rounded-full blur-[80px]"
            />

            {/* Purple accent orb */}
            <motion.div
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{ willChange: 'transform' }}
                className="absolute bottom-20 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[60px]"
            />
        </div>
    );
}


