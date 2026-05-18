import { supabase } from "@/lib/supabase/client";
import type { Dog } from "@/lib/supabase/database.types";
import { isMissingSchemaError } from "@/lib/supabase/schema-errors";

export type DogFormData = {
  nombre: string;
  peso: number | null;
  edad: string;
  tamaño: string;
  actividad: string;
  estado_fisico: string;
  photo_url?: string | null;
};

const DOG_SELECT =
  "id, created_at, nombre, peso, edad, tamaño, actividad, estado_fisico, user_id, photo_url";
const DOG_FALLBACK_SELECT =
  "id, created_at, nombre, peso, edad, tamaño, actividad, estado_fisico, user_id";

const optionalText = (value?: string | null) => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
};

const normalizeDog = (dog: Partial<Dog> & { id: string }): Dog => ({
  id: dog.id,
  created_at: dog.created_at ?? null,
  nombre: dog.nombre ?? "",
  peso: dog.peso ?? null,
  edad: dog.edad ?? null,
  tamaño: dog.tamaño ?? null,
  actividad: dog.actividad ?? null,
  estado_fisico: dog.estado_fisico ?? null,
  user_id: dog.user_id ?? "",
  photo_url: dog.photo_url ?? null,
});

export async function getDogsByUser(userId: string): Promise<Dog[]> {
  const { data, error } = await supabase
    .from("dogs")
    .select(DOG_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!error) return (data ?? []).map(normalizeDog);

  if (!isMissingSchemaError(error, "photo_url")) {
    throw error;
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("dogs")
    .select(DOG_FALLBACK_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (fallbackError) throw fallbackError;
  return (fallbackData ?? []).map(normalizeDog);
}

export async function createDog(userId: string, dog: DogFormData): Promise<Dog> {
  const dogPayload = {
    user_id: userId,
    nombre: dog.nombre.trim(),
    peso: dog.peso,
    edad: dog.edad,
    tamaño: dog.tamaño,
    actividad: dog.actividad,
    estado_fisico: dog.estado_fisico,
    photo_url: optionalText(dog.photo_url),
  };

  const { data, error } = await supabase
    .from("dogs")
    .insert(dogPayload)
    .select(DOG_SELECT)
    .single();

  if (!error) return normalizeDog(data);

  if (!isMissingSchemaError(error, "photo_url")) {
    throw error;
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("dogs")
    .insert({
      user_id: dogPayload.user_id,
      nombre: dogPayload.nombre,
      peso: dogPayload.peso,
      edad: dogPayload.edad,
      tamaño: dogPayload.tamaño,
      actividad: dogPayload.actividad,
      estado_fisico: dogPayload.estado_fisico,
    })
    .select(DOG_FALLBACK_SELECT)
    .single();

  if (fallbackError) throw fallbackError;
  return normalizeDog(fallbackData);
}

export async function deleteDog(userId: string, dogId: string): Promise<void> {
  const { error } = await supabase
    .from("dogs")
    .delete()
    .eq("id", dogId)
    .eq("user_id", userId);

  if (error) throw error;
}
