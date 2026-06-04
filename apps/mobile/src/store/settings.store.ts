import { STORAGE_KEYS } from '@playoff/config';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage/mmkv';

type SettingsState = {
  reducedMotion: boolean;
  lowEndMode: boolean;
  hapticsEnabled: boolean;
  setReducedMotion: (value: boolean) => void;
  setLowEndMode: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
};

/** Only the user preferences are persisted — actions are recreated on init. */
type PersistedSettings = Pick<SettingsState, 'reducedMotion' | 'lowEndMode' | 'hapticsEnabled'>;

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      reducedMotion: false,
      lowEndMode: false,
      hapticsEnabled: true,
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setLowEndMode: (lowEndMode) => set({ lowEndMode }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state): PersistedSettings => ({
        reducedMotion: state.reducedMotion,
        lowEndMode: state.lowEndMode,
        hapticsEnabled: state.hapticsEnabled,
      }),
    },
  ),
);
