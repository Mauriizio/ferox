import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/database.types";
import { isMissingSchemaError } from "@/lib/supabase/schema-errors";

export type AuthMode = "login" | "signup";

export type ProfileForm = {
  username: string;
  fullName: string;
  avatarUrl?: string | null;
};

type ProfileRow = Partial<Profile> & { id: string };

function normalizeProfile(row: ProfileRow | null): Profile | null {
  if (!row) return null;

  return {
    id: row.id,
    username: row.username ?? null,
    full_name: row.full_name ?? null,
    avatar_url: row.avatar_url ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  };
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUpWithPassword(
  email: string,
  password: string,
  fullName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  if (data.user && data.session) {
    try {
      await upsertProfile(data.user, {
        username: email.split("@")[0] ?? "",
        fullName,
      });
    } catch (profileError) {
      console.warn("No se pudo crear el perfil inicial automáticamente.", profileError);
    }
  }

  return data;
}

export async function signInWithGoogle() {
  console.info("Google OAuth diagnose: current origin", window.location.origin);
  console.info("Google OAuth diagnose: callback URL recibida", window.location.href);
  console.info("Calling signInWithOAuth");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        typeof window !== "undefined"
          ? window.location.origin
          : undefined,
    },
  });

  if (error) {
    console.error("OAuth error", error);
    throw error;
  }

  console.info("OAuth redirect started");
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return normalizeProfile(data as ProfileRow | null);
}

export async function upsertProfile(
  user: User,
  profile: ProfileForm,
): Promise<Profile> {
  const profilePayload = {
    id: user.id,
    username: profile.username.trim() || null,
    full_name: profile.fullName.trim() || null,
    avatar_url: profile.avatarUrl?.trim() || null,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;

  const normalizedProfile = normalizeProfile(data as ProfileRow);
  if (!normalizedProfile)
    throw new Error("No se pudo leer el perfil actualizado.");

  return normalizedProfile;
}
