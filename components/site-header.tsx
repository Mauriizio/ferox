"use client";

import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Camera, Eye, EyeOff, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import {
  signInWithGoogle,
  sendPasswordRecoveryEmail,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  upsertProfile,
} from "@/lib/services/auth-service";
import { useAuth } from "@/components/auth-provider";
import { deleteMediaFile, getMediaPathFromPublicUrl, uploadImageToMediaBucket } from "@/lib/services/storage-service";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/scroll-reveal";

const navLinks = [
  { href: "#calculadora", label: "Calculadora" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#comentarios", label: "Reseñas" },
  { href: "#tienda", label: "Tienda" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, profile, authLoading, setProfile } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  const recoveryMessageType = recoveryMessage
    ? recoveryMessage.startsWith("Revisa tu correo")
      ? "success"
      : recoveryMessage.startsWith("No se pudo")
        ? "error"
        : "loading"
    : "idle";

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
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktopViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
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

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);

    if (window.location.pathname !== "/") {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <Link href="/" className="flex items-center" aria-label="Inicio FEROX" onClick={handleLogoClick}>
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
          <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
            {navLinks
              .filter((link) => link.href !== "#tienda")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "ferox-display-title rounded-xl px-4 py-4 text-center text-[2rem] leading-none tracking-[0.04em] transition",
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
                "mt-3 rounded-full px-4 py-3.5 text-center text-base font-semibold transition",
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
                    "rounded-full border px-4 py-3.5 text-center text-sm font-semibold transition",
                    onHero ? "border-white/30 text-white hover:bg-white/10" : "border-border text-foreground hover:bg-muted",
                  )}
                >
                  Configuración
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    "rounded-full border px-4 py-3.5 text-center text-sm font-semibold transition",
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
      <ScrollReveal />
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-18 lg:px-8">
        <Link href="/" onClick={handleLogoClick} className="flex items-center" aria-label="Inicio FEROX">
          <Image src={scrolled ? "/logo.png" : "/logoblanco.png"} alt="FEROX" width={170} height={48} className="h-10 w-auto transition-all" priority />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "premium-transition text-sm font-medium",
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
                  "interactive-lift premium-transition inline-flex h-10 w-10 items-center justify-center rounded-full",
                  onHero ? "border border-white/30 text-white hover:bg-white/10" : "border border-border text-foreground hover:bg-muted",
                )}
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className={cn(
                  "interactive-lift premium-transition inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
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
                "interactive-lift premium-transition rounded-full px-4 py-2 text-sm font-semibold",
                onHero ? "bg-white text-black hover:bg-white/90" : "bg-foreground text-background hover:bg-foreground/90",
              )}
            >
              Iniciar sesión
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => {
              if (user) {
                setSettingsOpen(true);
                return;
              }
              setAuthOpen(true);
            }}
            aria-label={user ? "Configuración" : "Entrar"}
            className={cn(
              "interactive-lift premium-transition inline-flex h-9 w-9 items-center justify-center rounded-full",
              onHero ? "text-white/95 hover:bg-white/10 hover:text-white" : "text-foreground hover:bg-muted",
            )}
          >
            <UserRound className="h-5 w-5" />
          </button>
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Cerrar sesión"
              className={cn(
                "interactive-lift premium-transition inline-flex h-9 w-9 items-center justify-center rounded-full",
                onHero ? "text-white/95 hover:bg-white/10 hover:text-white" : "text-foreground hover:bg-muted",
              )}
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} className={cn("interactive-lift premium-transition inline-flex h-10 w-10 items-center justify-center rounded-md border lg:hidden", onHero ? "border-white/25 text-white" : "border-border text-foreground")} aria-label="Abrir menú">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {authOpen && !user && isDesktopViewport ? (
        <div className="pointer-events-none absolute inset-x-0 top-full z-50 hidden lg:block">
          <div className="mx-auto flex w-full max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto mt-3 w-full max-w-sm rounded-2xl border border-border bg-background p-4 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
              <div className="mb-3 flex gap-2 text-sm font-semibold">
                <button type="button" onClick={() => setMode("login")} className={cn("premium-transition rounded-full px-3 py-1", mode === "login" ? "bg-foreground text-background" : "bg-muted")}>Entrar</button>
                <button type="button" onClick={() => setMode("signup")} className={cn("premium-transition rounded-full px-3 py-1", mode === "signup" ? "bg-foreground text-background" : "bg-muted")}>Crear cuenta</button>
              </div>
              <form onSubmit={handleAuthSubmit} className="space-y-2">
                {mode === "signup" ? <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-xl border border-border px-3 py-2 text-sm" /> : null}
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full rounded-xl border border-border px-3 py-2 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-3 inline-flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "signup" ? (
                  <p className="rounded-xl border border-border bg-muted/35 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                    Al crear una cuenta, aceptas los{" "}
                    <Link href="/terminos" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-4">
                      Términos y Condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-4">
                      Política de Privacidad
                    </Link>{" "}
                    de FEROX.
                  </p>
                ) : null}
                <button type="submit" disabled={isSaving || authLoading} className="interactive-lift premium-transition w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">{isSaving ? "Procesando..." : mode === "signup" ? "Crear cuenta" : "Entrar"}</button>
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
              <button type="button" onClick={() => signInWithGoogle()} className="interactive-lift premium-transition mt-2 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold">Continuar con Google</button>
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

      <Dialog open={authOpen && !user && !isDesktopViewport} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-md lg:hidden">
          <DialogHeader>
            <DialogTitle>Iniciar sesión</DialogTitle>
            <DialogDescription>Accede a tu cuenta FEROX.</DialogDescription>
          </DialogHeader>
          <div className="mb-1 flex gap-2 text-sm font-semibold">
            <button type="button" onClick={() => setMode("login")} className={cn("premium-transition rounded-full px-3 py-1", mode === "login" ? "bg-foreground text-background" : "bg-muted")}>Entrar</button>
            <button type="button" onClick={() => setMode("signup")} className={cn("premium-transition rounded-full px-3 py-1", mode === "signup" ? "bg-foreground text-background" : "bg-muted")}>Crear cuenta</button>
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-2">
            {mode === "signup" ? <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-xl border border-border px-3 py-2 text-sm" /> : null}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-xl border border-border px-3 py-2 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === "signup" ? (
              <p className="rounded-xl border border-border bg-muted/35 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                Al crear una cuenta, aceptas los{" "}
                <Link href="/terminos" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-4">
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-4">
                  Política de Privacidad
                </Link>{" "}
                de FEROX.
              </p>
            ) : null}
            <button type="submit" disabled={isSaving || authLoading} className="interactive-lift premium-transition w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">{isSaving ? "Procesando..." : mode === "signup" ? "Crear cuenta" : "Entrar"}</button>
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
          <button type="button" onClick={() => signInWithGoogle()} className="interactive-lift premium-transition mt-1 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold">Continuar con Google</button>
          {message ? <p className="mt-1 text-xs text-muted-foreground">{message}</p> : null}
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
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configuración de perfil</DialogTitle>
            <DialogDescription>Actualiza tu nombre, usuario y foto de perfil.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <label htmlFor="settings-avatar-file" className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-border bg-muted transition hover:ring-4 hover:ring-foreground/10" aria-label="Cambiar foto de perfil">
                {settingsAvatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settingsAvatarPreview} alt="Vista previa avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground"><Camera className="h-6 w-6" /></div>
                )}
                <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                  <Camera className="h-5 w-5" />
                </span>
              </label>
              <input id="settings-avatar-file" type="file" accept="image/*" onChange={handleSettingsAvatarChange} className="sr-only" />
              <label htmlFor="settings-avatar-file" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90">
                <Camera className="h-4 w-4" />
                Cambiar foto de perfil
              </label>
            </div>
            <label className="block text-sm font-medium">Nombre
              <input value={settingsName} onChange={(e)=>setSettingsName(e.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm font-medium">Usuario
              <input value={settingsUsername} onChange={(e)=>setSettingsUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm" />
            </label>
            <button type="submit" disabled={isSaving} className="interactive-lift premium-transition w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">{isSaving ? "Guardando..." : "Guardar cambios"}</button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
