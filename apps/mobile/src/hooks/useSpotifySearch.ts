import { QUERY_KEYS } from '@playoff/config';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { spotifyService } from '@/services/spotify.service';

/** Debounced Spotify track search through the Atlas backend. */
export function useSpotifySearch(query: string) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const trimmed = debounced.trim();

  return useQuery({
    queryKey: QUERY_KEYS.search(trimmed),
    queryFn: ({ signal }) => spotifyService.search(trimmed, signal),
    enabled: trimmed.length >= 2,
    staleTime: 60_000,
  });
}
