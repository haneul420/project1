import { create } from 'zustand';

type AppState = {
  isOnboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;

  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  isOnboardingCompleted: false,
  setOnboardingCompleted: (completed) => set({ isOnboardingCompleted: completed }),

  isSettingsModalOpen: false,
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),
}));
