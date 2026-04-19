import Image from "next/image"
import { ArrowUpRight, ShoppingCart, ReceiptText } from "lucide-react"

const products = [
  {
    name: "Fórmula Vacuno",
    weight: "1 kg",
    price: "$ 5.990",
    portion: "Ideal para rotación proteica",
    badge: "Vacuno",
    image: "/product-pack.jpg",
  },
  {
    name: "Mix de proteína",
    weight: "1 kg",
    price: "$ 6.490",
    portion: "Combinación balanceada",
    badge: "Más vendido",
    featured: true,
    image: "/barf-food.jpg",
  },
  {
    name: "Pack mensual BARF",
    weight: "15 kg",
    price: "$ 89.990",
    portion: "Plan para 30 días",
    badge: "Pack",
    image: "/placeholder.jpg",
  },
]

export function ShopSection() {
  return (
    <section id="tienda" className="py-20 md:py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <Image src="/placeholder-logo.svg" alt="Logo FEROX" width={170} height={42} className="h-10 w-auto" />
            <span className="mt-4 inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Tienda
            </span>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
              Compra fácil, rápida y directa
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Agrega productos BARF al carrito, confirma el pedido y coordina pago por transferencia o efectivo contra
              entrega.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <article
              key={product.name}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all ${
                product.featured
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={`${product.name} FEROX BARF`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      product.featured ? "bg-background text-foreground" : "bg-foreground text-background"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col">
                <h3 className="font-serif text-2xl font-bold">{product.name}</h3>
                <p className={`mt-1 text-sm ${product.featured ? "text-background/70" : "text-muted-foreground"}`}>
                  {product.weight}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold">{product.price}</span>
                </div>
                <p className={`mt-2 text-sm ${product.featured ? "text-background/70" : "text-muted-foreground"}`}>
                  {product.portion}
                </p>

                <a
                  href={`https://wa.me/56912345678?text=${encodeURIComponent(
                    `Hola, quiero comprar ${product.name} de FEROX BARF`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex items-center justify-between gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground flex items-start gap-3">
            <ShoppingCart className="h-4 w-4 mt-0.5 text-foreground" />
            Carrito de compra activo: agrega productos y confirma cantidades para cerrar tu pedido.
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground flex items-start gap-3">
            <ReceiptText className="h-4 w-4 mt-0.5 text-foreground" />
            Finalización: confirmamos por WhatsApp y enviamos mensaje automático de pedido recibido.
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Métodos de pago: Transferencia bancaria · Efectivo contra entrega. Seguimiento manual vía WhatsApp.
        </p>
      </div>
    </section>
  )
}
