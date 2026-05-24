"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/services/auth-service";
import type { Profile } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#calculadora", label: "Calculadora" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#comentarios", label: "Reseñas" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const user = session?.user ?? null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        const userProfile = await getProfile(data.session.user.id);
        if (mounted) setProfile(userProfile);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user) {
          const userProfile = await getProfile(nextSession.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors",
        scrolled ? "border-border bg-background/95 backdrop-blur" : "border-transparent bg-background/80",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-18 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Inicio FEROX">
          <Image src="/logo.png" alt="FEROX" width={170} height={48} className="h-10 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <a href="#cuenta" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">
                Dashboard
              </a>
              <a href="#cuenta" className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-border bg-muted" aria-label="Ir a tu cuenta">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                )}
              </a>
            </>
          ) : (
            <a href="#cuenta" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/90">
              Iniciar sesión
            </a>
          )}
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden" aria-label="Abrir menú">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                {link.label}
              </Link>
            ))}
            <a href="#cuenta" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-foreground px-4 py-2 text-center text-sm font-semibold text-background">
              {user ? "Ir al dashboard" : "Iniciar sesión"}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
