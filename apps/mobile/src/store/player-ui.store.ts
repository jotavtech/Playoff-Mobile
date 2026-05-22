import { create } from 'zustand';

type PlayerUiState = {
  isExpanded: boolean;
  isQueueOpen: boolean;
  setExpanded: (value: boolean) => void;
  setQueueOpen: (value: boolean) => void;
  toggleExpanded: () => void;
};

export const usePlayerUiStore = create<PlayerUiState>((set) => ({
  isExpanded: false,
  isQueueOpen: false,
  setExpanded: (isExpanded) => set({ isExpanded }),
  setQueueOpen: (isQueueOpen) => set({ isQueueOpen }),
  toggleExpanded: () => set((s) => ({ isExpanded: !s.isExpanded })),
}));
