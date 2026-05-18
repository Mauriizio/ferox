"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Heart,
  MessageSquareHeart,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import {
  createComment,
  listRecentComments,
  toggleCommentLike,
  type CommentWithMeta,
} from "@/lib/services/comment-service";
import {
  getSupabaseErrorMessage,
  logSupabaseError,
} from "@/lib/services/supabase-error";

const backendSteps = [
  "Usuarios autenticados pueden comentar",
  "Comentarios guardados en Supabase",
  "Likes protegidos contra duplicados",
];

const formatCommentDate = (createdAt: string | null) => {
  if (!createdAt) return "Ahora";

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(createdAt));
};

export function CommentsSection() {
  const [session, setSession] = useState<Session | null>(null);
  const [comments, setComments] = useState<CommentWithMeta[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const user = session?.user ?? null;

  const refreshComments = useCallback(async (currentUserId?: string) => {
    if (!currentUserId) {
      setComments([]);
      return;
    }

    const nextComments = await listRecentComments(12, currentUserId);
    setComments(nextComments);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadComments() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted) return;

        setSession(data.session);
        await refreshComments(data.session?.user.id);
      } catch (error) {
        logSupabaseError("Cargar comentarios", error);
        setMessage(getSupabaseErrorMessage(error));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadComments();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        refreshComments(nextSession?.user.id).catch((error) => {
          logSupabaseError("Refrescar comentarios después de auth", error);
          setMessage(getSupabaseErrorMessage(error));
        });
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [refreshComments]);

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setMessage("Inicia sesión en Cuenta FEROX para comentar.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user || userData.user.id !== user.id) {
        throw new Error("No hay una sesión autenticada válida para comentar.");
      }

      const newComment = await createComment(userData.user.id, commentBody);
      setComments((currentComments) => [newComment, ...currentComments]);
      setCommentBody("");
      setMessage("Comentario publicado correctamente.");
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
                likes_count: Math.max(
                  0,
                  comment.likes_count + (liked ? 1 : -1),
                ),
              }
            : comment,
        ),
      );
    } catch (error) {
      logSupabaseError("Cambiar like de comentario", error);
      setMessage(getSupabaseErrorMessage(error));
    }
  };

  return (
    <section id="comentarios" className="border-t border-border bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <MessageSquareHeart
                className="h-4 w-4 text-foreground"
                aria-hidden="true"
              />
              Comentarios
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
              La comunidad FEROX ya puede contar su experiencia.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Inicia sesión en Cuenta FEROX, comparte tu experiencia con BARF y
              apoya otros comentarios con likes únicos por usuario.
            </p>

            <ul className="mt-6 grid gap-3">
              {backendSteps.map((step) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-sm font-semibold text-foreground shadow-sm"
                >
                  <ShieldCheck
                    className="h-4 w-4 flex-none"
                    aria-hidden="true"
                  />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-background p-4 shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Deja tu comentario
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user
                    ? `Publicando como ${user.email ?? "usuario autenticado"}.`
                    : "Inicia sesión en Cuenta FEROX para publicar y dar like."}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Activo
              </span>
            </div>

            {message ? (
              <div className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm font-medium text-foreground">
                {message}
              </div>
            ) : null}

            <form
              className="mt-5 grid gap-3"
              aria-label="Formulario de comentarios"
              onSubmit={handleCommentSubmit}
            >
              <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                Comentario
                <textarea
                  disabled={!user || isSaving}
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  placeholder={
                    user
                      ? "Cuéntanos cómo le fue con FEROX BARF"
                      : "Inicia sesión para comentar"
                  }
                  className="min-h-28 resize-none rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </label>
              <button
                type="submit"
                disabled={!user || isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {isSaving ? "Publicando..." : "Publicar comentario"}
              </button>
            </form>

            <div className="mt-6 grid gap-3">
              {isLoading ? (
                <div className="rounded-2xl border border-border bg-muted/45 p-4 text-sm text-muted-foreground">
                  Cargando comentarios...
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <article
                    key={comment.id}
                    className="rounded-2xl border border-border bg-muted/45 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 overflow-hidden rounded-full bg-foreground text-background">
                          {comment.author_avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={comment.author_avatar_url}
                              alt={comment.author_name ?? "Usuario FEROX"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="grid h-full w-full place-items-center">
                              <UserRound
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </span>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {comment.author_name ?? "Usuario FEROX"}
                          </h4>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {formatCommentDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleLike(comment.id)}
                        disabled={!user}
                        className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Dar like al comentario"
                      >
                        <Heart
                          className={`h-4 w-4 ${comment.liked_by_current_user ? "fill-current text-red-500" : ""}`}
                          aria-hidden="true"
                        />
                        {comment.likes_count}
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {comment.body}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Aún no hay comentarios. Sé la primera persona en compartir tu
                  experiencia.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
