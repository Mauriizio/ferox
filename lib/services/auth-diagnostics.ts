import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

export const getAuthDiagnosticTime = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

export const getAuthDurationMs = (startedAt: number) =>
  Math.round((getAuthDiagnosticTime() - startedAt) * 100) / 100;

export function getAuthSessionDiagnostic(session: Session | null | undefined) {
  return {
    sessionUserId: session?.user?.id ?? null,
    userId: session?.user?.id ?? null,
    hasAccessToken: Boolean(session?.access_token),
    hasRefreshToken: Boolean(session?.refresh_token),
  };
}

export function getAuthUserDiagnostic(user: User | null | undefined) {
  return {
    userId: user?.id ?? null,
  };
}

export function getAuthErrorDiagnostic(error: unknown) {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
    };
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      message?: unknown;
      code?: unknown;
      status?: unknown;
    };

    return {
      errorMessage:
        typeof maybeError.message === "string" ? maybeError.message : null,
      errorCode: typeof maybeError.code === "string" ? maybeError.code : null,
      errorStatus:
        typeof maybeError.status === "number" ? maybeError.status : null,
    };
  }

  return {
    errorMessage: String(error),
  };
}

export function logAuthDiagnostic(
  event: string,
  details: Record<string, unknown> = {},
) {
  console.info("[FEROX auth diagnóstico]", {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

export function logAuthStateChangeDiagnostic(
  event: AuthChangeEvent,
  session: Session | null,
  details: Record<string, unknown> = {},
) {
  logAuthDiagnostic("supabase.auth.onAuthStateChange:event", {
    authEvent: event,
    ...getAuthSessionDiagnostic(session),
    ...details,
  });
}
