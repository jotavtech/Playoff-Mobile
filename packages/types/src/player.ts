export type Track = {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  albumArtUrl: string | null;
  durationMs: number;
};

export type PlaybackState = {
  track: Track | null;
  isPlaying: boolean;
  positionMs: number;
  volume: number;
};
