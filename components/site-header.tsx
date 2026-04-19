"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

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
          ? "bg-background/75 backdrop-blur-xl border-b border-border shadow-[0_10px_30px_rgba(0,0,0,0.07)]"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="FEROX BARF inicio">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background font-serif text-lg font-bold shadow-lg shadow-primary/30">
              F
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              FEROX
              <span className="ml-1 text-xs font-sans font-normal text-muted-foreground tracking-widest">
                BARF
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="#calculadora"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-95 transition-all shadow-lg shadow-primary/30"
            >
              Calcular ahora
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border py-4 bg-background">
            <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-base text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#calculadora"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background"
              >
                Calcular ahora
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}