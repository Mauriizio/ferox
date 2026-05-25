"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bone,
  Calculator,
  CheckCircle2,
  HeartPulse,
  MessageCircle,
  Minus,
  PawPrint,
  Plus,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  calcularRacionBarf,
  type Actividad,
  type Edad,
  type EstadoFisico,
} from "@/lib/domain/feeding";

type Estado = EstadoFisico;

const PHONE = "56927973379"; // FEROX BARF WhatsApp number

const etapaVidaOptions: {
  v: Edad;
  l: string;
  icon: LucideIcon;
}[] = [
  { v: "cachorro", l: "Cachorro", icon: PawPrint },
  { v: "adulto", l: "Adulto", icon: Bone },
  { v: "senior", l: "Senior", icon: HeartPulse },
];

const actividadOptions: { v: Actividad; l: string; hint: string }[] = [
  { v: "baja", l: "Baja", hint: "Poco movimiento" },
  { v: "moderada", l: "Media", hint: "Rutina normal" },
  { v: "alta", l: "Alta", hint: "Muy activo" },
];

const estadoOptions: { v: Estado; l: string }[] = [
  { v: "normal", l: "Ideal" },
  { v: "esterilizado", l: "Esterilizado" },
  { v: "sobrepeso", l: "Sobrepeso" },
];

