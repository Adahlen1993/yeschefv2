// store/session.ts
import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type SessionState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  inited: boolean;
  init: () => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  user: null,
  loading: true,
  inited: false,

  init: async () => {
    if (get().inited) return; // don’t double-init (Expo HMR etc.)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null, loading: false, inited: true });
    } catch (e) {
      console.warn('init:getSession error', e);
      set({ loading: false, inited: true });
    }

    // Keep state in sync for future changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session: session ?? null, user: session?.user ?? null, loading: false });
    });
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.warn('signOut error', error.message);
    // onAuthStateChange will null the user
  },

  refresh: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null });
  },
}));
