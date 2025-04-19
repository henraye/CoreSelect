import { create } from "zustand";
import { persist } from "zustand/middleware";

type PCStore = {
  budget: number;
  setBudget: (budget: number) => void;
  priorities: string[];
  setPriorities: (priorities: string[]) => void;
  wantToPlayGames: string[];
  setWantToPlayGames: (games: string[]) => void;
  currentlyPlayingGames: string[];
  setCurrentlyPlayingGames: (games: string[]) => void;
  completedSteps: number[];
  markStepCompleted: (step: number) => void;
  recommendation: any;
  setRecommendation: (recommendation: any) => void;
}

export const usePCStore = create<PCStore>()(
  persist(
    (set) => ({
      budget: 0,
      setBudget: (budget) => set({ budget }),

      priorities: [],
      setPriorities: (priorities) => set({ priorities }),
      
      wantToPlayGames: [],
      setWantToPlayGames: (games) => set({ wantToPlayGames: games }),

      currentlyPlayingGames: [],
      setCurrentlyPlayingGames: (games) => set({ currentlyPlayingGames: games }),

      completedSteps: [],
      markStepCompleted: (step) => set((state) => ({
        completedSteps: [...new Set([...state.completedSteps, step])]
      })),

      recommendation: null,
      setRecommendation: (recommendation) => set({ recommendation }),
    }),
    {
      name: 'pc-store',
      partialize: (state) => ({
        recommendation: state.recommendation,
      }),
    }
  )
);