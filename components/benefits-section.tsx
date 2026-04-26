import { Zap, Sparkles, Heart, ShieldCheck, Activity, Leaf } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Más energía y vitalidad",
    description: "Tu perro se siente más activo y disfruta cada momento del día.",
  },
  {
    icon: Activity,
    title: "Mejor digestión",
    description: "Una alimentación natural que su sistema digestivo procesa con facilidad.",
  },
  {
    icon: Sparkles,
    title: "Pelaje brillante y piel sana",
    description: "Los nutrientes reales se reflejan en un pelaje suave y brillante.",
  },
  {
    icon: ShieldCheck,
    title: "Menos alergias",
    description: "Sin aditivos ni químicos que puedan causar reacciones adversas.",
  },
  {
    icon: Leaf,
    title: "Heces más pequeñas y firmes",
    description: "Mejor absorción de nutrientes, menos desperdicio.",
  },
  {
    icon: Heart,
    title: "Salud a largo plazo",
    description: "Una vida más larga, sana y feliz para tu mejor amigo.",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="min-h-[100svh] bg-foreground text-background">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-background/60">
            Beneficios
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
            Tu perro no solo come mejor… vive mejor.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-background/70 leading-relaxed">
            Una alimentación que respeta su naturaleza se nota en cada detalle de su día a día.
          </p>
        </div>

        <ul className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-background/10 border border-background/10 rounded-2xl overflow-hidden">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <li key={benefit.title} className="bg-foreground p-5 sm:p-6 group hover:bg-background/5 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-background/20 group-hover:border-background/50 transition-colors">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm text-background/70 leading-relaxed">{benefit.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
