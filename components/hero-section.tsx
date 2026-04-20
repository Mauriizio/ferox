import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Inter } from "next/font/google"

const heroInter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export function HeroSection() {
  return (
    <section className="relative h-[100svh] min-h-[100svh] overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/image/color-mobile.png"
            alt="Perro fuerte y saludable alimentado con dieta BARF"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[56%_34%] scale-[1.02]"
          />
        </div>
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/image/color.png"
            alt="Perro fuerte y saludable alimentado con dieta BARF"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_34%] scale-[1.03] opacity-95"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.82)_16%,rgba(0,0,0,0.56)_34%,rgba(0,0,0,0.18)_54%,rgba(0,0,0,0)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.84)_22%,rgba(0,0,0,0.62)_42%,rgba(0,0,0,0.28)_62%,rgba(0,0,0,0.08)_78%,rgba(0,0,0,0)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pt-32 md:pb-16">
        <div className="max-w-lg -translate-y-12 md:-translate-y-2 text-center md:text-left flex flex-col items-center md:items-start">
          <h1 className="mt-3 md:mt-6 font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[0.98] tracking-tight text-white text-balance">
            NUTRICIÓN REAL PREMIUM
          </h1>

          <p className={`${heroInter.className} mt-6 md:mt-5 text-base sm:text-lg md:text-xl text-white/85 leading-relaxed text-pretty max-w-lg mx-auto md:mx-0`}>
            Carne, órganos y vegetales frescos. Planes BARF personalizados según peso, edad y actividad.
          </p>

          <div className="mt-10 md:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center">
            <Link
              href="#tienda"
              className="group inline-flex w-auto min-w-[12.5rem] self-center sm:self-auto items-center justify-center gap-2 rounded-full bg-white px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base font-semibold text-black text-center hover:bg-white/90 transition-all shadow-xl shadow-black/35"
            >
              Comprar ahora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#calculadora"
              className="inline-flex w-auto min-w-[12.5rem] self-center sm:self-auto items-center justify-center gap-2 rounded-full border border-white/40 bg-black/20 px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base font-medium text-white text-center hover:bg-black/35 transition-colors"
            >
              Calcular ración
            </Link>
          </div>

          <div className={`${heroInter.className} mt-12 md:mt-9 flex flex-wrap items-center justify-center md:justify-start gap-2`}>
            <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[11px] sm:text-xs tracking-[0.04em] text-white/90">
              Sin químicos
            </span>
            <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[11px] sm:text-xs tracking-[0.04em] text-white/90">
              Despacho a domicilio
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 md:bottom-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className={`${heroInter.className} text-center md:text-left text-[11px] sm:text-xs text-white/70 tracking-[0.01em]`}>
            Recomendado por Dr. Camilo González · Bluaveterinaria.cl
          </p>
        </div>
      </div>
    </section>
  )
}
