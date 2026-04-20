import Link from "next/link"
import { Instagram, Facebook, MessageCircle } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2" aria-label="FEROX BARF inicio">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background font-serif text-lg font-bold">
                F
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                FEROX
                <span className="ml-1 text-xs font-sans font-normal text-muted-foreground tracking-widest">
                  BARF
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Alimentación natural, fresca y biológicamente adecuada para perros. Comida real para una vida mejor.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://wa.me/56927973379"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-foreground hover:text-background transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-foreground hover:text-background transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-foreground hover:text-background transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Navegación</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="#que-es-barf" className="text-muted-foreground hover:text-foreground transition-colors">
                  ¿Qué es BARF?
                </Link>
              </li>
              <li>
                <Link href="#beneficios" className="text-muted-foreground hover:text-foreground transition-colors">
                  Beneficios
                </Link>
              </li>
              <li>
                <Link href="#calculadora" className="text-muted-foreground hover:text-foreground transition-colors">
                  Calculadora
                </Link>
              </li>
              <li>
                <Link href="#tienda" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://wa.me/56927973379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  +56 9 2797 3379
                </a>
              </li>
              <li>
                <a href="mailto:hola@feroxbarf.cl" className="hover:text-foreground transition-colors">
                  hola@feroxbarf.cl
                </a>
              </li>
              <li>Santiago, Chile</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FEROX BARF. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Términos
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
