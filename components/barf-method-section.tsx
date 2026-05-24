import { CheckCircle2 } from "lucide-react";

const composition = [
  { label: "Proteína", value: "70%" },
  { label: "Vísceras", value: "10%" },
  { label: "Verduras y frutas", value: "10%" },
  { label: "Hueso carnoso molido", value: "10%" },
];

const tips = [
  "Puedes complementar con huevitos 1-2 veces por semana según su tolerancia.",
  "Transición sugerida: mezcla progresiva de 10 días desde su alimento actual.",
  "Observa digestión y energía en los primeros días para ajustar porciones.",
];

export function BarfMethodSection() {
  return (
    <section className="border-t border-border bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.2em] text-background/60">Composición BARF</span>
          <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">No es solo carne molida</h2>
          <p className="mt-4 text-sm text-background/70 sm:text-base">Nuestro BARF combina proteína, vísceras, frutas/verduras y hueso carnoso molido para una base completa.</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {composition.map((item) => (
            <article key={item.label} className="rounded-2xl border border-background/20 bg-background/10 p-4 text-center">
              <p className="font-serif text-3xl font-bold">{item.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-background/70">{item.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-background/20 bg-background/10 p-4 sm:p-5">
          <h3 className="font-semibold">Consejos de complemento y transición</h3>
          <ul className="mt-3 grid gap-2">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-background/85">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
