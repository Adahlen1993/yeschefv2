import { supabase } from '../supabase';
import type { GlobalRecipe, GlobalRecipeIngredient } from '../types';

export async function listAvailableGlobalRecipes() {
  const { data, error } = await supabase.rpc('available_global_recipes_for_me');
  if (error) throw error;
  return data as GlobalRecipe[];
}

export async function getGlobalRecipe(id: number) {
  const [r1, r2] = await Promise.all([
    supabase.from('global_recipes').select('*').eq('id', id).single(),
    supabase.from('global_recipe_ingredients')
      .select('*, ingredient:ingredients(id,name)')
      .eq('recipe_id', id)
      .order('id'),
  ]);
  if (r1.error) throw r1.error;
  if (r2.error) throw r2.error;
  return {
    ...(r1.data as GlobalRecipe),
    ingredients: r2.data as (GlobalRecipeIngredient & { ingredient: { id:number; name:string } })[],
  };
}

export async function getGlobalMatchStatus(recipeId: number) {
  const { data, error } = await supabase.rpc('global_recipe_match_status', { in_recipe_id: recipeId });
  if (error) throw error;
  return data as { ingredient_id: number; in_pantry: boolean }[];
}
