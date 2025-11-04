import { supabase } from '../supabase';
import type { UserRecipe, UserRecipeIngredient } from '../types';

export async function listMyRecipes(userId: string) {
  const { data, error } = await supabase
    .from('user_recipes')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as UserRecipe[];
}

export async function getMyRecipe(id: number) {
  const [r1, r2] = await Promise.all([
    supabase.from('user_recipes').select('*').eq('id', id).single(),
    supabase.from('user_recipe_ingredients')
      .select('*, ingredient:ingredients(id,name)')
      .eq('recipe_id', id)
      .order('id'),
  ]);
  if (r1.error) throw r1.error;
  if (r2.error) throw r2.error;
  return {
    ...(r1.data as UserRecipe),
    ingredients: r2.data as (UserRecipeIngredient & { ingredient: { id:number; name:string } })[],
  };
}

export async function createMyRecipe(payload: {
  title: string; description?: string; instructions?: string;
}) {
  const { data, error } = await supabase
    .from('user_recipes')
    .insert({ ...payload })
    .select('*')
    .single();
  if (error) throw error;
  return data as UserRecipe;
}

export async function updateMyRecipe(id: number, patch: Partial<{
  title: string; description: string|null; instructions: string|null;
}>) {
  const { data, error } = await supabase
    .from('user_recipes')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as UserRecipe;
}

export async function deleteMyRecipe(id: number) {
  const { error } = await supabase.from('user_recipes').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function addMyRecipeIngredient(recipeId: number, ingredientId: number, fields?: {
  quantity?: number|null; unit?: string|null; note?: string|null;
}) {
  const { data, error } = await supabase
    .from('user_recipe_ingredients')
    .insert({ recipe_id: recipeId, ingredient_id: ingredientId, ...fields })
    .select('*')
    .single();
  if (error) throw error;
  return data as UserRecipeIngredient;
}

export async function deleteMyRecipeIngredient(id: number) {
  const { error } = await supabase.from('user_recipe_ingredients').delete().eq('id', id);
  if (error) throw error;
  return true;
}
