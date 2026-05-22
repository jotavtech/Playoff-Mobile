import { create } from 'zustand';

type SettingsState = {
  reducedMotion: boolean;
  lowEndMode: boolean;
  hapticsEnabled: boolean;
  setReducedMotion: (value: boolean) => void;
  setLowEndMode: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  reducedMotion: false,
  lowEndMode: false,
  hapticsEnabled: true,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setLowEndMode: (lowEndMode) => set({ lowEndMode }),
  setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
}));
