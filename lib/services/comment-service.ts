import { supabase } from "@/lib/supabase/client";

export async function listRecentComments(limit = 10) {
  const { data, error } = await supabase
    .from("comments")
    .select("id, created_at, user_id, body")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function createComment(userId: string, body: string) {
  const { data, error } = await supabase
    .from("comments")
    .insert({ user_id: userId, body: body.trim() })
    .select("id, created_at, user_id, body")
    .single();

  if (error) throw error;
  return data;
}

export async function toggleCommentLike(userId: string, commentId: string) {
  const { data: existingLike, error: findError } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("comment_id", commentId)
    .maybeSingle();

  if (findError) throw findError;

  if (existingLike) {
    const { error } = await supabase
      .from("comment_likes")
      .delete()
      .eq("id", existingLike.id)
      .eq("user_id", userId);

    if (error) throw error;
    return { liked: false };
  }

  const { error } = await supabase
    .from("comment_likes")
    .insert({ user_id: userId, comment_id: commentId });

  if (error) throw error;
  return { liked: true };
}
