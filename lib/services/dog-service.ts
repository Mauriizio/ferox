import { supabase } from "@/lib/supabase/client";
import type { Dog } from "@/lib/supabase/database.types";

export type DogFormData = {
  nombre: string;
  peso: number | null;
  edad: number | null;
  etapa_vida: string;
  tamano: string;
  actividad: string;
  estado_fisico: string;
  photo_url?: string | null;
};

type DogRow = Partial<Dog> & {
  id: string;
  nombre: string;
  user_id: string;
};

function normalizeDog(row: DogRow): Dog {
  return {
    id: row.id,
    created_at: row.created_at ?? null,
    nombre: row.nombre,
    peso: row.peso ?? null,
    edad: row.edad ?? null,
    etapa_vida: row.etapa_vida ?? null,
    tamano: row.tamano ?? null,
    actividad: row.actividad ?? null,
    estado_fisico: row.estado_fisico ?? null,
    user_id: row.user_id,
    photo_url: row.photo_url ?? null,
  };
}

export async function getDogsByUser(userId: string): Promise<Dog[]> {
  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DogRow[]).map(normalizeDog);
}

export async function createDog(
  userId: string,
  dog: DogFormData,
): Promise<Dog> {
  const payload = {
    user_id: userId,
    nombre: dog.nombre.trim(),
    peso: dog.peso,
    edad: dog.edad,
    etapa_vida: dog.etapa_vida,
    tamano: dog.tamano,
    actividad: dog.actividad,
    estado_fisico: dog.estado_fisico,
    photo_url: dog.photo_url?.trim() || null,
  };

  console.info("[FEROX dogs] create payload", payload);

  const { data, error } = await supabase
    .from("dogs")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return normalizeDog(data as DogRow);
}

export async function deleteDog(userId: string, dogId: string): Promise<void> {
  const { error } = await supabase
    .from("dogs")
    .delete()
    .eq("id", dogId)
    .eq("user_id", userId);

  if (error) throw error;
}
