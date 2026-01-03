"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "glass" | "panel" | "solid";
    glow?: boolean;
}


export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "glass", glow = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(

                    "rounded-2xl transition-all duration-300",

                    {
                        "bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl":
                            variant === "glass",
                        "bg-slate-950/50 backdrop-blur-md border border-white/5":
                            variant === "panel",
                        "bg-surface border border-slate-800":
                            variant === "solid",
                    },

                    glow && "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export default Card;
