import {
  calcularRacionBarf,
  type Actividad,
  type Edad,
  type EstadoFisico,
} from "@/lib/domain/feeding";
import type { Dog } from "@/lib/supabase/database.types";

function getEdad(value: string | null): Edad {
  return value === "cachorro" || value === "senior" ? value : "adulto";
}

function getActividad(value: string | null): Actividad {
  return value === "baja" || value === "alta" ? value : "moderada";
}

function getEstadoFisico(value: string | null): EstadoFisico {
  return value === "esterilizado" || value === "sobrepeso" ? value : "normal";
}

export function calculateDogFood(dog: Pick<Dog, "peso" | "etapa_vida" | "actividad" | "estado_fisico">) {
  return calcularRacionBarf({
    peso: dog.peso ?? 0,
    edad: getEdad(dog.etapa_vida),
    actividad: getActividad(dog.actividad),
    estadoFisico: getEstadoFisico(dog.estado_fisico),
  });
}
