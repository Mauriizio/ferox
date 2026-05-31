"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/services/auth-service";
import {
  getSupabaseErrorMessage,
  logSupabaseError,
} from "@/lib/services/supabase-error";
import type { Profile } from "@/lib/supabase/database.types";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  authLoading: boolean;
  authError: string;
  refreshProfile: (userId?: string) => Promise<Profile | null>;
  setProfile: (profile: Profile | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const user = session?.user ?? null;
  const sessionUserIdRef = useRef<string | undefined>(undefined);

  const refreshProfile = useCallback(
    async (userId?: string) => {
      const profileUserId = userId ?? sessionUserIdRef.current;
      if (!profileUserId) {
        setProfile(null);
        return null;
      }

      const nextProfile = await getProfile(profileUserId);
      setProfile(nextProfile);
      return nextProfile;
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    async function loadInitialAuthState() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted) return;

        sessionUserIdRef.current = data.session?.user?.id;
        setSession(data.session);
        setAuthLoading(false);

        if (data.session?.user) {
          refreshProfile(data.session.user.id).catch((error) => {
            logSupabaseError("Cargar perfil inicial", error);
            setAuthError(getSupabaseErrorMessage(error));
          });
        } else {
          setProfile(null);
        }
      } catch (error) {
        if (!mounted) return;
        logSupabaseError("Cargar estado inicial de autenticación", error);
        setAuthError(getSupabaseErrorMessage(error));
        sessionUserIdRef.current = undefined;
        setSession(null);
        setProfile(null);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    }

    loadInitialAuthState();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        sessionUserIdRef.current = nextSession?.user?.id;
        setSession(nextSession);
        setAuthError("");

        if (nextSession?.user) {
          refreshProfile(nextSession.user.id).catch((error) => {
            logSupabaseError("Refrescar perfil después de auth", error);
            setAuthError(getSupabaseErrorMessage(error));
          });
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      authLoading,
      authError,
      refreshProfile,
      setProfile,
    }),
    [session, user, profile, authLoading, authError, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }
  return context;
}
