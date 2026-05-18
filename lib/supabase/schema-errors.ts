type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

const getErrorText = (error: unknown) => {
  if (!error || typeof error !== "object") return "";

  const supabaseError = error as SupabaseErrorLike;
  return [
    supabaseError.code,
    supabaseError.message,
    supabaseError.details,
    supabaseError.hint,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

export const isMissingSchemaError = (
  error: unknown,
  columns: string | string[],
) => {
  const errorText = getErrorText(error);
  const expectedColumns = Array.isArray(columns) ? columns : [columns];

  return (
    expectedColumns.some((column) => errorText.includes(column.toLowerCase())) &&
    (errorText.includes("42703") ||
      errorText.includes("pgrst204") ||
      errorText.includes("does not exist") ||
      errorText.includes("schema cache") ||
      errorText.includes("could not find"))
  );
};
