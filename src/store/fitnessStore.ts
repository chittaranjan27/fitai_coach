import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, FitnessPlan } from '@/types/fitness';

interface FitnessStore {
  userProfile: UserProfile | null;
  fitnessPlan: FitnessPlan | null;
  isGenerating: boolean;
  isDarkMode: boolean;
  setUserProfile: (profile: UserProfile) => void;
  setFitnessPlan: (plan: FitnessPlan) => void;
  setIsGenerating: (generating: boolean) => void;
  toggleDarkMode: () => void;
  clearPlan: () => void;
}

export const useFitnessStore = create<FitnessStore>()(
  persist(
    (set) => ({
      userProfile: null,
      fitnessPlan: null,
      isGenerating: false,
      isDarkMode: false,
      setUserProfile: (profile) => set({ userProfile: profile }),
      setFitnessPlan: (plan) => set({ fitnessPlan: plan }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newMode };
      }),
      clearPlan: () => set({ fitnessPlan: null }),
    }),
    {
      name: 'fitness-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
