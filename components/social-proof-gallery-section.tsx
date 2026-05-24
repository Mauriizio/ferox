import Image from "next/image";

const galleryItems = [
  { src: "/perros/napoleon.png", alt: "Perro de la comunidad FEROX descansando" },
  { src: "/perros/2.jpeg", alt: "Perro de la comunidad FEROX en exterior" },
  { src: "/perros/napo.jpeg", alt: "Perro de la comunidad FEROX con mirada atenta" },
  { src: "/image/dog2.png", alt: "Perro saludable alimentado con BARF" },
];

export function SocialProofGallerySection() {
  return (
    <section id="comunidad" className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Comunidad FEROX
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Perros reales, progreso real
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Familias que ya usan BARF con seguimiento y recomendaciones claras.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">
          {galleryItems.map((item) => (
            <article key={item.src} className="overflow-hidden rounded-2xl border border-border bg-muted/20">
              <div className="relative aspect-[4/5]">
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
