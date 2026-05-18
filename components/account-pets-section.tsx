"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Dog,
  PawPrint,
  Plus,
  Smartphone,
  Trash2,
  UserRound,
} from "lucide-react";

type UserProfile = {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
};

type DogProfile = {
  id: string;
  nombre: string;
  peso: string;
  edad: string;
  tamano: string;
  actividad: string;
  estado: string;
};

type LocalAccountData = {
  user: UserProfile | null;
  dogs: DogProfile[];
};

const STORAGE_KEY = "ferox-local-account";

const emptyUser: UserProfile = {
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
};

const emptyDog = {
  nombre: "",
  peso: "",
  edad: "Adulto",
  tamano: "Mediano",
  actividad: "Moderada",
  estado: "Normal",
};

type DogForm = typeof emptyDog;

const loadLocalAccount = (): LocalAccountData => {
  if (typeof window === "undefined") {
    return { user: null, dogs: [] };
  }

  const storedData = window.localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return { user: null, dogs: [] };
  }

  try {
    const parsedData = JSON.parse(storedData) as Partial<LocalAccountData>;
    return {
      user: parsedData.user ?? null,
      dogs: Array.isArray(parsedData.dogs) ? parsedData.dogs : [],
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return { user: null, dogs: [] };
  }
};

export function AccountPetsSection() {
  const [userForm, setUserForm] = useState<UserProfile>(emptyUser);
  const [dogForm, setDogForm] = useState<DogForm>(emptyDog);
  const [savedUser, setSavedUser] = useState<UserProfile | null>(null);
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [message, setMessage] = useState<string>("");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const account = loadLocalAccount();
    setSavedUser(account.user);
    setDogs(account.dogs);
    if (account.user) {
      setUserForm(account.user);
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const account: LocalAccountData = { user: savedUser, dogs };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  }, [dogs, hasHydrated, savedUser]);

  const completedUserFields = useMemo(
    () => Object.values(userForm).filter(Boolean).length,
    [userForm],
  );

  const handleUserSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedUser(userForm);
    setMessage("Cuenta guardada correctamente.");
  };

  const handleDogSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!dogForm.nombre.trim()) {
      setMessage("Agrega al menos el nombre del perro para guardarlo.");
      return;
    }

    const dog: DogProfile = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      nombre: dogForm.nombre.trim(),
      peso: dogForm.peso.trim(),
      edad: dogForm.edad,
      tamano: dogForm.tamano,
      actividad: dogForm.actividad,
      estado: dogForm.estado,
    };

    setDogs((currentDogs) => [dog, ...currentDogs]);
    setDogForm(emptyDog);
    setMessage(`${dog.nombre} quedó guardado correctamente.`);
  };

  const deleteDog = (dogId: string) => {
    setDogs((currentDogs) => currentDogs.filter((dog) => dog.id !== dogId));
    setMessage("Registro eliminado.");
  };

  const clearLocalData = () => {
    setSavedUser(null);
    setUserForm(emptyUser);
    setDogs([]);
    setMessage("Datos eliminados.");
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
              <Smartphone className="h-3.5 w-3.5 text-foreground" />
              Mi perfil
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl">
              Registra tu perfil y tus perros
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Registra tu información y la de tus perros para tener sus datos
              a mano y calcular porciones de forma más rápida.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border bg-background p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-foreground text-background">
                <PawPrint className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Resumen
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {savedUser
                    ? `${savedUser.nombre || "Usuario"} tiene ${dogs.length} perro${dogs.length === 1 ? "" : "s"} registrado${dogs.length === 1 ? "" : "s"}.`
                    : `Completa el perfil y luego agrega tus perros.`}
                </p>
              </div>
            </div>
            {message ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4" />
                {message}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <article className="rounded-[2rem] border border-border bg-background p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
            <div className="flex items-center justify-between gap-3 text-foreground">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                <h3 className="font-semibold">Registro de usuario</h3>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {completedUserFields}/4
              </span>
            </div>

            <form onSubmit={handleUserSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(
                  [
                    ["nombre", "Nombre", "Tu nombre", "text"],
                    ["apellido", "Apellido", "Tu apellido", "text"],
                    ["correo", "Correo", "correo@ejemplo.com", "email"],
                    ["telefono", "Teléfono", "+56 9 2797 3379", "tel"],
                  ] as [keyof UserProfile, string, string, string][]
                ).map(([field, label, placeholder, type]) => (
                  <label key={field} className="text-sm font-medium text-foreground">
                    {label}
                    <input
                      type={type}
                      value={userForm[field]}
                      onChange={(event) =>
                        setUserForm((currentForm) => ({
                          ...currentForm,
                          [field]: event.target.value,
                        }))
                      }
                      placeholder={placeholder}
                      className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                    />
                  </label>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90">
                  Guardar cuenta
                </button>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Puedes editar y volver a guardar cuando quieras.
                </p>
              </div>
            </form>
          </article>

          <article className="rounded-[2rem] border border-border bg-background p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
            <div className="flex items-center justify-between gap-3 text-foreground">
              <div className="flex items-center gap-2">
                <Dog className="h-5 w-5" />
                <h3 className="font-semibold">Registro de perros</h3>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {dogs.length} guardado{dogs.length === 1 ? "" : "s"}
              </span>
            </div>

            <form onSubmit={handleDogSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-foreground">
                  Nombre
                  <input
                    type="text"
                    value={dogForm.nombre}
                    onChange={(event) =>
                      setDogForm((currentForm) => ({
                        ...currentForm,
                        nombre: event.target.value,
                      }))
                    }
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
                    value={dogForm.peso}
                    onChange={(event) =>
                      setDogForm((currentForm) => ({
                        ...currentForm,
                        peso: event.target.value,
                      }))
                    }
                    placeholder="Ej: 12.5"
                    className="mt-2 block w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:bg-background focus:ring-2 focus:ring-foreground/10"
                  />
                </label>

                {(
                  [
                    ["edad", "Edad", ["Cachorro", "Adulto", "Senior"]],
                    ["tamano", "Tamaño", ["Pequeño", "Mediano", "Grande"]],
                    ["actividad", "Actividad", ["Baja", "Moderada", "Alta"]],
                    ["estado", "Estado físico", ["Normal", "Esterilizado", "Sobrepeso"]],
                  ] as [keyof DogForm, string, string[]][]
                ).map(([field, label, options]) => (
                  <label key={field} className="text-sm font-medium text-foreground">
                    {label}
                    <select
                      value={dogForm[field]}
                      onChange={(event) =>
                        setDogForm((currentForm) => ({
                          ...currentForm,
                          [field]: event.target.value,
                        }))
                      }
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

              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted">
                <Plus className="h-4 w-4" />
                Añadir perro
              </button>
            </form>
          </article>
        </div>

        {dogs.length > 0 ? (
          <div className="mt-6 rounded-[2rem] border border-border bg-background p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold">
                  Perros guardados
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Puedes modificar esta lista cuando lo necesites.
                </p>
              </div>
              <button
                type="button"
                onClick={clearLocalData}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                <Trash2 className="h-4 w-4" />
                Borrar todo
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => (
                <article
                  key={dog.id}
                  className="rounded-3xl border border-border bg-muted/35 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {dog.nombre}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dog.peso ? `${dog.peso} kg · ` : ""}
                        {dog.edad} · {dog.tamano}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteDog(dog.id)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-background text-muted-foreground transition hover:text-foreground"
                      aria-label={`Eliminar ${dog.nombre}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[dog.actividad, dog.estado].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
