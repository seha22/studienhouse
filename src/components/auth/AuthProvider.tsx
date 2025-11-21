"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setFromSession = useCallback((session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setFromSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      setFromSession(newSession);
    });
    return () => subscription.unsubscribe();
  }, [setFromSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    setFromSession(data.session);
    setLoading(false);
    if (error) return { error: error.message };
    return {};
  }, [setFromSession]);

  const signOut = useCallback(async () => {
    setLoading(true);
    await supabaseClient.auth.signOut();
    setFromSession(null);
    setLoading(false);
  }, [setFromSession]);

  const value: AuthContextValue = {
    session,
    user,
    token: session?.access_token ?? null,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

