import { Check, X } from "lucide-react"

const rows = [
  { feature: "Ingredientes naturales", barf: true, pellet: false },
  { feature: "Sin químicos ni conservantes", barf: true, pellet: false },
  { feature: "Fresco", barf: true, pellet: false },
  { feature: "Cocido a altas temperaturas", barf: false, pellet: true },
  { feature: "Biológicamente adecuado", barf: true, pellet: false },
  { feature: "Subproductos animales", barf: false, pellet: true },
  { feature: "Salud a largo plazo", barf: true, pellet: false },
]

export function ComparisonSection() {
  return (
    <section className="min-h-[100svh] bg-muted border-t border-border flex items-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
            BARF vs Pellet
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
            No es solo comida. Es salud a largo plazo.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            El pellet es un alimento procesado, cocido a altas temperaturas y con ingredientes que muchas veces no son
            naturales. El BARF es real.
          </p>
        </div>

        <div className="mt-8 md:mt-10 overflow-hidden rounded-2xl border border-border bg-background">
          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr]">
            <div className="bg-muted px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Característica
            </div>
            <div className="bg-foreground text-background px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
              BARF
            </div>
            <div className="bg-muted px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium uppercase tracking-wider text-muted-foreground text-center">
              Pellet
            </div>

            {rows.map((row, idx) => (
              <div key={row.feature} className="contents">
                <div
                  className={`px-4 sm:px-6 py-4 text-sm sm:text-base text-foreground ${
                    idx !== rows.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  {row.feature}
                </div>
                <div
                  className={`px-4 sm:px-6 py-4 flex items-center justify-center bg-foreground/[0.03] ${
                    idx !== rows.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  {row.barf ? (
                    <Check className="h-5 w-5 text-foreground" aria-label="Sí" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" aria-label="No" />
                  )}
                </div>
                <div
                  className={`px-4 sm:px-6 py-4 flex items-center justify-center ${
                    idx !== rows.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  {row.pellet ? (
                    <Check className="h-5 w-5 text-muted-foreground" aria-label="Sí" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" aria-label="No" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
