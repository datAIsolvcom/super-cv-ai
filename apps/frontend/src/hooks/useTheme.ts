import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
    theme: 'light' | 'dark'
    toggleTheme: () => void
}

export const useTheme = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'dark' ? 'light' : 'dark'
                document.documentElement.classList.toggle('dark', newTheme === 'dark')
                return { theme: newTheme }
            }),
        }),
        { name: 'supercv-theme' }
    )
)
