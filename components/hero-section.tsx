import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8 pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="max-w-lg -translate-y-3 md:translate-y-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-white/90 backdrop-blur-sm">
            FEROX BARF PREMIUM
          </span>

          <h1 className="mt-7 md:mt-6 font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[0.98] tracking-tight text-white text-balance">
            NUTRICIÓN REAL PREMIUM
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-white/85 leading-relaxed text-pretty max-w-lg">
            Carne, órganos y vegetales frescos. Sin químicos. Sin rellenos.
          </p>

          <div className="mt-9 md:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center">
            <Link
              href="#tienda"
              className="group inline-flex w-auto min-w-[12.5rem] self-center sm:self-auto items-center justify-center gap-2 rounded-full bg-white px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base font-semibold text-black text-center hover:bg-white/90 transition-all shadow-xl shadow-black/35"
            >
              Comprar plan premium
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#calculadora"
              className="inline-flex w-auto min-w-[12.5rem] self-center sm:self-auto items-center justify-center gap-2 rounded-full border border-white/40 bg-black/20 px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base font-medium text-white text-center hover:bg-black/35 transition-colors"
            >
              Calcular porción
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
