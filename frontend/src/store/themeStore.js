import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'dark', // default to dark mode
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'theme-storage',
        }
    )
);

export default useThemeStore;
