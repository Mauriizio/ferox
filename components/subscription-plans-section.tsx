"use client";

import { useMemo, useState } from "react";
import {
  CakeSlice,
  Check,
  Gift,
  HeartHandshake,
  MessageCircle,
  PackageCheck,
  Sparkles,
  Star,
  Truck,
  Users,
} from "lucide-react";

const PHONE = "56927973379";

type PlanId = "bronze" | "gold" | "platinum";
type FormulaId = "mixto" | "vacuno";
type FrequencyId = "semanal" | "quincenal" | "mensual";

type Plan = {
  name: string;
  kg: number;
  deliveryPrice: number;
  highlight?: string;
  description: string;
  benefits: string[];
  prices: Record<FormulaId, { normal: number }>;
};

const plans: Record<PlanId, Plan> = {
  bronze: {
    name: "Bronze",
    kg: 10,
    deliveryPrice: 3500,
    description: "Ideal para organizar su alimentación mensual con entregas programadas.",
    benefits: ["10 kg mensuales", "Despacho programado", "Preparación preferente", "Acceso al Club FEROX"],
    prices: {
      mixto: { normal: 40000 },
      vacuno: { normal: 45000 },
    },
  },
  gold: {
    name: "Gold",
    kg: 15,
    deliveryPrice: 3000,
    highlight: "Más elegido",
    description: "Más comodidad para planificar el mes con un despacho más conveniente.",
    benefits: ["15 kg mensuales", "Despacho preferente", "Valor de despacho preferente", "Beneficios del Club FEROX"],
    prices: {
      mixto: { normal: 60000 },
      vacuno: { normal: 67500 },
    },
  },
  platinum: {
    name: "Platinum",
    kg: 20,
    deliveryPrice: 2500,
    description: "La opción más completa para coordinar mejor sus entregas mensuales.",
    benefits: ["20 kg mensuales", "Despacho prioritario", "Continuidad en su rutina BARF", "Valor de despacho preferente"],
    prices: {
      mixto: { normal: 80000 },
      vacuno: { normal: 90000 },
    },
  },
};

const formulas: Record<FormulaId, { label: string; description: string }> = {
  mixto: {
    label: "Mix Pollo + Vacuno",
    description: "Pollo y vacuno",
  },
  vacuno: {
    label: "Vacuno Premium",
    description: "Solo vacuno",
  },
};

const frequencies: Record<FrequencyId, { label: string; shipments: number; description: string }> = {
  semanal: {
    label: "Semanal",
    shipments: 4,
    description: "4 entregas al mes",
  },
  quincenal: {
    label: "Quincenal",
    shipments: 2,
    description: "2 entregas al mes",
  },
  mensual: {
    label: "Mensual",
    shipments: 1,
    description: "1 entrega al mes",
  },
};

