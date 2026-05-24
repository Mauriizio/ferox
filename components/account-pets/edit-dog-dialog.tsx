import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { Camera } from "lucide-react";
import { imageInputClassName } from "@/components/account-pets/constants";
import { DogFormFields } from "@/components/account-pets/dog-form-fields";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DogFormData } from "@/lib/services/dog-service";
import type { Dog } from "@/lib/supabase/database.types";

type Props = {
  dog: Dog | null;
  form: DogFormData;
  setForm: Dispatch<SetStateAction<DogFormData>>;
  photoPreview: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function EditDogDialog({ dog, form, setForm, photoPreview, isSaving, onClose, onSubmit, onPhotoChange }: Props) {
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
            <div className="h-32 overflow-hidden rounded-3xl bg-muted">
              {photoPreview ? <img src={photoPreview} alt="Vista previa del perro" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><Camera className="h-8 w-8" /></div>}
            </div>
            <label className="text-sm font-medium text-foreground">Foto del perro
              <input type="file" accept="image/*" onChange={onPhotoChange} className={imageInputClassName} />
            </label>
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
