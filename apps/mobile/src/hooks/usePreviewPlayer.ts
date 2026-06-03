import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays a 30s Spotify preview (when available). Only one preview plays at a
 * time; toggling the same track stops it.
 */
export function usePreviewPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // ignore
      }
      soundRef.current = null;
    }
    setPlayingId(null);
  }, []);

  const toggle = useCallback(
    async (id: string, previewUrl?: string | null) => {
      if (!previewUrl) return;
      if (playingId === id) {
        await stop();
        return;
      }
      await stop();
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync({ uri: previewUrl }, { shouldPlay: true });
        soundRef.current = sound;
        setPlayingId(id);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) void stop();
        });
      } catch {
        await stop();
      }
    },
    [playingId, stop],
  );

  useEffect(() => () => void stop(), [stop]);

  return { playingId, toggle, stop };
}
