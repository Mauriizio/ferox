"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import {
  Activity,
  Camera,
  CheckCircle2,
  Dog as DogIcon,
  History,
  LogOut,
  PawPrint,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  getCurrentSession,
  getProfile,
  signInWithGoogle,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  upsertProfile,
} from "@/lib/services/auth-service";
import {
  createDog,
  deleteDog,
  getDogsByUser,
  type DogFormData,
} from "@/lib/services/dog-service";
import { getFoodCalculationsByUser } from "@/lib/services/food-calculation-service";
import { calcularRacionBarf } from "@/lib/domain/feeding";
import { supabase } from "@/lib/supabase/client";
import type { Dog, FoodCalculation, Profile } from "@/lib/supabase/database.types";

const emptyDogForm: DogFormData = {
  nombre: "",
  peso: null,
  edad: "adulto",
  tamaño: "mediano",
  actividad: "moderada",
  estado_fisico: "normal",
  photo_url: "",
};

const getFriendlyError = (error: unknown) =>
  error instanceof Error ? error.message : "Ocurrió un error inesperado.";

export function AccountPetsSection() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [calculations, setCalculations] = useState<FoodCalculation[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [dogForm, setDogForm] = useState<DogFormData>(emptyDogForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const user = session?.user ?? null;

  const refreshDashboard = useCallback(async (userId: string) => {
    const [profileData, userDogs, userCalculations] = await Promise.all([
      getProfile(userId),
      getDogsByUser(userId),
      getFoodCalculationsByUser(userId),
    ]);

    setProfile(profileData);
    setUsername(profileData?.username ?? "");
    setFullName(profileData?.full_name ?? "");
    setAvatarUrl(profileData?.avatar_url ?? "");
    setDogs(userDogs);
    setCalculations(userCalculations);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadInitialSession() {
      try {
        const currentSession = await getCurrentSession();
        if (!mounted) return;
        setSession(currentSession);
        if (currentSession?.user) {
          await refreshDashboard(currentSession.user.id);
        }
      } catch (error) {
        setMessage(getFriendlyError(error));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadInitialSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        refreshDashboard(nextSession.user.id).catch((error) =>
          setMessage(getFriendlyError(error)),
        );
      } else {
        setProfile(null);
        setDogs([]);
        setCalculations([]);
      }
    });

    const refreshAfterCalculation = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await refreshDashboard(userData.user.id);
        }
      } catch (error) {
        setMessage(getFriendlyError(error));
      }
    };

    window.addEventListener("ferox:food-calculation-saved", refreshAfterCalculation);

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
      window.removeEventListener("ferox:food-calculation-saved", refreshAfterCalculation);
    };
  }, [refreshDashboard]);

  const latestCalculationByDog = useMemo(() => {
    return calculations.reduce<Record<string, FoodCalculation>>((acc, calculation) => {
      if (!acc[calculation.dog_id]) {
        acc[calculation.dog_id] = calculation;
      }
      return acc;
    }, {});
  }, [calculations]);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      if (authMode === "signup") {
        await signUpWithPassword(email, password, fullName);
        setMessage("Registro creado. Revisa tu correo si Supabase solicita confirmar la cuenta.");
      } else {
        await signInWithPassword(email, password);
        setMessage("Sesión iniciada correctamente.");
      }
    } catch (error) {
      setMessage(getFriendlyError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage("");

    try {
      const nextProfile = await upsertProfile(user, {
        username,
        fullName,
        avatarUrl,
      });
      setProfile(nextProfile);
      setMessage("Perfil actualizado correctamente.");
    } catch (error) {
      setMessage(getFriendlyError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    if (!dogForm.nombre.trim()) {
      setMessage("Agrega al menos el nombre del perro para guardarlo.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const dog = await createDog(user.id, dogForm);
      setDogs((currentDogs) => [dog, ...currentDogs]);
      setDogForm(emptyDogForm);
      setMessage(`${dog.nombre} quedó guardado correctamente.`);
    } catch (error) {
      setMessage(getFriendlyError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDog = async (dogId: string) => {
    if (!user) return;

    setIsSaving(true);
    setMessage("");

    try {
      await deleteDog(user.id, dogId);
      setDogs((currentDogs) => currentDogs.filter((dog) => dog.id !== dogId));
      setMessage("Perro eliminado correctamente.");
    } catch (error) {
      setMessage(getFriendlyError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      await signOut();
      setEmail("");
      setPassword("");
      setMessage("Sesión cerrada.");
    } catch (error) {
      setMessage(getFriendlyError(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      id="cuenta"
      className="border-t border-border bg-[linear-gradient(180deg,#f7f7f7_0%,#ffffff_100%)]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
              Cuenta FEROX
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl">
              Tu perfil, tus perros y sus porciones en un solo lugar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Crea una cuenta, registra tus perros y guarda los cálculos de la
              calculadora BARF sin tocar la experiencia pública de la tienda.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border bg-background p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-foreground text-background">
                <PawPrint className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {user ? "Dashboard privado" : "Acceso seguro"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user
                    ? `${profile?.full_name || user.email || "Usuario"} tiene ${dogs.length} perro${dogs.length === 1 ? "" : "s"} registrado${dogs.length === 1 ? "" : "s"}.`
                    : "Email y contraseña listo. Google OAuth queda preparado para activar en Supabase."}
                </p>
              </div>
            </div>
            {message ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {message}
              </div>
            ) : null}
          </div>
        </div>

        {!user ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <article className="rounded-[2rem] border border-border bg-background p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 text-foreground">
                <UserRound className="h-5 w-5" />
                <h3 className="font-semibold">
                  {authMode === "signup" ? "Crear cuenta" : "Iniciar sesión"}
                </h3>
              </div>

              <div className="mt-5 grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-semibold">
                {(["login", "signup"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAuthMode(mode)}
                    className={`rounded-full px-4 py-2 transition ${authMode === mode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    {mode === "login" ? "Entrar" : "Registrarme"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4">
                {authMode === "signup" ? (
                  <label className="text-sm font-medium text-foreground">
                    Nombre completo
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Tu nombre"
                      className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                    />
                  </label>
                ) : null}

                <label className="text-sm font-medium text-foreground">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                  />
                </label>

                <label className="text-sm font-medium text-foreground">
                  Contraseña
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSaving || isLoading}
                  className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Procesando..." : authMode === "signup" ? "Crear cuenta" : "Entrar"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => signInWithGoogle().catch((error) => setMessage(getFriendlyError(error)))}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Continuar con Google
              </button>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-border bg-foreground text-background shadow-[0_20px_55px_rgba(0,0,0,0.18)]">
              <div className="relative p-6 sm:p-8">
                <Image
                  src="/icon.svg"
                  alt="FEROX BARF"
                  width={140}
                  height={140}
                  className="absolute -right-8 -top-8 h-32 w-32 opacity-10 invert"
                />
                <Sparkles className="h-6 w-6" />
                <h3 className="mt-4 font-serif text-2xl font-bold">
                  Base profesional para una app con comunidad
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-background/70">
                  La capa privada queda separada de la landing: perfiles,
                  perros, cálculos guardados y servicios listos para comentarios
                  y likes con RLS por usuario.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["Perros privados", "Historial BARF", "Fotos por URL", "Base social"].map((item) => (
                    <div key={item} className="rounded-2xl bg-background/10 p-4 text-sm font-semibold">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-border bg-background p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
                <div className="flex items-center justify-between gap-3 text-foreground">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5" />
                    <h3 className="font-semibold">Perfil de usuario</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Salir
                  </button>
                </div>

                <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-foreground">
                      Usuario
                      <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="feroxlover"
                        className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                      />
                    </label>
                    <label className="text-sm font-medium text-foreground">
                      Nombre completo
                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Tu nombre"
                        className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                      />
                    </label>
                  </div>
                  <label className="text-sm font-medium text-foreground">
                    Avatar URL
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(event) => setAvatarUrl(event.target.value)}
                      placeholder="https://..."
                      className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-60"
                  >
                    Guardar perfil
                  </button>
                </form>
              </article>

              <article className="rounded-[2rem] border border-border bg-background p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
                <div className="flex items-center justify-between gap-3 text-foreground">
                  <div className="flex items-center gap-2">
                    <DogIcon className="h-5 w-5" />
                    <h3 className="font-semibold">Registro de perros</h3>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {dogs.length} guardado{dogs.length === 1 ? "" : "s"}
                  </span>
                </div>

                <form onSubmit={handleDogSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-foreground">
                      Nombre
                      <input
                        type="text"
                        value={dogForm.nombre}
                        onChange={(event) => setDogForm((form) => ({ ...form, nombre: event.target.value }))}
                        placeholder="Ej: Rocco"
                        className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                      />
                    </label>
                    <label className="text-sm font-medium text-foreground">
                      Peso (kg)
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.1"
                        value={dogForm.peso ?? ""}
                        onChange={(event) =>
                          setDogForm((form) => ({
                            ...form,
                            peso: event.target.value ? Number(event.target.value) : null,
                          }))
                        }
                        placeholder="Ej: 12.5"
                        className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                      />
                    </label>
                    {(
                      [
                        ["edad", "Edad", ["cachorro", "adulto", "senior"]],
                        ["tamaño", "Tamaño", ["pequeño", "mediano", "grande"]],
                        ["actividad", "Actividad", ["baja", "moderada", "alta"]],
                        ["estado_fisico", "Estado físico", ["normal", "esterilizado", "sobrepeso"]],
                      ] as [keyof DogFormData, string, string[]][]
                    ).map(([field, label, options]) => (
                      <label key={field} className="text-sm font-medium text-foreground">
                        {label}
                        <select
                          value={String(dogForm[field] ?? "")}
                          onChange={(event) => setDogForm((form) => ({ ...form, [field]: event.target.value }))}
                          className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                        >
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <label className="text-sm font-medium text-foreground">
                    Foto URL del perro
                    <input
                      type="url"
                      value={dogForm.photo_url ?? ""}
                      onChange={(event) => setDogForm((form) => ({ ...form, photo_url: event.target.value }))}
                      placeholder="https://..."
                      className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
                  >
                    <Plus className="h-4 w-4" />
                    Añadir perro
                  </button>
                </form>
              </article>
            </div>

            <div className="rounded-[2rem] border border-border bg-background p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold">Mini dashboard</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Datos privados del perro, último cálculo guardado e historial.
                  </p>
                </div>
                <a
                  href="#calculadora"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
                >
                  <Activity className="h-4 w-4" />
                  Ir a calculadora
                </a>
              </div>

              {dogs.length > 0 ? (
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {dogs.map((dog) => {
                    const latestCalculation = latestCalculationByDog[dog.id];
                    const previewCalculation = dog.peso
                      ? calcularRacionBarf({
                          peso: dog.peso,
                          edad: dog.edad === "cachorro" || dog.edad === "senior" ? dog.edad : "adulto",
                          actividad:
                            dog.actividad === "baja" || dog.actividad === "alta"
                              ? dog.actividad
                              : "moderada",
                          estadoFisico:
                            dog.estado_fisico === "esterilizado" || dog.estado_fisico === "sobrepeso"
                              ? dog.estado_fisico
                              : "normal",
                        })
                      : null;

                    return (
                      <article key={dog.id} className="overflow-hidden rounded-3xl border border-border bg-muted/30">
                        <div className="relative h-36 bg-foreground/5">
                          {dog.photo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={dog.photo_url} alt={dog.nombre} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              <Camera className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xl font-bold text-foreground">{dog.nombre}</p>
                              <p className="text-sm text-muted-foreground">
                                {dog.peso ? `${dog.peso} kg · ` : ""}
                                {dog.tamaño || "sin tamaño"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteDog(dog.id)}
                              className="grid h-9 w-9 place-items-center rounded-full bg-background text-muted-foreground transition hover:text-foreground"
                              aria-label={`Eliminar ${dog.nombre}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {[dog.edad, dog.actividad, dog.estado_fisico].filter(Boolean).map((tag) => (
                              <span key={tag} className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4 rounded-2xl bg-background p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              Cantidad calculada
                            </p>
                            <p className="mt-1 text-2xl font-bold text-foreground">
                              {latestCalculation?.gramos_diarios ?? previewCalculation?.gramosDia ?? 0} g/día
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {((latestCalculation?.gramos_mensuales ?? previewCalculation?.gramosMes ?? 0) / 1000).toLocaleString("es-CL", { maximumFractionDigits: 1 })} kg/mes
                            </p>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <History className="h-3.5 w-3.5" />
                            {calculations.filter((calculation) => calculation.dog_id === dog.id).length} cálculo(s) guardado(s)
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-dashed border-border bg-muted/25 p-8 text-center text-sm text-muted-foreground">
                  Aún no tienes perros registrados. Agrega el primero para activar el dashboard.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
