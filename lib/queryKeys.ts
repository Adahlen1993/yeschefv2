export const qk = {
  availableGlobal: ['available-global-recipes'] as const,
  globalRecipe: (id: number) => ['global-recipe', id] as const,

  myRecipes: ['my-recipes'] as const,
  myRecipe: (id: number) => ['my-recipe', id] as const,
  myRecipeIngredients: (recipeId: number) => ['my-recipe-ingredients', recipeId] as const,
};
