import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Mi perro cambió completamente desde que come BARF, tiene más energía y su pelaje está hermoso. La calculadora hizo todo súper fácil.",
    author: "Camila R.",
    pet: "Toby · Labrador, 4 años",
  },
  {
    quote:
      "Dejó de tener problemas digestivos, fue la mejor decisión que tomamos. La transición fue progresiva y sin drama.",
    author: "Andrés M.",
    pet: "Luna · Border Collie, 6 años",
  },
  {
    quote:
      "El servicio por WhatsApp es directo y rápido. Mi perra está más activa y duerme mejor desde que cambiamos.",
    author: "Sofía P.",
    pet: "Maya · Mestiza, 2 años",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonios"
      className="bg-background border-t border-border"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <span className="section-eyebrow text-muted-foreground">
            Reseñas reales
          </span>
          <h2 className="section-heading">
            Lo que dicen las familias FEROX
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {testimonials.map((t, idx) => (
            <li
              key={idx}
              className="rounded-2xl border border-border bg-background p-5 sm:p-6 lg:p-8 flex flex-col hover:border-foreground transition-colors"
            >
              <Quote
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-foreground"
                aria-hidden="true"
              />
              <blockquote className="mt-5 flex-1 text-base lg:text-lg text-foreground leading-relaxed text-pretty">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 pt-5 border-t border-border">
                <div className="font-medium text-foreground">{t.author}</div>
                <div className="text-sm text-muted-foreground">{t.pet}</div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
