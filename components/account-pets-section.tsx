"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import {
  Camera,
  CheckCircle2,
  PawPrint,
  Plus,
  ShieldCheck,
  Sparkles,
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
  updateDog,
  type DogFormData,
} from "@/lib/services/dog-service";
import {
  deleteMediaFile,
  getMediaPathFromPublicUrl,
  uploadImageToMediaBucket,
} from "@/lib/services/storage-service";
import {
  DeleteDogDialog,
} from "@/components/account-pets/delete-dog-dialog";
import { calculateDogFood } from "@/lib/helpers/calculate-dog-food";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DogCard } from "@/components/account-pets/dog-card";
import { DogFormFields } from "@/components/account-pets/dog-form-fields";
import { EditDogDialog } from "@/components/account-pets/edit-dog-dialog";
import { imageInputClassName } from "@/components/account-pets/constants";
import {
  getSupabaseErrorMessage,
  logSupabaseError,
} from "@/lib/services/supabase-error";
import { supabase } from "@/lib/supabase/client";
import type {
  Dog,
  Profile,
} from "@/lib/supabase/database.types";

const emptyDogForm: DogFormData = {
  nombre: "",
  peso: null,
  edad: null,
  etapa_vida: "adulto",
  tamano: "mediano",
  actividad: "moderada",
  estado_fisico: "normal",
  photo_url: null,
};


