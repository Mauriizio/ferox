import { supabase } from "@/lib/supabase/client";
import type { FoodCalculation } from "@/lib/supabase/database.types";

export type SaveFoodCalculationInput = {
  userId: string;
  dogId: string;
  gramosDiarios: number;
  gramosMensuales: number;
  peso: number | null;
  edad: number | null;
  etapaVida: string | null;
  actividad: string | null;
  estadoFisico: string | null;
};

type FoodCalculationRow = Partial<FoodCalculation> & {
  id: string;
  user_id: string;
  dog_id: string;
};

function normalizeFoodCalculation(row: FoodCalculationRow): FoodCalculation {
  return {
    id: row.id,
    created_at: row.created_at ?? null,
    user_id: row.user_id,
    dog_id: row.dog_id,
    gramos_diarios: row.gramos_diarios ?? 0,
    gramos_mensuales: row.gramos_mensuales ?? 0,
    peso: row.peso ?? null,
    edad: row.edad ?? null,
    etapa_vida: row.etapa_vida ?? null,
    actividad: row.actividad ?? null,
    estado_fisico: row.estado_fisico ?? null,
  };
}

export async function getFoodCalculationsByUser(
  userId: string,
): Promise<FoodCalculation[]> {
  const { data, error } = await supabase
    .from("food_calculations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as FoodCalculationRow[]).map(normalizeFoodCalculation);
}

export async function saveFoodCalculation({
  userId,
  dogId,
  gramosDiarios,
  gramosMensuales,
  peso,
  edad,
  etapaVida,
  actividad,
  estadoFisico,
}: SaveFoodCalculationInput): Promise<FoodCalculation> {
  const payload = {
    user_id: userId,
    dog_id: dogId,
    gramos_diarios: gramosDiarios,
    gramos_mensuales: gramosMensuales,
    peso,
    edad,
    etapa_vida: etapaVida,
    actividad,
    estado_fisico: estadoFisico,
  };

  console.info("[FEROX food_calculations] create payload", payload);

  const { data, error } = await supabase
    .from("food_calculations")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return normalizeFoodCalculation(data as FoodCalculationRow);
}
