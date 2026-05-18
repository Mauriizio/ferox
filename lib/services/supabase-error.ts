type SupabaseLikeError = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
  status?: number;
};

function isSupabaseLikeError(error: unknown): error is SupabaseLikeError {
  return typeof error === "object" && error !== null;
}

export function getSupabaseErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (isSupabaseLikeError(error)) {
    const parts = [error.message, error.details, error.hint, error.code]
      .filter(Boolean)
      .map(String);

    if (parts.length > 0) return parts.join(" · ");
  }

  return "Ocurrió un error inesperado.";
}

export function logSupabaseError(context: string, error: unknown) {
  console.error(`[FEROX Supabase] ${context}`, error);
}
