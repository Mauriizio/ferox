"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, ShoppingCart, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navLinks = [
  { href: "#que-es-barf", label: "¿Qué es BARF?" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#calculadora", label: "Calculadora" },
  { href: "#tienda", label: "Tienda" },
  { href: "#testimonios", label: "Testimonios" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const onHero = !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/88 backdrop-blur-md border-b border-black/8 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          : "bg-black/22 backdrop-blur-[2px]",
      )}
    >
      <div className="relative bg-black text-white/85 border-b border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-black to-transparent" />
        <div className="ticker-track py-1 text-[9px] sm:text-[10px] font-medium tracking-[0.16em] uppercase">
          <div className="ticker-group">
            <span className="ticker-item">FEROX BARF PREMIUM · NUTRICIÓN NATURAL PARA PERROS</span>
            <span className="ticker-item">CARNE REAL · ÓRGANOS · VEGETALES FRESCOS</span>
            <span className="ticker-item">SIN QUÍMICOS · SIN RELLENOS · SIN ULTRAPROCESADOS</span>
            <span className="ticker-item">MÁS ENERGÍA · MEJOR DIGESTIÓN · PELO MÁS BRILLANTE</span>
            <span className="ticker-item">ALIMENTACIÓN BIOLÓGICAMENTE APROPIADA</span>
            <span className="ticker-item">FRESCO · NATURAL · FUNCIONAL</span>
            <span className="ticker-item">NUTRICIÓN QUE SE NOTA EN SU CUERPO</span>
          </div>
          <div className="ticker-group" aria-hidden="true">
            <span className="ticker-item">FEROX BARF PREMIUM · NUTRICIÓN NATURAL PARA PERROS</span>
            <span className="ticker-item">CARNE REAL · ÓRGANOS · VEGETALES FRESCOS</span>
            <span className="ticker-item">SIN QUÍMICOS · SIN RELLENOS · SIN ULTRAPROCESADOS</span>
            <span className="ticker-item">MÁS ENERGÍA · MEJOR DIGESTIÓN · PELO MÁS BRILLANTE</span>
            <span className="ticker-item">ALIMENTACIÓN BIOLÓGICAMENTE APROPIADA</span>
            <span className="ticker-item">FRESCO · NATURAL · FUNCIONAL</span>
            <span className="ticker-item">NUTRICIÓN QUE SE NOTA EN SU CUERPO</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex md:hidden w-full items-center justify-between">
            <button
              type="button"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                onHero ? "text-white hover:bg-white/10" : "text-foreground hover:bg-black/5",
              )}
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center" aria-label="FEROX BARF inicio">
              <Image
                src={onHero ? "/logoblanco.png" : "/logo.png"}
                alt="FEROX Nutrición BARF Premium"
                width={220}
                height={64}
                priority
                className="h-12 w-auto transition-all"
              />
            </Link>

            <Link
              href="#tienda"
              aria-label="Ir al carrito de compras"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                onHero ? "text-white hover:bg-white/10" : "text-foreground hover:bg-black/5",
              )}
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>

          <Link href="/" className="hidden md:flex items-center" aria-label="FEROX BARF inicio">
            <Image
              src={onHero ? "/logoblanco.png" : "/logo.png"}
              alt="FEROX Nutrición BARF Premium"
              width={300}
              height={90}
              priority
              className="h-12 w-auto lg:h-16 transition-all"
            />
          </Link>

          <nav
            className={cn(
              "hidden md:flex items-center gap-8",
              onHero && "rounded-full bg-black/35 border border-white/15 px-5 py-2 backdrop-blur-sm",
            )}
            aria-label="Navegación principal"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:transition-all hover:after:w-full",
                  onHero
                    ? "text-white/95 hover:text-white after:bg-white [text-shadow:0_1px_8px_rgba(0,0,0,0.65)]"
                    : "text-foreground/80 hover:text-foreground after:bg-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="#tienda"
              className={cn(
                "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                onHero
                  ? "bg-white text-black hover:bg-white/90 shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                  : "bg-primary text-primary-foreground hover:brightness-95 shadow-lg shadow-primary/30",
              )}
            >
              Comprar ahora
            </Link>
          </div>
        </div>

        {open && (
          <div className={cn("md:hidden border-t py-4", onHero ? "border-white/20 bg-black/85" : "border-border bg-background")}>
            <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-3 text-base rounded-md transition-colors",
                    onHero ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#tienda"
                onClick={() => setOpen(false)}
                className={cn(
                  "mt-3 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium",
                  onHero ? "bg-white text-black" : "bg-foreground text-background",
                )}
              >
                Comprar ahora
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
