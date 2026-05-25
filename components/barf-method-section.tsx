import { CheckCircle2, Droplets, Egg, Leaf, Wheat } from "lucide-react";

const composition = [
  { label: "Proteína", value: "70%" },
  { label: "Vísceras", value: "10%" },
  { label: "Verduras y frutas", value: "10%" },
  { label: "Hueso carnoso molido", value: "10%" },
];

const ingredients = [
  "Proteínas de origen animal",
  "Vísceras seleccionadas",
  "Verduras y frutas aptas para perros",
  "Hueso carnoso molido como fuente natural de minerales",
];

const complements = [
  {
    icon: Egg,
    title: "Huevitos",
    detail: "1 a 2 por semana, según talla y tolerancia.",
  },
  {
    icon: Droplets,
    title: "Aceites buenos",
    detail: "Omega 3 o un toque de aceite de oliva para piel y pelaje.",
  },
  {
    icon: Wheat,
    title: "Avena opcional",
    detail: "Puede ayudar a la saciedad si tu perro la tolera bien.",
  },
  {
    icon: Leaf,
    title: "Extras naturales",
    detail: "Introduce nuevos complementos de forma gradual.",
  },
];

const transitionPhases = [
  { days: "Día 1 – 3", barf: 25, current: 75 },
  { days: "Día 4 – 6", barf: 50, current: 50 },
  { days: "Día 7 – 9", barf: 75, current: 25 },
  { days: "Día 10", barf: 100, current: 0 },
];

export function BarfMethodSection() {
  return (
    <section className="border-t border-border bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-background/60">¿Qué es BARF?</span>
          <h2 className="mt-3 ferox-display-title text-3xl sm:text-4xl md:text-5xl">Comida real, balanceada y completa</h2>
          <p className="mt-4 text-sm text-background/75 sm:text-base">
            BARF combina proteína, vísceras, frutas/verduras y hueso carnoso molido para construir una base nutricional
            completa para tu perro.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {composition.map((item) => (
            <article key={item.label} className="rounded-2xl border border-background/20 bg-background/10 p-4 text-center">
              <p className="font-serif text-3xl font-bold">{item.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-background/70">{item.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-background/20 bg-background/10 p-4 sm:grid-cols-2 sm:p-5">
          {ingredients.map((ingredient) => (
            <div key={ingredient} className="flex items-start gap-2 text-sm text-background/90">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{ingredient}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <article className="rounded-2xl border border-background/20 bg-background/10 p-4 sm:p-5">
            <h3 className="font-semibold">Complementa su alimentación</h3>
            <p className="mt-1 text-sm text-background/70">Además del BARF, puedes sumar extras simples para variar su nutrición.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {complements.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl border border-background/15 bg-background/5 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </div>
                    <p className="mt-1 text-xs text-background/70 sm:text-sm">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-background/20 bg-background/10 p-4 sm:p-5">
            <h3 className="font-semibold">Transición sugerida (10 días)</h3>
            <p className="mt-1 text-sm text-background/70">Haz el cambio progresivo para cuidar digestión y adaptación.</p>
            <ol className="mt-4 space-y-3">
              {transitionPhases.map((phase) => (
                <li key={phase.days}>
                  <div className="mb-1 flex items-center justify-between text-xs text-background/70">
                    <span>{phase.days}</span>
                    <span>
                      BARF {phase.barf}% · Actual {phase.current}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-background/20">
                    <div className="h-full bg-background" style={{ width: `${phase.barf}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </div>
    </section>
  );
}
