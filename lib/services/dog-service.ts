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


const getDogDiagnosticTime = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

const getDogDiagnosticDurationMs = (startedAt: number) =>
  Math.round((getDogDiagnosticTime() - startedAt) * 100) / 100;

function logCreateDogDiagnostic(
  event: string,
  details: Record<string, unknown> = {},
) {
  console.info("[FEROX createDog diagnóstico]", {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

function logCreateDogError(
  event: string,
  details: Record<string, unknown> = {},
) {
  console.error("[FEROX createDog diagnóstico]", {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

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
  const createDogStartedAt = getDogDiagnosticTime();
  let insertStartedAt = createDogStartedAt;
  let insertErrorLogged = false;

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

  logCreateDogDiagnostic("createDog:start", {
    user_id: payload.user_id,
    nombre: payload.nombre,
  });

  console.info("[FEROX dogs] create payload", payload);

  try {
    insertStartedAt = getDogDiagnosticTime();
    logCreateDogDiagnostic("before insert", {
      durationMs: getDogDiagnosticDurationMs(createDogStartedAt),
      user_id: payload.user_id,
      nombre: payload.nombre,
    });

    const { data, error } = await supabase
      .from("dogs")
      .insert(payload)
      .select("*")
      .single();

    logCreateDogDiagnostic("after insert response", {
      durationMs: getDogDiagnosticDurationMs(insertStartedAt),
      totalDurationMs: getDogDiagnosticDurationMs(createDogStartedAt),
      user_id: payload.user_id,
      nombre: payload.nombre,
      dogId: (data as DogRow | null)?.id ?? null,
      hasError: Boolean(error),
    });

    if (error) {
      logCreateDogError("insert error", {
        durationMs: getDogDiagnosticDurationMs(insertStartedAt),
        totalDurationMs: getDogDiagnosticDurationMs(createDogStartedAt),
        user_id: payload.user_id,
        nombre: payload.nombre,
        dogId: (data as DogRow | null)?.id ?? null,
        error,
      });
      insertErrorLogged = true;
      throw error;
    }

    const normalizedDog = normalizeDog(data as DogRow);
    logCreateDogDiagnostic("before return", {
      durationMs: getDogDiagnosticDurationMs(createDogStartedAt),
      user_id: payload.user_id,
      nombre: payload.nombre,
      dogId: normalizedDog.id,
    });

    return normalizedDog;
  } catch (error) {
    if (!insertErrorLogged) {
      logCreateDogError("insert error", {
        durationMs: getDogDiagnosticDurationMs(insertStartedAt),
        totalDurationMs: getDogDiagnosticDurationMs(createDogStartedAt),
        user_id: payload.user_id,
        nombre: payload.nombre,
        error,
      });
    }
    throw error;
  } finally {
    logCreateDogDiagnostic("finally", {
      durationMs: getDogDiagnosticDurationMs(createDogStartedAt),
      user_id: payload.user_id,
      nombre: payload.nombre,
    });
  }
}

export async function deleteDog(userId: string, dogId: string): Promise<void> {
  const { error } = await supabase
    .from("dogs")
    .delete()
    .eq("id", dogId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function updateDog(
  userId: string,
  dogId: string,
  dog: DogFormData,
): Promise<Dog> {
  const payload = {
    nombre: dog.nombre.trim(),
    peso: dog.peso,
    edad: dog.edad,
    etapa_vida: dog.etapa_vida,
    tamano: dog.tamano,
    actividad: dog.actividad,
    estado_fisico: dog.estado_fisico,
    photo_url: dog.photo_url?.trim() || null,
  };

  const { data, error } = await supabase
    .from("dogs")
    .update(payload)
    .eq("id", dogId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return normalizeDog(data as DogRow);
}
