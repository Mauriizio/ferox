import type { DogFormData } from "@/lib/services/dog-service";

export const imageInputClassName =
  "mt-2 block w-full cursor-pointer rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10";

export const dogFieldOptions: [keyof DogFormData, string, string[]][] = [
  ["etapa_vida", "Etapa de vida", ["cachorro", "adulto", "senior"]],
  ["tamano", "Talla", ["pequeño", "mediano", "grande"]],
  ["actividad", "Actividad", ["baja", "moderada", "alta"]],
  ["estado_fisico", "Estado físico", ["normal", "esterilizado", "sobrepeso"]],
];
