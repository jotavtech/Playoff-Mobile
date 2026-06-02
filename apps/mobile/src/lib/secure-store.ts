import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Persistent, encrypted token storage. On web (no SecureStore) we fall back to
 * localStorage so the dev/web build still works.
 */
const memoryFallback = new Map<string, string>();

export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
      return memoryFallback.get(key) ?? null;
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return memoryFallback.get(key) ?? null;
  }
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      else memoryFallback.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
    memoryFallback.set(key, value);
  }
}

export async function deleteSecureItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      else memoryFallback.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    memoryFallback.delete(key);
  }
}
