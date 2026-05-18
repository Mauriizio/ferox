import { supabase } from "@/lib/supabase/client";
import type { FoodCalculation } from "@/lib/supabase/database.types";

export type SaveFoodCalculationInput = {
  userId: string;
  dogId: string;
  gramosDiarios: number;
  gramosMensuales: number;
  peso: number | null;
  edad: string | null;
  actividad: string | null;
  estadoFisico: string | null;
};

const FOOD_CALCULATION_SELECT =
  "id, created_at, user_id, dog_id, gramos_diarios, gramos_mensuales, peso, edad, actividad, estado_fisico";

export async function getFoodCalculationsByUser(
  userId: string,
): Promise<FoodCalculation[]> {
  const { data, error } = await supabase
    .from("food_calculations")
    .select(FOOD_CALCULATION_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function saveFoodCalculation({
  userId,
  dogId,
  gramosDiarios,
  gramosMensuales,
  peso,
  edad,
  actividad,
  estadoFisico,
}: SaveFoodCalculationInput): Promise<FoodCalculation> {
  const { data, error } = await supabase
    .from("food_calculations")
    .insert({
      user_id: userId,
      dog_id: dogId,
      gramos_diarios: gramosDiarios,
      gramos_mensuales: gramosMensuales,
      peso,
      edad,
      actividad,
      estado_fisico: estadoFisico,
    })
    .select(FOOD_CALCULATION_SELECT)
    .single();

  if (error) throw error;
  return data;
}
