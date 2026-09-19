import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';
import { getLocalProfile, saveLocalProfile } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (name: string, avatarUrl?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(getLocalProfile());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Local demo mode
      setProfile(getLocalProfile());
      setLoading(false);
      return;
    }

    // Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(getLocalProfile());
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setProfile(data);
        saveLocalProfile(data);
      } else {
        // Fallback local profile
        setProfile(getLocalProfile());
      }
    } catch (e) {
      console.error(e);
      setProfile(getLocalProfile());
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock login for offline testability
      const mockProfile: Profile = {
        id: 'user-mock-' + Date.now(),
        name: email.split('@')[0] || 'User',
        created_at: new Date().toISOString()
      };
      setProfile(mockProfile);
      saveLocalProfile(mockProfile);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) {
      const mockProfile: Profile = {
        id: 'user-mock-' + Date.now(),
        name: name || email.split('@')[0],
        created_at: new Date().toISOString()
      };
      setProfile(mockProfile);
      saveLocalProfile(mockProfile);
      return { error: null };
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (!error && data.user) {
      const newProfile: Profile = {
        id: data.user.id,
        name,
        created_at: new Date().toISOString()
      };
      await supabase.from('profiles').upsert(newProfile);
      setProfile(newProfile);
      saveLocalProfile(newProfile);
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (name: string, avatarUrl?: string) => {
    if (!profile) return;
    const updated: Profile = {
      ...profile,
      name,
      avatar_url: avatarUrl ?? profile.avatar_url
    };
    setProfile(updated);
    saveLocalProfile(updated);

    if (isSupabaseConfigured && user) {
      await supabase.from('profiles').upsert(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
