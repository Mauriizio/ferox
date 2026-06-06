const phases = [
  { days: "Día 1 – 3", barf: 25, current: 75 },
  { days: "Día 4 – 6", barf: 50, current: 50 },
  { days: "Día 7 – 9", barf: 75, current: 25 },
  { days: "Día 10", barf: 100, current: 0 },
];

export function TransitionSection() {
  return (
    <section className="bg-background border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <span className="section-eyebrow text-muted-foreground">
            Transición a BARF
          </span>
          <h2 className="section-heading">
            Cambiar es muy sencillo. Hazlo paso a paso.
          </h2>
          <p className="section-copy text-muted-foreground">
            Recomendamos una transición progresiva en 10 días para evitar
            problemas digestivos y que tu perro se adapte sin estrés.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase, idx) => (
            <li
              key={phase.days}
              className="relative rounded-2xl border border-border p-5 sm:p-6 bg-background hover:border-foreground transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-foreground sm:text-4xl">
                  0{idx + 1}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {phase.days}
                </span>
              </div>

              <div className="mt-3 sm:mt-5 space-y-2 sm:space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">BARF</span>
                    <span className="font-medium text-foreground">
                      {phase.barf}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all"
                      style={{ width: `${phase.barf}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Alimento actual
                    </span>
                    <span className="font-medium text-foreground">
                      {phase.current}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground/40 transition-all"
                      style={{ width: `${phase.current}%` }}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
