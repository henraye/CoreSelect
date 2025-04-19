import { create } from "zustand";

type PCStore = {
  budget: number;
  setBudget: (budget: number) => void;
  priorities: string[];
  setPriorities: (priorities: string[]) => void;
  completedSteps: number[];
  markStepCompleted: (step: number) => void;
}

export const usePCStore = create<PCStore>((set) => ({
  budget: 0,
  setBudget: (budget) => set({ budget }),

  priorities: [],
  setPriorities: (priorities) => set({ priorities }),
  
  completedSteps: [],
  markStepCompleted: (step) => set((state) => ({
    completedSteps: [...new Set([...state.completedSteps, step])]
  })),
}));