const clubBenefits = [
  { icon: Gift, title: "Kit de bienvenida" },
  { icon: Truck, title: "Prioridad en entregas" },
  { icon: HeartHandshake, title: "Atención personalizada" },
  { icon: Users, title: "Programa de referidos" },
  { icon: CakeSlice, title: "Mini torta de cumpleaños" },
  { icon: Sparkles, title: "Beneficios en snacks" },
  { icon: Star, title: "Beneficios exclusivos" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SubscriptionPlansSection() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<FormulaId>("mixto");
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyId>("semanal");

  const summary = useMemo(() => {
    if (!selectedPlan) {
      return null;
    }

    const plan = plans[selectedPlan];
    const formula = formulas[selectedFormula];
    const frequency = frequencies[selectedFrequency];
    const prices = plan.prices[selectedFormula];
    const deliveryTotal = plan.deliveryPrice * frequency.shipments;
    const total = prices.normal + deliveryTotal;
    const kgPerDelivery = plan.kg / frequency.shipments;

    return {
      plan,
      formula,
      frequency,
      prices,
      deliveryTotal,
      total,
      kgPerDelivery,
    };
  }, [selectedFrequency, selectedFormula, selectedPlan]);

  const whatsappMessage = useMemo(() => {
    if (!summary) {
      return "";
    }

    return encodeURIComponent(
      `Hola FEROX BARF, quiero información del Plan ${summary.plan.name}. Fórmula: ${summary.formula.label}. Alimento: ${summary.plan.kg} kg mensuales por ${formatCurrency(summary.prices.normal)}. Frecuencia: ${summary.frequency.label} (${summary.frequency.shipments} entregas al mes). Despacho: ${summary.frequency.shipments} x ${formatCurrency(summary.plan.deliveryPrice)} (${formatCurrency(summary.deliveryTotal)}). Total mensual estimado: ${formatCurrency(summary.total)}. Me interesa organizar su alimentación con despacho programado, preparación preferente y beneficios del Club FEROX.`,
    );
  }, [summary]);

  return (
    <section id="planes" className="border-t border-border bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div data-reveal className="fade-up mx-auto max-w-3xl text-center">
          <span className="section-eyebrow text-background/60">Planes y Club FEROX</span>
          <h2 className="section-heading text-background">Planes Ferox para organizar su alimentación mes a mes</h2>
          <p className="section-copy text-background/75">
            Mismo alimento, misma calidad y una forma más cómoda de planificar sus entregas, con preparación preferente, despacho programado y beneficios del Club FEROX. El valor del alimento se mantiene igual en todos los planes y el valor del despacho varía según el plan seleccionado.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-3 lg:items-stretch">
          {Object.entries(plans).map(([id, plan]) => {
            const planId = id as PlanId;
            const isSelected = selectedPlan === planId;

            return (
              <article
                key={id}
                data-reveal className={`soft-card-hover premium-transition relative flex flex-col overflow-hidden lg:min-h-full rounded-[2rem] border bg-background p-6 text-center text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-7 ${
                  isSelected ? "border-background ring-2 ring-background/80" : "border-background/10"
                }`}
              >
                {plan.highlight ? (
                  <div className="absolute inset-x-0 top-0 bg-foreground px-4 py-3 text-xs font-extrabold uppercase tracking-[0.22em] text-background">
                    {plan.highlight}
                  </div>
                ) : null}

                <div className={plan.highlight ? "pt-10" : ""}>
                  <div className="mx-auto inline-flex rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Plan
                  </div>
                  <h3 className="mt-4 text-3xl font-black tracking-tight">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>

                  <div className="mt-6 rounded-3xl bg-muted/60 p-5">
                    <p className="text-sm font-semibold text-muted-foreground">Incluye</p>
                    <p className="mt-1 text-5xl font-black tracking-tight">{plan.kg} kg</p>
                    <p className="text-sm text-muted-foreground">mensuales</p>
                    <span className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-background">
                      Despacho desde {formatCurrency(plan.deliveryPrice)}
                    </span>
                  </div>
                </div>

                <ul className="mt-6 grid gap-3 text-left text-sm text-foreground/85 lg:flex-1">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
                    <span>Despacho desde {formatCurrency(plan.deliveryPrice)} por entrega</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(isSelected ? null : planId)}
                  className={`interactive-lift premium-transition mt-7 inline-flex w-full items-center justify-center rounded-full border px-5 py-3 text-sm font-extrabold lg:mt-auto ${
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {isSelected ? "Quitar selección" : "Elegir este plan"}
                </button>

                {isSelected && summary ? (
                  <div className="mt-6 border-t border-border pt-6 text-left lg:hidden">
                    <div className="rounded-[1.5rem] border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <PackageCheck className="h-4 w-4" aria-hidden="true" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">Configura tu plan</span>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fórmula</p>
                          <div className="mt-2 grid gap-2">
                            {Object.entries(formulas).map(([formulaId, formula]) => (
                              <button
                                key={formulaId}
                                type="button"
                                onClick={() => setSelectedFormula(formulaId as FormulaId)}
                                className={`interactive-lift premium-transition rounded-2xl border px-4 py-3 text-center ${
                                  selectedFormula === formulaId
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-background hover:bg-muted"
                                }`}
                              >
                                <strong className="block text-sm">{formula.label}</strong>
                                <span className="text-xs opacity-70">{formula.description}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Frecuencia</p>
                          <div className="mt-2 grid gap-2">
                            {Object.entries(frequencies).map(([frequencyId, frequency]) => (
                              <button
                                key={frequencyId}
                                type="button"
                                onClick={() => setSelectedFrequency(frequencyId as FrequencyId)}
                                className={`interactive-lift premium-transition rounded-2xl border px-4 py-3 text-center ${
                                  selectedFrequency === frequencyId
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-background hover:bg-muted"
                                }`}
                              >
                                <strong className="block text-sm">{frequency.label}</strong>
                                <span className="text-xs opacity-70">{frequency.description}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[1.5rem] border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <PackageCheck className="h-4 w-4" aria-hidden="true" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">Resumen mensual</span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Entrega</span>
                          <strong>
                            {summary.frequency.shipments} x {summary.kgPerDelivery.toLocaleString("es-CL", { maximumFractionDigits: 1 })} kg
                          </strong>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Alimento</span>
                          <strong>{formatCurrency(summary.prices.normal)}</strong>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Despachos</span>
                          <strong>{summary.frequency.shipments} x {formatCurrency(summary.plan.deliveryPrice)}</strong>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Total envíos</span>
                          <strong>{formatCurrency(summary.deliveryTotal)}</strong>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl bg-foreground p-4 text-center text-background">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-background/60">Pago mensual único</p>
                        <p className="mt-1 text-4xl font-extrabold">{formatCurrency(summary.total)}</p>
                        <p className="mt-1 text-sm text-background/65">Incluye alimento al mismo valor para todos los planes + envíos del mes.</p>
                      </div>

                      <a
                        href={`https://wa.me/${PHONE}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-bold text-background transition hover:bg-foreground/90"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Quiero este plan por WhatsApp
                      </a>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mt-8 hidden rounded-[2rem] border border-background/15 bg-background/10 p-4 lg:block lg:p-6">
          {summary ? (
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.75rem] bg-background p-5 text-foreground">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PackageCheck className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">Configura tu plan {summary.plan.name}</span>
                </div>

                <div className="mt-5 grid gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fórmula</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {Object.entries(formulas).map(([formulaId, formula]) => (
                        <button
                          key={formulaId}
                          type="button"
                          onClick={() => setSelectedFormula(formulaId as FormulaId)}
                          className={`interactive-lift premium-transition rounded-2xl border px-4 py-3 text-center ${
                            selectedFormula === formulaId ? "border-foreground bg-foreground text-background" : "border-border bg-muted/35 hover:bg-muted"
                          }`}
                        >
                          <strong className="block text-sm">{formula.label}</strong>
                          <span className="text-xs opacity-70">{formula.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Frecuencia de entrega</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {Object.entries(frequencies).map(([frequencyId, frequency]) => (
                        <button
                          key={frequencyId}
                          type="button"
                          onClick={() => setSelectedFrequency(frequencyId as FrequencyId)}
                          className={`interactive-lift premium-transition rounded-2xl border px-4 py-3 text-center ${
                            selectedFrequency === frequencyId ? "border-foreground bg-foreground text-background" : "border-border bg-muted/35 hover:bg-muted"
                          }`}
                        >
                          <strong className="block text-sm">{frequency.label}</strong>
                          <span className="text-xs opacity-70">{frequency.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-background p-5 text-foreground">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PackageCheck className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">Resumen mensual</span>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Plan</p>
                    <p className="font-bold">{summary.plan.name} · {summary.plan.kg} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entrega</p>
                    <p className="font-bold">
                      {summary.frequency.shipments} x {summary.kgPerDelivery.toLocaleString("es-CL", { maximumFractionDigits: 1 })} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Alimento</p>
                    <p className="font-bold">{formatCurrency(summary.prices.normal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Despachos</p>
                    <p className="font-bold">{summary.frequency.shipments} x {formatCurrency(summary.plan.deliveryPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total envíos</p>
                    <p className="font-bold">{formatCurrency(summary.deliveryTotal)}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-foreground p-4 text-background">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">Pago mensual único</p>
                  <p className="mt-1 text-4xl font-extrabold">{formatCurrency(summary.total)}</p>
                  <p className="mt-1 text-sm text-background/65">Incluye alimento al mismo valor para todos los planes + envíos del mes.</p>
                </div>

                <a
                  href={`https://wa.me/${PHONE}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-bold text-background transition hover:bg-foreground/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Quiero este plan por WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl py-6 text-center">
              <PackageCheck className="mx-auto h-8 w-8 text-background" aria-hidden="true" />
              <h3 className="mt-3 text-2xl font-extrabold text-background">Primero elige un plan.</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70">
                Después podrás escoger la proteína, la frecuencia de entrega y ver el total mensual con el alimento y los despachos incluidos.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#333333] bg-[#1a1a1a] p-4 sm:border-background/15 sm:bg-background/10 sm:p-6">
          <div className="flex flex-col gap-2 text-center sm:items-center">
            <span className="section-eyebrow text-background/60">Club FEROX incluido</span>
            <h3 className="mt-2 font-sans text-2xl font-extrabold tracking-tight text-background sm:text-3xl">Más que alimento: beneficios para ti y tu compañero.</h3>
            <p className="max-w-2xl text-sm leading-relaxed text-background/70">
              Al tomar un plan, formas parte de una comunidad con prioridad, acompañamiento y beneficios pensados para clientes frecuentes.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {clubBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="flex min-h-20 flex-col items-center justify-center rounded-2xl border border-[#333333] bg-[#1a1a1a] p-4 text-center sm:border-background/15 sm:bg-background/10">
                  <Icon className="h-5 w-5 text-background" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold text-background">{benefit.title}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
