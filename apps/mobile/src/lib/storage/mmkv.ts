import { MMKV } from 'react-native-mmkv';

/**
 * Synchronous key/value storage backed by MMKV on native. On web (or anywhere
 * the native module is unavailable, e.g. SSR/Jest), MMKV construction throws —
 * we fall back to an in-memory map so imports never crash and the app keeps
 * working with non-persistent settings.
 */
type SyncStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

function createMemoryStorage(): SyncStorage {
  const map = new Map<string, string>();
  return {
    getString: (key) => map.get(key),
    set: (key, value) => {
      map.set(key, value);
    },
    delete: (key) => {
      map.delete(key);
    },
  };
}

function createStorage(): SyncStorage {
  try {
    return new MMKV({ id: 'playoff-storage' });
  } catch {
    // MMKV unavailable (web / unsupported runtime) — degrade gracefully.
    return createMemoryStorage();
  }
}

export const storage: SyncStorage = createStorage();

export function getString(key: string): string | undefined {
  return storage.getString(key);
}

export function setString(key: string, value: string): void {
  storage.set(key, value);
}

export function remove(key: string): void {
  storage.delete(key);
}

/**
 * Zustand `persist` adapter over {@link storage}. Synchronous and safe on web
 * (the underlying storage degrades to in-memory when MMKV is unavailable).
 */
export const zustandStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => storage.delete(name),
};
