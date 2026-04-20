import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-[100svh] min-h-[100svh] overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image
  src="/image/color.png"
  alt="Perro fuerte y saludable alimentado con dieta BARF"
  fill
  priority
  sizes="100vw"
  className="object-cover object-[92%_43%] md:object-[80%_38%] scale-[1.10] md:scale-[1.01] opacity-95"
/>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.84)_14%,rgba(0,0,0,0.58)_32%,rgba(0,0,0,0.20)_54%,rgba(0,0,0,0)_74%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.88)_20%,rgba(0,0,0,0.66)_40%,rgba(0,0,0,0.30)_60%,rgba(0,0,0,0.10)_78%,rgba(0,0,0,0)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8 pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="max-w-xl -translate-y-6 sm:-translate-y-8 md:-translate-y-10 lg:-translate-y-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-white/90 backdrop-blur-sm">
            FEROX BARF PREMIUM
          </span>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[0.92] tracking-tight text-white sm:text-5xl md:text-6xl text-balance">
            NUTRICIÓN
            <br />
            REAL
            <br />
            PREMIUM
          </h1>

          <p className="mt-5 max-w-[32rem] text-base leading-relaxed text-white/85 sm:text-lg md:text-xl text-pretty">
            Carne, órganos y vegetales frescos. Sin químicos. Sin rellenos.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#tienda"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black shadow-xl shadow-black/35 transition-all hover:bg-white/90 sm:text-base"
            >
              Comprar plan premium
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#calculadora"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-black/20 px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-black/35 sm:text-base"
            >
              Calcular porción
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}