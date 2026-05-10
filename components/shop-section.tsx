import Image from "next/image";
import { ArrowUpRight, ShoppingCart, ReceiptText } from "lucide-react";

const products = [
  {
    name: "Fórmula Vacuno",
    weight: "1 kg",
    price: "$ 5.990",
    portion: "Ideal para rotación proteica",
    badge: "Vacuno",
    image: "/product/product1.png",
  },
  {
    name: "Mix de proteína",
    weight: "1 kg",
    price: "$ 6.490",
    portion: "Combinación balanceada",
    badge: "Más vendido",
    featured: true,
    image: "/product/product2.png",
  },
  {
    name: "Snack de pollo",
    weight: "15 kg",
    price: "$ 15.990",
    portion: "Patitas de pollo deshidratadas",
    badge: "Pack",
    image: "/product/product3.png",
  },
];

export function ShopSection() {
  return (
    <section
      id="tienda"
      className="viewport-section bg-background border-t border-border flex items-center"
    >
      <div className="viewport-shell mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6">
          <div className="max-w-2xl">
            <Image
              src="/placeholder-logo.svg"
              alt="Logo FEROX"
              width={170}
              height={42}
              className="hidden h-8 w-auto sm:block md:h-10"
            />
            <span className="mt-1 sm:mt-3 md:mt-4 inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Tienda
            </span>
            <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
              Compra fácil, rápida y directa
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Agrega productos BARF al carrito, confirma el pedido y coordina
              pago por transferencia o efectivo contra entrega.
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 md:mt-7 grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {products.map((product) => (
            <article
              key={product.name}
              className={`group relative flex flex-row md:flex-col overflow-hidden rounded-2xl border transition-all ${
                product.featured
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground"
              }`}
            >
              <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-muted md:h-auto md:aspect-[4/3] md:w-auto">
                <Image
                  src={product.image}
                  alt={`${product.name} FEROX BARF`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-2 top-2 md:left-4 md:top-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs font-medium ${
                      product.featured
                        ? "bg-background text-foreground"
                        : "bg-foreground text-background"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-3 md:p-5 flex flex-col">
                <h3 className="font-serif text-lg md:text-2xl font-bold">
                  {product.name}
                </h3>
                <p
                  className={`mt-1 text-sm ${product.featured ? "text-background/70" : "text-muted-foreground"}`}
                >
                  {product.weight}
                </p>

                <div className="mt-2 md:mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-xl md:text-3xl font-bold">
                    {product.price}
                  </span>
                </div>
                <p
                  className={`mt-1 text-xs md:mt-2 md:text-sm ${product.featured ? "text-background/70" : "text-muted-foreground"}`}
                >
                  {product.portion}
                </p>

                <a
                  href={`https://wa.me/56927973379?text=${encodeURIComponent(
                    `Hola, quiero comprar ${product.name} de FEROX BARF`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 md:mt-6 inline-flex items-center justify-between gap-2 rounded-full px-4 py-2 text-xs md:px-5 md:py-3 md:text-sm font-medium transition-colors ${
                    product.featured
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  Comprar ahora
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-3 hidden grid-cols-1 md:grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground flex items-start gap-3">
            <ShoppingCart className="h-4 w-4 mt-0.5 text-foreground" />
            Carrito de compra activo: agrega productos y confirma cantidades
            para cerrar tu pedido.
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground flex items-start gap-3">
            <ReceiptText className="h-4 w-4 mt-0.5 text-foreground" />
            Finalización: confirmamos por WhatsApp y enviamos mensaje automático
            de pedido recibido.
          </div>
        </div>

        <p className="mt-3 text-center text-xs md:mt-5 md:text-sm text-muted-foreground">
          Métodos de pago: Transferencia bancaria · Efectivo contra entrega.
          Seguimiento manual vía WhatsApp.
        </p>
      </div>
    </section>
  );
}
