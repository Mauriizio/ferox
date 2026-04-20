"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Calculator, MessageCircle, ShoppingBag } from "lucide-react"

type Edad = "cachorro" | "adulto" | "senior"
type Actividad = "baja" | "moderada" | "alta"
type Estado = "normal" | "esterilizado" | "sobrepeso"

const PHONE = "56927973379" // FEROX BARF WhatsApp number

function calcularPorcentaje(edad: Edad, actividad: Actividad, estado: Estado): number {
  let pct: number

  if (edad === "cachorro") {
    pct = 0.07 // 7% promedio
  } else if (edad === "senior") {
    pct = 0.0175 // 1.75% promedio
  } else {
    // adulto
    if (actividad === "baja") pct = 0.02
    else if (actividad === "moderada") pct = 0.025
    else pct = 0.03
  }

  if (estado === "sobrepeso") {
    pct = 0.015
  } else if (estado === "esterilizado") {
    pct = pct * 0.9 // reducir ligeramente
  }

  return pct
}

export function CalculatorSection() {
  const [peso, setPeso] = useState<string>("10")
  const [edad, setEdad] = useState<Edad>("adulto")
  const [actividad, setActividad] = useState<Actividad>("moderada")
  const [estado, setEstado] = useState<Estado>("normal")

  const { gramosDia, gramosMes } = useMemo(() => {
    const p = Number.parseFloat(peso)
    if (!p || p <= 0 || isNaN(p)) return { gramosDia: 0, gramosMes: 0 }
    const pct = calcularPorcentaje(edad, actividad, estado)
    const dia = Math.round(p * pct * 1000)
    return { gramosDia: dia, gramosMes: dia * 30 }
  }, [peso, edad, actividad, estado])

  const whatsappMessage = encodeURIComponent(
    `Hola FEROX BARF! Quiero pedir info para mi perro:\n• Peso: ${peso} kg\n• Edad: ${edad}\n• Actividad: ${actividad}\n• Estado: ${estado}\n• Porción diaria: ${gramosDia} g (${(gramosMes / 1000).toFixed(1)} kg al mes)`,
  )

  return (
    <section id="calculadora" className="py-20 md:py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Image src="/placeholder-logo.svg" alt="Logo FEROX" width={160} height={40} className="mx-auto h-10 w-auto" />
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium tracking-wider uppercase text-muted-foreground">
            <Calculator className="h-3 w-3" />
            Calculadora BARF
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
            Descubre cuánta comida necesita tu perro
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Solo ingresa peso, edad y nivel de actividad. Es rápido, fácil y personalizado.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 rounded-2xl border border-border bg-background p-6 sm:p-8">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-foreground">
                  Peso del perro (kg)
                </label>
                <input
                  id="peso"
                  type="number"
                  inputMode="decimal"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                  placeholder="Ej: 12"
                />
              </div>

              <div>
                <span className="block text-sm font-medium text-foreground">Edad</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "cachorro", l: "Cachorro" },
                      { v: "adulto", l: "Adulto" },
                      { v: "senior", l: "Senior" },
                    ] as { v: Edad; l: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setEdad(opt.v)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        edad === opt.v
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:bg-muted"
                      }`}
                      aria-pressed={edad === opt.v}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-foreground">Nivel de actividad</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "baja", l: "Baja" },
                      { v: "moderada", l: "Moderada" },
                      { v: "alta", l: "Alta" },
                    ] as { v: Actividad; l: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setActividad(opt.v)}
                      disabled={edad !== "adulto"}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        actividad === opt.v
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:bg-muted"
                      } ${edad !== "adulto" ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-pressed={actividad === opt.v}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
                {edad !== "adulto" && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Para {edad === "cachorro" ? "cachorros" : "perros senior"} se usa un cálculo específico por edad.
                  </p>
                )}
              </div>

              <div>
                <span className="block text-sm font-medium text-foreground">Estado físico</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "normal", l: "Normal" },
                      { v: "esterilizado", l: "Esterilizado" },
                      { v: "sobrepeso", l: "Sobrepeso" },
                    ] as { v: Estado; l: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setEstado(opt.v)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        estado === opt.v
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:bg-muted"
                      }`}
                      aria-pressed={estado === opt.v}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-foreground text-background p-6 sm:p-8 flex flex-col">
            <div className="flex-1">
              <span className="text-xs uppercase tracking-widest text-background/60">Resultado</span>
              <h3 className="mt-3 font-serif text-2xl font-bold">Porción diaria recomendada</h3>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-background/60">Por día</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-serif text-5xl sm:text-6xl font-bold leading-none">
                      {gramosDia.toLocaleString("es-CL")}
                    </span>
                    <span className="text-lg text-background/70">g</span>
                  </div>
                </div>

                <div className="h-px bg-background/20" />

                <div>
                  <div className="text-xs uppercase tracking-widest text-background/60">Por mes (30 días)</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-serif text-3xl sm:text-4xl font-bold leading-none">
                      {(gramosMes / 1000).toLocaleString("es-CL", { maximumFractionDigits: 1 })}
                    </span>
                    <span className="text-base text-background/70">kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`https://wa.me/${PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-5 py-3.5 text-sm font-medium text-foreground hover:bg-background/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Pedir por WhatsApp
              </a>
              <a
                href="#tienda"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 px-5 py-3.5 text-sm font-medium text-background hover:bg-background/10 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Ver tienda
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
