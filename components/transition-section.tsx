const phases = [
  { days: "Día 1 – 3", barf: 25, current: 75 },
  { days: "Día 4 – 6", barf: 50, current: 50 },
  { days: "Día 7 – 9", barf: 75, current: 25 },
  { days: "Día 10", barf: 100, current: 0 },
]

export function TransitionSection() {
  return (
    <section className="min-h-[100svh] bg-background border-t border-border flex items-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Transición a BARF
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
            Cambiar es muy sencillo. Hazlo paso a paso.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Recomendamos una transición progresiva en 10 días para evitar problemas digestivos y que tu perro se adapte
            sin estrés.
          </p>
        </div>

        <ol className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {phases.map((phase, idx) => (
            <li
              key={phase.days}
              className="relative rounded-2xl border border-border p-5 bg-background hover:border-foreground transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-bold text-foreground">0{idx + 1}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {phase.days}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">BARF</span>
                    <span className="font-medium text-foreground">{phase.barf}%</span>
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
                    <span className="text-muted-foreground">Alimento actual</span>
                    <span className="font-medium text-foreground">{phase.current}%</span>
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
  )
}
