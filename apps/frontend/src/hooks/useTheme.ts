import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Theme modes
export type ThemeMode = 'light' | 'dark' | 'auto'

// Color schemes with distinct personalities
export type ColorScheme = 'warm' | 'cool' | 'neutral'

// Color scheme CSS variable mappings
export const colorSchemeTokens: Record<ColorScheme, {
    accent: string
    accentForeground: string
    primary: string
    primaryForeground: string
}> = {
    warm: {
        accent: '38 92% 50%',        // Amber
        accentForeground: '0 0% 100%',
        primary: '24 95% 53%',       // Orange
        primaryForeground: '0 0% 100%',
    },
    cool: {
        accent: '217 91% 60%',       // Blue
        accentForeground: '0 0% 100%',
        primary: '262 83% 58%',      // Purple
        primaryForeground: '0 0% 100%',
    },
    neutral: {
        accent: '0 0% 15%',          // Slate
        accentForeground: '0 0% 100%',
        primary: '0 0% 25%',         // Gray
        primaryForeground: '0 0% 100%',
    },
}

interface ThemeStore {
    // Theme mode (light/dark/auto)
    mode: ThemeMode
    // Actual resolved theme (always light or dark)
    resolvedTheme: 'light' | 'dark'
    // Color scheme
    colorScheme: ColorScheme
    // System preference
    systemPreference: 'light' | 'dark'

    // Actions
    setMode: (mode: ThemeMode) => void
    setColorScheme: (scheme: ColorScheme) => void
    toggleTheme: () => void
    setSystemPreference: (pref: 'light' | 'dark') => void
}

// Helper to determine resolved theme
function resolveTheme(mode: ThemeMode, systemPref: 'light' | 'dark'): 'light' | 'dark' {
    if (mode === 'auto') return systemPref
    return mode
}

// Apply theme to DOM
function applyTheme(resolvedTheme: 'light' | 'dark', colorScheme: ColorScheme) {
    const root = document.documentElement

    // Apply dark/light class with transition
    root.style.setProperty('--theme-transition', 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease')

    if (resolvedTheme === 'dark') {
        root.classList.add('dark')
    } else {
        root.classList.remove('dark')
    }

    // Apply color scheme CSS variables
    const tokens = colorSchemeTokens[colorScheme]
    root.style.setProperty('--accent', tokens.accent)
    root.style.setProperty('--accent-foreground', tokens.accentForeground)
    root.style.setProperty('--primary', tokens.primary)
    root.style.setProperty('--primary-foreground', tokens.primaryForeground)
    root.dataset.colorScheme = colorScheme
}

// Migration from old theme format
function migrateOldTheme(): { mode: ThemeMode; colorScheme: ColorScheme } | null {
    if (typeof window === 'undefined') return null

    try {
        const oldData = localStorage.getItem('supercv-theme')
        if (oldData) {
            const parsed = JSON.parse(oldData)
            // Old format had { state: { theme: 'light' | 'dark' } }
            if (parsed?.state?.theme && !parsed?.state?.mode) {
                const oldTheme = parsed.state.theme as 'light' | 'dark'
                // Migrate to new format
                return {
                    mode: oldTheme,
                    colorScheme: 'warm' // Default to warm (amber) scheme
                }
            }
        }
    } catch {
        // Ignore migration errors
    }
    return null
}

export const useTheme = create<ThemeStore>()(
    persist(
        (set, get) => ({
            mode: 'light',
            resolvedTheme: 'light',
            colorScheme: 'warm',
            systemPreference: 'light',

            setMode: (mode) => {
                const { systemPreference, colorScheme } = get()
                const resolvedTheme = resolveTheme(mode, systemPreference)

                if (typeof window !== 'undefined') {
                    applyTheme(resolvedTheme, colorScheme)
                }

                set({ mode, resolvedTheme })
            },

            setColorScheme: (colorScheme) => {
                const { resolvedTheme } = get()

                if (typeof window !== 'undefined') {
                    applyTheme(resolvedTheme, colorScheme)
                }

                set({ colorScheme })
            },

            toggleTheme: () => {
                const { mode, systemPreference, colorScheme } = get()
                // Cycle through: light -> dark -> auto -> light
                const nextMode: ThemeMode =
                    mode === 'light' ? 'dark' :
                        mode === 'dark' ? 'auto' : 'light'

                const resolvedTheme = resolveTheme(nextMode, systemPreference)

                if (typeof window !== 'undefined') {
                    applyTheme(resolvedTheme, colorScheme)
                }

                set({ mode: nextMode, resolvedTheme })
            },

            setSystemPreference: (pref) => {
                const { mode, colorScheme } = get()
                const resolvedTheme = resolveTheme(mode, pref)

                if (typeof window !== 'undefined' && mode === 'auto') {
                    applyTheme(resolvedTheme, colorScheme)
                }

                set({ systemPreference: pref, resolvedTheme })
            },
        }),
        {
            name: 'supercv-theme',
            version: 3,
            migrate: (persistedState, version) => {
                // Force migration to light mode for version 3 (removing dark mode feature)
                if (version < 3) {
                    return {
                        mode: 'light',
                        resolvedTheme: 'light',
                        colorScheme: 'warm',
                        systemPreference: 'light',
                    } as ThemeStore
                }
                return persistedState as ThemeStore
            },
        }
    )
)

// Legacy compatibility - theme getter that returns 'light' | 'dark'
export const useResolvedTheme = () => useTheme((s) => s.resolvedTheme)
