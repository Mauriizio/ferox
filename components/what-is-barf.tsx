import Image from "next/image"

export function WhatIsBarf() {
  return (
    <section id="que-es-barf" className="py-20 md:py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] overflow-hidden rounded-2xl bg-muted order-last lg:order-first">
            <Image
              src="/barf-food.jpg"
              alt="Plato de comida BARF con carne cruda, huesos y vegetales frescos"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
              ¿Qué es BARF?
            </span>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground text-balance">
              Comida real, como la que su cuerpo está diseñado para procesar.
            </h2>
            <div className="mt-6 space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>
                La alimentación <strong className="text-foreground">BARF</strong> es una dieta natural basada en
                alimentos reales como carne, huesos carnosos y órganos, diseñada para respetar la biología de tu perro.
              </p>
              <p>
                A diferencia del pellet, el BARF{" "}
                <strong className="text-foreground">no contiene químicos, conservantes ni subproductos.</strong>
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { label: "Carne", value: "70%" },
                { label: "Huesos", value: "20%" },
                { label: "Órganos", value: "10%" },
              ].map((item) => (
                <div key={item.label} className="border border-border rounded-xl p-4 text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-foreground">{item.value}</div>
                  <div className="mt-1 text-xs sm:text-sm uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
