import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { Camera } from "lucide-react";
import { DogFormFields } from "@/components/account-pets/dog-form-fields";
import { PhotoDisplayControls, type DogPhotoDisplaySettings } from "@/components/account-pets/photo-display-controls";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DogFormData } from "@/lib/services/dog-service";
import type { Dog } from "@/lib/supabase/database.types";

type Props = {
  dog: Dog | null;
  form: DogFormData;
  setForm: Dispatch<SetStateAction<DogFormData>>;
  photoPreview: string;
  photoDisplay: DogPhotoDisplaySettings;
  onPhotoDisplayChange: (value: DogPhotoDisplaySettings) => void;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function EditDogDialog({ dog, form, setForm, photoPreview, photoDisplay, onPhotoDisplayChange, isSaving, onClose, onSubmit, onPhotoChange }: Props) {
  return (
    <Dialog open={Boolean(dog)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar perro</DialogTitle>
          <DialogDescription>Actualiza los datos del perro y su recomendación se recalcula automáticamente.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <DogFormFields form={form} setForm={setForm} />
          <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-center">
            <label htmlFor="edit-dog-photo-file" className="group relative h-32 cursor-pointer overflow-hidden rounded-3xl bg-muted transition hover:ring-4 hover:ring-foreground/10" aria-label="Seleccionar foto del perro">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Vista previa del perro"
                  className="h-full w-full"
                  style={{
                    objectFit: photoDisplay.fit,
                    objectPosition: photoDisplay.position === "top" ? "center top" : "center center",
                    transform: `scale(${photoDisplay.zoom / 100})`,
                    transformOrigin: photoDisplay.position === "top" ? "center top" : "center center",
                  }}
                />
              ) : <div className="flex h-full items-center justify-center text-muted-foreground"><Camera className="h-8 w-8" /></div>}
              <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                <Camera className="h-6 w-6" />
              </span>
            </label>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Foto del perro</p>
              <input id="edit-dog-photo-file" type="file" accept="image/*" onChange={onPhotoChange} className="sr-only" />
              <label htmlFor="edit-dog-photo-file" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted">
                <Camera className="h-4 w-4" />
                Seleccionar foto
              </label>
              {photoPreview ? <PhotoDisplayControls value={photoDisplay} onChange={onPhotoDisplayChange} /> : null}
            </div>
          </div>
          <DialogFooter>
            <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Cancelar</button>
            <button type="submit" disabled={isSaving} className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-60">{isSaving ? "Guardando..." : "Guardar cambios"}</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
