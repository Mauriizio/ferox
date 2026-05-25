import Image from "next/image";
import { Heart, Leaf, PawPrint, ShieldCheck, Sparkles, Stethoscope, Utensils } from "lucide-react";

const timelineItems = [
  {
    step: 1,
    title: "Cachorro",
    description: "Así comenzó todo: pequeño, curioso y con ganas de descubrir el mundo.",
    src: "/napo/1.jpeg",
    alt: "Napoleón en etapa cachorro",
  },
  {
    step: 2,
    title: "Transición con BARF",
    description: "Alimentación natural que nutre, fortalece y mejora su bienestar día a día.",
    src: "/napo/2.png",
    alt: "Napoleón durante transición BARF",
  },
  {
    step: 3,
    title: "Hoy",
    description: "Un perro fuerte, feliz y lleno de energía. Así es Napoleón hoy.",
    src: "/napo/3.png",
    alt: "Napoleón adulto y saludable",
  },
];

const badges = ["Mejor energía", "Pelaje sano", "Digestión feliz", "Más vitalidad"];

const features = [
  "Ingredientes 100% naturales",
  "Sin conservantes ni aditivos",
  "Hecho con amor para su bienestar",
];

export function SocialProofGallerySection() {
  return (
    <section id="comunidad" className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <article className="rounded-3xl border border-border bg-muted/25 p-4 shadow-sm sm:p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
            <Leaf className="h-3.5 w-3.5" />
            Historias reales
          </div>

          <header className="mt-4 text-center">
            <h2 className="section-title text-3xl text-foreground sm:text-4xl">
              La evolución de Napoleón con BARF
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              De cachorro a un perro fuerte, feliz y lleno de energía.
            </p>
          </header>

          <ol className="relative mt-6 space-y-3">
            <span className="absolute bottom-8 left-[18px] top-8 w-px bg-foreground/20" aria-hidden="true" />
            {timelineItems.map((item) => (
              <li key={item.step} className="relative flex items-center gap-3">
                <span className="z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-background bg-foreground text-sm font-bold text-background">
                  {item.step}
                </span>

                <article className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background/90 p-2.5 shadow-sm">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 96px, 112px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="inline-flex items-center gap-1.5 font-serif text-xl font-bold leading-tight text-foreground">
                      <Leaf className="h-4 w-4 text-foreground/80" />
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">{item.description}</p>
                  </div>
                  <Heart className="h-5 w-5 shrink-0 text-foreground/55" />
                </article>
              </li>
            ))}
          </ol>

          <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {badges.map((badge) => (
              <li key={badge} className="rounded-full border border-border bg-background px-2.5 py-1.5 text-center text-xs font-medium text-foreground">
                {badge}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border border-amber-200/40 bg-amber-50/70 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl text-amber-900/50">“</div>
              <p className="text-sm font-medium leading-relaxed text-amber-950/90 sm:text-base">
                Desde que empezó con BARF, Napoleón se ve más activo, feliz y con un pelaje hermoso.
              </p>
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow">
                <Image src="/napo/3.png" alt="Napoleón actual" fill sizes="56px" className="object-cover" />
              </div>
            </div>
            <p className="mt-1 text-right text-sm font-semibold text-amber-900">— Su familia</p>
          </div>

          <a
            href="/#tienda"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 sm:text-base"
          >
            <Utensils className="h-4 w-4" />
            Conoce nuestros planes BARF
          </a>

          <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-3 sm:text-sm">
            <div className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2">
              <Sparkles className="h-4 w-4" />
              {features[0]}
            </div>
            <div className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2">
              <ShieldCheck className="h-4 w-4" />
              {features[1]}
            </div>
            <div className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2">
              <Stethoscope className="h-4 w-4" />
              {features[2]}
            </div>
          </div>

          <div className="sr-only">
            <PawPrint />
          </div>
        </article>
      </div>
    </section>
  );
}
