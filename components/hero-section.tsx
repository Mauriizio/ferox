import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-dog.jpg"
          alt="Perro fuerte y saludable alimentado con dieta BARF"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 md:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background md:bg-gradient-to-r md:from-background md:via-background/80 md:to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-3 py-1 text-xs font-medium tracking-wider uppercase text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Alimentación 100% Natural
          </span>

          <h1 className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground text-balance">
            Alimenta a tu perro como realmente lo necesita
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed text-pretty max-w-xl">
            Calcula en segundos la porción ideal de alimentación BARF según su peso, edad y nivel de actividad.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Link
              href="#calculadora"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm sm:text-base font-medium text-background hover:bg-foreground/90 transition-all"
            >
              Calcular ahora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#que-es-barf"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-6 py-4 text-sm sm:text-base font-medium text-foreground hover:bg-muted transition-colors"
            >
              ¿Qué es BARF?
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-md">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Natural</dt>
              <dd className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">100%</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Sin químicos</dt>
              <dd className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">0</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Cálculo en</dt>
              <dd className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">30s</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
