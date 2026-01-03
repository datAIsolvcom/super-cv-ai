"use client";

import { useEffect, useLayoutEffect } from "react";
import { useTheme } from "@/hooks/useTheme";


const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function ThemeHydration() {
    const theme = useTheme((s) => s.theme);


    useIsomorphicLayoutEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    return null;
}
