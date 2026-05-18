import { supabase } from "@/lib/supabase/client";

export type CommentWithMeta = {
  id: string;
  created_at: string | null;
  user_id: string;
  body: string;
  author_name: string | null;
  author_avatar_url: string | null;
  likes_count: number;
  liked_by_current_user: boolean;
};

type CommentRow = {
  id: string;
  created_at?: string | null;
  user_id: string;
  body?: string | null;
  comment?: string | null;
};

type ProfileRow = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
};

function normalizeComment(
  row: CommentRow,
): Omit<
  CommentWithMeta,
  "author_name" | "author_avatar_url" | "likes_count" | "liked_by_current_user"
> {
  return {
    id: row.id,
    created_at: row.created_at ?? null,
    user_id: row.user_id,
    body: row.body ?? row.comment ?? "",
  };
}

async function getCommentMetadata(
  comments: CommentRow[],
  currentUserId?: string,
): Promise<CommentWithMeta[]> {
  const normalizedComments = comments.map(normalizeComment);
  const commentIds = normalizedComments.map((comment) => comment.id);
  const userIds = Array.from(
    new Set(normalizedComments.map((comment) => comment.user_id)),
  );

  let profiles: ProfileRow[] = [];
  if (userIds.length) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);

    if (error) throw error;
    profiles = (data ?? []) as ProfileRow[];
  }

  let likes: { comment_id: string }[] = [];
  if (commentIds.length) {
    const { data, error } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .in("comment_id", commentIds);

    if (error) throw error;
    likes = (data ?? []) as { comment_id: string }[];
  }

  let currentUserLikes: { comment_id: string }[] = [];
  if (currentUserId && commentIds.length) {
    const { data, error } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .eq("user_id", currentUserId)
      .in("comment_id", commentIds);

    if (error) throw error;
    currentUserLikes = (data ?? []) as { comment_id: string }[];
  }

  const profilesById = new Map(
    profiles.map((profile) => [profile.id, profile]),
  );
  const likeCounts = new Map<string, number>();
  for (const like of likes) {
    likeCounts.set(like.comment_id, (likeCounts.get(like.comment_id) ?? 0) + 1);
  }
  const likedCommentIds = new Set(
    currentUserLikes.map((like) => like.comment_id),
  );

  return normalizedComments.map((comment) => {
    const profile = profilesById.get(comment.user_id);

    return {
      ...comment,
      author_name: profile?.full_name || profile?.username || null,
      author_avatar_url: profile?.avatar_url ?? null,
      likes_count: likeCounts.get(comment.id) ?? 0,
      liked_by_current_user: likedCommentIds.has(comment.id),
    };
  });
}

export async function listRecentComments(
  limit = 10,
  currentUserId?: string,
): Promise<CommentWithMeta[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return getCommentMetadata((data ?? []) as CommentRow[], currentUserId);
}

export async function createComment(
  userId: string,
  body: string,
): Promise<CommentWithMeta> {
  const cleanBody = body.trim();
  if (!cleanBody) {
    throw new Error("Escribe un comentario antes de publicarlo.");
  }

  const payload = { user_id: userId, body: cleanBody };
  console.info("[FEROX comments] create payload", payload);

  const { data, error } = await supabase
    .from("comments")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;

  const [comment] = await getCommentMetadata([data as CommentRow], userId);
  return comment;
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

  const payload = { user_id: userId, comment_id: commentId };
  console.info("[FEROX comment_likes] create payload", payload);

  const { error } = await supabase
    .from("comment_likes")
    .insert(payload);

  if (error) {
    if (error.code === "23505") return { liked: true };
    throw error;
  }
  return { liked: true };
}
