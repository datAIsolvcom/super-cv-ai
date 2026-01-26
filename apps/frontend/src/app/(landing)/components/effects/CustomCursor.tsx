'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * CustomCursor Component
 * 
 * Custom branded cursor with instant follow - no delay.
 */
export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Zero delay: Use motion values directly without springs
    // const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
    // const cursorXSpring = useSpring(cursorX, springConfig);
    // const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        setIsMounted(true);
        // Check for touch device after mount (client-side only)
        if ('ontouchstart' in window) {
            setIsTouchDevice(true);
            return;
        }

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as Element;
            if (target.closest('a, button, [role="button"], input, textarea, select')) {
                setIsHovering(true);
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const target = e.target as Element;
            if (target.closest('a, button, [role="button"], input, textarea, select')) {
                setIsHovering(false);
            }
        };

        const handleMouseOut = () => {
            setIsVisible(false);
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);
        document.addEventListener('mouseleave', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
            document.removeEventListener('mouseleave', handleMouseOut);
        };
    }, [cursorX, cursorY]);

    // Don't render anything until mounted (prevents hydration mismatch)
    // Also hide on touch devices
    if (!isMounted || isTouchDevice) {
        return null;
    }

    return (
        <>
            {/* Glow effect layer */}
            <motion.div
                style={{
                    x: cursorX, // Direct value
                    y: cursorY, // Direct value
                    translateX: '-50%',
                    translateY: '-50%',
                    background: 'radial-gradient(circle, rgba(47,107,255,0.4) 0%, rgba(60,224,177,0.2) 50%, transparent 70%)',
                    filter: 'blur(8px)',
                }}
                animate={{
                    scale: isHovering ? 2 : 1,
                    opacity: isVisible ? 0.4 : 0,
                }}
                transition={{ scale: { duration: 0.15 } }}
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9997]"
            />

            {/* Main cursor - Sparkle shape with gradient */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    filter: 'drop-shadow(0 0 6px rgba(47,107,255,0.6)) drop-shadow(0 0 12px rgba(60,224,177,0.4))',
                }}
                animate={{
                    scale: isHovering ? 1.4 : 1,
                    rotate: isHovering ? 45 : 0,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ scale: { duration: 0.15 }, rotate: { duration: 0.2 } }}
                className="fixed top-0 left-0 w-5 h-5 pointer-events-none z-[9999]"
            >
                {/* 4-pointed star/sparkle SVG */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                        <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2F6BFF" />
                            <stop offset="100%" stopColor="#3CE0B1" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M12 2L10.5 9.5L3 12L10.5 14.5L12 22L13.5 14.5L21 12L13.5 9.5L12 2Z"
                        fill="url(#cursorGradient)"
                    />
                </svg>
            </motion.div>

            {/* Outer ring with gradient border + pulse animation */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: 'linear-gradient(135deg, #2F6BFF 0%, #3CE0B1 100%)',
                    padding: '1.5px',
                }}
                animate={{
                    scale: isHovering ? [1.8, 2, 1.8] : [1, 1.15, 1],
                    opacity: isVisible ? [0.4, 0.7, 0.4] : 0,
                }}
                transition={{
                    scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
            >
                <div className="w-full h-full rounded-full bg-white/80" />
            </motion.div>

            {/* Second pulse ring for extra depth */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovering ? [2, 2.5, 2] : [1.2, 1.5, 1.2],
                    opacity: isVisible ? [0.2, 0.4, 0.2] : 0,
                }}
                transition={{
                    scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
                    opacity: { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
                }}
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#2F6BFF]/40 pointer-events-none z-[9996]"
            />

            {/* Hide default cursor globally */}
            <style jsx global>{`
        body {
          cursor: none;
        }
        a, button, [role="button"], input, textarea, select {
          cursor: none;
        }
      `}</style>
        </>
    );
}

