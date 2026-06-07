import { AlertTriangle, CheckCircle2, Clock, Stethoscope } from "lucide-react";

const transitionPhases = [
  { days: "Día 1 – 3", barf: 25, current: 75 },
  { days: "Día 4 – 6", barf: 50, current: 50 },
  { days: "Día 7 – 9", barf: 75, current: 25 },
  { days: "Día 10", barf: 100, current: 0 },
];

const guidelines = [
  "Introduce cualquier cambio de alimentación de forma gradual.",
  "Observa tolerancia, digestión, piel, ánimo y apetito durante los primeros días.",
  "Si tu perro tiene alergias, patologías, medicación o sensibilidad digestiva, consulta con su veterinario.",
];

export function ResponsibleFeedingSection() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
        <div className="fade-up flex flex-col justify-center text-center lg:text-left">
          <span className="section-eyebrow text-muted-foreground">Guía responsable</span>
          <h2 className="section-heading text-foreground">Cada perro es distinto. Avanza con calma.</h2>
          <p className="section-copy mx-auto text-muted-foreground lg:mx-0">
            BARF puede ser una excelente alternativa, pero la transición debe hacerse con observación y criterio. Nuestro objetivo es alimentar mejor, sin prometer milagros ni reemplazar la orientación profesional.
          </p>
          <div className="soft-card-hover premium-transition mt-6 rounded-[1.75rem] border border-border bg-muted/35 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground text-background">
                <Stethoscope className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-sans text-lg font-extrabold tracking-tight text-foreground">Consulta profesional cuando corresponda</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Ante alergias, enfermedades, embarazo, cachorros con necesidades especiales o cualquier condición médica, consulta siempre con tu veterinario antes de cambiar la dieta.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="soft-card-hover premium-transition rounded-[2rem] bg-foreground p-4 text-background shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-6">
          <div className="flex items-center gap-2 text-background/65">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">Transición sugerida</span>
          </div>
          <h3 className="mt-3 font-sans text-2xl font-extrabold tracking-tight sm:text-3xl">10 días para adaptarse mejor</h3>
          <p className="mt-3 text-sm leading-relaxed text-background/70 sm:text-base">
            Usa esta guía como punto de partida y ajusta según tolerancia. Si notas molestias importantes, pausa el cambio y pide orientación.
          </p>

          <ol className="mt-6 space-y-4">
            {transitionPhases.map((phase) => (
              <li key={phase.days} className="rounded-2xl border border-background/15 bg-background/10 p-3">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs text-background/75 sm:text-sm">
                  <span className="font-semibold text-background">{phase.days}</span>
                  <span>BARF {phase.barf}% · Actual {phase.current}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-background/20">
                  <div className="h-full rounded-full bg-background" style={{ width: `${phase.barf}%` }} />
                </div>
              </li>
            ))}
          </ol>

          <ul className="mt-6 grid gap-3">
            {guidelines.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-background/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-background" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-background/15 bg-background/10 p-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-background/80">
              Algunos perros pueden presentar sensibilidad o rechazo inicial a ciertos ingredientes. Por eso recomendamos cambios progresivos y seguimiento responsable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
