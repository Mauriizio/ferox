"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Camera, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import {
  getProfile,
  signInWithGoogle,
  sendPasswordRecoveryEmail,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  upsertProfile,
} from "@/lib/services/auth-service";
import type { Profile } from "@/lib/supabase/database.types";
import { deleteMediaFile, getMediaPathFromPublicUrl, uploadImageToMediaBucket } from "@/lib/services/storage-service";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#calculadora", label: "Calculadora" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#comentarios", label: "Reseñas" },
  { href: "#tienda", label: "Tienda" },
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
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [settingsUsername, setSettingsUsername] = useState("");
  const [settingsAvatarUrl, setSettingsAvatarUrl] = useState("");
  const [settingsAvatarFile, setSettingsAvatarFile] = useState<File | null>(null);
  const [settingsAvatarPreview, setSettingsAvatarPreview] = useState("");
  const [mounted, setMounted] = useState(false);

  const recoveryMessageType = recoveryMessage
    ? recoveryMessage.startsWith("Revisa tu correo")
      ? "success"
      : recoveryMessage.startsWith("No se pudo")
        ? "error"
        : "loading"
    : "idle";

  const user = session?.user ?? null;
  const userName =
    profile?.full_name?.trim() ||
    profile?.username?.trim() ||
    user?.email?.split("@")[0]?.trim() ||
    "Usuario";
  const onHero = !scrolled;

  useEffect(() => {
    setSettingsName(profile?.full_name ?? "");
    setSettingsUsername(profile?.username ?? "");
    setSettingsAvatarUrl(profile?.avatar_url ?? "");
    setSettingsAvatarPreview(profile?.avatar_url ?? "");
    setSettingsAvatarFile(null);
  }, [profile]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);


  useEffect(() => {
    setMounted(true);
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

  const handleSendRecovery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSendingRecovery(true);
    setRecoveryMessage("Enviando enlace...");

    try {
      await sendPasswordRecoveryEmail(recoveryEmail);
      setRecoveryMessage("Revisa tu correo para continuar con la recuperación.");
    } catch {
      setRecoveryMessage("No se pudo enviar el enlace. Verifica el correo e intenta nuevamente.");
    } finally {
      setIsSendingRecovery(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthOpen(false);
      setOpen(false);
      setMessage("");
    } catch {
      setMessage("No se pudo cerrar sesión. Intenta nuevamente.");
    }
  };

  const handleSettingsAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSettingsAvatarFile(file);
    if (!file) {
      setSettingsAvatarPreview(settingsAvatarUrl);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setSettingsAvatarPreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return previewUrl;
    });
  };

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setMessage("");
    try {
      const nextAvatarUrl = settingsAvatarFile
        ? await uploadImageToMediaBucket({ file: settingsAvatarFile, userId: user.id, folder: "avatars" })
        : settingsAvatarUrl;
      const nextProfile = await upsertProfile(user, {
        fullName: settingsName,
        username: settingsUsername,
        avatarUrl: nextAvatarUrl,
      });
      const prevPath = getMediaPathFromPublicUrl(settingsAvatarUrl);
      const nextPath = getMediaPathFromPublicUrl(nextProfile.avatar_url);
      if (settingsAvatarFile && prevPath && prevPath !== nextPath) {
        await deleteMediaFile(prevPath).catch(() => undefined);
      }
      setProfile(nextProfile);
      setMessage("Perfil actualizado correctamente.");
      setSettingsOpen(false);
    } catch {
      setMessage("No se pudo actualizar el perfil. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const mobileMenu = open ? (
    <div
      data-mobile-menu-overlay="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        minHeight: "100dvh",
        width: "100vw",
        backgroundColor: onHero ? "#000000" : "#ffffff",
        color: onHero ? "#ffffff" : "#111111",
        overflowY: "auto",
        isolation: "isolate",
      }}
      className="lg:hidden"
    >
      <div className="flex min-h-[100dvh] flex-col px-4 pb-8 pt-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Inicio FEROX" onClick={() => setOpen(false)}>
            <Image src={scrolled ? "/logo.png" : "/logoblanco.png"} alt="FEROX" width={170} height={48} className="h-10 w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              onHero
                ? "border-white/25 text-white hover:bg-white/10 focus-visible:ring-white/70 focus-visible:ring-offset-black"
                : "border-border text-foreground hover:bg-muted focus-visible:ring-foreground/50 focus-visible:ring-offset-background",
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col justify-center" aria-label="Menú móvil">
          <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
            {navLinks
              .filter((link) => link.href !== "#tienda")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-center text-base font-semibold transition",
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
                "mt-1 rounded-full px-4 py-3 text-center text-base font-semibold transition",
                onHero ? "bg-white text-black hover:bg-white/90" : "bg-foreground text-background hover:bg-foreground/90",
              )}
            >
              Tienda
            </Link>

            {user ? (
              <>
                <div className={cn("my-2 h-px", onHero ? "bg-white/20" : "bg-border")} aria-hidden="true" />
                <button
                  type="button"
                  aria-label="Configuración"
                  onClick={() => {
                    setSettingsOpen(true);
                    setOpen(false);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-3.5 text-sm font-semibold transition",
                    onHero ? "border-white/30 text-white hover:bg-white/10" : "border-border text-foreground hover:bg-muted",
                  )}
                >
                  Configuración
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    "rounded-full border px-4 py-3.5 text-sm font-semibold transition",
                    onHero ? "border-white/30 text-white hover:bg-white/10" : "border-border text-foreground hover:bg-muted",
                  )}
                >
                  Cerrar sesión
                </button>
              </>
            ) : null}
          </div>
        </nav>
      </div>
    </div>
  ) : null;


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
              <div className="inline-flex items-center gap-2">
                <span className={cn("grid h-11 w-11 place-items-center overflow-hidden rounded-full", onHero ? "border border-white/30 bg-white/10" : "border border-border bg-muted")} aria-label="Tu avatar">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>
                <span className={cn("max-w-[9rem] truncate text-sm font-semibold", onHero ? "text-white" : "text-foreground")}>
                  {userName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                aria-label="Configuración"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full transition",
                  onHero ? "border border-white/30 text-white hover:bg-white/10" : "border border-border text-foreground hover:bg-muted",
                )}
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  onHero ? "border border-white/30 text-white hover:bg-white/10" : "border border-border text-foreground hover:bg-muted",
                )}
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
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
              {mode === "login" ? (
                <>
                  <button type="button" onClick={() => setRecoveryOpen((value) => !value)} className="text-xs font-medium text-muted-foreground underline underline-offset-4">
                    ¿Olvidaste tu contraseña?
                  </button>
                  {recoveryOpen ? (
                    <form onSubmit={handleSendRecovery} className="mt-2 space-y-2 rounded-xl border border-border p-3">
                      <input type="email" required value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
                      <button type="submit" disabled={isSendingRecovery} className="w-full rounded-full border border-border px-4 py-2 text-sm font-semibold">
                        {isSendingRecovery ? "Enviando..." : "Enviar enlace"}
                      </button>
                    </form>
                  ) : null}
                </>
              ) : null}
              <button type="button" onClick={() => signInWithGoogle()} className="mt-2 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold">Continuar con Google</button>
              {message ? <p className="mt-2 text-xs text-muted-foreground">{message}</p> : null}
              {recoveryMessage ? (
                <p
                  className={`mt-2 rounded-lg border px-2.5 py-2 text-xs ${
                    recoveryMessageType === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : recoveryMessageType === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-border bg-muted text-muted-foreground"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {recoveryMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {mounted && open && mobileMenu ? createPortal(mobileMenu, document.body) : null}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configuración de perfil</DialogTitle>
            <DialogDescription>Actualiza tu nombre, usuario y foto de perfil.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-border bg-muted">
              {settingsAvatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settingsAvatarPreview} alt="Vista previa avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground"><Camera className="h-6 w-6" /></div>
              )}
            </div>
            <label className="block text-sm font-medium">Foto de perfil
              <input type="file" accept="image/*" onChange={handleSettingsAvatarChange} className="mt-2 block w-full text-sm" />
            </label>
            <label className="block text-sm font-medium">Nombre
              <input value={settingsName} onChange={(e)=>setSettingsName(e.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm font-medium">Usuario
              <input value={settingsUsername} onChange={(e)=>setSettingsUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm" />
            </label>
            <button type="submit" disabled={isSaving} className="w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">{isSaving ? "Guardando..." : "Guardar cambios"}</button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
