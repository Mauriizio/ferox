"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CakeSlice,
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

const plans: Record<PlanId, {
  name: string;
  kg: number;
  discount: number;
  deliveryPrice: number;
  prices: Record<FormulaId, { normal: number; subscription: number }>;
}> = {
  bronze: {
    name: "Bronze",
    kg: 10,
    discount: 10,
    deliveryPrice: 3500,
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
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("bronze");
  const [selectedFormula, setSelectedFormula] = useState<FormulaId>("mixto");
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyId>("semanal");

  const summary = useMemo(() => {
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

  const whatsappMessage = useMemo(
    () =>
      encodeURIComponent(
        `Hola FEROX BARF, quiero información del Plan ${summary.plan.name}. Fórmula: ${summary.formula.label}. Frecuencia: ${summary.frequency.label} (${summary.frequency.shipments} entregas al mes). Total mensual estimado: ${formatCurrency(summary.total)}.`,
      ),
    [summary],
  );

  return (
    <section id="planes" className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <span className="section-eyebrow text-background/60">Planes y Club FEROX</span>
          <h2 className="section-heading text-background">Prioridad para quienes aseguran su BARF.</h2>
          <p className="section-copy text-background/75">
            Asegura la alimentación de tu mascota con entregas programadas, descuentos por volumen y beneficios exclusivos del Club FEROX.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {Object.entries(plans).map(([id, plan]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedPlan(id as PlanId)}
                className={`rounded-[1.5rem] border p-4 text-left transition ${
                  selectedPlan === id
                    ? "border-background bg-background text-foreground"
                    : "border-background/20 bg-background/10 text-background hover:bg-background/15"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Plan</span>
                <strong className="mt-1 block text-2xl font-extrabold">{plan.name}</strong>
                <span className="mt-1 block text-sm opacity-75">{plan.kg} kg mensuales</span>
                <span className="mt-3 inline-flex rounded-full bg-current/10 px-3 py-1 text-xs font-bold">{plan.discount}% dcto.</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-background/15 bg-background p-4 text-foreground shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="grid gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fórmula</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {Object.entries(formulas).map(([id, formula]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedFormula(id as FormulaId)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
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
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selectedFrequency === id ? "border-foreground bg-foreground text-background" : "border-border bg-muted/35 hover:bg-muted"
                    }`}
                  >
                    <strong className="block text-sm">{frequency.label}</strong>
                    <span className="text-xs opacity-70">{frequency.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-muted/30 p-4">
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
                  <p className="font-bold">{summary.frequency.shipments} x {summary.kgPerDelivery.toLocaleString("es-CL", { maximumFractionDigits: 1 })} kg</p>
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
            </div>

            <a
              href={`https://wa.me/${PHONE}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-bold text-background transition hover:bg-foreground/90"
            >
              <MessageCircle className="h-4 w-4" />
              Quiero este plan por WhatsApp
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-[2rem] border border-background/15 bg-background/10 p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="section-eyebrow text-background/60">Club FEROX incluido</span>
                <h3 className="mt-2 font-sans text-2xl font-extrabold tracking-tight text-background sm:text-3xl">Más que alimento: beneficios para ti y tu compañero.</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-background/70">
                Al tomar un plan, formas parte de una comunidad con prioridad, acompañamiento y beneficios pensados para clientes frecuentes.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {clubBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article key={benefit.title} className="rounded-2xl border border-background/15 bg-background/10 p-4">
                    <Icon className="h-5 w-5 text-background" aria-hidden="true" />
                    <p className="mt-3 text-sm font-bold text-background">{benefit.title}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
