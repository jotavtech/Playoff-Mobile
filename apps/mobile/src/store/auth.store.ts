import { STORAGE_KEYS, env } from '@playoff/config';
import type { User } from '@playoff/types';
import { create } from 'zustand';
import { deleteSecureItem, getSecureItem, setSecureItem } from '@/lib/secure-store';
import { authService } from '@/services/auth.service';
import { setApiToken } from '@/services/api';
import { demoUser } from '@/services/demo-data';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  /** Browsing without an account (can view, cannot vote). */
  isGuest: boolean;
  hydrate: () => Promise<void>;
  setSession: (token: string, user: User) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  token: null,
  user: null,
  isGuest: false,

  hydrate: async () => {
    // Demo mode: sign in automatically with the bundled demo user.
    if (env.demoMode) {
      setApiToken('demo-token');
      set({ status: 'authenticated', token: 'demo-token', user: demoUser, isGuest: false });
      return;
    }

    const token = await getSecureItem(STORAGE_KEYS.authToken);
    if (!token) {
      set({ status: 'unauthenticated', token: null, user: null });
      return;
    }
    setApiToken(token);
    try {
      const { user } = await authService.me();
      set({ status: 'authenticated', token, user, isGuest: false });
    } catch {
      // Token invalid/expired — clear it.
      await deleteSecureItem(STORAGE_KEYS.authToken);
      setApiToken(null);
      set({ status: 'unauthenticated', token: null, user: null });
    }
  },

  setSession: async (token, user) => {
    await setSecureItem(STORAGE_KEYS.authToken, token);
    setApiToken(token);
    set({ status: 'authenticated', token, user, isGuest: false });
  },

  continueAsGuest: () => set({ isGuest: true, status: 'unauthenticated' }),

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout
    }
    await deleteSecureItem(STORAGE_KEYS.authToken);
    setApiToken(null);
    set({ status: 'unauthenticated', token: null, user: null, isGuest: false });
  },
}));
