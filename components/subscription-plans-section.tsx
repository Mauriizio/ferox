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
  discount: number;
  deliveryPrice: number;
  highlight?: string;
  description: string;
  benefits: string[];
  prices: Record<FormulaId, { normal: number; subscription: number }>;
};

const plans: Record<PlanId, Plan> = {
  bronze: {
    name: "Bronze",
    kg: 10,
    discount: 10,
    deliveryPrice: 3500,
    description: "Ideal para comenzar con entregas programadas y ahorro mensual.",
    benefits: ["10 kg mensuales", "10% de descuento", "Despacho programado", "Acceso al Club FEROX"],
    prices: {
      mixto: { normal: 30000, subscription: 27000 },
      vacuno: { normal: 35000, subscription: 31500 },
    },
  },
  gold: {
    name: "Gold",
    kg: 15,
    discount: 15,
    deliveryPrice: 3000,
    highlight: "Más elegido",
    description: "Más cantidad, mejor descuento y menor costo por despacho.",
    benefits: ["15 kg mensuales", "15% de descuento", "Despacho preferente", "Beneficios del Club FEROX"],
    prices: {
      mixto: { normal: 45000, subscription: 38250 },
      vacuno: { normal: 52500, subscription: 44625 },
    },
  },
  platinum: {
    name: "Platinum",
    kg: 20,
    discount: 20,
    deliveryPrice: 2500,
    description: "La opción más completa para asegurar BARF con máximo ahorro.",
    benefits: ["20 kg mensuales", "20% de descuento", "Despacho prioritario", "Mayor ahorro mensual"],
    prices: {
      mixto: { normal: 60000, subscription: 48000 },
      vacuno: { normal: 70000, subscription: 56000 },
    },
  },
};

const formulas: Record<FormulaId, { label: string; description: string }> = {
  mixto: {
    label: "BARF Mixto",
    description: "Pollo y carne",
  },
  vacuno: {
    label: "BARF Vacuno",
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
  { icon: Users, title: "Referidos con 10%" },
  { icon: CakeSlice, title: "Mini torta de cumpleaños" },
  { icon: Sparkles, title: "20% en snacks" },
  { icon: Star, title: "Promociones exclusivas" },
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
    const total = prices.subscription + deliveryTotal;
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
      `Hola FEROX BARF, quiero información del Plan ${summary.plan.name}. Fórmula: ${summary.formula.label}. Frecuencia: ${summary.frequency.label} (${summary.frequency.shipments} entregas al mes). Total mensual estimado: ${formatCurrency(summary.total)}.`,
    );
  }, [summary]);

  return (
    <section id="planes" className="border-t border-border bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-eyebrow text-background/60">Planes y Club FEROX</span>
          <h2 className="section-heading text-background">Elige tu plan y asegura su BARF.</h2>
          <p className="section-copy text-background/75">
            Planes mensuales con entregas programadas, descuentos por volumen y beneficios exclusivos del Club FEROX.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {Object.entries(plans).map(([id, plan]) => {
            const isSelected = selectedPlan === id;

            return (
              <article
                key={id}
                className={`relative flex min-h-full flex-col overflow-hidden rounded-[2rem] border bg-background p-6 text-center text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition sm:p-7 ${
                  isSelected ? "border-background ring-2 ring-background/80" : "border-background/10"
                } ${plan.highlight ? "lg:-translate-y-4" : ""}`}
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
                      {plan.discount}% dcto.
                    </span>
                  </div>
                </div>

                <ul className="mt-6 grid gap-3 text-left text-sm text-foreground/85">
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
                  onClick={() => setSelectedPlan(id as PlanId)}
                  className={`mt-7 inline-flex w-full items-center justify-center rounded-full border px-5 py-3 text-sm font-extrabold transition ${
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {isSelected ? "Plan seleccionado" : "Elegir este plan"}
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-[2rem] border border-background/15 bg-background/10 p-4 sm:p-6">
          {summary ? (
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.75rem] bg-background p-4 text-foreground sm:p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PackageCheck className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">Configura tu plan {summary.plan.name}</span>
                </div>

                <div className="mt-5 grid gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fórmula</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {Object.entries(formulas).map(([id, formula]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedFormula(id as FormulaId)}
                          className={`rounded-2xl border px-4 py-3 text-center transition ${
                            selectedFormula === id ? "border-foreground bg-foreground text-background" : "border-border bg-muted/35 hover:bg-muted"
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
                      {Object.entries(frequencies).map(([id, frequency]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedFrequency(id as FrequencyId)}
                          className={`rounded-2xl border px-4 py-3 text-center transition ${
                            selectedFrequency === id ? "border-foreground bg-foreground text-background" : "border-border bg-muted/35 hover:bg-muted"
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

              <div className="rounded-[1.75rem] bg-background p-4 text-foreground sm:p-5">
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
                    <p className="text-muted-foreground">Precio normal</p>
                    <p className="font-bold line-through decoration-muted-foreground">{formatCurrency(summary.prices.normal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Suscripción</p>
                    <p className="font-bold">{formatCurrency(summary.prices.subscription)}</p>
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
                  <p className="mt-1 text-sm text-background/65">Incluye suscripción + todos los envíos del mes.</p>
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
                Después podrás escoger la proteína, la frecuencia de entrega y ver el total mensual con los despachos incluidos.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-[2rem] border border-background/15 bg-background/10 p-4 sm:p-6">
          <div className="flex flex-col gap-2 text-center sm:items-center">
            <span className="section-eyebrow text-background/60">Club FEROX incluido</span>
            <h3 className="mt-2 font-sans text-2xl font-extrabold tracking-tight text-background sm:text-3xl">Más que alimento: beneficios para ti y tu compañero.</h3>
            <p className="max-w-2xl text-sm leading-relaxed text-background/70">
              Al tomar un plan, formas parte de una comunidad con prioridad, acompañamiento y beneficios pensados para clientes frecuentes.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {clubBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="rounded-2xl border border-background/15 bg-background/10 p-4 text-center">
                  <Icon className="mx-auto h-5 w-5 text-background" aria-hidden="true" />
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
