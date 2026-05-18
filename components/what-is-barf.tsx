import Image from "next/image"
import { CheckCircle2, Droplets, Egg, Leaf, Wheat } from "lucide-react"

const composition = [
  { label: "Proteína", value: "70%" },
  { label: "Vísceras", value: "10%" },
  { label: "Verduras y frutas", value: "10%" },
  { label: "Hueso carnoso molido", value: "10%" },
]

const ingredients = [
  "Proteínas de origen animal",
  "Vísceras seleccionadas",
  "Verduras y frutas aptas para perros",
  "Hueso carnoso molido como fuente natural de minerales",
]

const complements = [
  { icon: Egg, title: "Huevitos", detail: "1 a 2 por semana, según tamaño y tolerancia." },
  { icon: Droplets, title: "Aceites buenos", detail: "Omega 3 o un toque de aceite de oliva para apoyar piel y pelaje." },
  { icon: Wheat, title: "Avena opcional", detail: "Puede agregarse si le cae bien y buscas más saciedad." },
  { icon: Leaf, title: "Extras naturales", detail: "Complementos simples, introducidos poco a poco." },
]

export function WhatIsBarf() {
  return (
    <section id="que-es-barf" className="bg-background border-t border-border/70">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-14 items-center w-full">
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] lg:min-h-[68svh] overflow-hidden rounded-2xl bg-muted order-last lg:order-first ring-1 ring-border shadow-2xl shadow-foreground/10">
            <Image
              src="/perros/napoleon.png"
              alt="Plato de comida BARF con carne cruda, huesos y vegetales frescos"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="lg:py-2">
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
              ¿Qué es BARF?
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground text-balance">
              Comida real, como la que su cuerpo está diseñado para procesar.
            </h2>
            <div className="mt-4 space-y-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>
                La alimentación <strong className="text-foreground">BARF</strong> es una dieta natural basada en
                alimentos reales como carne, huesos carnosos y órganos, diseñada para respetar la biología de tu perro.
              </p>
              <p>
                A diferencia del pellet, el BARF{" "}
                <strong className="text-foreground">no contiene químicos, conservantes ni subproductos.</strong>
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {composition.map((item) => (
                <div key={item.label} className="border border-border rounded-xl p-4 text-center glass shadow-sm sm:p-5">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-foreground">{item.value}</div>
                  <div className="mt-1 text-xs sm:text-sm uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-muted/35 p-4 sm:p-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                  Ingredientes que lleva nuestro BARF
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Una mezcla balanceada con ingredientes reales para entregar nutrición completa, fresca y funcional.
                </p>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {ingredients.map((ingredient) => (
                  <li key={ingredient} className="flex items-start gap-2 text-sm text-foreground sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border border-foreground/10 bg-foreground p-4 text-background sm:p-5">
              <h3 className="font-serif text-xl font-bold sm:text-2xl">
                También puedes complementar su BARF
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70 sm:text-base">
                Como orientación general, algunas familias suman extras naturales para variar y complementar. Hazlo de forma gradual y consulta si tu perro tiene una condición especial.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {complements.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="rounded-xl bg-background/10 p-3">
                      <div className="flex items-center gap-2 font-semibold">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {item.title}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-background/65 sm:text-sm">
                        {item.detail}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
