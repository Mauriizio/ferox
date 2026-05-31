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
  MessageCircle,
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

function logSubmitDiagnostic(
  event: string,
  details: Record<string, unknown> = {},
) {
  console.info("[FEROX submit diagnóstico]", {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

function getSubmitDiagnosticRuntime(session?: Session | null) {
  return {
    documentVisibilityState:
      typeof document !== "undefined" ? document.visibilityState : null,
    navigatorOnLine:
      typeof navigator !== "undefined" ? navigator.onLine : null,
    sessionUserId: session?.user?.id ?? null,
    hasAccessToken: Boolean(session?.access_token),
    hasRefreshToken: Boolean(session?.refresh_token),
    sessionExpiresAt: session?.expires_at ?? null,
    sessionExpiresAtIso: session?.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : null,
  };
}

function getSubmitAwaitDurationMs(startedAt: number) {
  return (
    Math.round(
      ((typeof performance !== "undefined" ? performance.now() : Date.now()) -
        startedAt) *
        100,
    ) / 100
  );
}

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
    logSubmitDiagnostic("setIsSaving(true)", {
      caller: "handleAuthSubmit",
      isSaving,
      isAddDogDialogOpen,
    });
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
      logSubmitDiagnostic("setIsSaving(false)", {
        caller: "handleAuthSubmit.finally",
        isSaving,
        isAddDogDialogOpen,
      });
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

    logSubmitDiagnostic("setIsSaving(true)", {
      caller: "handleProfileSubmit",
      isSaving,
      isAddDogDialogOpen,
    });
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
      logSubmitDiagnostic("setIsSaving(false)", {
        caller: "handleProfileSubmit.finally",
        isSaving,
        isAddDogDialogOpen,
      });
      setIsSaving(false);
    }
  };

  const handleDogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const submitStartedAt =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const getSubmitDurationMs = () =>
      Math.round(
        ((typeof performance !== "undefined" ? performance.now() : Date.now()) -
          submitStartedAt) *
          100,
      ) / 100;

    event.preventDefault();
    logSubmitDiagnostic("[STEP 1] inicio handleDogSubmit", {
      durationMs: getSubmitDurationMs(),
      isSaving,
      isAddDogDialogOpen,
      hasUser: Boolean(user),
      userId: user?.id ?? null,
      nombre: dogForm.nombre.trim() || null,
      edad: dogForm.edad,
      hasPhoto: Boolean(dogPhotoFile),
    });
    logSubmitDiagnostic("handleDogSubmit:start", {
      durationMs: getSubmitDurationMs(),
      isSaving,
      isAddDogDialogOpen,
      hasUser: Boolean(user),
      userId: user?.id ?? null,
      nombre: dogForm.nombre.trim() || null,
      edad: dogForm.edad,
      hasPhoto: Boolean(dogPhotoFile),
    });

    if (!user) {
      logSubmitDiagnostic("handleDogSubmit:return", {
        reason: "sin usuario",
        isSaving,
        isAddDogDialogOpen,
      });
      setMessage("Inicia sesión para registrar perros.");
      return;
    }

    if (!dogForm.nombre.trim()) {
      logSubmitDiagnostic("handleDogSubmit:return", {
        reason: "nombre vacío",
        isSaving,
        isAddDogDialogOpen,
      });
      setMessage("Agrega al menos el nombre del perro para guardarlo.");
      return;
    }

    if (dogForm.edad === null || !Number.isInteger(dogForm.edad)) {
      logSubmitDiagnostic("handleDogSubmit:return", {
        reason: "edad inválida",
        edad: dogForm.edad,
        isSaving,
        isAddDogDialogOpen,
      });
      setMessage("Agrega la edad numérica del perro en años.");
      return;
    }

    logSubmitDiagnostic("setIsSaving(true)", {
      caller: "handleDogSubmit",
      isSaving,
      isAddDogDialogOpen,
    });
    setIsSaving(true);
    setMessage("");

    try {
      let awaitStartedAt =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      logSubmitDiagnostic("await:getSession:start", {
        durationMs: getSubmitDurationMs(),
        isSaving,
        isAddDogDialogOpen,
        ...getSubmitDiagnosticRuntime(session),
      });

      let sessionResult;
      try {
        sessionResult = await supabase.auth.getSession();
      } catch (error) {
        logSubmitDiagnostic("await:getSession:error", {
          durationMs: getSubmitDurationMs(),
          awaitDurationMs: getSubmitAwaitDurationMs(awaitStartedAt),
          error,
          ...getSubmitDiagnosticRuntime(session),
        });
        throw error;
      }

      logSubmitDiagnostic("await:getSession:done", {
        durationMs: getSubmitDurationMs(),
        awaitDurationMs: getSubmitAwaitDurationMs(awaitStartedAt),
        hasError: Boolean(sessionResult.error),
        error: sessionResult.error ?? null,
        ...getSubmitDiagnosticRuntime(sessionResult.data.session),
      });

      awaitStartedAt =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      logSubmitDiagnostic("await:refreshSession:start", {
        durationMs: getSubmitDurationMs(),
        isSaving,
        isAddDogDialogOpen,
        ...getSubmitDiagnosticRuntime(sessionResult.data.session),
      });

      let refreshResult;
      try {
        refreshResult = await supabase.auth.refreshSession();
      } catch (error) {
        logSubmitDiagnostic("await:refreshSession:error", {
          durationMs: getSubmitDurationMs(),
          awaitDurationMs: getSubmitAwaitDurationMs(awaitStartedAt),
          error,
          ...getSubmitDiagnosticRuntime(sessionResult.data.session),
        });
        throw error;
      }

      logSubmitDiagnostic("await:refreshSession:done", {
        durationMs: getSubmitDurationMs(),
        awaitDurationMs: getSubmitAwaitDurationMs(awaitStartedAt),
        hasError: Boolean(refreshResult.error),
        error: refreshResult.error ?? null,
        ...getSubmitDiagnosticRuntime(refreshResult.data.session),
      });

      awaitStartedAt =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      logSubmitDiagnostic("await:getUser:start", {
        durationMs: getSubmitDurationMs(),
        isSaving,
        isAddDogDialogOpen,
        ...getSubmitDiagnosticRuntime(refreshResult.data.session),
      });

      let userResult;
      try {
        userResult = await supabase.auth.getUser();
      } catch (error) {
        logSubmitDiagnostic("await:getUser:error", {
          durationMs: getSubmitDurationMs(),
          awaitDurationMs: getSubmitAwaitDurationMs(awaitStartedAt),
          error,
          ...getSubmitDiagnosticRuntime(refreshResult.data.session),
        });
        throw error;
      }

      logSubmitDiagnostic("await:getUser:done", {
        durationMs: getSubmitDurationMs(),
        awaitDurationMs: getSubmitAwaitDurationMs(awaitStartedAt),
        hasUser: Boolean(userResult.data.user),
        userId: userResult.data.user?.id ?? null,
        hasError: Boolean(userResult.error),
        error: userResult.error ?? null,
        ...getSubmitDiagnosticRuntime(refreshResult.data.session),
      });

      const { data: userData, error: userError } = userResult;
      if (userError) throw userError;
      if (!userData.user || userData.user.id !== user.id) {
        throw new Error(
          "No hay una sesión autenticada válida para registrar el perro.",
        );
      }

      logSubmitDiagnostic("[STEP 2] antes de cualquier upload", {
        durationMs: getSubmitDurationMs(),
        hasPhoto: Boolean(dogPhotoFile),
        userId: userData.user.id,
      });

      let photoUrl: string | null = null;
      if (dogPhotoFile) {
        logSubmitDiagnostic("[STEP 3] antes de upload avatar/foto", {
          durationMs: getSubmitDurationMs(),
          fileName: dogPhotoFile.name,
          fileType: dogPhotoFile.type,
          fileSizeBytes: dogPhotoFile.size,
        });
        awaitStartedAt =
          typeof performance !== "undefined" ? performance.now() : Date.now();
        logSubmitDiagnostic("await:uploadImageToMediaBucket:start", {
          durationMs: getSubmitDurationMs(),
          isSaving,
          isAddDogDialogOpen,
        });

        try {
          photoUrl = await uploadImageToMediaBucket({
            file: dogPhotoFile,
            userId: userData.user.id,
            folder: "dogs",
          });
        } catch (error) {
          logSubmitDiagnostic("await:uploadImageToMediaBucket:error", {
            durationMs: getSubmitDurationMs(),
            awaitDurationMs:
              Math.round(
                ((typeof performance !== "undefined"
                  ? performance.now()
                  : Date.now()) -
                  awaitStartedAt) *
                  100,
              ) / 100,
            error,
          });
          throw error;
        }

        logSubmitDiagnostic("await:uploadImageToMediaBucket:done", {
          durationMs: getSubmitDurationMs(),
          awaitDurationMs:
            Math.round(
              ((typeof performance !== "undefined"
                ? performance.now()
                : Date.now()) -
                awaitStartedAt) *
                100,
            ) / 100,
          hasPhotoUrl: Boolean(photoUrl),
          photoUrl,
        });
        logSubmitDiagnostic("[STEP 4] después de upload", {
          durationMs: getSubmitDurationMs(),
          hasPhotoUrl: Boolean(photoUrl),
          photoUrl,
        });
      } else {
        logSubmitDiagnostic("[STEP 3] sin upload avatar/foto", {
          durationMs: getSubmitDurationMs(),
          reason: "dogPhotoFile vacío",
        });
        logSubmitDiagnostic("[STEP 4] después de upload", {
          durationMs: getSubmitDurationMs(),
          skipped: true,
          photoUrl,
        });
      }

      const dogPayload = {
        ...dogForm,
        photo_url: photoUrl,
      };
      console.info("[FEROX dogs] form payload", dogPayload);

      logSubmitDiagnostic("[STEP 7] antes de createDog", {
        durationMs: getSubmitDurationMs(),
        userId: userData.user.id,
        nombre: dogPayload.nombre,
        hasPhotoUrl: Boolean(photoUrl),
      });
      awaitStartedAt =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      logSubmitDiagnostic("await:createDog:start", {
        durationMs: getSubmitDurationMs(),
        isSaving,
        isAddDogDialogOpen,
      });

      let dog;
      try {
        dog = await createDog(userData.user.id, dogPayload);
      } catch (error) {
        logSubmitDiagnostic("await:createDog:error", {
          durationMs: getSubmitDurationMs(),
          awaitDurationMs:
            Math.round(
              ((typeof performance !== "undefined"
                ? performance.now()
                : Date.now()) -
                awaitStartedAt) *
                100,
            ) / 100,
          error,
        });
        throw error;
      }

      logSubmitDiagnostic("await:createDog:done", {
        durationMs: getSubmitDurationMs(),
        awaitDurationMs:
          Math.round(
            ((typeof performance !== "undefined" ? performance.now() : Date.now()) -
              awaitStartedAt) *
              100,
          ) / 100,
        dogId: dog.id,
        nombre: dog.nombre,
      });
      logSubmitDiagnostic("[STEP 8] después de createDog", {
        durationMs: getSubmitDurationMs(),
        dogId: dog.id,
        nombre: dog.nombre,
      });
      setDogs((currentDogs) => [dog, ...currentDogs]);
      setDogForm(emptyDogForm);
      clearDogPhotoSelection();
      logSubmitDiagnostic("modal:close", {
        caller: "handleDogSubmit.success",
        previousOpen: isAddDogDialogOpen,
        nextOpen: false,
        isSaving,
      });
      setIsAddDogDialogOpen(false);
      setMessage(`${dog.nombre} quedó guardado correctamente.`);
    } catch (error) {
      logSupabaseError("Crear perro", error);
      setMessage(getSupabaseErrorMessage(error));
    } finally {
      logSubmitDiagnostic("[STEP 9] finally", {
        durationMs: getSubmitDurationMs(),
        isSaving,
        isAddDogDialogOpen,
      });
      logSubmitDiagnostic("setIsSaving(false)", {
        caller: "handleDogSubmit.finally",
        isSaving,
        isAddDogDialogOpen,
      });
      setIsSaving(false);
    }
  };

  const handleDeleteDog = async (dog: Dog) => {
    if (!user) return;

    logSubmitDiagnostic("setIsSaving(true)", {
      caller: "handleDeleteDog",
      isSaving,
      isAddDogDialogOpen,
    });
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
      logSubmitDiagnostic("setIsSaving(false)", {
        caller: "handleDeleteDog.finally",
        isSaving,
        isAddDogDialogOpen,
      });
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

    logSubmitDiagnostic("setIsSaving(true)", {
      caller: "handleUpdateDog",
      isSaving,
      isAddDogDialogOpen,
    });
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
      logSubmitDiagnostic("setIsSaving(false)", {
        caller: "handleUpdateDog.finally",
        isSaving,
        isAddDogDialogOpen,
      });
      setIsSaving(false);
    }
  };

  const confirmDeleteDog = async () => {
    if (!dogToDelete) return;
    await handleDeleteDog(dogToDelete);
    setDogToDelete(null);
  };

  const handleSignOut = async () => {
    logSubmitDiagnostic("setIsSaving(true)", {
      caller: "handleSignOut",
      isSaving,
      isAddDogDialogOpen,
    });
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
      logSubmitDiagnostic("setIsSaving(false)", {
        caller: "handleSignOut.finally",
        isSaving,
        isAddDogDialogOpen,
      });
      setIsSaving(false);
    }
  };


  const handleAddDogDialogOpenChange = (open: boolean) => {
    logSubmitDiagnostic("modal:onOpenChange", {
      previousOpen: isAddDogDialogOpen,
      nextOpen: open,
      isSaving,
    });
    setIsAddDogDialogOpen(open);
  };

  const handleAddDogButtonClick = () => {
    logSubmitDiagnostic("modal:open", {
      previousOpen: isAddDogDialogOpen,
      nextOpen: true,
      isSaving,
    });
    setIsAddDogDialogOpen(true);
  };

  const handleAddDogSubmitButtonClick = () => {
    logSubmitDiagnostic("submit button:click", {
      isSaving,
      isAddDogDialogOpen,
      disabled: isSaving,
      loadingState: isSaving ? "Guardando..." : "Añadir perro",
    });
  };


  if (isLoading) return null;

  if (!user) return null;

  const addDogSubmitDisabled = isSaving;
  const addDogSubmitLoadingState = isSaving ? "Guardando..." : "Añadir perro";

  logSubmitDiagnostic("modal:render", {
    isSaving,
    isAddDogDialogOpen,
  });
  logSubmitDiagnostic("submit button:render", {
    isSaving,
    disabled: addDogSubmitDisabled,
    loadingState: addDogSubmitLoadingState,
  });

  return (
    <section
      id="cuenta"
      className="border-t border-border bg-[linear-gradient(180deg,#f7f7f7_0%,#ffffff_100%)]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {message ? (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {message}
          </div>
        ) : null}

        <div className="mt-8 space-y-5">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <h2 className="ferox-display-title text-center text-3xl font-normal tracking-tight text-foreground sm:text-4xl">Mis perros</h2>
              <button type="button" onClick={handleAddDogButtonClick} className="inline-flex items-center gap-2 rounded-xl border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background"><Plus className="h-4 w-4" />Agregar perro</button>
            </div>
            {dogs.length > 0 ? (
              <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dogs.map((dog) => {
                  const recommendation = calculateDogFood(dog);
                  const dogOrderMessage = encodeURIComponent(
                    `Hola FEROX BARF, quiero pedir comida para ${dog.nombre}. Recomendación diaria: ${recommendation.gramosDia}g.`,
                  );
                  return (
                    <article key={dog.id} className="rounded-3xl border border-border bg-background p-4 shadow-sm">
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
      <Dialog open={isAddDogDialogOpen} onOpenChange={handleAddDogDialogOpenChange}>
        {(() => {
          logSubmitDiagnostic("modal:render:inside", {
            isSaving,
            isAddDogDialogOpen,
          });
          return null;
        })()}
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
            <button type="submit" onClick={handleAddDogSubmitButtonClick} disabled={addDogSubmitDisabled} className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-60">
              <Plus className="h-4 w-4" />
              {addDogSubmitLoadingState}
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
