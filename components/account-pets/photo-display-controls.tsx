export type DogPhotoDisplaySettings = {
  fit: "contain" | "cover";
  position: "center" | "top";
  zoom: number;
};

type Props = {
  value: DogPhotoDisplaySettings;
  onChange: (value: DogPhotoDisplaySettings) => void;
};

const fitOptions: Array<{ value: DogPhotoDisplaySettings["fit"]; label: string }> = [
  { value: "contain", label: "Foto completa" },
  { value: "cover", label: "Rellenar" },
];

const positionOptions: Array<{ value: DogPhotoDisplaySettings["position"]; label: string }> = [
  { value: "center", label: "Centro" },
  { value: "top", label: "Arriba" },
];

export function PhotoDisplayControls({ value, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ajuste de foto en tarjeta</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Formato</p>
          <div className="flex flex-wrap gap-2">
            {fitOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...value, fit: option.value })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  value.fit === option.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Enfoque</p>
          <div className="flex flex-wrap gap-2">
            {positionOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...value, position: option.value })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  value.position === option.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <label className="mt-3 grid gap-2 text-xs font-semibold text-foreground">
        Zoom: {value.zoom}%
        <input
          type="range"
          min="100"
          max="160"
          step="5"
          value={value.zoom}
          onChange={(event) => onChange({ ...value, zoom: Number(event.target.value) })}
          className="w-full accent-foreground"
        />
      </label>
    </div>
  );
}
