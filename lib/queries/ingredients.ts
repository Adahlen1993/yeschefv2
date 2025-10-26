import { supabase } from "../supabase";
import type { Ingredient } from "../types";

export async function searchIngredients(q: string, limit = 20): Promise<Ingredient[]> {
  const query = supabase
    .from("ingredients")
    .select("id, name")
    .ilike("name", `%${q}%`)
    .order("name", { ascending: true })
    .limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
