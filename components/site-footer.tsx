import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Heart, MessageCircle } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="FEROX BARF inicio">
              <Image
                src="/logo.png"
                alt="FEROX Nutrición BARF Premium"
                width={260}
                height={78}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Alimentación natural, fresca y biológicamente adecuada para perros. Comida real para una vida mejor.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://wa.me/56927973379"
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-lift premium-transition inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-foreground hover:text-background"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/barfferox"
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-lift premium-transition inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-foreground hover:text-background"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61579530517514"
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-lift premium-transition inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-foreground hover:text-background"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Navegacion</h3>
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
                  className="premium-transition hover:text-foreground"
                >
                  +56 9 2797 3379
                </a>
              </li>
              <li>
                <a href="mailto:Ferox156500@gmail.com" className="premium-transition hover:text-foreground">
                  Ferox156500@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/barfferox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-transition hover:text-foreground"
                >
                  Instagram @barfferox
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61579530517514"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-transition hover:text-foreground"
                >
                  Facebook FEROX
                </a>
              </li>
              <li>Santiago, Chile</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-border pt-8 text-center text-xs text-muted-foreground md:grid-cols-3 md:items-center">
          <p className="md:text-left">
            © {new Date().getFullYear()} FEROX BARF. Todos los derechos reservados.
          </p>
          <a
            href="https://maurizio.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-lift premium-transition inline-flex items-center justify-center gap-1.5 justify-self-center rounded-full bg-foreground px-3 py-1.5 text-background hover:bg-foreground/90"
          >
            Web hecha con <Heart className="h-3.5 w-3.5 fill-background text-background" aria-hidden="true" /> por maurizio.dev
          </a>
          <div className="flex items-center justify-center gap-6 md:justify-end">
            <Link href="/terminos" className="premium-transition hover:text-foreground">
              Términos
            </Link>
            <Link href="/privacidad" className="premium-transition hover:text-foreground">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
