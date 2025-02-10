import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  profile: any | null;
  isAdmin: boolean;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAdmin: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ 
    profile,
    isAdmin: profile?.role === 'admin'
  }),
  initialize: async () => {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ user: session.user });
      
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        set({ 
          profile,
          isAdmin: profile.role === 'admin'
        });
      }
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ user: session?.user ?? null });
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          set({ 
            profile,
            isAdmin: profile.role === 'admin'
          });
        }
      } else {
        set({ profile: null, isAdmin: false });
      }
    });
  }
}));