import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Dog } from "@/lib/supabase/database.types";

type Props = {
  dog: Dog | null;
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteDogDialog({ dog, isSaving, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={Boolean(dog)} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Seguro que deseas eliminar este perro?</DialogTitle>
          <DialogDescription>
            {dog ? `Vas a eliminar a ${dog.nombre}. Esta acción no se puede deshacer.` : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button type="button" onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={isSaving} className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-60">Confirmar eliminación</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
