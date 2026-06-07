"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Heart, Send, UserRound } from "lucide-react";
import {
  createComment,
  deleteComment,
  listRecentComments,
  toggleCommentLike,
  type CommentWithMeta,
} from "@/lib/services/comment-service";
import {
  getSupabaseErrorMessage,
  logSupabaseError,
} from "@/lib/services/supabase-error";
import { useAuth } from "@/components/auth-provider";

const formatCommentDate = (createdAt: string | null) => {
  if (!createdAt) return "Ahora";
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(createdAt));
};

export function CommentsSection() {
  const { user, authLoading } = useAuth();
  const [comments, setComments] = useState<CommentWithMeta[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const refreshComments = useCallback(async (currentUserId?: string) => {
    const nextComments = await listRecentComments(50, currentUserId);
    setComments(nextComments);
  }, []);

  useEffect(() => {
    let mounted = true;

    if (authLoading) return () => {
      mounted = false;
    };

    setIsLoading(true);
    refreshComments(user?.id)
      .catch((error) => {
        if (!mounted) return;
        logSupabaseError("Cargar comentarios", error);
        setMessage(getSupabaseErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [authLoading, refreshComments, user?.id]);



  const commentsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(comments.length / commentsPerPage));
  const paginatedComments = useMemo(() => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    return comments.slice(startIndex, startIndex + commentsPerPage);
  }, [comments, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setMessage("Inicia sesión para publicar tu reseña.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const newComment = await createComment(user.id, commentBody);
      setComments((currentComments) => [newComment, ...currentComments]);
      setCurrentPage(1);
      setCommentBody("");
      setMessage("Reseña publicada correctamente.");
    } catch (error) {
      logSupabaseError("Crear comentario", error);
      setMessage(getSupabaseErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    if (!user) {
      setMessage("Inicia sesión para dar like.");
      return;
    }
    setMessage("");
    try {
      const { liked } = await toggleCommentLike(user.id, commentId);
      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                liked_by_current_user: liked,
                likes_count: Math.max(0, comment.likes_count + (liked ? 1 : -1)),
              }
            : comment,
        ),
      );
    } catch (error) {
      logSupabaseError("Cambiar like de comentario", error);
      setMessage(getSupabaseErrorMessage(error));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    setIsSaving(true);
    setMessage("");

    try {
      await deleteComment(user.id, commentId);
      setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
      setMessage("Reseña eliminada.");
    } catch (error) {
      logSupabaseError("Eliminar comentario", error);
      setMessage(getSupabaseErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="comentarios" className="relative overflow-hidden border-t border-border bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f7_100%)]">
      <Heart className="pointer-events-none absolute -right-10 top-20 h-40 w-40 rotate-12 text-foreground/[0.025]" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="fade-up mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">Reseñas reales</span>
          <h2 className="mt-2 ferox-display-title text-3xl sm:text-4xl md:text-5xl">Lo que dice la comunidad FEROX</h2>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4">
          {isLoading ? (
            <li className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">Cargando reseñas...</li>
          ) : comments.length > 0 ? (
            paginatedComments.map((comment) => (
              <li key={comment.id} className="soft-card-hover premium-transition overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-sm">
                <div className="relative bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.07),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f2f2f2_100%)] p-6 sm:p-7 lg:p-8">
                  <span className="absolute right-5 top-4 text-5xl leading-none text-foreground/10">“</span>
                  <blockquote className="relative max-w-3xl text-base leading-relaxed text-foreground sm:text-lg">
                    &ldquo;{comment.body}&rdquo;
                  </blockquote>
                </div>
                <div className="border-t border-border bg-muted/45 px-5 py-4 text-foreground sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 overflow-hidden rounded-full border border-border bg-background">
                        {comment.author_avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={comment.author_avatar_url} alt={comment.author_name ?? "Miembro FEROX"} className="h-full w-full object-cover" />
                        ) : (
                          <span className="grid h-full w-full place-items-center text-muted-foreground"><UserRound className="h-4 w-4" /></span>
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{comment.author_name ?? "Miembro FEROX"}</p>
                        <p className="text-xs text-muted-foreground">{formatCommentDate(comment.created_at)}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleToggleLike(comment.id)} disabled={!user} className="interactive-lift premium-transition inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-60">
                      <Heart className={`h-3.5 w-3.5 ${comment.liked_by_current_user ? "fill-current text-red-500" : ""}`} />
                      {comment.likes_count}
                    </button>
                  </div>
                  {user?.id === comment.user_id ? (
                    <button type="button" onClick={() => handleDeleteComment(comment.id)} disabled={isSaving} className="mt-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
                      Eliminar reseña
                    </button>
                  ) : null}
                </div>
              </li>
            ))
          ) : (
            <li className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">Aún no hay reseñas. Sé la primera persona en compartir su experiencia.</li>
          )}
        </ul>

        {comments.length > commentsPerPage ? (
          <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Paginación de reseñas">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
            >
              Siguiente
            </button>
          </nav>
        ) : null}

        <form className="mt-8 rounded-[1.75rem] border border-border bg-background p-4 shadow-sm sm:p-5" onSubmit={handleCommentSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Comentar
            <textarea
              disabled={!user || isSaving}
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder={user ? "Escribe tu reseña" : "Inicia sesión para publicar"}
              className="min-h-20 resize-none rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background"
            />
          </label>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!user || isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {isSaving ? "Publicando..." : "Publicar reseña"}
            </button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
