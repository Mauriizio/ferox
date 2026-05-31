"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import {
  Camera,
  CheckCircle2,
  MessageCircle,
  PawPrint,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { upsertProfile } from "@/lib/services/auth-service";
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
import { toast } from "@/hooks/use-toast";
import {
  getSupabaseErrorMessage,
  logSupabaseError,
} from "@/lib/services/supabase-error";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import type { Dog } from "@/lib/supabase/database.types";

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

const ASYNC_OPERATION_TIMEOUT_MS = 10_000;

function withAsyncTimeout<T>(
  promise: Promise<T>,
  errorMessage: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(errorMessage));
    }, ASYNC_OPERATION_TIMEOUT_MS);

    promise
      .then(resolve, reject)
      .finally(() => window.clearTimeout(timeoutId));
  });
}

export function AccountPetsSection() {
  const { user, profile, authLoading, setProfile } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
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

  useEffect(() => {
    setUsername(profile?.username ?? "");
    setFullName(profile?.full_name ?? "");
    setAvatarUrl(profile?.avatar_url ?? "");
    setAvatarFile(null);
    setAvatarPreview(profile?.avatar_url ?? "");
  }, [profile]);

  useEffect(() => {
    let mounted = true;

    if (authLoading) return () => {
      mounted = false;
    };

    if (!user) {
      setDogs([]);
      setDogPhotoFile(null);
      setDogPhotoPreview("");
      setIsLoading(false);
      return () => {
        mounted = false;
      };
    }

    setIsLoading(true);
    getDogsByUser(user.id)
      .then((userDogs) => {
        if (mounted) setDogs(userDogs);
      })
      .catch((error) => {
        if (!mounted) return;
        logSupabaseError("Cargar perros del dashboard", error);
        setMessage(getSupabaseErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [authLoading, user?.id]);

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
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await withAsyncTimeout(
        supabase.auth.getSession(),
        "No se pudo validar la sesión. Intenta nuevamente.",
      );

      if (sessionError) throw sessionError;

      const currentUser = currentSession?.user;
      if (!currentUser?.id || currentUser.id !== user.id) {
        const expiredSessionMessage =
          "Tu sesión expiró. Inicia sesión nuevamente para registrar perros.";
        toast({
          title: "Sesión expirada",
          description: expiredSessionMessage,
        });
        setMessage(expiredSessionMessage);
        setIsAddDogDialogOpen(false);
        return;
      }

      const photoUrl = dogPhotoFile
        ? await withAsyncTimeout(
            uploadImageToMediaBucket({
              file: dogPhotoFile,
              userId: currentUser.id,
              folder: "dogs",
            }),
            "La subida de la foto tardó demasiado. Intenta nuevamente.",
          )
        : null;

      const dogPayload = {
        ...dogForm,
        photo_url: photoUrl,
      };

      const dog = await withAsyncTimeout(
        createDog(currentUser.id, dogPayload),
        "Guardar el perro tardó demasiado. Intenta nuevamente.",
      );
      setDogs((currentDogs) => [dog, ...currentDogs]);
      setDogForm(emptyDogForm);
      clearDogPhotoSelection();
      setIsAddDogDialogOpen(false);
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



  if (isLoading) return null;

  if (!user) return null;

  return (
    <section
      id="cuenta"
      className="relative overflow-hidden border-t border-border bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.08),transparent_34%),linear-gradient(180deg,#f7f7f7_0%,#ffffff_100%)]"
    >
      <PawPrint className="pointer-events-none absolute -left-8 top-20 h-32 w-32 rotate-[-18deg] text-foreground/[0.035]" aria-hidden="true" />
      <PawPrint className="pointer-events-none absolute right-6 top-44 h-24 w-24 rotate-[18deg] text-foreground/[0.04]" aria-hidden="true" />
      <PawPrint className="pointer-events-none absolute bottom-14 left-1/2 h-40 w-40 -translate-x-1/2 rotate-[10deg] text-foreground/[0.025]" aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {message ? (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {message}
          </div>
        ) : null}

        <div className="mt-8 rounded-[2rem] border border-border/80 bg-background/75 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur sm:p-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <span className="section-eyebrow text-muted-foreground">Dashboard</span>
                <h2 className="ferox-display-title text-3xl font-normal tracking-tight text-foreground sm:text-4xl">Mis perros</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Gestiona sus datos, revisa su porción diaria y pide directo por WhatsApp.</p>
              </div>
              <button type="button" onClick={() => setIsAddDogDialogOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[0_14px_32px_rgba(0,0,0,0.18)] transition hover:bg-foreground/90"><Plus className="h-4 w-4" />Agregar perro</button>
            </div>
            {dogs.length > 0 ? (
              <div className="mx-auto mt-6 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dogs.map((dog) => {
                  const recommendation = calculateDogFood(dog);
                  const dogOrderMessage = encodeURIComponent(
                    `Hola FEROX BARF, quiero pedir comida para ${dog.nombre}. Recomendación diaria: ${recommendation.gramosDia}g.`,
                  );
                  return (
                    <article key={dog.id} className="rounded-3xl border border-border bg-background/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
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
                      <a
                        href={`https://wa.me/56927973379?text=${dogOrderMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Hacer pedido
                      </a>
                      <div className="mt-2 flex justify-center gap-2">
                        <button type="button" onClick={() => openEditDogDialog(dog)} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">Editar</button>
                        <button type="button" onClick={() => setDogToDelete(dog)} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">Borrar</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-border bg-muted/25 p-8 text-center text-sm text-muted-foreground">
                No tienes perros aún. Toca + para agregar el primero.
              </div>
            )}
          </div>
      </div>
      <Dialog open={isAddDogDialogOpen} onOpenChange={setIsAddDogDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar nuevo perro</DialogTitle>
            <DialogDescription>Completa los datos para registrar un perro nuevo.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDogSubmit} className="space-y-5">
            <div className="space-y-3 rounded-[1.75rem] border border-border bg-muted/20 p-3">
              <p className="text-sm font-semibold text-foreground">Foto del perro</p>
              <label htmlFor="add-dog-photo-file" className="group relative block h-44 cursor-pointer overflow-hidden rounded-[1.5rem] bg-muted transition hover:ring-4 hover:ring-foreground/10 sm:h-56" aria-label="Seleccionar foto del perro">
                {dogPhotoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dogPhotoPreview} alt="Vista previa del perro" className="h-full w-full object-cover" />
                ) : <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"><Camera className="h-9 w-9" /><span className="text-sm font-medium">Toca para subir una foto</span></div>}
                <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                  <Camera className="h-7 w-7" />
                </span>
              </label>
              <input id="add-dog-photo-file" type="file" accept="image/*" onChange={handleDogPhotoFileChange} className="sr-only" />
              <label htmlFor="add-dog-photo-file" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-background">
                <Camera className="h-4 w-4" />
                Seleccionar foto
              </label>
            </div>
            <DogFormFields form={dogForm} setForm={setDogForm} />
            <button type="submit" disabled={isSaving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:bg-foreground/90 disabled:opacity-60">
              <Plus className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Agregar perro"}
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
