import { supabase } from "@/lib/supabase/client";
import {
  deleteMediaFile,
  getTrustedCommentMediaPath,
  type CommentMediaType,
} from "@/lib/services/storage-service";

export type CommentWithMeta = {
  id: number;
  created_at: string | null;
  user_id: string;
  body: string;
  media_url: string | null;
  media_type: CommentMediaType | null;
  author_name: string | null;
  author_avatar_url: string | null;
  likes_count: number;
  liked_by_current_user: boolean;
};

type CommentRow = {
  id: number;
  created_at?: string | null;
  user_id: string;
  content?: string | null;
  body?: string | null;
  comment?: string | null;
  media_url?: string | null;
  media_type?: string | null;
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
    body: row.content ?? row.body ?? row.comment ?? "",
    media_url: row.media_url ?? null,
    media_type:
      row.media_type === "image" || row.media_type === "video"
        ? row.media_type
        : null,
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

  let likes: { comment_id: number }[] = [];
  if (commentIds.length) {
    const { data, error } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .in("comment_id", commentIds);

    if (error) throw error;
    likes = (data ?? []) as { comment_id: number }[];
  }

  let currentUserLikes: { comment_id: number }[] = [];
  if (currentUserId && commentIds.length) {
    const { data, error } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .eq("user_id", currentUserId)
      .in("comment_id", commentIds);

    if (error) throw error;
    currentUserLikes = (data ?? []) as { comment_id: number }[];
  }

  const profilesById = new Map(
    profiles.map((profile) => [profile.id, profile]),
  );
  const likeCounts = new Map<number, number>();
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
  media?: { url: string; type: CommentMediaType },
): Promise<CommentWithMeta> {
  const cleanBody = body.trim();
  if (!cleanBody) {
    throw new Error("Escribe un comentario antes de publicarlo.");
  }

  if (media && (!media.url || !["image", "video"].includes(media.type))) {
    throw new Error("El archivo adjunto no es válido.");
  }

  const media_url = media?.url ?? null;
  const media_type = media?.type ?? null;
  const contentPayload = { user_id: userId, content: cleanBody, media_url, media_type };
  const bodyPayload = { user_id: userId, body: cleanBody, media_url, media_type };
  let data: unknown;

  const contentInsert = await supabase
    .from("comments")
    .insert(contentPayload as never)
    .select("*")
    .single();

  if (contentInsert.error && isMissingContentColumnError(contentInsert.error)) {
    const bodyInsert = await supabase
      .from("comments")
      .insert(bodyPayload as never)
      .select("*")
      .single();
    if (bodyInsert.error) throw bodyInsert.error;
    data = bodyInsert.data;
  } else if (contentInsert.error) {
    throw contentInsert.error;
  } else {
    data = contentInsert.data;
  }

  const [comment] = await getCommentMetadata([data as CommentRow], userId);
  return comment;
}

function isMissingContentColumnError(error: {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
}) {
  const errorText = `${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();
  return (
    (error.code === "42703" || error.code === "PGRST204") &&
    errorText.includes("content") &&
    (errorText.includes("column") || errorText.includes("schema cache"))
  );
}

export async function deleteComment(userId: string, commentId: number) {
  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId)
    .select("media_url, media_type")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("No se encontró la reseña o ya había sido eliminada.");
  }
  const deletedComment = data as {
    media_url?: string | null;
    media_type?: string | null;
  } | null;
  const mediaPath = getTrustedCommentMediaPath(deletedComment?.media_url, userId);
  if (!mediaPath) {
    return { cleanupError: null };
  }

  try {
    await deleteMediaFile(mediaPath);
    return { cleanupError: null };
  } catch (cleanupError) {
    return { cleanupError };
  }
}

export async function toggleCommentLike(userId: string, commentId: number) {
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

  const { error } = await supabase
    .from("comment_likes")
    .insert(payload);

  if (error) {
    if (error.code === "23505") return { liked: true };
    throw error;
  }
  return { liked: true };
}
