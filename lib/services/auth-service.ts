import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/database.types";

export type AuthMode = "login" | "signup";

export type ProfileForm = {
  username: string;
  fullName: string;
  avatarUrl?: string;
};

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

  if (data.user) {
    await upsertProfile(data.user, {
      username: email.split("@")[0] ?? "",
      fullName,
    });
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
    .select("id, username, full_name, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertProfile(
  user: User,
  profile: ProfileForm,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username: profile.username.trim() || null,
        full_name: profile.fullName.trim() || null,
        avatar_url: profile.avatarUrl?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id, username, full_name, avatar_url, created_at, updated_at")
    .single();

  if (error) throw error;
  return data;
}
