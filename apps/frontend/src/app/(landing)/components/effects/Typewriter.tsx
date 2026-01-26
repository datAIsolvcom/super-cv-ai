'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
    text: string;
    className?: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
    hideCursorOnComplete?: boolean;
}

/**
 * Typewriter Component
 * 
 * Text that types out letter by letter.
 * Animation plays once on mount and persists across re-renders.
 */
export function Typewriter({
    text,
    className = '',
    speed = 50,
    delay = 0,
    onComplete,
    hideCursorOnComplete = false
}: TypewriterProps) {
    const [displayText, setDisplayText] = useState('');
    const [started, setStarted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const hasAnimated = useRef(false);

    // Start delay timer (only once)
    useEffect(() => {
        if (hasAnimated.current) return;

        const startTimer = setTimeout(() => {
            setStarted(true);
        }, delay);

        return () => clearTimeout(startTimer);
    }, [delay]);

    // Typing animation (only once)
    useEffect(() => {
        if (!started || hasAnimated.current) return;

        hasAnimated.current = true;
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, text, speed, onComplete]);

    return (
        <span className={className}>
            {displayText}
            {/* Cursor always renders to reserve space, opacity controls visibility */}
            <motion.span
                animate={hideCursorOnComplete && isComplete ? { opacity: 0 } : { opacity: [1, 0] }}
                transition={hideCursorOnComplete && isComplete ? { duration: 0 } : { duration: 0.5, repeat: Infinity }}
                className="inline-block w-[3px] h-[1em] bg-current ml-1"
            />
        </span>
    );
}

