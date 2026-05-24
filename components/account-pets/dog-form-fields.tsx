import type { Dispatch, SetStateAction } from "react";
import type { DogFormData } from "@/lib/services/dog-service";
import { dogFieldOptions } from "@/components/account-pets/constants";

type Props = {
  form: DogFormData;
  setForm: Dispatch<SetStateAction<DogFormData>>;
};

export function DogFormFields({ form, setForm }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-foreground">
        Nombre
        <input
          type="text"
          value={form.nombre}
          onChange={(event) =>
            setForm((current) => ({ ...current, nombre: event.target.value }))
          }
          placeholder="Ej: Rocco"
          className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
        />
      </label>
      <label className="text-sm font-medium text-foreground">
        Peso (kg)
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.1"
          value={form.peso ?? ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              peso: event.target.value ? Number(event.target.value) : null,
            }))
          }
          placeholder="Ej: 12.5"
          className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
        />
      </label>
      <label className="text-sm font-medium text-foreground">
        Edad (años)
        <input
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={form.edad ?? ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              edad: event.target.value
                ? Number.parseInt(event.target.value, 10)
                : null,
            }))
          }
          placeholder="Ej: 3"
          className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
        />
      </label>
      {dogFieldOptions.map(([field, label, options]) => (
        <label key={field} className="text-sm font-medium text-foreground">
          {label}
          <select
            value={String(form[field] ?? "")}
            onChange={(event) =>
              setForm((current) => ({ ...current, [field]: event.target.value }))
            }
            className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
