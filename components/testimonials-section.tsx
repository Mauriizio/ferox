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
      className="viewport-section bg-background border-t border-border"
    >
      <div className="viewport-shell mx-auto flex w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Testimonios
          </span>
          <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
            Familias que ya hicieron el cambio
          </h2>
        </div>

        <ul className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {testimonials.map((t, idx) => (
            <li
              key={idx}
              className="rounded-2xl border border-border bg-background p-3 sm:p-4 lg:p-6 flex flex-col hover:border-foreground transition-colors"
            >
              <Quote
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-foreground"
                aria-hidden="true"
              />
              <blockquote className="mt-2 sm:mt-4 flex-1 text-sm sm:text-base lg:text-lg text-foreground leading-relaxed text-pretty">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-border">
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
