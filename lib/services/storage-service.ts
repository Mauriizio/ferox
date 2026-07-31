import { supabase } from "@/lib/supabase/client";

const MEDIA_BUCKET = "media";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_DURATION_SECONDS = 20;

const IMAGE_EXTENSIONS: Record<string, readonly string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
};

const VIDEO_EXTENSIONS: Record<string, readonly string[]> = {
  "video/mp4": ["mp4"],
  "video/quicktime": ["mov"],
  "video/webm": ["webm"],
};

export type MediaFolder = "avatars" | "dogs" | "comments";
export type CommentMediaType = "image" | "video";

function slugifyFilenamePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? null;
}

export function createImagePreview(file: File) {
  return URL.createObjectURL(file);
}

export function validateImageFile(file: File) {
  const allowedExtensions = IMAGE_EXTENSIONS[file.type];
  const extension = getFileExtension(file);
  if (!allowedExtensions || !extension || !allowedExtensions.includes(extension)) {
    throw new Error("Formato no soportado. Usa JPG, PNG, WEBP o GIF.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("La imagen supera el máximo permitido de 5 MB.");
  }

  return extension === "jpeg" ? "jpg" : extension;
}

export function validateCommentMediaFile(file: File): {
  mediaType: CommentMediaType;
  extension: string;
} {
  const extension = getFileExtension(file);
  const imageExtensions = IMAGE_EXTENSIONS[file.type];
  if (imageExtensions) {
    if (!extension || !imageExtensions.includes(extension)) {
      throw new Error("El MIME y la extensión de la imagen no coinciden.");
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error("La imagen supera el máximo permitido de 5 MB.");
    }
    return {
      mediaType: "image",
      extension: extension === "jpeg" ? "jpg" : extension,
    };
  }

  const videoExtensions = VIDEO_EXTENSIONS[file.type];
  if (videoExtensions) {
    if (!extension || !videoExtensions.includes(extension)) {
      throw new Error("El MIME y la extensión del video no coinciden.");
    }
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      throw new Error("El video supera el máximo permitido de 20 MB.");
    }
    return { mediaType: "video", extension };
  }

  throw new Error("Formato no soportado. Usa JPG, PNG, WEBP, GIF, MP4, MOV o WebM.");
}

export async function validateVideoDuration(file: File) {
  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      const video = document.createElement("video");
      let settled = false;
      let timeoutId: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        clearTimeout(timeoutId);
        video.onloadedmetadata = null;
        video.onerror = null;
        video.removeAttribute("src");
        video.load();
      };

      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      };

      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = video.duration;
        if (
          !Number.isFinite(duration) ||
          duration <= 0 ||
          duration > MAX_VIDEO_DURATION_SECONDS
        ) {
          finish(new Error("El video debe durar máximo 20 segundos."));
          return;
        }
        finish();
      };
      video.onerror = () => finish(new Error("No se pudo leer la duración del video. Prueba con otro archivo."));
      timeoutId = setTimeout(
        () => finish(new Error("No se pudo leer la duración del video. Prueba con otro archivo.")),
        10_000,
      );
      video.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function uploadImageToMediaBucket({
  file,
  userId,
  folder,
}: {
  file: File;
  userId: string;
  folder: MediaFolder;
}) {
  const extension = validateImageFile(file);

  const safeName =
    slugifyFilenamePart(file.name.replace(/\.[^.]+$/, "")) || "imagen";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${folder}/${userId}/${Date.now()}-${uniqueId}-${safeName}.${extension}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadCommentMedia({
  file,
  userId,
}: {
  file: File;
  userId: string;
}) {
  const { mediaType, extension } = validateCommentMediaFile(file);
  const safeName =
    slugifyFilenamePart(file.name.replace(/\.[^.]+$/, "")) || "archivo";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `comments/${userId}/${Date.now()}-${uniqueId}-${safeName}.${extension}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, mediaType };
}

export function getMediaPathFromPublicUrl(publicUrl: string | null | undefined) {
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    if (!url.pathname.startsWith(marker)) return null;

    return decodeURIComponent(url.pathname.slice(marker.length));
  } catch {
    return null;
  }
}

export function getTrustedCommentMediaPath(
  publicUrl: string | null | undefined,
  userId: string,
) {
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    const expectedUrl = new URL(
      supabase.storage.from(MEDIA_BUCKET).getPublicUrl("").data.publicUrl,
    );
    if (url.protocol !== "https:" || url.origin !== expectedUrl.origin) return null;

    const path = getMediaPathFromPublicUrl(publicUrl);
    if (!path) return null;
    const segments = path.split("/");
    if (
      segments.length !== 3 ||
      segments[0] !== "comments" ||
      segments[1] !== userId ||
      !segments[2] ||
      segments[2] === "." ||
      segments[2] === ".."
    ) {
      return null;
    }
    return path;
  } catch {
    return null;
  }
}

export async function deleteMediaFile(path: string) {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw error;
}
