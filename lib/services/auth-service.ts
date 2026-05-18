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

const PROFILE_SELECT = "id, username, full_name, avatar_url, created_at, updated_at";
const PROFILE_FALLBACK_SELECT = "id, username, full_name";

const optionalText = (value?: string | null) => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
};

const normalizeProfile = (profile: Partial<Profile> & { id: string }): Profile => ({
  id: profile.id,
  username: profile.username ?? null,
  full_name: profile.full_name ?? null,
  avatar_url: profile.avatar_url ?? null,
  created_at: profile.created_at ?? null,
  updated_at: profile.updated_at ?? null,
});

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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/#cuenta`
          : undefined,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (!error) return data ? normalizeProfile(data) : null;

  if (!isMissingSchemaError(error, ["avatar_url", "updated_at", "created_at"])) {
    throw error;
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("profiles")
    .select(PROFILE_FALLBACK_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (fallbackError) throw fallbackError;
  return fallbackData ? normalizeProfile(fallbackData) : null;
}

export async function upsertProfile(
  user: User,
  profile: ProfileForm,
): Promise<Profile> {
  const profilePayload = {
    id: user.id,
    username: optionalText(profile.username),
    full_name: optionalText(profile.fullName),
    avatar_url: optionalText(profile.avatarUrl),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" })
    .select(PROFILE_SELECT)
    .single();

  if (!error) return normalizeProfile(data);

  if (!isMissingSchemaError(error, ["avatar_url", "updated_at", "created_at"])) {
    throw error;
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: profilePayload.id,
        username: profilePayload.username,
        full_name: profilePayload.full_name,
      },
      { onConflict: "id" },
    )
    .select(PROFILE_FALLBACK_SELECT)
    .single();

  if (fallbackError) throw fallbackError;
  return normalizeProfile(fallbackData);
}
