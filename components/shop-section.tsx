"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PHONE = "56927973379";

const products = [
  {
    name: "Fórmula Vacuno",
    subtitle: "Proteína principal de vacuno",
    description:
      "Receta BARF completa con carne, órganos y vegetales frescos para una nutrición diaria equilibrada.",
    price: "$ 5.990",
    image: "/product/product1.png",
  },
  {
    name: "Mix de Proteína",
    subtitle: "Combinación balanceada",
    description:
      "Blend de proteínas pensado para rotación nutricional y mayor variedad en la alimentación del perro.",
    price: "$ 6.490",
    image: "/product/product2.png",
  },
  {
    name: "Snack de Pollo",
    subtitle: "Premio natural",
    description:
      "Snack funcional ideal para reforzar entrenamiento o complementar su rutina con una opción natural.",
    price: "$ 15.990",
    image: "/product/product3.png",
  },
];

export function ShopSection() {
  const [index, setIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const product = products[index];

  const whatsappMessage = useMemo(
    () =>
      encodeURIComponent(
        `Hola FEROX BARF, quiero pedir ${product.name} (${product.price}).`,
      ),
    [product.name, product.price],
  );

  return (
    <section id="tienda" className="border-t border-border bg-background">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Tienda FEROX
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Pasa de producto a producto y pide directo
          </h2>
        </div>

        <div className="mx-auto mt-7 flex max-w-5xl items-center justify-center gap-2 sm:gap-5">
          <button
            type="button"
            onClick={() => setIndex((current) => (current - 1 + products.length) % products.length)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted"
            aria-label="Producto anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <article className="w-full max-w-xl rounded-[1.75rem] border border-border bg-background p-4 text-center shadow-[0_20px_55px_rgba(0,0,0,0.08)] sm:p-5">
            <button
              type="button"
              onClick={() => setImageOpen(true)}
              className="relative mx-auto block aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl bg-muted/20 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
              aria-label={`Ampliar imagen de ${product.name}`}
            >
              <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 92vw, 420px" className="object-cover object-center scale-[1.08]" />
            </button>
            <h3 className="mt-4 font-serif text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:text-base">
              {product.description}
            </p>
            <p className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">{product.price}</p>
 
            <a
              href={`https://wa.me/${PHONE}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              <MessageCircle className="h-4 w-4" />
              Pedir
            </a>
          </article>

          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % products.length)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted"
            aria-label="Producto siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="max-w-4xl border-0 bg-black/95 p-2 sm:p-4">
          <div className="overflow-auto rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="mx-auto h-auto w-full max-w-4xl object-contain"
              style={{ touchAction: "pinch-zoom" }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
