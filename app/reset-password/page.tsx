"use client";

import { FormEvent, useState } from "react";
import { updatePassword } from "@/lib/services/auth-service";

type FeedbackState = {
  type: "idle" | "loading" | "success" | "error";
  text: string;
};

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: "idle",
    text: "",
  });

  const isCompleted = feedback.type === "success";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setFeedback({
        type: "error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }

    setIsSaving(true);
    setFeedback({ type: "loading", text: "Actualizando contraseña..." });

    try {
      await updatePassword(password);
      setFeedback({
        type: "success",
        text: "Contraseña actualizada correctamente.",
      });
      setPassword("");
      setConfirmPassword("");
    } catch {
      setFeedback({
        type: "error",
        text: "No se pudo actualizar la contraseña. Solicita un nuevo enlace e inténtalo de nuevo.",
      });
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" aria-disabled={isCompleted}>
          <fieldset disabled={isCompleted || isSaving} className="space-y-3 disabled:opacity-70">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Nueva contraseña</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Confirmar nueva contraseña</span>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repite la contraseña"
                className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              />
            </label>
          </fieldset>
          <button
            type="submit"
            disabled={isSaving || isCompleted}
            className="w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>

        {feedback.type !== "idle" ? (
          <p
            className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
              feedback.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-border bg-muted text-muted-foreground"
            }`}
            role="status"
            aria-live="polite"
          >
            {feedback.text}
          </p>
        ) : null}

        {isCompleted ? (
          <div className="mt-4 rounded-xl border border-border bg-muted/60 p-3">
            <p className="text-sm font-medium">Ya puedes continuar en tu cuenta.</p>
            <a href="/" className="mt-2 inline-flex text-sm font-semibold underline underline-offset-4">
              Volver al inicio
            </a>
          </div>
        ) : null}
      </section>
    </main>
  );
}
