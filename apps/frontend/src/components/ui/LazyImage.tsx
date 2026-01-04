"use client";

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad'> {
    src: string;
    alt: string;
    blurDataURL?: string;
    className?: string;
    wrapperClassName?: string;
}


export function LazyImage({
    src,
    alt,
    blurDataURL,
    className,
    wrapperClassName,
    ...props
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px',
                threshold: 0.01,
            }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, []);


    const defaultBlur = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e2e8f0' width='100' height='100'/%3E%3C/svg%3E";

    return (
        <div
            className={cn(
                "relative overflow-hidden",
                wrapperClassName
            )}
        >

            <div
                className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    isLoaded ? "opacity-0" : "opacity-100"
                )}
                style={{
                    backgroundImage: `url(${blurDataURL || defaultBlur})`,
                    backgroundSize: 'cover',
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)',
                }}
            />


            <img
                ref={imgRef}
                src={isInView ? src : undefined}
                alt={alt}
                className={cn(
                    "transition-opacity duration-500",
                    isLoaded ? "opacity-100" : "opacity-0",
                    className
                )}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
                decoding="async"
                {...props}
            />
        </div>
    );
}


export function generateBlurPlaceholder(color: string = '#e2e8f0'): string {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect fill='${color}' width='1' height='1'/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
