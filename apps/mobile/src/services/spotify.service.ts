import type { Song } from '@playoff/types';
import { api } from './api';

export const spotifyService = {
  search(query: string, signal?: AbortSignal): Promise<Song[]> {
    const q = encodeURIComponent(query.trim());
    return api
      .get<{ tracks: Song[] }>(`/spotify/search?q=${q}&limit=20`, { signal })
      .then((r) => r.tracks);
  },

  track(id: string): Promise<Song> {
    return api.get<{ track: Song }>(`/spotify/tracks/${id}`).then((r) => r.track);
  },
};
