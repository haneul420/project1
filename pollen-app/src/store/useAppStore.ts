import { create } from 'zustand';

type AppState = {
  isDetailModalOpen: boolean;
  openDetailModal: () => void;
  closeDetailModal: () => void;
  
  isOnboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;

  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  isDetailModalOpen: false,
  openDetailModal: () => set({ isDetailModalOpen: true }),
  closeDetailModal: () => set({ isDetailModalOpen: false }),

  isOnboardingCompleted: false,
  setOnboardingCompleted: (completed) => set({ isOnboardingCompleted: completed }),

  isSettingsModalOpen: false,
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),
}));
