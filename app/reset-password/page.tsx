"use client";

import { FormEvent, useState } from "react";
import { updatePassword } from "@/lib/services/auth-service";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsSaving(true);
    setMessage("Actualizando contraseña...");

    try {
      await updatePassword(password);
      setMessage("Contraseña actualizada correctamente.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("No se pudo actualizar la contraseña. Solicita un nuevo enlace e inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-24">
      <section className="w-full rounded-2xl border border-border bg-background p-5 shadow-sm">
        <h1 className="text-xl font-semibold">Restablecer contraseña</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ingresa tu nueva contraseña para finalizar la recuperación.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nueva contraseña"
            className="w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirmar nueva contraseña"
            className="w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
          >
            {isSaving ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>

        {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
      </section>
    </main>
  );
}
