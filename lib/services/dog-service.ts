import { supabase } from "@/lib/supabase/client";
import type { Dog } from "@/lib/supabase/database.types";

export type DogFormData = {
  nombre: string;
  peso: number | null;
  edad: string;
  tamaño: string;
  actividad: string;
  estado_fisico: string;
  photo_url?: string;
};

const DOG_SELECT =
  "id, created_at, nombre, peso, edad, tamaño, actividad, estado_fisico, user_id, photo_url";

export async function getDogsByUser(userId: string): Promise<Dog[]> {
  const { data, error } = await supabase
    .from("dogs")
    .select(DOG_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createDog(userId: string, dog: DogFormData): Promise<Dog> {
  const { data, error } = await supabase
    .from("dogs")
    .insert({
      user_id: userId,
      nombre: dog.nombre.trim(),
      peso: dog.peso,
      edad: dog.edad,
      tamaño: dog.tamaño,
      actividad: dog.actividad,
      estado_fisico: dog.estado_fisico,
      photo_url: dog.photo_url?.trim() || null,
    })
    .select(DOG_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDog(userId: string, dogId: string): Promise<void> {
  const { error } = await supabase
    .from("dogs")
    .delete()
    .eq("id", dogId)
    .eq("user_id", userId);

  if (error) throw error;
}