export function CalculatorSection() {
  const [peso, setPeso] = useState<string>("10");
  const [etapaVida, setEtapaVida] = useState<Edad>("adulto");
  const [actividad, setActividad] = useState<Actividad>("moderada");
  const [estado, setEstado] = useState<Estado>("normal");

  const pesoNumber = Number.parseFloat(peso);

  const { gramosDia, gramosMes, porcentaje } = useMemo(() => {
    return calcularRacionBarf({
      peso: Number.parseFloat(peso),
      edad: etapaVida,
      actividad,
      estadoFisico: estado,
    });
  }, [peso, etapaVida, actividad, estado]);

  const whatsappMessage = encodeURIComponent(
    `Hola FEROX BARF! Quiero pedir info para mi perro:\n• Peso: ${peso} kg\n• Etapa de vida: ${etapaVida}\n• Actividad: ${actividad}\n• Estado: ${estado}\n• Porción diaria: ${gramosDia} g (${(gramosMes / 1000).toFixed(1)} kg al mes)`,
  );

  const updatePeso = (nextPeso: number) => {
    const boundedPeso = Math.min(100, Math.max(0.5, nextPeso));
    setPeso(Number(boundedPeso.toFixed(1)).toString());
  };

  const renderResultCard = () => (
      <div className="overflow-hidden rounded-[1.25rem] bg-foreground text-background shadow-[0_14px_38px_rgba(0,0,0,0.16)]">
        <div className="relative p-3.5 sm:p-4">
          <Image
            src="/icon.svg"
            alt="FEROX BARF"
            width={120}
            height={120}
            className="absolute -right-5 -top-5 h-24 w-24 opacity-10 invert sm:h-32 sm:w-32"
          />

          <div className="relative flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-background/10">
              <Calculator className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-background/55">
                Resultado
              </span>
              <h3 className="font-serif text-base font-bold sm:text-lg">
                Tu porción BARF
              </h3>
            </div>
          </div>

          <div className="relative mt-2.5 rounded-xl bg-background p-3 text-foreground">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Por día
            </div>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-serif text-3xl font-bold leading-none sm:text-4xl">
                {gramosDia.toLocaleString("es-CL")}
              </span>
              <span className="pb-1 text-base font-semibold text-muted-foreground">
                g
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
              Divide esta cantidad en 1 o 2 comidas, según su rutina.
            </p>
          </div>

          <div className="relative mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-background/10 p-2.5">
              <div className="text-[10px] uppercase tracking-widest text-background/50">
                Por mes
              </div>
              <div className="mt-1 text-lg font-bold sm:text-xl">
                {(gramosMes / 1000).toLocaleString("es-CL", {
                  maximumFractionDigits: 1,
                })}
                <span className="ml-1 text-xs text-background/60">kg</span>
              </div>
            </div>
            <div className="rounded-xl bg-background/10 p-2.5">
              <div className="text-[10px] uppercase tracking-widest text-background/50">
                Fórmula
              </div>
              <div className="mt-1 text-lg font-bold sm:text-xl">
                {(porcentaje * 100).toLocaleString("es-CL", {
                  maximumFractionDigits: 2,
                })}
                <span className="ml-1 text-xs text-background/60">%</span>
              </div>
            </div>
          </div>

          <div className="relative mt-2.5 grid gap-2">
            <a
              href={`https://wa.me/${PHONE}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-background/25 px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-background/10"
            >
              <MessageCircle className="h-4 w-4" />
              Pedir asesoría
            </a>
            <a
              href="#productos"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-background/25 px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-background/10"
            >
              <ShoppingBag className="h-4 w-4" />
              Ver productos
            </a>
            <p className="text-center text-[11px] leading-relaxed text-background/55">
              Recomendación orientativa. Ajusta con un profesional si tu perro
              tiene una condición específica.
            </p>
          </div>
        </div>
      </div>
  );

  return (
    <section
      id="calculadora"
      className="relative overflow-hidden border-t border-border bg-[radial-gradient(circle_at_top_left,#f7f3ec_0%,#ffffff_42%,#f4f4f4_100%)]"
    >
      <div className="pointer-events-none absolute left-1/2 top-10 h-52 w-52 -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl sm:hidden" />

      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm sm:px-4 sm:py-2 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-foreground" />
            Calculadora BARF
          </span>
          <h2 className="mt-3 section-title text-2xl sm:mt-4 sm:text-3xl md:text-4xl">
            Descubre cuánta comida necesita tu perro
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Primero completa los datos de tu perro. Al final verás la porción
            diaria y mensual recomendada.
          </p>
        </div>

        <div className="mx-auto mt-4 w-full max-w-3xl rounded-[1.25rem] border border-white/70 bg-background/85 p-3 shadow-[0_12px_36px_rgba(0,0,0,0.06)] backdrop-blur sm:p-3.5 lg:mt-5 lg:p-4">
            <form className="space-y-2.5" onSubmit={(e) => e.preventDefault()}>
              
              <div className="rounded-[1rem] bg-foreground p-2.5 text-background shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="peso"
                    className="flex items-center gap-2 text-sm font-semibold"
                  >
                    <Scale className="h-4 w-4" />
                    Peso del perro
                  </label>
                  <div className="rounded-full bg-background/10 px-3 py-1 text-xs font-semibold">
                    {Number.isFinite(pesoNumber) && pesoNumber > 0
                      ? `${pesoNumber.toLocaleString("es-CL")} kg`
                      : "kg"}
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updatePeso((pesoNumber || 1) - 0.5)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-background/10 text-background transition hover:bg-background/20"
                    aria-label="Disminuir peso"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    id="peso"
                    type="number"
                    inputMode="decimal"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="h-10 w-full rounded-xl border border-background/10 bg-background px-3 text-center text-xl font-bold text-foreground shadow-inner outline-none focus:ring-2 focus:ring-background/50 sm:h-11 sm:text-2xl"
                    placeholder="12"
                  />
                  <button
                    type="button"
                    onClick={() => updatePeso((pesoNumber || 0) + 0.5)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-background/10 text-background transition hover:bg-background/20"
                    aria-label="Aumentar peso"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-foreground">
                  Etapa de vida
                </span>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                  {etapaVidaOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setEtapaVida(opt.v)}
                        className={`flex items-center justify-center gap-1 rounded-xl border px-1.5 py-1.5 text-xs font-bold transition-all sm:px-2.5 sm:text-sm ${
                          etapaVida === opt.v
                            ? "border-foreground bg-foreground text-background shadow-lg shadow-foreground/15"
                            : "border-border bg-white/75 text-foreground hover:-translate-y-0.5 hover:bg-white"
                        }`}
                        aria-pressed={etapaVida === opt.v}
                      >
                        <Icon className="h-4 w-4" />
                        {opt.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-white/65 p-2.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Activity className="h-4 w-4" />
                    Actividad
                  </span>
                  <div className="mt-1.5 grid grid-cols-3 gap-1">
                    {actividadOptions.map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setActividad(opt.v)}
                        disabled={etapaVida !== "adulto"}
                        className={`inline-flex min-h-9 items-center justify-center rounded-xl border px-1.5 text-center text-[11px] font-semibold transition-colors sm:text-xs ${
                          actividad === opt.v && etapaVida === "adulto"
                            ? "border-foreground bg-foreground text-background"
                            : "border-transparent bg-background text-foreground hover:bg-muted"
                        } ${etapaVida !== "adulto" ? "cursor-not-allowed opacity-45" : ""}`}
                        aria-pressed={actividad === opt.v}
                      >
                        <span>
                          <span className="block font-semibold">{opt.l}</span>
                          <span className="text-xs opacity-65">{opt.hint}</span>
                        </span>
                        {actividad === opt.v && etapaVida === "adulto" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                  {etapaVida !== "adulto" ? (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Usamos una base por etapa de vida.
                    </p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-border bg-white/65 p-2.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    Condición
                  </span>
                  <div className="mt-1.5 grid grid-cols-3 gap-1">
                    {estadoOptions.map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setEstado(opt.v)}
                        className={`inline-flex min-h-9 items-center justify-center rounded-xl border px-1.5 text-center text-[11px] font-semibold transition-colors sm:text-xs ${
                          estado === opt.v
                            ? "border-foreground bg-foreground text-background"
                            : "border-transparent bg-background text-foreground hover:bg-muted"
                        }`}
                        aria-pressed={estado === opt.v}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Resultado final
                </div>
                {renderResultCard()}
              </div>
            </form>
        </div>
      </div>
    </section>
  );
}
