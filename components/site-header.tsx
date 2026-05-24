"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import {
  getProfile,
  signInWithGoogle,
  signInWithPassword,
  signOut,
  signUpWithPassword,
} from "@/lib/services/auth-service";
import type { Profile } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#calculadora", label: "Calculadora" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#comentarios", label: "Reseñas" },
];

type Props = { onSessionChange?: (session: Session | null) => void };

export function SiteHeader({ onSessionChange }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const user = session?.user ?? null;
  const onHero = !scrolled;

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
      onSessionChange?.(data.session);
      if (data.session?.user) {
        const userProfile = await getProfile(data.session.user.id);
        if (mounted) setProfile(userProfile);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        onSessionChange?.(nextSession);
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

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      if (mode === "signup") {
        await signUpWithPassword(email, password, fullName);
        setMessage("Cuenta creada. Revisa tu correo para confirmar.");
      } else {
        await signInWithPassword(email, password);
        setAuthOpen(false);
      }
    } catch {
      setMessage("No se pudo iniciar sesión. Verifica tus datos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        onHero
          ? "border-white/15 bg-black/30 backdrop-blur-[2px]"
          : "border-border bg-background/92 backdrop-blur-md shadow-[0_10px_26px_rgba(0,0,0,0.1)]",
      )}
    >
      <div className="relative hidden overflow-hidden border-b border-white/10 bg-black text-white/85 md:block">
        <div className="ticker-track py-1 text-[10px] font-medium uppercase tracking-[0.16em]">
          <div className="ticker-group">
            <span className="ticker-item">FEROX BARF · nutrición real para perros</span>
            <span className="ticker-item">carne real · órganos · vegetales frescos</span>
            <span className="ticker-item">más energía · mejor digestión · pelaje brillante</span>
          </div>
          <div className="ticker-group" aria-hidden="true">
            <span className="ticker-item">FEROX BARF · nutrición real para perros</span>
            <span className="ticker-item">carne real · órganos · vegetales frescos</span>
            <span className="ticker-item">más energía · mejor digestión · pelaje brillante</span>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden border-b border-white/10 bg-black text-white/85 md:hidden">
        <div className="ticker-track py-1 text-[9px] font-medium uppercase tracking-[0.14em]">
          <div className="ticker-group">
            <span className="ticker-item">FEROX BARF · nutrición real para perros</span>
            <span className="ticker-item">carne real · órganos · vegetales frescos</span>
            <span className="ticker-item">más energía · mejor digestión · pelaje brillante</span>
          </div>
          <div className="ticker-group" aria-hidden="true">
            <span className="ticker-item">FEROX BARF · nutrición real para perros</span>
            <span className="ticker-item">carne real · órganos · vegetales frescos</span>
            <span className="ticker-item">más energía · mejor digestión · pelaje brillante</span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-18 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Inicio FEROX">
          <Image src={scrolled ? "/logo.png" : "/logoblanco.png"} alt="FEROX" width={170} height={48} className="h-10 w-auto transition-all" priority />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition",
                onHero ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => signOut()}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  onHero ? "border border-white/30 text-white hover:bg-white/10" : "border border-border text-foreground hover:bg-muted",
                )}
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
              <a href="/" className={cn("rounded-full px-4 py-2 text-sm font-semibold", onHero ? "text-white" : "text-foreground")}>
                Mi cuenta
              </a>
              <span className={cn("grid h-10 w-10 place-items-center overflow-hidden rounded-full", onHero ? "border border-white/30 bg-white/10" : "border border-border bg-muted")} aria-label="Tu avatar">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                )}
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen((value) => !value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                onHero ? "bg-white text-black hover:bg-white/90" : "bg-foreground text-background hover:bg-foreground/90",
              )}
            >
              Iniciar sesión
            </button>
          )}
          <a href="#tienda" className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full border transition", onHero ? "border-white/25 text-white hover:bg-white/10" : "border-border text-foreground hover:bg-muted")} aria-label="Ir a tienda">
            <ShoppingCart className="h-4 w-4" />
          </a>
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} className={cn("inline-flex h-10 w-10 items-center justify-center rounded-md border lg:hidden", onHero ? "border-white/25 text-white" : "border-border text-foreground")} aria-label="Abrir menú">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {authOpen && !user ? (
        <div className="pointer-events-none absolute inset-x-0 top-full z-50 hidden lg:block">
          <div className="mx-auto flex w-full max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto mt-3 w-full max-w-sm rounded-2xl border border-border bg-background p-4 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
              <div className="mb-3 flex gap-2 text-sm font-semibold">
                <button type="button" onClick={() => setMode("login")} className={cn("rounded-full px-3 py-1", mode === "login" ? "bg-foreground text-background" : "bg-muted")}>Entrar</button>
                <button type="button" onClick={() => setMode("signup")} className={cn("rounded-full px-3 py-1", mode === "signup" ? "bg-foreground text-background" : "bg-muted")}>Crear cuenta</button>
              </div>
              <form onSubmit={handleAuthSubmit} className="space-y-2">
                {mode === "signup" ? <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-xl border border-border px-3 py-2 text-sm" /> : null}
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
                <button type="submit" disabled={isSaving} className="w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">{isSaving ? "Procesando..." : mode === "signup" ? "Crear cuenta" : "Entrar"}</button>
              </form>
              <button type="button" onClick={() => signInWithGoogle()} className="mt-2 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold">Continuar con Google</button>
              {message ? <p className="mt-2 text-xs text-muted-foreground">{message}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className={cn("border-t lg:hidden", onHero ? "border-white/15 bg-black/85 text-white backdrop-blur-xl" : "border-border bg-background")}>
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "w-full max-w-sm rounded-lg px-3 py-2 text-center text-[1.1rem] leading-none",
                  onHero ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted",
                )}
                style={{ fontFamily: '"Ferox", ui-sans-serif, system-ui, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <a href="#cuenta" onClick={() => setOpen(false)} className={cn("mt-2 w-full max-w-sm rounded-full px-4 py-2 text-center text-sm font-semibold", onHero ? "bg-white text-black" : "bg-foreground text-background")}>
                  Dashboard
                </a>
                <button type="button" onClick={handleSignOut} className={cn("w-full max-w-sm rounded-full px-4 py-2 text-sm font-semibold", onHero ? "border border-white/25 text-white" : "border border-border text-foreground")}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setAuthOpen((value) => !value);
                  }}
                  className={cn("mt-2 w-full max-w-sm rounded-full px-4 py-2 text-center text-sm font-semibold", onHero ? "bg-white text-black" : "bg-foreground text-background")}
                >
                  Iniciar sesión
                </button>
                {authOpen ? (
                  <div className="mt-2 w-full max-w-sm grid gap-2 rounded-2xl border border-border/60 bg-background/95 p-3 text-foreground">
                    <div className="flex gap-2 text-xs font-semibold">
                      <button type="button" onClick={() => setMode("login")} className={cn("rounded-full px-3 py-1", mode === "login" ? "bg-foreground text-background" : "bg-muted")}>Iniciar sesión</button>
                      <button type="button" onClick={() => setMode("signup")} className={cn("rounded-full px-3 py-1", mode === "signup" ? "bg-foreground text-background" : "bg-muted")}>Registrarse</button>
                    </div>
                    <form onSubmit={handleAuthSubmit} className="grid gap-2">
                      {mode === "signup" ? <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-xl border border-border px-3 py-2 text-sm" /> : null}
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
                      <button type="submit" disabled={isSaving} className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">{isSaving ? "Procesando..." : mode === "signup" ? "Crear cuenta" : "Entrar"}</button>
                    </form>
                    <button type="button" onClick={() => signInWithGoogle()} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Continuar con Google</button>
                    {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
