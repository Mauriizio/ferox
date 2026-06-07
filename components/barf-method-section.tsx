import { CheckCircle2 } from "lucide-react";

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

export function BarfMethodSection() {
  return (
    <section id="que-es-barf" className="border-t border-border bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="fade-up mx-auto max-w-3xl text-center">
          <span className="section-eyebrow text-background/60">¿Qué es BARF?</span>
          <h2 className="mt-3 ferox-display-title text-3xl sm:text-4xl md:text-5xl">Comida real, balanceada y completa</h2>
          <p className="section-copy mx-auto text-background/75">
            BARF combina proteína, vísceras, frutas/verduras y hueso carnoso molido para construir una base nutricional
            completa para tu perro.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {composition.map((item) => (
            <article key={item.label} className="soft-card-hover premium-transition rounded-2xl border border-background/20 bg-background/10 p-4 text-center">
              <p className="text-3xl font-bold">{item.value}</p>
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

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-background/20 bg-background/10 p-4 text-center sm:p-5">
          <p className="text-sm leading-relaxed text-background/75 sm:text-base">
            Ahora que conoces la base de la fórmula, revisa la guía responsable para hacer el cambio de forma gradual y segura.
          </p>
        </div>
      </div>
    </section>
  );
}
