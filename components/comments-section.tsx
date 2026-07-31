"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Heart, ImagePlus, Send, UserRound, X } from "lucide-react";
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
import {
  createImagePreview,
  deleteMediaFile,
  getTrustedCommentMediaPath,
  uploadCommentMedia,
  validateCommentMediaFile,
  validateVideoDuration,
  type CommentMediaType,
} from "@/lib/services/storage-service";

const formatCommentDate = (createdAt: string | null) => {
  if (!createdAt) return "Ahora";
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(createdAt));
};

function CommentMedia({ comment }: { comment: CommentWithMeta }) {
  if (!comment.media_url || !comment.media_type) return null;
  if (!getTrustedCommentMediaPath(comment.media_url, comment.user_id)) return null;

  return (
    <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-900">
      {comment.media_type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={comment.media_url} alt="Imagen adjunta a la reseña" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <video src={comment.media_url} controls preload="metadata" playsInline className="h-full w-full object-contain" aria-label="Video adjunto a la reseña" />
      )}
    </div>
  );
}

export function CommentsSection() {
  const { user, authLoading } = useAuth();
  const [comments, setComments] = useState<CommentWithMeta[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<CommentMediaType | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isValidatingMedia, setIsValidatingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMediaBusy = isSaving || isValidatingMedia;

  useEffect(() => {
    return () => {
      if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    };
  }, [mediaPreview]);

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

    if (!commentBody.trim()) {
      setMessage("Escribe una reseña antes de publicarla.");
      return;
    }

    if (mediaFile) {
      try {
        const validatedMedia = validateCommentMediaFile(mediaFile);
        if (validatedMedia.mediaType !== mediaType) {
          throw new Error("El tipo del archivo adjunto no es válido.");
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "El archivo no es válido.");
        return;
      }
    }

    setIsSaving(true);
    setMessage("");
    let uploadedMedia: { publicUrl: string; mediaType: CommentMediaType } | null = null;
    let cleanupPending = false;

    try {
      if (mediaFile) {
        uploadedMedia = await uploadCommentMedia({
          file: mediaFile,
          userId: user.id,
        });
      }

      let newComment: CommentWithMeta;
      try {
        newComment = await createComment(
          user.id,
          commentBody,
          uploadedMedia
            ? { url: uploadedMedia.publicUrl, type: uploadedMedia.mediaType }
            : undefined,
        );
      } catch (insertError) {
        const uploadedPath = getTrustedCommentMediaPath(uploadedMedia?.publicUrl, user.id);
        if (uploadedPath) {
          try {
            await deleteMediaFile(uploadedPath);
          } catch (cleanupError) {
            logSupabaseError("Limpiar archivo tras fallo al crear comentario", cleanupError);
            cleanupPending = true;
          }
        }
        throw insertError;
      }

      setComments((currentComments) => [newComment, ...currentComments]);
      setCurrentPage(1);
      setCommentBody("");
      setMediaFile(null);
      setMediaType(null);
      setMediaPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("Reseña publicada correctamente.");
    } catch (error) {
      logSupabaseError("Crear comentario", error);
      const publishError = getSupabaseErrorMessage(error);
      setMessage(
        cleanupPending
          ? `${publishError} Además, el archivo subido quedó pendiente de limpieza.`
          : publishError,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    setIsValidatingMedia(true);
    setMessage("Validando archivo...");
    try {
      const validatedMedia = validateCommentMediaFile(file);
      if (validatedMedia.mediaType === "video") {
        setMessage("Validando duración del video...");
        await validateVideoDuration(file);
      }
      setMediaFile(file);
      setMediaType(validatedMedia.mediaType);
      setMediaPreview(createImagePreview(file));
      setMessage("");
    } catch (error) {
      event.target.value = "";
      setMessage(error instanceof Error ? error.message : "El archivo no es válido.");
    } finally {
      setIsValidatingMedia(false);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaType(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleToggleLike = async (commentId: number) => {
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

  const handleDeleteComment = async (commentId: number) => {
    if (!user) return;
    setIsSaving(true);
    setMessage("");

    try {
      const { cleanupError } = await deleteComment(user.id, commentId);
      setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
      if (cleanupError) {
        logSupabaseError("Limpiar archivo de comentario eliminado", cleanupError);
        setMessage("Reseña eliminada. No fue posible limpiar su archivo del almacenamiento; quedó limpieza pendiente.");
      } else {
        setMessage("Reseña eliminada.");
      }
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
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div data-reveal className="fade-up mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">Reseñas reales</span>
          <h2 className="mt-2 ferox-display-title text-3xl sm:text-4xl">Lo que dice la comunidad FEROX</h2>
        </div>

        <form className="mt-8 w-full rounded-[1.75rem] border border-border bg-background p-4 shadow-sm sm:p-5" onSubmit={handleCommentSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Comentar
            <textarea
              required
              disabled={!user || isMediaBusy}
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder={user ? "Escribe tu reseña" : "Inicia sesión para publicar"}
              className="min-h-20 resize-none rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background"
            />
          </label>
          <div className="mt-3 rounded-2xl border border-dashed border-border bg-muted/20 p-3">
            <input
              ref={fileInputRef}
              id="comment-media"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
              disabled={!user || isMediaBusy}
              onChange={handleMediaChange}
              className="sr-only"
            />
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="comment-media"
                aria-disabled={!user || isMediaBusy}
                className={`inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition ${
                  !user || isMediaBusy ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-muted"
                }`}
              >
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                {isValidatingMedia
                  ? "Validando archivo..."
                  : isSaving
                    ? "Publicando..."
                    : mediaFile
                      ? "Reemplazar foto o video"
                      : "Agregar foto o video"}
              </label>
              <p className="text-xs text-muted-foreground">Un archivo: JPG, PNG, WEBP o GIF hasta 5 MB; MP4, MOV o WebM hasta 20 MB y 20 segundos.</p>
            </div>
            {mediaPreview && mediaType ? (
              <div className="mt-3 max-w-sm">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  {mediaType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaPreview} alt="Vista previa de la imagen seleccionada" className="h-full w-full object-cover" />
                  ) : (
                    <video src={mediaPreview} controls preload="metadata" playsInline className="h-full w-full object-contain" aria-label="Vista previa del video seleccionado" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeMedia}
                  disabled={isMediaBusy}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-60"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Quitar archivo
                </button>
              </div>
            ) : null}
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!user || isMediaBusy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {isValidatingMedia ? "Validando..." : isSaving ? "Publicando..." : "Publicar reseña"}
            </button>
            <p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">{message}</p>
          </div>
        </form>

        <ul className="mt-6 grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {isLoading ? (
            <li className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">Cargando reseñas...</li>
          ) : comments.length > 0 ? (
            paginatedComments.map((comment) => (
              <li key={comment.id} data-reveal className="soft-card-hover premium-transition h-fit self-start overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-sm">
                <div className="relative bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.07),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f2f2f2_100%)] p-5">
                  <span className="absolute right-4 top-3 text-4xl leading-none text-foreground/10">“</span>
                  <blockquote className="relative break-words pr-5 text-sm leading-relaxed text-foreground sm:text-base">
                    &ldquo;{comment.body}&rdquo;
                  </blockquote>
                  <CommentMedia comment={comment} />
                </div>
                <div className="border-t border-border bg-muted/45 px-4 py-3 text-foreground">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-background">
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
            <li className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">Aún no hay reseñas. Sé la primera persona en compartir su experiencia.</li>
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

      </div>
    </section>
  );
}