export function AccountPetsSection() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [dogForm, setDogForm] = useState<DogFormData>(emptyDogForm);
  const [dogPhotoFile, setDogPhotoFile] = useState<File | null>(null);
  const [dogPhotoPreview, setDogPhotoPreview] = useState("");
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [editDogForm, setEditDogForm] = useState<DogFormData>(emptyDogForm);
  const [editDogPhotoFile, setEditDogPhotoFile] = useState<File | null>(null);
  const [editDogPhotoPreview, setEditDogPhotoPreview] = useState("");
  const [dogToDelete, setDogToDelete] = useState<Dog | null>(null);
  const [isAddDogDialogOpen, setIsAddDogDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const user = session?.user ?? null;

  const refreshDashboard = useCallback(async (userId: string) => {
    const [profileData, userDogs] = await Promise.all([
      getProfile(userId),
      getDogsByUser(userId),
    ]);

    setProfile(profileData);
    setUsername(profileData?.username ?? "");
    setFullName(profileData?.full_name ?? "");
    setAvatarUrl(profileData?.avatar_url ?? "");
    setAvatarFile(null);
    setAvatarPreview(profileData?.avatar_url ?? "");
    setDogs(userDogs);
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
        logSupabaseError("Cargar sesión inicial / dashboard", error);
        setMessage(getSupabaseErrorMessage(error));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadInitialSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        refreshDashboard(nextSession.user.id).catch((error) => {
          logSupabaseError("Refrescar dashboard después de auth", error);
          setMessage(getSupabaseErrorMessage(error));
        });
      } else {
        setProfile(null);
        setDogs([]);
        setAvatarFile(null);
        setAvatarPreview("");
        setDogPhotoFile(null);
        setDogPhotoPreview("");
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [refreshDashboard]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
      if (dogPhotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(dogPhotoPreview);
      }
      if (editDogPhotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(editDogPhotoPreview);
      }
    };
  }, [avatarPreview, dogPhotoPreview, editDogPhotoPreview]);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      if (authMode === "signup") {
        await signUpWithPassword(email, password, fullName);
        setMessage(
          "Registro creado. Revisa tu correo si Supabase solicita confirmar la cuenta.",
        );
      } else {
        await signInWithPassword(email, password);
        setMessage("Sesión iniciada correctamente.");
      }
    } catch (error) {
      logSupabaseError("Autenticación", error);
      setMessage(getSupabaseErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAvatarFile(file);

    if (!file) {
      setAvatarPreview(avatarUrl);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview((currentPreview) => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
      return previewUrl;
    });
  };

  const handleDogPhotoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setDogPhotoFile(file);

    if (!file) {
      setDogPhotoPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setDogPhotoPreview((currentPreview) => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
      return previewUrl;
    });
  };

  const clearDogPhotoSelection = () => {
    setDogPhotoFile(null);
    setDogPhotoPreview((currentPreview) => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
      return "";
    });
  };

  const openEditDogDialog = (dog: Dog) => {
    setEditingDog(dog);
    setEditDogForm({
      nombre: dog.nombre ?? "",
      peso: dog.peso ?? null,
      edad: dog.edad ?? null,
      etapa_vida: dog.etapa_vida ?? "adulto",
      tamano: dog.tamano ?? "mediano",
      actividad: dog.actividad ?? "moderada",
      estado_fisico: dog.estado_fisico ?? "normal",
      photo_url: dog.photo_url ?? null,
    });
    setEditDogPhotoFile(null);
    setEditDogPhotoPreview(dog.photo_url ?? "");
  };

  const closeEditDogDialog = () => {
    setEditingDog(null);
    setEditDogForm(emptyDogForm);
    setEditDogPhotoFile(null);
    setEditDogPhotoPreview("");
  };

  const handleEditDogPhotoFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;
    setEditDogPhotoFile(file);

    if (!file) {
      setEditDogPhotoPreview(editDogForm.photo_url ?? "");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setEditDogPhotoPreview((currentPreview) => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
      return previewUrl;
    });
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setMessage("Inicia sesión para continuar.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const nextAvatarUrl = avatarFile
        ? await uploadImageToMediaBucket({
            file: avatarFile,
            userId: user.id,
            folder: "avatars",
          })
        : avatarUrl;

      const nextProfile = await upsertProfile(user, {
        username,
        fullName,
        avatarUrl: nextAvatarUrl,
      });
      setAvatarUrl(nextProfile.avatar_url ?? "");
      setAvatarFile(null);
      setAvatarPreview(nextProfile.avatar_url ?? "");
      setProfile(nextProfile);
      setMessage("Perfil actualizado correctamente.");
    } catch (error) {
      logSupabaseError("Guardar perfil", error);
      setMessage(getSupabaseErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setMessage("Inicia sesión para registrar perros.");
      return;
    }

    if (!dogForm.nombre.trim()) {
      setMessage("Agrega al menos el nombre del perro para guardarlo.");
      return;
    }

    if (dogForm.edad === null || !Number.isInteger(dogForm.edad)) {
      setMessage("Agrega la edad numérica del perro en años.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user || userData.user.id !== user.id) {
        throw new Error(
          "No hay una sesión autenticada válida para registrar el perro.",
        );
      }

      const photoUrl = dogPhotoFile
        ? await uploadImageToMediaBucket({
            file: dogPhotoFile,
            userId: userData.user.id,
            folder: "dogs",
          })
        : null;

      const dogPayload = {
        ...dogForm,
        photo_url: photoUrl,
      };
      console.info("[FEROX dogs] form payload", dogPayload);

      const dog = await createDog(userData.user.id, dogPayload);
      setDogs((currentDogs) => [dog, ...currentDogs]);
      setDogForm(emptyDogForm);
      clearDogPhotoSelection();
      setMessage(`${dog.nombre} quedó guardado correctamente.`);
    } catch (error) {
      logSupabaseError("Crear perro", error);
      setMessage(getSupabaseErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDog = async (dog: Dog) => {
    if (!user) return;

    setIsSaving(true);
    setMessage("");

    try {
      const previousPhotoPath = getMediaPathFromPublicUrl(dog.photo_url);
      if (previousPhotoPath) {
        try {
          await deleteMediaFile(previousPhotoPath);
        } catch (error) {
          console.warn(
            "[FEROX storage] No se pudo eliminar la imagen del perro antes de borrar el registro",
            { dogId: dog.id, previousPhotoPath, error },
          );
        }
      }

      await deleteDog(user.id, dog.id);
      setDogs((currentDogs) =>
        currentDogs.filter((currentDog) => currentDog.id !== dog.id),
      );
      setMessage("Perro eliminado correctamente.");
    } catch (error) {
      logSupabaseError("Eliminar perro", error);
      setMessage(getSupabaseErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateDog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !editingDog) return;

    if (!editDogForm.nombre.trim()) {
      setMessage("El nombre del perro es obligatorio.");
      return;
    }

    if (editDogForm.edad === null || !Number.isInteger(editDogForm.edad)) {
      setMessage("Agrega la edad numérica del perro en años.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const nextPhotoUrl = editDogPhotoFile
        ? await uploadImageToMediaBucket({
            file: editDogPhotoFile,
            userId: user.id,
            folder: "dogs",
          })
        : editDogForm.photo_url ?? null;

      const updatedDog = await updateDog(user.id, editingDog.id, {
        ...editDogForm,
        photo_url: nextPhotoUrl,
      });

      const previousPhotoPath = getMediaPathFromPublicUrl(editingDog.photo_url);
      const nextPhotoPath = getMediaPathFromPublicUrl(updatedDog.photo_url);
      const shouldDeletePreviousPhoto =
        Boolean(editDogPhotoFile) &&
        Boolean(previousPhotoPath) &&
        previousPhotoPath !== nextPhotoPath;

      if (shouldDeletePreviousPhoto && previousPhotoPath) {
        try {
          await deleteMediaFile(previousPhotoPath);
        } catch (error) {
          console.warn(
            "[FEROX storage] No se pudo eliminar la imagen anterior del perro tras editar",
            { dogId: editingDog.id, previousPhotoPath, error },
          );
        }
      }

      setDogs((currentDogs) =>
        currentDogs.map((dog) => (dog.id === updatedDog.id ? updatedDog : dog)),
      );
      setMessage(`${updatedDog.nombre} actualizado correctamente.`);
      closeEditDogDialog();
    } catch (error) {
      logSupabaseError("Editar perro", error);
      setMessage(getSupabaseErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteDog = async () => {
    if (!dogToDelete) return;
    await handleDeleteDog(dogToDelete);
    setDogToDelete(null);
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
      logSupabaseError("Cerrar sesión", error);
      setMessage(getSupabaseErrorMessage(error));
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
        {!user ? (
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
                Crea una cuenta, registra tus perros y gestiona sus recomendaciones BARF desde tu dashboard privado.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border bg-background p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-foreground text-background">
                  <PawPrint className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Acceso seguro
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Email y contraseña listo. Google OAuth queda preparado para activar en Supabase.
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
        ) : (
          message ? (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {message}
            </div>
          ) : null
        )}

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
                  {isSaving
                    ? "Procesando..."
                    : authMode === "signup"
                      ? "Crear cuenta"
                      : "Entrar"}
                </button>
              </form>

              <button
                type="button"
                onClick={() =>
                  signInWithGoogle().catch((error) => {
                    logSupabaseError("Google OAuth", error);
                    setMessage(getSupabaseErrorMessage(error));
                  })
                }
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
                  perros y gestión completa con recomendaciones automáticas por perro.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Perros privados",
                    "Recomendación automática",
                    "Fotos con upload",
                    "Base social",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-background/10 p-4 text-sm font-semibold"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-end">
              <button type="button" onClick={() => setIsAddDogDialogOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-foreground bg-foreground px-3 py-2 text-xs font-semibold text-background"><Plus className="h-4 w-4" />Agregar perro</button>
            </div>
            {dogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {dogs.map((dog) => {
                  const recommendation = calculateDogFood(dog);
                  return (
                    <article key={dog.id} className="rounded-3xl border border-border bg-background p-3 shadow-sm">
                      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-muted">
                        {dog.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={dog.photo_url} alt={dog.nombre} className="h-full w-full object-cover" />
                        ) : <div className="flex h-full items-center justify-center text-muted-foreground"><Camera className="h-6 w-6" /></div>}
                      </div>
                      <p className="mt-2 text-center text-lg font-semibold">{dog.nombre}</p>
                      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{dog.peso ? `${dog.peso} kg` : "-- kg"}</span>
                        <span>{dog.edad ? `${dog.edad} años` : "-- años"}</span>
                      </div>
                      <p className="mt-2 text-center text-3xl font-bold text-foreground">{recommendation.gramosDia}g</p>
                      <p className="text-center text-xs text-muted-foreground">por día</p>
                      <div className="mt-2 flex justify-center gap-2">
                        <button type="button" onClick={() => openEditDogDialog(dog)} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">Editar</button>
                        <button type="button" onClick={() => setDogToDelete(dog)} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">Borrar</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-muted/25 p-8 text-center text-sm text-muted-foreground">
                No tienes perros aún. Toca + para agregar el primero.
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog open={isAddDogDialogOpen} onOpenChange={setIsAddDogDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar nuevo perro</DialogTitle>
            <DialogDescription>Completa los datos para registrar un perro nuevo.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDogSubmit} className="space-y-4">
            <DogFormFields form={dogForm} setForm={setDogForm} />
            <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-center">
              <div className="h-32 overflow-hidden rounded-3xl bg-muted">
                {dogPhotoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dogPhotoPreview} alt="Vista previa del perro" className="h-full w-full object-cover" />
                ) : <div className="flex h-full items-center justify-center text-muted-foreground"><Camera className="h-8 w-8" /></div>}
              </div>
              <label className="text-sm font-medium text-foreground">Foto del perro
                <input type="file" accept="image/*" onChange={handleDogPhotoFileChange} className={imageInputClassName} />
              </label>
            </div>
            <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-60">
              <Plus className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Añadir perro"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <EditDogDialog
        dog={editingDog}
        form={editDogForm}
        setForm={setEditDogForm}
        photoPreview={editDogPhotoPreview}
        isSaving={isSaving}
        onClose={closeEditDogDialog}
        onSubmit={handleUpdateDog}
        onPhotoChange={handleEditDogPhotoFileChange}
      />
      <DeleteDogDialog
        dog={dogToDelete}
        isSaving={isSaving}
        onCancel={() => setDogToDelete(null)}
        onConfirm={confirmDeleteDog}
      />
    </section>
  );
}
