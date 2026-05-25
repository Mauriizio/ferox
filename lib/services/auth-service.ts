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

  if (error) {
    console.error("[auth] getSession error", error);
    const message = `${error.message ?? ""}`.toLowerCase();
    if (message.includes("refresh token") && message.includes("not found")) {
      await supabase.auth.signOut({ scope: "local" });
      console.info("[auth] sesión local corrupta limpiada");
      return null;
    }
    throw error;
  }

  console.info("[auth] session encontrada", {
    hasSession: Boolean(data.session),
    userId: data.session?.user?.id ?? null,
  });

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
          ? window.location.origin
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


export async function recoverSessionFromOAuthUrl() {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const hasCode = url.searchParams.has("code");
  const hasOauthState = url.searchParams.has("state");

  if (!hasCode || !hasOauthState) return null;

  console.info("[auth] oauth callback recibido", { pathname: url.pathname });

  const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
  if (error) {
    console.error("[auth] error al intercambiar código OAuth", error);
    throw error;
  }

  url.searchParams.delete("code");
  url.searchParams.delete("state");
  url.searchParams.delete("scope");
  url.searchParams.delete("authuser");
  url.searchParams.delete("prompt");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);

  console.info("[auth] sesión restaurada desde callback OAuth", {
    userId: data.session?.user?.id ?? null,
  });

  return data.session ?? null;
}
