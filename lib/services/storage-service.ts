import { supabase } from "@/lib/supabase/client";

const MEDIA_BUCKET = "media";
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type MediaFolder = "avatars" | "dogs" | "comments";

function slugifyFilenamePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getImageExtension(file: File) {
  const extensionFromType = IMAGE_EXTENSIONS[file.type];
  if (extensionFromType) return extensionFromType;

  const extensionFromName = file.name.split(".").pop()?.toLowerCase();
  if (
    extensionFromName &&
    ["jpg", "jpeg", "png", "webp", "gif"].includes(extensionFromName)
  ) {
    return extensionFromName === "jpeg" ? "jpg" : extensionFromName;
  }

  return null;
}

export function createImagePreview(file: File) {
  return URL.createObjectURL(file);
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
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen válido.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("La imagen supera el máximo permitido de 8 MB.");
  }

  const extension = getImageExtension(file);
  if (!extension) {
    throw new Error("Formato no soportado. Usa JPG, PNG, WEBP o GIF.");
  }

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
