import { supabase } from "../supabase";
import type { Id, PantryItemRow } from "../types";

/** Raw shape from PostgREST: nested relation may be array or object */
type RawRow = {
  id: unknown;
  ingredient_id: unknown;
  created_at: unknown;
  ingredient?: { name: unknown } | { name: unknown }[] | null;
};

function normalizeRow(r: RawRow): PantryItemRow {
  const nested = Array.isArray(r.ingredient) ? r.ingredient[0] ?? null : r.ingredient ?? null;
  return {
    id: String(r.id),
    ingredient_id: String(r.ingredient_id),
    created_at: typeof r.created_at === "string" ? r.created_at : null,
    ingredient:
      nested && typeof nested === "object" && "name" in nested
        ? { name: String((nested as any).name) }
        : null,
  };
}

/** READ: owner-only pantry items (RLS) + joined ingredient name */
export async function listPantryItems(): Promise<PantryItemRow[]> {
  const { data, error } = await supabase
    .from("pantry_items")
    // If your FK name is known: ingredients!pantry_items_ingredient_id_fkey(name)
    .select("id, ingredient_id, created_at, ingredient:ingredients(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeRow);
}

/** CREATE: insert a new pantry item for current user (RLS should attach user_id default) */
export async function addPantryItem(ingredient_id: Id): Promise<PantryItemRow> {
  const { data, error } = await supabase
    .from("pantry_items")
    .insert([{ ingredient_id }])
    .select("id, ingredient_id, created_at, ingredient:ingredients(name)")
    .single();

  if (error) throw error;
  return normalizeRow((data ?? {}) as RawRow);
}

/** UPDATE: change ingredient on an existing pantry item (swap ingredient_id) */
export async function updatePantryItem(id: Id, nextIngredientId: Id): Promise<PantryItemRow> {
  const { data, error } = await supabase
    .from("pantry_items")
    .update({ ingredient_id: nextIngredientId })
    .eq("id", id)
    .select("id, ingredient_id, created_at, ingredient:ingredients(name)")
    .single();

  if (error) throw error;
  return normalizeRow((data ?? {}) as RawRow);
}

/** DELETE: remove pantry item */
export async function deletePantryItem(id: Id): Promise<{ id: string }> {
  const { error } = await supabase.from("pantry_items").delete().eq("id", id);
  if (error) throw error;
  return { id: String(id) };
}
