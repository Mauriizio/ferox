import { Camera, Pencil, Trash2 } from "lucide-react";
import { calculateDogFood } from "@/lib/helpers/calculate-dog-food";
import type { Dog } from "@/lib/supabase/database.types";

type Props = {
  dog: Dog;
  onEdit: (dog: Dog) => void;
  onDelete: (dog: Dog) => void;
};

export function DogCard({ dog, onEdit, onDelete }: Props) {
  const recommendation = calculateDogFood(dog);

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-muted/30">
      <div className="relative h-36 bg-foreground/5">
        {dog.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dog.photo_url} alt={dog.nombre} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Camera className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-foreground">{dog.nombre}</p>
            <p className="text-sm text-muted-foreground">
              {dog.peso ? `${dog.peso} kg · ` : ""}
              {dog.tamano || "sin talla"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(dog)}
              className="inline-flex h-9 items-center gap-1 rounded-full bg-background px-3 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(dog)}
              className="grid h-9 w-9 place-items-center rounded-full bg-background text-muted-foreground transition hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[dog.edad ? `${dog.edad} año${dog.edad === 1 ? "" : "s"}` : null, dog.etapa_vida, dog.actividad, dog.estado_fisico]
            .filter(Boolean)
            .map((tag) => (
              <span key={tag} className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                {tag}
              </span>
            ))}
        </div>

        <div className="mt-4 rounded-2xl bg-background p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cantidad calculada</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{recommendation.gramosDia} g/día</p>
          <p className="text-sm text-muted-foreground">
            {(recommendation.gramosMes / 1000).toLocaleString("es-CL", { maximumFractionDigits: 1 })} kg/mes
          </p>
        </div>
      </div>
    </article>
  );
}
