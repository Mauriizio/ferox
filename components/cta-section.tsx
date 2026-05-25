import Image from "next/image";
import Link from "next/link";
import { Calculator, MessageCircle } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background border-t border-border">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/happy-dog.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/40" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[72svh] w-full max-w-4xl flex-col justify-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <h2 className="text-3xl sm:text-5xl md:text-6xl">
          Tu perro depende de ti para comer bien.
        </h2>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-background/80 leading-relaxed text-pretty max-w-2xl mx-auto">
          Dale lo que realmente necesita. Calcula su porción ideal o escríbenos
          directo por WhatsApp.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <Link
            href="#calculadora"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-6 py-4 text-sm sm:text-base font-medium text-foreground hover:bg-background/90 transition-colors"
          >
            <Calculator className="h-4 w-4" />
            Calcular su porción
          </Link>
          <a
            href="https://wa.me/56927973379?text=Hola,%20quiero%20info%20de%20FEROX%20BARF"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 px-6 py-4 text-sm sm:text-base font-medium text-background hover:bg-background/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
